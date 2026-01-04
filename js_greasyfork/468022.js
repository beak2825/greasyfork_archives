// ==UserScript==
// @name     JPDB Custom Glossary fix
// @version  1
// @grant    none
// @author   Ras#0612
// @description  Deals with html code that jpdb-connect throws at a custom definition when the "definition" field is set to "glossary"
// @match    https://jpdb.io/review*
// @match    https://jpdb.io/vocabulary/*
// @icon     https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @run-at   document-start
// @license MIT

// @run-at   document-idle
// @namespace https://greasyfork.org/users/1092001
// @downloadURL https://update.greasyfork.org/scripts/468022/JPDB%20Custom%20Glossary%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/468022/JPDB%20Custom%20Glossary%20fix.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    var elements = document.querySelectorAll(".mnemonic.custom-meaning");

    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = elements[i].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
}, false);
