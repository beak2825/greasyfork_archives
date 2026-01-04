// ==UserScript==
// @name         小恩专属升学e网通（EWT）刷课脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  支持视频自动切换并且自动点击检测点（悬浮窗反馈信息）
// @author       yghr3a
// @match        https://*.ewt360.com/*
// @license      MIT
// @icon         https://th.bing.com/th?id=ODLS.8f71fab6-d8fc-43f3-a56d-53f87a14d5c8&amp;w=32&amp;h=32&amp;qlt=90&amp;pcl=fffffa&amp;o=6&amp;pid=1.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542891/%E5%B0%8F%E6%81%A9%E4%B8%93%E5%B1%9E%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%EF%BC%88EWT%EF%BC%89%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542891/%E5%B0%8F%E6%81%A9%E4%B8%93%E5%B1%9E%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%EF%BC%88EWT%EF%BC%89%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MaxTryNum = 3;

    let modal = null;
    let titleBar = null;
    let messageList = null;

    let DraggableModalTitle = "小恩专属e网通刷课脚本";

    function Wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function GetCheckButton() {
        let button = document.querySelector('span.btn-3LStS');
        return button;
    }

    function GetTitle() {
        let titleText = document.querySelector('div.title-1dNOi');
        if (!titleText) return '';
        let text = '';
        Array.from(titleText.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent.trim();
            }
        });
        return text;
    }

    async function GetVideoList() {
        addMessage("⭐开始get视频列表喵");
        let divVideoList = document.querySelector('div.listCon-N9Rlm');
        for(let cnt = 1; divVideoList == null && cnt <= MaxTryNum; cnt++) {
            divVideoList = document.querySelector('div.listCon-N9Rlm');
            addMessage("⭐尝试获取失败,重试ing");
            await Wait(1000);
        }
        let videoList = divVideoList ? divVideoList.children : null;

        if(videoList != null) {
            addMessage("⭐get视频列表成功喵");
            return videoList;
        } else {
            addMessage("⭐get视频列表失败喵QWQ");
            return null;
        }
    }

    async function CatchVideo() {
        let video = document.querySelector('video.vjs-tech');
        for(let cnt = 1; video == null && cnt <= MaxTryNum; cnt++) {
            video = document.querySelector('video.vjs-tech');
            addMessage("⭐尝试获取视频失败,重试ing喵");
            await Wait(1000);
        }
        if (video) addMessage("⭐获取video成功喵");
        return video;
    }

    async function Next(title) {
        await Wait(3000);
        let videoList = await GetVideoList();
        if (!videoList) return;
        addMessage(title);
        for(let i = 0; i < videoList.length - 1; i++) {
            let div = videoList[i];
            let divTitleElem = div.querySelector('div.lessontitle-x9B-7');
            if (!divTitleElem) continue;
            let divTitle = divTitleElem.textContent;
            addMessage(divTitle);
            if(divTitle == title) {
                if(i >= videoList.length - 2) {
                    addMessage("⭐已经到结尾喵");
                    return;
                }
                addMessage("⭐切换到下一个视频喵");
                videoList[i + 1].click();
                return;
            }
        }
    }

    async function Loading() {
        await Wait(2000);
        let title = "hello_world";
        createDraggableModal();
        addMessage("⭐加载ing");

        while(true) {
            await Wait(1000);
            let newTitle = GetTitle();
            if(title !== newTitle) {
                addMessage("⭐检测到视频切换喵");
                title = newTitle;
                await Wait(1000);
                let video = await CatchVideo();
                if (video) {
                    video.addEventListener('ended', async () => {
                        addMessage(" ⭐准备切换视频喵");
                        await Next(title);
                    }, { once: true });
                }
            }

            let checkButton = GetCheckButton();
            if(checkButton != null) {
                addMessage("⭐找到检测按钮喵，已自动点击喵");
                checkButton.click();
            }
        }
    }

    function createDraggableModal() {
        modal = document.createElement('div');
        modal.id = 'draggableModal';
        modal.style.position = 'fixed';
        modal.style.top = '50px';
        modal.style.left = '50px';
        modal.style.width = '360px';
        modal.style.height = '350px';
        modal.style.backgroundColor = '#1e1e2f'; // 深色背景
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
        modal.style.zIndex = '10000';
        modal.style.overflow = 'hidden';
        modal.style.userSelect = 'none';
        modal.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        modal.style.color = '#ddd';

        messageList = document.createElement('div');
        messageList.style.height = '300px';
        messageList.style.overflowY = 'auto';
        messageList.style.padding = '15px 20px';
        messageList.style.backgroundColor = '#2a2a40';
        messageList.style.borderTop = '1px solid #444';
        messageList.style.fontSize = '14px';
        messageList.style.lineHeight = '1.5';
        messageList.style.whiteSpace = 'pre-wrap';

        titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#29294d';
        titleBar.style.padding = '14px 20px';
        titleBar.style.cursor = 'move';
        titleBar.style.fontWeight = '600';
        titleBar.style.fontSize = '16px';
        titleBar.style.color = '#f0f0f0';
        titleBar.style.userSelect = 'none';
        titleBar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        titleBar.textContent = DraggableModalTitle;

        modal.appendChild(titleBar);
        modal.appendChild(messageList);

        document.body.appendChild(modal);

        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                modal.style.left = (e.clientX - offsetX) + 'px';
                modal.style.top = (e.clientY - offsetY) + 'px';
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    function addMessage(msg) {
        var message = document.createElement('div');
        message.textContent = msg;
        message.style.marginBottom = '5px';
        messageList.appendChild(message);
        messageList.scrollTop = messageList.scrollHeight;
    }

    window.onload = Loading;
})();
