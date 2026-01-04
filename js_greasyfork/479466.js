// ==UserScript==
// @name        Autoinvite Script
// @namespace   https://github.com/
// @version     1.0.3
// @description ······················································Autoinvite ···························································
// @author      CryptoXSS
// @license MIT
// @match       *://gota.io/*
// @icon        data:image/png;base64,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
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/479466/Autoinvite%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/479466/Autoinvite%20Script.meta.js
// ==/UserScript==

console.clear();
console.log("\n//////////////////////\n////////////////////\n//////////////////\n////////////////\n//////////////\n////////////\n//////////\nCryptoXSS @ 2023 - 2023 Gota-io Script Autoinvite.\nCREATOR: CryptoXSS\nVERSION: 1.0.3");

var button = document.createElement('button');
button.innerHTML = 'Autoinvite';
button.style.backgroundColor = 'red';
button.style.borderRadius = '10px';
button.id = "btn-Invite";
button.className = "menu-invite";

var $div = document.createElement("div");
$div.className = "main-version";
$div.style.margin = "10px";
$div.appendChild(button);

document.body.appendChild($div);
button.style.position = 'mainTop';
button.style.top = '0px';
button.style.left = '650px';
button.style.zIndex = '9999';

var mainTop = document.getElementsByClassName('main-top')[0];
if (mainTop) {
   mainTop.appendChild($div);
} else {
   window.setTimeout(function () {
      var mainTop = document.getElementsByClassName('main-top')[0];
      if (mainTop) {
         mainTop.appendChild($div);
      }
   }, 100);
}



let interval;
const invitedPlayers = new Set(); // conjunto para guardar los jugadores invitados

button.addEventListener('click', function() {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
    button.style.backgroundColor = 'red';
  } else {
    interval = setInterval(start, 1000);
  }
});

let inviteCounter = 0;

function start() {
  button.style.backgroundColor = 'green';
  const chatBody = document.getElementById('chat-body-0');
  if(!chatBody) return;
  const trElements = chatBody.querySelectorAll('tr');
  trElements.forEach(trElement => {
    const tdElement = trElement.querySelector('td');
    if(!tdElement) return;
    const message = tdElement.textContent;
    if (message && (message.includes("inv") || message.includes("𝙞𝙣𝙫") || message.includes("INV") || message.includes("Inv") || message.includes("iNV"))) {
        const chatNameElement = trElement.querySelector('.chat-name');
        if(!chatNameElement) return;
        const playerName = chatNameElement.textContent;
        if(!invitedPlayers.has(playerName)){
          invitedPlayers.add(playerName);
          chatNameElement.dispatchEvent(new MouseEvent("contextmenu"));
          const menuInviteElement = document.getElementById("menu-invite");
          if (menuInviteElement) {
              menuInviteElement.click();
            invitedPlayers.add(playerName);
             console.log("Se ha invitado a " + playerName);
              trElement.remove(); // removemos el tr del jugador invitado
          };

        };
    }
  });
  inviteCounter++;
  if (inviteCounter === 10) {
    invitedPlayers.clear();
    inviteCounter = 0;

  }
};
