// ==UserScript==
// @name         Autoplay Next Episode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds an auto-play feature to WCO.tv
// @author       You
// @match        https://www.wco.tv/*
// @match        https://www.wcoanimedub.tv/*
// @match        https://www.wcoanimesub.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wco.tv
// @grant        none
// @license      mit
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445042/Autoplay%20Next%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/445042/Autoplay%20Next%20Episode.meta.js
// ==/UserScript==

// This uses videojs player, so we'll hook into it.
// vp = video player

(function() {
    'use strict';
    //Constants for Broadcast messages
    const NEXT_EPISODE = 'NEXT-EPISODE'

    //Detecting the current window
    let vp = window.vp
    if(window.location.pathname === "/inc/embed/video-js.php"){
        //Operates on the player page
        mainPlayer();
    } else {
        //Operates on the main site
        mainWCO();
    }

    function mainPlayer(){
        const broadcast = new BroadcastChannel('wco-autoplay');
        vp.play();
        vp.one('play',()=>{
            try{
                vp.requestFullscreen();
            } catch(e){
                console.error(e)
            }
        })
        vp.on('ended',()=>{
            broadcast.postMessage(NEXT_EPISODE);
        })
    }


    function mainWCO(){
        const broadcast = new BroadcastChannel('wco-autoplay');
        const nextButton = document.querySelector('a[rel="next"]');
        broadcast.addEventListener('message', event =>{
            if(event.data == NEXT_EPISODE){
                console.log("Click the button Kronk!")
                nextButton.click();
            }
        })
    }
})();