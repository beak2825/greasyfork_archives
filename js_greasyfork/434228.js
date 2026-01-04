// ==UserScript==
// @name         csgoclicker.net Block Script
// @namespace    here lol
// @version      2.3
// @description  Blocks the few you don't want to hear from <3
// @author       pyBiscuit et Aspect
// @match        https://csgoclicker.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434228/csgoclickernet%20Block%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/434228/csgoclickernet%20Block%20Script.meta.js
// ==/UserScript==

const blockusers = ['Mythical', 'Niko2k', 'visaa']

var debugmode = false;

var blockregex = blockusers.map(name => {
    return new RegExp(name , 'g')
})

function checkforblock() {
    var chatScroll = document.getElementsByClassName('chatScroll vb-content')[0].getElementsByClassName('messageGroup')
    for (let i = 0; i < chatScroll.length; i++) {
        if (blockregex.find(regex => regex.test(document.getElementsByClassName('messageGroup')[i].innerText))) {
            var blockedmsgs = document.getElementsByClassName('messageGroup')[i].getElementsByClassName('messages')[0].getElementsByClassName('message')
            for (let x = 0; x < blockedmsgs.length; x++) {
                blockedmsgs[x].getElementsByClassName('messageBody')[0].innerText = "[Message Blocked...]"
                if (debugmode == true) {
                    console.log(`Found ${x} total messages from ${blockusers.length} unique blocked user(s).`)
                }
            }
        }
    }
}

function setDaInterval() {
    setInterval(checkforblock, 250);
}

setDaInterval()