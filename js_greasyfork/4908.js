// ==UserScript==
// @name        Play Tone
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description Function to play a sound file by adding an HTML5 audio tag to the document. ver 1.0 2014-09-07.
// @include     *
// @version     1.0
// @copyright   Copyright 2014 Jefferson Scher
// @license     BSD 3-clause
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/4908/Play%20Tone.user.js
// @updateURL https://update.greasyfork.org/scripts/4908/Play%20Tone.meta.js
// ==/UserScript==

function playTone(e){
  // create audio tag for WAV file
  var el = document.createElement("audio");
  el.setAttribute("autoplay", "autoplay");
  // grab tone file from my site; to avoid mixed content, omit the protocol
  el.setAttribute("src", "//www.jeffersonscher.com/gm/snd/A-Tone-His_Self-1266414414.wav");
  // add to document body
  document.body.appendChild(el);
}
// Add menu item
GM_registerMenuCommand("Play Tone", playTone);
