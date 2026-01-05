// ==UserScript==
// @name         Zooby's Custom Macros
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  This is a script made by Zooby Agario YT for all his subscribers to use.
// @author       Zooby Agario
// @icon         http://i.imgur.com/undefined.png
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @run-at       document-end
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/24318/Zooby%27s%20Custom%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/24318/Zooby%27s%20Custom%20Macros.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);//( ͡° ͜ʖ ͡°)
window.addEventListener('keyup', keyup);
var Feed = false;//( ͡° ͜ʖ ͡°)
var Dingus = false;
var speed = 25;
document.getElementById("instructions").innerHTML = null;
document.getElementById("advertisement").innerHTML = "<center>This Extension was made by Zooby Agario .<br> To Tricksplit Press <b> Shift </b> <br> To Triplesplit Press <b>  E  </b> <br> To Doublesplit Press <b> Q </b> <br> To Macro Feed Press And Hold<b> W </b></center>";

//document.getElementById("mainPanel").innerHTML += "<center><span class='agario-panel'><span style='background-color:#A0322E'></span></center>";
load();
function load() {
   
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";//( ͡° ͜ʖ ͡°)
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
        // I changed the above because now agario 'remembers' your preferences, but doesn't actually work, so if they're already set to be true, you need to undo it, then re click to true
    } else {
        setTimeout(load, 100);
    }
  
} 
function keydown(event) {
    if (event.keyCode == 87) {
        Feed = true;
        setTimeout(MacroFeed, speed);
    } // Tricksplit
    if (event.keyCode == 16 || event.keyCode == 52) { //( ͡° ͜ʖ ͡°)
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    } // Triplesplit
    if (event.keyCode == 69 || event.keyCode == 83) {
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
    } // Doublesplit
    if (event.keyCode == 81 || event.keyCode == 50) {
        split();
        setTimeout(split, speed);
    } // Split
    if (event.keyCode == 49) {
        split();
    }
   if (event.keycode == 79)
   {
    X = window.innerWidth / 2;
    Y = window.innerHeight / 2;
    $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
   }
   if (event.keycode == 80)
   {
      X = window.innerWidth / 2;
      Y = window.innerHeight / 2.006;
      $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
     
}
} // When Player Lets Go Of W, It Stops Feeding( ͡° ͜ʖ ͡°)
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With W
function MacroFeed() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(MacroFeed, speed);
    }
}
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
//Sketchy Beans ( ͡° ͜ʖ ͡°)