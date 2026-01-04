// ==UserScript==
// @name         Comment Template for Podfics
// @version      0.1
// @description  Randomize comment for AO3 Podfics
// @author       MistbornHero
// @include     *://archiveofourown.org/*works/*
// @run-at      document-end
// @grant       none
// @namespace https://greasyfork.org/users/926809
// @downloadURL https://update.greasyfork.org/scripts/446648/Comment%20Template%20for%20Podfics.user.js
// @updateURL https://update.greasyfork.org/scripts/446648/Comment%20Template%20for%20Podfics.meta.js
// ==/UserScript==

'use strict';

let searchTags = () => {
    var comment = ""
    var tags = document.getElementsByClassName('freeform tags')[1].firstElementChild.innerHTML
    if (tags.includes("Podfic")){
        if (!tags.includes("Podfic Welcome")) {
            comment = podficComment()
        }
    }
    return comment
}

const podficComment = () => {
    const cmtNum = Math.floor(Math.random() * 5);
    var genText
    switch(cmtNum) {
        case 1:
            genText = "[Exclamation/keysmash] I enjoyed this!"
            break;
        case 2:
            genText = "I listened to this while [action] and it made me [reaction]."
            break;
        case 3:
            genText = "Your [character]'s voice was [adjective] and it made it [impression] to listen to. I love the way you acted [specific character or plot thing]."
            break;
        case 4:
            genText = "My favourite line was [line or scene]. Your take on [thing] made it all the more [impression]."
            break;
        default:
            genText = "Thank you for making this and sharing it with us!"
    }
    return genText
}

const init = () => {
    const commentBox = document.querySelector("textarea[id^='comment_content_for']")
    commentBox.value = searchTags()
}

init()