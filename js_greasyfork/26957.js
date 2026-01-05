// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Hide therapy ads v3
// @description  Hide the therapy ads
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @match        http://www.7cups.com/*
// @run-at       document-start
// @grant        none
// @version      4.1
// jshint        ignore: start
// @downloadURL https://update.greasyfork.org/scripts/26957/7%20Cups%20-%20Hide%20therapy%20ads%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/26957/7%20Cups%20-%20Hide%20therapy%20ads%20v3.meta.js
// ==/UserScript==
(function() {
    var css = 'div.module-onlinetherapyad.card, '
      + '.navbar-nav a[onclick*=ctaOnlineTherapy], '
      + '.navbar-nav a[href*=becomeListener] '
      + '{display: none;}';
    var s = document.head.appendChild(document.createElement('STYLE'));
    s.appendChild(document.createTextNode(css));
})();