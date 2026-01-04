// ==UserScript==
// @name         YouTube original Audio Auto Sync Blocker
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Erzwingt das laden der originalen Audiospur und verhindert Auto-Sync dauerhaft so das Automatisch synchronisiert nicht mehr Automatisch läd
// @author       Hiwi234, Claude AI
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
// @match        *://music.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544550/YouTube%20original%20Audio%20Auto%20Sync%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/544550/YouTube%20original%20Audio%20Auto%20Sync%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isActive = true;
    let lastVideoId = '';
    let persistentInterval;
    let audioTrackForced = false;
    let isMobile = false;
    
    // Mobile Detection
    function detectMobile() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        const isMobileURL = window.location.hostname.includes('m.youtube');
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        
        return isMobileUA || isMobileURL || isTouchDevice || window.innerWidth <= 768;
    }
    
    // Konfiguration
    const CONFIG = {
        checkInterval: 1000,        // Überprüfung alle 1 Sekunde
        forceInterval: 500,         // Erzwinge Einstellungen alle 0.5 Sekunden
        maxRetries: 10,
        waitTime: isMobile ? 2000 : 1500  // Längere Wartezeit auf Mobile
    };

    // Aktuelle Video-ID ermitteln
    function getCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v') || '';
    }

    // Prüfe ob Auto-Sync aktiv ist (Mobile + Desktop)
    function isAutoSyncActive() {
        // Desktop Selektoren
        const desktopSelectors = [
            '.ytp-caption-window-container[style*="display: block"]',
            '.caption-window[style*="display: block"]',
            '.ytp-caption-segment',
            '[data-layer="4"]'
        ];
        
        // Mobile Selektoren  
        const mobileSelectors = [
            '.caption-window[style*="display: block"]',
            '.captions-text',
            '.caption-visual-line',
            '.ytp-caption-window-container',
            '.html5-captions-text',
            '[role="region"][aria-live="assertive"]'
        ];
        
        const selectors = isMobile ? [...desktopSelectors, ...mobileSelectors] : desktopSelectors;
        
        return selectors.some(selector => {
            const element = document.querySelector(selector);
            return element && element.offsetParent !== null;
        });
    }

    // Aggressive Auto-Sync Deaktivierung (Mobile + Desktop)
    function forceDisableAutoSync() {
        try {
            // Methode 1: CSS Override für Desktop und Mobile
            let styleElement = document.getElementById('disable-auto-sync-style');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'disable-auto-sync-style';
                
                const desktopCSS = `
                    .ytp-caption-window-container,
                    .caption-window,
                    .ytp-caption-segment,
                    [data-layer="4"] {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }
                `;
                
                const mobileCSS = `
                    .captions-text,
                    .caption-visual-line,
                    .html5-captions-text,
                    [role="region"][aria-live="assertive"],
                    .caption-window,
                    .ytp-caption-window-container {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        height: 0 !important;
                        width: 0 !important;
                        overflow: hidden !important;
                    }
                `;
                
                styleElement.textContent = desktopCSS + (isMobile ? mobileCSS : '');
                document.head.appendChild(styleElement);
            }

            // Methode 2: Event-Listener abfangen (Desktop + Mobile)
            const video = document.querySelector('video');
            if (video) {
                // Verhindere Caption-Events
                const events = isMobile ? 
                    ['loadstart', 'canplay', 'play', 'timeupdate', 'touchstart', 'touchend'] :
                    ['loadstart', 'canplay', 'play', 'timeupdate'];
                    
                events.forEach(eventType => {
                    video.addEventListener(eventType, (e) => {
                        // Entferne Caption-Elemente für Desktop und Mobile
                        const selectors = isMobile ? 
                            '.ytp-caption-window-container, .caption-window, .captions-text, .caption-visual-line, .html5-captions-text' :
                            '.ytp-caption-window-container, .caption-window';
                            
                        document.querySelectorAll(selectors).forEach(el => {
                            if (el.style.display !== 'none') {
                                el.style.display = 'none';
                                el.style.visibility = 'hidden';
                                el.style.opacity = '0';
                            }
                        });
                    }, true);
                });
            }

            // Methode 3: Direkte DOM-Manipulation (Mobile + Desktop)
            const removeSelectors = isMobile ?
                '.ytp-caption-window-container, .caption-window, .ytp-caption-segment, .captions-text, .caption-visual-line' :
                '.ytp-caption-window-container, .caption-window, .ytp-caption-segment';
                
            document.querySelectorAll(removeSelectors).forEach(el => {
                el.remove();
            });

            // Mobile-spezifische Touch-Events blockieren
            if (isMobile) {
                document.addEventListener('touchstart', (e) => {
                    if (e.target.closest('.captions-text, .caption-visual-line')) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, true);
            }

        } catch (error) {
            console.log('Force disable auto-sync error:', error);
        }
    }

    // Originale Audiospur mit mehreren Methoden erzwingen
    function forceOriginalAudio() {
        if (audioTrackForced) return;
        
        try {
            const video = document.querySelector('video');
            if (!video) return;

            // Methode 1: Video-Attribute manipulieren
            if (video.audioTracks && video.audioTracks.length > 0) {
                for (let i = 0; i < video.audioTracks.length; i++) {
                    video.audioTracks[i].enabled = (i === 0); // Nur erste Spur aktivieren
                }
                audioTrackForced = true;
                console.log('Audio track forced via HTML5 API');
            }

            // Methode 2: YouTube-spezifische Manipulation
            const player = document.querySelector('#movie_player');
            if (player && player.getAvailableAudioTracks) {
                try {
                    const tracks = player.getAvailableAudioTracks();
                    if (tracks && tracks.length > 0) {
                        player.setAudioTrack(tracks[0]);
                        audioTrackForced = true;
                        console.log('Audio track forced via YouTube API');
                    }
                } catch (e) {
                    console.log('YouTube API method failed');
                }
            }

        } catch (error) {
            console.log('Force original audio error:', error);
        }
    }

    // Kontinuierliche Überwachung und Erzwingung
    function persistentEnforcement() {
        if (!isActive) return;

        const currentVideoId = getCurrentVideoId();
        
        // Bei neuem Video zurücksetzen
        if (currentVideoId !== lastVideoId) {
            lastVideoId = currentVideoId;
            audioTrackForced = false;
            console.log('New video detected:', currentVideoId);
        }

        // Erzwinge Einstellungen
        forceDisableAutoSync();
        forceOriginalAudio();

        // Überwache und korrigiere YouTube-Änderungen
        const video = document.querySelector('video');
        if (video) {
            // Überwache src-Änderungen
            const currentSrc = video.src || video.currentSrc;
            if (video.dataset.lastSrc !== currentSrc) {
                video.dataset.lastSrc = currentSrc;
                audioTrackForced = false;
                setTimeout(() => {
                    forceOriginalAudio();
                    forceDisableAutoSync();
                }, CONFIG.waitTime);
            }
        }
    }

    // MutationObserver für DOM-Änderungen
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldReforce = false;

            mutations.forEach((mutation) => {
                // Überwache Caption-Container
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.matches && (
                                node.matches('.ytp-caption-window-container') ||
                                node.matches('.caption-window') ||
                                node.querySelector('.ytp-caption-window-container, .caption-window')
                            )) {
                                shouldReforce = true;
                            }
                        }
                    });
                }

                // Überwache Style-Änderungen
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || 
                     mutation.attributeName === 'class')) {
                    const target = mutation.target;
                    if (target.matches && target.matches('.ytp-caption-window-container, .caption-window')) {
                        shouldReforce = true;
                    }
                }
            });

            if (shouldReforce) {
                setTimeout(forceDisableAutoSync, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'data-layer']
        });

        return observer;
    }

    // YouTube-spezifische Event-Listener (Mobile + Desktop)
    function setupYouTubeListeners() {
        // YouTube Navigation Events
        window.addEventListener('yt-navigate-start', () => {
            audioTrackForced = false;
        });

        window.addEventListener('yt-navigate-finish', () => {
            setTimeout(() => {
                audioTrackForced = false;
                persistentEnforcement();
            }, CONFIG.waitTime);
        });

        // YouTube Player Events
        window.addEventListener('yt-player-updated', () => {
            setTimeout(persistentEnforcement, CONFIG.waitTime);
        });

        // Fullscreen Events
        document.addEventListener('fullscreenchange', () => {
            setTimeout(forceDisableAutoSync, 500);
        });

        // Page Visibility
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(persistentEnforcement, 500);
            }
        });

        // Mobile-spezifische Events
        if (isMobile) {
            // Touch Events
            document.addEventListener('touchstart', () => {
                setTimeout(forceDisableAutoSync, 200);
            }, { passive: true });

            // Orientation Change
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    persistentEnforcement();
                }, 1000);
            });

            // Mobile YouTube App Events
            window.addEventListener('yt-page-data-updated', () => {
                setTimeout(persistentEnforcement, CONFIG.waitTime);
            });

            // Scroll Events (Mobile YouTube scrollt oft)
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(forceDisableAutoSync, 300);
            }, { passive: true });
        }
    }

    // Hauptinitialisierung
    function init() {
        // Mobile Detection initialisieren
        isMobile = detectMobile();
        console.log('YouTube Persistent Audio Control aktiviert -', isMobile ? 'Mobile Modus' : 'Desktop Modus');
        
        // FORCE DESKTOP VERSION auf Mobile wenn möglich
        if (isMobile && window.location.hostname === 'm.youtube.com') {
            try {
                // Versuche zur Desktop-Version zu wechseln
                const currentURL = window.location.href;
                const desktopURL = currentURL.replace('m.youtube.com', 'www.youtube.com');
                
                // Setze Desktop User-Agent Cookie
                document.cookie = "PREF=f1=50000000&f6=8&hl=de; path=/; domain=.youtube.com";
                
                console.log('Versuche Desktop-Version zu laden...');
                window.location.replace(desktopURL + '&app=desktop');
                return; // Script wird auf Desktop-Version neu geladen
            } catch (error) {
                console.log('Kann nicht zur Desktop-Version wechseln:', error);
            }
        }
        
        // Alternative: Desktop-Modus erzwingen über User-Agent Override
        if (isMobile) {
            try {
                // Override User-Agent für YouTube
                Object.defineProperty(navigator, 'userAgent', {
                    get: function() {
                        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
                    },
                    configurable: true
                });
                
                // Trigger Page Reload mit Desktop User-Agent
                if (!sessionStorage.getItem('desktop-forced')) {
                    sessionStorage.setItem('desktop-forced', 'true');
                    window.location.reload();
                    return;
                }
            } catch (error) {
                console.log('User-Agent Override fehlgeschlagen');
            }
        }
        
        // Mobile-spezifische Konfiguration anpassen
        if (isMobile) {
            CONFIG.waitTime = 3000; // Noch längere Wartezeit
            CONFIG.checkInterval = 2000; // Langsamere Checks
            
            // Zusätzliche Mobile-Fixes
            setTimeout(() => {
                // Erzwinge Desktop-Layout CSS
                const mobileOverride = document.createElement('style');
                mobileOverride.innerHTML = `
                    /* Erzwinge Desktop-Layout */
                    #masthead-container { display: block !important; }
                    ytd-app { --ytd-sidebar-width: 240px !important; }
                    .mobile-topbar-header { display: none !important; }
                    
                    /* Mobile Caption Override */
                    .caption-window,
                    .ytp-caption-window-container,
                    .captions-text,
                    .caption-visual-line,
                    .html5-captions-text,
                    [role="region"][aria-live="assertive"] {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        height: 0 !important;
                        width: 0 !important;
                        position: absolute !important;
                        left: -9999px !important;
                        top: -9999px !important;
                        z-index: -9999 !important;
                    }
                `;
                document.head.appendChild(mobileOverride);
            }, 1000);
        }
        
        // Sofortige Anwendung
        setTimeout(() => {
            persistentEnforcement();
        }, CONFIG.waitTime);

        // Kontinuierliche Überwachung
        persistentInterval = setInterval(persistentEnforcement, CONFIG.checkInterval);

        // Aggressive Überwachung für Auto-Sync (häufiger auf Mobile)
        const forceInterval = isMobile ? 300 : CONFIG.forceInterval;
        setInterval(forceDisableAutoSync, forceInterval);

        // Setup Observers und Listeners
        setupMutationObserver();
        setupYouTubeListeners();

        // Keyboard Shortcuts (nur Desktop)
        if (!isMobile) {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                    isActive = !isActive;
                    console.log('Script', isActive ? 'aktiviert' : 'deaktiviert');
                }
            });
        }

        // Mobile-spezifische Touch-Geste für Ein/Aus (dreimal tippen)
        if (isMobile) {
            let tapCount = 0;
            let tapTimer;
            
            document.addEventListener('touchend', (e) => {
                tapCount++;
                if (tapCount === 1) {
                    tapTimer = setTimeout(() => {
                        tapCount = 0;
                    }, 1000);
                } else if (tapCount === 3) {
                    clearTimeout(tapTimer);
                    tapCount = 0;
                    isActive = !isActive;
                    console.log('Script', isActive ? 'aktiviert' : 'deaktiviert');
                    
                    // Visuelles Feedback auf Mobile
                    const feedback = document.createElement('div');
                    feedback.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        z-index: 10000;
                        font-size: 14px;
                        font-family: Arial, sans-serif;
                    `;
                    feedback.textContent = `Script ${isActive ? 'aktiviert' : 'deaktiviert'}`;
                    document.body.appendChild(feedback);
                    
                    setTimeout(() => {
                        if (feedback.parentNode) {
                            feedback.remove();
                        }
                    }, 2000);
                }
            }, { passive: true });
            
            // Mobile: Erzwinge Desktop-Ansicht Button (falls verfügbar)
            setTimeout(() => {
                const desktopLink = document.querySelector('a[href*="app=desktop"]') || 
                                  document.querySelector('[data-desktop-link]') ||
                                  document.querySelector('a[href*="www.youtube.com"]');
                                  
                if (desktopLink) {
                    console.log('Desktop-Link gefunden, klicke automatisch...');
                    desktopLink.click();
                }
            }, 2000);
        }

        // Spezielle Mobile-Browser Behandlung
        if (isMobile) {
            // Samsung Internet Browser
            if (navigator.userAgent.includes('SamsungBrowser')) {
                setTimeout(() => {
                    const metaViewport = document.querySelector('meta[name="viewport"]');
                    if (metaViewport) {
                        metaViewport.setAttribute('content', 'width=1024, initial-scale=0.5');
                    }
                }, 1000);
            }
            
            // Chrome Mobile mit Desktop-Mode erzwingen
            if (navigator.userAgent.includes('Chrome') && navigator.userAgent.includes('Mobile')) {
                document.cookie = "VISITOR_INFO1_LIVE=; path=/; domain=.youtube.com; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "PREF=f1=50000000&f6=8&hl=de&f5=30&f4=4000000; path=/; domain=.youtube.com; max-age=31536000";
            }
        }
    }

    // Anti-Tamper Schutz
    Object.defineProperty(window, 'ytInitialData', {
        set: function(value) {
            this._ytInitialData = value;
            setTimeout(persistentEnforcement, 500);
        },
        get: function() {
            return this._ytInitialData;
        }
    });

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }

    // Cleanup bei Page Unload
    window.addEventListener('beforeunload', () => {
        if (persistentInterval) {
            clearInterval(persistentInterval);
        }
    });

})();