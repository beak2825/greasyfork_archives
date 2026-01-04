// ==UserScript==
// @name         Vodafone Easybox HASS Device Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sends the online status of network devices to HASS
// @author       werth.david@gmail.com
// @match        http://192.168.0.1/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/397963/Vodafone%20Easybox%20HASS%20Device%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/397963/Vodafone%20Easybox%20HASS%20Device%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var password = localStorage.getItem("password");
    var hassioHost, easyboxHost, hassioToken;
    if (!password) {
        password = prompt("Please provide the password for logging in to Vodafone Easybox (will be stored in your browser)");
        hassioHost = prompt("Please enter the URL where HomeAssistant is running (e.g. http://192.168.0.4:8123)");
        easyboxHost = prompt("Please enter the URL of your Vodafone Router (should be http://192.168.0.1)", "http://192.168.0.1");
        hassioToken = prompt("Please enter your 'Long-Lived Access Token' (can be obtained from HomeAssistant Web-GUI)");
        localStorage.setItem("hassioHost", hassioHost);
        localStorage.setItem("easyboxHost", easyboxHost);
        localStorage.setItem("password", password);
        localStorage.setItem("hassioToken", hassioToken);
    } else {
        hassioHost = localStorage.getItem("hassioHost");
        easyboxHost = localStorage.getItem("easyboxHost");
        hassioToken = localStorage.getItem("hassioToken");
    }

    setTimeout(() => checkLoginRequired(), 2000);
    setTimeout(() => location.reload(true), 90000);

    function checkLoginRequired() {
        if ($("#Password").length) {
            $("#Password").attr("value", password);
            $("#LoginBtn").click();
            setTimeout(() => $(".popup input").delay(1000).click(), 1000);
        } else {
            if ($("tbody#dhcpDevInfo").length) {
                getAllDevices();
            } else {
                window.location.href = easyboxHost + "/?status_lan&mid=StatusLan";
            }
        }
    }

    function getAllDevices() {
        console.log("looking for devices");
        $(".content-lan-status tbody#dhcpDevInfo tr").each(function () {
            var mac = $(this).find("td:nth-child(2)").text();
            var status = $(this).find("td:nth-child(5)").text().toLowerCase();

            var home = (status === "aktiv" || status === "active") ? "home" : "not_home";
            console.log(mac, "-->", home);

            GM_xmlhttpRequest({
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + hassioToken
                },
                url: hassioHost + "/api/services/device_tracker/see",
                data: "{\"mac\":\"" + mac + "\",\"location_name\":\"" + home + "\"}",
                onload: function (response) {
                    console.log(mac, response.statusText);
                }
            });
        });
    }
})();