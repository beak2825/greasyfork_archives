// ==UserScript==
// @name         Resultados futbol
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://www.resultados-futbol.com/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38316/Resultados%20futbol.user.js
// @updateURL https://update.greasyfork.org/scripts/38316/Resultados%20futbol.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#ayads-video-layer').remove();
    $('#ayads-video-bg').remove();
    $('#ayads-video-container').remove();
    $('#ayads-video-html').remove();
    $('.robapaginas').remove();
    $('.publi468-60').remove();
    $('.web-footer-ads').remove();
    $('#despl').remove();
    $('script[src="http://pagead2.googlesyndication.com/pagead/osd.js"]').remove();
    $('script').each(function(a,b) {
        if (b.src.indexOf('securepubads')!==-1) $(b).remove();
    });
    $('#matchvisualisation').remove();
    $('#compararpartido').remove();
    setTimeout(function() {
        //$('iframe[name="google_osd_static_frame"]').prev().remove();
        $('iframe[name="google_osd_static_frame"]').remove();
        $('div[id^="ad6foo-main-div-"]').remove();
    }, 1);
})();