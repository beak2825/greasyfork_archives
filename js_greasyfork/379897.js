// ==UserScript==
// @name Dissonant
// @description Dissonant web chat, for every page on the internet
// @namespace Fusir Projects
// @match *://*/*
// @exclude *://js.lifelist.pw/*
// @exclude *://*/*.jpg
// @exclude *://*/*.png
// @exclude *://*/*.gif
// @exclude *://*/*.jpeg
// @noframes
// @grant none
// @version 0.0.1.20190314133531
// @downloadURL https://update.greasyfork.org/scripts/379897/Dissonant.user.js
// @updateURL https://update.greasyfork.org/scripts/379897/Dissonant.meta.js
// ==/UserScript==

// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
function expanddiv() {
  var div = $('<div>');
}

function expandinsertdiv() {
  //Finds the best place to add the chat expand button
}

function pageidentifier() {
 return location.host.replace('www.','')+location.pathname;
}

function openchat () {
  var chat = document.createElement('iframe');
  chat.src = 'https://js.lifelist.pw/app/wchat/dissonant/'+pageidentifier();
  chat.style.width = '98vw';
  chat.style.height = '65vh';
  var body = document.getElementsByTagName('body')[0];
  body.parentNode.appendChild(chat);
  window.addEventListener('blur',()=>{chat.blur()});
  window.addEventListener('blur',()=>{chat.focus()});
  chat.focus();
  //$('body').first().after($('<iframe>').attr('src','https://js.lifelist.pw/app/wchat/dissonant/'+pageidentifier()).css('width','98vw').css('height','50vh'));
}

openchat();