// ==UserScript==
// @name         iQFaucetBtc
// @namespace    https://iqfaucet.com/
// @version      0.1
// @description  https://www.youtube.com/channel/UCm2XoBbuIVSgMagy3Q01tSw
// @author       Laravandro
// @match        https://iqfaucet.com/btc/*
// @icon         https://images.app.goo.gl/YNa6zkpu1q2QC9Aa8
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448622/iQFaucetBtc.user.js
// @updateURL https://update.greasyfork.org/scripts/448622/iQFaucetBtc.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function remove_ads() {
        console.clear();
        $("#containertop").remove();
        $(".col-md-3").remove();
        $("iframe:not([title])").remove();
    }
    function submit_form() {
        flag = -1;
        $("button.btn-success").click();
        clearInterval(main);
    }
    function remaining() {
        let remaining_time = $(".alert-warning").text().replace(/^.*again/i, '').match(/\d+/)[0];
        console.log(`you must wait ${Number(remaining_time) + 1} minutes...`);
        setTimeout(() => redirect(BTC_CLAIM), (Number(remaining_time) + 1) * 60000);
    }
    function send_message(message) {
        console.log(message);
        // ! replace your telegram token and chat_id in below .. 
        var token = "";
        var chat_id = 0;
        var telegram_url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${message}&parse_mode=html`;
        var api = new XMLHttpRequest();
        api.open("GET", telegram_url, true);
        api.send();
        var a = setInterval(() => {
            document.title += ` : ${t}`;
            if (api.status == 200 || t <= 0) {
                redirect(BTC_CLAIM);
                clearInterval(main);
                clearInterval(a);
            }
            t--;
        }, 1000);
    }
    const redirect = _url => { flag = -1; window.open(_url, "_self"); };

    // ??--------------------------------------------------------------------------------
    remove_ads();
    const CURRENT_URL = window.location.href;
    // ! replace your doge coin address in below ..
    const BTC_ADDRESS = "";
    const BTC_MAIN = "https://iqfaucet.com/btc/";
    const BTC_INDEX = "https://iqfaucet.com/btc/index.php";
    const BTC_VERIFY = "https://iqfaucet.com/btc/verify.php";
    const BTC_CLAIM = "https://iqfaucet.com/btc/index.php?c=1";
    let timer = 0, flag = 0, t = 15;

    let main = setInterval(() => {
        document.title = timer;
        if (CURRENT_URL === BTC_MAIN) {
            if (flag === 0 && $(".form-control").length) {
                flag = 1;
                $(".form-control").val(BTC_ADDRESS);
            } else if (flag === 1 && $("button.btn-primary").length) {
                flag = -1;
                $("button.btn-primary").click();
                clearInterval(main);
            }
            else { redirect(BTC_INDEX); clearInterval(main); }
        }
        if (CURRENT_URL === BTC_INDEX) {
            if (flag === 0 && $(".alert-warning").length) {
                flag = 2;
                remaining();
            } else {
                if (flag === 0 && $(".form-control").length) {
                    flag = 1;
                    $(".form-control").val(BTC_ADDRESS);
                } else if (flag === 1 && $("form").length === 1) submit_form();
                else if (flag === 0 && !$(".form-control").length && $("form").length === 1) submit_form();
            }
        } else if (CURRENT_URL.includes(BTC_VERIFY)) {
            if (flag === 0 && $("form").length === 1 && grecaptcha && grecaptcha.getResponse().length !== 0) setTimeout(() => submit_form(), 2500);
            else if (flag === 0 && timer >= 150) redirect(BTC_VERIFY);
        } else if (CURRENT_URL.includes(BTC_CLAIM)) {
            if (flag === 0 && $("h1 + .alert-success").length) {
                flag = -1;
                send_message($("h1 + .alert-success").text());
            } else if (flag === 0 && $(".alert-warning").length) {
                flag = 1;
                remaining();
            } else if (flag === 0 && $(".alert-danger").length) redirect(BTC_VERIFY);
        }
        timer++;
    }, 1000);


})();
