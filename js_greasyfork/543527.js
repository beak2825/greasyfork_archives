// ==UserScript==
// @name         Bloquear modal de hogar en Netflix
// @namespace    https://tuempresa.com/
// @version      1.0
// @description  Bloquea el mensaje de “Tu dispositivo no forma parte del hogar” filtrando por longitud del contenido POST en GraphQL.
// @author       TuNombre
// @match        *://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543527/Bloquear%20modal%20de%20hogar%20en%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/543527/Bloquear%20modal%20de%20hogar%20en%20Netflix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const [url, config] = args;
        if (
            url.includes("web.prod.cloud.netflix.com/graphql") &&
            config?.method === "POST" &&
            typeof config.body === "string"
        ) {
            const len = config.body.length;
            if (len >= 189 && len <= 199) {
                console.warn(`🚫 Bloqueado: GraphQL Netflix hogar (Length: ${len})`);
                return new Response(null, { status: 204 });
            }
        }
        return originalFetch.apply(this, args);
    };
})();
