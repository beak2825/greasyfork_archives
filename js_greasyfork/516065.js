// ==UserScript==
// @name         YouTube AdBlocker Enhanced ｜YouTube 广告拦截增强版
// @name:vi      Trình chặn quảng cáo YouTube nâng cao
// @name:zh-CN   增强版 YouTube 广告拦截器
// @name:zh-TW   增強版 YouTube 廣告攔截器
// @name:ja      強化版 YouTube 広告ブロッカー
// @name:ko      고급 YouTube 광고 차단기
// @name:es      Bloqueador de anuncios mejorado para YouTube
// @name:ru      Улучшенный блокировщик рекламы для YouTube
// @name:id      Pemblokir Iklan YouTube yang Ditingkatkan
// @name:hi      उन्नत YouTube विज्ञापन अवरोधक
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  结合多个脚本优势的 YouTube 广告拦截器,支持移动端/PC端,支持视频广告/界面广告,性能优化
// @description:vi     Trình chặn quảng cáo YouTube nâng cao kết hợp nhiều ưu điểm của script, hỗ trợ di động/PC, quảng cáo video/giao diện, tối ưu hiệu suất
// @description:zh-CN  结合多个脚本优势的 YouTube 广告拦截器,支持移动端/PC端,支持视频广告/界面广告,性能优化
// @description:zh-TW  結合多個腳本優勢的 YouTube 廣告攔截器,支持移動端/PC端,支持視頻廣告/界面廣告,性能優化
// @description:ja     複数のスクリプトの利点を組み合わせた YouTube 広告ブロッカー、モバイル/PC対応、動画/インターフェース広告対応、パフォーマンス最適化
// @description:ko     여러 스크립트의 장점을 결합한 YouTube 광고 차단기, 모바일/PC 지원, 동영상/인터페이스 광고 지원, 성능 최적화
// @description:es     Bloqueador de anuncios de YouTube mejorado que combina ventajas de múltiples scripts, compatible con móvil/PC, anuncios de video/interfaz, rendimiento optimizado
// @description:ru     Улучшенный блокировщик рекламы YouTube, сочетающий преимущества нескольких скриптов, поддержка мобильных/ПК, видео/интерфейсной рекламы, оптимизированная производительность
// @description:id     Pemblokir iklan YouTube yang ditingkatkan menggabungkan keunggulan beberapa skrip, mendukung seluler/PC, iklan video/antarmuka, kinerja dioptimalkan
// @description:hi     कई स्क्रिप्ट लाभों को जोड़ने वाला उन्नत YouTube विज्ञापन अवरोधक, मोबाइल/पीसी का समर्थन करता है, वीडियो/इंटरफ़ेस विज्ञापन, प्रदर्शन अनुकूलित
// @author       Your name
// @match        *://*.youtube.com/*
// @match        https://music.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516065/YouTube%20AdBlocker%20Enhanced%20%EF%BD%9CYouTube%20%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/516065/YouTube%20AdBlocker%20Enhanced%20%EF%BD%9CYouTube%20%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================ 配置项 / Configuration ================
    const config = {
        // 是否允许在无法跳过广告时刷新页面
        // Whether to allow page refresh when ads cannot be skipped
        allowReload: GM_getValue('allowReload', true),
        
        // 是否在用户忙碌时(如正在输入评论)避免刷新页面
        // Whether to avoid refreshing when user is busy (e.g. typing comments)
        dontReloadWhileBusy: GM_getValue('dontReloadWhileBusy', true),
        
        // 开发模式(打印日志)
        // Development mode (print logs)
        debug: false,
        
        // 广告检测间隔(毫秒)
        // Ad detection interval (milliseconds)
        checkInterval: 500
    };

    // ================ 广告选择器 / Ad Selectors ================
    // 包含了两个脚本的所有广告选择器并去重
    const adSelectors = [
        // 视频页广告 / Video page ads
        '.video-ads.ytp-ad-module',
        '.ytp-ad-overlay-container',
        'ytd-ad-slot-renderer',
        
        // 首页广告 / Homepage ads
        '#masthead-ad',
        'ytd-rich-item-renderer:has(.ytd-ad-slot-renderer)',
        'ytd-rich-section-renderer:has(.ytd-statement-banner-renderer)',
        
        // 会员推广 / Premium promotions
        'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)',
        'ytd-popup-container:has(a[href="/premium"])',
        'yt-mealbar-promo-renderer',
        
        // 播放页右侧广告 / Right sidebar ads
        '#related #player-ads',
        '#related ytd-ad-slot-renderer',
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
        
        // 移动端广告 / Mobile ads
        'ytm-companion-ad-renderer',
        'ad-slot-renderer'
    ];

    // ================ 工具函数 / Utility Functions ================
    
    /**
     * 日志输出 / Log output
     * @param {string} msg 日志信息 / Log message
     */
    function log(msg) {
        if(config.debug) {
            console.log(`[YouTube AdBlock] ${new Date().toISOString()} ${msg}`);
        }
    }

    /**
     * 检查是否可以刷新页面 / Check if page can be reloaded
     */
    function canReloadPage() {
        if(!config.allowReload) return false;
        if(!config.dontReloadWhileBusy) return true;
        
        // 检查用户是否在输入
        if(document.activeElement?.matches('input,textarea,select')) return false;
        
        // 检查是否在看评论
        if(document.documentElement.scrollTop > 200) return false;
        
        return true;
    }

    // ================ 广告处理函数 / Ad Handling Functions ================
    
    /**
     * 处理视频广告 / Handle video ads
     */
    function handleVideoAd() {
        // 跳过 YouTube Shorts / Skip YouTube Shorts
        if(location.pathname.startsWith('/shorts/')) return;
        
        const player = document.querySelector('#movie_player');
        const video = player?.querySelector('video.html5-main-video');
        
        if(!player || !video) return;
        
        // 检测广告状态
        const hasAd = player.classList.contains('ad-showing');
        
        if(hasAd) {
            // 1. 尝试点击跳过按钮
            const skipButton = document.querySelector(`
                .ytp-ad-skip-button,
                .ytp-ad-skip-button-modern,
                .ytp-skip-ad-button
            `);
            
            if(skipButton) {
                skipButton.click();
                // 移动端触摸事件
                simulateTouch(skipButton);
                log('点击跳过广告按钮');
                return;
            }
            
            // 2. 强制跳过广告
            video.currentTime = video.duration || 9999;
            log('强制跳过广告');
            
            // 3. 处理静音
            if(!location.hostname.includes('m.youtube.com')) {
                video.muted = true;
            }
        }
    }

    /**
     * 移除广告拦截器警告 / Remove ad blocker warning
     */
    function removeAdBlockerWarning() {
        // 移除弹窗警告 / Remove popup warning
        const warning = document.querySelector('tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)');
        if(warning) {
            warning.remove();
            log('移除广告拦截器警告弹窗 / Removed ad blocker warning popup');
        }

        // 处理视频播放器内的警告 / Handle warning inside video player
        const innerWarning = document.querySelector('.yt-playability-error-supported-renderers:has(.ytd-enforcement-message-view-model)');
        if(innerWarning && canReloadPage()) {
            innerWarning.remove();
            location.reload();
            log('检测到播放器内警告,刷新页面 / Detected player warning, refreshing page');
        }
    }

    /**
     * 模拟触摸事件(移动端支持)
     */
    function simulateTouch(element) {
        const touch = new Touch({
            identifier: Date.now(),
            target: element,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        element.dispatchEvent(new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        }));

        element.dispatchEvent(new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        }));
    }

    // ================ 初始化函数 / Initialization Functions ================
    
    /**
     * 注入CSS样式 / Inject CSS styles
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `${adSelectors.join(',')}{display:none!important}`;
        document.head.appendChild(style);
        log('注入广告屏蔽CSS / Injected ad blocking CSS');
    }

    /**
     * 注册菜单命令 / Register menu commands
     */
    function registerMenus() {
        GM_registerMenuCommand(`允许刷新页面: ${config.allowReload ? '是' : '否'}`, () => {
            config.allowReload = !config.allowReload;
            GM_setValue('allowReload', config.allowReload);
        });

        GM_registerMenuCommand(`忙碌时避免刷新: ${config.dontReloadWhileBusy ? '是' : '否'}`, () => {
            config.dontReloadWhileBusy = !config.dontReloadWhileBusy;
            GM_setValue('dontReloadWhileBusy', config.dontReloadWhileBusy);
        });
    }

    /**
     * 初始化观察器 / Initialize observer
     */
    function initObserver() {
        if(window.MutationObserver) {
            const observer = new MutationObserver(() => {
                handleVideoAd();
                removeAdBlockerWarning();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'src']
            });
            log('启动DOM观察器 / Started DOM observer');
        } else {
            // 降级方案 / Fallback solution
            setInterval(() => {
                handleVideoAd();
                removeAdBlockerWarning();
            }, config.checkInterval);
            log('启动定时检查 / Started interval check');
        }
    }

    // ================ 启动脚本 / Start Script ================
    function main() {
        injectStyles();
        registerMenus();
        initObserver();
        log('YouTube广告拦截器启动完成 / YouTube ad blocker started');
    }

    // 等待页面加载完成后执行
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();