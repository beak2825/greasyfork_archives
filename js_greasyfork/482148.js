// ==UserScript==
// @name         Price Switch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Pressing tab on a price box will go to the next price box, rather than the Remove box
// @author       guribot
// @match        https://www.grundos.cafe/market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482148/Price%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/482148/Price%20Switch.meta.js
// ==/UserScript==



(function() {
    $('document').ready( function() {
        $('.price').on("keydown", function(e) {
            if (e.key === "Tab") {
                var target = $(e.target);
                var next = $(e.target).closest('.data').next().next().next().next().next().next().next().find('.price'); // lol
                var nextInput = next.eq(0)[0];
                console.log(nextInput);
                nextInput.focus();
                nextInput.select();
                return false;
            } else if (e.key === "-") {
                $(e.target)[0]["value"] -= 10;
            } else if (e.key === "+") {
                $(e.target)[0]["value"] += 10;
            }
        });
    });
})();