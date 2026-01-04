// ==UserScript==
// @name        X/Twitter autoshow nsfw
// @description Autoclick "show" on X nsfw posts
// @grant none
// @license UNLICENSE - https://unlicense.org/
// @version     0.1712797942
// @namespace   https://lucdev.net
// @match       *://twitter.com/*
// @author      lucdev.net
// @downloadURL https://update.greasyfork.org/scripts/492191/XTwitter%20autoshow%20nsfw.user.js
// @updateURL https://update.greasyfork.org/scripts/492191/XTwitter%20autoshow%20nsfw.meta.js
// ==/UserScript==

(() => {
    /**
     * @param cb {function(): void}
     * @returns 
     */
    function domReady(cb) {
        if (document.readyState === 'complete') {
            return cb();
        }
        document.addEventListener('readystatechange', domReady.bind(null, cb));
    };

    function clickAllShowButtons() {
        const showSpans = Array.from(
            document.querySelectorAll(`div[role="button"] > div > span > span`)
        ).filter(
            span => span.textContent.toLowerCase().trim() === 'show'
        );
    
        if (showSpans.length > 0) {
            for (const span of showSpans) {
                /** @type HTMLSpanElement */
                const parentSpan = span.parentElement;
                if (!parentSpan) {
                    continue;
                }
                /** @type HTMLSpanElement */
                const parentSpanParent = parentSpan.parentElement;
                if (!parentSpanParent) {
                    continue;
                }
                /** @type HTMLDivElement */
                const parentDiv = parentSpanParent.parentElement;
                if (!parentDiv) {
                    continue;
                }
    
                /** @type HTMLDivElement */
                const button = parentSpanParent.parentElement;
                if (!button) {
                    continue;
                }
    
                button.click();
                window.setTimeout(() => hideHideButtons(), 1000);
            }
        }
    }

    function hideHideButtons() {
        const hideSpans = Array.from(
            document.querySelectorAll(`div[role="button"] > div > span > span`)
        ).filter(
            span => span.textContent.toLowerCase().trim() === 'hide'
        );

        if (hideSpans.length > 0) {
            for (const span of hideSpans) {
                /** @type HTMLSpanElement */
                const parentSpan = span.parentElement;
                if (!parentSpan) {
                    continue;
                }
                /** @type HTMLSpanElement */
                const parentSpanParent = parentSpan.parentElement;
                if (!parentSpanParent) {
                    continue;
                }
                /** @type HTMLDivElement */
                const parentDiv = parentSpanParent.parentElement;
                if (!parentDiv) {
                    continue;
                }

                /** @type HTMLDivElement */
                const button = parentSpanParent.parentElement;
                if (!button) {
                    continue;
                }

                button.style.display = "none";
            }
        }
    }

    domReady(() => {
        window.setInterval(() => clickAllShowButtons(), 1000);
        window.addEventListener("scrollend", () => {
            window.setTimeout(() => clickAllShowButtons(), 250);
        });
    });
})();
