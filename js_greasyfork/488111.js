// ==UserScript==
// @name         Lute: Filename to Title
// @version      20240223
// @description  Add button to copy filename to title
// @author       jamesdeluk
// @match        http://localhost:500*/book/new
// @grant        none
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/488111/Lute%3A%20Filename%20to%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/488111/Lute%3A%20Filename%20to%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    var button = document.createElement('button');
    button.innerHTML = 'Copy filename to title';
    button.style.padding = '0.1em 0.3em';

    // Add an event listener to the button
    button.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('title').value=document.getElementById('textfile').value.split('\\')[2].slice(0,-4)
    });

    // Insert the button after the "textfile" element
    var location = document.getElementById('textfile');
    if (location) {
        location.insertAdjacentElement('afterend', button);
    }
})();