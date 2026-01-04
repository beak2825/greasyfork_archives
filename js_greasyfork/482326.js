// ==UserScript==
// @name         Factorio Free Mods Downloader 2
// @namespace    https://re146.dev
// @version      2.0
// @description  Changes all the links for download on https://mods.factorio.com/ if you haven't authorized
// @author       Kopie_Miya & re146
// @match        https://mods.factorio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=re146.dev/factorio/mods
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482326/Factorio%20Free%20Mods%20Downloader%202.user.js
// @updateURL https://update.greasyfork.org/scripts/482326/Factorio%20Free%20Mods%20Downloader%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttons = document.getElementsByClassName('button-green');
    for (const button of buttons) {
        if (button.innerText.trim() !== 'Download') {
            continue;
        }
        if (!button.getAttribute('href').startsWith('/login?next=')) {
            continue;
        }
        if (button.parentElement.tagName === 'DIV') {
            const url =button.getAttribute('href').substring(17);
            const modName =url;
            button.innerText = 'Download from re146.dev';
            button.setAttribute('target', '_blank');
            button.setAttribute('href', `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}`);
        } 
    }
})();
