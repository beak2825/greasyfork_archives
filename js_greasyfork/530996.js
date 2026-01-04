// ==UserScript==
// @name         京津冀律协集中培训平台视频加速与自动答题
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  在京津冀律协集中培训平台上实现视频倍速播放和自动选择第一个答案，突破倍速限制(最高128倍速)，支持自动播放下一集，增强UI控制面板
// @author       YourName
// @match        https://appgsoghlmo7596.xet-pc.citv.cn/*
// @match        https://*.citv.cn/*
// @match        https://*.jjjlxpx.org.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/530996/%E4%BA%AC%E6%B4%A5%E5%86%80%E5%BE%8B%E5%8D%8F%E9%9B%86%E4%B8%AD%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/530996/%E4%BA%AC%E6%B4%A5%E5%86%80%E5%BE%8B%E5%8D%8F%E9%9B%86%E4%B8%AD%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        defaultSpeed: 3.0, // 默认倍速
        maxSpeed: 128,    // 最大倍速 - 提高到128倍
        minSpeed: 0.25,   // 最小倍速 - 降低到0.25倍
        autoPlayNext: true, // 是否自动播放下一集
        playMode: 3,      // 播放模式：1-单集播放，2-单集循环，3-连续播放
        answerCheckInterval: 1000, // 检查答题框的间隔(毫秒)
        showControls: true,        // 是否显示控制面板
        speedChangeInterval: 300,   // 倍速变化检测间隔(毫秒)
        nextEpisodeCheckInterval: 1000, // 检查下一集的间隔(毫秒)
        speedPresets: [0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 8.0, 16.0, 32.0, 64.0, 128.0], // 倍速预设值
        controlPanelOpacity: 0.9,  // 控制面板透明度
        useSpeedSlider: true       // 是否使用滑块控制速度
    };

    // 主控制器
    class CITVController {
        constructor() {
            this.video = null;
            this.currentSpeed = GM_getValue('citv_video_speed', config.defaultSpeed);
            this.answerInterval = null;
            this.isAnswering = false;
            this.speedCheckInterval = null;
            this.controlPanel = null;
            this.nextEpisodeInterval = null;
            this.isChangingEpisode = false;
            this.init();
        }

        init() {
            this.waitForVideo().then(() => {
                this.setupVideoControls();
                this.setupAnswerMonitor();
                this.setupAutoPlayNext();
                this.hijackPlayerMethods();
                if (config.showControls) {
                    this.createControlPanel();
                }
            });
        }

        // 等待视频元素加载
        waitForVideo() {
            return new Promise((resolve) => {
                const checkVideo = () => {
                    this.video = document.querySelector('video');
                    if (this.video) {
                        resolve();
                    } else {
                        setTimeout(checkVideo, 500);
                    }
                };
                checkVideo();
            });
        }

        // 设置自动播放下一集功能（在目录列表中实现）
        setupAutoPlayNext() {
            if (!config.autoPlayNext) return;

            // 监听视频结束事件
            this.video.addEventListener('ended', () => {
                if (!this.isChangingEpisode) {
                    this.playNextVideoInDirectory();
                }
            });

            // 设置定期检查，以防ended事件没有触发
            this.nextEpisodeInterval = setInterval(() => {
                if (this.video && this.video.ended && !this.isChangingEpisode) {
                    this.playNextVideoInDirectory();
                }
            }, config.nextEpisodeCheckInterval);
        }

        // 在目录列表中查找并播放下一个视频
        playNextVideoInDirectory() {
            this.isChangingEpisode = true;
            console.log('视频结束，尝试查找下一个视频链接或按钮...');

            // 尝试查找目录列表中的视频项目
            const findVideoListItems = () => {
                // 京津冀律协集中培训平台特定选择器
                const jjjSelectors = [
                    // 课程列表选择器
                    '.course-list-item', '.course-item', '.lesson-item',
                    // 章节列表选择器
                    '.chapter-item', '.section-item',
                    // 目录列表选择器
                    '.catalog-item', '.catalog-list-item',
                    // 课程卡片选择器
                    '.course-card', '.lesson-card',
                    // 通用列表项选择器
                    '.ant-list-item', '.list-item'
                ];

                // 通用选择器
                const generalSelectors = [
                    // 常见的视频列表容器选择器
                    '.video-list li', '.video-list .item', '.course-list li', '.course-list .item',
                    '.chapter-list li', '.chapter-list .item', '.lesson-list li', '.lesson-list .item',
                    '.playlist li', '.playlist .item', '.episode-list li', '.episode-list .item',
                    // 更通用的选择器
                    '[class*="video-list"] li', '[class*="video-list"] [class*="item"]',
                    '[class*="course-list"] li', '[class*="course-list"] [class*="item"]',
                    '[class*="chapter-list"] li', '[class*="chapter-list"] [class*="item"]',
                    '[class*="lesson-list"] li', '[class*="lesson-list"] [class*="item"]',
                    '[class*="playlist"] li', '[class*="playlist"] [class*="item"]',
                    '[class*="episode-list"] li', '[class*="episode-list"] [class*="item"]',
                    // 查找包含链接的列表项
                    'li a[href]', '.item a[href]', '[class*="item"] a[href]',
                    // 查找所有可能的视频链接
                    'a[href*="video"]', 'a[href*="course"]', 'a[href*="lesson"]', 'a[href*="chapter"]',
                    // 添加更多可能的视频链接选择器
                    'a[href*="play"]', 'a[href*="watch"]', 'a[href*="episode"]', 'a[href*="media"]',
                    // 添加可能的下一集链接选择器
                    'a[href*="next"]', 'a[href*="下一"]', 'a[href*="下一集"]', 'a[href*="下一章"]',
                    // 添加可能的序号链接选择器
                    'a[href*="id="]', 'a[href*="num="]', 'a[href*="index="]', 'a[href*="ep="]'
                ];

                // 合并选择器并优先尝试京津冀律协平台特定选择器
                const selectors = [...jjjSelectors, ...generalSelectors];

                // 尝试每个选择器并返回第一个找到的有效列表
                for (const selector of selectors) {
                    const items = document.querySelectorAll(selector);
                    if (items && items.length > 1) {
                        return Array.from(items);
                    }
                }

                // 如果没有找到特定的列表，尝试查找所有链接
                return Array.from(document.querySelectorAll('a[href]'));
            };

            // 获取视频列表项
            const listItems = findVideoListItems();
            console.log(`找到 ${listItems.length} 个可能的视频项目`);

            if (listItems.length > 0) {
                // 尝试查找当前URL或标题匹配的项目
                const currentUrl = window.location.href;
                const currentTitle = document.title;

                // 查找当前项目的索引
                let currentIndex = -1;

                // 首先尝试通过URL或active类查找当前项目
                for (let i = 0; i < listItems.length; i++) {
                    const item = listItems[i];
                    const itemHref = item.href || (item.querySelector('a') ? item.querySelector('a').href : '');

                    // 检查是否是当前项目（通过URL、active类或其他标识）
                    if ((itemHref && currentUrl.includes(itemHref)) ||
                        item.classList.contains('active') ||
                        item.classList.contains('current') ||
                        item.classList.contains('selected') ||
                        item.getAttribute('aria-selected') === 'true' ||
                        item.classList.contains('ant-menu-item-selected')) {
                        currentIndex = i;
                        break;
                    }

                    // 检查标题是否匹配
                    const itemText = item.textContent || '';
                    if (currentTitle.includes(itemText) || itemText.includes(currentTitle)) {
                        currentIndex = i;
                        break;
                    }

                    // 检查是否包含当前视频的序号或ID
                    const urlParams = new URLSearchParams(currentUrl.split('?')[1] || '');
                    const currentId = urlParams.get('id') || urlParams.get('videoId') || urlParams.get('episodeId') || '';
                    if (currentId && itemHref && itemHref.includes(currentId)) {
                        currentIndex = i;
                        break;
                    }
                }

                // 如果找到当前项目，点击下一个项目
                if (currentIndex !== -1 && currentIndex < listItems.length - 1) {
                    const nextItem = listItems[currentIndex + 1];
                    console.log('找到下一个视频项目，点击中...');

                    // 如果项目本身是链接，直接点击
                    if (nextItem.tagName === 'A') {
                        nextItem.click();
                    }
                    // 否则查找项目内的链接并点击
                    else {
                        const link = nextItem.querySelector('a') || nextItem.querySelector('[class*="link"]');
                        if (link) {
                            link.click();
                        } else {
                            // 如果没有找到链接，尝试直接点击项目
                            nextItem.click();
                        }
                    }

                    // 重置状态
                    setTimeout(() => {
                        this.isChangingEpisode = false;
                    }, 2000);
                    return;
                } else if (currentIndex === -1) {
                    // 如果没有找到当前项目，尝试查找可能的下一集链接
                    console.log('未找到当前视频在列表中的位置，尝试查找可能的下一集链接...');

                    // 尝试查找包含"下一"、"next"等关键词的链接
                    const nextButtons = [
                        ...document.querySelectorAll('a[href*="next"], a[href*="下一"], button:contains("下一"), .btn:contains("下一")'),
                        ...document.querySelectorAll('[class*="next"], [class*="下一"], [aria-label*="next"], [aria-label*="下一"]')
                    ];

                    if (nextButtons.length > 0) {
                        console.log('找到可能的下一集按钮，点击中...');
                        nextButtons[0].click();
                        setTimeout(() => {
                            this.isChangingEpisode = false;
                        }, 2000);
                        return;
                    }

                    // 尝试查找可能的下一集按钮（通过图标或类名）
                    const nextIconButtons = document.querySelectorAll('[class*="next-icon"], [class*="next-button"], [class*="arrow-right"], .anticon-right, .anticon-forward');
                    if (nextIconButtons.length > 0) {
                        console.log('找到可能的下一集图标按钮，点击中...');
                        nextIconButtons[0].click();
                        setTimeout(() => {
                            this.isChangingEpisode = false;
                        }, 2000);
                        return;
                    }
                }

                // 如果没有找到下一个视频，重置状态
                console.log('未找到下一个视频，可能是最后一集或无法识别视频列表');
                this.isChangingEpisode = false;
            } else {
                console.log('未找到视频列表');
                this.isChangingEpisode = false;
            }
        }

        // 设置播放模式
        setPlayMode(modeType) {
            // 尝试查找并修改播放模式
            try {
                // 查找可能的Vue组件
                const players = [...document.querySelectorAll('[class*="VideoPlayer"]')];
                const player = players.find(el => el.__vue__);

                if (player && player.__vue__) {
                    const vm = player.__vue__;

                    // 尝试设置播放模式
                    if (vm.playMode !== undefined) {
                        vm.playMode = modeType;
                    }

                    // 尝试调用设置播放模式的方法
                    if (typeof vm.setPlayMode === 'function') {
                        vm.setPlayMode(modeType);
                    }
                }

                // 尝试直接在window对象上查找播放器实例
                if (window.player && window.player.setPlayMode) {
                    window.player.setPlayMode(modeType);
                }

                // 尝试在localStorage中设置播放模式
                localStorage.setItem('playModeType', modeType);

            } catch (error) {
                console.error('设置播放模式失败:', error);
            }
        }

        // 劫持播放器组件方法
        hijackPlayerMethods() {
            // 劫持setAttribute
            const originalSetAttribute = Element.prototype.setAttribute;
            Element.prototype.setAttribute = function(name, value) {
                if (name === 'playbackRate' && this.tagName === 'VIDEO') {
                    return; // 阻止通过setAttribute修改速度
                }
                return originalSetAttribute.apply(this, arguments);
            };

            // 尝试劫持Vue组件方法
            const findVideoPlayer = () => {
                const players = [...document.querySelectorAll('[class*="VideoPlayer"]')];
                return players.find(el => el.__vue__);
            };

            const hijackVueMethods = () => {
                const player = findVideoPlayer();
                if (player && player.__vue__) {
                    const vm = player.__vue__;

                    if (vm.setPlaybackRate) {
                        const original = vm.setPlaybackRate;
                        vm.setPlaybackRate = (rate) => {
                            const newRate = Math.min(Math.max(rate, config.minSpeed), config.maxSpeed);
                            return original.call(vm, newRate);
                        };
                    }

                    if (vm.updatePlaybackRate) {
                        const original = vm.updatePlaybackRate;
                        vm.updatePlaybackRate = function() {
                            original.call(vm);
                            this.playbackRate = this.currentSpeed;
                        };
                    }
                }
            };

            setTimeout(hijackVueMethods, 3000);
        }

        // 设置视频控制
        setupVideoControls() {
            // 保存原始描述符
            const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
            const originalDefaultDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'defaultPlaybackRate');

            // 全局劫持所有视频元素的playbackRate
            Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
                get: function() {
                    return this._customPlaybackRate || (originalDescriptor && originalDescriptor.get ? originalDescriptor.get.call(this) : 1.0);
                },
                set: function(value) {
                    // 如果是我们的视频元素，使用我们的速度控制
                    if (this === document.querySelector('video')) {
                        // 忽略网站尝试设置的速度限制
                        return;
                    } else {
                        // 对于其他视频元素，使用原始设置器
                        if (originalDescriptor && originalDescriptor.set) {
                            originalDescriptor.set.call(this, value);
                        }
                        this._customPlaybackRate = value;
                    }
                },
                configurable: true,
                enumerable: true
            });

            // 劫持defaultPlaybackRate
            Object.defineProperty(HTMLMediaElement.prototype, 'defaultPlaybackRate', {
                get: function() {
                    return this._customDefaultPlaybackRate || (originalDefaultDescriptor && originalDefaultDescriptor.get ? originalDefaultDescriptor.get.call(this) : 1.0);
                },
                set: function(value) {
                    // 如果是我们的视频元素，忽略网站设置
                    if (this === document.querySelector('video')) {
                        return;
                    } else {
                        // 对于其他视频元素，使用原始设置器
                        if (originalDefaultDescriptor && originalDefaultDescriptor.set) {
                            originalDefaultDescriptor.set.call(this, value);
                        }
                        this._customDefaultPlaybackRate = value;
                    }
                },
                configurable: true,
                enumerable: true
            });

            // 深度劫持当前视频元素的playbackRate
            Object.defineProperty(this.video, 'playbackRate', {
                get: () => this.currentSpeed,
                set: (value) => {
                    // 完全忽略网站尝试设置的值，只使用我们控制的值
                    // 但如果是用户通过我们的控制面板设置的值，则接受它
                    if (value === this.currentSpeed) {
                        if (originalDescriptor && originalDescriptor.set) {
                            originalDescriptor.set.call(this.video, this.currentSpeed);
                        }
                        this.video._customPlaybackRate = this.currentSpeed;
                    }
                    return this.currentSpeed;
                },
                configurable: true,
                enumerable: true
            });

            // 设置初始速度
            this.currentSpeed = Math.min(Math.max(this.currentSpeed, config.minSpeed), config.maxSpeed);

            // 直接使用原始设置器设置初始速度
            if (originalDescriptor && originalDescriptor.set) {
                originalDescriptor.set.call(this.video, this.currentSpeed);
            }
            this.video._customPlaybackRate = this.currentSpeed;

            if (originalDefaultDescriptor && originalDefaultDescriptor.set) {
                originalDefaultDescriptor.set.call(this.video, this.currentSpeed);
            }
            this.video._customDefaultPlaybackRate = this.currentSpeed;

            // 使用requestAnimationFrame持续保持速度
            const maintainSpeed = () => {
                if (!this.video) return; // 防止视频元素不存在时出错

                // 检查实际播放速度是否与我们设置的速度一致
                const actualSpeed = originalDescriptor && originalDescriptor.get ?
                    originalDescriptor.get.call(this.video) : 1.0;

                if (Math.abs(actualSpeed - this.currentSpeed) > 0.01) {
                    // 如果速度被重置，重新设置
                    if (originalDescriptor && originalDescriptor.set) {
                        originalDescriptor.set.call(this.video, this.currentSpeed);
                    }
                    this.video._customPlaybackRate = this.currentSpeed;
                }

                requestAnimationFrame(maintainSpeed);
            };
            maintainSpeed();

            // 监听视频事件
            const videoEvents = ['loadedmetadata', 'play', 'playing', 'seeked', 'seeking', 'ratechange'];
            videoEvents.forEach(event => {
                this.video.addEventListener(event, () => {
                    // 视频状态变化时，确保播放速度正确
                    if (originalDescriptor && originalDescriptor.set) {
                        originalDescriptor.set.call(this.video, this.currentSpeed);
                    }
                    this.video._customPlaybackRate = this.currentSpeed;

                    // 设置播放模式为连续播放
                    if (config.autoPlayNext) {
                        this.setPlayMode(config.playMode);
                    }
                });
            });

            // 监听页面可见性变化
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && this.video) {
                    // 页面重新可见时，确保速度设置正确
                    setTimeout(() => {
                        if (originalDescriptor && originalDescriptor.set) {
                            originalDescriptor.set.call(this.video, this.currentSpeed);
                        }
                        this.video._customPlaybackRate = this.currentSpeed;
                    }, 100);
                }
            });
        }

        // 创建控制面板
        createControlPanel() {
            // 如果控制面板已存在，先移除
            if (this.controlPanel) {
                this.controlPanel.remove();
            }

            // 创建控制面板容器
            this.controlPanel = document.createElement('div');
            this.controlPanel.id = 'citv-control-panel';
            this.controlPanel.style.opacity = config.controlPanelOpacity;

            // 创建面板头部（标题和最小化按钮）
            const panelHeader = document.createElement('div');
            panelHeader.className = 'panel-header';

            const panelTitle = document.createElement('div');
            panelTitle.className = 'panel-title';
            panelTitle.textContent = '视频控制面板';
            panelHeader.appendChild(panelTitle);

            const minimizeBtn = document.createElement('button');
            minimizeBtn.className = 'minimize-btn';
            minimizeBtn.textContent = '−';
            minimizeBtn.title = '最小化/展开面板';
            minimizeBtn.onclick = () => {
                this.controlPanel.classList.toggle('minimized');
                minimizeBtn.textContent = this.controlPanel.classList.contains('minimized') ? '+' : '−';
            };
            panelHeader.appendChild(minimizeBtn);

            this.controlPanel.appendChild(panelHeader);

            // 创建速度显示
            const speedDisplay = document.createElement('div');
            speedDisplay.innerHTML = `当前速度: <span id="citv-speed-display">${this.currentSpeed.toFixed(1)}x</span>`;
            this.controlPanel.appendChild(speedDisplay);

            // 添加滑块控制器
            if (config.useSpeedSlider) {
                const sliderContainer = document.createElement('div');
                sliderContainer.style.marginTop = '10px';

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = Math.log(config.minSpeed);
                slider.max = Math.log(config.maxSpeed);
                slider.step = 0.01;
                slider.value = Math.log(this.currentSpeed);
                slider.oninput = () => {
                    // 使用对数刻度使滑块更易于控制
                    const newSpeed = Math.exp(parseFloat(slider.value));
                    this.currentSpeed = Math.round(newSpeed * 100) / 100; // 保留两位小数
                    this.video.playbackRate = this.currentSpeed;
                    GM_setValue('citv_video_speed', this.currentSpeed);
                    this.updateControlPanel();
                };
                sliderContainer.appendChild(slider);

                this.controlPanel.appendChild(sliderContainer);
            }

            // 创建速度控制按钮
            const controlsContainer = document.createElement('div');
            controlsContainer.style.marginTop = '10px';

            const decreaseBtn = document.createElement('button');
            decreaseBtn.textContent = '减速 -';
            decreaseBtn.onclick = () => this.changeSpeed(-0.5);
            controlsContainer.appendChild(decreaseBtn);

            const increaseBtn = document.createElement('button');
            increaseBtn.textContent = '加速 +';
            increaseBtn.onclick = () => this.changeSpeed(0.5);
            controlsContainer.appendChild(increaseBtn);

            // 添加自动播放下一集开关按钮
            const autoPlayBtn = document.createElement('button');
            autoPlayBtn.textContent = config.autoPlayNext ? '关闭自动播放' : '开启自动播放';
            autoPlayBtn.style.marginLeft = '5px';
            autoPlayBtn.className = config.autoPlayNext ? 'active' : '';
            autoPlayBtn.onclick = () => {
                config.autoPlayNext = !config.autoPlayNext;
                autoPlayBtn.textContent = config.autoPlayNext ? '关闭自动播放' : '开启自动播放';
                autoPlayBtn.className = config.autoPlayNext ? 'active' : '';

                if (config.autoPlayNext) {
                    this.setupAutoPlayNext();
                } else if (this.nextEpisodeInterval) {
                    clearInterval(this.nextEpisodeInterval);
                }
            };
            controlsContainer.appendChild(autoPlayBtn);

            this.controlPanel.appendChild(controlsContainer);

            // 添加预设速度按钮
            const presetsContainer = document.createElement('div');
            presetsContainer.className = 'speed-presets';
            presetsContainer.style.marginTop = '10px';

            // 添加预设速度按钮
            config.speedPresets.forEach(speed => {
                const presetBtn = document.createElement('button');
                presetBtn.textContent = `${speed}x`;
                presetBtn.onclick = () => {
                    this.currentSpeed = speed;
                    this.video.playbackRate = this.currentSpeed;
                    GM_setValue('citv_video_speed', this.currentSpeed);
                    this.updateControlPanel();
                };
                presetsContainer.appendChild(presetBtn);
            });

            this.controlPanel.appendChild(presetsContainer);

            // 添加到页面
            document.body.appendChild(this.controlPanel);
        }

        // 更新控制面板显示
        updateControlPanel() {
            if (this.controlPanel) {
                const speedDisplay = this.controlPanel.querySelector('#citv-speed-display');
                if (speedDisplay) {
                    speedDisplay.textContent = `${this.currentSpeed.toFixed(1)}x`;
                }
            }
        }

        // 改变速度
        changeSpeed(change) {
            this.currentSpeed = Math.min(Math.max(this.currentSpeed + change, config.minSpeed), config.maxSpeed);
            this.video.playbackRate = this.currentSpeed;
            GM_setValue('citv_video_speed', this.currentSpeed);
            this.updateControlPanel();
        }

        // 监控答题框
        setupAnswerMonitor() {
            this.answerInterval = setInterval(() => {
                // 尝试多种可能的答题框选择器
                const answerDialogs = [
                    document.querySelector('.ant-modal-content'),
                    document.querySelector('.quiz-container'),
                    document.querySelector('.question-container'),
                    document.querySelector('[class*="quiz"]'),
                    document.querySelector('[class*="question"]'),
                    document.querySelector('.ant-modal'),
                    document.querySelector('.modal-content'),
                    document.querySelector('.dialog-content'),
                    document.querySelector('[class*="modal"]'),
                    document.querySelector('[class*="dialog"]'),
                    document.querySelector('[class*="popup"]'),
                    // 检查是否有包含"题"字的元素
                    document.querySelector('div:contains("题")'),
                    document.querySelector('div:contains("选择")'),
                    document.querySelector('div:contains("问题")')
                ];

                const answerDialog = answerDialogs.find(dialog => dialog !== null);

                if (answerDialog && !this.isAnswering) {
                    this.isAnswering = true;
                    console.log('检测到答题框，开始自动答题...');
                    this.autoSelectFirstAnswer();
                    this.updateAnswerStatus(true);
                } else if (!answerDialog) {
                    if (this.isAnswering) {
                        console.log('答题完成');
                        this.updateAnswerStatus(false);
                    }
                    this.isAnswering = false;
                }
            }, config.answerCheckInterval);
        }

        // 自动选择第一个答案并确认退出
        autoSelectFirstAnswer() {
            // 查找所有选项
            const optionSelectors = [
                '.question-option-item',
                '.option-item',
                '.ant-radio-wrapper',
                '.ant-checkbox-wrapper',
                '[class*="option"]',
                '[class*="answer"]'
            ];

            let options = null;

            // 尝试每个选择器直到找到选项
            for (const selector of optionSelectors) {
                options = document.querySelectorAll(selector);
                if (options && options.length > 0) {
                    break;
                }
            }

            if (options && options.length > 0) {
                // 选择第一个选项
                options[0].click();

                // 查找提交按钮并点击
                setTimeout(() => {
                    const submitBtnSelectors = [
                        '.submit-btn',
                        '.ant-btn-primary',
                        '[class*="submit"]',
                        'button:contains("提交")',
                        'button:contains("确定")',
                        'button:contains("确认")'
                    ];

                    let submitBtn = null;

                    // 尝试每个选择器直到找到提交按钮
                    for (const selector of submitBtnSelectors) {
                        try {
                            submitBtn = document.querySelector(selector);
                            if (submitBtn) {
                                break;
                            }
                        } catch (e) {
                            // 忽略选择器错误
                        }
                    }

                    if (submitBtn) {
                        submitBtn.click();

                        // 查找并点击确认按钮（如果有）
                        setTimeout(() => {
                            // 尝试查找可能的确认按钮
                            const confirmBtns = [
                                document.querySelector('.ant-btn-primary'),  // 主要按钮
                                document.querySelector('[class*="confirm"]'),  // 包含confirm的按钮
                                document.querySelector('[class*="ok"]'),  // 包含ok的按钮
                                document.querySelector('.ant-modal-footer button:last-child'),  // 模态框底部最后一个按钮
                                document.querySelector('button:contains("确定")'),
                                document.querySelector('button:contains("确认")'),
                                document.querySelector('button:contains("知道了")'),
                                document.querySelector('button:contains("继续")'),
                                document.querySelector('button:contains("下一题")')
                            ];

                            // 尝试点击找到的第一个确认按钮
                            for (const btn of confirmBtns) {
                                if (btn) {
                                    btn.click();
                                    break;
                                }
                            }

                            // 重置答题状态
                            setTimeout(() => {
                                this.isAnswering = false;
                            }, 500);
                        }, 500);
                    }
                }, 500);
            }
        }
    }

    // 启动控制器
    setTimeout(() => {
        new CITVController();
    }, 1000);

    // 添加样式
    GM_addStyle(`
        #citv-control-panel {
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            user-select: none;
            font-family: Arial, sans-serif;
            transition: opacity 0.3s ease;
            max-width: 300px;
            width: 280px;
            opacity: 0.9;
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 9999;
        }

        #citv-control-panel:hover {
            opacity: 1 !important;
        }

        #citv-control-panel.minimized {
            width: auto;
            height: auto;
        }

        #citv-control-panel button {
            background: linear-gradient(to bottom, #4CAF50, #3e8e41);
            border: none;
            color: white;
            padding: 6px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 3px 1px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        #citv-control-panel button:hover {
            background: linear-gradient(to bottom, #45a049, #357a38);
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        #citv-control-panel button:active {
            transform: translateY(1px);
            box-shadow: 0 0 2px rgba(0,0,0,0.3);
        }

        #citv-control-panel button.active {
            background: linear-gradient(to bottom, #2196F3, #0b7dda);
            font-weight: bold;
        }

        #citv-speed-display {
            font-weight: bold;
            color: #FFD700;
            min-width: 50px;
            display: inline-block;
            text-align: center;
            font-size: 20px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            margin: 5px 0;
        }

        #citv-control-panel input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: #444;
            outline: none;
            margin: 10px 0;
        }

        #citv-control-panel input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #FFD700;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        #citv-control-panel input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #FFD700;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        #citv-control-panel .speed-presets {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 5px;
        }

        #citv-control-panel .speed-presets button {
            flex: 0 0 auto;
            padding: 4px 8px;
            margin: 2px;
            font-size: 11px;
        }

        #citv-control-panel .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        #citv-control-panel .panel-title {
            font-weight: bold;
            font-size: 16px;
            color: #FFD700;
        }

        #citv-control-panel .minimize-btn {
            background: transparent;
            border: none;
            color: #ccc;
            cursor: pointer;
            padding: 0;
            font-size: 16px;
            box-shadow: none;
        }

        #citv-control-panel .minimize-btn:hover {
            color: white;
            transform: none;
            box-shadow: none;
        }
    `);
})();