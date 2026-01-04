// ==UserScript==
// @name         Rarbg Clickjack Bypass
// @namespace    https://greasyfork.org/users/673609
// @version      0.1
// @description  Bypass Rarbg clickjacking.
// @match        https://rarbg.to/*
// @include      https://proxyrarbg.org/*
// @include      https://rarbg.is/*
// @include      https://rarbg2018.org/*
// @include      https://rarbg2019.org/*
// @include      https://rarbg2020.org/*
// @include      https://rarbg2021.org/*
// @include      https://rarbgaccess.org/*
// @include      https://rarbgaccessed.org/*
// @include      https://rarbgcore.org/*
// @include      https://rarbgdata.org/*
// @include      https://rarbgenter.org/*
// @include      https://rarbgget.org/*
// @include      https://rarbggo.org/*
// @include      https://rarbgindex.org/*
// @include      https://rarbgmirror.com/*
// @include      https://rarbgmirror.org/*
// @include      https://rarbgmirror.xyz/*
// @include      https://rarbgmirrored.org/*
// @include      https://rarbgp2p.org/*
// @include      https://rarbgproxied.org/*
// @include      https://rarbgproxies.org/*
// @include      https://rarbgproxy.org/*
// @include      https://rarbgprx.org/*
// @include      https://rarbgto.org/*
// @include      https://rarbgtor.org/*
// @include      https://rarbgtorrents.org/*
// @include      https://rarbgunblock.com/*
// @include      https://rarbgunblock.org/*
// @include      https://rarbgunblocked.org/*
// @include      https://rarbgway.org/*
// @include      https://rarbgweb.org/*
// @include      https://unblockedrarbg.org/*
// @include      https://www.rarbg.is/*
// @grant        none
// @run-at       document-start
// @license      magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
// @downloadURL https://update.greasyfork.org/scripts/408245/Rarbg%20Clickjack%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/408245/Rarbg%20Clickjack%20Bypass.meta.js
// ==/UserScript==



(function () {  

  window.addEventListener ('beforescriptexecute', function (e) {
    if (e.target.src.match (/\/expla\d+\.js$/)) {
      e.preventDefault ();
      e.stopPropagation ();
      window.removeEventListener (e.type, arguments.callee, true);
    }
  }, true);

}) ();