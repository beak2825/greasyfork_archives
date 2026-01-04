// ==UserScript==
// @name         Long S substitutor
// @author       Tombaugh Regio
// @version      0.1
// @description  Exactly what it says on the tin. Based on Congrefs (https://github.com/mwunsch/congrefs)
// @namespace    https://greasyfork.org/users/780470
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430035/Long%20S%20substitutor.user.js
// @updateURL https://update.greasyfork.org/scripts/430035/Long%20S%20substitutor.meta.js
// ==/UserScript==

(function() {
    "use strict"

    //Get all text nodes
    function textNodesUnder(element) {
        const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false)
        const all = new Array()
        let next

        while (next = walk.nextNode()) all.push(next)
        return all
    }

    const allTextNodes = textNodesUnder(document.body)

    //Replace short S with long S
    for (const text of allTextNodes) {
        const pattern = /(s(?!\b|f))/g
        const longS = "\u017F"

        text.textContent = text.textContent.replace(pattern, longS)
    }
})()