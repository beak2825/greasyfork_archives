// ==UserScript==
// @name         AV動画大好き+ 圖片複製助手 v1.03
// @namespace    https://www.facebook.com/airlife917339
// @version      1.03
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license      None
// @match        https://erodougazo.com/*
// @match        http://erodougazo.com/*
// @icon         http://erodougazo.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/472660/AV%E5%8B%95%E7%94%BB%E5%A4%A7%E5%A5%BD%E3%81%8D%2B%20%E5%9C%96%E7%89%87%E8%A4%87%E8%A3%BD%E5%8A%A9%E6%89%8B%20v103.user.js
// @updateURL https://update.greasyfork.org/scripts/472660/AV%E5%8B%95%E7%94%BB%E5%A4%A7%E5%A5%BD%E3%81%8D%2B%20%E5%9C%96%E7%89%87%E8%A4%87%E8%A3%BD%E5%8A%A9%E6%89%8B%20v103.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 复制文本到剪贴板的函数
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // 显示复制成功的提示
    function showCopySuccessMessage() {
        const messageElement = document.createElement('div');
        messageElement.textContent = '複製成功';
        messageElement.style.position = 'fixed';
        messageElement.style.top = '10px';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translateX(-50%)';
        messageElement.style.background = 'rgba(0, 0, 0, 0.8)';
        messageElement.style.color = '#fff';
        messageElement.style.padding = '8px 16px';
        messageElement.style.borderRadius = '4px';
        document.body.appendChild(messageElement);

        // 1.5秒后移除提示
        setTimeout(function() {
            document.body.removeChild(messageElement);
        }, 1500);
    }

    // 刪除指定ID的div元素
    function removeDivs() {
        const idsToRemove = ['ContentsNeck', 'TopCampaign', 'TopVrList'];
        idsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.parentNode.removeChild(element);
            }
        });
    }

    // 定義函數來處理指定元素的文本內容
    function removeSpecificText(selector, textToRemove) {
        // 找到指定的元素
        const targetElement = document.querySelector(selector);

        if (targetElement) {
            // 獲取元素的文本內容
            let textContent = targetElement.textContent;

            // 刪除指定的文本
            textContent = textContent.replace(textToRemove, '');

            // 設置新的文本內容
            targetElement.textContent = textContent;
        } else {
            console.log('未找到指定的元素');
        }
    }

    // 定義函數來處理指定元素的日期格式
    function replaceDateFormat(selector) {
        // 找到指定的元素
        const dateElement = document.querySelector(selector);

        if (dateElement) {
            // 獲取元素的文本內容
            let dateText = dateElement.textContent;

            // 使用正則表達式將日期格式替換為YYYY/MM/DD
            dateText = dateText.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1/$2/$3');

            // 設置新的文本內容
            dateElement.textContent = dateText;
        } else {
            console.log('未找到指定的元素');
        }
    }

    // 獲取所有符合 class="non_load_thumb" 的 <a> 元素
    const nonLoadThumbs = document.querySelectorAll('a.non_load_thumb');

    // 使用函數處理罩杯的a元素和文本
    removeSpecificText('#ContentsMainWrap > div.ActressProfile.MainBlock.vsp > div.ActressProfile_inner > div.ActressProfileP > ul.p1a > li:nth-child(1) > a', 'カップ');

    // 使用函數處理指定生日的span元素和日期格式, 轉成1992/2/5
    replaceDateFormat('#ContentsMainWrap > div.ActressProfile.MainBlock.vsp > div.ActressProfile_inner > div.ActressProfileP > ul.p1b > li:nth-child(1) > span');

    // 将每个 <a> 元素的 href 属性改为 "#"
    nonLoadThumbs.forEach((element) => {
        element.setAttribute('href', '#');
        // 添加点击事件监听器
        element.addEventListener('click', function(event) {
            // 阻止默认行为，防止链接跳转
            event.preventDefault();

            // 获取底下 <img> 元素的 "jpg連結" 属性的值
            const imgUrl = element.querySelector('img').getAttribute('src');

            // 复制链接到剪贴板
            copyToClipboard(imgUrl);

            // 显示复制成功的提示
            showCopySuccessMessage();
        });
    });

    // 刪除指定的div
    removeDivs();

})();