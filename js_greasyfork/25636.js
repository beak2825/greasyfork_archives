// ==UserScript==
// @name         Hotel Photos Helper v2
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  '1' to rotate between images, '2' to submit if autosubmit is set to true
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @include      *s3.amazonaws.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25636/Hotel%20Photos%20Helper%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/25636/Hotel%20Photos%20Helper%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let autosubmit = false;

    if ($("h3:contains('Please select the applicable choices below each image.')").length || $("h2:contains('Please indicate the most accurate description of the hotel area depicted in the image.')").length) {
        console.log("Hotel Photos");
        window.focus();
        $('img[onerror="imgError(this);"]').each( function(x) {
           $(this).attr('id', 'image' + x);
        });
        let key = 0;
        document.onkeydown = function (k) {
            switch (k.keyCode) {
                case 49: window.scrollTo(0, $("#image" + (key % 5)).offset().top);
                         key++;
                         break;
                case 50: if (autosubmit)
                             $('#submitButton').click();
                         break;
            }
        };
    }
    else if ($("p:contains('The purpose of this task is to review an image against a set of standards.')").length) {
        console.log("Hotel Photos Image Review");
        window.focus();
        setTimeout(function(){ $('#ID01_DoesImageContainArt_no').click(); }, 500);
        setTimeout(function(){ $('#ID02_DoesImageContainArt_no').click(); }, 1000);
        setTimeout(function(){ $('#ID03_DoesImageContainArt_no').click(); }, 1500);
        setTimeout(function(){ $('#ID04_DoesImageContainArt_no').click(); }, 2000);
        setTimeout(function(){ $('#ID05_DoesImageContainArt_no').click(); }, 2500);
        $('tr.warning, tr.info').each( function(x) {
           $(this).attr('id', 'image' + x);
        });
        let key = 0;
        document.onkeydown = function (k) {
            switch (k.keyCode) {
                case 49: window.scrollTo(0, $("#image" + (key % 5)).offset().top);
                         key++;
                         break;
                case 50: if (autosubmit)
                             $('input.btn-primary[name="submit"]').click();
                         break;
            }
        };
    }
})();