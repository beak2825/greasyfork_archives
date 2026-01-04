// ==UserScript==
// @name         pluralsight style
// @namespace    https://app.pluralsight.com/
// @version      0.2
// @description  make the h2, h3 and a visible as they have weird color scheme
// @author       Sagar Yadav
// @match        https://app.pluralsight.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pluralsight.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475842/pluralsight%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/475842/pluralsight%20style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        var elements = document.getElementsByTagName('h2');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.color = 'rgb(0, 0, 0) !important';
            elements[i].classList.remove('css-1o5byha');
        }
        var elements2 = document.getElementsByTagName('a');
        for (var j = 0; j < elements2.length; j++) {
            elements2[j].classList.remove('css-1azmn3m');
        }
        var elements3 = document.getElementsByTagName('span');
        for (j = 0; j < elements3.length; j++) {
            elements3[j].classList.remove('css-13kdrfw');
        }
    }, 3000);
})();