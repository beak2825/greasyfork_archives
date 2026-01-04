// ==UserScript==
// @name         Player Spawned Extension (Public)
// @description  Adds emojis to track which players are spawned in game
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @author       adamhasanx + midnight
// @match        *://shellshock.io/*
// @run-at       document-start
// @grant        none
// @namespace    none
// @version      3.0
// @downloadURL https://update.greasyfork.org/scripts/456258/Player%20Spawned%20Extension%20%28Public%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456258/Player%20Spawned%20Extension%20%28Public%29.meta.js
// ==/UserScript==

window.XMLHttpRequest = class extends window.XMLHttpRequest {
    constructor() {
        super(...arguments)
    }

    open() {
        (arguments[1]?.includes('shellshock.js') && (this.m = !0), super.open(...arguments))
    }

    get response() {
        if (this.m) {
            let x = super.response

            const y = [/themClass\[(\w).team\]}`,\w.innerText=/, /this.playing=!1/, /this.playing=!0/].map(z => x.match(z))

            for (let [a, b] of y) { x = x.replace(a, a + (b ? b + `.playing ? '🟢' : '⭕'; window.rebuildPlayerList = arguments.callee;` : `,typeof window.rebuildPlayerList == "function" && window.rebuildPlayerList()`)) }; return x

        }; return super.response
    }
}