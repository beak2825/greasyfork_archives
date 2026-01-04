// ==UserScript==
// @name         头哥视频自动切换脚本
// @namespace    https://github.com/yghr3a
// @version      0.3.4
// @description  头哥视频自动播放下一个， 检测到视频暂停自动播放视频
// @author       yghr3a
// @license      MIT
// @match        *://www.educoder.net/classrooms/*
// @icon         https://th.bing.com/th?id=ODLS.d8b30dba-8ef1-46d4-96a2-e3cce7129fca&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521109/%E5%A4%B4%E5%93%A5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521109/%E5%A4%B4%E5%93%A5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MaxTryNum = 3;

    let modal = null;
    let titleBar = null;
    let messageList = null;

    function Wait(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function GetTitle()
    {
        let titleDiv = document.querySelector('div[class="title___bLyk5"]');
        return new String(titleDiv.textContent) ;
    }

    async function CatchVideo()
    {
        let video_container = document.querySelector('div[id="video-container"]');
        for(let cnt = 1;video_container == null && cnt <= MaxTryNum; cnt++)
        {
            video_container = document.querySelector('div[id="video-container"]');
            addMessage("尝试获取video_container失败, 重试中!");

            await Wait(1000);
        }

        let video = video_container.querySelector('video[id="video"]');
        for(let cnt = 1;video == null && cnt <= MaxTryNum; cnt++)
        {
            video = video_container.querySelector('video[id="video"]');
            addMessage("尝试获取video失败,重试中!");

            await Wait(1000);
        }

        addMessage("获取video成功!");

        return video;
    }

    async function GetVideoList()
    {
        addMessage("开始获取视频列表!");
        let divVideoList = document.querySelectorAll('div[class="brght___uqI6i"]');
        for(let cnt = 1;divVideoList == null && cnt <= MaxTryNum; cnt++)
        {
             divVideoList = document.querySelectorAll('div[class="brght___uqI6i"]');
             addMessage("尝试获取class = brght___uqI6i的全部div失败,重试中!");

            await Wait(1000);
        }

        return divVideoList;


    }

     async function Next(title)
    {
        await Wait(3000);

        let videoList = await GetVideoList();
        for(let i = 0; i < videoList.length; i++)
        {
            let div = videoList[i];
            if(videoList[i].title == title)
            {
                if(i >= videoList.length - 1)
                {
                    addMessage("已经到结尾!");
                    return;
                }
                addMessage("切换到下一个视频");
                videoList[i + 1].click();
            }
        }

    }

    function GetConfirmButton()
    {
        let button = document.querySelector('button[class="ant-btn css-lw48js ant-btn-primary"]');
        return button;
    }

    function GetPlayButton()
    {
        let button = document.querySelector('button[id="play"]');
        return button;
    }

    function CheckVideoIfPlay(button)
    {
        let status = button.querySelector('use[href="#play-icon"]');
        if(status == null)
        {
            addMessage("获取按钮状态失败!");
            return true;
        }

        if(status.getAttribute('style') == "display: block;")
        {
            return false;
        }
        else
        {
            return true;
        }

    }

    async function Loading()
    {
        await Wait(8000);
        let title = "hello_world";
        // 使用函数来显示悬浮窗
        createDraggableModal();
        addMessage("加载中!");

        let ifend = false;

        while(1)
        {
            await Wait(1000);

            // 通过通过实时获取标题来检测视频是否切换!
            let newTitle = GetTitle();

            if(title.trim().toLowerCase() !== newTitle.trim().toLowerCase())
            {
                addMessage("检测到视频切换!");
                title = newTitle;

                await Wait(2000);
                let video = await CatchVideo();


                video.addEventListener('ended', async () => {
                    addMessage("调用了ended事件, 等待三秒, 准备切换视频!");
                    ifend = true;
                    await Next(title);
                    ifend = false;
                });
            }

            // 通过实施检测PlayButton的状态来检测视频是否暂停!
            let PlayButton = GetPlayButton();
            if(PlayButton != null && CheckVideoIfPlay(PlayButton) == false)
            {
                if(ifend == false)
                {
                    addMessage("检测到视频暂停!");
                    PlayButton.click();
                }
            }

            // 通过实施尝试捕获确认按钮来检测页面是否存在确认按钮
            let ConfirmButton = GetConfirmButton();
            if(ConfirmButton != null)
            {
                 addMessage("检测到摄像头确认按钮!");
                 ConfirmButton.click();
            }

        }
    }

    // 创建一个函数来生成悬浮窗
    function createDraggableModal() {
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
        titleBar.textContent = '头哥视频自动切换脚本v0.3.2';

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