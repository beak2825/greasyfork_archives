// ==UserScript==
// @name         Bing AI No Limit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove character limitation from Bing AI search.
// @author       guohaiping
// @match        https://www.bing.com/search?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466191/Bing%20AI%20No%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/466191/Bing%20AI%20No%20Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('script');
    script.textContent = `
        const DEBUG = false;

        async function waitForElement(parent, selector) {
            return new Promise((resolve, reject) => {
                const interval = setInterval(function () {
                    const element = parent.querySelector(selector);

                    if (element) {
                        if (DEBUG) {
                            console.log(element);
                        }
                        clearInterval(interval);
                        resolve(element);
                    }
                }, 10);
            });
        }

        const removeLimitation = async () => {
            const mainHost = await waitForElement(document, ".cib-serp-main");
            const mainRoot = mainHost.shadowRoot;
            const secondHost = await waitForElement(mainRoot, "#cib-action-bar-main");
            const secondRoot = secondHost.shadowRoot;
            const searchInput = await waitForElement(secondRoot, "#searchbox");
            searchInput.removeAttribute("maxlength");
            const letterCounter = await waitForElement(secondRoot, ".letter-counter");
            letterCounter.innerHTML = "Unlimited characters by guohaiping";
            console.log("Character limit was removed.");

            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (!searchInput.isConnected) {
                        removeLimitation();
                        observer.disconnect();
                    }
                }
            });

            observer.observe(secondRoot, { childList: true });
        };

        removeLimitation();
    `;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
})();
