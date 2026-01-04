// ==UserScript==
// @name         nlp script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39626/nlp%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39626/nlp%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('select').attr('onchange',"javascript:changeTag(2)");
});