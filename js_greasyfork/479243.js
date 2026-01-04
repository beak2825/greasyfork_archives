// ==UserScript==
// @name         推特只看原创内容
// @namespace    https://github.com/ssoda01
// @version      1.2
// @description  在网页版推特中只查看原创内容
// @author       sodakoo
// @match        https://twitter.com/*
// @match        https://x.com/*
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479243/%E6%8E%A8%E7%89%B9%E5%8F%AA%E7%9C%8B%E5%8E%9F%E5%88%9B%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/479243/%E6%8E%A8%E7%89%B9%E5%8F%AA%E7%9C%8B%E5%8E%9F%E5%88%9B%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let stylePC = document.createElement('style');
    let styleMobile = document.createElement('style');
    let isMobile = false;
    if (window.screen.width <= 768) {
        isMobile = true
    }
    else {
        isMobile = false
    }
    stylePC.innerHTML = `
        .yellow-btn-common {
            position: fixed;
            top: 10px;
            right: 20px;
            z-index: 9999;
            border-radius: 20px;
            background: #fff;
            box-shadow: 5px 5px #eff3f4;
            width: 180px;
            padding: 0 8px;
            border: 2px solid;
            transition: .3s;
            cursor: pointer;
        }

        .yellow-btn-common:hover {
            background: rgba(0,0,0,0.45);
            color: #fff;
        }
        .yellow-btn-common:active {
            background: #000;
            color: #fff;
        }

        .yellow-btn-off {
            color: #c3c3c3;
            border-color: #c3c3c3;
        }
        .yellow-btn-on {
            color: #000;
            border-color: #000;
        }
    `;
    styleMobile.innerHTML = `
        .yellow-btn-common {
            opacity: .3;
            position: fixed;
            bottom: 42px;
            right: 16px;
            z-index: 9999;
            border-radius: 20px;
            background: #fff;
            box-shadow: 5px 5px #eff3f4;
            width: 48px;
            border: 2px solid;
            transition: .3s;
        }

        .yellow-btn-common:hover {
            background: rgba(0,0,0,0.45);
            color: #fff;
        }
        .yellow-btn-common:active {
            background: #000;
            color: #fff;
        }

        .yellow-btn-off {
            color: #c3c3c3;
            border-color: #c3c3c3;
        }
        .yellow-btn-on {
            color: #000;
            border-color: #000;
        }
    `;
    // 将样式节点添加到文档头部

    document.head.appendChild(isMobile ? styleMobile : stylePC);

    // 开关状态 0已关闭 1已开启
    let status = 0;
    let observer = undefined;
    let getBtnText = (status) => {
        if (status === 0) { return isMobile ? 'OFF' : '只看原创内容 OFF' }
        else { return isMobile ? 'ON' : '只看原创内容 ON' }
    }
    // 监听页面加载完成事件
    // 创建悬浮按钮
    let button = document.createElement('button');
    button.classList.add('yellow-btn-common');
    button.classList.add('yellow-btn-off');
    button.textContent = getBtnText(status);
    document.body.appendChild(button);

    // 隐藏非原创推文的函数
    function hideNonOriginalTweets() {
        // 获取所有 article[data-testid="tweet"] 元素
        let tweetElements = document.querySelectorAll('article[data-testid="tweet"]');

        // 遍历推文元素
        for (let i = 0; i < tweetElements.length; i++) {
            let tweetElement = tweetElements[i];

            // 检查是否存在后代子元素 <span data-testid="socialContext">
            let socialContextElement = tweetElement.querySelector('span[data-testid="socialContext"]');
            if (socialContextElement) {
                // 隐藏包含后代子元素的 article 元素
                tweetElement.style.display = 'none';
            }
        }
        // 创建一个 MutationObserver 实例
        observer = new MutationObserver(function (mutationsList) {
            for (let i = 0; i < mutationsList.length; i++) {
                let mutation = mutationsList[i];
                if (mutation.type === 'childList') {
                    // 检查是否还有需要删除的元素
                    console.log("检查是否还有需要删除的元素>>")
                    let remainingElements = document.querySelectorAll('article[data-testid="tweet"]');
                    for (let i = 0; i < remainingElements.length; i++) {
                        let remainingElement = remainingElements[i];
                        // 检查是否存在后代子元素 <span data-testid="socialContext">
                        let socialContextElement = remainingElement.querySelector('span[data-testid="socialContext"]');
                        if (socialContextElement) {
                            // 隐藏包含后代子元素的 article 元素
                            remainingElement.style.display = 'none';
                        }
                    }
                    // if (remainingElements.length === 0) {
                    //     // 停止观察
                    //     observer.disconnect();
                    // }
                }
            }
        });

        // 开始观察 document.body 的子节点变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 按钮点击事件处理程序
    button.addEventListener('click', function () {
        status = status === 0 ? 1 : 0
        button.textContent = getBtnText(status);
        if (status === 0) {
            button.classList.remove('yellow-btn-on');
            button.classList.add('yellow-btn-off');
            if (observer) {
                observer.disconnect();
            }
        } else {
            button.classList.remove('yellow-btn-off');
            button.classList.add('yellow-btn-on');
            hideNonOriginalTweets();
        }

    });
})();
