// ==UserScript==
// @name        LibreJS fix - ilpost.it
// @namespace   Violentmonkey Scripts
// @match       https://www.ilpost.it/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/12/2025, 11:47:54 PM
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/535831/LibreJS%20fix%20-%20ilpostit.user.js
// @updateURL https://update.greasyfork.org/scripts/535831/LibreJS%20fix%20-%20ilpostit.meta.js
// ==/UserScript==

function fixGallery() {
  let gallery = JSON.parse(document.getElementById('__NEXT_DATA__').innerHTML).props.pageProps.data.data.main.data.galleries;

  let size="full";
  let idx=0;
  let src = gallery[idx].sizes[size]


  let img = document.createElement("img");
  img.src = src;
  img.classList.add('center');

  let a = document.createElement("a");
  a.href = src;
  a.appendChild(img);

  let main = document.getElementsByTagName("main")[0];
  main.replaceChildren(a);

  let prev = document.createElement("button");
  prev.innerHTML = "Prev";
  prev.onclick = function() {
    if (idx == 0) return;
    src = gallery[--idx].sizes[size];
    a.href = src;
    img.src = src;
  }

  next = document.createElement("button");
  next.innerHTML = "Next";
  next.onclick = function() {
    if (idx == gallery.length - 1) return;
    src = gallery[++idx].sizes[size];
    a.href = src;
    img.src = src;
  }

  main.appendChild(prev);
  main.appendChild(next);
}

function fixAudioPlayer() {
  let divplayer = document.getElementById("audioPlayerArticle");
  let audio = document.createElement("audio");
  audio.src = divplayer.dataset.mp3;
  audio.controls = true;

  divplayer.replaceWith(audio);
}

try {
  fixAudioPlayer();
} catch (ex) {

}

try {
  fixGallery();
} catch (ex) {

}
