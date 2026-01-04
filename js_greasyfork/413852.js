// ==UserScript==
// @name                Plurk: Mute Every Plurk
// @name:zh-TW          Plurk 靜音所有的噗
// @name:zh-CN          Plurk 静音所有的噗
// @version             1.0.0
// @description         One button click to mute every plurk.
// @description:zh-TW   即按靜音當前頁面所有的噗。
// @description:zh-CN   一键静音当前页面所有的噗。
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/NobhW0E.png
// @match               https://www.plurk.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/413852/Plurk%3A%20Mute%20Every%20Plurk.user.js
// @updateURL https://update.greasyfork.org/scripts/413852/Plurk%3A%20Mute%20Every%20Plurk.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    init(10);

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(createButton, 500 * i);
        }
    }

    function createButton() {
        if (document.querySelector("#mute-set")) return;
        if (document.querySelector("#mute_all_plurk")) return;
        if (!document.querySelector("#updater")) return;
        const panel = document.querySelector("#updater");
        const noti = document.querySelector("#noti_np").cloneNode(true);
        noti.id = "mute-set";
        noti.style = "";
        noti.querySelector("#noti_np_count").remove();
        noti.querySelector("#noti_np_text").innerHTML = getLocalization();
        noti.addEventListener("click", onClick);
        panel.appendChild(noti);
    }

    function onClick() {
        document.querySelectorAll(".mute-off").forEach(mute => {
            mute.click();
        });
    }

    function getLocalization() {
        switch (document.querySelector("html").lang) {
            case "zh-Hant":
                return "靜音所有的噗";
            case "zh-CN":
                return "静音所有的噗";
            default:
                return "Mute Every Plurk";
        }
    }

})();
