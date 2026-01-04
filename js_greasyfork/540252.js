// ==UserScript==
// @name        Estimated Read Time
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.1
// @license     GNU GPL
// @description Predict the read time you would take
// @downloadURL https://update.greasyfork.org/scripts/540252/Estimated%20Read%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/540252/Estimated%20Read%20Time.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function init() {
        function removePaywalls() {
            const paywallSelectors = [
                '[class*="paywall"]',
                '[class*="overlay"]',
                '[class*="modal"]',
                '[class*="popup"]',
                '[class*="subscribe"]',
                '[class*="newsletter"]',
                '[id*="paywall"]',
                '[id*="overlay"]',
                '[id*="modal"]',
                '[id*="popup"]',
                '.snippet-promotion',
                '.wsj-snippet-login',
                '.continue-reading',
                '.wsj-ad',
                '[data-module-name="paywall"]',
                '[data-module-name="InlineVideo"]',
                '.media-object-video',
                '#cx-snippet-overlay',
                '.cx-snippet-overlay',
                '.snippet-promotion-container',
                '.piano-overlay',
                '.tp-modal',
                '.fc-consent-root',
                '.qc-cmp2-container',
                '.css-1dbjc4n[style*="position: fixed"]',
                'div[style*="position: fixed"] [style*="z-index"]'
            ];

            paywallSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    element.remove();
                });
            });

            document.querySelectorAll('div, section, article').forEach(element => {
                const text = element.textContent || '';
                if (text.includes('Continue reading your article with') ||
                    text.includes('Subscribe to continue reading') ||
                    text.includes('Sign in to continue reading')) {
                        element.remove();
                }
            });

            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.documentElement.style.position = '';

            document.querySelectorAll('[style*="backdrop"]').forEach(el => el.remove());
        }

        const style = document.createElement('style');
        style.innerHTML = `
        .glass-card {
            min-width: 200px;
            max-width: 300px;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 1px rgba(255, 255, 255, 0.5),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                inset 0 0 0px rgba(255, 255, 255, 0);
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 8px 12px;
            font-size: 14px;
            color: white;
            z-index: 10000;
            overflow: hidden;
            white-space: nowrap;
        }

        .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.8),
                transparent
            );
        }

        .glass-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 100%;
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.8),
                transparent,
                rgba(255, 255, 255, 0.3)
            );
        }`;

        (document.head || document.documentElement).appendChild(style);

        function getUserReadingSpeed(defaultSpeed = 200){
            let speed = GM_getValue("readingSpeed", null);
            if (speed === null) {
                speed = parseInt(prompt("Average reading wpm?: ", defaultSpeed), 10);
                if (!isNaN(speed) && speed > 0) {
                    GM_setValue("readingSpeed", speed);
                } else {
                    speed = defaultSpeed;
                }
            } else {
                speed = parseInt(speed, 10);
            }
            return speed;
        }

        function averageReadingTime(text, wordsPerMinute) {
            text = text.replace(/\s+/g, ' ').trim();
            const wordCount = text.split(' ').filter(word => word.length > 0).length;
            return Math.ceil(wordCount / wordsPerMinute);
        }

        function displayReadTime(text) {
            const readTimeDiv = document.createElement('div');
            readTimeDiv.className = "glass-card";
            readTimeDiv.textContent = text;

            readTimeDiv.addEventListener('click', function() {
                readTimeDiv.remove();
            });

            document.body.appendChild(readTimeDiv);
        }

        removePaywalls();
        setTimeout(removePaywalls, 500);
        setTimeout(removePaywalls, 1000);
        setTimeout(removePaywalls, 2000);

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(removePaywalls, 100);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const article = document.querySelector('article');
        const content = article ? article.innerText : document.body.innerText;

        if (content) {
            const userSpeed = getUserReadingSpeed();
            const minutes = averageReadingTime(content, userSpeed);
            displayReadTime(`Estimated read time: ${minutes} minutes`);
        } else {
            displayReadTime(`Can't get text on ${window.location.hostname}`);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventlistener('DOMContentLoaded', init);
    } else {
        init();
    }
})();