// ==UserScript==
// @name         Fast split, Auto feed, Anti-AFK, Hover, and Auto-Buy
// @namespace
// @version      1
// @description idk
// @author     Vaqu
// @license      MIT
// @icon         https://i.pinimg.com/originals/99/ef/a1/99efa1359290b288482aad37e25d0d49.jpg
// @match        *://agma.io/
// @grant        none
// @namespace https://greasyfork.org/users/469080
// @downloadURL https://update.greasyfork.org/scripts/487137/Fast%20split%2C%20Auto%20feed%2C%20Anti-AFK%2C%20Hover%2C%20and%20Auto-Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/487137/Fast%20split%2C%20Auto%20feed%2C%20Anti-AFK%2C%20Hover%2C%20and%20Auto-Buy.meta.js
// ==/UserScript==



// Push = "7"
// Rec = "8"
// Anti-Rec = "9"
// Anti-Freeze = "0"
// Frozen Virus = "-"

(function() {
    'use strict';
window.addEventListener('keydown', function(event)
    {
        if (document.getElementById('overlays').style.display != 'none' || document.getElementById('advert').style.display != 'none') {
            return;
        }
        if (document.activeElement.type == 'text' || document.activeElement.type == 'password') {
            return;
        }

        if (event.keyCode == 55) {
            document.getElementsByClassName("purchase-btn confirmation")[3].click();
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},500);
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},1500);
        };

    if (event.keyCode == 56) {
            document.getElementsByClassName("purchase-btn confirmation")[0].click();
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},500);
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},1500);
        };

    if (event.keyCode == 57) {
            document.getElementsByClassName("purchase-btn confirmation")[12].click();
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},500);
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},1500);
        };
      if (event.keyCode == 48) {
            document.getElementsByClassName("purchase-btn confirmation")[13].click();
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},500);
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},1500);
        };
     if (event.keyCode == 189) {
            document.getElementsByClassName("purchase-btn confirmation")[14].click();
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},500);
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},1500);
        };
})





var key = "r" // Normal
var key2 = "t" // Double
var key3 = "k" // Macro
var doubleSplitKey
var keyMacroFeed
var freezeKey
var startFeed, intervalInSec = 2;

window.addEventListener('keydown', keydown);

setTimeout(function() {
    key = key.charCodeAt(0)
    key2 = key2.charCodeAt(0)
    doubleSplitKey = document.getElementById("keyDoubleSplit").innerHTML.charCodeAt(0)
    freezeKey = document.getElementById("keyFreezeSelf").innerHTML.charCodeAt(0)
    keyMacroFeed = document.getElementById("keyMacroFeed").innerHTML.charCodeAt(0)
    console.log("Fastsplit Script active.")
}, 5000)

function oneSplit() {
    $("#canvas").trigger($.Event("keydown", { keyCode: 32}));
    $("#canvas").trigger($.Event("keyup", { keyCode: 32}));
    console.log("oneSplit");
}



function freeze() {
    $("#canvas").trigger($.Event("keydown", { keyCode: freezeKey}));
    $("#canvas").trigger($.Event("keyup", { keyCode: freezeKey}));
    console.log("freeze");
}

function macro(){
$("#canvas").trigger($.Event("keydown", { keyCode: keyMacroFeed}));
    $("#canvas").trigger($.Event("keyup", { keyCode: keyMacroFeed}));
    console.log("'macro")

}


function keydown(event) {
    if (event.keyCode == 820) {
        oneSplit()
        setTimeout(freeze, 50)
        setTimeout(freeze, 120)
        console.log("Fastsplit")
    }

}



const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const status = { paused: false };
const press = (k) => (window.onkeydown({ keyCode: k }), window.onkeyup({ keyCode: k }))
const go = async () => {
    press(82);
    await sleep(52);
    press(70);
    await sleep(52);
    press(70);
};


document.addEventListener('keydown', async ({ code }) => {
    if (code === 'F7') status.paused = !status.paused;
    if (code === 'KeyY' && ctrlKey) document.removeEventListener('keydown', go);
    if (code === 'KeyD' && !status.paused) go();
});


const bsleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bstatus = { paused: false };
const bpress = (k) => (window.onkeydown({ keyCode: k }), window.onkeyup({ keyCode: k }))

const bgo = async () => {



setInterval (function(){
   bpress(78);


},1000)





};

document.addEventListener('keydown', async ({ code }) => {
    if (code === 'F7') bstatus.paused = !bstatus.paused;
    if (code === 'KeyY' && ctrlKey) document.removeEventListener('keydown', bgo);
     if (event.keyCode == 120 && !bstatus.paused) bgo();






});

const csleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cstatus = { paused: false };
const cpress = (k) => (window.onkeydown({ keyCode: k }), window.onkeyup({ keyCode: k }))

const cgo = async () => {

    setInterval (function(){
   cpress(75);
      csleep(10000);

},1000)



};

document.addEventListener('keydown', async ({ code }) => {
    if (code === 'F7') cstatus.paused = !cstatus.paused;
    if (code === 'KeyY' && ctrlKey) document.removeEventListener('keydown', bgo);
     if (code === 'F2' && !cstatus.paused) cgo();


});


})();