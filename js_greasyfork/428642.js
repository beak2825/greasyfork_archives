// ==UserScript==
// @name         Neopets: Till checker
// @author       Tombaugh Regio
// @version      0.2
// @description  Checks to see if you have money in your shop till, and sends a pop-up alert if you do.
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/*
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/428642/Neopets%3A%20Till%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/428642/Neopets%3A%20Till%20checker.meta.js
// ==/UserScript==
function checkTillAmount() {
  GM.xmlHttpRequest({
    method: 'GET',
    url: "http://www.neopets.com/market.phtml?type=till",
    headers: {
      'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
      'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
      new Promise((resolve, reject) => {
        //Scrape the till amount, returns it in both integer (1234) and text (1,234 NP) format
        const htmlElement = document.createElement("html")
        htmlElement.innerHTML = responseDetails.responseText
        const tillAmountText = htmlElement.querySelector(".content p b").textContent.trim()
        htmlElement.remove()

        const tillAmount = parseInt(tillAmountText.match(/[\d,]+/)[0].split(",").join(""))
        
        resolve([ tillAmount, tillAmountText ])
      }).then(([ tillAmount, tillAmountText ]) => {
        const doesOldTillAmountExist = GM.getValue("oldTillAmount", null).then(oldTillAmount => {
          if (tillAmount > 0 && tillAmount !== oldTillAmount) {
            GM.setValue("oldTillAmount", tillAmount)
            
            if (confirm(`You made ${tillAmountText}. Would you like to empty your till?`)) {
              GM.openInTab("http://www.neopets.com/market.phtml?type=till")
            }
          }
        })
        
        if (!doesOldTillAmountExist) GM.setValue("oldTillAmount", 0)
      })
    },
    onerror: (error) => reject(error)
  })
  
  return true
}

//Only run when window has focus
function whenWindowHasFocus() {
  if (document.hasFocus()) checkTillAmount()
  setTimeout(() => whenWindowHasFocus(), 60000)
}

whenWindowHasFocus()