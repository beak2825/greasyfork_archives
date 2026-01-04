// ==UserScript==
// @name         KG_ChatFunctions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open and Hide chat (GameList Page && Game Page)
// @author       I am
// @include      https://klavogonki.ru/g*
// @include      http://klavogonki.ru/g*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404430/KG_ChatFunctions.user.js
// @updateURL https://update.greasyfork.org/scripts/404430/KG_ChatFunctions.meta.js
// ==/UserScript==

var space = 32; // Space Key
var hide = document.querySelector('.hide-bar');
var chatGeneral = document.querySelector('#chat-general').style.display == 'none';
var field = document.querySelectorAll('.text');

window.addEventListener('keydown', checkKeyPress, false);

function checkKeyPress(key) {

    if (key.ctrlKey && key.which == space) {
        if (chatGeneral == false) {
            hide.click();
            field[0].focus();
        }
        else if (chatGeneral == true) {
            hide.click();
            field[1].focus();
        }

    }
    else if (key.shiftKey && key.which == space) {

        if (chatGeneral == false) {
            field[0].focus();
        }
        else if (chatGeneral == true && document.querySelector('#speed-label').innerHTML == "" || document.querySelector('#speed-label').innerHTML < 1) {
            field[1].focus();
        }

    }
}