// ==UserScript==
// @name         Magic for SED
// @namespace    http://tampermonkey.net/
// @version      2024-09-04
// @description  auto food ordering
// @author       You
// @match        https://www.whyq.sg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whyq.sg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506721/Magic%20for%20SED.user.js
// @updateURL https://update.greasyfork.org/scripts/506721/Magic%20for%20SED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    const button = document.createElement('button');
    button.innerText = 'Random';
    button.id = 'floatingButton';

    // Style the button
    const style = document.createElement('style');
    style.innerHTML = `
        #floatingButton {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        #floatingButton:hover {
            background-color: #0056b3;
        }
    `;

    // Append the button and style to the document
    document.head.appendChild(style);
    document.body.appendChild(button);

    function getTwoRandomNumbers(upper) {
        const random = () => Math.floor(upper * Math.random());
        const first = random();
        while (true) {
            const second = random();
            if (first !== second) {
                return [first, second];
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // Add click event listener to the button
    button.addEventListener('click', async () => {
        const tabs = [...document.querySelector('.owl-stage-outer').querySelectorAll('.owl-item')];
        for (let t = 0; t < tabs.length; t ++) {
            tabs[t].querySelector('.meal_date_change').click();

            const meals = [...document.querySelector('.rakuten_meal_list.active').querySelectorAll('ul')]
            .filter(x => !(x.className.includes('cat-481') || x.className.includes('cat-2')));
            const [first, second] = getTwoRandomNumbers(meals.length);

            meals[first].querySelector('button').click();

            while (true) {
                await sleep(500);
                const choose_optional = document.querySelector('#choose_optional');
                if (choose_optional.style.display === 'block') {
                    const button = document.querySelector('#add_optional');
                    button.click();
                    break;
                }
            }

            meals[second].querySelector('button').click();

            while (true) {
                await sleep(500);
                const popup = document.querySelector('#pop_notify');
                if (popup.style.display === 'block') {
                    popup.querySelector('button').click();
                    break;
                }
            }

            while (true) {
                await sleep(500);
                const popup = document.querySelector('#pop_notify');
                if (popup.style.display === 'none') {
                    break;
                }
            }
        }
    });
})();