// ==UserScript==
// @name         顶部显示知乎专栏文章日期
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       zoffy zhang
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368433/%E9%A1%B6%E9%83%A8%E6%98%BE%E7%A4%BA%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/368433/%E9%A1%B6%E9%83%A8%E6%98%BE%E7%A4%BA%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

;(function() {
    'use strict'

    var target = document.querySelector('.ContentItem-time')
    var insertPosition = document.querySelector('.Post-Header')
    insertPosition.append(target);
   
})()
