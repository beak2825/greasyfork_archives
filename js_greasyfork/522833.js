// ==UserScript==
// @name                Acfun自动点击AC娘
// @name:zh-CN          Acfun自动点击AC娘
// @name:en             Acfun auto click
// @namespace           http://tampermonkey.net/
// @version             2025-02-23
// @description:zh-CN   点!
// @description:en      Click!
// @author              umekoj
// @match               https://www.acfun.cn/*
// @icon                https://cdn.aixifan.com/ico/favicon.ico
// @grant               none
// @license             MIT
// @description acfun auto click!
// @downloadURL https://update.greasyfork.org/scripts/522833/Acfun%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBAC%E5%A8%98.user.js
// @updateURL https://update.greasyfork.org/scripts/522833/Acfun%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBAC%E5%A8%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const mouse_click_event = new MouseEvent("click", {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'clientX': 100,
        'clientY': 100
    });
    let footer_avatar_ac = document.querySelector("div[class='fr no-select footer-avatar-ac']")
    function autoClick() {
        footer_avatar_ac.dispatchEvent(mouse_click_event)
    }

    let timeout = 1000
    let auto_click_interval;

    // get avatar element
    const footer_avatar_ac_interval = setInterval(() => {
        if(footer_avatar_ac){
            clearInterval(footer_avatar_ac_interval)
            auto_click_interval = setInterval(autoClick, timeout)
        }else{
            footer_avatar_ac = document.querySelector("div[class='fr no-select footer-avatar-ac']")
        }
    },1000)

    document.addEventListener("keydown", (event) => {
        if (event.altKey && event.key === ",") {
            clearInterval(auto_click_interval)
            if(timeout < 60000){
                timeout += 100
            }
            auto_click_interval = setInterval(autoClick, timeout)
        }
        if (event.altKey && event.key === ".") {
            clearInterval(auto_click_interval)
            if(timeout > 100){
                timeout -= 100
            }
            auto_click_interval = setInterval(autoClick, timeout)
        }
        // pause & continue
        if (event.altKey && event.key === "x") {
            if(auto_click_interval){
                clearInterval(auto_click_interval)
                auto_click_interval = 0
            }else{
                auto_click_interval = setInterval(autoClick, timeout)
            }
        }
    })
})();

