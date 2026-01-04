// ==UserScript==
// @name         Torn: Revive Settings in Hospital
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add link to revive settings in hosptial
// @author       Untouchable [1360035]
// @match        https://www.torn.com/hospitalview.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406216/Torn%3A%20Revive%20Settings%20in%20Hospital.user.js
// @updateURL https://update.greasyfork.org/scripts/406216/Torn%3A%20Revive%20Settings%20in%20Hospital.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let title = $("#skip-to-content");
    console.log(title[0].innerHTML);

    title[0].innerHTML = "<a href='https://www.torn.com/preferences.php#tab=settings' style='text-decoration:none'>Revive Settings</a>";
})();