// ==UserScript==
// @name         MyDealz AntiGender
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Entfernt das Gendern auf mydealz und weitere unnötige Bereiche
// @author       You
// @include      *://www.mydealz.de/deals/*
// @match        *://www.mydealz.de/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470850/MyDealz%20AntiGender.user.js
// @updateURL https://update.greasyfork.org/scripts/470850/MyDealz%20AntiGender.meta.js
// ==/UserScript==

setInterval(modify, 200);

function modify() {

       // Im Deal
       // Autor statt Autor*in
       $('.comment-padding .textBadge').text('Autor')

      // Experten Banner
      $('.js-expert-banner').remove()

    // Auch Interessant
    if($('.card.card--type-horizontal.listLayout-scrollBox.aGrid').length > 1)
    $('.card.card--type-horizontal.listLayout-scrollBox.aGrid').eq(0).remove()

    // rechte Navbar Top Handläer, Top Gruppen etc.
    $('.hide--toW4.listLayout-side.space--b-2').remove()

    // Blog-View
    $('.cept-banner').remove()
}