// ==UserScript==
// @name         Spectate Speed Slider Extension (Public)
// @description  Allows for editing of the spectator camera speed (increase and decrease)
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @match        *://shellshock.io/*
// @run-at       document-start
// @author       Agent Adam
// @grant        none
// @namespace    none
// @version      2.0
// @downloadURL https://update.greasyfork.org/scripts/456391/Spectate%20Speed%20Slider%20Extension%20%28Public%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456391/Spectate%20Speed%20Slider%20Extension%20%28Public%29.meta.js
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

            let y = /(Matrix,[A-z]{2}.prototype.update=function\(([A-z])\)\{)/

            if (x.match(y)) return x.replace(y, `$1$2=window.spectateSpeed;`)
        }; return super.response
    }
}

window.addEventListener('load', (event) => {
    window.spectateSpeed = 1

    let $ = document.createElement('div'); $.innerHTML = `<h3 style = 'text-align: center'> Spectator Speed </h3> <div class = 'f_row'> <input class = 'ss_slider' type = 'range' min = '00.01' max = '20.00' step = '00.01' value = '01.00' onchange = 'window.spectateSpeed = this.value'/> </div>`

    document.querySelector('#pauseButtons').appendChild($)
})