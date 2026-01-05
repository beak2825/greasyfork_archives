// ==UserScript==
// @name         ch_ftchinese_bg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change ftchinese background
// @author       wfifi <wfifi@163.com>
// @match        http://www.ftchinese.com/story/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24862/ch_ftchinese_bg.user.js
// @updateURL https://update.greasyfork.org/scripts/24862/ch_ftchinese_bg.meta.js
// ==/UserScript==
function chbg(){
    document.body.background = "#000";
}

chbg();