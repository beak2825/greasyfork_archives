// ==UserScript==
// @name         Building Link
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Add RSI link to the building name.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/BuildingView.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477126/Building%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/477126/Building%20Link.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const buildingInfo = document.querySelector('.rs-ui-content');
    const buildingName = buildingInfo.querySelector('b');
    const buildingLink = document.createElement('a');
    const hiddenTextNode = document.createTextNode("\u00A0");

    buildingLink.setAttribute('href', window.location.href);
    buildingLink.innerHTML = buildingName.textContent;

    buildingName.innerHTML = ''; // Clear existing content
    buildingName.appendChild(buildingLink);
})();
