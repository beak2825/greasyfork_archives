// ==UserScript==
// @name         Remove ads on Gamepedia/Fandompedia
// @namespace    remove-ads-gamepedia
// @version      0.1
// @description  This will remove annoying ads on Gamepedia (aka Fandom wiki), it includes the removal of Gamepedia Pro bar and set the page width to 100%.
// @author       Joey_JTS
// @match        https://*.gamepedia.com/*
// @match        https://*.fandom.com/*
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425170/Remove%20ads%20on%20GamepediaFandompedia.user.js
// @updateURL https://update.greasyfork.org/scripts/425170/Remove%20ads%20on%20GamepediaFandompedia.meta.js
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