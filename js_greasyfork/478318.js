// ==UserScript==
// @name         百度贴吧域名重定向
// @namespace    https://greasyfork.org/users/1204387
// @version      0.1.8
// @description  将百度贴吧的其他域名重定向至“tieba.baidu.com”。
// @author       Gentry Deng
// @match        http*://14.215.177.221/*
// @match        http*://182.61.201.157/*
// @match        http*://live.baidu.com/f/*
// @match        http*://live.baidu.com/f?*
// @match        http*://live.baidu.com/home/*
// @match        http*://live.baidu.com/p/*
// @match        http*://nani.baidu.com/*
// @match        http*://c.tieba.baidu.com/*
// @match        http*://*.tieba.baidu.com/f/*
// @match        http*://*.tieba.baidu.com/f?*
// @match        http*://*.tieba.baidu.com/home/*
// @match        http*://*.tieba.baidu.com/p/*
// @match        http*://tiebac.baidu.com/*
// @match        http*://wefan.baidu.com/*
// @match        http*://youhua.baidu.com/*
// @match        http*://jump.bdimg.com/*
// @match        http*://jump*.bdimg.com/*
// @match        http*://www.tieba.com/*
// @exclude      http*://jump*.bdimg.com/safecheck/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478318/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/478318/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.hostname != "tieba.baidu.com") {
        window.location.hostname = "tieba.baidu.com";
    }
})();