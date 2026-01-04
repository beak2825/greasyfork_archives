// ==UserScript==
// @name         GPT文本修订显色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change bold text color to red and italic text color to green
// @author       You
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471557/GPT%E6%96%87%E6%9C%AC%E4%BF%AE%E8%AE%A2%E6%98%BE%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/471557/GPT%E6%96%87%E6%9C%AC%E4%BF%AE%E8%AE%A2%E6%98%BE%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // function to change color of bold and italic text
    function changeColor() {
        // select all <b> and <strong> elements
        var boldElements = document.querySelectorAll('b, strong');

        // loop through each bold element and change color to red
        for (var i = 0; i < boldElements.length; i++) {
            boldElements[i].style.color = 'red';
        }

        // select all <i> and <em> elements
        var italicElements = document.querySelectorAll('i, em');

        // loop through each italic element and change color to green
        for (var i = 0; i < italicElements.length; i++) {
            italicElements[i].style.color = 'green';
        }
    }

    // create a button
    var button = document.createElement('button');
    button.textContent = "显示颜色";
    button.style.position = "fixed";
    button.style.top = "15px";
    button.style.right = "15px";
    button.style.zIndex = 9999;

    // add click event listener to button
    button.addEventListener('click', changeColor);

    // add button to page
    document.body.appendChild(button);
})();
