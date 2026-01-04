// ==UserScript==
// @name         Messana.org restore background music
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  remember to enable autoplay!
// @author       blazor67
// @match        messana.org
// @match        www.messana.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392032/Messanaorg%20restore%20background%20music.user.js
// @updateURL https://update.greasyfork.org/scripts/392032/Messanaorg%20restore%20background%20music.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{
    let m = document.querySelector("bgsound");
    let a = document.createElement("audio");
    let s = document.createElement("source");

    //console.log(m);

    a.autoplay = true;
    a.loop = true;
    //a.controls = true;
    s.src = m.getAttribute("src");
    s.type="audio/mpeg";

    document.body.appendChild(a);
    a.appendChild(s);
    //a.play();
    console.log("Now playing: ", m.getAttribute("src"));
    } catch(exception){
        console.log("Errore: nessun audio da riprodurre.");
    }
})();