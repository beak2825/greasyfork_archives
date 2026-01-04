// ==UserScript==
// @name         Block Smooth Scroll on Kitguru
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Kitguru has a really annoying effect where scrolling on the page is massively accelerated compared to normal. This fixes it and returns scrolling to the normal speed.
// @author       zofrex
// @match        https://www.kitguru.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417494/Block%20Smooth%20Scroll%20on%20Kitguru.user.js
// @updateURL https://update.greasyfork.org/scripts/417494/Block%20Smooth%20Scroll%20on%20Kitguru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if(true && (type == "wheel" || type == "mousewheel")) {
            console.log("Blocking annoying scroll hijacking");
        }
        else {
            this._addEventListener(type, listener, options);
        }
    };
})();
