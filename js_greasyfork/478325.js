// ==UserScript==
// @name         shuiyuan self-restriction mode
// @version      1.3
// @description  Dont waste your time on shuiyuan, loser! Go get a life!
// @author       benderbd42
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        GM_addStyle
// @license      MIT
// @namespace    https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/478325/shuiyuan%20self-restriction%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/478325/shuiyuan%20self-restriction%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //<nav class="post-controls collapsed">
    GM_addStyle(`
    nav.post-controls.collapsed {
        display: none !important;
    }
`);

    GM_addStyle(`
    button.btn.btn-icon-text.btn-primary.create {
        display: none !important;
    }
`);

    GM_addStyle(`
    button.btn.btn-icon-text.btn-default#create-topic{
        display: none !important;
    }
`);
    function fuckWatermark(){
        // 操你妈水印，看个网页背景整的跟抹布一样，老子差点以为我他妈屏幕烧了，差一点去修手机了
        // 但凡隐水源不做成这个鬼样子我屏蔽你水印干啥，老子又不想截图发出去
        // 就他妈想正常看个帖子，还整这么垃圾，操你妈

        // 获取所有具有 opacity=0.005 的元素
        var targetNodes = document.querySelectorAll('div[style*="opacity: 0.005;"]');

        // 将 opacity 设置为全透明
        targetNodes.forEach(function(node) {
        node.style.opacity = '0';
});
    }

    setInterval(fuckWatermark, 1000);

    // 创建按钮元素
    var button = document.createElement('button');
    button.innerText = '暂停';

    // 创建文字元素
    var text = document.createElement('div');
    text.innerText = '今日已暂停访问';
    text.style.fontWeight = 'bold';

    // 查找目标位置并添加按钮
    function addButtonToContainer() {
        var container = document.getElementById('navigation-bar');
        if (container) {
            var firstChild = container.firstElementChild;
            container.insertBefore(button, firstChild);
        } else {
            setTimeout(addButtonToContainer, 1000); // 等待1000ms后重新尝试添加按钮
        }
    }

    // 获取当前日期
    function getCurrentDate() {
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    // 获取明日日期
    function getNextDay(currentDate) {
        var date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    // 检测是否为指定页面
    function isTargetDomain() {
        console.log(window.location.href);
        return (window.location.href === 'https://shuiyuan.sjtu.edu.cn/'||window.location.href === 'https://shuiyuan.sjtu.edu.cn');
    }

    // 屏蔽网页内所有内容
    function blockContent() {
        var currentDate = getCurrentDate();

        // 显示文字提示
        document.body.innerHTML = '';
        document.body.appendChild(text);

        // 显示日期提示
        var dateText = document.createElement('div');
        dateText.innerText = '可以于明日（' + getNextDay(currentDate) + '）访问';
        document.body.appendChild(dateText);
    }

    // 检测是否已点击暂停按钮
    function hasClickedPauseButton() {
        var currentDate = getCurrentDate();
        var clicked = localStorage.getItem('pauseButtonClickedDateV2');

        return clicked === currentDate;
    }

    // 点击按钮事件处理程序
    button.addEventListener('click', function() {
        // 记录点击日期
        var currentDate = getCurrentDate();
        localStorage.setItem('pauseButtonClickedDateV2', currentDate);

        // 屏蔽网页内容
        blockContent();
    });

    // 检测是否为指定域名，添加按钮
    function addButtonChecker(){
        if (isTargetDomain()) {
            addButtonToContainer();
        }
    }
    setInterval(addButtonChecker, 3000);

    // 检测是否已点击暂停按钮，屏蔽内容
    if (hasClickedPauseButton()) {
        blockContent();
    }
})();