// ==UserScript==
// @name         雪球(自用)：隐藏 Canvas 背景
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  每次进入页面时隐藏所有 Canvas 的背景
// @match        https://xueqiu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525774/%E9%9B%AA%E7%90%83%28%E8%87%AA%E7%94%A8%29%EF%BC%9A%E9%9A%90%E8%97%8F%20Canvas%20%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/525774/%E9%9B%AA%E7%90%83%28%E8%87%AA%E7%94%A8%29%EF%BC%9A%E9%9A%90%E8%97%8F%20Canvas%20%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("canvas").forEach(e => e.style.background = "none");

    // 存储监听状态的键
    const LISTENING_KEY = 'isListeningEnabled';
    // 初始化监听状态
    let isListeningEnabled = GM_getValue(LISTENING_KEY, true);
    // 注册菜单项
    GM_registerMenuCommand(
        '切换: 打开/关闭',
        toggleListening
    );

    function toggleListening() {
        isListeningEnabled = !isListeningEnabled;
        GM_setValue(LISTENING_KEY, isListeningEnabled);

        if(isListeningEnabled) {
            addListener();
        } else{
            removeListener();
        }
    }

    const list1 = document.querySelector(".vo-list-box");
    const list2 = document.querySelector(".chart-period");
    const debounceClick = debounce(checkAndCloseBtn,300);

    // 初始化监听状态
    if (isListeningEnabled) {
        addListener();
    }

    function addListener() {
        if (list1) list1.addEventListener("click", debounceClick, true);
        if (list2) list2.addEventListener("click", debounceClick, true);
    }

    function removeListener() {
        if (list1) list1.removeEventListener("click", debounceClick, true);
        if (list2) list2.removeEventListener("click", debounceClick, true);
    }


    function checkAndCloseBtn(e) {
        const activedLi = document.querySelectorAll(".vo-list-box ul li.active")[1];
        if(!activedLi) {
            return;
        }

        // 获取点击元素的 data-vo 属性
        console.log(activedLi)
        const name = activedLi.dataset.vo;
        if (!name) {
            console.error('未找到data-vo属性');
            return;
        }

        // 构造 close 按钮的选择器
        const closeBtnSecltor = `#${name}-close`;
        console.log(name, closeBtnSecltor);

        // 查找 close 按钮并触发点击
        const closeBtn = document.querySelector(closeBtnSecltor);
        if (closeBtn && closeBtn.style.display !== 'none') {
            closeBtn.click();

        } else {
            console.error('未找到Close按钮:', closeBtnSecltor);
        }
    }

    function debounce(cb, delay = 500){
        let timer;
        return function(...args) {
            timer && clearTimeout(timer);
            timer = setTimeout(()=>{
                cb.apply(this, args)
            },delay)
        }
    }
})();