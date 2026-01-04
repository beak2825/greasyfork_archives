// ==UserScript==
// @name         Eink-UpDown
// @namespace    https://greasyfork.org/users/169007
// @version      1.2.1
// @description  Disable animation and add up and down button
// @author       ZZYSonny
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/432700/Eink-UpDown.user.js
// @updateURL https://update.greasyfork.org/scripts/432700/Eink-UpDown.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const body = document.body;
    const positionCSS = "bottom:0;right:0";
    const sizeCSS = "width:15vmin;height:30vmin";
    const scrollRatio = 0.9;

    const Container = document.createElement("div");
    Container.style.cssText = `
        ${sizeCSS};
        ${positionCSS};
        position:fixed;
        display:flex;
        flex-direction:column;
        border-style:dashed;
        z-index:2147483647;
        border-width:2px;
    `;

    const UpButton = document.createElement("div");
    UpButton.style.cssText = "flex:1";
    UpButton.addEventListener('click', () => { window.scrollBy(0, -scrollRatio * window.innerHeight) });

    const DownButton = document.createElement("div");
    DownButton.style.cssText = "flex:1;border-top-style:dashed;border-width:2px;";
    DownButton.addEventListener('click', () => { window.scrollBy(0, scrollRatio * window.innerHeight) });

    Container.appendChild(UpButton);
    Container.appendChild(DownButton);
    body.appendChild(Container);
})();