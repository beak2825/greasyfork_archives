// ==UserScript==
// @name         今日热榜 紧凑排版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  今日热榜 紧凑排版!
// @author       Leon
// @match        *://tophub.today/c/*
// @match        *://tophub.today/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tophub.today
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/453255/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%20%E7%B4%A7%E5%87%91%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/453255/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%20%E7%B4%A7%E5%87%91%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

(function() {
	
    $(".cq").remove();

    $(".I-J").css({"left":"5%", "right":"0%", "width":"400px"});

    $(".I-J").after($(".kb-lb-ib-hb"));

    $(".kb-lb-ib-hb").css({"position":"absolute","left":"25%"});

    $("#tabbar").remove();

    $(".c-d").css({"padding-top":"10px"});

    $(".alert").hide()

})();