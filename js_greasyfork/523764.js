// ==UserScript==
// @name         UBlock
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  UBlock is a user-script programmed in Java. It allows you to block the current website you're viewing, simply by enabling it.
// @author       haimynameisalex
// @match        *://*/*
// @icon         https://i.ibb.co/NYPJgqH/UBlock-Logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523764/UBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/523764/UBlock.meta.js
// ==/UserScript==

// == Programmed in Java by haimynameisalex == \\

// == Blocks the current web-page == \\

function BlockURL(){
    console.log("Blocking URL")

    var current_element = document.querySelector("html");
    current_element.parentNode.removeChild(current_element)
}

// == Main == \\

(function() {
    'use strict';
    BlockURL()
})();
