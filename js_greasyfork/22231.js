// ==UserScript==
// @name         Remove Google doodles
// @namespace    http://alhur.es/
// @version      0.1
// @description  Stop the doodle madness!
// @author       fiatjaf
// @include      /^https?://(?:encrypted|www)\.google\.[^/]+/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/22231/Remove%20Google%20doodles.user.js
// @updateURL https://update.greasyfork.org/scripts/22231/Remove%20Google%20doodles.meta.js
// ==/UserScript==

(function() {
    var center = document.querySelectorAll('center')[1]
    center.children[0].innerHTML = ''
})();