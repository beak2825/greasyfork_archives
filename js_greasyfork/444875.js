// ==UserScript==
// @name         微博自动刷新
// @description  30s自动刷新。注意，需要在隐身/无痕模式下运行
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @license      MIT
// @match        *://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444875/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/444875/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

setTimeout(function(){ location.reload(); }, 30* 1000);