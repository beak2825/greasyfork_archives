// ==UserScript==
// @name         AntiFandom: Alternative Wiki Redirector
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Finds alternative wikis to use instead of fandom, gives you the choice if several are found and brings you to a cleaner version of the fandom page if none are found.
// @author       Emily
// @match        https://*.fandom.com/wiki*
// @icon         https://www.google.com/s2/favicons?domain=fandom.com
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// @license      CC0-1.0 license
// @downloadURL https://update.greasyfork.org/scripts/531161/AntiFandom%3A%20Alternative%20Wiki%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/531161/AntiFandom%3A%20Alternative%20Wiki%20Redirector.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // -------------------------------
    // STEP 0 – Manual Alternative Overrides Config
    // -------------------------------
    // Here we define manual overrides for specific wikis
    // For Lord of the rings the manual alternative will always go to tolkiengateway.net
    const manualOverrides = {
        "lotr": {
            alternatives: [
                {
                    name: "TolkienGateway",
                    base: "https://tolkiengateway.net",
                    pathPrefix: "/wiki/",
                    // For exact pages return the page name; for categories which don't have easily reformattable addresses we redirect to the homepage, it's not perfect but better than nothing.
                    transform: function(page) {
                        return page.startsWith("Category:") ? null : page;
                    },
                    homepage: "https://tolkiengateway.net/wiki/Main_Page"
                }
            ]
        },
        // For hearthstone-archive we force redirection back to hearthstone.wiki.gg as we do for the regular hearthstone fandom wiki
        "hearthstone-archive": {
            alternatives: [
                {
                    name: "Hearthstone.wiki.gg",
                    base: "https://hearthstone.wiki.gg",
                    pathPrefix: "/wiki/",
                    transform: function(page) {
                        return page; // Always use the exact page.
                    },
                    homepage: "https://hearthstone.wiki.gg/"
                }
            ]
        }
    };

    // -------------------------------
    // STEP 1 – Extract GameName and Page Information
    // -------------------------------
    const currentURL = window.location.href;
    if (!currentURL.includes("fandom.com")) return; // Ensure we're on a Fandom page.

    // GameName is extracted from the subdomain (e.g. "hearthstone" from "hearthstone.fandom.com")
    const hostnameParts = window.location.hostname.split(".");
    const gameName = hostnameParts[0];

    // Extract the page portion (everything after "/wiki/")
    const wikiPrefix = "/wiki/";
    let rawPage = "";
    if (window.location.pathname.indexOf(wikiPrefix) === 0) {
        rawPage = window.location.pathname.substring(wikiPrefix.length);
    } else {
        console.error("URL format not recognized. Expected '/wiki/' in the path.");
        return;
    }

    // -------------------------------
    // STEP 2 – Define Default Alternative Wiki Formats
    // -------------------------------
    const alternatives = [
        {
            name: "Wiki.gg",
            base: `https://${gameName}.wiki.gg`,
            pathPrefix: "/wiki/",
            transform: (page) => page  // No transformation needed.
        },
        {
            name: ".wiki",
            base: `https://${gameName}.wiki`,
            pathPrefix: "/w/",
            transform: (page) => page  // No transformation needed.
        },
        {
            name: "Wiki.com",
            base: `https://wiki.${gameName}.com`,
            pathPrefix: "/en-us/",
            transform: (page) => page  // No transformation needed.
        },
        {
            name: "Fextralife.com",
            base: `https://${gameName}.wiki.fextralife.com`,
            pathPrefix: "/",
            transform: (page) => {
                if (page.startsWith("Category:")) {
                    const catContent = page.substring("Category:".length);
                    const index = catContent.indexOf("_");
                    return index !== -1 ? catContent.substring(0, index).trim() : catContent.trim();
                } else {
                    // For normal pages, replace underscores with plus signs. It's a fextralife specific thing for how they handle spaces.
                    return page.replace(/_/g, "+");
                }
            }
        }
    ];

    // -------------------------------
    // STEP 3 – Check URL Availability
    // -------------------------------
    /**
     * Uses GM_xmlhttpRequest to send a HEAD request.
     * Ensures resolution (true if status is 200–399) within 1500ms by using:
     *   - A manual timer
     *   - An explicit ontimeout callback (there's some fandom wikis with no match that otherwise get stuck)
     *
     * @param {string} url - The URL to check.
     * @returns {Promise<boolean>} - Resolves true if the page exists.
     */
    function checkPageExists(url) {
        return new Promise((resolve) => {
            let resolved = false;
            const TIMEOUT_MS = 1500;
            const timer = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    console.warn("Manual timeout reached for: " + url);
                    resolve(false);
                }
            }, TIMEOUT_MS);

            GM_xmlhttpRequest({
                method: "HEAD",
                url: url,
                timeout: TIMEOUT_MS,
                ontimeout: () => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timer);
                        console.warn("GM_xmlhttpRequest timeout for: " + url);
                        resolve(false);
                    }
                },
                onload: (response) => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timer);
                        resolve(response.status >= 200 && response.status < 400);
                    }
                },
                onerror: () => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timer);
                        resolve(false);
                    }
                }
            });
        });
    }

    // -------------------------------
    // STEP 4 – Check a Default Alternative Object
    // -------------------------------
    /**
     * For a given alternative (from the default list), check concurrently:
     *   - The full page: alt.base + alt.pathPrefix + alt.transform(rawPage)
     *   - The homepage: alt.base + "/"
     *
     * Returns an object { index, type, url, name }.
     */
    async function checkAlternative(alt, index) {
        const transformedPage = alt.transform(rawPage);
        const fullUrl = alt.base + alt.pathPrefix + transformedPage;
        const domainUrl = alt.base + "/";

        // Execute both check requests in parallel.
        const [pageExists, domainExists] = await Promise.all([
            checkPageExists(fullUrl),
            checkPageExists(domainUrl)
        ]);

        if (pageExists) {
            return { index, type: "page", url: fullUrl, name: alt.name };
        } else if (domainExists) {
            return { index, type: "domain", url: domainUrl, name: alt.name };
        } else {
            return { index, type: "none", url: null, name: alt.name };
        }
    }

    // -------------------------------
    // STEP 5 – Attempt Redirection Combining Default and Manual Overrides.
    // -------------------------------
    async function attemptRedirect() {
        // Check default alternatives concurrently, but use Promise.allSettled so that unfulfilled promises don't block us.
        const autoPromises = alternatives.map((alt, i) => checkAlternative(alt, i));
        const autoResultsSettled = await Promise.allSettled(autoPromises);
        let autoResults = autoResultsSettled
            .filter(r => r.status === "fulfilled")
            .map(r => r.value)
            .filter(r => r.type !== "none");

        // Check manual overrides if present for this wiki.
        let manualResults = [];
        if (manualOverrides.hasOwnProperty(gameName)) {
            const manualAlts = manualOverrides[gameName].alternatives;
            for (const m of manualAlts) {
                const transformed = m.transform(rawPage);
                // If transformed use the homepage.
                const url = transformed ? m.base + m.pathPrefix + transformed : m.homepage;
                if (await checkPageExists(url)) {
                    // Use a high index to let default (auto) alternatives take precedence if available.
                    manualResults.push({ index: 1000, type: "manual", url: url, name: m.name });
                }
            }
        }
        // Combine default and manual results.
        const combined = autoResults.concat(manualResults);

        if (combined.length > 1) {
            // More than one alternative was found: offer a choice overlay.
            displayChoiceOverlay(combined);
        } else if (combined.length === 1) {
            // Exactly one alternative: redirect automatically.
            const chosen = combined[0];
            console.log(`[${chosen.name}] Selected (${chosen.type}) – redirecting to: ${chosen.url}`);
            window.stop();
            window.location.replace(chosen.url);
        } else {
            // If no alternative is found, fall back to AntiFandom.
            console.error("No alternative wiki found; redirecting to AntiFandom.");
            showOverlayMessage("No alternative wiki found, proceeding with AntiFandom...");

            const antifandomUrl = `https://antifandom.com/${gameName}/wiki/${rawPage}`;

            // Redirect to AntiFandom after a short delay.
            setTimeout(() => {
                window.location.replace(antifandomUrl);
            }, 2000);
        }
    }

    // -------------------------------
    // STEP 5.1 – Display Choice Overlay (for Multiple Alternatives)
    // -------------------------------
    function displayChoiceOverlay(choices) {
        // Create an overlay with clickable buttons for each available alternative.
        let overlay = document.getElementById("redirectOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "redirectOverlay";
            overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; font-size: 24px; z-index: 9999;";
            document.body.appendChild(overlay);
        }
        let content = `<div style="font-size: 64px; margin-bottom: 20px;">🔎</div>`;
        content += `<div>Multiple alternative wikis found.<br>Please choose one:</div>`;
        content += `<div style="margin-top: 20px;">`;
        choices.forEach(choice => {
            // When clicked, the button immediately redirects.
            content += `<button style="margin: 10px; padding: 10px 15px; font-size: 18px; cursor: pointer;" data-url="${choice.url}">${choice.name}</button>`;
        });
        content += `</div>`;
        overlay.innerHTML = content;

        // Add event listeners to buttons after they are added to the DOM.
        overlay.querySelectorAll("button[data-url]").forEach(button => {
            button.addEventListener("click", () => {
                const url = button.getAttribute("data-url");
                window.location.replace(url);
            });
        });
    }
    window.displayChoiceOverlay = displayChoiceOverlay;

    // -------------------------------
    // STEP 6 – Overlay: Create a Message Overlay
    // -------------------------------
    /**
     * Creates (or updates) a floating overlay that covers the page with the given text
     * and displays a large magnifying glass emoji (🔎).
     *
     * @param {string} message - The message to display.
     */
    function showOverlayMessage(message) {
        const createOverlay = () => {
            let overlay = document.getElementById("redirectOverlay");
            const unicodeMagnifyingGlass = `<div style="font-size: 64px; margin-bottom: 20px;">🔎</div>`;
            const content = unicodeMagnifyingGlass + `<div>${message}</div>`;

            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "redirectOverlay";
                overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; font-size: 24px; z-index: 9999;";
                overlay.innerHTML = content;
                document.body.appendChild(overlay);
            } else {
                overlay.innerHTML = content;
            }
        };

        if (document.body) {
            createOverlay();
        } else {
            // Wait for the DOM to be ready if document.body is not available.
            const observer = new MutationObserver(() => {
                if (document.body) {
                    observer.disconnect();
                    createOverlay();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
    }

    // -------------------------------
    // STEP 7 – Start the Process.
    // -------------------------------
    attemptRedirect().catch((err) => {
        console.error("Error in attemptRedirect:", err);
        showOverlayMessage("An error occurred. Please try again later.");
    });

    if (document.body) {
        // If the body is already available, show the overlay immediately.
        showOverlayMessage("Searching for an alternative wiki…");
    } else {
        // If the body is not yet available, observe for its creation.
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect(); // Stop observing once the body is available.
                showOverlayMessage("Searching for an alternative wiki…");
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();
