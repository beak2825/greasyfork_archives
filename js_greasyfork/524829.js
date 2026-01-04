// ==UserScript==
// @name         YouTube 干掉视频圆角
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  去除YouTube视频播放器和缩略图圆角样式（修复适配）
// @author       yy
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524829/YouTube%20%E5%B9%B2%E6%8E%89%E8%A7%86%E9%A2%91%E5%9C%86%E8%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/524829/YouTube%20%E5%B9%B2%E6%8E%89%E8%A7%86%E9%A2%91%E5%9C%86%E8%A7%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* 主视频播放器容器 */
        ytd-watch-flexy[rounded-player] #ytd-player.ytd-watch-flexy,
        ytd-watch-flexy[rounded-player-large] #ytd-player.ytd-watch-flexy,
        ytd-watch-flexy[rounded-player] #player-theater-container,
        ytd-watch-flexy[rounded-player-large] #player-theater-container {
            border-radius: 0px !important;
            overflow: hidden !important;
        }

        /* 视频内部 iframe 或 video 标签等（保险覆盖） */
        #player video,
        #player iframe {
            border-radius: 0px !important;
            overflow: hidden !important;
        }

        /* Shorts 播放器容器 */
        ytd-reel-video-renderer .player-container,
        ytd-reel-video-renderer .reel-player-container,
        ytd-reel-video-renderer video {
            border-radius: 0px !important;
            overflow: hidden !important;
        }

        /* 普通缩略图圆角去除 */
        ytd-thumbnail a.ytd-thumbnail,
        ytd-thumbnail::before,
        ytd-thumbnail img {
            border-radius: 0px !important;
        }

        /* Shorts 缩略图容器 */
        div[class*="ThumbnailContainerRounded"],
        .ShortsLockupViewModelHostThumbnailContainerRounded,
        ytd-reel-shelf-renderer ytd-thumbnail {
            border-radius: 0px !important;
            overflow: hidden !important;
        }


        /* 去除社区帖子的圆角 */
        ytd-post-renderer[rounded-container] {
            border-radius: 0px !important;
            overflow: hidden !important;
        }

        /* 迷你播放器卡片去圆角 */
        #card.ytd-miniplayer {
            border-radius: 0px !important;
            overflow: hidden !important;
        }

    `);
})();
