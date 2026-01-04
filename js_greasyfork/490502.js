// ==UserScript==
// @name         Neopets: DTI SDB/Closet Import
// @author       Fatal
// @version      1.0
// @description  Adds a button to automatically import closet items to DTI
// @match        https://www.neopets.com/closet.phtml*
// @match        https://www.neopets.com/safetydeposit.phtml*
// @match        https://impress.openneo.net/import/closet/pages/*
// @match        https://impress.openneo.net/import/safety_deposit/pages/*
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1277664
// @downloadURL https://update.greasyfork.org/scripts/490502/Neopets%3A%20DTI%20SDBCloset%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/490502/Neopets%3A%20DTI%20SDBCloset%20Import.meta.js
// ==/UserScript==

const URL = document.URL

if (URL.includes("closet.phtml")) {
    const title = document.evaluate("//b[contains(., 'Your Closet')]",
                                    document, null, XPathResult.ANY_TYPE, null ).iterateNext()

    //Add a Import button
    const itemCheckerButton = document.createElement("button")
    const itemCheckerLink = document.createElement("a")
    itemCheckerButton.innerText = "Import Closet to DTI"
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
        GM_openInTab(`https://impress.openneo.net/import/closet/pages/1/new`)
    }

    //Append button after title
    title.after(itemCheckerButton)
}

if (URL.includes("safetydeposit.phtml")) {
    const title = document.evaluate("//b[contains(., 'Your Safety Deposit Box')]",
                                    document, null, XPathResult.ANY_TYPE, null ).iterateNext()

    //Add a Import button
    const itemCheckerButton = document.createElement("button")
    const itemCheckerLink = document.createElement("a")
    itemCheckerButton.innerText = "Import Closet to DTI"
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
        GM_openInTab(`https://impress.openneo.net/import/safety_deposit/pages/1/new`)
    }

    //Append button after title
    title.after(itemCheckerButton)
}

if (URL.includes("import")) {
    const inputTextArea = document.querySelector("#neopets_page_source")
    const importCheckButton = document.querySelector('input[name="commit"]')
    const closetPage = GM_getValue("allHTML")

    inputTextArea.textContent = closetPage

    if (inputTextArea.textContent.length > 0) importCheckButton.click()
    GM_setValue("allHTML", '')
}