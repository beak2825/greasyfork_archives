// ==UserScript==
// @name         抖音网页直播点赞(可调节频率，可设置是否默认自动点赞)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  这是一个基于抖音直播的自动点赞脚本，支持调节点赞频率，修改自别人的脚本
// @author       余某人
// @match        *://live.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522658/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%82%B9%E8%B5%9E%28%E5%8F%AF%E8%B0%83%E8%8A%82%E9%A2%91%E7%8E%87%EF%BC%8C%E5%8F%AF%E8%AE%BE%E7%BD%AE%E6%98%AF%E5%90%A6%E9%BB%98%E8%AE%A4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522658/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%82%B9%E8%B5%9E%28%E5%8F%AF%E8%B0%83%E8%8A%82%E9%A2%91%E7%8E%87%EF%BC%8C%E5%8F%AF%E8%AE%BE%E7%BD%AE%E6%98%AF%E5%90%A6%E9%BB%98%E8%AE%A4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

        let page = document.getElementsByTagName('body')[0];
        // 首先添加全局样式
        function addGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }

        // 添加所有需要的样式
        addGlobalStyle(`
            .kolento {
                content: '';
                font-size: 14px;
                position: relative;
                z-index: 500;
                cursor: pointer;
                background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                border-radius: 50%;
                color: #fff;
                display: block;
                width: 46px;height: 46px;
                line-height: 16px;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all ease 0.3s;

            }
            .kolento:hover {
                background-color: #4abf8a;
                transform: rotate(360deg);
                opacity:1;
            }

            .total {
                font-size: 14px;
                position: relative;
                z-index: 500;
                background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                color: #fff;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all ease 0.3s;
                padding: 5px 8px;
                border-radius: 20px;

                margin-left: 10px;
            }
            .total p {
                color:#fff;

            }

            .freq-adjuster {
                position: absolute;
                top: 50px;
                right: 0;
                z-index: 500;
                background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                color: #fff;
                padding: 8px;
                border-radius: 20px;
                display: none;
                flex-direction: column;
                gap: 8px;
                opacity:0.8;
                width: 180px;
            }

            .freq-adjuster > div {
                display: flex;
                align-items: center;
                gap: 5px;

            }

            .freq-input {
                width: 100px;
                border: none;
                border-radius: 10px;
                padding: 2px 5px;
                text-align: center;
                font-size: 14px;

            }

            .freq-label {
                font-size: 12px;
                white-space: nowrap;

            }

            .auto-like-option {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 12px;
                cursor: pointer;

            }

            .auto-like-checkbox {
                cursor: pointer;

            }

            /* 新增样式 */
            .like-container {
                position: fixed;
                top: 70px;
                right: 30px;
                z-index: 500;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                cursor: move;
                transition: opacity 0.3s ease;
            }

            .toggle-button {
                font-size: 14px;
                background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                border-radius: 50%;
                color: #fff;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all ease 0.3s;
            }

            .toggle-button:hover {
                opacity: 1;
            }

            .like-content {
                margin-top: 10px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                position: relative;
            }

            .hidden {
                display: none !important;
            }

            .controls-row {
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }

            .opacity-slider-container {
                position: absolute;
                top: -40px;
                right: 0;
                background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                padding: 5px 10px;
                border-radius: 20px;
                display: none;
                align-items: center;
                gap: 5px;
                z-index: 501;
            }

            .opacity-slider {
                width: 100px;
                cursor: pointer;
            }

            .opacity-label {
                color: white;
                font-size: 12px;
                white-space: nowrap;
            }
        `);

        // 创建容器元素
        let likeContainer = document.createElement("div");
        likeContainer.className = "like-container";
        page.append(likeContainer);

        // 创建切换按钮
        let toggleButton = document.createElement("div");
        toggleButton.className = "toggle-button";
        toggleButton.innerHTML = "▼";
        likeContainer.append(toggleButton);

        // 创建内容容器
        let likeContent = document.createElement("div");
        likeContent.className = "like-content";
        likeContainer.append(likeContent);

        // 创建控件行容器
        let controlsRow = document.createElement("div");
        controlsRow.className = "controls-row";
        likeContent.append(controlsRow);

        // 创建点赞按钮
        let kolento = document.createElement("p");
        kolento.className = "kolento";
        kolento.innerHTML = '开始<br/>点赞';
        controlsRow.append(kolento);

        // 创建点击数显示
        let total = document.createElement("div");
        total.className = "total";
        total.innerHTML = '<p class="text">点击数：</p><p class="kolento-all">0</p>';
        controlsRow.append(total);

        // 创建频率调整器
        let freqAdjuster = document.createElement("div");
        freqAdjuster.className = "freq-adjuster";
        freqAdjuster.innerHTML = `
            <div>
                <span class="freq-label">点赞频率(ms):</span>
                <input type="number" class="freq-input" value="120000" min="1" max="120000">
            </div>
            <div>
                <span class="opacity-label">透明度:</span>
                <input type="range" class="opacity-slider" min="10" max="100" value="40">
            </div>
            <label class="auto-like-option">
                <input type="checkbox" class="auto-like-checkbox">
                <span>默认自动点赞</span>
            </label>
        `;
        likeContent.append(freqAdjuster);

        // 实现拖拽功能
        let isDragging = false;
        let offsetX, offsetY;
        let dragStartTime = 0;
        const DRAG_THRESHOLD = 200; // 拖动时间阈值，单位毫秒

        likeContainer.addEventListener('mousedown', function(e) {
            // 如果点击的是toggle-button，不启动拖拽，直接处理点击事件
            if (e.target === toggleButton) {
                toggleLikeContent();
                e.stopPropagation();
                return;
            }

            // 只有点击容器本身时才启动拖拽
            if (e.target === likeContainer) {
                isDragging = true;
                dragStartTime = Date.now();
                offsetX = e.clientX - likeContainer.getBoundingClientRect().left;
                offsetY = e.clientY - likeContainer.getBoundingClientRect().top;

                // 防止拖拽时选中文本
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;

            // 确保不超出屏幕边界
            left = Math.max(0, Math.min(left, window.innerWidth - likeContainer.offsetWidth));
            top = Math.max(0, Math.min(top, window.innerHeight - likeContainer.offsetHeight));

            likeContainer.style.left = left + 'px';
            likeContainer.style.top = top + 'px';
            likeContainer.style.right = 'auto';
        });

        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
            }
        });

        // 添加一个专门的切换函数
        function toggleLikeContent() {
            if (likeContent.classList.contains('hidden')) {
                likeContent.classList.remove('hidden');
                toggleButton.innerHTML = "▼";
            } else {
                likeContent.classList.add('hidden');
                toggleButton.innerHTML = "▲";
            }
            // 保存显示状态
            localStorage.setItem('likeContentHidden', likeContent.classList.contains('hidden'));
        }

        // 从localStorage获取显示状态
        const isContentHidden = localStorage.getItem('likeContentHidden') === 'true';
        if (isContentHidden) {
            likeContent.classList.add('hidden');
            toggleButton.innerHTML = "▲";
        }

        var timeBox;
        let totalNum = 0;
        let likeFrequency = 120000; // 从50改为100
        let num = document.getElementsByClassName('kolento-all')[0];
        console.log('num',num);
        num.innerHTML=totalNum;

        let target = document.getElementsByClassName('LO5TGkc0')

        // 修改hover事件监听，使用更可靠的方式
        let freqAdjusterVisible = false;
        let freqAdjusterTimeout;

        // 修改为hover整个容器时显示频率调节器
        likeContainer.addEventListener('mouseenter', function() {
            clearTimeout(freqAdjusterTimeout);
            freqAdjuster.style.display = 'flex';
            freqAdjusterVisible = true;
        });

        likeContainer.addEventListener('mouseleave', function() {
            freqAdjusterTimeout = setTimeout(() => {
                if (!freqAdjuster.matches(':hover')) {
                    freqAdjuster.style.display = 'none';
                    freqAdjusterVisible = false;
                }
            }, 300);
        });

        freqAdjuster.addEventListener('mouseenter', function() {
            clearTimeout(freqAdjusterTimeout);
            freqAdjuster.style.display = 'flex';
            freqAdjusterVisible = true;
        });

        freqAdjuster.addEventListener('mouseleave', function() {
            freqAdjusterTimeout = setTimeout(() => {
                if (!likeContainer.matches(':hover')) {
                    freqAdjuster.style.display = 'none';
                    freqAdjusterVisible = false;
                }
            }, 300);
        });

        // 透明度滑块事件
        const opacitySlider = document.querySelector('.opacity-slider');
        opacitySlider.addEventListener('input', function(e) {
            const opacity = e.target.value / 100;
            likeContainer.style.opacity = opacity;
            localStorage.setItem('likeContainerOpacity', opacity);
        });

        // 从localStorage获取透明度设置
        const savedOpacity = localStorage.getItem('likeContainerOpacity');
        if (savedOpacity) {
            likeContainer.style.opacity = savedOpacity;
            opacitySlider.value = savedOpacity * 100;
        } else {
            likeContainer.style.opacity = 0.4;
            opacitySlider.value = 40;
        }

        // 修改点击事件，添加防止拖动触发的判断
        let clickStartTime = 0;
        let isClickDragging = false;

        kolento.addEventListener('mousedown', function(e) {
            clickStartTime = Date.now();
            isClickDragging = false;
            e.stopPropagation(); // 防止事件冒泡到容器
        });

        kolento.addEventListener('mousemove', function() {
            if (Date.now() - clickStartTime > 100) { // 如果移动超过100ms，认为是拖动
                isClickDragging = true;
            }
        });

        kolento.addEventListener('mouseup', function(e) {
            if (!isClickDragging) {
                // 执行点赞逻辑
                if(kolento.innerHTML.indexOf('开始')>-1){
                    console.log('执行点赞脚本')
                    kolento.innerHTML='停止<br/>点赞'
                    timeBox = setInterval(()=>{
                        totalNum++;
                        num.innerHTML=totalNum;
                        target[0].click();
                    }, likeFrequency);
                }else{
                    console.log('停止点赞');
                    clearInterval(timeBox);
                    kolento.innerHTML='开始<br/>点赞'
                }
            }
            e.stopPropagation(); // 防止事件冒泡到容器
        });

        // 获取频率输入框并添加事件监听
        const freqInput = document.querySelector('.freq-input');
        freqInput.addEventListener('change', function(e) {
            likeFrequency = parseInt(e.target.value, 10) || 120000;
            localStorage.setItem('likeFrequency', likeFrequency);

            // 如果正在点赞，重新设置定时器
            if(kolento.innerHTML.indexOf('停止') > -1) {
                clearInterval(timeBox);
                timeBox = setInterval(() => {
                    totalNum++;
                    num.innerHTML = totalNum;
                    target[0].click();
                }, likeFrequency);
            }
        });

        // 从localStorage获取频率设置
        const savedFrequency = localStorage.getItem('likeFrequency');
        if (savedFrequency) {
            likeFrequency = parseInt(savedFrequency, 10);
            freqInput.value = likeFrequency;
        }

        // 获取复选框元素
        const autoLikeCheckbox = document.querySelector('.auto-like-checkbox');

        // 从localStorage获取设置，如果没有则默认为false
        const autoLikeEnabled = localStorage.getItem('autoLikeEnabled');
        const shouldAutoLike = autoLikeEnabled === null ? false : autoLikeEnabled === 'true';

        // 设置复选框初始状态
        autoLikeCheckbox.checked = shouldAutoLike;

        // 如果启用了自动点赞，自动开始点赞
        if (shouldAutoLike) {
            kolento.innerHTML = '停止<br/>点赞';
            timeBox = setInterval(() => {
                totalNum++;
                num.innerHTML = totalNum;
                target[0].click();
            }, likeFrequency);
        }

        // 监听复选框变化
        autoLikeCheckbox.addEventListener('change', function(e) {
            localStorage.setItem('autoLikeEnabled', e.target.checked);
        });

        // 防止输入框事件冒泡
        freqInput.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });

        autoLikeCheckbox.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });

        opacitySlider.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
})();