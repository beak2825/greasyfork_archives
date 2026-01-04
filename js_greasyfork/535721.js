// ==UserScript==
// @name         Network Request Search (Iframe Aware)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Cerca stringa in richieste di rete (fetch, XHR, WS, script) da top e iframe, con UI singola.
// @author       Fkejta & Geminy & Grok
// @match        *://*/*
// @grant        none // Per ora, se servono GM_* per storage, aggiungili
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535721/Network%20Request%20Search%20%28Iframe%20Aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535721/Network%20Request%20Search%20%28Iframe%20Aware%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID_PREFIX = 'NRS_IframeAware_';
    const UI_ROOT_ID = `${SCRIPT_ID_PREFIX}UIRoot`;
    const SEARCH_INPUT_ID = `${SCRIPT_ID_PREFIX}SearchInput`;
    const CLEAR_BUTTON_ID = `${SCRIPT_ID_PREFIX}ClearButton`;
    const RESULTS_TABLE_ID = `${SCRIPT_ID_PREFIX}Results`;
    const LOCALSTORAGE_KEY = `${SCRIPT_ID_PREFIX}SearchTerm`;
    const POSTMESSAGE_ID = `${SCRIPT_ID_PREFIX}NetworkResult`;

    const IS_TOP_FRAME = window.self === window.top;

    // --- GESTIONE STATO E RICERCA ---
    let currentActiveSearchTerm = localStorage.getItem(LOCALSTORAGE_KEY) || '';
    const getSearchString = () => currentActiveSearchTerm.trim().toLowerCase();

    function saveSearchTerm(term) {
        localStorage.setItem(LOCALSTORAGE_KEY, term);
        currentActiveSearchTerm = term;
        // Se siamo nel top frame e la UI esiste, potremmo voler notificare gli iframe
        // che il termine di ricerca è cambiato, ma è complesso.
        // Per ora, ogni frame legge da localStorage all'avvio.
        // Una ricerca dinamica in tutti i frame richiederebbe più postMessage.
    }

    // Elementi UI (solo per top frame)
    let searchInputElement = null;
    let resultsTableElement = null;

    // --- FUNZIONI DI UTILITY (COMUNI A TOP E IFRAME) ---
    function searchInData(data, searchStringLower) {
        // ... (la tua funzione searchInData, invariata)
        if (data === null || data === undefined || !searchStringLower) return false;
        try {
            let dataToSearch = '';
            if (typeof data === 'string') {
                dataToSearch = data.toLowerCase();
            } else if (data instanceof URLSearchParams || (typeof data === 'object' && data !== null && typeof data.entries === 'function' && !(data instanceof Headers || data instanceof FormData))) {
                let tempStr = '';
                for (const [key, value] of data.entries()) {
                    tempStr += `${key}=${value}\n`;
                }
                dataToSearch = tempStr.toLowerCase();
            } else {
                dataToSearch = JSON.stringify(data).toLowerCase();
            }
            return dataToSearch.includes(searchStringLower);
        } catch (e) {
            try {
                return String(data).toLowerCase().includes(searchStringLower);
            } catch (e2) {
                console.warn('[NRS] Errore conversione stringa fallback:', e2, data);
                return false;
            }
        }
    }

    function addResultToUI(type, url, foundInArray, iframeUrl = null) {
        if (!resultsTableElement) { // Dovrebbe esistere solo nel top frame
            console.warn("[NRS] addResultToUI chiamato ma la tabella non esiste (probabilmente non top frame o UI non pronta)");
            return;
        }
        if (foundInArray.length === 0) return;

        const row = document.createElement('tr');
        let urlDisplay = url.length > 70 ? url.substring(0, 67) + '...' : url;
        let displayType = type;
        if (iframeUrl) {
            displayType += ` (iframe: ${iframeUrl.substring(0,30)}...)`;
            row.title = `Da Iframe: ${iframeUrl}\nRichiesta: ${url}`;
        } else {
            row.title = `Richiesta: ${url}`;
        }


        row.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 5px; word-break: break-all;">${displayType}</td>
            <td style="border: 1px solid #ddd; padding: 5px; word-break: break-all;" title="${row.title}">${urlDisplay}</td>
            <td style="border: 1px solid #ddd; padding: 5px; word-break: break-all;">${foundInArray.join(', ')}</td>
        `;
        resultsTableElement.appendChild(row);
    }

    // Funzione che decide se aggiungere alla UI (se top) o inviare messaggio (se iframe)
    function reportResult(type, url, foundInArray) {
        if (IS_TOP_FRAME) {
            addResultToUI(type, url, foundInArray);
        } else {
            // Siamo in un iframe, inviamo il risultato al top frame
            try {
                window.top.postMessage({
                    nrs_message_id: POSTMESSAGE_ID,
                    type: type,
                    url: url,
                    foundInArray: foundInArray,
                    iframeUrl: window.location.href // Invia l'URL dell'iframe sorgente
                }, '*'); // Usare '*' per semplicità, ma per produzione sarebbe meglio specificare l'origine del top frame
            } catch (e) {
                console.warn("[NRS] Iframe: Errore invio postMessage al top frame:", e);
            }
        }
    }


    // --- INIZIO INTERCETTAZIONI (Avvengono in tutti i frame) ---
    // Le tue funzioni di intercettazione (fetch, XHR, WebSocket, PerformanceObserver)
    // devono essere modificate per usare `reportResult` invece di `addResult` o `addResultToUI` direttamente.

    // Esempio per Fetch:
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const initialSearchString = getSearchString();
        let requestUrl = '';
        let requestOptions = {};
        // ... (logica per estrarre requestUrl e requestOptions)
        if (typeof args[0] === 'string') {
            requestUrl = args[0];
            if (args[1]) requestOptions = args[1];
        } else if (args[0] instanceof Request) {
            requestUrl = args[0].url;
            requestOptions = args[0];
        } else {
             return originalFetch.apply(this, args);
        }

        if (!initialSearchString) return originalFetch.apply(this, args);

        const getRequestBodyText = async (body) => { /* ... la tua funzione ... */
            if (!body) return null;
            if (typeof body === 'string') return body;
            if (body instanceof URLSearchParams) return body.toString();
            if (body instanceof FormData) {
                let fd_str = "";
                for (let [key, value] of body.entries()) {
                    fd_str += `${key}: ${value instanceof File ? `File(name=${value.name}, size=${value.size})` : value}\n`;
                }
                return fd_str;
            }
            if (body instanceof Blob) return await body.text();
            return JSON.stringify(body); // Fallback
        };

        const promise = originalFetch.apply(this, args);
        promise.then(async response => {
            const clonedResponse = response.clone();
            let foundIn = [];

            if (searchInData(requestUrl, initialSearchString)) foundIn.push('URL');
            if (requestOptions.method && searchInData(requestOptions.method, initialSearchString)) foundIn.push('Method');
            if (requestOptions.headers && searchInData(Object.fromEntries(new Headers(requestOptions.headers).entries()), initialSearchString)) foundIn.push('Request Headers');
            if (requestOptions.body) {
                try {
                    const bodyText = await getRequestBodyText(requestOptions.body);
                    if (bodyText && searchInData(bodyText, initialSearchString)) foundIn.push('Request Body');
                } catch (e) {/*console.warn('[NRS] Fetch: Errore lettura request body:', e); */}
            }
            const responseHeaders = {};
            response.headers.forEach((value, name) => { responseHeaders[name] = value; });
            if (searchInData(responseHeaders, initialSearchString)) foundIn.push('Response Headers');
            try {
                const text = await clonedResponse.text();
                if (searchInData(text, initialSearchString)) foundIn.push('Response Body');
            } catch (e) {
                if (clonedResponse.statusText && searchInData(clonedResponse.statusText, initialSearchString)) foundIn.push('Response Status Text');
            }

            if (foundIn.length > 0) {
                reportResult('Fetch', requestUrl, foundIn); // <<< USA reportResult
            }
        }).catch(error => {
            if (initialSearchString && (searchInData(requestUrl, initialSearchString) || (requestOptions.method && searchInData(requestOptions.method, initialSearchString)))) {
                 reportResult('Fetch (Error)', requestUrl, ['URL/Method (Network Error)']); // <<< USA reportResult
            }
        });
        return promise;
    };

    // Adatta XMLHttpRequest, WebSocket, PerformanceObserver in modo simile per usare reportResult.
    // Esempio per XHR:
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._nrs_url = url;
        this._nrs_method = method;
        this._nrs_requestHeaders = {};
        return originalXHROpen.apply(this, [method, url, ...args]);
    };
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (this._nrs_requestHeaders) this._nrs_requestHeaders[header.toLowerCase()] = value;
        return originalXHRSetRequestHeader.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body) {
        this._nrs_searchString = getSearchString();
        const currentSearchString = this._nrs_searchString;
        if (!currentSearchString) return originalXHRSend.apply(this, [body]);

        let requestMatches = [];
        if (searchInData(this._nrs_url, currentSearchString)) requestMatches.push('URL');
        // ... (altri check per la richiesta)
        if (body && searchInData(body, currentSearchString)) requestMatches.push('Request Body');

        if (requestMatches.length > 0) {
            reportResult('XHR', this._nrs_url, requestMatches); // <<< USA reportResult
        }

        this.addEventListener('load', () => {
            if (this.readyState === XMLHttpRequest.DONE) {
                const searchStrForResponse = this._nrs_searchString;
                if (!searchStrForResponse) return;
                let responseMatches = [];
                // ... (check per la risposta)
                const responseText = this.responseText;
                if (responseText && searchInData(responseText, searchStrForResponse)) responseMatches.push('Response Body');

                if (responseMatches.length > 0) {
                    reportResult('XHR (Resp)', this._nrs_url, responseMatches); // <<< USA reportResult
                }
            }
        });
        // ... (error listener)
        this.addEventListener('error', () => {
            const searchStrForError = this._nrs_searchString;
            if (searchStrForError && (searchInData(this._nrs_url, searchStrForError) || searchInData(this._nrs_method, searchStrForError))) {
                reportResult('XHR (Error)', this._nrs_url, ['URL/Method (Network Error)']);
            }
        });
        return originalXHRSend.apply(this, [body]);
    };

    // WebSocket
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const wsInstance = new OriginalWebSocket(url, protocols);
        const searchStringAtCreation = getSearchString();
        if (searchStringAtCreation && searchInData(url, searchStringAtCreation)) {
            reportResult('WebSocket', url, ['URL']); // <<< USA reportResult
        }
        wsInstance.addEventListener('message', event => {
            const currentSearchString = getSearchString();
            if (currentSearchString && searchInData(event.data, currentSearchString)) {
                reportResult('WebSocket', url, ['Message Data']); // <<< USA reportResult
            }
        });
        const originalWSSend = wsInstance.send;
        wsInstance.send = function(data) {
            const currentSearchString = getSearchString();
            if (currentSearchString && searchInData(data, currentSearchString)) {
                reportResult('WebSocket', url, ['Sent Data']); // <<< USA reportResult
            }
            return originalWSSend.apply(this, [data]);
        };
        return wsInstance;
    };

    // PerformanceObserver
    try {
        if (typeof PerformanceObserver !== "undefined") {
            const observer = new PerformanceObserver((list) => {
                const currentSearchString = getSearchString();
                if (!currentSearchString) return;
                for (const entry of list.getEntries()) {
                    if (entry.initiatorType === 'script' && entry.name) {
                        if (searchInData(entry.name, currentSearchString)) {
                            reportResult('Script', entry.name, ['URL']); // <<< USA reportResult
                        }
                    }
                }
            });
            observer.observe({ entryTypes: ['resource'], buffered: true });
        }
    } catch (e) { console.warn("[NRS] PerformanceObserver non supportato o errore:", e); }

    // --- FINE INTERCETTAZIONI ---


    // --- GESTIONE UI E MESSAGGI (SOLO NEL TOP FRAME) ---
    if (IS_TOP_FRAME) {
        // Impedisci UI duplicata se lo script viene eseguito più volte per errore nel top frame
        if (document.getElementById(UI_ROOT_ID)) {
            console.log('[NRS] Top Frame: UI già presente.');
        } else {
            const createUI = () => {
                if (document.getElementById(UI_ROOT_ID)) return; // Doppio check

                const ui = document.createElement('div');
                ui.id = UI_ROOT_ID;
                // ... (stili della UI, come prima)
                ui.style.position = 'fixed'; /* ... */ ui.style.zIndex = '2147483647'; /* ... */
                ui.style.top = '10px'; ui.style.right = '10px'; ui.style.background = '#fff';
                ui.style.border = '1px solid #ccc'; ui.style.padding = '10px';
                ui.style.maxWidth = '500px'; ui.style.maxHeight = '80vh'; ui.style.overflowY = 'auto';
                ui.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                ui.innerHTML = `
                    <h3 style="margin-top:0; margin-bottom:10px;">Network Request Search</h3>
                    <input type="text" id="${SEARCH_INPUT_ID}" placeholder="Cerca (da top e iframe)..." style="width: calc(100% - 12px); padding: 5px; margin-bottom: 5px; border: 1px solid #ccc;">
                    <button id="${CLEAR_BUTTON_ID}" style="margin-top: 5px; padding: 5px 10px;">Pulisci Risultati & Ricerca</button>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background: #f2f2f2;">
                                <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">Tipo (Frame)</th>
                                <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">URL Richiesta</th>
                                <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">Corrispondenza in</th>
                            </tr>
                        </thead>
                        <tbody id="${RESULTS_TABLE_ID}"></tbody>
                    </table>
                `;
                (document.body || document.documentElement).appendChild(ui);

                searchInputElement = document.getElementById(SEARCH_INPUT_ID);
                const clearButtonElement = document.getElementById(CLEAR_BUTTON_ID);
                resultsTableElement = document.getElementById(RESULTS_TABLE_ID);

                if (searchInputElement) {
                    searchInputElement.value = currentActiveSearchTerm;
                    searchInputElement.addEventListener('input', () => {
                        saveSearchTerm(searchInputElement.value);
                        // Per aggiornare dinamicamente i risultati in base al nuovo termine:
                        // 1. Pulisci la tabella dei risultati (resultsTableElement.innerHTML = '')
                        // 2. Fai in modo che tutti i frame rieseguano le loro ricerche o
                        //    il top frame dovrebbe bufferare tutte le richieste viste e rifiltrarle.
                        //    Questo è complesso. Per ora, il cambio di ricerca si applica alle *nuove* richieste.
                    });
                }

                if (clearButtonElement && resultsTableElement) {
                    clearButtonElement.addEventListener('click', () => {
                        resultsTableElement.innerHTML = '';
                        if(searchInputElement) searchInputElement.value = '';
                        saveSearchTerm('');
                    });
                }

                // Processa eventuali risultati in attesa (anche se con postMessage dovrebbero arrivare dopo la UI)
                if (window.nrsPendingResultsTopFrame && resultsTableElement) {
                     window.nrsPendingResultsTopFrame.forEach(p => addResultToUI(p.type, p.url, p.foundInArray, p.iframeUrl));
                     delete window.nrsPendingResultsTopFrame;
                }
            };

            // Creazione UI
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createUI);
            } else {
                createUI();
            }

            // Listener per i messaggi dagli iframe
            window.addEventListener('message', (event) => {
                // Non è necessario controllare event.origin se usi un ID univoco nel messaggio,
                // ma in un'app reale lo faresti per sicurezza.
                if (event.data && event.data.nrs_message_id === POSTMESSAGE_ID) {
                    // console.log('[NRS] Top Frame: Ricevuto messaggio da iframe:', event.data);
                    if (resultsTableElement) { // Assicurati che la UI sia pronta
                        addResultToUI(event.data.type, event.data.url, event.data.foundInArray, event.data.iframeUrl);
                    } else {
                        // Accoda se la UI non è ancora pronta (improbabile se il listener è aggiunto dopo DOMContentLoaded)
                        if (!window.nrsPendingResultsTopFrame) window.nrsPendingResultsTopFrame = [];
                        window.nrsPendingResultsTopFrame.push(event.data);
                    }
                }
            });
        }
    } else {
        // Siamo in un iframe, non creiamo UI.
        // Potremmo voler loggare che siamo in un iframe e lo script è attivo.
        console.log('[NRS] Script attivo in Iframe:', window.location.href, "- In attesa di richieste da intercettare.");
    }

})();