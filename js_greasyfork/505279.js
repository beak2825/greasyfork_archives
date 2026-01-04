// ==UserScript==
// @name         Torn Simple Payments
// @namespace    shade.simple_payments.torn
// @version      1.8
// @description  Simplifies and mistake-proofs payments to users for services
// @author       Shade [3129695]
// @match        https://www.torn.com/profiles.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505279/Torn%20Simple%20Payments.user.js
// @updateURL https://update.greasyfork.org/scripts/505279/Torn%20Simple%20Payments.meta.js
// ==/UserScript==

function enterValues() {
    setTimeout(function () {
        const queryParams = getQueryPaymentValues();
        if (queryParams === false) {
            return;
        }
        const kValue = Number(queryParams.amount) / 1000;
        $(".input-money").val(kValue + 'k').trigger('input');
        $(".input-money").val(queryParams.amount).change().trigger('input');
        $(".send-cash-message-input").val(queryParams.message || '').change();
    }, 100);
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if (document.querySelector('.profile-button-sendMoney') && typeof $("#user-money").attr('data-money') != "undefined") {
        observer.disconnect();
        const queryParams = getQueryPaymentValues();

        if (queryParams === false) {
            return;
        }

        const onHand = $("#user-money").attr('data-money');
        let buttonColor = '#2d239b';
        let goAhead = true;

        if (Number(queryParams.amount) > Number(onHand)) {
            buttonColor = '#d04839';
            goAhead = confirm("You don't have enough money on hand! amount will be set to your current money.");
            $("#profile-container-description").append('<strong style="color:red;float:right;">Not enough cash!</strong>');
        }

        const sendPaymentButton = document.querySelector(".profile-button-sendMoney");
        if (sendPaymentButton && goAhead) {
            $(".profile-button-sendMoney").css("background", buttonColor);
            sendPaymentButton.addEventListener("click", enterValues, false);
        }
    }
}

function getQueryPaymentValues() {
    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if (queryParams.amount == null || /^-?\d+$/.test(queryParams.amount) !== true) {
        return false;
    }

    if (queryParams.validuntil != null && queryParams.validuntil != 0 && Number(queryParams.validuntil) < Math.floor(Date.now() / 1000)) {
        $("#profile-container-description").append('<strong style="color:red;float:right;">Payment Request Expired</strong>');
        return false;
    }

    return queryParams;
}
