// ==UserScript==
// @name        Metacritic direct
// @namespace   http://tampermonkey.net/
// @match     http://*.metacritic.com/*/*
// @exclude     http://*.metacritic.com/*/*/critic-reviews
// @exclude     https://*.metacritic.com/*/*/critic-reviews
// @description  try to take over the world!
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30755/Metacritic%20direct.user.js
// @updateURL https://update.greasyfork.org/scripts/30755/Metacritic%20direct.meta.js
// ==/UserScript==



(function() {
    'use strict';

    window.location.href = window.location.href + '/critic-reviews';
    // Your code here...
})();