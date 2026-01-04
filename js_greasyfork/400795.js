// ==UserScript==
// @name         Keyboard navigation e621
// @version      0.2
// @description  Change the current page with arrow keys
// @author       koreso
// @match        https://e621.net/posts/*
// @namespace https://greasyfork.org/users/510304
// @downloadURL https://update.greasyfork.org/scripts/400795/Keyboard%20navigation%20e621.user.js
// @updateURL https://update.greasyfork.org/scripts/400795/Keyboard%20navigation%20e621.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // check if a next or previous button exists on the current page
    if(document.querySelector(".next")||document.querySelector(".prev"))window.onkeydown = page;

    function page(e) {
        // if the current focused element is a text box, abort
        if(document.activeElement.nodeName.match(/TEXTAREA|INPUT/))return;

        // 39 = right arrow key, 37 = left arrow key
        switch(e.keyCode){
            case 39:
                // change current url to the next button's url
                window.location.assign(document.querySelector(".next"));
                break;
            case 37:
                // idem but for the previous button
                window.location.assign(document.querySelector(".prev"));
                break;
        }
    }
})();