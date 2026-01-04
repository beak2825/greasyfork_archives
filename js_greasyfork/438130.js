// ==UserScript==
// @name         [HWM] AlwaysShowArtsDurability
// @namespace    [HWM] AlwaysShowArtsDurability
// @version      0.1
// @description  Всегда показывать прочность артефактов
// @author       Komdosh
// @include      http*://*.heroeswm.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438130/%5BHWM%5D%20AlwaysShowArtsDurability.user.js
// @updateURL https://update.greasyfork.org/scripts/438130/%5BHWM%5D%20AlwaysShowArtsDurability.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if(hwm_mobile_show_arts_durability != null)
        hwm_mobile_show_arts_durability(true, true);
})();