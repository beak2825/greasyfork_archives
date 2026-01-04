// ==UserScript==
// @name         Wanikani Hide Context Sentences
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.wanikani.com/lesson/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411786/Wanikani%20Hide%20Context%20Sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/411786/Wanikani%20Hide%20Context%20Sentences.meta.js
// ==/UserScript==


function doalltheworks() {
    var elements = document.getElementsByClassName("context-sentence-group");
    var allCtxSent = [];
    for(var i = 0; i < elements.length; i++) {
        allCtxSent.push(elements[i]);
    }

    allCtxSent.forEach(ctxSent => {
        var engTrad = ctxSent.lastChild;

        // Using opacity in place of visibility because visibility doesn't trigger mouseenter element
        engTrad.style.opacity = 0;
        engTrad.addEventListener('mouseenter', e => {
            engTrad.style.opacity = 1;
        });

        engTrad.addEventListener('mouseleave', e => {
            engTrad.style.opacity = 0;
        });
    });
}

function onCharacterChange() {
    var currentChar = document.getElementById("character");
    console.log(currentChar);
}

(function() {
    'use strict';
    var lastRegisteredChar = "";
    setInterval(function() {
        var currentChar = document.getElementById("character").innerHTML;
        if(lastRegisteredChar !== currentChar) {
            lastRegisteredChar = currentChar;
            doalltheworks();
        }
    }, 500);
})();