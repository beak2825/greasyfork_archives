// ==UserScript==
// @name         Google AI Studio Model kingfall
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Inject multiple custom models with themed emojis into Google AI Studio model list. Intercepts XHR/fetch, handles array-of-arrays JSON structures.
// @author       Updated by everyone
// @match        https://aistudio.google.com/*
// @match        https://google.com/app/prompts/new_chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539065/Google%20AI%20Studio%20Model%20kingfall.user.js
// @updateURL https://update.greasyfork.org/scripts/539065/Google%20AI%20Studio%20Model%20kingfall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============== Configuration ===============
    const SCRIPT_VERSION = "v1.7";
    const DEBUG = false; // set true for verbose logging
    const LOG_PREFIX = `[Injector ${SCRIPT_VERSION}]`;

    const MODELS_TO_INJECT = [
        { name: 'models/kingfall-ab-test', displayName: `👑 Kingfall (${SCRIPT_VERSION})`, description: `Injected by script ${SCRIPT_VERSION}` },
        { name: 'models/gemini-2.5-pro-preview-03-25', displayName: `✨ Gemini 2.5 Pro 03-25 (${SCRIPT_VERSION})`, description: `Injected by script ${SCRIPT_VERSION}` },
        { name: 'models/goldmane-ab-test', displayName: `🦁 Goldmane (${SCRIPT_VERSION})`, description: `Injected by script ${SCRIPT_VERSION}` },
        { name: 'models/claybrook-ab-test', displayName: `💧 Claybrook (${SCRIPT_VERSION})`, description: `Injected by script ${SCRIPT_VERSION}` },
        { name: 'models/frostwind-ab-test', displayName: `❄️ Frostwind (${SCRIPT_VERSION})`, description: `Injected by script ${SCRIPT_VERSION}` },
        { name: 'models/calmriver-ab-test', displayName: `🌊 Calmriver (${SCRIPT_VERSION})`, description: `Injected by script ${SCRIPT_VERSION}` }
    ];

    // ============== Helpers ===============
    function log(...args) { if (DEBUG) console.log(LOG_PREFIX, ...args); }
    function isTargetURL(url) {
        return typeof url === 'string' && url.includes('ListModels');
    }

    // Recursively find the array-of-arrays model list
    function findModelListArray(obj) {
        if (Array.isArray(obj) && obj.length > 0 && obj.every(
            item => Array.isArray(item) && typeof item[0] === 'string' && item[0].startsWith('models/')
        )) {
            return obj;
        }
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const res = findModelListArray(obj[key]);
                    if (res) return res;
                }
            }
        }
        return null;
    }

    function processJsonData(data) {
        const NAME_IDX = 0, DISPLAY_IDX = 3, DESC_IDX = 4, METHODS_IDX = 7;
        let modified = false;

        const modelsArray = findModelListArray(data);
        if (!modelsArray) {
            log('No model list found, skipping');
            return { data, modified };
        }

        // find a template model that has methods
        const template = modelsArray.find(m => Array.isArray(m) && Array.isArray(m[METHODS_IDX])) || null;
        if (!template) {
            log('Template model not found, cannot inject new models');
        }

        MODELS_TO_INJECT.slice().reverse().forEach(model => {
            const exists = modelsArray.some(m => Array.isArray(m) && m[NAME_IDX] === model.name);
            if (!exists && template) {
                const clone = JSON.parse(JSON.stringify(template));
                clone[NAME_IDX] = model.name;
                clone[DISPLAY_IDX] = model.displayName;
                clone[DESC_IDX] = `${model.description} (based on ${template[NAME_IDX]})`;
                if (!Array.isArray(clone[METHODS_IDX])) {
                    clone[METHODS_IDX] = ['generateContent','countTokens','createCachedContent','batchGenerateContent'];
                }
                modelsArray.unshift(clone);
                modified = true;
                log('Injected', model.name);
            } else if (exists) {
                // update display name if changed
                const existing = modelsArray.find(m => m[NAME_IDX] === model.name);
                if (existing && existing[DISPLAY_IDX] !== model.displayName) {
                    existing[DISPLAY_IDX] = model.displayName;
                    modified = true;
                    log('Updated displayName for', model.name);
                }
            }
        });

        return { data, modified };
    }

    function modifyResponseBody(text, url) {
        if (typeof text !== 'string') return text;
        const ANTI_HIJACK = ")]}'\n";
        let body = text, hasPrefix = false;
        if (body.startsWith(ANTI_HIJACK)) {
            body = body.slice(ANTI_HIJACK.length);
            hasPrefix = true;
        }
        if (!body.trim()) return text;

        try {
            const json = JSON.parse(body);
            const result = processJsonData(json);
            if (result.modified) {
                let out = JSON.stringify(result.data);
                if (hasPrefix) out = ANTI_HIJACK + out;
                return out;
            }
        } catch (e) {
            console.error(LOG_PREFIX, 'JSON parse error for', url, e);
        }
        return text;
    }

    // ============== Fetch Interceptor ===============
    const origFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = input instanceof Request ? input.url : String(input);
        const response = await origFetch(input, init);
        if (response.ok && isTargetURL(url)) {
            try {
                const clone = response.clone();
                const text = await clone.text();
                const mod = modifyResponseBody(text, url);
                if (mod !== text) {
                    return new Response(mod, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (e) {
                console.error(LOG_PREFIX, 'Fetch intercept error', e);
            }
        }
        return response;
    };
    log('Fetch patch applied');

    // ============== XHR Interceptor ===============
    const xhrProto = XMLHttpRequest.prototype;
    const origOpen = xhrProto.open;
    const txtDesc = Object.getOwnPropertyDescriptor(xhrProto, 'responseText');
    const resDesc = Object.getOwnPropertyDescriptor(xhrProto, 'response');

    xhrProto.open = function(method, url) {
        this._isTarget = isTargetURL(url);
        return origOpen.apply(this, arguments);
    };

    function wrapResponse(xhr, origVal, type) {
        if (xhr._isTarget && xhr.readyState === 4 && xhr.status === 200) {
            const cacheKey = '_cached' + type;
            if (xhr[cacheKey] === undefined) {
                const txt = type === 'json' && typeof origVal === 'object'
                            ? JSON.stringify(origVal)
                            : String(origVal);
                xhr[cacheKey] = modifyResponseBody(txt, xhr._interceptorUrl);
            }
            const val = xhr[cacheKey];
            if (type === 'json' && typeof val === 'string') {
                try { return JSON.parse(val); } catch { return origVal; }
            }
            return val;
        }
        return origVal;
    }

    if (txtDesc && txtDesc.get) {
        Object.defineProperty(xhrProto, 'responseText', {
            get: function() {
                return wrapResponse(this, txtDesc.get.call(this), 'text');
            }, configurable: true
        });
    }
    if (resDesc && resDesc.get) {
        Object.defineProperty(xhrProto, 'response', {
            get: function() {
                const rt = resDesc.get.call(this);
                if (this.responseType === 'json') return wrapResponse(this, rt, 'json');
                if (!this.responseType || this.responseType === 'text') return wrapResponse(this, rt, 'text');
                return rt;
            }, configurable: true
        });
    }
    log('XHR patch applied');
})();
