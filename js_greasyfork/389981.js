// ==UserScript==
// @name         jez skin
// @namespace    http://tampermonkey.net/
// @version      69.0
// @description  ...jezevec10 is typing...
// @author       meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389981/jez%20skin.user.js
// @updateURL https://update.greasyfork.org/scripts/389981/jez%20skin.meta.js
// ==/UserScript==

(function() {
    'use strict';

 window.addEventListener('load', function(){
        //Jstris Custom Background Image
        
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://imgur.com/J6pEmAJ.png')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";
        

        //skin with garbage blocks and no blur
        loadSkin("https://i.imgur.com/myLr2s7.png",32);

        //no garbage blocks, blurred
        //loadSkin("https://i.imgur.com/lqCSHcx.jpg",44);
 });
})();