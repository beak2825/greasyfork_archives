// ==UserScript==
// @name         Stage1st 增强搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为Stage1st论坛添加搜索框和导航栏搜索按钮，利用Google可编程搜索引擎实现
// @author       霓虹灯鱼 with DeepSeek-V3-0324
// @match        https://stage1st.com/*
// @icon         https://stage1st.com/favicon.ico
// @grant        none
// @license      CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/533615/Stage1st%20%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/533615/Stage1st%20%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 阻止 Google CSE 自动插入搜索框
    window.__gcse = {
        parsetags: 'explicit',
        initializationCallback: function() {
            // 手动触发搜索框渲染（避免自动插入）
            if (window.google && window.google.search) {
                google.search.cse.element.render({
                    div: "custom-gcse-search-box",
                    tag: 'search'
                });
            }
        }
    };

    // 2. 添加导航栏搜索按钮
    function addSearchButton() {
        const navList = document.querySelector('#nv ul, .nv ul, .nvhm ul');
        if (!navList) return;

        if (document.querySelector('#custom-search-li')) return;

        const li = document.createElement('li');
        li.id = 'custom-search-li';

        const searchLink = document.createElement('a');
        searchLink.href = 'https://cse.google.com/cse?cx=82abdfd56aed8400a';
        searchLink.textContent = '搜索';
        searchLink.target = '_blank';
        searchLink.style.cssText = `
            color: #333;
            font-weight: bold;
            text-decoration: none;
            padding: 0 15px;
            display: block;
        `;

        searchLink.addEventListener('mouseover', () => searchLink.style.color = '#444');
        searchLink.addEventListener('mouseout', () => searchLink.style.color = '#333');

        li.appendChild(searchLink);
        navList.appendChild(li);
    }

    // 3. 加载Google CSE（同步加载）
    const loadGCSE = () => {
        const script = document.createElement('script');
        script.src = 'https://cse.google.com/cse.js?cx=82abdfd56aed8400a';
        script.async = false;
        document.head.appendChild(script);
    };

    // 4. 插入搜索框（仅一个，手动控制位置）
    const insertSearchBox = () => {
        const logo = document.querySelector('#hd h2 a');
        if (!logo) return;

        // 如果已存在搜索框，不再重复插入
        if (document.querySelector('#custom-gcse-search-box')) return;

        const searchContainer = document.createElement('div');
        searchContainer.id = 'custom-gcse-search-box'; // 指定ID供Google CSE渲染
        searchContainer.style.display = 'inline-block';
        searchContainer.style.verticalAlign = 'middle';
        searchContainer.style.marginLeft = '20px';
        searchContainer.style.width = '350px';

        logo.parentNode.insertBefore(searchContainer, logo.nextSibling);

        // 自定义样式（覆盖Google默认样式）
        const style = document.createElement('style');
        style.textContent = `
            .gsc-control-cse {
                background: transparent !important;
                border: none !important;
                padding: 0 !important;
                width: 100% !important;
            }
            .gsc-input-box, .gsc-search-box, .gsc-input {
                max-width: 100% !important;
            }
            .gsc-control-wrapper-cse {
                width: 100% !important;
            }
            .gsc-result .gs-title,
            .gsc-result .gs-title *,
            .gsc-result .gs-snippet,
            .gsc-result .gs-snippet * {
                font-weight: normal !important;
            }
            .gsc-search-button {
                padding: 5px 10px !important;
            }
        `;
        document.head.appendChild(style);
    };

    // 初始化
    function init() {
        addSearchButton();
        insertSearchBox(); // 先插入DIV，再加载CSE
        loadGCSE();
    }

    // 立即执行或等待页面加载
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();