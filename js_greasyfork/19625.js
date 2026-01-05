// ==UserScript==
// @name         Custom Message Tones
// @namespace    pxgamer
// @version      0.5
// @description  Adds options to load in custom tones when a message is received.
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19625/Custom%20Message%20Tones.user.js
// @updateURL https://update.greasyfork.org/scripts/19625/Custom%20Message%20Tones.meta.js
// ==/UserScript==

(function() {

    var AUDIO_FILE   = ""; // URL of audio file (MP3, WAV, OGG)
    var AUDIO_LENGTH = 5000;  // Length in Ticks

    // Do Not Edit Below Here
    var acMethod = jQuery.fn.addClass;
    var audio1;

    jQuery.fn.addClass = function() {
        var result = acMethod.apply(this, arguments);

        jQuery(this).trigger('cssClassChanged');

        return result;
    };

    $('body').append('<span id="chatMsgHandler"></span>');
    $('#chatMsgHandler').css('display', 'none');
    $(document).on('cssClassChanged', function() {
        var msgBarElem = $('.chat-bar-new');
        if (msgBarElem.length > 0) {
            audio1.play();
            setTimeout(function() { audio1.pause(); audio1.currentTime = 0; }, AUDIO_LENGTH);
        }
    });

    var audioTypes = {
        "mp3": "audio/mpeg",
        "ogg": "audio/ogg",
        "wav": "audio/wav"
    };

    function pxS(sound) {
        var audio_element = document.createElement('audio');
        if (audio_element.canPlayType) {
            for (var i = 0; i < arguments.length; i++) {
                var source_element = document.createElement('source');
                source_element.setAttribute('src', arguments[i]);
                if (arguments[i].match(/\.(\w+)$/i)) {
                    source_element.setAttribute('type', audioTypes[RegExp.$1]);
                }
                audio_element.appendChild(source_element);
            }
            audio_element.load();
            audio_element.pFunc = function() {
                audio_element.pause();
                audio_element.currentTime = 0;
                audio_element.play();
            };
            return audio_element;
        }
    }

    audio1 = pxS(AUDIO_FILE);

})();
