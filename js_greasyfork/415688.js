// ==UserScript==
// @name         YouTubeNeverSleeps
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  Disable video breaks. Disable youtube pause button. Auto confirm No Thanks Sign In to YouTube.
// @author       gabriel.dina@cloudromania.ro
// @match        https://greasyfork.org/en/scripts/381682-html5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415688/YouTubeNeverSleeps.user.js
// @updateURL https://update.greasyfork.org/scripts/415688/YouTubeNeverSleeps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Beaware! YouTube never sleeps!");

    setInterval(function() {
        
        //click No Thanks, Yes
        document.querySelectorAll('[aria-label="No thanks"], [aria-label="Yes"]').forEach( function(element) { if (element.offsetParent != null) element.click() } )
        
        //press play if paused for any other reason 
        if(document.querySelector('video').paused == true)
        {
            document.querySelector('video').play();
        }
    }, 1000);

})();