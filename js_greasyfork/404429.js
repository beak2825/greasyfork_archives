// ==UserScript==
// @name         KG_UsersCounter_CharCounter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show information about total user online in the chat and total chars in the input field
// @author       SpasChat
// @include      https://klavogonki.ru/g*
// @include      http://klavogonki.ru/g*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404429/KG_UsersCounter_CharCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/404429/KG_UsersCounter_CharCounter.meta.js
// ==/UserScript==

// Global Variables
var userPanel = document.querySelector('.dummy');

if (window.location.href.indexOf("gmid") != -1) {
    var userListContainer = document.querySelectorAll('.userlist')[1];
    var input = document.querySelectorAll('.text')[1];
    console.log(userPanel);
} else {
    userListContainer = document.querySelectorAll('.userlist')[0];
    input = document.querySelectorAll('.text')[0];
    console.log(userPanel);
}
var usersCounter = userPanel.appendChild(document.createElement('p'));

// KG_ChatUserCounter

setInterval(function(){
    usersCounter.innerHTML = userListContainer.childElements()[0].childElementCount;
}, 1000);

usersCounter.style.cssText =
'display: flex;' +
'height: 16px;' +
'width: 32px;' +
'background: #1b1b1b;' +
'justify-content: center;' +
'position: absolute;' +
'top: 0;' +
'right: 35px;' +
'align-items: center;' +
'font: 12px Consolas;' +
'border: 1px solid #74ADD4;' +
'color: #74ADD4;' +
'z-index: 1;';


// KG_ChatCharCounter

var charCounter = userPanel.appendChild(document.createElement('p'));

charCounter.style.cssText =
'width: 32px;' +
'height: 16px;' +
'font: 12px Consolas;' +
'display: flex;' +
'justify-content: center;' +
'align-items: center;' +
'position: absolute;' +
'top: 0;' +
'right: 70px;' +
'transition: all .2s;';

var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        updateInput();
    }
}, 100);

input.addEventListener('keydown', updateInput, false);
input.addEventListener('keyup', updateInput, false);
function updateInput() {
    charCounter.innerHTML = input.value.length;
    if (parseInt(charCounter.innerHTML) < 100) {
        charCounter.style.color = '#54EA4C';
        charCounter.style.backgroundColor = '#143812';
        charCounter.style.border = '1px solid #54EA4C';
    } else if (parseInt(charCounter.innerHTML) > 100 && parseInt(charCounter.innerHTML) < 200) {
        charCounter.style.color = '#FFD65D';
        charCounter.style.backgroundColor = '#635223';
        charCounter.style.border = '1px solid #FFD65D';
    } else if (parseInt(charCounter.innerHTML) > 200) {
        charCounter.style.color = '#EC5050';
        charCounter.style.backgroundColor = '#351212';
        charCounter.style.border = '1px solid #EC5050';
    }
}