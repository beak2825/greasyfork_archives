// MIT License

// Copyright (c) [year] [fullname]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// ==UserScript==
// @name         cc98头像id隐藏
// @namespace    none
// @license      MIT
// @version      2024-07-19-3
// @description  隐藏98用户名和头像，防止掉码
// @author       kirby123
// @match        https://www.cc98.org/*
// @icon         https://www.cc98.org/static/images/心灵头像.gif
// @run-at       DOMContentLoaded
// @downloadURL https://update.greasyfork.org/scripts/501184/cc98%E5%A4%B4%E5%83%8Fid%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/501184/cc98%E5%A4%B4%E5%83%8Fid%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加CSS样式以隐藏头像和用户名元素
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
      .topBarUserImg img, .topBarUserName, #userId > p, .user-avatar img, #userIntroducion, .user-description img{ visibility: hidden; }
      .user-description {
        width: 800px; /* 图片的宽度 */
        height: 800px; /* 图片的高度 */
        background-image: url('https://www.cc98.org/static/images/%E5%BF%83%E7%81%B5%E5%A4%B4%E5%83%8F.gif'); /* 替换为新的图片 */
        }
    `; // 可注释.user-description，取消对个性签名部分的影响

    document.head.appendChild(styleElement);

    var Interval = setInterval(function () {
        var headerUserName_1 = document.querySelector("#root > div > div.header > div > div > div.topBarRight > div.topBarUserInfo > div.topBarUserName");
        if (headerUserName_1) {
            headerUserName_1.textContent = "匿名用户";
            // 当用户名被替换后，再显示用户名
            headerUserName_1.style.visibility = 'visible';
            clearInterval(Interval);
        }
        var headerUserName_2 = document.querySelector("#root > div > div.headerWithoutImage > div > div > div.topBarRight > div.topBarUserInfo > div.topBarUserName");
        if (headerUserName_2) {
            headerUserName_2.textContent = "匿名用户";
            // 当用户名被替换后，再显示用户名
            headerUserName_2.style.visibility = 'visible';
            clearInterval(Interval);
        }
        var headerUserImg = document.querySelector("#root > div > div.header > div > div > div.topBarRight > div.topBarUserInfo > div.topBarUserImg > img");
        if (headerUserImg) {
            headerUserImg.setAttribute('src', 'https://www.cc98.org/static/images/%E5%BF%83%E7%81%B5%E5%A4%B4%E5%83%8F.gif');
            // 当图片被替换后，再显示头像
            headerUserImg.style.visibility = 'visible';
            clearInterval(Interval);
        }
        var userAvatarImg = document.querySelector("#root > div > div.headerWithoutImage > div > div > div.topBarRight > div.topBarUserInfo > div.topBarUserImg > img");
        if (userAvatarImg) {
            userAvatarImg.setAttribute('src', 'https://www.cc98.org/static/images/%E5%BF%83%E7%81%B5%E5%A4%B4%E5%83%8F.gif');
            // 当图片被替换后，再显示头像
            userAvatarImg.style.visibility = 'visible';
            clearInterval(Interval);
        }
        var userIntroducion = document.querySelector("#userIntroducion");
        if (userIntroducion && userIntroducion.textContent === '你的个人简介') {
            var userIdElement = document.querySelector("#userId");
            if (userIdElement) {
                userIdElement.textContent = '匿名用户';
                // 当用户名被替换后，再显示用户名
                userIdElement.style.visibility = 'visible';
                clearInterval(Interval);
            }
            var userImg = document.querySelector("#root > div > div.user-center > div > div.user-center-body > div.user-center-router > div > div.user-avatar > img");
            if (userImg) {
                userImg.setAttribute('src', 'https://www.cc98.org/static/images/_%E5%BF%83%E7%81%B5%E4%B9%8B%E7%BA%A6.png');
                // 当图片被替换后，再显示头像
                userImg.style.visibility = 'visible';
                clearInterval(Interval);
            }
            userIntroducion.textContent = '猜猜我是谁';
            // 当用户名被替换后，再显示用户名
            userIntroducion.style.visibility = 'visible';
            clearInterval(Interval);
        } else {
            var userIdElement_1 = document.querySelector("#userId > p");
            if (userIdElement_1) {
                userIdElement_1.style.visibility = 'visible';
                clearInterval(Interval);
            }
            var userImg_1 = document.querySelector("#root > div > div.user-center > div > div.user-center-body > div.user-center-router > div > div.user-avatar > img");
            if (userImg_1) {
                userImg_1.style.visibility = 'visible';
                clearInterval(Interval);
            }
        }
    }, 500);
})();