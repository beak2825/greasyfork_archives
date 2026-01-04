// ==UserScript==
// @name         Synchronized Bau Bau
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       You
// @description  The script to enable synchronized Bau Baus once and for all!
// @match        https://fwmcbaubau.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fwmcbaubau.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492973/Synchronized%20Bau%20Bau.user.js
// @updateURL https://update.greasyfork.org/scripts/492973/Synchronized%20Bau%20Bau.meta.js
// ==/UserScript==

GM_addStyle ( `
.button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dog-heads {
    display: flex;
}

.baubaubutton {
    background: linear-gradient(90deg, rgba(128,231,255,1) 0%, rgba(240,224,255,1) 50%, rgba(255,140,188,1) 100%);
    opacity: 0.8;
    font: inherit;
    width: 100%;
    margin-top: 10px;
    padding: 15px;
    border: none;
    border-radius: 12px;
}

.overlay {
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 0.1;
    z-index: -1;
}
` );

window.addEventListener('load', function() {
    'use strict';

    const buttonContainer = document.querySelector('.button-container');
    const fuwawa = document.querySelector('#fuwawa');
    const mococo = document.querySelector('#mococo');

    function init() {
        if (!fuwawa || !mococo) return(console.error('The dogs are missing.'));
        if (!buttonContainer) return(console.error('Button container not found'));
        addOverlay();
        groupDogHeads();
        addBauBauButton();
    }

    // Adds the double Bau Bau Button!!!
    function addBauBauButton() {
        let theButton = document.createElement('button');
        theButton.textContent = 'Bau Bau Together!';
        theButton.classList.add('baubaubutton');
        theButton.addEventListener('click', () => fuwawa.click());
        theButton.addEventListener('click', () => mococo.click());
        buttonContainer.appendChild(theButton);
    }

    function groupDogHeads() {
        let dogHeads = document.createElement('div');
        dogHeads.classList.add('dog-heads');
        buttonContainer.appendChild(dogHeads);
        dogHeads.appendChild(fuwawa);
        dogHeads.appendChild(mococo);
    }

    // Makes the background slightly darker. Can be changed to other colors/opacity using CSS.
    function addOverlay() {
        let overlay = document.createElement('overlay');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);
    }

    init();
}, false)();