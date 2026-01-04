// ==UserScript==
// @name            Corriere.it Full Text Articles
// @name:it         Corriere.it - Articoli completi
// @namespace       http://tampermonkey.net/
// @version         1.0.3
// @description     Reset the articles counter on Corriere.it
// @description:it  Mostra il testo completo degli articoli su Corriere.it
// @author          Fork from Lazza
// @match           https://www.corriere.it/*
// @match           https://*.corriere.it/*
// @grant           unsafeWindow
// @require         https://greasyfork.org/scripts/35383-gm-addstyle-polyfill/code/GMaddStyle%20Polyfill.js?version=231590
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/514489/Corriereit%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/514489/Corriereit%20Full%20Text%20Articles.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.addStyle)
    GM_addStyle = GM.addStyle;

(function() {
    'use strict';

    unsafeWindow._apw = {
        modules: {
            anonymous_ac: {
                update: function() {},
            }
        }
    };
    localStorage.clear();

    ['apw_access', 'apw_cache', 'rcsddfglr'].forEach(function(name) {
        document.cookie = name + "=;domain=.corriere.it;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT"
    });

    var current = location.href.split("?")[0];
    if (current.indexOf('_preview') > 0) {
        location.href = current.replace(/_preview/, '').replace(/\?.*/, '');
    }
    if (current.indexOf('_amp.html') > 0) {
        location.href = current.replace(/_amp.html/, '.shtml').replace(/\?.*/, '');
    }

    GM_addStyle("#pwl_ma { display: none !important; }");
})();