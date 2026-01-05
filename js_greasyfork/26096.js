// ==UserScript==
// @name         DailyMotion - Assess the acurateness of a topic to a video
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Sets all dropdowns to Off-Topic and hides instructions. 1-off topic, 2-dont understand, 3-doesn't play, ` (tilde)-submits
// @author       pyro
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26096/DailyMotion%20-%20Assess%20the%20acurateness%20of%20a%20topic%20to%20a%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/26096/DailyMotion%20-%20Assess%20the%20acurateness%20of%20a%20topic%20to%20a%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("p:contains('has many millions of videos and we would like to make it easier for users to find videos they will love')").length) {
        console.log("DailyMotion");
        //let embedVideo = true;
        //if (embedVideo) {
        //    let url = $('a:contains("Video Link")').attr('href').replace('http://','https://');
        //    $('a:contains("Video Link")').append(`<iframe src="${url}" width="850px" height="400px" id="embeddedVid"></iframe>`);
        // }
        $('div.panel-primary').hide();
        $('select.form-control').val('off');
        document.onkeydown = function (k) {
            switch (k.keyCode) {
                case 49: $('select.form-control').val('off'); // 1 key off topic
                         break;
                case 50: $('select.form-control').val('understandable'); // 2 key dont understand
                         break;
                case 51: $('select.form-control').val('error'); // 3 key error
                         break;
                case 192: $('#submitButton').click();  // F1 submits
                         break;
              //  case 82: if (embedVideo) { // r reloads iframe if dailymotion sucks and won't play the video
              //               let iframe = document.getElementById('embeddedVid');
              //               iframe.src = iframe.src;
              //           }
              //           break;
            }
        };
    }

})();