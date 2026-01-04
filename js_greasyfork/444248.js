// ==UserScript==
// @name         Fuck Baidu
// @version      0.11a
// @description  屏蔽百度热搜
// @author       DJJ
// @match        *://www.baidu.com/*
// @grant        none
// @license       GPL v2
// @namespace https://greasyfork.org/users/908858
// @downloadURL https://update.greasyfork.org/scripts/444248/Fuck%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/444248/Fuck%20Baidu.meta.js
// ==/UserScript==
(function () {
    var div1 = '#content_right';
    var div2 = '#s-hotsearch-wrapper';
    document.addEventListener('DOMContentLoaded', function () {
        $(div1).hide();
    });
    document.addEventListener('DOMSubtreeModified', function () {
        $(div1).hide();
    });
    document.addEventListener('DOMContentLoaded', function () {
        $(div2).hide();
    });
    document.addEventListener('DOMSubtreeModified', function () {
        $(div2).hide();
    });
})();