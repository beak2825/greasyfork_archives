// ==UserScript==
// @name         Dezgo Notifier
// @namespace    com.erza.fortyfive
// @version      2024-12-26
// @description  Notify on image generation
// @author       You
// @match        https://dezgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dezgo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521882/Dezgo%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/521882/Dezgo%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let last_state = null;

    function notify(){
        Notification.requestPermission()
            .then(permission => {
            if (permission === 'granted') {
                // User granted permission, create a notification
                new Notification('Notification Title', {
                    body: 'Image generation complete!!'
                });
            } else {
                // User denied or defaulted permission, handle accordingly
                console.log('User denied or defaulted notification permission.');
            }
        });
    }
    //setTimeout(notify,5000);
    setInterval(() => {
        const current_state = document.querySelector('.mud-progress-circular');
        if(last_state != current_state && current_state == null){
            notify();
        }
        last_state = current_state;
    },500);
})();