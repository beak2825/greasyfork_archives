// ==UserScript==
// @name            The New York Times Paywall Bypass
// @name:it         The New York Times - Articoli con testo completo
// @namespace       https://andrealazzarotto.com/
// @version         1.0.2
// @description     Expand the text of articles on The New York Times
// @description:it  Mostra il testo completo degli articoli di The New York Times
// @author          Andrea Lazzarotto (modified by Threeskimo)
// @match           https://www.nytimes.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/umbrella/3.1.0/umbrella.min.js
// @require         https://code.jquery.com/jquery-3.6.0.min.js
// @icon            blob:chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/2492cbe1-7f56-4343-bc13-b8e94f1bc7fb
// @grant           none
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/452516/The%20New%20York%20Times%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/452516/The%20New%20York%20Times%20Paywall%20Bypass.meta.js
// ==/UserScript==


(function() {
    'use strict';

    u('body').append(`
    <style>
    #gateway-content, .MAG_web_anon_new-journey-rollout, [aria-label='A message from The Times'] { display: none }
    .css-mcm29f, #site-content { position: unset !important; overflow: unset; height: unset; }
    .css-1bd8bfl { display: none; }
    .css-gx5sib { display: none; }
    </style>
    `);
})();

function dostuff() {
    $('[id^=story-ad]').remove();
    $('[id^=top-wrapper]').remove();
    $('[id^=bottom-wrapper]').remove();
    $('[class^=css-bs95eu]').remove();
}

setInterval(dostuff, 1000); // call every 1000 milliseconds