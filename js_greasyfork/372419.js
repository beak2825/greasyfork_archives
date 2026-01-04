// ==UserScript==
// @name         EnableSpellcheckGyldendal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  enables spellcheck on test.webproever.dk!
// @author       YaYPIXXO
// @match        http://test.webproever.dk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372419/EnableSpellcheckGyldendal.user.js
// @updateURL https://update.greasyfork.org/scripts/372419/EnableSpellcheckGyldendal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var textfields = document.getElementsByTagName('textarea').length;
    var inputfields = document.getElementsByTagName('input').length;
    var i = 0;
    while (i < inputfields) {
        document.getElementsByTagName("INPUT")[i].setAttribute("spellcheck", "true");
        console.log("Spellcheck enabled on inputfield " + i);
        i++;
    }
    i = 0;
    while (i < textfields) {
        document.getElementsByTagName("TEXTAREA")[i].setAttribute("spellcheck", "true");
        console.log("Spellcheck enabled on textarea " + i);
        i++;
    }
})();