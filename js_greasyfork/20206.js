// ==UserScript==
// @name         Image BG Toggle
// @namespace    pxgamer
// @version      1.3
// @description  Toggles the background colour for images in the browser
// @author       pxgamer
// @include      /.*\.(JPG|PNG|GIF|JPEG).*/
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20206/Image%20BG%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/20206/Image%20BG%20Toggle.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    function changeImageBG() {
        if (col == 'black') {
            $('body').css('background-color', col);
            if (allowGrey) { col = 'grey'; }
            else { col = 'white'; }
        }
        else if (col == 'grey') {
            $('body').css('background-color', col);
            col = 'white';
        }
        else if (col == 'white') {
            $('body').css('background-color', col);
            col = 'black';
        }
        else {
            $('body').css('background-color', 'white');
            col = 'black';
        }
    }

    var allowGrey = false;
    var col = 'black';
    if (document.contentType.indexOf('image') > -1) {
        $('body').append('<span id="bgToggle" style="right: 15px; top: 5px; cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; z-index: 999999; position: fixed; float: right; background-color: white; border: 1px solid grey; border-radius: 2px; margin: 5px; padding: 2px; font-family: fantasy;">TOGGLE BG</span>');

        $('#bgToggle').on('click', function() {changeImageBG(); });
        var keys = {
            ctrl: false,
            b: false
        };
        $(document.body).on('keydown', function (e) {
            if (event.keyCode == 17) {
                keys.ctrl = true;
            } else if (event.keyCode == 66) {
                keys.b = true;
            }
            if (keys.ctrl && keys.b) {
                changeImageBG();
            }
        });
        $(document.body).keyup(function(e) {
            if (event.keyCode == 17) {
                keys.ctrl = false;
            } else if (event.keyCode == 66) {
                keys.b = false;
            }
        });
    }
})();
