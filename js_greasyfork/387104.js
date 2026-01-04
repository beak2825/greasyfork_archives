// ==UserScript==
// @name         Remove Reddit Similar communities to
// @description  Removes the "Similar communities to" from reddit.com
// @include      *reddit.com/*
// @grant        none
// @version 0.0.1.20190703051744
// @namespace https://greasyfork.org/users/4252
// @downloadURL https://update.greasyfork.org/scripts/387104/Remove%20Reddit%20Similar%20communities%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/387104/Remove%20Reddit%20Similar%20communities%20to.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ' ._3ecQI6Cj7AUan8ODNedckX {display:none !important;}';
    document.getElementsByTagName('head')[0].appendChild(style);
})();