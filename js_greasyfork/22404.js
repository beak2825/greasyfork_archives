// ==UserScript==
// @name:zh-CN   开发者头条自动跳转
// @name         toutiao jumper
// @namespace    http://gavinwork.space/
// @version      0.2
// @description:zh-cn  直接从头条上跳转到目的网站
// @description  jump direct to dest websites on toutiao.io
// @author       Gavin
// @match        http://toutiao.io/posts/*
// @run-at      document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22404/toutiao%20jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/22404/toutiao%20jumper.meta.js
// ==/UserScript==




var debug = true;
var count = 0;

var loc = window.location.href;
var jump_loc = loc.replace(/posts/,'j');
debug && console.log("origin url is", loc);
debug && console.log("jump url is", jump_loc);
window.location.href = jump_loc;