// ==UserScript==
// @name         iQFaucet
// @namespace    https://images.app.goo.gl/YNa6zkpu1q2QC9Aa8
// @version      0.3.1
// @description  https://www.youtube.com/channel/UCm2XoBbuIVSgMagy3Q01tSw
// @author       Laravandro
// @match        https://iqfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqfaucet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448485/iQFaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/448485/iQFaucet.meta.js
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
        let remaining_time = $(".alert-warning").text().match(/\d+/)[0];
        console.log(`you must wait ${remaining_time + 1} minutes...`);
        setTimeout(() => redirect(DOGE_CLAIM), (Number(remaining_time) + 1) * 60000);
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
            if (api.status == 200 || t <= 0) {
                redirect(DOGE_CLAIM);
                clearInterval(main);
                clearInterval(a);
            }
            t--;
        }, 1000);
    }

    remove_ads();
    const redirect = _url => { flag = -1; window.open(_url, "_self"); };
    const CURRENT_URL = window.location.href;
    const DOGE_MAIN = "https://iqfaucet.com/";
    const DOGE_INDEX = "https://iqfaucet.com/index.php";
    const DOGE_VERIFY = "https://iqfaucet.com/verify.php";
    const DOGE_CLAIM = "https://iqfaucet.com/index.php?c=1";
    let timer = 0, flag = 0, t = 0;

    let main = setInterval(() => {
        document.title = timer;
        if (CURRENT_URL === DOGE_MAIN) {
            if (flag === 0 && $(".form-control").length) {
                flag = 1;
                // ! replace your doge coin address in below ..
                $(".form-control").val("");
            } else if (flag === 1 && $("button.btn-primary").length) {
                flag = -1;
                $("button.btn-primary").click();
                clearInterval(main);
            }
            else { redirect(DOGE_INDEX); clearInterval(main); }
        }
        if (CURRENT_URL === DOGE_INDEX) {
            if (flag === 0 && $(".alert-warning").length) {
                flag = 2;
                remaining();
            } else {
                if (flag === 0 && $(".form-control").length) {
                    flag = 1;
                    $(".form-control").val("D6Wox56GxjViVMMsDfM4LbyvAmZX4VTTdz");
                } else if (flag === 1 && $("form").length === 1) submit_form();
                else if (flag === 0 && !$(".form-control").length && $("form").length === 1) submit_form();
                // else { redirect(DOGE_INDEX); clearInterval(main); }
            }
        } else if (CURRENT_URL.includes(DOGE_VERIFY)) {
            if (flag === 0 && (!localStorage.getItem("reload") || localStorage.getItem("reload") == "NO")) {
                flag = -1;
                localStorage.setItem("reload", "YES");
                redirect(DOGE_VERIFY);
                clearInterval(main);
            } else {
                flag = 1;
                localStorage.setItem("reload", "NO");
                console.clear();
                if (flag === 1 && $("form").length === 1 && grecaptcha && grecaptcha.getResponse().length !== 0) setTimeout(() => submit_form(), 2500);
                else if (flag === 1 && timer >= 150) redirect(DOGE_VERIFY);
            }
        } else if (CURRENT_URL.includes(DOGE_CLAIM)) {
            if (flag === 0 && $("h1 + .alert-success").length) {
                flag = -1;
                t = timer + 15;
                send_message($("h1 + .alert-success").text());
            } else if (flag === 0 && $(".alert-warning").length) {
                flag = 1;
                remaining();
            } else if (flag === 0 && $(".alert-danger").length) redirect(DOGE_VERIFY);
        }
        timer++;
    }, 1000);

})();
