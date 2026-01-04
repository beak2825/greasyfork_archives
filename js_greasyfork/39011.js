// ==UserScript==
// @name           Spiegel Online: Adblock Wall entfernen
// @namespace      https://greasyfork.org/en/users/8981-buzz
// @description    Entfernt die nervige Anti-Adblock-Meldung von SPON.
// @author         buzz
// @locale         de
// @require        https://code.jquery.com/jquery-2.2.0.min.js
// @version        0.3
// @license        GPLv2
// @match          http://www.spiegel.de/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/39011/Spiegel%20Online%3A%20Adblock%20Wall%20entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/39011/Spiegel%20Online%3A%20Adblock%20Wall%20entfernen.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global $: false */
'use strict';

$(function() {
  var h, s;
  h = document.getElementsByTagName('head')[0];
  if (!h) {
    return;
  }
  s = document.createElement('style');
  s.type = 'text/css';
  s.innerHTML = '.ua-detected { display: none !important; } ' +
    '#wrapper-content { opacity: 1.0 !important; filter: none !important; pointer-events: auto !important; } ' +
    'div[class*="sp_message_container"], div[id*="sp_message_id"], div[class*="sp_veil"] { display: none !important } ' +
    'html, body { overflow-y: auto !important; height: auto !important;';
  h.appendChild(s);
});
