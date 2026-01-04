// ==UserScript==
// @name         Neopets: Auction filter
// @author       Tombaugh Regio
// @version      1.0
// @description  What it says on the tin
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/auctions.phtml
// @match        http://www.neopets.com/auctions.phtml?auction_counter=*
// @match        http://www.neopets.com/auctions.phtml?type=bids&auction_id=*
// @match        http://www.neopets.com/auctions.phtml?type=placebid
// @match        http://www.neopets.com/genie.phtml
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431668/Neopets%3A%20Auction%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/431668/Neopets%3A%20Auction%20filter.meta.js
// ==/UserScript==

//==================================

// What fraction of the market price would you like the cost to be?
// Ex: If you want cost to be 30% of market price, enter 0.3
const COST_FRACTION = 0.3

//==================================

const URL = document.URL 

const INTERESTED_ITEMS = []
if (GM_getValue("interestedItems")) {
  INTERESTED_ITEMS.push(...JSON.parse(GM_getValue("interestedItems")))
}

const SAVED_PRICES = []
if (GM_getValue("auctionPrices")) {
  SAVED_PRICES.push(...JSON.parse(GM_getValue("auctionPrices")))
}

function getPrices() {
  const auctionContainer = Array.from(document.querySelectorAll(".content tbody")).reverse()[0]
  const [header, ...auctionItems] = auctionContainer.querySelectorAll("tr")
  const AUCTION_ITEMS = []
  const temp = []

  if (auctionItems.length > 0 && !auctionItems[0].textContent.includes("couldn't find anything")) {
    for (const row of auctionItems) {
      const [numberEl, pic, item, ownerEl, timeEl, lastBidEl, currentPriceEl, lastBidderEl] = row.querySelectorAll("td")
      const name = item.textContent.trim()
      const cost = parseInt(currentPriceEl.textContent.match(/\d+/)[0])
      const number = parseInt(numberEl.textContent)

      //Set prices from SAVED_PRICES if they exist
      let price = 0
      let isNew = true
      for (const saved of SAVED_PRICES) {
        if (name == saved.name) {
          isNew = false
          price = saved.price
        }
      }

      //If the item is new, get and set prices from Neocodex, then run function again
      if (isNew) {
        const neocodexSearchString = `http://www.neocodex.us/forum/index.php?app=itemdb&module=search&section=search&item="${
          name
        }"&description=&use_rarity=&rarity_low=&rarity_high=&use_price=&price_low=&price_high=&use_shop=&shop=&search_order=price&sort=asc&lim=20`

        new Promise((resolve, reject) => {
          GM.xmlHttpRequest({
            method: "GET",
            url: neocodexSearchString,
            onload: function(response) {
              const htmlElement = document.createElement("html")
              htmlElement.innerHTML = response.responseText

              if(htmlElement.querySelector(".idbQuickPrice") && htmlElement.querySelector(".idbQuickPrice").textContent.match(/[\d,]+/)) {
                price = parseInt(htmlElement.querySelector(".idbQuickPrice").textContent.match(/[\d,]+/)[0].split(",").join(""))
              }

              htmlElement.remove()

              SAVED_PRICES.push({name: name, price: price})
              GM_setValue("auctionPrices", JSON.stringify(SAVED_PRICES))

              resolve(getPrices())
            },
            onerror: function(error) {
              reject(error)
            }
          })
        })
      }

      temp.push({name: name, profit: price - cost, profitable: (price * COST_FRACTION >= cost), element: row})

      item.onclick = function() {        
        INTERESTED_ITEMS.push({name: name, price: price, number: number})
        GM_setValue("interestedItems", JSON.stringify(INTERESTED_ITEMS))
      }
    }
  }
  
  AUCTION_ITEMS.push(...temp)
  
  for (const item of AUCTION_ITEMS) {
    if (!item.profitable) item.element.style.display = "none"
  }
  
  return true
}

//On bidding page
if (URL.includes("type=bids&auction_id=")) { 
  function placeBid() {
    //Get your name
    const yourName = document.querySelector(".user a").textContent.trim()  

    //Get item name and current bid
    let currentBid = 0, itemName = "", owner = ""
    if (document.querySelector('input[name="amount"]')) {
      currentBid = parseInt(document.querySelector('input[name="amount"]').value)
      const nameAndOwner = document
        .querySelector(".content img")
        .parentNode.querySelector("b")
        .textContent
        .match(/(^[\S\s]+) \(owned by (\S+)\)/)
      
      itemName = nameAndOwner[1]
      owner = nameAndOwner[2]
    }

    //Get and set last bidder
    let lastBidder = ""  
    if (document.querySelector(".content tbody")) {
      const [header, ...bidders] = document.querySelector(".content tbody").querySelectorAll("tr")

      for (const [i, bidder] of bidders.entries()) {
        if (i == 0) {
          lastBidder = bidder.querySelector("td").textContent.trim()
        }
        if (i > 4) bidder.style.display = "none"
      }
    }

    //If item is profitable, and you're not the last bidder, bid on it
    for (const interested of INTERESTED_ITEMS) {
      if (itemName == interested.name 
          && currentBid < interested.price * COST_FRACTION
         ) {
        
        if (lastBidder != yourName) {
          GM_setValue("boughtItem", JSON.stringify({name: interested.name, owner: owner}))
          document.querySelector('.content input[value="Place a Bid"]').click()
        } else {
          window.setTimeout(() => window.location.reload(), interested.number * 3000)
        }
      }
    }
  }
  
  placeBid()
}

//After placing a bid
if (URL.includes("type=placebid")) {
  const boughtItem = JSON.parse(GM_getValue("boughtItem"))
  const {name, owner} = boughtItem
  
  //Set the wait time based on how close the auction is to ending
  new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: "http://www.neopets.com/auctions.phtml",
      onload: function(response) {
        const htmlElement = document.createElement("html")
        htmlElement.innerHTML = response.responseText
        
        const auctionContainer = Array.from(htmlElement.querySelectorAll(".content tbody")).reverse()[0]
        const [header, ...auctionItems] = auctionContainer.querySelectorAll("tr")
        //If the item isn't on the first page, set refresh time to 1 minute
        let number = 20
        
        if (auctionItems.length > 1) {
          for (const row of auctionItems) {
            const [numberEl, pic, item, ownerEl, timeEl, lastBidEl, currentPriceEl, lastBidderEl] = row.querySelectorAll("td")
            const bidName = item.textContent.trim()
            const bidOwner = ownerEl.textContent.trim()
            
            if (bidName == name && bidOwner == owner) {
              //Set the refresh time to position * 3 seconds
              number = parseInt(numberEl.textContent.trim())
            }
          }
        }
        
        //Updated interested item number
        for (const interested of INTERESTED_ITEMS) {
          if (name == interested.name) {
            interested.number = number
          }
        }

        //Go back to the bid page after the calculated wait time
        resolve(window.setTimeout(() => window.history.back(), number * 3000))
      },
      onerror: function(error) {
        reject(error)
      }
    })
  })
}

//On Auction Genie page
if (URL.includes("genie.phtml")) {
  if (document.querySelector(".content tbody") 
      && document.querySelector(".content tbody").textContent.includes("Auc No.")
     ) {
    getPrices()
  }
}


//On auction counter page
if (!URL.includes("type=bids&auction_id=") 
    && !URL.includes("type=placebid")
    && !URL.includes("genie.phtml")
   ) {  
  getPrices()
}