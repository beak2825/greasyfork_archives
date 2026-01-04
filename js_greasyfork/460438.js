// ==UserScript==
// @name         Autofill Merge Request Form
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fill merge request's title, description and merge options for F32S
// @author       Ethan
// @match        https://gitlab.com/wosteven/*/-/merge_requests/new?merge_request*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460438/Autofill%20Merge%20Request%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/460438/Autofill%20Merge%20Request%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('\'Autofill Merge Request Form\' tampermonkey script START')

    function setMergeRequestTitle(fromBranchName, toBranchName) {
        var mergeRequestTitleElement = document.getElementById('merge_request_title');
        mergeRequestTitleElement.value = `Merge branch '${fromBranchName}' into '${toBranchName}'`
    }

    function clearMergeRequestDescription() {
        var mergeRequestDescriptionElement = document.getElementById('merge_request_description');
        mergeRequestDescriptionElement.value = '';
    }

    function clearDeleteSoucreCheckbox() {
        var deleteSourceCheckboxElement = document.getElementById('merge_request_force_remove_source_branch');
        deleteSourceCheckboxElement.checked = false;
    }

    var fromBranchName = document.getElementsByClassName('branch-selector')[0].getElementsByTagName('code')[0].innerText;
    var toBranchName = document.getElementsByClassName('branch-selector')[0].getElementsByTagName('code')[1].innerText;

    setMergeRequestTitle(fromBranchName, toBranchName);
    clearMergeRequestDescription();
    clearDeleteSoucreCheckbox();

    console.log('\'Autofill Merge Request Form\' tampermonkey script END')
})();