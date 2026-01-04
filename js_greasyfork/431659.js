// ==UserScript==
// @name         Neopets: Job board
// @author       Tombaugh Regio
// @version      1.0
// @description  Hides unprofitable jobs, and adds links to the Shop Wizard, Safety Deposit Box and official shop
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/faerieland/employ/employment.phtml?type=jobs*
// @match        http://www.neopets.com/shops/wizard.phtml?jobboard&string=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431659/Neopets%3A%20Job%20board.user.js
// @updateURL https://update.greasyfork.org/scripts/431659/Neopets%3A%20Job%20board.meta.js
// ==/UserScript==

//==============================================

const MINIMUM = {
  //Minimum reward in NP
  reward: 6000,
  
  //Minimum profit in NP
  profit: 3000,  
  
  //Minimum time in minutes
  time: 30
}

//==============================================

const URL = document.URL

if (URL.includes("employment.phtml") && document.querySelector(".content tbody")) {
  const COUPONS = [
    {
      name: "",
      minimum: 0
    },
    {
      name: "Green",
      minimum: 5900
    },
    {
      name: "Blue",
      minimum: 5900
    },
    {
      name: "Red",
      minimum: 5900
    },
    {
      name: "Silver",
      minimum: 26250
    },
    {
      name: "Gold",
      minimum: 55500
    },
    {
      name: "Purple",
      minimum: 0
    },
    {
      name: "Pink",
      minimum: 0
    },
    {
      name: "Green Brightvale",
      minimum: 20500
    },
    {
      name: "Bronze Brightvale",
      minimum: 40500
    },
    {
      name: "Silver Brightvale",
      minimum: 60500
    },
    {
      name: "Gold Brightvale",
      minimum: 76000
    }
  ]
  
  
  
  let jobListings = new Array()
  
  //Get and set unit costs
  let itemCosts = []
  if (GM_getValue("itemCosts")) {
    itemCosts = JSON.parse(GM_getValue("itemCosts"))
  }
  
  function getUnitCost(name) {
    for (const item of itemCosts) {
      if (item.name == name) return item.cost
    }
    
    return 0
  }
    
  //Get and parse listings
  function getListings() {
    const tableRows = document.querySelector(".content tbody").querySelectorAll("tr")
    let tempElements = new Array()
    let tempListing = {qty: 0, name: "n/a", time: 0, reward: 0, coupon: 0, elements: []}

    for (const [i, row] of tableRows.entries()) {
      tempElements.push(row)
      
      //Parse table row with listing details
      if (i % 3 == 1) {
        const [
          findNumber, 
          nameText, 
          break1, 
          break2, 
          timeLabel, 
          timeText, 
          rewardLabel, 
          rewardText,
          break3,
          break4,
          couponElement
        ] = row.querySelector("td").childNodes
        
        const getQuantity = e => parseInt(e.textContent
                                          .match(/[\d,]+/)[0]
                                          .split(",")
                                          .join("")
                                         )
        
        const name = nameText.textContent.trim()
        const reward = getQuantity(rewardText)
        
        tempListing.qty =  getQuantity(findNumber)
        tempListing.name =  name
        tempListing.time =  getQuantity(timeText)
        tempListing.reward =  reward
        
        //If the job listing requires a job coupon, set the coupon minimum
        if (!URL.includes("voucher=basic")) {
          const couponName = couponElement.querySelector("span").textContent.trim()
          
          for (const coupon of COUPONS) {
            if (coupon.name == couponName) tempListing.coupon = coupon.minimum
          }
        }
      }

      //Every 3 rows, push listing details and elements, and clear temp arrays
      if (i % 3 == 2) {
        tempListing.elements = tempElements
        jobListings.push(tempListing)
        tempElements = []
        tempListing = {qty: 0, name: "n/a", time: 0, reward: 0, coupon: 0, elements: []}
      }
    }
    
    return true
  }
  
  function hideListing(elements, name) {
    for (const row of elements) {
          row.style.display = "none"
        }

        //Filter out bad listings
        jobListings = jobListings.filter(a => a.name != name)
  }
  
  //Modify listings  
  function hideBadListings() {
    for (const each of jobListings) {
      const {qty, name, time, reward, coupon, elements} = each
      
      //Hide listings that don't meet requirements
      if (reward < MINIMUM.reward 
          || time < MINIMUM.time
          || reward - coupon < MINIMUM.profit
         ) {
        hideListing(elements, name)
      }
    }
    
    return true
  }
  
  function modifyCollectHeading() {
    for (const listing of jobListings) {
      const {name, qty, reward, coupon, elements} = listing
      const sdbSearchString = `http://www.neopets.com/safetydeposit.phtml?obj_name=${name}&category=0`
      const storeSearchString = `http://www.neopets.com/search.phtml?selected_type=object&string=${name.split(" ").join("+")}`
      const collectElement = elements[0].querySelector("b")      
      
      const maxPrice = Math.floor((reward - MINIMUM.profit - coupon) / qty)
      let restockCost = 0
      
      //If the item cost hasn't been saved, get item cost from Neocodex
      let isSaved = false
      for (const saved of itemCosts) {
        if (saved.name == name) {
          isSaved = true
          restockCost = saved.cost
        }
      }

      if (!isSaved) {
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

              let cost = 0
              if(htmlElement.querySelector(".idbQuickPrice")) {
                cost = parseInt(htmlElement.querySelector(".idbQuickPrice").textContent.match(/[\d,]+/)[0].split(",").join(""))
              }
              
              restockCost = cost
              itemCosts.push({name: name, cost: cost})

              htmlElement.remove()
              GM_setValue("itemCosts", JSON.stringify(itemCosts))
              resolve(modifyCollectHeading())
            },
            onerror: function(error) {
              reject(error)
            }
          })
        })
      }
      
      if (maxPrice < restockCost) hideListing(elements, name)
      
      //Add link to Shop Wizard
      collectElement.innerHTML = `${collectElement.textContent.match(/\d+/)[0]}. 
                                  <a href="http://www.neopets.com/shops/wizard.phtml?jobboard&string=${name}">
                                    Buy for ${maxPrice} NP
                                  </a>`
      collectElement.onclick = () => GM_setValue("shopWizardPrice", maxPrice)
      
      //Add link to official shop, if profitable
      new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: storeSearchString,
          onload: function(response) {
            const htmlElement = document.createElement("html")
            htmlElement.innerHTML = response.responseText
            const officialCost = parseInt(htmlElement.querySelector(".search-item-value strong").textContent.match(/\d+/)[0]) * 1.75
            htmlElement.remove()
            
            if (maxPrice > officialCost && !collectElement.textContent.includes("⬩ (Buy)")) {
              collectElement.innerHTML += ` ⬩ <a href=${storeSearchString}>(Buy)</a>`
              resolve(true)
            }
            
            resolve(false)
          },
          onerror: function(error) {
            reject(error)
          }
        })
      })
      
      //Add qty in Safety Deposit Box, if available
      new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: sdbSearchString,
          onload: function(response) {
            const htmlElement = document.createElement("html")
            htmlElement.innerHTML = response.responseText
            
            if(htmlElement.querySelectorAll(".content form tbody").length > 2) {
              const items = [...htmlElement.querySelectorAll(".content form tbody")[2].querySelectorAll("tr")].slice(1, -1)

              for (const item of items) {
                const sdbName = item.querySelectorAll("td")[1].querySelector("b").childNodes[0].textContent
                
                if (name == sdbName && !collectElement.textContent.includes(" in SDB)")) {
                  const sdbQty = parseInt(item.querySelectorAll("td")[4].textContent.trim().split(",").join(""))
                  
                  //Add link to Safety Deposit Box
                  collectElement.innerHTML += ` ⬩ <a href="${sdbSearchString}">(${sdbQty} in SDB)</a>`
                  htmlElement.remove()
                  
                  resolve(true)
                }
              }
            }
            
            htmlElement.remove()
            resolve(false)
          },
          onerror: function(error) {
            reject(error)
          }
        })
      })
    }
  }
  
  getListings()
  if (hideBadListings()) modifyCollectHeading()
  
} else if (URL.includes("employment.phtml")) {
  //Go back a page if page is empty
  window.history.back()
}

if (URL.includes("wizard.phtml")) {
  document.querySelector("#max_price").value = GM_getValue("shopWizardPrice")
}
