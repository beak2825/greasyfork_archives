// ==UserScript==
// @name         faucet.today
// @namespace    https://faucet.today/
// @version      1.2
// @description  https://www.youtube.com/channel/UCm2XoBbuIVSgMagy3Q01tSw
// @author       Laravandro
// @match        https://faucet.today*
// @icon         https://www.google.com/s2/favicons?domain=faucet.today
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448053/faucettoday.user.js
// @updateURL https://update.greasyfork.org/scripts/448053/faucettoday.meta.js
// ==/UserScript==

(function () {

    'use strict';

    // Your code here...

    document.querySelectorAll("iframe").forEach(item => !item.title && item.remove());
    const target = "https://faucet.today/";
    const token = "YOUR_TELEGRAM_TOKEN";
    const chat_id = 0;
    let current_url = window.location.href;
    let flag = true;

    if (document.querySelector("h3") != null && document.querySelector("h3").innerText == "Welcome Visitor") {
        window.open(target, "_self");
    }

    if (flag && (current_url != target || document.querySelector(".form-control") == null)) {
        flag = false;
        let alert_text = document.querySelector("div.alert").innerText;
        let message = "<b>%20%23FaucetToday</b>%0A" + alert_text;
        let telegram_url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${message}&parse_mode=html`;
        let api = new XMLHttpRequest();
        api.open("GET", telegram_url, true);
        api.send();
        let i = 0;
        let timer = setInterval(() => {
            if (api.status == 200) {
                window.open(target, "_self");
                clearInterval(timer);
            } else if (i >= 20) {
                window.open(target, "_self");
            }
            i++;
        }, 1000);
    } else {
	// Paste Your Doge Coin Deposit Address in below   
        document.querySelector(".form-control").value = "YOUR_FAUCETPAY.IO_DOGE_COIN_ADDRESS";

        let timeout_seconds = 180;
        let claim_button = document.querySelector(".claim-button");

        setInterval(() => {
            document.querySelectorAll("iframe").forEach(item => !item.title && item.remove());
            if (flag && claim_button.value == "Get reward!" && hcaptcha && hcaptcha.getResponse().length !== 0) {
                flag = false;
                claim_button.click();
            } else if (flag && timeout_seconds <= 0) {
                flag = false;
                window.open(target, "_self");
            } else {
                document.title = timeout_seconds;
                timeout_seconds--;
            }
        }, 1000);
    }

})(); 
