// ==UserScript==
// @name         Bilibili 美化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  美化Bilibili视频播放页
// @author       Rei
// @match        https://www.bilibili.com/video/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543759/Bilibili%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/543759/Bilibili%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            background-attachment: fixed !important;
            min-height: 100vh !important;
        }

        #viewbox_report,
        .video-info-container,
        .left-container,
        .right-container {
            background: rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2) !important;
        }

        .video-title,
        h1.video-title,
        .video-title .tit {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-weight: 700 !important;
            font-size: 24px !important;
            line-height: 1.3 !important;
            color: #1d1d1f !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            margin-bottom: 16px !important;
            letter-spacing: -0.02em !important;
            background: linear-gradient(120deg, #1d1d1f, #4a4a4a) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
        }

        .left-container,
        .right-container {
            margin-bottom: 30px !important;
        }

        .video-info-detail {
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 16px !important;
            padding: 20px !important;
            margin-top: 20px !important;
        }

        .video-toolbar .coin,
        .video-toolbar .share,
        .video-toolbar .like {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
        }

        .video-toolbar .coin:hover,
        .video-toolbar .share:hover,
        .video-toolbar .like:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-2px) !important;
        }

        #danmukuBox {
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .tag, .desc-info-text a {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(5px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
        }

        .tag:hover, .desc-info-text a:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-1px) !important;
        }

        @keyframes liquid-glass {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .video-title {
            animation: liquid-glass 6s ease-in-out infinite !important;
            background-size: 200% 200% !important;
        }

        @media (max-width: 768px) {
            #viewbox_report,
            .video-info-container,
            .left-container,
            .right-container {
                border-radius: 16px !important;
                margin: 10px !important;
            }

            .video-title {
                font-size: 20px !important;
            }
        }
    `);

    function optimizePage() {
        const titleObserver = new MutationObserver(function() {
            const title = document.querySelector('.video-title, h1.video-title, .video-title .tit');
            if (title && !title.classList.contains('optimized')) {
                title.classList.add('optimized');
            }
        });

        titleObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        const leftContainer = document.querySelector('.left-container');
        const rightContainer = document.querySelector('.right-container');

        if (leftContainer) {
            leftContainer.style.padding = '20px';
        }
        if (rightContainer) {
            rightContainer.style.padding = '20px';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizePage);
    } else {
        optimizePage();
    }

})();
