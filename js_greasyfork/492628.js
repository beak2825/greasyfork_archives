// ==UserScript==
// @name         AlertS+
// @namespace    http://tampermonkey.net/
// @version      1.8.4
// @description  Herramienta para agilizar y mejorar la interfaz de usuario
// @author       GroguLegend
// @match        https://bot.solesbot.ai/arbitrage/manual
// @icon         https://bot.solesbot.ai/Content/layout/soles/img/favicon.png
// @license      GroguLegend
// @grant 
// @downloadURL https://update.greasyfork.org/scripts/492628/AlertS%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/492628/AlertS%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const favorite = {
      monedas: [
        { id: 1, moneda: "Cake", roi: 1.88 },
        { id: 2, moneda: "Arbitrium", roi: 0.86 },
        { id: 5, moneda: "VeChain", roi: 0.6 },
        { id: 6, moneda: "Lido", roi: 0.65 },
        { id: 8, moneda: "Cosmos", roi: 0.81 },
        { id: 9, moneda: "Filecoin", roi: 0.55 },
        { id: 10, moneda: "Fantom", roi: 1.68 },
        { id: 11, moneda: "Polkadot", roi: 0.91 },
        { id: 12, moneda: "Avalanche", roi: 0.86 },  // Avalanche added
        { id: 13, moneda: "Chainlink", roi: 0.91 },  // Chainlink added
      ],
    };

    let bannerIntervalId = null;
    let updatesActive = false;

    function createBanner() {
      const banner = document.createElement("div");
      banner.id = "coinBanner";
      const numberOfCoins = favorite.monedas.length; // Adjusting the number of coins to match the actual number
      const bannerWidth = numberOfCoins * (100 + 10);
      banner.style.cssText = `background: #333; color: #FFFFFF; padding: 5px; position: fixed; bottom: 0; width: ${bannerWidth}px; left: calc(50% - (${bannerWidth / 2}px)); display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; z-index: 9999; transition: bottom 0.3s;`;

      const toggleButton = document.createElement("div");
      toggleButton.id = "toggleButton";
      toggleButton.style.cssText = "position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); width: 43px; height: 29px; background: white; cursor: pointer; display: flex; justify-content: center; align-items: center; border-radius: 10px 10px 0 0;";
      toggleButton.innerHTML = '<div id="toggleArrow" style="border: solid black; border-width: 0 2px 2px 0; display: inline-block; padding: 4.3px; transform: rotate(45deg); transition: transform 0.3s;"></div>';

      toggleButton.addEventListener('click', function() {
        const arrow = document.getElementById("toggleArrow");
        if (banner.style.bottom === "0px") {
          banner.style.bottom = `-${banner.offsetHeight}px`;
          arrow.style.transform = "rotate(45deg)";
          clearInterval(bannerIntervalId);
          updatesActive = false;
        } else {
          banner.style.bottom = "0px";
          arrow.style.transform = "rotate(-135deg)";
          startUpdates();
        }
      });

      document.body.appendChild(banner);
      banner.appendChild(toggleButton);

      // Add coin elements
      updateBannerProfit(favorite.monedas);
    }

    function startUpdates() {
      if (!updatesActive) {
        bannerIntervalId = setInterval(() => {
          updateBannerProfit(favorite.monedas);
        }, 1000);
        updatesActive = true;
      }
    }

    async function updateBannerProfit(coins) {
      const banner = document.getElementById("coinBanner");
      if (!banner || !updatesActive) return;

      try {
        const responses = await Promise.all(coins.map(coin =>
          fetch(`https://bot.solesbot.ai/robot/suggestionManual/?coin=${coin.id}`)
        ));
        const data = await Promise.all(responses.map(res => res.json()));

        data.forEach((dataJson, index) => {
          const coin = coins[index];
          let coinElement = document.getElementById(`coin${coin.id}`);
          if (!coinElement) {
            coinElement = document.createElement("div");
            coinElement.id = `coin${coin.id}`;
            coinElement.style.cssText = "width: 100px; height: 100px; padding: 5px; margin: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: border 0.3s; border-radius: 8px;";
            coinElement.addEventListener('click', () => handleCoinClick(coin.id));
            banner.appendChild(coinElement);
          }

          const profit = dataJson.profit;
          coinElement.style.background = profit === coin.roi ? '#00A349' : profit > coin.roi ? '#FFB400' : '#666';
          coinElement.innerHTML = `<div style='text-align: center;'><b>${coin.moneda}</b></div><div>ROI: <span style='font-weight: bold;'>${coin.roi}</span></div><div>Profit: <span style='font-weight: bold;'>${profit}</span></div>`;
        });
      } catch (error) {
        console.error('Failed to fetch coin data:', error);
      }
    }

    function handleCoinClick(coinId) {
      const allCoins = document.querySelectorAll('#coinBanner > div');
      allCoins.forEach(coin => {
        coin.style.boxShadow = 'none';
      });

      const selectedCoin = document.getElementById(`coin${coinId}`);
      if (selectedCoin) {
        selectedCoin.style.boxShadow = 'inset 0 0 0 1px white';
      }

      const selectElement = document.querySelector('.input-group-text');
      if (selectElement) {
        selectElement.value = `number:${coinId}`;
        selectElement.dispatchEvent(new Event('change'));
      }
    }

    createBanner();
    startUpdates(); // Start updates when the banner is created
})();
