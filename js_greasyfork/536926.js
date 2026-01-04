// ==UserScript==
// @name         Auto Youtube Shorts Scroller
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically scrolls through Shorts when a video ends!!! You should use ViolentMonkey because Tampermonkey requires enabling developer mode!!!
// @author       hiensumi
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536926/Auto%20Youtube%20Shorts%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/536926/Auto%20Youtube%20Shorts%20Scroller.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let pollingInterval = null;
    let lastUrl = 'nothing';
    let enabled = false;

    function log(...args) {
        console.log('[AutoShorts]', ...args);
    }

    function scrollToNextShort() {
        if (!enabled) return;
        const buttons = document.querySelectorAll('.yt-spec-button-shape-next');
        for (const btn of buttons) {
            const svg = btn.querySelector('svg path');
            if (!svg) continue;
            const d = svg.getAttribute('d');
            if (d === 'M4.116 13.884a1.25 1.25 0 011.768-1.768l4.866 4.866V4a1.25 1.25 0 112.5 0v12.982l4.866-4.866a1.25 1.25 0 011.768 1.768L12 21.768l-7.884-7.884Z') {
                btn.click();
                log('Scrolled to next short');
                break;
            }
        }
    }

    function activateShortsScript() {
        enabled = true;
        if (pollingInterval) clearInterval(pollingInterval);

        log('Activated for Shorts page');
        let scrolled = false;

        pollingInterval = setInterval(() => {
            // console.log(enabled);
            if(!enabled) return;
            let vids = document.querySelectorAll('video');
            if(window.location.href.includes('short') == true && vids.length){
                let vid = Array.from(vids).find(v => v.duration);
                //log(vid.duration - vid.currentTime);

                if (vid.duration > 2.0 && (vid.duration - vid.currentTime <= 1)) {
                    if (!scrolled) {
                        log('Video ends, scrolling');
                        scrolled = true;
                        setTimeout(() => {
                            scrollToNextShort();
                        }, 2000);
                    }
                } else {
                    scrolled = false;
                }
            }
            else{
                enabled = false;
                setTimeout(() => {
                    log('False activation');
                }, 1000);
                return;
            }
        }, 500);
    }

    function deactivateShortsScript() {
        enabled = false;
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
            log('Deactivated (not on Shorts page)');
        }
    }

    navigation.addEventListener("navigate", e => {
        setTimeout(() => {
            log('Navigation: ' + window.location.href);
            if(window.location.href.includes('short')){
                deactivateShortsScript();
                setTimeout(() => {
                    activateShortsScript();
                }, 1000);
                
            }
            else{
                deactivateShortsScript();
            }
        }, 3000);
    });
})();
