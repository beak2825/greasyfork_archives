// ==UserScript==
// @name         B站合集批量下载辅助
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  获取指定合集列表的的内容并保存为txt文件，通过BBDown批量下载
// @author       our0boros
// @license MIT
// @match           *://*.bilibili.com/video/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @exclude         *://message.bilibili.com/pages/nav/header_sync
// @exclude         *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude         *://open-live.bilibili.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/543178/B%E7%AB%99%E5%90%88%E9%9B%86%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/543178/B%E7%AB%99%E5%90%88%E9%9B%86%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册油猴菜单命令
    GM_registerMenuCommand("提取B站BV号", extractBVNumbers, "b"); // 按Alt+B触发

    // 提取BV号函数
    function extractBVNumbers() {
        // 等待视频项加载完成
        waitForElement('.video-pod__item[data-key]', 5000)
            .then(videoItems => {
                if (!videoItems || videoItems.length === 0) {
                    throw new Error('未找到视频项，请确保页面已加载完成');
                }

                // 提取所有BV号
                const bvNumbers = Array.from(videoItems)
                    .map(item => item.getAttribute('data-key'))
                    .filter(Boolean); // 过滤空值

                if (bvNumbers.length === 0) {
                    throw new Error('未找到有效的BV号');
                }

                // 生成文本内容（每个BV号一行）
                const content = bvNumbers.join('\n');

                // 创建下载文件
                const fileName = `B站BV号列表_${new Date().toISOString().slice(0,10)}.txt`;

                // 下载文件
                if (typeof GM_download !== 'undefined') {
                    GM_download({
                        url: URL.createObjectURL(new Blob([content], {type: 'text/plain'})),
                        name: fileName,
                        saveAs: false
                    });
                } else {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
                // 生成批量下载命令
                const command = `@echo Off\nFor /F %%a in (${fileName}) Do (BBDown.exe "%%a")\npause`;
                // 将命令复制到剪贴板
                GM_setClipboard(command);
                // 弹出提示信息
                const message = `成功提取 ${bvNumbers.length} 个BV号；程序已经获取到了该用户的全部投稿视频地址，并将脚本代码保存到剪贴板中，你可以自行使用批处理脚本等手段调用本程序进行批量下载。请确保BBDown已正确配置`;
                // 显示成功提示
                showNotification(message);
            })
            .catch(error => {
                console.error('提取失败:', error);
                showNotification(error.message, 'error');
            });
    }

    // 等待元素出现的辅助函数
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            if (document.querySelectorAll(selector).length > 0) {
                return resolve(document.querySelectorAll(selector));
            }

            const observer = new MutationObserver(mutations => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    observer.disconnect();
                    resolve(elements);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(document.querySelectorAll(selector));
            }, timeout);
        });
    }

    // 显示通知的辅助函数
    function showNotification(message, type = 'info') {
        if (typeof unsafeWindow.Qmsg !== 'undefined') {
            unsafeWindow.Qmsg[type](message);
        } else {
            alert(message);
        }
    }

    // 页面加载时输出提示
    window.addEventListener('load', () => {
        console.log('B站BV号提取器已加载，点击油猴菜单中的"提取B站BV号"开始提取');
    });
})();