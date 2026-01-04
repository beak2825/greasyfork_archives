// ==UserScript==
// @name         betterVulkan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Oczyszczenie strony eduvulcan
// @author       maybe-asdf
// @match        https://uczen.eduvulcan.pl/*
// @match        https://eduvulcan.pl/*
// @license      GNU GPLv3 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524160/betterVulkan.user.js
// @updateURL https://update.greasyfork.org/scripts/524160/betterVulkan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const classesToRemove = ['contrast', 'fonts__wrapper', 'MuiAvatar-root', 'header__logo', 'aside__application-name', 'header-part-1', 'part-business', 'button-contrast', 'button-font-letter', 'box-app', 'footer-content', 'box-access-title', 'box-access-intro', 'access-icon', 'pomoc', 'lucky-number__circle-1', 'lucky-number__circle-2'];

    const idsToRemove = ['kafel-pomoc-pomigracyjna', 'header_layout'];

    const classCombinationsToRemove = [
        ['mt-5', 'mb-2'],
        ['base-button', 'button-primary']
    ];

    const injectTarget = [
        {selector: '.side_studentContext', content: '<p class="side_details">betterVulkan active</p>'}
    ];

    classesToRemove.forEach(className => {
        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(element => element.remove());
    });

    function removeIds() {
        idsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
    }

    function removeTypes() {
    const typesToRemove = ['footer', 'aybici']; // Add any other tags you want to remove

    typesToRemove.forEach(tag => {
        const elements = document.getElementsByTagName(tag); // Get all elements by tag name
        Array.from(elements).forEach(element => element.remove()); // Convert HTMLCollection to array and remove each element
    });
}


    function removeClassCombinations() {
        classCombinationsToRemove.forEach(classPair => {
            const elements = document.querySelectorAll(`.${classPair[0]}.${classPair[1]}`);
            elements.forEach(element => element.remove());
        });
    }

    // Inject custom CSS
    function injectCustomCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
        /* CSS HEX
--bistre: #2d1d18ff;
--ebony: #465043ff;
--blackish: #080809ff;
--charcoal: #3c4455ff;
--rose-ebony: #5e3c37ff; */


            body {
                background: none !important;
                background-color: #444444 !important;
            }
            .app__content {
             background: none !important;
             background-color: #444444 !important;
            }
            .custom-banner {
                color: white;
                padding: 10px;
                text-align: center;
                font-size: 20px;
                font-weight: bold;
            }
            h1 {
            color: white !important;
            }
            .content-container {
            background: none !important;
             background-color: #5A5A5A !important;
             color: #f5f5f5 !important;
            }
            .pos-rel {
                position: relative; /* Ensures that absolute positioning works relative to the body */
    height: 100vh; /* Ensures the body takes full viewport height */
    margin: 0; /* Resets the body margin */
            }
            .box-simple {
                background-color: #4e4e4e !important;
                color: #f4f4f4 !important;
                width: 50%; !important;
                position: absolute;
                top: 50%; /* Position at the vertical center */
                left: 50%; /* Position at the horizontal center */
                transform: translate(-50%, -50%); /* Adjusts the element's position back to fully center it */
                position: relative; /* Needed to position the ::before element */
            }
            .app__header {
            background-color: #5A5A5A !important;
            }
            .user {
            color: #F4F9E9 !important;
}
            .box-simple::before {
    content: "Wybierz Uzytkownika betterVulcan"; /* The text you want to add */
    position: absolute; /* Position it relative to the .box */
    top: -20px; /* Adjust position to be above the box */
    left: 50%; /* Center horizontally */
    transform: translateX(-50%); /* Center alignment adjustment */
    background-color: #f4f4f4; /* Optional background for visibility */
    padding: 5px;
    font-size: 14px;
    color: black;
    border-radius: 12px; /* Makes the text box rounded */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Adds a subtle shadow */
}
.primary-button {
background-color: #5A5A5A !important;
}
.primary-button:hover {
background-color: #424242 !important;
}
            .connected-account-name {
                color: #f4f4f4 !important;
            }
            .MuiListItem-root {
               --kolor-wcag: #5A5A5A;
               }
                       .lucky-number__circle-1 {
            background-color: #B4B8AB;
}
.tile {
background-color: #737373 !important;
color: #f5f5f5 !important;
}
.tile__content, .tile__list__rectangle__ribbon, .tile__empty-bg {
background: none !important;
background-color: #858585 !important;
}
.plan {
background-color: #001c02 !important;
}
.background_item {
border-color: #001c02 !important;
}
.zwolniony {
background-color: #230336 !important;
}
        `;
        document.head.appendChild(style);
    }

    // Function to inject custom elements into specific target elements
    function injectCustomElement(targetSelector, content) {
        const targetElements = Array.isArray(targetSelector)
            ? targetSelector.map(selector => document.querySelector(selector)).filter(Boolean)
            : [document.querySelector(targetSelector)];

        targetElements.forEach(target => {
            if (target) {
                const customDiv = document.createElement('div');
                customDiv.className = 'custom-banner';
                customDiv.innerHTML = content;
                target.appendChild(customDiv); // Adds the custom element inside the target element
            }
        });
    }

    // Inject elements based on selector
    injectTarget.forEach(target => {
        injectCustomElement(target.selector, target.content);
    });

    // Run functions to inject custom elements and CSS
    injectCustomCSS();

    setInterval(() => {
        removeIds();
        removeClassCombinations();
        removeTypes();
    }, 500);
})();
