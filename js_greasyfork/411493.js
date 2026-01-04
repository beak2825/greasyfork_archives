// ==UserScript==
// @name         Remove Ads on vc dtf tj
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove ads on vc dtf tj
// @author       silantevdenis
// @match        https://vc.ru/*
// @match        https://dtf.ru/*
// @match        https://journal.tinkoff.ru/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.slim.js
// @downloadURL https://update.greasyfork.org/scripts/411493/Remove%20Ads%20on%20vc%20dtf%20tj.user.js
// @updateURL https://update.greasyfork.org/scripts/411493/Remove%20Ads%20on%20vc%20dtf%20tj.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body *:first").before(
        "<style>"+
           ".propaganda, .sber-countdown, .psb-tax-teaser, .daily-promo-unit, .daily-promo-unit-label { display: none !important; }"+
        "</style>"
        )



})();