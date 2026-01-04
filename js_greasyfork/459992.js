// ==UserScript==
// @name        MB: copy artist credit
// @namespace   https://rinsuki.net
// @match       https://musicbrainz.org/artist/*/aliases
// @grant       none
// @version     1.0.0
// @author      rinsuki
// @license     MIT
// @description copy artist credit to clipboard (localStorage)
// @downloadURL https://update.greasyfork.org/scripts/459992/MB%3A%20copy%20artist%20credit.user.js
// @updateURL https://update.greasyfork.org/scripts/459992/MB%3A%20copy%20artist%20credit.meta.js
// ==/UserScript==

(function() {
    const editLinks = document.querySelectorAll('a[href*="/credit/"][href$="/edit"]')
    for (const editLink of editLinks) {
        const button = document.createElement("button")
        button.textContent="Copy"
        button.addEventListener("click", () => {
            button.textContent = "Copying..."
            const xhr = new XMLHttpRequest()
            xhr.responseType = "document"
            xhr.open("GET", editLink.href, true)
            xhr.addEventListener("load", () => {
                if (xhr.status >= 300) {
                    console.error(xhr)
                    button.textContent = "Error"
                    return
                }
                /** @type {HTMLDocument} */
                const doc = xhr.response
                console.log(xhr)
                for (const script of doc.querySelectorAll("script")) {
                    const text = script.text.trim()
                    if (text.length === 0) continue
                    console.log(text)
                    const matched = /MB\.initializeArtistCredit\((.+)\);/s.exec(text)
                    if (matched != null) {
                        const parsed = JSON.parse("[" + matched[1] + "]")
                        const credits = parsed[1].names
                        if (!Array.isArray(credits)) {
                            alert("invalid...")
                            continue
                        }
                        localStorage.setItem("copiedArtistCredit", JSON.stringify({names: credits}))
                        button.textContent = "Copied!"
                        return
                    }
                }
                button.textContent = "Failed..."
            })
            xhr.send()
        })
        editLink.parentElement.parentElement.children.item(0).prepend(button)
    }
})()