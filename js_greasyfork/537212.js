// ==UserScript==
// @name         哔哩极音辅助2.0
// @namespace    https://github.com/xxdz-Official/biliJiyin
// @version      2.0
// @description  哔哩极音弥补+增强（恢复画质/弹幕/自动连播，增加音频可视化）
// @author       小小电子xxdz
// @match        https://www.bilibili.com/video/*
// @icon         https://article.biliimg.com/bfs/new_dyn/6de998bc1c801811007eb1b522a41a603461569935575626.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537212/%E5%93%94%E5%93%A9%E6%9E%81%E9%9F%B3%E8%BE%85%E5%8A%A920.user.js
// @updateURL https://update.greasyfork.org/scripts/537212/%E5%93%94%E5%93%A9%E6%9E%81%E9%9F%B3%E8%BE%85%E5%8A%A920.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局配置
    const CONFIG = {
        // 画质选择配置
        quality: {
            targetValue: '80',  // 1080P的data-value
            maxRetry: 30,       // 最大重试次数
            interval: 1000      // 检测间隔(ms)
        },

        // 元素选择器
        elements: {
            dmSwitch: '.bpx-player-dm-switch input[type="checkbox"]',
            dmStatusText: '.bpx-player-dm-wrap', // 弹幕状态文本元素
            radioButton: 'input.bui-radio-input[value="2"][name="bui-radio1"]',
            qualityItem: 'li.bpx-player-ctrl-quality-menu-item[data-value="80"]',
            qualityBtn: '.bpx-player-ctrl-quality',
            videoElement: 'video'
        },

        // 音频可视化配置
        visualizer: {
            enabled: false,      // 默认不显示可视化
            alwaysAnalyze: true, // 始终后台分析
            fftSize: 2048,      // 频率分析精度
            smoothing: 0.4,     // 平滑系数
            minDecibels: -90,   // 最小分贝
            maxDecibels: -10    // 最大分贝
        },

        // 超时设置
        timeout: 20000
    };

    // 全局状态变量
    const state = {
        retryCount: 0,
        dmHandled: false,
        radioHandled: false,
        audioContext: null,
        analyser: null,
        source: null,
        animationId: null,
        visualizerVisible: false,
        audioConnected: false
    };

    // ==================== 音频分析核心 ====================
    function initAudioContext() {
        if (!state.audioContext) {
            try {
                state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                state.analyser = state.audioContext.createAnalyser();
                state.analyser.fftSize = CONFIG.visualizer.fftSize;
                state.analyser.smoothingTimeConstant = CONFIG.visualizer.smoothing;
                state.analyser.minDecibels = CONFIG.visualizer.minDecibels;
                state.analyser.maxDecibels = CONFIG.visualizer.maxDecibels;
                console.log('音频分析器初始化完成');
            } catch (e) {
                console.error('音频上下文初始化失败:', e);
            }
        }
    }

    function connectAudioSource() {
        if (state.audioConnected) return;

        const video = document.querySelector(CONFIG.elements.videoElement);
        if (video && !state.source) {
            try {
                state.source = state.audioContext.createMediaElementSource(video);
                state.source.connect(state.analyser);
                state.analyser.connect(state.audioContext.destination);
                state.audioConnected = true;
                console.log('音频源已连接');
            } catch (e) {
                console.error('音频连接失败:', e);
            }
        }
    }

    function startAudioAnalysis() {
        if (!CONFIG.visualizer.alwaysAnalyze) return;

        initAudioContext();

        // 延迟连接以避免冲突
        setTimeout(() => {
            connectAudioSource();
        }, 3000);

        // 监听视频元素变化
        const videoObserver = new MutationObserver(() => {
            connectAudioSource();
        });

        videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ==================== 可视化控制 ====================
    function createVisualizerUI() {
// 创建开关按钮
const toggleBtn = document.createElement('div');
toggleBtn.className = 'xxdz-visualizer-toggle';

// 初始化按钮样式,border-radius改小进行磁贴化
function updateToggleBtnStyle() {
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: ${CONFIG.visualizer.enabled ? 'rgba(0,255,157,0.7)' : 'rgba(0,0,0,0.7)'};
        border-radius: 2px;
        z-index: 10001;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        box-shadow: ${CONFIG.visualizer.enabled ? '0 0 15px rgba(0,255,157,0.8)' : '0 0 10px rgba(0,255,157,0.5)'};
        transition: all 0.3s;
        user-select: none;
        background-image: url('https://article.biliimg.com/bfs/new_dyn/465799db4b23dd925986c3134199f5a43461569935575626.png');
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: center;
    `;
}

// 初始化按钮
updateToggleBtnStyle();
toggleBtn.title = CONFIG.visualizer.enabled ? '【哔哩极音】点击关闭音频可视化' : '【哔哩极音】点击开启音频可视化';

// 修改toggleVisualizer函数
function toggleVisualizer() {
    CONFIG.visualizer.enabled = !CONFIG.visualizer.enabled;

    // 更新按钮样式（防止点击后就不显示回按钮图片）
    updateToggleBtnStyle();
    toggleBtn.title = CONFIG.visualizer.enabled ? '【哔哩极音】点击关闭音频可视化' : '【哔哩极音】点击开启音频可视化';

    const canvas = document.querySelector('.xxdz-audio-visualizer');

    if (CONFIG.visualizer.enabled) {
        // 开启状态
        canvas.style.display = 'block';
        setTimeout(() => {
            canvas.style.opacity = '1';
            canvas.style.transform = 'translateY(0)';
        }, 10);
        startVisualization(canvas);
    } else {
        // 关闭状态
        canvas.style.opacity = '0';
        canvas.style.transform = 'translateY(20px)';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 300);
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
    }
}

toggleBtn.addEventListener('click', toggleVisualizer);
document.body.appendChild(toggleBtn);

        // 创建可视化画布
        const canvas = document.createElement('canvas');
        canvas.className = 'xxdz-audio-visualizer';
        canvas.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 320px;
            height: 140px;
            background: rgba(0,0,0,0.8);
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(58,204,204,0.7);
            backdrop-filter: blur(5px);
            cursor: move;
            touch-action: none;
            transition: all 0.3s;
            opacity: ${CONFIG.visualizer.enabled ? '1' : '0'};
            transform: translateY(${CONFIG.visualizer.enabled ? '0' : '20px'});
            display: ${CONFIG.visualizer.enabled ? 'block' : 'none'};
        `;
        canvas.width = 320;
        canvas.height = 140;
        document.body.appendChild(canvas);

        // 设置拖动功能
        setupDraggable(canvas);

        // 如果默认开启，则启动可视化
        if (CONFIG.visualizer.enabled) {
            startVisualization(canvas);
        }
    }

    function toggleVisualizer() {
        CONFIG.visualizer.enabled = !CONFIG.visualizer.enabled;
        const toggleBtn = document.querySelector('.xxdz-visualizer-toggle');
        const canvas = document.querySelector('.xxdz-audio-visualizer');

        if (CONFIG.visualizer.enabled) {
            // 开启状态
            toggleBtn.style.background = 'rgba(0,255,157,0.7)';
            toggleBtn.style.boxShadow = '0 0 15px rgba(0,255,157,0.8)';
            toggleBtn.title = '点击关闭音频可视化';

            // 显示画布
            canvas.style.display = 'block';
            setTimeout(() => {
                canvas.style.opacity = '1';
                canvas.style.transform = 'translateY(0)';
            }, 10);

            // 启动可视化
            startVisualization(canvas);
        } else {
            // 关闭状态
            toggleBtn.style.background = 'rgba(0,0,0,0.7)';
            toggleBtn.style.boxShadow = '0 0 10px rgba(0,255,157,0.5)';
            toggleBtn.title = '点击开启音频可视化';

            // 隐藏画布
            canvas.style.opacity = '0';
            canvas.style.transform = 'translateY(20px)';
            setTimeout(() => {
                canvas.style.display = 'none';
            }, 300);

            // 停止动画
            if (state.animationId) {
                cancelAnimationFrame(state.animationId);
                state.animationId = null;
            }
        }
    }

    function startVisualization(canvas) {
        if (!state.analyser) return;
        if (state.animationId) cancelAnimationFrame(state.animationId);

        const ctx = canvas.getContext('2d');
        const bufferLength = state.analyser.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        const waveData = new Uint8Array(state.analyser.fftSize);

        function draw() {
            if (!CONFIG.visualizer.enabled) return;

            // 获取分析数据
            state.analyser.getByteFrequencyData(freqData);
            state.analyser.getByteTimeDomainData(waveData);

            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 绘制波形
            drawWaveform(ctx, waveData, canvas);

            // 绘制频谱
            drawSpectrum(ctx, freqData, canvas);

            // 继续动画循环
            state.animationId = requestAnimationFrame(draw);
        }

        // 开始绘制
        draw();
    }

    function drawWaveform(ctx, data, canvas) {
        ctx.beginPath();
        ctx.strokeStyle = '#00FF9D';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00A1D6';

        for (let i = 0; i < data.length; i++) {
            const x = (i / data.length) * canvas.width;
            const y = (1 - data[i] / 255) * 60 + 10;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    function drawSpectrum(ctx, data, canvas) {
        const barCount = 128;
        const barWidth = canvas.width / barCount;

        for (let i = 0; i < barCount; i++) {
            const value = data[Math.floor(i * 1.5)];
            const height = (value / 255) * 100;
            const y = canvas.height - height;

            const hue = (i / barCount) * 360 + (performance.now() / 20) % 360;
            const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
            gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.9)`);
            gradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 100%, 30%, 0.5)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(i * barWidth + 2, y, barWidth - 4, height);
        }

        // 频段标识
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255,255,255,0.5)';
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('高', canvas.width / 4, canvas.height - 15);
        ctx.fillText('(* ≧▽≦)ツ♪', canvas.width / 2, canvas.height - 15);
        ctx.fillText('低', canvas.width * 3 / 4, canvas.height - 15);
    }

    function setupDraggable(element) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let initialLeft = null, initialTop = null;

        const handleMouseDown = (e) => {
            isDragging = true;
            const rect = element.getBoundingClientRect();
            startX = e.clientX || e.touches[0].clientX;
            startY = e.clientY || e.touches[0].clientY;
            initialLeft = rect.left;
            initialTop = rect.top;
            element.style.transition = 'none';
            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;

            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // 边界检查
            newLeft = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newTop));

            element.style.left = `${newLeft}px`;
            element.style.right = 'auto';
            element.style.top = `${newTop}px`;
        };

        const handleMouseUp = () => {
            isDragging = false;
            element.style.transition = 'all 0.3s ease';
        };

        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('touchstart', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
    }

    // ==================== 弹幕处理 ====================
    function handleDmSetting() {
        if (state.dmHandled) return;

        // 使用更精确的检测方式
        const checkDmStatus = () => {
            const dmWrap = document.querySelector(CONFIG.elements.dmStatusText);
            if (dmWrap && dmWrap.textContent.includes('已关闭弹幕')) {
                const dmSwitch = document.querySelector(CONFIG.elements.dmSwitch);
                if (dmSwitch && !dmSwitch.checked) {
                    console.log('检测到弹幕已关闭，正在开启弹幕...');
                    dmSwitch.click();
                    state.dmHandled = true;
                    return true;
                }
            }
            return false;
        };

        // 立即尝试一次
        if (checkDmStatus()) return;

        // 设置观察器
        const observer = new MutationObserver((mutations) => {
            if (checkDmStatus()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 超时停止观察
        setTimeout(() => {
            if (!state.dmHandled) {
                observer.disconnect();
                console.log('弹幕状态检测超时');
            }
        }, CONFIG.timeout);
    }

    // ==================== 其他功能 ====================
    function handleRadioButton() {
        if (state.radioHandled) return;

        const radio = document.querySelector(CONFIG.elements.radioButton);
        if (radio && !radio.checked) {
            radio.click();
            state.radioHandled = true;
            console.log('已关闭自动轮播');
        } else if (!state.radioHandled) {
            setTimeout(handleRadioButton, 1000);
        }
    }

    function handleQuality() {
        if (state.retryCount >= CONFIG.quality.maxRetry) return;

        const qualityItem = document.querySelector(CONFIG.elements.qualityItem);
        if (qualityItem) {
            qualityItem.click();
            console.log('已选择1080P画质');
            return;
        }

        const qualityBtn = document.querySelector(CONFIG.elements.qualityBtn);
        if (qualityBtn) {
            qualityBtn.click();
            state.retryCount++;
            setTimeout(handleQuality, 1000);
        } else if (state.retryCount < 3) {
            state.retryCount++;
            setTimeout(handleQuality, 1000);
        }
    }

    // ==================== 主执行逻辑 ====================
    function executeActions() {
        console.log('哔哩极音辅助开始执行...');

        // 初始化功能
        handleDmSetting();
        handleRadioButton();
        handleQuality();

        // 初始化音频系统和可视化UI
        startAudioAnalysis();
        createVisualizerUI();

        // 设置重试检查
        const qualityCheck = setInterval(() => {
            if (state.retryCount >= CONFIG.quality.maxRetry) {
                clearInterval(qualityCheck);
                return;
            }
            handleQuality();
        }, CONFIG.quality.interval);

        // 超时检查
        setTimeout(() => {
            clearInterval(qualityCheck);
            console.log('初始化完成');
        }, CONFIG.timeout);
    }

    // ==================== 启动入口 ====================
    if (document.readyState === 'complete') {
        executeActions();
    } else {
        window.addEventListener('load', executeActions);
        document.addEventListener('DOMContentLoaded', executeActions);
    }
})();
