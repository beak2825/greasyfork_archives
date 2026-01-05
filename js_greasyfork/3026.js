// ==UserScript==
// @name           The Daily Show and Colbert Report 4 aliens
// @namespace      armeagle.nl
// @description    Enables playback of The Daily Show and the Colbert Report outside of the USA
// @include        http://www.thedailyshow.com/*
// @include        http://www.colbertnation.com/*
// @author         ArmEagle
// @version 0.0.1.20140705065008
// @downloadURL https://update.greasyfork.org/scripts/3026/The%20Daily%20Show%20and%20Colbert%20Report%204%20aliens.user.js
// @updateURL https://update.greasyfork.org/scripts/3026/The%20Daily%20Show%20and%20Colbert%20Report%204%20aliens.meta.js
// ==/UserScript==

/*
 * This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License by Alex Haan (http://creativecommons.org/licenses/by-nc-sa/3.0/)
 */

setTimeout(function() {

var obj_player = document.getElementById('video_player');

obj_player.setAttribute('data', obj_player.getAttribute('data').replace('video:thedailyshow.com:','item:comedycentral.com:').replace('episode:thedailyshow.com:', 'item:comedycentral.com:').replace('episode:colbertnation.com:', 'item:comedycentral.com:'));

}, 100);