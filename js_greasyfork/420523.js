// ==UserScript==
// @name Small Business -> Small Capitalists
// @description Substitute the term 'small business' (and variants) for 'small capitalist' in each page you visit. You'll laugh, and then you'll cry.
// @author Alberta Advantage Podcast
// @version 4
// @namespace aapod_small_business
// @match http*://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/420523/Small%20Business%20-%3E%20Small%20Capitalists.user.js
// @updateURL https://update.greasyfork.org/scripts/420523/Small%20Business%20-%3E%20Small%20Capitalists.meta.js
// ==/UserScript==

console.log("Running Business -> Capitalist Substitution")

function substitute () {
    let elements = document.querySelectorAll('*')
    for (let i = 0; i < elements.length; i++) {

        let element = elements[i]

        for (let j = 0; j < element.childNodes.length; j++) {

            let childNode = element.childNodes[j]
            if (childNode.nodeName !== '#text') {
                continue
            }

            // NB: Need to substitute the plural form first, or we'll replace the singular form inside plural forms
            childNode.textContent = childNode.textContent.replace(/Small[ -]Businesses/g, "Small Capitalists")
            childNode.textContent = childNode.textContent.replace(/small[ -]Businesses/g, "small Capitalists")
            childNode.textContent = childNode.textContent.replace(/Small[ -]businesses/g, "Small capitalists")
            childNode.textContent = childNode.textContent.replace(/small[ -]businesses/g, "small capitalists")
            childNode.textContent = childNode.textContent.replace(/Small[ -]Business/g, "Small Capitalist")
            childNode.textContent = childNode.textContent.replace(/small[ -]Business/g, "small Capitalist")
            childNode.textContent = childNode.textContent.replace(/Small[ -]business/g, "Small capitalist")
            childNode.textContent = childNode.textContent.replace(/small[ -]business/g, "small capitalist")

        }

    }

}

if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
    substitute()
}
else {
    document.addEventListener('DOMContentLoaded', function () {
        // Substitute server-rendered small businesses on load
        substitute()
        // This is an imperfect attempt to catch dynamically loaded/rendered content. It won't work on every page!
        window.setTimeout(substitute, 500) // 500ms delay
    })
}



