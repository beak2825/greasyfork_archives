// ==UserScript==
// @name         Block Gamepedia Banners
// @namespace    us.abluescarab.blockgamepediapronotice
// @version      1.0
// @description  Removes banners on Gamepedia when adblock is on.
// @author       abluescarab
// @match        http://*.gamepedia.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/21804/Block%20Gamepedia%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/21804/Block%20Gamepedia%20Banners.meta.js
// ==/UserScript==

var topId = "atflb";
var botId = "btflb";
var noticeId = "siteNotice";

(function() {
    'use strict';

    var at = document.getElementById(topId);
    var bt = document.getElementById(botId);
    var nc = document.getElementById(noticeId);

    remove(at);
    remove(bt);
    remove(nc);
})();

function remove(elem) {
    elem.parentNode.removeChild(elem);
}