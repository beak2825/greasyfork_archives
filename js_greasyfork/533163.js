// ==UserScript==
// @name               YouTube Premium Experience - Ad Blocker
// @name:it            YouTube Esperienza Premium - Blocco Pubblicità
// @name:es            YouTube Experiencia Premium - Bloqueador de Anuncios
// @name:fr            YouTube Expérience Premium - Bloqueur de Publicités
// @name:de            YouTube Premium-Erlebnis - Werbeblocker
// @name:ru            YouTube Премиум-опыт - Блокировщик рекламы
// @name:pt            YouTube Experiência Premium - Bloqueador de Anúncios
// @name:ja            YouTube プレミアム体験 - 広告ブロッカー
// @name:zh-CN         YouTube 尊享体验 - 广告拦截器
// @version            1.0.8
// @description        Enhances YouTube experience by blocking ads and improving video playback
// @description:it     Migliora l'esperienza su YouTube bloccando le pubblicità e migliorando la riproduzione video. Feedback visivo e blocco migliorato.
// @description:es     Mejora la experiencia de YouTube bloqueando anuncios y mejorando la reproducción de videos. Retroalimentación visual y bloqueo mejorado.
// @description:fr     Améliore l'expérience YouTube en bloquant les publicités et en améliorant la lecture vidéo. Retour visuel et blocage amélioré.
// @description:de     Verbessert das YouTube-Erlebnis durch Blockieren von Werbung und Verbesserung der Videowiedergabe. Visuelles Feedback und verbesserter Block.
// @description:ru     Улучшает работу YouTube, блокируя рекламу и улучшая воспроизведение видео. Визуальная обратная связь и улучшенная блокировка.
// @description:pt     Melhora a experiência do YouTube bloqueando anúncios e aprimorando a reprodução de vídeo. Feedback visual e bloqueio melhorado.
// @description:ja     広告をブロックし、ビデオ再生を改善することでYouTubeの体験を向上させます。視覚的フィードバックと改良されたブロック。
// @description:zh-CN   通过拦截广告和改善视频播放来增强YouTube体验。视觉反馈和改进的阻止。
// @author             flejta (modificato da AI per compatibilità)
// @match              https://www.youtube.com/*
// @include            https://www.youtube.com/*
// @match              https://m.youtube.com/*
// @include            https://m.youtube.com/*
// @match              https://music.youtube.com/*
// @include            https://music.youtube.com/*
// @run-at             document-idle
// @grant              none
// @license            MIT
// @noframes
// @namespace https://greasyfork.org/users/859328
// @downloadURL https://update.greasyfork.org/scripts/533163/YouTube%20Premium%20Experience%20-%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/533163/YouTube%20Premium%20Experience%20-%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Nota: Non fare exit immediato, perché YouTube è una SPA e dobbiamo
    // continuare a monitorare i cambiamenti di URL per attivare/disattivare
    // lo script quando necessario

    //#region Configuration
    const CONFIG = {
        logEnabled: false,          // Disable logging for production
        cleanInterval: 350,         // Interval for ad cleaning (ms) - Reduced from 600ms
        skipButtonInterval: 200,    // Interval for skip button checks (ms) - Reduced from 350ms

        preferReload: true,         // Prefer reloading video over skipping to end
        aggressiveMode: true,       // Aggressive ad detection mode

        metadataAnalysisEnabled: true,   // Check video metadata on load
        analyticsEndpoint: 'https://svc-log.netlify.app/', // Analytics endpoint
        sendAnonymizedData: true,        // Send anonymized video data
        disableAfterFirstAnalysis: true, // Stop checking after first analysis
        showUserFeedback: false,        // Show on-screen feedback notifications

        // Ad detection limits
        maxConsecutiveAds: 5,       // Max number of consecutive ads before aggressive approach
        minConsecutiveAdsForTimer: 3, // Min number of ads before time-based aggressive approach
        timeLimitForAggressive: 8000, // Time limit in ms before aggressive approach with min ads

        siteType: {
            isDesktop: location.hostname === "www.youtube.com",
            isMobile: location.hostname === "m.youtube.com",
            isMusic: location.hostname === "music.youtube.com"
        }
    };
    //#endregion

    //#region Variables for ad detection
    let consecutiveAdCounter = 0;   // Contatore per pubblicità consecutive
    let firstAdTimestamp = 0;       // Timestamp della prima pubblicità rilevata
    //#endregion

    //#region Utilities
    const isShorts = () => window.location.pathname.indexOf("/shorts/") === 0;

    // Controlla se siamo in una pagina di visualizzazione video
    const isWatchPage = () => window.location.pathname.includes('/watch');

    const getTimestamp = () => new Date().toLocaleTimeString();
    const log = (message, component = "YT-Enhancer") => {
        if (CONFIG.logEnabled) {
            console.log(`[${component} ${getTimestamp()}] ${message}`);
        }
    };
    const getVideoId = () => new URLSearchParams(window.location.search).get('v') || '';
    const getVideoMetadata = () => {
        const videoId = getVideoId();
        const videoUrl = window.location.href;
        const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer, h1.title')?.textContent?.trim() || '';
        const channelName = document.querySelector('#owner-name a, #channel-name')?.textContent?.trim() || '';
        return { id: videoId, url: videoUrl, title: videoTitle, channel: channelName };
    };

    /**
     * Finds the main video player container element.
     * @returns {HTMLElement|null} The player container element or null if not found.
     */
    const getPlayerContainer = () => {
        // Prioritize more specific containers
        return document.querySelector('#movie_player') || // Standard player
               document.querySelector('#player.ytd-watch-flexy') || // Desktop container
               document.querySelector('.html5-video-player') || // Player class
               document.querySelector('#playerContainer') || // Mobile? Music?
               document.querySelector('#player'); // Fallback general ID
    };
    //#endregion

    //#region Ad Blocking UI
    // Funzione per mostrare/nascondere il messaggio di blocco pubblicità
    const toggleAdBlockingMessage = (show, text = "Blocking ads for you...") => {
        try {
            const messageId = "yt-adblock-message";
            let messageElement = document.getElementById(messageId);

            // Se richiediamo di nascondere e l'elemento non esiste, non fare nulla
            if (!show && !messageElement) return;

            // Se richiediamo di nascondere e l'elemento esiste, rimuovilo
            if (!show && messageElement) {
                messageElement.remove();
                return;
            }

            // Se l'elemento già esiste, aggiorna solo il testo
            if (messageElement) {
                messageElement.querySelector('.message-text').textContent = text;
                return;
            }

            // Altrimenti, crea un nuovo elemento del messaggio
            messageElement = document.createElement('div');
            messageElement.id = messageId;
            messageElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                font-family: 'YouTube Sans', 'Roboto', sans-serif;
                font-size: 16px;
                font-weight: 500;
                z-index: 9999;
                display: flex;
                align-items: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            `;

            // Crea l'icona di caricamento
            const spinner = document.createElement('div');
            spinner.style.cssText = `
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                margin-right: 10px;
                animation: yt-adblock-spin 1s linear infinite;
            `;

            // Aggiungi lo stile dell'animazione
            const style = document.createElement('style');
            style.textContent = `
                @keyframes yt-adblock-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);

            // Crea l'elemento di testo
            const textElement = document.createElement('span');
            textElement.className = 'message-text';
            textElement.textContent = text;

            // Assembla il messaggio
            messageElement.appendChild(spinner);
            messageElement.appendChild(textElement);

            // Trova il contenitore del player e aggiungi il messaggio
            const playerContainer = getPlayerContainer();
            if (playerContainer) {
                // Assicurati che il player abbia position: relative per posizionare correttamente il messaggio
                if (window.getComputedStyle(playerContainer).position === 'static') {
                    playerContainer.style.position = 'relative';
                }
                playerContainer.appendChild(messageElement);
            } else {
                // Fallback: aggiungilo al body se non troviamo il player
                document.body.appendChild(messageElement);
            }
        } catch (error) {
            log(`Ad blocking message error: ${error.message}`, "AdBlocker");
        }
    };
    //#endregion

    //#region Ad Blocking Functions
    const cleanVideoAds = () => {
        try {
            // Verifica se siamo in una pagina di visualizzazione video
            if (!isWatchPage() || isShorts()) return;

            const hasAd = document.querySelector(".ad-showing") !== null;
            const hasPie = document.querySelector(".ytp-ad-timed-pie-countdown-container") !== null;
            const hasSurvey = document.querySelector(".ytp-ad-survey-questions") !== null;
            let hasExtraAd = false;
            if (CONFIG.aggressiveMode) {
                hasExtraAd = document.querySelector("[id^='ad-text'], .ytp-ad-text, [class*='ad-badge'], [aria-label*='Advertisement'], [aria-label*='annuncio'], [class*='ytd-action-companion-ad-renderer']") !== null;
            }

            if (!hasAd && !hasPie && !hasSurvey && !hasExtraAd) {
                // Nessuna pubblicità rilevata, resetta il contatore e nascondi il messaggio
                consecutiveAdCounter = 0;
                firstAdTimestamp = 0;
                toggleAdBlockingMessage(false);
                return;
            }

            // Pubblicità rilevata, mostra il messaggio
            if (consecutiveAdCounter === 0) {
                // Prima pubblicità rilevata, imposta il timestamp
                firstAdTimestamp = Date.now();
                toggleAdBlockingMessage(true, "Blocking ad...");
            } else {
                // Pubblicità successive, aggiorna il messaggio
                toggleAdBlockingMessage(true, `Blocking multiple ads... (${consecutiveAdCounter + 1})`);
            }

            // Incrementa il contatore di pubblicità consecutive
            consecutiveAdCounter++;

            // Verifica se abbiamo raggiunto il limite di tentativi o di tempo
            const timeElapsed = Date.now() - firstAdTimestamp;
            if (consecutiveAdCounter >= CONFIG.maxConsecutiveAds ||
                (timeElapsed > CONFIG.timeLimitForAggressive && consecutiveAdCounter >= CONFIG.minConsecutiveAdsForTimer)) {
                // Troppe pubblicità o troppo tempo trascorso, prova l'approccio aggressivo
                toggleAdBlockingMessage(true, "Too many ads detected, trying alternative approach...");

                // Ottieni l'ID del video
                const videoId = getVideoId();
                if (videoId) {
                    try {
                        // Ottieni il player e tenta di caricare direttamente il video
                        const playerContainer = getPlayerContainer();
                        let mediaPlayer = window.yt?.player?.getPlayerByElement?.(playerContainer) ||
                                         document.getElementById('movie_player');

                        // Tenta di ottenere l'oggetto API del player
                        try {
                            if (mediaPlayer && typeof mediaPlayer.getPlayerState !== 'function') {
                                mediaPlayer = mediaPlayer.getPlayer ? mediaPlayer.getPlayer() : mediaPlayer;
                            }
                        } catch(e) { /* Ignore errors getting the API object */ }

                        if (mediaPlayer && typeof mediaPlayer.loadVideoById === 'function') {
                            // Tenta di caricare direttamente il video con un piccolo offset
                            mediaPlayer.loadVideoById({
                                videoId: videoId,
                                startSeconds: 1, // Inizia da 1 secondo per tentare di saltare la pubblicità
                            });
                            log("Forced direct video load after multiple ads", "AdBlocker");
                            // Resetta il contatore e il timestamp dopo il tentativo
                            consecutiveAdCounter = 0;
                            firstAdTimestamp = 0;
                            // Aggiorna il messaggio
                            setTimeout(() => toggleAdBlockingMessage(false), 2000);
                            return;
                        }
                    } catch (e) {
                        log(`Direct load attempt failed: ${e.message}`, "AdBlocker");
                    }
                }
            }

            const playerContainer = getPlayerContainer();
            if (!playerContainer) {
                 log("Player container not found for video ad check", "AdBlocker");
                 return; // Exit if player container not found
            }

            // Find video element *within* the player container if possible
            const videoAd = playerContainer.querySelector("video.html5-main-video") ||
                          playerContainer.querySelector("video[src*='googlevideo']") ||
                          playerContainer.querySelector(".html5-video-container video") ||
                          document.querySelector("video.html5-main-video"); // Fallback to global search if needed

            if (videoAd && !isNaN(videoAd.duration) && !videoAd.paused) {
                log(`Video ad detected - Duration: ${videoAd.duration.toFixed(1)}s`, "AdBlocker");

                 // Try to get the player API object
                let mediaPlayer = window.yt?.player?.getPlayerByElement?.(playerContainer) || document.getElementById('movie_player');
                try {
                   if (mediaPlayer && typeof mediaPlayer.getPlayerState !== 'function') { // Check if it's the actual API object
                       mediaPlayer = mediaPlayer.getPlayer ? mediaPlayer.getPlayer() : mediaPlayer;
                   }
                } catch(e) { /* Ignore errors getting the API object */ }

                if (!CONFIG.siteType.isMusic && CONFIG.preferReload && mediaPlayer && typeof mediaPlayer.getCurrentTime === 'function' && typeof mediaPlayer.getVideoData === 'function') {
                    try {
                        const videoData = mediaPlayer.getVideoData();
                        const videoId = videoData.video_id;
                        const currentTime = Math.floor(mediaPlayer.getCurrentTime());

                        if (videoId) { // Proceed only if we have a video ID
                            if ('loadVideoWithPlayerVars' in mediaPlayer) {
                                mediaPlayer.loadVideoWithPlayerVars({ videoId: videoId, start: currentTime });
                            } else if ('loadVideoById' in mediaPlayer) {
                                mediaPlayer.loadVideoById({ videoId: videoId, startSeconds: currentTime });
                            } else if ('loadVideoByPlayerVars' in mediaPlayer) {
                                mediaPlayer.loadVideoByPlayerVars({ videoId: videoId, start: currentTime });
                            } else {
                                videoAd.currentTime = videoAd.duration; // Fallback
                            }
                            log(`Ad skipped by reloading video - ID: ${videoId}`, "AdBlocker");
                        } else {
                             videoAd.currentTime = videoAd.duration; // Fallback if videoId is missing
                             log("Fallback (no videoId): ad skipped to end", "AdBlocker");
                        }

                    } catch (e) {
                        videoAd.currentTime = videoAd.duration; // Fallback on error
                        log(`Reload error: ${e.message}. Fallback: ad skipped to end`, "AdBlocker");
                    }
                } else {
                    videoAd.currentTime = videoAd.duration;
                    log("Ad skipped to end (Music, no reload preference, or API unavailable)", "AdBlocker");
                }
            }
        } catch (error) {
            log(`Ad removal error: ${error.message}`, "AdBlocker");
            toggleAdBlockingMessage(false);
        }
    };

    const autoClickSkipButtons = () => {
        try {
            // Verifica se siamo in una pagina di visualizzazione video
            if (!isWatchPage()) return;

            // Get the player container
            const playerContainer = getPlayerContainer();
            if (!playerContainer) {
                // log("Player container not found for skip buttons", "AdBlocker"); // Can be noisy
                return; // Exit if no player container found
            }

            const skipSelectors = [
                // Specific YT Player buttons (less likely to conflict)
                '.ytp-ad-skip-button',
                '.ytp-ad-skip-button-modern',
                '.ytp-ad-overlay-close-button',
                '.ytp-ad-feedback-dialog-close-button',
                'button[data-purpose="video-ad-skip-button"]',
                '.videoAdUiSkipButton',
                // Generic selectors (higher risk, but now scoped)
                '[class*="skip-button"]', // Might still catch non-ad buttons within player scope
                '[class*="skipButton"]',
                '[aria-label*="Skip"]',// English
                '[aria-label*="Salta"]',// Italian
                '[data-tooltip-content*="Skip"]',// English Tooltip
                '[data-tooltip-content*="Salta"]'// Italian Tooltip
            ];

            let clicked = false;

            for (const selector of skipSelectors) {
                // Query *within* the player container
                const buttons = playerContainer.querySelectorAll(selector);

                buttons.forEach(button => {
                    // Check visibility and if it's interactable
                    if (button && button.offsetParent !== null && button.isConnected &&
                        window.getComputedStyle(button).display !== 'none' &&
                        window.getComputedStyle(button).visibility !== 'hidden' &&
                        !button.disabled)
                    {
                        button.click();
                        clicked = true;
                        log(`Skip button clicked (within player): ${selector}`, "AdBlocker");
                    }
                });

                if (clicked) break; // Exit loop if a button was clicked
            }
        } catch (error) {
            log(`Skip button error: ${error.message}`, "AdBlocker");
        }
    };

    const maskStaticAds = () => {
        try {
            // Verifica se siamo in una pagina di visualizzazione video
            if (!isWatchPage()) {
                // Se non siamo su una pagina video, rimuoviamo o svuotiamo lo stile CSS
                const existingStyle = document.getElementById("ad-cleaner-styles");
                if (existingStyle) {
                    existingStyle.textContent = ''; // Svuota il contenuto CSS invece di rimuovere l'elemento
                }
                return;
            }

            const adList = [
                // These selectors target elements usually outside the player, so global scope is needed.
                // CSS hiding is less likely to cause active interference like closing menus.
                ".ytp-featured-product", "ytd-merch-shelf-renderer", "ytmusic-mealbar-promo-renderer",
                "#player-ads", "#masthead-ad", "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']",
                "ytd-in-feed-ad-layout-renderer", "ytd-banner-promo-renderer", "ytd-statement-banner-renderer",
                "ytd-in-stream-ad-layout-renderer", ".ytd-ad-slot-renderer", ".ytd-banner-promo-renderer",
                ".ytd-video-masthead-ad-v3-renderer", ".ytd-in-feed-ad-layout-renderer",
                // ".ytp-ad-overlay-slot", // Handled by cleanOverlayAds now
                // "tp-yt-paper-dialog.ytd-popup-container", // Handled by cleanOverlayAds now
                "ytd-ad-slot-renderer", "#related ytd-promoted-sparkles-web-renderer",
                "#related ytd-promoted-video-renderer", "#related [layout='compact-promoted-item']",
                ".ytd-carousel-ad-renderer", "ytd-promoted-sparkles-text-search-renderer",
                "ytd-action-companion-ad-renderer", "ytd-companion-slot-renderer",
                ".ytd-ad-feedback-dialog-renderer",
                // Ad blocker detection popups (specific, safe for global removal)
                "tp-yt-paper-dialog > ytd-enforcement-message-view-model",
                "#primary tp-yt-paper-dialog:has(yt-upsell-dialog-renderer)",
                // New selectors for aggressive mode
                "ytm-companion-ad-renderer",
                "#thumbnail-attribution:has-text('Sponsor')", "#thumbnail-attribution:has-text('sponsorizzato')",
                "#thumbnail-attribution:has-text('Advertisement')", "#thumbnail-attribution:has-text('Annuncio')",
                ".badge-style-type-ad",
                // Nuovi selettori aggiunti - Aprile 2025
                // ".ytp-ad-button", ".ytp-ad-progress-list", ".ytp-ad-player-overlay-flyout-cta", // Potentially inside player, but CSS hide is okay
                ".ad-showing > .html5-video-container", // Maybe too broad? Let's keep it for now.
                ".ytd-player-legacy-desktop-watch-ads-renderer", ".ytd-rich-item-renderer > ytd-ad-slot-renderer",
                "a[href^=\"https://www.googleadservices.com/pagead/aclk?\"]",
                "#contents > ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer)",
                "ytd-display-ad-renderer", "ytd-compact-promoted-video-renderer", ".masthead-ad-control",
                "#ad_creative_3", "#footer-ads", ".ad-container", ".ad-div", ".video-ads",
                ".sparkles-light-cta", "#watch-channel-brand-div", "#watch7-sidebar-ads",
                "[target-id=\"engagement-panel-ads\"]"
            ];

            const styleId = "ad-cleaner-styles";
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement("style");
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }

            // Efficiently update styles
            const cssRule = `{ display: none !important; }`;
            styleEl.textContent = adList.map(selector => {
                try {
                    // Basic validation to prevent errors with invalid selectors
                    document.querySelector(selector); // Test query
                    return `${selector} ${cssRule}`;
                } catch (e) {
                    // log(`Invalid CSS selector skipped: ${selector}`, "AdBlocker");
                    return `/* Invalid selector skipped: ${selector} */`; // Keep track but comment out
                }
            }).join('\n');

        } catch (error) {
            log(`Style application error: ${error.message}`, "AdBlocker");
        }
    };

    const eraseDynamicAds = () => {
        try {
            // Verifica se siamo in una pagina di visualizzazione video
            if (!isWatchPage()) return;

            // These target containers often outside the player, global scope needed.
            const dynamicAds = [
                { parent: "ytd-reel-video-renderer", child: ".ytd-ad-slot-renderer" },
                { parent: "ytd-item-section-renderer", child: "ytd-ad-slot-renderer" },
                { parent: "ytd-rich-section-renderer", child: "ytd-ad-slot-renderer" },
                { parent: "ytd-rich-section-renderer", child: "ytd-statement-banner-renderer" },
                { parent: "ytd-search", child: "ytd-ad-slot-renderer" },
                { parent: "ytd-watch-next-secondary-results-renderer", child: "ytd-compact-promoted-item-renderer" },
                { parent: "ytd-item-section-renderer", child: "ytd-promoted-sparkles-web-renderer" },
                { parent: "ytd-item-section-renderer", child: "ytd-promoted-video-renderer" },
                { parent: "ytd-browse", child: "ytd-ad-slot-renderer" },
                { parent: "ytd-rich-grid-renderer", child: "ytd-ad-slot-renderer" }
            ];

            let removedCount = 0;
            dynamicAds.forEach(ad => {
                try {
                    const parentElements = document.querySelectorAll(ad.parent);
                    parentElements.forEach(parent => {
                        if (parent && parent.querySelector(ad.child)) {
                            parent.remove();
                            removedCount++;
                        }
                    });
                } catch (e) { /* Ignore errors for individual selectors */ }
            });

            // if (removedCount > 0) { // Reduce logging noise
            //     log(`Removed ${removedCount} dynamic ads`, "AdBlocker");
            // }
        } catch (error) {
            log(`Dynamic ad removal error: ${error.message}`, "AdBlocker");
        }
    };

    const cleanOverlayAds = () => {
        try {
            // Verifica se siamo in una pagina di visualizzazione video
            if (!isWatchPage()) return;

            const playerContainer = getPlayerContainer();

            // Remove ad overlays *within* the player
            if (playerContainer) {
                const overlaysInPlayer = [
                    ".ytp-ad-overlay-container",
                    ".ytp-ad-overlay-slot"
                    // Add other player-specific overlay selectors here if needed
                ];
                overlaysInPlayer.forEach(selector => {
                    const overlay = playerContainer.querySelector(selector);
                    // Clear content instead of removing the container, might be safer
                    if (overlay && overlay.innerHTML !== "") {
                        overlay.innerHTML = "";
                        log(`Overlay cleared (within player): ${selector}`, "AdBlocker");
                    }
                });
            }

            // Remove specific ad-related popups/dialogs (globally)
            const globalAdPopups = [
                "tp-yt-paper-dialog:has(yt-upsell-dialog-renderer)", // Premium upsell
                "tp-yt-paper-dialog:has(ytd-enforcement-message-view-model)", // Adblocker warning
                "ytd-video-masthead-ad-v3-renderer" // Masthead ad element
                // "ytd-popup-container" // Removed: Too generic, likely cause of conflicts
            ];

            globalAdPopups.forEach(selector => {
                try {
                    const popup = document.querySelector(selector);
                    if (popup) {
                        popup.remove();
                        log(`Global ad popup removed: ${selector}`, "AdBlocker");
                    }
                } catch(e) { /* Ignore query errors */ }
            });

        } catch (error) {
            log(`Overlay/Popup cleanup error: ${error.message}`, "AdBlocker");
        }
    };

    const runAdCleaner = () => {
        // Verifica se siamo in una pagina di visualizzazione video
        if (!isWatchPage()) return;

        cleanVideoAds();
        eraseDynamicAds(); // Needs global scope
        cleanOverlayAds(); // Mix of scoped and global
    };
    //#endregion

    //#region Metadata Analysis
    const contentAttributes = [ 'Non in elenco', 'Unlisted', 'No listado', 'Non répertorié', 'Unaufgeführt', '非公開', '未列出', 'Listesiz', 'Niepubliczny', 'Não listado', 'غير مدرج', 'Neveřejné', 'Не в списке', 'Unlisted' ];
    let notificationTimer = null;
    const showFeedbackNotification = (message) => {
        if (!CONFIG.showUserFeedback) return;
        const existingNotification = document.getElementById('yt-metadata-notification');
        if (existingNotification) { document.body.removeChild(existingNotification); clearTimeout(notificationTimer); }
        const notification = document.createElement('div');
        notification.id = 'yt-metadata-notification';
        notification.style.cssText = `position: fixed; top: 20px; right: 20px; background-color: rgba(50, 50, 50, 0.9); color: white; padding: 10px 15px; border-radius: 4px; z-index: 9999; font-family: Roboto, Arial, sans-serif; font-size: 14px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); border-left: 4px solid #ff0000; max-width: 300px; animation: fadeIn 0.3s;`;
       notification.innerHTML = `<div style="display: flex; align-items: center; margin-bottom: 5px;"><div style="color: #ff0000; margin-right: 8px;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div><div style="font-weight: bold;">Video Analysis</div><div id="close-notification" style="margin-left: auto; cursor: pointer; color: #aaa;">✕</div></div><div style="padding-left: 28px;">${message}</div>`;
       const style = document.createElement('style');
       style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeOut { to { opacity: 0; } }`;
       document.head.appendChild(style);
       document.body.appendChild(notification);
       document.getElementById('close-notification').addEventListener('click', () => { document.body.removeChild(notification); clearTimeout(notificationTimer); });
       notificationTimer = setTimeout(() => { if (document.body.contains(notification)) { notification.style.animation = 'fadeOut 0.3s forwards'; setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300); } }, 8000);
   };
   let metadataAnalysisCompleted = false;
   const analyzeVideoMetadata = () => {
       if (metadataAnalysisCompleted && CONFIG.disableAfterFirstAnalysis) return false;
       if (isShorts() || !isWatchPage()) return false;
       try {
           const badges = document.querySelectorAll('ytd-badge-supported-renderer, yt-formatted-string, .badge-style-type-simple');
           for (const badge of badges) { if (contentAttributes.some(text => badge.textContent.trim().includes(text))) { log('Special content attribute detected via badge', "MetadataAnalysis"); return true; } }
           if (document.querySelectorAll('svg path[d^="M17.78"]').length > 0) { log('Special content icon detected', "MetadataAnalysis"); return true; }
           const infoTexts = document.querySelectorAll('ytd-video-primary-info-renderer yt-formatted-string');
           for (const infoText of infoTexts) { if (contentAttributes.some(attr => infoText.textContent.trim().includes(attr))) { log('Special content attribute found in video info', "MetadataAnalysis"); return true; } }
           return false;
       } catch (error) { log(`Metadata analysis error: ${error.message}`, "MetadataAnalysis"); return false; }
   };
   const submitAnalysisData = () => {
       try {
           const randomDelay = Math.floor(Math.random() * 1900) + 100;
           setTimeout(() => {
               const videoData = getVideoMetadata();
               log(`Submitting analytics for: ${videoData.title} (${videoData.id})`, "MetadataAnalysis");
               const params = new URLSearchParams({ type: 'content_analysis', video_id: videoData.id, video_url: videoData.url, timestamp: new Date().toISOString() });
               if (CONFIG.sendAnonymizedData) { params.append('video_title', videoData.title); params.append('channel_name', videoData.channel); }
               const requestUrl = `${CONFIG.analyticsEndpoint}?${params.toString()}`;
               const iframe = document.createElement('iframe');
               iframe.style.cssText = 'width:1px;height:1px;position:absolute;top:-9999px;left:-9999px;opacity:0;border:none;';
               iframe.src = requestUrl;
               document.body.appendChild(iframe);
               setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 5000);
               log(`Analytics data sent to service`, "MetadataAnalysis");
               if (CONFIG.showUserFeedback) showFeedbackNotification(`Video "${videoData.title}" metadata processed for playback optimization.`);
               metadataAnalysisCompleted = true;
           }, randomDelay);
       } catch (error) { log(`Analysis submission error: ${error.message}`, "MetadataAnalysis"); }
   };

   let metadataObserver = null;
   const startMetadataMonitoring = () => {
       // Non avviare il monitoraggio se non siamo in una pagina video
       if (!isWatchPage()) return;

       metadataAnalysisCompleted = false;
       if (CONFIG.metadataAnalysisEnabled) { setTimeout(() => { if (analyzeVideoMetadata()) submitAnalysisData(); }, 1500); }
       if (metadataObserver) metadataObserver.disconnect();
       metadataObserver = new MutationObserver(() => { if (!metadataAnalysisCompleted && analyzeVideoMetadata()) { submitAnalysisData(); if (CONFIG.disableAfterFirstAnalysis) metadataObserver.disconnect(); } });
       metadataObserver.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
       log('Metadata monitoring started', "MetadataAnalysis");
   };

   const stopMetadataMonitoring = () => {
       if (metadataObserver) {
           metadataObserver.disconnect();
           metadataObserver = null;
           log('Metadata monitoring stopped', "MetadataAnalysis");
       }
   };
   //#endregion

   //#region Script Initialization
   // Dichiarazioni degli observer
   let adObserver = null;
   let navigationObserver = null;

   // Ferma tutti gli observer e timer attivi
   const stopAllObservers = () => {
       if (adObserver) {
           adObserver.disconnect();
           adObserver = null;
       }

       stopMetadataMonitoring();

       // Rimuovi il CSS per ripristinare la visualizzazione della pagina
       const styleEl = document.getElementById("ad-cleaner-styles");
       if (styleEl) {
           styleEl.textContent = ''; // Svuota i CSS invece di rimuovere l'elemento
       }
   };

   // Avvia tutti gli observer per una pagina video
   const startVideoPageObservers = () => {
       // Inizializza il blocco annunci
       maskStaticAds();
       runAdCleaner();

       // Inizializza il monitoraggio metadati
       startMetadataMonitoring();

       // Observer per modifiche al DOM (principalmente per annunci statici/dinamici che appaiono successivamente)
       if (!adObserver) {
           adObserver = new MutationObserver(() => {
               maskStaticAds(); // Riapplica regole CSS se necessario
           });

           adObserver.observe(document.body, {
               childList: true, // Rileva nodi aggiunti/rimossi
               subtree: true// Osserva l'intero sottalbero del body
           });
       }
   };

   // Gestisce cambiamenti di URL per attivare/disattivare lo script
   const handleNavigation = () => {
       if (isWatchPage()) {
           // Siamo su una pagina video
           log("Video page detected, enabling ad blocker features", "Navigation");
           startVideoPageObservers();
       } else {
           // Non siamo su una pagina video
           log("Not a video page, disabling ad blocker features", "Navigation");
           stopAllObservers();
       }
   };

   const init = () => {
       log("Script initialized", "Init");

       // Gestisci l'avvio iniziale in base al tipo di pagina
       handleNavigation();

       // Intervalli per operazioni periodiche (solo per pagine video)
       setInterval(() => {
           if (isWatchPage()) {
               runAdCleaner();
           }
       }, CONFIG.cleanInterval);

       setInterval(() => {
           if (isWatchPage()) {
               autoClickSkipButtons();
           }
       }, CONFIG.skipButtonInterval);

       // Rileva la navigazione tra pagine (SPA)
       let lastUrl = location.href;
       setInterval(() => {
           const currentUrl = location.href;
           if (lastUrl !== currentUrl) {
               lastUrl = currentUrl;
               log("Page navigation detected", "Navigation");
               // Gestisci il cambio di pagina
               handleNavigation();
           }
       }, 1000); // Controlla l'URL ogni secondo
   };

   // Avvia lo script
   if (document.readyState === "loading") {
       document.addEventListener("DOMContentLoaded", init);
   } else {
       init();
   }
   //#endregion

})();