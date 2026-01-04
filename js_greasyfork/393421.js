// ==UserScript==
// @name         Remove leading spaces in AO3
// @version      1.0
// @description  Removes the leading indents for paragraphs in AO3 works.
// @match        https://archiveofourown.org/works/*
// @namespace https://greasyfork.org/users/413030
// @downloadURL https://update.greasyfork.org/scripts/393421/Remove%20leading%20spaces%20in%20AO3.user.js
// @updateURL https://update.greasyfork.org/scripts/393421/Remove%20leading%20spaces%20in%20AO3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const paragraphs = document.getElementsByTagName('p');
    for(var i = 0; i < paragraphs.length; i++){
        paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(/^(?:\s|&nbsp;)+/, ' ');
    }
})();