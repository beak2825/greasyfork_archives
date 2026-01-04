// ==UserScript==
// @name         YouTube Kid Safe Video Mode (press alt+k)
// @namespace    https://www.youtube.com/
// @version      0.1
// @description  Find a show, then hit alt+k to switch to kids safe mode that turns off autoplay, hides suggested videos and comments, and expands the screen. Also should hide video links at the end of videos.
// @author       stopthief
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438850/YouTube%20Kid%20Safe%20Video%20Mode%20%28press%20alt%2Bk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438850/YouTube%20Kid%20Safe%20Video%20Mode%20%28press%20alt%2Bk%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    /////// https://stackoverflow.com/a/46428962
//     var oldHref = document.location.href;
//     window.onload = function() {
//         var bodyList = document.querySelector("body")
//         ,observer = new MutationObserver(function(mutations) {
//             mutations.forEach(function(mutation) {
//                 if (oldHref != document.location.href) {
//                     oldHref = document.location.href;

//                     //console.log('location changed!');
//                     //hideAll(true);
//                 }
//             });
//         });
//         var config = {
//             childList: true,
//             subtree: true
//         };
//         observer.observe(bodyList, config);
//     };

    window.addEventListener("load", function(){

        setTimeout(() => {
            hideAll(false); //set this to true to hideAll by default on page load...
        }, 500);
        
        document.addEventListener("keydown", function onEvent(event) {
            //console.log("event: ", event);
            if (event.key === "k" && event.altKey) {
                if (document.getElementById("columns").lastElementChild.style.display == "none") {
                    hideAll(false);
                } else {
                    hideAll(true);
                }
            }

        });
    });


    function hideAll(val) {
        if (val) {
            //document.getElementById("columns").lastElementChild.style.display = "none";
            if (!document.getElementsByTagName('ytd-watch-flexy')[0]?.theater) {
                document.getElementsByClassName("ytp-size-button ytp-button")[0]?.click();
            }
            var list = document.getElementsByClassName("ytp-button")
            for (let l of list) {
                if (l.ariaLabel?.startsWith("Autoplay is on")) {
                    l.click();
                }
            }
            //$("[id=secondary]:eq(1)").css('display', 'none')
            $('ytd-watch-flexy #secondary').css('display', 'none')
            $('.ytp-endscreen-content').css('display', 'none'); //adds at the end of video
            $('.html5-endscreen').css('display', 'none');
            $('.ytp-ce-element').css('display', 'none');
            $('.ytd-topbar-logo-renderer').css('display', 'none');//youtube logo
            $('#comments').css('display', 'none');
        } else {
            //$("[id=secondary]:eq(1)").css('display', '')
            $('ytd-watch-flexy #secondary').css('display', '')
            document.getElementById("columns").lastElementChild.style.display = "";
            document.getElementsByClassName("ytp-size-button ytp-button")[0].click();
            $('.ytp-endscreen-content').css('display', ''); //adds at the end of video
            $('.html5-endscreen').css('display', '');
            $('.ytp-ce-element').css('display', '');
            $('.ytd-topbar-logo-renderer').css('display', '');//youtube logo
            $('#comments').css('display', '');
        }
    }
})();
