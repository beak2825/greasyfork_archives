// ==UserScript==
// @name        巴哈姆特 不要摺疊文章
// @namespace   https://greasyfork.org/scripts/441770
// @version     1.0
// @description 自動點擊展開文章按紐 不要摺疊文章
// @author      fmnijk
// @match       https://forum.gamer.com.tw/*
// @icon        https://www.google.com/s2/favicons?domain=forum.gamer.com.tw
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441770/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E4%B8%8D%E8%A6%81%E6%91%BA%E7%96%8A%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/441770/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E4%B8%8D%E8%A6%81%E6%91%BA%E7%96%8A%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(window.onload = function() {
	'use strict'

    /* $ and $$ */
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    $(".c-disable > a").click();
})()
