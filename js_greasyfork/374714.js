// ==UserScript==
// @name         Best Hack evru day
// @version      0.23
// @description  Allows the player to access the shop without having to go to the shopkeeper, similar to the old Braains.io.
// @match        http://braains.io/*
// @run-at document-start
// @namespace https://greasyfork.org/users/90770
// ==/UserScript==

//

(function() {
    'use strict';
    window.addEventListener('load',function(){ //run script on page load

        var check = true,

// <============= SETTINGS =============>

            toggleshopkey = 81,
            togglechatkey = 69,
            /* To change the toggle shop/chat key, replace the number with the keyCode of your key. Use www.keycode.info to find the keyCode number.
        WARNING: do this at your own risk, as some keys may interfere with the game! (eg. WASD, Arrow keys, Tab, Shift, Enter) */

            enableStatsWindow = true, //toggle open shop via Stats window
            enableShopKeyboardShortcut = true, //toggle open/close shop via keyboard shortcut
            enableClicktoClose = true, //enable or disable click to close shop
            enableChatKeyboardShortcut = true; //toggle open/close chat via keyboard shortcut
        //Change the status to "true" or "false" (no quotation marks) to turn on or off the features. By default all are on.

// <============= END SETTINGS =============>

        document.getElementsByTagName("body")[0].onkeyup = function() {
            if (parseInt(event.keyCode) == toggleshopkey ){toggleshop();}
            else if (parseInt(event.keyCode) == togglechatkey ){togglechat();}
        }; //toggleshop when togglekey pressed

        document.getElementsByTagName("body")[0].onclick = function() {if (enableClicktoClose === true){
            if (document.getElementById('shop-modal').getAttribute('style') === 'display: block'){
                document.getElementById('shop-modal').setAttribute('style', 'display: hidden');}
        }}; //similar to toggleshop() but only checks if open and closes it. used for the click to close feature.

        document.getElementById("shop-modal").getElementsByTagName("*")[7].onclick = function() {toggleshop();};
        //toggleshop when X button is clicked

        document.getElementById("my-score-div").onclick = function() {if (enableStatsWindow === true){toggleshop();}};
        //toggleshop when stats window clicked

        document.getElementById("message").onblur = function(){check = true;}; //textbox DOESN'T have focus
        document.getElementById("message").onfocus = function(){check = false;}; //textbox HAS focus

        function toggleshop() { // hide/show shop
            if (enableShopKeyboardShortcut === true){
                if (check === true){ //checks if chat is NOT focussed
                    if (document.getElementById('shop-modal').getAttribute('style') != 'display: block') {
                        document.getElementById('shop-modal').setAttribute('style', 'display: block');
                    } else {
                        document.getElementById('shop-modal').setAttribute('style', 'display: hidden');
                    }
                }
            }
        }

        function togglechat() { // hide/show chatbox
            if (enableChatKeyboardShortcut === true){
                if (check === true){ //checks if chat is NOT focussed
                    if (document.getElementById('chat-box').getAttribute('style') != 'bottom: 0px; display: block') {
                        document.getElementById('chat-box').setAttribute('style', 'bottom: 0px; display: block');
                    } else {document.getElementById('chat-box').setAttribute('style', 'bottom: 0px; display: hidden');
                           }
                }
            }
        }
    },true);
})();
//m0dE if you are reading this, redesign the damn shop as it's really hard to fight for resources!