// ==UserScript==
// @name         Lepszy Sadistic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ukryj posty od niechcianych użytkowników sadistica. Wystarczy dodac nazwe uzytkownika do listy "names". 
// @author       M.W
// @match        http://*/*
// @include        https://www.sadistic.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420570/Lepszy%20Sadistic.user.js
// @updateURL https://update.greasyfork.org/scripts/420570/Lepszy%20Sadistic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var names = ['lodzia', 'halman'];
    var matches = document.getElementsByClassName('images');
    for (var i = 0; i <= matches.length; i++) {
      if (names.some(v => matches[i].innerHTML.toLowerCase().includes(v.toLowerCase()))) {
          matches[i].parentNode.removeChild(matches[i]);
          i = i - 1;
      }
   }
})();