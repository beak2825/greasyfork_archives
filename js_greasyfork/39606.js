// ==UserScript==
// @name         Du script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39606/Du%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39606/Du%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $(document).keyup(function(event){
        if(event.which == 13){
            document.querySelector(`[type="submit"]`).click();
        }
    });
});