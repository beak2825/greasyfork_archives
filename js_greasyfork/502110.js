// ==UserScript==
// @name         Gota Team INV spam script
// @namespace    http://tampermonkey.net/
// @version      2024/12/25
// @description  Spam team invites to players
// @author       GotaWala
// @match        https://gota.io/web/
// @icon         https://i.ytimg.com/vi/sN2Sh-RpOeM/maxresdefault.jpg
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// *************************************************************************************************
// *************************************************************************************************
// Press Ctrl+Y to pause sending invites
// Press Ctrl+M to continue sending invites
// *************************************************************************************************
// *************************************************************************************************
// @downloadURL https://update.greasyfork.org/scripts/502110/Gota%20Team%20INV%20spam%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/502110/Gota%20Team%20INV%20spam%20script.meta.js
// ==/UserScript==
var sendMoreInv = true;
(function() {
    'use strict';

    // Your code here...

    if (window.location.href ==='https://gota.io/web/'){
        const targetNode = document.getElementById("chat-body-0");
        const config = { childList: true };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                const e = mutation.addedNodes[0];
                const chatName = $(e).find('.chat-name');
                const teamCanvas = $('#party-panel').find('canvas');
                if(teamCanvas && teamCanvas[0] && teamCanvas[0].height<230){
                    if(chatName.length>0 && sendMoreInv){
                        //right click on selected user
                        chatName[0].dispatchEvent(new MouseEvent("contextmenu"));
                        //click 'inv' on context menu
                        document.getElementById('menu-invite').dispatchEvent(new MouseEvent("click"));
                        //hide context menu
                        document.getElementById('context-menu').style.display='none'

                        console.log('Sent Invite to '+ chatName.attr('data-player-id') + ' ' + chatName.text());
                    }
                }
            }
        }
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    document.addEventListener('keydown', function(event) {
    // Check if the key combination Ctrl + Y is pressed
    if (event.ctrlKey && event.key === 'y') {
        // Prevent default browser action if necessary
        event.preventDefault();
        sendMoreInv = false;
        console.log('Stopping automatic team invites.....')
    }
    else if(event.ctrlKey && event.key ==='m'){
        event.preventDefault();
        sendMoreInv = true;
        console.log('Starting automatic team invites!')
    }
});
}
)();

