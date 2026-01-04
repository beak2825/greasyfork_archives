// ==UserScript==
// @name         443 TeamApp Hack
// @description  It's all good
// @author       ItzAfroBoy
// @match        https://443squadronatc.teamapp.com/events/10540545
// @grant        none
// @version 0.0.1.20200123200317
// @namespace https://greasyfork.org/users/378246
// @downloadURL https://update.greasyfork.org/scripts/395583/443%20TeamApp%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/395583/443%20TeamApp%20Hack.meta.js
// ==/UserScript==

(function() {
    var c = document.querySelector("#club_layout > div > div:nth-child(2) > div.col-md-8 > div > div:nth-child(2)");
    var content = c.innerHTML;
    c.innerHTML = content + "Location: Bramley<br>";
})();