// ==UserScript==
// @name         AniDub
// @namespace    http://online.anidub.com/
// @version      0.1
// @description  убираем гоморожу рожу с экрана при включенном adblock, отключив функцию её вызова
// @author       megavolt
// @match        http://online.anidub.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/34658/AniDub.user.js
// @updateURL https://update.greasyfork.org/scripts/34658/AniDub.meta.js
// ==/UserScript==


(function() {
 var w = unsafeWindow || window;
w.ogonek = (function (){return true;});
})();

// http://forum.anidub.com/topic/12098-%d0%ba%d0%b0%d0%ba-%d1%83%d0%b1%d1%80%d0%b0%d1%82%d1%8c-%d1%80%d0%be%d0%b6%d1%83-%d1%81-%d0%b1%d0%be%d0%ba%d0%b0-%d1%81%d0%b0%d0%b9%d1%82%d0%b0/page__view__findpost__p__1206042