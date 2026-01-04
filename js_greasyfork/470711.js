// ==UserScript==
// @name         AI Chat Message Row Max-Width
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Adjust Content Max-Width
// @author       shawn-wxn
// @match        https://claude.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://poe.com/*
// @match        https://*.geeksmonkey.com/*
// @match        https://*.perplexity.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        GM_addStyle
// @grant        GM_log
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/470711/AI%20Chat%20Message%20Row%20Max-Width.user.js
// @updateURL https://update.greasyfork.org/scripts/470711/AI%20Chat%20Message%20Row%20Max-Width.meta.js
// ==/UserScript==

(function () {
    // 获取当前的 URL
    var currentURL = window.location.href;

    // 根据当前 URL 进行 if-else 逻辑判断
    if (currentURL.includes("poe.com")) {
        var inputFooter = document.querySelector("div[class^='ChatPageMainFooter_footerInner__']");
        var inputFooterClass = null;
        for (var className of inputFooter.classList){
            if (className.indexOf('ChatPageMainFooter_footerInner__') !== -1) {
                inputFooterClass = className;
                break;
            }
        }
        if (!inputFooterClass) {
            GM_log("ERROR: not found inputFooterClass.");
        }

        var chatPageMainDiv = document.querySelector("div[class^='InfiniteScroll_container__']");
        var chatPageMainDivClass = null;
        for (className of chatPageMainDiv.classList){
            if (className.indexOf('InfiniteScroll_container__') !== -1) {
                chatPageMainDivClass = className;
                break;
            }
        }
        if (!chatPageMainDivClass) {
            GM_log("ERROR: not found chatPageMainDivClass.");
        }

        // var humanMessageDiv = document.querySelector("div[class^='Message_humanMessageBubble__']");
        // var humanMessageDivClass = null;
        // for (className of humanMessageDiv.classList){
        //     if (className.indexOf('Message_humanMessageBubble__') !== -1) {
        //         humanMessageDivClass = className;
        //         break;
        //     }
        // }
        // if (!humanMessageDivClass) {
        //     GM_log("ERROR: not found humanMessageDivClass.");
        // }

        // var botMessageDiv = document.querySelector("div[class^='Message_botMessageBubble__']");
        // var botMessageDivClass = null;
        // for (className of botMessageDiv.classList){
        //     if (className.indexOf('Message_botMessageBubble__') !== -1) {
        //         botMessageDivClass = className;
        //         break;
        //     }
        // }
        // if (!botMessageDivClass) {
        //     GM_log("ERROR: not found botMessageDivClass.");
        // }

        GM_addStyle(`
    .${inputFooterClass} {
    --desktop-reading-column-max-width: ${Math.floor(window.innerWidth * 0.048)}rem;
    }
    .${chatPageMainDivClass} {
    --desktop-reading-column-max-width: ${Math.floor(window.innerWidth * 0.048)}rem;
    }`
    )
        // .${humanMessageDivClass} {
        //     max-width: ${Math.floor(window.innerWidth * 0.078)}ch;
        //     }
        //  .${botMessageDivClass} {
        //  max-width: ${Math.floor(window.innerWidth * 0.078)}ch;
        //  }
    } else if (currentURL.includes("claude.ai")) {
        // 创建一个<style>标签
        var styleTag = document.createElement('style');

        // 将 CSS 样式添加到<style>标签中
        var cssStyles = `
            /* 在这里添加您的 CSS 样式 */
            .max-w-3xl {
              max-width: ${Math.floor(window.innerWidth * 0.05)}rem;
            }
            .max-w-\\[75ch\\] {
              max-width: ${Math.floor(window.innerWidth * 0.1)}ch;
            }
            .max-w-\\[60ch\\] {
              max-width: ${Math.floor(window.innerWidth * 0.1)}ch;
            }
        `;

        // 设置<style>标签的内容为 CSS 样式
        styleTag.innerHTML = cssStyles;

        // 将<style>标签添加到<head>标签中
        document.head.appendChild(styleTag);
    } else if (currentURL.includes("geeksmonkey.com")){
        // 选择目标节点
        const targetNode = document.getElementById('app');

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(function(mutations) {
            // 遍历所有的变动记录
            mutations.forEach(function(mutation) {
                // 检查是否有子节点被移除
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    // 遍历所有被移除的节点
                    for (let i = 0; i < mutation.removedNodes.length; i++) {
                        // 检查这个节点是否是我们关注的节点（具有class=load-wrapper）
                        const node = mutation.removedNodes[i];
                        if (node.nodeType === Node.ELEMENT_NODE){
                            if (node.classList.contains('loading-wrap')) {
                                // 动画结束，load-wrapper元素被移除
                                // 在这里执行你想要进行的操作
                                var imageWraperDiv = document.getElementById("image-wrapper");
                                var imageWraperDivClass = null;
                                for (className of imageWraperDiv.classList) {
                                    if (className.indexOf('max-w-screen-xl') !== -1) {
                                        imageWraperDivClass = className;
                                        break;
                                    }
                                }
                                if (!imageWraperDivClass) {
                                    GM_log("ERROR: not found imageWraperDivClass.");
                                }

                                GM_addStyle(`
                                 .${imageWraperDivClass} {
                                   max-width: ${Math.floor(window.innerWidth * 0.83)}px;
                                 }`
                            )

                                // 一旦检测到load-wrapper元素被移除，就断开观察器
                                observer.disconnect();
                                return; // 退出循环和回调函数
                            }
                        }
                    }
                }
            });
        });

        // 配置观察选项:
        const config = { attributes: false, childList: true, subtree: true };

        // 传入目标节点和观察选项开始观察
        observer.observe(targetNode, config);


    } else if (currentURL.includes("perplexity.ai")){
        // 创建一个<style>标签
        var styleTag = document.createElement('style');

        // 将 CSS 样式添加到<style>标签中
        var cssStyles = `
            /* 在这里添加您的 CSS 样式 */
            .max-w-threadWidth {
              max-width: ${Math.floor(window.innerWidth * 0.85)}px;
            }
        `;

        // 设置<style>标签的内容为 CSS 样式
        styleTag.innerHTML = cssStyles;

        // 将<style>标签添加到<head>标签中
        document.head.appendChild(styleTag);
    } else if (currentURL.includes("chat.deepseek.com")){
        // 创建一个<style>标签
        var styleTag = document.createElement('style');

        // 将 CSS 样式添加到<style>标签中
        var cssStyles = `
            /* 在这里添加您的 CSS 样式 */
            :root {
              --message-list-max-width: ${Math.floor(window.innerWidth * 0.85)}px;
            }
        `;

        // 设置<style>标签的内容为 CSS 样式
        styleTag.innerHTML = cssStyles;

        // 将<style>标签添加到<head>标签中
        document.head.appendChild(styleTag);
    } else {
        // 如果以上条件都不满足
        console.log("当前 URL 不符合预期");
    }
})();