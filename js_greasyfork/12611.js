// ==UserScript==
// @name        Ready forever tf2center
// @namespace   deetr
// @description Keeps you readied indefinitely on tf2center.com
// @include     /^(http|https):\/\/tf2center\.com\/lobbies\/[0-9]+$/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12611/Ready%20forever%20tf2center.user.js
// @updateURL https://update.greasyfork.org/scripts/12611/Ready%20forever%20tf2center.meta.js
// ==/UserScript==

$('.join-steam-group').hide();
$

var autoReady = false;
var interval = null;

unsafeWindow.

$('#chat').append('<form action=""><input id = "autoReadyButton" type="checkbox"><font color = white>  True AutoReady</font></form>');
document.getElementById('autoReadyButton').addEventListener("click", toggleAutoReady);

function toggleAutoReady(){
  if (autoReady){
    clearInterval(interval);
    $('.countitround').click();
  }
  else{
    autoReady = true;
    // Leave a second at the end to account for lag
    interval = setInterval(readyUp, 181);
    // Make unreadying with the regular button stop auto ready
    document.getElementById().addEventListener("click", toggleAutoReady);
  }
}

function readyUp(){
  $('#pre-ready-button').click();
}

