// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  REMOVE ELEMENT
// @author       You
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kidstube.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465998/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/465998/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
    //alert(11);
        var x = document.getElementsByClassName("video-role-box");
        if(x !== undefined && x.length > 0) {
            x[0].style.display="none";
        }
    }

    // Your code here...
})();