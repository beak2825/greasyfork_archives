// ==UserScript==
// @name         LZT_MagicButton
// @namespace    LZT_MagicButton
// @version      3.2
// @description  волшебная кнопка
// @author       You
// @license      MIT
// @match        http*://zelenka.guru/threads/*
// @match        http*://lolz.live/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471826/LZT_MagicButton.user.js
// @updateURL https://update.greasyfork.org/scripts/471826/LZT_MagicButton.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $( document ).ready(function() {
        console.log('started');
        let $participateButton = $('.LztContest--Participate')[0];

        if (!($participateButton)) return;
        $participateButton.scrollIntoView()

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes") {
                    if (mutation.attributeName == "disabled"){
                        $participateButton.click();
                    }
                }
            });
        });
        observer.observe($participateButton, {
                attributes: true
            });

    });
})();

