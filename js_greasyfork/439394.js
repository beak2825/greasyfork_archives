// ==UserScript==
// @name         Waterloo Learn Video & PDF Redirect
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  An extension that redirects Waterloo Learn's Video & PDF to its original page.
// @author       Trotyl
// @match        https://learn.uwaterloo.ca/d2l/le/content/*/viewContent/*/View
// @match        https://learn.uwaterloo.ca/content/enforced/*
// @icon         https://s.brightspace.com/lib/favicon/2.0.0/favicon.ico
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license      MIT
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/439394/Waterloo%20Learn%20Video%20%20PDF%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/439394/Waterloo%20Learn%20Video%20%20PDF%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if ($(".vui-mediaplayer").length == 1) {
        $(window).attr('location', "https://learn.uwaterloo.ca" + $(".vui-mediaplayer").attr("data-mediaplayer-src"));
    } else if ($(".d2l-fileviewer-pdf-pdfjs").length == 1) {
        if(!$(".d2l-fileviewer-pdf-pdfjs").attr("data-location").startsWith("http")){
            $(window).attr('location', "https://learn.uwaterloo.ca" + $(".d2l-fileviewer-pdf-pdfjs").attr("data-location"));
        }
    } else if ($(location).attr("href").startsWith("https://learn.uwaterloo.ca/content/enforced/")) {
        var $i = $('<p />').text("");
        $i.css({
            top: 0,
            left: '20px',
            fontFamily: 'Arial, Helvetica, sans-serif',
            textShadow: '0 0 5px #000000',
            color: "white",
            fontWeight: '700',
            fontSize: '30px',
            display: 'block',
            position: 'absolute',
            zIndex: 9999999999
        })
        $("body").append($i);
        var video = $('video')[0];
        $(document).keydown(function (event) {
            switch (event.keyCode) {
                case 37://left
                    $i.text("< 5s");
                    video.currentTime -= 5;
                    $i.fadeIn("fast");
                    break;
                case 38://up
                    video.volume = (video.volume > 0.9 ? 0.9 : video.volume) + 0.1;
                    $i.text(Math.round(video.volume * 100) + "%");
                    $i.fadeIn("fast");
                    break;
                case 39://right
                    $i.text("> 5s");
                    video.currentTime += 5;
                    $i.fadeIn("fast");
                    break;
                case 40://down
                    $i.text(Math.round(video.volume * 100) + "%");
                    video.volume = (video.volume < 0.1 ? 0.1 : video.volume) - 0.1;
                    $i.fadeIn("fast");
                    break;
                case 67://C
                    video.controls = !video.controls;
                    break;
                case 32://space
                    video.paused ? video.play() : video.pause();
                    break;
            };
            return false;
        });
        $(document).keyup(function (event) {
            $i.fadeOut("fast");
            return false;
        });
    }
})();