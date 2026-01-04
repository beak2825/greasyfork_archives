// ==UserScript==
// @name         programmer-books show download link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.programmer-books.com/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376686/programmer-books%20show%20download%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/376686/programmer-books%20show%20download%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(document.getElementsByClassName("s_pdf_download_link")) {
        document.getElementsByClassName("s_pdf_download_link")[0].style.display = "";
    }
})();