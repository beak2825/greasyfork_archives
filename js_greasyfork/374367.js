// ==UserScript==
// @name         smtebook new web
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://doktorbook.com/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374367/smtebook%20new%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/374367/smtebook%20new%20web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var bookId = document.getElementsByName("bdrive")[0].value;
    console.info(bookId);
    var btnList = document.getElementsByName("sbtn");
    if(btnList.length > 0) {
        btnList[0].parentNode.insertAdjacentHTML('beforeend', '<a target="_blank" style="color: #FFFFFF;background-color: #1e73be;margin: 0 auto;display: table;padding: 10px 34px;font-size: 15px;" href="https://drive.google.com/file/d/'+bookId+'/view">open book</a>');
    }
})();