// ==UserScript==
// @name         Infinite Craft - Clipboard Save/Load
// @namespace    http://ow0.me/infinite
// @version      v3
// @description  Modified from code by @Andrew_Haine. Saves your stuff to clipboard so you can transfer it across devices.
// @author       Ina'
// @match        https://neal.fun/*
// @icon         https://ow0.me/infinite/icon48.png
// @icon64       https://ow0.me/infinite/icon64.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://neal.fun/_nuxt/992eef7.js
// @require      https://neal.fun/_nuxt/dcc1889.js
// @run-at       document-idle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486544/Infinite%20Craft%20-%20Clipboard%20SaveLoad.user.js
// @updateURL https://update.greasyfork.org/scripts/486544/Infinite%20Craft%20-%20Clipboard%20SaveLoad.meta.js
// ==/UserScript==

// note - the icon may be moved to n-o.one

const buttonStyle = {
    appearance: 'none',
    position: 'absolute',
    width: '80px',
    height: '35px',
    backgroundColor: '#1A1B31',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Roboto,sans-serif',
    border: '0',
    outline: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: 4,
}

const init = () => {
    const container = document.querySelector('.container');

    const saveButton = document.createElement('button');
    const restoreButton = document.createElement('button');

    Object.keys(buttonStyle).forEach((attr) => {
        saveButton.style[attr] = buttonStyle[attr];
        restoreButton.style[attr] = buttonStyle[attr];
    });

    saveButton.style.bottom = '24px';
    saveButton.style.left = '24px';
    restoreButton.style.bottom = '24px';
    restoreButton.style.left = '120px';

    saveButton.innerText = 'Copy';
    restoreButton.innerText = 'Load';

    var that = unsafeWindow.$nuxt.$children[2].$children[0].$children[0].$data;

    const saveElements = () => {
        window.prompt("Copy this text:", JSON.stringify({elements : that.elements, discoveries : that.discoveries}));
    }

    const restoreElements = () => {
        const stored = JSON.parse(window.prompt("Paste your save here", ""));
        if (stored?.elements?.length > 4) {
            that.elements = stored.elements;
            that.discoveries = stored.discoveries
        } else {
            window.alert("Invalid input (must be a JSON list of length greater than 4.");
        }
    }

    saveButton.addEventListener('click', () => saveElements());
    restoreButton.addEventListener('click', () => restoreElements());

    container.appendChild(saveButton);
    container.appendChild(restoreButton);
}

var yuri = () => {
    'use strict';
    init();
}

window.addEventListener("load", yuri);