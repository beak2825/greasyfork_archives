// ==UserScript==
// @name         Zautomatyzowane klikanie w ankiecie, cookie remover
// @namespace    http://tampermonkey.net/
// @version      0.0.0.0.1
// @description  Ankieta
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @author
// @match        https://korsokolbuszowskie.pl/wiadomosci/dla-kogo-norbert-tylutki*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=korsokolbuszowskie.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499275/Zautomatyzowane%20klikanie%20w%20ankiecie%2C%20cookie%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/499275/Zautomatyzowane%20klikanie%20w%20ankiecie%2C%20cookie%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    $(document).ready(function() {
        document.cookie = 'poll_voted_188="";-1; path=/wiadomosci/dla-kogo-norbert-tylutki-ma-przekazac-w-tym-miesiacu-diete-radnego-mozesz-oddac-swoj-glos';
        let rand_click_time = randomIntFromInterval(250,1000);
        console.log(rand_click_time);

        setInterval(function() {
            if ($('.poll').length > 0) {
                setTimeout(function() {
                    $("label[for='pollOption_poll_188_option_722']").click();

                    setTimeout(function() {
                        $('.poll__single-votebar > .btn').click();
                        setTimeout(function(){
                            window.location.reload();
                            }, 500);
                    }, rand_click_time);

                }, 100);
            }
        }, 1000);
    });
})();