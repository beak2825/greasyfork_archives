// ==UserScript==
// @name         OnlineAlteration
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Изменение кнопки онлайн
// @author       Уэнсдэй
// @match        *://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475416/OnlineAlteration.user.js
// @updateURL https://update.greasyfork.org/scripts/475416/OnlineAlteration.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function replaceOnlineMarkers() {

        const markers = document.querySelectorAll('.onlineMarker');


        markers.forEach(marker => {

            const newMarker = document.createElement('span');
            newMarker.className = 'userOnlineNow Tooltip';
            newMarker.setAttribute('title', '');
            newMarker.setAttribute('data-cachedtitle', 'Сейчас онлайн');
            newMarker.setAttribute('tabindex', '0');
            newMarker.textContent = 'В сети';


            marker.parentNode.replaceChild(newMarker, marker);
        });
    }


    replaceOnlineMarkers();
})();
