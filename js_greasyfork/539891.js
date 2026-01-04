// ==UserScript==
// @name         Google Search Link Checker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds 'no access' or safety warnings to Google search results
// @author       Bui Quoc Dung
// @match        https://www.google.com/search*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/539891/Google%20Search%20Link%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/539891/Google%20Search%20Link%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function checkLinkStatus(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "HEAD",
                url,
                timeout: 5000,
                onload: res => {
                    resolve((res.status >= 200 && res.status < 400) || [0, 403, 405, 429].includes(res.status));
                },
                onerror: (error) => {
                    resolve(!!(error && error.status === 0 && error.finalUrl));
                },
                ontimeout: () => {
                    resolve(false);
                }
            });
        });
    }

    async function checkSafetyStatus(url) {
        try {
            const hostname = new URL(url).hostname;
            const apiUrl = `https://check.getsafeonline.org/check/${hostname}?inputUrl=${hostname}`;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: apiUrl,
                    timeout: 10000,
                    onload: res => {
                        if (res.status >= 200 && res.status < 300) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(res.responseText, 'text/html');
                            const warningElement = doc.querySelector('div.font-light.text-2xl.mt-6 span.text-primary-red.font-bold');
                            if (warningElement) {
                                resolve(warningElement.textContent.trim());
                            } else {
                                resolve(null);
                            }
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null),
                    ontimeout: () => resolve(null)
                });
            });
        } catch (e) {
            console.error("Could not parse URL for safety check:", url, e);
            return Promise.resolve(null);
        }
    }

    function processLink(link) {
        if (!link || link.dataset.statusChecked) return;
        link.dataset.statusChecked = 'true';

        const url = link.href;
        if (!url || url.startsWith('javascript:') || url.startsWith('#')) return;

        const container = link.closest('.MjjYud');
        if (!container || container.querySelector('.access-safety-info')) return;

        const description = container.querySelector('.VwiC3b');
        if (!description) return;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'access-safety-info';
        infoDiv.style.marginTop = '4px';
        infoDiv.style.fontSize = '1em';
        infoDiv.style.display = 'flex';
        infoDiv.style.flexWrap = 'wrap';
        infoDiv.style.gap = '8px';

        description.parentElement.appendChild(infoDiv);

        checkLinkStatus(url).then(accessible => {
            if (!accessible) {
                const tag = document.createElement('span');
                tag.textContent = '[no access]';
                tag.style.color = 'orange';
                infoDiv.appendChild(tag);
            }
        });

        checkSafetyStatus(url).then(safetyText => {
            if (safetyText) {
                const tag = document.createElement('span');
                tag.textContent = `[${safetyText}]`;
                tag.style.color = 'red';
                infoDiv.appendChild(tag);
            }
        });
    }

    let scanTimeoutId = null;
    function scanLinksDebounced() {
        clearTimeout(scanTimeoutId);
        scanTimeoutId = setTimeout(() => {
            document.querySelectorAll('div.MjjYud a:has(h3)').forEach(processLink);
        }, 300);
    }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1 &&
                    (node.querySelector?.('div.MjjYud a:has(h3)') || node.matches?.('.MjjYud'))) {
                    scanLinksDebounced();
                    return;
                }
            }
        }
    });

    const container = document.getElementById('center_col') || document.getElementById('rcnt') || document.body;
    observer.observe(container, { childList: true, subtree: true });

    let lastURL = location.href;
    setInterval(() => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            setTimeout(scanLinksDebounced, 1000);
        }
    }, 1000);


    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => setTimeout(scanLinksDebounced, 1000));
    } else {
        setTimeout(scanLinksDebounced, 1000);
    }
})();
