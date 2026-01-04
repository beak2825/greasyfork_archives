// ==UserScript==
// @name         John Doe banner
// @namespace    https://greasyfork.org/users/144229
// @version      1.11
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google.com/evaluation/endor*
// @include      https://www.youtube.com/embed?*
// @include      https://www.youtube.com/embed/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39839/John%20Doe%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/39839/John%20Doe%20banner.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (window.location.href.includes('assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE')) return;
    else {
        $('#yes-playable').click();
        $('input[name=speech-presence][value=NO]').click();
        $('input[name=metadata-sensitive][value=NO]').click();
        $('input[name=sensitivity][value=NO]').click();
        setTimeout(function(){
            $('input#submit').click();
        },10000);
        if (document.referrer.includes("google.com/") || document.referrer.includes("mturk.com/")) {
            if (!(/[?&]autoplay=1/).test(location.search)) {
                document.getElementById('video-placeholder').click();
            }
        }
    }
});