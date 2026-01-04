// ==UserScript==
// @name         Nexus Mod 助手
// @author       岚浅浅
// @description  浏览网页时, 自动在 Nexus Mod 的超链接之后显示该 mod 的 Nexus ID
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/LanQianqian/greasyForkScripts
// @version      1.0.0
// @include      *
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/underscore.js/1.13.1/underscore.min.js
// @downloadURL https://update.greasyfork.org/scripts/439737/Nexus%20Mod%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439737/Nexus%20Mod%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// jshint esversion: 6

$(function () {
    let hyperlinks = $('a');
    for (let hyperlink of hyperlinks) {
        let href = $(hyperlink).attr('href');
        if (!href) {
            continue;
        }
        let matches = href.match(/.*www.nexusmods.com\/.*\/mods\/(\d+).*/);
        if (!matches) {
            continue;
        }
        let nexusId = matches[1];
        $(hyperlink).after(' [' + nexusId + ']');
    }
});
