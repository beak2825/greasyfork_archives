// ==UserScript==
// @name         MAL highlight active users
// @namespace    https://greasyfork.org/en/users/715572-falzar-fz
// @version      1
// @description  Highlight active users to help find friends in your area for MyAnimeList: https://myanimelist.net/users.php
// @author       Falzar FZ
// @match        *://myanimelist.net/users.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497883/MAL%20highlight%20active%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/497883/MAL%20highlight%20active%20users.meta.js
// ==/UserScript==

(function() {
    function search() {
        let elements = document.querySelectorAll(".borderClass");
        elements.forEach(function(val) {
            if (/,\s20\d{2}/.test(val.textContent)) {
                val.style.opacity = '0.2';
            }
            if (val.textContent.includes("day")) {
                val.style.backgroundColor = 'blue';
            }
            if (val.textContent.includes(" ago")) {
                val.style.backgroundColor = 'green';
            }
        });
    }

    search();
})();