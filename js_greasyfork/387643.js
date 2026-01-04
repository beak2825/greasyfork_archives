// ==UserScript==
// @name         [NO ADS] Gamepedia
// @namespace    noads-gamepedia
// @version      0.1
// @description  Bye bye Ads
// @author       You
// @match        https://*.gamepedia.com/*
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387643/%5BNO%20ADS%5D%20Gamepedia.user.js
// @updateURL https://update.greasyfork.org/scripts/387643/%5BNO%20ADS%5D%20Gamepedia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#bodyContent').css('width', '100%');
    $('#btfheroContainer').remove();
    $('#siderail_terraria_gamepedia').remove();
    $('#atflb').remove();
    $('.ad-placement').remove();

    console.log('[NO ADS] Gamepedia Loaded.');
})();