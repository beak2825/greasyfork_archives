// ==UserScript==
// @name        Redirects fragrantica.fr to fragrantica.com
// @namespace   fragrantica
// @match       *://*fragrantica.fr/*
// @grant       none
// @version     1.1
// @author      Skander
// @description Very simple script that redirects fragrantica.fr to fragrantica.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446447/Redirects%20fragranticafr%20to%20fragranticacom.user.js
// @updateURL https://update.greasyfork.org/scripts/446447/Redirects%20fragranticafr%20to%20fragranticacom.meta.js
// ==/UserScript==

window.location.href = "https://fragrantica.com/" + window.location.pathname;