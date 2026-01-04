// ==UserScript==
// @name         自定义样式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给脚本“根据番号快速搜索自定义样式”
// @author       qxin
// @match        *://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/450705/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/450705/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("" +
        // 菜单里的边框颜色
        "avdiv[data-visited]{" +
            "border: 2px solid #DC143C;" +
        "}" +
        "avdiv[data-visited='0']{" +
            "border-top: 2px solid #fff;" +
            "border-left: 2px solid #fff;" +
            "border-right: none;" +
            "border-bottom: none;" +
        "}" +
        "avdiv[data-visited='1']," +
        "avdiv[data-visited='2']," +
        "avdiv[data-visited='3']," +
        "avdiv[data-visited='4']{" +
            "border: 2px solid #9400D3;" +
        "}" +
        "avdiv[data-visited='5']," +
        "avdiv[data-visited='6']," +
        "avdiv[data-visited='7']," +
        "avdiv[data-visited='8']{" +
            "border: 2px solid #FF1493;" +
        "}" +
     "");
})();