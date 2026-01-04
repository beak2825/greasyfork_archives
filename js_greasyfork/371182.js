// ==UserScript==
// @name        Zu YouTV-Video navigieren
// @namespace   *
// @author      Wissidi dom
// @description direkt zu der MP4-Datei von YouTV navigieren
// @include     http://youtv.de/tv-sendungen/*
// @include     https://youtv.de/tv-sendungen/*
// @include     http://www.youtv.de/tv-sendungen/*
// @include     https://www.youtv.de/tv-sendungen/*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/371182/Zu%20YouTV-Video%20navigieren.user.js
// @updateURL https://update.greasyfork.org/scripts/371182/Zu%20YouTV-Video%20navigieren.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
  var html = document.getElementsByTagName('body')[0].innerHTML;
  html = html.split("<source src=\"")[1].split("\" type=\"video/mp4\"")[0];
  window.location.href = html;
});