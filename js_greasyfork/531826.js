// ==UserScript==
// @name         Rehike for YouTube (Userscript)
// @namespace    https://greasyfork.org/en/users/your-username
// @version      1.1
// @description  Modify YouTube's UI to look like older versions, similar to Rehike
// @author       Your Name
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531826/Rehike%20for%20YouTube%20%28Userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531826/Rehike%20for%20YouTube%20%28Userscript%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Rehike Userscript] Loaded.");

    // Apply UI modifications
    function modifyYouTubeUI() {
        GM_addStyle(`
            #masthead-container { background-color: #222 !important; }
            ytd-searchbox { background-color: #333 !important; }
            ytd-app { background-color: #181818 !important; }
            /* Hide Shorts Section */
            ytd-rich-section-renderer { display: none !important; }
        `);
    }

    // Intercept API Calls via Fetch API
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = async function(resource, init) {
            let response = await originalFetch(resource, init);

            if (typeof resource === "string" && resource.includes("browse")) {
                try {
                    let clone = response.clone();
                    let json = await clone.json();

                    // Remove Shorts from Homepage
                    if (json.contents?.twoColumnBrowseResultsRenderer) {
                        json.contents.twoColumnBrowseResultsRenderer.tabs =
                            json.contents.twoColumnBrowseResultsRenderer.tabs.filter(tab =>
                                !tab?.tabRenderer?.content?.sectionListRenderer?.contents?.some(
                                    sec => sec?.richSectionRenderer?.content?.shelfRenderer?.title?.simpleText === "Shorts"
                                )
                            );
                    }

                    let modifiedResponse = new Response(JSON.stringify(json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });

                    return modifiedResponse;
                } catch (e) {
                    console.error("[Rehike Userscript] Fetch Intercept Error:", e);
                }
            }

            return response;
        };
    }

    // Run modifications
    function init() {
        modifyYouTubeUI();
        interceptFetch();
    }

    // Ensure script runs after YouTube loads
    let observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector("ytd-app")) {
            obs.disconnect();
            init();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();