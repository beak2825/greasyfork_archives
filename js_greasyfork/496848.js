// ==UserScript==
// @name         Powerline.io very long names
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  You can make your name up to 500 characters!
// @author       repcak
// @match        http://powerline.io/
// @icon         https://www.google.com/s2/favicons?domain=powerline.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496848/Powerlineio%20very%20long%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/496848/Powerlineio%20very%20long%20names.meta.js
// ==/UserScript==
 
(function() {
 
 
    var x = document.getElementById("nick");
    x.maxLength = 500;
})();