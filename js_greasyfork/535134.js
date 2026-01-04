// ==UserScript==
// @name         quizlet test bypass
// @namespace    https://quizlet.com
// @version      2025-05-06
// @description  Unlimited test bypass
// @author       smshxrae
// @match        https://quizlet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535134/quizlet%20test%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/535134/quizlet%20test%20bypass.meta.js
// ==/UserScript==

// web version : https://smshxrae.github.io/quizlet/unlimitedtest.html
(function() {
    'use strict';
    var currentURL = window.location.href;
    var match = currentURL.match(/quizlet\.com\/(\d+)/i);
    var number = match[1];
    if (match) {
        // Get the element with class 't8e1o5w'
        const header = document.getElementsByClassName('t8e1o5w')[0];

        if (header && header.tagName === 'H1') {
            const button = document.createElement('button');
            button.textContent = 'Unlimited Test';

            // Apply a modern, minimal style
            button.style.padding = '6px 12px';
            button.style.marginLeft = '10px';
            button.style.border = 'none';
            button.style.borderRadius = '6px';
            button.style.backgroundColor = '#4f46e5'; // Indigo-600
            button.style.color = 'white';
            button.style.fontSize = '0.9em';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
            button.style.transition = 'background-color 0.2s ease';

            // Add hover effect
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#4338ca'; // Indigo-700
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#4f46e5';
            });
            button.onclick = () => {
                window.location.href = 'https://quizlet.com/'+number+'/test/embed?answerTermSides=6&promptTermSides=6&questionCount=20&questionTypes=4&showImages=true'
                // You can run any other function here
            };

            // Insert the button
            header.insertAdjacentElement('afterend', button);
        }
    }



})();
