// ==UserScript==
// @name         Tlačítko pro Fonbet
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generuje tlačítko pro live url
// @author       Michal
// @match        https://new.fon.bet/sports/football/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478524/Tla%C4%8D%C3%ADtko%20pro%20Fonbet.user.js
// @updateURL https://update.greasyfork.org/scripts/478524/Tla%C4%8D%C3%ADtko%20pro%20Fonbet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractEventIdFromURL(url) {
        var match = url.match(/sports\/football\/\d+\/(\d+)/);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    }

    function addLiveURLButtonsToEvent(eventDiv) {
        var linkElement = eventDiv.querySelector('a[href*="sports/football/"]');
        if (linkElement) {
            var url = linkElement.href;
            var eventId = extractEventIdFromURL(url);

            if (eventId) {
                var liveURL1 = `https://clientsapi01w.bk6bba-resources.com/service-tv/mobile/mc?app_name=mobile_site&eventId=${eventId}&lang=en&sysId=2&page=stats-1`;
                var liveURL2 = `https://clientsapi02w.bk6bba-resources.com/service-tv/mobile/mc?app_name=mobile_site&eventId=${eventId}&lang=en&sysId=2&page=stats-1`;

                var button1 = document.createElement('a');
                button1.href = liveURL1;
                button1.textContent = 'Live URL 1';
                button1.setAttribute('target', '_blank');
                button1.style.marginLeft = '10px';

                var button2 = document.createElement('a');
                button2.href = liveURL2;
                button2.textContent = 'Live URL 2';
                button2.setAttribute('target', '_blank');
                button2.style.marginLeft = '10px';

                eventDiv.appendChild(button1);
                eventDiv.appendChild(button2);
            }
        }
    }

    function observeForEvents(mutationsList) {
        mutationsList.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && node.classList.contains('sport-base-event--W4qkO')) {
                        addLiveURLButtonsToEvent(node);
                    }
                });
            }
        });
    }

    var observer = new MutationObserver(observeForEvents);

    observer.observe(document.body, { childList: true, subtree: true });
})();