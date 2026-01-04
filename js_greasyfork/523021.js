// ==UserScript==
// @name         Wörter-Verwischen-Skript
// @namespace    http://tampermonkey.net/
// @version      3.40
// @description  Blurt Wörter auf Webseiten. Features: Mehrere Treffer, IP-Erkennung, Vollbild und Ausnahmen
// @author       Sky95
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.ipify.org
// @connect      ipapi.co
// @connect      api.my-ip.io
// @connect      icanhazip.com
// @connect      checkip.amazonaws.com
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/523021/W%C3%B6rter-Verwischen-Skript.user.js
// @updateURL https://update.greasyfork.org/scripts/523021/W%C3%B6rter-Verwischen-Skript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let defaultFullPageBlurCheck = GM_getValue('defaultFullPageBlur', false);
    let initialPageBlurStrength = GM_getValue('pageBlurStrength', 10);
    let applyForceInitialBlur = defaultFullPageBlurCheck;

    let exceptionListEarly = GM_getValue('exceptionList', []);
    let earlyMatch = null;
    try {
        const currentUrl = window.location.href;
        const currentHostname = new URL(currentUrl).hostname;
        for (const exception of exceptionListEarly) {
            if (!exception || typeof exception.pattern !== 'string' || typeof exception.mode !== 'string') continue;
            const pattern = exception.pattern;
            if (pattern.endsWith('/*')) {
                const domain = pattern.slice(0, -2);
                if (currentHostname === domain || currentHostname.endsWith('.' + domain)) {
                    earlyMatch = exception;
                    break;
                }
            } else {
                 const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*'));
                 if (regex.test(currentUrl)) {
                     earlyMatch = exception;
                     break;
                 }
            }
        }
    } catch(e) {}

    if (earlyMatch && earlyMatch.mode === 'no_blur') {
        applyForceInitialBlur = false;
    }

    const isMediaFile = () => {
        const path = window.location.pathname.toLowerCase();
        const contentType = document.contentType || '';

        if (contentType.startsWith('image/') ||
            contentType.startsWith('video/') ||
            contentType.startsWith('audio/')) {
            return true;
        }

        if (document.body && document.body.children.length === 1) {
            const firstChild = document.body.children[0];
            if (firstChild.tagName === 'IMG' ||
                firstChild.tagName === 'VIDEO' ||
                firstChild.tagName === 'AUDIO') {
                return true;
            }
        }

        return false;
    };

    if (applyForceInitialBlur && !isMediaFile()) {
        const style = document.createElement('style');
        style.id = 'blur-force-initial-style';
        style.textContent = `
            html.force-initial-blur { filter: blur(${initialPageBlurStrength}px) !important; transition: none !important; }
            html.force-initial-blur * { pointer-events: none !important; }
        `;
        if (document.documentElement) {
             document.documentElement.appendChild(style);
             document.documentElement.classList.add('force-initial-blur');
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                 if(document.documentElement && !isMediaFile()) {
                    document.documentElement.appendChild(style);
                    document.documentElement.classList.add('force-initial-blur');
                 }
            }, { once: true });
        }
    }

    GM_addStyle(`
        .word-blur {
            filter: blur(7.5px);
            transition: filter 1.5s ease;
        }
        .word-blur:hover {
            filter: blur(0px);
            transition-delay: 1s;
        }
        html.full-page-blur {
            filter: blur(10px) !important;
            transition: none !important;
        }
        html.full-page-unblur {
            filter: blur(0px) !important;
            transition: filter 0.5s ease 0.5s !important;
        }
        html.full-page-blur * {
            pointer-events: none !important;
        }
        body {
            max-width: 100% !important;
            overflow-x: hidden !important;
        }
        #blur-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 550px;
            background: #2b2b2b !important;
            color: #fff !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8) !important;
            z-index: 10000;
            display: none;
            font-family: 'Courier New', monospace !important;
            pointer-events: auto !important;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-out;
        }
        #blur-settings-panel.visible {
            opacity: 0.98;
        }
        #blur-section-container {
            max-height: 75vh !important;
            overflow-y: auto !important;
            scrollbar-width: thin !important;
            scrollbar-color: #666 #2b2b2b !important;
        }
        #blur-settings-header {
            padding: 15px 20px !important;
            background: #363636 !important;
            border-radius: 8px 8px 0 0;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #blur-settings-header h3 {
            color: #fff !important;
            font-size: 18px !important;
            font-weight: normal !important;
            font-family: Arial, sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        #blur-text-info, #blur-exception-info {
            padding: 8px 15px !important;
            margin-bottom: 10px !important;
            background: #262626 !important;
            border: 1px solid #406040 !important;
            font-size: 12px !important;
            color: #afa !important;
            line-height: 1.4 !important;
            border-radius: 4px;
        }
         #blur-exception-info {
            border-color: #604060 !important;
            color: #aaf !important;
        }
        #blur-ip-info {
            padding: 5px 20px !important;
            background: #262626 !important;
            font-size: 14px !important;
            color: #aaf !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            pointer-events: auto !important;
            filter: blur(0) !important;
            margin-top: 5px !important;
            border-radius: 4px;
        }
        #blur-ip-display {
            pointer-events: auto !important;
            filter: blur(0) !important;
        }
        #blur-ip-button {
            background: #4CAF50 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 5px 10px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            pointer-events: auto !important;
            filter: blur(0) !important;
        }
        #blur-ip-button:hover {
            background: #388E3C !important;
        }
        #blur-close-button {
            background: none !important;
            border: none !important;
            color: #fff !important;
            cursor: pointer !important;
            font-family: Arial, sans-serif !important;
            font-size: 24px !important;
            padding: 0 !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            text-decoration: none !important;
            outline: none !important;
        }
        #blur-close-button:hover {
            background: rgba(255,255,255,0.1) !important;
            border-radius: 4px !important;
        }
        .blur-section-content {
            padding: 15px 20px !important;
            display: none;
            background: #2b2b2b !important;
        }
        .blur-button-container {
            padding: 15px 20px !important;
            background: #363636 !important;
            border-top: 1px solid #404040 !important;
            display: flex !important;
            justify-content: space-between !important;
            border-radius: 0 0 8px 8px !important;
            gap: 10px !important;
        }
        .blur-button {
            padding: 8px 16px !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-family: 'Courier New', monospace !important;
            font-size: 14px !important;
            outline: none !important;
            width: auto !important;
        }
        .blur-save-button {
            background: #2196F3 !important;
            color: white !important;
        }
        .blur-save-button:hover {
            background: #1976D2 !important;
        }
        .blur-cancel-button {
            background: #666 !important;
            color: white !important;
        }
        .blur-cancel-button:hover {
            background: #555 !important;
        }
        .blur-section {
            margin: 5px 0 !important;
            border-bottom: 1px solid #404040 !important;
            background: #2b2b2b !important;
        }
         .blur-section:last-of-type {
             border-bottom: none !important;
         }
        .blur-section-header {
            padding: 10px 20px !important;
            background: #363636 !important;
            cursor: pointer !important;
            user-select: none !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            color: #fff !important;
            font-size: 14px !important;
            font-weight: bold !important;
        }
        .blur-section-content {
            padding: 15px 20px !important;
            display: none;
            background: #2b2b2b !important;
        }
        .blur-section.expanded .blur-section-content {
            display: block;
        }
        .blur-section-arrow {
            transition: transform 0.3s ease;
            color: #fff !important;
            font-size: 12px !important;
        }
        .blur-section.expanded .blur-section-arrow {
            transform: rotate(180deg);
        }
        .blur-slider-container {
            margin-top: 10px !important;
            display: flex !important;
            align-items: center !important;
            gap: 5px !important;
        }
        .blur-slider-label {
            flex: 1 !important;
            color: #fff !important;
            font-size: 14px !important;
            min-width: 150px;
        }
        .blur-slider {
            flex: 1 !important;
            height: 4px !important;
            max-width: 125px;
            background: #666 !important;
            outline: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            border-radius: 2px !important;
            cursor: pointer;
        }
        .blur-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 16px !important;
            height: 16px !important;
            background: #2196F3 !important;
            border-radius: 50% !important;
            cursor: pointer !important;
        }
        .blur-slider::-moz-range-thumb {
            width: 16px !important;
            height: 16px !important;
            background: #2196F3 !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            border: none !important;
        }
        .blur-slider-value {
            min-width: 45px !important;
            text-align: right !important;
            color: #2196F3 !important;
            font-size: 12px !important;
        }
        #blur-toggle-button {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 14px !important;
            height: 14px !important;
            max-width: 14px !important;
            max-height: 14px !important;
            min-width: 14px !important;
            min-height: 14px !important;
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAACY0lEQVQ4jY3VP4gVVxQG8N+dN+tz1dVVWRMwiQkSEkTBSgurpEqXQkwsrSWQKo2NhYE06dJIugRRk0qIovgHBcHEpAmYgCYQ/LO7havo+nZ1n/v23hT3Ljs8H7t+cGcuw3zfnHPu+c6Ek5bFQRzFG+ji38S5IX6Z5b9DdEN+Ly0S6uX1HMaHZT+DscDWBUbX0j5P+plqHXGG3mfElQTfaexXY2Nga+KtyJOnpMTqx7xoM3WVZ639S4Tv8VWJ+gH24MuGYCjpLVTMY1NiJ3ZXvBl52aETSg0/x+kGea5E1ETCAqYxiQ7aGMJ44HLiSl2IP/SR+8XgOVoYCWxPxEAVUTEa6bR4WONY+dJK+Auj2JJYhzoh5DquD7wd+KDC/RWEvsGOwElcTNwJOd0oC86X9B9FntX4Tj6En7CqT+xbHCnEhcD2mOu4AWtKlE/xd+J64GZViGewb0B0Xy9uphnHP7ideIxeYD4whT9rfm9zp2qQ4wDBNODZQPTKfbEPP8UFrzqnxiUY5r0e7wf2BnZhs9wyQb50Mdfazxf4cYAYuQyrMIFPsCfktU2uYStk0bVop2K9d1fI5khZv4VsvbHECCpIWXAksDmyIZxguMon1X/C/ZiVG7sKuWTRUmM/ivwaOFvjBQ7JfbaIrlebfY1ivcRkoJNoB4YiExU3e9yqq/ypUxUfY4dswzOy8a80FUP2+L3EtcRdDMfskoeJP7o8CCcahGYPFdyzNMJ6cv/dwOmKW7GMr6Gc5dRYccpyaArO4Yk8WcYrJtczN9MYsB+9xoA9ji1ldYsrJhLTs3QP8LL/F/A/amq/lc3UweoAAAAASUVORK5CYII=') !important;
            background-size: cover !important;
            background-color: transparent !important;
            background-repeat: no-repeat !important;
            border: none !important;
            cursor: pointer !important;
            z-index: 9999 !important;
            padding: 0 !important;
            margin: 0 !important;
            outline: none !important;
            pointer-events: auto !important;
            filter: blur(0) !important;
        }
        #blur-toggle-button:hover {
            opacity: 0.8 !important;
        }
        #blur-word-list, #blur-exception-list {
            display: flex !important;
            flex-direction: column !important;
            margin: 0 0 10px 0 !important;
            padding: 0 !important;
            gap: 8px;
        }
        .blur-list-entry {
            display: flex !important;
            gap: 5px !important;
            align-items: center !important;
            background-color: #333;
            padding: 5px;
            border-radius: 4px;
        }
        .blur-list-input {
            flex-grow: 1 !important;
            background: #1e1e1e !important;
            border: 1px solid #404040 !important;
            color: #ffffff !important;
            padding: 8px !important;
            border-radius: 4px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            height: auto !important;
            width: auto !important;
            margin: 0 !important;
            outline: none !important;
            box-shadow: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
            transition: border-color 0.2s ease, filter 0.2s ease !important;
            filter: blur(4px) !important;
        }
        .blur-list-input:focus {
            border-color: #2196F3 !important;
            filter: blur(0) !important;
        }
        .blur-delete-button {
            background: #ff4444 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            width: 30px !important;
            height: 30px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: Arial, sans-serif !important;
            font-size: 20px !important;
            line-height: 1 !important;
            padding: 0 !important;
            margin: 0 !important;
            outline: none !important;
            transition: background-color 0.2s ease !important;
            flex-shrink: 0;
        }
        .blur-delete-button:hover {
            background: #cc0000 !important;
        }
         .blur-exception-mode-select {
            background: #444 !important;
            color: #fff !important;
            border: 1px solid #666 !important;
            border-radius: 4px !important;
            padding: 5px 8px !important;
            font-family: Arial, sans-serif !important;
            font-size: 12px !important;
            height: 30px !important;
            outline: none !important;
            cursor: pointer;
            flex-shrink: 0;
            min-width: 100px;
        }
        .blur-add-button {
            background: #4CAF50 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 8px !important;
            height: 36px !important;
            cursor: pointer !important;
            width: 100% !important;
            margin-top: 5px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 14px !important;
            text-align: center !important;
            outline: none !important;
            transition: background-color 0.2s ease !important;
        }
         .blur-add-current-button {
            background: #007bff !important;
            color: white !important;
            margin-top: 10px !important;
            margin-bottom: 5px !important;
        }
        .blur-add-button:hover, .blur-add-current-button:hover {
            filter: brightness(0.9);
        }
        .blur-option-container {
            padding: 10px !important;
            background: #1e1e1e !important;
            border-radius: 4px !important;
            margin-top: 10px !important;
        }
        .blur-checkbox-label {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            color: #fff !important;
            font-size: 14px !important;
            cursor: pointer !important;
            user-select: none !important;
            padding: 5px;
            border-radius: 3px;
            transition: background-color 0.2s ease;
        }
         .blur-checkbox-label:hover {
             background-color: rgba(255, 255, 255, 0.05);
        }
        .blur-checkbox {
            width: 16px !important;
            height: 16px !important;
            cursor: pointer !important;
            margin: 0 !important;
            flex-shrink: 0;
            bottom: 0px !important;
        }
    `);

    let blurWords = GM_getValue('blurWords', []);
    let exceptionList = GM_getValue('exceptionList', []);
    let userIP = GM_getValue('userIP', '');
    let isFullPageBlurred = false;
    let defaultFullPageBlur = GM_getValue('defaultFullPageBlur', false);
    let autoUnblurAfterProcessing = GM_getValue('autoUnblurAfterProcessing', true);
    let wordBlurStrength = GM_getValue('wordBlurStrength', 7.5);
    let hoverDelay = GM_getValue('hoverDelay', 1.0);
    let pageBlurStrength = GM_getValue('pageBlurStrength', 10);
    let pageUnblurDelay = GM_getValue('pageUnblurDelay', 0.5);
    let pageUnblurSpeed = GM_getValue('pageUnblurSpeed', 0.5);
    let wordunblurTransitionSpeed = GM_getValue('wordunblurTransitionSpeed', 1.5);
    let isIPBlurEnabled = GM_getValue('isIPBlurEnabled', false);
    let smartUnblurEnabled = GM_getValue('smartUnblurEnabled', true);
    let unblurOnScroll = GM_getValue('unblurOnScroll', false);
    let blurNewContent = GM_getValue('blurNewContent', true);
    let quickUnblurKey = GM_getValue('quickUnblurKey', 'q');
    let panicBlurKey = GM_getValue('panicBlurKey', 'p');
    let blurImages = GM_getValue('blurImages', false);
    let imageBlurStrength = GM_getValue('imageBlurStrength', 15);
    let blurVideos = GM_getValue('blurVideos', false);
    let unblurDelay = GM_getValue('unblurDelay', 100);
    let aggressiveUnblur = GM_getValue('aggressiveUnblur', false);
    let clickTimeout = null;
    const processedNodes = new WeakSet();
    let pageMatchesException = null;
    let shouldBlurWordsOnPage = true;
    let shouldInitialBlur = false;
    let manualUnblurListenerActive = false;
    let panelElement = null;
    let xOffset = 0;
    let yOffset = 0;
    let lastScrollTime = 0;
    let scrollUnblurTimeout = null;

    const BATCH_SIZE = 20;
    let initialScanComplete = false;
    let deferredNodes = [];
    let initialProcessingInProgress = false;
    let unblurCheckInterval = null;


    function findMatchingException(url) {
        const currentHostname = new URL(url).hostname;
        for (const exception of exceptionList) {
             if (!exception || typeof exception.pattern !== 'string' || typeof exception.mode !== 'string') continue;
            try {
                 const pattern = exception.pattern;
                if (pattern.endsWith('/*')) {
                    const domain = pattern.slice(0, -2);
                    if (currentHostname === domain || currentHostname.endsWith('.' + domain)) {
                        return exception;
                    }
                } else {
                    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*'));
                    if (regex.test(url)) {
                        return exception;
                    }
                }
            } catch (e) {}
        }
        return null;
    }

    function determineBlurBehavior() {
        if (isMediaFile()) {
            shouldBlurWordsOnPage = false;
            shouldInitialBlur = false;
            return;
        }

        pageMatchesException = findMatchingException(window.location.href);
        shouldBlurWordsOnPage = true;
        shouldInitialBlur = defaultFullPageBlur;

        if (pageMatchesException) {
            switch (pageMatchesException.mode) {
                case 'no_blur':
                    shouldBlurWordsOnPage = false;
                    shouldInitialBlur = false;
                    break;
                case 'click_unblur':
                    shouldBlurWordsOnPage = true;
                    shouldInitialBlur = true;
                    break;
            }
        } else {
            shouldBlurWordsOnPage = true;
            shouldInitialBlur = defaultFullPageBlur;
        }
    }

    function ensureUnblurred() {
        const htmlElement = document.documentElement;
        if (htmlElement) {
            htmlElement.classList.remove('force-initial-blur', 'full-page-blur');
            const forceInitialStyle = document.getElementById('blur-force-initial-style');
            if (forceInitialStyle) {
                forceInitialStyle.remove();
            }
        }

        if (aggressiveUnblur) {
            document.querySelectorAll('.full-page-blur, .force-initial-blur').forEach(el => {
                el.classList.remove('full-page-blur', 'force-initial-blur');
            });

            const style = document.createElement('style');
            style.id = 'aggressive-unblur-style';
            style.textContent = `
                html, body, * {
                    filter: none !important;
                    backdrop-filter: none !important;
                }
            `;
            if (!document.getElementById('aggressive-unblur-style')) {
                document.head.appendChild(style);
                setTimeout(() => {
                    const tempStyle = document.getElementById('aggressive-unblur-style');
                    if (tempStyle) tempStyle.remove();
                }, 1000);
            }
        }
    }

    function smartUnblur() {
        if (!smartUnblurEnabled) return;

        const indicators = [
            () => document.readyState === 'complete',
            () => document.querySelector('body')?.childNodes.length > 10,
            () => performance.now() > 2000,
            () => document.images.length > 0 && Array.from(document.images).some(img => img.complete),
            () => document.querySelectorAll('*').length > 100
        ];

        const passedChecks = indicators.filter(check => check()).length;
        if (passedChecks >= 3) {
            removeFullPageBlur();
            return true;
        }
        return false;
    }

    function setupScrollUnblur() {
        if (!unblurOnScroll) return;

        window.addEventListener('scroll', () => {
            if (isFullPageBlurred) {
                const now = Date.now();
                lastScrollTime = now;

                if (scrollUnblurTimeout) clearTimeout(scrollUnblurTimeout);

                scrollUnblurTimeout = setTimeout(() => {
                    if (Date.now() - lastScrollTime >= 500) {
                        removeFullPageBlur();
                    }
                }, 500);
            }
        }, { passive: true });
    }

    function setupHotkeyUnblur() {
        document.addEventListener('keydown', (e) => {
            if (e.target.matches('input, textarea, [contenteditable="true"]')) return;

            if (e.key.toLowerCase() === quickUnblurKey.toLowerCase() && !e.ctrlKey && !e.altKey) {
                if (isFullPageBlurred) {
                    removeFullPageBlur();
                } else {
                    document.documentElement.classList.add('quick-unblur-all');
                    setTimeout(() => {
                        document.documentElement.classList.remove('quick-unblur-all');
                    }, 3000);
                }
            }

            if (e.key.toLowerCase() === panicBlurKey.toLowerCase() && !e.ctrlKey && !e.altKey) {
                if (!isFullPageBlurred) {
                    applyFullPageBlur();
                    document.documentElement.style.filter = `blur(${pageBlurStrength * 2}px)`;
                }
            }
        });
    }

    function blurMediaElements() {
        if (blurImages) {
            document.querySelectorAll('img').forEach(img => {
                if (!img.dataset.blurred) {
                    img.style.filter = `blur(${imageBlurStrength}px)`;
                    img.style.transition = 'filter 0.5s ease';
                    img.dataset.blurred = 'true';

                    img.addEventListener('mouseenter', () => {
                        img.style.filter = 'blur(0)';
                    });

                    img.addEventListener('mouseleave', () => {
                        img.style.filter = `blur(${imageBlurStrength}px)`;
                    });
                }
            });
        }

        if (blurVideos) {
            document.querySelectorAll('video').forEach(video => {
                if (!video.dataset.blurred) {
                    video.style.filter = `blur(${imageBlurStrength}px)`;
                    video.style.transition = 'filter 0.5s ease';
                    video.dataset.blurred = 'true';

                    video.addEventListener('play', () => {
                        video.style.filter = 'blur(0)';
                    });

                    video.addEventListener('pause', () => {
                        video.style.filter = `blur(${imageBlurStrength}px)`;
                    });
                }
            });
        }
    }

    function startUnblurCheck() {
        if (unblurCheckInterval) return;

        unblurCheckInterval = setInterval(() => {
            if (!isFullPageBlurred && document.documentElement) {
                if (document.documentElement.classList.contains('full-page-blur') ||
                    document.documentElement.classList.contains('force-initial-blur')) {
                    ensureUnblurred();
                }
            }
        }, 100);
    }

    function stopUnblurCheck() {
        if (unblurCheckInterval) {
            clearInterval(unblurCheckInterval);
            unblurCheckInterval = null;
        }
    }

    function removeFullPageBlurClass(useTransition = true) {
         document.documentElement.classList.remove('force-initial-blur');
         if (useTransition) {
             document.documentElement.classList.add('full-page-unblur');
         }
         document.documentElement.classList.remove('full-page-blur');

         setTimeout(() => {
             ensureUnblurred();
         }, 10);
    }

    function applyFullPageBlurClass() {
         document.documentElement.classList.remove('force-initial-blur');
         document.documentElement.classList.remove('full-page-unblur');
         document.documentElement.classList.add('full-page-blur');
    }

    function removeFullPageBlur() {
        if (!isFullPageBlurred) {
            ensureUnblurred();
            return;
        }
        isFullPageBlurred = false;
        removeFullPageBlurClass(true);
        removeManualUnblurListener();
        startUnblurCheck();

        setTimeout(() => {
            ensureUnblurred();
        }, 50);

        setTimeout(() => {
            ensureUnblurred();
        }, 200);
    }

    function applyFullPageBlur() {
        if (isMediaFile()) return;
        if (isFullPageBlurred) return;
        isFullPageBlurred = true;
        stopUnblurCheck();
        applyFullPageBlurClass();
    }

    const manualUnblurHandler = () => {
        removeFullPageBlur();
    };

    function addManualUnblurListener() {
        if (manualUnblurListenerActive || !isFullPageBlurred) return;
        manualUnblurListenerActive = true;
        document.documentElement.addEventListener('click', manualUnblurHandler, { capture: true, once: true });
        document.documentElement.addEventListener('keydown', manualUnblurHandler, { capture: true, once: true });
    }

    function removeManualUnblurListener() {
        if (!manualUnblurListenerActive) return;
        manualUnblurListenerActive = false;
        document.documentElement.removeEventListener('click', manualUnblurHandler, { capture: true, once: true });
        document.documentElement.removeEventListener('keydown', manualUnblurHandler, { capture: true, once: true });
    }

    function checkAndApplyInitialBlurState() {
        if (isMediaFile()) {
            removeFullPageBlurClass(false);
            isFullPageBlurred = false;
            return;
        }

        if (shouldInitialBlur) {
             applyFullPageBlurClass();
             isFullPageBlurred = true;
        } else {
             removeFullPageBlurClass(false);
             isFullPageBlurred = false;
        }
    }

    function checkAndHandlePostProcessingBlurState() {
        if (isMediaFile()) {
            removeFullPageBlur();
            return;
        }

        if (!isFullPageBlurred) {
            startUnblurCheck();
            return;
        }

        let requiresManualUnblur = false;

        if (pageMatchesException) {
            if (pageMatchesException.mode === 'click_unblur') {
                requiresManualUnblur = true;
            } else if (pageMatchesException.mode === 'no_blur'){
                 removeFullPageBlur();
                 return;
            }
        }

        if (!requiresManualUnblur && autoUnblurAfterProcessing) {
             removeFullPageBlur();
        } else if (isFullPageBlurred) {
             addManualUnblurListener();
        }
    }

    function signalInitialScanComplete() {
        if (!initialScanComplete) {
            initialScanComplete = true;

            setTimeout(() => {
                checkAndHandlePostProcessingBlurState();
            }, 10);

            if (deferredNodes.length > 0) {
                const nodesToProcessNow = [...deferredNodes];
                deferredNodes = [];
                processNodes(document.body, nodesToProcessNow);
            }
            activateDelayedFunctionality();
        }
    }

    function toggleFullPageBlur() {
        if (isFullPageBlurred) {
            removeFullPageBlur();
        } else {
            if (isMediaFile()) return;
            if (pageMatchesException && pageMatchesException.mode === 'no_blur') return;
            applyFullPageBlur();
            addManualUnblurListener();
        }
    }

    function updateBlurStyles() {
        GM_addStyle(`
            .word-blur {
                filter: blur(${wordBlurStrength}px) !important;
                transition: filter ${wordunblurTransitionSpeed}s ease !important;
            }
            .word-blur:hover {
                filter: blur(0px) !important;
                transition-delay: ${hoverDelay}s !important;
            }
            html.full-page-blur {
                filter: blur(${pageBlurStrength}px) !important;
                 transition: none !important;
            }
             html.full-page-unblur {
                 filter: blur(0px) !important;
                 transition: filter ${pageUnblurSpeed}s ease ${pageUnblurDelay}s !important;
             }
        `);
    }

    function fetchIP() {
        const ipDisplay = document.getElementById('blur-ip-display');
        if (ipDisplay) {
            ipDisplay.style.filter = 'blur(0)';
            ipDisplay.style.opacity = '0.5';
            ipDisplay.textContent = 'Ermittle IP...';
        }

        const ipAPIs = [
            { url: 'https://api.ipify.org?format=json', parser: (text) => JSON.parse(text).ip },
            { url: 'https://ipapi.co/json/', parser: (text) => JSON.parse(text).ip },
            { url: 'https://api.my-ip.io/v2/ip.json', parser: (text) => JSON.parse(text).ip },
            { url: 'https://api.ipify.org', parser: (text) => text.trim() },
            { url: 'https://icanhazip.com', parser: (text) => text.trim() },
            { url: 'https://checkip.amazonaws.com', parser: (text) => text.trim() }
        ];

        let currentAPIIndex = 0;

        function tryNextAPI() {
            if (currentAPIIndex >= ipAPIs.length) {
                if (ipDisplay) {
                    ipDisplay.textContent = `IP-Ermittlung fehlgeschlagen. (${userIP ? 'Gespeichert: ' + userIP : 'Keine gespeichert'})`;
                    ipDisplay.style.opacity = '1';
                    ipDisplay.style.color = '#f88';
                }
                return;
            }

            const api = ipAPIs[currentAPIIndex];
            currentAPIIndex++;

            GM_xmlhttpRequest({
                method: 'GET',
                url: api.url,
                timeout: 3000,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Cache-Control': 'no-cache'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const newIP = api.parser(response.responseText);
                            if (newIP && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(newIP)) {
                                userIP = newIP;
                                GM_setValue('userIP', userIP);
                                if (ipDisplay) {
                                    ipDisplay.textContent = `Aktuelle IP: ${userIP}`;
                                    ipDisplay.style.opacity = '1';
                                    ipDisplay.style.color = '#aaf';
                                }
                                return;
                            }
                        } catch (e) {}
                    }
                    tryNextAPI();
                },
                onerror: function() {
                    tryNextAPI();
                },
                ontimeout: function() {
                    tryNextAPI();
                }
            });
        }

        tryNextAPI();
    }

     function createWordListEntry(value = '') {
        const entry = document.createElement('div');
        entry.className = 'blur-list-entry';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'blur-list-input';
        input.value = value;
        input.placeholder = 'Wort oder Ausdruck';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'blur-delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => entry.remove();

        entry.appendChild(input);
        entry.appendChild(deleteBtn);

        return entry;
    }

     function createExceptionListEntry(exception = { pattern: '', mode: 'no_blur' }) {
        const entry = document.createElement('div');
        entry.className = 'blur-list-entry';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'blur-list-input';
        input.value = exception.pattern;
        input.placeholder = 'z.B. domain.com/* oder https://seite.de/pfad*';

        const select = document.createElement('select');
        select.className = 'blur-exception-mode-select';
        select.innerHTML = `
            <option value="no_blur" ${exception.mode === 'no_blur' ? 'selected' : ''}>Nicht Bluren</option>
            <option value="click_unblur" ${exception.mode === 'click_unblur' ? 'selected' : ''}>Geblurt lassen</option>
        `;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'blur-delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => entry.remove();

        entry.appendChild(input);
        entry.appendChild(select);
        entry.appendChild(deleteBtn);

        return entry;
    }

    function adjustPanelPosition() {
        if (!panelElement) return;
        const panelRect = panelElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 10;
        let needsAdjustment = false;
        let targetX = xOffset;
        let targetY = yOffset;

        if (panelRect.right > viewportWidth - margin) { targetX = xOffset - (panelRect.right - (viewportWidth - margin)); needsAdjustment = true; }
        if (panelRect.left < margin) { targetX = xOffset + (margin - panelRect.left); needsAdjustment = true; }
        if (panelRect.bottom > viewportHeight - margin) { targetY = yOffset - (panelRect.bottom - (viewportHeight - margin)); needsAdjustment = true; }
        if (panelRect.top < margin) { targetY = yOffset + (margin - panelRect.top); needsAdjustment = true; }

         if (panelRect.right < 0 || panelRect.left > viewportWidth || panelRect.bottom < 0 || panelRect.top > viewportHeight) {
            targetX = 0;
            targetY = 0;
            needsAdjustment = true;
         }

        if (needsAdjustment) {
            panelElement.style.transition = 'transform 0.3s ease-out';
            xOffset = targetX;
            yOffset = targetY;
            panelElement.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
            setTimeout(() => { if (panelElement) panelElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-out'; }, 300);
        }
    }

    function createSettings() {
        panelElement = document.createElement('div');
        panelElement.id = 'blur-settings-panel';
        const version = GM_info.script.version;
        panelElement.innerHTML = `
            <div id="blur-settings-header">
                <h3 style="margin:0">Wörter-Verwischen Einstellungen (v${version})</h3>
                <button id="blur-close-button">×</button>
            </div>

            <div id="blur-section-container">
                 <div id="blur-ip-info">
                    Tipp: Mache ein Doppelkick auf das Einstellungs-Symbol um die Seite zu Bluren. Mit Escape kannst du das Bluren der Seite und das UI wieder Schließen.
                </div>

                <div class="blur-section">
                    <div class="blur-section-header">
                        <span>Allgemeine Einstellungen</span>
                        <span class="blur-section-arrow">▼</span>
                    </div>
                    <div class="blur-section-content">
                        <div id="blur-text-info">
                            Passe hier die Stärke und das Verhalten des Blurs an.
                        </div>
                        <div class="blur-slider-container">
                            <label class="blur-slider-label">Wort Blur-Stärke (5px - 10px)</label>
                            <input type="range" min="5" max="10" step="0.5" value="${wordBlurStrength}" class="blur-slider" id="word-blur-slider">
                            <span class="blur-slider-value">${wordBlurStrength.toFixed(1)}px</span>
                        </div>
                        <div class="blur-slider-container">
                            <label class="blur-slider-label">Hover Verzögerung (0.5s - 1.5s)</label>
                            <input type="range" min="0.5" max="1.5" step="0.1" value="${hoverDelay}" class="blur-slider" id="hover-delay-slider">
                            <span class="blur-slider-value">${hoverDelay.toFixed(1)}s</span>
                        </div>
                        <div class="blur-slider-container">
                            <label class="blur-slider-label">Wort Unblur-Zeit (0.5s - 2.5s)</label>
                            <input type="range" min="0.5" max="2.5" step="0.1" value="${wordunblurTransitionSpeed}" class="blur-slider" id="transition-slider">
                            <span class="blur-slider-value">${wordunblurTransitionSpeed.toFixed(1)}s</span>
                        </div>
                        <div class="blur-option-container">
                            <label class="blur-checkbox-label">
                                <input type="checkbox" class="blur-checkbox" id="blur-default-setting" ${defaultFullPageBlur ? 'checked' : ''}>
                                Seite standardmäßig beim Start blurren
                            </label>
                        </div>
                         <div class="blur-option-container">
                            <label class="blur-checkbox-label">
                                <input type="checkbox" class="blur-checkbox" id="blur-auto-unblur-setting" ${autoUnblurAfterProcessing ? 'checked' : ''}>
                                Seite nach Verarbeiten automatisch entbluren
                            </label>
                        </div>
                        <div class="blur-slider-container">
                            <label class="blur-slider-label">Seiten Blur-Stärke (5px - 15px)</label>
                            <input type="range" min="5" max="15" step="0.5" value="${pageBlurStrength}" class="blur-slider" id="page-blur-slider">
                            <span class="blur-slider-value">${pageBlurStrength.toFixed(1)}px</span>
                        </div>
                         <div class="blur-slider-container">
                            <label class="blur-slider-label">Seiten Unblur-Verzögerung (0.0s - 1.0s)</label>
                            <input type="range" min="0.0" max="1.0" step="0.1" value="${pageUnblurDelay}" class="blur-slider" id="page-unblur-delay-slider">
                            <span class="blur-slider-value">${pageUnblurDelay.toFixed(1)}s</span>
                        </div>
                        <div class="blur-slider-container">
                            <label class="blur-slider-label">Seiten Unblur-Geschw. (0.0s - 1.0s)</label>
                            <input type="range" min="0.0" max="1.0" step="0.1" value="${pageUnblurSpeed}" class="blur-slider" id="page-unblur-speed-slider">
                            <span class="blur-slider-value">${pageUnblurSpeed.toFixed(1)}s</span>
                        </div>
                    </div>
                </div>

                 <div class="blur-section">
                    <div class="blur-section-header">
                        <span>Ausnahme-Einstellungen</span>
                        <span class="blur-section-arrow">▼</span>
                    </div>
                    <div class="blur-section-content">
                         <div id="blur-exception-info">
                            Definiere Seiten (Domains oder URLs mit *), die speziell behandelt werden sollen. Wähle pro Eintrag, ob die Seite gar nicht oder nur initial geblurrt werden soll (Klick/Taste zum Aufheben).
                        </div>
                        <button class="blur-add-button blur-add-current-button" id="blur-add-current-site">Aktuelle Domain hinzufügen (domain.com/*)</button>
                        <div id="blur-exception-list"></div>
                        <button class="blur-add-button" id="blur-add-exception">+ Neue Ausnahme hinzufügen</button>
                    </div>
                </div>

                <div class="blur-section">
                    <div class="blur-section-header">
                        <span>IP-Einstellungen</span>
                        <span class="blur-section-arrow">▼</span>
                    </div>
                    <div class="blur-section-content">
                        <div id="blur-text-info">
                            Ermittel erst deine IP und aktiviere die Option, wenn du sie automatisch mitblurren möchtest.<br>Die Ermittlung muss manuell angestoßen werden!
                        </div>
                        <div id="blur-ip-info">
                            <span id="blur-ip-display">Aktuelle IP: ${userIP || 'Nicht ermittelt'}</span>
                            <button id="blur-ip-button">IP ermitteln</button>
                        </div>
                        <div class="blur-option-container">
                            <label class="blur-checkbox-label">
                                <input type="checkbox" class="blur-checkbox" id="ip-blur-setting" ${isIPBlurEnabled ? 'checked' : ''}>
                                Ermittelte IP automatisch mitblurren
                            </label>
                        </div>
                    </div>
                </div>

                <div class="blur-section">
                    <div class="blur-section-header">
                        <span>Wortliste</span>
                        <span class="blur-section-arrow">▼</span>
                    </div>
                    <div class="blur-section-content">
                        <div id="blur-text-info">
                            Füge hier Wörter oder Ausdrücke hinzu, die geblurrt werden sollen.<br>Nur ein Eintrag pro Feld! Groß-/Kleinschreibung wird ignoriert.
                        </div>
                        <div id="blur-word-list"></div>
                        <button class="blur-add-button" id="blur-add-word">+ Neues Wort hinzufügen</button>
                    </div>
                </div>
            </div>

            <div class="blur-button-container">
                <button class="blur-button blur-cancel-button" id="blur-cancel">Abbrechen</button>
                <button class="blur-button blur-save-button" id="blur-save">Speichern & Neu laden</button>
            </div>
        `;

        document.body.appendChild(panelElement);

        const wordListContainer = panelElement.querySelector('#blur-word-list');
        const exceptionListContainer = panelElement.querySelector('#blur-exception-list');
        const addWordButton = panelElement.querySelector('#blur-add-word');
        const addExceptionButton = panelElement.querySelector('#blur-add-exception');
        const addCurrentSiteButton = panelElement.querySelector('#blur-add-current-site');
        const ipButton = panelElement.querySelector('#blur-ip-button');
        const sections = panelElement.querySelectorAll('.blur-section');

        sections.forEach(section => {
            const header = section.querySelector('.blur-section-header');
            header.addEventListener('click', () => {
                const wasExpanded = section.classList.contains('expanded');
                if (!wasExpanded) {
                    section.classList.add('expanded');
                } else {
                     section.classList.remove('expanded');
                }
            });
        });

        const sliders = panelElement.querySelectorAll('.blur-slider');
        sliders.forEach(slider => {
            const valueDisplay = slider.nextElementSibling;
            const isTime = slider.id.includes('delay') || slider.id.includes('transition') || slider.id.includes('speed');
            const unit = isTime ? 's' : 'px';
            slider.addEventListener('input', () => {
                valueDisplay.textContent = `${parseFloat(slider.value).toFixed(1)}${unit}`;
            });
             valueDisplay.textContent = `${parseFloat(slider.value).toFixed(1)}${unit}`;
        });

        addWordButton.onclick = () => {
            wordListContainer.appendChild(createWordListEntry());
            wordListContainer.lastElementChild?.querySelector('input')?.focus();
        };

        addExceptionButton.onclick = () => {
            exceptionListContainer.appendChild(createExceptionListEntry());
             exceptionListContainer.lastElementChild?.querySelector('input')?.focus();
        };

        addCurrentSiteButton.onclick = () => {
             const hostname = window.location.hostname;
             if (hostname) {
                const pattern = `${hostname}/*`;
                 const inputs = exceptionListContainer.querySelectorAll('.blur-list-input');
                 const exists = Array.from(inputs).some(input => input.value.trim() === pattern);
                 if (!exists) {
                    exceptionListContainer.appendChild(createExceptionListEntry({ pattern: pattern, mode: 'no_blur' }));
                    exceptionListContainer.lastElementChild?.querySelector('input')?.focus();
                 } else {}
             }
         };

        ipButton.onclick = fetchIP;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'blur-toggle-button';
        document.body.appendChild(toggleBtn);

        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        const dragStart = (e) => {
            if (e.target.closest('#blur-settings-header')) {
                 initialX = e.clientX - xOffset;
                 initialY = e.clientY - yOffset;
                 isDragging = true;
                 if (panelElement) panelElement.style.transition = 'none';
            }
        };

        const drag = (e) => {
            if (isDragging && panelElement) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                panelElement.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
            }
        };

        const dragEnd = () => {
            if (isDragging) {
                isDragging = false;
                 if (panelElement) panelElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-out';
                 adjustPanelPosition();
            }
        };

         window.addEventListener('resize', adjustPanelPosition);

        document.addEventListener('mousedown', dragStart, false);
        document.addEventListener('mousemove', drag, false);
        document.addEventListener('mouseup', dragEnd, false);
         document.addEventListener('mouseleave', dragEnd, false);

        window.showPanel = function showPanel() {
            if (!panelElement) return;
            panelElement.style.display = 'block';
             panelElement.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
            setTimeout(() => panelElement.classList.add('visible'), 10);

            wordListContainer.innerHTML = '';
            blurWords.forEach(word => wordListContainer.appendChild(createWordListEntry(word)));

            exceptionListContainer.innerHTML = '';
            exceptionList.forEach(exception => exceptionListContainer.appendChild(createExceptionListEntry(exception)));

             const ipDisplay = panelElement.querySelector('#blur-ip-display');
             if (ipDisplay) ipDisplay.textContent = `Aktuelle IP: ${userIP || 'Nicht ermittelt'}`;
             const autoUnblurCheckbox = panelElement.querySelector('#blur-auto-unblur-setting');
             if (autoUnblurCheckbox) autoUnblurCheckbox.checked = autoUnblurAfterProcessing;
             const defaultBlurCheckbox = panelElement.querySelector('#blur-default-setting');
             if (defaultBlurCheckbox) defaultBlurCheckbox.checked = defaultFullPageBlur;
        }

        window.hidePanel = function hidePanel() {
             if (!panelElement) return;
            panelElement.classList.remove('visible');
            setTimeout(() => panelElement.style.display = 'none', 300);
        }

        function handleClick() {
            if (clickTimeout !== null) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
                toggleFullPageBlur();
            } else {
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    window.showPanel();
                }, 250);
            }
        }

        function saveSettings() {
             if (!panelElement) return;
            const wordInputs = panelElement.querySelectorAll('#blur-word-list .blur-list-input');
            const newWords = [...new Set([...wordInputs].map(input => input.value.trim()).filter(w => w))];

            const newExceptions = [];
             const exceptionEntries = panelElement.querySelectorAll('#blur-exception-list .blur-list-entry');
             exceptionEntries.forEach(entry => {
                 const patternInput = entry.querySelector('.blur-list-input');
                 const modeSelect = entry.querySelector('.blur-exception-mode-select');
                 const pattern = patternInput?.value.trim();
                 const mode = modeSelect?.value;
                 if (pattern && mode) {
                     newExceptions.push({ pattern: pattern, mode: mode });
                 }
             });

            const pageBlurSlider = panelElement.querySelector('#page-blur-slider');
            const wordBlurSlider = panelElement.querySelector('#word-blur-slider');
            const hoverDelaySlider = panelElement.querySelector('#hover-delay-slider');
            const transitionSlider = panelElement.querySelector('#transition-slider');
            const pageUnblurDelaySlider = panelElement.querySelector('#page-unblur-delay-slider');
            const pageUnblurSpeedSlider = panelElement.querySelector('#page-unblur-speed-slider');
            const defaultBlurCheckbox = panelElement.querySelector('#blur-default-setting');
            const autoUnblurCheckbox = panelElement.querySelector('#blur-auto-unblur-setting');
            const ipBlurCheckbox = panelElement.querySelector('#ip-blur-setting');

            pageBlurStrength = parseFloat(pageBlurSlider.value);
            wordBlurStrength = parseFloat(wordBlurSlider.value);
            hoverDelay = parseFloat(hoverDelaySlider.value);
            wordunblurTransitionSpeed = parseFloat(transitionSlider.value);
            pageUnblurDelay = parseFloat(pageUnblurDelaySlider.value);
            pageUnblurSpeed = parseFloat(pageUnblurSpeedSlider.value);
            defaultFullPageBlur = defaultBlurCheckbox.checked;
            autoUnblurAfterProcessing = autoUnblurCheckbox.checked;
            isIPBlurEnabled = ipBlurCheckbox.checked;

            GM_setValue('blurWords', newWords);
            GM_setValue('exceptionList', newExceptions);
            GM_setValue('hoverDelay', hoverDelay);
            GM_setValue('pageBlurStrength', pageBlurStrength);
            GM_setValue('pageUnblurDelay', pageUnblurDelay);
            GM_setValue('pageUnblurSpeed', pageUnblurSpeed);
            GM_setValue('wordBlurStrength', wordBlurStrength);
            GM_setValue('wordunblurTransitionSpeed', wordunblurTransitionSpeed);
            GM_setValue('defaultFullPageBlur', defaultFullPageBlur);
            GM_setValue('autoUnblurAfterProcessing', autoUnblurAfterProcessing);
            GM_setValue('isIPBlurEnabled', isIPBlurEnabled);

            window.hidePanel();
            location.reload();
        }

        function handleKeyPress(e) {
            if (e.key === 'Escape') {
                 if (panelElement && panelElement.style.display === 'block' && panelElement.classList.contains('visible')) {
                    window.hidePanel();
                 } else if (isFullPageBlurred && !manualUnblurListenerActive) {
                     removeFullPageBlur();
                 }
            }
        }

        toggleBtn.addEventListener('click', handleClick);
        panelElement.querySelector('#blur-close-button').addEventListener('click', window.hidePanel);
        panelElement.querySelector('#blur-cancel').addEventListener('click', window.hidePanel);
        panelElement.querySelector('#blur-save').addEventListener('click', saveSettings);
        document.addEventListener('keydown', handleKeyPress);
    }

    function findBlurPositions(text) {
        const positions = [];
        blurWords.forEach(word => {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedWord, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                positions.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    word: match[0]
                });
            }
        });

        if (isIPBlurEnabled && userIP) {
            const ipRegex = new RegExp(userIP.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            let match;
            while ((match = ipRegex.exec(text)) !== null) {
                positions.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    word: match[0]
                });
            }
        }

        positions.sort((a, b) => a.start - b.start);
        const mergedPositions = [];
        let current = null;

        for (const pos of positions) {
            if (!current) {
                current = {...pos};
            } else if (pos.start <= current.end) {
                current.end = Math.max(current.end, pos.end);
                current.word = text.slice(current.start, current.end);
            } else {
                mergedPositions.push(current);
                current = {...pos};
            }
        }
        if (current) {
            mergedPositions.push(current);
        }
        return mergedPositions;
    }

    function isProcessed(node) {
        if (!node) return true;
        if (!node.parentElement) return false;
        const isInput = node.parentElement.closest('input, textarea, [contenteditable="true"]');
        if (isInput) return true;
        const isBlurSettings = node.parentElement.closest('#blur-settings-panel, #blur-ip-display');
        if (isBlurSettings) return true;
        return processedNodes.has(node) ||
               node.parentElement.classList.contains('word-blur') ||
               node.parentElement.hasAttribute('data-blurred');
    }

    function blurText(node) {
        if (!shouldBlurWordsOnPage || isProcessed(node)) return;

        const text = node.textContent;
        if (!text || !text.trim()) {
            processedNodes.add(node);
            return;
        }

        const positions = findBlurPositions(text);
        if (positions.length === 0) {
            processedNodes.add(node);
            return;
        }

        const container = document.createElement('span');
        container.setAttribute('data-blurred', 'true');
        let lastIndex = 0;

        positions.forEach(pos => {
            if (pos.start > lastIndex) {
                container.appendChild(document.createTextNode(
                    text.slice(lastIndex, pos.start)
                ));
            }
            const blurSpan = document.createElement('span');
            blurSpan.className = 'word-blur';
            blurSpan.textContent = pos.word;
            container.appendChild(blurSpan);
            lastIndex = pos.end;
        });

        if (lastIndex < text.length) {
            container.appendChild(document.createTextNode(
                text.slice(lastIndex)
            ));
        }

        try {
            if (node.parentNode) {
                node.parentNode.replaceChild(container, node);
                processedNodes.add(container);
            } else {
                processedNodes.add(node);
            }
        } catch (e) {
            processedNodes.add(node);
        }
    }

    function isElementInViewport(el) {
        if (!el || typeof el.getBoundingClientRect !== 'function') return false;
        if (!el.offsetParent && el.offsetWidth === 0 && el.offsetHeight === 0 && !el.closest('svg')) {
            return false;
        }
        const rect = el.getBoundingClientRect();
        return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
            rect.bottom > 0 &&
            rect.right > 0
        );
    }

    function getBlurrableParent(node) {
        if (!node || !node.parentElement) return null;
        return node.parentElement.closest('p, div, span, li, td, th, h1, h2, h3, h4, h5, h6, a, pre, code, body') || node.parentElement;
    }


    function processBatch(nodes, startIndex, isInitialScan) {
        if (isInitialScan && initialProcessingInProgress === false && startIndex === 0) {
            initialProcessingInProgress = true;
        }

        const nodesToProcessThisBatch = [];
        let currentIndex = startIndex;

        while (currentIndex < nodes.length && nodesToProcessThisBatch.length < BATCH_SIZE) {
            const node = nodes[currentIndex];
            nodesToProcessThisBatch.push(node);
            currentIndex++;
        }

        nodesToProcessThisBatch.forEach(node => {
            try {
                blurText(node);
            } catch (e) {}
        });

        if (currentIndex < nodes.length) {
            requestAnimationFrame(() => processBatch(nodes, currentIndex, isInitialScan));
        } else {
            if (isInitialScan) {
                initialProcessingInProgress = false;
                signalInitialScanComplete();
            }
        }
    }

    function processNodes(root, customNodes = null) {
        if (!shouldBlurWordsOnPage) return;

        let nodesToWalk = [];
        if (customNodes) {
            nodesToWalk = customNodes;
        } else {
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        if (!node.textContent || node.textContent.trim() === '') return NodeFilter.FILTER_REJECT;
                        if (node.parentElement?.nodeName === 'SCRIPT' ||
                            node.parentElement?.nodeName === 'STYLE' ||
                            node.parentElement?.nodeName === 'NOSCRIPT') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (node.parentElement?.closest('#blur-settings-panel, #blur-ip-display, #blur-toggle-button')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (node.parentElement?.closest('input, textarea, [contenteditable="true"]')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (isProcessed(node)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            try {
                let currentNode;
                while (currentNode = walker.nextNode()) {
                    nodesToWalk.push(currentNode);
                }
            } catch (e) {}
        }

        if (nodesToWalk.length > 0) {
            processBatch(nodesToWalk, 0, root === document.body && !initialScanComplete);
        } else {
             if (root === document.body && !initialScanComplete) {
                 signalInitialScanComplete();
            }
        }
    }

    function processInitialDocumentScan() {
        if (isMediaFile()) {
            signalInitialScanComplete();
            return;
        }

        if (!shouldBlurWordsOnPage) {
            signalInitialScanComplete();
            return;
        }

        let allTextNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    if (!node.textContent || node.textContent.trim() === '') return NodeFilter.FILTER_REJECT;
                    if (node.parentElement?.nodeName === 'SCRIPT' ||
                        node.parentElement?.nodeName === 'STYLE' ||
                        node.parentElement?.nodeName === 'NOSCRIPT') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (node.parentElement?.closest('#blur-settings-panel, #blur-ip-display, #blur-toggle-button')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (node.parentElement?.closest('input, textarea, [contenteditable="true"]')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        try {
            let currentNode;
            while (currentNode = walker.nextNode()) {
                allTextNodes.push(currentNode);
            }
        } catch (e) {}

        const visibleNodes = [];
        deferredNodes = [];

        for (const node of allTextNodes) {
            const blurrableParent = getBlurrableParent(node);
            if (blurrableParent && isElementInViewport(blurrableParent)) {
                visibleNodes.push(node);
            } else {
                deferredNodes.push(node);
            }
        }

        if (visibleNodes.length > 0) {
            processBatch(visibleNodes, 0, true);
        } else {
            signalInitialScanComplete();
        }
    }


    const observer = new MutationObserver((mutations) => {
        if (!shouldBlurWordsOnPage) return;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.closest && node.closest('#blur-settings-panel')) return;
                        processNodes(node);
                    } else if (node.nodeType === Node.TEXT_NODE) {
                         if (!isProcessed(node) && !node.parentElement?.closest('input, textarea, [contenteditable="true"], #blur-settings-panel')) {
                            blurText(node);
                         }
                    }
                });
            } else if (mutation.type === 'characterData') {
                 if (mutation.target.parentElement?.closest('#blur-settings-panel')) return;
                 if (!isProcessed(mutation.target)) {
                    blurText(mutation.target);
                 }
            }
            else if (mutation.type === 'attributes') {
                const target = mutation.target;
                if (target.nodeType === Node.ELEMENT_NODE &&
                    !target.closest('#blur-settings-panel') &&
                    (mutation.attributeName === 'style' ||
                     mutation.attributeName === 'class' ||
                     mutation.attributeName === 'aria-expanded')) {
                    if (initialScanComplete) {
                        requestAnimationFrame(() => {
                            if (document.contains(target)) {
                                processNodes(target);
                            }
                        });
                    }
                }
            }
        }
    });

    function activateDelayedFunctionality() {
        if (document.body) {
             observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
                attributeFilter: ['style', 'class', 'aria-expanded', 'data-active', 'data-open', 'data-visible']
            });

            document.addEventListener('click', (e) => {
                requestAnimationFrame(() => {
                    const dropdowns = document.querySelectorAll('div[style*="position:absolute"], div[style*="visibility:visible"], div[role="menu"][aria-hidden="false"], div[role="menu"], div[aria-expanded="true"]');
                    dropdowns.forEach(dropdown => {
                         if (!dropdown.closest('#blur-settings-panel')) processNodes(dropdown);
                    });
                });
            }, true);

            document.addEventListener('mouseover', () => {
                requestAnimationFrame(() => {
                    const visibleDropdowns = document.querySelectorAll('div[style*="position:absolute"]:not([style*="display:none"]), div[style*="visibility:visible"]');
                    visibleDropdowns.forEach(dropdown => {
                         if (!dropdown.closest('#blur-settings-panel')) processNodes(dropdown);
                    });
                });
            }, true);
        }

        if (!isFullPageBlurred && !isMediaFile()) {
            startUnblurCheck();
        }
    }


    function init() {
         determineBlurBehavior();
         checkAndApplyInitialBlurState();
         createSettings();

         if (shouldBlurWordsOnPage) {
            if (document.body) {
                processInitialDocumentScan();
            } else {
                 const bodyObserver = new MutationObserver(() => {
                     if (document.body) {
                         processInitialDocumentScan();
                         bodyObserver.disconnect();
                     }
                 });
                 bodyObserver.observe(document.documentElement, { childList: true });
            }
         } else {
            signalInitialScanComplete();
         }

         updateBlurStyles();

         GM_registerMenuCommand('Blur-Einstellungen öffnen', () => {
            const panel = document.getElementById('blur-settings-panel');
             if(panel && panel.style.display !== 'block') {
                 if (window.showPanel) window.showPanel();
             } else if (panel) {
                 if (window.hidePanel) window.hidePanel();
             }
         });
     }

    if (document.readyState === 'loading' || document.readyState === 'interactive') {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(init));
    } else {
         requestAnimationFrame(init);
    }
})();