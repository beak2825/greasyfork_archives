// ==UserScript==
// @name         iFrame Remover (REQUIRES JQuery)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  tries to remove iframes on certain sites that are in the "@match" bar, it removes or tries to remove all iframes every 100 milliseconds so may cause lag or preformance drops on lowerend PCs you can change this by editting the sript by changing the "iT" variable
// @author       Literally-Anyone-Can-Edit-And-Repost-This-So-Be-Careful-With-Tampermonkey-Scripts-Please

// @match        *://*.offmp3.com/*

// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408671/iFrame%20Remover%20%28REQUIRES%20JQuery%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408671/iFrame%20Remover%20%28REQUIRES%20JQuery%29.meta.js
// ==/UserScript==

/*
The iT Variable will ALWAYS be in milliseconds so 1000 milliseconds is equal to 1 second and 2000 is equal to 2 seconds etc. by doing 100 this process repeats itself every tenth of a second
so the faster this script repeats the more cpu power it will take
*/
var iT = 100;

setInterval(function(){ $('iframe').remove() }, iT);