// ==UserScript==
// @name         YouTube Permanent ProgressBar
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Keeps YouTube progress bar visible all the time.
// @author       ChromiaCat
// @match        *://www.youtube.com/*
// @run-at      document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516862/YouTube%20Permanent%20ProgressBar.user.js
// @updateURL https://update.greasyfork.org/scripts/516862/YouTube%20Permanent%20ProgressBar.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var style = document.createElement('style');
    var to = { createHTML: s => s },
        tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to,
        html = s => tp.createHTML(s)
    style.type = 'text/css';
    style.innerHTML = html(
        '.ytp-autohide .ytp-chrome-bottom{opacity:1!important;display:block!important}' +
        '.ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container{bottom:-1px!important}' +
        '.ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls{opacity:0!important}' +
        '.ytp-progress-bar-container:not(:hover) .ytp-scrubber-container{display:none!important}'
    );
    document.getElementsByTagName('head')[0].appendChild(style);

    var permanentProgressBar = {
        options: {
            UPDATE_VIDEO_TIMER: true,
            UPDATE_PROGRESSBAR: true,
            UPDATE_BUFFERBAR: true,
            TARGET_FPS: 15, // frame per second. Set 0 to update on each requestAnimationFrame call.
        },

        // cache frequently accessed DOM nodes and chapter metrics
        domCache: {player:null, video:null, currentTimeEl:null, progressBar:null, bufferBar:null},
        chapterCache: {len:0,widths:[],totalWidth:0,ratio:1,duration:0},

        // Converts current video time to a human-readable format.
        prettifyVideoTime: function(video) {
            let seconds = "" + Math.floor(video.currentTime % 60);
            let minutes = "" + Math.floor((video.currentTime % 3600) / 60);
            let hours = "" + Math.floor(video.currentTime / 3600);
            if (video.currentTime / 60 > 60) {
                return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
            } else {
                return `${minutes}:${seconds.padStart(2, '0')}`;
            }
        },

        // For progress mode, return current time; for buffer mode, return the end of the buffered range that contains currentTime.
        getDuration: function(video, type) {
            if (type === "PROGRESSBAR") {
                return video.currentTime;
            } else if (type === "BUFFERBAR") {
                if (video.buffered.length > 0) {
                    for (let i = 0; i < video.buffered.length; i++) {
                        if (video.currentTime >= video.buffered.start(i) && video.currentTime <= video.buffered.end(i)) {
                            return video.buffered.end(i);
                        }
                    }
                }
                return 0;
            }
        },

        // Updates the current time display on the player.
        updateCurrentTimeField: function(player) {
            const video = this.domCache.video || (this.domCache.video = player.querySelector("video"));
            const currentTimeEl = this.domCache.currentTimeEl || (this.domCache.currentTimeEl = player.querySelector(".ytp-time-current"));
            if (!video || !currentTimeEl) return;
            currentTimeEl.innerText = permanentProgressBar.prettifyVideoTime(video);
        },

        // For non-chaptered videos, update the progress and buffer bars directly.
        updateOverallProgressBar: function(player) {
            const video = this.domCache.video || (this.domCache.video = player.querySelector("video"));
            const progressBar = this.domCache.progressBar || (this.domCache.progressBar = player.querySelector(".ytp-play-progress"));
            const bufferBar = this.domCache.bufferBar || (this.domCache.bufferBar = player.querySelector(".ytp-load-progress"));
            if (!video || !progressBar || !bufferBar) return;
            if (!video.duration) return;

            let progressRatio = video.currentTime / video.duration;
            let bufferRatio = this.getDuration(video, "BUFFERBAR") / video.duration;

            progressBar.style.transform = `scaleX(${Math.min(1, progressRatio.toFixed(5))})`;
            bufferBar.style.transform = `scaleX(${Math.min(1, bufferRatio.toFixed(5))})`;
        },

        // For chaptered videos, update each chapter element directly based on current time.
        updateProgressBarWithChapters: function(player, type) {
            const video = player.querySelector("video");
            if (!video || isNaN(video.duration)) return;

            // Get the chapter elements and corresponding progress elements.
            const chapterElements = player.getElementsByClassName("ytp-progress-bar-padding");
            let chapterProgressEls;
            if (type === "PROGRESSBAR") {
                chapterProgressEls = player.getElementsByClassName("ytp-play-progress");
            } else if (type === "BUFFERBAR") {
                chapterProgressEls = player.getElementsByClassName("ytp-load-progress");
            }
            if (!chapterElements || !chapterProgressEls) return;

            // Compute chapter metrics only if cache is invalid (length/width) OR the video duration has changed.
            // This handles YouTube SPA navigation where a new video may have the same number of chapters but different length.
            if (this.chapterCache.len !== chapterElements.length || !this.chapterCache.totalWidth || this.chapterCache.duration !== video.duration) {
                this.chapterCache.len = chapterElements.length;
                this.chapterCache.widths = Array.from(chapterElements).map(el => el.offsetWidth || el.getBoundingClientRect().width || 0);
                this.chapterCache.totalWidth = this.chapterCache.widths.reduce((a,b)=>a+b,0);
                this.chapterCache.duration = video.duration;

                this.chapterCache.ratio = this.chapterCache.totalWidth ? (video.duration / this.chapterCache.totalWidth) : 1;
            }
            const widths = this.chapterCache.widths;
            const durationWidthRatio = this.chapterCache.ratio;

            let accumulatedWidth = 0;
            for (let i = 0; i < chapterElements.length; i++) {
                const chapterWidth = widths[i];
                const chapterEndTime = durationWidthRatio * (accumulatedWidth + chapterWidth);
                const chapterStartTime = durationWidthRatio * accumulatedWidth;
                let currentTimeForType = this.getDuration(video, type);
                let ratio;
                if (currentTimeForType >= chapterEndTime) {
                    ratio = 1;
                } else if (currentTimeForType < chapterStartTime) {
                    ratio = 0;
                } else {
                    ratio = (currentTimeForType - chapterStartTime) / (chapterEndTime - chapterStartTime);
                }
                chapterProgressEls[i].style.transform = `scaleX(${Math.min(1, ratio.toFixed(5))})`;
                accumulatedWidth += chapterWidth;
            }
        },

        // -------- Cache helpers --------
        resetChapterCache: function(){
            this.chapterCache = {len:0,widths:[],totalWidth:0,ratio:1,duration:0};
            this.domCache = {player:null, video:null, currentTimeEl:null, progressBar:null, bufferBar:null};
        },

        // The main update function which selects chapter-mode or overall mode.
        update: function() {
            const player = document.querySelector(".html5-video-player");
            if (!player) return;

            if (this.options.UPDATE_VIDEO_TIMER) {
                this.updateCurrentTimeField(player);
            }

            // If chapter elements exist, update chapter-mode; otherwise use overall mode.
            let chapterElements = player.getElementsByClassName("ytp-progress-bar-padding");
            if (chapterElements.length > 0) {
                if (this.options.UPDATE_PROGRESSBAR) {
                    this.updateProgressBarWithChapters(player, "PROGRESSBAR");
                }
                if (this.options.UPDATE_BUFFERBAR) {
                    this.updateProgressBarWithChapters(player, "BUFFERBAR");
                }
            } else {
                this.updateOverallProgressBar(player);
            }
        },

        /* ------------------ Performance-friendly update loop ------------------ */
        rafId: 0,
        resizeObserver: null,

        /* Starts a requestAnimationFrame loop only while the <video> is playing. */
        attachLoop: function(video) {
            let last = 0;
            const loop = (ts) => {
                if (video.paused || document.hidden) {
                    this.rafId = requestAnimationFrame(loop);
                    return;
                }
                if (!this.options.TARGET_FPS || ts - last >= 1000 / this.options.TARGET_FPS) {
                    this.update();
                    last = ts;
                }
                this.rafId = requestAnimationFrame(loop);
            };
            this.rafId = requestAnimationFrame(loop);
        },

        /* Locate the player & video element and wire play/pause events. */
        waitForVideo: function() {
            const tryAttach = () => {
                const player = this.domCache.player = document.querySelector('.html5-video-player');
                const video  = this.domCache.video = player?.querySelector('video');
                if (!video) {
                    setTimeout(tryAttach, 1000);
                    return;
                }

                // Observe layout changes to invalidate chapter width cache (helps embeds/resizes)
                try {
                    if (this.resizeObserver) this.resizeObserver.disconnect();
                    const ro = new ResizeObserver(() => { this.chapterCache.totalWidth = 0; });
                    this.resizeObserver = ro;
                    const observedEl = player.querySelector('.ytp-progress-bar') || player;
                    ro.observe(observedEl);
                } catch(e) { /* ResizeObserver may be unavailable */ }

                const startLoop = () => {
                    cancelAnimationFrame(this.rafId);
                    this.attachLoop(video);
                };
                const stopLoop = () => cancelAnimationFrame(this.rafId);

                video.addEventListener('play',   startLoop);
                video.addEventListener('playing',startLoop);
                video.addEventListener('pause',  stopLoop);
                video.addEventListener('ended',  stopLoop);

                // Auto-start if video already playing
                if (!video.paused) startLoop();
            };
            tryAttach();
        },

        start: function() {
            const onNavigate = () => {
                this.resetChapterCache();
                this.waitForVideo();
            };
            document.addEventListener('yt-navigate-finish', onNavigate);
            this.waitForVideo();
        }
    };

    permanentProgressBar.start();
})();
