// ==UserScript==
// @name            Quotidiano.net Full Text Articles
// @name:it         Quotidiano.net - Articoli con testo completo
// @namespace       https://andrealazzarotto.com
// @version         1.0
// @description     Uncovers the "paywalled" articles on Quotidiano.net
// @description:it  Mostra il testo completo degli articoli su Quotidiano.net
// @author          Andrea Lazzarotto
// @match           https://www.quotidiano.net/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @grant           none
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/411625/Quotidianonet%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/411625/Quotidianonet%20Full%20Text%20Articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.pathname.endsWith('/amp')) {
        location.pathname = location.pathname.slice(0, -4);
    }

    $('body').removeClass('detail-page--paywall').append('<style>#login-frame { display: none; }</style>');
})();