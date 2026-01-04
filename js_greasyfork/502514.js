// ==UserScript==
// @name         YouTube Ultra Optimizer Pro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aggressively optimize YouTube for slow connections and weak PCs, bypass restrictions
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @author       https://t.me/aisingers
// @source       https://t.me/aisingers
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502514/YouTube%20Ultra%20Optimizer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/502514/YouTube%20Ultra%20Optimizer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для перехвата и модификации запросов
    function interceptRequests() {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0];
            if (typeof url === 'string') {
                if (url.includes('videoplayback') || url.includes('youtubei/v1/player')) {
                    args[0] = url + (url.includes('?') ? '&' : '?') + 'nocache=' + Math.random() + '&ultraoptimizer=1';
                    if (!args[1]) args[1] = {};
                    if (!args[1].headers) args[1].headers = {};
                    args[1].headers['X-Forwarded-For'] = '8.8.8.8';
                    args[1].headers.Origin = 'https://www.youtube.com';
                    args[1].headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
                }
                if (url.includes('yt3.ggpht.com')) {
                    args[0] = url.replace('yt3.ggpht.com', 'i.ytimg.com');
                }
            }
            return originalFetch.apply(this, args);
        };

        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function(...args) {
                const url = args[1];
                if (typeof url === 'string' && (url.includes('videoplayback') || url.includes('youtubei/v1/player'))) {
                    args[1] = url + (url.includes('?') ? '&' : '?') + 'nocache=' + Math.random() + '&ultraoptimizer=1';
                }
                return originalOpen.apply(xhr, args);
            };
            return xhr;
        };
    }

    // Функция для оптимизации плеера
    function optimizePlayer() {
        const script = document.createElement('script');
        script.textContent = `
            if (window.ytplayer && window.ytplayer.config) {
                Object.assign(window.ytplayer.config.args, {
                    adaptive_fmts: '',
                    progressive: '1',
                    dash: '0',
                    live_chunk_readahead: '3',
                    disable_html5_preload: 'false',
                    html5_prefer_low_quality: 'false',
                    el: 'embedded',
                    autoplay: '0',
                    delay_load_comments: '1',
                    vss_host: 'www.youtube.com',
                    force_speedsub_tlae: '',
                    force_adbreak_through_yt: 'true'
                });
            }
        `;
        document.head.appendChild(script);
    }

    // Функция для оптимизации перемотки
    function optimizeSeeking() {
        document.addEventListener('seeking', function(e) {
            if (e.target.tagName === 'VIDEO') {
                const currentQuality = e.target.getPlaybackQuality();
                e.target.setPlaybackQuality('tiny');
                e.target.playbackRate = 0.25;
                setTimeout(() => {
                    e.target.setPlaybackQuality(currentQuality);
                    e.target.playbackRate = 1;
                }, 3000);
            }
        }, true);
    }

    // Функция для оптимизации загрузки комментариев
    function optimizeComments() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.tagName === 'YTD-COMMENT-THREAD-RENDERER') {
                            node.style.opacity = '0.8';
                            node.style.transition = 'opacity 0.3s ease';
                            node.addEventListener('mouseover', () => node.style.opacity = '1');
                            node.addEventListener('mouseout', () => node.style.opacity = '0.8');
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Функция для добавления индикатора работы скрипта
    function addScriptIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'script-indicator';
        indicator.textContent = 'Ultra Optimizer Pro v1.0';
        indicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: green;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            z-index: 9999;
            opacity: 0.7;
            font-size: 12px;
        `;
        document.body.appendChild(indicator);
    }

    // Основная функция
    function main() {
        interceptRequests();
        optimizePlayer();
        optimizeSeeking();
        optimizeComments();
        addScriptIndicator();
    }

    // Запуск скрипта при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // Добавление стилей для оптимизации
    GM_addStyle(`
        body {
            font-family: Arial, sans-serif !important;
        }
        ytd-watch-flexy[flexy][is-two-columns_] #secondary.ytd-watch-flexy {
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        ytd-watch-flexy[flexy][is-two-columns_] #secondary.ytd-watch-flexy:hover {
            opacity: 1;
        }
        .ytp-chrome-top, .ytp-chrome-bottom {
            opacity: 0.5 !important;
            transition: opacity 0.3s ease;
        }
        .ytp-chrome-top:hover, .ytp-chrome-bottom:hover {
            opacity: 1 !important;
        }
        .ytp-gradient-top, .ytp-gradient-bottom {
            display: none !important;
        }
        * {
            transition: none !important;
            animation: none !important;
        }
        #masthead-container {
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        #masthead-container:hover {
            opacity: 1;
        }
        .ytd-thumbnail {
            filter: grayscale(30%);
            transition: filter 0.3s ease;
        }
.ytd-thumbnail:hover {
            filter: grayscale(0%);
        }
        ytd-video-renderer, ytd-compact-video-renderer {
            margin-bottom: 10px !important;
        }
        #content.ytd-app {
            margin-top: 56px !important;
        }
        .html5-video-player {
            max-width: 100% !important;
        }
        .ytp-spinner {
            display: none !important;
        }
        ytd-watch-flexy[flexy][is-two-columns_] #primary.ytd-watch-flexy {
            max-width: 100% !important;
        }
        ytd-watch-flexy[flexy][is-two-columns_] #secondary.ytd-watch-flexy {
            padding-left: 10px !important;
        }
        yt-img-shadow {
            background-color: transparent !important;
        }
    `);

    // Дополнительная функция для оптимизации загрузки видео
    function optimizeVideoLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target.querySelector('video');
                    if (video) {
                        video.play().catch(() => {});
                    }
                } else {
                    const video = entry.target.querySelector('video');
                    if (video) {
                        video.pause();
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('ytd-player').forEach(player => {
            observer.observe(player);
        });
    }

    // Добавляем новую функцию в основную функцию
    function main() {
        interceptRequests();
        optimizePlayer();
        optimizeSeeking();
        optimizeComments();
        optimizeVideoLoading();
        addScriptIndicator();
    }

    // Функция для обхода ограничений скорости
    function bypassSpeedLimits() {
        const originalGetVideoPlaybackQuality = HTMLVideoElement.prototype.getVideoPlaybackQuality;
        HTMLVideoElement.prototype.getVideoPlaybackQuality = function() {
            const result = originalGetVideoPlaybackQuality.call(this);
            result.totalVideoFrames *= 0.75;
            result.droppedVideoFrames = 0;
            return result;
        };
    }

// Обновляем существующую функцию main
main = function() {
    interceptRequests();
    optimizePlayer();
    optimizeSeeking();
    optimizeComments();
    optimizeVideoLoading();
    bypassSpeedLimits();
    addScriptIndicator();
};

})();