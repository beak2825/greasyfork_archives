// ==UserScript==
// @name         VirMach黑五价格监控
// @namespace    https://mhsl.tech/
// @version      0.1
// @description  Virmach Corn
// @author       Christina
// @match        https://virmach.com/black-friday-cyber-monday/*
// @icon         https://www.google.com/s2/favicons?domain=virmach.com
// @grant        GM_notification

// @downloadURL https://update.greasyfork.org/scripts/432579/VirMach%E9%BB%91%E4%BA%94%E4%BB%B7%E6%A0%BC%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/432579/VirMach%E9%BB%91%E4%BA%94%E4%BB%B7%E6%A0%BC%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var timer = setInterval(function () {
        var pricing = document.querySelector("#pricing").innerText;
        var virt = document.querySelector("#virt").innerText;
        var ram = document.querySelector("#ram").innerText;
        var cpu = document.querySelector("#cpu").innerText;
        var hdd = document.querySelector("#hdd").innerText;
        var location = document.querySelector("#location").innerText;
        var buyurl = document.querySelector("#buyurl").innerText;
        var nowTime = new Date();
        var notificationDetails = {
            text: virt + " | " + ram + " | " + cpu + "H | " + hdd + " | " + pricing + " | " + location + "\n当前时间" + nowTime.toLocaleTimeString(),
            title: 'VIR实时价格  ' + pricing + " " + buyurl,
            // 弹窗消失时间，默认为30秒
            timeout: 30000,
            // 点击弹窗即可进入购买页面，无aff；作者aff链接：https://billing.virmach.com/aff.php?aff=4888
            onclick: function () { window.open("https://billing.virmach.com/cart.php?a=add&pid=179&billingcycle=annually", "_blank"); },
        };
        GM_notification(notificationDetails);
        //执行周期，默认为20秒，因此会有10秒时间同时存在两个弹窗，可将timeout设置为19000达到无缝切换的效果
    }, 20000)
})();