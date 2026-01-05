// ==UserScript==
// @name         OMS disable timeout
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Disables 30 seconds timer and removes ad banners on ru.onlinemschool.com (use with Ublock Origin or Adblock Plus)
// @author       hant0508
// @include      http://ru.onlinemschool.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26767/OMS%20disable%20timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/26767/OMS%20disable%20timeout.meta.js
// ==/UserScript==

function f ()
{
  oms.ads = true;
  oms.ads_detected = function(){return true;};
  oms.ads_detect = function(){return true;};
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ f +')();'));
document.body.appendChild(script);
