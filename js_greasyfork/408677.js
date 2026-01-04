// ==UserScript==
// @name         Agar.io but AD-Less UI
// @version      Does it matter?
// @description  try to take over the world! or at-least the agar plate.
// @author       Cepryx
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @match        *://*.agar.io/*
// @namespace https://greasyfork.org/users/675767
// @downloadURL https://update.greasyfork.org/scripts/408677/Agario%20but%20AD-Less%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/408677/Agario%20but%20AD-Less%20UI.meta.js
// ==/UserScript==

var iT = 3000;

setInterval(function(){ $("#mainui-ads").remove(); }, iT);
setInterval(function(){ $("#mainui-promo").remove(); }, iT);
setInterval(function(){ $("#adsTop").remove(); }, iT);
setInterval(function(){ $("#adsBottom").remove(); }, iT);
setInterval(function(){ $("#adsLeft").remove(); }, iT);
setInterval(function(){ $("#adsRight").remove(); }, iT);
setInterval(function(){ $("#mainui-offers").remove(); }, iT);