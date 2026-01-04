// ==UserScript==
// @name         斗鱼右侧弹幕框加高
// @namespace    https://www.douyu.com/
// @version      0.3
// @description  斗鱼右侧弹幕框加高，显示更多弹幕内容
// @author       Gerald
// @match        https://*.douyu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/371244/%E6%96%97%E9%B1%BC%E5%8F%B3%E4%BE%A7%E5%BC%B9%E5%B9%95%E6%A1%86%E5%8A%A0%E9%AB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/371244/%E6%96%97%E9%B1%BC%E5%8F%B3%E4%BE%A7%E5%BC%B9%E5%B9%95%E6%A1%86%E5%8A%A0%E9%AB%98.meta.js
// ==/UserScript==

$(document).ready(f);

function f() {
    setTimeout(changeHeight, 3500);
}

function changeHeight() {
    $("div#js-player-barrage").css("top", "0px");
    $("div.layout-Player-rank").css("display", "none");
}