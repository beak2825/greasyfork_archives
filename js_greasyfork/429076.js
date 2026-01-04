// ==UserScript==
// @name         Tab Counter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  You
// @author       You
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429076/Tab%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/429076/Tab%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tempIndex = null;
    document.addEventListener('keydown', function({ code, altKey }) {
        if (code === 'KeyQ' && altKey)
            tempIndex = Hook.Module.HEAPF32.indexOf(1250)
    });

    setInterval(function() {
        if (!tempIndex || tempIndex == -1) return;
        const bottomY = Hook.Module.HEAPF32[tempIndex];

        let WidthInGrid = (bottomY * 2) / 50;
        let tabCount = WidthInGrid / 50;
        tabCount = Math.round(Math.pow(tabCount, 2));

        GUI.innerHTML = `Current Tab Count: ${tabCount}`;
    }, 150);

    const GUI = document.createElement("div");
    GUI.style = `pointer-events: none; position: fixed; top:87%; left:10px; font-family: Ubuntu; color: #FFFFFF; font-style: normal; font-size: 17px;  text-shadow: black 2px 0px, black -2px 0px, black 0px -2px, black 0px 2px, black 2px 2px, black -2px 2px, black 2px -2px, black -2px -2px, black 1px 2px, black -1px 2px, black 1px -2px, black -1px -2px, black 2px 1px, black -2px 1px, black 2px -1px, black -2px -1px;`;
    document.body.appendChild(GUI);
    GUI.innerHTML = 'Current Tab Count: Invalid Memory Pointer';
})();