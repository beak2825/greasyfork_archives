// ==UserScript==
// @name         Neopets: Shop stock price check
// @author       Tombaugh Regio
// @version      1.0
// @description  Adds a button to automatically check the prices of that page
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/market.phtml?type=your*
// @match        https://items.jellyneo.net/tools/shop-stock-price-checker/
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/427863/Neopets%3A%20Shop%20stock%20price%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/427863/Neopets%3A%20Shop%20stock%20price%20check.meta.js
// ==/UserScript==

const URL = document.URL

if (URL.includes("neopets")) {
    const title = document.querySelector(".content").querySelector("table").nextSibling.nextSibling.nextSibling.nextSibling

    //Add a price checker button
    const itemCheckerButton = document.createElement("button")
    const itemCheckerLink = document.createElement("a")
    itemCheckerButton.innerText = "Check prices on this page"
    itemCheckerButton.style.margin = "0 0.5em"

    //Get the entire HTML of this page
    GM_xmlhttpRequest({
        method: 'GET',
        url: URL,
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        onload: function(responseDetails) {
            return new Promise((resolve, reject) => {
                resolve(GM_setValue("allHTML", responseDetails.responseText))
            })
        }
    })

    //Open the price checker page
    itemCheckerButton.onclick = e => {
        e.preventDefault()
        GM_openInTab("https://items.jellyneo.net/tools/shop-stock-price-checker/")
    }

    //Append button after title
    title.after(itemCheckerButton)
}

if (URL.includes("shop-stock-price-checker")) {
    const inputTextArea = document.querySelector("#price-check-code")
    const priceCheckButton = document.querySelector("#price-check-submit")
    const sdbPage = GM_getValue("allHTML")

    inputTextArea.textContent = sdbPage

    if (inputTextArea.textContent.length > 0) priceCheckButton.click()
}