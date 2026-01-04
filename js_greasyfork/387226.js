// ==UserScript==
// @name         [TC] Auto Respawn 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Kill bases faster
// @author       Bozkurt
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387226/%5BTC%5D%20Auto%20Respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/387226/%5BTC%5D%20Auto%20Respawn.meta.js
// ==/UserScript==
(function(t, e) {
    let script = document.createElement("script")
    script.src = t
    document.body.appendChild(script)

    let link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = e
    document.head.appendChild(link)
})("https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js", "https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css")

const playerDeath = new CustomEvent("playerDeath", {
    "detail": "Fires at player's death."
})
new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutations[0].target.style.display == "block") {
            document.dispatchEvent(playerDeath)
        }
    })
}).observe(document.querySelector(".hud-respawn"), {
    attributes: true
})
document.addEventListener("playerDeath", function() {
    new Noty({
        text: "You died, so I revived you!",
        theme: "relax",
        type: "error",
        timeout: 2000
    }).show()
    document.querySelector(".hud-respawn-btn").click()
})