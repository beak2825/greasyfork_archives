// ==UserScript==
// @name         Change website title!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change the website title to anything you want!
// @author       Pasha/pypi
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423685/Change%20website%20title%21.user.js
// @updateURL https://update.greasyfork.org/scripts/423685/Change%20website%20title%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change the title of the website!
    var title = window.prompt("Enter the website title you want.");
    document.title = title;
})();
