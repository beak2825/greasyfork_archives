// ==UserScript==
// @name         福利吧论坛隐藏头像等元素页面精简
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏网页中的头像、勋章、签名、UID、积分、金币、注册时间、进度条、发消息和表情元素，并移除帖子最小高度限制
// @author       You
// @match        https://www.wnflb2023.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527056/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E9%9A%90%E8%97%8F%E5%A4%B4%E5%83%8F%E7%AD%89%E5%85%83%E7%B4%A0%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/527056/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E9%9A%90%E8%97%8F%E5%A4%B4%E5%83%8F%E7%AD%89%E5%85%83%E7%B4%A0%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏所有class为'avatar'的元素
    let avatars = document.querySelectorAll('.avatar');
    avatars.forEach(function(avatar) {
        avatar.style.display = 'none';
    });

    // 隐藏所有class为'md_ctrl'的元素
    let medals = document.querySelectorAll('.md_ctrl');
    medals.forEach(function(medal) {
        medal.style.display = 'none';
    });

    // 隐藏所有class为'sign'的元素
    let signatures = document.querySelectorAll('.sign');
    signatures.forEach(function(signature) {
        signature.style.display = 'none';
    });

    // 隐藏UID、积分、金币、注册时间信息
    let infoLabels = document.querySelectorAll('dt');
    infoLabels.forEach(function(label) {
        if (
            label.textContent.includes('UID') ||
            label.textContent.includes('积分') ||
            label.textContent.includes('金币') ||
            label.textContent.includes('注册时间')
        ) {
            label.style.display = 'none';  // 隐藏 dt 标签
            if (label.nextElementSibling) {
                label.nextElementSibling.style.display = 'none';  // 隐藏 dd 标签
            }
        }
    });

    // 隐藏所有class为'pbg2'的进度条
    let progressBars = document.querySelectorAll('.pbg2');
    progressBars.forEach(function(progressBar) {
        progressBar.style.display = 'none';  // 隐藏进度条
    });

    // 隐藏所有class为'tip'的进度条提示框
    let progressTips = document.querySelectorAll('.tip');
    progressTips.forEach(function(tip) {
        tip.style.display = 'none';  // 隐藏提示框
    });

    // 隐藏所有class为'pm2'且链接文字为'发消息'的<li>元素
    let pm2ListItems = document.querySelectorAll('li.pm2 a');
    pm2ListItems.forEach(function(link) {
        if (link.textContent.trim() === '发消息') {
            link.parentElement.style.display = 'none'; // 隐藏<li>元素
        }
    });

    // 隐藏所有表情图片元素
    let smileyImgs = document.querySelectorAll('img[src*="smiley"]');
    smileyImgs.forEach(function(smiley) {
        smiley.style.display = 'none';  // 隐藏表情图片
    });

    // 移除帖子最小高度限制
    let style = document.createElement('style');
    style.textContent = '.pcb > .t_fsz { min-height: auto !important; }';
    document.head.appendChild(style);

})();