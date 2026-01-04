// ==UserScript==
// @name         open all subsection
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @run-at document-start
// @match    https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477871/open%20all%20subsection.user.js
// @updateURL https://update.greasyfork.org/scripts/477871/open%20all%20subsection.meta.js
// ==/UserScript==
/* global $ */
(function() {
    console.log("test");
    $("#content").append("<button id='expandAll' style='position: absolute; top: 0'>EXPAND ALL</button>");
    $('#expandAll').on('click',function (){

        $( "[class*='content-folder']" ).each(function( index ) {
            $( this ).toggle();
        });
        $( "[class*='lesson-single']" ).each(function( index ) {
            $( this ).toggle();
        });
    });
})();