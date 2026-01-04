// ==UserScript==
// @name         华科课程平台刷课助手
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  华中科技大学课程平台刷课助手，点击右上角完成视频，可以直接完成单个视频
// @author       DavLiu
// @license      MIT
// @include        *://smartcourse.hust.edu.cn/*
// @include        *://smartcourse.hust.edu.cn/mooc-smartcourse/*
// @include        *://smartcourse.hust.edu.cn/mooc-smartcourse/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hust.edu.cn
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/522785/%E5%8D%8E%E7%A7%91%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522785/%E5%8D%8E%E7%A7%91%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查是否在学习页面
    function isStudyPage() {
        return window.location.href.includes('studentstudy') &&
            !window.location.href.includes('login');
    }

    // 添加控制按钮
    function addControlButton() {
        if (document.querySelector('.video-helper-btn')) return;

        const button = document.createElement('button');
        button.className = 'video-helper-btn';
        button.innerHTML = '完成视频';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        button.onclick = hackVideoPlayer;
        document.body.appendChild(button);
    }

    // 修改视频播放器状态
    function hackVideoPlayer() {
        console.log('开始处理视频...');

        // 等待iframe加载
        function checkAndWaitForIframe() {
            const mainFrame = document.getElementById('iframe');
            console.log('查找主iframe:', mainFrame ? '已找到' : '未找到');

            if (!mainFrame) {
                console.log('等待主iframe加载...');
                setTimeout(checkAndWaitForIframe, 1000);
                return;
            }

            // 等待视频iframe加载
            function checkAndWaitForVideoFrame() {
                const videoFrame = mainFrame.contentWindow?.document.querySelector('iframe');
                console.log('查找视频iframe:', videoFrame ? '已找到' : '未找到');

                if (!videoFrame) {
                    console.log('等待视频iframe加载...');
                    setTimeout(checkAndWaitForVideoFrame, 1000);
                    return;
                }

                // 注入视频控制代码
                console.log('开始注入控制代码...');
                videoFrame.contentWindow.eval(`
                    function modifyPlayer() {
                        if(typeof videojs === 'undefined' || !videojs.getAllPlayers().length) {
                            console.log('等待播放器初始化...');
                            setTimeout(modifyPlayer, 1000);
                            return;
                        }

                        console.log('找到播放器，开始修改...');
                        const player = videojs.getAllPlayers()[0];
                        if(player) {
                            try {
                                // 自动点击播放按钮
                                player.play();

                                // 修改播放器状态
                                player.currentTime(player.duration());

                                // 触发完成事件
                                player.trigger('ended');

                                // 修改进度报告函数
                                player.reportProgress = function() {
                                    return {
                                        completed: true,
                                        duration: this.duration(),
                                        position: this.duration()
                                    };
                                };

                                // 自动触发完成回调
                                if(typeof ed_complete === 'function') {
                                    setTimeout(ed_complete, 1000);
                                }

                                console.log('视频处理完成！');
                            } catch(e) {
                                console.error('处理视频时出错:', e);
                            }
                        }
                    }
                    modifyPlayer();
                `);
            }
            checkAndWaitForVideoFrame();
        }
        checkAndWaitForIframe();
    }

    // 初始化
    function init() {
        if (!isStudyPage()) {
            console.log('不是学习页面，脚本不执行');
            return;
        }

        console.log('视频助手初始化...');
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .video-helper-btn:hover {
                background: #45a049 !important;
            }
        `;
        document.head.appendChild(style);

        // 添加按钮
        addControlButton();
    }

    // 监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    }).observe(document, { subtree: true, childList: true });

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();