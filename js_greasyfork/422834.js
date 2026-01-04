// ==UserScript==
// @name         Words Blacklist - Bloqueio de Palavras
// @namespace    wordblacklist
// @version      1.0
// @description  Blacklist words on all web to not see them in anything
// @author       luizdn
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422834/Words%20Blacklist%20-%20Bloqueio%20de%20Palavras.user.js
// @updateURL https://update.greasyfork.org/scripts/422834/Words%20Blacklist%20-%20Bloqueio%20de%20Palavras.meta.js
// ==/UserScript==

var wordBlacklist = ["bolsonaro","BBB"];

// ==/para outras palavras basta adicionar ,"pieceOfShit" ==

function applyBlacklist(word) {

    for (const p of document.querySelectorAll("p")) {
        if (p.textContent.toLowerCase().includes(word.toLowerCase())) {
            console.log(p.textContent)
            p.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
        }
    }

    for (const h3 of document.querySelectorAll("h3")) {
        if (h3.textContent.toLowerCase().includes(word.toLowerCase())) {
            console.log(h3.textContent)
            h3.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
        }
    }
}

function bl() {
  wordBlacklist.forEach(applyBlacklist)
}

(function() {
    'use strict';
     setInterval(bl,200)
})();