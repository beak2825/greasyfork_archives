// ==UserScript==
// @name         Neopets: Books Checklist
// @author       Tombaugh Regio
// @version      1.0
// @description  Adds a button to check which books still need to be read. Includes both Book Club and Booktastic Books.
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/books_read.phtml?pet_name=*
// @match        http://www.neopets.com/moon/books_read.phtml?pet_name=*
// @match        https://items.jellyneo.net/tools/book-checklist/
// @match        https://items.jellyneo.net/tools/booktastic-checklist/
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/427767/Neopets%3A%20Books%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/427767/Neopets%3A%20Books%20Checklist.meta.js
// ==/UserScript==

const URL = document.URL

if (URL.includes("books_read")) {
    const title = document.querySelector(".content").querySelector("b")

    //Add a book checker button
    const priceCheckerButton = document.createElement("button")
    const priceCheckerLink = document.createElement("a")
    priceCheckerButton.innerText = "Check to-read list"
    priceCheckerButton.style.margin = "0 0.5em"
    priceCheckerButton.style.cursor = "pointer"

    //Save the page's entire HTML and open the book checker page
    priceCheckerButton.onclick = e => {
        e.preventDefault()
        const HTML = new XMLSerializer().serializeToString(document)

        let link
        if (URL.includes("moon")) link = "https://items.jellyneo.net/tools/booktastic-checklist/"
        else link = "https://items.jellyneo.net/tools/book-checklist/"

        GM_setValue("copiedHTML", HTML)
        GM_openInTab(link)
    }

    //Append button after title
    title.after(priceCheckerButton)
}

if (URL.includes("jellyneo")) {
    const inputTextArea = document.querySelector("#checklist-code")
    const priceCheckButton = document.querySelector("#checklist-submit")
    const copiedHTML = GM_getValue("copiedHTML")

    inputTextArea.textContent = copiedHTML

    if (inputTextArea.textContent.length > 0) priceCheckButton.click()
}