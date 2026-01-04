// ==UserScript==
// @name         Autofill Sell/Buy
// @version      1.7
// @description  Autofill Sell/Buy Market
// @include      https://*/game.php*screen=market&mode=exchange*
// @grant        none
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/515872/Autofill%20SellBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/515872/Autofill%20SellBuy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const coefStock = 0.0041;
    const coefCapacity = -0.0037;
    const intercept = 411.86;

    // const coefStock = 0.003564;
    // const coefCapacity = -0.003366;
    // const intercept = 469.7;

    // Buat elemen pop-up di kiri bawah
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
        '<label>Target:</label><br>' +
        '<input type="number" id="targetPrice" /><br><br>' +
        '<button id="calculateBtn">Save</button>' +
        '<button id="autoFillWoodBtn">Wood</button>' +
        '<button id="autoFillClayBtn">Clay</button>' +
        '<button id="autoFillIronBtn">Iron</button>' +
        '<button id="buyBtn">Offer</button>' +
        '<button id="resetBtn">Reset</button>' +
        '<div id="results"></div>';
    document.body.appendChild(popup);

    // Set default target price or load from localStorage
    const defaultTargetPrice = 300;
    const savedTargetPrice = localStorage.getItem('targetPrice');
    document.getElementById('targetPrice').value = savedTargetPrice !== null ? savedTargetPrice : defaultTargetPrice;

    // Event listener to save target price
    document.getElementById('targetPrice').addEventListener('change', function() {
        localStorage.setItem('targetPrice', this.value);
    });

    // Fungsi untuk mengambil nilai dari elemen HTML
    function getStockAndCapacity(idStock, idCapacity) {
        const stock = parseFloat(document.getElementById(idStock).innerText);
        const capacity = parseFloat(document.getElementById(idCapacity).innerText);
        return { stock, capacity };
    }

    // Fungsi untuk format angka
    function formatNumber(num) {
        if (Math.abs(num) >= 1000) {
            return (num / 1000).toFixed(1) + 'k'; // Format ke ribuan
        }
        return num.toString(); // Kembalikan sebagai string untuk angka yang lebih kecil
    }

    // Fungsi untuk menghitung stok
    function calculateStock() {
        const targetPrice = parseFloat(document.getElementById('targetPrice').value);

        // Validasi input harga
        if (isNaN(targetPrice)) {
            alert("Harap masukkan harga target yang valid.");
            return;
        }

        // Mendapatkan data untuk Wood, Clay, dan Iron
        const materials = [
            { name: "Wood", stockId: "premium_exchange_stock_wood", capacityId: "premium_exchange_capacity_wood" },
            { name: "Clay", stockId: "premium_exchange_stock_stone", capacityId: "premium_exchange_capacity_stone" },
            { name: "Iron", stockId: "premium_exchange_stock_iron", capacityId: "premium_exchange_capacity_iron" }
        ];

        // Here you can handle the calculations for each material if needed
    }

    // Fungsi Auto Fill untuk Wood
    function autoFillWood() {
        const targetPrice = parseFloat(document.getElementById('targetPrice').value);
        const { stock, capacity } = getStockAndCapacity("premium_exchange_stock_wood", "premium_exchange_capacity_wood");
        const requiredStock = (targetPrice - intercept - coefCapacity * capacity) / coefStock;
        const stockDifference = stock - requiredStock;

        if (stockDifference > 0) {
            document.getElementsByName("buy_wood")[0].value = Math.abs(Math.round(stockDifference)); // Tampilkan angka penuh
            document.getElementsByName("sell_wood")[0].value = "";
        } else {
            document.getElementsByName("sell_wood")[0].value = Math.abs(Math.round(stockDifference)); // Tampilkan angka penuh
            document.getElementsByName("buy_wood")[0].value = "";
        }
    }

    // Fungsi Auto Fill untuk Clay
    function autoFillClay() {
        const targetPrice = parseFloat(document.getElementById('targetPrice').value);
        const { stock, capacity } = getStockAndCapacity("premium_exchange_stock_stone", "premium_exchange_capacity_stone");
        const requiredStock = (targetPrice - intercept - coefCapacity * capacity) / coefStock;
        const stockDifference = stock - requiredStock;

        if (stockDifference > 0) {
            document.getElementsByName("buy_stone")[0].value = Math.abs(Math.round(stockDifference)); // Tampilkan angka penuh
            document.getElementsByName("sell_stone")[0].value = "";
        } else {
            document.getElementsByName("sell_stone")[0].value = Math.abs(Math.round(stockDifference)); // Tampilkan angka penuh
            document.getElementsByName("buy_stone")[0].value = "";
        }
    }

    // Fungsi Auto Fill untuk Iron
    function autoFillIron() {
        const targetPrice = parseFloat(document.getElementById('targetPrice').value);
        const { stock, capacity } = getStockAndCapacity("premium_exchange_stock_iron", "premium_exchange_capacity_iron");
        const requiredStock = (targetPrice - intercept - coefCapacity * capacity) / coefStock;
        const stockDifference = stock - requiredStock;

        if (stockDifference > 0) {
            document.getElementsByName("buy_iron")[0].value = Math.abs(Math.round(stockDifference)); // Tampilkan angka penuh
            document.getElementsByName("sell_iron")[0].value = "";
        } else {
            document.getElementsByName("sell_iron")[0].value = Math.abs(Math.round(stockDifference)); // Tampilkan angka penuh
            document.getElementsByName("buy_iron")[0].value = "";
        }
    }

    // Fungsi untuk mengklik tombol "Buy"
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
    document.getElementById('calculateBtn').addEventListener('click', calculateStock);
    document.getElementById('autoFillWoodBtn').addEventListener('click', autoFillWood);
    document.getElementById('autoFillClayBtn').addEventListener('click', autoFillClay);
    document.getElementById('autoFillIronBtn').addEventListener('click', autoFillIron);
    document.getElementById('buyBtn').addEventListener('click', buyMaterials);
    document.getElementById('resetBtn').addEventListener('click', resetInputs);

    // Automatically calculate stock using the default target price when the popup is opened
    calculateStock();
})();
