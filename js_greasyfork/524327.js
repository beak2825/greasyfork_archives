// ==UserScript==
// @name         升学e网通刷课脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  支持视频自动切换、自动确认随机弹出的检测点
// @author       yghr3a
// @match        https://*.ewt360.com/*
// @license      MIT
// @icon         https://th.bing.com/th?id=ODLS.8f71fab6-d8fc-43f3-a56d-53f87a14d5c8&amp;w=32&amp;h=32&amp;qlt=90&amp;pcl=fffffa&amp;o=6&amp;pid=1.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524327/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/524327/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MaxTryNum = 3;

    let modal = null;
    let titleBar = null;
    let messageList = null;

    let DraggableModalTitle = "升学e网通刷课脚本"

    function Wait(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function GetCheckButton()
    {
        let button = document.querySelector('span[class="btn-3LStS"]');
        return button;
    }


    function GetTitle()
    {
        let titleText = document.querySelector('div[class="title-1dNOi"]');
        //return new String(titleDiv.textContent);

        let text = '';
        // 遍历元素的所有子节点
        Array.from(titleText.childNodes).forEach(node => {
        // 检查节点类型
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent.trim();
            }
        });
        return text;

    }

    async function GetVideoList()
    {
        addMessage("开始获取视频列表!");
        let divVideoList = document.querySelector('div[class="listCon-N9Rlm"]');
        for(let cnt = 1;divVideoList == null && cnt <= MaxTryNum; cnt++)
        {
             divVideoList = document.querySelector('div[class="listCon-N9Rlm"]');
             addMessage("尝试获取失败,重试中!");
            await Wait(1000);
        }

        let videoList = divVideoList.children;

        if(videoList != null)
        {
            addMessage("获取视频列表成功！");
            return videoList;
        }
        else
        {
            addMessage("获取视频列表失败！");
            return null;
        }
    }

    async function CatchVideo()
    {
        let video = document.querySelector('video[class="vjs-tech"]');
        //let video = document.querySelector('video[id="vjs_video_3_html5_api"]');
        for(let cnt = 1;video == null && cnt <= MaxTryNum; cnt++)
        {
            video = document.querySelector('video[class="vjs-tech"]');
            //video = document.querySelector('video[id="vjs_video_3_html5_api"]');
            addMessage("尝试获取video失败,重试中!");

            await Wait(1000);
        }

        addMessage("获取video成功!");

        return video;
    }

     async function Next(title)
    {
        await Wait(3000);

        let videoList = await GetVideoList();

        addMessage(title);
        for(let i = 0; i < videoList.length - 1; i++)
        {
            let div = videoList[i];
            let divTitle = div.querySelector('div[class="lessontitle-x9B-7"]').textContent;
            addMessage(divTitle);
            if(divTitle == title)
            {
                if(i >= videoList.length - 2)
                {
                    addMessage("已经到结尾!");
                    return;
                }
                addMessage("切换到下一个视频");
                videoList[i + 1].click();
            }
        }

    }

    async function Loading()
    {
        await Wait(2000);
        //let videoList = await GetVideoList();
        let title = "hello_world";
        // 使用函数来显示悬浮窗
        createDraggableModal();
        addMessage("加载中!");

        while(1)
        {
            await Wait(1000);

            // 通过通过实时获取标题来检测视频是否切换!
            let newTitle = GetTitle();
            if(title !== newTitle)
            {
                addMessage("检测到视频切换!");
                title = newTitle;

                await Wait(1000);
                let video = await CatchVideo();

                video.addEventListener('ended', async () => {
                    addMessage(" 准备切换视频!");
                    await Next(title);
                });
            }

            let checkButton = GetCheckButton();
            if(checkButton != null)
            {
                addMessage("找到检测按钮！");
                checkButton.click();
            }

        }

    }


        // 创建一个函数来生成悬浮窗
    function createDraggableModal()
    {
        // 模态框容器
        modal = document.createElement('div');
        modal.id = 'draggableModal';
        modal.style.position = 'fixed';
        modal.style.top = '50px'; // 初始位置
        modal.style.left = '50px';
        modal.style.width = '350px';
        modal.style.height = '350px';
        modal.style.backgroundColor = '#fff';
        modal.style.border = '1px solid #ccc';
        modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        modal.style.zIndex = '1000';
        modal.style.overflow = 'hidden'; // 隐藏溢出内容
        modal.style.resize = 'both'; // 允许调整大小（可选，但此处为演示目的）
        modal.style.userSelect = 'none'; // 禁止文本选择'
        modal.style.resize = 'none';

        // 消息列表容器
        messageList = document.createElement('div');
        messageList.style.height = '300px'; // 固定高度
        messageList.style.overflowY = 'auto'; // 垂直滚动条
        messageList.style.padding = '10px';
        messageList.style.borderBottom = '1px solid #ccc'; // 底部边框分隔

        // 标题栏（用于拖动）
        titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#f0f0f0';
        titleBar.style.padding = '10px';
        titleBar.style.cursor = 'move';
        titleBar.textContent = DraggableModalTitle;

        // 将元素组合起来
        modal.appendChild(titleBar);
        modal.appendChild(messageList);

        // 将模态框添加到body元素的末尾
        document.body.appendChild(modal);

        // 拖动逻辑
        var isDragging = false;
        var offsetX, offsetY;

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

    function addMessage(msg)
    {
        var message = document.createElement('div');
        message.textContent = msg;
        message.style.marginBottom = '5px';
        messageList.appendChild(message);
    }

    window.onload = Loading;

})();