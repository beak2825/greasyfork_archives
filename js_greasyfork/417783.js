// ==UserScript==
// @name         Maxtri Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows a lot of info about the game. Press "F" to turn the display on/off.
// @author       Sopur
// @match        http://maxtri.glitch.me/
// @match        http://maxtri.ml/
// @match        http://maxtri-beta-server.glitch.me/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417783/Maxtri%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/417783/Maxtri%20Mod.meta.js
// ==/UserScript==

const gui = document.createElement("div"); document.body.appendChild(gui);

var display = true;
var Mpos = "None"; // Mouse position
var Mcords = "None"; // Mouse cords
var Ppos = "None"; // Player position
var Pnear = "False"; // Players nearby
var Kpress = "None"; // Keys pressed
var Lmove = "None"; // Last movement sent
var Lupgrade = "None"; // Last upgrade sent
var Lchat = "None"; // Last chat sent

document.addEventListener('keydown', function (event) {
    let keyCode = event.keyCode || event.which;
    if (keyCode === 70) { //F
        if (display) {
            display = false;
            window.global.chat_message.push({ content: `Display is off. Press "F" to turn it on.`, time: 500, color: 16, alphasize: 0 });
        } else {
            display = true;
            window.global.chat_message.push({ content: `Display is on. Press "F" to turn it off.`, time: 500, color: 16, alphasize: 0 });
        };
    };
});

const update = () => {
    let HTML;
    if (display) {
        HTML = `<style>
.main {
pointer-events: none; position: fixed; top: 150px; left: 50px;
font-family: 'Comic Sans MS', cursive, sans-serif;
color: #FFFFFF; font-style: normal; font-variant: normal;
}
</style>
<div class="main" id="all">
<p id="guia">Mouse position:  ${Mpos}<br><br>Player position:  ${Ppos}<br><br>Mouse cords:  ${Mcords}<br><br>Players nearby:  ${Pnear}<br><br>Keys pressed:  ${Kpress}<br><br>Last movement sent:  ${Lmove}<br><br>Last upgrade sent:  ${Lupgrade}<br><br>Last chat sent:  ${Lchat}</p></div>`
    } else {
        HTML = `<style>
.main {
pointer-events: none; position: fixed; top: 150px; left: 50px;
font-family: 'Comic Sans MS', cursive, sans-serif;
color: #FFFFFF; font-style: normal; font-variant: normal;
}
</style>
<div class="main" id="all">
<p id="guia"></p></div>`
    }
    gui.innerHTML = HTML;
};

document.addEventListener('keydown', (event) => { Kpress = event.key });
window.addEventListener('mousemove', (event) => {
    Mpos = `${event.clientX}, ${event.clientY}`;
    try {
        let X = event.clientX - (window.win_size[0] / 2);
        let Y = event.clientY - (window.win_size[1] / 2);
        let newX = Math.abs(window.netX);
        let newY = Math.abs(window.netY);
        X = Math.round(newX + X);
        Y = Math.round(newY + Y);
        Mcords = `${X}, ${Y}`;
    } catch (err) { Mcords = "None" };
});
WebSocket.prototype.qwer15 = WebSocket.prototype.send
WebSocket.prototype.send = function (data) {
    let message = new Uint8Array(data);
    if (message[0] === 5) Lupgrade = message;
    if (message[0] === 2) Lmove = message;
    if (message[0] === 1) Lchat = message;
    this.qwer15(data);
};


setInterval(() => {
    try {
        var world = JSON.stringify(window.world.entities);
        if (world.includes("name")) {
            let info = world.split('name');
            info = `{"name${info[1]}}`;
            info = `${info.split(",")[0]}}`;
            info = JSON.parse(info);
            Pnear = info.name;
        } else { Pnear = "None"; }
    } catch (err) { Pnear = "None"; };
    try {
        let X = Math.abs(window.netX);
        let Y = Math.abs(window.netY);
        Ppos = `${X}, ${Y}`;
    } catch (err) { Ppos = "None"; };
    update();
}, 50);

document.getElementById('playerKey').style.display = 'block';
