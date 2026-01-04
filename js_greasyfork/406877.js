// ==UserScript==
// @name         Anti-Autoplay on Twitch
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Disable Autoplay on Twitch's Homepage
// @author       me
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406877/Anti-Autoplay%20on%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/406877/Anti-Autoplay%20on%20Twitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //some issues when homeOnly is false
    var homeOnly = true;
    var video = null;

    //https://stackoverflow.com/a/52809105----
    /* These are the modifications: */
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });
    //---------------------------------------

    const disableAutoplay = () => {
        if(interval != null){
            clearInterval(interval);
        }
        if((homeOnly == true && window.location.href == "https://www.twitch.tv/") || homeOnly == false){
            var interval = setInterval(() => {
                //this avoid pause of popup video
                if((video = document.querySelector("div[data-a-player-type='frontpage'] video,div[data-a-player-type='site'] video, div[data-a-player-type='channel_home_carousel'] video")) != null){
                    video.addEventListener("play", () => {
                        video.pause();
                    }, {once: true});
                    clearInterval(interval);
                }
            },100);
        }
    }

    //intercept url navigation by ajax
    window.addEventListener('locationchange', disableAutoplay);

    //intercept autoplay to the closure of popup
    window.addEventListener('load',()=>{
        new MutationObserver(disableAutoplay).observe(
            document.querySelector(".ReactModalPortal"),
            {childList: true}
        )
    });

    disableAutoplay();
})();