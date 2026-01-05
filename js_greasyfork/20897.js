// ==UserScript==
// @name        Slither.io auto respawn (evergreen)
// @namespace   slitherioautorespawn
// @description Auto Respawn + Server Selector + Skin Rotator + Unlimited Zoom + No Skin + No BG + Reduce Lag + More!
// @version     2.2
// @author      condoriano
// @icon        http://i.imgur.com/6NJONsZ.png
// @include     http://slither.io/*
// @include     https://slither.io/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20897/Slitherio%20auto%20respawn%20%28evergreen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20897/Slitherio%20auto%20respawn%20%28evergreen%29.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = document.location.protocol+"//greasyfork.org/scripts/20966-slitheriomod/code/slitheriomod.js";
(document.body || document.head || document.documentElement).appendChild(script);
