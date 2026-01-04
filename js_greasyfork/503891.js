// ==UserScript==
// @name         Remove Bally Live signup overlay
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Remove the login overlay on ballylive.com
// @author       guywmustang
// @match        https://www.ballylive.com/
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ballylive.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503891/Remove%20Bally%20Live%20signup%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/503891/Remove%20Bally%20Live%20signup%20overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    jQuery.noConflict();
    var $ = jQuery;

    var timer;

    function checkAndRemoveOverlay() {
        var $pwBox = $('.pwcard');
        // Remove the password box
        if ($pwBox.length) {
            removeOverlay();
            console.log("removed overlay");

            // Reset the timer to a longer check now
            clearInterval(timer);
            timer = setInterval(checkAndRemoveOverlay, 3000);
            console.log("reset login overlay check timer to a 3 second interval");
        }
    }

    function removeOverlay() {
        console.log("remove the overlay...");
        var $pwBox = $('.pwcard');
        // Remove the password box
        if ($pwBox.length) {
            $pwBox.remove();
        }

        // Remove the blur
        var $cls = $('.theo-wrapper .blur-style');
        if ($cls.length) {
            $($cls[0]).removeClass("blur-style");
        }

         setTimeout(unmute, 1000);
    }

    function unmute() {
        // unmute the video
        var $video = $('#vjs_video_3_THEOplayerFi');
        if ($video && $video.find("video").length > 0) {
            // unmute
            var $videoInstance = $video.find("video")[0];
            $videoInstance.muted = false;
            console.log("unmuted video");
        }
    }

    function addButton() {
        console.log("add the button...");

        var $btn = $('<button/>', {
            "id": "remove-overlay",
            "style": "background-color: unset; border: 1px solid #444444; padding: 3px;",
            click: removeOverlay
        }).append('<span/>').text("Clear Overlay");

        // Add the button
        var $navbar = $("nav > div")[0];

        //navbar.append($("<button>button</button>"));
        $navbar.append($btn[0]);

        console.log("done adding button");
    }

    // finally once the page is loaded, apply the full dark style
    window.onload = function() {
        // addButton(); // If desired to have a manual button at the top
    }

    $(document).ready(() => {

        timer = setInterval(checkAndRemoveOverlay, 1000);

    });
})();