// ==UserScript==
// @name         Anilist It!
// @description  Extention to instantly search marked Text on Anilist.
// @icon         https://anilist.co/img/icons/icon.svg
// @version      0.1
// @author       Banda
// @include      https://*
// @grant        GM_openInTab
// @run-at       context-menu
// @namespace https://greasyfork.org/users/23321
// @downloadURL https://update.greasyfork.org/scripts/388102/Anilist%20It%21.user.js
// @updateURL https://update.greasyfork.org/scripts/388102/Anilist%20It%21.meta.js
// ==/UserScript==

GetSelectedText();

function GetSelectedText() {
  var selection = document.getSelection();
  GM_openInTab("https://anilist.co/search/anime?sort=SEARCH_MATCH&search=" + selection);
}
