// ==UserScript==
// @name         Sora自动点击助手
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  一个全托管的sora生成素材助手
// @author       baicai99
// @match        *://sora.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524350/Sora%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524350/Sora%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

let clickPoints = [];
let activePointIndex = null;
let countdownInterval = null;
let nextClickTime = null;
let isPanelMinimized = false;
let overlay = null;


    document.addEventListener('mousedown', function(e) {
        if (e.button === 1) {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    document.addEventListener('auxclick', function(e) {
        if (e.button === 1) {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // 创建点击指示器
    const clickIndicator = document.createElement('div');
    clickIndicator.style.position = 'fixed';
    clickIndicator.style.pointerEvents = 'none';
    clickIndicator.style.zIndex = '2147483646';
    clickIndicator.style.border = '2px solid rgba(255, 0, 0, 0.5)';
    clickIndicator.style.borderRadius = '50%';
    clickIndicator.style.display = 'none';
    document.body.appendChild(clickIndicator);

    function createPointHTML(index) {
        return `
            <div id="point-${index}" class="click-point" style="margin-bottom: 10px; padding: 5px; background: rgba(255,255,255,0.06); border-radius: 16px; pointer-events: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; pointer-events: auto;">
                    <div style="pointer-events: auto;">
                        <span style="font-weight: bold;">点击位置 ${index + 1}</span>
                        <button class="set-point-btn" data-index="${index}" style="margin-left: 10px; background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 2px 8px; border-radius: 12px; cursor: pointer; pointer-events: auto; transition: all 0.2s ease;">设置位置</button>
                    </div>
                    <button class="remove-point" data-index="${index}" style="background: none; border: none; color: #ff4444; cursor: pointer; pointer-events: auto; transition: all 0.2s ease;">×</button>
                </div>
                <div style="margin-bottom: 5px; pointer-events: auto;">
                    <span>坐标：</span>
                    <span class="coordinates-display">未设置</span>
                </div>
            </div>
        `;
    }

    // Create panel UI with modifications
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.width = '800px';  // 增加总宽度
    panel.style.backgroundColor = 'rgba(37,37,37,0.8)';
    panel.style.backdropFilter = 'blur(10px)';
    panel.style.WebkitBackdropFilter = 'blur(10px)';
    panel.style.color = '#fff';
    panel.style.padding = '10px';
    panel.style.borderRadius = '24px';
    panel.style.boxShadow = '0 12px 48px rgba(0,0,0,0.6)';
    panel.style.zIndex = '2147483647';
    panel.style.pointerEvents = 'auto';
    panel.style.isolation = 'isolate';
    panel.style.border = '1px solid rgba(255,255,255,0.15)';
    panel.innerHTML = `
        <div id="header" style="margin: 10px; cursor: move; display: flex; justify-content: space-between; align-items: center; pointer-events: auto;">
            <span id="title" style="font-weight: bold; pointer-events: auto; font-size: 19px; padding-left: 0px; padding-top: 5px; padding-bottom: 5px;">多点自动点击助手</span>
            <button id="minimizeButton" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer; pointer-events: auto; transition: all 0.2s ease;">-</button>
        </div>
        <div id="instructions" style="pointer-events: auto; background: rgba(255,255,255,0.06); border-radius: 16px; padding: 10px; margin-bottom: 10px;">
            <p style="margin: 0; font-size: 14px;">使用说明：</p>
            <ul style="margin: 5px 0 10px; padding-left: 20px; font-size: 12px;">
                <li>点击"+"添加新的点击位置</li>
                <li>点击"设置位置"按钮，然后使用鼠标中键设置坐标</li>
                <li>设置循环间隔和点击缓冲时间</li>
            </ul>
        </div>
        <div id="panelBody" style="pointer-events: auto; display: flex; gap: 10px;">
            <!-- 左列：点击位置管理 -->
            <div style="flex: 1; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 16px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px;">点击位置管理</h3>
                <div id="activePointDisplay" style="margin-bottom: 10px; padding: 5px; background: rgba(0,255,0,0.1); border-radius: 16px; display: none;">
                    正在设置点击位置 <span id="activePointNumber"></span>
                </div>
                <div id="clickPoints" style="pointer-events: auto; max-height: 300px; overflow-y: auto;"></div>
                <button id="addPoint" style="
                    width: 100%;
                    padding: 8px;
                    background: rgba(255,255,255,0.06);
                    color: #fff;
                    border: none;
                    border-radius: 16px;
                    margin-top: 10px;
                    cursor: pointer;
                    pointer-events: auto;
                    transition: all 0.2s ease;
                    font-weight: 500;
                ">+ 添加点击位置</button>
            </div>

            <!-- 中列：时间设置 -->
            <div style="flex: 1; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 16px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px;">时间设置</h3>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 14px; display: block; margin-bottom: 5px;">循环间隔（秒）：</label>
                    <input id="cycleIntervalInput" type="text" placeholder="60" style="
                        width: calc(100% - 16px);
                        padding: 8px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        background-color: rgba(0,0,0,0.2);
                        color: #fff;
                        pointer-events: auto;
                        outline: none;
                        transition: all 0.2s ease;
                    " />
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 14px; display: block; margin-bottom: 5px;">点击缓冲（秒）：</label>
                    <input id="clickBufferInput" type="text" placeholder="2" style="
                        width: calc(100% - 16px);
                        padding: 8px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        background-color: rgba(0,0,0,0.2);
                        color: #fff;
                        pointer-events: auto;
                        outline: none;
                        transition: all 0.2s ease;
                    " />
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 14px; display: block; margin-bottom: 5px;">抖动时间（秒）：</label>
                    <input id="jitterInput" type="text" placeholder="5" style="
                        width: calc(100% - 16px);
                        padding: 8px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        background-color: rgba(0,0,0,0.2);
                        color: #fff;
                        pointer-events: auto;
                        outline: none;
                        transition: all 0.2s ease;
                    " />
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 14px; display: block; margin-bottom: 5px;">点击扩散范围（像素）：</label>
                    <input id="spreadRadiusInput" type="text" placeholder="3" style="
                        width: calc(100% - 16px);
                        padding: 8px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        background-color: rgba(0,0,0,0.2);
                        color: #fff;
                        pointer-events: auto;
                        outline: none;
                        transition: all 0.2s ease;
                    " />
                </div>
            </div>

            <!-- 右列：运行状态 -->
            <div style="flex: 1; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 16px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px;">运行状态</h3>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 14px; display: block; margin-bottom: 5px;">循环次数：</label>
                    <input id="totalLoopsInput" type="text" placeholder="10" style="
                        width: calc(100% - 16px);
                        padding: 8px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        background-color: rgba(0,0,0,0.2);
                        color: #fff;
                        pointer-events: auto;
                        outline: none;
                        transition: all 0.2s ease;
                    " />
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 14px; display: block; margin-bottom: 5px;">剩余次数：</label>
                    <div id="remainingLoopsDisplay" style="
                        padding: 8px;
                        color: rgba(255,255,255,0.8);
                        font-weight: 500;
                        background: rgba(0,0,0,0.2);
                        border-radius: 12px;
                    ">未开始</div>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 14px; display: block; margin-bottom: 5px;">下次点击倒计时：</label>
                    <div id="remainingSecondsDisplay" style="
                        padding: 8px;
                        color: rgba(255,255,255,0.8);
                        font-weight: 500;
                        background: rgba(0,0,0,0.2);
                        border-radius: 12px;
                    ">未开始</div>
                </div>
                <button id="startButton" style="
                    width: 100%;
                    padding: 8px;
                    background-color: rgb(255, 255, 255);
                    color: rgb(0, 0, 0);
                    border: none;
                    border-radius: 24px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    pointer-events: auto;
                    height: 40px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    position: relative;
                    overflow: hidden;
                    margin-top: 20px;
                ">
                    <span style="display: inline-flex; align-items: center;">开始</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    let isRunning = false;
    let remainingLoops = 0;
    let currentTimeout = null;

    // 输入框焦点效果
    const inputs = panel.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'rgba(255,255,255,0.3)';
            this.style.backgroundColor = 'rgba(0,0,0,0.3)';
        });

        input.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(255,255,255,0.1)';
            this.style.backgroundColor = 'rgba(0,0,0,0.2)';
        });
    });

    // Add point functionality
    document.getElementById('addPoint').addEventListener('click', () => {
        const pointsContainer = document.getElementById('clickPoints');
        const newIndex = clickPoints.length;
        clickPoints.push({
            relativeX: null,
            relativeY: null
        });

        const pointElement = document.createElement('div');
        pointElement.innerHTML = createPointHTML(newIndex);
        pointsContainer.appendChild(pointElement);
    });

    // 添加按钮悬停效果
    document.getElementById('addPoint').addEventListener('mouseover', function() {
        this.style.background = 'rgba(255,255,255,0.1)';
    });

    document.getElementById('addPoint').addEventListener('mouseout', function() {
        this.style.background = 'rgba(255,255,255,0.06)';
    });

    // Panel drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    document.getElementById('header').addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target.closest('#header')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, panel);
        }
    }

    function dragEnd() {
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

// 在 document.body.appendChild(panel); 之后添加
// 创建并设置最小化按钮
const minimizeButton = document.createElement('button');
minimizeButton.id = 'minimizeButton';
minimizeButton.className = 'inline-flex gap-1.5 items-center justify-center w-[36px] h-[36px] p-1.5 rounded-full';
minimizeButton.style.cssText = `
    background-color: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.8);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
`;

// 设置SVG图标
minimizeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" style="transition: transform 0.3s ease">
        <path fill="currentColor" d="M11.293 5.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1-1.414 1.414L13 8.414V18a1 1 0 1 1-2 0V8.414l-3.293 3.293a1 1 0 0 1-1.414-1.414z"></path>
    </svg>
    <span class="sr-only">最小化</span>
`;

// 添加按钮效果
minimizeButton.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
});

minimizeButton.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
});

// 最小化功能
minimizeButton.addEventListener('click', () => {
    const panelBody = document.getElementById('panelBody');
    const instructions = document.getElementById('instructions');
    const svg = minimizeButton.querySelector('svg');

    if (isPanelMinimized) {
        panelBody.style.display = 'flex';
        instructions.style.display = 'block';
        svg.style.transform = 'rotate(180deg)';
    } else {
        panelBody.style.display = 'none';
        instructions.style.display = 'none';
        svg.style.transform = 'rotate(0deg)';
    }
    isPanelMinimized = !isPanelMinimized;
});

// 替换原有按钮
const header = document.getElementById('header');
const oldMinimizeButton = document.getElementById('minimizeButton');
if (oldMinimizeButton) {
    oldMinimizeButton.remove();
}
header.appendChild(minimizeButton);

    // 开始按钮效果
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('mouseover', function() {
        if (!isRunning) {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        } else {
            this.style.backgroundColor = '#ff6666';
        }
    });

    startButton.addEventListener('mouseout', function() {
        if (!isRunning) {
            this.style.backgroundColor = 'rgb(255, 255, 255)';
        } else {
            this.style.backgroundColor = '#FF4444';
        }
    });

    startButton.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
    });

    startButton.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1)';
    });

    startButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    document.addEventListener('click', (e) => {
    if (e.target.classList.contains('set-point-btn')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        activePointIndex = index;
        document.getElementById('activePointDisplay').style.display = 'block';
        document.getElementById('activePointNumber').textContent = index + 1;
        e.target.textContent = '等待中...';
        e.target.style.backgroundColor = 'rgba(255,165,0,0.3)'; // 橙色背景表示等待状态

    } else if (e.target.classList.contains('remove-point')) {
        const index = parseInt(e.target.getAttribute('data-index'));

        clickPoints.splice(index, 1);
        updateClickPointsDisplay();
    }
});



    // Middle click to set coordinates
document.addEventListener('mouseup', (e) => {
    if (e.button === 1 && activePointIndex !== null) { // Middle click
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        clickPoints[activePointIndex] = {
            relativeX: e.clientX / viewportWidth,
            relativeY: e.clientY / viewportHeight,
            // 新增：保存绝对坐标
            absoluteX: e.clientX,
            absoluteY: e.clientY
        };

        updateClickPointsDisplay();
        activePointIndex = null;
        document.getElementById('activePointDisplay').style.display = 'none';
    }
});


function updateClickPointsDisplay() {
    const pointsContainer = document.getElementById('clickPoints');
    pointsContainer.innerHTML = '';
    clickPoints.forEach((point, index) => {
        const pointElement = document.createElement('div');
        pointElement.innerHTML = createPointHTML(index);
        if (point.relativeX !== null && point.relativeY !== null) {
            const coordsDisplay = pointElement.querySelector('.coordinates-display');
            const absX = Math.round(point.relativeX * window.innerWidth);
            const absY = Math.round(point.relativeY * window.innerHeight);
            coordsDisplay.textContent = `X: ${absX}px, Y: ${absY}px (${Math.round(point.relativeX * 100)}%, ${Math.round(point.relativeY * 100)}%)`;
            const setButton = pointElement.querySelector('.set-point-btn');
            setButton.textContent = '重新设置';
            setButton.style.backgroundColor = 'rgba(0,255,0,0.2)'; // 绿色背景表示已设置
        }
        pointsContainer.appendChild(pointElement);
    });
}

    function showClickEffect(x, y) {
        clickIndicator.style.left = (x - 15) + 'px';
        clickIndicator.style.top = (y - 15) + 'px';
        clickIndicator.style.width = '30px';
        clickIndicator.style.height = '30px';
        clickIndicator.style.display = 'block';
        clickIndicator.style.opacity = '1';
        clickIndicator.style.transform = 'scale(1)';

        // 添加动画效果
        clickIndicator.style.transition = 'all 0.3s ease-out';
        setTimeout(() => {
            clickIndicator.style.opacity = '0';
            clickIndicator.style.transform = 'scale(1.5)';
        }, 50);

        setTimeout(() => {
            clickIndicator.style.display = 'none';
            clickIndicator.style.transition = 'none';
        }, 350);
    }

function simulateClick(x, y) {
    // 临时隐藏面板
    panel.style.display = 'none';

    // 获取实际要点击的元素
    const element = document.elementFromPoint(x, y);

    // 恢复面板显示
    panel.style.display = 'block';

    if (element) {
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(clickEvent);
        showClickEffect(x, y);
    }
}

    function updateCountdown() {
        if (nextClickTime) {
            const now = new Date().getTime();
            const remainingSeconds = Math.max(0, Math.ceil((nextClickTime - now) / 1000));
            document.getElementById('remainingSecondsDisplay').textContent = `${remainingSeconds}秒`;
        }
    }

   function executeClickSequence() {
    if (!isRunning) return;

    document.getElementById('remainingLoopsDisplay').textContent = remainingLoops.toString();

    const cycleInterval = parseInt(document.getElementById('cycleIntervalInput').value || '60') * 1000;
    const clickBuffer = parseInt(document.getElementById('clickBufferInput').value || '2') * 1000;
    const jitterRange = parseInt(document.getElementById('jitterInput').value || '10') * 1000;
    const spreadRadius = parseInt(document.getElementById('spreadRadiusInput').value || '20');

    function executeCycle() {
        let currentIndex = 0;

        function executeClick() {
            if (!isRunning) return;

            // 当前循环的所有点击完成
            if (currentIndex >= clickPoints.length) {
                remainingLoops--;
                document.getElementById('remainingLoopsDisplay').textContent = remainingLoops.toString();

                if (remainingLoops <= 0) {
                    alert('循环已完成！');
                    isRunning = false;
                    const startButton = document.getElementById('startButton');
                    startButton.innerHTML = '<span style="display: inline-flex; align-items: center;">开始</span>';
                    startButton.style.backgroundColor = 'rgb(255, 255, 255)';
                    document.getElementById('remainingLoopsDisplay').textContent = '未开始';
                    document.getElementById('remainingSecondsDisplay').textContent = '未开始';
                    nextClickTime = null;
                    return;
                }

                // 准备开始下一个循环
                const jitter = Math.random() * jitterRange;
                nextClickTime = new Date().getTime() + cycleInterval + jitter;
                currentTimeout = setTimeout(() => {
                    currentIndex = 0;
                    executeClick();
                }, cycleInterval + jitter);
                return;
            }

            // 执行当前点击
            const point = clickPoints[currentIndex];
            if (point.relativeX !== null) {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const baseX = Math.floor(point.relativeX * viewportWidth);
                const baseY = Math.floor(point.relativeY * viewportHeight);

                const spreadX = (Math.random() - 0.5) * 2 * spreadRadius;
                const spreadY = (Math.random() - 0.5) * 2 * spreadRadius;

                const finalX = Math.min(Math.max(0, Math.floor(baseX + spreadX)), viewportWidth);
                const finalY = Math.min(Math.max(0, Math.floor(baseY + spreadY)), viewportHeight);

                simulateClick(finalX, finalY);
            }

            // 准备执行下一个点击
            currentIndex++;
            nextClickTime = new Date().getTime() + clickBuffer;
            currentTimeout = setTimeout(executeClick, clickBuffer);
        }

        // 开始执行第一个点击
        executeClick();
    }

    // 直接开始第一个循环
    executeCycle();
}

    window.addEventListener('resize', updateClickPointsDisplay);


    // Start/stop functionality
    document.getElementById('startButton').addEventListener('click', () => {
        if (isRunning) {
            clearTimeout(currentTimeout);
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            isRunning = false;
            const startButton = document.getElementById('startButton');
            startButton.innerHTML = '<span style="display: inline-flex; align-items: center;">开始</span>';
            startButton.style.backgroundColor = 'rgb(255, 255, 255)';
            document.getElementById('remainingLoopsDisplay').textContent = '未开始';
            document.getElementById('remainingSecondsDisplay').textContent = '未开始';
            nextClickTime = null;
        } else {
            if (clickPoints.length === 0 || !clickPoints.some(p => p.relativeX !== null)) {
                alert('请至少设置一个点击位置！');
                return;
            }

            const totalLoops = parseInt(document.getElementById('totalLoopsInput').value || '10');
            if (isNaN(totalLoops) || totalLoops <= 0) {
                alert('请输入有效的循环次数！');
                return;
            }

            remainingLoops = totalLoops;
            isRunning = true;
            const startButton = document.getElementById('startButton');
            startButton.innerHTML = '<span style="display: inline-flex; align-items: center;">停止</span>';
            startButton.style.backgroundColor = '#FF4444';

            countdownInterval = setInterval(updateCountdown, 1000);

            executeClickSequence();
        }
    });
})();