// ==UserScript==
// @name         Factorio Free Mods Downloader for the search page
// @namespace    https://re146.dev/
// @version      1.0
// @description  Edit of re146 userscript that also applies the changes to the search page. Only works on tampermonkey to my knowledge as it uses window.onurlchange.
// @author       You
// @match        https://mods.factorio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=re146.dev/factorio/mods
// @license      MIT
// @run-at       document-end
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/536594/Factorio%20Free%20Mods%20Downloader%20for%20the%20search%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/536594/Factorio%20Free%20Mods%20Downloader%20for%20the%20search%20page.meta.js
// ==/UserScript==

const loadit = function() {
    'use strict';

    const myUrlMatch = location.href.match(/^https:\/\/mods\.factorio\.com\/([^\/]+)/);
    if (myUrlMatch) {
        const buttons = document.getElementsByClassName('button-green');
        for (const button of buttons) {
            if (button.innerText.trim() !== 'Download') {
                continue;
            }
            if (!button.getAttribute('href').startsWith('/login?next=')) {
                continue;
            }
            const refArr = button.getAttribute('href').split('/');
            const modName = refArr[refArr.length-1];
            if (button.parentElement.tagName === 'DIV') {
                button.innerText = 'Download from re146.dev';
                button.setAttribute('target', '_blank');
                button.setAttribute('href', `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}`);
            }
        }
        return;
    }
};

loadit();
window.addEventListener("urlchange", loadit);








