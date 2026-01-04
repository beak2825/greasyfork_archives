// ==UserScript==
// @name            No Refrescar!
// @description     Desactiva el refresco automático en sitios de noticias argentinas (políticas, sociales, culturales, económicas, deportivas, etc.)
// @namespace       https://github.com/bone-machine/No-Refrescar
// @version         1.01
// @author          bone-machine
// @homepage        https://github.com/bone-machine/No-Refrescar
// @supportURL      https://github.com/bone-machine/No-Refrescar/issues
// @icon            https://i.ibb.co/SDLYynr6/no-refrescar-icon.png
// @license         GPLv3
// @grant           none
// @run-at          document-start
// @match           https://*.ellitoral.com/*
// @match           https://*.pagina12.com.ar/*
// @match           https://*.perfil.com/*
// @match           https://*.minutouno.com/*
// @match           https://*.ambito.com/*
// @match           https://*.cronica.com.ar/*
// @match           https://*.lanacion.com.ar/*
// @match           https://*.clarin.com/*
// @match           https://*.infobae.com/*
// @match           https://*.tn.com.ar/*
// @match           https://*.tycsports.com/*
// @match           https://*.ole.com.ar/*
// @match           https://*.eldia.com/*
// @match           https://*.revistagente.com/*
// @match           https://*.ciudad.com.ar/*
// @match           https://*.cienradios.com/*
// @match           https://*.tiempoar.com.ar/*
// @match           https://*.diariopopular.com.ar/*
// @match           https://*.losandes.com.ar/*
// @match           https://*.diariouno.com.ar/*
// @match           https://*.lacapital.com.ar/*
// @match           https://*.realpolitik.com.ar/*
// @match           https://*.letrap.com.ar/*
// @match           https://*.viapais.com.ar/*
// @match           https://*.caras.perfil.com/*
// @match           https://*.airedesantafe.com.ar/*
// @match           https://*.cadena3.com/*
// @match           https://*.infocielo.com/*
// @match           https://*.mdzol.com/*
// @match           https://*.a24.com/*
// @match           https://*.urgente24.com/*
// @downloadURL https://update.greasyfork.org/scripts/547376/No%20Refrescar%21.user.js
// @updateURL https://update.greasyfork.org/scripts/547376/No%20Refrescar%21.meta.js
// ==/UserScript==

/*

Si querés reportar un comportamiento indeseado, un bug, o el script no funciona en los sitios que visitas, abrí un ticket en:
https://github.com/bone-machine/No-Refrescar/issues

Para peticiones, sólo se aceptan medios de comunicación de cualquier tipo de noticias
(políticas, sociales, culturales, económicas, deportivas, sucesos, farándula, etc.)

Se aceptan sugerencias para otros sitios que no sean de origen argentino.

*/

(function () {
    "use strict";

    /* Remove Meta HTML "refresh" tag for every site listed in each @match above, even if they don't specifically declare/use it */

    // Credits to @gorhill and the uBlock Origin team:
    // https://github.com/gorhill/uBlock/wiki/Resources-Library#prevent-refreshjs-
    // https://github.com/gorhill/uBlock/commit/c0a43b0d32e38aa3858644db20fc69a7b0c85e82
    const defuse = () => {
        const meta = document.querySelector('meta[http-equiv="refresh" i][content]');
        if (meta === null) return;
        const s = meta.getAttribute('content');
        const ms = Math.max(parseFloat(s) || 0, 0) * 1000;
        setTimeout(() => { window.stop(); }, ms);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", defuse, { once: true });
    } else {
        defuse();
    }

    /* Clear setInterval, or setTimeout, for sites which don't use a Meta HTML "refresh" tag for refreshing */

    const TimerType = {
        INTERVAL: "Interval",
        TIMEOUT: "Timeout"
    };

    const typeOfTimerPerDomain = [
        // setInterval
        { domain: "pagina12.com.ar", timer: TimerType.INTERVAL },
        { domain: "ellitoral.com", timer: TimerType.INTERVAL },
        { domain: "cienradios.com", timer: TimerType.INTERVAL }, // La 100, Radio Mitre.
        { domain: "ole.com.ar", timer: TimerType.INTERVAL },
        { domain: "cadena3.com", timer: TimerType.INTERVAL },
        // setTimeout
        { domain: "lanacion.com.ar", timer: TimerType.TIMEOUT },
        { domain: "eldia.com", timer: TimerType.TIMEOUT },
        { domain: "tn.com.ar", timer: TimerType.TIMEOUT },
        { domain: "tycsports.com", timer: TimerType.TIMEOUT },
        { domain: "revistagente.com", timer: TimerType.TIMEOUT },
        { domain: "ciudad.com.ar", timer: TimerType.TIMEOUT }
    ];

    function clearTimer (type) {
        const originalTimer = window[`set${type}`];
        window[`set${type}`] = function(fn, delay, ...args) {
            if (
                fn.toString().includes("location.reload") ||
                fn.toString().includes("window.reloadPage") || // Página 12.
                fn.toString().includes('typeof google&&"object"===_typeof(google.ima)') || // El Litoral.
                fn.toString().includes("typeof window.playing !== 'undefined' && Object.keys(window.playing).length)") || // La 100, Radio Mitre.
                fn.toString().includes("funcPage,600000") // Cadena 3.
            ) {
                const id = originalTimer(fn, delay, ...args);
                window[`clear${type}`](id);
                return id;
            }
            return originalTimer(fn, delay, ...args);
        };
    }

    for (const { domain, timer } of typeOfTimerPerDomain) {
        if (location.hostname.includes(domain)) {
            clearTimer(timer);
            break;
        }
    }

    /* Specific fixes for certain domains */

    // For Clarín and Olé, we intercept their Web Worker. Olé needs both this method plus clearing their interval above.
    if (location.hostname.includes("clarin.com") || location.hostname.includes("ole.com.ar")) {
        const OriginalWorker = window.Worker;
        window.Worker = function(url, options) {
            const worker = new OriginalWorker(url, options);

            // Intercept messages to modify refresh commands
            const originalPostMessage = worker.postMessage;
            worker.postMessage = function(data) {
                if (
                    typeof data === "object" &&
                    data.cmd === "start" &&
                    data.autoRefresh === "true"
                ) {
                    // We "disable" auto-refresh by setting a very high time value, since it ignores the "autoRefresh" key value.
                    const modifiedData = {
                        ...data,
                        options: { ...data.options, refreshTime: 9007199254 }
                    };
                    return originalPostMessage.call(this, modifiedData);
                }

                // Allow all other messages.
                return originalPostMessage.call(this, data);
            };

            return worker;
        };
    }

    // For Infobagre, we set the value of key "noAutorefresh" to "true" in session storage (Might be a dev flag).
    if (location.hostname.includes("infobae.com")) {
        const noAutoRefreshData = {
            url: window.location.href,
            noAutorefresh: true
        };
        sessionStorage.setItem("no-autorefresh", JSON.stringify(noAutoRefreshData));
    }

})();
