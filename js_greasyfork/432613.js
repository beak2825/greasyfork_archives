// ==UserScript==
// @name         教学立方课件下载脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在课件页点击导航栏“显示下载链接”
// @author       Peidong Xie
// @match        https://teaching.applysquare.com/S/Course/index/cid/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432613/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/432613/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var myHeading = document.querySelector('h1');
myHeading.textContent = 'Hello world!';