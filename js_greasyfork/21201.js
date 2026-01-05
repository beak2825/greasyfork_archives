// ==UserScript==
// @name           taz: remove paywall
// @namespace      https://greasyfork.org/en/users/8981-buzz
// @description    Removes taz.de paywall
// @author         buzz
// @version        0.5
// @license        GPLv2
// @match          http://*.taz.de/*
// @match          https://*.taz.de/*
// @downloadURL https://update.greasyfork.org/scripts/21201/taz%3A%20remove%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/21201/taz%3A%20remove%20paywall.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function() {
  function add_style(css) {
    var h, s;
    h = document.getElementsByTagName('head')[0];
    if (!h) {
      return;
    }
    s = document.createElement('style');
    s.type = 'text/css';
    s.innerHTML = css;
    h.appendChild(s);
  }
  add_style('#tzi-paywahl-fg, #tzi-paywahl-bg, #tzi_paywall { display: none !important; }');
})();
