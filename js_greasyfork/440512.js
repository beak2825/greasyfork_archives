// ==UserScript==
// @name         Dappervolk: Pet Profile Features
// @description  Automatically pat and chat with active pet, left and right arrow on keyboard navigate between pets
// @namespace    https://greasyfork.org/en/users/547396
// @author       https://greasyfork.org/en/users/547396
// @match        *://dappervolk.com/pet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dappervolk.com
// @grant        none
// @license      none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/440512/Dappervolk%3A%20Pet%20Profile%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/440512/Dappervolk%3A%20Pet%20Profile%20Features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pet_nav = document.querySelector('div.pet-navigate-links'),
          message_box = document.createElement('div'),
          pet_pat = document.querySelector('a.pet-pat'),
          pet_chat = document.querySelector('a.pet-chat');

    // append message box
    message_box.style.position = 'fixed';
    message_box.style.top = '2rem';
    message_box.style.right = '2rem';
    document.body.appendChild(message_box);

    // pat and chat, different intervals to reduce errors
    setTimeout( function() {
        patAndChat('pat', pet_pat);
    }, 1200 );

    setTimeout( function() {
        patAndChat('chat', pet_chat);
    }, 2200 );


    // add event listener to body for left/right arrows
    document.addEventListener('keydown', function(e) {
        let back = pet_nav.querySelectorAll('a')[0].href,
            fwd = pet_nav.querySelectorAll('a')[1].href;

        switch (e.keyCode) {
            case 37:
                window.location.href = back;
                break;
            case 39:
                window.location.href = fwd;
                break;
        }
    });

    function patAndChat( parm, action ) {
        let frame_url = action.getAttribute('data-url');
        let active = action.classList.contains('active');

        if (active) {
            const iframe = document.createElement('iframe');
            iframe.id = parm;
            iframe.src = frame_url;
            iframe.width = '1px';
            iframe.height = '1px';
            document.body.appendChild(iframe);
            action.classList.add('disabled');

            let message = document.createElement('div');
            message.innerText = `Pet has been ${parm}`;
            message_box.appendChild(message);
            message.style.padding = '1rem';
            message.style.borderRadius = '0.5rem';
            message.style.background = '#3bb135';
            message.style.color = '#fff';
            message.style.margin = '0 0 1rem 0';

            setTimeout( function() {
                message_box.removeChild(message);
            }, 1500 );
        }
    }

})();