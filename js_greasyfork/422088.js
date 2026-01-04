// ==UserScript==
// @name         ZodGame-首页精简显示
// @namespace    https://zodgame.xyz/home.php?mod=space&uid=294326
// @version      1.0
// @description  将zod首页的轮播、排行版、热帖版块屏蔽掉
// @author       未知的动力
// @match        https://zodgame.xyz/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/422088/ZodGame-%E9%A6%96%E9%A1%B5%E7%B2%BE%E7%AE%80%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/422088/ZodGame-%E9%A6%96%E9%A1%B5%E7%B2%BE%E7%AE%80%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const headEle = document.head;
    const styleEle = document.createElement("style");
    const topListStyleText = document.createTextNode(`#toplistbox_7ree {display: none !important;}`);
    const topBtnStyleText = document.createTextNode(`div.mn img#category__img {display: none !important;}`);
    styleEle.append(topListStyleText, topBtnStyleText);
    headEle.append(styleEle);
})();