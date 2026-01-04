// ==UserScript==
// @name         US Brick Hill dates [forums]
// @namespace    http://www.brick-hill.com/
// @version      0.1
// @description  Converts poster join dates from the UK date format (d/m/y) to US (m/d/y)
// @author       Dragonian
// @match        https://www.brick-hill.com/forum/thread/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/382469/US%20Brick%20Hill%20dates%20%5Bforums%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/382469/US%20Brick%20Hill%20dates%20%5Bforums%5D.meta.js
// ==/UserScript==

function americanize(joinString) {
    // Strip the "Joined " string from join date
    let date = joinString.replace('Joined ', '')

    date = date.split('/')

    const year = date[2]
    const month = parseInt(date[1], 10)
    const day = parseInt(date[0], 10);

    return `${month}/${day}/${year}`
}

const posts = document.getElementsByClassName('thread-row')

for (let el of posts) {
    let joinDate = el.querySelectorAll('span.dark-grey-text')[0]
    joinDate.textContent = 'Joined ' + americanize(joinDate.innerHTML)
}