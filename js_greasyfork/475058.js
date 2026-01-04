// ==UserScript==
// @name         Auto-Choose EDU.IDAHO.GOV
// @namespace    http://tampermonkey.net/
// @version      2023.10.02.2
// @description  Chooses SDE automatically from the district dropdown
// @author       Vance M. Allen
// @match        https://adfsproxy2010.sde.idaho.gov/adfs/ls/?wa=wsignin1.0*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475058/Auto-Choose%20EDUIDAHOGOV.user.js
// @updateURL https://update.greasyfork.org/scripts/475058/Auto-Choose%20EDUIDAHOGOV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let x = $('#ctl00_ContentPlaceHolder1_PassiveIdentityProvidersDropDownList');
    if(x.length) {
        $('select').first().find('option:contains(EDU.IDAHO.GOV)').prop('selected',true);
        $('input[type="submit"]').trigger('click');
    };
})();