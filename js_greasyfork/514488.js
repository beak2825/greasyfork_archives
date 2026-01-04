// ==UserScript==
// @name            Corriere.it - Cookie Cleaner
// @name:it         Corriere.it - Pulizia dei cookie
// @namespace       http://tampermonkey.net/
// @version         1.0.4
// @description     Maintain a cookie and tracking-free experience on Corriere.it
// @description:it  Naviga su Corriere.it limitando il salvataggio dei cookie traccianti
// @author          Fork from Lazza
// @match           https://www.corriere.it/*
// @match           https://*.corriere.it/*
// @grant           unsafeWindow
// @require         https://greasyfork.org/scripts/35383-gm-addstyle-polyfill/code/GMaddStyle%20Polyfill.js?version=231590
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/514488/Corriereit%20-%20Cookie%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/514488/Corriereit%20-%20Cookie%20Cleaner.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.addStyle) {
    GM_addStyle = GM.addStyle;
}

(function() {
    'use strict';

    unsafeWindow._apw = {
        modules: {
            anonymous_ac: {
                update: () => {},
            },
            std: {
                get_cookie: () => {},
            },
        },
    };
    localStorage.clear();

    var cleaner = () => {
        var cookies = document.cookie.split(';').map(c => c.trim()).filter(c => c.indexOf('=') > 0).map(c => c.split('=')[0]).filter(c => c !== '__CPcorriere_ct');
        cookies.forEach(function(name) {
            document.cookie = name + "=;domain=.corriere.it;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            document.cookie = name + "=;domain=" + location.hostname + ";path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
        });
        var random = ['__ric', 'pnespsdk_ssn', 'pnespsdk_visitor'];
        random.forEach(function(name) {
            document.cookie = name + "=" + Math.random() + ";path=/;";
        });
    };
    cleaner();
    setTimeout(cleaner, 5000);

    var current = location.href.split("?")[0];
    if (current.indexOf('_preview') > 0) {
        location.href = current.replace(/_preview/, '').replace(/\?.*/, '');
    }
    if (current.indexOf('_amp.html') > 0) {
        location.href = current.replace(/_amp.html/, '.shtml').replace(/\?.*/, '');
    }

    GM_addStyle("#pwl_ma, #_cpmt-iframe, .tp-modal.manine-modal { display: none !important; }");
})();