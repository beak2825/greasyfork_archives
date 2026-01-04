// ==UserScript==
// @name         Torn - Efficient Rehab
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows efficient rehab calculations on Torn's travel agency page
// @author       Converted from TornTools
// @match        https://www.torn.com/travelagency.php*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539887/Torn%20-%20Efficient%20Rehab.user.js
// @updateURL https://update.greasyfork.org/scripts/539887/Torn%20-%20Efficient%20Rehab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isPageLoaded = false;
    let knownPercentages = null;
    let userPersonalStats = null;
    
    // Configuration
    const config = {
        efficientRehabSelect: false, // Set to true if you want auto-selection
        apiKey: GM_getValue('torn_api_key', ''), // Store API key in Tampermonkey storage
    };

    // Utility functions
    function requireCondition(conditionFn, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            function check() {
                if (conditionFn()) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Condition timeout'));
                } else {
                    setTimeout(check, 100);
                }
            }
            
            check();
        });
    }

    function requireElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found`));
                } else {
                    setTimeout(check, 100);
                }
            }
            
            check();
        });
    }

    function applyPlural(number) {
        return number === 1 ? '' : 's';
    }

    // Enhanced document.createElement
    if (!document.newElement) {
        document.newElement = function(options) {
            const element = document.createElement(options.type || 'div');
            
            if (options.class) element.className = options.class;
            if (options.text) element.textContent = options.text;
            if (options.children) {
                options.children.forEach(child => {
                    if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    } else {
                        element.appendChild(child);
                    }
                });
            }
            
            return element;
        };
    }

    // API functions
    function fetchUserPersonalStats() {
        return new Promise((resolve, reject) => {
            if (!config.apiKey) {
                console.warn('No API key configured for Efficient Rehab script');
                reject(new Error('No API key'));
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/user/?selections=personalstats&key=${config.apiKey}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            reject(new Error(data.error.error));
                        } else {
                            userPersonalStats = data.personalstats;
                            resolve(data.personalstats);
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Main functions
    function calculateSafeRehabs() {
        if (!userPersonalStats || !userPersonalStats.drugs || !userPersonalStats.drugs.rehabilitations) {
            console.warn('No personal stats available for rehab calculation');
            return { minimum: 0, safe: 0 };
        }

        const rehabsDone = userPersonalStats.drugs.rehabilitations.amount || 0;
        const costAP = rehabsDone <= 19232 ? rehabsDone * 12.85 + 2857.14 : 250000;
        const rehabAP = parseInt(Math.round((250000 / costAP) * 100)) / 100;

        return {
            minimum: Math.ceil(20 / rehabAP),
            safe: Math.ceil(19 / rehabAP + 1),
        };
    }

    async function showInformation() {
        try {
            await requireCondition(() => isPageLoaded);

            let percentages = knownPercentages;
            if (!percentages) {
                try {
                    const sliderElement = await requireElement("#rehub-progress .range-slider-data");
                    percentages = JSON.parse(sliderElement.dataset.percentages);
                } catch (e) {
                    console.warn('Could not find rehab progress slider');
                    return;
                }
            }

            const maxRehabs = parseInt(Object.keys(percentages).reverse()[0]);
            const { safe } = calculateSafeRehabs();

            const informationElement = document.newElement({
                type: "div",
                class: "tt-efficient-rehab",
                children: [
                    "For full efficiency, leave at least ",
                    document.newElement({ type: "span", class: "tt-efficient-rehab--amount", text: safe }),
                    " rehabs. ",
                ],
            });

            if (safe >= maxRehabs) {
                informationElement.appendChild(document.createTextNode("This means that you "));
                informationElement.appendChild(
                    document.newElement({ type: "span", class: "tt-efficient-rehab--amount tt-efficient-rehab--too-much", text: "shouldn't" })
                );
                informationElement.appendChild(document.createTextNode(" rehab at all."));
            } else {
                informationElement.appendChild(document.createTextNode("This means that you should rehab up to "));
                informationElement.appendChild(document.newElement({ type: "span", class: "tt-efficient-rehab--amount", text: maxRehabs - safe }));
                informationElement.appendChild(document.createTextNode(` time${applyPlural(maxRehabs - safe)}.`));
            }

            // Add CSS styling
            if (!document.querySelector('#tt-efficient-rehab-styles')) {
                const style = document.createElement('style');
                style.id = 'tt-efficient-rehab-styles';
                style.textContent = `
                    .tt-efficient-rehab {
                        background: #f0f0f0;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 10px;
                        margin: 10px 0;
                        font-weight: bold;
                    }
                    .tt-efficient-rehab--amount {
                        color: #007bff;
                        font-weight: bold;
                    }
                    .tt-efficient-rehab--too-much {
                        color: #dc3545 !important;
                    }
                `;
                document.head.appendChild(style);
            }

            const rehabDesc = document.querySelector(".rehab-desc");
            if (rehabDesc) {
                rehabDesc.insertAdjacentElement("afterend", informationElement);
            }

            if (config.efficientRehabSelect) {
                // Trigger custom event for auto-selection (if needed)
                window.dispatchEvent(new CustomEvent("tt-efficient-rehab", { 
                    detail: { ticks: Math.max(maxRehabs - safe, 1) } 
                }));
            }

        } catch (error) {
            console.error('Error showing efficient rehab information:', error);
        }
    }

    function removeInformation() {
        Array.from(document.querySelectorAll(".tt-efficient-rehab")).forEach((x) => x.remove());
    }

    // XHR interception for detecting rehab actions
    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(data) {
            this._requestBody = data;
            
            this.addEventListener('load', function() {
                if (this._url && this._url.includes('travelagency.php') && this._requestBody) {
                    const params = new URLSearchParams(this._requestBody);
                    const step = params.get("step");

                    if (step === "tryRehab") {
                        removeInformation();
                        setTimeout(() => showInformation(), 500);
                    } else if (step === "checkAddiction" && this.responseText) {
                        try {
                            const json = JSON.parse(this.responseText);
                            if (json.percentages) {
                                knownPercentages = json.percentages;
                                removeInformation();
                                setTimeout(() => showInformation(), 500);
                            }
                        } catch (e) {
                            // Ignore parsing errors
                        }
                    }
                }
            });

            return originalSend.apply(this, arguments);
        };
    }

    // Initialize
    function init() {
        // Check if we're on the travel agency page
        if (!window.location.href.includes('travelagency.php')) {
            return;
        }

        console.log('Efficient Rehab script initializing...');

        // Set up API key if not configured
        if (!config.apiKey) {
            const apiKey = prompt('Please enter your Torn API key for the Efficient Rehab script:');
            if (apiKey) {
                GM_setValue('torn_api_key', apiKey);
                config.apiKey = apiKey;
            } else {
                console.warn('No API key provided. Efficient Rehab calculations may not work.');
            }
        }

        // Fetch user personal stats
        if (config.apiKey) {
            fetchUserPersonalStats().catch(error => {
                console.error('Failed to fetch personal stats:', error);
            });
        }

        // Set up XHR interception
        interceptXHR();

        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                isPageLoaded = true;
                setTimeout(() => showInformation(), 1000);
            });
        } else {
            isPageLoaded = true;
            setTimeout(() => showInformation(), 1000);
        }

        // Also try to show information when the rehab section becomes visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const rehabDesc = document.querySelector('.rehab-desc');
                    if (rehabDesc && !document.querySelector('.tt-efficient-rehab')) {
                        setTimeout(() => showInformation(), 500);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start the script
    init();

})();