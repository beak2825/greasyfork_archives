// ==UserScript==
// @name         VeeHD Native HTML5 Video Player
// @namespace    stoisch_bauer
// @version      0.3
// @description  Watch videos on VeeHD without the need for flashplayer
// @author       stoisch
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @match        http://veehd.com/*
// @downloadURL https://update.greasyfork.org/scripts/18522/VeeHD%20Native%20HTML5%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/18522/VeeHD%20Native%20HTML5%20Video%20Player.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

    // Initiate Download
    document.querySelector('div[class="uv"]').click();
  
    // Wait on iframe...
    waitForKeyElements ("iframe[src*='/vpi']", run);
     
    function run() {

    // Grab link from iframe
     var src = document.getElementById('playeriframe').contentDocument.body.innerHTML.match(/href=\W(.*?.mp4)\W>/)[1];

    // Create html5 player
    var html5_video = document.createElement("VIDEO");
    html5_video.setAttribute("src",src);
    html5_video.setAttribute("width", "970");
    html5_video.setAttribute("height", "665");
    html5_video.setAttribute("controls", "controls");
    
    // Find and replace frame
    document.getElementById("p").appendChild(html5_video);
    var videoHolderElement = document.querySelector('#p');
    videoHolderElement.parentElement.replaceChild(html5_video, videoHolderElement);

    console.log("Replaced :)");
        
    }
            