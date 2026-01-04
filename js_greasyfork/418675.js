// ==UserScript==
// @name        ismycomputeron.com spoofer
// @namespace   http://hackage.xyz
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @match       *://ismycomputeron.com/*
// @grant       none
// @version     1.0
// @author      hackage
// @description your computer is no longer on.
// @downloadURL https://update.greasyfork.org/scripts/418675/ismycomputeroncom%20spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/418675/ismycomputeroncom%20spoofer.meta.js
// ==/UserScript==

window.main = function() {
  $("font").html("NO");
}

main();