// ==UserScript==
// @name        Bilibili 播放器终极优化 (720P+AVC1强制)
// @namespace   http://tampermonkey.net/
// @version     2.5.1
// @description 精准控制画质与编码，突破B站播放限制
// @match       *://www.bilibili.com/video/*
// @match       *://player.bilibili.com/player.html*
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/534211/Bilibili%20%E6%92%AD%E6%94%BE%E5%99%A8%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%20%28720P%2BAVC1%E5%BC%BA%E5%88%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534211/Bilibili%20%E6%92%AD%E6%94%BE%E5%99%A8%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%20%28720P%2BAVC1%E5%BC%BA%E5%88%B6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const BVID_REGEX = /(BV[\w]{10})/i;
    const ENHANCE_CONFIG = {
        TARGET_QN: 80,       // 720P
        FALLBACK_QN: 64,      // 480P
        CODEC_PRIORITY: 'avc1', 
        PLAYER_PARAMS: {
            platform: 'html5',
            high_quality: 1,
            prefer_codec: 'avc'  // 新增官方编码选择参数
        }
    };

    // ================= 主站跳转逻辑 =================
    const enhanceRedirect = () => {
        const url = new URL(location.href);
        const getMediaId = () => {
            const pathMatch = location.pathname.match(BVID_REGEX);
            return url.searchParams.get('bvid') || (pathMatch && pathMatch[1]);
        };

        const bvid = getMediaId();
        if (!bvid) return;

        const embedURL = new URL('https://player.bilibili.com/player.html');
        embedURL.searchParams.set('bvid', bvid);
        embedURL.searchParams.set('cid', url.searchParams.get('cid') || '');
        embedURL.searchParams.set('page', url.searchParams.get('p') || '1');

        // 注入强化参数
        Object.entries(ENHANCE_CONFIG.PLAYER_PARAMS).forEach(([k, v]) => {
            embedURL.searchParams.set(k, v);
        });
        embedURL.searchParams.set('qn', ENHANCE_CONFIG.TARGET_QN);

        window.stop();
        window.location.replace(embedURL.href);
    };

    // ================= 播放器控制逻辑 =================
    const initPlayerControl = () => {
        const { unsafeWindow: uw } = window;
        let qualityLocked = false;

        // 流媒体请求拦截
        const hijackVideoSource = (player) => {
            const originalPlay = player.play;
            player.play = function(...args) {
                const mediaInfo = player._options?.videoInfo;
                if (mediaInfo && !qualityLocked) {
                    const targetQuality = mediaInfo.support_formats
                        .find(q => q.quality === ENHANCE_CONFIG.TARGET_QN);
                    
                    if (targetQuality) {
                        player._options.quality = ENHANCE_CONFIG.TARGET_QN;
                        player._options.currentQuality = ENHANCE_CONFIG.TARGET_QN;
                        qualityLocked = true;
                    }
                }
                return originalPlay.apply(this, args);
            };
        };

        // 编码优先级控制
        const enforceCodecPriority = () => {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (video.canPlayType('video/mp4; codecs="avc1.64001F"')) {
                    const sources = Array.from(video.querySelectorAll('source'));
                    const avcSource = sources.find(s => 
                        s.type.includes('avc') || s.src.includes(ENHANCE_CONFIG.CODEC_PRIORITY)
                    );
                    if (avcSource && video.src !== avcSource.src) {
                        video.src = avcSource.src;
                        video.load();
                    }
                }
            });
        };

        // 播放器实例捕获
        const waitForPlayer = () => {
            if (uw.player && uw.player._options) {
                hijackVideoSource(uw.player);
                uw.player.on('loadedmetadata', enforceCodecPriority);
                uw.player.on('qualitychange', (qn) => {
                    if (qn !== ENHANCE_CONFIG.TARGET_QN) {
                        uw.player.setQuality(ENHANCE_CONFIG.TARGET_QN);
                    }
                });
            } else {
                setTimeout(waitForPlayer, 100);
            }
        };

        // 启动监听
        new MutationObserver(enforceCodecPriority).observe(document, {
            subtree: true,
            childList: true
        });
        waitForPlayer();
        setInterval(enforceCodecPriority, 3000);
    };

    // ================= 执行控制 =================
    if (location.hostname === 'www.bilibili.com') {
        enhanceRedirect();
    } else if (location.hostname === 'player.bilibili.com') {
        document.addEventListener('DOMContentLoaded', initPlayerControl);
    }
})();