// ==UserScript==
// @name         Geoguessr Liked Maps as a home page
// @namespace    https://www.geoguessr.com
// @version      1.0
// @author      Kingi
// @description  Redirects GeoGuessr homepage to liked maps page
// @match        https://www.geoguessr.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469930/Geoguessr%20Liked%20Maps%20as%20a%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/469930/Geoguessr%20Liked%20Maps%20as%20a%20home%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = "https://www.geoguessr.com/me/likes";
})();
