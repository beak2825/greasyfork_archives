// ==UserScript==
// @name         AnimeSaturn Definitive Blocker & Cleaner
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Blocco completo: neutralizza timer, rimuove DIV orfani/ads, gestisce eventi, pulisce UI.
// @author       Tuo Nome
// @match        *://*.animesaturn.cx/*
// @include *animesaturn*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525355/AnimeSaturn%20Definitive%20Blocker%20%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/525355/AnimeSaturn%20Definitive%20Blocker%20%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG = true; // false per meno log
    const log = (msg, ...args) => DEBUG && console.log(`[ASDBC] ${msg}`, ...args);
    const warn = (msg, ...args) => DEBUG && console.warn(`[ASDBC] ${msg}`, ...args);

    log("AnimeSaturn Definitive Blocker & Cleaner INIT @document-start");

    // --- 0. NEUTRALIZZAZIONE TIMER (MOLTO AGGRESSIVO) ---
    const originalSetTimeout = unsafeWindow.setTimeout;
    const originalClearTimeout = unsafeWindow.clearTimeout;
    const originalSetInterval = unsafeWindow.setInterval;
    const originalClearInterval = unsafeWindow.clearInterval;
    const originalRequestAnimationFrame = unsafeWindow.requestAnimationFrame;
    // const originalCancelAnimationFrame = unsafeWindow.cancelAnimationFrame;

    let timerNeutralizationActive = true; // MANTENERE true

    if (timerNeutralizationActive) {
        log("NEUTRALIZZAZIONE TIMER ATTIVA.");
        unsafeWindow.setTimeout = (cb, del) => { warn(`setTimeout BLOCCATO. Delay:${del}.`); return Math.random(); }; // Restituisce un ID casuale
        unsafeWindow.clearTimeout = (id) => warn(`clearTimeout chiamato: ${id}.`);
        unsafeWindow.setInterval = (cb, del) => { warn(`setInterval BLOCCATO. Delay:${del}.`); return Math.random(); }; // Restituisce un ID casuale
        unsafeWindow.clearInterval = (id) => warn(`clearInterval chiamato: ${id}.`);
    }
    //----------------------------------------------------

    // --- 1. RIMOZIONE DIV "ORFANO" (FIGLIO DI HTML) ---
    log("Impostazione observer per DIV orfani.");
    function checkAndRemoveOrphanDiv(node) {
        if (node.nodeType !== 1 || typeof node.tagName !== 'string') return false;
        if (node.tagName.toUpperCase() === 'DIV' &&
            node.parentNode && node.parentNode.tagName &&
            node.parentNode.tagName.toUpperCase() === 'HTML' &&
            node !== document.head && node !== document.body) {
            warn(`RIMOSSO DIV "orfano" (figlio di HTML): ${node.outerHTML.substring(0, 150)}...`);
            node.remove();
            return true;
        }
        return false;
    }
    //----------------------------------------------------

    // --- 2. PULIZIA UI SPECIFICA (IFRAME ADS, BLOCCO HENTAISATURN) ---
    const AD_IFRAME_SRC_KEYWORDS = ['ad.a-ads.com', 'aqle3.com', '/ads?', 'bannerads', 'doubleclick.net', 'googlesyndication.com'];
    const AD_IFRAME_DATA_AA = "2386840";
    const HENTAISATURN_TEXT_IDENTIFIER = "HentaiSaturn";

    function performUICleanup(containerNode = document.documentElement) {
        if (!containerNode || !containerNode.querySelectorAll) return;

        // Rimuovi iframe pubblicitari
        containerNode.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.getAttribute('src') || "";
            const dataAA = iframe.getAttribute('data-aa');
            if (AD_IFRAME_SRC_KEYWORDS.some(keyword => src.includes(keyword)) || dataAA === AD_IFRAME_DATA_AA) {
                warn(`PULIZIA: RIMOSSO iframe pubblicitario: ${iframe.outerHTML.substring(0,100)}...`);
                iframe.remove();
            }
        });

        // Rimuovi blocco HentaiSaturn
        containerNode.querySelectorAll('.card-header').forEach(header => {
            if (header.textContent && header.textContent.includes(HENTAISATURN_TEXT_IDENTIFIER)) {
                const cardColumn = header.closest('.col-sm-4.mb-2.mb-md-0'); // Selettore più specifico dal tuo HTML
                if (cardColumn) {
                    warn(`PULIZIA: RIMOSSO blocco "${HENTAISATURN_TEXT_IDENTIFIER}": ${cardColumn.className}`);
                    cardColumn.remove();
                } else {
                    const cardElement = header.closest('.card');
                    if (cardElement) {
                         warn(`PULIZIA: RIMOSSO blocco .card "${HENTAISATURN_TEXT_IDENTIFIER}" (fallback): ${cardElement.className}`);
                         cardElement.remove();
                    }
                }
            }
        });
    }
    //----------------------------------------------------

    // --- OBSERVER PRINCIPALE (per DIV orfani e Pulizia UI) ---
    const mainObserver = new MutationObserver((mutationsList) => {
        let needsGeneralCleanup = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    checkAndRemoveOrphanDiv(node); // Prima priorità
                    if (node.nodeType === 1) {
                        performUICleanup(node); // Pulisci il nodo aggiunto
                        needsGeneralCleanup = true; // Segna per una pulizia generale dopo
                    }
                });
            } else if (mutation.type === 'attributes') {
                 checkAndRemoveOrphanDiv(mutation.target);
                 if (mutation.target.nodeType === 1) {
                    performUICleanup(mutation.target);
                    needsGeneralCleanup = true;
                 }
            }
        }
        if (needsGeneralCleanup) {
            //log("Esecuzione pulizia generale post-mutazioni.");
            //performUICleanup(document.documentElement); // Potrebbe essere troppo, da valutare
        }
    });

    function startMainObserver() {
        if (document.documentElement) {
            log("Observer principale (DIV orfani & Pulizia UI) avviato.");
            mainObserver.observe(document.documentElement, {
                childList: true, subtree: true, attributes: true,
                attributeFilter: ['style', 'class', 'id', 'src', 'data-aa'] // Osserva attributi rilevanti
            });
            log("Esecuzione controllo iniziale per DIV orfani e pulizia UI...");
            if (document.documentElement.children) {
                for (let i = 0; i < document.documentElement.children.length; i++) {
                    checkAndRemoveOrphanDiv(document.documentElement.children[i]);
                }
            }
            performUICleanup(document.documentElement); // Pulizia iniziale completa
        } else {
            warn("document.documentElement non ancora disponibile per MainObserver, ritento.");
            const rAF = timerNeutralizationActive ? originalRequestAnimationFrame : requestAnimationFrame;
            rAF.call(unsafeWindow, startMainObserver);
        }
    }

    const initTimeout = timerNeutralizationActive ? originalSetTimeout : setTimeout;
    initTimeout.call(unsafeWindow, startMainObserver, 0); // Avvia l'observer principale

    window.addEventListener('beforeunload', () => {
        log("Disconnessione MainObserver.");
        mainObserver.disconnect();
    }, { once: true });
    //----------------------------------------------------

    // --- 3. GESTIONE EVENTI ESTREMAMENTE AGGRESSIVA ---
    log("Impostazione intercettori di eventi aggressivi.");
    const trueOriginalAddEventListener = unsafeWindow.EventTarget.prototype.addEventListener;
    const globallyBlockedEventTypesForAddition = ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'contextmenu', 'dblclick'];

    unsafeWindow.EventTarget.prototype.addEventListener = function(type, listener, optionsOrUseCapture) {
        const element = this;
        const eventType = type.toLowerCase();
        if ((element === unsafeWindow.document.body || element === unsafeWindow.document || element === unsafeWindow.document.documentElement || element === unsafeWindow) &&
            globallyBlockedEventTypesForAddition.includes(eventType) ) {
            let listenerInfo = ""; try { listenerInfo = listener.toString().substring(0,70); } catch(e){}
            warn(`BLOCCATA AGGIUNTA listener '${eventType}' a ${element.tagName || 'window/doc'}. Listener: ${listenerInfo}...`);
            return;
        }
        return trueOriginalAddEventListener.call(this, type, listener, optionsOrUseCapture);
    };

    const eventsToCaptureAndPotentiallyBlock = ['click', 'mousedown', 'pointerdown'];
    eventsToCaptureAndPotentiallyBlock.forEach(eventType => {
        trueOriginalAddEventListener.call(unsafeWindow, eventType, function(event) {
            const target = event.target;
            if (target.closest('a[href*="animesaturn.cx"], input, button, select, textarea, .btn, [role="button"], video, [class*="jw-"], [data-toggle="dropdown"]')) {
                return;
            }
            if (target === unsafeWindow.document.body || target === unsafeWindow.document.documentElement || target === unsafeWindow.document) {
                 warn(`CATPURE: Evento '${eventType}' direttamente su body/doc/html. BLOCCO PROPAGAZIONE.`);
                 event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); return false;
            }
            if (eventType === 'click' && target.closest('a[href]')) {
                const link = target.closest('a[href]');
                // Escludi link telegram, paypal, instagram dalla conferma immediata di blocco
                const trustedExternalDomains = ['t.me', 'paypal.com', 'instagram.com'];
                const linkHostname = tryGetHostname(link.href);

                if (link.href && !link.href.includes('animesaturn.cx') && !link.href.startsWith('blob:') && !link.href.startsWith('javascript:') &&
                    !trustedExternalDomains.some(trustedDomain => linkHostname && linkHostname.includes(trustedDomain)) ) {
                    warn(`CATPURE: Tentativo di click su link esterno non fidato: ${link.href}. BLOCCO PROPAGAZIONE.`);
                    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); return false;
                }
            }
        }, { capture: true, passive: false });
    });
    function tryGetHostname(url) { try { return new URL(url).hostname; } catch (e) { return null; } }
    //----------------------------------------------------

    // --- 4. SOVRASCRITTURA `window.open` ---
    log("Impostazione sovrascrittura window.open.");
    const trueOriginalWindowOpen = unsafeWindow.open;
    unsafeWindow.open = function(url, target, features) {
        if (url && typeof url === 'string' && !url.startsWith('blob:') && !url.startsWith('javascript:')) {
            warn(`Tentativo di window.open: ${url}.`);
            const knownGoodPatterns = [
                /animesaturn\.cx/, /neko\.streampeaker\.org/, /googletagmanager\.com/,
                /paypal\.com/, /t\.me/, /instagram\.com/ // Whitelist per domini noti e linkati dalla pagina
            ];
            let isSafe = knownGoodPatterns.some(pattern => pattern.test(url));

            if (!isSafe && !confirm(`La pagina tenta di aprire una nuova finestra/tab per:\n${url}\n\nVuoi permetterlo?`)) {
                 warn(`window.open BLOCCATO dall'utente: ${url}`);
                 return null;
            }
            log(`window.open PERMESSO: ${url}`);
        }
        return trueOriginalWindowOpen.call(this, url, target, features);
    };
    //----------------------------------------------------

    log("AnimeSaturn Definitive Blocker & Cleaner: Script inizializzato e tutte le difese attive.");

})();