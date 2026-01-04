// ==UserScript==
// @name         Keymash - Auto display match data & PP Display
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically displays match data after completing a race and displays match PP scores
// @author       Disturbed
// @match        https://keymash.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keymash.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469455/Keymash%20-%20Auto%20display%20match%20data%20%20PP%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/469455/Keymash%20-%20Auto%20display%20match%20data%20%20PP%20Display.meta.js
// ==/UserScript==

(async function () {
    let star_ratings = await fetch('https://raw.githubusercontent.com/DisturbedProphet/Keymash-PP-display/main/starratings.json').then(res => res.json())

    //This code is from https://github.com/duhby/typing-pp and is potentially subject to change as the PP system is developed further
    function get_score(stars, wpm) {
        return 35 * stars * curve_multiplier(wpm);
    }

    function curve_multiplier(wpm) {
        if (wpm < 100) {
            return wpm * 0.0045;
        }
        else if (wpm < 140) {
            return (wpm * 0.01) - 0.55;
        }
        else if (wpm < 214) {
            return (wpm * 0.0128378) - 0.947297;
        }
        else {
            return 0.102232 * (1.01349 ** wpm);
        }
    }

    //returns a promise that resolves once a given element is created
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    //returns a promise that resolves once a given element is removed
    function waitForElmToDisappear(selector) {
        return new Promise(resolve => {
            if (!document.querySelector(selector)) {
                return resolve();
            }

            const observer = new MutationObserver(mutations => {
                if (!document.querySelector(selector)) {
                    resolve();
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }


    async function set_pp() {
        let wpmElm = await waitForElm("#matchEnd > div > div > div > div > div > div:nth-child(1) > div:nth-child(2) > span");

        let quote = document.querySelector('#matchEnd > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2)').innerText.split('\n').join(' ');
        let stars;
        try {
            stars = star_ratings[quote].rating;
        } catch (err) {
            //detect dictionary match and use appropriate star rating
            if (document.querySelector("#matchEnd > div > div > div > div > div > div > div:nth-child(1) > div:nth-child(2)").innerText == "DICTIONARY") {
                stars = 4.8
            }
        }

        //clone the WPM display div and replaces the contents with the proper PP data
        let ppDiv = document.querySelector("#matchEnd > div > div > div > div > div > div:nth-child(2)").cloneNode(true);
        let statsContainer = document.querySelector("#matchEnd > div > div > div > div > div");
        ppDiv.children[0].innerText = "Performance Points";
        statsContainer.appendChild(ppDiv);

        //observer dynamically updates the PP according with the WPM to mimic the animation
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target === wpmElm && mutation.addedNodes.length) {
                    ppDiv.children[1].innerText = get_score(stars, parseFloat(wpmElm.innerText)).toFixed(2);
                }
            }
        });

        observer.observe(wpmElm, { childList: true, subtree: true });
    }


    async function autoclickMatch() {
        await waitForElm('#matchEnd > div > button:nth-child(2)').then(elm => elm.click())
        await waitForElmToDisappear('#matchEnd > div > button:nth-child(2)').then(autoclickMatch)
    }
    autoclickMatch();

    while (true) {
        let wpmSelector = "#matchEnd > div > div > div > div > div > div:nth-child(1) > div:nth-child(2) > span";

        await waitForElm(wpmSelector).then(set_pp);
        await waitForElmToDisappear(wpmSelector);
    }
})();