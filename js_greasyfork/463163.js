// ==UserScript==
// @name         Enter semi dead surviv.io by using HTTP. Needs browser settings adjusted (see info).
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  allows to bypass missing certificate problem by changing WSS to WS. need to enable Mixed content in browser settings
// @author       garlic
// @match        *://surviv.io/
// @match        *://*.surviv.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=surviv.io
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463163/Enter%20semi%20dead%20survivio%20by%20using%20HTTP%20Needs%20browser%20settings%20adjusted%20%28see%20info%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463163/Enter%20semi%20dead%20survivio%20by%20using%20HTTP%20Needs%20browser%20settings%20adjusted%20%28see%20info%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    {
        function disableLoginPrompt() {
            Object.defineProperty(window["modal-notification"],"style",{   get: function() { return {} },   set: function() {} }); Object.defineProperty(window["modal-create-account"],"style",{   get: function() { return {} },   set: function() {} }); Object.defineProperty(window["modal-account-incentive"],"style",{   get: function() { return {} },   set: function() { "strangely this has no effect"} }); Object.defineProperty(document, "cookie", {     configurable: true,     get: function() {         return "ftue-step=12";     },     set: function(e) {} });   History.prototype.replaceState = function() {}; 0;
        }

        window.addEventListener("DOMContentLoaded", disableLoginPrompt);

        window.WebSocket=class WebSocket extends window.WebSocket {
            constructor(e) {
                var url = new URL(e);
                url.port='';
                url.protocol='ws';
                super(url.toString());
                this.onerror = function(z) {
                    console.warn(z); /* maybe it's due to Mixed content ban, should explain to user */
                    if(!e.includes("team"))
                        if(console.confirm("This error might be because need to enable security settings (Enter semi dead surviv.io by using HTTP userscript Tampermonkey). Choose OK to read link with explanation")) { window.open('https://greasyfork.org/en/scripts/463163-enter-semi-dead-surviv-io-by-using-http-needs-browser-settings-adjusted-see-info','')}
                }
            }
        }
    }

})();