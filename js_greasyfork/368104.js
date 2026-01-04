// ==UserScript==
// @name         显示博客园文章的发布日期
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       zoffy zhang
// @match        http*://www.cnblogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368104/%E6%98%BE%E7%A4%BA%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E7%9A%84%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/368104/%E6%98%BE%E7%A4%BA%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E7%9A%84%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

;(function() {
    'use strict'
    var postDate = document.querySelector('#post-date').innerText
    var insertPosition = document.querySelector('.postTitle')
    insertPosition.insertAdjacentHTML('afterend', '<p style="color:#c0392b;font-weight:bold;">发布于 '+postDate+'</p>')
})()
