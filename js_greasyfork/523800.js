// ==UserScript==
// @name         YouTube Shorts Keyboard Nav
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  Brings back keyboard navigation for YouTube Shorts
// @author       x0a
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/523800/YouTube%20Shorts%20Keyboard%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/523800/YouTube%20Shorts%20Keyboard%20Nav.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const log = console.log.bind(globalThis, 'YSKN:')
    const getVideo = () => {
        const selector = '.html5-video-player.ytp-hide-controls.ytp-exp-bottom-control-flexbox.ytp-modern-caption.ytp-exp-ppp-update.ytp-hide-info-bar'
        + ':not(.ytp-autonav-endscreen-cancelled-state):not(.unstarted-mode) video';
        return document.querySelector(selector);
    }
    const inTextField = () => {
        const el = document.activeElement;
        if(!el) return false;
        if(el.nodeName === 'INPUT' || el.contentEditable === 'true') return true;
        return false;
    }


    const startMonitoring = () => {
        const onKeyUp = e => {
            if(location.pathname.slice(0, 8) !== '/shorts/') return;
            if(inTextField()) return;

            const video = getVideo();
            if(!video) throw 'Video not found';

            switch(event.key){
                case 'ArrowLeft':
                    log('Going back 5 seconds');
                    video.currentTime -= 5;
                    break;
                case 'ArrowRight':
                    log('Going forward 5 seconds');
                    video.currentTime += 5;
                    break;
                case 'j':
                    log('Going forward 10 seconds');
                    video.currentTime -= 10;
                    break;
                case'l':
                    log('Going forward 10 seconds');
                    video.currentTime += 10;
                    break;
                default:
                    for(let i = 0; i < 10; i++){
                        if(event.key === i + ''){
                            const target = video.duration * (i / 10);
                            log('Seeking to ' + i * 10 + '%, which is ' + target);
                            video.currentTime = target;
                            break;
                        }
                    }
            }

        }
        window.addEventListener('keyup', onKeyUp);

        return () => window.removeEventListener('keyup', onKeyUp);

    }

    const stopMonitoring = startMonitoring();
})();