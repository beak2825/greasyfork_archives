// ==UserScript==
// @name         Baidu Encyclopedia to wikipedia
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在百度百科中添加跳转到维基百科的按钮。
// @include        http://baike.baidu.com/*
// @include        https://baike.baidu.com/*
// @author       You
// @match        *://baike.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20134/Baidu%20Encyclopedia%20to%20wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/20134/Baidu%20Encyclopedia%20to%20wikipedia.meta.js
// ==/UserScript==

(function() {
    $('#searchForm > #search').after('<button class="wiki" type="button">维基百科</button>');
    $('.wiki').on({
        click: function () {
            window.open("https://zh.wikipedia.org/wiki/" + $('#query') .val());
            return false;
        }
    });
})();