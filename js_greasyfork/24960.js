// ==UserScript==
// @name         pkgetBigMap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bigger map for pkget.com & remove ads.
// @author       SSARCandy
// @match        https://pkget.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24960/pkgetBigMap.user.js
// @updateURL https://update.greasyfork.org/scripts/24960/pkgetBigMap.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body > section.text-wrap').remove();
    $('#map').css('height', '90vh');
    window.dispatchEvent(new Event('resize'));
})();