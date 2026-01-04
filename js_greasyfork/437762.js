// ==UserScript==
// @name         Move Gmail reply buttons to top of conversation
// @namespace    https://www.taylrr.co.uk/
// @version      0.1
// @description  Gmail puts the "reply", "reply all" and "forward" buttons at the bottom of the conversation. This script adds buttons for these actions to the toolbar at the top of the conversation alongside the "Archive" button.
// @author       taylor8294
// @match        https://mail.google.com/mail/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @license      GPLv3
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/437762/Move%20Gmail%20reply%20buttons%20to%20top%20of%20conversation.user.js
// @updateURL https://update.greasyfork.org/scripts/437762/Move%20Gmail%20reply%20buttons%20to%20top%20of%20conversation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let addBtns = function(){
        console.log("[addBtns called]");
        let archiveBtn = document.querySelector('[gh="mtb"] [title="Archive"]'),
            replyClass = document.querySelector('[act="94"] img')?.classList.length ? document.querySelector('[act="94"] img').classList[0] : "mL",
            replyAllClass = document.querySelector('[act="24"] img')?.classList.length ? document.querySelector('[act="24"] img').classList[0] : "mK",
            forwardClass = document.querySelector('[act="25"] img')?.classList.length ? document.querySelector('[act="25"] img').classList[0] : "mI";

        if(archiveBtn){
            if(archiveBtn.matches(':first-child')){
                let reply = document.createElement('DIV');
                reply.setAttribute('class',archiveBtn.className);
                reply.setAttribute('act','94');
                reply.setAttribute('role','button');
                reply.setAttribute('tabindex','0');
                reply.setAttribute('jslog','');
                reply.setAttribute('data-tooltip','Reply');
                reply.setAttribute('aria-label','Reply');
                reply.style.userSelect = 'none';
                reply.innerHTML = `<div class="${archiveBtn.firstElementChild.className}"><div class="${replyClass} ${Array.from(archiveBtn.firstElementChild.firstElementChild.classList).slice(1).join(' ')}"></div></div>`;
                reply.addEventListener("click", (e)=>{let btns = Array.from(document.querySelectorAll('[role="presentation"] [role="link"]')).filter(n => n.innerText.trim()=='Reply'); if(btns.length) btns[0].click()}, false);

                let replyAll = document.createElement('DIV');
                replyAll.setAttribute('class',archiveBtn.className);
                replyAll.setAttribute('act','24');
                replyAll.setAttribute('role','button');
                replyAll.setAttribute('tabindex','0');
                replyAll.setAttribute('jslog','');
                replyAll.setAttribute('data-tooltip','Reply to all');
                replyAll.setAttribute('aria-label','Reply to all');
                replyAll.style.userSelect = 'none';
                replyAll.innerHTML = `<div class="${archiveBtn.firstElementChild.className}"><div class="${replyAllClass} ${Array.from(archiveBtn.firstElementChild.firstElementChild.classList).slice(1).join(' ')}"></div></div>`;
                replyAll.addEventListener("click", (e)=>{let btns = Array.from(document.querySelectorAll('[role="presentation"] [role="link"]')).filter(n => n.innerText.trim()=='Reply to all'); if(btns.length) btns[0].click()}, false);

                let forward = document.createElement('DIV');
                forward.setAttribute('class',archiveBtn.className);
                forward.setAttribute('act','25');
                forward.setAttribute('role','button');
                forward.setAttribute('tabindex','0');
                forward.setAttribute('jslog','');
                forward.setAttribute('data-tooltip','Forward');
                forward.setAttribute('aria-label','Forward');
                forward.style.userSelect = 'none';
                forward.innerHTML = `<div class="${archiveBtn.firstElementChild.className}"><div class="${forwardClass} ${Array.from(archiveBtn.firstElementChild.firstElementChild.classList).slice(1).join(' ')}"></div></div>`;
                forward.addEventListener("click", (e)=>{let btns = Array.from(document.querySelectorAll('[role="presentation"] [role="link"]')).filter(n => n.innerText.trim()=='Forward'); if(btns.length) btns[0].click()}, false);

                archiveBtn.parentElement.prepend(forward);
                archiveBtn.parentElement.prepend(replyAll);
                archiveBtn.parentElement.prepend(reply);
                console.log("[addBtns added ",reply,replyAll,forward,"]");
            } else {
                console.log("[Buttons already present? Did not add]");
            }
        } else {
            console.log('[archiveBtn not found]');
        }
    }

    if( document.readyState !== 'loading' ) {
        setTimeout(addBtns,2000)
    } else {
        document.addEventListener('DOMContentLoaded', (e)=>{
            setTimeout(addBtns,2000)
        });
    }
    document.arrive('[gh="mtb"] [title="Archive"]', function () {
        console.log("[Archive button spotted]");
        addBtns();
    });

})();