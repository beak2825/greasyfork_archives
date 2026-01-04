// ==UserScript==
// @name         Factorio Mod Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A shortcut script link to https://1488.me/factorio/mods/
// @author       Q.Z.Lin
// @match        https://mods.factorio.com/mod/*
// @icon         https://wiki.factorio.com/images/thumb/Iron_gear_wheel.png/32px-Iron_gear_wheel.png
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439160/Factorio%20Mod%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/439160/Factorio%20Mod%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let downloadBtn = document.querySelector("body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.panel-inset.m0.w100.p4 > div > div.text-right.flex.flex-items-center.flex-end > div.btn.mod-download-button.btn-download");
    let directDownload = $(downloadBtn).clone()
    directDownload.children().text("1488me")
    directDownload.children().attr("href","https://1488.me/factorio/mods/#"+window.location.href)
    $(downloadBtn).parent().append(directDownload)
})();

$(window).on("load", function () {
    // Handler when all assets (including images) are loaded
});