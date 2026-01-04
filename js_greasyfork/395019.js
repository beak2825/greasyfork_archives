// ==UserScript==
// @name            The New York Times Paywall Bypass
// @name:it         The New York Times - Articoli con testo completo
// @namespace       https://andrealazzarotto.com/
// @version         1.0.2
// @description     Expand the text of articles on The New York Times
// @description:it  Mostra il testo completo degli articoli di The New York Times
// @author          Andrea Lazzarotto
// @match           https://www.nytimes.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/umbrella/3.1.0/umbrella.min.js
// @grant           none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/395019/The%20New%20York%20Times%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/395019/The%20New%20York%20Times%20Paywall%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    u('body').append(`
    <style>
    #gateway-content, .MAG_web_anon_new-journey-rollout, [aria-label='A message from The Times'] { display: none }
    .css-mcm29f, #site-content { position: unset !important; overflow: unset; height: unset; }
    .css-1bd8bfl { display: none; }
    </style>
    `);
})();