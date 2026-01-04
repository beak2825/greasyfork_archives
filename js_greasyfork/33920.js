// ==UserScript==
// @name         WaniKani Keyboard Shortcuts
// @namespace    https://wanikani.com/
// @description  Adds some more keyboard shortcuts to WaniKani!
// @version      0.1
// @author       jakeoid
// @match        https://www.wanikani.com/lesson*
// @match        https://www.wanikani.com/review*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33920/WaniKani%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/33920/WaniKani%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);

    function onKeyDown(evt) {
        var keycode = evt ? evt.keyCode : e.which;

            /**
            ESC TO DASHBOARD
            Upon pressing the `ESC` key on your keyboard will send you the dashboard.
            ------------------------
            **/
        if (keycode == 27) {
            if (window.location.href == "https://www.wanikani.com/lesson/session" || window.location.href == "https://www.wanikani.com/review/session") {
                console.log('test');
                var timeout = setTimeout(function(){
                    document.onkeyup = function(){
                        clearTimeout(timeout);
                        window.location.href = "https://www.wanikani.com/dashboard";
                    };
                }, 5000);
                document.onkeyup = function() {
                    clearTimeout(timeout);
                };
            } else if(window.location.href == "https://www.wanikani.com/lesson/" || window.location.href == "https://www.wanikani.com/review/") {
                window.location.href = "https://www.wanikani.com/dashboard";
            }
        }
    }

    function onKeyUp(evt) {
        var keycode = evt ? evt.keyCode : e.which;
            /**
            OPTION + NUMKEY TO CONTROLS
            Use the control key plus a number to press one of the character controls.
            https://i.imgur.com/eLeNSfC.png
            ------------------------
            **/
        if (window.location.href == "https://www.wanikani.com/lesson/session" || window.location.href == "https://www.wanikani.com/review/session") {
            if (evt.ctrlKey && keycode == 49) {
                document.getElementById('option-wrap-up').click();
            }
            if (evt.ctrlKey && keycode == 50) {
                document.getElementById('option-last-items').click();
            }
            if (evt.ctrlKey && keycode == 51) {
                document.getElementById('option-item-info').click();
            }
            if (evt.ctrlKey && keycode == 52) {
                document.getElementById('option-kana-chart').click();
            }
            if (evt.ctrlKey && keycode == 53) {
                document.getElementById('option-audio').click();
            }
        }
    }
    /**
    ARE YOU SURE?
    Upon trying to leave a review session displays a `Are you sure?` message.
    ------------------------
    **/
    if (window.location.href == "https://www.wanikani.com/lesson/session" || window.location.href == "https://www.wanikani.com/review/session") {
        window.onbeforeunload = 'Are you sure?';
    }
})();