// ==UserScript==
// @name               YouTube Enhanced - Ads Cleaner & Unlisted Detector
// @name:it            YouTube Enhanced - Blocca Pubblicità & Rilevatore Video Non in Elenco
// @name:ar            YouTube Enhanced - منظف إعلانات وكاشف الفيديوهات غير المدرجة
// @name:es            YouTube Enhanced - Limpiador de Anuncios & Detector de Videos No Listados
// @name:fr            YouTube Enhanced - Nettoyeur de Publicités & Détecteur de Vidéos Non Répertoriées
// @name:zh-CN         YouTube Enhanced - 广告清理器和未列出视频检测器
// @version            1.3.0
// @description        Automatically cleans YouTube ads and detects unlisted videos
// @description:it     Blocca automaticamente la pubblicità su YouTube e rileva i video non in elenco
// @description:ar     ينظف إعلانات YouTube تلقائيًا ويكشف الفيديوهات غير المدرجة
// @description:es     Limpia automáticamente los anuncios de YouTube y detecta videos no listados
// @description:fr     Nettoie automatiquement les publicités YouTube et détecte les vidéos non répertoriées
// @description:zh-CN  自动清理 YouTube 广告并检测未列出的视频
// @author             flejta
// @icon               https://cdn-icons-png.flaticon.com/64/399/399274.png
// @grant              none
// @license            MIT
// @include            https://www.youtube.com/*
// @include            https://m.youtube.com/*
// @match              https://music.youtube.com/*
// @match              https://studio.youtube.com/*
// @noframes
// @namespace https://greasyfork.org/users/859328
// @downloadURL https://update.greasyfork.org/scripts/532620/YouTube%20Enhanced%20-%20Ads%20Cleaner%20%20Unlisted%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/532620/YouTube%20Enhanced%20-%20Ads%20Cleaner%20%20Unlisted%20Detector.meta.js
// ==/UserScript==

(function () {
    "use strict";

    //#region Configuration
    // Configurazione utente
    const CONFIG = {
        // Configurazione Ad Cleaner
        logEnabled: true,         // Abilita/disabilita i log in console
        cleanInterval: 500,       // Intervallo di pulizia in ms (ridotto per maggiore reattività)
        skipButtonInterval: 250,  // Intervallo per controllare i pulsanti di skip (molto rapido)
        preferReload: true,       // Se true, preferisce ricaricare il video invece di skippare alla fine
        aggressiveMode: true,     // Modalità aggressiva per rilevare più tipi di annunci

        // Configurazione Unlisted Detector
        alertForUnlisted: true,   // Mostra un alert per i video non in elenco
        useNotification: true,    // Usa notifiche invece degli alert (meno invasive)
        disableAfterDetection: true, // Disabilita il rilevatore dopo la prima notifica
    };
    //#endregion

    //#region Platform Detection
    // Configurazione della piattaforma
    const siteType = {
        isDesktop: location.hostname === "www.youtube.com",
        isMobile: location.hostname === "m.youtube.com",
        isMusic: location.hostname === "music.youtube.com",
    };
    //#endregion

    //#region Common Utilities
    // Controlla se è un video Shorts
    const checkShorts = () => window.location.pathname.indexOf("/shorts/") === 0;

    // Genera un timestamp per i log
    const logTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };

    // Funzione di log personalizzata
    const log = (message, component = "AdCleaner") => {
        if (CONFIG.logEnabled) {
            console.log(`[${component} ${logTime()}] ${message}`);
        }
    };
    //#endregion

    //#region Ad Cleaning Functions
    // Elimina gli annunci video
    const cleanVideoAds = () => {
        try {
            if (checkShorts()) return;

            // Verifica presenza di annunci con rilevamento migliorato
            const hasAd = document.querySelector(".ad-showing") !== null;
            const hasPie = document.querySelector(".ytp-ad-timed-pie-countdown-container") !== null;
            const hasSurvey = document.querySelector(".ytp-ad-survey-questions") !== null;

            // Indicatori aggiuntivi di annunci in modalità aggressiva
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

            // Identifica il player con metodi multipli
            let mediaPlayer;
            if (siteType.isMobile || siteType.isMusic) {
                mediaPlayer = document.querySelector("#movie_player") ||
                    document.querySelector("[class*='html5-video-player']");
            } else {
                mediaPlayer = document.querySelector("#ytd-player");
                if (mediaPlayer) {
                    try {
                        // Tenta di ottenere l'oggetto player
                        mediaPlayer = mediaPlayer.getPlayer();
                    } catch (e) {
                        // Fallback alle opzioni alternative
                        mediaPlayer = document.querySelector("#movie_player") ||
                            document.querySelector(".html5-video-player");
                    }
                } else {
                    // Fallback se ytd-player non esiste
                    mediaPlayer = document.querySelector("#movie_player") ||
                        document.querySelector(".html5-video-player");
                }
            }

            if (!mediaPlayer) {
                log("Impossibile trovare il player video");
                return;
            }

            // Trova il video dell'annuncio con metodi multipli
            const videoAd = document.querySelector("video.html5-main-video") ||
                  document.querySelector("video[src*='googlevideo']") ||
                  document.querySelector(".html5-video-container video");

            if (videoAd && !isNaN(videoAd.duration) && !videoAd.paused) {
                log(`Rilevato annuncio video - Durata: ${videoAd.duration.toFixed(1)}s`);

                // Metodo preferito: ricarica il video per YouTube standard
                if (!siteType.isMusic && CONFIG.preferReload) {
                    try {
                        let videoId, currentTime;

                        // Tenta di ottenere i dati del video attraverso vari metodi
                        if (typeof mediaPlayer.getVideoData === 'function') {
                            const videoData = mediaPlayer.getVideoData();
                            videoId = videoData.video_id;
                            currentTime = Math.floor(mediaPlayer.getCurrentTime());

                            // Usa il metodo appropriato per il ricaricamento
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
                                // Fallback: salta alla fine dell'annuncio
                                videoAd.currentTime = videoAd.duration;
                            }

                            log(`Annuncio eliminato ricaricando il video - ID: ${videoId}`);
                        } else {
                            // Se non possiamo ottenere i dati, usiamo il metodo alternativo
                            videoAd.currentTime = videoAd.duration;
                            log("Fallback: annuncio saltato alla fine");
                        }
                    } catch (e) {
                        // In caso di errore, usa il metodo di fallback
                        videoAd.currentTime = videoAd.duration;
                        log(`Errore durante il ricaricamento: ${e.message}, annuncio saltato alla fine`);
                    }
                } else {
                    // Metodo alternativo per YouTube Music o se configurato: salta alla fine
                    videoAd.currentTime = videoAd.duration;
                    log("Annuncio saltato alla fine");
                }
            }
        } catch (error) {
            log(`Errore nella rimozione annunci video: ${error.message}`);
        }
    };

    // Gestisce il click automatico sui pulsanti di skip
    const autoClickSkipButtons = () => {
        try {
            // Array completo di selettori per i pulsanti di skip
            const skipSelectors = [
                '.ytp-ad-skip-button',
                '.ytp-ad-skip-button-modern',
                '.ytp-ad-overlay-close-button',
                '.ytp-ad-feedback-dialog-close-button',
                '[class*="skip-button"]',
                '[class*="skipButton"]',
                '[class*="skip_button"]',
                '[aria-label*="Skip"]',
                '[aria-label*="Salta"]',
                '[aria-label*="Ignora"]',
                '[data-tooltip-content*="Skip"]',
                '[data-tooltip-content*="Salta"]',
                '[data-tooltip-content*="Ignora"]',
                'button[data-purpose="video-ad-skip-button"]',
                '.videoAdUiSkipButton',
                '.countdown-next-to-thumbnail button'
            ];

            let clicked = false;

            // Prova ogni selettore
            for (const selector of skipSelectors) {
                const buttons = document.querySelectorAll(selector);

                buttons.forEach(button => {
                    // Verifica se il bottone è visibile nella pagina
                    if (button && button.offsetParent !== null &&
                        (button.style.display !== 'none' && button.style.visibility !== 'hidden')) {
                        button.click();
                        clicked = true;
                        log(`Cliccato pulsante di skip: ${selector}`);
                    }
                });

                // Se abbiamo cliccato un pulsante, possiamo uscire
                if (clicked) break;
            }
        } catch (error) {
            log(`Errore nel click automatico: ${error.message}`);
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
                ".yt-mealbar-promo-renderer",
                "ytmusic-statement-banner-renderer",
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
                ".ytmusic-player-page[has-ad-break='true']",
                "ytd-ad-slot-renderer",
                // Selettori avanzati
                "#related ytd-promoted-sparkles-web-renderer",
                "#related ytd-promoted-video-renderer",
                "#related [layout='compact-promoted-item']",
                ".ytd-carousel-ad-renderer",
                "ytd-promoted-sparkles-text-search-renderer",
                ".ytd-statement-banner-renderer",
                ".ytd-ad-slot-renderer",
                "ytd-action-companion-ad-renderer",
                "ytd-companion-slot-renderer",
                "ytd-in-feed-ad-layout-renderer",
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
            log(`Errore nell'applicazione degli stili: ${error.message}`);
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
                // Nuovi selettori
                { parent: "ytd-browse", child: "ytd-ad-slot-renderer" },
                { parent: "ytd-rich-grid-renderer", child: "ytd-ad-slot-renderer" },
                { parent: ".ytd-rich-section-renderer", child: ".ytd-ad-slot-renderer" }
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
                log(`Rimossi ${removedCount} annunci dinamici`);
            }
        } catch (error) {
            log(`Errore nella rimozione annunci dinamici: ${error.message}`);
        }
    };

    // Rimuove annunci overlay e popup
    const cleanOverlayAds = () => {
        try {
            // Rimuove completamente overlay pubblicitari
            const overlays = [
                ".ytp-ad-overlay-container",
                ".ytp-ad-overlay-slot"
            ];

            overlays.forEach(selector => {
                const overlay = document.querySelector(selector);
                if (overlay && overlay.innerHTML !== "") {
                    overlay.innerHTML = "";
                    log(`Svuotato overlay: ${selector}`);
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
                    log(`Rimosso popup: ${selector}`);
                }
            });
        } catch (error) {
            log(`Errore nella pulizia degli overlay: ${error.message}`);
        }
    };
    //#endregion

    //#region Unlisted Video Detection
    // Lista delle traduzioni di "Unlisted" in varie lingue
    const unlistedTexts = [
        'Non in elenco',  // Italiano
        'Unlisted',       // Inglese
        'No listado',     // Spagnolo
        'Non répertorié', // Francese
        'Unaufgeführt',   // Tedesco
        '非公開',         // Giapponese
        '未列出',         // Cinese semplificato
        'Listesiz',       // Turco
        'Niepubliczny',   // Polacco
        'Olistamaton',    // Finlandese
        'Não listado',    // Portoghese
        'غير مدرج',       // Arabo
        'Neveřejné',      // Ceco
        'Ikke oppført',   // Norvegese
        'Niet vermeld',   // Olandese
        'Listattu',       // Finlandese
        'Privat',         // Danese/Svedese
        'Unlisted'        // Fallback
    ];

    // Notifica personalizzata invece dell'alert
    let notificationTimeout = null;
    const showNotification = (message) => {
        // Se c'è già una notifica attiva, rimuovila
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
                <div style="font-weight: bold;">Attenzione</div>
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

        // Aggiungi event listener per chiudere manualmente
        const closeBtn = document.getElementById('close-notification');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
            clearTimeout(notificationTimeout);
        });

        // Imposta un timeout per rimuovere automaticamente la notifica
        notificationTimeout = setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 10000); // 10 secondi
    };

    // Cerca il badge Unlisted nel DOM
    let unlistedDetected = false;
    const checkForUnlistedBadge = () => {
        if (unlistedDetected && CONFIG.disableAfterDetection) return false;

        // Salta il controllo per gli shorts
        if (checkShorts()) return false;

        // Salta il controllo se non siamo in una pagina di visualizzazione video
        if (!window.location.pathname.includes('/watch')) return false;

        try {
            // Cerca sia nel badge normale che nei tooltip
            const badges = document.querySelectorAll('ytd-badge-supported-renderer, yt-formatted-string, .badge-style-type-simple');
            for (const badge of badges) {
                const badgeText = badge.textContent.trim();
                if (unlistedTexts.some(text => badgeText.includes(text))) {
                    log('Rilevato badge "Non in elenco"', 'UnlistedDetector');
                    return true;
                }
            }

            // Controlla anche l'icona SVG per maggiore sicurezza (YouTube usa un'icona specifica per i video non in elenco)
            const svgPaths = document.querySelectorAll('svg path[d^="M17.78"]');
            if (svgPaths.length > 0) {
                log('Rilevata icona SVG di video non in elenco', 'UnlistedDetector');
                return true;
            }

            // Controlla anche il menu delle info video che a volte contiene il testo "non in elenco"
            const infoTexts = document.querySelectorAll('ytd-video-primary-info-renderer yt-formatted-string');
            for (const infoText of infoTexts) {
                const text = infoText.textContent.trim();
                if (unlistedTexts.some(unlistedText => text.includes(unlistedText))) {
                    log('Rilevato testo "Non in elenco" nelle info video', 'UnlistedDetector');
                    return true;
                }
            }

            return false;
        } catch (error) {
            log(`Errore durante il controllo del badge: ${error.message}`, 'UnlistedDetector');
            return false;
        }
    };

    // Attiva l'osservatore per il rilevamento dei video non in elenco
    let unlistedObserver = null;
    const startUnlistedDetection = () => {
        // Se il rilevamento è disabilitato, non fare nulla
        if (!CONFIG.alertForUnlisted) return;

        // Se siamo in una pagina di visualizzazione video
        if (window.location.pathname.includes('/watch')) {
            // Controllo immediato
            if (checkForUnlistedBadge()) {
                unlistedDetected = true;
                if (CONFIG.useNotification) {
                    showNotification('Questo video è "Non in elenco" (Unlisted)');
                } else {
                    alert('ATTENZIONE: Questo video è "Non in elenco" (Unlisted)');
                }
                return;
            }

            // Se abbiamo già un osservatore attivo, disconnettilo
            if (unlistedObserver) {
                unlistedObserver.disconnect();
            }

            // Crea un nuovo osservatore per cambiamenti dinamici
            unlistedObserver = new MutationObserver(() => {
                if (checkForUnlistedBadge() && !unlistedDetected) {
                    unlistedDetected = true;
                    if (CONFIG.disableAfterDetection) {
                        unlistedObserver.disconnect();
                    }

                    if (CONFIG.useNotification) {
                        showNotification('Questo video è "Non in elenco" (Unlisted)');
                    } else {
                        alert('ATTENZIONE: Questo video è "Non in elenco" (Unlisted)');
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

            log('Rilevatore di video non in elenco avviato', 'UnlistedDetector');
        }
    };
    //#endregion

    //#region Main Execution
    // Funzione principale che esegue tutte le operazioni di pulizia degli annunci
    const runCleaner = () => {
        cleanVideoAds();
        eraseDynamicAds();
        cleanOverlayAds();
    };

    // Reset dello stato di rilevamento quando cambia l'URL del video
    const resetUnlistedState = () => {
        unlistedDetected = false;
    };

    // Avvio dello script
    const init = () => {
        log("YouTube Enhanced avviato", "Main");
        maskStaticAds(); // Applicazione immediata degli stili CSS
        runCleaner();    // Prima esecuzione immediata
        startUnlistedDetection(); // Avvia il rilevamento dei video non in elenco

        // Configurazione observer per rilevare cambiamenti nel DOM
        const observer = new MutationObserver(() => {
            maskStaticAds(); // Riapplica stili quando il DOM cambia
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Imposta l'intervallo per la pulizia regolare
        setInterval(runCleaner, CONFIG.cleanInterval);

        // Intervallo specifico per il click sui pulsanti di skip (molto rapido)
        setInterval(autoClickSkipButtons, CONFIG.skipButtonInterval);

        // Aggiunge un listener per il cambio di URL (navigazione interna su YouTube)
        let lastUrl = location.href;
        setInterval(() => {
            if (lastUrl !== location.href) {
                lastUrl = location.href;
                log("Cambio pagina rilevato, esecuzione pulizia...", "Main");
                resetUnlistedState(); // Reset dello stato quando cambia l'URL
                maskStaticAds();
                runCleaner();
                startUnlistedDetection(); // Riavvia il rilevamento dopo cambio pagina
            }
        }, 1000);
    };

    // Assicurati che il documento sia completamente caricato
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
    //#endregion
})();