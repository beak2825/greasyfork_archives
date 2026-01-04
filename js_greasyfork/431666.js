// ==UserScript==
// @name         Neopets: Igloo shopper
// @author       Tombaugh Regio
// @version      1.0
// @description  Finds most profitable item on page and selects it.
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/winter/igloo.phtml
// @match        http://www.neopets.com/winter/igloo2.phtml
// @match        http://www.neopets.com/winter/process_igloo.phtml*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431666/Neopets%3A%20Igloo%20shopper.user.js
// @updateURL https://update.greasyfork.org/scripts/431666/Neopets%3A%20Igloo%20shopper.meta.js
// ==/UserScript==

//===================================================================

const MINIMUM_PROFIT = 1000

const EXCLUDE_ITEMS = ["Wall Paint", "Floor Tiles", "Wood Floor"]

//===================================================================

const URL = document.URL

//Enter the shop
if (URL.includes("/winter/igloo.phtml")) {
  const d = new Date();
  const date = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const currentDate = date + "/" + month + "/" + year;
  const storedDate = window.localStorage.getItem('iglooDate');
  const storedCount = window.localStorage.getItem('iglooCount') == null ? 0 : window.localStorage.getItem('iglooCount');
  if (storedDate != currentDate) {
      window.localStorage.setItem('iglooDate', currentDate);
      window.localStorage.setItem('iglooCount', '0');
  }
  document.querySelector(".content a").click()
}

//Buying items
if (URL.includes("igloo2.phtml")) {
  const SAVED_PRICES = []
  if (GM_getValue("iglooProfits")) {
    SAVED_PRICES.push(...JSON.parse(GM_getValue("iglooProfits")))
  }
  
  const SHOP_ITEMS = []
  
  function getShopItems() {
    const items = document.querySelector(".content tbody").querySelectorAll("td")
    shopItems = []
  
    for (const item of items) {
      const [link, break1, nameElement, break2, stocked, break3, costElement] = item.childNodes
      const name = nameElement.textContent.trim()
      const cost = parseInt(costElement.textContent.match(/\d+/)[0])

      //Remove items on EXCLUDE_ITEMS list, and then get shop items again
      for (const excluded of EXCLUDE_ITEMS) {
        if (name.includes(excluded)) {
          item.remove()
          return getShopItems()
        }
      }

      //Set prices from SAVED_PRICES if they exist
      let price = 0
      let isNew = true
      for (const saved of SAVED_PRICES) {
        if (name == saved.name) {
          isNew = false
          price = saved.price
        } 
      }
       
      //If the item is new, get and set prices from Neocodex, then get shop items again
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

              if(htmlElement.querySelector(".idbQuickPrice")) {
                price = parseInt(htmlElement.querySelector(".idbQuickPrice").textContent.match(/[\d,]+/)[0].split(",").join(""))
              }

              htmlElement.remove()

              SAVED_PRICES.push({name: name, price: price})
              GM_setValue("iglooProfits", JSON.stringify(SAVED_PRICES))
              resolve(getShopItems())
            },
            onerror: function(error) {
              reject(error)
            }
          })
        })
      }

      //If the item exists, push it to shopItems
      shopItems.push({name: name, profit: price - cost, link: link})
    }
    
    SHOP_ITEMS.length = 0
    SHOP_ITEMS.push(...shopItems)
    
    return true
  }
  
  // If getShopItems has finished running, 
  // sort the items and click on the most profitable item
  getShopItems()
  
  if (getShopItems()) {   
    SHOP_ITEMS.sort((a, b) => b.profit - a.profit)
    console.log(SHOP_ITEMS)
    
    //If profitable, buy item
    if (SHOP_ITEMS[0].profit > MINIMUM_PROFIT) SHOP_ITEMS[0].link.click()
    else {
      //If not profitable, refresh shop on the 37 second mark of the next minute
      const now = new Date()
      const waitTime = (97 - now.getSeconds() % 60) * 1000
      
      window.setTimeout(() => window.location.reload(), waitTime)
    }
  }  
}

//After purchase
if (URL.includes("process_igloo.phtml")) {
  const message = document.querySelector("center p").textContent
  let waitTime = 55000 + Math.random() * 10000  
  
  //Go back to home page if item has run out
  if (message.includes("Sorry")) {
    document.querySelector('input[value="Back to the Garage Sale"]').click()
    
  } else if (message.includes("Come back in a couple of minutes")) {
    //Refresh every 10 seconds or so until item can be repurchased
    waitTime = 9000 + Math.random() * 2000
  } else {
    let count = window.localStorage.getItem('iglooCount');
    count++;
    window.localStorage.setItem('iglooCount', JSON.stringify(count));
  }
  
  window.setTimeout(() => window.location.reload(), waitTime)
}