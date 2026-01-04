// ==UserScript==
// @name         Agarty
// @namespace    agarar
// @version      1.0
// @description  Special Party For agar-ar Players
// @author       VIP CLAN
// @match        agar-ar.com*
// @require      https://code.jquery.com/jquery-3.4.1.js
// @icon         https://www.google.com/s2/favicons?domain=agar-ar.com
// @license      VIP CLAN
// @downloadURL https://update.greasyfork.org/scripts/470876/Agarty.user.js
// @updateURL https://update.greasyfork.org/scripts/470876/Agarty.meta.js
// ==/UserScript==

(function() {
    'use strict';
    fetch('https://agarty.glitch.me/agarty/index.html')
        .then(response => response.text())
        .then(htmlContent => {
            $("body").append(htmlContent);
        })
        .catch(error => {
            console.error(error);
        });
})();

// if u have any problem discord me on => vipclan
// :)