// ==UserScript==
// @name        Tooting on Mastodon
// @namespace   Violentmonkey Scripts
// @match       https://mastodon.nz/*
// @grant       none
// @version     1.0
// @author      Keith Nicholas
// @description 10/11/2022, 3:42:31 pm
// @downloadURL https://update.greasyfork.org/scripts/454554/Tooting%20on%20Mastodon.user.js
// @updateURL https://update.greasyfork.org/scripts/454554/Tooting%20on%20Mastodon.meta.js
// ==/UserScript==


console.log('make tooting sounds...')

function tooting() {
  let buttonTags = [].slice.call(document.getElementsByClassName("button"));
  console.log(buttonTags)
  let toot = buttonTags.find(t => t.textContent == 'Toot!')
  if(toot) toot.addEventListener('click', function(){ new Audio('https://soundbible.com/mp3/Bike%20Horn-SoundBible.com-602544869.mp3').play()}, false);
}

if(window.onload) {
  let currentOnLoad = window.onload;
  let newOnload = function(evt) {
      currentOnLoad(evt);
      tooting();
  };
  window.onload = newOnload;
} else {
  window.onload = tooting;
}
