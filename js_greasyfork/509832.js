// ==UserScript==
// @name         BETPLAY - CALCUL
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  BTC to USD calculator for BETPLAY with styled output and dynamic resizing
// @author       Your Name
// @match        https://betplay.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/509832/BETPLAY%20-%20CALCUL.user.js
// @updateURL https://update.greasyfork.org/scripts/509832/BETPLAY%20-%20CALCUL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSatoshiValue = 0; // ZADAJTE VLASTNU SUMU V SATOSI 0000
    const btcToUsdStorageKey = 'btcToUsdRate';
    const btcToUsdTimestampKey = 'btcToUsdTimestamp';

    async function getBTCtoUSD() {
        const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.bitcoin || !data.bitcoin.usd) {
                throw new Error('Invalid data format received');
            }
            const btcToUsdRate = data.bitcoin.usd;
            localStorage.setItem(btcToUsdStorageKey, btcToUsdRate);
            localStorage.setItem(btcToUsdTimestampKey, Date.now());
            return btcToUsdRate;
        } catch (error) {
            console.error('Chyba pri získavaní kurzu BTC na USD:', error);
            $('#btc-result').text('Chyba pri získavaní kurzu BTC na USD. Skontroluj konzolu pre viac informácií.');
            return null;
        }
    }

    function getStoredBTCtoUSDRate() {
        const storedRate = localStorage.getItem(btcToUsdStorageKey);
        const storedTimestamp = localStorage.getItem(btcToUsdTimestampKey);

        if (storedRate && storedTimestamp) {
            const age = Date.now() - storedTimestamp;
            const oneHour = 60 * 60 * 1000;
            if (age < oneHour) {
                return parseFloat(storedRate);
            }
        }
        return null;
    }

    function calculate() {
        const satoshi = parseInt($('#btc-satoshi-input').val(), 10);
        if (isNaN(satoshi)) {
            $('#btc-result').text('Prosím, zadaj platné číslo.');
            return;
        }

        const btcToUsdRate = getStoredBTCtoUSDRate();
        if (btcToUsdRate !== null) {
            displayResult(satoshi, btcToUsdRate);
        } else {
            getBTCtoUSD().then(rate => {
                if (rate !== null) {
                    displayResult(satoshi, rate);
                }
            });
        }
    }

    function displayResult(satoshi, btcToUsdRate) {
        const btc = satoshi / 100000000;
        const usdValue = btc * btcToUsdRate;

        const resultDiv = $('#btc-result');
        resultDiv.html(`Hodnota: $${usdValue.toFixed(2)}`);

        if (usdValue >= 10) {
            resultDiv.css('color', 'green');
        } else {
            resultDiv.css('color', 'red');
            const difference = (10 - usdValue) * 100000000 / btcToUsdRate;
            resultDiv.append(`<br>Chýba: ${difference.toFixed(0)} satoshi do $10`);
        }
    }

    function setupUI() {
        const pokerChipImageUrl = 'https://67d3d41a52.cbaul-cdnwnd.com/def6fcc31a98c94adc127eae222fdbcd/200000017-b8ca6b8ca7/700/chip1.webp?ph=67d3d41a52';

        const toggleButton = $('<button></button>');
        toggleButton.css({
            'position': 'fixed',
            'top': '10px',
            'left': '10px',
            'z-index': '10001',
            'background-color': '#f5f5dc',
            'border': '1px solid black',
            'color': 'darkgreen',
            'cursor': 'pointer',
            'font-weight': 'bold',
            'padding': '0',
            'width': '42px',
            'height': '42px',
            'background-image': `url(${pokerChipImageUrl})`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-position': 'center'
        });

        const container = $('<div id="btc-calculator"></div>');
        container.css({
            'position': 'fixed',
            'top': '80px',
            'left': '10px',
            'width': '0',
            'height': 'auto',
            'border': '1px solid black',
            'padding': '10px',
            'background-color': 'lightblue',
            'background-image': 'url(https://images.ctfassets.net/w9p5kaqah1m8/3PZ9d9S1T5L0gK4apLOphr/fa8bdc0d9fcaffccb91e55e80186f7db/poker.jpeg)', // Pozadie obrázok
            'background-size': 'cover',
            'z-index': '10000',
            'font-size': '16px',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'center',
            'align-items': 'center',
            'overflow': 'hidden',
            'transition': 'width 0.3s',
            'visibility': 'hidden'
        });

        const depositText = $('<div>CELKOVY VKLAD:</div>');
        depositText.css({
            'font-weight': 'bold',
            'color': 'red',
            'margin-bottom': '10px',
            'margin-top': '10px'
        });

        const input = $(`<input type="text" id="btc-satoshi-input" placeholder="Zadaj satoshi" value="${defaultSatoshiValue}">`);
        input.css({
            'margin-top': '10px',
            'width': '80%',
            'text-align': 'center',
            'color': 'green',
            'font-weight': 'bold',
            'border': '1px solid #ccc',
            'padding': '5px',
            'background-color': '#e0f7fa'
        });

        const resultDiv = $('<div id="btc-result"></div>');
        resultDiv.css({
            'margin-top': '10px',
            'font-weight': 'bold',
            'color': 'red',
            'background-color': '#ffe0e0',
            'padding': '5px',
            'border': '1px solid #ccc',
            'width': '100%',
            'height': 'auto'
        });

        const note = $('<div>1 uBTC = 100 satoshi</div>');
        note.css({
            'font-weight': 'bold',
            'color': '#FFD700',  // Zlatá farba
            'margin-top': '10px',
            'font-size': '50%'  // Zmenšená veľkosť písma o 50%
        });

        container.append(depositText);
        container.append(input);
        container.append(resultDiv);
        container.append(note);
        $('body').append(toggleButton);
        $('body').append(container);

        toggleButton.on('click', function() {
            if (container.css('visibility') === 'hidden') {
                container.css('visibility', 'visible');
                container.css('width', '250px');
                toggleButton.css('transform', 'rotate(180deg)');
            } else {
                container.css('width', '0');
                container.css('visibility', 'hidden');
                toggleButton.css('transform', 'rotate(0deg)');
            }
        });

        $('#btc-satoshi-input').on('input', calculate);

        calculate();
    }

    $(document).ready(function() {
        setupUI();


        setInterval(getBTCtoUSD, 3600000);
    });
})();
