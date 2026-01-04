// ==UserScript==
// @name:zh-CN   今日头条不跳转
// @name         toutiao Stopjump
// @version      0.2
// @description:zh-cn  浏览新闻只在今日头条里不跳转到外站
// @description  stop jump 
// @author       colaice
// @match        https://www.toutiao.com/group/*
// @run-at      document-start
// @grant        none
// @namespace https://greasyfork.org/users/21217
// @downloadURL https://update.greasyfork.org/scripts/372367/toutiao%20Stopjump.user.js
// @updateURL https://update.greasyfork.org/scripts/372367/toutiao%20Stopjump.meta.js
// ==/UserScript==

var loc = window.location.href;
var jump_loc = loc.replace('group/','/a');
window.location.href = jump_loc;