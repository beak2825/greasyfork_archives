// ==UserScript==
// @name         New York Times Paywall Bypass
// @namespace    https://greasyfork.org/users/673609
// @version      0.1
// @description  Bypass New York Times paywall.
// @match        https://www.nytimes.com/*
// @grant        none
// @run-at       document-start
// @license      magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
// @downloadURL https://update.greasyfork.org/scripts/408252/New%20York%20Times%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/408252/New%20York%20Times%20Paywall%20Bypass.meta.js
// ==/UserScript==



(function () {
    'use strict';

    const s = document.createElement ("style");
    s.innerHTML = `#gateway-content, .MAG_web_anon_new-journey-rollout, [aria-label='A message from The Times'],
    .css-1bd8bfl { display: none }
    .css-mcm29f, #site-content { position: unset !important; overflow: unset; height: unset; }`;

    document.addEventListener('DOMContentLoaded', (event)=> { document.body.appendChild (s); });

}) ();