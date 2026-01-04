// ==UserScript==
// @name         YouTube Neon Revolution - Ultimate Futuristic Redesign
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Complete YouTube transformation with neon-red minimalistic UI and infinite futuristic features
// @author       NeonDev
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepageURL  https://github.com/yourusername/youtube-neon-revolution
// @supportURL   https://github.com/yourusername/youtube-neon-revolution/issues
// @downloadURL https://update.greasyfork.org/scripts/537252/YouTube%20Neon%20Revolution%20-%20Ultimate%20Futuristic%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/537252/YouTube%20Neon%20Revolution%20-%20Ultimate%20Futuristic%20Redesign.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Advanced utility functions
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                requestAnimationFrame(check);
            }
        }
        check();
    }

    function createNeonParticles(x, y, count = 30) {
        const colors = ['#ff0040', '#ff0080', '#ff00ff', '#8000ff', '#4000ff', '#0040ff'];
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'neon-particle';
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                box-shadow: 0 0 10px currentColor;
                left: ${x}px;
                top: ${y}px;
            `;
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 200 + 100;
            const gravity = 0.5;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity;
            let life = 1;
            
            function animate() {
                vy += gravity;
                particle.style.left = (parseFloat(particle.style.left) + vx * 0.016) + 'px';
                particle.style.top = (parseFloat(particle.style.top) + vy * 0.016) + 'px';
                life -= 0.02;
                particle.style.opacity = life;
                particle.style.transform = `scale(${life})`;
                
                if (life > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }
            requestAnimationFrame(animate);
        }
    }

    // Inject revolutionary CSS styles
    function injectUltimateStyles() {
        const style = document.createElement('style');
        style.id = 'neon-revolution-styles';
        style.textContent = `
        /* Ultimate Reset & Variables */
        :root {
            --neon-red: #ff0040;
            --neon-red-bright: #ff0080;
            --neon-pink: #ff00ff;
            --neon-purple: #8000ff;
            --neon-blue: #4000ff;
            --neon-cyan: #0040ff;
            --neon-white: #ffffff;
            --bg-ultra-dark: #000000;
            --bg-dark: #0a0a0a;
            --bg-medium: #1a1a1a;
            --glass-bg: rgba(255, 0, 64, 0.05);
            --glass-border: rgba(255, 0, 64, 0.2);
            --text-bright: #ffffff;
            --text-dim: #cccccc;
            --text-faded: #888888;
            
            /* Override all YouTube variables */
            --yt-spec-base-background: var(--bg-ultra-dark) !important;
            --yt-spec-raised-background: var(--bg-dark) !important;
            --yt-spec-menu-background: var(--bg-medium) !important;
            --yt-spec-text-primary: var(--text-bright) !important;
            --yt-spec-text-secondary: var(--text-dim) !important;
            --yt-spec-call-to-action: var(--neon-red) !important;
            --yt-spec-brand-icon-active: var(--neon-red) !important;
            --yt-spec-wordmark-text: var(--neon-red) !important;
        }

        /* Universal Button Neon Glow */
        button, .yt-simple-endpoint, ytd-button-renderer, 
        paper-button, yt-button-renderer, #subscribe-button,
        .ytp-button, ytd-toggle-button-renderer {
            background: linear-gradient(45deg, var(--neon-red), var(--neon-pink)) !important;
            border: 2px solid var(--neon-red) !important;
            border-radius: 25px !important;
            color: var(--neon-white) !important;
            text-shadow: 0 0 10px var(--neon-red) !important;
            box-shadow: 
                0 0 20px rgba(255, 0, 64, 0.5),
                inset 0 0 20px rgba(255, 0, 64, 0.1) !important;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            position: relative !important;
            overflow: hidden !important;
            backdrop-filter: blur(10px) !important;
            font-weight: 600 !important;
            letter-spacing: 0.05em !important;
        }

        button::before, .yt-simple-endpoint::before, ytd-button-renderer::before,
        paper-button::before, yt-button-renderer::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        button:hover, .yt-simple-endpoint:hover, ytd-button-renderer:hover,
        paper-button:hover, yt-button-renderer:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 
                0 0 40px rgba(255, 0, 64, 0.8),
                0 10px 30px rgba(255, 0, 64, 0.3),
                inset 0 0 30px rgba(255, 0, 64, 0.2) !important;
            text-shadow: 0 0 20px var(--neon-red) !important;
        }

        button:hover::before, .yt-simple-endpoint:hover::before {
            left: 100%;
        }

        /* Animated Neon Background Grid */
        html::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 50%, rgba(255, 0, 64, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(128, 0, 255, 0.1) 0%, transparent 50%),
                linear-gradient(rgba(255, 0, 64, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 64, 0.03) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 100% 100%, 50px 50px, 50px 50px;
            animation: 
                backgroundPulse 8s ease-in-out infinite,
                gridDrift 20s linear infinite;
            z-index: -2;
            pointer-events: none;
        }

        html::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                conic-gradient(from 0deg at 50% 50%, 
                    transparent 0deg, 
                    rgba(255, 0, 64, 0.05) 45deg, 
                    transparent 90deg,
                    rgba(255, 0, 255, 0.05) 135deg,
                    transparent 180deg,
                    rgba(128, 0, 255, 0.05) 225deg,
                    transparent 270deg,
                    rgba(64, 0, 255, 0.05) 315deg,
                    transparent 360deg);
            animation: conicRotate 30s linear infinite;
            z-index: -1;
            pointer-events: none;
            opacity: 0.3;
        }

        @keyframes backgroundPulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes gridDrift {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(25px, -25px) rotate(0.5deg); }
            50% { transform: translate(-25px, 25px) rotate(-0.5deg); }
            75% { transform: translate(25px, 25px) rotate(0.3deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes conicRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Revolutionary Body Styling */
        html, body {
            background: var(--bg-ultra-dark) !important;
            color: var(--text-bright) !important;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif !important;
            overflow-x: hidden !important;
            scroll-behavior: smooth !important;
        }

        /* Ultra Minimalistic Header */
        #masthead {
            background: rgba(0, 0, 0, 0.95) !important;
            backdrop-filter: blur(25px) saturate(180%) !important;
            border-bottom: 2px solid var(--neon-red) !important;
            box-shadow: 0 5px 30px rgba(255, 0, 64, 0.3) !important;
            height: 60px !important;
            position: fixed !important;
            z-index: 1000 !important;
        }

        #masthead-container {
            max-width: none !important;
            padding: 0 20px !important;
        }

        /* Futuristic Logo */
        #logo-icon {
            filter: 
                drop-shadow(0 0 20px var(--neon-red))
                drop-shadow(0 0 40px var(--neon-pink))
                hue-rotate(0deg) !important;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            animation: logoBreath 4s ease-in-out infinite !important;
        }

        #logo-icon:hover {
            filter: 
                drop-shadow(0 0 30px var(--neon-red))
                drop-shadow(0 0 60px var(--neon-pink))
                drop-shadow(0 0 90px var(--neon-purple))
                hue-rotate(15deg) !important;
            transform: scale(1.1) rotate(2deg) !important;
        }

        @keyframes logoBreath {
            0%, 100% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
            50% { transform: scale(1.05) rotate(1deg); filter: hue-rotate(5deg); }
        }

        /* Revolutionary Search Bar */
        #center {
            flex-grow: 1 !important;
            max-width: 600px !important;
            margin: 0 40px !important;
        }

        #search-form {
            position: relative !important;
            background: var(--glass-bg) !important;
            border: 2px solid var(--glass-border) !important;
            border-radius: 30px !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            overflow: hidden !important;
            box-shadow: 
                0 8px 32px rgba(255, 0, 64, 0.2),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
        }

        #search-input {
            background: transparent !important;
            border: none !important;
            color: var(--text-bright) !important;
            font-size: 16px !important;
            padding: 12px 20px !important;
            font-weight: 500 !important;
        }

        #search-input::placeholder {
            color: var(--text-faded) !important;
            font-style: italic !important;
        }

        #search-input:focus {
            outline: none !important;
            background: rgba(255, 0, 64, 0.05) !important;
        }

        #search-form:focus-within {
            border-color: var(--neon-red) !important;
            box-shadow: 
                0 0 30px rgba(255, 0, 64, 0.5),
                0 8px 32px rgba(255, 0, 64, 0.3),
                inset 0 0 30px rgba(255, 0, 64, 0.1) !important;
            transform: scale(1.02) !important;
        }

        #search-icon-legacy {
            background: linear-gradient(45deg, var(--neon-red), var(--neon-pink)) !important;
            border: none !important;
            border-radius: 0 25px 25px 0 !important;
            width: 50px !important;
            transition: all 0.3s ease !important;
        }

        #search-icon-legacy:hover {
            background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple)) !important;
            box-shadow: 0 0 25px rgba(255, 0, 64, 0.6) !important;
            transform: translateX(3px) !important;
        }

        /* Minimalistic Sidebar */
        #guide-content {
            background: rgba(0, 0, 0, 0.9) !important;
            backdrop-filter: blur(20px) !important;
            border-right: 2px solid var(--glass-border) !important;
            width: 240px !important;
            padding: 20px 0 !important;
        }

        ytd-guide-entry-renderer {
            margin: 4px 12px !important;
            border-radius: 15px !important;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        ytd-guide-entry-renderer::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 0;
            background: linear-gradient(90deg, var(--neon-red), var(--neon-pink));
            transition: width 0.3s ease;
            z-index: 0;
        }

        ytd-guide-entry-renderer:hover::before {
            width: 4px;
        }

        ytd-guide-entry-renderer:hover {
            background: var(--glass-bg) !important;
            transform: translateX(10px) scale(1.02) !important;
            box-shadow: 
                0 0 20px rgba(255, 0, 64, 0.3),
                inset 0 0 20px rgba(255, 0, 64, 0.1) !important;
        }

        /* Revolutionary Video Cards */
        ytd-rich-item-renderer, ytd-video-renderer {
            background: var(--glass-bg) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 20px !important;
            margin: 15px !important;
            padding: 15px !important;
            backdrop-filter: blur(15px) !important;
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        ytd-rich-item-renderer::before, ytd-video-renderer::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
                from 0deg,
                transparent 340deg,
                var(--neon-red) 360deg
            );
            animation: borderRotate 3s linear infinite;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s;
        }

        ytd-rich-item-renderer:hover::before, ytd-video-renderer:hover::before {
            opacity: 1;
        }

        @keyframes borderRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        ytd-rich-item-renderer:hover, ytd-video-renderer:hover {
            transform: translateY(-10px) scale(1.03) !important;
            box-shadow: 
                0 20px 60px rgba(255, 0, 64, 0.4),
                0 0 0 1px rgba(255, 0, 64, 0.2),
                inset 0 0 30px rgba(255, 0, 64, 0.1) !important;
        }

        /* Futuristic Thumbnails */
        ytd-thumbnail {
            border-radius: 15px !important;
            overflow: hidden !important;
            position: relative !important;
            transition: all 0.4s ease !important;
        }

        ytd-thumbnail::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                135deg,
                rgba(255, 0, 64, 0.1) 0%,
                transparent 30%,
                transparent 70%,
                rgba(255, 0, 255, 0.1) 100%
            );
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        ytd-thumbnail:hover::after {
            opacity: 1;
        }

        ytd-thumbnail img {
            transition: all 0.4s ease !important;
        }

        ytd-thumbnail:hover img {
            transform: scale(1.05) !important;
            filter: brightness(1.2) saturate(1.3) !important;
        }

        /* Glowing Video Titles */
        #video-title {
            color: var(--text-bright) !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
            transition: all 0.3s ease !important;
            text-shadow: none !important;
        }

        #video-title:hover {
            color: var(--neon-red) !important;
            text-shadow: 0 0 15px rgba(255, 0, 64, 0.6) !important;
            transform: translateX(5px) !important;
        }

        /* Channel Info Glow */
        ytd-channel-name a {
            color: var(--text-dim) !important;
            transition: all 0.3s ease !important;
        }

        ytd-channel-name a:hover {
            color: var(--neon-pink) !important;
            text-shadow: 0 0 10px rgba(255, 0, 255, 0.5) !important;
        }

        /* Video Stats */
        #metadata-line {
            color: var(--text-faded) !important;
            font-size: 13px !important;
        }

        /* Revolutionary Video Player */
        .html5-video-player {
            border-radius: 20px !important;
            overflow: hidden !important;
            box-shadow: 
                0 15px 50px rgba(0, 0, 0, 0.5),
                0 0 0 2px rgba(255, 0, 64, 0.3) !important;
            position: relative !important;
        }

        .html5-video-player::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: conic-gradient(
                from 0deg,
                var(--neon-red),
                var(--neon-pink),
                var(--neon-purple),
                var(--neon-blue),
                var(--neon-red)
            );
            border-radius: 22px;
            z-index: -1;
            animation: playerBorderGlow 4s linear infinite;
        }

        @keyframes playerBorderGlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Enhanced Progress Bar */
        .ytp-progress-bar {
            background: linear-gradient(90deg, 
                var(--neon-red) 0%,
                var(--neon-pink) 50%,
                var(--neon-purple) 100%) !important;
            height: 6px !important;
            box-shadow: 0 0 10px rgba(255, 0, 64, 0.5) !important;
        }

        .ytp-progress-bar-container:hover .ytp-progress-bar {
            height: 8px !important;
            box-shadow: 0 0 20px rgba(255, 0, 64, 0.8) !important;
        }

        /* Control Buttons */
        .ytp-button {
            filter: drop-shadow(0 0 5px var(--neon-red)) !important;
            transition: all 0.3s ease !important;
        }

        .ytp-button:hover {
            filter: drop-shadow(0 0 15px var(--neon-red)) !important;
            transform: scale(1.1) !important;
        }

        /* Comments Section */
        #comments {
            background: var(--glass-bg) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 20px !important;
            margin-top: 30px !important;
            padding: 25px !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: 0 10px 40px rgba(255, 0, 64, 0.1) !important;
        }

        /* Like/Dislike Buttons Revolution */
        #segmented-like-button, #segmented-dislike-button {
            background: var(--glass-bg) !important;
            border: 2px solid var(--glass-border) !important;
            border-radius: 25px !important;
            margin: 0 5px !important;
            padding: 8px 16px !important;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            backdrop-filter: blur(10px) !important;
        }

        #segmented-like-button:hover {
            background: rgba(0, 255, 136, 0.1) !important;
            border-color: #00ff88 !important;
            box-shadow: 
                0 0 30px rgba(0, 255, 136, 0.4),
                inset 0 0 20px rgba(0, 255, 136, 0.1) !important;
            transform: translateY(-3px) scale(1.05) !important;
        }

        #segmented-dislike-button:hover {
            background: rgba(255, 0, 64, 0.1) !important;
            border-color: var(--neon-red) !important;
            box-shadow: 
                0 0 30px rgba(255, 0, 64, 0.4),
                inset 0 0 20px rgba(255, 0, 64, 0.1) !important;
            transform: translateY(-3px) scale(1.05) !important;
        }

        /* Subscribe Button Ultimate */
        #subscribe-button {
            background: linear-gradient(45deg, var(--neon-red), var(--neon-pink)) !important;
            border: 2px solid var(--neon-red) !important;
            border-radius: 25px !important;
            padding: 10px 25px !important;
            font-weight: 700 !important;
            letter-spacing: 1px !important;
            text-transform: uppercase !important;
            position: relative !important;
            overflow: hidden !important;
        }

        #subscribe-button::after {
            content: '🔥';
            position: absolute;
            right: -30px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            transition: right 0.3s ease;
        }

        #subscribe-button:hover::after {
            right: 10px;
        }

        /* Notification Bell */
        #notification-count {
            background: linear-gradient(45deg, var(--neon-red), var(--neon-pink)) !important;
            border: 2px solid var(--neon-red) !important;
            animation: bellPulse 2s ease-in-out infinite !important;
            box-shadow: 0 0 20px rgba(255, 0, 64, 0.5) !important;
        }

        @keyframes bellPulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(-5deg); }
            75% { transform: scale(1.1) rotate(5deg); }
        }

        /* Revolutionary Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
            background: var(--bg-dark);
        }

        ::-webkit-scrollbar-track {
            background: linear-gradient(180deg, 
                rgba(255, 0, 64, 0.1) 0%,
                rgba(255, 0, 255, 0.1) 50%,
                rgba(128, 0, 255, 0.1) 100%);
            border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, 
                var(--neon-red) 0%,
                var(--neon-pink) 50%,
                var(--neon-purple) 100%);
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(255, 0, 64, 0.5);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, 
                var(--neon-pink) 0%,
                var(--neon-purple) 50%,
                var(--neon-blue) 100%);
            box-shadow: 0 0 20px rgba(255, 0, 64, 0.8);
        }

        /* Chips/Tags Revolution */
        yt-chip-cloud-chip-renderer {
            background: var(--glass-bg) !important;
            border: 2px solid var(--glass-border) !important;
            border-radius: 20px !important;
            margin: 4px !important;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            backdrop-filter: blur(10px) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        yt-chip-cloud-chip-renderer::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 0, 64, 0.2), 
                transparent);
            transition: left 0.5s ease;
        }

        yt-chip-cloud-chip-renderer:hover::before {
            left: 100%;
        }

        yt-chip-cloud-chip-renderer:hover {
            background: rgba(255, 0, 64, 0.1) !important;
            border-color: var(--neon-red) !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow: 0 10px 25px rgba(255, 0, 64, 0.3) !important;
        }

        /* Menu Dropdowns */
        tp-yt-iron-dropdown, ytd-popup-container {
            background: rgba(0, 0, 0, 0.95) !important;
            backdrop-filter: blur(25px) saturate(180%) !important;
            border: 2px solid var(--glass-border) !important;
            border-radius: 15px !important;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 0, 64, 0.2) !important;
        }

        /* Channel Avatars */
        yt-img-shadow {
            border-radius: 50% !important;
            transition: all 0.4s ease !important;
            position: relative !important;
        }             box-shadow: 
                0 0 30px rgba(255, 0, 64, 0.4),
                0 0 60px rgba(255, 0, 128, 0.2) !important;
        }

        /* Additional animations or elements can be added here in future updates */
        `;
        document.head.appendChild(style);
    }

    // Trigger Neon Confetti on Like Button Click
    function enableLikeConfetti() {
        waitForElement('ytd-toggle-button-renderer#like-button', (likeButton) => {
            likeButton.addEventListener('click', (e) => {
                const rect = likeButton.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                createNeonParticles(x, y, 40);
            });
        });
    }

    // Initialization
    function initNeonRevolution() {
        injectUltimateStyles();
        enableLikeConfetti();
        console.log('%cYouTube Neon Revolution Activated 🚀✨', 'color: #ff0040; font-size: 16px; font-weight: bold;');
    }

    // Wait for DOM to fully load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNeonRevolution);
    } else {
        initNeonRevolution();
    }

})();