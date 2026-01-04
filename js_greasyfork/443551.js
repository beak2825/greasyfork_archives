// ==UserScript==
// @name         ShadowRoot Hook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hook shadowroot dom and allowed to debug.
// @author       TGSAN
// @include      /.*/
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/443551/ShadowRoot%20Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/443551/ShadowRoot%20Hook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.Element.prototype.attachShadowOri = window.Element.prototype.attachShadow
    window.Element.prototype.attachShadow = function(obj) {
        console.warn("Hooked A ShadowDOM.", obj);
        obj.mode = "open";
        return this.attachShadowOri(obj);
    }
})();