// ==UserScript==
// @name         Neopets: Gourmet food checklist
// @author       Tombaugh Regio
// @version      1.0
// @description  Adds a button to check which gourmet foods still need to be eaten.
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/gourmet_club.phtml?pet_name=*
// @match        https://items.jellyneo.net/tools/gourmet-checklist/
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/427768/Neopets%3A%20Gourmet%20food%20checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/427768/Neopets%3A%20Gourmet%20food%20checklist.meta.js
// ==/UserScript==

const URL = document.URL

if (URL.includes("neopets")) {
    const title = document.querySelector(".content").querySelector("b")

    //Add a book checker button
    const itemCheckerButton = document.createElement("button")
    const itemCheckerLink = document.createElement("a")
    itemCheckerButton.innerText = "Check foods not yet eaten"
    itemCheckerButton.style.margin = "0 0.5em"
    itemCheckerButton.style.cursor = "pointer"

    //Open the book checker page
    itemCheckerButton.onclick = e => {
        e.preventDefault()
        const HTML = new XMLSerializer().serializeToString(document)

        GM_setValue("copiedHTML", HTML)
        GM_openInTab("https://items.jellyneo.net/tools/gourmet-checklist/")
    }

    //Append button after title
    title.after(itemCheckerButton)
}

if (URL.includes("jellyneo")) {
    const inputTextArea = document.querySelector("#checklist-code")
    const itemCheckerButton = document.querySelector("#checklist-submit")
    const copiedHTML = GM_getValue("copiedHTML")

    inputTextArea.textContent = copiedHTML

    if (inputTextArea.textContent.length > 0) itemCheckerButton.click()
}