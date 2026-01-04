// ==UserScript==
// @name         Autofill Buy/Sell with Shortcuts
// @version      1.8
// @description  Autofill Buy/Sell Market with shortcuts for setting target price
// @include      https://*/game.php*screen=market&mode=exchange*
// @grant        none
// @namespace    https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/522460/Autofill%20BuySell%20with%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/522460/Autofill%20BuySell%20with%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const coefStock = 0.0041;
    const coefCapacity = -0.0037;
    const intercept = 411.86;

    // Create a popup for autofill options
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.left = '20px';
    popup.style.backgroundColor = '#f9f9f9';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #ddd';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '10000';
    popup.innerHTML =
        '<label>Target Buy:</label><br>' +
        '<input type="number" id="targetPrice" />' +
        '<button id="shortcut490Btn">500</button>' +
        '<button id="shortcut545Btn">550</button>' +
        '<button id="shortcut580Btn">625</button>' +
        '<button id="shortcut635Btn">700</button><br><br>' +
        '<button id="saveBtn">Save</button>' +
        '<button id="autoFillWoodBtn" style="background-color: brown; color: white;">Wood</button>' +
        '<button id="autoFillStoneBtn" style="background-color: orange; color: white;">Clay</button>' +
        '<button id="autoFillIronBtn" style="background-color: gray; color: white;">Iron</button>' +
        '<button id="buyBtn">Offer</button>' +
        '<button id="resetBtn">Reset</button>' +
        '<div id="results"></div>';
    document.body.appendChild(popup);


    // Set default target price or load from localStorage
    const defaultTargetPrice = 300;
    const savedTargetPrice = localStorage.getItem('targetPrice');
    document.getElementById('targetPrice').value = savedTargetPrice !== null ? savedTargetPrice : defaultTargetPrice;

    // Save target price to localStorage
    document.getElementById('targetPrice').addEventListener('change', function() {
        localStorage.setItem('targetPrice', this.value);
    });

    // Function for shortcut buttons
    function setTargetPrice(price) {
        const targetPriceInput = document.getElementById('targetPrice');
        targetPriceInput.value = price;
        localStorage.setItem('targetPrice', price);
    }

    // Helper function to get stock and capacity
    function getStockAndCapacity(idStock, idCapacity) {
        const stock = parseFloat(document.getElementById(idStock).innerText);
        const capacity = parseFloat(document.getElementById(idCapacity).innerText);
        return { stock, capacity };
    }

    // Auto Fill function for materials
    function autoFillMaterial(stockId, capacityId, buyInputName, sellInputName) {
        const targetPrice = parseFloat(document.getElementById('targetPrice').value);
        if (isNaN(targetPrice)) {
            alert("Harap masukkan harga target yang valid.");
            return;
        }

        const { stock, capacity } = getStockAndCapacity(stockId, capacityId);
        const requiredStock = (targetPrice - intercept - coefCapacity * capacity) / coefStock;
        const stockDifference = stock - requiredStock;

        if (stockDifference > 0) {
            document.getElementsByName(buyInputName)[0].value = Math.abs(Math.round(stockDifference));
            document.getElementsByName(sellInputName)[0].value = "";
        } else {
            document.getElementsByName(sellInputName)[0].value = Math.abs(Math.round(stockDifference));
            document.getElementsByName(buyInputName)[0].value = "";
        }
    }

    // Reset all inputs
    function resetInputs() {
        const inputs = ['buy_wood', 'sell_wood', 'buy_stone', 'sell_stone', 'buy_iron', 'sell_iron'];
        inputs.forEach(name => {
            document.getElementsByName(name)[0].value = "";
        });
    }

    // Event listeners for buttons
    // Event listener for the "Save" button without alert
    document.getElementById('saveBtn').addEventListener('click', () => { const targetPriceInput = document.getElementById('targetPrice'); localStorage.setItem('targetPrice', targetPriceInput.value);});
    document.getElementById('shortcut490Btn').addEventListener('click', () => setTargetPrice(435));
    document.getElementById('shortcut545Btn').addEventListener('click', () => setTargetPrice(465));
    document.getElementById('shortcut580Btn').addEventListener('click', () => setTargetPrice(510));
    document.getElementById('shortcut635Btn').addEventListener('click', () => setTargetPrice(535));
    document.getElementById('autoFillWoodBtn').addEventListener('click', () => autoFillMaterial(
        "premium_exchange_stock_wood",
        "premium_exchange_capacity_wood",
        "buy_wood",
        "sell_wood"
    ));
    document.getElementById('autoFillStoneBtn').addEventListener('click', () => autoFillMaterial(
        "premium_exchange_stock_stone",
        "premium_exchange_capacity_stone",
        "buy_stone",
        "sell_stone"
    ));
    document.getElementById('autoFillIronBtn').addEventListener('click', () => autoFillMaterial(
        "premium_exchange_stock_iron",
        "premium_exchange_capacity_iron",
        "buy_iron",
        "sell_iron"
    ));
    function buyMaterials() {
        const buyButton = document.querySelector('input[type="submit"][class="btn float_right btn-premium-exchange-buy"]');
        if (buyButton) {
            buyButton.click(); // Klik tombol Buy
        } else {
            alert("Tombol Buy tidak ditemukan.");
        }
    }

    // Fungsi untuk mereset input
    function resetInputs() {
        document.getElementsByName("buy_wood")[0].value = "";
        document.getElementsByName("sell_wood")[0].value = "";
        document.getElementsByName("buy_stone")[0].value = "";
        document.getElementsByName("sell_stone")[0].value = "";
        document.getElementsByName("buy_iron")[0].value = "";
        document.getElementsByName("sell_iron")[0].value = "";
    }

    // Event listeners for buttons
    document.getElementById('buyBtn').addEventListener('click', buyMaterials);
    document.getElementById('resetBtn').addEventListener('click', resetInputs);

})();
