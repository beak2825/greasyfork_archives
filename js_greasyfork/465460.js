// ==UserScript==
// @name         'Delete' Events
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  'Deletes' all your Torn events
// @author       You
// @match        https://www.torn.com/page.php?sid=events
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465460/%27Delete%27%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/465460/%27Delete%27%20Events.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("ul[class*=eventsList_]")[0].remove()
})();