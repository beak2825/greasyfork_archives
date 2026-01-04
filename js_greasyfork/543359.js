// ==UserScript==
// @name         Cache local de main.js + imágenes (24h)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Cachea y reutiliza main.js e imágenes clave por 24h para evitar re-descarga innecesaria
// @author       Shadow
// @match        *://atlanticafenix.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      atlanticafenix.com
// @license      CC-BY-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/543359/Cache%20local%20de%20mainjs%20%2B%20im%C3%A1genes%20%2824h%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543359/Cache%20local%20de%20mainjs%20%2B%20im%C3%A1genes%20%2824h%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas
    const now = Date.now();

    /*** === Funciones comunes de cache === ***/

    function setCache(key, value) {
        localStorage.setItem(key, value);
        localStorage.setItem(`${key}_time`, Date.now().toString());
    }

    function getCache(key) {
        const time = parseInt(localStorage.getItem(`${key}_time`) || '0', 10);
        const valid = now - time < CACHE_MAX_AGE;
        const value = localStorage.getItem(key);
        return valid && value ? value : null;
    }

    /*** === main.js === ***/

    const mainJsPattern = /\/panel\/js\/main\.js/i;
    const mainJsKey = 'mainjs_cache';

    const injectScript = (code) => {
        const script = document.createElement('script');
        script.textContent = code;
        document.documentElement.appendChild(script);
    };

    const fetchAndCacheScript = (url, key) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: (res) => {
                if (res.status === 200) {
                    setCache(key, res.responseText);
                    injectScript(res.responseText);
                } else {
                    console.warn('Error al obtener script:', url, res.status);
                }
            }
        });
    };

    /*** === Imágenes === ***/

    const imagePattern = /\/(images|uploads)\//i; // Ajusta este patrón si usas otro
    const toBase64 = (blob, callback) => {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(blob);
    };

    const fetchAndCacheImage = (imgEl, url, key) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: (res) => {
                toBase64(res.response, (base64) => {
                    setCache(key, base64);
                    imgEl.src = base64;
                });
            },
            onerror: () => console.warn('No se pudo descargar imagen:', url)
        });
    };

    /*** === Interceptores === ***/

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                // JS
                if (node.tagName === 'SCRIPT' && node.src && mainJsPattern.test(node.src)) {
                    console.log('[TM] Interceptado JS:', node.src);
                    node.remove();
                    const cached = getCache(mainJsKey);
                    if (cached) {
                        console.log('[TM] Inyectando main.js desde caché');
                        injectScript(cached);
                    } else {
                        console.log('[TM] Descargando main.js y guardando en caché');
                        fetchAndCacheScript(node.src, mainJsKey);
                    }
                }

                // IMG
                if (node.tagName === 'IMG' && node.src && imagePattern.test(node.src)) {
                    const key = 'img_cache_' + node.src;
                    const cached = getCache(key);
                    if (cached) {
                        console.log('[TM] Imagen cacheada usada:', node.src);
                        node.src = cached;
                    } else {
                        console.log('[TM] Descargando imagen para cachear:', node.src);
                        fetchAndCacheImage(node, node.src, key);
                    }
                }

                // También revisar atributos en elementos hijos
                if (node.querySelectorAll) {
                    node.querySelectorAll('img[src]').forEach(img => {
                        if (imagePattern.test(img.src)) {
                            const key = 'img_cache_' + img.src;
                            const cached = getCache(key);
                            if (cached) {
                                img.src = cached;
                            } else {
                                fetchAndCacheImage(img, img.src, key);
                            }
                        }
                    });
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

})();
