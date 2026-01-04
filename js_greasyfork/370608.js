// ==UserScript==
// @name         Shrimpy Top 20 Cap-Weighted Allocator
// @version      1.0.2
// @description  Enhances Shrimpy.io by providing cap-weighted portfolio allocation of the top 20 coins.
// @author       Marvin Yan
// @match        https://www.shrimpy.io/dashboard
// @grant        none
// @namespace https://greasyfork.org/users/128831
// @downloadURL https://update.greasyfork.org/scripts/370608/Shrimpy%20Top%2020%20Cap-Weighted%20Allocator.user.js
// @updateURL https://update.greasyfork.org/scripts/370608/Shrimpy%20Top%2020%20Cap-Weighted%20Allocator.meta.js
// ==/UserScript==

(() => {
  // Customizable constants
  const EXCLUDED_COINS = new Set(['Tether']);
  const PORTFOLIO_SIZE = 20;
  const MAX_ALLOCATION_PCT = 10; // Excess will be distributed among other holdings

  const API_TOP_100_COINS = 'https://api.coinmarketcap.com/v2/ticker/?structure=array';
  const ALLOCATE_BTN_HTML = `
    <div class="allocation-confirm-button-container" _ngcontent-c7="">
      <button class="normal-button mat-button">
        <span class="mat-button-wrapper">Allocate by Market Cap</span>
      </button>
    </div>
  `;

  // Remove existing allocations
  const removeAllocations = () => {
    document.querySelectorAll('.remove').forEach(el => el.click());
  };

  const selectedCoins = new Set();
  // Select the top 20 coins
  const selectTopCoins = () => {
    // Get array of coins
    const possibleAllocsDiv = document.querySelector('.possible-allocations');
    const coins = Array.from(possibleAllocsDiv.querySelectorAll('.item'));

    // Sort coins by rank
    coins.sort((a, b) => {
      const rankA = a.querySelector(
        '.item-info-row > .item-info-row-item:first-of-type > .item-info-row-item-content'
      );
      const rankB = b.querySelector(
        '.item-info-row > .item-info-row-item:first-of-type > .item-info-row-item-content'
      );
      return parseInt(rankA.innerHTML, 10) - parseInt(rankB.innerHTML, 10);
    });

    let count = 0;
    for (let i = 0; count < PORTFOLIO_SIZE; i++) {
      const coinName = coins[i].querySelector('.currency-name').innerHTML.trim();
      if (!EXCLUDED_COINS.has(coinName)) {
        selectedCoins.add(coinName);
        coins[i].click();
        count++;
      }
    }
  };

  const getCMCData = () =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', API_TOP_100_COINS, true);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });

  const showErrorAlert = ({ status, statusText }) => {
    alert(`Unable to connect to CoinMarketCap. ${status}: ${statusText}`);
  };

  // const getRemainingMarketCap = (coins, marketCaps) =>
  //   Array.from(coins).reduce((acc, val) => acc + val.marketCap, 0);

  const fillInAllocationFields = mappedMarketCaps => {
    const chosenAllocsDiv = document.querySelector('.chosen-allocations');
    const coins = Array.from(chosenAllocsDiv.querySelectorAll('.item'));

    coins.forEach(coin => {
      const name = coin.querySelector('.currency-name').innerHTML.trim();
      const formField = coin.querySelector('input');
      formField.value = mappedMarketCaps.get(name).allocation;

      // Fire change events to update displayed total allocation %
      const event = new Event('change');
      formField.dispatchEvent(event);
    });
  };

  const getRemainingPct = (coins, marketCaps) =>
    Array.from(coins).reduce((acc, coinName) => acc + marketCaps.get(coinName).allocation, 0);

  const parseCMCResponse = response => {
    let totalCap = 0;
    const mappedMarketCaps = new Map();
    const { data } = JSON.parse(response);
    data.forEach(coin => {
      if (selectedCoins.has(coin.name)) {
        totalCap += coin.quotes.USD.market_cap;
        mappedMarketCaps.set(coin.name, { marketCap: coin.quotes.USD.market_cap });
      }
    });

    selectedCoins.forEach(coinName => {
      const coinData = mappedMarketCaps.get(coinName);
      coinData.allocation = (100 * coinData.marketCap) / totalCap;
    });

    const remainingCoins = new Set(mappedMarketCaps.keys());
    mappedMarketCaps.forEach((coinInfo, coinName) => {
      remainingCoins.delete(coinName);

      if (coinInfo.allocation > MAX_ALLOCATION_PCT) {
        const excess = coinInfo.allocation - MAX_ALLOCATION_PCT;
        coinInfo.allocation = MAX_ALLOCATION_PCT;

        // const remainingMarketCap = getRemainingMarketCap(remainingCoins, mappedMarketCaps);
        const remainingPct = getRemainingPct(remainingCoins, mappedMarketCaps);

        remainingCoins.forEach(remCoinName => {
          const remCoin = mappedMarketCaps.get(remCoinName);
          const oldAlloc = remCoin.allocation;
          remCoin.allocation += (excess * oldAlloc) / remainingPct;
        });
      }
    });

    console.log(mappedMarketCaps);

    // Round allocations to nearest 0.1% (minimum of 1%)
    mappedMarketCaps.forEach(coinInfo => {
      coinInfo.allocation = Math.max(1, Math.round(coinInfo.allocation * 10) / 10);
    });

    fillInAllocationFields(mappedMarketCaps);
  };

  const performAllocation = () => {
    removeAllocations();
    selectTopCoins();
    getCMCData().then(parseCMCResponse, showErrorAlert);
  };

  const addCustomBtn = () => {
    const div = document.createElement('div');
    div.innerHTML = ALLOCATE_BTN_HTML.trim();
    const buttonsBar = document.querySelector('.shrimpy-card-buttons');
    div.firstChild.addEventListener('click', performAllocation);
    buttonsBar.insertAdjacentElement('afterbegin', div.firstChild);
  };

  // Add the custom button to the allocations page.
  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(mutations => {
    mutations.some(mutation => {
      const mutationTarget = mutation.target;
      if (
        typeof mutationTarget.className === 'string' &&
        mutationTarget.className.includes('page-content') &&
        mutationTarget.innerText.startsWith('REBALANCE SCHEDULE')
      ) {
        addCustomBtn();
        return true;
      }
      return false;
    });
  });
  observer.observe(document, config);
})();
