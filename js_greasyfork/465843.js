// ==UserScript==
// @name         Remove Axutongxue Ads
// @description  Remove ads from axutongxue website
// @version      1
// @match        https://axutongxue.net/*
// @grant        none
// @namespace https://greasyfork.org/users/832913
// @downloadURL https://update.greasyfork.org/scripts/465843/Remove%20Axutongxue%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/465843/Remove%20Axutongxue%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const idToRemove = 'fdasfas';
    const asideElement = document.getElementById(idToRemove);

    if (asideElement) {
        asideElement.remove();
        console.log(`Removed element with ID '${idToRemove}'`);
    }
})();
