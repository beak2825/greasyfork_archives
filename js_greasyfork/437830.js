// ==UserScript==
// @name         去除b站动态页右侧话题栏
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  去除动态页右侧话题栏
// @match        https://t.bilibili.com/*
// @match        https://www.douyu.com/*
// @grant        none
// @author       401
// @downloadURL https://update.greasyfork.org/scripts/437830/%E5%8E%BB%E9%99%A4b%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E5%8F%B3%E4%BE%A7%E8%AF%9D%E9%A2%98%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437830/%E5%8E%BB%E9%99%A4b%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E5%8F%B3%E4%BE%A7%E8%AF%9D%E9%A2%98%E6%A0%8F.meta.js
// ==/UserScript==
setInterval(function () {
            let pop = document.querySelector('.topic-panel');
            let pop1 = document.querySelector('.LANTERNLOVERACT202201Bar-pre-bg');
  
            if (pop != null) {
                pop.remove();
            }
            if (pop1 != null) {
                pop1.remove();
            }

        }, 100);