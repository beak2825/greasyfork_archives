// ==UserScript==
// @name         Iaomai XHR FETCH
// @namespace    http://tampermonkey.net/
// @version      0.9.1 // Incrementa la versione se fai piccole modifiche
// @description  Intercepts and modifies fetch and XHR responses on iaomai.app and local files to unlock features.
// @author       Flejta
// @match        https://www.iaomai.app/*
// @match        https://www.iaomai.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iaomai.app
// @grant        none
// @run-at       document-start
// @license      MIT // O un'altra licenza se preferisci, o nessuna
// @downloadURL https://update.greasyfork.org/scripts/535710/Iaomai%20XHR%20FETCH.user.js
// @updateURL https://update.greasyfork.org/scripts/535710/Iaomai%20XHR%20FETCH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script v0.8 Loaded - iaomai");

    const licenses = {
    auths: [
        "anatomy_full", "auricologia", "clients_full",
        "meridiani_cinesi", "meridiani_shiatsu",
        "riflessologia_plantare", // Corretto per lo sblocco della mappa
        "reflessologia_plantare", // Con typo, per il banner "noLicenze"
        "trigger_points"
    ],
    modls: [ "CIN", "MAS", "NMK" ]
};

    const targetUrlPatterns = [
        "testauth.php",
        "vertoken.php",
        "login.php"
    ];

    const isTargetUrl = (url) => {
        if (!url) return false;
        return targetUrlPatterns.some(pattern => url.includes(pattern));
    };

    const modifyResponseText = (responseText, url) => {
        console.log(`[TM] Modifying response for ${url}. Original text length: ${responseText?.length}`);
        if (responseText && responseText.length < 200) { // Logga solo risposte brevi per non intasare la console
             console.log(`[TM] Original text (short):`, responseText);
        }


        if (typeof responseText === 'string' && responseText.startsWith("404")) {
            console.log(`[TM] Response for ${url} is an error string (${responseText}), skipping JSON modification.`);
            return responseText;
        }

        let json;
        try {
            json = JSON.parse(responseText);
        } catch (e) {
            console.error(`[TM] Error parsing original JSON for ${url}:`, e, "\nResponse text:", responseText);
            return responseText;
        }

        let modified = false;

        if (url.includes("testauth.php")) {
            if (json && json.data) {
                console.log("[TM] testauth.php: Original data.auths:", JSON.stringify(json.data.auths));
                json.data.auths = [...licenses.auths];
                json.data.modls = [...licenses.modls];
                console.log("[TM] testauth.php: Modified data.auths:", JSON.stringify(json.data.auths));
                console.log("[TM] testauth.php: Modified data.modls:", JSON.stringify(json.data.modls));
                modified = true;
            } else {
                console.warn("[TM] testauth.php: 'data' property not found in JSON for", url, JSON.stringify(json));
            }
        } else if (url.includes("login.php")) {
            if (json && json.data) {
                console.log("[TM] login.php: Original data.auths:", JSON.stringify(json.data.auths));
                json.data.auths = [...licenses.auths];
                json.data.modls = [...licenses.modls];
                console.log("[TM] login.php: Modified data.auths:", JSON.stringify(json.data.auths));
                console.log("[TM] login.php: Modified data.modls:", JSON.stringify(json.data.modls));
                modified = true;
            } else {
                console.warn("[TM] login.php: 'data' property not found in JSON for", url, JSON.stringify(json));
            }
        } else if (url.includes("vertoken.php")) {
            if (json) {
                console.log("[TM] vertoken.php: Original auths:", JSON.stringify(json.auths));
                json.auths = [...licenses.auths];
                json.modls = [...licenses.modls];
                json.modificati = true;
                console.log("[TM] vertoken.php: Modified auths:", JSON.stringify(json.auths));
                console.log("[TM] vertoken.php: Modified modls:", JSON.stringify(json.modls));
                modified = true;
            } else {
                 console.warn("[TM] vertoken.php: JSON object is null/undefined for", url, JSON.stringify(json));
            }
        }

        if (modified) {
            const modifiedJsonString = JSON.stringify(json);
            console.log(`[TM] Successfully modified JSON for ${url}. New length: ${modifiedJsonString.length}`);
            return modifiedJsonString;
        } else {
            console.warn(`[TM] Response JSON structure not matched or not modified for ${url}. Returning original text.`);
            return responseText;
        }
    };

    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = (typeof input === 'string' ? input : input.url);
        const method = (init?.method || (typeof input !== 'string' ? input.method : 'GET') || 'GET').toUpperCase();

        console.log(`[TM] Fetch called: ${method} ${url}`);

        if (isTargetUrl(url) && method === "POST") {
            console.log(`[TM] Intercepted FETCH to ${url}`);
            try {
                const response = await originalFetch(input, init);
                const responseClone = response.clone();
                const originalText = await responseClone.text();

                const modifiedText = modifyResponseText(originalText, String(url)); // Assicura che url sia una stringa

                return new Response(modifiedText, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            } catch (e) {
                console.error(`[TM] Error in intercepted fetch for ${url}:`, e);
                return originalFetch(input, init);
            }
        }
        return originalFetch(input, init);
    };

    const XHR = XMLHttpRequest.prototype;
    const originalOpen = XHR.open;
    const originalSend = XHR.send;
    const originalGetResponseText = Object.getOwnPropertyDescriptor(XHR, 'responseText').get;
    const originalGetResponse = Object.getOwnPropertyDescriptor(XHR, 'response').get;

    XHR.open = function(method, url) {
        this._url = String(url); // Assicura che url sia una stringa
        this._method = method.toUpperCase();
        console.log(`[TM] XHR opened: ${this._method} ${this._url}`);
        originalOpen.apply(this, arguments);
    };

    XHR.send = function(body) {
        if (isTargetUrl(this._url) && this._method === "POST") {
            console.log(`[TM] Intercepted XHR to ${this._url}`);
            this._isIntercepted = true;

            this.removeEventListener('load', this._xhrLoadHandler);
            this._xhrLoadHandler = () => {
                // Handler vuoto, la logica è nei getter
            };
            this.addEventListener('load', this._xhrLoadHandler);

        } else {
            this._isIntercepted = false;
        }
        originalSend.apply(this, arguments);
    };

    Object.defineProperty(XHR, 'responseText', {
        get: function() {
            const originalText = originalGetResponseText.call(this);
            if (this._isIntercepted && this.readyState === 4) {
                console.log(`[TM] XHR: Accessing 'responseText' for intercepted URL: ${this._url}`);
                if (this.hasOwnProperty('_modifiedResponseText')) {
                     console.log(`[TM] XHR: Returning cached modified responseText for ${this._url}`);
                    return this._modifiedResponseText;
                }
                try {
                    this._modifiedResponseText = modifyResponseText(originalText, this._url);
                    console.log(`[TM] XHR: Modified responseText for ${this._url}. Length: ${this._modifiedResponseText?.length}`);
                    return this._modifiedResponseText;
                } catch (e) {
                    console.error(`[TM] XHR: Error modifying responseText for ${this._url}:`, e);
                    this._modifiedResponseText = originalText;
                    return originalText;
                }
            }
            return originalText;
        },
        configurable: true
    });

    Object.defineProperty(XHR, 'response', {
        get: function() {
            const originalResp = originalGetResponse.call(this);
            if (this._isIntercepted && this.readyState === 4) {
                console.log(`[TM] XHR: Accessing 'response' for intercepted URL: ${this._url}. ResponseType: ${this.responseType}`);
                 if (this.hasOwnProperty('_modifiedResponseObject')) {
                    console.log(`[TM] XHR: Returning cached modified response object for ${this._url}`);
                    return this._modifiedResponseObject;
                }

                const originalText = originalGetResponseText.call(this);
                let modifiedText;
                try {
                    modifiedText = modifyResponseText(originalText, this._url);
                } catch (e) {
                    console.error(`[TM] XHR: Error in modifyResponseText for 'response' getter (${this._url}):`, e);
                    this._modifiedResponseObject = originalResp;
                    return originalResp;
                }

                if (this.responseType === '' || this.responseType === 'text') {
                    this._modifiedResponseObject = modifiedText;
                    return modifiedText;
                } else if (this.responseType === 'json') {
                    try {
                        this._modifiedResponseObject = JSON.parse(modifiedText);
                        return this._modifiedResponseObject;
                    } catch (e) {
                        console.error(`[TM] XHR: Error parsing modified text as JSON for 'response' getter (${this._url}):`, e);
                        this._modifiedResponseObject = originalResp;
                        return originalResp;
                    }
                }
                console.warn(`[TM] XHR: 'response' getter for unhandled responseType '${this.responseType}' on ${this._url}. Returning original.`);
                this._modifiedResponseObject = originalResp;
                return originalResp;
            }
            return originalResp;
        },
        configurable: true
    });


    function attemptDirectInterception(retryCount = 0) {
        const maxRetries = 20;
        if (retryCount > maxRetries) {
            console.warn("[TM] Max retries reached for direct LOGIN interception. LOGIN object might not be available.");
            return;
        }

        if (typeof LOGIN !== 'undefined') {
            console.log("[TM] LOGIN object found. Attempting direct interception.");

            if (LOGIN.salvaToken && !LOGIN.salvaToken._isTampered) {
                console.log("[TM] Intercepting LOGIN.salvaToken");
                const originalSalvaToken = LOGIN.salvaToken;
                LOGIN.salvaToken = function(txt) {
                    console.log("[TM] LOGIN.salvaToken called. Original txt length:", txt?.length);
                    const modifiedTxt = modifyResponseText(txt, "login.php_or_testauth.php_direct_salvaToken");
                    return originalSalvaToken.call(this, modifiedTxt);
                };
                LOGIN.salvaToken._isTampered = true;
            } else if (LOGIN.salvaToken && LOGIN.salvaToken._isTampered) {
                 console.log("[TM] LOGIN.salvaToken already tampered.");
            } else {
                console.warn("[TM] LOGIN.salvaToken not found for direct interception.");
            }

            if (LOGIN.resToken && !LOGIN.resToken._isTampered) {
                console.log("[TM] Intercepting LOGIN.resToken");
                const originalResToken = LOGIN.resToken;
                LOGIN.resToken = function(txt) {
                    console.log("[TM] LOGIN.resToken called. Original txt length:", txt?.length);
                    const modifiedTxt = modifyResponseText(txt, "vertoken.php_direct_resToken");
                    return originalResToken.call(this, modifiedTxt);
                };
                LOGIN.resToken._isTampered = true;
            } else if (LOGIN.resToken && LOGIN.resToken._isTampered) {
                console.log("[TM] LOGIN.resToken already tampered.");
            } else {
                console.warn("[TM] LOGIN.resToken not found for direct interception.");
            }

            if (typeof DB !== 'undefined' && DB.login && DB.login.data) {
                console.log("[TM] Forcing license update in DB.login.data (after direct interceptions setup)");
                DB.login.data.auths = [...licenses.auths];
                DB.login.data.modls = [...licenses.modls];
                if (typeof localPouchDB !== 'undefined' && localPouchDB.setItem && typeof IMPORTER !== 'undefined' && IMPORTER.COMPR && typeof MD5 === 'function') {
                    try {
                        localPouchDB.setItem(MD5("DB.login"), IMPORTER.COMPR(DB.login));
                        console.log("[TM] DB.login updated and saved to localPouchDB (after direct interceptions setup).");
                    } catch (e) {
                        console.error("[TM] Error saving DB.login to localPouchDB (after direct interceptions setup):", e);
                    }
                } else {
                    console.warn("[TM] localPouchDB, IMPORTER.COMPR, or MD5 not available for saving DB.login (after direct interceptions setup).");
                }

                if (LOGIN.scriviUtente) {
                    console.log("[TM] Calling LOGIN.scriviUtente() (after direct interceptions setup)");
                    LOGIN.scriviUtente();
                }
                // Non chiamiamo PURCHASES.updateProducts() direttamente qui
            } else {
                console.warn("[TM] DB.login.data not available for direct forcing (after direct interceptions setup).");
            }

        } else {
            console.warn(`[TM] LOGIN object not found, retrying direct interception (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => attemptDirectInterception(retryCount + 1), 1000);
        }
    }

    setTimeout(() => {
        attemptDirectInterception();

        setInterval(() => {
            if (typeof DB !== 'undefined' && DB.login && DB.login.data &&
                typeof localPouchDB !== 'undefined' && localPouchDB.setItem &&
                typeof IMPORTER !== 'undefined' && IMPORTER.COMPR && typeof MD5 === 'function' &&
                typeof LOGIN !== 'undefined') {

                let changedInDB = false;
                if (JSON.stringify(DB.login.data.auths) !== JSON.stringify(licenses.auths)) {
                    DB.login.data.auths = [...licenses.auths];
                    changedInDB = true;
                }
                if (JSON.stringify(DB.login.data.modls) !== JSON.stringify(licenses.modls)) {
                    DB.login.data.modls = [...licenses.modls];
                    changedInDB = true;
                }

                if (changedInDB) {
                    console.log("[TM] Periodic check: DB.login.data differs. Forcing update.");
                    try {
                        localPouchDB.setItem(MD5("DB.login"), IMPORTER.COMPR(DB.login));
                        console.log("[TM] Periodic: DB.login updated and saved.");
                        if (LOGIN.scriviUtente) LOGIN.scriviUtente();
                        // Non chiamare PURCHASES.updateProducts() direttamente.
                        // L'app dovrebbe aggiornare la UI degli acquisti quando DB.login.data.auths è corretto
                        // e le sue funzioni di rendering (es. PURCHASES.abbsList) vengono chiamate.
                    } catch (e) {
                        console.error("[TM] Periodic: Error saving DB.login:", e);
                    }
                }
            }
        }, 10000);
    }, 2000);

    console.log("[TM] Iaomai modification script v0.8 fully initialized.");

})();