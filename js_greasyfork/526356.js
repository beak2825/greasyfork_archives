// ==UserScript==
// @name         Ress Balancer (Trade)
// @version      1.2
// @description  Balancing Resource
// @include      https://*/game.php*screen=market*
// @exclude      https://*/game.php*screen=market&mode=exchange*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/526356/Ress%20Balancer%20%28Trade%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526356/Ress%20Balancer%20%28Trade%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let woodStock =  0;
    let stoneStock =  0;
    let ironStock =  0;
    let optimalStockLow = 0;
    let optimalStockHigh = 0;

    let woodratio = 0;
    let stoneratio = 0;
    let ironratio = 0;
    let totalratio = 0;

    let tradeInputHigh = 0;
    let tradeInputLow = 0;
    let tradeInput = 0;

    let minTrade = 0;

    let settingsPopup; // Deklarasi variabel global untuk popup


    function getRessStock(Ress) {
          return parseFloat(document.getElementById(Ress).innerText);
    }

    function resSelect(offer, want) {
        ['res_buy', 'res_sell'].forEach(name => {
            ['wood', 'stone', 'iron'].forEach(value => {
            document.querySelector(`input[name="${name}"][value="${value}"]`)?.removeAttribute('disabled');
            });
        });

        document.querySelector(`input[name="res_sell"][value="${want}"]`)?.click();
        document.querySelector(`input[name="res_buy"][value="${offer}"]`)?.click();
      }

    function updateExchangeValues(jumlah) {
        document.getElementById('exchange_amount_sell').value = jumlah;
        document.getElementById('exchange_amount_buy').textContent = jumlah;
        document.getElementById("merchant_exchange_sell").value = jumlah;
    }

    function checkBothChecked(offer, want) {
        const offering = document.querySelector(`input[name="res_buy"][value="${offer}"]`);
        const wanted = document.querySelector(`input[name="res_sell"][value="${want}"]`);

        const isOfferChecked = offering.checked;
        const isWantChecked = wanted.checked;

        return { isOfferChecked, isWantChecked };
    }


    function resBalancing(){
        const countdownPopup = document.getElementById('countdown-timer');
        woodStock=getRessStock('wood');
        stoneStock=getRessStock('stone');
        ironStock=getRessStock('iron');

        const stocks = {
            wood: [woodStock, "wood", woodratio],
            stone: [stoneStock, "stone", stoneratio],
            iron: [ironStock, "iron", ironratio]
        };

        totalratio = woodratio + stoneratio + ironratio;
        const totalStocks = woodStock + stoneStock + ironStock;

        // Menghitung optimal stock untuk setiap resource berdasarkan rasio
        const optimalStocks = {};
        for (const [name, [current, , ratio]] of Object.entries(stocks)) {
            optimalStocks[name] = (totalStocks * ratio) / totalratio;
        }

        // Menghitung selisih antara stok saat ini dan stok optimal
        const differences = {};
        for (const [name, [current, , ratio]] of Object.entries(stocks)) {
            differences[name] = current - optimalStocks[name];
        }

        console.log('Stok optimal:', optimalStocks);
        console.log('Selisih stok:', differences);

        // Menemukan resource dengan surplus tertinggi (untuk dijual)
        let maxSurplus = -Infinity;
        let resourceToSell = null;
        for (const [name, diff] of Object.entries(differences)) {
            if (diff > maxSurplus) {
                maxSurplus = diff;
                resourceToSell = name;
            }
        }

        // Menemukan resource dengan shortage terbesar (untuk dibeli)
        let minShortage = Infinity;
        let resourceToBuy = null;
        for (const [name, diff] of Object.entries(differences)) {
            if (diff < minShortage && diff < 0) {
                minShortage = diff;
                resourceToBuy = name;
            }
        }

        // Jika tidak ada shortage, cari resource dengan stok relatif terendah terhadap optimal
        if (resourceToBuy === null) {
            let lowestRatio = Infinity;
            for (const [name, [current, , ratio]] of Object.entries(stocks)) {
                const currentRatio = current / optimalStocks[name];
                if (currentRatio < lowestRatio && name !== resourceToSell) {
                    lowestRatio = currentRatio;
                    resourceToBuy = name;
                }
            }
        }

        console.log(`Akan menjual ${resourceToSell} (surplus: ${maxSurplus.toFixed(0)})`);
        console.log(`Akan membeli ${resourceToBuy}`);

        // Menghitung jumlah trade yang optimal
        const tradeAmount = Math.min(
            Math.abs(differences[resourceToSell]), // Surplus resource to sell
            Math.abs(differences[resourceToBuy] || 0), // Shortage resource to buy
            maxSurplus // Pastikan tidak melebihi surplus
        );

        tradeInput = Math.floor(tradeAmount / 1000) * 1000; // Bulatkan ke ribuan terdekat
        console.log('Jumlah trade:', tradeInput);

        const checkBothResult = checkBothChecked(resourceToBuy, resourceToSell);
        const checked = checkBothResult.isOfferChecked && checkBothResult.isWantChecked;

        if (checked && tradeInput > minTrade) {
            countdownPopup.innerText = `Trade: ${resourceToSell} → ${resourceToBuy} (${tradeInput})`;
            console.log("Resource selection correct, updating trade values");
            updateExchangeValues(tradeInput);
        } else if (!checked && tradeInput > minTrade) {
            countdownPopup.innerText = `Memilih: ${resourceToSell} → ${resourceToBuy}`;
            console.log("Resource selection incorrect, fixing...");
            setTimeout(function() {
                resSelect(resourceToBuy, resourceToSell);
                setTimeout(() => {
                    updateExchangeValues(tradeInput);
                }, 500);
            }, 2000);
        } else if (tradeInput < minTrade) {
            countdownPopup.innerText = `Trade terlalu kecil (${tradeInput} < ${minTrade})`;
        } else {
            countdownPopup.innerText = `Tidak perlu trade`;
        }
    }



    function saveSetting() {
        localStorage.setItem(`woodratio`, woodratio);
        localStorage.setItem(`stoneratio`, stoneratio);
        localStorage.setItem(`ironratio`, ironratio);
        localStorage.setItem(`minTrade`, minTrade);
        toggleSettingsPopup();
    }

    function loadSetting() {
        woodratio = parseFloat(localStorage.getItem(`woodratio`)) || 1;
        stoneratio = parseFloat(localStorage.getItem(`stoneratio`)) || 1;
        ironratio = parseFloat(localStorage.getItem(`ironratio`)) || 1;
        minTrade = parseFloat(localStorage.getItem(`minTrade`)) || 10000;
    }

    function toggleSettingsPopup() {
        if (settingsPopup) {
            settingsPopup.remove();
            settingsPopup = null;
            return;
        }

        settingsPopup = document.createElement('div');
        settingsPopup.style.position = 'fixed';
        settingsPopup.style.bottom = '105px';
        settingsPopup.style.right = '50px';
        settingsPopup.style.backgroundColor = '#222';
        settingsPopup.style.color = '#fff';
        settingsPopup.style.padding = '20px';
        settingsPopup.style.borderRadius = '10px';
        settingsPopup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        settingsPopup.style.zIndex = '1000';
        settingsPopup.style.width = '165px';
        settingsPopup.style.height = 'auto';

        settingsPopup.innerHTML = `
            <h3 style="margin: 0 0 5px 0; font-size: 14px; text-align: center;">Balancer Settings</h3>
            <label>Min Trade: <input type="number" id="minTradeInput" value="${minTrade}" style="width: 100%; margin-bottom: 10px;"></label>
            <div style="margin-bottom: 3px; display: flex;">
                <label>Wood Ratio: <input type="number" id="woodInput" value="${woodratio}" style="width: 100%; margin-bottom: 10px;"></label><br>
                <label>Stone Ratio: <input type="number" id="stoneratio" value="${stoneratio}" style="width: 100%; margin-bottom: 10px;"></label><br>
                <label>Iron Ratio: <input type="number" id="ironratio" value="${ironratio}" style="width: 100%; margin-bottom: 10px;"></label>
            </div>
            <button id="saveSettingButton" style="width: 100%; padding: 5px; background-color: #28a745; color: white; border: none; border-radius: 5px;">Save</button>
        `;

        document.body.appendChild(settingsPopup);

        document.getElementById('saveSettingButton').addEventListener('click', () => {
            woodratio = parseFloat(document.getElementById('woodInput').value);
            stoneratio = parseFloat(document.getElementById('stoneratio').value);
            ironratio = parseFloat(document.getElementById('ironratio').value);
            minTrade = parseFloat(document.getElementById('minTradeInput').value);
            saveSetting();
        });
    }

    function createUI() {
        loadSetting();

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '50px';
        container.style.backgroundColor = '#222';
        container.style.color = '#fff';
        container.style.padding = '12px';
        container.style.borderRadius = '8px';
        container.style.zIndex = '1000';
        container.style.width = '180px';
        container.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.backdropFilter = 'blur(5px)';

        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown-timer';
        countdownElement.style.marginBottom = '1px';
        countdownElement.style.fontSize = '12px';
        countdownElement.style.fontWeight = 'bold';
        countdownElement.style.textAlign = 'center';
        countdownElement.innerText = 'Ress Balancer (Trade)';
        container.appendChild(countdownElement);

        const buttoncontainer = document.createElement('div');
        buttoncontainer.style.display = 'flex';
        buttoncontainer.style.justifyContent = 'space-between';
        buttoncontainer.style.width = '100%';
        buttoncontainer.style.gap = '5px';

        const manualButton = document.createElement('button');
        manualButton.innerText = 'Manual';
        manualButton.style.padding = '5px 10px';
        manualButton.style.fontSize = '13px';
        manualButton.style.backgroundColor = '#ff7f00';
        manualButton.style.color = '#ffff';
        manualButton.style.border = 'none';
        manualButton.style.width = '85px';
        manualButton.style.borderRadius = '5px';
        manualButton.style.cursor = 'pointer';
        manualButton.style.transition = 'background-color 0.3s ease';
        manualButton.addEventListener('click', resBalancing);

        const settingsButton = document.createElement('button');
        settingsButton.innerText = 'Settings';
        settingsButton.style.padding = '5px 10px';
        settingsButton.style.fontSize = '13px';
        settingsButton.style.backgroundColor = '#007bff';
        settingsButton.style.color = '#fff';
        settingsButton.style.border = 'none';
        settingsButton.style.width = '85px';
        settingsButton.style.borderRadius = '5px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.transition = 'background-color 0.3s ease';
        settingsButton.addEventListener('click', toggleSettingsPopup);

        buttoncontainer.appendChild(manualButton);
        buttoncontainer.appendChild(settingsButton);

        container.appendChild(buttoncontainer);

        document.body.appendChild(container);
    }

    createUI();

})();