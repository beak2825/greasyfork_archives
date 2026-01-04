// ==UserScript==
// @name         Reddit Word Blacklist
// @namespace    redditwordblacklist
// @version      1.0
// @description  Blacklist words on reddit to not see them in your feed
// @author       Folfy Blue
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416145/Reddit%20Word%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/416145/Reddit%20Word%20Blacklist.meta.js
// ==/UserScript==

var wordBlacklist = ["trump","biden"];

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