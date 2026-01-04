// ==UserScript==
// @name         Chase offers
// @namespace    http://tampermonkey.net/
// @version      2024-11-24
// @description  Automatically add chase offers
// @author       You
// @match        https://secure.chase.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chase.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520066/Chase%20offers.user.js
// @updateURL https://update.greasyfork.org/scripts/520066/Chase%20offers.meta.js
// ==/UserScript==

// copied with minor adaptation from https://www.reddit.com/r/ChaseSapphire/comments/18pb8w5/auto_add_all_offers_to_chase_card/

(function() {
    'use strict';

    const urlPattern = /https:\/\/secure\.chase\.com\/web\/auth\/dashboard#\/dashboard\/merchantOffers\/offer-hub\?accountId=.*/;
    const btnSelection = '[role="button"][tabindex="0"] > :nth-child(2)';
    //'.r9jbij9' manual button selection

    const backFunction = () => {
        // shadow root back button click
        document.querySelectorAll(`[variant="back"]`)[0].shadowRoot.querySelectorAll(`#back-button`)[0].click()
.click();
        // old back method
        // window.history.back();
    };
    const aa = () => {
        backFunction();
        setTimeout(checkUrlAndRun, Math.random() * 1000 + 300);
    };

    let count = 1;
    const c = () => {
        try {
            const btns = [...document.querySelectorAll(btnSelection)]
                .filter(b => b.childNodes[1].childNodes[0].type !== 'ico_checkmark_filled');
            const b = btns.pop();
            if (!b) {
                console.log('added all!');
                return;
            }
            b.childNodes[0].click();
            updateProgress(count, btns.length);
            setTimeout(aa, Math.random() * 1000 + 300);

            document.querySelector(btnSelection).click();
        } catch (e) {
            checkUrlAndRun();
        }
    };
    const updateProgress = (current, total) => {
      console.log(`Remaining: ${total}`);
      count++;
    };

    const waitForElements = () => {
        const observer = new MutationObserver((mutations, observer) => {
            if (document.querySelectorAll(btnSelection).length > 0) {
                observer.disconnect();
                c();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const checkUrlAndRun = () => {
        if (urlPattern.test(window.location.href)) {
            waitForElements();
        }
    };

    // Initial check
    checkUrlAndRun();

    // Monitor URL changes
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            checkUrlAndRun();
        }
    });
    observer.observe(body, { childList: true, subtree: true });

})();