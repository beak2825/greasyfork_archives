// ==UserScript==
// @name YouTube Download Helper 2025 Polished
// @namespace http://tampermonkey.net/
// @version 4.0
// @description Polished YouTube download helper with enhanced error handling
// @license MIT
// @author You
// @match https://www.youtube.com/watch*
// @match https://youtube.com/watch*
// @match https://amp3.cc/*
// @match https://amp4.cc/*
// @match https://cobalt.tools/*
// @match https://cnvmp3.com/*
// @match https://ezmp4.com/*
// @match https://ezmp3.to/*
// @match https://y2mate.com/*
// @match https://keepvid.com/*
// @match https://clipconverter.cc/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/539911/YouTube%20Download%20Helper%202025%20Polished.user.js
// @updateURL https://update.greasyfork.org/scripts/539911/YouTube%20Download%20Helper%202025%20Polished.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Early exit if in sandboxed frame or invalid context
    try {
        if (!window || !document || document.location.href === 'about:blank' ||
            window.location.protocol === 'about:' ||
            window !== window.top && !document.domain) {
            console.log('YouTube Download Helper: Skipping execution in restricted context');
            return;
        }
    } catch (e) {
        console.log('YouTube Download Helper: Security restriction detected, exiting gracefully');
        return;
    }

    let downloadButtonAdded = false;
    let retryCount = 0;
    const MAX_RETRIES = 20;
    let initializationTimeout = null;
    let lastVideoId = null;
    let observers = [];
    let intervalCheckers = [];

    // Configuration
    const config = {
        autoFillDelay: 1000,
        retryInterval: 1000,
        maxRetries: 20,
        animationDuration: 200,
        debounceDelay: 200,
        aggressiveCheckInterval: 250
    };

    // Enhanced error handling wrapper
    function safeExecute(fn, context = 'Unknown') {
        try {
            return fn();
        } catch (error) {
            console.warn(`YouTube Download Helper: Error in ${context}:`, error.message);
            return null;
        }
    }

    // Safe DOM manipulation
    function safeQuerySelector(selector) {
        return safeExecute(() => document.querySelector(selector), `querySelector: ${selector}`);
    }

    function safeAddEventListener(element, event, handler) {
        return safeExecute(() => {
            if (element && typeof element.addEventListener === 'function') {
                element.addEventListener(event, handler);
                return true;
            }
            return false;
        }, `addEventListener: ${event}`);
    }

    function getVideoId() {
        return safeExecute(() => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('v');
        }, 'getVideoId') || null;
    }

    function getCurrentYouTubeUrl() {
        return safeExecute(() => window.location.href, 'getCurrentYouTubeUrl') || '';
    }

    function showNotification(message, type = 'success') {
        safeExecute(() => {
            console.log('Notification:', message);
            
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('[id^="yt-download-notification"]');
            existingNotifications.forEach(notif => notif.remove());

            const notification = document.createElement('div');
            notification.id = `yt-download-notification-${Date.now()}`;
            notification.textContent = message;
            
            const colors = {
                success: '#2ed573',
                error: '#ff4757',
                info: '#3742fa',
                warning: '#ffa502'
            };
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 999999;
                font-family: 'Roboto', Arial, sans-serif;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                transform: translateX(400px);
                transition: transform ${config.animationDuration}ms ease-out;
                max-width: 300px;
                word-wrap: break-word;
            `;

            document.body.appendChild(notification);

            // Slide in animation
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });

            // Auto remove with slide out
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, config.animationDuration);
            }, 3000);
        }, 'showNotification');
    }

    function createSafeElement(tag, text = '', styles = '') {
        return safeExecute(() => {
            const element = document.createElement(tag);
            if (text) element.textContent = text;
            if (styles) element.style.cssText = styles;
            return element;
        }, `createSafeElement: ${tag}`) || document.createElement('div');
    }

    function createSafeLink(text, url, styles = '') {
        return safeExecute(() => {
            const link = document.createElement('a');
            link.textContent = text;
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            if (styles) link.style.cssText = styles;
            return link;
        }, 'createSafeLink') || document.createElement('a');
    }

    function createFMHYSection(icon, title, url, description, color = '#ff6b6b') {
        return safeExecute(() => {
            const section = createSafeElement('div', '', `
                margin-bottom: 12px;
                padding: 12px;
                background: #1a1a1a;
                border-radius: 8px;
                border-left: 4px solid ${color};
                transition: background ${config.animationDuration}ms ease;
                cursor: pointer;
            `);
            
            safeAddEventListener(section, 'mouseenter', () => {
                section.style.background = '#252525';
            });
            
            safeAddEventListener(section, 'mouseleave', () => {
                section.style.background = '#1a1a1a';
            });
            
            const titleLine = createSafeElement('div', '', 'margin-bottom: 6px;');
            const iconSpan = createSafeElement('span', `${icon} `);
            const titleLink = createSafeLink(title, url, `color: ${color}; font-weight: bold; font-size: 14px; text-decoration: none;`);
            
            titleLine.appendChild(iconSpan);
            titleLine.appendChild(titleLink);
            
            const descLine = createSafeElement('div', description, 'color: #aaa; font-size: 12px; line-height: 1.4;');
            
            section.appendChild(titleLine);
            section.appendChild(descLine);
            
            // Make entire section clickable
            safeAddEventListener(section, 'click', () => {
                safeExecute(() => {
                    window.open(url, '_blank', 'noopener,noreferrer');
                    showNotification(`🚀 Opening ${title}...`, 'info');
                }, 'FMHY section click');
            });
            
            return section;
        }, 'createFMHYSection') || createSafeElement('div');
    }

    // Enhanced keyboard support with error handling
    function addKeyboardSupport() {
        safeAddEventListener(document, 'keydown', (e) => {
            safeExecute(() => {
                // Ctrl/Cmd + Shift + D to open modal
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    const videoId = getVideoId();
                    if (videoId) {
                        showAdvancedOptions(videoId);
                        showNotification('⌨️ Modal opened via keyboard shortcut', 'info');
                    }
                }
                
                // Escape to close modal
                if (e.key === 'Escape') {
                    const modal = safeQuerySelector('#yt-download-modal');
                    if (modal) {
                        modal.remove();
                        showNotification('Modal closed', 'info');
                    }
                }
            }, 'keyboard event handler');
        });
    }

    function showAdvancedOptions(videoId) {
        safeExecute(() => {
            console.log('Opening advanced options for:', videoId);
            
            // Remove existing modal
            const existingModal = safeQuerySelector('#yt-download-modal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = createSafeElement('div', '', `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.8) !important;
                z-index: 999999 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                backdrop-filter: blur(4px);
                opacity: 0;
                transition: opacity ${config.animationDuration}ms ease;
            `);
            modal.id = 'yt-download-modal';

            const content = createSafeElement('div', '', `
                background: #181818 !important;
                color: white !important;
                padding: 24px !important;
                border-radius: 12px !important;
                width: 90% !important;
                max-width: 800px !important;
                max-height: 85vh !important;
                overflow-y: auto !important;
                border: 1px solid #3f3f3f !important;
                position: relative !important;
                transform: scale(0.9);
                transition: transform ${config.animationDuration}ms ease;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            `);

            // Header
            const header = createSafeElement('div', '', `
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 20px !important;
                padding-bottom: 12px;
                border-bottom: 1px solid #3f3f3f;
            `);
            
            const headerTitle = createSafeElement('h2', '🔧 Advanced Download Options', 'margin: 0 !important; color: #fff !important; font-size: 18px !important;');
            
            const headerInfo = createSafeElement('div', 'Press ESC to close • Ctrl+Shift+D to reopen', 'color: #888; font-size: 12px; margin-top: 4px;');
            const headerContainer = createSafeElement('div');
            headerContainer.appendChild(headerTitle);
            headerContainer.appendChild(headerInfo);
            
            const closeBtn = createSafeElement('button', '×', `
                background: #ff4757 !important;
                color: white !important;
                border: none !important;
                width: 30px !important;
                height: 30px !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                font-size: 18px !important;
                font-weight: bold !important;
                transition: transform ${config.animationDuration}ms ease;
            `);
            
            safeAddEventListener(closeBtn, 'mouseenter', () => {
                closeBtn.style.transform = 'scale(1.1)';
            });
            
            safeAddEventListener(closeBtn, 'mouseleave', () => {
                closeBtn.style.transform = 'scale(1)';
            });
            
            safeAddEventListener(closeBtn, 'click', function(e) {
                safeExecute(() => {
                    e.preventDefault();
                    e.stopPropagation();
                    modal.style.opacity = '0';
                    content.style.transform = 'scale(0.9)';
                    setTimeout(() => modal.remove(), config.animationDuration);
                }, 'close button click');
            });
            
            header.appendChild(headerContainer);
            header.appendChild(closeBtn);
            
            const currentUrl = getCurrentYouTubeUrl();
            
            // Video info section with copy functionality
            const infoDiv = createSafeElement('div', '', 'background: #0f0f0f; padding: 12px; border-radius: 8px; margin-bottom: 16px; position: relative;');
            
            const videoIdLabel = createSafeElement('div', '', 'margin-bottom: 8px; color: white;');
            const videoIdStrong = createSafeElement('strong', '📺 Video ID: ');
            const videoIdValue = createSafeElement('span', videoId, 'user-select: all; background: #333; padding: 2px 6px; border-radius: 4px; font-family: monospace;');
            videoIdLabel.appendChild(videoIdStrong);
            videoIdLabel.appendChild(videoIdValue);
            
            const urlLabel = createSafeElement('div', '', 'color: white;');
            const urlStrong = createSafeElement('strong', '🔗 URL: ');
            const urlBr = document.createElement('br');
            const urlValue = createSafeElement('span', currentUrl, 'word-break: break-all; font-size: 12px; color: #aaa; user-select: all; background: #333; padding: 4px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; font-family: monospace;');
            urlLabel.appendChild(urlStrong);
            urlLabel.appendChild(urlBr);
            urlLabel.appendChild(urlValue);
            
            // Copy URL button
            const copyUrlBtn = createSafeElement('button', '📋', `
                position: absolute;
                top: 8px;
                right: 8px;
                background: #747d8c;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `);
            
            copyUrlBtn.title = 'Copy URL';
            safeAddEventListener(copyUrlBtn, 'click', () => {
                safeExecute(async () => {
                    await navigator.clipboard.writeText(currentUrl);
                    showNotification('📋 URL copied to clipboard!');
                }, 'copy URL').catch(() => {
                    showNotification('❌ Failed to copy URL', 'error');
                });
            });
            
            infoDiv.appendChild(videoIdLabel);
            infoDiv.appendChild(urlLabel);
            infoDiv.appendChild(copyUrlBtn);
            
            // Quick links
            const quickTitle = createSafeElement('div', '🌐 Quick Download Links:', 'color: #3742fa; font-size: 16px; font-weight: bold; margin: 16px 0 12px 0;');
            
            const quickLinksDiv = createSafeElement('div', '', 'display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin-bottom: 20px;');
            
            const quickServices = [
                { name: '🎵 amp3.cc', url: 'https://amp3.cc/', color: '#ff4757', type: 'audio' },
                { name: '🎬 amp4.cc', url: 'https://amp4.cc/', color: '#2ed573', type: 'video' },
                { name: '🔧 cobalt.tools', url: 'https://cobalt.tools/', color: '#3742fa', type: 'tool' },
                { name: '🎵 cnvmp3.com', url: 'https://cnvmp3.com/v25/', color: '#ff6b6b', type: 'audio' },
                { name: '🎬 ezmp4.com', url: 'https://ezmp4.com/', color: '#5f27cd', type: 'video' },
                { name: '🎵 ezmp3.to', url: 'https://ezmp3.to/', color: '#ffa502', type: 'audio' }
            ];
            
            quickServices.forEach(service => {
                const link = createSafeLink(service.name, service.url, `
                    background: ${service.color};
                    color: white;
                    padding: 10px 12px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                    text-align: center;
                    display: block;
                    transition: all ${config.animationDuration}ms ease;
                    border: 2px solid transparent;
                `);
                
                safeAddEventListener(link, 'mouseenter', () => {
                    link.style.transform = 'translateY(-2px)';
                    link.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                    link.style.borderColor = 'rgba(255,255,255,0.3)';
                });
                
                safeAddEventListener(link, 'mouseleave', () => {
                    link.style.transform = 'translateY(0)';
                    link.style.boxShadow = 'none';
                    link.style.borderColor = 'transparent';
                });
                
                safeAddEventListener(link, 'click', () => {
                    // Store the current YouTube URL in sessionStorage for auto-filling
                    sessionStorage.setItem('ytDownloadUrl', currentUrl);
                    showNotification(`🚀 Opening ${service.name}...`);
                });
                
                quickLinksDiv.appendChild(link);
            });
            
            // FMHY Resources
            const fmhyTitle = createSafeElement('div', '🌟 FMHY - Complete YouTube Resources:', 'color: #ff6b6b; font-size: 16px; font-weight: bold; margin: 16px 0 12px 0;');
            
            const fmhyDiv = createSafeElement('div', '', 'margin-bottom: 20px;');
            
            const fmhyDownloaders = createFMHYSection(
                '📥',
                'YouTube Downloaders',
                'https://fmhy.net/social-media-tools#youtube-downloaders',
                'Complete collection of YouTube download tools, websites, apps, and command-line utilities',
                '#ff4757'
            );
            
            const fmhyVideoDownload = createFMHYSection(
                '🔌',
                'Video Download Extensions',
                'https://fmhy.net/video-tools#video-download',
                'Browser extensions specifically for downloading videos from YouTube and other platforms',
                '#2ed573'
            );
            
            const fmhyClients = createFMHYSection(
                '📱',
                'YouTube Clients & Frontends',
                'https://fmhy.net/social-media-tools#players-frontends',
                'Alternative YouTube clients, players, and privacy-focused frontends',
                '#3742fa'
            );
            
            const fmhyCustomization = createFMHYSection(
                '🎨',
                'YouTube Customization',
                'https://fmhy.net/social-media-tools#youtube-customization',
                'Scripts, themes, and tools to customize your YouTube experience',
                '#ffa502'
            );
            
            const fmhyMain = createFMHYSection(
                '�',
                'FMHY Main Site',
                'https://fmhy.net/',
                'Free Media Heck Yeah - The ultimate collection of free tools, software, and resources',
                '#9c88ff'
            );
            
            fmhyDiv.appendChild(fmhyDownloaders);
            fmhyDiv.appendChild(fmhyVideoDownload);
            fmhyDiv.appendChild(fmhyClients);
            fmhyDiv.appendChild(fmhyCustomization);
            fmhyDiv.appendChild(fmhyMain);
            
            // Popular tools
            const popularTitle = createSafeElement('div', '🔥 Popular Tools:', 'color: #2ed573; font-size: 16px; font-weight: bold; margin: 16px 0 12px 0;');
            
            const popularDiv = createSafeElement('div', '', 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 8px; margin-bottom: 16px;');
            
            const popularTools = [
                { name: 'yt-dlp', url: 'https://github.com/yt-dlp/yt-dlp', desc: 'Best command line tool with latest features' },
                { name: 'JDownloader', url: 'https://jdownloader.org/', desc: 'Powerful batch downloader with GUI' }
            ];
            
            popularTools.forEach(app => {
                const appCard = createSafeElement('div', '', 'background: #252525; padding: 10px; border-radius: 6px; transition: background 0.2s ease;');
                const appLink = createSafeLink(app.name, app.url, 'color: #5352ed; font-weight: 600; font-size: 14px; text-decoration: none;');
                const appDesc = createSafeElement('div', app.desc, 'color: #aaa; font-size: 12px; margin-top: 4px;');
                
                safeAddEventListener(appCard, 'mouseenter', () => appCard.style.background = '#333');
                safeAddEventListener(appCard, 'mouseleave', () => appCard.style.background = '#252525');
                safeAddEventListener(appCard, 'click', () => {
                    safeExecute(() => window.open(app.url, '_blank'), 'popular tool click');
                });
                appCard.style.cursor = 'pointer';
                
                appCard.appendChild(appLink);
                appCard.appendChild(appDesc);
                popularDiv.appendChild(appCard);
            });
            
            // Enhanced command line section
            const cmdTitle = createSafeElement('div', '💻 yt-dlp Commands:', 'color: #ff6b6b; font-size: 16px; font-weight: bold; margin: 16px 0 12px 0;');
            
            const cmdDiv = createSafeElement('div', '', 'background: #0f0f0f; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; margin-bottom: 16px; border: 1px solid #333;');
            
            const commands = `# Basic download
yt-dlp "${currentUrl}"

# Audio only (MP3)
yt-dlp -x --audio-format mp3 "${currentUrl}"

# Specific quality (720p max)
yt-dlp -f "best[height<=720]" "${currentUrl}"

# List all available formats
yt-dlp -F "${currentUrl}"

# Best video + audio
yt-dlp -f "best" "${currentUrl}"

# Custom filename
yt-dlp -o "%(uploader)s - %(title)s.%(ext)s" "${currentUrl}"

# Download with subtitles
yt-dlp --write-subs --write-auto-subs "${currentUrl}"`;
            
            const cmdPre = createSafeElement('pre', commands, 'color: #2ed573; margin: 0; white-space: pre-wrap; word-break: break-all; line-height: 1.4;');
            cmdDiv.appendChild(cmdPre);
            
            const copyCommandsBtn = createSafeElement('button', '📋 Copy All Commands', `
                background: #747d8c;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 12px;
                transition: all ${config.animationDuration}ms ease;
                width: 100%;
            `);
            
            safeAddEventListener(copyCommandsBtn, 'mouseenter', () => {
                copyCommandsBtn.style.background = '#5a6169';
                copyCommandsBtn.style.transform = 'translateY(-1px)';
            });
            
            safeAddEventListener(copyCommandsBtn, 'mouseleave', () => {
                copyCommandsBtn.style.background = '#747d8c';
                copyCommandsBtn.style.transform = 'translateY(0)';
            });
            
            safeAddEventListener(copyCommandsBtn, 'click', function() {
                safeExecute(async () => {
                    await navigator.clipboard.writeText(commands);
                    showNotification('📋 All commands copied to clipboard!');
                    copyCommandsBtn.textContent = '✅ Copied!';
                    setTimeout(() => {
                        copyCommandsBtn.textContent = '📋 Copy All Commands';
                    }, 2000);
                }, 'copy commands').catch(() => {
                    showNotification('❌ Failed to copy commands', 'error');
                });
            });
            
            cmdDiv.appendChild(copyCommandsBtn);
            
            // Warning
            const warningDiv = createSafeElement('div', '', 'background: linear-gradient(135deg, #ff6b3d, #ff4757); padding: 12px; border-radius: 8px; font-size: 14px; margin-top: 16px;');
            const warningStrong = createSafeElement('strong', '⚠️ Important: ');
            const warningText = createSafeElement('span', 'Only download videos you have permission to download. Respect copyright laws and YouTube\'s Terms of Service.');
            warningDiv.appendChild(warningStrong);
            warningDiv.appendChild(warningText);
            
            // Assemble modal
            content.appendChild(header);
            content.appendChild(infoDiv);
            content.appendChild(quickTitle);
            content.appendChild(quickLinksDiv);
            content.appendChild(fmhyTitle);
            content.appendChild(fmhyDiv);
            content.appendChild(popularTitle);
            content.appendChild(popularDiv);
            content.appendChild(cmdTitle);
            content.appendChild(cmdDiv);
            content.appendChild(warningDiv);
            
            modal.appendChild(content);
            
            // Enhanced modal interactions with error handling
            safeAddEventListener(modal, 'click', function(e) {
                if (e.target === modal) {
                    modal.style.opacity = '0';
                    content.style.transform = 'scale(0.9)';
                    setTimeout(() => modal.remove(), config.animationDuration);
                }
            });
            
            safeAddEventListener(content, 'click', function(e) {
                e.stopPropagation();
            });
            
            document.body.appendChild(modal);
            
            // Trigger animations
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
                content.style.transform = 'scale(1)';
            });
            
            console.log('Enhanced modal with error handling added successfully!');
            
        }, 'showAdvancedOptions');
    }

    // Simplified auto-fill with error handling
    function autoFillDownloadSites() {
        safeExecute(() => {
            const currentUrl = window.location.href;
            const ytUrl = sessionStorage.getItem('ytDownloadUrl');
            
            if (!ytUrl) return;

            console.log('Auto-filling:', ytUrl, 'on site:', currentUrl);

            const supportedSites = [
                'amp3.cc', 'amp4.cc', 'cobalt.tools', 'cnvmp3.com',
                'ezmp4.com', 'ezmp3.to', 'y2mate.com', 'keepvid.com', 'clipconverter.cc'
            ];
            
            const isSupported = supportedSites.some(site => currentUrl.includes(site));
            
            if (isSupported) {
                setTimeout(() => {
                    const selectors = [
                        'input[type="url"]', 'input[placeholder*="URL"]', 'input[placeholder*="url"]',
                        'input[placeholder*="link"]', 'input[name*="url"]', 'input[id*="url"]',
                        '#url', '.url-input', 'input[class*="input"]', '.text-input',
                        '#url-input-area', 'input[placeholder*="paste"]', '.form-control'
                    ];
                    
                    const input = safeQuerySelector(selectors.join(', '));
                    
                    if (input && input.type !== 'hidden' && !input.value) {
                        input.value = ytUrl;
                        input.focus();
                        
                        // Comprehensive event triggering
                        const events = ['input', 'change', 'paste', 'keyup', 'blur'];
                        events.forEach(eventType => {
                            safeExecute(() => {
                                input.dispatchEvent(new Event(eventType, { bubbles: true }));
                            }, `trigger ${eventType} event`);
                        });
                        
                        // Try React/Vue updates
                        if (input._valueTracker) {
                            input._valueTracker.setValue('');
                        }
                        
                        // Enhanced button detection
                        setTimeout(() => {
                            const buttonSelectors = [
                                'button', 'input[type="submit"]', '.btn', '.button',
                                '[role="button"]', '.download', '.convert', '.start'
                            ];
                            
                            const buttons = document.querySelectorAll(buttonSelectors.join(', '));
                            
                            for (const btn of buttons) {
                                const text = btn.textContent.toLowerCase();
                                const keywords = ['convert', 'download', 'start', 'go', 'search', 'get'];
                                
                                if (keywords.some(keyword => text.includes(keyword))) {
                                    safeExecute(() => btn.click(), 'auto-click button');
                                    break;
                                }
                            }
                        }, 800);
                    }
                }, config.autoFillDelay);
            }

            // Clear after use
            sessionStorage.removeItem('ytDownloadUrl');
        }, 'autoFillDownloadSites');
    }

    function createDownloadButton() {
        return safeExecute(() => {
            const videoId = getVideoId();
            if (!videoId) return null;

            const container = createSafeElement('div', '', `
                margin: 16px 0;
                padding: 16px;
                background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
                border: 1px solid #3f3f3f;
                border-radius: 12px;
                font-family: 'Roboto', Arial, sans-serif;
                position: relative;
                z-index: 100;
                width: 100%;
                box-sizing: border-box;
                max-width: 100%;
                overflow: hidden;
                transition: all ${config.animationDuration}ms ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `);
            container.id = 'yt-download-helper-2025';

            // Hover effect
            safeAddEventListener(container, 'mouseenter', () => {
                container.style.transform = 'translateY(-2px)';
                container.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
            });
            
            safeAddEventListener(container, 'mouseleave', () => {
                container.style.transform = 'translateY(0)';
                container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            });

            const title = createSafeElement('div', '⚡ YouTube Download Options', `
                color: #fff;
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            `);

            const buttonsDiv = createSafeElement('div', '', `
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                width: 100%;
                max-width: 100%;
            `);

            const currentYouTubeUrl = getCurrentYouTubeUrl();

            const buttonConfigs = [
                { text: 'Download MP3 🎵', url: 'https://amp3.cc/', color: '#ff4757', type: 'audio' },
                { text: 'Download MP4 🎬', url: 'https://amp4.cc/', color: '#2ed573', type: 'video' },
                { text: 'Download Cobalt 🔧', url: 'https://cobalt.tools/', color: '#3742fa', type: 'tool' },
                { text: 'More Options ⚙️', action: () => showAdvancedOptions(videoId), color: '#ffa502', type: 'modal' }
            ];

            buttonConfigs.forEach(btnConfig => {
                const button = createSafeElement('button', btnConfig.text, `
                    flex: 1 1 auto; /* Allow buttons to grow and shrink */
                    min-width: 120px; /* Minimum width for responsiveness */
                    background: ${btnConfig.color};
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all ${config.animationDuration}ms ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                `);

                safeAddEventListener(button, 'mouseenter', () => {
                    button.style.transform = 'translateY(-3px) scale(1.02)';
                    button.style.boxShadow = `0 6px 20px rgba(0,0,0,0.4), 0 0 15px ${btnConfig.color}80`;
                });

                safeAddEventListener(button, 'mouseleave', () => {
                    button.style.transform = 'translateY(0) scale(1)';
                    button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                });

                safeAddEventListener(button, 'click', function(e) {
                    safeExecute(() => {
                        e.preventDefault();
                        if (btnConfig.url) {
                            // Store the current YouTube URL in sessionStorage for auto-filling
                            sessionStorage.setItem('ytDownloadUrl', currentYouTubeUrl);
                            window.open(btnConfig.url, '_blank', 'noopener,noreferrer');
                            showNotification(`Redirecting to ${btnConfig.url.split('/')[2]}...`, 'info');
                        } else if (btnConfig.action) {
                            btnConfig.action();
                        }
                    }, `button click: ${btnConfig.text}`);
                });
                buttonsDiv.appendChild(button);
            });

            container.appendChild(title);
            container.appendChild(buttonsDiv);
            return container;
        }, 'createDownloadButton') || document.createElement('div');
    }

    // Main function to check for the target element and insert the button
    const insertDownloadButton = () => {
        safeExecute(() => {
            // ALWAYS remove any existing button first to ensure proper re-insertion
            const existingButton = safeQuerySelector('#yt-download-helper-2025');
            if (existingButton) {
                existingButton.remove();
                downloadButtonAdded = false; // Reset flag to allow re-addition
            }

            // Target ytd-comments to insert the button just before it
            // This generally places it below the video details and above the comments section.
            const targetSelector = 'ytd-comments';
            const targetElement = safeQuerySelector(targetSelector);

            if (targetElement) {
                const downloadButtonContainer = createDownloadButton();
                if (downloadButtonContainer) {
                    // Insert the new button before the comments section
                    targetElement.parentNode.insertBefore(downloadButtonContainer, targetElement);
                    downloadButtonAdded = true;
                    showNotification('YouTube Download Helper Activated!', 'success');
                    console.log('YouTube Download Helper: Button added successfully.');
                    lastVideoId = getVideoId(); // Store the current video ID
                    retryCount = 0; // Reset retry count on success
                } else {
                    console.warn('YouTube Download Helper: Could not create download button container.');
                }
            } else {
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    // console.log(`YouTube Download Helper: Target element not found, retrying... (${retryCount}/${MAX_RETRIES})`);
                    clearTimeout(initializationTimeout); // Clear previous timeout before setting a new one
                    initializationTimeout = setTimeout(insertDownloadButton, config.retryInterval);
                } else {
                    console.warn('YouTube Download Helper: Max retries reached, button not added.');
                    showNotification('YouTube Download Helper: Failed to activate button.', 'error');
                }
            }
        }, 'insertDownloadButton');
    };

    // Cleanup existing observers/intervals to prevent duplicates on navigation
    function cleanup() {
        observers.forEach(observer => observer.disconnect());
        observers = [];
        intervalCheckers.forEach(id => clearInterval(id));
        intervalCheckers = [];
        clearTimeout(initializationTimeout);
        downloadButtonAdded = false;
        retryCount = 0;
        lastVideoId = null;
        console.log('YouTube Download Helper: Cleaned up previous state.');
    }

    // Debounce function for URL changes
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const handleUrlChange = debounce(() => {
        safeExecute(() => {
            const currentVideoId = getVideoId();
            // Only re-initialize if the video ID has changed or if it's the first load
            // and no button has been added yet.
            if (currentVideoId && currentVideoId !== lastVideoId || !downloadButtonAdded) {
                console.log('YouTube Download Helper: URL changed or initial load, re-initializing.');
                cleanup();
                if (window.location.href.includes('youtube.com/watch')) {
                     initializeYouTubeSpecificFeatures();
                }
            } else if (!currentVideoId && window.location.href.includes('youtube.com')) {
                // If on YouTube but not on a watch page, ensure cleanup.
                cleanup();
            }
        }, 'handleUrlChange');
    }, config.debounceDelay);

    // YouTube specific initialization (button insertion)
    function initializeYouTubeSpecificFeatures() {
        safeExecute(() => {
            insertDownloadButton(); // Attempt to insert button immediately

            // More specific target for MutationObserver: watch the main #primary content area
            const observerTarget = safeQuerySelector('#primary') || safeQuerySelector('ytd-app');
            if (observerTarget) {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        // Check if new nodes are added which might indicate a page change
                        if (mutation.addedNodes.length > 0) {
                            if (!downloadButtonAdded || getVideoId() !== lastVideoId) {
                                insertDownloadButton();
                            }
                        }
                    });
                });
                // Observe for child list changes and subtree changes
                observer.observe(observerTarget, { childList: true, subtree: true });
                observers.push(observer);
                console.log('YouTube Download Helper: MutationObserver started on a more specific target.');
            } else {
                console.warn('YouTube Download Helper: Could not find a specific observer target, falling back to interval check.');
                const intervalId = setInterval(() => {
                    if (!downloadButtonAdded || getVideoId() !== lastVideoId) {
                        insertDownloadButton();
                    }
                }, config.aggressiveCheckInterval);
                intervalCheckers.push(intervalId);
            }
        }, 'initializeYouTubeSpecificFeatures');
    }

    // Initialize based on current URL
    function initialize() {
        safeExecute(() => {
            // Add keyboard shortcuts globally
            addKeyboardSupport();

            // Handle auto-filling on download sites
            if (!window.location.href.includes('youtube.com')) {
                autoFillDownloadSites();
            }

            // Setup for YouTube pages
            if (window.location.href.includes('youtube.com/watch')) {
                initializeYouTubeSpecificFeatures();
            }

            // Listen for URL changes (SPA navigation)
            // Observe the document body for changes, which indicates YouTube's SPA navigation
            const observer = new MutationObserver(handleUrlChange);
            observer.observe(document.body, { childList: true, subtree: true });
            observers.push(observer);
            safeAddEventListener(window, 'popstate', handleUrlChange); // For back/forward navigation
            safeAddEventListener(window, 'hashchange', handleUrlChange); // For hash changes (less common on YouTube)

            // Initial check for hash changes that might indicate video change
            const initialVideoId = getVideoId();
            if (initialVideoId) {
                lastVideoId = initialVideoId;
            }
        }, 'initialize');
    }

    // Run initialization when the document is ready
    if (document.readyState === 'loading') {
        safeAddEventListener(document, 'DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
