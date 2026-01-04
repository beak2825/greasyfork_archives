// ==UserScript==
// @name        Allegro.pl - convert prices to EUR
// @namespace   Violentmonkey Scripts
// @match       https://allegro.pl/oferta/*
// @match       https://allegro.pl/uzytkownik/*
// @match       https://allegro.pl/listing
// @match       https://allegro.pl/produkt/*
// @match       https://allegro.pl/kategoria/*
// @run-at      document-idle
// @grant       none
// @version     1.3
// @author      -
// @description 1/16/2022, 1:31:29 AM - Convert prices to EUR. You have to get a free API key from https://free.currencyconverterapi.com/ in order to use this script. The first time you use it on allegro, you will receive a prompt for the API key. It will keep prompting until you provide a valid key. If you don't want to see the prompt, turn off the script.
// @downloadURL https://update.greasyfork.org/scripts/438574/Allegropl%20-%20convert%20prices%20to%20EUR.user.js
// @updateURL https://update.greasyfork.org/scripts/438574/Allegropl%20-%20convert%20prices%20to%20EUR.meta.js
// ==/UserScript==


// set debug to true to see log messages from this script.
const debug = true

const messageTitle = "Allegro.pl convert to EUR greasemonkey script:"


// log stuff to console with a banner but only if debugging is turned on in the script
function log(...arguments) {
  if (debug) console.log(messageTitle, ...arguments)
}


// create an Euro price string based on found parts of price in PLN.
function pricePlnToEur(conversionRate, match1, match2) {
  const priceStr = "".concat(match1.replace(/\ /g, ''), match2)
    const priceGrosze = parseInt(priceStr) // price expressed as an integer amount of Grosz
    
    const priceCents = Math.round(priceGrosze * conversionRate) // price expressed as an integer amount of Cents. Round to nearest (i.e. 16.5 -> 17)
    const priceCentsStr = priceCents.toString() // string version of price expressed as an integer amount of Cents
    const priceEurStr = priceCentsStr.slice(0, -2) // whole Euros
    const priceCentsFracStr = priceCentsStr.slice(-2) // Cents after decimal point
    const priceEurStrFull = "".concat(priceEurStr.padStart(1, "0"), ".", priceCentsFracStr.padStart(2, "0")) // price in Euro expressed as string. the padding is to prevent prices like 1 cent or 44 cents from showing up with necessary leading zeros.
    return priceEurStrFull
}


// xpath might be "deprecated", but it's still the only thing that can search by text.
function getElementsByXPath(xpath, parent)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}


// register a listener that adds Euro prices. Note that it must be idempotent: if it is successfully run twice on the same element, it shouldn't add the prices twice, only once.
function registerListener(callback) {
  callback()

  document.addEventListener('scroll', callback) // needed because when you run the callback items that are off screen will not be processed

  const observer = new MutationObserver(callback) // eg used for going to the next page of results
  observer.observe(document, { attributes: true, childList: true, subtree: true })

  // used for when the tab was in the background and now becomes visible. This is important because sometimes dom modifications to background tabs just fail. I don't know if it's because of allegro, or if it's the browsers optimizing this stuff away, but doing this - performing a pass once the tab becomes visible - helps.
  document.addEventListener('visibilitychange', function(event) {
    if (document.visibilityState === "visible") callback()
  })
}


// check if the span has already been added to prevent adding it multiple times
function addChildOnce(parent, newChild, searchClass) {
  var alreadyAttached = false
  siblings = parent.childNodes
  siblings.forEach(function (sibling) {
    if (sibling.classList.contains(searchClass)) {
      alreadyAttached = true
    }
  })
  if (!alreadyAttached) {
    parent.appendChild(newChild) // add span that contains euro price
  }
}


async function main() {
  
// We can only await inside an async function, so the whole script has to be an async function.
// I'm not indenting this function because it is the whole file.

storage = window.localStorage
const forexApiBase = "https://free.currconv.com/api/v7/convert"
const forexApi = "".concat(forexApiBase, "?q=PLN_EUR&compact=ultra&apiKey=")

// If the foreign exchange api key is not present, request it from the user, and save it in storage.
if(storage.getItem("forexApiKey") === null) {
  const newForexApiKey = prompt("".concat(messageTitle, "Please enter API Key. You can request it for free from https://free.currencyconverterapi.com/"), "")
  const apiCallValidate = "".concat(forexApi, newForexApiKey)
  log("about to create the following request to validate the API key: ", apiCallValidate)
  
  // validate the key
  fetch(apiCallValidate).then(function(response) {
    if (response.status !== 200) {
      // Apparently errors >= 400 do not count to trigger onerror
      throw new Error("Response HTTP code not 200 during api key validation") // fixme: use a typed error
    }
    storage.setItem("forexApiKey", newForexApiKey)
  }).catch(function(error) {
    alert("".concat(messageTitle, "Error performing API request. Is the key correct?"))
    log("Error performing API request. Is the key correct?")
    log(error)
  })
}

// get the api key from storage and convert the prices.
const forexApiKey = storage.getItem("forexApiKey")
if(forexApiKey !== null) {
  // perform actual call with the api key
  apiCall = "".concat(forexApi, forexApiKey)
  log("about to create the following request to get the conversion rate: ", apiCall)
  
  fetch(apiCall).then(function(response) {
    if (response.status !== 200) {
      // Apparently errors >= 400 do not count to trigger onerror
      throw new Error("Response HTTP code not 200 during API call") // fixme: use a typed error
    }
    return response.json()
  }).then(function(data) {
    // convert stuff
    log("found conversion rate: ", data["PLN_EUR"])
    // find the price:
    
    // which page are we on?
    const loc = window.location.toString()
    
    // item page
    if(loc.startsWith("https://allegro.pl/oferta/")) {
      log("detected item page.")
    
      // convert item price
      function attachEurToMainPrice() {
        const list = document.querySelectorAll('[aria-label^="cena "]') // ^= means "begins with".
        log("found the following elements:", list)
        if (list.length !== 1) {
          const elmErr = "Found too many or no elements when searching for price. Aborting."
          log(elmErr)
          throw new Error("".concat(messageTitle, " ", elmErr)) // fixme: use a typed error
        }
        const priceDiv = list[0]
        const priceLabel = priceDiv.attributes["aria-label"].value
        const matches = priceLabel.match(/^cena ([0-9]{1,3}(?:\ [0-9]{3})*)\.([0-9]{2}) zł$/) // note the decimal point is a comma on the listing page and a period on the item page. The regex means that you have 1-3 digits, then maybe (a space and 3 digits) repeated.
        priceEurStrFull = pricePlnToEur(data["PLN_EUR"], matches[1], matches[2])
        const priceEurSpan = document.createElement('span')
        priceEurSpan.textContent = "".concat("\u00a0=\u00a0", priceEurStrFull, "\u00a0EUR")
        priceEurSpan.classList.add("priceEur") // used to check if this span has already been added
        log("priceDiv:", priceDiv)
        addChildOnce(priceDiv, priceEurSpan, "priceEur")
      }
      
      registerListener(attachEurToMainPrice)
      
      // convert prices of carousel items
      function attachEurToCarousel() {
        carouselSpans = getElementsByXPath("//div[contains(@class, 'carousel-item')]/div/ul/li/span/span[contains(text(),' zł')]/..")
        
        log("carouselSpans:", carouselSpans)
        carouselSpans.forEach(function(priceSpan) {
          log("priceSpan:", priceSpan)
          if (!priceSpan.classList.contains("priceEur")) { // priceEur would mean it's already an Euro price we placed
            const matches =  priceSpan.innerText.match(/^([0-9]{1,3}(?:\ [0-9]{3})*),([0-9]{2}) zł$/) // note the decimal point is a comma
            priceEurStrFull = pricePlnToEur(data["PLN_EUR"], matches[1], matches[2])
            const priceEurSpan = document.createElement('span')
            priceSpan.classList.forEach(function(cls) {
              priceEurSpan.classList.add(cls)
            })
            priceEurSpan.classList.add("priceEur") // used to check if this span has already been added
            priceEurSpan.textContent = "".concat(priceEurStrFull, "\u00a0EUR")
            priceSpan.parentNode.replaceChild(priceEurSpan, priceSpan) // we don't leave the original price in since there's no space left.
          }
        })
      }
      
      registerListener(attachEurToCarousel)
      
      
      // listing page
      } else if (loc.startsWith("https://allegro.pl/uzytkownik/")
            || loc.startsWith("https://allegro.pl/listing")
            || loc.startsWith("https://allegro.pl/produkt")
            || loc.startsWith("https://allegro.pl/kategoria")
              ) {
      log("detected listing page.")
      
      function attachEurToListings() {
        list = document.querySelectorAll('[aria-label$=" zł aktualna cena"]') // $= means "ends with".
        log("found the following elements:", list)
        
        list.forEach(function(priceSpan) {  
          const priceLabel = priceSpan.attributes["aria-label"].value
          const matches = priceLabel.match(/^([0-9]{1,3}(?:\ [0-9]{3})*),([0-9]{2}) zł aktualna cena$/) // note the decimal point is a comma on the listing page and a period on the item page. The regex means that you have 1-3 digits, then maybe (a space and 3 digits) repeated.
          priceEurStrFull = pricePlnToEur(data["PLN_EUR"], matches[1], matches[2])
          const priceEurSpan = document.createElement('span')
          priceEurSpan.textContent = "".concat("\u00a0=\u00a0", priceEurStrFull, "\u00a0EUR")
          priceSpan.classList.forEach(function(cls) {
            priceEurSpan.classList.add(cls)
          })
          priceEurSpan.classList.add("priceEur") // used to check if this span has already been added
          priceDiv = priceSpan.parentNode

          addChildOnce(priceDiv, priceEurSpan, "priceEur")
        })
      }
      
      registerListener(attachEurToListings)
      
    }
  }).catch(function(error) {
    // fixme: make this better
    log("Error performing API request. Is the key correct?")
    log(error)
  })
}
}


var runMainOnce = (function() {
  var executed = false
  return function() {
    if (!executed) {
      executed = true
      main()
    }
  }
})()



// Execute the code in one of two ways...

// This event runs when we switch into a tab that just loaded.
document.addEventListener('visibilitychange', function(event) {
  if (document.visibilityState === "visible") {
    runMainOnce()
  }
})

// This code runs if the tab is visible while it's loading.
if (document.visibilityState === "visible") {
  runMainOnce()
}
