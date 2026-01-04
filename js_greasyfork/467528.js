// ==UserScript==
// @name           百度贴吧重定向
// @version        1.2.4
// @namespace      malu2335
// @author         malu2335
// @description    重定向各类同素异形体到更科学的主域名tieba.baidu.com
// @match        http://tieba.baidu.com.cn/*
// @match        http://tieba.baidu.cn/*
// @match        http://post.baidu.*
// @match        http://xingqu.baidu.com/*
// @homepageURL    https://greasyfork.org/scripts/467528
// @match        http://dq.tieba.com/*
// @match          https://www.tieba.com/*
// @license      MIT

// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/467528/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/467528/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

//目前发现以下同素异形体
//http://tieba.baidu.com.cn
//http://tieba.baidu.cn
//http://post.baidu.cn
//http://post.baidu.com

document.location.host = "tieba.baidu.com";