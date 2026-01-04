// ==UserScript==
// @name         Delete Youtube [Prank]
// @namespace    www.youtube.com/
// @version      v1.7
// @run-at       document-end
// @description  Want to delete your friends whole youtube go ahead just run this javascript and let the magic begin
// @author       Tony Hossam
// @match        *://*.youtube.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389384/Delete%20Youtube%20%5BPrank%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/389384/Delete%20Youtube%20%5BPrank%5D.meta.js
// ==/UserScript==
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

// == Might Look Like Small Lines That Are AffectLes But Actully Delete Most Of YOUTUBE!
// == You Can Fix By Disabling The Script Using Tampermonkey!
// == Not A Virus Not A Malware If You Want Check VirusTotal!
