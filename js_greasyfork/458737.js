// ==UserScript==
// @name         Old Timey Blaball
// @namespace    blaseball
// @version      1.4
// @description  finally... audio in blaseball
// @author       Myno
// @match        https://www.blaseball.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blaseball.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458737/Old%20Timey%20Blaball.user.js
// @updateURL https://update.greasyfork.org/scripts/458737/Old%20Timey%20Blaball.meta.js
// ==/UserScript==

(function() {
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    sleep(1500).then(() => {
    'use strict';
    var music = [
"The Entertainer","Maple Leaf Rag","Frogs Legs Rag","Onion Capers","Le Grand Chase","Wagon Wheel","Lively Lumpsucker","Hyperfun","Run Amok","Fun in a Bottle","Batty McFaddin","Amazing Plan","Iron Horse","Merry Go","Villainous Treachery"
    ];
    music = music.concat(
`Comic Plodding
Keystone Deluge
Water Droplets on the River
Barroom Ballet
Breaktime
Doh De Oh
Five Card Shuffle
Gold Rush
Hammock Fight
Hand Trolley
Heroic Reception
Look Busy
Mr. Mealey's Mediocre Machine
Olde Timey
Plucky Daisy
Aunt Tagonist
Circus Waltz
Comic Hero
Evil Plan
Friendly Day
Mister Exposition
Royal Banana
Super Circus
The Bandit
The Chase
Trouble
Waltz of Treachery
Work is Work
Piano Cue One`.split("\n"));

        var css = "audio { display: inline; position: absolute; top:0; left: 0;}"
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
        var pag = Math.floor(Math.random()*music.length);
    var btn = document.createElement("audio");
    var src = music[pag];
    btn.src = "https://incompetech.com/music/royalty-free/mp3-royaltyfree/"+encodeURIComponent(src)+".mp3";
        btn.controls = true;
        btn.autoplay = true;
        btn.id = "silentfilmaudio"
    document.querySelector(".ticker__scroll").after(btn);
    var btnirl = document.querySelector("#silentfilmaudio");

    btnirl.addEventListener('ended', (event) => {
        pag = (pag + 1)%music.length;
        btnirl.src = "https://incompetech.com/music/royalty-free/mp3-royaltyfree/"+encodeURIComponent(music[pag])+".mp3";
    });

    var mainctnt = document.querySelector(".main__contents");

})})();