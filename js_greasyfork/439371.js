// ==UserScript==
// @name         NitroType Auto Reload for friend's races
// @namespace    https://www.youtube.com/c/G11777goldYT/featured
// @version      1.0
// @description  Automatically reloads the page at the end of friends races. to adapt it to go with your link change the @match section of this code to your racer link instead of the one that is currently there
// @author       G1_1777gold
// @match        *://*.nitrotype.com/race/g1_1
// @run-at       document-end
// @grant        none
// @license      MIT
// @homepageURL  https://www.youtube.com/c/G11777goldYT/featured
// @downloadURL https://update.greasyfork.org/scripts/439371/NitroType%20Auto%20Reload%20for%20friend%27s%20races.user.js
// @updateURL https://update.greasyfork.org/scripts/439371/NitroType%20Auto%20Reload%20for%20friend%27s%20races.meta.js
// ==/UserScript==

const options = {
    timerMs: 1000,
    reloadWhenDisqualified: true
};

(() => {

    'use strict';

    let letters, lastLetter;

    if (options.reloadWhenDisqualified) {

        const dqObserver = new MutationObserver(() => {
            if (document.querySelector('.modal--error')) {

                dqObserver.disconnect();

                location.reload();

            }
        });

        dqObserver.observe(raceContainer, {childList: true});

    }

    const lessonObserver = new MutationObserver(() => {

        if (document.querySelector('.dash-copy')) {

            lessonObserver.disconnect();

            letters = document.querySelectorAll('.dash-letter'),
            lastLetter = letters[letters.length - 2];

            lastLetterObserver.observe(lastLetter, {attributes: true});

        }

    });

    const lastLetterObserver = new MutationObserver((mutations) => {

        for (let mutation of mutations) {
            if (mutation.target.getAttribute('class').includes('is-correct')) {

                lastLetterObserver.disconnect();

                setTimeout(() => location.reload(), options.timerMs);

            }
        }

    });

    lessonObserver.observe(document.querySelector('.dash-center'), {childList: true});

    console.info('Auto Reload Activated.');

})()