// ==UserScript==
// @name            Repubblica "Rep" Aesthetic Paywall Bypass
// @name:it         Repubblica Rep - Articoli con testo completo
// @namespace       https://andrealazzarotto.com
// @version         1.2.2
// @description     Uncovers the "paywalled" articles on Repubblica Rep
// @description:it  Mostra il testo completo degli articoli su Repubblica Rep
// @author          Andrea Lazzarotto
// @match           https://rep.repubblica.it/*
// @grant           GM_addStyle
// @require         https://greasyfork.org/scripts/35383-gm-addstyle-polyfill/code/GMaddStyle%20Polyfill.js?version=231590
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/41051/Repubblica%20%22Rep%22%20Aesthetic%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/41051/Repubblica%20%22Rep%22%20Aesthetic%20Paywall%20Bypass.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.addStyle)
  GM_addStyle = GM.addStyle;

var watcher = function() {
    var pwa = location.href.indexOf("/pwa/") > 0;
    var comments = location.pathname.endsWith("/commenti");
    if (pwa && !comments) {
        location.href = location.href.replace("/pwa/", "/ws/detail/");
    }
};

(function() {
    'use strict';

    GM_addStyle("div.detail-article_body > div:not(.paywall) { display: none !important; } .paywall, body:not(.i-amphtml-subs-grant-yes) [subscriptions-section='content']{ display: block !important; }");
    setInterval(watcher, 1000);
    window.dispatchEvent(new Event('resize'));
})();