// ==UserScript==
// @name         YouTube Channel Hover Popup
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display a hover popup with channel info on YouTube after dynamic content load, with immediate loading indicator
// @author       @dmtri
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474832/YouTube%20Channel%20Hover%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/474832/YouTube%20Channel%20Hover%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let policy = null

    const createPopup = () => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.zIndex = '1000';
        popup.style.width = '300px';
        popup.style.background = 'white';
        popup.style.border = '1px solid black';
        popup.style.borderRadius = '8px';
        popup.style.padding = '16px';
        popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        popup.style.display = 'none';
        popup.style.fontSize = '16px';
        document.body.appendChild(popup);
        return popup;
    };

    const popup = createPopup();

    const showLoadingPopup = (popup, x, y) => {
        policy = trustedTypes.createPolicy('default2', {
            createHTML: (string) => string, // Allow all HTML strings
        });

        popup.innerHTML = policy.createHTML('<strong>Loading...</strong>');
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.style.display = 'block';
    };

    const updatePopupContent = (popup, content) => {
        popup.innerHTML = policy.createHTML(content);
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '10px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#333';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = 'bold';
        closeButton.onclick = () => popup.style.display = 'none';
        popup.appendChild(closeButton);
    };

    const fetchChannelInfo = async (url) => {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(policy.createHTML(html), 'text/html');
            const meta = doc.querySelector('meta[property="og:description"]');
            const description = meta ? meta.getAttribute('content') : 'No description available.';
            return `<strong>Description:</strong> ${description}<br>`;
        } catch (error) {
            return 'Failed to load description.';
        }
    };

    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    const observeDOM = () => {
        const observer = new MutationObserver((mutations, obs) => {
            setTimeout(() => {
                const channelElements = document.querySelectorAll('.ytd-channel-name#text-container');
                if (channelElements.length) {
                    init(channelElements);
                    obs.disconnect(); // Stop observing after successful initialization
                }
            }, 1000);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('[YouTube Channel Hover Popup] - observeDOM')
    };

    const init = (channelElements) => {
        console.log('YouTube Channel Hover Popup - init', { channelElements } )
        channelElements.forEach(channelElement => {
            let popupTimeout;

            channelElement.addEventListener('mouseenter', async (e) => {
                clearTimeout(popupTimeout);
                popupTimeout = setTimeout(async () => {
                    const url = channelElement.querySelector('a').href;
                    showLoadingPopup(popup, e.clientX, e.clientY + 20);
                    const content = await fetchChannelInfo(url);
                    updatePopupContent(popup, content);
                }, 500);
            });

            channelElement.addEventListener('mouseleave', () => {
                clearTimeout(popupTimeout);
                popup.style.display = 'none';
            });

            const throttledMouseMove = throttle((e) => {
                if (popup.style.display !== 'none') {
                    popup.style.left = `${e.clientX}px`;
                    popup.style.top = `${e.clientY + 20}px`;
                }
            }, 100); // Update popup position at most every 100ms

            channelElement.addEventListener('mousemove', throttledMouseMove);
        });
    };

    setTimeout(() => {
        const channelElements = document.querySelectorAll('.ytd-channel-name#text-container');
        init(channelElements)
    }, 5000); // Start observing DOM for changes
        setTimeout(() => {
        observeDom()
    }, 15000); // Start observing DOM for changes
})();
