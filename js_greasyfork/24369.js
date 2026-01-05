// ==UserScript==
// @name         Gab.ai Connection Status
// @namespace    https://www.ekkooff.com/
// @version      0.1
// @description  Gray out notification area when disconnected from updates and try to reconnect.
// @author       Kevin Roberts
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24369/Gabai%20Connection%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/24369/Gabai%20Connection%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function() {
        var state = null,count=null;
        if(Pusher && Pusher.instances[0] && Pusher.instances[0].connection && Pusher.instances[0].connection.state) {
            state = Pusher.instances[0].connection.state;
        } else {
            return;
        }
        //console.log('state:',state);
        if(state==='disconnected') {
            count = $('.notification-count span');
            count.css('background-color','#444');
            count.removeClass('hidden');
            Pusher.instances[0].connection.connect();
        } else {
            count = $('.notification-count span');
            count.css('background-color','');
            if(parseInt(count.text()) === 0) {
                count.addClass('hidden');
            }
        }
    },5000);
})();