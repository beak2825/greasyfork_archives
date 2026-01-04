// ==UserScript==
// @name         小叶的视频倍速播放器增强版 - 适配所有网站
// @namespace    https://github.com/YiPort
// @version      1.0.2.1
// @description  适用于所有网站，快捷方便进行速度的控制，一键解除完整视频速度的倍速限速，提供倍速控制面板和快捷键支持，自适应倍速播放功能。
// @author       小叶
// @match        *://*/*
// @license MIT
// @icon         https://img20.360buyimg.com/openfeedback/jfs/t1/343217/38/22253/32013/690a29b2F838c0b8d/a3269ed44242b2ff.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531984/%E5%B0%8F%E5%8F%B6%E7%9A%84%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88%20-%20%E9%80%82%E9%85%8D%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/531984/%E5%B0%8F%E5%8F%B6%E7%9A%84%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88%20-%20%E9%80%82%E9%85%8D%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 全局配置
    const CONFIG = {
        UI: {
            ICON_URL: 'https://avatars.githubusercontent.com/u/120383087'
        },
        SPEED_UI: {
            SHOW_SPEED_UI: false // 设置是否显示倍速UI，默认为true
        },
        STYLE: {
            COLORS: {
                PRIMARY: '#00A1D6',
                SECONDARY: '#40E0D0'
            },
            BORDER_RADIUS: {
                SMALL: '4px',
                MEDIUM: '8px',
                LARGE: '16px'
            },
            TRANSITIONS: {
                DEFAULT: 'all 0.3s ease'
            }
        },
        LAYOUT: {
            TRIGGER_WIDTH: {
                DEFAULT: '40px',
                EXPANDED: '80px'
            }
        }
    };

    // 初始化倍速播放器功能
    let currentSpeed = 1.0;
    let originalSpeed = 1.0; // 记录原始倍速

    /**
     * 将页面上所有 <video> 标签的播放速率设置为指定值
     * @param {number} speed 要设定的倍速
     */
    function setAllVideoPlaybackRate(speed) {
        if (!speed || isNaN(speed) || speed <= 0) return;
        currentSpeed = speed;
        const videos = document.querySelectorAll("video");
        videos.forEach(video => {
            try {
                video.playbackRate = speed;
            } catch (e) {
                console.warn("[倍速] 设置视频倍速失败:", e);
            }
        });
        console.log("[倍速] 已将所有视频调节为", speed, "倍速");
        // 显示倍速
        displaySpeedOnVideo(speed);
        //更新倍速UI中的当前倍速
        updateSpeedDisplay(speed);
    }

    //显示倍速
    function displaySpeedOnVideo(speed) {
        const videoElement = document.querySelector('video');
        if (videoElement) {
             // Check if a speed display already exists, if so, remove it
            let existingSpeedDisplay = videoElement.parentElement.querySelector('.speed-display');
            if (existingSpeedDisplay) {
                existingSpeedDisplay.remove();
            }
             // Create new speed display
            const speedDisplay = document.createElement('div');
            speedDisplay.innerText = `倍速：${speed}`;
            speedDisplay.style.position = 'absolute';
            speedDisplay.style.top = '10px';
            speedDisplay.style.left = '10px';
            speedDisplay.style.padding = '5px';
            speedDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            speedDisplay.style.color = 'white';
            speedDisplay.style.fontSize = '16px';
            speedDisplay.style.fontWeight = 'bold';
            speedDisplay.style.borderRadius = '5px';
            speedDisplay.className = 'speed-display'; // Add class for easy removal

            videoElement.parentElement.appendChild(speedDisplay);

            // Set timeout to remove the speed display after 3 seconds
            setTimeout(() => {
                speedDisplay.remove();
            }, 3000);
        }
    }

    // 更新倍速UI中的当前倍速
    function updateSpeedDisplay(speed) {
        const currentSpeedLabel = document.getElementById("current-speed-label");
        if (currentSpeedLabel) {
            currentSpeedLabel.innerText = `当前倍速：${speed}x`;
        }
    }

    // 新建一个倍速按钮Trigger
    const SPEED_TRIGGER_ID = "speed-trigger-container";
    let isSpeedPopupVisible = false;

    function createSpeedTrigger() {
        // 仅当页面上有视频元素时，才显示倍速UI
        const videos = document.querySelectorAll("video");
        if (videos.length === 0 || !CONFIG.SPEED_UI.SHOW_SPEED_UI) return;

        const existingSpeedTrigger = document.getElementById(SPEED_TRIGGER_ID);
        if (existingSpeedTrigger) existingSpeedTrigger.remove();

        const body = document.body;
        const trigger = document.createElement("div");
        trigger.id = SPEED_TRIGGER_ID;
        trigger.style.cssText = `
            position: fixed;
            right: 0;
            top: 25%;
            transform: translateY(-50%);
            z-index: 999999;
            text-align: center;
            border: 1px solid #FF8C00;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 8px;
            width: 40px;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        const icon = document.createElement("div");
        icon.innerText = "倍速";
        icon.style.cssText = `
            font-size: 14px;
            color: #FF8C00;
            text-align: center;
            user-select: none;
        `;
        trigger.appendChild(icon);

        trigger.addEventListener("click", toggleSpeedPopup);

        // hover时宽度变大
        trigger.onmouseenter = () => {
            trigger.style.width = "80px";
            icon.style.display = "block";
        };
        trigger.onmouseleave = () => {
            if (!isSpeedPopupVisible) {
                trigger.style.width = "40px";
            }
        };

        body.appendChild(trigger);
    }

    function toggleSpeedPopup() {
        isSpeedPopupVisible = !isSpeedPopupVisible;
        if (isSpeedPopupVisible) {
            createSpeedUI();
            const trig = document.getElementById(SPEED_TRIGGER_ID);
            if (trig) {
                trig.style.width = "80px";
            }
        } else {
            closeSpeedUI();
            const trig = document.getElementById(SPEED_TRIGGER_ID);
            if (trig) {
                trig.style.width = "40px";
            }
        }
    }

    // 创建倍速UI
    function createSpeedUI() {
        const body = document.body;
        if (document.getElementById("speed-ui-container")) {
            return;
        }

        const container = document.createElement("div");
        container.id = "speed-ui-container";
        container.style.cssText = `
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.8);
            position: fixed;
            right: 80px;
            top: 25%;
            width: 200px;
            max-width: 60%;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            border: 1px solid #FF8C00;
            z-index: 999999;
            text-align: center;
            font-size: 14px;
            color: #444;
        `;

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "关闭";
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            border: none;
            background-color: #f90;
            color: #FFF;
            padding: 2px 6px;
            cursor: pointer;
            border-radius: 4px;
        `;
        closeBtn.onclick = toggleSpeedPopup;
        container.appendChild(closeBtn);

        const title = document.createElement("h4");
        title.innerText = "视频倍速设置";
        title.style.cssText = `
            margin-bottom: 8px;
            color: #FF8C00;
            font-weight: bold;
        `;
        container.appendChild(title);

        // 倍速输入框
        const label = document.createElement("label");
        label.innerText = "请输入倍速：";
        label.style.cssText = "margin-right: 5px;";
        container.appendChild(label);

        const speedInput = document.createElement("input");
        speedInput.type = "number";
        speedInput.value = currentSpeed;
        speedInput.min = "0.1";
        speedInput.step = "0.1";
        speedInput.style.cssText = `
            width: 60px;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
        `;
        container.appendChild(speedInput);

        const currentSpeedLabel = document.createElement("div");
        currentSpeedLabel.id = "current-speed-label";
        currentSpeedLabel.style.cssText = `
            margin-top: 8px;
            color: #555;
            font-size: 14px;
        `;
        currentSpeedLabel.innerText = `当前倍速：${currentSpeed}x`;
        container.appendChild(currentSpeedLabel);

        const setBtn = document.createElement("button");
        setBtn.innerText = "应用";
        setBtn.style.cssText = `
            margin-left: 8px;
            background-color: #00A1D6;
            color: #FFF;
            border: none;
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 4px;
        `;
        setBtn.onclick = () => {
            const val = parseFloat(speedInput.value) || 1;
            if (val <= 0) {
                alert("非法倍速值！");
                return;
            }
            setAllVideoPlaybackRate(val);
        };
        container.appendChild(setBtn);

        const tips = document.createElement("div");
        tips.style.cssText = `
            margin-top: 10px;
            color: #888;
            font-size: 12px;
        `;
        tips.innerText = "使用数字键1-4进行倍速播放\n按 C 增加倍速\n按 X 减少倍速\n按 Z 切换倍速";
        container.appendChild(tips);

        body.appendChild(container);
    }

    function closeSpeedUI() {
        const speedUI = document.getElementById("speed-ui-container");
        if (speedUI) speedUI.remove();
    }

    // 按键监听：Shift + ↑/↓ 加减速0.1； Shift+0 -> 1倍速
    window.addEventListener("keydown", (e) => {
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') {
            return;
        }

        if (e.shiftKey && !e.ctrlKey && !e.altKey) {
            if (e.key === "ArrowUp") {
                //e.preventDefault();
                currentSpeed = parseFloat((currentSpeed + 0.1).toFixed(2));
                setAllVideoPlaybackRate(currentSpeed);
            } else if (e.key === "ArrowDown") {
                //e.preventDefault();
                let newSpeed = parseFloat((currentSpeed - 0.1).toFixed(2));
                if (newSpeed < 0.1) newSpeed = 0.1;
                currentSpeed = newSpeed;
                setAllVideoPlaybackRate(currentSpeed);
            } else if (e.key === "0") {
                //e.preventDefault();
                currentSpeed = 1.0;
                setAllVideoPlaybackRate(1.0);
            }
        }

        if (e.key >= '1' && e.key <= '4') {
            //e.preventDefault();
            const speedMap = { '1': 1.0, '2': 2.0, '3': 3.0, '4': 4.0 };
            setAllVideoPlaybackRate(speedMap[e.key]);
        }

        if (e.key === 'c' || e.key === 'C') {
            //e.preventDefault();
            currentSpeed = parseFloat((currentSpeed + 0.1).toFixed(2));
            setAllVideoPlaybackRate(currentSpeed);
        }

        if (e.key === 'x' || e.key === 'X') {
            //e.preventDefault();
            currentSpeed = parseFloat((currentSpeed - 0.1).toFixed(2));
            if (currentSpeed < 0.1) currentSpeed = 0.1;
            setAllVideoPlaybackRate(currentSpeed);
        }

        if (e.key === 'z' || e.key === 'Z') {
            //e.preventDefault();
            if (currentSpeed === 1.0) {
                setAllVideoPlaybackRate(originalSpeed);
            } else {
                originalSpeed = currentSpeed;
                setAllVideoPlaybackRate(1.0);
            }
        }
    });

    createSpeedTrigger(); // 初始化倍速按钮触发器

})();
