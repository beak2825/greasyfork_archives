// ==UserScript==
// @name         login
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  auto login inside net.
// @author       simple
// @match        *://*/fgtauth*
// @match        https://kibana.foodtruck-qa.com/login**
// @match        https://kibana.foodtruck-uat.com/login**
// @match        https://kibana.remarkablefoods.net/login**
// @icon         https://www.google.com/s2/favicons?domain=22.254
// @require      https://code.jquery.com/jquery-3.6.3.slim.min.js#sha256-ZwqZIVdD3iXNyGHbSYdsmWP//UBokj2FHAxKuSBKDSo=
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/438457/login.user.js
// @updateURL https://update.greasyfork.org/scripts/438457/login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.href.indexOf("fgtauth") >= 0) {
        const uname = "your username";
        const pwd = "your pwd";
        let timer = setInterval(() => {
            let element = document.getElementById("ft_pd");
            if (element.length != 0) {
                clearInterval(timer);
                document.getElementById("ft_pd").value = pwd;
                document.getElementById("ft_un").value = uname;
            }
        }, 1000);
    } else if (window.location.href.indexOf("kibana") >= 0) {
        let timer2 = setInterval(() => {
            let element = document.getElementsByClassName("euiFieldText");
            if (element.length != 0) {
                clearInterval(timer2);
                let user = getUser();
                document.getElementsByClassName("euiFieldText")[0].value = user.username;
                document.getElementsByClassName("euiFieldPassword ")[0].value = user.pwd;
                request(user);
            }
        }, 1000);
    }

    const kbn_version = '8.15.5'

    function request(user) {
        console.log("request login")
        axios({
            method: 'post',
            url: '/internal/security/login',
            data: { "providerType": "basic", "providerName": "basic", "currentURL": window.location.href, "params": { "username": user.username, "password": user.pwd } },
            headers: { 'Content-Type': 'application/json', 'kbn-version': kbn_version }
        }).then(function (response) {
            console.log("res |")
            console.log(response.data);
            window.location.replace(response.data.location)
        });
    }


    // put your kibana login info here

    function getUser() {
        let host = window.location.host;
        if (host.indexOf("foodtruck-qa") >= 0) {
            return {
                "username": "qa-name",
                "pwd": "pwd"
            }
        } else if (host.indexOf("foodtruck-uat") >= 0) {
            return {
                "username": "uat-name",
                "pwd": "pwd"
            }
        } else if (host.indexOf("remarkablefoods.net") >= 0) {
            return {
                "username": "prod-name",
                "pwd": "pwd"
            }
        }
        return {}
    }
})();