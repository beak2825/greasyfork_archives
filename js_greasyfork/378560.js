// ==UserScript==
// @name         Simplenote DarkTheme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://app.simplenote.com/
// @grant        none
// @exclude      http://www.google.co.jp/*
// @require      //ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378560/Simplenote%20DarkTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/378560/Simplenote%20DarkTheme.meta.js
// ==/UserScript==

(function($) {

    const BACKGROUND = "#1E1E1E";
    const FOREGROUND = "#DCDCDC";

    $(window).on('load', function() {

        // ------------------ Search ------------------

        document.getElementsByClassName('searchfield')[0].style.color = FOREGROUND;

        // ------------------ Note ------------------

        //document.getElementsByClassName('note-preview-title')[0].style.color = FOREGROUND;
        //document.getElementsByClassName('note-preview-line')[0].style.color = FOREGROUND;

        // ------------------ Content ------------------

        // Background color
        document.getElementsByClassName('app')[0].style.backgroundColor = BACKGROUND;

        // Font color
        document.getElementById('txtarea').style.color = FOREGROUND;

        //alert('Hello World!');
    });

})(jQuery);