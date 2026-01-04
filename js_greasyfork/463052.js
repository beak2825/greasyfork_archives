// ==UserScript==
// @name 修复“编程随想（阮晓寰）”部落格评论无法显示及评论的问题
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 修复编程随想博客加载评论出错的问题
// @author program-think
// @match https://program-think.blogspot.com/*
// @run-at document-start
// @icon https://www.google.com/s2/favicons?sz=64&domain=blogspot.com
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/463052/%E4%BF%AE%E5%A4%8D%E2%80%9C%E7%BC%96%E7%A8%8B%E9%9A%8F%E6%83%B3%EF%BC%88%E9%98%AE%E6%99%93%E5%AF%B0%EF%BC%89%E2%80%9D%E9%83%A8%E8%90%BD%E6%A0%BC%E8%AF%84%E8%AE%BA%E6%97%A0%E6%B3%95%E6%98%BE%E7%A4%BA%E5%8F%8A%E8%AF%84%E8%AE%BA%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/463052/%E4%BF%AE%E5%A4%8D%E2%80%9C%E7%BC%96%E7%A8%8B%E9%9A%8F%E6%83%B3%EF%BC%88%E9%98%AE%E6%99%93%E5%AF%B0%EF%BC%89%E2%80%9D%E9%83%A8%E8%90%BD%E6%A0%BC%E8%AF%84%E8%AE%BA%E6%97%A0%E6%B3%95%E6%98%BE%E7%A4%BA%E5%8F%8A%E8%AF%84%E8%AE%BA%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
'use strict';

const original = HTMLAnchorElement.prototype.getAttribute;
HTMLAnchorElement.prototype.getAttribute = function(name) {
if (name === 'href') {
let link = original.call(this, name);
let start = link ? link.indexOf('?po=') : -1;
if (start !== -1) {
let end = link.indexOf('&');
let postID = link.substring(start+4, end);
let newLink = link + "&postID=" + postID;
console.log(`source => ${link}, new => ${newLink}`);
link = newLink;
}

return link;
}

return original.call(this, name);
};
})();