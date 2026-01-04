// ==UserScript==
// @name         Youtube auto like
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Automatically like the video
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543343/Youtube%20auto%20like.user.js
// @updateURL https://update.greasyfork.org/scripts/543343/Youtube%20auto%20like.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LIKE_DELAY = 30;          // 幾秒後觸發
    const LIKE_MODE = "s";          // "s"=只要逗留就讚, "p"=時間到還在播放才讚
    let lastUrl = null;
    let currentTimer = null;        
    let titleObserver = null;       
    let videoObserver = null;       
    function runMyScript() {
        const video = document.querySelector("video.html5-main-video");
        const currentUrl = window.location.href;
        if (!currentUrl.includes('watch?v=')) {
            return;
        }
        if (currentUrl === lastUrl) {
            return;
        }
        lastUrl = currentUrl;
        if (currentTimer) {
            clearTimeout(currentTimer);
            currentTimer = null;
        }
        if (!video) {
            return;
        }
        if (LIKE_MODE === "s") {
            currentTimer = setTimeout(() => {
                triggerLikeButton();
                currentTimer = null;
            }, LIKE_DELAY * 1000);
        } else if (LIKE_MODE === "p") {
            const checkPlayTime = () => {
                const currentVideo = document.querySelector("video.html5-main-video");
                if (!currentVideo) {
                    currentTimer = null;
                    return;
                }
                if (!currentVideo.paused && !currentVideo.ended) {
                    if (currentVideo.currentTime >= LIKE_DELAY) {
                        triggerLikeButton();
                        currentTimer = null;
                        return;
                    }
                }
                currentTimer = setTimeout(checkPlayTime, 1000);
            };
            checkPlayTime();
        }
    }
    function triggerLikeButton() {
        if (document.activeElement.tagName.toLowerCase() === 'input' ||
            document.activeElement.tagName.toLowerCase() === 'textarea' ||
            document.activeElement.isContentEditable) {
            return;
        }
        setTimeout(() => {
            const likeSection = document.querySelector('ytd-segmented-like-dislike-button-renderer');
            if (likeSection) {
                const likeButton = likeSection.querySelector('button:first-child');
                if (likeButton) {
                    const isLiked = likeButton.getAttribute('aria-pressed') === 'true';
                    if (isLiked) {
                        showMsg('已按過讚', false);
                        return;
                    }
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    likeButton.dispatchEvent(event);
                    showMsg('自動按讚', true);
                    return;
                }
            }
            const selectors = [
                'button[title*="喜歡"], button[aria-label*="喜歡"], button[aria-label*="like"]',
                'yt-button-shape button[aria-pressed="false"]',
                '#segmented-like-button button'
            ];
            for (let selector of selectors) {
                const button = document.querySelector(selector);
                if (button) {
                    const isLiked = button.getAttribute('aria-pressed') === 'true';
                    if (isLiked) {
                        showMsg('已按過讚', false);
                        return;
                    }
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    button.dispatchEvent(event);
                    showMsg('自動按讚', true);
                    return;
                }
            }
            showMsg('找不到按讚按鈕', false);
        }, 100);
    }
    function showMsg(text, isSuccess = true) {
        const msg = document.createElement('div');
        msg.textContent = text;
        Object.assign(msg.style, {
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            top: isSuccess ? '70%' : '30%',
            padding: '10px 20px',
            background: isSuccess ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 152, 0, 0.9)',
            color: '#fff',
            borderRadius: '8px',
            zIndex: 9999,
            fontSize: '16px',
            opacity: '0',
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        });
        document.body.appendChild(msg);
        setTimeout(() => { msg.style.opacity = '1'; }, 10);
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(msg)) {
                    document.body.removeChild(msg);
                }
            }, 300);
        }, 2500);
    }
    function startPageObserver() {
        const titleEl = document.querySelector("title");
        if (!titleEl) {
            return;
        }
        if (titleObserver) {
            titleObserver.disconnect();
        }
        titleObserver = new MutationObserver(() => {
            runMyScript();
        });
        titleObserver.observe(titleEl, {
            childList: true
        });
    }
    function startVideoObserver() {
        const video = document.querySelector("video.html5-main-video");
        if (!video) {
            setTimeout(startVideoObserver, 2000);
            return;
        }
        if (videoObserver) {
            videoObserver.disconnect();
        }
        videoObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    runMyScript();
                }
            }
        });
        videoObserver.observe(video, {
            attributes: true,
            attributeFilter: ['src']
        });
        video.addEventListener('loadstart', () => {
            runMyScript();
        });
    }
    function listenToUrlChanges() {
        let currentUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(runMyScript, 500); 
            }
        });
        observer.observe(document, {
            subtree: true,
            childList: true
        });
    }
    function init() {
        runMyScript();
        startPageObserver();
        startVideoObserver();
        listenToUrlChanges();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('beforeunload', () => {
        if (currentTimer) {
            clearTimeout(currentTimer);
        }
        if (titleObserver) {
            titleObserver.disconnect();
        }
        if (videoObserver) {
            videoObserver.disconnect();
        }
    });
})();
