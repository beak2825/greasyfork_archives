// ==UserScript==
// @name          WaniKani Review Audio Tweak
// @namespace     https://www.wanikani.com
// @description   allow audio to be played after review meaning questions, when reading has been previously answered correctly. also includes enable autoplay when incorrect setting (default: off).
// @version       0.1.0
// @include       http*://www.wanikani.com/review/session*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/10184/WaniKani%20Review%20Audio%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/10184/WaniKani%20Review%20Audio%20Tweak.meta.js
// ==/UserScript==

/*global $, console, additionalContent*/

(function () {
    'use strict';
    // SETTINGS //
    var enableAutoPlayWhenIncorrect = false; // change to 'true' to enable
    /////
    function itemStat(item) {
        var itemStatKey = (item.voc ? "v" : item.kan ? "k" : "r") + item.id;
        return ($.jStorage.get(itemStatKey) || {});
    }
    additionalContent.audio = function (audioAutoplay) {
        var buttonElem, liElem, currentItem, questionType, audioElem;
        currentItem = $.jStorage.get("currentItem");
        questionType = $.jStorage.get("questionType");
        $("audio").remove();
        if (currentItem.aud && (questionType === "reading" || itemStat(currentItem).rc >= 1)) {
            liElem = $("#option-audio");
            buttonElem = liElem.find("button");
            if (!enableAutoPlayWhenIncorrect && !$("#answer-form fieldset").hasClass("correct")) {
                audioAutoplay = false;
            }
            buttonElem.removeAttr("disabled");
            audioElem = $("<audio></audio>", { autoplay: audioAutoplay }).appendTo(liElem.removeClass("disabled").children("span"));
            $("<source></source>", {
                src: "https://s3.amazonaws.com/s3.wanikani.com/audio/" + currentItem.aud,
                type: "audio/mpeg"
            }).appendTo(audioElem);
            $("<source></source>", {
                src: "https://s3.amazonaws.com/s3.wanikani.com/audio/" + currentItem.aud.replace(".mp3", ".ogg"),
                type: "audio/ogg"
            }).appendTo(audioElem);
            audioElem[0].addEventListener("play", function () {
                buttonElem.removeClass("audio-idle").addClass("audio-play");
            });
            audioElem[0].addEventListener("ended", function () {
                buttonElem.removeClass("audio-play").addClass("audio-idle");
            });
            buttonElem.off("click");
            buttonElem.on("click", function () {
                audioElem[0].play();
            });
            liElem.off("click");
            liElem.on("click", function () {
                if ($("#user-response").is(":disabled")) {
                    $("audio").trigger("play");
                }
            });
        }
    };
    console.log('WaniKani Review Audio Tweak: script load end');
}());
