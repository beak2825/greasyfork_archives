// ==UserScript==
// @name         Get笔记网页版Mp3优化
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  添加进度条和倍速功能
// @author       Zane
// @match        *://*.biji.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521432/Get%E7%AC%94%E8%AE%B0%E7%BD%91%E9%A1%B5%E7%89%88Mp3%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521432/Get%E7%AC%94%E8%AE%B0%E7%BD%91%E9%A1%B5%E7%89%88Mp3%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式注入
    const style = document.createElement('style');
    style.textContent = `
        .custom-progress-bar {
            flex: 1;
            height: 8px;
            background-color: #ddd;
            cursor: pointer;
            margin-top: 5px;
            position: relative;
            margin-right: 10px;
        }
        .progress-inner {
            width: 0%;
            height: 100%;
            background-color: #4CAF50;
            transition: width 0.1s linear;
            position: relative;
        }
        .progress-handle {
            width: 12px;
            height: 12px;
            background-color: #fff;
            border: 2px solid #4CAF50;
            border-radius: 50%;
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            display: none;
        }
        .custom-progress-bar:hover .progress-handle {
            display: block;
        }
        .speed-control {
            position: relative;
            display: inline-block;
            min-width: 50px;
        }
        .speed-button {
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 12px;
            color: #333;
        }
        .speed-button:hover {
            background: #e8e8e8;
        }
        .speed-options {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 3px;
            display: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .speed-control:hover .speed-options {
            display: block;
        }
        .speed-option {
            padding: 4px 12px;
            cursor: pointer;
            white-space: nowrap;
            font-size: 12px;
        }
        .speed-option:hover {
            background: #f5f5f5;
        }
        .speed-option.active {
            background: #e8e8e8;
            font-weight: bold;
        }
        .controls-container {
            display: flex;
            align-items: center;
            margin-top: 5px;
            width: 100%;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);

    // 音频播放状态管理
    class AudioStateManager {
        constructor(audio) {
            this.audio = audio;
            this.isPlaybackLocked = false;
        }

        async handlePlayback(wasPlaying) {
            if (this.isPlaybackLocked) return;

            if (wasPlaying) {
                this.isPlaybackLocked = true;
                try {
                    await this.audio.play();
                } catch (error) {
                    if (error.name === 'AbortError') {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        try {
                            await this.audio.play();
                        } catch (retryError) {
                            console.warn('Retry play failed:', retryError);
                        }
                    } else {
                        console.warn('Play error:', error);
                    }
                } finally {
                    this.isPlaybackLocked = false;
                }
            }
        }
    }

    // 创建倍速控制器
    function createSpeedControl(audio) {
        const speedControl = document.createElement('div');
        speedControl.className = 'speed-control';

        const speedButton = document.createElement('button');
        speedButton.className = 'speed-button';
        speedButton.textContent = '1.0x';

        const speedOptions = document.createElement('div');
        speedOptions.className = 'speed-options';

        const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

        speeds.forEach(speed => {
            const option = document.createElement('div');
            option.className = 'speed-option' + (speed === 1.0 ? ' active' : '');
            option.textContent = speed + 'x';
            option.onclick = (e) => {
                e.stopPropagation();
                audio.playbackRate = speed;
                speedButton.textContent = speed + 'x';
                // 更新活动状态
                speedOptions.querySelectorAll('.speed-option').forEach(opt => {
                    opt.classList.toggle('active', opt === option);
                });
            };
            speedOptions.appendChild(option);
        });

        speedControl.appendChild(speedButton);
        speedControl.appendChild(speedOptions);

        return speedControl;
    }

    // 添加进度条的函数
    function addProgressBar(audioContainer) {
        const audio = audioContainer.querySelector('audio');
        if (!audio || audioContainer.querySelector('.custom-progress-bar')) return;

        console.log('Adding progress bar for audio:', audio.src);

        const stateManager = new AudioStateManager(audio);

        // 创建控制器容器
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'controls-container';

        // 创建进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'custom-progress-bar';
        const progressInner = document.createElement('div');
        progressInner.className = 'progress-inner';
        const progressHandle = document.createElement('div');
        progressHandle.className = 'progress-handle';
        progressInner.appendChild(progressHandle);
        progressBar.appendChild(progressInner);

        // 创建倍速控制
        const speedControl = createSpeedControl(audio);

        // 将所有控制器添加到容器
        controlsContainer.appendChild(progressBar);
        controlsContainer.appendChild(speedControl);

        // 添加到音频容器
        audioContainer.appendChild(controlsContainer);

        let isDragging = false;
        let wasPlaying = false;

        // 更新进度条
        audio.addEventListener('timeupdate', () => {
            if (!isDragging) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressInner.style.width = `${percent}%`;
            }
        });

        // 处理拖拽过程
        function handleDrag(e) {
            if (!isDragging) return;

            const rect = progressBar.getBoundingClientRect();
            let pos = (e.clientX - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));

            progressInner.style.width = `${pos * 100}%`;
            e.preventDefault();
        }

        // 处理拖拽结束
        async function handleDragEnd() {
            if (!isDragging) return;

            isDragging = false;
            const width = progressInner.style.width;
            const percent = parseFloat(width) / 100;

            audio.currentTime = percent * audio.duration;
            await stateManager.handlePlayback(wasPlaying);

            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
            document.body.style.userSelect = '';
        }

        // 开始拖拽
        progressBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            wasPlaying = !audio.paused;

            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
            document.body.style.userSelect = 'none';

            handleDrag(e);
        });
    }

    // 代理 Audio 元素的 src 属性
    function proxyAudioElement(audio, container) {
        const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');

        Object.defineProperty(audio, 'src', {
            get: function() {
                return originalDescriptor.get.call(this);
            },
            set: function(value) {
                console.log('Setting audio src:', value);
                const result = originalDescriptor.set.call(this, value);

                if (value && value.trim() !== '') {
                    requestAnimationFrame(() => {
                        addProgressBar(container);
                    });
                }
                return result;
            },
            configurable: true
        });
    }

    // 处理新的音频元素
    function handleNewAudioElement(container) {
        const audio = container.querySelector('audio');
        if (audio && !audio._proxied) {
            proxyAudioElement(audio, container);
            audio._proxied = true;
            console.log('Audio element proxied');
        }
    }

    // 监听新的音频元素
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    const containers = node.classList?.contains('note-item-ai-record')
                        ? [node]
                        : node.querySelectorAll('.note-item-ai-record');

                    containers.forEach(handleNewAudioElement);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll('.note-item-ai-record').forEach(handleNewAudioElement);

    console.log('Audio Progress Bar script loaded');
})();