// ==UserScript==
// @name               YouTube Ad Cleaner
// @name:it            Blocca la pubblicità di youtube
// @name:ar            منظف إعلانات YouTube
// @name:es            Limpiador de Anuncios de YouTube
// @name:fr            Nettoyeur de Publicités YouTube
// @name:hi            YouTube विज्ञापन क्लीनर
// @name:id            Pembersih Iklan YouTube
// @name:ja            YouTube 広告クリーナー
// @name:ko            YouTube 광고 클리너
// @name:nl            YouTube Advertentie Reiniger
// @name:pt-BR         Limpador de Anúncios do YouTube
// @name:ru            Очиститель рекламы YouTube
// @name:vi            Trình làm sạch quảng cáo YouTube
// @name:zh-CN         YouTube 广告清理器
// @name:zh-TW         YouTube 廣告清理器
// @version            1.2.0
// @description        Automatically cleans YouTube ads instantly.
// @description:ar     ينظف إعلانات YouTube تلقائيًا وفوريًا.
// @description:es     Limpia automáticamente los anuncios de YouTube al instante.
// @description:fr     Nettoie automatiquement et instantanément les publicités YouTube.
// @description:hi     YouTube विज्ञापनों को तुरंत और स्वचालित रूप से साफ करता है।
// @description:id     Membersihkan iklan YouTube secara otomatis dan instan.
// @description:ja     YouTube の広告を即座に自動でクリーンアップします。
// @description:ko     YouTube 광고를 즉시 자동으로 정리합니다.
// @description:nl     Reinigt YouTube-advertenties automatisch en direct.
// @description:pt-BR  Limpa anúncios do YouTube automaticamente e instantaneamente.
// @description:ru     Автоматически и мгновенно очищает рекламу на YouTube.
// @description:vi     Tự động làm sạch quảng cáo YouTube ngay lập tức.
// @description:zh-CN  自动即时清理 YouTube 广告。
// @description:zh-TW  自動即時清理 YouTube 廣告。
// @description:it     Blocca la pubblicità su youtube
// @author             flejta
// @icon               https://cdn-icons-png.flaticon.com/64/399/399274.png
// @grant              none
// @license            MIT
// @include            https://www.youtube.com/*
// @include            https://m.youtube.com/*
// @match            https://music.youtube.com/*
// @match            https://studio.youtube.com/*
// @noframes
// @namespace https://greasyfork.org/users/859328
// @downloadURL https://update.greasyfork.org/scripts/532619/YouTube%20Ad%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/532619/YouTube%20Ad%20Cleaner.meta.js
// ==/UserScript==

(function () {
    "use strict";

    //#region Configuration
    // Configurazione utente
    const CONFIG = {
        logEnabled: true,         // Abilita/disabilita i log in console
        cleanInterval: 500,       // Intervallo di pulizia in ms (ridotto per maggiore reattività)
        skipButtonInterval: 250,  // Intervallo per controllare i pulsanti di skip (molto rapido)
        preferReload: true,       // Se true, preferisce ricaricare il video invece di skippare alla fine
        aggressiveMode: true,     // Modalità aggressiva per rilevare più tipi di annunci
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

    //#region Utilities
    // Controlla se è un video Shorts
    const checkShorts = () => window.location.pathname.indexOf("/shorts/") === 0;

    // Genera un timestamp per i log
    const logTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };

    // Funzione di log personalizzata
    const log = (message) => {
        if (CONFIG.logEnabled) {
            console.log(`[AdCleaner ${logTime()}] ${message}`);
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

    //#region Main Execution
    // Funzione principale che esegue tutte le operazioni di pulizia
    const runCleaner = () => {
        cleanVideoAds();
        eraseDynamicAds();
        cleanOverlayAds();
    };

    // Avvio dello script
    const init = () => {
        log("YouTube Ad Cleaner avviato");
        maskStaticAds(); // Applicazione immediata degli stili CSS
        runCleaner();    // Prima esecuzione immediata

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
                log("Cambio pagina rilevato, esecuzione pulizia...");
                maskStaticAds();
                runCleaner();
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