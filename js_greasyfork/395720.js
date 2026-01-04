// ==UserScript==
// @name         Wikipedia references
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Skl
// @match        https://ru.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395720/Wikipedia%20references.user.js
// @updateURL https://update.greasyfork.org/scripts/395720/Wikipedia%20references.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        let references = document.querySelectorAll('.references li');
        let bodyContent = document.querySelector('#content');
        let paragraph = document.createElement('h3');
        bodyContent.prepend(paragraph);
        paragraph.innerText = 'Колличество ссылок: ' + references.length;
        paragraph.style.textAlign = 'center';
        paragraph.style.background = '#A3A2F7';
        paragraph.style.color = '#03ECFF';
    };
    // Your code here...
})();