// ==UserScript==
// @name         Braains.io Assistant
// @icon         http://i.imgur.com/Uty76J1.png
// @namespace    https://greasyfork.org/users/90770
// @version      0.11
// @description  Allows you to toggle shop & chat window with keyboard. More coming idk when.
// @author       n0thing
// @match        http://braains.io/*
// @grant        none
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/439567/Braainsio%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/439567/Braainsio%20Assistant.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener('load', function() { //run script on page load
        var check = false,
            keyShop = 32, //toggle shop key 32 = SPACEBAR
            keyChat = 69, //toggle chat key 69 = E
            enableChat = true,
            enableShop = true;

        document.getElementById('message').onblur = function() {
            check = false;
        }; //chat DOESN'T have focus
        document.getElementById('message').onfocus = function() {
            check = true;
        }; //chat HAS focus

        document.body.addEventListener('keyup', function() {

            //toggle shop
            if (parseInt(event.keyCode) === keyShop&&enableShop === true&&check === false) {
                if (document.getElementById('modd-shop-modal').getAttribute('style') === 'display: block;') { //checks if shop is open
                    document.getElementById('modd-shop-modal').click();
                } // if yes, close it
                else {
                    document.getElementById('modd-shop-div').getElementsByTagName('button')[0].click();
                } //else, open it
            }

            //toggle chat
            if (parseInt(event.keyCode) === keyChat&&enableChat === true&&check === false) {
                if (document.getElementById('chat-box').getAttribute('style') === 'bottom: 0px; display: none') { //if hidden
                    document.getElementById('chat-box').setAttribute('style', 'bottom: 0px; display: block');
                } //then make it appear
                else {
                    document.getElementById('chat-box').setAttribute('style', 'bottom: 0px; display: none');
                } //else hide it
            }

            if (parseInt(event.keyCode) === 0 &&check === false){
                var z = 4;while(z--){document.getElementById('confirm-purchase-button').click();}}
        });
    }, true);
})();