// ==UserScript==
// @name        To Japanese Mods Database
// @namespace   mikanNsjd
// @version     7.0
// @description SteamのRimWorldワークショップ、NexusmodsのSkyrim、Fallout、MB2 Bannerlord、Cyberpunk2077、Starfield、Oblivion Remasteredのページに、日本語MODデータベースへのリンクを追加します
// @author      mikan-megane
// @grant       none
// @match       https://*.nexusmods.com/skyrim/mods/*
// @match       https://*.nexusmods.com/skyrimspecialedition/mods/*
// @match       https://*.nexusmods.com/fallout4/mods/*
// @match       https://*.nexusmods.com/fallout76/mods/*
// @match       https://*.nexusmods.com/mountandblade2bannerlord/mods/*
// @match       https://*.nexusmods.com/cyberpunk2077/mods/*
// @match       https://*.nexusmods.com/starfield/mods/*
// @match       https://*.nexusmods.com/oblivionremastered/mods/*
// @match       https://steamcommunity.com/sharedfiles/filedetails/*
// @match       https://steamcommunity.com/workshop/filedetails/*
// @downloadURL https://update.greasyfork.org/scripts/12259/To%20Japanese%20Mods%20Database.user.js
// @updateURL https://update.greasyfork.org/scripts/12259/To%20Japanese%20Mods%20Database.meta.js
// ==/UserScript==
(function () {
    let url;
    if (location.hostname === 'steamcommunity.com') {
        if (document.querySelector('.apphub_AppName').textContent === 'RimWorld') {
            url = location.search.match(/id=(\d+)/);
            if (url !== null) {
                if (document.querySelector('#rightContents .sidebar') !== null) {
                    document.querySelector('#rightContents .sidebar').insertAdjacentHTML('beforebegin', '<div class="panel"><a class="btnv6_blue_hoverfade btn_medium" target="_blank" href="https://rimworld.2game.info/detail.php?id=' + url[1] + '"><span>RimWorld Mod データベース</span></a></div>');
                }
            }
        }
    } else {
        url = location.pathname.match(/(.*)\/mods\/(\d+)/);
        if (url !== null) {
            let selector = document.querySelector(".modactions > li:first-child");
            if (document.querySelector(".modactions > .dllabel") !== null) {
                selector = document.querySelector(".modactions > .dllabel");
            }
            selector.insertAdjacentHTML('beforebegin', '<li id="action-jp"><a class="btn inline-flex" href="https://' + url[1] + '.2game.info/detail.php?id=' + url[2] + '"><span class="flag flag-Japanese" style="padding: 0.5em;padding-right: 15px;"></span> <span class="flex-label">日本語</span></a></li>');
        }
    }
}());