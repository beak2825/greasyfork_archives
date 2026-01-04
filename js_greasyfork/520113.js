// ==UserScript==
// @name 碗碗妈咪专用实验组2
// @namespace https://mooc1.chaoxing.com/
// @version 1
// @description 自动滚动并翻页，让系统认为你一直在阅读界面，刷阅读时长用的，
// @author AI Bot
// @license MIT
// @match https://book.douban.com/subject/22746581/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/520113/%E7%A2%97%E7%A2%97%E5%A6%88%E5%92%AA%E4%B8%93%E7%94%A8%E5%AE%9E%E9%AA%8C%E7%BB%842.user.js
// @updateURL https://update.greasyfork.org/scripts/520113/%E7%A2%97%E7%A2%97%E5%A6%88%E5%92%AA%E4%B8%93%E7%94%A8%E5%AE%9E%E9%AA%8C%E7%BB%842.meta.js
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

  // 随机生成滚动间隔（1 到 5 秒，单位毫秒）
  const getRandomScrollInterval = () => Math.floor(Math.random() * (5 - 1 + 1) + 1) * 1000;

  let isAtBottom = false; // 是否到达底部标志

  // 滚动逻辑
  const scrollLogic = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // 已到达页面底部
      if (!isAtBottom) {
        isAtBottom = true;
        console.log('到达底部，停留 1 分钟...');
        setTimeout(() => {
          isAtBottom = false; // 1 分钟后重置状态
          console.log('完成一次阅读行为，准备跳转到目标页面...');
          exitAndReturn(); // 跳转到目标页面
        }, 60000); // 停留 1 分钟
      }
    } else {
      // 尚未到底部，继续滚动
      scrollOnce();
    }
  };

  // 单次滚动
  const scrollOnce = () => {
    window.scrollBy(0, window.innerHeight);
    const nextInterval = getRandomScrollInterval();
    console.log(`下一次滚动将在 ${nextInterval / 1000} 秒后进行...`);
    setTimeout(scrollLogic, nextInterval); // 随机时间后再次调用滚动逻辑
  };

  // 跳转到目标页面
  const exitAndReturn = () => {
    console.log('准备跳转到目标页面...');
    window.location.href = 'https://book.douban.com/subject/25867851/'; // 目标页面 URL
  };

  // 初始化
  console.log('自动滚动脚本已启动...');
  scrollOnce(); // 启动滚动逻辑

})();
