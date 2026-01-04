// ==UserScript==
// @name         VK Hide Reactions
// @namespace    https://vk.com
// @version      1.0
// @description  Hide Reactions Menu in new interface
// @author       charademon
// @match        *://vk.com/*
// @icon         https://vk.com/doc209007806_612533447
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436884/VK%20Hide%20Reactions.user.js
// @updateURL https://update.greasyfork.org/scripts/436884/VK%20Hide%20Reactions.meta.js
// ==/UserScript==

function fuckreact(){
while (document.getElementsByClassName('ReactionsMenu')[0]) {
        document.getElementsByClassName('ReactionsMenu')[0].remove();
    }
while (document.getElementsByClassName('Reaction')[0]) {
        document.getElementsByClassName('Reaction')[0].remove();
    }
while (document.getElementsByClassName('ReactionsMenu__inner')[0]) {
        document.getElementsByClassName('ReactionsMenu__inner')[0].remove();
    }
while (document.getElementsByClassName('Reaction__title')[0]) {
        document.getElementsByClassName('Reaction__title')[0].remove();
    }
}
var timer = setInterval(fuckreact, 10);