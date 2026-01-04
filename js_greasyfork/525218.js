// ==UserScript==
// @name         Pepper Rozwijanie wszystkich wątków
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatycznie rozwija wszystkie wątki na Pepperze.
// @author       MaMiX xD
// @license      MIT
// @match        https://www.pepper.pl/promocje/*
// @match        https://www.pepper.pl/dyskusji/*
// @match        https://www.pepper.pl/kupony/*
// @match        https://www.pepper.pl/feedback/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pepper.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525218/Pepper%20Rozwijanie%20wszystkich%20w%C4%85tk%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/525218/Pepper%20Rozwijanie%20wszystkich%20w%C4%85tk%C3%B3w.meta.js
// ==/UserScript==

(function() {



Element.prototype.scrollIntoView = function() {};

setInterval(function() {
document.querySelectorAll('button[data-t="moreReplies"]').forEach(el=>el.click())
}, 1000);



})();