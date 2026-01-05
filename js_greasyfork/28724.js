// ==UserScript==
// @name         EfficientPVR
// @namespace    http://tampermonkey.net/
// @version      1
// @description  disables those annoying ass popup ads and gives you a str8 up video for vrporn-xxx and openload shits.
// @author       You
// @match        http://vr-pornxxx.com/*/
// @include      /^(https?:)?\/\/openload\.co\/*.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28724/EfficientPVR.user.js
// @updateURL https://update.greasyfork.org/scripts/28724/EfficientPVR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    if(window.location.href.indexOf("openload") != -1)
    {
        document.getElementsByClassName("vjs-big-play-button")[0].click();
    } else {
    var button = document.getElementsByClassName("more-categories-b lucky_post_btn")[0];
    
    document.getElementsByClassName("thr-rcol adsright")[0].innerHTML = "ad fucked";
    var player = document.getElementsByTagName("iframe")[0];
    
    button.innerHTML = "<span>efficientpvr!</span>";
    copyToClipboard(player.src);
    
    function copyToClipboard(text) {
        window.prompt("efficientpvr fucked this site xDDDDD", text);
    }
    
     window.adblock=false;
    window.adblock2=false;
    window.turnoff=true;

        
    }
})();