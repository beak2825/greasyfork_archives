// ==UserScript==
// @name         IdlescapeSocket
// @version      1.0
// @description  ISMonkey Extension Loader
// @namespace    IdlescapeSocket
// @match        *://*.idlescape.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424551/IdlescapeSocket.user.js
// @updateURL https://update.greasyfork.org/scripts/424551/IdlescapeSocket.meta.js
// ==/UserScript==
(function() {
    'use strict';
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data){
        this._send(data);
        if( typeof window.IdlescapeSocket == "undefined" ){
            window.IdlescapeSocket = this;
            this.send = this._send;
        }
    }
})();