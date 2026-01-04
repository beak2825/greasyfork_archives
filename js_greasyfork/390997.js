// ==UserScript==
// @name         Mark dots -delete option
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390997/Mark%20dots%20-delete%20option.user.js
// @updateURL https://update.greasyfork.org/scripts/390997/Mark%20dots%20-delete%20option.meta.js
// ==/UserScript==

    if(document.getElementsByTagName('h1')[1].innerText == "Mark Objects In Images With Dots")
    {

        (function() {
            'use strict';
            var a = document.getElementsByClassName("cml_row")
            a[0].remove(a[0]);
            a[1].remove(a[1]);
            a[2].remove(a[2]);
            a[3].remove(a[3]);
            a[4].remove(a[4]);
}

    // Your code here...
)();
}