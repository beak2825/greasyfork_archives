// ==UserScript==
// @name       jawz Serg Now 
// @version    1.6
// @author	   jawz
// @description  something
// @match      https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12700/jawz%20Serg%20Now.user.js
// @updateURL https://update.greasyfork.org/scripts/12700/jawz%20Serg%20Now.meta.js
// ==/UserScript==

if ($('h4:contains("How are the following topics related to the video?")').length || $('h4:contains("Carefully review the following examples")').length) {
    $('div[id="instructions"]').hide();
    $('div[id="multi-table-container"]').hide();
    $('div[id="sample-task"]').hide();
    $('#delete-history').hide();
    $('textarea').hide();
    $('div[class="add-labels input-ready"]').hide();
    $('input[value="OFF_TOPIC"]').click();
}