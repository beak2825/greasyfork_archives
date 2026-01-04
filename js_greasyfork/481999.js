// ==UserScript==
// @name         Main Market Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  show market prices compared to trader price lists
// @author       Terekhov
// @match        https://www.torn.com/imarket.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481999/Main%20Market%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/481999/Main%20Market%20Script.meta.js
// ==/UserScript==

const lsKey_itemInventoryCountsToGoBaseKey = '__itemInventoryCountsToGo';
const colorHaveEnough = '#E0E0E0';  // grey
const colorNeedMore = '#FFFFCC';    // light yellow
const colorHighlight = '#90EE90';   // light green


/**
 * This map uses the market tab's 'data-cat' attribute as the top-level keys
 *
 * See {@link #getActiveMarketTab} to see how to find market tabs
 */
const itemCrossReference = {
  flowers: {
    defaultNumItemsToTarget: 250,
    marketDivId: 'flowers',
    itemsDataType: 'Flower',
    idToItemPriceNameMappings: {
      '129' : 'dozenRoses',
      '97' : 'bunchOfFlowers',
      '184' : 'bunchOfBlackRoses',
      '183' : 'singleRedRose',
      '260' : 'dahlia',
      '263' : 'crocus',
      '617' : 'bananaOrchid',
      '264' : 'orchid',
      '272' : 'edelweiss',
      '267' : 'heather',
      '271' : 'ceiboFlower',
      '277' : 'cherryBlossom',
      '282' : 'africanViolet',
      '276' : 'peony',
      '385' : 'tribulus',
    }
  },
  plushies: {
    defaultNumItemsToTarget: 750,
    marketDivId: 'plushies',
    itemsDataType: 'Plushie',
    idToItemPriceNameMappings: {
      '215': 'kitten',
      '186': 'sheep',
      '187': 'teddyBear',
      '618': 'stingray',
      '261': 'wolverine',
      '273': 'chamois',
      '258': 'jaguar',
      '266': 'nessie',
      '268': 'redFox',
      '269': 'monkey',
      '274': 'panda',
      '281': 'lion',
      '384': 'camel'
    }
  }
};

function addGlobalStyle(css) {
  // e.g. addGlobalStyle('body { color: white; background-color: black; }');
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.innerHTML = css;
  head.appendChild(style);
}
function removeElementByIdIfExists(id) {
  const limitsDiv = document.getElementById(id);
  if (limitsDiv) {
    limitsDiv.remove();
  }
}

function getActiveMarketTab() {
  const marketTabs = document.querySelector('.market-tabs').children;
  for (let i = 0; i < marketTabs.length; i++) {
    if (marketTabs[i] && marketTabs[i].getAttribute('aria-selected') === 'true') {
      return marketTabs[i];
    }
  }
  return null;
}

const setPricesInputId = 'setPricesInput';
const setCountsDivId = 'setCountsDiv';
const setCountsUlId = 'setCountsUl';

addGlobalStyle('#setCountsDiv { position: absolute; right: 168px; top: 188px; width: 200px; height: 492px; }');
addGlobalStyle(`.needMoreOfItem { background-color: ${colorNeedMore}; }`);
addGlobalStyle(`.haveEnoughOfItem { background-color: ${colorHaveEnough}; }`);
addGlobalStyle(`li.highlightItem { background-color: ${colorHighlight}; }`);

function createOrUpdateSetCounts(itemCountsToGo) {

  //
  // Changed tab. Clear out the counts div
  //
  let setCountsDiv = document.getElementById(setCountsDivId);
  const divAlreadyExisted = !!setCountsDiv;
  if (!divAlreadyExisted) {
    setCountsDiv = document.createElement('div');
    setCountsDiv.id = setCountsDivId;
  } else {
    // If it already existed (say for plushies tab), then clear it out, so we can populate for the new tab
    setCountsDiv.innerHTML = '';
  }

  //
  // Do a couple checks to see if we know anything about this tab. If not, return early
  //
  const currentMarketTabName = getActiveMarketTab().getAttribute('data-cat');
  const currentItemXref = itemCrossReference[currentMarketTabName];
  if (!currentItemXref) {
    console.log(`createOrUpdateSetCounts() have no knowledge of market tab ${currentMarketTabName}. Returning without processing.`);
    return;
  }
  console.log(`createOrUpdateSetCounts() currentTab = ${currentMarketTabName}`);

  let prices = JSON.parse(localStorage.getItem("prices") ?? '{}');
  if (Object.keys(prices).length === 0) {
    console.error(`createOrUpdateSetCounts() have no prices for ${currentMarketTabName}.`)
    return;
  }

  //
  // Main processing
  //
  let setCountsInnerHtmlBuilder = `
  <ul id="${setCountsUlId}" class="items-cont tab-menu-cont cont-gray bottom-round itemsList ui-tabs-panel ui-widget-content ui-corner-bottom current-cont" data-loaded="0" data-from="12" data-all="0" aria-labelledby="ui-id-17" role="tabpanel" aria-expanded="true" aria-hidden="false" data-total="12">
  `;

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });


  const orderOfItemsInUI = function() {
    let items = [];
    const collection = document.querySelector(`#${currentMarketTabName}`).children[0].children;
    for (let i = 0; i < collection.length; i++) {
     items.push(collection[i]);
    }
    return items;
  }()
    .filter(ele => Object.keys(currentItemXref.idToItemPriceNameMappings).indexOf(ele.getAttribute('data-item')) !== -1)
    .map(ele => ele.getAttribute('data-item'))
  let totalCostRemaining = 0;
  for (const itemId of orderOfItemsInUI) {
    const bgColorClass = +itemCountsToGo[itemId] > 0 ? 'needMoreOfItem' : 'haveEnoughOfItem';
    const itemPriceName = currentItemXref.idToItemPriceNameMappings[itemId];
    const itemPriceToAimFor = itemPriceName ? +prices[currentMarketTabName][itemPriceName].replace('$', '').replaceAll(',', '') : 0;
    const costRemainingForItem = itemCountsToGo[itemId] * itemPriceToAimFor;
    totalCostRemaining += costRemainingForItem;

    setCountsInnerHtmlBuilder += `<hr><li id="count${itemId}" class="${bgColorClass} first-in-row m-first-in-row t-first-in-row tt-overlay-ignore">
      <div class="title-wrap">
        <div class="title left">
          <span class="image-wrap ">
          <img class="torn-item medium" src="/images/items/${itemId}/medium.png" srcset="/images/items/${itemId}/medium.png 1x, /images/items/${itemId}/medium@2x.png 2x, /images/items/${itemId}/medium@3x.png 3x, /images/items/${itemId}/medium@4x.png 4x" alt="Camel Plushie">
          </span>
          <span class="name" style='text-align: center'>${itemCountsToGo[itemId]} (${USDollar.format(costRemainingForItem)})</span>
        </div>
      </div>
      <div class="clear"></div>
    </li>`;
  }

  // Grand Total
  setCountsInnerHtmlBuilder += `<hr><li class="first-in-row m-first-in-row t-first-in-row tt-overlay-ignore">
      <div class="title-wrap">
        <div class="title left" style='padding: 10px'>
          <p><strong>Total Remaining: </strong> ${USDollar.format(totalCostRemaining)}</p>
        </div>
      </div>
      <div class="clear"></div>
    </li>`;

  setCountsInnerHtmlBuilder += `<li class="first-in-row m-first-in-row t-first-in-row tt-overlay-ignore">
    <button style="padding-top: 7px; padding-left: 30px;">Update Counts</button>
  </li>`;
  setCountsInnerHtmlBuilder += `</ul>`;

  setCountsDiv.innerHTML = setCountsInnerHtmlBuilder;
  if (!divAlreadyExisted) {
    document.body.appendChild(setCountsDiv);
  }
  const button = document.getElementById('setCountsDiv').children[0].children[document.getElementById('setCountsDiv').children[0].children.length - 1].children[0];
  button.addEventListener('click', createOrUpdateSetCounts);
}

const countUpdatesChannel = new BroadcastChannel("itemCountUpdates");

// Highlight the item we care about, when we click on the item buy icon
function toggleCurrentItemHighlight(event) {
  const itemId = event.target.parentElement.getAttribute('itemid')
  const liEle = document.getElementById(`count${itemId}`);
  liEle.classList.toggle('highlightItem');
}

function addPricesInputAndShowPricesInsteadOfName() {
  console.log('setPrices');
  let interval_showPricesInsteadOfName = setInterval(showPricesInsteadOfName, 650);
  let addPricesIntervalId = setInterval(addInputForDesiredPricesAndProcessPrices, 650);
  setTimeout(() => {
    document.querySelectorAll('.buy-info').forEach((ele) => {
      ele.addEventListener('click', toggleCurrentItemHighlight);
    });
  }, 650);

  function showPricesInsteadOfName() {
    let searchNames = document.querySelectorAll('span.searchname');
    let minPrices = document.querySelectorAll('span.minprice');

    if (searchNames.length > 0 && minPrices.length > 0) {
      searchNames.forEach(function(ele) {ele.removeAttribute('style'); ele.style.display = 'none'; })
      minPrices.forEach(function(ele) {ele.removeAttribute('style'); ele.style.display = 'inline-block'; })
      clearInterval(interval_showPricesInsteadOfName);
    }
  }

  function addInputForDesiredPricesAndProcessPrices() {
    if (!document.getElementById(setPricesInputId)) {
      let pricesInput = document.createElement('input');
      pricesInput.placeholder = 'Paste Prices';
      pricesInput.id = setPricesInputId;
      document.querySelectorAll('[action="imarket.php"]')[0].appendChild(pricesInput);
      pricesInput.addEventListener( 'input', (e) => {
        console.log('currentVal = ', e.target.value)
        if (e.target.value) {
          localStorage.setItem("prices", e.target.value);
          processPrices();
          pricesInput.value = '';
        }
      });
    }
    processPrices();
    clearInterval(addPricesIntervalId);
  }
}

function processPrices() {
  const currentMarketTabName = getActiveMarketTab().getAttribute('data-cat');
  let prices = localStorage.getItem("prices");
  // console.log("processPrices() = ", prices);
  if (!prices) {
    return;
  }
  prices = JSON.parse(prices);
  if (!prices[currentMarketTabName]) {
    console.log(`processPrices() have no prices for market tab ${currentMarketTabName}. Returning early.`);
    return;
  }

  const acceptablePercentage = 0.01;
  const itemCountsToGo = JSON.parse(localStorage.getItem(`${lsKey_itemInventoryCountsToGoBaseKey}_${currentMarketTabName}`));
  for (let child of document.querySelector(`#${currentMarketTabName}`).children[0].children) {
    if (child) {
      const itemId = child.getAttribute('data-item');
      if (itemId) {
        // Set yellow color - we want these
        if (+itemCountsToGo[itemId] > 0) {
          if (!child.classList.contains('needMoreOfItem')) {
            child.classList.add('needMoreOfItem');
          }
          child.classList.remove('haveEnoughOfItem');
        } else {
          if (!child.classList.contains('haveEnoughOfItem')) {
            child.classList.add('haveEnoughOfItem');
          }
          child.classList.remove('needMoreOfItem');
        }


        let childSpan = child.children[1].children[1];

        // e.g. '$733,433 (1,311,196)' --> 733433
        let amount = childSpan.innerText.substring(0, childSpan.innerText.indexOf('(')).trim().replace('$', '').replaceAll(',', '');

        const itemPriceName = itemCrossReference[currentMarketTabName].idToItemPriceNameMappings[itemId];
        if (itemPriceName) {
          const itemPriceToAimFor = prices[currentMarketTabName][itemPriceName].replace('$', '').replaceAll(',', '');
          // console.log('amount = ', amount);
          // console.log('itemPriceToAimFor = ', itemPriceToAimFor);
          // console.log('amount < itemPriceToAimFor = ', (amount < itemPriceToAimFor));
          // console.log('other = ', (1 - (amount/itemPriceToAimFor)));
          const percentDifference = (1 - (amount/itemPriceToAimFor));
          let mathSign = '+';
          if (amount < itemPriceToAimFor && (1 - (amount/itemPriceToAimFor)) >= acceptablePercentage) {
            mathSign = '-';
            childSpan.style.fontWeight = 'bold'
            childSpan.style.color = '#228B22';
            childSpan.children[0].style.fontWeight = 'bold'
            childSpan.children[0].style.color = '#228B22';
          }
          childSpan.children[0].textContent = (`( $` + itemPriceToAimFor + ' / ' + (Math.round(percentDifference*100)) + '% )');
        }
      }
    }
  }
}

function executeScript() {
  countUpdatesChannel.onmessage = (event) => {
    createOrUpdateSetCounts(event.data);
  };

  runScriptIfInKnownMarketTab();
}
function runScriptIfInKnownMarketTab(data) {
  console.log('runScriptIfInKnownMarketTab()');
  const categoriesBeingTracked = Object.keys(itemCrossReference);
  const currentMarketTabName = getActiveMarketTab().getAttribute('data-cat');
  console.log(`runScriptIfInKnownMarketTab() currentTab = ${currentMarketTabName}`);

  if (categoriesBeingTracked.includes(currentMarketTabName)) {
    if (!data) {
      data = JSON.parse(localStorage.getItem(`${lsKey_itemInventoryCountsToGoBaseKey}_${currentMarketTabName}`));
    }
    createOrUpdateSetCounts(data);
  }
}

(function() {
  'use strict';

  addEventListener('hashchange', addPricesInputAndShowPricesInsteadOfName);
  addEventListener('hashchange', () => {
    // If we don't wait for 650 here, page doesn't have time to load the next market tab's items before we start iterating
    // This means our counts div will end up being empty b/c all we found was the loading indicator, instead of a bunch of items
    setTimeout(runScriptIfInKnownMarketTab, 400);
  });

  addPricesInputAndShowPricesInsteadOfName();
  setTimeout(executeScript, 650);
})();
