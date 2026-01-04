// ==UserScript==
// @name         La Presse ad-blocker remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  tRemove ad-blocker
// @author       woodspire
// @match        http://lapresse.ca/*
// @match        https://lapresse.ca/*
// @match        http://www.lapresse.ca/*
// @match        https://www.lapresse.ca/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422050/La%20Presse%20ad-blocker%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/422050/La%20Presse%20ad-blocker%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var func = (function() {
        console.log('remove lapresse ad-blocker detector');
        var closeButton = document.querySelectorAll('.fc-ab-root .fc-close');

        if (closeButton.length) {
            closeButton[0].click();
        }


        console.log('remove lapresse ad-blocker');

        var footers = document.getElementsByClassName("brz_msg_wall_body");

        if (footers.length) {
            console.log('removing footer blocker');
            footers[0].parentElement.remove();

            document.body.style.overflow = '';
        }

        var message = document.querySelectorAll('*[id^="sp_message_id"]');

        if (message) {
            var btn = document.getElementById('Fermer');

            if (btn) {
                console.log('removing message');
                btn.click();
            }
        }

    });

    setTimeout(func, 1500);
})();