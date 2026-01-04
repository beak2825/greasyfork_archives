// ==UserScript==
// @name         adbtc.top
// @namespace    https://adbtc.top/
// @version      1.3
// @description  https://www.youtube.com/channel/UCm2XoBbuIVSgMagy3Q01tSw
// @author       Laravandro
// @match        https://adbtc.top/surf/browse/*
// @match        https://adbtc.top/surfiat/browse/*
// @icon         https://www.google.com/s2/favicons?domain=adbtc.top
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447776/adbtctop.user.js
// @updateURL https://update.greasyfork.org/scripts/447776/adbtctop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const USER_ID = document.querySelector(".nomargbot > div.col.s6.l3.m3.left.hide-on-small-only > p > b").innerText
    const BTC = "/surf/"
    const RUB = "/surfiat/"
    var flag = true
    var timer = 120

    setInterval(() => {
        document.title = timer
        var current_url = window.location.href
        if (timer <= 110 && (document.getElementById("cf-wrapper") || document.title.includes("500") || document.title.includes("502") || document.title.includes("504") || document.title.includes("525")))
            window.open(window.location.href, "_self")

        if (flag && timer <= 110 && !document.querySelector("form") && document.querySelector("div > div > span > b")) {
            flag = false
            send_message(document.querySelector("div > div > span > b").innerText)
            if (current_url.includes(BTC)) execute("/surf")
            else if (current_url.includes(RUB)) execute("/surfiat")

        } else if (flag && timer <= 100 && current_url.includes(BTC) && !document.querySelector("form") && !document.querySelector("div > div > span > b")) {
            flag = false
            window.open("https://adbtc.top/surfiat/browse/" + USER_ID, "_self")

        } else if (flag && timer <= 90 && current_url.includes(RUB) && !document.querySelector("form") && !document.querySelector("div > div > span > b")) {
            flag = false
            window.open("https://adbtc.top/surf/browse/" + USER_ID, "_self")

        } else if (flag && timer <= 0) {
            console.log("ready to reload")
            flag = false
            window.open("https://adbtc.top/surf/browse/" + USER_ID, "_self")
        } timer--
    }, 1000)

    function execute(surf) {
        // var price = parseFloat(document.querySelector("div > div > span > b").innerText.match(/-?(?:\d+(?:\.\d*)?|\.\d+)/)[0])
        var skip_url = document.getElementById("skip").href

        grecaptcha.execute('6LdpDHoUAAAAALczQElnsxkH1IUz3Lfdz2E8rV9j', { action: 'surftator' }).then(function (token) {
            href = surf + "/ihumano/" + skip_url.substring(skip_url.lastIndexOf('/') + 1)

            var xhr = new XMLHttpRequest()
            xhr.open("POST", href, true)
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // if (this.responseText == 'ok') send_message(price)
                    window.open("https://adbtc.top/surf/browse/" + USER_ID, "_self")
                }
            }
            xhr.send(JSON.stringify({
                gtoken: token
            }));

        }, function () { })
    }

    async function send_message(price) {
        var token = "YOUR-TOKEN"
        var chat_id = 0

        var message = "<b>%20%23adbtc</b>%0AUser ID : <b>%20%23" + USER_ID + "</b>%0ATotal BTC : " + document.querySelector(".balance > p > b:nth-child(2)").innerText + "%0ATotal RUBEL : " + document.querySelector(".balance > p > b:nth-child(5)").innerText + "%0ANext : " + price

        var telegram_url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${message}&parse_mode=html`
        var api = new XMLHttpRequest()
        api.open("GET", telegram_url, true)
        api.send()
        var a = setInterval(() => {
            if (api.status == 200 || timer <= 0) {
                window.open("https://adbtc.top/surf/browse/" + USER_ID, "_self")
                clearInterval(a)
            }
        }, 1000)
    }


})();
