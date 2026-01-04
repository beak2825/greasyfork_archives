// ==UserScript==
// @name         Factorio mod downloader
// @namespace    nipsuontop
// @version      1.1
// @description  Download mods from mods.factorio.com for free
// @author       Ruhto
// @match        https://mods.factorio.com/mod/*
// @icon         https://steamuserimages-a.akamaihd.net/ugc/793135197243665662/A9845DE547208C8293F60FB84B241C65A418E4B4/?imw=128&imh=128&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515071/Factorio%20mod%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/515071/Factorio%20mod%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const modUrlMatch = location.href.match(/^https:\/\/mods\.factorio\.com\/mod\/([^\/]+)/);
    if (!modUrlMatch) {
        return;
    }
    const modName = modUrlMatch[1];


    const loggedInButtons = document.querySelectorAll('.mod-download-section .mod-download-button a.button-green');
    for (const button of loggedInButtons) {

        if (button.innerText.trim() !== 'Download' || !button.classList.contains('disabled')) {
            continue;
        }


        button.innerText = 'Download';
        button.classList.remove('disabled');
        button.setAttribute('target', '_blank');
        button.setAttribute('title', '');
        button.setAttribute('href', `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}`);
    }


    const buttons = document.getElementsByClassName('btn mod-download-button btn-download');
    for (const button of buttons) {
        if (button.innerText.trim() !== 'Download') {
            continue;
        }
        if (!button.getAttribute('href').startsWith('/login?next=')) {
            continue;
        }
        if (button.parentElement.tagName === 'DIV') {
            button.innerText = 'Download';
            button.setAttribute('target', '_blank');
            button.setAttribute('href', `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}`);
        } else if (button.parentElement.tagName === 'TD') {
            const version = button.parentElement.parentElement.children[0].innerText;
            button.innerText = 'Download';
            button.setAttribute('target', '_blank');
            button.setAttribute('href', `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}#${version}`);
        }
    }
})();
