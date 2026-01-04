// ==UserScript==
// @name         Typeracer one-line
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Character-by-character one-line typing on typeracer
// @author       ph0t0shop#7326
// @match        https://play.typeracer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377315/Typeracer%20one-line.user.js
// @updateURL https://update.greasyfork.org/scripts/377315/Typeracer%20one-line.meta.js
// ==/UserScript==

(function() {
    var previouslySet = false;
    var currWord = "";
    'use strict';
    setInterval(function() {
        var txtBoxDisplayed = document.getElementsByClassName("txtInput").length > 0;
        if (txtBoxDisplayed) {
            if (!previouslySet) {
                document.getElementsByClassName("txtInput")[0].addEventListener("input", function(event){
                    var firstWord = document.getElementsByClassName("hideableWords")[0].children[0];
                    var newWord = firstWord.innerText;
                    if (!currWord.endsWith(newWord)) currWord = newWord;
                    var currInput = event.target.value;
                    if (currWord.startsWith(currInput)) { // user is typing correctly
                        firstWord.innerText = currWord.substring(currInput.length);
                    }
                });
                previouslySet = true;
            }
        } else {
            previouslySet = false;
        }
    }, 200);
})();