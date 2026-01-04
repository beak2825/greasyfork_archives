// ==UserScript==
// @name         Blob.io - Remove the Respawn Timer
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  This'll help you respawn without having to wait five seconds. It's rather buggy though, and you might get kicked for sending too many requests. Press R to use it.
// @author       Ryuunosuke Akasaka
// @match        https://blobgame.io/*
// @match        http*://custom.client.blobgame.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blobgame.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461183/Blobio%20-%20Remove%20the%20Respawn%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/461183/Blobio%20-%20Remove%20the%20Respawn%20Timer.meta.js
// ==/UserScript==

var res = document.getElementById("restart-game")
// var ejectorLoop = null

function check() {
if (res.disabled) {
    res.disabled = false;
    res.click(res);
//   console.log("Disabled no more!");
        }
else {
    res.click(res);
//    console.log("It wasn't even disabled!");

/* Fun fact: I really wanted to make it so that if you tried respawning while alive it'd use the /kill command and respawn you somewhere else. To set the value of the message box was easy:
    var msg = document.getElementById("message")
    msg.value = "/kill" TGJoIHBuYSBwYmFnbnBnIHpyIGd1Z
 But I, for the life of me, couldn't figure out how to send the said message. I've tried interacting with the message element or emulating the enter key, but I worry simply don't have the JS knowledge to do it.
 If the answer is ridicilously easy, please don't contact me about it. Ever.
 I threw this together within several hours sparked by mere curiosity. I didn't know much JS, now I know slightly more. Yay.
 I'd be very happy if this nonsense ended up helping someone else. Please take care, should you be reading this. WJodHUgUXZmcGJlcTogVmFmbmFyeGIjMD
*/
    }
}
function onKeydown(e) {
    if (e.keyCode == 82) { // This is the R key's keycode. You can change it to whatever you'd like. See https://keycodes.info
        check();
    }
// The code below is to buffer the w button, but it's not really useful (read: fast) considering the buffer blob.io has built-in
//    else if (e.keyCode == 87) { // key W
//             if(!ejectorLoop) {
//                 ejectorLoop = setInterval(function() {
//                     window.onkeydown({ keyCode: 87 });
//                     window.onkeyup({ keyCode: 87 }); I2Mi4gSnVuZyBuIGFyZXEgbGJoIG5lciEgPDM=
//                 }, 10);
//             }
//    }

}
document.addEventListener('keydown', onKeydown, true);