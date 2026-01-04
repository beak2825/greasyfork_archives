// ==UserScript==
// @name         Amazon Music in Dauerschleife - "Hörst du noch zu?" JA!!! 
// @name:en         Amazon Music Autoplay - Prevent the annoying "Are you still listening?" prompt
// @description:en Prevents Amazon Music from asking the user if they are still listening and automatically keeps playing the music. Only works for the german version of Amazon Music.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Verhindert, dass Amazon Music fragt ob man noch zuhört. Die lästige "hörst du noch zu?" Meldung wird automatisch mit einem Klick auf den Button weggeklickt. Funktioniert nur für die deutsche Version von Amazon Music.
// @author       You
// @match        https://music.amazon.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.de
// @grant        none
// @require http://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452873/Amazon%20Music%20in%20Dauerschleife%20-%20%22H%C3%B6rst%20du%20noch%20zu%22%20JA%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/452873/Amazon%20Music%20in%20Dauerschleife%20-%20%22H%C3%B6rst%20du%20noch%20zu%22%20JA%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function () {

        if($('#dialogButton1').textContent == 'Ja, weiterspielen')
        {
            $('#dialogButton1').click();
        }



    }, 1000);


    // Your code here...
})();