// ==UserScript==
// @name         better.php Freeleech
// @namespace    https://greasyfork.org/de/users/580795
// @version      0.1
// @description  Adds a FL button on better.php
// @author       b1100101
// @match        https://orpheus.network/better.php
// @icon         https://orpheus.network/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425249/betterphp%20Freeleech.user.js
// @updateURL https://update.greasyfork.org/scripts/425249/betterphp%20Freeleech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var linksBlock = document.getElementsByClassName('torrent_links_block');
    var flHtml = null;

    for (var i = 0; i < linksBlock.length; i++) {
        flHtml = linksBlock[i].children[0].cloneNode(true);

        flHtml.setAttribute("href", flHtml.getAttribute("href") + "&usetoken=1");
        flHtml.innerHTML = "FL";

        linksBlock[i].appendChild(flHtml);
    }
})();