// ==UserScript==
// @name         Always Latest Tweets for Mobile Twitter
// @namespace    https://github.com/gslin/always-latest-tweets-for-mobile-twitter
// @version      0.20190710.0
// @description  Auto-switch to latest tweets for mobile version Twitter
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://mobile.twitter.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/381962/Always%20Latest%20Tweets%20for%20Mobile%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/381962/Always%20Latest%20Tweets%20for%20Mobile%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ob = new window.MutationObserver(ml => {
        // If it's already in latest timeline, uninstall observer.
        if (document.querySelector('div[aria-label="Timeline: Your Home Timeline"]')) {
            console.debug('Already on latest timeline');
            ob.disconnect();
        }

        ml.forEach(el => {
            if (document.evaluate('.//span[text() = "See latest Tweets instead"]', el.target, null, XPathResult.ANY_TYPE, null).iterateNext()) {
                for (let span of el.target.getElementsByTagName('span')) {
                    if ('See latest Tweets instead' == span.innerText) {
                        span.click();
                        return;
                    }
                }
            }
        });

        let star_el = document.querySelector('main div[data-testid="primaryColumn"] h2');
        if (star_el && 'Home' === star_el.innerText) {
            let el = document.querySelector('div[aria-label="Top Tweets on"]');
            if (el) {
                el.click();
                return;
            }
        }
    });

    ob.observe(document, {
        childList: true,
        subtree: true,
    });
})();
