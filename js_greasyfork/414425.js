// ==UserScript==
// @name         Maxtri autofire
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press "E" to autofire.
// @author       Sopur
// @match        http://maxtri.glitch.me/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414425/Maxtri%20autofire.user.js
// @updateURL https://update.greasyfork.org/scripts/414425/Maxtri%20autofire.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var autofire = false;
  var txt = `Autofire script by Sopur<br><br>Autofire:`
  var text = document.createElement("div"); document.body.appendChild(text);
  var said = `<style>
.main {
pointer-events: none; position: fixed; top: 10px; left: 100px;
font-family: 'Comic Sans MS', cursive, sans-serif;
color: #FFFFFF; font-style: normal; font-variant: normal;
}
</style>
<div class="main" id="all">
<p id="guia">${txt} ${autofire}</p></div>`
  text.innerHTML = said;
  WebSocket.prototype.qwer15 = WebSocket.prototype.send
  WebSocket.prototype.send = function (a) {
    let message = new Uint8Array(a);
    if (message[0] === 2 && autofire === true) {
      let msg = new Uint8Array([message[0], message[1], message[2], message[3], message[4], message[5], message[6], message[7], message[8], message[9], 1]);
      this.qwer15(msg);
      //console.log(msg);
      return;
    };
    //console.log(message);
    this.qwer15(message);
  };
  document.addEventListener('keydown', function (event) {
    var keyCode = event.keyCode || event.which;
    switch (keyCode) {
      case 69: {
        if (!autofire) {
          autofire = true;
          console.log(`Autofire: ${autofire}`);
          said = `<style>
.main {
pointer-events: none; position: fixed; top: 10px; left: 100px;
font-family: 'Comic Sans MS', cursive, sans-serif;
color: #FFFFFF; font-style: normal; font-variant: normal;
}
</style>
<div class="main" id="all">
<p id="guia">${txt} ${autofire}</p></div>`
          text.innerHTML = said;
          break;
        } else {
          autofire = false;
          console.log(`Autofire: ${autofire}`);
          text.innerHTML = said;
          said = `<style>
.main {
pointer-events: none; position: fixed; top: 10px; left: 100px;
font-family: 'Comic Sans MS', cursive, sans-serif;
color: #FFFFFF; font-style: normal; font-variant: normal;
}
</style>
<div class="main" id="all">
<p id="guia">${txt} ${autofire}</p></div>`
          text.innerHTML = said;
          break;
        };
      };
    };
  });
})();