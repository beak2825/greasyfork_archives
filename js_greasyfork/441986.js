// ==UserScript==
// @name         Crunchyroll Spam Blocker
// @namespace    http://greasyfork.org/
// @version      1.0.0
// @description  Deletes annoying Crunchyroll spam bots on the client
// @author       business-goose
// @match        https://www.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/441986/Crunchyroll%20Spam%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/441986/Crunchyroll%20Spam%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var comments = document.getElementsByClassName("guestbook-list cf")
    var blockedPhrases = ["earn", "work", "making", "$", "💵", "𝐰𝐨𝐫𝐤", "𝐦𝐚𝐤𝐞 𝐦𝐨𝐫𝐞 ", "£"]

    setInterval(() => {
        for(var i = 0; i < comments.length; i++) {
            const element = comments[i]

            blockedPhrases.forEach((blocked) => {
                if(element.innerText.toLowerCase().includes(blocked)) {
                    element.remove()
                }
            })
        }
}, 200)})
();