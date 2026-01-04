// ==UserScript==
// @name         Tower heal
// @namespace    https://www.youtube.com/channel/UCC4Q28czyJPjSPtYQerbPGw
// @version      1.1.0
// @description  Get info from people near to you.
// @author       Demostanis
// @match        http://zombs.io/*
// @discord      https://discord.gg/CcAgabU
// @downloadURL https://update.greasyfork.org/scripts/382739/Tower%20heal.user.js
// @updateURL https://update.greasyfork.org/scripts/382739/Tower%20heal.meta.js
// ==/UserScript==
let id = false

const RedSea = (t) => {
    clearInterval(id)
    if(id) {
        id = false
    } else {
        id = setInterval(() => {
            const i = Game.currentGame.ui.playerTick.position

            Game.currentGame.network.sendRpc({
                name: "CastSpell",
                spell: "HealTowersSpell",
                x: Math.round(i.x),
                y: Math.round(i.y),
                tier: 9
            })
        }, t)
    }
}

const html = `<div>
    <button class="enable">Enable infinite heal</button>
    <input type="number" class="speed" value="250" placeholder="Infinite heal speed">
</div>`,
    div = document.createElement("div")

div.innerHTML = html
document.querySelector("#hud-menu-settings").appendChild(div)

const enable = document.querySelector(".enable"),
    speed = document.querySelector(".speed")

enable.addEventListener("click", e => {
    if(enable.innerText == "Enable infinite heal") {
        RedSea(speed.value)
        enable.innerText = "Disable infinite heal"
    } else {
        RedSea()
        enable.innerText = "Enable infinite heal"
    }
})
