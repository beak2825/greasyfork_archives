// ==UserScript==
// @name         Automatic Proxitok Error Redirector
// @namespace    happyviking
// @version      1.1.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to another proxitok instance if the one you're directed to issues.
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://proxitok.pabloferreiro.es/*
// @match https://proxitok.pussthecat.org/*
// @match https://proxitok.privacydev.net/*
// @match https://tok.habedieeh.re/*
// @match https://proxitok.esmailelbob.xyz/*
// @match https://tok.artemislena.eu/*
// @match https://tok.adminforge.de/*
// @match https://tik.hostux.net/*
// @match https://proxitok.lunar.icu/*
// @match https://proxitok.privacy.com.de/*
// @match https://tiktok.chauvet.pro/*
// @match https://cringe.whateveritworks.org/*
// <<INSTANCES END HERE>>

// @downloadURL https://update.greasyfork.org/scripts/479501/Automatic%20Proxitok%20Error%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/479501/Automatic%20Proxitok%20Error%20Redirector.meta.js
// ==/UserScript==

function main() {
    const titles = document.getElementsByClassName("title")
    for (const title of titles){
        if (title.textContent == "There was an error processing your request!"){
            const addedMessage = document.createElement("p")
            addedMessage.textContent = "Redirecting you to new instance..."
            title.parentElement?.appendChild(addedMessage)
            location.replace('https://farside.link/proxitok/' + window.location.pathname + window.location.search);
            return
        }
    }
}

main()

