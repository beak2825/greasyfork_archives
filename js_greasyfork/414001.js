// ==UserScript==
// @name       Reload YouTube once
// @namespace  Mattari
// @version    0.1
// @description  adds "#" to URL, making YouTube reload once to avoid its sneaky error shit.
// @include      *.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/414001/Reload%20YouTube%20once.user.js
// @updateURL https://update.greasyfork.org/scripts/414001/Reload%20YouTube%20once.meta.js
// ==/UserScript==

function redirect_yt() {
    if (!window.location.hash) {
      if (document.location.toString().indexOf("watch?v=") != -1) {
        window.location.replace(window.location.href+"#fix");
      }
    }
}

var url = document.location.toString();
document.querySelector('html').addEventListener('DOMNodeInserted', function(ev){
  var new_url = document.location.toString();
  if (url == new_url) return; // already checked or processed
  url = new_url;

  redirect_yt() // run when URL changes
});

setTimeout(() => { redirect_yt(); }, 1000);