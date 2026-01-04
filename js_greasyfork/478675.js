// ==UserScript==
// @name         [New] Faucetpay Rotator
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Before you use please chance the data on line 20-40.
// @author       Andrewblood
// @match        *://*.faucetpay.io/*
// @match        *://*.sollcrypto.com/*
// @match        *://*.claimfreecoins.io/*
// @match        *://*.cryptoclaps.com/earn/*
// @match        *://*.tronxminer.com/rewards/*
// @match        *://*.claimcoins.site/reward/*
// @match        *://*.baltoniearn.com/claim/*
// @match        *://*.etcoin.site/earn/*
// @match        *://*.bnbminers.site/earns/*
// @match        *://*.ltcmines.site/earns/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetpay.io
// @grant        none
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/485334/%5BNew%5D%20Faucetpay%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/485334/%5BNew%5D%20Faucetpay%20Rotator.meta.js
// ==/UserScript==
/*


        "https://earnsolana.xyz/faucet/currency/dgb"

*/
(function() {
    'use strict';

    // Hier kommt deine Faucetpay E-Mail und Coin-Adressen
    var email = "warchol18@gmx.at";
    var bitcoin = "1GWFq2qa4WY6Yo59S1iCUP94GpPCsLUu8p"; // Bitcoin (BTC)
    var ethereum = "0xfAb138AD93372652b58661303b85be9150F88D5A"; // Ethereum (ETH)
    var dogecoin = "DJA1Cxf4gGtf1KqtpLAtDaFo4SZW8tYCrE"; // Dogecoin (DOGE)
    var litecoin = "LhAWY9jEF9mkWSh9a3qeMFFufDd3MtMEbf"; // Litecoin (LTC)
    var bch = "qz06q3zztl0l7dy23e5nw7ewr8sgjanu0qxg4pm6zz"; // Bitcoin Cash (BCH)
    var dash = "XxDcPvXKMkGtxZKmhnkziZ8ztAQsZZxQWc"; // Dash (DASH)
    var digibyte = "DGEnRrrJxqzQt6f7K52xaH6jofRsAh9oBB"; // DigiByte (DGB)
    var tron = "TTPQUhWiyaWFYWexfaJdnRfjzmKWJXuay2"; // Tron (TRX)
    var tether = ""; // Tether TRC20 (USDT)
    var feyorra = ""; // Feyorra (FEY)
    var zcash = "t1LwS61dhFirSe1PKQxpCn2vzKGzuiep3N3"; // Zcash (ZEC)
    var binance = ""; // Binance Coin (BNB)
    var solana = ""; // Solana (SOL)
    var xrp = ""; // Ripple (XRP)
    var polygon = ""; // Polygon (MATIC)
    var cardano = ""; // Cardano (ADA)
    var toncoin = ""; // Toncoin (TON)
    var stellar = ""; // Stellar (XLM)
    var usdc = ""; // USD Coin (USDC)
    var monero = ""; // Monero (XMR)

    // Array mit allen URLs und dem zusätzlichen Parameter
    var gr8sites = [
        "https://sollcrypto.com/home/page/doge/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/tron/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/digibyte/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/litecoin/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/binance/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/solana/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/ethereum/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/bch/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/xrp/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/dash/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/zcash/?r=m.warchol@gmx.at",
        "https://sollcrypto.com/home/page/bitcoin/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/bitcoin-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/ethereum-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/tether-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/bnb-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/solana-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/ripple-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/dogecoin-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/tron-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/bch-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/litecoin-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/polygon-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/zcash-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/dash-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/digibyte-faucet/?r=m.warchol@gmx.at",
        "https://claimfreecoins.io/feyorra-faucet/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/dogecoin/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/tron/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/digibyte/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/litecoin/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/binance/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/solana/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/ethereum/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/bch/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/xrp/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/dash/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/polygon/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/usdt/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/feyorra/?r=m.warchol@gmx.at",
        "https://cryptoclaps.com/earn/zcash/?r=m.warchol@gmx.at",
        "https://tronxminer.com/rewards/tron/?r=m.warchol@gmx.at",
        "https://tronxminer.com/rewards/doge/?r=m.warchol@gmx.at",
        "https://tronxminer.com/rewards/feyorra/?r=m.warchol@gmx.at",
        "https://tronxminer.com/rewards/binance/?r=m.warchol@gmx.at",
        "https://tronxminer.com/rewards/ripple/?r=m.warchol@gmx.at",
        "https://tronxminer.com/rewards/bitcoin/?r=m.warchol@gmx.at",
        "https://claimcoins.site/reward/tron/?r=m.warchol@gmx.at",
        "https://claimcoins.site/reward/doge/?r=m.warchol@gmx.at",
        "https://claimcoins.site/reward/litecoin/?r=m.warchol@gmx.at",
        "https://claimcoins.site/reward/binance/?r=m.warchol@gmx.at",
        "https://claimcoins.site/reward/ripple/?r=m.warchol@gmx.at",
        "https://claimcoins.site/reward/bitcoin/?r=m.warchol@gmx.at",
        "https://baltoniearn.com/claim/Bitcoin/?r=m.warchol@gmx.at",
        "https://baltoniearn.com/claim/binance/?r=m.warchol@gmx.at",
        "https://baltoniearn.com/claim/tron/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/tron/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/doge/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/litecoin/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/feyorra/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/binance/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/ripple/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/ethereum/?r=m.warchol@gmx.at",
        "https://etcoin.site/earn/bitcoin/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/tron/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/doge/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/litecoin/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/feyorra/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/binance/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/ripple/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/ethereum/?r=m.warchol@gmx.at",
        "https://bnbminers.site/earns/bitcoin/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/tron/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/doge/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/litecoin/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/feyorra/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/binance/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/ripple/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/ethereum/?r=m.warchol@gmx.at",
        "https://ltcmines.site/earns/bitcoin/?r=m.warchol@gmx.at"
    ];

    let referralCode = "?r=m.warchol@gmx.at";

    // Sicherstellen, dass der Referral-Code in der URL vorhanden ist
    if (!window.location.href.includes(referralCode) && !document.querySelector('[name="cf-turnstile-response"]')) {
        // URL um den Referral-Code erweitern
        let url = (window.location.href);
        window.location.replace(url + referralCode);
    }



    setTimeout(function() {
        var currentUrl = window.location.href;
        var currentIndex = gr8sites.findIndex(url => currentUrl === url);
        var nextIndex = (currentIndex + 1) % gr8sites.length; // Beginnt wieder von vorne, wenn das Ende der Liste erreicht ist

        // Selektor für das Datum
        const dateSelector = ".card-body > table > tbody > tr:nth-child(1) > td:nth-child(3)";
        const dateElement = document.querySelector(dateSelector);

        if (dateElement) {
            // Datumstext extrahieren
            const dateText = dateElement.innerText;

            // Datum im Format 'YYYY-MM-DD HH:MM:SS' parsen
            const date = new Date(dateText.replace(/-/g, '/'));

            // Aktuelles Datum und Zeit
            const now = new Date();

            // Differenz in Millisekunden berechnen
            const timeDifference = now - date;

            // Differenz in Stunden umrechnen
            const hoursDifference = timeDifference / (1000 * 60 * 60);

            // Überprüfen, ob die Differenz größer als 24 Stunden ist
            if (hoursDifference > 24) {
                console.log("Das Datum ist älter als 24 Stunden.");
                console.log("Aktueller Index:", currentIndex);
                console.log("Nächster Index:", nextIndex);
                console.log("Weiterleitung zu:", gr8sites[nextIndex]);

                window.location.replace(gr8sites[nextIndex]);
            } else {
                console.log("Das Datum liegt innerhalb der letzten 24 Stunden.");
            }
        } else {
            console.log("Datumselement nicht gefunden.");
        }


        // Wenn eine Warnung oder ein Erfolg vorliegt, nächste URL laden
        var FaucetWarning = document.querySelector("div.alert.alert-danger.fade.show");
        var FaucetSuccess = document.querySelector("div.alert.alert-success.fade.show");
        if (FaucetWarning || FaucetSuccess) {

            console.log("Faucet Warning oder Success gefunden.");
            console.log("Aktueller Index:", currentIndex);
            console.log("Nächster Index:", nextIndex);
            console.log("Weiterleitung zu:", gr8sites[nextIndex]);

            window.location.replace(gr8sites[nextIndex]);
        }

        // Überprüfen, welche URL enthalten ist, und die entsprechende Adresse ausgeben oder die Email als Fallback verwenden
        var currentCoinAddress = email;

        // Überprüfen, ob die URL zu claimfreecoins.io gehört
        if (window.location.href.includes("claimfreecoins.io")) {
            currentCoinAddress = email;
        } else {
            if (window.location.href.includes("bitcoin")) {
                currentCoinAddress = bitcoin || email;
            } else if (window.location.href.includes("doge")) {
                currentCoinAddress = dogecoin || email;
            } else if (window.location.href.includes("tron")) {
                currentCoinAddress = tron || email;
            } else if (window.location.href.includes("digibyte")) {
                currentCoinAddress = digibyte || email;
            } else if (window.location.href.includes("litecoin")) {
                currentCoinAddress = litecoin || email;
            } else if (window.location.href.includes("binance") || window.location.href.includes("bnb")) {
                currentCoinAddress = binance || email;
            } else if (window.location.href.includes("solana")) {
                currentCoinAddress = solana || email;
            } else if (window.location.href.includes("ethereum")) {
                currentCoinAddress = ethereum || email;
            } else if (window.location.href.includes("bch")) {
                currentCoinAddress = bch || email;
            } else if (window.location.href.includes("xrp") || window.location.href.includes("ripple")) {
                currentCoinAddress = xrp || email;
            } else if (window.location.href.includes("dash")) {
                currentCoinAddress = dash || email;
            } else if (window.location.href.includes("zcash")) {
                currentCoinAddress = zcash || email;
            } else if (window.location.href.includes("tether")) {
                currentCoinAddress = tether || email;
            } else if (window.location.href.includes("polygon")) {
                currentCoinAddress = polygon || email;
            } else if (window.location.href.includes("feyorra")) {
                currentCoinAddress = feyorra || email;
            } else if (window.location.href.includes("cardano")) {
                currentCoinAddress = cardano || email;
            } else if (window.location.href.includes("toncoin")) {
                currentCoinAddress = toncoin || email;
            } else if (window.location.href.includes("stellar")) {
                currentCoinAddress = stellar || email;
            } else if (window.location.href.includes("usdc")) {
                currentCoinAddress = usdc || email;
            } else if (window.location.href.includes("monero")) {
                currentCoinAddress = monero || email;
            }
        }

        // Überprüft, ob das Eingabefeld vorhanden ist und aktualisiert den Wert
        var nameInput = document.querySelector("#address");
        if (nameInput) {
            nameInput.value = currentCoinAddress;
            console.log("Eingabefeld gefunden und aktualisiert mit: " + currentCoinAddress);
        }

        // Klick auf den ersten Anspruchs-Button
        var firstClaimButton = document.querySelector('.btn.btn-block.my-0') || document.querySelector(".btn.btn-block.btn-primary.my-2");
        if (firstClaimButton) {
            firstClaimButton.click();
            console.log("Erster Claim-Button gefunden und angeklickt.");
        }

        // Setzt ein Intervall, um regelmäßig zu überprüfen
        var secondClaimButton = document.querySelector("#login");
        var ReCaptchaResponse = document.querySelector('.g-recaptcha-response');
        const intervalId = setInterval(function() {
            // Überprüft, ob die ReCaptcha-Antwort vorhanden ist und der zweite Button sichtbar ist
            if ((ReCaptchaResponse && ReCaptchaResponse.value.length > 1) && (secondClaimButton && secondClaimButton.offsetHeight > 1)) {
                secondClaimButton.click();
                console.log("Zweiter Claim-Button gefunden und angeklickt.");

                // Stoppt den Interval-Timer
                clearInterval(intervalId);
                console.log("Interval gestoppt.");
            }
        }, 500); // Überprüft alle 0,5 Sekunden
    }, 2000);

})();
