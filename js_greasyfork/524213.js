// ==UserScript==
// @name         Ocean Hero Bottle Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Give you 1 quadrillion bottles every time you press a button!
// @author       You
// @match        https://www.oceanhero.gg/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524213/Ocean%20Hero%20Bottle%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/524213/Ocean%20Hero%20Bottle%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    let button = document.createElement('button');
    button.innerHTML = 'Give Me 1 Quadrillion Bottles';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.left = '20px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '18px';
    button.style.backgroundColor = '#008CBA';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Add an event listener to the button
    button.addEventListener('click', function() {
        // Assuming `bottles` is the variable that tracks the bottle count
        // Update the bottle count by adding 1 quadrillion bottles
        if (typeof window.bottles !== 'undefined') {
            window.bottles += 1000000000000000;  // Adding 1 quadrillion bottles
        } else {
            alert('Unable to find the bottle count variable.');
        }
    });
})();