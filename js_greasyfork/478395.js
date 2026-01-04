// ==UserScript==
// @name         InnerJenkinsBranchFilter
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  Try to take over the world!
// @author       You
// @include      /https?:\/\/..*\/job\/.*\/build?.*/
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/478395/InnerJenkinsBranchFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/478395/InnerJenkinsBranchFilter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var body = document.getElementsByTagName('body')[0];
    if (body === undefined || body === null) {
        return false;
    }

    window.addEventListener('load', function(event) {
        doMyMain();
    });
})();

function doMyMain() {
    var divs = document.getElementsByTagName("div");
    var divMBranch;
    for (var i = 0; i < divs.length; i++) {
        var divI = divs[i];
        if (divI.innerText != "gitlab_branch") { continue; }

        divMBranch = divI;
        break;
    }
    if (divMBranch === undefined || divMBranch === null) {
        console.error("no divMBranch found.");
        return;
    }

    var divPapa = divMBranch.parentNode;
    var divDesc = divPapa.getElementsByClassName("jenkins-form-description")[0];
    if (divDesc === null || divDesc === undefined) {
      console.error("no divDesc found.");
      return;
    }

    var idInput = "meBranchFilter";
    divDesc.outerHTML = divDesc.outerHTML + '<div>过滤：<input id="' + idInput + '"/></div></br>';

    var inputFilter = document.getElementById(idInput);
    if (inputFilter === null || inputFilter === undefined) {
        console.log("no inputFilter found.")
        return;
    }
    inputFilter.addEventListener('input', (evt) => {
        var selectBranch = getBranchSelect();
        if (selectBranch === null || selectBranch === undefined) { return; }

        var keyword = evt.target.value;
        if (keyword === null || keyword === undefined) { return; }

        filterBranch(selectBranch, keyword);
        selectFirstNotHiddenOption(selectBranch);
    });

    setTimeout(() => {
        inputFilter.focus();
    }, 2000);

    // remove unnecessary elements
    var toDeletes = document.getElementsByClassName('git_parameter_quick_filter');
    for (var i = toDeletes.length - 1; i >= 0; i--) {
        toDeletes[i].remove();
    }
}

function getBranchSelect() {
    var divs = document.getElementsByTagName("div");
    var divMBranch;
    for (var i = 0; i < divs.length; i++) {
        var divI = divs[i];
        if (divI.innerText != "gitlab_branch") { continue; }

        divMBranch = divI;
        break;
    }
    if (divMBranch === undefined || divMBranch === null) {
        return null;
    }

    return divMBranch.parentNode.getElementsByTagName("select")[0];
}

function filterBranch(select, keyword) {
    if (select === null || select === undefined ||
        keyword === null || keyword === undefined) {
        return;
    }
    if (select.tagName.toUpperCase() != "SELECT") { return; }

    var options = select.options;
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        var value = option.value;
        if (value === null || value === undefined) { continue; }

        if (value.toLowerCase().includes(keyword.toLowerCase())) {
            option.hidden = false;
        } else {
            option.hidden = true;
        }
    }
}

function selectFirstNotHiddenOption(select) {
    if (select === null || select === undefined || select.tagName.toUpperCase() != "SELECT") {
        return;
    }

    var options = select.options;
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        if (option.hidden == true) { continue; }
        select.selectedIndex = i;
        break;
    }
}