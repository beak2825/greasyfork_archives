// ==UserScript==
// @name         (Un)Select all button for Job creation in Memsource
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds (Un)Select all button for Job creation in Memsource
// @author       TB
// @match        https://cloud.memsource.com/web/job2/create/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37741/%28Un%29Select%20all%20button%20for%20Job%20creation%20in%20Memsource.user.js
// @updateURL https://update.greasyfork.org/scripts/37741/%28Un%29Select%20all%20button%20for%20Job%20creation%20in%20Memsource.meta.js
// ==/UserScript==

$($('.form-table')[0]).append('<div><button type="button" class="selectAll">Select all languages</button> <button type="button" class="unselectAll">Unselect all languages</button></div>');

$(document).on("click", ".selectAll", event => {
    console.log("Selecting all languages");
    $('input[name=targetLangs]').attr('checked',true);
});

$(document).on("click", ".unselectAll", event => {
    console.log("Deselecting all languages");
    $('input[name=targetLangs]').attr('checked',false);
});
