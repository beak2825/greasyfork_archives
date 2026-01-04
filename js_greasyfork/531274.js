// ==UserScript==
// @name         ExtTube
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces YouTube player with Invidious player and adds a "Watch on Invidious" button.
// @author       sypcerr
// @match        https://*.youtube.com/watch?*
// @icon         https://cdn-icons-png.flaticon.com/256/1384/1384060.png
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531274/ExtTube.user.js
// @updateURL https://update.greasyfork.org/scripts/531274/ExtTube.meta.js
// ==/UserScript==


const configs = ytcfg.d();
configs['WEB_PLAYER_CONTEXT_CONFIGS'] = {};
ytcfg.set(configs);

(function() {
    'use strict';

    const CONFIG = {
        PLAYER_SELECTOR: '#player-container[role="complementary"]',
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        DEFAULT_QUALITY: 'hd1080',
        IFRAME_STYLES: {
            width: '100%',
            height: '100%',
            borderRadius: '15px',
            border: 'none'
        }
    };

    function getVideoId() {
        try {
            const url = new URL(window.location.href);
            return url.searchParams.get('v');
        } catch (error) {
            return null;
        }
    }

    function createEnhancedIframe(videoId) {
        const iframe = document.createElement('iframe');
        const params = new URLSearchParams({
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            widget_referrer: window.location.href,
            hl: document.documentElement.lang || 'en',
            controls: 1,
            fs: 1,
            quality: CONFIG.DEFAULT_QUALITY
        });

        iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
        iframe.title = 'YouTube video player';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerpolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;

        Object.assign(iframe.style, CONFIG.IFRAME_STYLES);

        return iframe;
    }

    async function replacePlayer(attempts = CONFIG.RETRY_ATTEMPTS) {
        const videoId = getVideoId();
        if (!videoId) return;

        const findPlayerContainer = () => document.querySelector(CONFIG.PLAYER_SELECTOR);
        let playerContainer = findPlayerContainer();

        if (!playerContainer && attempts > 0) {
            console.log(`⏳ Retrying player replacement... (${attempts} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
            return replacePlayer(attempts - 1);
        }

        if (!playerContainer) {
            console.error('❌ Player container not found after all attempts');
            return;
        }

        try {
            while (playerContainer.firstChild) {
                playerContainer.firstChild.remove();
            }

            const iframe = createEnhancedIframe(videoId);
            playerContainer.appendChild(iframe);
            
            console.log('✅ Player replaced successfully');
        } catch (error) {
            console.error('❌ Error replacing player:', error);
        }
    }

    function stopMediaElements() {
        const mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach((media) => {
            media.pause();
            media.currentTime = 0;
            media.remove();
        });
    
        if (window.AudioContext || window.webkitAudioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const originalAudioContext = AudioContext.prototype;
    
            AudioContext.prototype.createBufferSource = function() {
                const source = originalAudioContext.createBufferSource.call(this);
                source.stop = function() {
                    console.log('🔇 Stopped Web Audio API source');
                    originalAudioContext.stop.call(this);
                };
                return source;
            };
    
            const contexts = [];
            const originalCreateContext = AudioContext.prototype.constructor;
            AudioContext.prototype.constructor = function() {
                const context = new originalCreateContext();
                contexts.push(context);
                return context;
            };
    
            contexts.forEach((context) => {
                context.close().then(() => {
                });
            });
        }
    
        if (window.MediaSource) {
            const originalMediaSource = window.MediaSource;
            window.MediaSource = function() {
                const mediaSource = new originalMediaSource();
                mediaSource.endOfStream = function() {
                    originalMediaSource.prototype.endOfStream.call(this);
                };
                return mediaSource;
            };
        }
    
        console.log('🔇 Stopped all audio and video elements, Web Audio API, and MediaSource');
    }

    function init() {
        stopMediaElements();
        window.addEventListener('yt-navigate-finish', () => replacePlayer());
    }

    init();
})();