// ==UserScript==
// @name         region changer/decoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  press L and region shows, buttons for changing regions
// @author       el bismut
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/437993/region%20changerdecoder.user.js
// @updateURL https://update.greasyfork.org/scripts/437993/region%20changerdecoder.meta.js
// ==/UserScript==

//NOT MY CODE
const gui = document.createElement("div");
document.body.appendChild(gui);
gui.outerHTML = `
<div class='parent' id='menu' style='user-select:none; position:fixed; top:15%; left:1%; text-align:center; width:7.5vw; font-family:Ubuntu; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'>
    <div class='child' style='line-height:2vh; opacity:75%'>
        [Z] toggle menu
        <hr>
    </div>
    <button class='child' type='button' id='button1' value='off' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#E69F6C; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
    <button class='child' type='button' id='button2' value='off' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#FF73FF; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
    <button class='child' type='button' id='button3' value='off' style='width:7.5vw; height:3vh; font-family:Ubuntu; opacity:75%; background:#C980FF; color:#FFFFFF; font-style:normal; font-size:0.9vw; text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'></button>
</div>
`;
addButtonListener('button1');
addButtonListener('button2');
addButtonListener('button3');
document.getElementById('button1').innerHTML = 'Frankfurt';
document.getElementById('button2').innerHTML = 'New York';
document.getElementById('button3').innerHTML = 'San Francisco';
function addButtonListener(id) {
    document.getElementById(id).addEventListener("click", function() {buttonAction(id)});
    document.getElementById(id).addEventListener("mouseenter", function() {lightenColor(id)});
    document.getElementById(id).addEventListener("mouseleave", function() {resetColor(id)});
}
function lightenColor(id) {
    document.getElementById(id).style.opacity = '100%'
}
function resetColor(id) {
    document.getElementById(id).style.opacity = '75%'
}
function buttonAction(id) {
    let button = document.getElementById(id);
    if (id == 'button1') sessionStorage.serverIP = regions.fra;
    else if (id == 'button2') sessionStorage.serverIP = regions.nyc;
    else if (id == 'button3') sessionStorage.serverIP = regions.sfo;
    window.input.execute("lb_reconnect");
}
document.body.onkeydown = function(e) {
    if (e.keyCode === 90) {
        var menu = document.getElementById('menu');
        if (menu.style.display === "none") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    }
}
//original content
var region = '';
var regions = {
    nyc: "wss://90f7e76e-d565-4f97-827e-107ac0da79ac-80.lobby.do-nyc.hiss.io:443",
    sfo: "wss://3960a75e-af83-4e90-8c7a-f7b5c14ffa4a-80.lobby.do-sfo.hiss.io:443",
    fra: "wss://9e0236be-7f66-47ef-a5da-d1dfa9982485-80.lobby.do-fra.hiss.io:443"
}
function serverConnectHook(server) {
    console.log(server);
    sessionStorage.serverIP = server;
    region = server.slice(55,58);
}
window.forceregion = function(a) {
    if (a.length > 2 && ('frankfurt').includes(a)) sessionStorage.serverIP = regions.fra;
    else if (a === 'nyc' || ('new york city').includes(a)) sessionStorage.serverIP = regions.nyc;
    else if (a === 'sfo' || ('san francisco').includes(a)) sessionStorage.serverIP = regions.sfo;
    window.input.execute("lb_reconnect");
}
window.WebSocket = new Proxy(WebSocket, {construct(t, args) {serverConnectHook(sessionStorage.serverIP || args[0]); return Reflect.construct(t, args)}});
CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(fillText, ctx, [text, x, y, ...blah]) {
        if(text.includes("ms") && text.includes(".")) {
            text = region + " " + text;
        }
        fillText.call(ctx, text, x, y, ...blah);
    }
});
CanvasRenderingContext2D.prototype.strokeText = new Proxy(CanvasRenderingContext2D.prototype.strokeText, {
    apply(strokeText, ctx, [text, x, y, ...blah]) {
        if(text.includes("ms") && text.includes(".")) {
            text = region + " " + text;
        }
        strokeText.call(ctx, text, x, y, ...blah);
    }
});