// ==UserScript==
// @name 超星学习通自动阅读脚本
// @namespace https://mooc1.chaoxing.com/
// @version 1
// @description 自动滚动并翻页，让系统认为你一直在阅读界面，刷阅读时长用的，适用于https://mooc1.chaoxing.com/course
// @author AI Bot
// @license MIT
// @match https://mooc1.chaoxing.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/463058/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/463058/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// MIT License

// Copyright (c) [year] [author]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function() {
'use strict';
// 滚动速度（毫秒）
const scrollSpeed = 3000;
// 翻页时间（秒）
const pageTime = 10;
// 自动滚动
setInterval(() => {
window.scrollBy(0, window.innerHeight);
}, scrollSpeed);
// 自动翻页
setInterval(() => {
const nextPage = document.querySelector('.nextBtn');
if (nextPage) {
nextPage.click();
} else {
const allDone = document.querySelector('.allDone');
if (allDone && allDone.innerText === '全部完成') {
clearInterval();
}
}
}, pageTime * 1000);
})();