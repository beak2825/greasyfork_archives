// ==UserScript==
// @name         Mahara Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a direct link to mahara on the bbb moodle.
// @author       com.xelaalex.directmahara
// @match        https://moodle.bbbaden.ch/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394615/Mahara%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/394615/Mahara%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

console.log("hey");
    var li = document.createElement('li');
    var a = document.createElement('a');

    var linkText = document.createTextNode("Mahara");
    a.title = "Mahara";
    a.href = "https://moodle.bbbaden.ch/auth/mnet/jump.php?hostid=4";
    a.appendChild(linkText);

    li.appendChild(a);

    document.querySelector(".navbar .nav").appendChild(li);
})();