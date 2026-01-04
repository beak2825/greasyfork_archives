// ==UserScript==
// @name         New Instance Button for Nitter
// @namespace    happyviking
// @version      1.63.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Adds a button to Nitter instances to redirect to a new instance.
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Nitter_logo.svg/1024px-Nitter_logo.svg.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://lightbrd.com/*
// @match https://nitter.catsarch.com/*
// @match https://nitter.net/*
// @match https://nitter.poast.org/*
// @match https://nitter.privacyredirect.com/*
// @match https://nitter.space/*
// @match https://nitter.tiekoetter.com/*
// @match https://nuku.trabun.org/*
// @match https://xcancel.com/*
// @match https://nitter.kareem.one/*
// @match https://nitter.kuuro.net/*
// @match https://nitter.privacydev.net/*
// @match https://nitter.lucabased.xyz/*
// <<INSTANCES END HERE>>


// @downloadURL https://update.greasyfork.org/scripts/507326/New%20Instance%20Button%20for%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/507326/New%20Instance%20Button%20for%20Nitter.meta.js
// ==/UserScript==

function main() {
    const firstNavItem = document.querySelector('.nav-item');
    if (!firstNavItem) return
    const newButton = document.createElement("button")
    firstNavItem.prepend(newButton)
    newButton.appendChild(document.createTextNode("New Instance"))
    newButton.onclick = () => {
        location.replace('https://farside.link/nitter/' + window.location.pathname + window.location.search);
    }
}

main()  