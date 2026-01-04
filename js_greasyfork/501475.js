// ==UserScript==
// @name         国家中小学智慧平台快速学习2004暑假研修（快速学习）
// @namespace    http://tampermonkey.net/
// @version      3.7
// @author       桥风online（修改版）
// @description  需要进入具体的播放页面，加载油猴，可全部完成本页视频播放。
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @license      桥风online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501475/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A02004%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%EF%BC%88%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501475/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A02004%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%EF%BC%88%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 拦截和修改XHR请求
    function interceptXHR() {
        const XHR = XMLHttpRequest.prototype;
        const open = XHR.open;
        const send = XHR.send;

        XHR.open = function (method, url) {
            this._url = url;
            return open.apply(this, arguments);
        };

        XHR.send = function () {
            this.addEventListener('load', function () {
                if (this._url.includes('progress') || this._url.includes('heartbeat')) {
                    console.log('拦截:', this._url);
                    try {
                        const json = JSON.parse(this.responseText);
                        json.progress = 100;
                        json.completed = true;
                        Object.defineProperty(this, 'responseText', {
                            get: function () { return JSON.stringify(json); }
                        });
                    } catch (e) {
                        console.error('修改响应失败:', e);
                    }
                }
            });
            return send.apply(this, arguments);
        };
    }

    // 模拟用户交互
    function simulateUserInteraction(video) {
        if (video) {
            video.dispatchEvent(new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true
            }));

            video.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        }
    }

    // 更新存储
    function updateStorage() {
        const storageKeys = ['videoProgress', 'courseProgress', 'lessonComplete'];
        storageKeys.forEach(key => {
            try {
                localStorage.setItem(key, '100');
                sessionStorage.setItem(key, '100');
            } catch (e) {
                console.error('更新存储失败:', e);
            }
        });
    }

    // 跳过单个视频
    function skipVideo(video) {
        return new Promise((resolve) => {
            if (video) {
                const button = document.querySelector('.fish-btn-primary span');
                if (button && button.textContent.trim() === '我知道了') {
                    // 如果找到了按钮,模拟点击事件
                    button.closest('button').click();
                    console.log('已点击"我知道了"按钮');
                } else {
                    console.log('未找到"我知道了"按钮');
                }
                video.dispatchEvent(new Event('ended'));
                setTimeout(function () {
                    video.muted = true;
                    video.playbackRate = 1.2;
                    video.play()
                    video.play().catch(e => console.error('播放视频错误:', e));
                }, 1500);

                simulateUserInteraction(video);
                updateStorage();
                if (typeof window.onVideoComplete === 'function') {
                    window.onVideoComplete();
                }
                if (typeof window.finishLesson === 'function') {
                    window.finishLesson();
                }

                setTimeout(resolve, 2000);
            } else {
                resolve();
            }
        });
    }

    // 展开所有折叠项并点击所有资源项
    async function expandAndClickAll() {
        // 点击顶层折叠项
        const topLevelHeaders = document.querySelectorAll('.fish-collapse-item > .fish-collapse-header');
        for (const header of topLevelHeaders) {
            if (header.getAttribute('aria-expanded') === 'false') {
                header.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // 点击二级折叠项
        const secondLevelHeaders = document.querySelectorAll('.fish-collapse-content .fish-collapse-header');
        for (const header of secondLevelHeaders) {
            if (header.getAttribute('aria-expanded') === 'false') {
                header.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

    }

    // 查找所有资源项
    async function findAllResourceItems() {
        await expandAndClickAll();
        return document.querySelectorAll('.resource-item.resource-item-train');
    }

    // 处理所有视频
    async function processAllVideos() {
        const resourceItems = await findAllResourceItems();
        console.log(`找到的资源项总数: ${resourceItems.length}`);

        for (let i = 0; i < resourceItems.length; i++) {
            const item = resourceItems[i];
            console.log(`正在处理第 ${i + 1} 项`);

            item.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            const video = document.querySelector('video');
            await skipVideo(video);

            console.log(`完成第 ${i + 1} 项`);
        }

        console.log("所有视频已处理完毕");
    }

    // 检查并更新按钮显示状态
    function updateButtonVisibility(button) {
        if (!window.location.href.includes("https://basic.smartedu.cn/teacherTraining/courseDetail")) {
            button.style.display = 'none';
        } else {
            button.style.display = 'block';
        }
    }

    // 主函数
    function main() {
        interceptXHR();

        // 添加控制按钮
        const controlButton = document.createElement('button');
        controlButton.textContent = '开始处理视频';
        controlButton.style.position = 'fixed';
        controlButton.style.top = '10px';
        controlButton.style.right = '10px';
        controlButton.style.zIndex = '9999';

        // 初始检查并更新按钮显示状态
        updateButtonVisibility(controlButton);

        controlButton.addEventListener('click', () => {
            if (controlButton.textContent === '开始处理视频') {
                processAllVideos().catch(error => {
                    console.error("发生错误:", error);
                });
                controlButton.textContent = '停止处理';
            } else {
                window.location.reload();
            }
        });

        document.body.appendChild(controlButton);
        // 监听URL变化
        window.onpopstate = function () {
            updateButtonVisibility(controlButton);
        };

        // 监听URL变化（包括点击返回按钮）
        const pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(history, arguments);
            updateButtonVisibility(controlButton);
        };
    }

    // 当页面加载完成时运行主函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();