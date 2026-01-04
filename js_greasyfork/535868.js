// ==UserScript==
// @name         AutoMusic音乐播放器增强
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  替换度言CTI系统的等待音乐为自定义网易云音乐播放器，并根据外呼状态自动控制播放
// @author       You
// @match        https://www.shenzhenjjxt.top/
// @match        http://www.shenzhenjjxt.top/
// @match        https://www.baidu.com/
// @grant        none
// @license      GPL-3.0
// @require      https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js
// @require      https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js
// @downloadURL https://update.greasyfork.org/scripts/535868/AutoMusic%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535868/AutoMusic%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 播放器配置
    const PLAYER_CONFIG = {
        PLAYLIST_ID: '5304877342',  // 网易云歌单ID
        THEME_COLOR: '#2980b9',    // 主题颜色
        DEFAULT_VOLUME: 0.05,      // 默认音量（5%）
        PLAY_MODE: 'random',       // 播放模式: 'random'(随机播放), 'list'(列表播放), 'single'(单曲循环)
        LOOP_MODE: 'all'           // 循环模式: 'all'(全部循环), 'one'(单曲循环), 'none'(不循环)
    };

    // 音量控制配置
    const VOLUME_CONFIG = {
        IDLE: 0.05,       // 空闲状态音量（5%）
        BUSY: 0.1,        // 通话状态音量（10%）
        DEFAULT: 0.05     // 默认音量（5%）
    };

    // 添加 APlayer 样式
    const apPlayerStyle = document.createElement('link');
    apPlayerStyle.rel = 'stylesheet';
    apPlayerStyle.href = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css';
    document.head.appendChild(apPlayerStyle);

    // 创建音乐播放器容器
    const playerContainer = document.createElement('div');
    playerContainer.id = 'custom-music-player';
    playerContainer.style.position = 'fixed';
    playerContainer.style.bottom = '20px';
    playerContainer.style.left = '20px';
    playerContainer.style.zIndex = '9999';
    playerContainer.style.transition = 'all 0.3s ease';

    // 创建播放器和控制按钮
    playerContainer.innerHTML = `
        <div id="playerPoster" style="width: 60px; height: 60px; border-radius: 50%; background-color: ${PLAYER_CONFIG.THEME_COLOR}; overflow: visible; cursor: pointer; box-shadow: 0 4px 15px rgba(41, 128, 185, 0.3); display: flex; align-items: center; justify-content: center; position: relative; transition: all 0.3s ease; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.2);">
            <div class="poster-image" style="width: 100%; height: 100%; background-size: cover; background-position: center; transition: all 0.3s ease; position: absolute; top: 0; left: 0; border-radius: 50%;"></div>
            <div class="player-icon" style="width: 24px; height: 24px; position: relative; display: flex; align-items: center; justify-content: center; z-index: 2; background: rgba(0, 0, 0, 0.3); border-radius: 50%;">
                <svg class="play-icon" viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white; transition: all 0.3s ease;">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white; position: absolute; top: 0; left: 0; opacity: 0; transition: all 0.3s ease;">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            </div>
            <div class="sound-waves" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; pointer-events: none; opacity: 0; transition: opacity 0.3s ease;">
                <div class="wave" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.8); opacity: 0.5; transform: scale(1);"></div>
                <div class="wave" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.8); opacity: 0.3; transform: scale(1.2);"></div>
                <div class="wave" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.8); opacity: 0.2; transform: scale(1.4);"></div>
            </div>
        </div>
        <div id="playerExpanded" style="display: none; width: 320px; background: rgba(255, 255, 255, 0.95); border-radius: 16px; padding: 15px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span id="statusIndicator" style="font-size: 13px; font-weight: 500; color: #2ecc71; background: rgba(46, 204, 113, 0.1); padding: 4px 8px; border-radius: 12px;">空闲状态</span>
                <button id="minimizeBtn" onclick="document.getElementById('playerExpanded').style.display='none'; document.getElementById('playerPoster').style.display='flex';" style="background: none; border: none; color: #666; cursor: pointer; padding: 4px; font-size: 16px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border-radius: 50%;">−</button>
            </div>
            <div id="playerContainer" style="margin-bottom: 12px; border-radius: 12px; overflow: hidden;">
                <meting-js
                    server="netease"
                    type="playlist"
                    id="${PLAYER_CONFIG.PLAYLIST_ID}"
                    fixed="false"
                    autoplay="false"
                    theme="${PLAYER_CONFIG.THEME_COLOR}"
                    loop="${PLAYER_CONFIG.LOOP_MODE}"
                    order="${PLAYER_CONFIG.PLAY_MODE}"
                    preload="auto"
                    volume="${PLAYER_CONFIG.DEFAULT_VOLUME}"
                ></meting-js>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <button id="prevBtn" title="上一曲" style="background: ${PLAYER_CONFIG.THEME_COLOR}; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 8px rgba(41, 128, 185, 0.2);">
                    <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                </button>
                <button id="toggleBtn" title="播放/暂停" style="background: ${PLAYER_CONFIG.THEME_COLOR}; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 8px rgba(41, 128, 185, 0.2);">
                    <svg class="play-svg" viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="pause-svg" viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor; display: none;">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                </button>
                <button id="nextBtn" title="下一曲" style="background: ${PLAYER_CONFIG.THEME_COLOR}; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 8px rgba(41, 128, 185, 0.2);">
                    <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                </button>
                <div style="flex-grow: 1; display: flex; align-items: center; gap: 4px; margin-left: 8px; background: rgba(0, 0, 0, 0.05); padding: 4px 8px; border-radius: 12px;">
                    <span style="font-size: 11px; color: #666;">🔈</span>
                    <input type="range" id="volumeSlider" min="0" max="100" value="${PLAYER_CONFIG.DEFAULT_VOLUME * 100}" style="flex-grow: 1; height: 3px; -webkit-appearance: none; background: #e0e0e0; border-radius: 2px; outline: none;">
                    <span id="volumeValue" style="font-size: 11px; color: #666; width: 25px; text-align: right;">${Math.round(PLAYER_CONFIG.DEFAULT_VOLUME * 100)}%</span>
                </div>
            </div>
        </div>
    `;

    // 将播放器添加到页面
    document.body.appendChild(playerContainer);

    // 获取原始等待音乐和通话音乐元素
    const originalWaitingMusic = document.getElementById('watitingMusic');
    const originalCallMusic = document.getElementById('callMusic');

    // 等待 APlayer 实例初始化
    let playerInstance = null;
    let isPlaying = false;
    let isIdle = true; // 默认空闲状态
    let isExpanded = false; // 播放器是否展开
    let initializationAttempts = 0;
    const MAX_INIT_ATTEMPTS = 20;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes wave {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(1); opacity: 0.8; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.3); opacity: 0.2; }
            100% { transform: scale(1); opacity: 0.6; }
        }
        
        @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
            50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
            100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
        }

        .poster-image.rotating {
            animation: rotate 20s linear infinite;
            animation-play-state: running;
            transform-origin: center center;
        }

        .poster-image.paused {
            animation-play-state: paused;
        }

        .sound-waves.active .wave {
            animation: wave 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            border: 2px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(2px);
        }
        
        .sound-waves.active .wave:nth-child(1) {
            animation: pulse 1.2s ease-in-out infinite;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
        }
        
        .sound-waves.active .wave:nth-child(2) {
            animation: wave 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.3s;
            border: 2px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
        }
        
        .sound-waves.active .wave:nth-child(3) {
            animation: wave 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s;
            border: 2px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
        }
        
        .sound-waves.active {
            animation: glow 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    // 设置事件监听器
    function setupEventListeners() {
        // 播放/暂停切换按钮
        document.getElementById('toggleBtn').addEventListener('click', function() {
            if (!playerInstance) return;

            if (isPlaying) {
                playerInstance.pause();
                this.querySelector('.play-svg').style.display = 'block';
                this.querySelector('.pause-svg').style.display = 'none';
                isPlaying = false;
            } else {
                playerInstance.play();
                this.querySelector('.play-svg').style.display = 'none';
                this.querySelector('.pause-svg').style.display = 'block';
                isPlaying = true;
            }
        });

        // 上一曲按钮
        document.getElementById('prevBtn').addEventListener('click', function() {
            if (playerInstance) {
                playerInstance.skipBack();
            }
        });

        // 下一曲按钮
        document.getElementById('nextBtn').addEventListener('click', function() {
            if (playerInstance) {
                playerInstance.skipForward();
            }
        });

        // 音量滑块
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');

        // 设置初始音量
        if (playerInstance) {
            const currentVolume = playerInstance.volume();
            volumeSlider.value = currentVolume * 100;
            volumeValue.textContent = Math.round(currentVolume * 100) + '%';
        }

        volumeSlider.addEventListener('input', function() {
            const volume = this.value / 100;
            if (playerInstance) {
                playerInstance.volume(volume);
            }
            volumeValue.textContent = this.value + '%';
        });

        // 监听播放状态变化
        playerInstance.on('play', function() {
            const toggleBtn = document.getElementById('toggleBtn');
            if (toggleBtn) {
                toggleBtn.querySelector('.play-svg').style.display = 'none';
                toggleBtn.querySelector('.pause-svg').style.display = 'block';
            }
            isPlaying = true;

            // 更新海报图标和动画
            const playIcon = document.querySelector('.play-icon');
            const pauseIcon = document.querySelector('.pause-icon');
            const posterImage = document.querySelector('.poster-image');
            const soundWaves = document.querySelector('.sound-waves');

            if (playIcon && pauseIcon) {
                playIcon.style.opacity = '0';
                pauseIcon.style.opacity = '1';
            }

            if (posterImage) {
                if (!posterImage.classList.contains('rotating')) {
                    posterImage.classList.add('rotating');
                }
                posterImage.classList.remove('paused');
            }

            if (soundWaves) {
                soundWaves.style.opacity = '1';
                soundWaves.classList.add('active');
            }

            // 同步音量
            if (playerInstance) {
                const currentVolume = playerInstance.volume();
                volumeSlider.value = currentVolume * 100;
                volumeValue.textContent = Math.round(currentVolume * 100) + '%';
            }
        });

        playerInstance.on('pause', function() {
            const toggleBtn = document.getElementById('toggleBtn');
            if (toggleBtn) {
                toggleBtn.querySelector('.play-svg').style.display = 'block';
                toggleBtn.querySelector('.pause-svg').style.display = 'none';
            }
            isPlaying = false;

            // 更新海报图标和动画
            const playIcon = document.querySelector('.play-icon');
            const pauseIcon = document.querySelector('.pause-icon');
            const posterImage = document.querySelector('.poster-image');
            const soundWaves = document.querySelector('.sound-waves');

            if (playIcon && pauseIcon) {
                playIcon.style.opacity = '1';
                pauseIcon.style.opacity = '0';
            }

            if (posterImage) {
                posterImage.classList.add('paused');
            }

            if (soundWaves) {
                soundWaves.style.opacity = '0';
                soundWaves.classList.remove('active');
            }
        });

        // 监听音量变化
        playerInstance.on('volumechange', function() {
            const currentVolume = playerInstance.volume();
            volumeSlider.value = currentVolume * 100;
            volumeValue.textContent = Math.round(currentVolume * 100) + '%';
        });

        // 监听歌曲变化
        playerInstance.on('ended', function() {
            // 更新海报背景为当前歌曲封面
            updatePosterBackground();
            // 保持当前音量
            const currentVolume = playerInstance.volume();
            playerInstance.volume(currentVolume);
        });

        playerInstance.on('canplay', function() {
            // 更新海报背景为当前歌曲封面
            updatePosterBackground();
            // 保持当前音量
            const currentVolume = playerInstance.volume();
            playerInstance.volume(currentVolume);
        });

        // 监听播放列表变化
        playerInstance.on('listswitch', function() {
            // 保持当前音量
            const currentVolume = playerInstance.volume();
            playerInstance.volume(currentVolume);
        });

        // 监听播放器初始化完成
        playerInstance.on('ready', function() {
            // 设置初始音量
            const currentVolume = playerInstance.volume();
            volumeSlider.value = currentVolume * 100;
            volumeValue.textContent = Math.round(currentVolume * 100) + '%';
        });

        // 监听错误事件
        playerInstance.on('error', function() {
            console.error('播放器发生错误，尝试重新初始化');
            setTimeout(initPlayerControls, 1000);
        });
    }

    // 检查并获取 APlayer 实例的函数
    function checkForAPlayer() {
        const metingElement = document.querySelector('meting-js');

        if (metingElement && metingElement.aplayer) {
            playerInstance = metingElement.aplayer;
            console.log('APlayer实例已找到');
            setupEventListeners();
            observeCallState();
            return true;
        }
        return false;
    }

    // 更新海报背景为当前歌曲封面
    function updatePosterBackground() {
        if (playerInstance && playerInstance.list && playerInstance.list.audios) {
            const currentAudio = playerInstance.list.audios[playerInstance.list.index];
            if (currentAudio && currentAudio.cover) {
                const posterImage = document.querySelector('.poster-image');
                if (posterImage) {
                    posterImage.style.backgroundImage = `url(${currentAudio.cover})`;
                    // 如果正在播放，确保旋转动画继续
                    if (isPlaying) {
                        posterImage.classList.add('rotating');
                    }
                }
            }
        }
    }

    // 检查外呼软件状态
    function checkCallStatus() {
        // 查找状态指示器
        const statusElements = document.querySelectorAll('.service-status1');
        if (statusElements.length > 0) {
            let isOnline = false;
            let isIdle = false;
            let isRegistered = false;

            // 检查所有状态
            for (const element of statusElements) {
                const text = element.textContent.trim();
                if (text.includes('在线|已签入')) {
                    isOnline = true;
                } else if (text.includes('空闲')) {
                    isIdle = true;
                } else if (text.includes('已注册')) {
                    isRegistered = true;
                }
            }

            // 只有当所有三个状态都满足时才返回true
            return isOnline && isIdle && isRegistered;
        }

        return false; // 如果没有找到状态元素，返回false
    }

    // 更新状态指示器
    function updateStatusIndicator() {
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = isIdle ? '空闲状态' : '暂停中';
            statusIndicator.style.color = isIdle ? '#2ecc71' : '#e74c3c';
            statusIndicator.style.background = isIdle ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)';
        }
    }

    // 观察呼叫状态变化并控制音乐播放
    function observeCallState() {
        // 禁用原始音乐播放
        if (originalWaitingMusic) {
            originalWaitingMusic.pause();
            originalWaitingMusic.volume = 0;

            // 阻止原始音乐自动播放
            const originalPlay = originalWaitingMusic.play;
            originalWaitingMusic.play = function() {
                // 当系统尝试播放等待音乐时，改为播放我们的音乐
                if (playerInstance && !isPlaying && isIdle) {
                    playerInstance.play();
                }
                return Promise.resolve();
            };

            // 当系统尝试暂停等待音乐时，同时暂停我们的音乐
            const originalPause = originalWaitingMusic.pause;
            originalWaitingMusic.pause = function() {
                if (playerInstance && isPlaying) {
                    playerInstance.pause();
                }
                originalPause.apply(this);
            };
        }

        // 定期检查外呼软件状态
        setInterval(function() {
            const newIdleStatus = checkCallStatus();

            // 如果状态发生变化
            if (newIdleStatus !== isIdle) {
                isIdle = newIdleStatus;
                updateStatusIndicator();

                // 根据状态控制音乐播放
                if (isIdle) {
                    // 空闲状态，播放音乐
                    if (playerInstance && !isPlaying) {
                        playerInstance.play();
                    }
                } else {
                    // 非空闲状态，暂停音乐
                    if (playerInstance && isPlaying) {
                        playerInstance.pause();
                    }
                }
            }
        }, 1000); // 每秒检查一次状态

        // 监视拨号过程
        const callHandleButtons = document.querySelectorAll('button[v-on\\:click="callHandle()"]');
        callHandleButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // 当点击拨号按钮时，开始播放音乐
                if (playerInstance && !isPlaying && isIdle) {
                    playerInstance.play();
                }
            });
        });

        // 监视挂断过程
        const hangupButtons = document.querySelectorAll('span[v-on\\:click="hangUpCall()"]');
        hangupButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // 当点击挂断按钮时，暂停音乐
                if (playerInstance && isPlaying) {
                    playerInstance.pause();
                }
            });
        });
    }

    // 初始化播放器控制
    function initPlayerControls() {
        // 立即尝试检查一次
        if (checkForAPlayer()) {
            // 设置初始音量
            if (playerInstance) {
                const currentVolume = playerInstance.volume();
                const volumeSlider = document.getElementById('volumeSlider');
                const volumeValue = document.getElementById('volumeValue');
                if (volumeSlider && volumeValue) {
                    volumeSlider.value = currentVolume * 100;
                    volumeValue.textContent = Math.round(currentVolume * 100) + '%';
                }
            }
            return;
        }

        // 如果没有找到，设置轮询检查
        initializationAttempts++;
        if (initializationAttempts >= MAX_INIT_ATTEMPTS) {
            console.error('无法获取APlayer实例，已达到最大尝试次数');
            return;
        }

        setTimeout(initPlayerControls, 500); // 每500ms检查一次
    }

    // 当DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayerControls);
    } else {
        initPlayerControls();
    }

    // 设置海报点击事件
    document.getElementById('playerPoster').addEventListener('click', function() {
        document.getElementById('playerExpanded').style.display = 'block';
        document.getElementById('playerPoster').style.display = 'none';
    });

    // 设置最小化按钮事件
    document.getElementById('minimizeBtn').addEventListener('click', function() {
        document.getElementById('playerExpanded').style.display = 'none';
        document.getElementById('playerPoster').style.display = 'flex';

        // 保持播放状态
        if (isPlaying) {
            const playIcon = document.querySelector('.play-icon');
            const pauseIcon = document.querySelector('.pause-icon');
            const posterImage = document.querySelector('.poster-image');
            const soundWaves = document.querySelector('.sound-waves');

            if (playIcon && pauseIcon) {
                playIcon.style.opacity = '0';
                pauseIcon.style.opacity = '1';
            }

            if (posterImage) {
                if (!posterImage.classList.contains('rotating')) {
                    posterImage.classList.add('rotating');
                }
                posterImage.classList.remove('paused');
            }

            if (soundWaves) {
                soundWaves.style.opacity = '1';
                soundWaves.classList.add('active');
            }
        }
    });
})();