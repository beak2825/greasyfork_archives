// ==UserScript==
// @name         Rule34 Classic textbox
// @namespace    http://rule34.paheal.net/
// @namespace    https://rule34.paheal.net/
// @version      0.2
// @description  Restore the classic textbox on rule34.paheal.net
// @match        htt*://rule34.paheal.net/*
// @author       jtvjan
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23484/Rule34%20Classic%20textbox.user.js
// @updateURL https://update.greasyfork.org/scripts/23484/Rule34%20Classic%20textbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByClassName("tagit");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
     document.getElementsByName("search")[0].className = "";
     document.getElementsByName("search")[1].className = "";
})();