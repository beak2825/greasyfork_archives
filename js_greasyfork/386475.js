// ==UserScript==
// @name         Original Theme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  First theme I made
// @author       Eddie
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/386475/Original%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/386475/Original%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){
        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/3t6lTZy.jpg')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/GPvbGtc.png",32);
        loadGhostSkin("https://i.imgur.com/OvH7LA4.png",36);
    });
})();