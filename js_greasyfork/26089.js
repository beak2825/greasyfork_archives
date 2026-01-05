// ==UserScript==
// @name         Chevr Clique
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clic automatique sur chevr.ovh
// @author       You
// @match        http://chevr.ovh/clicker.php
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/26089/Chevr%20Clique.user.js
// @updateURL https://update.greasyfork.org/scripts/26089/Chevr%20Clique.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        myVar = setInterval(click, 250);
        function click() {
            send_click();
            var clicks = parseInt($("#clicks").text());
            if(clicks > 2000)
            {
                document.getElementById("up6").submit();
            }
        }
    });
})();