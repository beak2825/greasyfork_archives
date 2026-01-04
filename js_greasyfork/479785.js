// ==UserScript==
// @name         Flash-Free Qasalan Expellibox Messages
// @namespace    https://greasyfork.org/en/scripts/479785
// @version      1.1
// @description  Make the Flash-Free Qasalan Expellibox messages readable
// @author       Zylysh
// @match        *ncmall.neopets.com/games/giveaway/process_giveaway.phtml
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479785/Flash-Free%20Qasalan%20Expellibox%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/479785/Flash-Free%20Qasalan%20Expellibox%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.innerHTML = document.body.innerHTML.split('msg=').pop()

    .replace(/\+/g, " ")
    .replace(/%2C/g, ",")
    .replace(/%3F/g, "?")
    .replace(/%21/g, "!")
    .replace(/%27/g, "'")
    .replace(/%2A/g, "*")
    .replace(/%3Cbr%3E/g, "<br>");

})();