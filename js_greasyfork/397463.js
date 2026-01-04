// ==UserScript==
// @name         自动更换简约导航背景
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动更换为bing每日一图
// @author       Kndy666
// @match        https://www.jianavi.com
// @requir       http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397463/%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%8D%A2%E7%AE%80%E7%BA%A6%E5%AF%BC%E8%88%AA%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/397463/%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%8D%A2%E7%AE%80%E7%BA%A6%E5%AF%BC%E8%88%AA%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

$(document).ready(function () {
        document.body.style.backgroundImage="url(https://bing.ioliu.cn/v1?w=" + window.screen.width + "&h=" + window.screen.height + ")";
    });