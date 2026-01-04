// ==UserScript==
// @name         Average On Available Message for Webcamdarts
// @namespace    https://greasyfork.org/en/users/913506-alexisdot
// @version      0.1.1
// @description  Adds the average of the player to their available message, also reloads the userlist on every available message to maximize the chance to find the user in it.
// @author       AlexisDot
// @license      MIT
// @match        https://www.webcamdarts.com/GameOn/Lobby*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webcamdarts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445773/Average%20On%20Available%20Message%20for%20Webcamdarts.user.js
// @updateURL https://update.greasyfork.org/scripts/445773/Average%20On%20Available%20Message%20for%20Webcamdarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- average on available message -------------- */
    let chatWrapper = document.querySelector('#chatWindow');
    let observerConfig = { attributes: false, childList: true, characterData: false };

    var availableObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node){
                if(node.querySelector('.stausicon.available') !== null){
                    let msgTxt = node.querySelector('.mc-m');
                    let userName = msgTxt.textContent.split(' is available for games')[0];
                    let ownName = document.querySelector('div.currenuser-info p:first-child').textContent;
                    LoadUserList(ownName);
                    setTimeout(function(){
                    let userAvgElement = document.querySelector(`div.rMenu.userli[value="${userName}"] .fn`);
                        if(userAvgElement !== null) {
                            let avg = userAvgElement.textContent;
                            node.querySelector('.stausicon.available').insertAdjacentHTML('afterend', `<strong class="available-avg uwdal-clickable">(${avg})&nbsp;</strong>`);
                            node.querySelector('.mc-m').classList.add('uwdal-clickable');
                            node.querySelector('.stausicon.available').classList.add('uwdal-clickable');
                        }
                    }, 500);
                }
            })
        });
    });

    availableObserver.observe(chatWrapper, observerConfig);

})();