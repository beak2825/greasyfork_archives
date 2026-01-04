// ==UserScript==
// @name         Neopets: Stock checker
// @author       Tombaugh Regio
// @version      1.0
// @description  Check if stock with highest price meets threshold to sell
// @namespace    https://greasyfork.org/users/780470
// @match        *://www.neopets.com/*
// @exclude      http://www.neopets.com/stockmarket.phtml
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/431655/Neopets%3A%20Stock%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/431655/Neopets%3A%20Stock%20checker.meta.js
// ==/UserScript==


//============================

//Minimum price to sell stock
const MINIMUM_STOCK_PRICE = 30

//============================

function checkStocks() {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: "http://www.neopets.com/stockmarket.phtml?type=portfolio",
      onload: function(response) {
        const htmlElement = document.createElement("html")
        htmlElement.innerHTML = response.responseText

        const [header, subHeader, ...rows] = htmlElement.querySelector(".content tbody").querySelectorAll("tr")
        const myStocks = new Array()
        let currentPriceIndex = 0, tickerIndex = 0

        for (const [i, column] of subHeader.querySelectorAll("td").entries()) {
          if (column.textContent.includes("Current Price")) currentPriceIndex = i
          if (column.textContent.includes("Ticker")) tickerIndex = i
        }

        for (const row of rows) {
          const numberofCols = subHeader.querySelectorAll("td").length
          const columns = row.querySelectorAll("td")

          if (columns.length == numberofCols) {
            const ticker = columns[tickerIndex].querySelector("a").textContent
            const price = parseInt(columns[currentPriceIndex].textContent)

            myStocks.push({ticker: ticker, price: price})
          }
        }

        myStocks.sort((a, b) => b.price - a.price)
        
        const top = myStocks[0]
        if (top.price > MINIMUM_STOCK_PRICE) {
          if (confirm(`${top.ticker} is currently selling at ${top.price}. Would you like to sell?`)) {
            GM_openInTab("http://www.neopets.com/stockmarket.phtml?type=portfolio")
          }
        }
        
        resolve(console.log(`Top stock: ${top.ticker}, selling at ${top.price}`))
      },
      onerror: function(error) {
        reject(error)
      }
    })
  })
}

function whenWindowHasFocus(yourFunction) {
  function checkFocus() {
   return document.hasFocus()
  }

  window.onfocus = checkFocus
  window.onblur = checkFocus  
  
  if (checkFocus()) yourFunction()
  setTimeout(() => whenWindowHasFocus(yourFunction), 300000)
}

whenWindowHasFocus(checkStocks)