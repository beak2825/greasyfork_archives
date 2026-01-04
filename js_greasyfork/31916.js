// ==UserScript==
// @name         Kasisto script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      https://central-mturk.kitsys.net/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/31916/Kasisto%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/31916/Kasisto%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($("div:contains(Imagine you are interacting with a smart)").length){
        $("div[class=instructions]").toggle();
        $(".form-control").focus();
    }
});