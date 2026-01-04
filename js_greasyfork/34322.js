// ==UserScript==
// @name         Jstris Mods
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34322/Jstris%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/34322/Jstris%20Mods.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function(){
        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://media.discordapp.net/attachments/360554528556449795/361706190406680576/d29d4205-1f9e-4c85-8a5b-3f573e55b5f4.png')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0.8)";
        document.getElementById("app").style.height="1000px";

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/G6WbXoD.png",32);
    });
})();