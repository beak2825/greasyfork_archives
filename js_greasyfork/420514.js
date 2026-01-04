// ==UserScript==
// @name         totally2.0
// @version      0.1
// @description  rickroll
// @author       KcTec90 | https://greasyfork.org/en/users/690190
// @include <include website here (must have a / with text eg: https://www.google.com/help)
// @namespace https://greasyfork.org/en/users/690190
// @downloadURL https://update.greasyfork.org/scripts/420514/totally20.user.js
// @updateURL https://update.greasyfork.org/scripts/420514/totally20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        var path0 = window.location.pathname;
        var path1 = path0.substring(0, 5);
        if (path1 === "/*") {
            window.location.replace("https://youtu.be/dQw4w9WgXcQ");
        }
    }, 100);
})();