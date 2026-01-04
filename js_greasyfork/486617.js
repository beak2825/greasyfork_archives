// ==UserScript==
// @name         InfiniteHaxx
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Infinite Craft hacks, lets you add custom elements.
// @author       You
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/486617/InfiniteHaxx.user.js
// @updateURL https://update.greasyfork.org/scripts/486617/InfiniteHaxx.meta.js
// ==/UserScript==

function loadHax(){(function() {
    'use strict';

    function haxx(){
// Prompt the user for the element and emoji
let element = prompt("Element");
let emoji = prompt("Emoji");

// Create the new object
let newElement = {
  text: element,
  emoji: emoji,
  discovered: false
};
window.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements.push(newElement)}
  addElt = document.createElement('button');  addElt.innerText = "Add New Element"; addElt.onclick = function(){haxx()}
  document.querySelector('.sidebar').prepend(addElt);
})();}
setTimeout(loadHax,1000)