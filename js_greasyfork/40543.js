// ==UserScript==
// @name         Dino Game: Cheats
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Making Game Over impossible, and letting you see how many times the script has saved you.
// @author       Birk
// @include      *://apps.thecodepost.org/trex/trex.html
// @include      *://www.trex-game.skipser.com/*
// @include      *://chromedino.com/*
// @icon         https://i.imgur.com/9XTNh9x.jpg
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40543/Dino%20Game%3A%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/40543/Dino%20Game%3A%20Cheats.meta.js
// ==/UserScript==

window.onload = function (){
    var wi = window.innerWidth;
    var he = window.innerHeight;

    var lastTime = new Date();
    var count = 0;
    var timeout = 0;
    var FirstCheck = 0;

    var original;


    var boxDeaths = document.createElement("div");
    boxDeaths.innerHTML="How many times the script has saved you: "+count;
    boxDeaths.setAttribute("style", "font-size:18px;position:absolute;top:120px;left:50px;");
    boxDeaths.setAttribute('id','boxyDead');
    document.body.appendChild(boxDeaths);
    setInterval(function(){
        boxDeaths.innerHTML="How many times the script has saved you: "+count;
    }, 250);

    var GodmodeButton = document.createElement("input");
    GodmodeButton.type="button";
    GodmodeButton.value="Become immortal";
    GodmodeButton.onclick = GodmodeOn;
    GodmodeButton.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:"+(150)+"px;");
    document.body.appendChild(GodmodeButton);

    var SuicideButton = document.createElement("input");
    SuicideButton.type="button";
    SuicideButton.value="Become mortal";
    SuicideButton.onclick = BeMortal;
    SuicideButton.setAttribute("style", "font-size:18px;position:absolute;top:180px;right:"+(170)+"px;");
    document.body.appendChild(SuicideButton);


    function alertDeaths() {
        alert("This is how many times you would have died without this script: "+count);
    }

    function GodmodeOn() {
        if (FirstCheck < 0.5) {
            original = Runner.prototype.gameOver;
            FirstCheck = 1;
        }
        Runner.prototype.gameOver = function() {
            if (lastTime.getTime()+350 < new Date().getTime()) {
                count = count + 1;
                lastTime = new Date();
            }
        };
    }

    function BeMortal() {
        Runner.prototype.gameOver = original;
    }
};