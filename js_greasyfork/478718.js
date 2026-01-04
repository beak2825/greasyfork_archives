// ==UserScript==
// @name         删除b站轮换页广告,净化b站首页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除b站占了将近半个屏幕的轮换页广告，让用户首页只有视频，目前自动填充后的视频会稍微错行，欢迎大佬提出解决方法[哔哩哔哩，b站]
// @author       Liu-jc123
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478718/%E5%88%A0%E9%99%A4b%E7%AB%99%E8%BD%AE%E6%8D%A2%E9%A1%B5%E5%B9%BF%E5%91%8A%2C%E5%87%80%E5%8C%96b%E7%AB%99%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/478718/%E5%88%A0%E9%99%A4b%E7%AB%99%E8%BD%AE%E6%8D%A2%E9%A1%B5%E5%B9%BF%E5%91%8A%2C%E5%87%80%E5%8C%96b%E7%AB%99%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var div=document.querySelector('.container');
    var div2=div.querySelector('.recommended-swipe-core');//查找轮换页内容
    var div3=div.querySelector('.recommended-swipe');//查找轮换页空间
    div2.remove();//删除轮换页内容
    div3.remove();//删除轮换页空间
})();