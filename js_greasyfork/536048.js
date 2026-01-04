// ==UserScript==
// @name         SpaceKG自动学习脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成SpaceKG平台的学习任务
// @author       dangel
// @match        https://ai.spacekg.com/*
// @match        https://spacekg.com/pdf_view/web/viewer.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536048/SpaceKG%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/536048/SpaceKG%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断是否为PDF iframe页面
    if (window.location.pathname.startsWith('/pdf_view/web/viewer.html')) {
        console.log('[PDF调试] 进入PDF自动滚动分支');
        function waitForPDFAndScroll() {
            const pdfContainer = document.querySelector('#viewerContainer');
            const viewer = document.querySelector('#viewer');
            if (!pdfContainer || !viewer) {
                setTimeout(waitForPDFAndScroll, 500);
                return;
            }
            // 检查是否有页面元素，且scrollHeight明显大于clientHeight
            const pageCount = viewer.querySelectorAll('.page').length;
            const scrollHeight = pdfContainer.scrollHeight;
            const clientHeight = pdfContainer.clientHeight;
            console.log(`[PDF调试] 等待PDF加载: pageCount=${pageCount}, scrollHeight=${scrollHeight}, clientHeight=${clientHeight}`);
            if (pageCount === 0 || scrollHeight <= clientHeight + 10) {
                setTimeout(waitForPDFAndScroll, 500);
                return;
            }
            // PDF已加载，开始滚动
            console.log('[PDF调试] PDF内容已加载，开始自动滚动');
            let scrollInterval = setInterval(() => {
                const scrollHeight = pdfContainer.scrollHeight;
                const scrollTop = pdfContainer.scrollTop;
                const clientHeight = pdfContainer.clientHeight;
                console.log(`[PDF调试] 滚动: scrollTop=${scrollTop}, clientHeight=${clientHeight}, scrollHeight=${scrollHeight}`);
                if (scrollTop + clientHeight >= scrollHeight - 2) {
                    clearInterval(scrollInterval);
                    console.log('[PDF调试] 已滚动到底部，停止滚动');
                    // 通知父页面进入下一单元
                    if (window.parent !== window) {
                        window.parent.postMessage({type: 'autojs-pdf-finished'}, '*');
                    }
                    return;
                }
                pdfContainer.scrollTop += 50;
            }, 100);
        }
        waitForPDFAndScroll();
        return;
    }

    // 以下为主页面自动刷课逻辑
    console.log('脚本开始执行');

    // 配置项
    const config = {
        checkInterval: 5000,    // 检查间隔（毫秒）
        minPlayTime: 30,        // 最小播放时间（秒）
        pdfScrollInterval: 100, // PDF滚动间隔（毫秒）
        pdfScrollStep: 50,      // PDF每次滚动像素
        pdfRetryInterval: 1000, // PDF未加载时重试间隔
        pdfMaxRetry: 30         // 最多重试30次
    };

    let isAutoPlayEnabled = false;
    let isScrollingPDF = false;
    let pdfRetryCount = 0;

    // 检查是否是测验单元
    function isQuizUnit() {
        // 只检测页面中是否存在 class="ant-alert-message" 且内容包含"答题进行中"
        const alert = document.querySelector('.ant-alert-message');
        return alert && alert.textContent.includes('答题进行中');
    }

    // 获取PDF容器
    function getPDFViewer() {
        const viewerContainer = document.querySelector('#viewerContainer');
        const viewer = document.querySelector('#viewer');
        const pdfViewer = document.querySelector('.pdfViewer');
        console.log('[调试] getPDFViewer 检查:');
        console.log('  #viewerContainer:', viewerContainer);
        console.log('  #viewer:', viewer);
        console.log('  .pdfViewer:', pdfViewer);
        return viewerContainer;
    }

    // 添加控制按钮
    function addControlButton() {
        console.log('添加控制按钮');
        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'auto-study-control';
        buttonDiv.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 999999;
            font-size: 14px;
            font-family: Arial, sans-serif;
            cursor: pointer;
            user-select: none;
        `;
        buttonDiv.textContent = '点击启动自动学习';
        buttonDiv.onclick = () => {
            isAutoPlayEnabled = true;
            buttonDiv.textContent = '自动学习中...';
            buttonDiv.style.background = 'rgba(0, 128, 0, 0.7)';
            autoStudy();
        };
        document.body.appendChild(buttonDiv);
        console.log('控制按钮已添加');
    }

    // 添加状态显示
    function addStatusDisplay() {
        console.log('尝试添加状态显示');
        if (document.getElementById('auto-study-status')) {
            console.log('状态显示已存在');
            return;
        }
        const statusDiv = document.createElement('div');
        statusDiv.id = 'auto-study-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 999999;
            font-size: 14px;
            font-family: Arial, sans-serif;
        `;
        statusDiv.textContent = '自动学习脚本已启动';
        document.body.appendChild(statusDiv);
        console.log('状态提示已添加');
    }

    // 处理视频播放
    function handleVideoPlay(video) {
        console.log('处理视频播放');
        if (video.paused) {
            console.log('视频暂停中，尝试播放');
            video.play().then(() => {
                console.log('视频开始播放');
            }).catch(error => {
                console.log('视频播放失败:', error);
                const statusDiv = document.getElementById('auto-study-status');
                if (statusDiv) {
                    statusDiv.textContent = '请点击视频开始播放';
                    statusDiv.style.background = 'rgba(255, 0, 0, 0.7)';
                }
            });
        } else {
            console.log('视频已在播放中');
        }
        video.addEventListener('timeupdate', () => {
            if (video.currentTime > config.minPlayTime && 
                video.currentTime >= video.duration - 1) {
                console.log('视频即将结束，准备进入下一单元');
                clickNextUnit();
            }
        });
        video.addEventListener('error', (e) => {
            console.log('视频播放错误:', e);
            video.load();
            video.play().catch(error => {
                console.log('视频重新播放失败:', error);
            });
        });
    }

    // 点击下一单元
    function clickNextUnit() {
        console.log('尝试点击下一单元');
        const nextButton = document.querySelector('.right.text_hover');
        if (nextButton) {
            nextButton.click();
            console.log('已点击下一单元');
        } else {
            console.log('未找到下一单元按钮');
        }
    }

    // 等待页面加载完成
    function waitForPageLoad() {
        console.log('等待页面加载');
        if (document.readyState === 'complete') {
            console.log('页面已加载完成');
            addStatusDisplay();
            addControlButton();
        } else {
            console.log('页面正在加载，添加加载事件监听器');
            window.addEventListener('load', () => {
                console.log('页面加载完成（通过事件监听器）');
                addStatusDisplay();
                addControlButton();
            });
        }
    }

    // 主函数
    function autoStudy() {
        if (!isAutoPlayEnabled) {
            return;
        }
        console.log('执行autoStudy函数');
        if (!window.location.href.includes('attendclass')) {
            console.log('不在课程页面');
            return;
        }
        if (isQuizUnit()) {
            console.log('检测到测验单元，准备跳过');
            const statusDiv = document.getElementById('auto-study-status');
            if (statusDiv) {
                statusDiv.textContent = '检测到测验单元，正在跳过...';
                statusDiv.style.background = 'rgba(255, 165, 0, 0.7)';
            }
            setTimeout(clickNextUnit, 1000);
            return;
        }
        const video = document.querySelector('#customVideo');
        if (video) {
            console.log('找到视频元素，开始处理视频播放');
            handleVideoPlay(video);
        } else {
            console.log('未找到视频元素');
        }
    }

    // 监听PDF完成消息，自动进入下一单元
    window.addEventListener('message', function(event) {
        if (event && event.data && event.data.type === 'autojs-pdf-finished') {
            console.log('[主页面] 收到PDF完成消息，自动进入下一单元');
            clickNextUnit();
        }
    });
    
    setInterval(autoStudy, config.checkInterval);
    console.log('准备启动脚本');
    waitForPageLoad();
})(); 