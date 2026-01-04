// ==UserScript==
// @name         自动注册openai-1
// @namespace    QTools.net
// @version      5.0.1
// @description  自动注册openai
// @license MIT
// @author       q
// @match        *://*.openrouter.ai/*
// @match        *://*.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @icon         data:image/gif
// @downloadURL https://update.greasyfork.org/scripts/494427/%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8Copenai-1.user.js
// @updateURL https://update.greasyfork.org/scripts/494427/%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8Copenai-1.meta.js
// ==/UserScript==


// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-07
// @description  try to take over the world!
// @author       You
// @match        *://*.openrouter.ai/*
// @match        *://*.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openrouter.ai
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function observeDOM(selector, callback, errCallback, timeout) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                const element = document.querySelector(selector);
                if (element) {
                    callback(element);
                    observer.disconnect(); // 找到元素后停止观察
                }
            });
        });

        // 配置观察选项
        const config = { childList: true, subtree: true };

        // 开始观察
        observer.observe(document.body, config);

        // 设置超时处理
        setTimeout(() => {
            observer.disconnect();
            handleTimeout();
            errCallback("超时");
        }, timeout);
    }

    function handleTimeout() {
        console.log("观察 DOM 超时，执行异常处理");
        // 在这里添加你的异常处理逻辑
    }


    
    //检查url 并且点击dom
    function checkUrl_clickDom(url, selector, info) {
        if (window.location.href.includes(url)) {
            console.log(info);
            observeDOM(selector,
                (element) => {
                    element.click();
                },
                (err) => {
                    console.log("遇到错误，通知", err)

                },
                20000
            );
        }
    }

    window.addEventListener('load', function () {
        console.log("页面加载完毕，开始执行脚本");


        
        checkUrl_clickDom("openrouter.ai",".cl-button__google","openrouter.ai 登陆页面")
        checkUrl_clickDom("oauthchooseaccount","div[tabindex='0']","google选择账号页面")
        checkUrl_clickDom("id?authuser=0","div[jsname='DhK0U'] div:nth-of-type(2) button","继续按钮页面")
        // 检查 URL 是否包含 "openrouter.ai"
        

        if (window.location.href.includes("nrouter.ai/settings/keys")) {
            if(document.querySelector("body").innerHTML.includes("Create Key")){
                this.alert("登陆成功")
            }
        }


      

        if (window.location.href.includes("unknownerror")) {
            console.log("在 unknownerror 页面上");
            // 异常了重试
        }

    });
})();