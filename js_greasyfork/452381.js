// ==UserScript==
// @name         Nitro Type - Send Cash Profile Links
// @version      0.1.2
// @description  Displays the Send Cash popup with given amount from URLs. Example: https://www.nitrotype.com/racer/toonidy#send-250000
// @author       Toonidy
// @match        *://*.nitrotype.com/racer/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/452381/Nitro%20Type%20-%20Send%20Cash%20Profile%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/452381/Nitro%20Type%20-%20Send%20Cash%20Profile%20Links.meta.js
// ==/UserScript==

/* global findReact */

const matches = window.location.hash.match(/^#send-(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/),
    amount = matches ? parseInt(matches[1].replace(/,/g, "")) : null,
    sendCashButton = document.querySelector("section.profile .icon.btn-icon.icon-sendcash--s")?.parentNode
if (amount === null || isNaN(amount) || amount < 1e5 || !sendCashButton) {
    return
}

const modalObserver = new MutationObserver(([mutation]) => {
    for (const node of mutation.addedNodes) {
        if (node.classList?.contains("modal")) {
            modalObserver.disconnect()
            const input = node.querySelector(".input.as-nitro-cash input.input-field"),
                reactObj = input && findReact(input)
            if (reactObj) {
                reactObj.setState({
                    amount: amount.toString(),
                    password: "",
                    passwordError: !1,
                    amountError: !1,
                })
                input.dispatchEvent(new Event("change"))
            }
            return
        }
    }
})

modalObserver.observe(document.body, { childList: true })

sendCashButton.click()
