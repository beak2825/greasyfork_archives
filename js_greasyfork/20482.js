// ==UserScript==
// @name       15min-hide-adblock
// @namespace  http://mbieliau.lt
// @version    0.1
// @description  Hide AdBlock from 15min.lt
// @match      http://www.15min.lt/*
// @copyright  2016+, Marius Bieliauskas
// @run-at     document-start
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/20482/15min-hide-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/20482/15min-hide-adblock.meta.js
// ==/UserScript==

var regex = /(blocker)|(hasAdblock)/g;

(function(proxied) {
    window.setTimeout = function() {        
        var source = arguments[0].toString();
        
        if (source && source.match(regex)) {
            return false;
        }
        
        return proxied.apply(this, arguments);
    };
})(window.setTimeout);