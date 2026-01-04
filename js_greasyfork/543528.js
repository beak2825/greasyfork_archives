// ==UserScript==
// @name         Bloquear modal de hogar en Netflix (por Content-Length)
// @namespace    https://tuempresa.com/
// @version      1.2
// @description  Bloquea el mensaje de hogar en Netflix detectando requests POST con Content-Length = 190 hacia GraphQL.
// @author       TuNombre
// @match        *://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543528/Bloquear%20modal%20de%20hogar%20en%20Netflix%20%28por%20Content-Length%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543528/Bloquear%20modal%20de%20hogar%20en%20Netflix%20%28por%20Content-Length%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        const url = typeof input === "string" ? input : input.url;

        if (
            url.includes("web.prod.cloud.netflix.com/graphql") &&
            init?.method === "POST"
        ) {
            const headers = new Headers(init.headers || {});
            const cl = headers.get("Content-Length");
            if (cl === "190") {
                console.warn("🚫 Bloqueado: GraphQL Content-Length = 190");
                return new Response(null, { status: 204 });
            }
        }

        return originalFetch.apply(this, arguments);
    };

    // XMLHttpRequest también (por compatibilidad)
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        this._isNetflixPost = method === 'POST' && url.includes("web.prod.cloud.netflix.com/graphql");
        return originalOpen.call(this, method, url, ...args);
    };
    XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
        this._headers = this._headers || {};
        this._headers[name.toLowerCase()] = value;
        return XMLHttpRequest.prototype.setRequestHeader.original.apply(this, arguments);
    };
    XMLHttpRequest.prototype.setRequestHeader.original = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.send = function (body) {
        const cl = this._headers?.["content-length"];
        if (this._isNetflixPost && cl === "190") {
            console.warn("🚫 Bloqueado XHR Content-Length = 190");
            return;
        }
        return originalSend.call(this, body);
    };
})();
