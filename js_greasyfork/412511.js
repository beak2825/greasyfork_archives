// ==UserScript==
// @name         Flowerpatch Enhanced Extension
// @namespace    http://flowerbot.club
// @version      0.1
// @description  Minimap with your flowers!
// @author       Father longleaf
// @match        *flowerpatch.app/game*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/412511/Flowerpatch%20Enhanced%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/412511/Flowerpatch%20Enhanced%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    // random element to make sure the game is loaded
    var checkExist = setInterval(function() {
        if ($("._3zLA6").length) {
            minimapfunction();
            clearInterval(checkExist);
        }
    }, 100);

    function minimapfunction() {
        var ethaddr = $("._8l81g").attr("href").replace("/account/", "");
        console.log("FPE detected ETH address: " + ethaddr);

        // make minimap show user flowers
        var styleTag = $('<style>._3Izbf { background-image: url("https://flowerbot.club/minimapflowers.php?addr='+ethaddr+'") !important; }</style>')
        $('html > head').append(styleTag);
    }


})();