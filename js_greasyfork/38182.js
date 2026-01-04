// ==UserScript==
// @name               Hide youtube google ad
// @name:zh-CN         隐藏youtube google广告
// @namespace          vince.youtube
// @version            2.6.0
// @description        hide youtube google ad,auto click "skip ad"
// @description:zh-CN  隐藏youtube显示的google广告,自动点击"skip ad"
// @author             vince ding
// @match        https://*.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @connect      googlevideo.com
// @downloadURL https://update.greasyfork.org/scripts/38182/Hide%20youtube%20google%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/38182/Hide%20youtube%20google%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var closeAd=function (){
        //var css = '.video-ads,.video-ads .ad-container .adDisplay,#player-ads,.ytp-ad-module,.ytp-ad-image-overlay,#panels"{ display: none!important; }',
        var css = `
            .video-ads,
            .ytp-ad-overlay-container,
            .ytp-ad-overlay-image,
            .ytp-ad-skip-button-container,
            .ytp-ad-preview-container,
            .ytp-ad-message-container,
            #masthead-ad,
            #player-ads,
            ytd-display-ad-renderer,
            ytd-companion-slot-renderer,
            .ytd-video-masthead-ad-v3-renderer,
            .style-scope.ytd-in-feed-ad-layout-renderer,
            .ytd-banner-promo-renderer,
            #related ytd-promoted-sparkles-web-renderer,
            .ytd-promoted-sparkles-text-search-renderer,
            .ytd-display-ad-renderer,
            .ytd-statement-banner-renderer,
            ytd-engagement-panel-section-list-renderer,
            #related ytd-compact-promoted-video-renderer {
                display: none!important;
            }`;
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    };
    var skipInt;
    var log=function(msg){
        unsafeWindow.console.log (msg);
    };


    var skipAd = function(){
        const skipSelectors = [
            'button.ytp-ad-skip-button',
            'button.ytp-ad-skip-button-modern',
            '.ytp-ad-skip-button-container button',
            '.ytp-ad-skip-button-slot button',
            'button[class*="skip"]',
            'button[class*="Skip"]',
            '.videoAdUiSkipButton',
            '[data-skip-button]'
        ];

        const skipbtn = skipSelectors.reduce((found, selector) => {
            const element = document.querySelector(selector);
            if (element) {
                const style = window.getComputedStyle(element);
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                    return element;
                }
            }
            return found;
        }, null);

        const video = document.querySelector('video');
        const isInAd = Array.from(document.querySelectorAll('.video-ads, .ytp-ad-player-overlay, [class*="ad-showing"], .html5-video-player.ad-showing'))
        .some(element => {
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
        let userPlaybackRate
        const observer = new MutationObserver((mutations) => {
            const video = document.querySelector('video');
            if (video) {
                video.addEventListener('ratechange', ()=>{
                    if(!isInAd){
                        userPlaybackRate=video.playbackRate
                       // console.log("assss",userPlaybackRate)
                    }
                });
                observer.disconnect(); // Stop observing once found
            }
        });
        document.addEventListener('DOMContentLoaded',()=>{
            observer.observe(document.body, { childList: true, subtree: true });
        })

        if(video) {
            if(isInAd) {
                // 广告状态处理
                video.playbackRate = 16;
                video.muted = true; // 广告时静音
                if(video.paused) {
                    video.play();
                }
            } else {
                // 非广告状态处理
                if (typeof userPlaybackRate === 'number' && isFinite(userPlaybackRate)) {
                    if(video.playbackRate !== userPlaybackRate) {
                         video.playbackRate = userPlaybackRate;
                    }
                }else{
                    userPlaybackRate=video.playbackRate
                }

                if(video.muted) {// 非广告时恢复声音
                    video.muted = false;
                }
                // 检测黑屏状态
                if(!video.paused && video.readyState === 4 && video.currentTime === 0) {
                    video.play();
                }
            }
        }

        if(skipbtn && isInAd){
            try {
                skipbtn.removeAttribute('disabled');
                const simulateClick = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                });
                skipbtn.dispatchEvent(simulateClick);
            } catch(e) {
                log("Skip error: " + e);
            }
        }

        // 更频繁地检查以防止黑屏
        setTimeout(() => {
            window.requestAnimationFrame(skipAd);
        }, 200);
    };
    closeAd();
    skipAd();

})();