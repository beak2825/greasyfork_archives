// ==UserScript==
// @name         jira_helper
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  add version & component
// @author       nlimpid
// @match        https://jira.longbridge-inc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ttlsa.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454773/jira_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/454773/jira_helper.meta.js
// ==/UserScript==

var $ = window.jQuery;
function sayHi() {
    $('#components-textarea').val('行情基本面中后台');
    $('#fixVersions-textarea').val('2022.12.12');
}



(function() {
    'use strict';

    $("#create_link").addClass("myNewClass");
    let createButton = document.getElementById('create_link');

    createButton.addEventListener('onMouseUp', function() {

});

    $('.myNewClass').mouseup(
        function() {
  setTimeout(sayHi, 2000);
}
    );

    // Your code here...


})();