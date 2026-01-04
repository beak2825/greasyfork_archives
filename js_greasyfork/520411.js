// ==UserScript==
// @name         全网VIP视频解析在线原网页观看
// @namespace   wntcy
// @version      2.7.9
// @description  优酷 爱奇艺 腾讯 芒果 AB站等全网VIP视频免费解析
// @author       w
// @license      MIT
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://v.youku.com/v_*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/adv*
// @include      *://*.le.com/ptv/vplay/*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.tudou.com/v*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/v/*
// @include      *://*.acfun.cn/v/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.pptv.com/show/*
// @include      *://*.baofeng.com/play/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520411/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%9C%A8%E7%BA%BF%E5%8E%9F%E7%BD%91%E9%A1%B5%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520411/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%9C%A8%E7%BA%BF%E5%8E%9F%E7%BD%91%E9%A1%B5%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .vip-button {
            position: fixed;
            top: 120px;
            left: 10px;
            z-index: 2147483647;
            background: #FF4D4F;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        .vip-button:hover {
            background: #FF7875;
            transform: scale(1.05);
        }

        .restore-button {
            position: absolute;
            top: 10px;
            right: 50px;
            z-index: 2147483647;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        .restore-button:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: scale(1.05);
        }

        .player-iframe {
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2147483646;
        }

        /* 屏蔽广告弹窗，但保护视频播放器 */
        div[style*="position: fixed"]:not(.player-container),
        div[style*="position:fixed"]:not(.player-container),
        div[style*="z-index"]:not(.player-container):not(.player-iframe),
        a[href*="visitor.html"],
        a[href*="evewan.com"],
        a[target="_blank"]:not(.player-container *),
        img[src*=".gif"]:not(.player-container *),
        div > a[target="_blank"] > img,
        iframe:not(.player-iframe) {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            max-width: 0 !important;
            max-height: 0 !important;
            position: absolute !important;
            left: -99999px !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }

        /* 确保播放器正常显示 */
        .player-container,
        .player-iframe {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 2147483646 !important;
            pointer-events: auto !important;
        }

        /* 专门针对广告元素的样式 */
        #hmhrefurl,
        #hmhrefurl * {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -99999px !important;
            z-index: -9999 !important;
            width: 0 !important;
            height: 0 !important;
        }
    `);

    // 获取视频网站播放器信息
    const playerConfig = {
        'iqiyi.com': {
            container: '#flashbox',
            containers: ['#flashbox', '#playerbox', '#iframePlayer', '#video', '.iqp-player', '#player'],
            width: '100%',
            height: '100%'
        },
        'v.qq.com': {
            container: '#player-container',
            containers: ['#tenvideo_player', '#player-container'],
            width: '100%',
            height: '100%'
        },
        'youku.com': {
            container: '#player',
            containers: ['#ykPlayer', '#player'],
            width: '100%',
            height: '100%'
        },
        'mgtv.com': {
            container: '#mgtv-player-wrap',
            containers: ['#mgtv-player-wrap', '#player-container'],
            width: '100%',
            height: '100%'
        },
        'bilibili.com': {
            container: '#player_module',
            containers: ['#player_module', '#bilibili-player'],
            width: '100%',
            height: '100%'
        },
        'sohu.com': {
            container: '#player',
            containers: ['#player', '#16x9Container'],
            width: '100%',
            height: '100%'
        },
        'le.com': {
            container: '#le_playbox',
            containers: ['#le_playbox', '#player'],
            width: '100%',
            height: '100%'
        },
        'pptv.com': {
            container: '#pptv_playpage_box',
            containers: ['#pptv_playpage_box', '#player-container'],
            width: '100%',
            height: '100%'
        },
        'acfun.cn': {
            container: '#player',
            containers: ['#player', '#container'],
            width: '100%',
            height: '100%'
        }
    };

    // 获取当前网站的播放器配置
    function getPlayerConfig() {
        const hostname = window.location.hostname;
        for (let site in playerConfig) {
            if (hostname.includes(site)) {
                return playerConfig[site];
            }
        }
        return null;
    }

    // 获取播放器容器
    function getPlayerContainer() {
        const config = getPlayerConfig();
        if (!config) return null;

        // 首先尝试使用配置的选择器
        for (let container of config.containers) {
            const element = document.querySelector(container);
            if (element) {
                return element;
            }
        }

        // 如果是爱奇艺，添加额外的查找逻辑
        if (window.location.hostname.includes('iqiyi.com')) {
            // 查找包含特定类名的播放器容器
            const containers = [
                document.querySelector('.iqp-player'),
                document.querySelector('[class*="player"]'), // 查找类名包含player的元素
                document.querySelector('[id*="player"]'),    // 查找id包含player的元素
                document.querySelector('video'),             // 直接查找video标签
            ];

            for (let container of containers) {
                if (container) {
                    return container;
                }
            }
        }

        return null;
    }

    // 创建视频播放器
    function createVideoPlayer() {
        const container = getPlayerContainer();
        if (!container) {
            alert('未找到播放器容器');
            return;
        }

        const config = getPlayerConfig();
        if (!config) return;

        // 保存原始内容和样式
        window.originalContent = container.innerHTML;
        window.originalStyle = {
            position: container.style.position,
            width: container.style.width,
            height: container.style.height
        };

        // 设置容器样式
        container.style.position = 'relative';
        container.style.width = config.width;
        container.style.height = config.height;
        container.classList.add('player-container');

        // 创建iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'player-iframe';
        iframe.allowFullscreen = true;
        iframe.sandbox = 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';

        // 设置解析接口URL
        const videoUrl = 'https://jx.xmflv.com/?url=' + encodeURIComponent(window.location.href);
        iframe.src = videoUrl;

        // 清空容器并添加新元素
        container.innerHTML = '';
        container.appendChild(iframe);

        // 添加广告删除功能
        function removeAd() {
            const adElement = document.querySelector("#hmhrefurl");
            if (adElement) {
                // 先禁用广告元素
                adElement.style.cssText = `
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                    position: absolute !important;
                    left: -99999px !important;
                    z-index: -9999 !important;
                    width: 0 !important;
                    height: 0 !important;
                `;
                // 然后移除
                setTimeout(() => adElement.remove(), 100);
            }
        }

        // 更频繁地检查广告
        const adCheckInterval = setInterval(removeAd, 500);

        // 在iframe加载完成和视频播放状态变化时检查广告
        iframe.addEventListener('load', removeAd);
        document.addEventListener('play', removeAd, true);
        document.addEventListener('pause', removeAd, true);

        return iframe;
    }

    // 添加恢复原视频的函数
    function restoreOriginalVideo() {
        const container = getPlayerContainer();
        if (!container) return;

        // 恢复原始内容和样式
        if (window.originalContent) {
            container.innerHTML = window.originalContent;
        }
        if (window.originalStyle) {
            Object.assign(container.style, window.originalStyle);
        }
        container.classList.remove('player-container');
    }

    // 创建解析按钮
    function createButtons() {
        // 创建VIP解析按钮
        const vipButton = document.createElement('button');
        vipButton.className = 'vip-button';
        vipButton.innerHTML = 'VIP视频解析';
        document.body.appendChild(vipButton);

        // 创建恢复原视频按钮（初始隐藏）
        const restoreButton = document.createElement('button');
        restoreButton.className = 'restore-button';
        restoreButton.innerHTML = '恢复原视频';
        restoreButton.style.display = 'none';

        // VIP解析按钮点击事件
        vipButton.onclick = function() {
            const iframe = createVideoPlayer();
            if (iframe) {
                // 隐藏VIP按钮
                vipButton.style.display = 'none';
                // 将恢复按钮添加到播放器容器中
                const container = getPlayerContainer();
                if (container) {
                    container.appendChild(restoreButton);
                    restoreButton.style.display = 'block';
                }
            }
        };

        // 恢复原视频按钮点击事件
        restoreButton.onclick = function() {
            restoreOriginalVideo();
            // 显示VIP按钮
            vipButton.style.display = 'block';
            // 移除恢复按钮
            restoreButton.remove();
        };
    }

    // 检查是否为视频网站
    function isVideoSite() {
        const hostname = window.location.hostname;
        return Object.keys(playerConfig).some(site => hostname.includes(site));
    }

    // 初始化
    function init() {
        if (isVideoSite()) {
            // 等待页面加载完成
            setTimeout(createButtons, 2000);
        }
    }

    // 启动脚本
    init();
})();