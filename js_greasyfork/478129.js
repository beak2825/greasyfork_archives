// ==UserScript==
// @name         屏蔽板块为求助的搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽搜索内容
// @author       You
// @match        https://laowang.vip/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=laowang.vip
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478129/%E5%B1%8F%E8%94%BD%E6%9D%BF%E5%9D%97%E4%B8%BA%E6%B1%82%E5%8A%A9%E7%9A%84%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/478129/%E5%B1%8F%E8%94%BD%E6%9D%BF%E5%9D%97%E4%B8%BA%E6%B1%82%E5%8A%A9%E7%9A%84%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Get all the <dt> and <dd> elements
    var dtElements = document.querySelectorAll('dt');
    var ddElements = document.querySelectorAll('dd');

    for (var i = 0; i < dtElements.length; i++) {
        var dtText = dtElements[i].textContent;
        var ddText = ddElements[i].textContent;

        // Check if the content contains "悬赏求助区" or "vip求助 [高悬赏]"
        if (dtText.includes("悬赏求助区") || ddText.includes("悬赏求助区") || dtText.includes("vip求助 [高悬赏]") || ddText.includes("vip求助 [高悬赏]")) {
            // Hide the <dt> and <dd> elements
            dtElements[i].style.display = 'none';
            ddElements[i].style.display = 'none';
        }
    }
})();