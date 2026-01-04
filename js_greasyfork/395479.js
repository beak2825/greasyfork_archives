// ==UserScript==
// @name         Map Value
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Work out the valud of your map items
// @author       JustJ
// @match        https://www.torn.com/city.php*
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/395479/Map%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/395479/Map%20Value.meta.js
// ==/UserScript==


const apikey = 'API_KEY_HERE'

let itemList = null;

const torn_api = async () => {
  // copy/paste, shoutout to original author (..who I forgot who it was)!
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: "POST",
      url: `https://api.torn.com/torn/?selections=items&key=${apikey}`,
      headers: {
        "Content-Type": "application/json"
      },
      onload: (response) => {
          try {
            const resjson = JSON.parse(response.responseText)
            resolve(resjson)
          } catch(err) {
            reject(err)
          }
      },
      onerror: (err) => {
        reject(err)
      }
    })
  })
}

async function getItems() {
  const response = await torn_api();
  if (response.error) {
      console.warn('API key error')
  } else {
      return response;
  }
}

const mapToTotal = (map) => {
   let total = 0;
    let largest = 0;
    let largestId = 0;
    let largestName = 0;
   for (const img of map.getElementsByClassName('leaflet-marker-icon leaflet-zoom-hide leaflet-clickable')) {
       if(img.title) {
           let id = getItemId(img.src);
           let price = getItemPrice(id);
           if (price > largest) {
               largest = price;
               largestId = id;
               largestName = itemList[id].name;
           }
           total = total + price;
       }
   }
    console.log("Largest price: " + largest + " - " + largestName + " - " + largestId);
    return total;
};

const getItemId = (imageUrl) => {
    return imageUrl.replace('https://www.torn.com/images/items/', '').replace('/large.png', '') - 1;
};

const getItemPrice = (itemId) => {
  return (itemList[itemId] || {}).market_value;
};

const container = '.leaflet-map-pane .leaflet-marker-pane';
waitForKeyElements(container, function () {
    getItems().then(response => {
        itemList = Object.values(response.items);
        const wrapper = document.querySelector(container);

        console.log(mapToTotal(wrapper));
    });
});

