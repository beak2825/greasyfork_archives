// ==UserScript==
// @name         Maxtri Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Maxtri mod that allows you to use bots.
// @author       Sopur
// @match        http://maxtri.glitch.me/
// @match        http://maxtri.ml/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/416159/Maxtri%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/416159/Maxtri%20Tool.meta.js
// ==/UserScript==



/*

 || CHANGE LOG ||

 # Fixed sometimes not connecting to the server.
 # Decreased server connecting times.
 # Improved GUI.
 # Fixed Mouse Mode: To Tank.

*/



/* SERVER HADNLER */
var loadingBar = document.createElement("div"); document.body.appendChild(loadingBar);
const serverURL = "ws://maxtritool.glitch.me/";
const server = new WebSocket(serverURL);
const token = localStorage.getItem('SopurToken');
var connecting = true;
const loading = (onoff) => {
  switch (onoff) {
    case 0: BbarText.innerHTML = "Maxtri Tool"; break;
    case 1: BbarText.innerHTML = "Connecting to servers..."; break;
    case 2: BbarText.innerHTML = "Disconnected."; break;
  };
};
const connect = () => {
  if (localStorage.getItem('SopurToken') === null) {
    let token = "";
    let letters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    let realLength = letters.length - 1;
    for (let i = 0; i < 20; i++) token += letters[(Math.round(Math.random() * realLength))];
    localStorage.setItem('SopurToken', token);
    if (server.readyState === WebSocket.OPEN) server.send(`{"AddToken": "${token}"}`);
    location.reload();
  } else { if (server.readyState === WebSocket.OPEN) server.send(`{"ping": "${token}"}`) };
}
const resetToken = () => {
  loading(2);
  localStorage.removeItem('SopurToken');
  setTimeout(() => { location.reload(); }, 1000);
};
/* MOUSE HANDLER */
var lastmouseX = 0;
var lastmouseY = 0;
window.addEventListener('mousemove', function (event) {
  lastmouseX = event.clientX;
  lastmouseY = event.clientY;
});
const getMousePos = () => {
  let X = lastmouseX - (win_size[0] / 2);
  let Y = lastmouseY - (win_size[1] / 2);
  let newX = Math.abs(netX);
  let newY = Math.abs(netY);
  X = Math.round(newX + X);
  Y = Math.round(newY + Y);
  return { X, Y };
};
/* GLOBAL VARS */
const ver = 1.0;
var role = 1;
var fire = 0;
var clientFire = 0;
var dir = 0;
var movedir = 0;
var fireL = "Off";
var roleL = "Master";
var dirL = "To Mouse";
var movedirL = "To Mouse";
var userX = 0;
var userY = 0;
var lastUpgrade = [5, 0, 0, 0];
function uint8ify(input) { return new Uint8Array(input) };
/* UI */
var mode = 1;
const MaxtriTool = document.createElement("div"); MaxtriTool.className = "MaxtriTool"; document.body.appendChild(MaxtriTool);
const Bbar = document.createElement('div'); Bbar.className = "Bbar"; MaxtriTool.appendChild(Bbar);
const BbarText = document.createElement('div'); BbarText.className = "BbarText"; Bbar.appendChild(BbarText); BbarText.innerHTML = "Maxtri Tool";
const contents = document.createElement('div'); contents.className = "contents"; MaxtriTool.appendChild(contents);
contents.innerHTML = "[F] Role: Master<br>[G] Fire Mode: Off<br>[T] Mouse Mode: To Mouse<br>[Y] Movement Mode: To Mouse";
Bbar.onclick = () => {
        if (mode > 1) mode = 0;
        (mode === 0) ? MaxtriTool.style.top = "-300px" : MaxtriTool.style.top = "0px";
        mode++;
    }
GM_addStyle(`
@import url('https://fonts.googleapis.com/css2?family=Grenze+Gotisch:wght@700&display=swap');
.MaxtriTool {
                background-color: cadetblue;
                width: 800px;
                height: 300px;
                position: fixed;
                top: -300px;
                left: 200px;
                transition-duration: 1000ms;
            } .main:hover {
                background-color: rgb(93, 134, 136);
            }
            .Bbar {
                position: absolute;
                background-color: darkcyan;
                width: 100%;
                height: 50px;
                top: 100%;

                transition-duration: 500ms;
                cursor: pointer;
            }  .Bbar:hover {
                background-color: rgb(0, 83, 83);
            }
            .BbarText {
            position: absolute;
            font-family: 'Grenze Gotisch', cursive;
            text-shadow: none;
            font-size: 50px;
            top: -15px;
            left: 270px;
            opacity: 0.5;
             }
             .contents {
            position: absolute;
            font-family: 'Grenze Gotisch', cursive;
            text-shadow: none;
            font-size: 40px;
            top: 30px;
            left: 30px;
            opacity: 0.5;
            cursor: grab;
}
`);

var saidArray = [roleL, fireL, dirL, movedirL];
const changeText = (input, num) => {
  saidArray[num] = input;
contents.innerHTML = `[F] Role: ${saidArray[0]}<br>[G] Fire Mode: ${saidArray[1]}<br>[T] Mouse Mode: ${saidArray[2]}<br>[Y] Movement Mode: ${saidArray[3]}</p></div>`;
  if (role === 0) contents.innerHTML = "Slave set.";
};
/* KEY HANDLER */
server.binaryType = "arraybuffer";
document.addEventListener('keydown', function (event) {
  let keyCode = event.keyCode || event.which;
  switch (keyCode) {
    case 70: { //F
      if (role === 0) return;
      role++;
      if (role > 1) role = 0;
      switch (role) {
        case 0: roleL = "Slave"; changeText(); break;
        case 1: roleL = "Master"; break;
      };
      changeText(roleL, 0);
      break;
    }
    case 71: { //G
      if (role === 0) return;
      fire++;
      if (fire > 2) fire = 0;
      switch (fire) {
        case 0: fireL = "Off"; break;
        case 1: fireL = "Auto"; break;
        case 2: fireL = "Matching"; break;
      };
      changeText(fireL, 1);
      break;
    }
    case 84: { //H
      if (role === 0) return;
      dir++;
      if (dir > 3) dir = 0;
      switch (dir) {
        case 0: dirL = "To Mouse"; break;
        case 1: dirL = "Away"; break;
        case 2: dirL = "Smart"; break;
        case 3: dirL = "To Tank"; break;
      };
      changeText(dirL, 2);
      break;
    }
    case 89: { //H
      if (role === 0) return;
      movedir++;
      if (movedir > 2) movedir = 0;
      switch (movedir) {
        case 0: movedirL = "To Mouse"; break;
        case 1: movedirL = "To you"; break;
        case 2: movedirL = "Away"; break;
      };
      changeText(movedirL, 3);
      break;
    }
  }
});
/* PACKET SENDING HANDELER */
var realSend = WebSocket.prototype.send;
var globalWebSocket;
WebSocket.prototype.send = function (data) {
  let message = uint8ify(data);
  let ws = this;
  if (!(ws.url.toLowerCase().includes("maxtritool")) && (this !== globalWebSocket)) globalWebSocket = this;
  if (message[0] === 5 && role === 1) lastUpgrade = message;
  if (role === 1 && message[0] === 2) clientFire = message[10];
  if (message[0] !== 0 && message[0] !== 5 && message[11] !== 1 && ws.url !== serverURL && role === 0) return;
  return realSend.call(this, data);
};
/* MAIN LOOP */
setInterval(() => {
  if (connecting) return connect();
  let newuserX = Math.abs(unsafeWindow.netX);
  let newuserY = Math.abs(unsafeWindow.netY);
  if (newuserX === NaN || newuserX === NaN) return;
  userX = newuserX; userY = newuserY;
  let content = `{"X": ${userX}, "Y": ${userY}, "role": ${role}, "mouseX": ${getMousePos().X}, "mouseY": ${getMousePos().Y}, "lastUpgrade": [${lastUpgrade}], "fireRate": ${fire}, "clientFire": ${clientFire}, "dir": ${dir}, "movedir": ${movedir}, "token": "${token}", "ver": ${ver}}`;
  if (server.readyState === WebSocket.OPEN) server.send(content);
  if (lastUpgrade.length !== 4) setTimeout(() => { lastUpgrade = [5, 0, 0, 0] }, 100);
}, 100);
/* SERVER SEND HANDLER */
server.onmessage = (event) => {
  if (connecting) {
    if (uint8ify(event.data)[0] === 10) {
      connecting = false;
      loading(0);
      changeText("loading...");
      return;
    } else { loading(2); return };
  };
  if (uint8ify(event.data)[0] === 9) resetToken();
  if (role === 0) globalWebSocket.send(event.data);
};
loading(1);