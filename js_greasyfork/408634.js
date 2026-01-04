// ==UserScript==
// @name         Thai enlarger
// @namespace    none
// @version      0.1
// @description  Thai enlarger. https://www.reddit.com/r/programmingrequests/comments/i86vvs/help_with_a_firefox_extension_converted_from_old/
// @author       ky1-e
// @include http://*/*
// @include https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408634/Thai%20enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/408634/Thai%20enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';

        var pagehtml = document.body.innerHTML;


var allThaiLetters = "";

var thisLetter = "";

for (let x = 3585 ; x < 3675 ; x++) {

    thisLetter = String.fromCharCode(x);

    allThaiLetters = allThaiLetters + thisLetter + "|";

}

allThaiLetters = allThaiLetters.substring(0, allThaiLetters.length - 1);

var thaiRegex = new RegExp("(("+allThaiLetters+")+)", "g");

pagehtml = pagehtml.replace(thaiRegex, "<span style=font-size:160%>$1</span>");

document.body.innerHTML = pagehtml;

})();