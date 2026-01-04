// ==UserScript==
// @name         Twitch userlist refresh
// @namespace    https://www.twitch.tv/ghryphen
// @author       Ghryphen
// @version      1.0
// @match        https://www.twitch.tv/*
// @icon         https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png
// @description  Auto refresh userlist while in mod view
// @downloadURL https://update.greasyfork.org/scripts/423928/Twitch%20userlist%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/423928/Twitch%20userlist%20refresh.meta.js
// ==/UserScript==

(function() { 'use strict';
  
    const PressRefresh = () => {
        const refreshButton = document.querySelector('[data-test-selector="chat-viewers__refresh"]');
        
        if (refreshButton) {
            refreshButton.click();
            console.log('Refresh button is pressed');
        }
    };
             
    setInterval(PressRefresh, 10000);

})();