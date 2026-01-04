// ==UserScript==
// @name         百度网盘 自动跳转旧版
// @namespace    https://pzwboy.top/
// @version      1.0.0
// @description  百度网盘（桌面网页版）自动从新版界面跳转为更加简洁的旧版界面
// @author       Pzwboy
// @match        https://pan.baidu.com/disk/main*
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496753/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/496753/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.location.replace("https://pan.baidu.com/disk/home?from=newversion&stayAtHome=true");
})();