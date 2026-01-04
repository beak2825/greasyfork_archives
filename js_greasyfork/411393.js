// ==UserScript==
// @name         English Lev Net
// @namespace    Violentmonkey Scripts
// @version      0.1.1
// @description  Redirect to English version of Lev Net
// @author       Jonah Lawrence
// @include      /^.*://.*levnet\.jct\.ac\.il/*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/411393/English%20Lev%20Net.user.js
// @updateURL https://update.greasyfork.org/scripts/411393/English%20Lev%20Net.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

window.addEventListener("load", function() {
    "use strict";
    
    const langSelect = angular.element('select[ng-model="model.currentLanguage"]');
    const okButton = angular.element('div[local-title="title_local_switcher"] button[local="ok_button"]');

    // Check if the website language is Hebrew
    if (langSelect.scope().model.currentLanguage === "he") {

        // Change the selected language to English
        langSelect.scope().model.currentLanguage = "en";

        // Trigger a change on the select element from Angular
        langSelect.triggerHandler("change");

        // Trigger a click on the OK button
        okButton.click();

    }

}, false);