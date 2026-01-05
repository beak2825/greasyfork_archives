// ==UserScript==
// @name       jawz CI MTurk Admin
// @version    1.0
// @description  enter something useful
// @match      https://www.google.com/evaluation/endor/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10878/jawz%20CI%20MTurk%20Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/10878/jawz%20CI%20MTurk%20Admin.meta.js
// ==/UserScript==

if ($('p:contains(An error occurred. Please refresh the current page in your browser.)').length) 
    location.reload();

if ($('p:contains(In this task you will be presented with an artwork and a keyword. Your)').length) {
    $('input[name="correct1"]').click(function() {
        $('#submit').click();
    });
}