// ==UserScript==
// @name         Automatyczny Czat Na Zywo Youtube v4
// @version      4
// @author       WeedTV
// @description  Podziękowania dla WeedTV za ten niesamowity kawałek kodu i przerobienie orginału :)
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @match        https://www.youtube.com/live_chat*
// @match        https://www.youtube.com/live_chat_replay*
// @namespace https://greasyfork.org/users/1386071
// @downloadURL https://update.greasyfork.org/scripts/516133/Automatyczny%20Czat%20Na%20Zywo%20Youtube%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/516133/Automatyczny%20Czat%20Na%20Zywo%20Youtube%20v4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const chatContainer = document.querySelector('yt-live-chat-renderer');
        if (chatContainer) {
            const sortButton = chatContainer.querySelector('yt-dropdown-menu');
            if (sortButton) {
                sortButton.click();

                setTimeout(() => {
                    const sortOptions = document.querySelectorAll('tp-yt-paper-item');
                    if (sortOptions.length > 1) {
                        sortOptions[1].click(); // Wybiera drugą opcję sortowania (zakładając, że to "Najnowsze")
                    }
                }, 500);
            }
        }
    }, 2000);
})();