// ==UserScript==
// @name         Text Direction Selector
// @name:ar      محدد اتجاه النص
// @name:fr      Sélecteur de direction du texte
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Create a sliding button to change text direction between RTL and LTR with improved behavior
// @description:ar  أنشئ زرًا منزلقًا لتغيير اتجاه النص بين من اليمين لليسار (RTL) ومن اليسار لليمين (LTR)
// @description:fr  Crée un bouton coulissant pour changer la direction du texte entre RTL et LTR avec un comportement amélioré
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516322/Text%20Direction%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/516322/Text%20Direction%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //# Define the elements to apply the direction
  /*const elements = `
        html, body, center, a, i, h1, h2, h3, h4, h5, h6, p, li, span, ul, td, tr, th, div, strong, button,
        path, svg, main, footer, nav, section, time, use, defs, symbol, table, br, header, form, select
    `;*/

    // Create a floating button
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.left = '-40px';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.borderRadius = '50%';
    buttonContainer.style.width = '50px';
    buttonContainer.style.height = '50px';
    buttonContainer.style.backgroundColor = '#3498db';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.cursor = 'pointer';
    buttonContainer.style.color = 'white';
    buttonContainer.style.fontSize = '20px';
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.lineHeight = '50px';
    buttonContainer.style.opacity = '0.8';
    buttonContainer.style.transition = 'left 0.3s ease';
    buttonContainer.innerHTML = '⇔';
    document.body.appendChild(buttonContainer);

    // LTR and RTL buttons
    var ltrButton = document.createElement('div');
    ltrButton.innerText = 'LTR';
    ltrButton.style.padding = '10px';
    ltrButton.style.cursor = 'pointer';
    ltrButton.style.backgroundColor = '#2ecc71';
    ltrButton.style.color = 'white';
    ltrButton.style.borderRadius = '5px';
    ltrButton.style.marginBottom = '5px';
    ltrButton.style.textAlign = 'center';
    ltrButton.style.display = 'none';
    buttonContainer.insertBefore(ltrButton, buttonContainer.firstChild);

    var rtlButton = document.createElement('div');
    rtlButton.innerText = 'RTL';
    rtlButton.style.padding = '10px';
    rtlButton.style.cursor = 'pointer';
    rtlButton.style.backgroundColor = '#e74c3c';
    rtlButton.style.color = 'white';
    rtlButton.style.borderRadius = '5px';
    rtlButton.style.textAlign = 'center';
    rtlButton.style.display = 'none';
    buttonContainer.appendChild(rtlButton);

    // Toggle button position on click
    buttonContainer.addEventListener('click', function(event) {
        event.stopPropagation();
        if (buttonContainer.style.left === '-40px') {
            buttonContainer.style.left = '37px';
            rtlButton.style.display = 'block';
            ltrButton.style.display = 'block';
        } else {
            buttonContainer.style.left = '-40px';
            rtlButton.style.display = 'none';
            ltrButton.style.display = 'none';
        }
    });

    //# Function to set text direction on specified elements
  /*function setDirection(direction) {
        const styleElement = document.getElementById('direction-style') || document.createElement('style');
        styleElement.id = 'direction-style';
        styleElement.innerHTML = `${elements} { direction: ${direction}; text-align: ${direction === 'rtl' ? 'right' : 'left'}; }`;
        document.head.appendChild(styleElement);
    }*/

    //! Function to set text direction on the whole document
    function setDirection(direction) {
        document.documentElement.style.direction = direction;
        document.documentElement.style.textAlign = direction === 'rtl' ? 'right' : 'left';
    }

    // Apply RTL direction on click
    rtlButton.addEventListener('click', function() {
        setDirection('rtl');
    });

    // Apply LTR direction on click
    ltrButton.addEventListener('click', function() {
        setDirection('ltr');
    });

    // Hide options on outside click
    document.addEventListener('click', function(event) {
        if (!buttonContainer.contains(event.target)) {
            buttonContainer.style.left = '-40px';
            rtlButton.style.display = 'none';
            ltrButton.style.display = 'none';
        }
    });
})();

