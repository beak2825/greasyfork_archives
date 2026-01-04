// ==UserScript==
// @name         Fakti BG remove adblock message
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove adblock disclaimer from fakti.bg .
// @author       DGE
// @match        https://fakti.bg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398880/Fakti%20BG%20remove%20adblock%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/398880/Fakti%20BG%20remove%20adblock%20message.meta.js
// ==/UserScript==

(function() {
    'use strict';
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
document.getElementById("adsblock-msg").remove();
document.getElementById("ZaplataFooter").remove();
})();