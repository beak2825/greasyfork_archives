// ==UserScript==
// @name         SnoopyBloss.EXT
// @description  Allows viewing of whether a player is spawned or not in game
// @icon         https://cdn.discordapp.com/attachments/773230378587914261/1076378652297662524/static-assets-upload11944650007778788603.webp
// @match        *://shellshock.io/*
// @run-at       document-start
// @author       Snoopy
// @grant        none
// @namespace    none
// @license      none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/460275/SnoopyBlossEXT.user.js
// @updateURL https://update.greasyfork.org/scripts/460275/SnoopyBlossEXT.meta.js
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

            for (let [a, b] of y) {

                x = x.replace(a, a + (b ? b + `.playing?'🔥':'💀';window.rebuildPlayerList=arguments.callee;` : `,typeof window.rebuildPlayerList=="function"&&window.rebuildPlayerList()`))

            }; return x

        }; return super.response
    }
}