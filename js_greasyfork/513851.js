// ==UserScript==
// @name         Allegro Alert
// @namespace    http://tampermonkey.net/
// @version      2024-10-24
// @description  Wyświetla alert/powiadomienie przed dokonaniem zakupu w serwisie Allegro.pl
// @author       JustGreg
// @match        https://allegro.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=allegro.pl
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/513851/Allegro%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/513851/Allegro%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var alertText = "Tekst powiadomienia"

    function sendAlert () {
        alert(alertText);
    }

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        if(document.querySelector('[id^=buy-and-pay-form]')) {
            //observer.disconnect();
            sendAlert();
        }
    }

    if(document.URL.includes("https://allegro.pl/transakcja")) {
        sendAlert();
    }
})();