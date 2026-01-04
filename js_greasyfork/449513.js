// ==UserScript==
// @name         贴吧重定向
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0
// @version      0.3
// @description  重定向各类同素异形体到更科学的主域名tieba.baidu.com
// @author       ykiZheng
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @match          http*://tieba.baidu.com.cn/*
// @match          http*://tieba.baidu.cn/*
// @match          http*://www.tieba.com/*
// @match          http*://c.tieba.baidu.com/*
// @match          http*://c.tieba.baidu.com/p/*
// @match          http*://post.baidu.com/*
// @match          http*://post.baidu.cn/*
// @match          http*://jump2.bdimg.com/*
// @match          http*://live.baidu.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/449513/%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/449513/%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

window.location.replace(location.href.replace(location.hostname, "tieba.baidu.com"));