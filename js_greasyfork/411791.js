// ==UserScript==
// @name         GitLabBranchCreator
// @namespace    http://git.coreop.net/
// @version      1.1
// @description  nice tool
// @author       You
// @include      http://git.coreop.net/*/branches/*
// @include      http://git.coreop.net/*/branches
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411791/GitLabBranchCreator.user.js
// @updateURL https://update.greasyfork.org/scripts/411791/GitLabBranchCreator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createHotfixBranch() {
        document.querySelector("#branch_name").value = "hotfix"
        document.querySelector("[name='ref']").value = "release"
        document.querySelector("#new-branch-form").submit()
    }
    document.querySelector("#new-branch-form > div.form-actions > button.btn.btn-success").insertAdjacentHTML("afterend", `<button name="button" type="button" class="btn btn-primary ml-1" id="create-hotfix-button">hotfix</button>`);
    document.querySelector("#create-hotfix-button").addEventListener("click", createHotfixBranch)
})();