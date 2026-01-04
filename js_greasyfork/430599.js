// ==UserScript==
// @name         Alkohol Per Krona (Systembolaget.se)
// @namespace    https://lord.vet/
// @version      0.2
// @description  Alkohol Per Krona på systembolaget.se
// @author       Lord
// @match        https://www.systembolaget.se/produkt/*
// @icon         https://www.google.com/s2/favicons?domain=systembolaget.se
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430599/Alkohol%20Per%20Krona%20%28Systembolagetse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430599/Alkohol%20Per%20Krona%20%28Systembolagetse%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        let temp = document.getElementsByClassName("css-a9nq0g").item(0);
        let msg = document.createElement("div");
        msg.innerText = `APK ${getApk()} ml/kr`;
        temp.appendChild(msg);
    }

    function getApk() {
        let alcoholVolume = getAlcoholVolume();
        let pricePerLiter = getPricePerLiter();

        let mlPerKr = ((alcoholVolume * 0.01) * 1000) / pricePerLiter;

        return Number(mlPerKr).toFixed(2).replace(".", ",");
    }

    function getAlcoholVolume() {
        let element = document.getElementsByClassName("css-1bmnxg7").item(2);
        let volume = element.innerHTML.split(" ")[0];
        return parseFloat(volume);
    }

    function getPricePerLiter() {
        let element = document.getElementsByClassName("css-ofz6u").item(0);
        let pricePerLiter = element.innerHTML.split(" ")[1];
        return parseFloat(pricePerLiter);
    }

    window.addEventListener('load', function () {
        init();
    })
})();