// ==UserScript==
// @name         WKD dla nas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  WKD xd
// @author       You
// @match        http://www.wkd.com.pl/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371006/WKD%20dla%20nas.user.js
// @updateURL https://update.greasyfork.org/scripts/371006/WKD%20dla%20nas.meta.js
// ==/UserScript==

(function() {
document.getElementById("from-input").value="Michałowice"; document.getElementById("to-input").value="Warszawa Ochota WKD"; document.getElementById("search-timetable").click();
})();