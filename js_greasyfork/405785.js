// ==UserScript==
// @name         Auto Scroll
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://*moomoo.io/*
// @match        http://*moomoo.io/*
// @match        https://*sandbox.moomoo.io/*
// @match        http://*sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405785/Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/405785/Auto%20Scroll.meta.js
// ==/UserScript==

$('#menuContainer').append('~R̸̡͈̞͖̹̜̈̿̀̀ḁ̶̸̧͔̬̠̼̅͗͋̑̆̉̉̓̋̍̀͗̎̏̒͘͝i̴̝͉̺̙̹͑̽̀̎̀̊̓̚̕̕ń̴̛͍̲̫́̄̅͋͘͜͝b̷͙̭̳̦̦͝ơ̸̢̨̘̮̳̖̼̟̳̔͛̑͑̿̊̍͘ͅw̸͖͙̦͇̝̗̑̏͒͝ M̶̛͉̹̙͓͇̀̿̈̕͝ơ̸̢̨̘̮̳̖̼̟̳̔͛̑͑̿̊̍͘ͅḑ̷͚̥̤̮̯̂̔͐̋̿̓̂ͅ~ Made by BoT#5858')

$("#youtuberOf").css({display: "none"});
let newImg = document.createElement("img");
newImg.src = "https://gifdownload.net/wp-content/uploads/2020/03/rainbow-glitter-gif-1.gif";
newImg.style = `position: absolute; top: 15px; left: 15px; z-index: 100000; width: 50px; height: 50px; cursor: pointer;`;
document.body.prepend(newImg);

newImg.addEventListener("click", () => {
    let w = window.open("https://discord.gg/mMGQ8d", null, `height=650, width=1199, status=yes, toolbar=no, menubar=no, location=no`);
});



(function() {
    'use strict';
    var SoreHolder = document.getElementById('storeHolder');
        SoreHolder.scrollTop = 0;
document.addEventListener('keydown', function(e) {
    if( e.keyCode === 89 ){ // y
        SoreHolder.scrollTop = 1200;
        console.log("r is pressed and solieder is on");
    };
    if( e.keyCode === 90){// z
        SoreHolder.scrollTop = 2100;
        console.log("y is pressed and tank is on");
    };
    if( e.keyCode === 70){// f
        SoreHolder.scrollTop = 1900;
        console.log("2 is pressed and samurai is on");
    };
    if( e.keyCode === 67){// c
        SoreHolder.scrollTop = 1850;
        console.log("v is pressed and turret is on");
    };
    if( e.keyCode === 86){// v
        SoreHolder.scrollTop = 1450;
        console.log("space is pressed and bull is on");
    };
})
})();