// ==UserScript==
// @name         Clickable Available Message for Webcamdarts
// @namespace    https://greasyfork.org/en/users/913506-alexisdot
// @version      0.1.1
// @description  Make the available message in the Webcamdarts lobby clickable
// @author       AlexisDot
// @license      MIT
// @match        https://www.webcamdarts.com/GameOn/Lobby*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webcamdarts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445774/Clickable%20Available%20Message%20for%20Webcamdarts.user.js
// @updateURL https://update.greasyfork.org/scripts/445774/Clickable%20Available%20Message%20for%20Webcamdarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* --------clickable available Messages --------- */
    document.addEventListener('click', function(e){
        if(e.target.matches('.mc-m') || e.target.matches('.stausicon.available') || e.target.matches('.available-avg')) {
            let msgWrapper = e.target.closest('.mc-l');
            if(msgWrapper.querySelector('.stausicon.available')) {
                let msgTxt = msgWrapper.querySelector('.mc-m');
                let userListElement = document.querySelector(`div.rMenu.userli[value="${msgTxt.textContent.split(' is available for games')[0]}"]`);
                if(userListElement !== null) {
                    userListElement.click();
                }
            }
        }
    })


})();