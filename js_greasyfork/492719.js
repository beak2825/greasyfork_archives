// ==UserScript==
// @name         AlertS+ Mobile
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description  Herramienta para agilizar y mejorar la interfaz de usuario
// @author       GroguLegend
// @match        https://bot.solesbot.ai/arbitrage/manual
// @icon         https://bot.solesbot.ai/Content/layout/soles/img/favicon.png
// @license      GroguLegend
// @grant
// @downloadURL https://update.greasyfork.org/scripts/492719/AlertS%2B%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/492719/AlertS%2B%20Mobile.meta.js
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
            { id: 12, moneda: "Avalanche", roi: 0.86 },
            { id: 13, moneda: "Chainlink", roi: 0.91 },
        ],
    };

    let bannerIntervalId = null;

    function createBanner() {
        const banner = document.createElement("div");
        banner.id = "coinBanner";
        const bannerHeight = favorite.monedas.length * (50 + 5); // Adjusting for the new coin
        banner.style.cssText = `background: #333; color: #FFFFFF; padding: 2.5px; position: fixed; right: 0; height: ${bannerHeight}px; top: calc(50% - (${bannerHeight / 2}px)); display: flex; flex-direction: column; justify-content: space-between; align-items: center; z-index: 9999; transition: transform 0.5s;`;

        const tab = document.createElement("div");
        tab.style.cssText = `width: 20px; height: 30px; background: white; position: absolute; left: -20px; top: calc(50% - 15px); cursor: pointer; border-radius: 5px 0 0 5px; display: flex; justify-content: center; align-items: center; transition: all 0.5s;`;
        const arrow = document.createElement("span");
        arrow.style.cssText = `border: solid black; border-width: 0 3px 3px 0; display: inline-block; padding: 3px; transform: rotate(-45deg); transition: transform 0.5s;`;
        tab.appendChild(arrow);
        banner.appendChild(tab);

        let isVisible = true;
        tab.addEventListener('click', () => {
            isVisible = !isVisible;
            banner.style.transform = isVisible ? 'translateX(0)' : 'translateX(100%)';
            arrow.style.transform = isVisible ? 'rotate(-45deg)' : 'rotate(135deg)';

            if (isVisible) {
                bannerIntervalId = setInterval(() => {
                    updateBannerProfit(favorite.monedas);
                }, 1000);
            } else if (bannerIntervalId) {
                clearInterval(bannerIntervalId);
                bannerIntervalId = null;
            }
        });

        document.body.appendChild(banner);

        // Add coin elements
        favorite.monedas.forEach(coin => addCoinElement(coin, banner));

        // Inicia el intervalo cuando se crea el banner
        bannerIntervalId = setInterval(() => {
            updateBannerProfit(favorite.monedas);
        }, 1000);
    }

    function handleCoinClick(coinId) {
        const allCoins = document.querySelectorAll('#coinBanner > div');
        allCoins.forEach(coin => {
            coin.style.boxShadow = 'none'; // Resetea cualquier sombra interna anterior
        });

        const selectedCoin = document.getElementById(`coin${coinId}`);
        if (selectedCoin) {
            selectedCoin.style.boxShadow = 'inset 0 0 0 2px white'; // Aplica un borde blanco interno más grueso
        }

        const selectElement = document.querySelector('.input-group-text');
        if (selectElement) {
            selectElement.value = `number:${coinId}`;
            selectElement.dispatchEvent(new Event('change'));
        }
    }

    async function updateBannerProfit(coins) {
        const banner = document.getElementById("coinBanner");
        if (!banner) return;

        try {
            const responses = await Promise.all(coins.map(coin =>
                fetch(`https://bot.solesbot.ai/robot/suggestionManual/?coin=${coin.id}`)
            ));
            const data = await Promise.all(responses.map(res => res.json()));

            data.forEach((dataJson, index) => {
                let coin = coins[index];
                let coinElement = document.getElementById(`coin${coin.id}`);
                if (coinElement) {
                    const profit = dataJson.profit;
                    coinElement.style.background = profit === coin.roi ? '#00A349' : profit > coin.roi ? '#FFB400' : '#666';
                    coinElement.innerHTML = `<div style='text-align: center; font-size: 8px; line-height: 10px; margin-bottom: 2px;'><b>${coin.moneda}</b></div><div style='text-align: center; font-size: 7px; line-height: 10px; margin-bottom: 2px;'>ROI: <span style='font-weight: bold;'>${coin.roi}</span></div><div style='text-align: center; font-size: 7px; line-height: 10px;'>Profit: <span style='font-weight: bold;'>${profit}</span></div>`;
                }
            });
        } catch (error) {
            console.error('Failed to fetch coin data:', error);
        }
    }

    function addCoinElement(coin, banner) {
        let coinElement = document.getElementById(`coin${coin.id}`);
        if (!coinElement) {
            coinElement = document.createElement("div");
            coinElement.id = `coin${coin.id}`;
            coinElement.style.cssText = "width: 50px; height: 50px; padding: 2.5px; margin: 2.5px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: border 0.3s; border-radius: 4px;";
            coinElement.addEventListener('click', () => handleCoinClick(coin.id));
            banner.appendChild(coinElement);
        }

        coinElement.style.background = '#666';
        coinElement.innerHTML = `<div style='text-align: center; font-size: 8px; line-height: 10px; margin-bottom: 2px;'><b>${coin.moneda}</b></div><div style='text-align: center; font-size: 7px; line-height: 10px; margin-bottom: 2px;'>ROI: <span style='font-weight: bold;'>${coin.roi}</span></div><div style='text-align: center; font-size: 7px; line-height: 10px;'>Profit: <span style='font-weight: bold;'>-</span></div>`;
    }

    createBanner();
})();

