// ==UserScript==
// @name         Follow自动滚动阅读文章脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动滚动阅读文章并自动切换到下一篇
// @author       BigSong.ETH
// @grant        none
// @run-at       document-end
// @match        https://app.follow.is/*
// @downloadURL https://update.greasyfork.org/scripts/515752/Follow%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%98%85%E8%AF%BB%E6%96%87%E7%AB%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/515752/Follow%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%98%85%E8%AF%BB%E6%96%87%E7%AB%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptRunning = false; // 控制脚本运行的变量
    let articles = []; // 全局变量，用于存储文章列表
    let dataIndices = []; // 全局变量，用于存储文章的data-index列表
    let currentDataIndex = null; // 当前文章的data-index

    // 创建控制按钮并添加到页面
    const controlButton = document.createElement('button');
    controlButton.textContent = '启动脚本';
    controlButton.style.position = 'fixed';
    controlButton.style.bottom = '10px';
    controlButton.style.right = '10px';
    controlButton.style.zIndex = 1000;
    controlButton.style.padding = '10px 20px';
    controlButton.style.backgroundColor = '#28a745';
    controlButton.style.color = '#fff';
    controlButton.style.border = 'none';
    controlButton.style.borderRadius = '5px';
    controlButton.style.cursor = 'pointer';
    document.body.appendChild(controlButton);

    // 为按钮添加事件监听器
    controlButton.addEventListener('click', function() {
        scriptRunning = !scriptRunning;
        if (scriptRunning) {
            controlButton.textContent = '停止脚本';
            controlButton.style.backgroundColor = '#dc3545';
            console.log("脚本已启动。");
            startScript(); // 重新开始脚本
        } else {
            controlButton.textContent = '启动脚本';
            controlButton.style.backgroundColor = '#28a745';
            console.log("脚本已停止。");
        }
    });

    // 等待目标元素出现后再执行脚本
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            // 元素已存在，执行回调
            callback(element);
        } else {
            // 元素不存在，延迟一段时间后再次检查
            setTimeout(() => {
                waitForElement(selector, callback);
            }, 500); // 每隔500毫秒检查一次
        }
    }

    // 脚本逻辑
    function startScript() {
        if (!scriptRunning) return; // 如果脚本已停止，退出函数

        // 初始化文章列表和索引
        articles = document.querySelectorAll('[data-index]');
        dataIndices = Array.from(articles).map(article => article.getAttribute('data-index'));

        function scrollToBottomGradually() {
            if (!scriptRunning) return; // 如果脚本已停止，退出函数

            const scrollContainer = document.querySelector('div[data-radix-scroll-area-viewport].block.size-full.p-5');

            if (scrollContainer) {
                const totalHeight = scrollContainer.scrollHeight;
                const visibleHeight = scrollContainer.clientHeight;
                const step = 1; // 调整滚动速度，步长越大速度越快
                let currentPosition = scrollContainer.scrollTop;

                const intervalId = setInterval(() => {
                    if (!scriptRunning) {
                        clearInterval(intervalId);
                        return;
                    }

                    currentPosition += step;

                    if (currentPosition >= totalHeight - visibleHeight) {
                        scrollContainer.scrollTop = totalHeight - visibleHeight;
                        clearInterval(intervalId);
                        console.log("已滚动到底部");

                        // 滚动到底部后切换到下一篇文章
                        setTimeout(scrollToNextArticle, 2000); // 切换到下一篇文章的等待时间
                    } else {
                        scrollContainer.scrollTop = currentPosition;
                    }
                }, 20); // 调整滚动频率，数值越小速度越快
            } else {
                console.error("滚动容器未找到，请确认选择器是否正确。");
            }
        }

        function scrollToNextArticle() {
            if (!scriptRunning) return; // 如果脚本已停止，退出函数

            // 使用 data-index 获取文章列表
            articles = document.querySelectorAll('[data-index]');
            dataIndices = Array.from(articles).map(article => article.getAttribute('data-index'));
            console.log("获取到的文章列表的序号data-index:", dataIndices);

            let nextArticle = null;
            let currentIndex;

            if (currentDataIndex === null) {
                // 如果currentDataIndex为null，表示这是第一次调用，已处理第一篇文章
                currentIndex = 0; // 从索引1开始处理
            } else {
                // 找到当前文章的索引
                currentIndex = dataIndices.indexOf(currentDataIndex);
            }

            if (currentIndex < dataIndices.length - 1) {
                // 获取下一篇文章
                nextArticle = articles[currentIndex + 1];
            } else {
                // 已经是最后一篇文章，等待新文章出现
                console.log("当前已到列表末尾，等待检查新文章...");

                // 定义一个函数用于检查新文章
                function checkForNewArticles() {
                    if (!scriptRunning) return; // 如果脚本已停止，退出函数

                    // 重新获取文章列表和索引
                    const newArticles = document.querySelectorAll('[data-index]');
                    const newDataIndices = Array.from(newArticles).map(article => article.getAttribute('data-index'));

                    // 查找当前文章在新列表中的索引
                    const currentIndexInNewList = newDataIndices.indexOf(currentDataIndex);

                    if (currentIndexInNewList < newDataIndices.length - 1) {
                        // 有新文章，处理下一篇
                        console.log("发现新文章，继续阅读");
                        // 更新全局变量
                        articles = newArticles;
                        dataIndices = newDataIndices;
                        scrollToNextArticle();
                    } else {
                        // 没有新文章，继续等待
                        console.log("暂无新文章，继续等待...");
                        setTimeout(checkForNewArticles, 10000); // 10秒后再次检查
                    }
                }

                // 开始检查新文章
                setTimeout(checkForNewArticles, 2000);
                return;
            }

            if (nextArticle) {
                currentDataIndex = nextArticle.getAttribute('data-index');
                console.log(`正在处理data-index为 ${currentDataIndex} 的文章`);

                // 点击标题，模拟阅读
                const titleDiv = nextArticle.getElementsByClassName('break-words')[0];
                if (titleDiv) {
                    titleDiv.click(); // 模拟点击
                    console.log(`已点击data-index为 ${currentDataIndex} 的文章的标题`);
                } else {
                    console.warn(`data-index为 ${currentDataIndex} 的文章标题未找到`);
                }

                // 滚动视图到该文章顶部
                nextArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // 调整这里的等待时间
                setTimeout(scrollToBottomGradually, 5000); // 等待页面加载
            }
        }

        // 开始滚动
        scrollToBottomGradually();
    }

    // 等待滚动容器出现后添加控制按钮
    waitForElement('div[data-radix-scroll-area-viewport].block.size-full.p-5', function(element) {
        console.log("滚动容器已找到，可以启动脚本");
        // 此时按钮已添加到页面，等待用户点击启动
    });

})();