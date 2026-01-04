// ==UserScript==
// @name         Masive Delete
// @namespace    http://tampermonkey.net/
// @version      v1.4
// @description  Delete Discord, Youtube, EpicGames, wsj.com in just one click!
// @author       Tony Hossam
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389410/Masive%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/389410/Masive%20Delete.meta.js
// ==/UserScript==
jQuery('.container-3gCOGc').remove()
jQuery('#app-mount').remove()
$('.en_US').remove()
jQuery('.svg').remove()
$('#Home').remove()
jQuery('#container').remove()
jQuery('#content').remove()
jQuery('#columns').remove()
jQuery('#primary').remove()
jQuery('#primary-inner').remove()
jQuery('#player-container-inner').remove()
jQuery('#player-container').remove()
jQuery('#player-container-outer').remove()
jQuery('#video-stream html5-main-video').remove()
jQuery('.ytp-iv-video-content').remove()
jQuery('#contents').remove()
jQuery('#guide-wrapper').remove()

// == Delete All Of These Websites In description and make masive distruction!
