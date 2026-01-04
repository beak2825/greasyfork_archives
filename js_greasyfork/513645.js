// ==UserScript==
// @name         fab商城和Unity商城比价
// @namespace    http://tampermonkey.net/
// @version      2024-10-23
// @description  fab商城和Unity商城比价工具,技术有限只能打开指定搜索框
// @author       YuoHira
// @match        https://www.fab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fab.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513645/fab%E5%95%86%E5%9F%8E%E5%92%8CUnity%E5%95%86%E5%9F%8E%E6%AF%94%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/513645/fab%E5%95%86%E5%9F%8E%E5%92%8CUnity%E5%95%86%E5%9F%8E%E6%AF%94%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .unity-search-btn {
            margin-left: 10px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .unity-search-btn:hover {
            background-color: #45a049;
        }
    `);

    // 获取物品名称
    function getItemName() {
        const nameElement = document.querySelector('h1.fabkit-Typography-root.fabkit-Heading--lg');
        if (nameElement) {
            return nameElement.textContent.trim();
        }
        return null;
    }

    // 检查是否包含Unity格式
    function hasUnityFormat(itemName) {
        const unityBadge = document.querySelector(`div[aria-label*="${itemName}"][aria-label*="Unity"]`);
        return !!unityBadge;
    }

    // 在Unity商城搜索资源
    function openUnityAssetStore(itemName) {
        const searchUrl = `https://assetstore.unity.com/zh-CN/search#q=${encodeURIComponent(itemName)}`;
        window.open(searchUrl, '_blank');
    }

    // 添加Unity搜索按钮
    function addUnitySearchButton(itemName) {
        const nameElement = document.querySelector('h1.fabkit-Typography-root.fabkit-Heading--lg');
        if (nameElement && !document.querySelector('.unity-search-btn')) {
            const button = document.createElement('button');
            button.textContent = '在Unity商城搜索';
            button.className = 'unity-search-btn';
            button.onclick = () => openUnityAssetStore(itemName);
            nameElement.parentNode.insertBefore(button, nameElement.nextSibling);
        }
    }

    // 主函数
    function main() {
        const itemName = getItemName();
        if (itemName) {
            console.log('物品名称:', itemName);
            const includesUnity = hasUnityFormat(itemName);
            console.log('是否包含Unity格式:', includesUnity);

            if (includesUnity) {
                console.log('添加Unity商城搜索按钮');
                addUnitySearchButton(itemName);
            }
        } else {
            console.log('无法获取物品名称');
        }
    }

    // 使用 MutationObserver 来检测页面内容变化
    function observePageChanges() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const nameElement = document.querySelector('h1.fabkit-Typography-root.fabkit-Heading--lg');
                    if (nameElement && !document.querySelector('.unity-search-btn')) {
                        main();
                        break;
                    }
                }
            }
        });

        observer.observe(targetNode, config);
    }

    // 监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});

    // URL变化时的回调函数
    function onUrlChange() {
        console.log('URL changed, re-running main function');
        main();
    }

    // 初始执行
    main();
    observePageChanges();
})();
