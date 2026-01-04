// ==UserScript==
// @name         Factorio Free Mods Downloader
// @namespace    https://re146.dev/
// @version      1.1
// @description  Changes all the links for download on https://mods.factorio.com/ if you haven't authorized
// @author       You
// @match        https://mods.factorio.com/mod/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=re146.dev/factorio/mods
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442955/Factorio%20Free%20Mods%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/442955/Factorio%20Free%20Mods%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modUrlMatch = location.href.match(/^https:\/\/mods\.factorio\.com\/mod\/([^\/]+)/);
    if (!modUrlMatch) {
        return;
    }
    const modName = modUrlMatch[1];

    const buttons = document.getElementsByClassName('button-green');
    for (const button of buttons) {
        if (button.innerText.trim() !== 'Download') {
            continue;
        }
        if (!button.getAttribute('href').startsWith('/login?next=')) {
            continue;
        }
        if (button.parentElement.tagName === 'DIV') {
            button.innerText = 'Download from re146.dev';
            button.setAttribute('target', '_blank');
            button.setAttribute('href', `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}`);
        } else if (button.parentElement.tagName === 'TD') {
            button.innerText = 'Download from re146.dev';
            button.setAttribute('target', '_blank');
            const version = button.parentElement.parentElement.children[0].innerText;
            button.setAttribute('href', `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}#${version}`);
        }
    }
})();