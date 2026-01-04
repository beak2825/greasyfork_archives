// ==UserScript==
// @name         Super Duolingo Ad Blocker
// @version      1.0
// @description  Block ads and unwanted promotional content on Duolingo, including dynamically named ad classes, while preserving essential lesson content and handling fullscreen ads by pressing the exit button automatically or selecting "No Thanks" on specific ads.
// @author       Zinovia
// @match        https://*.duolingo.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1340999
// @downloadURL https://update.greasyfork.org/scripts/501941/Super%20Duolingo%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/501941/Super%20Duolingo%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject CSS into the document
    function addStyles(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // CSS to hide specific promotional and ad content
    const styles = `
        /* Specific divs associated with ads and promotions, conditional on not being essential content */
        div[data-test="purchase-step-active"],
        div._3D_HB,
        div._16rRh,
        div._16rRh._2cnFr._1T_BQ,
        div._1tzFd,
        div._1Qh5D._36g4N._2YF0P.uapW2,
        div._3ZUrl._2BflZ,
        div.MGk8p,
        div._3ywWe,
        div._1145W,
        div.Vm8CO._2zxQ8,
        iframe[name="__privateStripeController7431"] {
            display: none !important;
        }
    `;

    // Inject styles into the document
    addStyles(styles);

    // Function to dynamically hide elements
    function hideElements() {
        const selectors = [
            'div[data-test="purchase-step-active"]',
            'div._3D_HB',
            'div._16rRh',
            'div._16rRh._2cnFr._1T_BQ',
            'div._1tzFd',
            'div._1Qh5D._36g4N._2YF0P.uapW2',
            'div._3ZUrl._2BflZ',
            'div.MGk8p',
            'div._3ywWe',
            'div._1145W',
            'div.Vm8CO._2zxQ8',
            'iframe[name="__privateStripeController7431"]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.closest('#session/PlayerFooter') && 
                    !element.closest('div._1QQhE') &&
                    !element.closest('div._3rB4d._1VTif._2HXQ9')) { // Ensure essential content is not hidden
                    element.style.display = 'none';
                }
            });
        });
    }

    // Function to press the exit button on fullscreen ads
    function pressExitButton() {
        const exitButton = document.querySelector('._3vGNs._2YF0P._1Udkq');
        if (exitButton) {
            exitButton.click();
            console.log('Fullscreen ad exit button clicked!');
        }
    }

    // Function to click the "No Thanks" button on the new type of full-screen ad
    function pressNoThanksButton() {
        const noThanksButton = document.querySelector('button._1Qh5D._36g4N._2YF0P._76ebC._3h0lA._1S2uf.cnGdv');
        if (noThanksButton) {
            noThanksButton.click();
            console.log('No Thanks button clicked!');
        }
    }

    // Function to click the button in the lesson
    function clickLessonButton() {
        const button = document.querySelector('._3vGNs._2YF0P._1Udkq');
        if (button) {
            button.click();
            console.log('Lesson button clicked!');
        }
    }

    // Function to handle the blank screen issue
    function handleBlankScreen() {
        const continueButton = document.querySelector('button[data-test="player-next"]');
        if (continueButton) {
            continueButton.click();
            console.log('Continue button clicked!');
        }
        const reviewLessonButton = document.querySelector('button span._1o-YO:contains("Review lesson")');
        if (reviewLessonButton) {
            reviewLessonButton.click();
            console.log('Review lesson button clicked!');
        }
    }

    // Run initial functions
    hideElements();
    pressExitButton();
    pressNoThanksButton();
    clickLessonButton();
    handleBlankScreen();

    // Observe DOM changes and apply modifications as necessary
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                hideElements();
                pressExitButton();
                pressNoThanksButton();
                clickLessonButton();
                handleBlankScreen();
            }
        });
    });

    // Start observing the body for child list changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Super Duolingo Ad Blocker initialized.');
})();