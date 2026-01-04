// ==UserScript==
// @name         天天游戏网免密钥获取资源
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  天天游戏网免除密钥获取资源
// @author       jflmao
// @match        *://kaihu123.cn/*
// @icon         https://kaihu123.cn/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453080/%E5%A4%A9%E5%A4%A9%E6%B8%B8%E6%88%8F%E7%BD%91%E5%85%8D%E5%AF%86%E9%92%A5%E8%8E%B7%E5%8F%96%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/453080/%E5%A4%A9%E5%A4%A9%E6%B8%B8%E6%88%8F%E7%BD%91%E5%85%8D%E5%AF%86%E9%92%A5%E8%8E%B7%E5%8F%96%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var m = "m=1";
    var ca = document.cookie;
    if (ca.indexOf(m)==-1) {
        var exp = new Date();
        exp.setTime(exp.getTime() + 24*60*60*1000);
        document.cookie = "m=1" + ";expires=" + exp.toGMTString();
        console.log("注入成功！");
        javascript:location.reload();
    }
})();