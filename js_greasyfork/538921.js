// ==UserScript==
// @name         pr title is branch name
// @namespace    http://tampermonkey.net/
// @version      2024-06-05
// @description  put branch name from url in pr title
// @author       Drew H.
// @match        https://github.com/*/*/compare/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538921/pr%20title%20is%20branch%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/538921/pr%20title%20is%20branch%20name.meta.js
// ==/UserScript==

function changeName(){
    let branchName = window.location.href;
    branchName = branchName.split("/");
    branchName = branchName[branchName.length - 1].split("?");
    branchName = branchName[0];
    const titleField = document.getElementById("pull_request_title");
    titleField.value = branchName;
}

async function waitAndExecute(ms, callback) {
  await new Promise(resolve => setTimeout(resolve, ms));
  callback();
}

(function() {
    'use strict';
    window.addEventListener('load', function() {
        changeName();
    }, false);
    waitAndExecute(2000, changeName);

})();