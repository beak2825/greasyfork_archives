// ==UserScript==
// @name         TypingClub Text Extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extracts text from exercises and logs it into browser console.
// @author       whizxd
// @match        https://*.edclub.com/sportal/program-*/*.play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edclub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445126/TypingClub%20Text%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/445126/TypingClub%20Text%20Extractor.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
    'use strict';
    await sleep(5000);
    let lines = document.getElementsByClassName("token_unit  _clr");
    let complete_string = "";

    for(let i = 0;i < lines.length;i++) {
       if(lines[i].innerHTML != "<span class=\"_enter\">&nbsp;</span><br>")
           complete_string += lines[i].innerText;
        else
            complete_string += "$";
    }

    console.log(complete_string);
})();