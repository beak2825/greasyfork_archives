// ==UserScript==
// @name         BCAP insta scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip the scroll lock 3600ms nonsense
// @author       You
// @match        https://www.blockchaincapital.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blockchaincapital.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481564/BCAP%20insta%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/481564/BCAP%20insta%20scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function() {
        var header = document.getElementById("noscroll");
        header.style.overflow = "visible";
        header.style.height = "auto";
    }
})();