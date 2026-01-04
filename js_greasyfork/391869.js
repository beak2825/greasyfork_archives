// ==UserScript==
// @name         Google Translater Formatter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description      Used to fomat text in google translation
// @author       Shi Fan
// @include         https://translate.google.*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/391869/Google%20Translater%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/391869/Google%20Translater%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        var element = document.querySelector('nav');
        element.innerHTML += '<botton style="border:solid 1px; padding:3px; cursor:pointer; color: black">重新排版</botton>';
        element.addEventListener("click", function() {
            var input = document.querySelector('textarea');
            var text = input.value.replace(/\n/g, ' ');
            console.log(text);
            input.value = text;
        }, false);
    }, 500);

})();