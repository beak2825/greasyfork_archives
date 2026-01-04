// ==UserScript==
// @name         GitHub Repo Share-to-Twitter Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a Twitter share button to repository page
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://github.com/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429069/GitHub%20Repo%20Share-to-Twitter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/429069/GitHub%20Repo%20Share-to-Twitter%20Button.meta.js
// ==/UserScript==

(window.onload = function() {
    "use strict";

    const description = document.title;
    const pg_link = location.href;

    var a = document.getElementsByClassName('pagehead-actions flex-shrink-0 d-none d-md-inline')[0];
    var b = document.createElement('a');
    b.className = 'btn btn-sm';
    b.setAttribute('target', '_blank');
    b.href = 'http://twitter.com/share?text="' + description + '"%0a%0a' + pg_link;
    b.textContent = 'Share to Twitter';

    var c = document.createElement('li');
    c.appendChild(b);

    a.insertBefore(c, document.getElementsByClassName('pagehead-actions flex-shrink-0 d-none d-md-inline')[0].children[0]);
}());