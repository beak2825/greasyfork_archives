// ==UserScript==
// @name         Kill Distance Extension (Public)
// @description  Allows viewing of the distance between two players when a kill takes place
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @match        *://shellshock.io/*
// @run-at       document-start
// @author       Agent Adam
// @grant        none
// @namespace    none
// @version      2.1
// @downloadURL https://update.greasyfork.org/scripts/456227/Kill%20Distance%20Extension%20%28Public%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456227/Kill%20Distance%20Extension%20%28Public%29.meta.js
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

            let y = /(function [A-z]{2}\(([A-z]),([A-z])\)\{var [A-z]=\[.*"<\/span>")(;)/

            if (x.match(y)) return x.replace(y, `$1+'<span style="color:#4A58FF"> ['+('0'+Math.floor(Math.length3($2.x-$3.x,$2.y-$3.y,$2.z-$3.z)*2)).slice(-2)+"m]</span>"$4`)
        }; return super.response
    }
}