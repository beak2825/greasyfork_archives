//******************************************************** GATS:IO SCRIPT ********************************************************************/
// ==UserScript==
// @name         Gats.io - Valkyjra's Detection
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  basically just some hacks. lets ya see stuff. i didn't come up with it all tho. i put together a few other ppls scripts for convenience :)
// @author       Valkyjra
// @run-at       document-end
// @match        https://gats.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448496/Gatsio%20-%20Valkyjra%27s%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/448496/Gatsio%20-%20Valkyjra%27s%20Detection.meta.js
// ==/UserScript==


(function() {


// Zoom hack on mousewheel scrolling
window.addEventListener("wheel", function(e) {
    let dir = Math.sign(e.deltaY);
    if (dir== 1) {j7*=1.1;j8*=1.1;a1();zoom*=1.1;}
    if (dir==-1) {j7*=0.95;j8*=0.95;a1();zoom*=0.95;}
});


setTimeout(function(){
    // Shows landmines
    landMine[0].forEach((a,i)=>{landMine[0][i][1][3]="#000000"});

    // Shows camos
    setInterval(()=>{Object.keys(RD.pool).forEach((a,i)=>{
        if(RD.pool[i].ghillie){RD.pool[i].ghillie=0;RD.pool[i].invincible=1}
    })},30);

    // Shows silencers
    setInterval(()=>{Object.keys(RC.pool).forEach((a,i)=>{
        if(RC.pool[i].silenced){RC.pool[i].silenced=0}
    })},30);
}, 3000);

var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
document.getElementsByTagName('head')[0].appendChild(script);

function send() {
msg = 'lol'
RF.list[0].socket.send(`c,${msg}`)
}

document.addEventListener('keyup', (event) => {
var name = event.key;
if (name === 'e') { send();
} }, false);
})();
var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
document.getElementsByTagName('head')[0].appendChild(script);

function send() {
msg = 'lmao'
RF.list[0].socket.send(`c,${msg}`)
}

document.addEventListener('keyup', (event) => {
var name = event.key;
if (name === 'c') { send();
} }, false);
//just delete everything below this if you still want your stats to be tracked
(function() {
    'use strict';
    setInterval(() => {
        if(window.document.location.origin == 'https://gats.io') { //gats.io websocket
            if(RF.list[0].socket.readyState == 1) {
                RF.list[0].socket.send('x,1')
            }
        }
    }, 1000)
})();