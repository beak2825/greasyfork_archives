// ==UserScript==
// @name         TEFc Map Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A basic redirect to Uitleger's unofficial TEFc map.
// @author       Unplugged
// @match        http://endlessforest.org/community/current-map-forest
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406261/TEFc%20Map%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/406261/TEFc%20Map%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location = "/community/node/102262";
})();