// ==UserScript==
// @name         urzednicza remover
// @namespace    http://tampermonkey.net/
// @include      https://urzednicza.tv/
// @version      0.1
// @description  try to take over the world!
// @author       nylon
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372729/urzednicza%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/372729/urzednicza%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ads = document.getElementsByClassName('adsbygoogle');
    ads[0].parentNode.removeChild(ads[0]);
    var chat = document.getElementsByClassName('chatcard');
    chat[0].style.height = "100%";
})();