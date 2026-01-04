// ==UserScript==
// @name         Moomoo sound
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  lol sound when u kill jajaja
// @author       Flappy
// @match        *://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @match        *abc.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388478/Moomoo%20sound.user.js
// @updateURL https://update.greasyfork.org/scripts/388478/Moomoo%20sound.meta.js
// ==/UserScript==

(function() {
    'use strict';

//var NSE = document.createElement("audio");
//NSE.src = "https://dl.dropbox.com/s/1wot3ej8ajmx8eb/NOOB-SOUND EFFECT!!!!!.mp3";

    //xD
//var ezsound = new Audio("https://dl.dropbox.com/s/wkmc2c31vtvw1qq/Ben%20Says%20EZ%20Sound%20Effect.mp3");
  var ezsound = new Audio("https://dl.dropbox.com/s/rpz3ec77pe17ehe/LOL%20sound%20effect.mp3");

var kills = 0;

setInterval(getkills, 100);

function getkills(){
    var count = parseInt(document.getElementById("killCounter").innerText);
    if(count > kills){
	ezsound.play();
    }
    kills = count;
}
})();