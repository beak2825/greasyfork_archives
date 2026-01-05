// ==UserScript==
// @name          MLG NoRedInk
// @namespace     http:/penple.org/
// @description	  *hitmarker*
// @include       https://www.noredink.com/learn/quiz/*
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/24174/MLG%20NoRedInk.user.js
// @updateURL https://update.greasyfork.org/scripts/24174/MLG%20NoRedInk.meta.js
// ==/UserScript==

$(document).ready(function() {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'http://soundboard.panictank.net/HITMARKER.mp3');
        //audioElement.load()

        $.get();

        audioElement.addEventListener("load", function() {
            if ($(".banner-text").html() == "Correct!") {
                audioElement.setAttribute('src', 'http://soundboard.panictank.net/2SAD4ME.mp3');
            }
            audioElement.play();
        }, true);

        $('#submit-answer').click(function() {
            audioElement.setAttribute('src', 'http://soundboard.panictank.net/HITMARKER.mp3');
            audioElement.play();
        });
    });