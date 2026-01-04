// ==UserScript==
// @name         Eorzea NGA
// @namespace    https://bbs.nga.cn/
// @version      0.3
// @description  try to take over the world!
// @author       Bluefissure
// @match        https://bbs.nga.cn/*
// @match        https://ngabbs.com/*
// @match        https://nga.178.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/392766/Eorzea%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/392766/Eorzea%20NGA.meta.js
// ==/UserScript==

(function() {
    document.getElementsByClassName("logo")[0].firstElementChild.style.backgroundImage = "url('https://i.loli.net/2019/11/22/xFzYMXbyQSkDAmu.png')";
})();