// ==UserScript==
// @name         NGA玩家社区论坛域名重定向
// @namespace    https://greasyfork.org/users/1204387
// @version      0.1.3
// @description  将NGA玩家社区论坛的其他域名重定向至“bbs.nga.cn”。
// @author       Gentry Deng
// @match        http*://g.nga.cn/*
// @match        http*://nga.178.com/*
// @match        http*://ngabbs.com/*
// @icon         https://bbs.nga.cn/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478329/NGA%E7%8E%A9%E5%AE%B6%E7%A4%BE%E5%8C%BA%E8%AE%BA%E5%9D%9B%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/478329/NGA%E7%8E%A9%E5%AE%B6%E7%A4%BE%E5%8C%BA%E8%AE%BA%E5%9D%9B%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.hostname != "bbs.nga.cn") {
        window.location.hostname = "bbs.nga.cn";
    }
})();