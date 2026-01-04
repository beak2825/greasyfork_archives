// ==UserScript==
// @name         saveig 刪除 &dl=1
// @namespace    https://greasyfork.org/zh-TW/scripts/389420-saveig-%E5%88%AA%E9%99%A4-dl-1
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        https://saveig.com/*
// @match        https://saveig.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389420/saveig%20%E5%88%AA%E9%99%A4%20dl%3D1.user.js
// @updateURL https://update.greasyfork.org/scripts/389420/saveig%20%E5%88%AA%E9%99%A4%20dl%3D1.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Your code here...
//https://www.itranslater.com/qa/details/2134787770995442688
// document.body.innerHTML = document.body.innerHTML.replace(/要替換的文本/g, '替換後的文本');
window.onload = function() {
document.body.innerHTML = document.body.innerHTML.replace(/cdninstagram.com&amp;dl=1/g, 'cdninstagram.com');
document.body.innerHTML = document.body.innerHTML.replace(/&amp;dl=1/g, '');
}})();
