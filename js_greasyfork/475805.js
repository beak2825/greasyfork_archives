// ==UserScript==
// @name         virtualmanager.com - Set country as default for new talents
// @namespace    https://greasyfork.org/en/users/884999-l%C3%A6ge-manden
// @version      0.1
// @description  Sets default language when fetching new talents
// @author       VeryDoc
// @match        https://www.virtualmanager.com/players/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtualmanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475805/virtualmanagercom%20-%20Set%20country%20as%20default%20for%20new%20talents.user.js
// @updateURL https://update.greasyfork.org/scripts/475805/virtualmanagercom%20-%20Set%20country%20as%20default%20for%20new%20talents.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let dropdown = document.getElementById('country');
    dropdown.value = 2;
})();