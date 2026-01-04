// ==UserScript==
// @name             Mxtube.net to YouTube
// @namespace   tuktuk3103@gmail.com
// @description   Replaces Mxtube.net links with YouTube links
// @include          *://mxtube.net/*
// @version          1.00
// @grant              none
// @icon                https://mxtube.net/mx.jpg
// @downloadURL https://update.greasyfork.org/scripts/448917/Mxtubenet%20to%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/448917/Mxtubenet%20to%20YouTube.meta.js
// ==/UserScript==

function pageFullyLoaded () {

var link = document.getElementById("content").getElementsByTagName('a');

for(var i = link.length; i--; i>-1) {

  var key = link[i].getAttribute('href').slice(12, 23);
  link[i].setAttribute('href', "https://www.youtube.com/watch?v=" + key);
  link[i].setAttribute('target', '_blank');

}

};

window.addEventListener ("load", pageFullyLoaded);