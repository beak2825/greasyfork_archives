// ==UserScript==
// @name         YouTube Enhanced Controls (Zoom + Quality + Seek)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zoom YouTube video, set quality with keys (1-4,7-9), and skip time using arrow keys, all without default YouTube interference
// @author       Ankit
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545508/YouTube%20Enhanced%20Controls%20%28Zoom%20%2B%20Quality%20%2B%20Seek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545508/YouTube%20Enhanced%20Controls%20%28Zoom%20%2B%20Quality%20%2B%20Seek%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class YouTubeEnhancer {
        constructor() {
            this.currentZoom = 1.0;
            this.zoomStep = 0.04;
            this.qualityMap = {
                '1': 'tiny',       // 144p
                '2': 'small',      // 240p
                '3': 'medium',     // 360p
                '4': 'large',      // 480p
                '7': 'hd720',      // 720p
                '8': 'hd1080',     // 1080p
                '9': 'hd1440'      // 1440p
            };
            this.setup();
        }

        setup() {
            window.addEventListener('keydown', this.handleKey.bind(this), true);

            const observer = new MutationObserver(() => {
                this.applyZoom();
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        applyZoom() {
            const video = document.querySelector('video');
            if (video) {
                video.style.transform = `scale(${this.currentZoom})`;
                video.style.transformOrigin = 'center center';
                video.style.zIndex = '9999';
                video.style.position = 'relative';
            }
        }

        zoom(direction) {
            this.currentZoom += direction === 'in' ? this.zoomStep : -this.zoomStep;
            this.currentZoom = Math.max(0.04, Math.min(10.0, this.currentZoom));
            this.applyZoom();
        }

        changeQuality(label) {
            const player = document.querySelector('video');
            const ytPlayer = document.getElementById('movie_player');
            if (!player || !ytPlayer) return;

            const quality = this.qualityMap[label];
            if (quality && ytPlayer.setPlaybackQualityRange) {
                ytPlayer.setPlaybackQualityRange(quality);
            } else if (quality && ytPlayer.setPlaybackQuality) {
                ytPlayer.setPlaybackQuality(quality);
            }
        }

        seek(seconds) {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime += seconds;
            }
        }

        handleKey(e) {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            const zoomKeys = ['=', '+', '-', '_'];
            const qualityKeys = Object.keys(this.qualityMap);
            const arrowKeys = ['ArrowLeft', 'ArrowRight'];

            if ([...zoomKeys, ...qualityKeys, ...arrowKeys].includes(e.key)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }

            switch (e.key) {
                case '=':
                case '+':
                    this.zoom('in');
                    break;
                case '-':
                case '_':
                    this.zoom('out');
                    break;
                case 'ArrowRight':
                    this.seek(10);
                    break;
                case 'ArrowLeft':
                    this.seek(-10);
                    break;
                default:
                    if (this.qualityMap[e.key]) {
                        this.changeQuality(e.key);
                    }
            }
        }
    }

    new YouTubeEnhancer();
})();