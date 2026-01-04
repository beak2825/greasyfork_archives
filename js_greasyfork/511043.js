// ==UserScript==
// @name         职教云刷课😶‍🌫
// @namespace    Sherry's职教云
// @version      v3
// @description  刷职教云课程脚本
// @author       Sherry
// @match        *://zjy2.icve.com.cn/study*
// @icon         https://c-ssl.dtstatic.com/uploads/blog/202107/10/20210710080117_2bec6.thumb.1000_0.webp
// @downloadURL https://update.greasyfork.org/scripts/511043/%E8%81%8C%E6%95%99%E4%BA%91%E5%88%B7%E8%AF%BE%F0%9F%98%B6%E2%80%8D%F0%9F%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/511043/%E8%81%8C%E6%95%99%E4%BA%91%E5%88%B7%E8%AF%BE%F0%9F%98%B6%E2%80%8D%F0%9F%8C%AB.meta.js
// ==/UserScript==

(() => {
    'use strict';
    
    // 添加悬浮窗样式
    const style = document.createElement('style');
    style.textContent = `
        #speed-control {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 200px;
            user-select: none;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
        #speed-control .header {
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
            text-align: center;
            padding-bottom: 5px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        #speed-control .control-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        #speed-control input {
            width: 100%;
            padding: 8px;
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        #speed-control input:focus {
            border-color: #007AFF;
        }
        #speed-control button {
            width: 100%;
            padding: 8px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        }
        #speed-control button:hover {
            background: #0066CC;
        }
        #speed-control button:active {
            background: #004999;
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮窗
    const speedControl = document.createElement('div');
    speedControl.id = 'speed-control';
    speedControl.innerHTML = `
        <div class="header">职教云播放速度控制</div>
        <div class="control-group">
            <input type="number" id="speed-input" min="0.1" max="16" step="0.1" value="4">
            <button id="apply-speed">应用</button>
        </div>
    `;
    document.body.appendChild(speedControl);

    // 添加拖动功能
    function addDragability(element) {
        const header = element.querySelector('.header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        // 只有标题栏可以触发拖动
        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 在创建悬浮窗后添加拖动功能
    document.body.appendChild(speedControl);
    addDragability(speedControl);

    // 全局变量存储当前播放速度
    let currentSpeed = 4;

    // 更新播放速度的函数
    function updateVideoSpeed(speed) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = speed;
            currentSpeed = speed;
        }
    }

    // 添加按钮点击事件
    document.getElementById('apply-speed').addEventListener('click', () => {
        const speedInput = document.getElementById('speed-input');
        const newSpeed = parseFloat(speedInput.value);
        if (newSpeed >= 0.1 && newSpeed <= 16) {
            updateVideoSpeed(newSpeed);
        }
    });

    function executeScript() {
        var meta = document.createElement('meta');
        meta.name = "media";
        meta.content = "playback";
        document.querySelector('head').appendChild(meta);
        console.log("Script Startup!!!");
        if(document.querySelectorAll('span.el-link--inner')){
            var nextSection = document.querySelectorAll('span.el-link--inner')[2];
        }
        if (document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary ')){
            document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary ').click();
        }
        if (document.querySelector('video')) {
            var video = document.querySelector('video');
            if (video.paused) {
                console.log("Video is paused, playing");
                video.muted = true;
                if (document.querySelectorAll('.vjs-icon-placeholder')[0]){
                    document.querySelectorAll('.vjs-icon-placeholder')[0].click();
                }else{video.play();}
                console.log("Playback speed is enabled");
                // 使用保存的播放速度
                video.playbackRate = currentSpeed;
                video.addEventListener('ended', function() {
                    setTimeout(() => {
                        nextSection.click();
                    }, 2000);
                    setTimeout(executeScript, 5000);
                });
            }
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    video.muted = true;
                    video.play();
                }
            });
        } else if (document.querySelector('.el-image__inner.el-image__preview')) {
            var pageNext = document.querySelectorAll('.next')[0];
            var pageInfo = document.querySelector('.page');
            var totalPageNumber = pageInfo.textContent.match(/\d+/g)[1];
            var currentPageNumber = pageInfo.textContent.match(/\d+/g)[0];

            for (var i = 1; i < totalPageNumber; i++) {
                if (currentPageNumber < totalPageNumber){
                    console.log('Page turning');
                    pageNext.click();
                }
            }
            setTimeout(() => {
                nextSection.click();
                }, 2000);
            setTimeout(executeScript, 5000);
        } else {
            nextSection.click();
            setTimeout(executeScript, 5000);
        }

        // 检查是否显示"暂无课件"
        const noContentElement = document.querySelector('.no-content');
        if (noContentElement && noContentElement.innerText.includes('暂无课件')) {
            console.log("当前模块已完成！");
            alert("当前模块已完成！");
            return; // 结束当前执行
        }
    }

    setTimeout(executeScript, 5000);

    // 修改输入框的事件处理
    document.getElementById('speed-input').addEventListener('input', (e) => {
        // 限制输入范围
        let value = parseFloat(e.target.value);
        if (value < 0.1) e.target.value = 0.1;
        if (value > 16) e.target.value = 16;
    });

    // 确保数字输入框可以使用上下箭头调节
    document.getElementById('speed-input').addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.stopPropagation(); // 阻止事件冒泡
        }
    });
})();