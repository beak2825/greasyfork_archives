// ==UserScript==
// @name         SteamCN Remember Last Search Mode
// @namespace    maboroshi
// @version      0.3
// @description  try to take over the world!
// @author       maboroshi
// @match        *://steamcn.com/*
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/40329/SteamCN%20Remember%20Last%20Search%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/40329/SteamCN%20Remember%20Last%20Search%20Mode.meta.js
// ==/UserScript==
(async function () {
    'use strict';
    let ModeNamePairs = {
        'forum': '帖子',
        'user': '用户',
        'google': 'Google',
        'baidu': '百度',
    };
    for (let mode in ModeNamePairs) {
        AddEvent(mode);
    }
    let Steamcn_LastMode = await GM.getValue('Steamcn_LastMode', 'baidu');
    document.querySelector('.search-bar-form .dropdown .btn span:first-child').textContent = ModeNamePairs[Steamcn_LastMode];
    document.querySelector('.search-bar-form input[name="mod"]').value = Steamcn_LastMode;
    function AddEvent(mode) {
        document.querySelector(`a[data-mod="${mode}"]`).addEventListener('click', () => GM.setValue('Steamcn_LastMode', mode));
    }
})();
