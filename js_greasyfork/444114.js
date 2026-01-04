// ==UserScript==
// @name        Igg-Games Anti-AdBlock Bypass
// @namespace   https://github.com/Enchoseon/enchos-assorted-userscripts/raw/main/igg-games-anti-adblock-bypass.user.js
// @version     0.6.9
// @description Bypass Igg-Games anti-adblock.
// @author      Enchoseon
// @include     *igg-games.com*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/444114/Igg-Games%20Anti-AdBlock%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/444114/Igg-Games%20Anti-AdBlock%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Intercept JavaScript
    window.addEventListener("beforescriptexecute", function(e) {
        if (e.target.innerText.hashCode() === 123130781) { // Hashcode of the obfuscated inline anti-adblock JavaScript
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return true;
    });
    // Generate hashcode (https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/)
    String.prototype.hashCode = function() {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
})();
