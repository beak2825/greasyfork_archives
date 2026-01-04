// ==UserScript==
// @name         Tiket.com War Ticket
// @namespace    http://tampermonkey.net/
// @version      0.1.61
// @description  Untuk War Ticket!
// @author       Wawiwu [discord.gg/gz]
// @match        https://www.tiket.com/to-do/*
// @match        https://en.tiket.com/to-do/*
// @icon         https://static.tiket.photos/image/upload/v1591162398/info/2020/06/03/e9f58b54-9771-485b-ac68-c6886661f4cb-1591162397612-dd74e6cb7fbc7cb342aa3fbbdff5874c.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490227/Tiketcom%20War%20Ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/490227/Tiketcom%20War%20Ticket.meta.js
// ==/UserScript==

let pilihan = 1; // Ticket Ke Berapa yang mau di Beli!
let tiket = 0; // Berapa banyak tiket yang mau di Beli! [0 = untuk 1 Ticket saja]
let delayTime = 100; // Jangan Di ganti!
let start = true;
let currentTicket = 0;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let stepsExecuted = {
    step6: false,
    step2: false,
    step3: false,
    step4: false
};

async function getTicket() {
    try {
        const buttonElements = document.querySelectorAll('.Button_variant_primary__PFcuM');
        const selectElement = buttonElements[pilihan];

        if (!selectElement.disabled) {
            selectElement.click();
            console.log("[INFO] Clicked Select Ticket");
        } else {
            console.log("[INFO] Element is disabled, skipping click.");
        }
    } catch (error) {}

    await delay(delayTime + 300);

    if(!stepsExecuted.step6) {
        try {
            const ticketElement = document.querySelectorAll('.QuantityEditor_operation_button__gu8o8');
            for (let i = 0; i < tiket; i++) {
                ticketElement[1].click();
            }
            stepsExecuted.step6 = true;
            console.log("[INFO] Clicked More Ticket");
        } catch (error) {}
    }

    await delay(delayTime);

    try {
        const pesanElement = Array.from(buttonElements).find(element =>
            element.innerText.includes('Book') || element.innerText.includes('Pesan')
        );
        if (pesanElement) {
            pesanElement.click();
            console.log("[INFO] Clicked Book Ticket");
            stepsExecuted.step2 = true;
        } else {
            location.reload();
        }
    } catch (error) {}

    await delay(delayTime);

    try {
        if (!stepsExecuted.step3) {
            const radioElement = document.querySelectorAll('.Radio_checkbox__Sf_Nc');
            radioElement[0].click();
            console.log("[INFO] Clicked Radio Button");
            stepsExecuted.step3 = true;
        }
    } catch (error) {}

    await delay(delayTime + 300);

    try {
        if (!stepsExecuted.step4) {
            const checkBoxElement = document.querySelector('.Toggle_hidden_checkbox__oX22j');
            checkBoxElement.click();
            console.log("[INFO] Clicked Same as Passenger");
            stepsExecuted.step4 = true;
        }
    } catch (error) {}

    await delay(delayTime);

    try {
        const submitElement = Array.from(document.querySelectorAll('.PaymentDetail_button_payment__JECD1')).find(element =>
            element.innerText.includes('Continue to Payment') || element.innerText.includes('Lanjutkan pembayaran')
        );
        if (submitElement) {
            submitElement.click();
            console.log("[INFO] Clicked Submit Payment");
        } else {}
    } catch (error) {}
}

async function processTickets() {
    while (start) {
        await getTicket();
    }
    console.log('All tickets processed.');
}

processTickets();