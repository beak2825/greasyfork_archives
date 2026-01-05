// ==UserScript==
// @name         Hackintosh Adnix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove ads and donation begging.
// @author       Prideslayer
// @match        https://www.hackintosh.zone/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27687/Hackintosh%20Adnix.user.js
// @updateURL https://update.greasyfork.org/scripts/27687/Hackintosh%20Adnix.meta.js
// ==/UserScript==

// License:  BSD 2-clause.  Do what you want with it.

// Self-calling anonymous function to remove offensive things.  Called every 100ms.
// Note to Hackintosh.zone admins/webmasters:  Be less obnoxious about your anti-adblock stance.
(function(){
    // do some stuff
  $('.adsbygoogle').remove();
  $("iframe[src*='donate'").parent().remove();
  setTimeout(arguments.callee, 100);
})();

