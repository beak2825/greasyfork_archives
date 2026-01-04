// ==UserScript==
// @name         AutoFill Mortgage
// @namespace    http://tampermonkey.net/
// @version      2025-02-27d
// @description  Autofills mortgage information
// @author       Anon
// @license      MIT
// @match        https://portal-eroom.eipoteka.az/doFlow?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-gov.az
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528078/AutoFill%20Mortgage.user.js
// @updateURL https://update.greasyfork.org/scripts/528078/AutoFill%20Mortgage.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const SleepDelay = 25;
    const CreditType = 'creditType_1';
    const RequestedCreditAmount = 150_000;
    const RequestedCreditPeriod = 25;
    const RequestedInitialPaymentAmount = 65_000;
    const Region = '55A523B5B41D4D028E38CAC00A0509DD';
    const RealEstateType = 'realEstateType_1';
    const HouseMarketType = 'houseMarketType_2';
    const RealEstateBuildDate = 'realEstateBuildDate_2';

    document.addEventListener("keydown", function(event) {
        if (event.key === "F2" || event.key === "f") {
            fillAllData();
        }
    });

    let player = document.createElement('audio');
    player.src = 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3';
    player.preload = 'auto';

    while (document.getElementById('steps-uid-0-p-6') == null || document.getElementById('steps-uid-0-p-6').style.display == 'none') {
        console.log('Sleep...');
        await sleep(SleepDelay * 5);
    }

    console.log('Awake!');
    let style = document.createElement("style");
    style.textContent = `
                        @keyframes flash {
                            0% { background-color: green; }
                            50% { background-color: blue; }
                            100% { background-color: transparent; }
                        }
                        .flash-effect {
                            animation: flash 0.5s ease-in-out;
                        }
                    `;
    document.head.appendChild(style);
    fillAllData();

    while (document.getElementById('partner').options.length <= 1) {
        console.log('Still no banks...');
        await sleep(SleepDelay * 121);
        refreshBanks();
        await sleep(SleepDelay * 10);
    }

    console.log('Banks available!!!', new Date().toLocaleString());
    for (let i = 0; i < 15; i++) {
        player.play();
        await sleep(SleepDelay * 41);
    }

    function refreshBanks() {
        let creditType = document.getElementById('creditType');
        unsafeWindow.fillBank(creditType.value);
        let creditPanel = document.getElementById('creditPanel');
        creditPanel.classList.add("flash-effect");
        setTimeout(() => {
            creditPanel.classList.remove("flash-effect");
        }, 500);
    }

    async function fillAllData() {
    console.log('fillAllData');
        let creditType = document.getElementById('creditType');
        creditType.value = CreditType;
        unsafeWindow.fillBank(creditType.value);
        await sleep(19);

        let requestedCreditAmount = document.getElementById('requestedCreditAmount');
        requestedCreditAmount.value = RequestedCreditAmount;
        unsafeWindow._crAmountChanged(requestedCreditAmount.value);
        await sleep(34);

        let requestedCreditPeriod = document.getElementById('requestedCreditPeriod');
        requestedCreditPeriod.value = RequestedCreditPeriod;
        unsafeWindow.changeCreditPeriod(requestedCreditPeriod.value)
        await sleep(16);

        let requestedInitialPaymentAmount = document.getElementById('requestedInitialPaymentAmount');
        requestedInitialPaymentAmount.value = RequestedInitialPaymentAmount;
        await sleep(21);

        let region = document.getElementById('region');
        region.value = Region;
        await sleep(24);

        let realEstateType = document.getElementById('realEstateType');
        realEstateType.value = RealEstateType;
        unsafeWindow.estateChanged(realEstateType);
        await sleep(27);

        // let houseMarketType = document.getElementById('houseMarketType');
        // houseMarketType.value = HouseMarketType;
        // unsafeWindow._marketChanged(houseMarketType.value);

        // let realEstateBuildDate = document.getElementById('realEstateBuildDate');
        // realEstateBuildDate.value = RealEstateBuildDate;

        //         let creditResPanel = document.getElementById('creditRes');
        //         creditResPanel.style.display = 'block';

        //         let creditCalculate = document.querySelector('#creditCalculate1 input');
        //         creditCalculate.value = '1';
        //         creditCalculate.setAttribute('checked', 'checked');
        //         unsafeWindow._selectCreditKind(1);

        //         let agreement = document.getElementById('agreement');
        //         agreement.value = '1';
        //         agreement.setAttribute('checked', 'checked');
        //         unsafeWindow._checkAgreement(agreement);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();