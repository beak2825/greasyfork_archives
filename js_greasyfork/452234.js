// ==UserScript==
// @name         Whatsapp-Web Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide messages of certain group members on WhatsappWeb
// @author       Ahmed Abdelwahed
// @match        https://web.whatsapp.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452234/Whatsapp-Web%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/452234/Whatsapp-Web%20Blocker.meta.js
// ==/UserScript==

//add the numbers you want to block here (in the same format as in Whatsapp Web)
let blocked = ['+20 111 222 3333', '+20 123 456 7890'];
//add the emoji to replace the messages
let emoji = '&#128519;';

function removeBlocked() {
    let msgs = document.querySelectorAll("div[data-testid='msg-container']");
    for (let i = 0; i < msgs.length; i++) {
        let spans = msgs[i].getElementsByTagName('span');

        for (let j =0; j< blocked.length; j++){
            if(spans[0].textContent==blocked[j] || spans[1].textContent==blocked[j]){
                msgs[i].parentNode.innerHTML = '<span>'+emoji+'</span>';
            }
        }
    }
}

// This part adds the event listners when you click on any conversation from the left panel
function addListeners(){
    document.addEventListener('click',removeBlocked);
    document.querySelector("div[data-testid='conversation-panel-messages']").addEventListener('scroll',removeBlocked);
}
document.addEventListener('click',addListeners);
