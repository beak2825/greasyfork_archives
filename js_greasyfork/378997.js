// ==UserScript==
// @name         Jira click to edit disabled
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  disables jira click to edit feature
// @author       You
// @match        https://jira.*/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378997/Jira%20click%20to%20edit%20disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/378997/Jira%20click%20to%20edit%20disabled.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Disable 'click to edit' function.
    // Using setInterval to re run this constantly for when Jira's AJAX calls reenable the feature.
    var removeCTE = setInterval(function() {
        //For each editable element type
        var editableElms = AJS.$('h1.editable-field.inactive, div.editable-field.inactive, span.editable-field.inactive, div.editable-field')
        if (editableElms.length) {
            editableElms.removeClass('inactive');
            editableElms.removeAttr('title');
            editableElms.find('span.overlay-icon').hide();
        }
    },500);
})();