// ==UserScript==
// @name         Remove disabled all input
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  зачем оно нужно
// @author       S30N1K
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429785/Remove%20disabled%20all%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/429785/Remove%20disabled%20all%20input.meta.js
// ==/UserScript==

(() => {
    document.onreadystatechange = () => {
        if (document.readyState === "complete") {
            setImmediate(() => {
                const allInput = document.querySelectorAll("input")
                for (const input of allInput) {
                    input.removeAttribute("disabled")
                }
            })
        }
    }
})()