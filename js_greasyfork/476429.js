// ==UserScript==
// @name         Debloat Trakt
// @namespace    https://greasyfork.org/en/users/1169041-jothi-prasath
// @version      1.1
// @description  Removes Ads and banners
// @author       Jothi Prasath
// @homepage     https://github.com/jothi-prasath/userscripts
// @supportURL   https://github.com/jothi-prasath/userscripts/issues/new
// @match        https://trakt.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476429/Debloat%20Trakt.user.js
// @updateURL https://update.greasyfork.org/scripts/476429/Debloat%20Trakt.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // List of div IDs to remove
    const divIdsToRemove = ['af1a979-be54078-wrapper'];

    divIdsToRemove.forEach((divId) => {
      while (document.getElementById(divId)){
        const divToRemove = document.getElementById(divId);
        if (divToRemove) {
            divToRemove.parentNode.removeChild(divToRemove);
        }
      }
    });
})();