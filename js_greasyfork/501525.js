// ==UserScript==
// @name         简书隐藏底部推荐文章，自动关闭“扫码安装简书客户端”弹窗
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  实现简书隐藏底部推荐文章，自动关闭“扫码安装简书客户端”弹窗，使页面更加简洁
// @author       pump_dev
// @license      MIT
// @match        *://www.jianshu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501525/%E7%AE%80%E4%B9%A6%E9%9A%90%E8%97%8F%E5%BA%95%E9%83%A8%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E2%80%9C%E6%89%AB%E7%A0%81%E5%AE%89%E8%A3%85%E7%AE%80%E4%B9%A6%E5%AE%A2%E6%88%B7%E7%AB%AF%E2%80%9D%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/501525/%E7%AE%80%E4%B9%A6%E9%9A%90%E8%97%8F%E5%BA%95%E9%83%A8%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E2%80%9C%E6%89%AB%E7%A0%81%E5%AE%89%E8%A3%85%E7%AE%80%E4%B9%A6%E5%AE%A2%E6%88%B7%E7%AB%AF%E2%80%9D%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏底部推荐文章
    var sections = document.querySelectorAll('section');
    if (sections.length >= 2) {
        sections[1].style.display = 'none';
    } else {
        console.log('没有第二个 section 元素');
    }

    // 自动关闭“扫码安装简书客户端”弹窗
    const buttons = document.getElementsByTagName('button');
    console.log("buttons", buttons)
    let btn = null;
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].class === 'Close') {
            btn = buttons[i];
            break; // 找到后退出循环
        }
    }
    console.log("buttons", buttons)

    let timer = setInterval(function() {
        console.log('判断弹窗是否出现');
        // 选中按钮
        const closeButton = document.querySelector('button[aria-label="Close"]');
        // 检查是否成功选中
        if (closeButton) {
            // 清除定时器
            clearInterval(timer);
            // 模拟点击按钮
            closeButton.click();
            console.log('按钮已被点击');
        }
    }, 200);

    // /////// 隐藏"推荐阅读"
    // 获取所有的span标签
    const spans = document.getElementsByTagName('span');
    // 遍历每个span标签并查找内容为推荐阅读的标签
    let targetSpan = null;
    for (let i = 0; i < spans.length; i++) {
        if (spans[i].textContent === '推荐阅读') {
            targetSpan = spans[i];
            break; // 找到后退出循环
        }
    }
    // 检查是否找到了该span标签
    if (targetSpan) {
        targetSpan.parentNode.nextElementSibling.style.display = 'none';
        targetSpan.parentNode.style.display = 'none';
    } else {
        console.log('未找到推荐阅读标签');
    }

    // //////// 隐藏右侧“热门故事”
    // 获取所有的span标签
    const rmgs = document.getElementsByTagName('h3');
    console.log(rmgs)
    // 遍历每个span标签并查找内容为推荐阅读的标签
    let rm = null;
    for (let i = 0; i < rmgs.length; i++) {
        console.log(i + "---" + rmgs[i].innerText)
        if (rmgs[i].innerText === '热门故事') {
           rm = rmgs[i];
           break; // 找到后退出循环
        }
    }
    // 检查是否找到了该span标签
    if (rm) {
        rm.parentNode.nextElementSibling.style.display = 'none';
        rm.parentNode.style.display = 'none';
    } else {
        console.log('未找到热门故事标签');
    }
})();