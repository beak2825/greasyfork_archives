// ==UserScript==
// @name         AnimeYT Clean Player
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes everything but the video player
// @author       stark1600
// @match        *://www.animeyt.tv/ver/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/370919/AnimeYT%20Clean%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/370919/AnimeYT%20Clean%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    OneSignal = null;

    jQuery('#fb-root').remove();
    jQuery('header.main-header').remove();
    jQuery('#main').remove();
    jQuery('#ADSPC').remove();
    jQuery('.stalabel').remove();
    jQuery('.main-footer').remove();
    jQuery('.drawer-overlay').remove();
    jQuery('body > main > div > div.ed-item.centrar-texto').remove();
    jQuery('.icon-izquierda-container').remove();
    jQuery('.icon-derecha-container').remove();
    jQuery('.capitulos-portada').remove();
    jQuery('.video-container').removeClass('tablet-80');
    jQuery('.video-container').removeClass('base-95');

    GM_addStyle('.ver-anime__mirrors a:hover, .ver-anime__mirrors a:active, .ver-anime__mirrors a.active {background: #333 !important;border-color: #333;}');
    GM_addStyle('.link-veranime {border: 1px solid #333;color: #999;}');
    GM_addStyle('.ed-container {max-width: 1400px;}');
    GM_addStyle('.ver-anime {background: #000;}');
    GM_addStyle('html {background: #000;}');
})();