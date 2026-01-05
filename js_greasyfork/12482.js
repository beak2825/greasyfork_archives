// ==UserScript==
// @name        plug.dj script
// @namespace   fdsfdsfds
// @description Remove please donate advertismenet and make the chat big again.
// @include     https://plug.dj/*
// @version     0.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/12482/plugdj%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/12482/plugdj%20script.meta.js
// ==/UserScript==

function waitAndRegister() {
    setTimeout(function(){ 
        if(typeof(API) === 'undefined' || API.enabled !== true) { 
            waitAndRegister();
        } else {
            var donatebox = document.getElementById('donate-box');
            var donatebox_height = donatebox.offsetHeight;
            var chatbox = document.getElementById('chat-messages');
            
            chatbox.className = '';
            donatebox.style.display = 'none';
            
            var height = parseInt(chatbox.style.height.split('px')[0]) + donatebox_height;
            chatbox.style.height = height + 'px';
        }
    }, 1000);
};
waitAndRegister();