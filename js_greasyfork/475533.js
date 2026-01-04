// ==UserScript==
// @name        Autoinvite Script
// @namespace   https://github.com/CryptoXSS/
// @version     1.0.2
// @description Autoinvite script Gota.io
// @author      CryptoXSS
// @match       *://gota.io/*
// @license MIT 
// @icon        https://i.imgur.com/ejxjYj4.gif
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/475533/Autoinvite%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/475533/Autoinvite%20Script.meta.js
// ==/UserScript==

console.clear();
console.log("\n//////////////////////\n////////////////////\n//////////////////\n////////////////\n//////////////\n////////////\n//////////\nCryptoXSS @ 2023 - 2023 Gota-io Script Autoinvite.\nCREATOR: CryptoXSS\nVERSION: 1.0.2");

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

/*
button.addEventListener('click', function() {
var chatBody = document.getElementById('chat-body-0');
chatBody.addEventListener('DOMNodeInserted', function(e) {
  var player = e.target.getElementsByClassName('chat-name').innerHTML; [0].innerHTML;
  console.log(player);

});
*/




let interval;

button.addEventListener('click', function() {
  if (interval) {
    // Si "interval" está definido, detener el intervalo
    clearInterval(interval);
    interval = undefined;
    button.style.backgroundColor = 'red';
  } else {
    // Si "interval" no está definido, iniciar el intervalo
    interval = setInterval(start, 1000);
  }
});

function start() {
button.style.backgroundColor = 'green';
  const chatNameElements = document.querySelectorAll('.chat-name');

  chatNameElements.forEach(chatNameElement => {
    chatNameElement.dispatchEvent(new MouseEvent("contextmenu"));
  });

  const menuInviteElement = document.getElementById("menu-invite");
  if (menuInviteElement) {
    menuInviteElement.click();
  }
};