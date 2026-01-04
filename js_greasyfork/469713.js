// ==UserScript==
// @name         Imgur redirect gifv
// @description  redirects gifv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @license       MIT
// @match        https://i.imgur.com/*.gifv
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469713/Imgur%20redirect%20gifv.user.js
// @updateURL https://update.greasyfork.org/scripts/469713/Imgur%20redirect%20gifv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.location = document.location.toString().replace("gifv", "mp4");
})();