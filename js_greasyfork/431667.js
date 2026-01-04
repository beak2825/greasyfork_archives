// ==UserScript==
// @name         Neopets: Tarla's Shop of Mystery
// @author       Tombaugh Regio
// @version      1.0
// @description  Selects the cheapest item on the page
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/winter/shopofmystery.phtml
// @match        http://www.neopets.com/winter/process_shopofmystery.phtml?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431667/Neopets%3A%20Tarla%27s%20Shop%20of%20Mystery.user.js
// @updateURL https://update.greasyfork.org/scripts/431667/Neopets%3A%20Tarla%27s%20Shop%20of%20Mystery.meta.js
// ==/UserScript==


//==================================

//Maximum price you're willing to pay for a mystery item
const MAX_PRICE = 500

//==================================

const URL = document.URL

if (URL.includes("winter/shopofmystery.phtml")) {
  const d = new Date();
  const date = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const currentDate = date + "/" + month + "/" + year;
  const storedDate = window.localStorage.getItem('tarlaDate');
  const storedCount = window.localStorage.getItem('tarlaCount') == null ? 0 : window.localStorage.getItem('tarlaCount');
  if (storedDate != currentDate) {
      window.localStorage.setItem('tarlaDate', currentDate);
      window.localStorage.setItem('tarlaCount', '0');
  }

  const items = document.querySelector(".content tbody").querySelectorAll("td")
  const buyableItems = new Array()

  for (const item of items) {
    const cost = parseInt(item.textContent.match(/[\d,]{3,}/)[0].split(",").join(""))

    if (cost < MAX_PRICE) buyableItems.push({cost: cost, link: item.querySelector("a")})
  }

  if (buyableItems.length > 0) {
    buyableItems.sort((a, b) => a.cost - b.cost)
    buyableItems[0].link.click()
  }
}

if (URL.includes("process_shopofmystery.phtml")) {
  const message = document.querySelector(".content div").textContent
  let waitTime = 90000 + Math.random() * 5000
  
  //Go back to home page if item has run out
  if (message.includes(":(")) {
    document.querySelector('input[value="Back to the Shop of Mystery"]').click()
    
  } else if (message.includes("couple of minutes")) {
    //Refresh every 10 seconds or so until item can be repurchased
    waitTime = 9000 + Math.random() * 2000
  } else {
    let count = window.localStorage.getItem('tarlaCount');
    count++;
    window.localStorage.setItem('tarlaCount', JSON.stringify(count));
  }
  
  window.setTimeout(() => window.location.reload(), waitTime)
}