// ==UserScript==
// @name         Network Call Listener
// @namespace    hardy.network.monitor
// @version      0.3
// @description  Monitor Fetch, XHR and websocket calls
// @author       Hardy [2131687]
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469186/Network%20Call%20Listener.user.js
// @updateURL https://update.greasyfork.org/scripts/469186/Network%20Call%20Listener.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let xhrListener = false;
    let fetchListener = false;
    let websocketListener = false;
    function addXHRListener() {
        if (xhrListener === true) return;
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function() {
            this.url = arguments[1];
            this.addEventListener('load', function() {
                let detail = {};
                detail.callType = "xhr";
                detail.url = this.url;
                detail.body = this.requestBody;
                if (this.responseType === "" || this.responseType === "text") {
                    detail.response = this.responseText;
                } else {
                    detail.response = this.response;
                }
                //whatever the response was
                window.dispatchEvent(new CustomEvent("hardy-xhr", { detail }));
            });
            return origOpen.apply(this, arguments);
        };
        window.XMLHttpRequest.prototype.send = function (body) {
            this.requestBody = body;
            return origSend.apply(this, arguments);
        };
        xhrListener = true;
    }
    function addFetchListener() {
        if (fetchListener === true) return;
        fetchListener = true;
        let original_fetch = window.fetch;
        window.fetch = async (url, init) => {
            let returned = await original_fetch(url, init)
            let copy = returned.clone();
            let detail = {};
            detail.callType = "fetch";
            try {
                let response = await copy.text();
                if (isJsonString(response)) {
                    let data = JSON.parse(response);
                    detail.response = data;
                    detail.url = url;
                    detail.body = {};
                    if (init.body) {
                        try {
                            for (const key of init.body.keys()) {
                                detail.body[key] = init.body.get(key);
                            }
                        } catch(error) {}
                    }
                    window.dispatchEvent(new CustomEvent("hardy-fetch", {"detail": detail}));
                } else {
                    detail.response = response;
                    detail.url = url;
                    detail.body = {};
                    if (init.body) {
                        try {
                            for (const key of init.body.keys()) {
                                detail.body[key] = init.body.get(key);
                            }
                        } catch(error) {}
                    }
                    window.dispatchEvent(new CustomEvent("hardy-fetch", {"detail": detail}));
                }
            } catch (error) {}

            return returned;
        }
    }
    function addWebsocketListener() {
        if (websocketListener === true) return;
        websocketListener = true;
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = function(...args) {
            const socket = new nativeWebSocket(...args);
            socket.addEventListener("message", (t)=> {
                let detail = {};
                detail.callType = "websocket";
                detail.url = socket.url;
                detail.response = t.data;
                window.dispatchEvent(new CustomEvent("hardy-socket", {
                    "detail": detail
                }));
            });
            return socket;
        }
    }
    function isJsonString(str) {
        if (!str || str === "") return false;

        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    addXHRListener();
    addFetchListener();
    addWebsocketListener();

})();
