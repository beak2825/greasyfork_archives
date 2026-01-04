// ==UserScript==
// @name         Wise强制开放HKD付款
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在返回的 <script id="__NEXT_DATA__" type="application/json"></script> 标签中的 props.pageProps.payInCurrencies 数组开头添加 "HKD"。
// @author       Bilibili大** 
// @match        https://wise.com/flows/balances/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/504575/Wise%E5%BC%BA%E5%88%B6%E5%BC%80%E6%94%BEHKD%E4%BB%98%E6%AC%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/504575/Wise%E5%BC%BA%E5%88%B6%E5%BC%80%E6%94%BEHKD%E4%BB%98%E6%AC%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 MutationObserver 来监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 查找 <script id="__NEXT_DATA__" type="application/json"></script> 标签
                const scriptTag = document.querySelector('#__NEXT_DATA__[type="application/json"]');
                if (scriptTag) {
                    console.log('已加载HKD付款');
                    let jsonData;
                    try {
                        // 打印 scriptTag.textContent 内容以便调试
                        console.log(scriptTag.textContent);

                        // 尝试解析 JSON 数据
                        jsonData = JSON.parse(scriptTag.textContent);

                        // 检查并修改 props.pageProps.payInCurrencies 数组
                        if (jsonData.props && jsonData.props.pageProps && Array.isArray(jsonData.props.pageProps.data.payInCurrencies)) {
                            let currencies = jsonData.props.pageProps.data.payInCurrencies;
                            if (!currencies.includes("HKD")) {
                                currencies.unshift("HKD");
                            }

                            // 将修改后的 JSON 数据重新赋值给 script 标签
                            scriptTag.textContent = JSON.stringify(jsonData);
                        }
                    } catch (e) {
                        console.error('Failed to parse or modify JSON data:', e);
                    }

                    // 一旦找到并修改目标标签，停止观察
                    observer.disconnect();
                }
            }
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察 document.body 的变化
    observer.observe(document.body, config);
})();