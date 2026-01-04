// ==UserScript==
// @name 编程随想的博客评论区修复
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 编程随想博客评论区修复
// @author 热心网友
// @match https://program-think.blogspot.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=blogspot.com
// @run-at document-body
// @grant none
// @license The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/450470/%E7%BC%96%E7%A8%8B%E9%9A%8F%E6%83%B3%E7%9A%84%E5%8D%9A%E5%AE%A2%E8%AF%84%E8%AE%BA%E5%8C%BA%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/450470/%E7%BC%96%E7%A8%8B%E9%9A%8F%E6%83%B3%E7%9A%84%E5%8D%9A%E5%AE%A2%E8%AF%84%E8%AE%BA%E5%8C%BA%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
'use strict';
$(document).ready(function() {
let str = $('a#comment-editor-src').attr('href');
if (str) {
let postID = str.match(/po=(\d+)/)[1]
$('a#comment-editor-src').attr('href', `${str}&postID=${postID}`);
}
});
})();