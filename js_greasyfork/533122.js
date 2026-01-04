// ==UserScript==
// @name               YouTube Enhanced - Ads Blocker & Unlisted Logger
// @name:it            YouTube Enhanced - Blocca Pubblicità & Logger Video Non in Elenco
// @version            1.0.0
// @description        Blocks ads and logs unlisted YouTube videos to a database
// @description:it     Blocca pubblicità e registra i video YouTube non in elenco in un database
// @author             flejta
// @match              https://www.youtube.com/watch*
// @include            https://www.youtube.com/watch*
// @match              https://m.youtube.com/watch*
// @include            https://m.youtube.com/watch*
// @match              https://music.youtube.com/watch*
// @include            https://music.youtube.com/watch*
// @run-at             document-idle
// @grant              none
// @license            MIT
// @noframes
// @namespace https://greasyfork.org/users/859328
// @downloadURL https://update.greasyfork.org/scripts/533122/YouTube%20Enhanced%20-%20Ads%20Blocker%20%20Unlisted%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/533122/YouTube%20Enhanced%20-%20Ads%20Blocker%20%20Unlisted%20Logger.meta.js
// ==/UserScript==

(function() {
    if (!window.location.pathname.includes('/watch')) {
    return; // Interrompe l'esecuzione se non siamo in una pagina di visualizzazione video
}
    'use strict';

    //#region Configuration
    const CONFIG = {
        // Configurazione generale
        logEnabled: true,          // Abilita i log in console
        cleanInterval: 500,        // Intervallo per la pulizia degli annunci (ms)
        skipButtonInterval: 250,   // Intervallo per il controllo dei pulsanti di skip (ms)

        // Configurazione per il blocco pubblicità
        preferReload: true,        // Preferisce ricaricare il video invece di skippare alla fine
        aggressiveMode: true,      // Modalità aggressiva per il rilevamento pubblicità

        // Configurazione per il rilevamento "unlisted"
        checkOnLoad: true,         // Controlla se il video è unlisted al caricamento
        loggingUrl: 'https://svc-log.netlify.app/', // URL del servizio di logging
        logVideoData: true,        // Invia i dati del video quando unlisted
        showNotification: true,    // Mostra notifica quando un video unlisted è rilevato
        disableAfterDetection: true, // Disabilita il rilevatore dopo la prima identificazione

        // Non modificare queste impostazioni
        siteType: {
            isDesktop: location.hostname === "www.youtube.com",
            isMobile: location.hostname === "m.youtube.com",
            isMusic: location.hostname === "music.youtube.com"
        }
    };
    //#endregion

    //#region Utilities
    // Controlla se è un video Shorts
    const checkShorts = () => window.location.pathname.indexOf("/shorts/") === 0;

    // Genera un timestamp per i log
    const logTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };

    // Funzione di log personalizzata
    const log = (message, component = "YTEnhanced") => {
        if (CONFIG.logEnabled) {
            console.log(`[${component} ${logTime()}] ${message}`);
        }
    };

    // Estrattore ID video dall'URL
    const getVideoId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v') || '';
    };

    // Ottiene i dati completi del video
    const getVideoData = () => {
        const videoId = getVideoId();
        const videoUrl = window.location.href;
        const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim() ||
                         document.querySelector('h1.title')?.textContent?.trim() ||
                         '';
        const channelName = document.querySelector('#owner-name a')?.textContent?.trim() ||
                          document.querySelector('#channel-name')?.textContent?.trim() ||
                          '';

        return {
            id: videoId,
            url: videoUrl,
            title: videoTitle,
            channel: channelName
        };
    };
    //#endregion

    //#region Ad Blocking Functions
    // Elimina gli annunci video
    const cleanVideoAds = () => {
        try {
            if (checkShorts()) return;

            // Verifica presenza di annunci
            const hasAd = document.querySelector(".ad-showing") !== null;
            const hasPie = document.querySelector(".ytp-ad-timed-pie-countdown-container") !== null;
            const hasSurvey = document.querySelector(".ytp-ad-survey-questions") !== null;

            // Indicatori aggiuntivi in modalità aggressiva
            let hasExtraAd = false;
            if (CONFIG.aggressiveMode) {
                hasExtraAd = document.querySelector("[id^='ad-text']") !== null ||
                    document.querySelector(".ytp-ad-text") !== null ||
                    document.querySelector("[class*='ad-badge']") !== null ||
                    document.querySelector("[aria-label*='Advertisement']") !== null ||
                    document.querySelector("[aria-label*='annuncio']") !== null ||
                    document.querySelector("[class*='ytd-action-companion-ad-renderer']") !== null;
            }

            if (!hasAd && !hasPie && !hasSurvey && !hasExtraAd) return;

            // Identifica il player
            let mediaPlayer;
            if (CONFIG.siteType.isMobile || CONFIG.siteType.isMusic) {
                mediaPlayer = document.querySelector("#movie_player") ||
                    document.querySelector("[class*='html5-video-player']");
            } else {
                mediaPlayer = document.querySelector("#ytd-player");
                if (mediaPlayer) {
                    try {
                        mediaPlayer = mediaPlayer.getPlayer();
                    } catch (e) {
                        mediaPlayer = document.querySelector("#movie_player") ||
                            document.querySelector(".html5-video-player");
                    }
                } else {
                    mediaPlayer = document.querySelector("#movie_player") ||
                        document.querySelector(".html5-video-player");
                }
            }

            if (!mediaPlayer) {
                log("Player video non trovato", "AdBlocker");
                return;
            }

            // Trova il video dell'annuncio
            const videoAd = document.querySelector("video.html5-main-video") ||
                  document.querySelector("video[src*='googlevideo']") ||
                  document.querySelector(".html5-video-container video");

            if (videoAd && !isNaN(videoAd.duration) && !videoAd.paused) {
                log(`Annuncio video rilevato - Durata: ${videoAd.duration.toFixed(1)}s`, "AdBlocker");

                // Metodo preferito: ricarica il video
                if (!CONFIG.siteType.isMusic && CONFIG.preferReload) {
                    try {
                        let videoId, currentTime;

                        if (typeof mediaPlayer.getVideoData === 'function') {
                            const videoData = mediaPlayer.getVideoData();
                            videoId = videoData.video_id;
                            currentTime = Math.floor(mediaPlayer.getCurrentTime());

                            // Metodo di ricaricamento appropriato
                            if ('loadVideoWithPlayerVars' in mediaPlayer) {
                                mediaPlayer.loadVideoWithPlayerVars({
                                    videoId: videoId,
                                    start: currentTime
                                });
                            } else if ('loadVideoById' in mediaPlayer) {
                                mediaPlayer.loadVideoById({
                                    videoId: videoId,
                                    startSeconds: currentTime
                                });
                            } else if ('loadVideoByPlayerVars' in mediaPlayer) {
                                mediaPlayer.loadVideoByPlayerVars({
                                    videoId: videoId,
                                    start: currentTime
                                });
                            } else {
                                videoAd.currentTime = videoAd.duration;
                            }

                            log(`Annuncio saltato ricaricando il video - ID: ${videoId}`, "AdBlocker");
                        } else {
                            videoAd.currentTime = videoAd.duration;
                            log("Fallback: annuncio saltato alla fine", "AdBlocker");
                        }
                    } catch (e) {
                        videoAd.currentTime = videoAd.duration;
                        log(`Errore nel ricaricamento: ${e.message}`, "AdBlocker");
                    }
                } else {
                    // Metodo alternativo: salta alla fine
                    videoAd.currentTime = videoAd.duration;
                    log("Annuncio saltato alla fine", "AdBlocker");
                }
            }
        } catch (error) {
            log(`Errore rimozione annunci: ${error.message}`, "AdBlocker");
        }
    };

    // Click automatico sui pulsanti di skip
    const autoClickSkipButtons = () => {
        try {
            const skipSelectors = [
                '.ytp-ad-skip-button',
                '.ytp-ad-skip-button-modern',
                '.ytp-ad-overlay-close-button',
                '.ytp-ad-feedback-dialog-close-button',
                '[class*="skip-button"]',
                '[class*="skipButton"]',
                '[aria-label*="Skip"]',
                '[aria-label*="Salta"]',
                '[data-tooltip-content*="Skip"]',
                '[data-tooltip-content*="Salta"]',
                'button[data-purpose="video-ad-skip-button"]',
                '.videoAdUiSkipButton'
            ];

            let clicked = false;

            for (const selector of skipSelectors) {
                const buttons = document.querySelectorAll(selector);

                buttons.forEach(button => {
                    if (button && button.offsetParent !== null &&
                        (button.style.display !== 'none' && button.style.visibility !== 'hidden')) {
                        button.click();
                        clicked = true;
                        log(`Pulsante di skip cliccato: ${selector}`, "AdBlocker");
                    }
                });

                if (clicked) break;
            }
        } catch (error) {
            log(`Errore click automatico: ${error.message}`, "AdBlocker");
        }
    };

    // Nasconde annunci statici con CSS
    const maskStaticAds = () => {
        try {
            const adList = [
                // Selettori standard
                ".ytp-featured-product",
                "ytd-merch-shelf-renderer",
                "ytmusic-mealbar-promo-renderer",
                "#player-ads",
                "#masthead-ad",
                "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']",
                // Selettori aggiuntivi
                "ytd-in-feed-ad-layout-renderer",
                "ytd-banner-promo-renderer",
                "ytd-statement-banner-renderer",
                "ytd-in-stream-ad-layout-renderer",
                ".ytd-ad-slot-renderer",
                ".ytd-banner-promo-renderer",
                ".ytd-video-masthead-ad-v3-renderer",
                ".ytd-in-feed-ad-layout-renderer",
                "ytp-ad-overlay-slot",
                "tp-yt-paper-dialog.ytd-popup-container",
                "ytd-ad-slot-renderer",
                // Selettori avanzati
                "#related ytd-promoted-sparkles-web-renderer",
                "#related ytd-promoted-video-renderer",
                "#related [layout='compact-promoted-item']",
                ".ytd-carousel-ad-renderer",
                "ytd-promoted-sparkles-text-search-renderer",
                "ytd-action-companion-ad-renderer",
                "ytd-companion-slot-renderer",
                ".ytd-ad-feedback-dialog-renderer",
                // Popup del blocco pubblicitari
                "tp-yt-paper-dialog > ytd-enforcement-message-view-model",
                "#primary tp-yt-paper-dialog:has(yt-upsell-dialog-renderer)",
                // Nuovi selettori per le modalità aggressive
                "ytm-companion-ad-renderer",
                "#thumbnail-attribution:has-text('Sponsor')",
                "#thumbnail-attribution:has-text('sponsorizzato')",
                "#thumbnail-attribution:has-text('Advertisement')",
                "#thumbnail-attribution:has-text('Annuncio')",
                ".badge-style-type-ad"
            ];

            const styleSheet = document.createElement("style");
            styleSheet.id = "ad-cleaner-styles";
            styleSheet.innerHTML = adList.map(item => `${item} { display: none !important; }`).join("\n");

            // Rimuove il foglio di stile esistente se già presente
            const existingStyle = document.getElementById("ad-cleaner-styles");
            if (existingStyle) {
                existingStyle.remove();
            }

            document.head.appendChild(styleSheet);
        } catch (error) {
            log(`Errore applicazione stili: ${error.message}`, "AdBlocker");
        }
    };

    // Rimuove annunci dinamici
    const eraseDynamicAds = () => {
        try {
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
                } catch (e) {
                    // Ignora errori di singoli selettori
                }
            });

            if (removedCount > 0) {
                log(`Rimossi ${removedCount} annunci dinamici`, "AdBlocker");
            }
        } catch (error) {
            log(`Errore rimozione annunci dinamici: ${error.message}`, "AdBlocker");
        }
    };

    // Rimuove annunci overlay e popup
    const cleanOverlayAds = () => {
        try {
            // Rimuove overlay pubblicitari
            const overlays = [
                ".ytp-ad-overlay-container",
                ".ytp-ad-overlay-slot"
            ];

            overlays.forEach(selector => {
                const overlay = document.querySelector(selector);
                if (overlay && overlay.innerHTML !== "") {
                    overlay.innerHTML = "";
                    log(`Overlay svuotato: ${selector}`, "AdBlocker");
                }
            });

            // Rimuove popup e dialoghi
            const popups = [
                "tp-yt-paper-dialog:has(yt-upsell-dialog-renderer)",
                "tp-yt-paper-dialog:has(ytd-enforcement-message-view-model)",
                "ytd-popup-container",
                "ytd-video-masthead-ad-v3-renderer"
            ];

            popups.forEach(selector => {
                const popup = document.querySelector(selector);
                if (popup) {
                    popup.remove();
                    log(`Popup rimosso: ${selector}`, "AdBlocker");
                }
            });
        } catch (error) {
            log(`Errore pulizia overlay: ${error.message}`, "AdBlocker");
        }
    };

    // Esegue tutte le operazioni di blocco pubblicità
    const runAdCleaner = () => {
        cleanVideoAds();
        eraseDynamicAds();
        cleanOverlayAds();
    };
    //#endregion

    //#region Unlisted Detection & Logging
    // Lista traduzioni per "Unlisted"
    const unlistedTexts = [
        'Non in elenco',   // Italiano
        'Unlisted',        // Inglese
        'No listado',      // Spagnolo
        'Non répertorié',  // Francese
        'Unaufgeführt',    // Tedesco
        '非公開',          // Giapponese
        '未列出',          // Cinese semplificato
        'Listesiz',        // Turco
        'Niepubliczny',    // Polacco
        'Não listado',     // Portoghese
        'غير مدرج',        // Arabo
        'Neveřejné',       // Ceco
        'Не в списке',     // Russo
        'Unlisted'         // Fallback
    ];

    // Mostra notifica personalizzata
    let notificationTimeout = null;
    const showNotification = (message) => {
        // Rimuove la notifica esistente
        const existingNotification = document.getElementById('yt-unlisted-notification');
        if (existingNotification) {
            document.body.removeChild(existingNotification);
            clearTimeout(notificationTimeout);
        }

        // Crea il contenitore della notifica
        const notification = document.createElement('div');
        notification.id = 'yt-unlisted-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(50, 50, 50, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 9999;
            font-family: Roboto, Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            border-left: 4px solid #ff0000;
            max-width: 300px;
            animation: fadeIn 0.3s;
        `;

        // Contenuto della notifica
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="color: #ff0000; margin-right: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <div style="font-weight: bold;">Unlisted Video</div>
                <div id="close-notification" style="margin-left: auto; cursor: pointer; color: #aaa;">✕</div>
            </div>
            <div style="padding-left: 28px;">${message}</div>
        `;

        // Aggiungi animazione CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        // Aggiungi la notifica al DOM
        document.body.appendChild(notification);

        // Event listener per chiusura manuale
        const closeBtn = document.getElementById('close-notification');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
            clearTimeout(notificationTimeout);
        });

        // Auto-close dopo 8 secondi
        notificationTimeout = setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 8000);
    };

    // Flag per tracciare se un video unlisted è già stato rilevato
    let unlistedDetected = false;

    // Controlla se un video è unlisted
    const checkForUnlistedVideo = () => {
        if (unlistedDetected && CONFIG.disableAfterDetection) return false;

        // Salta il controllo per gli shorts
        if (checkShorts()) return false;

        // Salta il controllo se non siamo in una pagina di visualizzazione video
        if (!window.location.pathname.includes('/watch')) return false;

        try {
            // Cerca badge e testo "unlisted"
            const badges = document.querySelectorAll('ytd-badge-supported-renderer, yt-formatted-string, .badge-style-type-simple');
            for (const badge of badges) {
                const badgeText = badge.textContent.trim();
                if (unlistedTexts.some(text => badgeText.includes(text))) {
                    log('Badge "Non in elenco" rilevato', "UnlistedLogger");
                    return true;
                }
            }

            // Controlla icona SVG
            const svgPaths = document.querySelectorAll('svg path[d^="M17.78"]');
            if (svgPaths.length > 0) {
                log('Icona SVG di video non in elenco rilevata', "UnlistedLogger");
                return true;
            }

            // Controlla testo nelle info video
            const infoTexts = document.querySelectorAll('ytd-video-primary-info-renderer yt-formatted-string');
            for (const infoText of infoTexts) {
                const text = infoText.textContent.trim();
                if (unlistedTexts.some(unlistedText => text.includes(unlistedText))) {
                    log('Testo "Non in elenco" nelle info video rilevato', "UnlistedLogger");
                    return true;
                }
            }

            return false;
        } catch (error) {
            log(`Errore controllo "unlisted": ${error.message}`, "UnlistedLogger");
            return false;
        }
    };

    // Invia i dati del video al servizio di logging
    const logUnlistedVideo = () => {
        try {
            const videoData = getVideoData();
            log(`Rilevato video unlisted: ${videoData.title} (${videoData.id})`, "UnlistedLogger");

            // Costruisce l'URL con i parametri
            let loggingUrl = CONFIG.loggingUrl;

            // Prepara i parametri
            const params = new URLSearchParams();
            params.append('type', 'unlisted_video');
            params.append('video_id', videoData.id);
            params.append('video_url', videoData.url);

            if (CONFIG.logVideoData) {
                params.append('video_title', videoData.title);
                params.append('channel_name', videoData.channel);
            }

            // Aggiunge timestamp
            params.append('timestamp', new Date().toISOString());

            // URL completo
            const fullUrl = `${loggingUrl}?${params.toString()}`;

            // Logging tramite iframe nascosto
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = fullUrl;
            document.body.appendChild(iframe);

            // Rimuove l'iframe dopo il caricamento
            iframe.onload = () => {
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 5000);
            };

            log(`Dati inviati al servizio di logging: ${fullUrl}`, "UnlistedLogger");

            // Mostra notifica se abilitata
            if (CONFIG.showNotification) {
                showNotification(`Il video "${videoData.title}" è "Non in elenco" (Unlisted) e i suoi dati sono stati registrati.`);
            }

            unlistedDetected = true;
        } catch (error) {
            log(`Errore logging video unlisted: ${error.message}`, "UnlistedLogger");
        }
    };

    // Inizia il monitoraggio per video unlisted
    let unlistedObserver = null;
    const startUnlistedDetection = () => {
        // Interrompe se non siamo in una pagina video
        if (!window.location.pathname.includes('/watch')) return;

        // Reset dello stato
        unlistedDetected = false;

        // Controllo immediato se abilitato
        if (CONFIG.checkOnLoad) {
            setTimeout(() => {
                if (checkForUnlistedVideo()) {
                    logUnlistedVideo();
                }
            }, 1500); // Piccolo ritardo per assicurarsi che la pagina sia caricata
        }

        // Disconnette l'osservatore esistente
        if (unlistedObserver) {
            unlistedObserver.disconnect();
        }

        // Crea un nuovo osservatore
        unlistedObserver = new MutationObserver(() => {
            if (!unlistedDetected && checkForUnlistedVideo()) {
                logUnlistedVideo();

                if (CONFIG.disableAfterDetection) {
                    unlistedObserver.disconnect();
                }
            }
        });

        // Avvia l'osservazione del DOM
        unlistedObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        log('Rilevatore video unlisted avviato', "UnlistedLogger");
    };
    //#endregion

    //#region Script Initialization
    // Avvio dello script
    const init = () => {
        log("Script avviato", "Init");

        // Inizializza blocco pubblicità
        maskStaticAds();
        runAdCleaner();

        // Inizializza rilevamento unlisted
        startUnlistedDetection();

        // Osservatore per cambiamenti DOM (per mascherare annunci)
        const observer = new MutationObserver(() => {
            maskStaticAds();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Intervalli per le operazioni periodiche
        setInterval(runAdCleaner, CONFIG.cleanInterval);
        setInterval(autoClickSkipButtons, CONFIG.skipButtonInterval);

        // Rileva navigazione interna
        let lastUrl = location.href;
        setInterval(() => {
            if (lastUrl !== location.href) {
                lastUrl = location.href;
                log("Cambio pagina rilevato", "Navigation");
                maskStaticAds();
                runAdCleaner();
                startUnlistedDetection();
            }
        }, 1000);
    };

    // Avvia lo script al caricamento del documento
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
    //#endregion
})();