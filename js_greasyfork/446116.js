// ==UserScript==
// @name         Nitro Type - Send Cash Readable Amount
// @version      0.1.1
// @description  Displays a thousand comma separated cash amount below the input (eg. 10000000 to 10,000,000).
// @author       Toonidy
// @match        *://*.nitrotype.com/racer/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/446116/Nitro%20Type%20-%20Send%20Cash%20Readable%20Amount.user.js
// @updateURL https://update.greasyfork.org/scripts/446116/Nitro%20Type%20-%20Send%20Cash%20Readable%20Amount.meta.js
// ==/UserScript==

const NUMERIC_REGEXP = /^[0-9]+$/

const previewNode = document.createElement("div")
previewNode.classList.add("nt-preview-cash", "tar", "tc-i", "tss", "mtxs")
previewNode.innerHTML = `<span class="as-nitro-cash--prefix"></span>`

const previewTextNode = previewNode.querySelector("span")

const setPreviewText = (value) => {
    previewTextNode.textContent = NUMERIC_REGEXP.test(value) ? `$${parseInt(value).toLocaleString()}` : ""
}

const cashInputChangeHandler = (e) => {
    setPreviewText(e.target.value)
}

const modalObserver = new MutationObserver(([mutation]) => {
    for (const node of mutation.addedNodes) {
        if (node.classList?.contains("modal")) {
            const input = node.querySelector(".input.as-nitro-cash input.input-field")
            if (input) {
                setPreviewText(input.value)
                input.addEventListener("keyup", cashInputChangeHandler)
                input.addEventListener("change", cashInputChangeHandler)
                input.closest(".input.as-nitro-cash").append(previewNode)
                input.closest(".split.split--flag").classList.remove("split--flag")
            }
            return
        }
    }
})

modalObserver.observe(document.body, { childList: true })
