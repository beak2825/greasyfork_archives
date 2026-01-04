// ==UserScript==
// @name         Lute: Random Book Button
// @version      20240223
// @description  Add random book button to Lute
// @author       jamesdeluk
// @match        http://localhost:500*
// @grant        none
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/488112/Lute%3A%20Random%20Book%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/488112/Lute%3A%20Random%20Book%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    var button = document.createElement('button');
    button.innerHTML = 'Random book';
    button.style.marginLeft = '10px';
    button.style.padding = '0.1em 0.3em';

    // Add an event listener to the button
    button.addEventListener('click', function() {
        var e = document.getElementsByClassName("book-title");
        var t = [];
        for (var n = 0; n < e.length; n++) {
            t.push(e[n].getAttribute("href"));
        }
        var r = Math.floor(Math.random() * t.length);
        var o = t[r];
        var currentUrl = window.location.origin;
        var newUrl = currentUrl + o;
        window.location.href = newUrl;
    });

    // Insert the button before the "booktable" element
    var booktable = document.getElementById('booktable');
    if (booktable) {
        booktable.parentNode.insertBefore(button, booktable);
    }
})();