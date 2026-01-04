// ==UserScript==
// @name         监控任意网站播放器时长并显示+自动下集
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  监控当前网页播放器的当前时长和总时长，并在页面右下角显示，播放结束自动跳转下集（单击隐藏/显示面板）
// @author       You
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/duration.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537837/%E7%9B%91%E6%8E%A7%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%97%B6%E9%95%BF%E5%B9%B6%E6%98%BE%E7%A4%BA%2B%E8%87%AA%E5%8A%A8%E4%B8%8B%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/537837/%E7%9B%91%E6%8E%A7%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%97%B6%E9%95%BF%E5%B9%B6%E6%98%BE%E7%A4%BA%2B%E8%87%AA%E5%8A%A8%E4%B8%8B%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // dayjs duration 插件初始化
    dayjs.extend(dayjs_plugin_duration);

    // 常量定义
    const STORAGE_KEY = 'video_helper_settings';
    const DEFAULT_SETTINGS = {
        autoNext: true,
        panelVisible: true // 添加面板可见性设置
    };
    const PLAYER_CHECK_INTERVAL = 2000; // ms

    // 视频助手主模块
    const VideoHelper = {
        settings: JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_SETTINGS,
        panel: null,
        player: null,
        hasJumped: false,
        toggleButton: null, // 新增切换按钮引用

        // 初始化
        init() {
            this.panel = this.createPanel();
            if (!this.panel) {
                console.error("视频助手面板创建失败!");
                return;
            }

            // 创建悬浮切换按钮
            this.toggleButton = this.createToggleButton();

            // 根据设置初始化面板可见性
            if (!this.settings.panelVisible) {
                this.panel.addClass('vtp-hidden');
            }

            this.setupPlayerListener();
            console.debug('视频助手已初始化');
        },

        // 创建悬浮切换按钮
        createToggleButton() {
            let $toggleBtn = $('<div id="video-panel-toggle-btn">👁️</div>').css({
                position: 'fixed',
                right: '24px',
                bottom: '80px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 99999,
                fontSize: '14px',
                opacity: 0.6,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }).hover(
                function(){ $(this).css('opacity', 1).css('transform', 'scale(1.1)'); },
                function(){ $(this).css('opacity', 0.6).css('transform', 'scale(1)'); }
            ).click(() => {
                this.togglePanelVisibility();
                this.updateToggleButtonIcon();
            }).appendTo('body');

            this.updateToggleButtonIcon();
            return $toggleBtn;
        },

        // 更新切换按钮的图标
        updateToggleButtonIcon() {
            if (!this.toggleButton) return;

            if (this.settings.panelVisible) {
                this.toggleButton.html('👁️').attr('title', '点击隐藏面板');
            } else {
                this.toggleButton.html('👁️‍🗨️').attr('title', '点击显示面板');
            }
        },

        // 创建显示面板
        createPanel() {
            return createPanel();
        },

        // 设置播放器监听
        setupPlayerListener() {
            this.findPlayer();
        },

        // 查找播放器
        findPlayer() {
            let timer = setInterval(() => {
                let $player = $('#playerCnt_html5_api');

                if (!$player.length) {
                    $('iframe').each(function() {
                        try {
                            if (!isSameOrigin(this.src)) return;

                            const iframeDoc = this.contentDocument;
                            const iframePlayer = $(iframeDoc).find('#playerCnt_html5_api');
                            if (iframePlayer.length) {
                                $player = iframePlayer;
                                return false;
                            }
                        } catch (e) {
                            console.debug('安全限制iframe:', e.message);
                        }
                    });
                }

                if ($player.length) {
                    clearInterval(timer);
                    this.player = $player;
                    this.setupPlayerEvents();
                }
            }, PLAYER_CHECK_INTERVAL);
        },

        // 设置播放器事件
        setupPlayerEvents() {
            const self = this;

            this.updatePanel(this.player[0].currentTime, this.player[0].duration);

            this.player.on('timeupdate', function() {
                self.updatePanel(this.currentTime, this.duration);

                if (!isNaN(this.duration) && this.duration > 0) {
                    if (!self.hasJumped && this.currentTime >= this.duration - 1) {
                        self.hasJumped = true;
                        self.handleVideoEnd();
                    }
                }
            });

            this.player.on('loadedmetadata', function() {
                self.updatePanel(this.currentTime, this.duration);
            });
        },

        // 更新面板显示
        updatePanel(current, duration) {
            if (!this.panel) return;
            let percent = (!isNaN(current) && !isNaN(duration) && duration > 0) ? Math.min(100, Math.max(0, current / duration * 100)) : 0;
            this.panel.find('.vtp-bar').css('width', percent + '%');
            this.panel.find('.vtp-time').text(` ${formatTime(current)} / ${formatTime(duration)}`);
            if (isNaN(current) || isNaN(duration)) {
                this.panel.find('.vtp-time').text('未检测到播放器');
                this.panel.find('.vtp-bar').css('width', '0%');
            }
        },

        // 处理视频结束
        handleVideoEnd() {
            if (!this.settings.autoNext) return;

            console.debug('视频即将结束，尝试寻找下一集按钮...');
            let nextBtn = findNextEpisodeBtn();
            if (nextBtn && nextBtn.length) {
                console.log('找到下集按钮，准备点击');
                // 稍微延迟点击，以防止多次触发
                setTimeout(() => nextBtn[0].click(), 500);
            } else {
                console.log('未找到适合的下一集按钮');
            }
        },

        // 切换面板可见性
        togglePanelVisibility() {
            if (!this.panel) return;

            this.settings.panelVisible = !this.settings.panelVisible;
            this.panel.toggleClass('vtp-hidden');
            this.saveSettings();

            // 更新切换按钮图标
            this.updateToggleButtonIcon();
        },

        // 保存设置
        saveSettings() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
        }
    };

    // 新增按钮选择器库
    const nextEpisodeSelectors = {
        // 文本匹配 - 按优先级排序
        textSelectors: [
            'a:contains("下一集")',
            'a:contains("下集")',
            'a:contains("下一话")',
            'a:contains("下一章")',
            'a:contains("下一页")',
            'a:contains("Next")',
            'a:contains("next episode")',
            '.player-btns-next',
            '.next-btn',
        ],

        // 图标匹配
        iconSelectors: [
            'a:has(.fa-forward)',
            'a:has(.fa-caret-down)',
            'a:has(.fa-caret-right)',
            'a:has(.fa-step-forward)',
            'a:has(.fa-arrow-right)',
            'a:has(.fa-chevron-right)',
            '.icon-next',
            '.icon-forward'
        ],

        // 常见网站特定选择器
        siteSpecificSelectors: {
            'v.qq.com': '.txp_btn_next',
            'bilibili.com': '.bilibili-player-video-btn-next',
            'youku.com': '.control-next-video',
            'iqiyi.com': '.iqp-btn-next'
        },

        // 常见下一集按钮区域
        regionSelectors: [
            '.player-controls',
            '.video-controls',
            '.player-container',
            '.myui-player__operate',
            '.video-operate'
        ]
    };

    // 创建显示面板
    function createPanel() {
        if ($('#video-time-panel').length > 0) {
            return $('#video-time-panel');
        }

        let $panel = $('<div id="video-time-panel">\n  <div class="vtp-bar-bg"><div class="vtp-bar"></div></div>\n  <div class="vtp-time"></div>\n</div>').css({
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            cursor: 'pointer', // 改为pointer以指示可点击
            touchAction: 'none',
            background: 'rgba(30,30,30,0.35)',
            color: '#fff',
            padding: '6px 14px 6px 14px',
            borderRadius: '16px',
            fontSize: '14px',
            zIndex: 99999,
            fontFamily: 'monospace',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            minWidth: '120px',
            maxWidth: '220px',
            opacity: 0.7,
            transition: 'all 0.3s ease',
            userSelect: 'none',
            pointerEvents: 'auto',
        }).appendTo('body');

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let clickStartTime = 0;

        // 添加单击事件处理
        $panel.on('mousedown', function(e) {
            isDragging = false; // 初始状态为非拖拽
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt($panel.css('left')) || ($panel.offset() && $panel.offset().left) || 0;
            initialTop = parseInt($panel.css('top')) || ($panel.offset() && $panel.offset().top) || 0;
            $panel.css('transition', 'none');
            clickStartTime = Date.now(); // 记录点击开始时间
        });

        $(document).on('mousemove', function(e) {
            if (clickStartTime === 0) return;

            // 如果移动超过5px，视为拖拽而非点击
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                isDragging = true;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const newLeft = initialLeft + deltaX;
                const newTop = initialTop + deltaY;
                $panel.css({
                    left: newLeft + 'px',
                    top: newTop + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
            }
        });

        $(document).on('mouseup', function(e) {
            if (clickStartTime === 0) return;

            const clickDuration = Date.now() - clickStartTime;

            // 如果不是拖拽且点击时间短，则视为点击
            if (!isDragging && clickDuration < 200) {
                // 检查点击是否在设置按钮上
                const $target = $(e.target);
                if (!$target.hasClass('vtp-settings-btn') && !$target.closest('.vtp-settings-panel').length) {
                    // 不再在面板点击时切换可见性，而是仅用悬浮按钮控制
                    // VideoHelper.togglePanelVisibility();
                }
            }

            if (isDragging) {
                $panel.css('transition', 'opacity 0.2s');
            }

            clickStartTime = 0;
            isDragging = false;
        });

        $panel.hover(
            function(){ $(this).css('opacity', 1); },
            function(){
                if (!$(this).find('.vtp-settings-panel').is(':visible')) {
                    $(this).css('opacity', 0.7);
                }
            }
        );

        // 触摸设备支持
        $panel.on('touchstart', function(e) {
            clickStartTime = Date.now();
            isDragging = false;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialLeft = parseInt($panel.css('left')) || ($panel.offset() && $panel.offset().left) || 0;
            initialTop = parseInt($panel.css('top')) || ($panel.offset() && $panel.offset().top) || 0;
            $panel.css('transition', 'none');
        });

        $panel.on('touchmove', function(e) {
            if (clickStartTime === 0) return;

            // 如果移动超过10px，视为拖拽而非点击
            const touch = e.touches[0];
            if (Math.abs(touch.clientX - startX) > 10 || Math.abs(touch.clientY - startY) > 10) {
                isDragging = true;
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                const newLeft = initialLeft + deltaX;
                const newTop = initialTop + deltaY;
                $panel.css({
                    left: newLeft + 'px',
                    top: newTop + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
            }
        });

        $panel.on('touchend', function(e) {
            if (clickStartTime === 0) return;

            const clickDuration = Date.now() - clickStartTime;

            // 如果不是拖拽且点击时间短，则视为点击
            if (!isDragging && clickDuration < 300) {
                // 检查点击是否在设置按钮上
                const $target = $(e.target);
                if (!$target.hasClass('vtp-settings-btn') && !$target.closest('.vtp-settings-panel').length) {
                    // 不再在面板点击时切换可见性，而是仅用悬浮按钮控制
                    // VideoHelper.togglePanelVisibility();
                }
            }

            clickStartTime = 0;
            isDragging = false;
            $panel.css('transition', 'opacity 0.2s');
        });

        // 添加设置按钮
        const $settingsBtn = $('<div class="vtp-settings-btn">⚙</div>').css({
            position: 'absolute',
            top: '2px',
            right: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            opacity: '0.6',
            transition: 'opacity 0.2s'
        }).hover(
            function(){ $(this).css('opacity', 1); },
            function(){ $(this).css('opacity', 0.6); }
        ).click(function(e) {
            e.stopPropagation(); // 阻止事件冒泡，避免触发面板点击事件
            toggleSettings(e);
        });

        // 设置面板
        const $settingsPanel = $(`
            <div class="vtp-settings-panel">
                <label><input type="checkbox" id="autoNext"> 自动下一集</label>
            </div>
        `).css({
            display: 'none',
            position: 'absolute',
            top: '30px',
            right: '0',
            background: 'rgba(0,0,0,0.8)',
            padding: '10px',
            borderRadius: '8px',
            minWidth: '140px',
            zIndex: 100000
        }).click(function(e) {
            e.stopPropagation(); // 阻止事件冒泡，避免触发面板点击事件
        });

        $panel.append($settingsBtn, $settingsPanel);

        // 初始化开关状态
        $settingsPanel.find('#autoNext').prop('checked', VideoHelper.settings.autoNext);

        // 绑定事件
        $settingsPanel.find('input').on('change', function() {
            VideoHelper.settings[this.id] = this.checked;
            VideoHelper.saveSettings();
        });

        $('<style>').text(`
            #video-time-panel .vtp-bar-bg {
                width: 100%;
                height: 6px;
                background: rgba(255,255,255,0.15);
                border-radius: 3px;
                margin-bottom: 4px;
                overflow: hidden;
            }
            #video-time-panel .vtp-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #ff2d55 0%, #ffd700 100%);
                border-radius: 3px;
                transition: width 0.3s;
            }
            #video-time-panel .vtp-time {
                text-align: right;
                font-size: 13px;
                letter-spacing: 1px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .vtp-settings-panel label {
                display: block;
                color: #fff;
                margin: 6px 0;
                font-size: 13px;
            }
            .vtp-settings-panel input {
                margin-right: 8px;
            }
            .vtp-hidden {
                transform: translateY(150%);
                opacity: 0 !important;
            }
            #video-time-panel.vtp-hidden:hover {
                opacity: 0 !important;
            }
            #video-panel-toggle-btn {
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                transform-origin: center center;
            }
            #video-panel-toggle-btn:active {
                transform: scale(0.95);
            }
            @media (max-width: 768px) {
                #video-time-panel {
                    right: 8px!important;
                    bottom: 8px!important;
                    font-size: 12px!important;
                }
                #video-panel-toggle-btn {
                    right: 8px!important;
                    bottom: 50px!important;
                }
            }
        `).appendTo('head');

        return $panel;
    }

    function formatTime(sec) {
        if (isNaN(sec)) return '--:--';
        return dayjs.duration(sec, 'seconds').format('mm:ss');
    }

    function findNextEpisodeBtn() {
        let nextBtn = null;
        const host = window.location.hostname;
        let debugInfo = ''; // 用于记录按钮查找过程的信息

        // 检查是否有网站特定选择器
        const siteSelector = Object.keys(nextEpisodeSelectors.siteSpecificSelectors).find(
            site => host.includes(site)
        );

        if (siteSelector) {
            nextBtn = findElement(nextEpisodeSelectors.siteSpecificSelectors[siteSelector]);
            if (nextBtn && nextBtn.length) {
                debugInfo = `特定网站选择器: ${siteSelector}`;
                return nextBtn;
            }
        }

        // 检查文本选择器
        for (const selector of nextEpisodeSelectors.textSelectors) {
            nextBtn = findElement(selector);
            if (nextBtn && nextBtn.length) {
                debugInfo = `文本选择器: ${selector}`;
                return nextBtn;
            }
        }

        // 检查图标选择器
        for (const selector of nextEpisodeSelectors.iconSelectors) {
            nextBtn = findElement(selector);
            if (nextBtn && nextBtn.length) {
                debugInfo = `图标选择器: ${selector}`;
                return nextBtn;
            }
        }

        // 在常见区域内查找可能的下一集按钮
        for (const regionSelector of nextEpisodeSelectors.regionSelectors) {
            const region = $(regionSelector);
            if (region.length) {
                // 在区域内查找链接
                const links = region.find('a');
                const nextLink = links.filter(function() {
                    const text = $(this).text().toLowerCase();
                    const href = $(this).attr('href') || '';

                    // 检查文本是否包含"下一集"相关词汇
                    if (/下一|下集|next|forward/i.test(text)) return true;

                    // 检查链接是否包含视频序号相关的模式
                    if (/\/vod(play|detail)\/\d+-\d+-\d+/.test(href)) return true;

                    // 检查是否包含常见图标类
                    if ($(this).find('.fa-forward,.fa-caret-right,.fa-arrow-right').length) return true;

                    return false;
                });

                if (nextLink.length) {
                    debugInfo = `区域分析: ${regionSelector}`;
                    return nextLink.first();
                }
            }
        }

        // 启发式查找：寻找URL中有序列号且文本相似的链接
        try {
            const currentUrl = window.location.href;
            const match = currentUrl.match(/(\d+)(-|_)(\d+)(-|_)(\d+)/);
            if (match) {
                const currentNum = parseInt(match[5]);
                const nextNum = currentNum + 1;
                const pattern = match[0].replace(match[5], nextNum);

                // 寻找URL模式匹配的链接
                const possibleNextLinks = $('a').filter(function() {
                    const href = $(this).attr('href') || '';
                    return href.includes(pattern);
                });

                if (possibleNextLinks.length) {
                    debugInfo = `URL模式匹配: ${pattern}`;
                    return possibleNextLinks.first();
                }
            }
        } catch (e) {
            console.debug('URL模式匹配失败:', e);
        }

        // 使用传统定位逻辑作为后备
        nextBtn = findElement('.myui-player__operate a:has(.fa-caret-down), .myui-player__operate a:contains("下集")');
        if (nextBtn && nextBtn.length) {
            debugInfo = '传统定位逻辑';
            return nextBtn;
        }

        return null;
    }

    function findElement(selectors, frames = true) {
        // 主文档查找
        let result = $(selectors);

        // 如果找到多个，返回第一个
        if (result.length > 1) {
            // 默认使用第一个，不需要记录
            result = result.first();
        }

        // 如果主文档没找到且允许在iframe中查找
        if (result.length === 0 && frames) {
            result = checkFrames(selectors);
        }

        // 如果找到按钮，高亮显示它
        if (result && result.length) {
            highlightButton(result);
        }

        return result;
    }

    function highlightButton(btn) {
        btn.css({
                outline: '3px solid #00ff00',
                background: 'rgba(0,255,0,0.15)',
                transition: 'all 0.3s',
                transform: 'scale(1.05)',
                'box-shadow': '0 2px 8px rgba(0,255,0,0.3)'
            });

        // 2秒后取消高亮
        setTimeout(() => {
            btn.css({
                outline: '',
                background: '',
                transition: '',
                transform: '',
                'box-shadow': ''
            });
        }, 2000);
    }

    function checkFrames(selectors) {
        let result = null;
            $('iframe').each(function() {
                try {
                // 提前检测跨域iframe
                if (!isSameOrigin(this.src)) {
                    return; // 跳过跨域iframe
                }

                const iframeDoc = this.contentDocument;
                const $iframeBody = $(iframeDoc.body);
                const $btn = $iframeBody.find(selectors);
                if ($btn.length) {
                    result = $btn[0];
                    return false;
                    }
                } catch (e) {
                if (e.name === 'SecurityError') {
                    console.debug('安全策略限制的iframe:', this.src);
                }
                }
            });
        if (result) return $(result);
        return null;
            }

    function isSameOrigin(url) {
        try {
            if (!url || url.startsWith('about:') || url.startsWith('javascript:')) {
                 return false;
                        }
            const iframeOrigin = new URL(url, location.href).origin;
            return iframeOrigin === location.origin;
        } catch (e) {
            console.debug("Error in isSameOrigin with URL:", url, e);
            return false;
        }
    }

    function toggleSettings(e) {
        e.stopPropagation();
        if (VideoHelper.panel) {
            VideoHelper.panel.find('.vtp-settings-panel').toggle();
        }
    }

    // 初始化
    $(document).ready(() => VideoHelper.init());
})();