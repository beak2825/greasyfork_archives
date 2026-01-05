// ==UserScript==
// @name        SAIKO DOWNLOAD
// @namespace   joaopauloxe3@gmail.com
// @include     http://saikoanimes.net/protetor/*
// @version     2
// @grant       none
// @description:en "Downloader for SAIKO ANIMES"
// @description "Downloader for SAIKO ANIMES"
// @downloadURL https://update.greasyfork.org/scripts/16596/SAIKO%20DOWNLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/16596/SAIKO%20DOWNLOAD.meta.js
// ==/UserScript==

window.onload = function () {
  var c = setInterval(function () {
    if (document.getElementById("cronometro").children.length > 0) {
      window.location = document.getElementById("cronometro").children[0].href;
      clearInterval(c);
    }
  }, 1000);
}