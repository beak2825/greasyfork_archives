// ==UserScript==
// @name         Telegram without Muted
// @namespace    hidemuted.telegram.aurium.one
// @version      1.1
// @description  Hide muted chats from chat list.
// @author       Aurélio A. Heckert
// @match        https://web.telegram.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369335/Telegram%20without%20Muted.user.js
// @updateURL https://update.greasyfork.org/scripts/369335/Telegram%20without%20Muted.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyRole(li) {
        li.style.display = toggler.checked ? 'none' : 'block';
    }
    function updateChatList() {
        //jQuery('.im_dialog_badge_muted').parents('li.im_dialog_wrap').hide();
        document.querySelectorAll('li.im_dialog_wrap').forEach((li)=> {
            if (li.querySelector('.im_dialog_badge_muted')) applyRole(li);
        });
    }

    // It may be removed, so test and retry forever.
    function addNoiseTogglerBtn() {
        if (document.querySelector('#noiseToggler')) return; // It is ok, for now.
        toggler = document.createElement('input');
        toggler.id = 'noiseToggler';
        toggler.type = 'checkbox';
        toggler.title = 'Hide muted chats.';
        toggler.checked = true;
        toggler.style.float = 'right';
        toggler.style.margin = '15px 10px';
        toggler.onclick = updateChatList;
        console.log('Try to Insert noiseToggler Btn...')
        try {
            var topBar = document.querySelector('.tg_head_main_peer_wrap');
            topBar.insertBefore(toggler, topBar.firstChild);
            //topBar.appendChild(toggler);
            console.log('>>> Insert noiseToggler Btn Success!')
        } catch(err) {
            console.log('Fail to Insert noiseToggler Btn.')
        }
    }
    setInterval(addNoiseTogglerBtn, 2000);

    setInterval(()=> {
        try {
            updateChatList()
        } catch(err) {
            console.log('Deu merda.', err)
        }
    }, 2000);

})();