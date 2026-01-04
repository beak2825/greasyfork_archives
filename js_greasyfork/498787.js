// ==UserScript==
// @name         Gota INV script
// @namespace    http://tampermonkey.net/
// @version      2024-06-24
// @description  Script to send team invite to players by a single click. Just click on any profile on the chat window to send the invite.
// @author       GotaWala
// @match        https://gota.io/web/
// @icon         https://image.pngaaa.com/756/5740756-middle.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498787/Gota%20INV%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/498787/Gota%20INV%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href ==='https://gota.io/web/'){
        // container element for chat box
        let chatContainer = document.getElementById('chat-container')
        document.addEventListener('click',(e)=>{
            // check if the click happened inside the chat container
            if(chatContainer.contains(e.target)){
                //right click on selected user
                e.target.dispatchEvent(new MouseEvent("contextmenu"));
                //click 'inv' on context menu
                document.getElementById('menu-invite').dispatchEvent(new MouseEvent("click"));
                //hide context menu
                document.getElementById('context-menu').style.display='none'}
        })
}

})();