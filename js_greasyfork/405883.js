// ==UserScript==
// @name         YEET
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  When your S3 bucket is empty its time to YEET.
// @author       Catpuccino
// @match        https://s3.console.aws.amazon.com/s3/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405883/YEET.user.js
// @updateURL https://update.greasyfork.org/scripts/405883/YEET.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
    disempty();
}, false);

timerempty();

$(document).on("click", "a", function(){
    console.log("here");
    timerempty();
});

function disempty() {
    $(".initial-start-paragraph.ng-scope").each(function() {
        $(this).html(
            $(this).html().replace(/This bucket is empty./g,"Dis bitch empty. YEET!") );
    });
};

function timerempty() {
    window.setTimeout(function(){
        disempty();
    }, 1700);
};
