// ==UserScript==
// @name         Spotify Multi-View Redesign - Apple/Terminal/Windows/Minimal
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Multiple view modes: Apple glassmorphism, Terminal CLI, Windows Fluent, Ultra-minimal seamless
// @author       You
// @match        https://open.spotify.com/*
// @license        MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538708/Spotify%20Multi-View%20Redesign%20-%20AppleTerminalWindowsMinimal.user.js
// @updateURL https://update.greasyfork.org/scripts/538708/Spotify%20Multi-View%20Redesign%20-%20AppleTerminalWindowsMinimal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let currentView = 'apple'; // apple, terminal, windows, minimal
    let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let scrollY = 0;
    let ticking = false;
    
    // View switcher UI - Enhanced with better styling and immediate activation
    function createViewSwitcher() {
        const switcher = document.createElement('div');
        switcher.id = 'view-switcher';
        switcher.innerHTML = `
            <div class="switcher-header">
                <span class="switcher-title">🎨 View Mode</span>
                <button class="switcher-toggle">⚙️</button>
            </div>
            <div class="view-buttons">
                <button data-view="apple" class="view-btn active" title="Apple Glassmorphism">
                    <span class="btn-icon">🍎</span>
                    <span class="btn-text">Apple</span>
                </button>
                <button data-view="terminal" class="view-btn" title="Terminal CLI Style">
                    <span class="btn-icon">⌨️</span>
                    <span class="btn-text">Terminal</span>
                </button>
                <button data-view="windows" class="view-btn" title="Windows Fluent Design">
                    <span class="btn-icon">🪟</span>
                    <span class="btn-text">Windows</span>
                </button>
                <button data-view="minimal" class="view-btn" title="Ultra-Minimal Seamless">
                    <span class="btn-icon">✨</span>
                    <span class="btn-text">Minimal</span>
                </button>
            </div>
        `;
        document.body.appendChild(switcher);
        
        // Toggle switcher visibility
        const toggle = switcher.querySelector('.switcher-toggle');
        const buttons = switcher.querySelector('.view-buttons');
        let isExpanded = true;
        
        toggle.addEventListener('click', () => {
            isExpanded = !isExpanded;
            buttons.style.display = isExpanded ? 'flex' : 'none';
            toggle.textContent = isExpanded ? '⚙️' : '🎨';
            switcher.classList.toggle('collapsed', !isExpanded);
        });
        
        // View switching
        switcher.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const btn = e.target.closest('.view-btn');
                const view = btn.dataset.view;
                
                switchView(view);
                
                // Update active state
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Store preference
                localStorage.setItem('spotify-preferred-view', view);
                
                // Show notification
                showViewNotification(view);
            }
        });
        
        // Auto-collapse after 3 seconds
        setTimeout(() => {
            if (isExpanded) {
                toggle.click();
            }
        }, 3000);
    }
    
    // View change notification
    function showViewNotification(view) {
        const notification = document.createElement('div');
        notification.className = 'view-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getViewIcon(view)}</span>
                <span class="notification-text">Switched to ${getViewName(view)} mode</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    function getViewIcon(view) {
        const icons = { apple: '🍎', terminal: '⌨️', windows: '🪟', minimal: '✨' };
        return icons[view] || '🎨';
    }
    
    function getViewName(view) {
        const names = { apple: 'Apple', terminal: 'Terminal', windows: 'Windows', minimal: 'Minimal' };
        return names[view] || 'Default';
    }
    
    function switchView(view) {
        currentView = view;
        document.body.className = `spotify-${view}-view`;
        updateStyles();
    }
    
    function updateStyles() {
        // Remove existing style
        const existingStyle = document.querySelector('#spotify-redesign-style');
        if (existingStyle) existingStyle.remove();
        
        const style = document.createElement('style');
        style.id = 'spotify-redesign-style';
        style.textContent = getViewStyles();
        document.head.appendChild(style);
    }
    
    function getViewStyles() {
        const baseStyles = `
            /* Enhanced View Switcher */
            #view-switcher {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(30px);
                border-radius: 20px;
                padding: 0;
                border: 1px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                min-width: 200px;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                overflow: hidden;
            }
            
            #view-switcher.collapsed {
                min-width: auto;
            }
            
            .switcher-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .switcher-title {
                color: #fff;
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.5px;
            }
            
            .switcher-toggle {
                background: transparent !important;
                border: none !important;
                color: #fff !important;
                font-size: 14px !important;
                cursor: pointer !important;
                padding: 4px !important;
                border-radius: 6px !important;
                transition: all 0.2s ease !important;
            }
            
            .switcher-toggle:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                transform: scale(1.1) !important;
            }
            
            .view-buttons {
                display: flex;
                flex-direction: column;
                gap: 0;
                padding: 8px;
            }
            
            .view-btn {
                background: transparent !important;
                border: none !important;
                color: rgba(255, 255, 255, 0.8) !important;
                padding: 12px 16px !important;
                border-radius: 12px !important;
                font-size: 13px !important;
                cursor: pointer !important;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                text-align: left !important;
                width: 100% !important;
                position: relative !important;
                overflow: hidden !important;
            }
            
            .view-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.6s ease;
            }
            
            .view-btn:hover::before {
                left: 100%;
            }
            
            .btn-icon {
                font-size: 16px;
                filter: grayscale(0.5);
                transition: filter 0.3s ease;
            }
            
            .btn-text {
                font-weight: 400;
                letter-spacing: 0.3px;
            }
            
            .view-btn.active {
                background: linear-gradient(135deg, #00d4ff, #ff0080) !important;
                color: #fff !important;
                box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3) !important;
                transform: scale(1.02) !important;
            }
            
            .view-btn.active .btn-icon {
                filter: none;
                transform: scale(1.1);
            }
            
            .view-btn:hover:not(.active) {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #fff !important;
                transform: translateX(4px) !important;
            }
            
            .view-btn:hover:not(.active) .btn-icon {
                filter: none;
            }
            
            /* View Change Notification */
            .view-notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 10001;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                padding: 16px 20px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .view-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: #fff;
                font-size: 14px;
                font-weight: 400;
            }
            
            .notification-icon {
                font-size: 18px;
            }
            
            .notification-text {
                letter-spacing: 0.3px;
            }
        `;
        
        switch(currentView) {
            case 'apple':
                return baseStyles + getAppleStyles();
            case 'terminal':
                return baseStyles + getTerminalStyles();
            case 'windows':
                return baseStyles + getWindowsStyles();
            case 'minimal':
                return baseStyles + getMinimalStyles();
            default:
                return baseStyles + getAppleStyles();
        }
    }
    
    function getAppleStyles() {
        return `
            /* Apple Glassmorphism View */
            :root {
                --glow-color: ${isDarkMode ? '#00d4ff' : '#007aff'};
                --glow-secondary: ${isDarkMode ? '#ff0080' : '#ff3b30'};
                --shimmer-color: ${isDarkMode ? 'rgba(0, 212, 255, 0.3)' : 'rgba(0, 122, 255, 0.2)'};
                --bg-primary: ${isDarkMode ? '#000000' : '#ffffff'};
                --glass-bg: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
                --glass-border: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            }
            
            .Root {
                background: var(--bg-primary) !important;
                background-image: ${isDarkMode ? 
                    'radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 128, 0.1) 0%, transparent 50%)' :
                    'radial-gradient(circle at 20% 80%, rgba(0, 122, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 59, 48, 0.05) 0%, transparent 50%)'
                } !important;
            }
            
            .Root__nav-bar {
                background: var(--glass-bg) !important;
                backdrop-filter: blur(30px) saturate(150%) !important;
                border-right: 1px solid var(--glass-border) !important;
                border-radius: 0 20px 20px 0 !important;
                margin: 20px 0 !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
            }
            
            .main-navBar-navBarLink,
            .main-navBar-navBarLinkActive {
                border-radius: 16px !important;
                margin: 6px 12px !important;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                position: relative !important;
                overflow: hidden !important;
            }
            
            .main-navBar-navBarLink::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, var(--shimmer-color), transparent);
                transition: left 0.6s ease;
                z-index: 1;
            }
            
            .main-navBar-navBarLink:hover::before {
                left: 100%;
            }
            
            .main-card-card {
                background: var(--glass-bg) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid var(--glass-border) !important;
                border-radius: 20px !important;
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            
            .main-card-card:hover {
                transform: translateY(-12px) scale(1.03) !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 40px var(--shimmer-color) !important;
            }
        `;
    }
    
    function getTerminalStyles() {
        return `
            /* Terminal CLI View */
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
            
            :root {
                --terminal-bg: #0d1117;
                --terminal-text: #58a6ff;
                --terminal-accent: #7c3aed;
                --terminal-success: #3fb950;
                --terminal-warning: #d29922;
                --terminal-error: #f85149;
            }
            
            * {
                font-family: 'JetBrains Mono', 'Courier New', monospace !important;
                font-weight: 400 !important;
                letter-spacing: 0.5px !important;
            }
            
            .Root {
                background: var(--terminal-bg) !important;
                color: var(--terminal-text) !important;
            }
            
            .Root__nav-bar {
                background: rgba(13, 17, 23, 0.95) !important;
                border-right: 1px solid #30363d !important;
                border-radius: 0 !important;
                margin: 0 !important;
                font-size: 13px !important;
            }
            
            .main-navBar-navBarLink,
            .main-navBar-navBarLinkActive {
                border-radius: 0 !important;
                margin: 2px 8px !important;
                padding: 8px 12px !important;
                border-left: 3px solid transparent !important;
                background: transparent !important;
                transition: all 0.2s ease !important;
            }
            
            .main-navBar-navBarLink::before {
                content: '$ ';
                color: var(--terminal-accent);
                font-weight: bold;
            }
            
            .main-navBar-navBarLinkActive::before {
                content: '> ';
                color: var(--terminal-success);
                font-weight: bold;
            }
            
            .main-navBar-navBarLinkActive {
                border-left-color: var(--terminal-success) !important;
                background: rgba(63, 185, 80, 0.1) !important;
                color: var(--terminal-success) !important;
            }
            
            .main-navBar-navBarLink:hover {
                border-left-color: var(--terminal-accent) !important;
                background: rgba(124, 58, 237, 0.1) !important;
                color: var(--terminal-accent) !important;
            }
            
            .main-topBar-container {
                background: rgba(13, 17, 23, 0.95) !important;
                border-bottom: 1px solid #30363d !important;
                border-radius: 0 !important;
                margin: 0 !important;
            }
            
            .main-topBar-container::before {
                content: 'spotify@web:~$ ';
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--terminal-success);
                font-weight: bold;
                font-size: 14px;
            }
            
            .main-search-searchBar {
                background: #21262d !important;
                border: 1px solid #30363d !important;
                border-radius: 0 !important;
                color: var(--terminal-text) !important;
                font-family: 'JetBrains Mono', monospace !important;
            }
            
            .main-search-searchBar:focus-within {
                border-color: var(--terminal-accent) !important;
                box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.3) !important;
            }
            
            .main-card-card {
                background: #21262d !important;
                border: 1px solid #30363d !important;
                border-radius: 6px !important;
                transition: all 0.2s ease !important;
            }
            
            .main-card-card:hover {
                border-color: var(--terminal-accent) !important;
                box-shadow: 0 0 0 1px var(--terminal-accent) !important;
                transform: translateY(-2px) !important;
            }
            
            .main-card-card::before {
                content: '[TRACK] ';
                position: absolute;
                top: 8px;
                left: 8px;
                color: var(--terminal-warning);
                font-size: 10px;
                font-weight: bold;
                z-index: 10;
            }
            
            button,
            [role="button"] {
                background: #21262d !important;
                border: 1px solid #30363d !important;
                color: var(--terminal-text) !important;
                border-radius: 0 !important;
                font-family: 'JetBrains Mono', monospace !important;
                text-transform: uppercase !important;
                font-size: 11px !important;
                letter-spacing: 1px !important;
            }
            
            button:hover,
            [role="button"]:hover {
                background: var(--terminal-accent) !important;
                color: white !important;
                border-color: var(--terminal-accent) !important;
            }
            
            .main-playButton-button {
                background: var(--terminal-success) !important;
                border-color: var(--terminal-success) !important;
                color: white !important;
            }
            
            .main-playButton-button:hover {
                background: #2ea043 !important;
            }
        `;
    }
    
    function getWindowsStyles() {
        return `
            /* Windows Fluent Design View */
            :root {
                --fluent-bg: ${isDarkMode ? '#202020' : '#f3f3f3'};
                --fluent-surface: ${isDarkMode ? '#2d2d30' : '#ffffff'};
                --fluent-accent: #0078d4;
                --fluent-text: ${isDarkMode ? '#ffffff' : '#323130'};
                --fluent-border: ${isDarkMode ? '#3f3f46' : '#e1dfdd'};
            }
            
            .Root {
                background: var(--fluent-bg) !important;
                font-family: 'Segoe UI', system-ui, sans-serif !important;
            }
            
            .Root__nav-bar {
                background: var(--fluent-surface) !important;
                border-right: 1px solid var(--fluent-border) !important;
                border-radius: 8px 0 0 8px !important;
                margin: 8px 0 8px 8px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            
            .main-navBar-navBarLink,
            .main-navBar-navBarLinkActive {
                border-radius: 4px !important;
                margin: 4px 8px !important;
                padding: 12px 16px !important;
                transition: all 0.15s ease !important;
                position: relative !important;
            }
            
            .main-navBar-navBarLink::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: transparent;
                transition: background 0.15s ease;
            }
            
            .main-navBar-navBarLinkActive::before {
                background: var(--fluent-accent);
            }
            
            .main-navBar-navBarLinkActive {
                background: rgba(0, 120, 212, 0.1) !important;
                color: var(--fluent-accent) !important;
            }
            
            .main-navBar-navBarLink:hover {
                background: rgba(0, 0, 0, 0.05) !important;
            }
            
            .main-topBar-container {
                background: var(--fluent-surface) !important;
                border-bottom: 1px solid var(--fluent-border) !important;
                border-radius: 0 8px 0 0 !important;
                margin: 8px 8px 0 0 !important;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
            }
            
            .main-search-searchBar {
                background: var(--fluent-surface) !important;
                border: 2px solid var(--fluent-border) !important;
                border-radius: 4px !important;
                transition: all 0.15s ease !important;
            }
            
            .main-search-searchBar:focus-within {
                border-color: var(--fluent-accent) !important;
                box-shadow: 0 0 0 1px var(--fluent-accent) !important;
            }
            
            .main-card-card {
                background: var(--fluent-surface) !important;
                border: 1px solid var(--fluent-border) !important;
                border-radius: 8px !important;
                transition: all 0.15s ease !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            .main-card-card:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                transform: translateY(-2px) !important;
                border-color: var(--fluent-accent) !important;
            }
            
            button,
            [role="button"] {
                background: var(--fluent-surface) !important;
                border: 1px solid var(--fluent-border) !important;
                border-radius: 4px !important;
                color: var(--fluent-text) !important;
                transition: all 0.15s ease !important;
            }
            
            button:hover,
            [role="button"]:hover {
                background: rgba(0, 0, 0, 0.05) !important;
                border-color: var(--fluent-accent) !important;
            }
            
            .main-playButton-button {
                background: var(--fluent-accent) !important;
                border-color: var(--fluent-accent) !important;
                color: white !important;
            }
            
            .main-playButton-button:hover {
                background: #106ebe !important;
            }
        `;
    }
    
    function getMinimalStyles() {
        return `
            /* Ultra-Minimal Seamless Surface View */
            :root {
                --seamless-bg: ${isDarkMode ? '#000000' : '#ffffff'};
                --seamless-text: ${isDarkMode ? '#ffffff' : '#000000'};
                --seamless-subtle: ${isDarkMode ? '#111111' : '#f8f8f8'};
                --seamless-hover: ${isDarkMode ? '#1a1a1a' : '#f0f0f0'};
            }
            
            /* Remove ALL borders, lines, and separators */
            * {
                border: none !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                outline: none !important;
                background-image: none !important;
            }
            
            .Root {
                background: var(--seamless-bg) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            }
            
            .Root__nav-bar {
                background: var(--seamless-bg) !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            .main-navBar-navBarLink,
            .main-navBar-navBarLinkActive {
                background: transparent !important;
                margin: 0 !important;
                padding: 16px 24px !important;
                color: var(--seamless-text) !important;
                transition: background 0.2s ease !important;
                font-weight: 300 !important;
                letter-spacing: 0.5px !important;
            }
            
            .main-navBar-navBarLinkActive {
                background: var(--seamless-subtle) !important;
                font-weight: 400 !important;
            }
            
            .main-navBar-navBarLink:hover {
                background: var(--seamless-hover) !important;
            }
            
            .main-topBar-container {
                background: var(--seamless-bg) !important;
                margin: 0 !important;
                padding: 20px !important;
            }
            
            .main-search-searchBar {
                background: var(--seamless-subtle) !important;
                color: var(--seamless-text) !important;
                padding: 16px 20px !important;
                font-size: 16px !important;
                font-weight: 300 !important;
            }
            
            .main-search-searchBar:focus-within {
                background: var(--seamless-hover) !important;
            }
            
            .main-view-container {
                background: var(--seamless-bg) !important;
                padding: 0 !important;
            }
            
            .main-card-card {
                background: transparent !important;
                margin: 8px !important;
                padding: 20px !important;
                transition: background 0.2s ease !important;
            }
            
            .main-card-card:hover {
                background: var(--seamless-subtle) !important;
                transform: none !important;
            }
            
            /* Remove all visual separators */
            .main-shelf-shelf {
                margin: 0 !important;
                padding: 40px 20px !important;
            }
            
            .main-shelf-header {
                margin: 0 !important;
                padding: 0 0 20px 0 !important;
            }
            
            .main-gridContainer-gridContainer {
                gap: 0 !important;
            }
            
            button,
            [role="button"] {
                background: transparent !important;
                color: var(--seamless-text) !important;
                padding: 12px 20px !important;
                font-weight: 300 !important;
                letter-spacing: 0.5px !important;
                transition: all 0.2s ease !important;
            }
            
            button:hover,
            [role="button"]:hover {
                background: var(--seamless-subtle) !important;
                transform: scale(1.02) !important;
            }
            
            .main-playButton-button {
                background: var(--seamless-text) !important;
                color: var(--seamless-bg) !important;
            }
            
            .main-playButton-button:hover {
                opacity: 0.8 !important;
            }
            
            /* Remove player bar borders */
            .Root__now-playing-bar {
                background: var(--seamless-bg) !important;
                margin: 0 !important;
                padding: 20px !important;
            }
            
            /* Ultra-clean typography */
            h1, h2, h3, h4, h5, h6 {
                font-weight: 200 !important;
                letter-spacing: -0.5px !important;
            }
            
            p, span, div {
                font-weight: 300 !important;
                line-height: 1.6 !important;
            }
            
            /* Remove any remaining visual noise */
            .main-topBar-topbarContent::after,
            .main-navBar-navBar::after,
            *::before,
            *::after {
                display: none !important;
            }
        `;
    }
    
    // Parallax effects (only for Apple view)
    function handleScroll() {
        if (currentView !== 'apple') return;
        
        scrollY = window.pageYOffset;
        
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    function updateParallax() {
        const navbar = document.querySelector('.Root__nav-bar');
        if (navbar && currentView === 'apple') {
            const offset = Math.min(scrollY * 0.1, 10);
            navbar.style.transform = `translateZ(0) translateY(${offset}px)`;
        }
        ticking = false;
    }
    
    // Initialize with saved preference or default to Apple
    function init() {
        // Get saved preference or default to Apple
        const savedView = localStorage.getItem('spotify-preferred-view') || 'apple';
        currentView = savedView;
        
        // Create switcher first
        createViewSwitcher();
        
        // Set initial view
        switchView(currentView);
        
        // Update active button
        const activeBtn = document.querySelector(`[data-view="${currentView}"]`);
        if (activeBtn) {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
        }
        
        // Add scroll listener for parallax (Apple view only)
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Theme change listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            isDarkMode = e.matches;
            updateStyles();
        });
        
        console.log(`🎨 Spotify Multi-View loaded! Current mode: ${getViewName(currentView)}`);
    }
    
    // Start immediately when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // If page already loaded, start immediately
        setTimeout(init, 50);
    }
    
    // Also trigger on page changes (Spotify is SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                if (!document.querySelector('#view-switcher')) {
                    init();
                }
            }, 100);
        }
    }).observe(document.body, { childList: true, subtree: true });
    
})();