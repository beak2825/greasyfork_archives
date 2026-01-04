// ==UserScript==
// @name         Highlight items below trade-in value
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Highlights items in market selling for less than their trade-in value
// @author       cookctorn
// @match        https://www.torn.com/imarket.php*
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390801/Highlight%20items%20below%20trade-in%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/390801/Highlight%20items%20below%20trade-in%20value.meta.js
// ==/UserScript==

const apikey = 'ADDYOURAPIKEYHERE'

let itemList = null;

const torn_api = async () => {
  // copy/paste, shoutout to original author!
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

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.classList && node.classList.contains('buy-item-info-wrap')) {
          // refactor this to use observable
          setTimeout(() => {
              const items = $('.buy-item-info-wrap ul.item, .buy-item-info-wrap ul.items li.private-bazaar ul.item');
              if (items.length !== 0) {
                  $.each(items, (index, item) => {
                      const cost = parseInt($(item).find('li.cost').text().split('$')[1].replace(/,/g, ''));
                      const name = $(item).find('span.t-hide').text().trim() || $(item).find('.item-name .right').text().trim();

                      itemList.forEach(i => {
                          if (name.includes(i.name)) {
                              console.warn(`${i.name} sell price is ${i.sell_price} and is on market for ${cost}`);
                              if (i.sell_price > cost) {
                                  $(item).css('background-color', 'rgba(0, 255, 0, 0.4)');
                              }
                          }
                      });
                  });
              } else {
                  console.warn('Failed at items.length !== 0');
              }
          }, 1000);
      }
    }
  }
})

const container = '#item-market-main-wrap';
waitForKeyElements(container, function () {
    getItems().then(response => {
        itemList = Object.values(response.items);
    });
    const wrapper = document.querySelector(container);
    observer.observe(wrapper, { subtree: true, childList: true })
});

