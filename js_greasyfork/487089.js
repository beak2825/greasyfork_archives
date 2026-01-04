/* global $: true */
/* global waitForKeyElements: true */
/* global GM_xmlhttpRequest: true */
/* global GM_getValue: true */
/* global GM_setValue: true */
/* global unsafeWindow: true */
// jshint newcap:false
// jshint multistr:true

// ==UserScript==
// @name        Geocaching + Geocoord.nl
// @namespace  GC
// @description Voegt een zoekknop toe voor het Geocoord forum
// @include    http://www.geocaching.com/*
// @include    https://www.geocaching.com/*
// @exclude    https://www.geocaching.com/profile/profilecontent.html
// @version    1.2
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require    https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js
// @require    https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant      GM_xmlhttpRequest
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_addStyle
// @grant      GM.xmlHttpRequest
// @grant      GM.setValue
// @grant      GM.getValue
// @connect    maps.googleapis.com
// @connect    img.geocaching.com
// @connect    s3.amazonaws.com
// @connect    nominatim.openstreetmap.org
// @connect    *
// @license    The MIT License (MIT)
// @downloadURL https://update.greasyfork.org/scripts/487089/Geocaching%20%2B%20Geocoordnl.user.js
// @updateURL https://update.greasyfork.org/scripts/487089/Geocaching%20%2B%20Geocoordnl.meta.js
// ==/UserScript==

(function() {

  'use strict';

  var geocoordURL = 'https://www.geocoord.nl/forum/index.php?mtm_campaign=gcscript&action=search2&search=';
  var path = window.location.pathname;
  var gccode = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();

  if (window.top == window.self &&
        ( (path.match(/^\/geocache\/.*/) !== null) ||
        (path.match(/^\/seek\/cache_details\.aspx.*/) !== null))) {

      $('#ctl00_ContentBody_GeoNav_logButton').after('<a id="linkToGeoCoord" class="btn btn-primary" style="margin-top: 14px; background-color: #02874D role="button""  href="' + geocoordURL + gccode + ' " target="_blank">Zoeken bij GeoCoord</a>');
  }
}());