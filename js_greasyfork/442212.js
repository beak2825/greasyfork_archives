// ==UserScript==
// @name         YouTube Shorts Auto-Advance
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      2.1
// @description  Automatically advances to the next video short when the current one ends (optional fullscreen mode)
// @include      https://www.youtube.com/shorts/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/439099-monkeyconfig-modern-reloaded/code/MonkeyConfig%20Modern%20Reloaded.js?version=1012538
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/442212/YouTube%20Shorts%20Auto-Advance.user.js
// @updateURL https://update.greasyfork.org/scripts/442212/YouTube%20Shorts%20Auto-Advance.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function($){

    (window.addEventListener("yt-navigate-finish", function(event) {

        var cfg = new MonkeyConfig({
            title: 'Configure',
            menuCommand: true,
            params: {
                'Automatic Fullscreen': {
                    type: 'checkbox',
                    default: false
                },
            },
        })

        function openFullscreen(elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE / Edge */
                elem.msRequestFullscreen();
            }
        }

        setTimeout(function(){
            if (cfg.get('Automatic Fullscreen')) {
                // var elem = $('.html5-main-video').get(0);
                var elem = $('.html5-main-video').parent().parent().parent().parent().parent().parent().parent().parent().get(0);
                openFullscreen(elem);
            }
            $(".html5-main-video").removeAttr("loop");
            $(".html5-main-video").on('ended',function(){
                $('#navigation-button-down > ytd-button-renderer:nth-child(1)').get(0).click()
            });
        }, 1000);

    }))
})(jQuery);