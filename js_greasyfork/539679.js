// ==UserScript==
// @name         X Reels ++
// @namespace    http://tampermonkey.net/
// @version      28.8.18
// @description  Transforms the X/Twitter feed into a full-screen viewer with keyboard & mouse wheel navigation, smart auto-scroll, playback speed control, and a robust follow-and-return action.
// @author       Kristijan1001
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539679/X%20Reels%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/539679/X%20Reels%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class TikTokFeed {
        constructor() {
            this.activePost = { id: null, element: null, mediaItems: [], currentMediaIndex: 0 };
            this.activePlaceholder = null;
            this.activeDisplayedMediaElement = null;
            this.isActive = false;
            this.isNavigating = false;
            this.lastScrollTime = 0;
            this.container = null;
            this.likeButton = null;
            this.followButton = null;
            this.exitButton = null;
            this.scrollUpButton = null;
            this.scrollDownButton = null;
            this.savedScrollPosition = 0;
            this.mutationObserver = null;
            this.isReturningFromFollow = false;

            // Updated: Parse potentially existing smart value (-1)
            this.autoScrollDelay = parseInt(localStorage.getItem('xreels_autoScrollDelay') || '0', 10);
            this.autoScrollTimeoutId = null;
            this.videoEndedListener = null; // New listener for Smart mode

            this.hideControlsTimeoutId = null;
            this.hideInfoTimeoutId = null;
            this.galleryIndicatorTimeout = null;

            this.savedVolume = parseFloat(localStorage.getItem('xreels_volume') || '0.7');
            this.savedMuted = localStorage.getItem('xreels_muted') === 'true';
            this.savedPlaybackRate = parseFloat(localStorage.getItem('xreels_playbackRate')) || 1.0;

            this.boundHandleWheel = null;
            this.boundHandleKeydown = null;
            this.boundHandlePopState = null;
        }

        init() {
            console.log('🔥 X Reels Initializing...');
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
                console.log('History scroll restoration set to manual.');
            }
            this.setupEventListeners();
            setTimeout(() => this.addManualTrigger(), 1000);
        }

        addManualTrigger() {
            if (window.self !== window.top) return;
            if (window.location !== window.parent.location) return;

            let trigger = document.getElementById('tiktok-trigger');
            if (trigger) trigger.remove();

            trigger = document.createElement('div');
            trigger.id = 'tiktok-trigger';
            trigger.innerHTML = `
                <div class="trigger-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.59 10.59L12 3l-7.59 7.59-1.42-1.41L12 0l8.99 9-1.4 1.59z" fill="currentColor"/>
                        <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="trigger-content">
                    <div class="trigger-title">X Reels</div>
                    <div class="trigger-subtitle">Press X</div>
                </div>
            `;

            trigger.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 1000000;
                display: flex; align-items: center; gap: 12px;
                padding: 14px 20px;
                background: linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
                border: 1px solid rgba(255, 0, 80, 0.3); border-radius: 16px;
                cursor: pointer; user-select: none;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 0 20px rgba(255, 0, 80, 0.15);
                backdrop-filter: blur(20px) saturate(180%);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform: translateY(0) scale(1); opacity: 1;
            `;

            const style = document.createElement('style');
            style.textContent = `
                #tiktok-trigger { animation: slideInDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                #tiktok-trigger .trigger-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ff0050 0%, #ff4081 100%); border-radius: 10px; flex-shrink: 0; box-shadow: 0 4px 16px rgba(255, 0, 80, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset; transition: all 0.3s ease; }
                #tiktok-trigger .trigger-icon svg { color: white; width: 22px; height: 22px; animation: iconPulse 2.5s ease-in-out infinite; }
                #tiktok-trigger .trigger-content { display: flex; flex-direction: column; gap: 1px; }
                #tiktok-trigger .trigger-title { color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; line-height: 1.2; }
                #tiktok-trigger .trigger-subtitle { color: rgba(255, 255, 255, 0.55); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.3px; }
                #tiktok-trigger:hover { transform: translateY(-3px) scale(1.02); border-color: rgba(255, 0, 80, 0.5); box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 25px rgba(255, 0, 80, 0.25); }
                #tiktok-trigger:hover .trigger-icon { transform: scale(1.08) rotate(5deg); box-shadow: 0 5px 16px rgba(255, 0, 80, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset; }
                #tiktok-trigger:hover .trigger-icon svg { animation: iconSpin 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                #tiktok-trigger:active { transform: translateY(-1px) scale(0.98); transition: all 0.1s ease; }
                #tiktok-trigger::before { content: ''; position: absolute; inset: -2px; background: linear-gradient(135deg, #ff0050, #ff4081, #ff0050); border-radius: 14px; opacity: 0; transition: opacity 0.3s ease; z-index: -1; filter: blur(8px); }
                #tiktok-trigger:hover::before { opacity: 0.25; animation: gradientRotate 2s linear infinite; }
                @keyframes slideInDown { from { opacity: 0; transform: translateY(-30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes iconPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
                @keyframes iconSpin { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1.08); } }
                @keyframes gradientRotate { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @media (max-width: 768px) { #tiktok-trigger { top: 12px; right: 12px; padding: 8px 12px; gap: 8px; } #tiktok-trigger .trigger-icon { width: 32px; height: 32px; } #tiktok-trigger .trigger-icon svg { width: 16px; height: 16px; } #tiktok-trigger .trigger-title { font-size: 12px; } #tiktok-trigger .trigger-subtitle { font-size: 9px; } }
            `;
            if (!document.getElementById('xreels-pulse-style')) {
                style.id = 'xreels-pulse-style';
                document.head.appendChild(style);
            }

            trigger.addEventListener('click', () => this.startFeed());
            document.body.appendChild(trigger);
        }

        startFeed() {
            if (this.isActive) return;

            document.querySelectorAll('video').forEach(vid => {
                if (!vid.paused) vid.pause();
                vid.muted = true;
            });

            const firstPostWithMedia = this.findCentralMediaArticle();
            if (!firstPostWithMedia) {
                console.error('❌ No media found on screen. Scroll down and try again.');
                return;
            }
            this.isActive = true;
            this.createContainer();
            this.navigateToPost(firstPostWithMedia);
            const trigger = document.getElementById('tiktok-trigger');
            if (trigger) trigger.style.display = 'none';
        }

        exit() {
            console.log('👋 Exiting feed...');
            this.isActive = false;
            this.stopAutoScrollTimer();
            clearTimeout(this.hideControlsTimeoutId);
            clearTimeout(this.hideInfoTimeoutId);

            if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                this.activeDisplayedMediaElement.controls = false;
            }

            this.hideLoadingIndicator();
            this.restoreOriginalMediaPosition();

            if (this.activePost && this.activePost.mediaItems) {
                this.activePost.mediaItems.forEach(item => {
                    if (item.type === 'video' && item.originalElement && item.placeholder && item.placeholder.parentElement) {
                        item.originalElement.style.cssText = '';
                        if (item.originalElement.parentNode !== item.placeholder.parentElement) {
                            item.placeholder.parentElement.replaceChild(item.originalElement, item.placeholder);
                        }
                        if (!item.originalElement.paused) {
                            item.originalElement.pause();
                        }
                    }
                });
            }

            if (this.container) this.container.remove();
            this.container = null;
            document.body.style.scrollBehavior = 'auto';
            const trigger = document.getElementById('tiktok-trigger');
            if (trigger) trigger.style.display = 'inline-flex';
            this.activePost = { id: null, element: null, mediaItems: [], currentMediaIndex: 0 };
            this.activeDisplayedMediaElement = null;
            this.activePlaceholder = null;
            this.likeButton = null;
            this.followButton = null;
            this.exitButton = null;
            this.scrollUpButton = null;
            this.scrollDownButton = null;
            this.savedScrollPosition = 0;
            this.disconnectObserver();
            this.isReturningFromFollow = false;
        }

        createContainer() {
            if (this.container) this.container.remove();
            this.container = document.createElement('div');
            this.container.id = 'tiktok-feed-container';
            this.container.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.90); z-index: 2147483647;
                pointer-events: none; overflow: hidden;
            `;

            // Insert styles for Fancy Buttons
            if(!document.getElementById('xreels-fancy-buttons')) {
                const fancyButtonsStyle = document.createElement('style');
                fancyButtonsStyle.id = 'xreels-fancy-buttons';
                fancyButtonsStyle.textContent = `
                    @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(1.15); opacity: 0; } }
                    @keyframes pulse-rect { 0% { transform: scale(0.98); opacity: 1; } 50% { transform: scale(1.02); opacity: 0.7; } 100% { transform: scale(1.06); opacity: 0; } }
                    @keyframes heart-beat { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.2); } 50% { transform: scale(1.1); } 75% { transform: scale(1.25); } }
                    @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-8px) scale(1.1); opacity: 0; } }
                    @keyframes float-down { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(8px) scale(1.1); opacity: 0; } }
                    @keyframes exit-shake { 0%, 100% { transform: translateX(0) rotate(0deg); } 25% { transform: translateX(-3px) rotate(-5deg); } 75% { transform: translateX(3px) rotate(5deg); } }
                    .fancy-exit-btn { position: relative; }
                    .fancy-exit-btn::before { content: ''; position: absolute; inset: 0; border-radius: 16px; background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; z-index: 1; }
                    .fancy-exit-btn:hover::before { opacity: 1; }
                    .fancy-exit-btn:hover { transform: translateY(-3px) scale(1.05); background: linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.5) 100%) !important; border-color: rgba(239, 68, 68, 0.9) !important; box-shadow: 0 12px 40px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3) inset !important; }
                    .fancy-exit-btn:hover svg { animation: exit-shake 0.5s ease; }
                    .fancy-exit-btn:hover .exit-pulse { animation: pulse-rect 1s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
                    .fancy-exit-btn:active { transform: translateY(-1px) scale(1.02); transition: all 0.1s ease; }
                    .fancy-action-btn { position: relative; }
                    .fancy-action-btn::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; z-index: 1; }
                    .fancy-action-btn:hover::before { opacity: 1; }
                    .fancy-action-btn:hover { transform: translateY(-4px) scale(1.08); box-shadow: 0 12px 40px rgba(255, 255, 255, 0.2), 0 0 30px currentColor inset; }
                    .fancy-action-btn:hover .like-icon, .fancy-action-btn:hover .follow-icon, .fancy-action-btn:hover .arrow-icon { transform: scale(1.15); }
                    .fancy-action-btn:active { transform: translateY(-2px) scale(1.02); transition: all 0.1s ease; }
                    #tiktok-like-btn:hover .pulse-ring { animation: pulse-ring 1s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
                    #tiktok-scroll-up-btn:hover .arrow-icon { animation: float-up 0.6s ease infinite; }
                    #tiktok-scroll-down-btn:hover .arrow-icon { animation: float-down 0.6s ease infinite; }
                    #tiktok-like-btn.liked .heart-path { fill: #ff1447; stroke: #ff1447; animation: heart-beat 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }
                    #tiktok-like-btn.liked { background: linear-gradient(135deg, rgba(255, 20, 71, 0.5) 0%, rgba(220, 0, 50, 0.5) 100%); border-color: rgba(255, 20, 71, 0.8); box-shadow: 0 12px 40px rgba(255, 20, 71, 0.5), 0 0 30px rgba(255, 20, 71, 0.3) inset; }
                    #tiktok-follow-btn.following .follow-plus-v, #tiktok-follow-btn.following .follow-plus-h { opacity: 0; transform: scale(0); }
                    #tiktok-follow-btn.following { background: linear-gradient(135deg, rgba(29, 161, 242, 0.5) 0%, rgba(26, 140, 216, 0.5) 100%); border-color: rgba(29, 161, 242, 0.8); box-shadow: 0 12px 40px rgba(29, 161, 242, 0.5), 0 0 30px rgba(29, 161, 242, 0.3) inset; }
                    #tiktok-follow-btn.following::after { content: '✓'; position: absolute; top: 50%; right: -4px; transform: translate(0, -50%); font-size: 14px; color: white; font-weight: bold; z-index: 3; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
                `;
                document.head.appendChild(fancyButtonsStyle);
            }

            this.container.innerHTML = `
                <div class="media-wrapper" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: auto; overflow: hidden;"></div>
                <div class="ui-container" style="position: relative; z-index: 1000002; width: 100%; height: 100%; pointer-events: none;">

                    <div class="loading-indicator" style="display: none; position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 15px; z-index: 1000003; font-size: 12px; font-weight: 600; backdrop-filter: blur(10px); pointer-events: none;">Loading...</div>

                    <div style="position: absolute; top: 20px; left: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; pointer-events: auto;">
                        <div class="info-controls-wrapper" style="color: rgba(255,255,255,0.9); background: rgba(0,0,0,0.6); padding: 6px 10px; border-radius: 15px; font-size: 12px; backdrop-filter: blur(10px); pointer-events: auto; transition: all 0.3s ease;">
                            <div class="info-header" style="color: white; cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: flex-start; gap: 5px;">Keyboard Shortcuts <span style="display: inline-block; width: 12px; height: 12px; background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M7.41%208.59L12%2013.17L16.59%208.59L18%2010L12%2016L6%2010L7.41%208.59Z%22%20fill%3D%22%23FF6F61%22%2F%3E%0A%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: center; background-size: contain; transform: rotate(0deg); transition: transform 0.3s ease-out;"></span></div>
                            <div class="controls-expanded" style="max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.3s ease-out, opacity 0.3s ease-out; padding-top: 0; font-weight: 400;">
                                • X: <span style="color:#FF6F61;">Enter/Exit Feed</span> <br>
                                • Scroll: <span style="color:#FF6F61;">⬆️/⬇️</span> <br>
                                • Cycle Media: <span style="color:#FF6F61;">⬅️/➡️</span> <br>
                                • Space: <span style="color:#FF6F61;">Play/Pause</span> <br>
                                • &lt; / &gt; : <span style="color:#FF6F61;">Scrub</span> <br>
                                • L: <span style="color:#FF6F61;">Like</span> <br>
                                • F: <span style="color:#FF6F61;">Follow</span> <br>
                                • Q: <span style="color:#FF6F61;">Exit</span>
                            </div>
                        </div>
                    </div>

                    <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; pointer-events: auto;">
                        <button id="tiktok-exit-btn" class="fancy-exit-btn" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%); border: 1px solid rgba(239, 68, 68, 0.6); border-radius: 16px; padding: 10px 16px; color: white; font-size: 13px; font-weight: 700; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(239, 68, 68, 0.35), 0 0 20px rgba(239, 68, 68, 0.15) inset; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); pointer-events: auto; display: flex; align-items: center; gap: 8px; position: relative; overflow: hidden;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: all 0.3s ease;">
                                <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));"/>
                            </svg>
                            <span style="position: relative; z-index: 2;">Exit</span>
                            <div class="exit-pulse" style="position: absolute; inset: -2px; border-radius: 16px; border: 2px solid rgba(239, 68, 68, 0.6); opacity: 0; animation: pulse-rect 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                        </button>

                        <div style="color: white; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; pointer-events: auto; cursor: pointer;" id="xreels-autoscroll-container">
                            <span>Auto: <span id="xreels-autoscroll-display" style="color: #FF6F61;">Off</span></span>
                            <span style="color: #FF6F61;">▼</span>
                        </div>
                        <div id="xreels-autoscroll-menu" style="display: none; position: absolute; top: 90px; right: 20px; background: rgba(0,0,0,0.9); border-radius: 10px; padding: 8px; backdrop-filter: blur(10px); pointer-events: auto; z-index: 10000000;">
                            <div class="autoscroll-option" data-value="0" style="padding: 8px 16px; cursor: pointer; color: #FF6F61; border-radius: 5px; transition: background 0.2s;">Off</div>
                            <div class="autoscroll-option" data-value="-1" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">Auto (Smart)</div>
                            <div class="autoscroll-option" data-value="1000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">1s</div>
                            <div class="autoscroll-option" data-value="2000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">2s</div>
                            <div class="autoscroll-option" data-value="3000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">3s</div>
                            <div class="autoscroll-option" data-value="5000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">5s</div>
                            <div class="autoscroll-option" data-value="8000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">8s</div>
                            <div class="autoscroll-option" data-value="30000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">30s</div>
                            <div class="autoscroll-option" data-value="60000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">60s</div>
                        </div>
                    </div>

                    <div class="gallery-indicator" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); color: white; background: rgba(0,0,0,0.8); padding: 6px 12px; border-radius: 15px; font-size: 14px; font-weight: 700; backdrop-filter: blur(10px); display: none; pointer-events: none; opacity: 1; transition: opacity 0.5s ease;"></div>

                    <div class="info" style="position: absolute; bottom: 75px; left: 20px; right: 20px; color: white; background: rgba(0,0,0,0.0); padding: 20px; border-radius: 16px; max-height: 120px; overflow-y: auto; backdrop-filter: blur(0px); pointer-events: auto;"></div>

                    <div class="action-buttons" style="position: absolute; right: 20px; bottom: 100px; display: flex; flex-direction: column; gap: 14px; z-index: 1000002; pointer-events: auto;">
                        <button id="tiktok-like-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(255, 20, 80, 0.25) 0%, rgba(255, 64, 129, 0.25) 100%); border: 1px solid rgba(255, 20, 80, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(255, 20, 80, 0.35), 0 0 20px rgba(255, 20, 80, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="like-icon" style="position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: visible;">
                                <path class="heart-path" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.4s ease;"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(255, 20, 80, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                        </button>

                        <button id="tiktok-follow-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(29, 161, 242, 0.25) 0%, rgba(26, 140, 216, 0.25) 100%); border: 1px solid rgba(29, 161, 242, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(29, 161, 242, 0.35), 0 0 20px rgba(29, 161, 242, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="follow-icon" style="position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                                <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2" fill="none" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="white" stroke-width="2" stroke-linecap="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                                <line x1="19" y1="8" x2="19" y2="14" stroke="white" stroke-width="2" stroke-linecap="round" class="follow-plus-v" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.3s ease;"/>
                                <line x1="16" y1="11" x2="22" y2="11" stroke="white" stroke-width="2" stroke-linecap="round" class="follow-plus-h" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.3s ease;"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(29, 161, 242, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s;"></div>
                        </button>

                        <button id="tiktok-scroll-up-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(100, 150, 255, 0.25) 0%, rgba(70, 120, 255, 0.25) 100%); border: 1px solid rgba(100, 150, 255, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(100, 150, 255, 0.35), 0 0 20px rgba(100, 150, 255, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon" style="position: relative; z-index: 2; transition: all 0.3s ease;">
                                <path d="M12 19V5M5 12l7-7 7 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(100, 150, 255, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s;"></div>
                        </button>

                        <button id="tiktok-scroll-down-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(100, 150, 255, 0.25) 0%, rgba(70, 120, 255, 0.25) 100%); border: 1px solid rgba(100, 150, 255, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(100, 150, 255, 0.35), 0 0 20px rgba(100, 150, 255, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon" style="position: relative; z-index: 2; transition: all 0.3s ease;">
                                <path d="M12 5v14M5 12l7 7 7-7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(100, 150, 255, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.5s;"></div>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.container);
            this.likeButton = this.container.querySelector('#tiktok-like-btn');
            this.followButton = this.container.querySelector('#tiktok-follow-btn');
            this.exitButton = this.container.querySelector('#tiktok-exit-btn');
            this.scrollUpButton = this.container.querySelector('#tiktok-scroll-up-btn');
            this.scrollDownButton = this.container.querySelector('#tiktok-scroll-down-btn');

            this.likeButton.addEventListener('click', () => this.toggleLike());
            this.followButton.addEventListener('click', () => this.toggleFollow());
            this.exitButton.addEventListener('click', () => this.exit());

            const infoControlsWrapper = this.container.querySelector('.info-controls-wrapper');
            const controlsExpanded = this.container.querySelector('.controls-expanded');
            const infoHeader = this.container.querySelector('.info-header');
            const infoArrow = infoHeader.querySelector('span');

            let isHoveringInfo = false;
            let isInfoExpanded = false;

            infoControlsWrapper.addEventListener('mouseenter', () => {
                isHoveringInfo = true;
                clearTimeout(this.hideInfoTimeoutId);
                if (!isInfoExpanded) {
                    controlsExpanded.style.maxHeight = '200px';
                    controlsExpanded.style.opacity = '1';
                    controlsExpanded.style.paddingTop = '8px';
                    infoArrow.style.transform = 'rotate(180deg)';
                    isInfoExpanded = true;
                }
            });

            infoControlsWrapper.addEventListener('mouseleave', () => {
                isHoveringInfo = false;
                this.hideInfoTimeoutId = setTimeout(() => {
                    if (!isHoveringInfo) {
                        controlsExpanded.style.maxHeight = '0';
                        controlsExpanded.style.opacity = '0';
                        controlsExpanded.style.paddingTop = '0';
                        infoArrow.style.transform = 'rotate(0deg)';
                        isInfoExpanded = false;
                    }
                }, 500);
            });

            this.scrollUpButton.addEventListener('click', () => {
                const mediaNavigated = this.handleMediaNavigation('prev');
                if (!mediaNavigated) {
                    this.handlePostNavigation('prev');
                }
            });
            this.scrollDownButton.addEventListener('click', () => {
                const mediaNavigated = this.handleMediaNavigation('next');
                if (!mediaNavigated) {
                    this.handlePostNavigation('next');
                }
            });

            this.setupAutoScrollControls();
        }

        setupAutoScrollControls() {
            const container = document.getElementById('xreels-autoscroll-container');
            const menu = document.getElementById('xreels-autoscroll-menu');
            const display = document.getElementById('xreels-autoscroll-display');

            const timeLabels = { 0: 'Off', '-1': 'Auto (Smart)', 1000: '1s', 2000: '2s', 3000: '3s', 5000: '5s', 8000: '8s', 30000: '30s', 60000: '60s' };
            display.textContent = timeLabels[this.autoScrollDelay] || 'Off';

            container.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            });

            // Handle options styling via JS to match functionality without external CSS file
            document.querySelectorAll('.autoscroll-option').forEach(option => {
                option.addEventListener('mouseenter', () => {
                    option.style.background = 'rgba(255,255,255,0.1)';
                });
                option.addEventListener('mouseleave', () => {
                    option.style.background = 'transparent';
                });
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = parseInt(option.dataset.value, 10);
                    this.autoScrollDelay = value;
                    localStorage.setItem('xreels_autoScrollDelay', value.toString());
                    display.textContent = timeLabels[value];
                    menu.style.display = 'none';

                    if (this.isActive && (value > 0 || value === -1)) {
                        this.startAutoScrollTimer();
                    } else if (value === 0) {
                        this.stopAutoScrollTimer();
                    }
                });
            });

            document.addEventListener('click', () => {
                if (menu) menu.style.display = 'none';
            });
        }

        startAutoScrollTimer() {
            this.stopAutoScrollTimer();
            if (!this.isActive) return;

            // SMART MODE (-1)
            if (this.autoScrollDelay === -1) {
                if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                    // Video: Wait for end
                    const video = this.activeDisplayedMediaElement;
                    this.videoEndedListener = () => {
                        if (!this.isActive) return;
                        const mediaNavigated = this.handleMediaNavigation('next');
                        if (!mediaNavigated) {
                            this.handlePostNavigation('next');
                        }
                    };
                    video.addEventListener('ended', this.videoEndedListener);
                } else {
                    // Image: Wait 3 seconds
                    this.autoScrollTimeoutId = setTimeout(() => {
                        const mediaNavigated = this.handleMediaNavigation('next');
                        if (!mediaNavigated) {
                            this.handlePostNavigation('next');
                        }
                    }, 3000);
                }
            }
            // STANDARD TIMER MODE (> 0)
            else if (this.autoScrollDelay > 0) {
                this.autoScrollTimeoutId = setTimeout(() => {
                    const mediaNavigated = this.handleMediaNavigation('next');
                    if (!mediaNavigated) {
                        this.handlePostNavigation('next');
                    }
                }, this.autoScrollDelay);
            }
        }

        stopAutoScrollTimer() {
            if (this.autoScrollTimeoutId) {
                clearTimeout(this.autoScrollTimeoutId);
                this.autoScrollTimeoutId = null;
            }
            // Cleanup Video Ended Listener
            if (this.videoEndedListener && this.activeDisplayedMediaElement) {
                this.activeDisplayedMediaElement.removeEventListener('ended', this.videoEndedListener);
                this.videoEndedListener = null;
            }
        }

        async toggleLike() {
            if (!this.activePost.element) return;

            this.likeButton.style.transform = 'scale(1.3)';
            this.likeButton.style.filter = 'brightness(1.5)';
            this.likeButton.style.transition = 'transform 0.1s ease-out, filter 0.1s ease-out';

            const likeButton = this.activePost.element.querySelector('[data-testid="like"], [data-testid="unlike"]');
            if (likeButton) {
                likeButton.click();
                await new Promise(resolve => setTimeout(resolve, 250));
                this.updateLikeButtonState();
            }

            setTimeout(() => {
                this.likeButton.style.transform = 'scale(1)';
                this.likeButton.style.filter = 'brightness(1)';
                this.likeButton.style.transition = 'all 0.3s ease';
            }, 200);
        }

        async toggleFollow() {
            if (!this.activePost.element) return;

            const currentMedia = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!currentMedia) return;

            const contextElement = currentMedia.contextElement || this.activePost.element;
            const originalTweetId = this.activePost.id;

            this.savedScrollPosition = window.scrollY;
            this.isReturningFromFollow = true;
            console.log(`Saved scroll position: ${this.savedScrollPosition} for tweet ${originalTweetId}`);

            let userLinkToClick = contextElement.querySelector('[data-testid="User-Name"] a');
            let clickedQuoteCard = false;
            const isMainContext = contextElement === this.activePost.element;

            if (!userLinkToClick && !isMainContext) {
                 console.log("No user link found in context (likely Quote Tweet). Clicking context to navigate to tweet.");
                 userLinkToClick = contextElement.closest('[role="link"]') || contextElement;
                 clickedQuoteCard = true;
            }

            if (!userLinkToClick) {
                 if (isMainContext) {
                     console.warn("Could not find user link in main context.");
                     userLinkToClick = this.activePost.element.querySelector('[data-testid="User-Name"] a');
                 } else {
                     console.warn("Could not find actionable link in Quote Context.");
                 }
            }

            if (!userLinkToClick) {
                console.warn("Could not find user link for follow action.");
                this.isReturningFromFollow = false;
                return;
            }

            console.log(`Navigating... (QuoteCard: ${clickedQuoteCard})`);
            userLinkToClick.click();
            await new Promise(resolve => setTimeout(resolve, 1500));

            let extraDepth = 0;
            if (clickedQuoteCard) {
                 let tweetUserLink = null;
                 let loadAttempts = 0;
                 while (!tweetUserLink && loadAttempts < 20) {
                     tweetUserLink = document.querySelector('article[data-testid="tweet"] [data-testid="User-Name"] a');
                     if (!tweetUserLink) await new Promise(r => setTimeout(r, 200));
                     loadAttempts++;
                 }

                 if (tweetUserLink) {
                     console.log("On Tweet page, clicking profile link...");
                     tweetUserLink.click();
                     await new Promise(resolve => setTimeout(resolve, 1500));
                     extraDepth = 1;
                 } else {
                     console.warn("Could not find profile link on Tweet page.");
                 }
            }

            let followBtn = null;
            let attempts = 0;
            const maxAttempts = 15;
            while (!followBtn && attempts < maxAttempts) {
                followBtn = document.querySelector('[data-testid*="follow"], [aria-label*="Follow"], [aria-label*="Unfollow"]');
                if (!followBtn) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                attempts++;
            }

            if (followBtn) {
                followBtn.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.warn("Follow/Unfollow button not found on profile page.");
            }

            if (clickedQuoteCard && extraDepth > 0) {
                window.history.go(-2);
            } else {
                window.history.back();
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            this.showLoadingIndicator('Restoring feed position...');
            let targetPostElement = null;
            attempts = 0;
            const checkInterval = 200;
            const maxChecks = 25;

            while (!targetPostElement && attempts < maxChecks) {
                targetPostElement = document.querySelector(`article[role="article"] a[href*="/status/${originalTweetId}"]`)?.closest('article[role="article"]');
                if (!targetPostElement) {
                    await new Promise(resolve => setTimeout(resolve, checkInterval));
                }
                attempts++;
            }

            if (targetPostElement) {
                console.log(`Found original tweet element (ID: ${originalTweetId}), re-navigating...`);
                this.navigateToPost(targetPostElement);
            } else {
                console.warn(`Original tweet element (ID: ${originalTweetId}) not found after returning. Falling back to central post.`);
                this.navigateToPost(this.findCentralMediaArticle());
            }

            window.scrollTo(0, this.savedScrollPosition);
            this.hideLoadingIndicator();
            this.isReturningFromFollow = false;
        }

        updateLikeButtonState() {
            if (!this.likeButton || !this.activePost.element) return;
            const likedButton = this.activePost.element.querySelector('[data-testid="unlike"]');
            if (likedButton) {
                this.likeButton.classList.add('liked');
                const heartPath = this.likeButton.querySelector('.heart-path');
                if (heartPath) {
                    heartPath.setAttribute('fill', '#ff1447');
                    heartPath.setAttribute('stroke', '#ff1447');
                }
            } else {
                this.likeButton.classList.remove('liked');
                const heartPath = this.likeButton.querySelector('.heart-path');
                if (heartPath) {
                    heartPath.setAttribute('fill', 'none');
                    heartPath.setAttribute('stroke', 'white');
                }
            }
        }

        updateFollowButtonState() {
            if (!this.followButton || !this.activePost.element) return;

            const currentMedia = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!currentMedia) return;
            const contextElement = currentMedia.contextElement || this.activePost.element;

            let isFollowingTargetAuthor = false;

            const mainAuthorUnfollowBtn = contextElement.querySelector('[data-testid$="-unfollow"]');
            if (mainAuthorUnfollowBtn) {
                isFollowingTargetAuthor = true;
            } else {
                const mainAuthorFollowingText = Array.from(contextElement.querySelectorAll('[data-testid="User-Name"] ~ div button')).some(btn => {
                    const text = btn.textContent.trim();
                    return text === 'Following' || text === 'Unfollow';
                });
                if (mainAuthorFollowingText) {
                    isFollowingTargetAuthor = true;
                }
            }

            if (isFollowingTargetAuthor) {
                this.followButton.classList.add('following');
            } else {
                this.followButton.classList.remove('following');
            }
        }

        updateUI() {
            if (!this.container || !this.activePost || !this.activePost.element) return;

            const currentMedia = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!currentMedia) return;

            const authorName = currentMedia.author || 'Unknown User';
            const authorHandle = currentMedia.handle;
            const tweetText = currentMedia.text || '';

            this.container.querySelector('.info').innerHTML = `<div class="author-name" style="font-weight: 700; font-size: 16px; margin-bottom: 8px; ${authorHandle ? 'cursor: pointer;' : ''}">${authorName}</div><div style="font-size: 14px; line-height: 1.4; opacity: 0.9;">${tweetText}</div>`;

            const authorElement = this.container.querySelector('.author-name');
            if (authorElement && authorHandle) {
                authorElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(`https://x.com/${authorHandle}`, '_blank');
                });
            }

            const galleryIndicator = this.container.querySelector('.gallery-indicator');
            if (this.activePost.mediaItems.length > 1) {
                galleryIndicator.textContent = `${this.activePost.currentMediaIndex + 1} / ${this.activePost.mediaItems.length}`;
                galleryIndicator.style.display = 'block';
                galleryIndicator.style.opacity = '1';

                if (this.galleryIndicatorTimeout) {
                    clearTimeout(this.galleryIndicatorTimeout);
                }

                this.galleryIndicatorTimeout = setTimeout(() => {
                    galleryIndicator.style.opacity = '0';
                }, 1500);
            } else {
                galleryIndicator.style.display = 'none';
            }
            this.updateLikeButtonState();
            this.updateFollowButtonState();
        }

        showLoadingIndicator(message = 'Loading...') {
            if (this.container) {
                const indicator = this.container.querySelector('.loading-indicator');
                if(indicator) { indicator.textContent = message; indicator.style.display = 'block'; }
            }
        }

        hideLoadingIndicator() {
            if (this.container) {
                const indicator = this.container.querySelector('.loading-indicator');
                if(indicator) indicator.style.display = 'none';
            }
        }

        navigateToPost(targetArticleElement) {
            if (!targetArticleElement || this.isNavigating) return;
            this.isNavigating = true;
            this.stopAutoScrollTimer();
            this.restoreOriginalMediaPosition();
            this.showLoadingIndicator('Loading...');

            const postTweetId = this.generateTweetId(targetArticleElement);
            const foundMediaItems = [];
            const addedElements = new Set();

            const extractMetadata = (contextEl, isMain) => {
                let author = 'Unknown User';
                let handle = '';
                let text = '';

                const authorEl = contextEl.querySelector('[data-testid="User-Name"] [dir="ltr"]');
                if (authorEl) {
                    author = authorEl.textContent;
                } else if (isMain) {
                    const mainAuthor = targetArticleElement.querySelector('[data-testid="User-Name"] [dir="ltr"]');
                    if (mainAuthor) author = mainAuthor.textContent;
                }

                const linkEl = contextEl.querySelector('[data-testid="User-Name"] a');
                if (linkEl) {
                    handle = linkEl.getAttribute('href');
                } else if (isMain) {
                    const mainLink = targetArticleElement.querySelector('[data-testid="User-Name"] a');
                    if (mainLink) handle = mainLink.getAttribute('href');
                } else if (!isMain && contextEl.getAttribute('role') === 'link') {
                     const quoteHref = contextEl.getAttribute('href');
                     if (quoteHref) {
                         const match = quoteHref.match(/^\/([^/]+)\/status\//);
                         if (match && match[1]) {
                             handle = '/' + match[1];
                         }
                     }
                }

                if (!handle) {
                     const userInfo = contextEl.querySelector('[data-testid="User-Name"]');
                     if (userInfo) {
                         const content = userInfo.textContent;
                         const match = content.match(/@([a-zA-Z0-9_]+)/);
                         if (match) {
                             handle = '/' + match[1];
                         }
                     }
                }

                if (handle && handle.startsWith('/')) handle = handle.substring(1);

                const textEl = contextEl.querySelector('[data-testid="tweetText"]');
                if (textEl) {
                    if (isMain) {
                        const quoteWrapper = textEl.closest('div[role="link"]');
                        if (quoteWrapper && quoteWrapper !== contextEl && targetArticleElement.contains(quoteWrapper)) {
                        }
                    }
                    text = textEl.textContent;
                }
                return { author, handle, text };
            };

            const resolveContext = (mediaEl) => {
                let current = mediaEl.parentElement;
                while (current && current !== targetArticleElement) {
                    if (current.getAttribute('role') === 'link' && current.querySelector('[data-testid="User-Name"]')) {
                        return current;
                    }
                    current = current.parentElement;
                }
                return targetArticleElement;
            };

            targetArticleElement.querySelectorAll('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img').forEach(mediaEl => {
                if (addedElements.has(mediaEl)) return;

                const contextElement = resolveContext(mediaEl);
                const isMain = contextElement === targetArticleElement;
                const { author, handle, text } = extractMetadata(contextElement, isMain);

                if (mediaEl.tagName === 'VIDEO' && this.isValidMedia(mediaEl)) {
                    foundMediaItems.push({
                        type: 'video',
                        originalElement: mediaEl,
                        src: mediaEl.src,
                        placeholder: null,
                        contextElement: contextElement,
                        author: author,
                        handle: handle,
                        text: text
                    });
                    addedElements.add(mediaEl);
                } else if (mediaEl.tagName === 'IMG' && !mediaEl.src.includes('video_thumb') && this.isValidMedia(mediaEl)) {
                    foundMediaItems.push({
                        type: 'image',
                        originalElement: mediaEl,
                        src: this.getFullQualityImageUrl(mediaEl),
                        placeholder: null,
                        contextElement: contextElement,
                        author: author,
                        handle: handle,
                        text: text
                    });
                    addedElements.add(mediaEl);
                }
            });

            if (foundMediaItems.length === 0) {
                console.warn('No valid media found in the target article, skipping to next.');
                this.isNavigating = false;
                this.hideLoadingIndicator();
                this.handlePostNavigation('next');
                return;
            }

            this.activePost = { id: postTweetId, element: targetArticleElement, mediaItems: foundMediaItems, currentMediaIndex: 0 };
            document.body.style.scrollBehavior = 'auto';
            this.attemptScrollToPost(targetArticleElement);

            setTimeout(() => {
                this.displayCurrentMediaItem();
                this.hideLoadingIndicator();
                this.isNavigating = false;
            }, 650);
        }

        async attemptScrollToPost(element, attempts = 0, maxAttempts = 10, interval = 100) {
            if (!element || attempts >= maxAttempts) {
                console.warn('Failed to scroll post into view after multiple attempts.');
                return;
            }
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, interval));
            if (!this.isElementInViewport(element)) {
                this.attemptScrollToPost(element, attempts + 1, maxAttempts, interval);
            }
        }

        isElementInViewport(el) {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            const margin = 50;
            return (
                rect.top >= -margin &&
                rect.left >= -margin &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + margin &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) + margin
            );
        }

        displayCurrentMediaItem() {
            if (!this.activePost || !this.activePost.mediaItems || this.activePost.mediaItems.length === 0) return;
            this.restoreOriginalMediaPosition();

            const mediaItemToDisplay = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!mediaItemToDisplay) return;

            this.updateUI();

            const mediaWrapper = this.container.querySelector('.media-wrapper');
            mediaWrapper.innerHTML = '';

            if (mediaItemToDisplay.type === 'video') {
                this.displayVideo(mediaItemToDisplay);
            } else {
                this.displayImage(mediaItemToDisplay);
            }

            this.startAutoScrollTimer();
        }

        displayVideo(mediaItem) {
            const mediaWrapper = this.container.querySelector('.media-wrapper');
            const videoElement = mediaItem.originalElement;

            if (!mediaItem.placeholder) {
                const placeholder = document.createElement('div');
                const rect = videoElement.getBoundingClientRect();
                placeholder.style.width = `${rect.width}px`;
                placeholder.style.height = `${rect.height}px`;
                mediaItem.placeholder = placeholder;

                if (videoElement.parentElement) {
                    videoElement.parentElement.replaceChild(placeholder, videoElement);
                }
            }

            this.activeDisplayedMediaElement = videoElement;

            const videoContainer = document.createElement('div');
            videoContainer.className = 'custom-video-container';
            videoContainer.style.cssText = `
                position: relative;
                width: 100%;
                height: 100%;
                background: black;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            `;

            videoElement.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 0;
                display: block;
                background: black;
            `;

            videoElement.loop = false; // Important: Disable loop for Smart Autoscroll to work
            videoElement.muted = true;
            videoElement.controls = false;
            videoElement.volume = this.savedVolume;
            videoElement.playbackRate = this.savedPlaybackRate;

            const controlsOverlay = document.createElement('div');
            controlsOverlay.className = 'video-controls-overlay';
            controlsOverlay.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
                padding: 12px 30px 12px 12px;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: all;
                z-index: 1000010;
            `;

            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `
                width: 100%;
                height: 14px;
                background: transparent;
                border-radius: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                pointer-events: all;
                position: relative;
                display: flex;
                align-items: center;
                padding: 5px 0;
            `;

            const progressBackground = document.createElement('div');
            progressBackground.style.cssText = `
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                position: relative;
            `;

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-fill';
            progressBar.style.cssText = `
                height: 100%;
                background: linear-gradient(90deg, #FF6F61, #E63946);
                border-radius: 3px;
                width: 0%;
                transition: width 0.1s ease;
                position: relative;
            `;

            const progressThumb = document.createElement('div');
            progressThumb.style.cssText = `
                position: absolute;
                right: -5px;
                top: 50%;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: #FF6F61;
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;

            progressBar.appendChild(progressThumb);
            progressBackground.appendChild(progressBar);
            progressContainer.appendChild(progressBackground);

            const controlsContainer = document.createElement('div');
            controlsContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 15px;
                pointer-events: all;
            `;

            const playButton = document.createElement('button');
            playButton.innerHTML = `
                <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
                <svg class="pause-icon" style="display: none;" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
                </svg>
            `;
            playButton.style.cssText = `
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                flex-shrink: 0;
            `;

            const playButtonStyle = document.createElement('style');
            playButtonStyle.textContent = `
                .custom-video-container button:hover { background: rgba(255,255,255,0.25) !important; border-color: rgba(255,255,255,0.4) !important; transform: scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important; }
                .custom-video-container button:active { transform: scale(0.95); }
                .custom-video-container button::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
                .custom-video-container button:hover::before { opacity: 1; }
                .play-icon, .pause-icon { transition: all 0.3s ease; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
                .video-controls-overlay:hover .progress-fill div { opacity: 1; }
                .custom-video-container:hover .video-controls-overlay { opacity: 1; }
            `;
            document.head.appendChild(playButtonStyle);

            const timeDisplay = document.createElement('div');
            timeDisplay.style.cssText = `
                color: white;
                font-size: 11px;
                font-weight: 600;
                min-width: 70px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            `;
            timeDisplay.textContent = '0:00 / 0:00';

            const speedButton = document.createElement('button');
            speedButton.innerHTML = '1.0x';
            speedButton.style.cssText = `
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 12px;
                transition: all 0.3s ease;
                min-width: 42px;
                text-align: center;
                flex-shrink: 0;
                backdrop-filter: blur(10px);
            `;
            speedButton.title = 'Playback Speed';

            const volumeContainer = document.createElement('div');
            volumeContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                margin-left: auto;
                margin-right: 25px;
                flex-shrink: 0;
            `;

            const muteButton = document.createElement('button');
            muteButton.innerHTML = '🔇';
            muteButton.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 14px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.3s ease;
                flex-shrink: 0;
            `;

            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.min = '0';
            volumeSlider.max = '100';
            volumeSlider.step = '1';
            volumeSlider.value = (this.savedVolume * 100).toString();
            volumeSlider.style.cssText = `
                width: 70px;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
                -webkit-appearance: none;
                appearance: none;
                opacity: 0.5;
                flex-shrink: 0;
            `;

            const volumeSliderStyle = document.createElement('style');
            volumeSliderStyle.textContent = `
                .custom-video-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #FF6F61; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                .custom-video-container input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #FF6F61; cursor: pointer; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            `;
            document.head.appendChild(volumeSliderStyle);

            volumeContainer.appendChild(muteButton);
            volumeContainer.appendChild(volumeSlider);

            controlsContainer.appendChild(playButton);
            controlsContainer.appendChild(timeDisplay);
            controlsContainer.appendChild(speedButton);
            controlsContainer.appendChild(volumeContainer);

            controlsOverlay.appendChild(progressContainer);
            controlsOverlay.appendChild(controlsContainer);

            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(controlsOverlay);

            mediaWrapper.appendChild(videoContainer);

            let isDragging = false;

            const updatePlayPauseIcon = () => {
                const playIcon = playButton.querySelector('.play-icon');
                const pauseIcon = playButton.querySelector('.pause-icon');
                if (playIcon && pauseIcon) {
                    if (videoElement.paused) {
                        playIcon.style.display = 'block';
                        pauseIcon.style.display = 'none';
                    } else {
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                    }
                }
            };

            const updateControlsUI = () => {
                muteButton.innerHTML = videoElement.muted ? '🔇' : '🔊';
                volumeSlider.style.opacity = videoElement.muted ? '0.5' : '1';
                volumeSlider.value = (videoElement.volume * 100).toString();
                updatePlayPauseIcon();
            };

            const togglePlayPause = () => {
                if (videoElement.paused) {
                    videoElement.play().catch(err => {
                        console.warn('Play failed:', err);
                        this.attemptVideoPlay(videoElement);
                    });
                } else {
                    videoElement.pause();
                }
            };

            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlayPause();
            });

            videoElement.addEventListener('click', togglePlayPause);

            const toggleMute = () => {
                videoElement.muted = !videoElement.muted;
                this.savedMuted = videoElement.muted;
                localStorage.setItem('xreels_muted', this.savedMuted.toString());
            };

            videoElement.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                toggleMute();
            });

            muteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMute();
            });

            volumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                const newVolume = parseFloat(e.target.value) / 100;
                videoElement.volume = newVolume;
                videoElement.muted = false;

                this.savedVolume = newVolume;
                localStorage.setItem('xreels_volume', this.savedVolume.toString());

                this.savedMuted = false;
                localStorage.setItem('xreels_muted', 'false');

                if (newVolume === 0 && !videoElement.muted) {
                    videoElement.muted = true;
                    this.savedMuted = true;
                    localStorage.setItem('xreels_muted', 'true');
                }
            });

            // UPDATED: Extended speed options
            const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4];
            speedButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentIndex = speedOptions.indexOf(this.savedPlaybackRate);
                const nextIndex = (currentIndex + 1) % speedOptions.length;
                this.savedPlaybackRate = speedOptions[nextIndex];
                videoElement.playbackRate = this.savedPlaybackRate;
                speedButton.innerHTML = this.savedPlaybackRate.toFixed(2) + 'x';
                localStorage.setItem('xreels_playbackRate', this.savedPlaybackRate.toString());
            });

            const updateProgress = () => {
                if (!isDragging && videoElement.duration) {
                    const progress = (videoElement.currentTime / videoElement.duration) * 100;
                    progressBar.style.width = progress + '%';
                }
            };

            const updateTime = () => {
                const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                };

                const current = formatTime(videoElement.currentTime || 0);
                const total = formatTime(videoElement.duration || 0);
                timeDisplay.textContent = `${current} / ${total}`;
            };

            videoElement.addEventListener('timeupdate', () => {
                updateProgress();
                updateTime();
            });

            videoElement.addEventListener('loadedmetadata', () => {
                updateTime();
                videoElement.playbackRate = this.savedPlaybackRate;
            });

            videoElement.addEventListener('loadeddata', () => {
                updateControlsUI();
                videoElement.playbackRate = this.savedPlaybackRate;
            });

            // UPDATED: Aggressive Speed Enforcement
            // Fixes issue where speed resets to 1.0x when videos loop or reload
            const enforceSpeed = () => {
                if (Math.abs(videoElement.playbackRate - this.savedPlaybackRate) > 0.01) {
                    videoElement.playbackRate = this.savedPlaybackRate;
                }
            };
            videoElement.addEventListener('ratechange', enforceSpeed);
            videoElement.addEventListener('playing', enforceSpeed);
            videoElement.addEventListener('play', enforceSpeed);

            const handleProgressClick = (e) => {
                const rect = progressBackground.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (videoElement.duration) {
                    videoElement.currentTime = pos * videoElement.duration;
                }
            };

            progressContainer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isDragging = true;
                handleProgressClick(e);

                const handleMouseMove = (e) => {
                    if (isDragging) {
                        handleProgressClick(e);
                    }
                };

                const handleMouseUp = () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });

            let isHoveringControls = false;
            const controlsHoverZone = 150;
            videoContainer.addEventListener('mousemove', (e) => {
                const rect = videoContainer.getBoundingClientRect();
                const distanceFromBottom = rect.bottom - e.clientY;

                if (distanceFromBottom <= controlsHoverZone) {
                    if (!isHoveringControls) {
                        isHoveringControls = true;
                        controlsOverlay.style.opacity = '1';
                    }
                } else {
                    if (isHoveringControls) {
                        isHoveringControls = false;
                        if (!isDragging) {
                            controlsOverlay.style.opacity = '0';
                        }
                    }
                }
            });
            videoContainer.addEventListener('mouseleave', () => {
                isHoveringControls = false;
                if (!isDragging) {
                    controlsOverlay.style.opacity = '0';
                }
            });

            updateControlsUI();
            videoElement.addEventListener('volumechange', updateControlsUI);
            videoElement.addEventListener('play', updatePlayPauseIcon);
            videoElement.addEventListener('pause', updatePlayPauseIcon);

            videoElement.playbackRate = this.savedPlaybackRate;
            speedButton.innerHTML = this.savedPlaybackRate.toFixed(2) + 'x';

            this.attemptVideoPlay(videoElement);
        }

        async simulateTwitterPlayClick(vidEl) {
            const videoPlayerContainer = vidEl.closest('div[data-testid="videoPlayer"]');
            if (videoPlayerContainer) {
                let playButton = videoPlayerContainer.querySelector(
                    'svg[role="img"][aria-label="Play"], ' +
                    'div[role="button"][tabindex="0"][aria-label*="Play"], ' +
                    'div[data-testid="playButton"], ' +
                    'div[data-testid="SensitiveMediaDisclosure"] button, ' +
                    'div[data-testid="videoPlayer"] > div > div > div[tabindex="0"], ' +
                    'div[data-testid="tweetPhoto"] div[role="button"], ' +
                    '[data-testid="ShyPinButton"], ' +
                    'div[data-testid="play-pause-button"]'
                );

                if (!playButton) {
                    playButton = videoPlayerContainer;
                    console.log('No specific play button found, falling back to clicking video container.');
                }

                if (playButton) {
                    console.log('Attempting to simulate click on Twitter\'s video player button/container:', playButton);
                    playButton.click();
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return true;
                }
            }
            return false;
        }

        async attemptVideoPlay(video) {
            let playAttempts = 0;
            const maxPlayAttempts = 15;
            const attemptInterval = 500;

            while (playAttempts < maxPlayAttempts) {
                if (!this.isActive || this.activeDisplayedMediaElement !== video) {
                    console.log('Video no longer active or feed exited, stopping autoplay attempts.');
                    video.pause();
                    return;
                }

                if (!video.paused && video.muted === this.savedMuted) {
                    console.log('Video is playing with correct mute state. Autoplay successful.');
                    return;
                }

                console.log(`Autoplay attempt ${playAttempts + 1}/${maxPlayAttempts} for video. State: paused=${video.paused}, muted=${video.muted}`);

                if (video.paused) {
                    try {
                        if (video.currentTime >= video.duration - 0.5) {
                            video.currentTime = 0;
                        }
                        video.muted = true;
                        await video.play();
                        console.log('Direct muted play attempt successful.');
                        video.muted = this.savedMuted;
                        video.volume = this.savedVolume;
                        video.playbackRate = this.savedPlaybackRate;
                        video.dispatchEvent(new Event('volumechange'));
                    } catch (error) {
                        console.warn(`Direct play failed (attempt ${playAttempts + 1}):`, error.name, error.message);
                        await this.simulateTwitterPlayClick(video);
                    }
                } else {
                    video.muted = this.savedMuted;
                    video.playbackRate = this.savedPlaybackRate;
                    video.dispatchEvent(new Event('volumechange'));
                }

                playAttempts++;
                await new Promise(resolve => setTimeout(resolve, attemptInterval));
            }

            console.warn('All aggressive autoplay attempts exhausted. Video might require manual interaction.');
            video.controls = true;
            video.muted = this.savedMuted;
            video.volume = this.savedVolume;
            video.playbackRate = this.savedPlaybackRate;
            video.dispatchEvent(new Event('volumechange'));
        }

        displayImage(mediaItem) {
            const mediaWrapper = this.container.querySelector('.media-wrapper');
            const img = document.createElement('img');
            img.src = mediaItem.src;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 0;
                background: black;
            `;
            mediaWrapper.appendChild(img);
            this.activeDisplayedMediaElement = img;
        }

        restoreOriginalMediaPosition() {
            if (this.activeDisplayedMediaElement) {
                if (this.activeDisplayedMediaElement.tagName === 'VIDEO' || this.activeDisplayedMediaElement.tagName === 'IMG') {
                    this.activeDisplayedMediaElement.style.cssText = '';

                    const currentMediaItemObject = this.activePost.mediaItems.find(item => item.originalElement === this.activeDisplayedMediaElement);
                    if (currentMediaItemObject && currentMediaItemObject.placeholder && currentMediaItemObject.placeholder.parentNode) {
                        currentMediaItemObject.placeholder.parentElement.replaceChild(this.activeDisplayedMediaElement, currentMediaItemObject.placeholder);
                    } else if (this.activeDisplayedMediaElement.parentNode) {
                        this.activeDisplayedMediaElement.remove();
                    }
                }
            }
            this.activeDisplayedMediaElement = null;
        }

        handlePostNavigation(direction) {
            if (this.isNavigating) return;

            let nextPostElement = null;
            if (direction === 'prev') {
                nextPostElement = this.findNextMediaArticle(this.activePost.element, true);
            } else {
                nextPostElement = this.findNextMediaArticle(this.activePost.element, false);
            }

            if (nextPostElement) {
                this.navigateToPost(nextPostElement);
            } else {
                this.showLoadingIndicator('No more visible posts. Scrolling to load more...');
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });

                setTimeout(() => {
                    this.hideLoadingIndicator();
                    const newlyLoadedPost = this.findNextMediaArticle(this.activePost.element, false);
                    if (newlyLoadedPost && newlyLoadedPost !== this.activePost.element) {
                        this.navigateToPost(newlyLoadedPost);
                    } else {
                        console.log('No new media posts found after scrolling.');
                    }
                }, 2000);
            }
        }

        handleMediaNavigation(direction) {
            if (this.isNavigating || !this.activePost || !this.activePost.mediaItems || this.activePost.mediaItems.length <= 1) {
                return false;
            }
            let newMediaIndex = this.activePost.currentMediaIndex;
            let mediaNavigated = false;

            if (direction === 'next') {
                if (newMediaIndex < this.activePost.mediaItems.length - 1) {
                    newMediaIndex++;
                    this.activePost.currentMediaIndex = newMediaIndex;
                    this.displayCurrentMediaItem();
                    mediaNavigated = true;
                }
            } else if (direction === 'prev') {
                if (newMediaIndex > 0) {
                    newMediaIndex--;
                    this.activePost.currentMediaIndex = newMediaIndex;
                    this.displayCurrentMediaItem();
                    mediaNavigated = true;
                }
            }
            return mediaNavigated;
        }

        findNextMediaArticle(currentArticle, findPrevious = false) {
            const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            const currentIndex = currentArticle ? allArticles.indexOf(currentArticle) : -1;
            let startIndex = findPrevious ? currentIndex - 1 : currentIndex + 1;
            let endIndex = findPrevious ? -1 : allArticles.length;
            let step = findPrevious ? -1 : 1;

            for (let i = startIndex; findPrevious ? i >= endIndex : i < endIndex; i += step) {
                const article = allArticles[i];
                if (article.querySelector('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img')) {
                    const mediaEls = article.querySelectorAll('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img');
                    for (const el of mediaEls) {
                        if (this.isValidMedia(el)) {
                            return article;
                        }
                    }
                }
            }
            return null;
        }

        findCentralMediaArticle() {
            const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const viewportCenter = viewportHeight / 2;
            let closestArticle = null;
            let minDistance = Infinity;

            for (const article of allArticles) {
                const mediaElements = article.querySelectorAll('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img');
                let hasValidMedia = false;
                for (const el of mediaElements) {
                    if (this.isValidMedia(el)) {
                        hasValidMedia = true;
                        break;
                    }
                }

                if (hasValidMedia) {
                    const rect = article.getBoundingClientRect();
                    if (rect.bottom > 0 && rect.top < viewportHeight) {
                        const articleCenter = rect.top + rect.height / 2;
                        const distance = Math.abs(viewportCenter - articleCenter);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestArticle = article;
                        }
                    }
                }
            }
            return closestArticle;
        }

        getFullQualityImageUrl(imgElement) {
            if (!imgElement || !imgElement.src) return null;
            let src = imgElement.src;
            if (src.includes('pbs.twimg.com/media/')) {
                const url = new URL(src);
                url.searchParams.set('name', 'orig');
                src = url.href;
            }
            return src;
        }

        generateTweetId(tweet) {
            if (!tweet) return null;
            const link = tweet.querySelector('a[href*="/status/"][dir="ltr"], a[href*="/status/"]');
            if (link) {
                const match = link.href.match(/\/status\/(\d+)/);
                if (match && match[1]) return match[1];
            }
            return null;
        }

        isValidMedia(element) {
            if (!element) return false;

            if (element.tagName === 'VIDEO') {
                const container = element.closest('div[data-testid="videoPlayer"]');
                return container && element.readyState >= 0;
            } else if (element.tagName === 'IMG') {
                return element.src && element.src.includes('pbs.twimg.com/media/') && !element.src.includes('video_thumb');
            }
            return false;
        }

        setupEventListeners() {
            if (this.boundHandleWheel) {
                document.removeEventListener('wheel', this.boundHandleWheel, { passive: false, capture: true });
                document.removeEventListener('keydown', this.boundHandleKeydown, { capture: true });
                window.removeEventListener('popstate', this.boundHandlePopState);
            }

            this.boundHandleWheel = this.handleWheel.bind(this);
            this.boundHandleKeydown = this.handleKeydown.bind(this);
            this.boundHandlePopState = this.handlePopState.bind(this);

            document.addEventListener('wheel', this.boundHandleWheel, { passive: false, capture: true });
            document.addEventListener('keydown', this.boundHandleKeydown, { capture: true });
            window.addEventListener('popstate', this.boundHandlePopState);
        }

        handleWheel(e) {
            if (!this.isActive) return;
            e.preventDefault();
            e.stopPropagation();

            if (Date.now() - this.lastScrollTime < 300) return;
            this.lastScrollTime = Date.now();

            const direction = e.deltaY > 0 ? 'next' : 'prev';
            const mediaNavigated = this.handleMediaNavigation(direction);

            if (!mediaNavigated) {
                this.handlePostNavigation(direction);
            }
        }

        handleKeydown(e) {
            if (e.key.toLowerCase() === 'x') {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (this.isActive) {
                    this.exit();
                } else {
                    this.startFeed();
                }
                return;
            }

            if (!this.isActive) {
                return;
            }

            if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                if (e.key.toLowerCase() === 'q') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.exit();
                }
                return;
            }

            if (e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();

                if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                    if (this.activeDisplayedMediaElement.paused) {
                        this.activeDisplayedMediaElement.play();
                    } else {
                        this.activeDisplayedMediaElement.pause();
                    }
                }
                return;
            }

            if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                const video = this.activeDisplayedMediaElement;
                const scrubAmount = 5;

                if (e.key === ',' || e.key === '<') {
                    e.preventDefault();
                    e.stopPropagation();
                    video.currentTime = Math.max(0, video.currentTime - scrubAmount);
                    return;
                } else if (e.key === '.' || e.key === '>') {
                    e.preventDefault();
                    e.stopPropagation();
                    video.currentTime = Math.min(video.duration, video.currentTime + scrubAmount);
                    return;
                }
            }

            const keyMap = {
                'q': () => this.exit(),
                'Q': () => this.exit(),
                'ArrowUp': () => { e.preventDefault(); e.stopPropagation(); this.handlePostNavigation('prev'); },
                'ArrowDown': () => { e.preventDefault(); e.stopPropagation(); this.handlePostNavigation('next'); },
                'ArrowLeft': () => { e.preventDefault(); e.stopPropagation(); this.handleMediaNavigation('prev'); },
                'ArrowRight': () => { e.preventDefault(); e.stopPropagation(); this.handleMediaNavigation('next'); },
                'l': () => { e.preventDefault(); e.stopPropagation(); this.toggleLike(); },
                'L': () => { e.preventDefault(); e.stopPropagation(); this.toggleLike(); },
                'f': () => { e.preventDefault(); e.stopPropagation(); this.toggleFollow(); },
                'F': () => { e.preventDefault(); e.stopPropagation(); this.toggleFollow(); }
            };

            if (keyMap[e.key]) {
                e.preventDefault();
                e.stopImmediatePropagation();
                keyMap[e.key]();
            }
        }

        handlePopState() {
            if (this.isActive && this.isReturningFromFollow) {
                console.log('Popstate detected, returning from follow action.');
                this.hideLoadingIndicator();
                this.isReturningFromFollow = false;
            }
        }

        disconnectObserver() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
                console.log('MutationObserver disconnected.');
            }
        }
    }

    function onReady() {
        if (window.tikTokFeedInstance) {
            console.log('Existing TikTok Feed instance found, cleaning up...');
            if (window.tikTokFeedInstance.boundHandleWheel) {
                document.removeEventListener('wheel', window.tikTokFeedInstance.boundHandleWheel, { passive: false, capture: true });
                document.removeEventListener('keydown', window.tikTokFeedInstance.boundHandleKeydown, { capture: true });
                window.removeEventListener('popstate', window.tikTokFeedInstance.boundHandlePopState);
            }
            if (window.tikTokFeedInstance.isActive) {
                window.tikTokFeedInstance.exit();
            }
            if (window.tikTokFeedInstance.activeDisplayedMediaElement && window.tikTokFeedInstance.activeDisplayedMediaElement.tagName === 'VIDEO') {
                window.tikTokFeedInstance.activeDisplayedMediaElement.pause();
                window.tikTokFeedInstance.activeDisplayedMediaElement.muted = true;
            }

            window.tikTokFeedInstance.disconnectObserver();
            window.tikTokFeedInstance = null;
            console.log('Previous TikTok Feed instance cleaned up.');
        }

        window.tikTokFeedInstance = new TikTokFeed();
        window.tikTokFeedInstance.init();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        onReady();
    } else {
        document.addEventListener('DOMContentLoaded', onReady);
    }
})();