// ==UserScript==
// @name         Multiup Torrent Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable the upload button on MultiUp.org
// @author       Noodles
// @match        https://multiup.org/en/upload/from-torrent
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467529/Multiup%20Torrent%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/467529/Multiup%20Torrent%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // removes the disabled attribute from the button
    document.querySelector('button[type="submit"][disabled]').removeAttribute('disabled');

    // adds the enabled attribute to the button
    document.querySelector('button[type="submit"]').setAttribute('enabled', '');
})();