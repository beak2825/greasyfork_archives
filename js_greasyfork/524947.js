// ==UserScript==
    // @name         Bloqueador Universal de Anúncios
    // @namespace    http://tampermonkey.net/
    // @version      3.1
    // @description  O bloqueador de anúncios mais agressivo para todos os sites
    // @author       _PeDeCoca
    // @match        *://*/*
    // @match        http://*/*
    // @match        https://*/*
    // @grant        GM_addStyle
    // @grant        unsafeWindow
    // @grant        GM_xmlhttpRequest
    // @grant        GM_webRequest
    // @run-at       document-start
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524947/Bloqueador%20Universal%20de%20An%C3%BAncios.user.js
// @updateURL https://update.greasyfork.org/scripts/524947/Bloqueador%20Universal%20de%20An%C3%BAncios.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // Estilos do ícone do escudo
        const iconStyles = `
            #adblock-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                cursor: pointer;
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 25px;
                background: white;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            #adblock-indicator::before {
                content: '🛡️';
                position: relative;
                z-index: 2;
            }

            #adblock-indicator::after {
                content: '';
                position: absolute;
                inset: -3px;
                background: conic-gradient(
                    from 0deg,
                    #ff0000,
                    #ff7300,
                    #fffb00,
                    #48ff00,
                    #00ffd5,
                    #002bff,
                    #7a00ff,
                    #ff00c8,
                    #ff0000
                );
                border-radius: 50%;
                z-index: 0;
                animation: rotate 3s linear infinite, glow 2s ease-in-out infinite alternate;
                opacity: 0.8;
            }

            #adblock-indicator:hover {
                transform: scale(1.1);
            }

            #adblock-indicator:hover::after {
                animation: rotate 1s linear infinite, glow 1s ease-in-out infinite alternate;
                opacity: 1;
            }

            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes glow {
                0% {
                    filter: hue-rotate(0deg) brightness(1) blur(2px);
                    transform: rotate(0deg) scale(1);
                }
                100% {
                    filter: hue-rotate(360deg) brightness(1.2) blur(3px);
                    transform: rotate(360deg) scale(1.05);
                }
            }
        `;

        // Seletores para bloqueio agressivo de anúncios
        const aggressiveAdStyles = `
            /* Seletores específicos de anúncios */
            ins.adsbygoogle,
            .adsbygoogle,
            iframe[src*="adsbygoogle"],
            [id*="google_ads_"],
            [id*="adcontainer"],
            [class*="adsbygoogle"],
            [data-ad-client],
            [id*="doubleclick"],
            /* Seletores adicionais */
            [id*="taboola"],
            [id*="outbrain"],
            [class*="partner-ads"],
            [class*="commercial-unit"],
            [data-ad],
            [data-native-ad],
            [data-advertisement],
            [data-adslot],
            [data-ad-placement],
            [data-ad-unit],
            [data-admanager],
            [data-ad-client],
            [data-ad-slot],
            [data-ad-format],
            [data-adsbygoogle-status],
            [data-ad-status],
            /* Padrões comuns de containers de anúncios */
            .ad-container,
            .ad-wrapper,
            .advertisement,
            .advertising,
            .sponsor-container,
            .sponsored-content,
            .promoted-content,
            .native-ad,
            .premium-ad,
            .sticky-ad,
            .top-ad,
            .side-ad,
            .bottom-ad,
            /* Alvos adicionais */
            [class*="-ad-"],
            [id*="-ad-"],
            [class*="sponsored"],
            [class*="promotion"],
            [class*="advertisement"],
            [class*="adsense"],
            [id*="adsense"],
            [data-purpose*="advertisement"],
            [aria-label*="Advertisement"],
            /* Padrões comuns de redes de anúncios */
            [src*="serving-sys.com"],
            [src*="pubmatic"],
            [src*="criteo"],
            [src*="outbrain"],
            [src*="taboola"],
            [src*="adnxs"],
            [src*="yieldmo"],
            [src*="amazon-adsystem"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                top: -9999px !important;
                left: -9999px !important;
                z-index: -999 !important;
            }
        `;

        // Adiciona ambos os estilos
        GM_addStyle(iconStyles + aggressiveAdStyles);

        // Adiciona simulador de YouTube Premium
        const simulatePremium = {
            init() {
                // Simula status premium
                Object.defineProperty(window, 'ytplayer', {
                    writable: false,
                    value: {
                        config: {
                            args: {
                                raw_player_response: {
                                    adPlacements: [],
                                    videoDetails: {
                                        isLiveContent: false
                                    }
                                },
                                account_playback_token: "PREMIUM_USER_TOKEN",
                                enablecsi: "0",
                                accountType: "PREMIUM",
                                user_display_image: "https://yt3.ggpht.com",
                                user_display_name: "Premium User",
                                external_fullscreen: true,
                                autoplay: "1",
                                kicked: "0",
                                innertube_api_version: "v1",
                                format: "json",
                                premium_navigation: "1",
                                has_premium_navigation: "1",
                                premium_features: ["premium_content", "premium_music", "background_play"],
                                premium: "1",
                                is_premium_user: true
                            }
                        }
                    }
                });

                // Simula funcionalidades premium
                window.yt = {
                    config_: {
                        PLAYER_CONFIG: {
                            args: {
                                raw_player_response: { adPlacements: [] },
                                premium: "1"
                            }
                        }
                    }
                };

                // Injeta cookies premium
                document.cookie = "VISITOR_INFO1_LIVE=premium; path=/";
                document.cookie = "LOGIN_INFO=premium:1; path=/";
                document.cookie = "PREF=f6=40000000&f7=100; path=/";
            },

            injectPremiumScript() {
                const script = document.createElement('script');
                script.textContent = `
                    if (typeof ytplayer !== 'undefined') {
                        ytplayer.config.args.raw_player_response.adPlacements = [];
                        ytplayer.config.args.raw_player_response.playerAds = [];
                        ytplayer.config.args.premium = "1";
                    }
                    window.isPremiumUser = true;
                    window.isMonetized = false;
                `;
                document.head.appendChild(script);
            }
        };

        const simulateSpotifyPremium = {
            init() {
                // Força status Premium de forma agressiva
                Object.defineProperty(window, 'Spotify', {
                    writable: false,
                    value: {
                        Player: {
                            prototype: {
                                skipAd: () => true,
                                isPremium: true,
                                getAdState: () => false,
                                shouldShowAd: () => false
                            }
                        }
                    }
                });
                // Injeta cookies premium
                document.cookie = "sp_dc=aggressive_premium_token; path=/";
                document.cookie = "sp_key=fake_premium_key; path=/";
            },
            injectPremiumScript() {
                const script = document.createElement('script');
                script.textContent = `
                    if (window.Spotify && window.Spotify.Player) {
                        window.Spotify.Player.prototype.isPremium = true;
                    }
                    window.isPremiumUser = true;
                `;
                document.head.appendChild(script);
            }
        };

        const simulateTwitchPremium = {
            init() {
                // Força status de conta premium/turbo
                document.cookie = "twitch_turbo_user=1; path=/";
                Object.defineProperty(window, 'TwitchTurboUser', {
                    writable: false,
                    value: true
                });
            },
            injectPremiumScript() {
                const script = document.createElement('script');
                script.textContent = `
                    window.isTurboUser = true;
                    if (window.Twitch) {
                        Twitch.isTurboUser = true;
                    }
                `;
                document.head.appendChild(script);
            }
        };

        const simulateYouTubeMusicPremium = {
            init() {
                // Simula status Premium para YouTube Music
                document.cookie = "YTMUSIC_PREF=premium; path=/";
                Object.defineProperty(window, 'ytmusic', {
                    writable: false,
                    value: { isPremium: true }
                });
            },
            injectPremiumScript() {
                const script = document.createElement('script');
                script.textContent = `
                    if (typeof ytmusic !== 'undefined') {
                        ytmusic.isPremium = true;
                    }
                    window.isYTMusicPremiumUser = true;
                `;
                document.head.appendChild(script);
            }
        };

        const youtubeSpecificFixes = {
            // Restaura elementos importantes do YouTube
            restoreYouTubeUI() {
                const importantSelectors = [
                    'ytd-app',
                    'ytd-page-manager',
                    'ytd-watch-flexy',
                    'ytd-search-box',
                    '#content',
                    '#columns',
                    '#primary',
                    '#secondary',
                    '#masthead',
                    '#player'
                ];

                importantSelectors.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.style.display = '';
                        element.style.visibility = '';
                        element.style.opacity = '';
                    }
                });
            },

            // Bypass novo sistema anti-adblock
            bypassNewDetection() {
                Object.defineProperty(window, 'ytplayer', {
                    writable: false,
                    value: {
                        config: {
                            loaded: true,
                            args: {
                                raw_player_response: {
                                    adPlacements: [],
                                    playerAds: [],
                                    adSlots: [],
                                    videoDetails: {
                                        isLiveContent: false
                                    }
                                },
                                ad3_module: '0',
                                allow_html5_ads: '0',
                                enablecsi: '0',
                                use_player_ads_pageshell: false
                            }
                        }
                    }
                });

                // Força remoção de overlay anti-adblock
                setInterval(() => {
                    document.querySelectorAll('tp-yt-paper-dialog, .style-scope.ytd-enforcement-message-view-model').forEach(el => el.remove());
                }, 100);
            },

            // Restaura funcionalidade de vídeo
            fixVideoPlayer() {
                const restoreVideo = () => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.style.display = '';
                        video.play().catch(() => {});
                    }
                };

                setInterval(restoreVideo, 1000);
            },

            // Adiciona bypass para tela inicial
            bypassInitialScreen() {
                const removeInitialOverlay = () => {
                    // Remove diálogo de bloqueio inicial
                    const selectors = [
                        'ytd-popup-container',
                        'tp-yt-iron-overlay-backdrop',
                        'ytd-enforcement-message-view-model',
                        '.opened',
                        '[dialog]',
                        '#dialog',
                        '.ytd-popup-container'
                    ];

                    selectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            el.remove();
                        });
                    });

                    // Remove classe de bloqueio do body
                    document.body.classList.remove('opened');
                    document.documentElement.classList.remove('opened');

                    // Força exibição do conteúdo
                    const content = document.querySelector('ytd-app');
                    if (content) {
                        content.removeAttribute('dialog-shown');
                        content.style.display = 'block';
                    }

                    // Restaura scroll
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                };

                // Remove overlay imediatamente e monitora por novos
                removeInitialOverlay();
                setInterval(removeInitialOverlay, 100);

                // Força carregamento do conteúdo inicial
                const forceInitialLoad = () => {
                    const app = document.querySelector('ytd-app');
                    if (app) {
                        app.removeAttribute('loading');
                        const content = document.querySelector('#content');
                        if (content) {
                            content.style.display = 'block';
                            content.removeAttribute('hidden');
                        }
                    }
                };

                // Força carregamento após um breve delay
                setTimeout(forceInitialLoad, 500);
            },

            init() {
                // Inicializa simulação premium primeiro
                simulatePremium.init();
                simulatePremium.injectPremiumScript();

                // Remove espera e executa diretamente
                this.bypassInitialScreen();
                this.bypassNewDetection();
                this.restoreYouTubeUI();
                this.fixVideoPlayer();

                // Monitora mudanças de forma mais agressiva
                const observer = new MutationObserver(() => {
                    this.restoreYouTubeUI();
                    this.fixVideoPlayer();

                    // Remove elementos problemáticos imediatamente
                    document.querySelectorAll(`
                        ytd-popup-container,
                        tp-yt-iron-overlay-backdrop,
                        ytd-enforcement-message-view-model,
                        .opened,
                        [dialog],
                        #dialog,
                        .ytd-popup-container,
                        .video-ads,
                        .ytp-ad-overlay-slot,
                        #masthead-ad,
                        #player-ads,
                        ytd-promoted-video-renderer,
                        .ytd-promoted-sparkles-web-renderer
                    `).forEach(el => el.remove());
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            }
        };

        const youtubeMusicSpecificFixes = {
            init() {
                simulateYouTubeMusicPremium.init();
                simulateYouTubeMusicPremium.injectPremiumScript();
                // ...existing code...
                this.removeMusicAds();
                this.setupMusicAdBypass();
            },
            removeMusicAds() {
                // ...existing code...
            },
            setupMusicAdBypass() {
                // ...existing code...
            }
        };

        const twitchSpecificFixes = {
            init() {
                simulateTwitchPremium.init();
                simulateTwitchPremium.injectPremiumScript();
                this.removeTwitchAds();
                this.bypassTwitchDetection();
                this.setupTwitchObserver();
                this.injectTwitchAdBlock();
                this.hookTwitchPlayer();
            },

            removeTwitchAds() {
                const adSelectors = [
                    '[data-test-selector="ad-banner"]',
                    '.tw-tower',
                    '.video-player__overlay',
                    '[data-a-target="ads-banner"]',
                    '.ads-manager-banner',
                    '.stream-display-ad',
                    '.beneath-the-stream-ad',
                    // Novos seletores mais específicos
                    '.video-player__overlay-ads',
                    '.extension-taskbar__overlay-placement',
                    '.tw-absolute.tw-full-width.tw-full-height',
                    '.player-overlay-background',
                    '[data-a-target*="preroll"]',
                    '[data-test-selector*="ad-strip"]',
                    '.top-bar-ad',
                    '.player-ad-notice',
                    '.player-advert'
                ];

                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                });
            },

            bypassTwitchDetection() {
                // Simula que não tem adblock
                Object.defineProperties(window, {
                    showAd: { value: false, writable: false },
                    isAdBlockEnabled: { value: false, writable: false },
                    hasAdBlock: { value: false, writable: false }
                });

                // Força remoção de overlay de ad
                const removeOverlay = () => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.style.filter = 'none';
                        video.style.opacity = '1';
                        video.play();
                    }
                    document.querySelectorAll('.player-overlay').forEach(el => el.remove());
                };
                setInterval(removeOverlay, 100);
            },

            injectTwitchAdBlock() {
                const script = document.createElement('script');
                script.textContent = `
                    // Override player methods
                    if (window.Player) {
                        Player.prototype.triggerAd = function() { return false; };
                        Player.prototype.shouldShowAd = function() { return false; };
                    }
                    // Block ad requests
                    window.addEventListener('beforescriptexecute', function(e) {
                        if (e.target.src.includes('amazon-adsystem') ||
                            e.target.src.includes('amazon-ads') ||
                            e.target.src.includes('adswizz') ||
                            e.target.src.includes('doubleclick')) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    }, true);
                `;
                document.head.appendChild(script);
            },

            hookTwitchPlayer() {
                // Hook no player da Twitch
                const hookPlayer = () => {
                    const video = document.querySelector('video');
                    if (video && !video.hooked) {
                        video.hooked = true;

                        // Força volume e remove mute durante ads
                        video.addEventListener('volumechange', () => {
                            if (document.querySelector('[data-a-target*="ad"]')) {
                                video.volume = 0;
                                video.muted = true;
                            }
                        });

                        // Força playback durante ads
                        video.addEventListener('pause', () => {
                            if (document.querySelector('[data-a-target*="ad"]')) {
                                video.play();
                            }
                        });

                        // Força pular ads
                        video.addEventListener('timeupdate', () => {
                            if (document.querySelector('[data-a-target*="ad"]')) {
                                video.currentTime = video.duration;
                            }
                        });
                    }
                };
                setInterval(hookPlayer, 1000);
            },

            setupTwitchObserver() {
                const observer = new MutationObserver(() => {
                    this.removeTwitchAds();

                    // Remove qualquer elemento que contenha "ad" no data-a-target
                    document.querySelectorAll('[data-a-target*="ad"]').forEach(el => el.remove());

                    // Remove scripts de anúncios dinamicamente
                    document.querySelectorAll('script[src*="amazon-adsystem"], script[src*="adswizz"]').forEach(el => el.remove());
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['src', 'data-a-target']
                });
            }
        };

        const spotifySpecificFixes = {
            init() {
                simulateSpotifyPremium.init();
                simulateSpotifyPremium.injectPremiumScript();
                this.removeSpotifyAds();
                this.bypassPremiumCheck();
                this.setupSpotifyObserver();
                this.injectSpotifyAudioFix();
            },

            removeSpotifyAds() {
                const adSelectors = [
                    '.spotify-ads',
                    '[data-ad-type]',
                    '[data-ad-token]',
                    '.ad-container',
                    '.ad-placeholder',
                    '.sponsor-message',
                    '.advertisement',
                    '[data-testid*="ad"]',
                    '[data-testid="sponsored-shelf"]',
                    '[data-testid="premium-upsell"]',
                    '.upgrade-button',
                    '.advertising'
                ];

                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                });
            },

            bypassPremiumCheck() {
                // Simula conta premium
                Object.defineProperties(window, {
                    Spotify: {
                        value: {
                            Player: {
                                prototype: {
                                    skipAd: () => true,
                                    getAdState: () => false,
                                    shouldShowAd: () => false
                                }
                            }
                        }
                    }
                });

                // Simula cookies premium
                document.cookie = "premium=1; path=/";
                document.cookie = "spotify_premium=1; path=/";
            },

            injectSpotifyAudioFix() {
                const script = document.createElement('script');
                script.textContent = `
                    // Override audio context
                    const originalAudioContext = window.AudioContext || window.webkitAudioContext;
                    window.AudioContext = window.webkitAudioContext = function(...args) {
                        const instance = new originalAudioContext(...args);
                        const originalResume = instance.resume.bind(instance);
                        instance.resume = function() {
                            return originalResume().then(() => {
                                return Promise.resolve();
                            });
                        };
                        return instance;
                    };

                    // Força qualidade máxima de áudio
                    Object.defineProperty(window, 'MediaSource', {
                        writable: true,
                        value: class extends window.MediaSource {
                            constructor() {
                                super();
                                this.setQualityLevel = () => {};
                            }
                        }
                    });
                `;
                document.head.appendChild(script);
            },

            setupSpotifyObserver() {
                const observer = new MutationObserver(() => {
                    // Remove anúncios dinamicamente
                    this.removeSpotifyAds();

                    // Mantém a música tocando
                    const audioElement = document.querySelector('audio');
                    if (audioElement && audioElement.paused) {
                        audioElement.play().catch(() => {});
                    }

                    // Remove overlays de upgrade
                    document.querySelectorAll('[data-testid*="upsell"],[data-testid*="premium"]').forEach(el => el.remove());
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            }
        };

        const bodyContentFixes = {
            init() {
                this.removeCommonAds();
                this.blockImageAds();
                this.blockThumbnailAds();
                this.setupBodyObserver();
            },

            removeCommonAds() {
                const adSelectors = [
                    '[class*="adPlacements"]',
                    '[class*="advertisement"]',
                    '[data-ad-client]',
                    '[id*="google_ads_iframe"]',
                    '[id*="ad-"],[class*="ad-"]',
                    '[class*="sponsored"]',
                    '[class*="promotion"]',
                    '[data-ad]',
                    '[data-advertisement]',
                    '[data-testid*="ad"]',
                    '[aria-label*="Advertisement"]',
                    // Thumbnail specific
                    '.thumbnailOverlayTimeStatusRenderer',
                    '.ytp-ad-overlay-container',
                    '.ytp-ad-text-overlay',
                    '[class*="adSlot"]',
                    '[class*="adContainer"]',
                    // Specific to body content
                    'iframe[src*="doubleclick"]',
                    'iframe[src*="googlesyndication"]',
                    '.movingThumbnailDetails',
                    '[data-purpose*="advertisement"]',
                    '.metadataBadgeRenderer'
                ];

                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        try {
                            el.style.display = 'none';
                            el.remove();
                        } catch (e) {}
                    });
                });
            },

            blockImageAds() {
                const imagePatterns = [
                    'ggpht.com',
                    'googleusercontent.com',
                    'ytimg.com',
                    '/ads/',
                    'ad-',
                    'advert'
                ];

                document.querySelectorAll('img').forEach(img => {
                    if (imagePatterns.some(pattern => img.src?.includes(pattern))) {
                        if (!this.isImportantContent(img)) {
                            img.style.display = 'none';
                        }
                    }
                });
            },

            isImportantContent(element) {
                // Check if image is part of actual content
                return element.closest('.video-content') ||
                       element.closest('.channel-content') ||
                       element.closest('.user-content');
            },

            blockThumbnailAds() {
                const thumbnailPatterns = [
                    'mqdefault_6s.webp',
                    'hqdefault.jpg',
                    'videoplayback',
                    'googlevideo.com'
                ];

                document.querySelectorAll('.richThumbnail, .movingThumbnailRenderer').forEach(el => {
                    if (thumbnailPatterns.some(pattern =>
                        el.innerHTML.includes(pattern) ||
                        el.outerHTML.includes(pattern))) {
                        el.remove();
                    }
                });
            },

            setupBodyObserver() {
                const observer = new MutationObserver(() => {
                    this.removeCommonAds();
                    this.blockImageAds();
                    this.blockThumbnailAds();
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            }
        };

        const ultraBlocker = {
            // Adiciona o indicador visual do bloqueador
            addIndicator() {
                const indicator = document.createElement('div');
                indicator.id = 'adblock-indicator';
                indicator.title = 'AdBlock Ativado - Clique para entrar em contato discord: _PeDeCoca';
                indicator.addEventListener('click', () => {
                    window.open('https://discord.com/users/_PeDeCoca', '_blank');
                });
                document.body.appendChild(indicator);
            },

            // Inicialização do bloqueador
            async init() {
                // Adiciona fixes específicos para YouTube primeiro com await
                if (window.location.hostname.includes('youtube.com')) {
                    await youtubeSpecificFixes.init();
                }

                // Add Twitch specific fixes
                if (window.location.hostname.includes('twitch.tv')) {
                    await twitchSpecificFixes.init();
                }

                if (window.location.hostname.includes('spotify.com')) {
                    await spotifySpecificFixes.init();
                }

                if (window.location.hostname.includes('music.youtube.com')) {
                    youtubeMusicSpecificFixes.init();
                }

                // Add body content fixes
                await bodyContentFixes.init();

                this.addIndicator();
                this.injectAntiAdBlockKiller();

                if (!this.isSafeSite()) {
                    this.setupAggressiveSkipper();
                    this.blockGoogleAds();
                }

                // Always run these safer methods
                this.setupObserver();
                this.blockAdvancedAds();
                this.setupFetchBlocker();
                this.setupNetworkBlocker(); // Add network blocker

                // Add continuous monitoring
                this.startContinuousMonitoring();

                // Replace aggressive removal with safer version
                setInterval(() => {
                    this.safeAdRemoval();
                }, 2000);

                // Adiciona bypass de erros 403
                this.setupVideoErrorBypass();
            },

            // Lista de sites e elementos seguros
            safeList: {
                domains: [
                    'google.',
                    'duckduckgo.com',
                    'bing.com',
                    'yahoo.com',
                    'github.com',
                    'stackoverflow.com',
                    'gitlab.com'
                ],
                selectors: [
                    'nav',
                    'header',
                    'main',
                    'footer',
                    '.search',
                    '.navigation',
                    '.menu',
                    '.content'
                ]
            },

            // Verifica se é um site seguro
            isSafeSite() {
                return this.safeList.domains.some(domain => window.location.hostname.includes(domain));
            },

            // Verifica se é um elemento crítico que não deve ser bloqueado
            isCriticalElement(element) {
                return this.safeList.selectors.some(selector =>
                    element.matches(selector) || element.closest(selector)
                );
            },

            // Lista de motores de busca
            searchEngines: [
                'google.com',
                'google.',
                'duckduckgo.com',
                'bing.com',
                'yahoo.com',
                'yandex.com',
                'baidu.com'
            ],

            // Verifica se é um motor de busca
            isSearchEngine() {
                return this.searchEngines.some(domain => window.location.hostname.includes(domain));
            },

            // Remove elementos de anúncios
            removeAdElements() {
                if (this.isSearchEngine()) return; // Skip for search engines

                const adSelectors = [
                    '.ad-showing',
                    '.ytp-ad-overlay-container',
                    '.video-ads',
                    '.ytp-ad-overlay-slot'
                ];

                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        try {
                            el.style.display = 'none';
                        } catch (e) {}
                    });
                });
            },

            // Configuração do pulador agressivo de anúncios
            setupAggressiveSkipper() {
                if (this.isSearchEngine()) return; // Skip for search engines

                if (window.location.hostname.includes('youtube.com')) {
                    setInterval(() => {
                        // Remove overlays de anúncio
                        document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-skip-button-slot').forEach(el => el.remove());

                        // Força skip em anúncios
                        const video = document.querySelector('video');
                        if (video && document.querySelector('.ad-showing, [class*="ad-interrupting"]')) {
                            video.currentTime = video.duration;
                            video.playbackRate = 16;
                            this.clickSkipBtn();

                            // Remove classe de anúncio
                            document.querySelector('.html5-video-player')?.classList.remove('ad-showing', 'ad-interrupting');
                        }
                    }, 50);
                }

                setInterval(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        // Força o pulo de qualquer conteúdo publicitário
                        if (document.querySelector('.ad-showing')) {
                            video.currentTime = video.duration;
                            video.playbackRate = 16;
                            this.clickSkipBtn();
                        }

                        // Remove anúncios sobrepostos
                        this.removeAdElements();
                    }
                }, 50);
            },

            // Clica no botão de pular anúncio
            clickSkipBtn() {
                const skipBtns = [
                    '.ytp-ad-skip-button',
                    '.videoAdUiSkipButton',
                    '.ytp-ad-skip-button-modern'
                ];

                skipBtns.forEach(btn => {
                    const skipButton = document.querySelector(btn);
                    if (skipButton) skipButton.click();
                });
            },

            // Sistema anti-detecção de bloqueador
            injectAntiAdBlockKiller() {
                try {
                    // Use a proxy to intercept property access
                    const handler = {
                        get: (target, prop) => {
                            if (prop === 'adBlocker') return false;
                            if (prop === 'google_ad_status') return 1;
                            if (prop === 'ytInitialPlayerResponse') {
                                return {
                                    adPlacements: [],
                                    playerAds: [],
                                    adSlots: [],
                                    videoDetails: { isLiveContent: false }
                                };
                            }
                            return target[prop];
                        }
                    };

                    // Create proxy for window object
                    if (typeof unsafeWindow !== 'undefined') {
                        const windowProxy = new Proxy(unsafeWindow, handler);
                        Object.defineProperty(window, '__proto__', {
                            get: () => windowProxy
                        });
                    }

                    // Alternative method using getters
                    try {
                        Object.defineProperties(window, {
                            'adBlocker': {
                                get: () => false,
                                configurable: true
                            },
                            'google_ad_status': {
                                get: () => 1,
                                configurable: true
                            }
                        });
                    } catch (e) {
                        console.log('Fallback getter setup');
                    }

                    // Remove existing ad detectors
                    const removeAdDetectors = () => {
                        const detectors = [
                            'detectAdBlock',
                            'onAdBlockStart',
                            'adBlockDetected',
                            'getAdsStatus',
                            'checkAdBlock'
                        ];

                        detectors.forEach(name => {
                            try {
                                window[name] = undefined;
                                delete window[name];
                            } catch (e) {}
                        });
                    };

                    removeAdDetectors();
                    setInterval(removeAdDetectors, 1000);

                } catch (e) {
                    console.log('Using minimal anti-adblock');
                    // Minimal fallback that won't trigger errors
                    try {
                        window.adBlocker = false;
                    } catch (e) {}
                }
            },

            // Interceptação de requisições XHR
            hijackXHR() {
                const XHR = XMLHttpRequest.prototype;
                const open = XHR.open;
                const send = XHR.send;

                XHR.open = function(method, url) {
                    if (url.includes('/api/stats/')) {
                        arguments[1] = 'about:blank';
                    }
                    return open.apply(this, arguments);
                };

                XHR.send = function(data) {
                    if (this.responseType === 'json' && data?.includes('adPlacements')) {
                        return;
                    }
                    return send.apply(this, arguments);
                };
            },

            // Observador de mudanças no DOM
            setupObserver() {
                const safeRemove = (element) => {
                    try {
                        if (element && element.parentNode) {
                            element.style.display = 'none';
                            setTimeout(() => {
                                try {
                                    element.remove();
                                } catch (e) {}
                            }, 0);
                        }
                    } catch (e) {}
                };

                const observer = new MutationObserver((mutations) => {
                    if (this.isSafeSite()) return;

                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && !this.isCriticalElement(node)) {
                                if (node.matches('[id*="google_ads_"],[class*="adsbygoogle"]')) {
                                    node.style.display = 'none';
                                }
                            }
                        });
                    });
                });

                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            },

            // Bloqueio de anúncios do Google
            blockGoogleAds() {
                // Padrões de bloqueio
                const blockPatterns = [
                    'googlesyndication.com',
                    'doubleclick.net',
                    'google-analytics.com',
                    '/pagead/',
                    'ad.doubleclick.net'
                ];

                // Remove scripts existentes
                document.querySelectorAll('script').forEach(script => {
                    if (blockPatterns.some(pattern => script.src.includes(pattern))) {
                        script.remove();
                    }
                });

                // Previne carregamento de novos scripts
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.tagName === 'SCRIPT' &&
                                blockPatterns.some(pattern => node.src?.includes(pattern))) {
                                node.remove();
                            }
                        });
                    });
                });

                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            },

            // Observador do player de vídeo
            setupPlayerObserver() {
                // Observer específico para o player
                const observer = new MutationObserver(() => {
                    // Remove classe de anúncio do player
                    const player = document.querySelector('.html5-video-player');
                    if (player) {
                        player.classList.remove('ad-showing', 'ad-interrupting', 'ad-created');
                    }

                    // Força o skip de anúncios
                    const video = document.querySelector('video');
                    if (video && document.querySelector('[class*="ad-showing"]')) {
                        video.currentTime = video.duration;
                        const skipButton = document.querySelector('.ytp-ad-skip-button');
                        if (skipButton) skipButton.click();
                    }

                    // Remove containers de anúncios
                    [
                        '.ytp-ad-player-overlay-layout',
                        '.ytp-ad-player-overlay-layout__player-card-container',
                        '.ytp-ad-persistent-progress-bar-container',
                        '.video-ads.ytp-ad-module',
                        '[class*="ytp-ad-"]'
                    ].forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => el.remove());
                    });
                });

                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
            },

            // Remoção segura de anúncios
            safeAdRemoval() {
                if (this.isSafeSite()) return;

                const adPatterns = [
                    'ad-', 'ads-', 'adv-', 'sponsored', 'advertisement',
                    'google_ads', 'adsystem', 'adsbygoogle'
                ];

                document.querySelectorAll('[class*="ad-"],[id*="ad-"],[class*="ads"],[id*="ads"]').forEach(el => {
                    if (!this.isCriticalElement(el) &&
                        adPatterns.some(pattern => el.className.includes(pattern) || el.id.includes(pattern))) {
                        el.style.display = 'none';
                    }
                });
            },

            // Sobrescreve o player do YouTube
            overrideYTPlayer() {
                // Força a recriação do objeto player sem anúncios
                if (typeof window.ytplayer !== 'undefined' && window.ytplayer.config) {
                    window.ytplayer.config.args.raw_player_response.adPlacements = [];
                    window.ytplayer.config.args.raw_player_response.playerAds = [];
                }
            },

            // Bloqueio avançado de anúncios
            blockAdvancedAds() {
                if (this.isSearchEngine()) {
                    // Simplified ad blocking for search engines
                    const safeAdPatterns = [
                        'doubleclick.net',
                        'googlesyndication.com',
                        'adsystem.com'
                    ];

                    const safeRemoveAds = () => {
                        document.querySelectorAll('iframe').forEach(frame => {
                            if (safeAdPatterns.some(pattern => frame.src?.includes(pattern))) {
                                frame.style.display = 'none';
                            }
                        });
                    };

                    setInterval(safeRemoveAds, 1000);
                    return;
                }

                if (this.isSafeSite()) {
                    // Minimal blocking for safe sites
                    const safeAdPatterns = [
                        'doubleclick.net',
                        'googlesyndication.com',
                        'adsystem.com'
                    ];

                    const safeRemoveAds = () => {
                        document.querySelectorAll('iframe[src],div[data-ad]').forEach(el => {
                            if (!this.isCriticalElement(el) &&
                                safeAdPatterns.some(pattern => el.src?.includes(pattern) ||
                                el.getAttribute('data-ad')?.includes(pattern))) {
                                el.style.display = 'none';
                            }
                        });
                    };

                    setInterval(safeRemoveAds, 2000);
                    return;
                }

                const adPatterns = [
                    'advertisement',
                    'sponsored',
                    'promotion',
                    'banner-ad',
                    'ad-container',
                    'ad-wrapper'
                ];

                const removeAds = () => {
                    document.querySelectorAll('*').forEach(element => {
                        // Only check specific ad-related attributes
                        const attrs = ['id', 'class', 'data-ad'];
                        for (let attr of attrs) {
                            const value = element.getAttribute(attr);
                            if (value && adPatterns.some(pattern => value.toLowerCase().includes(pattern))) {
                                element.style.display = 'none';
                                break;
                            }
                        }
                    });
                };

                setInterval(removeAds, 1000);
            },

            // Modifica o bloqueador de requisições de rede para ser mais robusto
            setupNetworkBlocker() {
                try {
                    // Verifica se GM_webRequest está disponível
                    if (typeof GM_webRequest === 'undefined') {
                        console.log('GM_webRequest não disponível, usando método alternativo');
                        this.setupAlternativeBlocker();
                        return;
                    }

                    const blockPatterns = [
                        'googlevideo.com/videoplayback',
                        'youtube.com/api/stats',
                        'doubleclick.net',
                        'googlesyndication.com',
                        '/pagead/',
                        'google-analytics.com'
                    ];

                    GM_webRequest?.onBeforeRequest?.addListener?.(
                        details => ({
                            cancel: blockPatterns.some(pattern => details.url.includes(pattern))
                        }),
                        { urls: ["<all_urls>"] },
                        ["blocking"]
                    );
                } catch (e) {
                    console.log('Fallback para método alternativo de bloqueio');
                    this.setupAlternativeBlocker();
                }
            },

            // Método alternativo de bloqueio quando GM_webRequest não está disponível
            setupAlternativeBlocker() {
                // Intercepta XMLHttpRequest
                const XHR = XMLHttpRequest.prototype;
                const open = XHR.open;
                XHR.open = function(...args) {
                    const url = args[1];
                    if (url && (
                        url.includes('googlevideo.com/videoplayback') ||
                        url.includes('youtube.com/api/stats') ||
                        url.includes('doubleclick.net')
                    )) {
                        args[1] = 'about:blank';
                    }
                    return open.apply(this, arguments);
                };

                // Intercepta fetch
                const originalFetch = window.fetch;
                window.fetch = async function(input, init) {
                    const url = input instanceof Request ? input.url : input;
                    if (url && (
                        url.includes('googlevideo.com/videoplayback') ||
                        url.includes('youtube.com/api/stats') ||
                        url.includes('doubleclick.net')
                    )) {
                        return new Response('{}', {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    return originalFetch.apply(this, arguments);
                };

                // Adiciona headers de controle de acesso
                const injectHeaders = () => {
                    try {
                        Object.defineProperty(document, 'referrer', { value: '' });
                        document.documentElement.dataset.newReferrer = '';
                    } catch (e) {}
                };

                injectHeaders();
            },

            // Bloqueador de requisições fetch
            setupFetchBlocker() {
                const originalFetch = window.fetch;
                window.fetch = async function(...args) {
                    const url = args[0]?.url || args[0];
                    if (typeof url === 'string' && (
                        url.includes('doubleclick.net') ||
                        url.includes('googlesyndication.com') ||
                        url.includes('/pagead/') ||
                        url.includes('ad.doubleclick.net') ||
                        url.includes('googleadservices.com') ||
                        url.includes('adsystem.com')
                    )) {
                        return new Response('{}');
                    }
                    return originalFetch.apply(this, args);
                };
            },

            // Monitoramento contínuo
            startContinuousMonitoring() {
                // Verifica novos anúncios a cada segundo
                setInterval(() => {
                    this.checkForNewAds();
                }, 1000);

                // Observa mudanças dinâmicas de conteúdo
                const dynamicObserver = new MutationObserver(() => {
                    this.checkForNewAds();
                });

                dynamicObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'id', 'style']
                });
            },

            // Verifica novos anúncios
            checkForNewAds() {
                // Padrões de anúncios para verificação
                const adPatterns = [
                    '[id*="ad-"],[class*="ad-"]',
                    '[id*="ads"],[class*="ads"]',
                    '[id*="google_ads"],[class*="adsbygoogle"]',
                    '[data-ad]',
                    '[data-adunit]',
                    '[data-adtest]',
                    'iframe[src*="ads"]',
                    'iframe[src*="doubleclick"]',
                    'iframe[src*="adsystem"]',
                    '.video-ads',
                    '.ytp-ad-overlay-container',
                    '[class*="sponsored"]',
                    '[class*="advertisement"]'
                ];

                adPatterns.forEach(pattern => {
                    document.querySelectorAll(pattern).forEach(element => {
                        if (!element.dataset.adblockChecked && !this.isCriticalElement(element)) {
                            element.style.display = 'none';
                            element.dataset.adblockChecked = 'true';
                        }
                    });
                });

                if (document.querySelector('video')) {
                    this.checkVideoAds();
                }
            },

            // Verifica anúncios em vídeos
            checkVideoAds() {
                const video = document.querySelector('video');
                const player = document.querySelector('.html5-video-player');

                if (video && (
                    player?.classList.contains('ad-showing') ||
                    document.querySelector('.video-ads') ||
                    document.querySelector('.ytp-ad-player-overlay')
                )) {
                    video.currentTime = video.duration;
                    video.playbackRate = 16;
                    this.clickSkipBtn();
                }
            },

            // Adiciona bypass para erros 403
            setupVideoErrorBypass() {
                const handleVideoError = () => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.addEventListener('error', (e) => {
                            if (e.target.error.code === 403) {
                                // Tenta recarregar o vídeo com diferentes parâmetros
                                const currentSrc = video.src;
                                video.src = currentSrc.split('?')[0] + '?bypass=true';
                                video.play();
                            }
                        });
                    }
                };

                // Monitora mudanças no player
                new MutationObserver(handleVideoError).observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            }
        };

        // Inicialização do bloqueador com async/await
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => await ultraBlocker.init());
        } else {
            (async () => await ultraBlocker.init())();
        }

        // Bloqueio avançado de requisições com mais padrões
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function(...args) {
            const url = args[0]?.url || args[0];
            if (typeof url === 'string' && (
                url.includes('doubleclick.net') ||
                url.includes('googlesyndication.com') ||
                url.includes('/pagead/') ||
                url.includes('google-analytics.com') ||
                url.includes('youtube.com/api/stats/ads') ||
                url.includes('youtube.com/pagead/') ||
                url.includes('youtube.com/get_midroll_') ||
                url.includes('youtube.com/ptracking') ||
                url.includes('youtube.com/annotations_invideo') ||
                url.includes('youtube.com/api/stats/watchtime') ||
                url.includes('ad.doubleclick.net') ||
                url.includes('googleadservices.com') ||
                url.includes('adsystem.com') ||
                url.includes('analytics') ||
                url.includes('pagead') ||
                url.includes('measured') ||
                url.includes('tracking') ||
                url.includes('stats') ||
                url.includes('atr')
            )) {
                return new Response(JSON.stringify({
                    playerResponse: {
                        adPlacements: [],
                        playbackTracking: {},
                        videoDetails: {
                            isLiveContent: false
                        }
                    }
                }));
            }
            return originalFetch.apply(this, args);
        };

        // Adiciona estilos específicos para forçar exibição do conteúdo
        const youtubeForceStyles = `
            ytd-app[dialog-shown],
            ytd-app[loading],
            #content,
            #columns,
            #primary,
            #secondary,
            #player {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .video-ads,
            .ytp-ad-overlay-slot,
            #masthead-ad,
            #player-ads,
            ytd-promoted-video-renderer,
            .ytd-promoted-sparkles-web-renderer,
            .ytd-display-ad-renderer,
            .ytd-in-feed-ad-layout-renderer,
            ytd-compact-promoted-video-renderer,
            .ytd-promoted-video-descriptor-renderer,
            ytd-ad-slot-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer,
            ytd-statement-banner-renderer,
            ytd-video-masthead-ad-advertiser-info-renderer,
            ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
            .ytd-advertisement-renderer,
            .ytp-ad-overlay-image,
            .ytp-ad-text-overlay,
            #offer-module,
            #premium-upsell {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
                position: fixed !important;
                top: -1000px !important;
                left: -1000px !important;
            }
        `;

        // Add Spotify-specific styles
        const spotifyStyles = `
            /* Spotify ad blocking styles */
            .spotify-ads,
            .ad-container,
            .upgrade-button,
            .premium-upsell,
            [data-ad-type],
            [data-testid*="ad"],
            [data-testid*="sponsored"],
            [data-testid*="premium-upsell"],
            .sponsor-message {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }

            /* Force show player controls */
            .player-controls,
            .player-controls-container,
            .now-playing-bar {
                display: flex !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }
        `;

        // Add additional styles for body content
        const bodyContentStyles = `
            /* Block common ad containers */
            [class*="adPlacements"],
            [class*="advertisement"],
            [data-ad-client],
            [id*="google_ads_iframe"],
            [class*="sponsored"],
            [class*="promotion"],
            [data-ad],
            [data-advertisement],
            [data-testid*="ad"],
            [aria-label*="Advertisement"],
            .thumbnailOverlayTimeStatusRenderer,
            .ytp-ad-overlay-container,
            .ytp-ad-text-overlay,
            [class*="adSlot"],
            [class*="adContainer"],
            .movingThumbnailDetails,
            [data-purpose*="advertisement"],
            .metadataBadgeRenderer {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
                position: fixed !important;
                top: -9999px !important;
                left: -9999px !important;
            }

            /* Clean up thumbnail remnants */
            .richThumbnail,
            .movingThumbnailRenderer {
                background: none !important;
            }
        `;

        // Add Twitch-specific styles
        const twitchStyles = `
            /* Twitch ad blocking styles */
            [data-a-target*="ad"],
            [data-test-selector*="ad"],
            [class*="video-player__overlay"],
            .top-bar-ad,
            .player-ad-notice,
            .player-advert,
            .video-player__overlay-ads,
            .extension-taskbar__overlay-placement,
            [data-a-target*="preroll"],
            .player-overlay-background,
            .player-overlay {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
                position: absolute !important;
                top: -9999px !important;
                left: -9999px !important;
            }

            /* Force show video player */
            .video-player__container video {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                filter: none !important;
            }
        `;

        // Adiciona os estilos
        GM_addStyle(iconStyles + aggressiveAdStyles + youtubeForceStyles + spotifyStyles + bodyContentStyles + twitchStyles);
    })();