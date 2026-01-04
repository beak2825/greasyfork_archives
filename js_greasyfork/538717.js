// ==UserScript==
// @name         MissAV页面布局优化
// @namespace    http://tampermonkey.net/
// @version      1.0_20250607
// @description  优化页面主体区域布局（重点突出视频），提供侧边视频推荐的切换按钮（显示/隐藏侧边），舒适观影。
// @author       iSwfe
// @match        https://missav.com/*
// @match        https://missav.ai/*
// @match        https://missav.ws/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @run-at       document-end
// @grant        unsafeWindow
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/538717/MissAV%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538717/MissAV%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 配置：查找相关元素
    // 元素：侧边栏推荐视频区域
    const selectorSidebar = 'body > div:nth-child(3) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div > div.hidden.lg\\:flex.h-full.ml-6.order-last';
    // 元素：页面主题区域
    const selectorMain = 'body > div:nth-child(3) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12';
    // 最大宽度：主体区域
    const MAX_WIDTH = '90vw';

    // 扩充页面主体区域
    function expandMain() {
        new MutationObserver((mutations, obs) => {
            const eleMain = document.querySelector(selectorMain);
            if (!eleMain) {
                return;
            }

            setTimeout(() => {
                if (MAX_WIDTH !== eleMain.style.maxWidth) {
                    // 设置最大宽度为90%
                    eleMain.style.maxWidth = MAX_WIDTH;
                    console.log('【扩充页面主体区域】完成');
                }

                // 计算主体区域位置的绝对高度
                const absoluteTop = window.pageYOffset + eleMain.getBoundingClientRect().top;
                // 视口滚动到主体区域位置
                window.scrollTo({
                    top: absoluteTop - 10,
                    behavior: 'smooth'
                });
            }, 200);
            obs.disconnect();
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    // 隐藏侧边栏推荐视频区域
    function hideSidebar() {
        const eleSidebar = document.querySelector(selectorSidebar);
        if (!eleSidebar) {
            console.log('【隐藏侧边栏视频】未找到侧边栏区域');
            return;
        }

        eleSidebar.style.display = 'none';
    }

    // 显示侧边栏推荐视频区域
    function showSidebar() {
        const eleSidebar = document.querySelector(selectorSidebar);
        if (!eleSidebar) {
            console.log('【显示侧边栏视频】未找到侧边栏区域');
            return;
        }

        eleSidebar.style.removeProperty('display');
    }

    // 切换隐藏/显示 状态
    let hidden = false;
    function toggle() {
        hidden = !hidden;
        hidden ? hideSidebar() : showSidebar();
        expandMain();
        updateButtonText();
    }

    // 创建切换侧边栏按钮
    function createToggleButton() {
        const eleParent = document.querySelector("body > div:nth-child(3) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div > div.flex-1.order-first > div:nth-child(1) > div.-mx-4.sm\\:m-0.px-4.py-2.sm\\:py-4.bg-black.rounded-b-0.sm\\:rounded-b-lg > div > div.sm\\:ml-6");
        if (!eleParent) {
            console.log('【创建切换侧边栏按钮】未找到"循环播放"按钮');
            return;
        }

        var div = document.createElement("div");
        div.classList.value = 'flex -mx-4 sm:m-0 mt-1 bg-black justify-center';
        div.innerHTML = '<button id="toggle-sidebar" onclick="toggle();" type="button" class="relative -ml-px inline-flex items-center rounded-md bg-transparent pl-2 pr-2 py-2 font-medium text-white ring-1 ring-inset ring-white hover:bg-primary focus:z-10">Sidebar</button>';
        // eleParent.appendChild(div);

        const btn = document.createElement('button');
        btn.id = 'toggle-sidebar';
        // btn.textContent = '显示侧边';
        btn.type = 'button';
        btn.classList.value = 'px-2 py-1.5 border text-xs font-medium rounded text-white border-white';
        btn.addEventListener('click', toggle);
        eleParent.appendChild(btn);
        updateButtonText();
    }

    // 更新切换侧边栏按钮文案
    function updateButtonText() {
        const btn = document.getElementById('toggle-sidebar');
        if (!btn) {
            console.log('【更新切换侧边栏按钮文案】未找到按钮');
            return;
        }

        btn.textContent = hidden ? '显示侧边◀️' : '隐藏侧边▶️';
    }

    // 页面加载时监测 sidebar 元素并隐藏
    function observeForSidebar() {
        const observer = new MutationObserver((mutations, obs) => {
            const eleSidebar = document.querySelector(selectorSidebar);
            if (!eleSidebar) {
                return;
            }

            hideSidebar();
            hidden = true;
            createToggleButton();
            obs.disconnect();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // 在 DOMContentLoaded 时初始化
    window.addEventListener('DOMContentLoaded', () => {
        expandMain();
        observeForSidebar();
    });
})();
