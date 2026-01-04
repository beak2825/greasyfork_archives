// ==UserScript==
// @name         John Doe Banner (.03)
// @namespace    https://greasyfork.org/users/144229
// @version      1.2
// @description  Makes Money
// @author       MasterNyborg + Eisenpower
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google.com/evaluation/endor*
// @include      https://www.youtube.com/embed?*
// @include      https://www.youtube.com/embed/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/40092/John%20Doe%20Banner%20%2803%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40092/John%20Doe%20Banner%20%2803%29.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (window.location.href.includes('assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE')) return;
    else if (window.location.href.includes('youtube.com/embed')) {
        setTimeout(function() {
            var errorList = ["in your country", "this video is not available.", "video is unavailable"];
            var errorContent = document.querySelector('[class="ytp-error-content"]');
            var error = 'None';

            if (errorContent) {
                if (errorList.some(function(v) { return errorContent.textContent.toLowerCase().indexOf(v) >= 0; })) {
                    error = 'Not Available';
                }
            }

            window.parent.postMessage({source:'MTurk', errorMessage: error}, "*");
        }, 1500);
    }
    else {
        window.addEventListener('message', function(event) {
            MESSAGE_HANDLER(event);
        });

        setTimeout(function(){
            var checked = document.querySelectorAll('[type="radio"]');
            if (!checked[0].checked && !checked[1].checked) {
                $('#yes-playable').click();
                $('input[name=speech-presence][value=FOREIGN]').click();
                $('input[name=text-presence][value=FOREIGN]').click();
                $('input[name=sensitivity][value=NOT_SENSITIVE]').click();
                $('input[type=radio][value=SINGING_YES]').click();
            }
            $('input#submit').click();
        },4000);

        if (document.referrer.includes("google.com/") || document.referrer.includes("mturk.com/")) {
            if (!(/[?&]autoplay=1/).test(location.search)) {
                document.getElementById('video-placeholder').click();
            }
        }
    }
});

function MESSAGE_HANDLER (event) {
    if (event.data.source == 'MTurk') console.log(event);
    if (event.origin == "https://www.youtube.com") {
        if (event.data.errorMessage == 'Not Available') {
            $('[type=radio][value=NOT_PLAYABLE]').click();
        }
        if (event.data.errorMessage == 'None') {
            $('#yes-playable').click();
            $('input[name=speech-presence][value=FOREIGN]').click();
            $('input[name=text-presence][value=FOREIGN]').click();
            $('input[name=sensitivity][value=NOT_SENSITIVE]').click();
            $('input[type=radio][value=SINGING_YES]').click();
        }
    }
}