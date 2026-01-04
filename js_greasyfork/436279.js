// ==UserScript==
// @name        AudioRedirectsFucker
// @namespace   Violentmonkey Scripts
// @match       *://vk.com/*
// @grant       none
// @version     1.4
// @author      Rofliex
// @description Fuck redirects when u click on audio name
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436279/AudioRedirectsFucker.user.js
// @updateURL https://update.greasyfork.org/scripts/436279/AudioRedirectsFucker.meta.js
// ==/UserScript==


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.no-hover {  }\r\n.no-hover:hover{ text-decoration: none;}';
document.getElementsByTagName('head')[0].appendChild(style);


left_audio_btn = document.querySelector('#l_aud > a');
left_audio_btn.setAttribute('href',left_audio_btn.getAttribute("href") + '?section=all') ;
let timerId = setInterval(() => {
  var els = document.querySelectorAll('div.audio_row__title._audio_row__title > a');
  for (var i=0; i < els.length; i++) {
      els[i].className = "no-hover";
      els[i].removeAttribute("href", "");
  }
}, 200);
