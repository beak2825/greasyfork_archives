// ==UserScript==
// @name     Tubaro sen komentoj
// @version  3
// @grant    none
// @include  https://tubaro.aperu.net/*
// @description Forigi la komentejon de Tubaro
// @namespace https://greasyfork.org/users/582780
// @downloadURL https://update.greasyfork.org/scripts/404952/Tubaro%20sen%20komentoj.user.js
// @updateURL https://update.greasyfork.org/scripts/404952/Tubaro%20sen%20komentoj.meta.js
// ==/UserScript==

(function() {
  function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  }

  for (const elem of document.getElementsByClassName("videoListo-elektoj-ordo-ero")) {
    if (elem.classList.contains('ero-3el6') ||
        elem.classList.contains('ero-6el6')) {
      elem.style.display = "none";
    } else {
      elem.style.width = "50%";
      elem.classList.replace('ero-2el6', 'ero-3el6');
      elem.classList.replace('ero-5el6', 'ero-6el6');
    }
  }

  addCss('.videoListo-ero-komentoj, .videoAfisxo-statistiko-komentoj, .videoListoSercxa-ero-komentoj, #comments { display: none !important; }');
})();