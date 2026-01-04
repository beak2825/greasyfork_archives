// ==UserScript==
// @name         Fanicon Style Mod
// @namespace    https://github.com/AyeBee/FaniconStyleMod
// @version      0.1
// @description  Faniconの画面構成を最適化します。
// @author       ayebee
// @match        https://fanicon.net/web/*
// @match        https://fanicon.net/web/fancommunities/*/live/*
// @icon         https://www.google.com/s2/favicons?domain=fanicon.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444507/Fanicon%20Style%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/444507/Fanicon%20Style%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.getElementsByTagName('head')[0].appendChild(document.createElement('style'));
    style.id = '__userStyle';
    style.textContent =`
    .main {
        max-width: inherit !important;
    }
    .main-container {
        width: auto !important;
    }
    div.main > div.live-view.main-container > div > div > div > div > div.control-area {
        background: rgba(0,0,0,.5);
        border-radius: 5px;
        padding: 0 !important;
    }
    div.main > div.live-view.main-container > div > div > div > div > div.control-area,
    div.main > div.live-view.main-container > div > div > div > div > div.overlay-area > div.info-area,
    div.main > div.live-view.main-container > div > div > div > div > div.overlay-area > div.input-area {
        opacity: 0;
        transition: all 300ms 0s ease;
    }
    div.main > div.live-view.main-container > div > div > div > div > div.control-area:hover,
    div.main > div.live-view.main-container > div > div > div > div > div.overlay-area > div.info-area:hover,
    div.main > div.live-view.main-container > div > div > div > div > div.overlay-area > div.input-area:hover {
        opacity: 1;
    }
    body > main > .live-view > .wrap {
        min-width: 100%;
        height: 100%;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255,.25);
        border-radius: 10px;
        box-shadow:0 0 0 1px rgba(0,0,0,.3);
    }
    `;
})();
