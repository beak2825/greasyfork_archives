// ==UserScript==
// @name         Trumf Bonusvarsler Lite
// @description  Trumf Bonusvarsler Lite er et minimalistisk userscript (Firefox, Safari, Chrome) som gir deg varslel når du er inne på en nettbutikk som gir Trumf-bonus.
// @namespace    https://github.com/NewsGuyTor/Trumf-Bonusvarsler-Lite
// @version      1.2.1
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @connect      wlp.tcb-cdn.com
// @connect      raw.githubusercontent.com
// @homepageURL  https://github.com/NewsGuyTor/Trumf-Bonusvarsler-Lite
// @supportURL   https://github.com/NewsGuyTor/Trumf-Bonusvarsler-Lite/issues
// @icon         https://github.com/NewsGuyTor/Trumf-Bonusvarsler-Lite/raw/main/icon.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522261/Trumf%20Bonusvarsler%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/522261/Trumf%20Bonusvarsler%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------------------
    // Configuration
    // ---------------------------
    const FEED_URL           = `https://wlp.tcb-cdn.com/trumf/notifierfeed.json?v=${Date.now()}`;
    const FEED_FALLBACK_URL  = "https://raw.githubusercontent.com/NewsGuyTor/Trumf-Bonusvarsler-Lite/main/sitelist.json";
    const LOCAL_KEY_DATA     = "TrumpBonusvarslerLiteFeedData";
    const LOCAL_KEY_TIME     = "TrumpBonusvarslerLiteFeedTimestamp";
    const CACHE_DURATION     = 1000 * 60 * 60 * 6; // 6 hours
    const WIDTH_THRESHOLD    = 700;               // px
    const MESSAGE_DURATION   = 1000 * 60 * 10;    // 10 minutes

    const currentHost        = window.location.hostname;
    const sessionClosedKey   = `TRUMPBONUSVARSLERLITE_CLOSED_${currentHost}`;
    const messageShownKey    = `TRUMPBONUSVARSLERLITE_MESSAGE_SHOWN_${currentHost}`;

    // ---------------------------
    // Early Exit Conditions
    // ---------------------------
    if (sessionStorage.getItem(sessionClosedKey) === "true") return;

    const messageShownTimestamp = localStorage.getItem(messageShownKey);
    if (messageShownTimestamp && (Date.now() - parseInt(messageShownTimestamp, 10)) < MESSAGE_DURATION) {
        return;
    }

    // ---------------------------
    // Main Entry: Fetch the Feed
    // ---------------------------
    function fetchFeed(attemptsLeft = 5) {
        let feedData = null;
        const storedTime = localStorage.getItem(LOCAL_KEY_TIME);

        // Use cached data if it’s fresh
        if (storedTime && (Date.now() - parseInt(storedTime, 10)) < CACHE_DURATION) {
            const rawData = localStorage.getItem(LOCAL_KEY_DATA);
            if (rawData) {
                try {
                    feedData = JSON.parse(rawData);
                } catch(e) {
                    console.error("Failed to parse cached JSON data:", e);
                }
            }
        }

        if (feedData) {
            processFeed(feedData);
        } else {
            GM.xmlHttpRequest({
                method: "GET",
                url: FEED_URL,
                headers: { "Accept": "application/json", "Cache-Control": "no-cache" },
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const json = JSON.parse(response.responseText);
                            localStorage.setItem(LOCAL_KEY_DATA, response.responseText);
                            localStorage.setItem(LOCAL_KEY_TIME, Date.now().toString());
                            processFeed(json);
                        } catch(e) {
                            console.error("Failed to parse fetched JSON data:", e);
                            retryOrFallback(attemptsLeft);
                        }
                    } else {
                        console.error(`Failed to fetch JSON data. Status: ${response.status}`);
                        retryOrFallback(attemptsLeft);
                    }
                },
                onerror: (error) => {
                    console.error("Error fetching JSON data:", error);
                    retryOrFallback(attemptsLeft);
                }
            });
        }
    }

    function retryOrFallback(attemptsLeft) {
        if (attemptsLeft > 1) {
            console.warn(`Retrying primary feed... Attempts left: ${attemptsLeft - 1}`);
            fetchFeed(attemptsLeft - 1);
        } else {
            console.warn("Primary feed failed after 5 tries. Using backup...");
            fetchBackupFeed();
        }
    }

    function fetchBackupFeed() {
        GM.xmlHttpRequest({
            method: "GET",
            url: FEED_FALLBACK_URL,
            headers: { "Accept": "application/json", "Cache-Control": "no-cache" },
            onload: (response) => {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const json = JSON.parse(response.responseText);
                        localStorage.setItem(LOCAL_KEY_DATA, response.responseText);
                        processFeed(json);
                    } catch(e) {
                        console.error("Failed to parse backup JSON data:", e);
                    }
                } else {
                    console.error(`Failed to fetch backup JSON data. Status: ${response.status}`);
                }
            },
            onerror: (error) => {
                console.error("Error fetching backup JSON data:", error);
            }
        });
    }

    // ---------------------------
    // Match the host, ignoring "www."
    // ---------------------------
    function processFeed(json) {
        if (!json || !json.merchants) return;

        // 1) Exact match
        let merchant = json.merchants[currentHost];

        // 2) Try removing "www." if not found
        if (!merchant) {
            const noWww = currentHost.replace(/^www\./, '');
            merchant = json.merchants[noWww];
        }

        // 3) If still not found, try adding "www." if original didn’t have it
        if (!merchant && !/^www\./.test(currentHost)) {
            merchant = json.merchants["www." + currentHost];
        }

        if (merchant) {
            injectShadowNotifier(merchant);
        }
    }

    // ---------------------------
    // Adblock references
    // ---------------------------
    let adblockButtonRef = null; // store reference for the original button
    let shadowRootRef = null;    // might help if we need the parent of button

    // ---------------------------
    // Shadow DOM Notifier
    // ---------------------------
    function injectShadowNotifier(merchant) {
        const shadowHost = document.createElement('div');
        document.body.appendChild(shadowHost);
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        shadowRootRef = shadowRoot;

        const styles = `
/* Reset + Bolder Design + link cursor */
:host, :host * {
    all: unset;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
:host {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #333;
}
:host a {
    cursor: pointer; /* link cursor on anchors */
}

/* Container for the entire notification */
.notification-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    width: 360px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    overflow: hidden;
    animation: slideIn 0.5s ease-out;
    transition: width 0.3s ease;
}
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Wrapper for the notifier content */
.notification-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #fff;
}

/* Header section */
.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f3f3f3;
    border-bottom: 1px solid #ececec;
}
.notification-logo img {
    max-height: 28px;
}
.notification-close-button img {
    width: 22px;
    height: 22px;
    cursor: pointer;
    transition: transform 0.2s;
}
.notification-close-button img:hover {
    transform: scale(1.15);
}

/* Body section */
.notification-body {
    padding: 16px;
    background-color: #ffffff;
}

/* Text content */
.notification-text {
    margin-bottom: 16px;
}
.notification-subtitle {
    display: block;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
}
.notification-cashback {
    font-weight: 700;
    font-size: 20px;
    color: #4D4DFF;
    display: block;
    margin-bottom: 6px;
}

/* "Husk å" + list */
.husk-line {
    margin: 0 0 6px 0;
    font-weight: 500;
}
.notification-list {
    list-style-type: decimal;
    margin: 8px 0 0 20px;
    padding: 0;
    font-size: 13px;
    display: block;
}
.notification-list li {
    margin: 6px 0;
    display: list-item;
}

/* Action button */
.notification-button {
    display: block;
    margin: 16px auto 0 auto;
    padding: 12px 24px;
    background: #4D4DFF;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    text-align: center;
    transition: background 0.3s;
    cursor: pointer;
}
.notification-button:hover {
    background: #3232ff;
}

/* Info button styling */
.notification-info-button {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    font-size: 9px;
    font-weight: bold;
    font-family: sans-serif;
    color: #333;
    background-color: #ccc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    opacity: 0.2;
    transition: opacity 0.2s, background-color 0.2s;
    cursor: pointer;
}
.notification-info-button:hover {
    opacity: 0.45;
    background-color: #bbb;
}

/* Hide the list on narrow screens */
@media (max-width: 700px) {
    .notification-list {
        display: none;
    }
}

/* Adblock-detected styles: blood-red color & "annoying" animation */
.adblock-detected {
    background: #ff0000 !important;
    animation: adblockPulse 0.7s infinite alternate ease-in-out;
}

@keyframes adblockPulse {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(1.05);
    }
}
`;

        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        shadowRoot.appendChild(styleEl);

        const container = document.createElement('div');
        container.classList.add('notification-container');
        container.innerHTML = `
          <div class="notification-wrapper">
              <div class="notification-header">
                  <div class="notification-logo">
                      <img src="https://trumfnetthandel.no/dest/img/Trumf/notifier/nett-handel-wrapper-logo.svg" alt="Trumf Nettbutikk Logo">
                  </div>
                  <div class="notification-close-button">
                      <img src="https://trumfnetthandel.no/dest/img/Trumf/notifier/close-button-wrapper.png" alt="Close">
                  </div>
              </div>
              <div class="notification-body">
                  <div class="notification-content">
                      <div class="notification-text">
                          <span class="notification-cashback">${merchant.cashbackDescription}</span>
                          <span class="notification-subtitle">Trumf-bonus hos ${merchant.name}</span>
                          <p class="husk-line">Husk å:</p>
                          <ol class="notification-list">
                              <li>Deaktivere uBlock Origin</li>
                              <li>Deaktivere AdGuard Home/Pi-Hole</li>
                              <li>Tømme handlevognen</li>
                          </ol>
                      </div>
                      <a class="notification-button"
                         href="https://trumfnetthandel.no/cashback/${merchant.urlName}"
                         target="_blank" rel="noopener noreferrer">
                         Få Trumf-bonus
                      </a>
                  </div>
              </div>
          </div>
        `;
        shadowRoot.appendChild(container);

        // Info button
        const infoButton = document.createElement('a');
        infoButton.href = "https://github.com/NewsGuyTor/Trumf-Bonusvarsler-Lite";
        infoButton.target = "_blank";
        infoButton.rel = "noopener noreferrer";
        infoButton.textContent = "i";
        infoButton.classList.add("notification-info-button");
        container.querySelector(".notification-wrapper").appendChild(infoButton);

        // Close button
        const closeBtn = container.querySelector(".notification-close-button img");
        closeBtn?.addEventListener("click", () => {
            sessionStorage.setItem(sessionClosedKey, "true");
            document.body.removeChild(shadowHost);
        });

        // Action button
        const button = container.querySelector(".notification-button");
        adblockButtonRef = button; // store reference for adblock changes
        button?.addEventListener("click", () => {
            const bodyContent = container.querySelector(".notification-content");
            if (bodyContent) {
                bodyContent.innerHTML = `
                  <div class="notification-text">
                      Hvis alt ble gjort riktig, skal kjøpet ha blitt registrert.
                  </div>
                `;
            }
            localStorage.setItem(messageShownKey, Date.now().toString());
        });

        // Button text adapt on small screens
        const basicRate = merchant.basicRate;
        function adjustNotifierUI() {
            const windowWidth = window.innerWidth;
            if (!button) return;

            if (windowWidth <= WIDTH_THRESHOLD) {
                if (!button.dataset.originalText) {
                    button.dataset.originalText = button.textContent.trim();
                    button.textContent = `Få ${basicRate} Trumf-bonus`;
                }
            } else {
                if (button.dataset.originalText) {
                    button.textContent = button.dataset.originalText;
                    delete button.dataset.originalText;
                }
            }
        }
        adjustNotifierUI();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(adjustNotifierUI, 150);
        });

        // Finally, check Adblock & transform button if detected
        runAdblockDetection();
    }

    // ---------------------------
    // Adblock detection code
    // ---------------------------
    const outbrainErrorCheck = async () => {
        try {
            const resp = await fetch("https://widgets.outbrain.com/outbrain.js");
            await resp.text();
            return false;
        } catch (e) {
            return true;
        }
    };

    const adligatureErrorCheck = async () => {
        try {
            const resp = await fetch("https://adligature.com/", { mode: "no-cors" });
            await resp.text();
            return false;
        } catch (e) {
            return true;
        }
    };

    const quantserveErrorCheck = async () => {
        try {
            const resp = await fetch("https://secure.quantserve.com/quant.js", { mode: "no-cors" });
            await resp.text();
            return false;
        } catch (e) {
            return true;
        }
    };

    const adligatureCssErrorCheck = async () => {
        try {
            const resp = await fetch("https://cdn.adligature.com/work.ink/prod/rules.css", { mode: "no-cors" });
            await resp.text();
            return false;
        } catch (e) {
            return true;
        }
    };

    const srvtrackErrorCheck = async () => {
        try {
            const resp = await fetch("https://srvtrck.com/assets/css/LineIcons.css", { mode: "no-cors" });
            await resp.text();
            return false;
        } catch (e) {
            return true;
        }
    };

    const yieldkitCheck = async () => {
        try {
            const resp = await fetch("https://js.srvtrck.com/v1/js?api_key=40710abb89ad9e06874a667b2bc7dee7&site_id=1f10f78243674fcdba586e526cb8ef08", { mode: "no-cors" });
            await resp.text();
            return false;
        } catch (e) {
            return true;
        }
    };

    const setIntervalCheck = () => {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(true);
            }, 2000);

            const interval = setInterval(() => {
                const a0b = "a0b";
                if (a0b === "a0b") {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    resolve(false);
                }
            }, 100);
        });
    };

    // Hidden banners check
    const idCheck = async () => {
        const bannerIds = ["AdHeader", "AdContainer", "AD_Top", "homead", "ad-lead"];
        const bannerString = bannerIds.map((bannerId) => `<div id="${bannerId}">&nbsp;</div>`).join('');
        const dataContainer = document.createElement("div");
        dataContainer.innerHTML = bannerString;
        document.body.append(dataContainer);

        let adblocker = false;
        bannerIds.forEach(id => {
            const elem = document.getElementById(id);
            if (!elem || elem.offsetHeight === 0) {
                adblocker = true;
            }
            elem?.remove();
        });
        return adblocker;
    };

    const detectedAdblock = async () => {
        const resp = await Promise.all([
            outbrainErrorCheck(),
            adligatureErrorCheck(),
            quantserveErrorCheck(),
            adligatureCssErrorCheck(),
            srvtrackErrorCheck(),
            setIntervalCheck(),
            yieldkitCheck()
        ]);
        const isNotUsingAdblocker = resp.every(r => r === false);
        const bannerBlocked = await idCheck(); // additional check

        return !isNotUsingAdblocker || bannerBlocked;
    };

    async function runAdblockDetection() {
        const isAdblock = await detectedAdblock();
        if (isAdblock && adblockButtonRef) {
            // Create a fresh button to replace original (removing old click handler)
            const newButton = adblockButtonRef.cloneNode(true);
            adblockButtonRef.parentNode.replaceChild(newButton, adblockButtonRef);

            newButton.classList.add("adblock-detected");
            newButton.textContent = "Adblocker funnet!";
            // remove link/href
            newButton.removeAttribute("href");
            newButton.removeAttribute("target");

            // On click -> reload the site
            newButton.addEventListener("click", (evt) => {
                evt.preventDefault();
                location.reload();
            });
        }
    }

    // ---------------------------
    // Initialize
    // ---------------------------
    fetchFeed();

})();