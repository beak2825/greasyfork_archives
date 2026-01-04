// ==UserScript==
// @name         MyKichenHelper
// @namespace    http://tampermonkey.net/
// @version      2024-12-28
// @license      Apache 2.0
// @description  Помощник для работы с MyKitchen
// @author       li0ard
// @match        https://mykitchen.digital/orders/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unirest.tech
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/522097/MyKichenHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/522097/MyKichenHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let orderId = location.pathname.split("/")[2]
    let element = Array.from(document.querySelectorAll('*')).find(e => e.__vue__).__vue__;
    let working = 0
    GM_registerMenuCommand("Узнать пинкод", () => {
        if(working !== 0) return;
        working = 1
        let part = orderId.substring(0, 4)
        let buff = []
        for(let i of part.split("")) {
            if(isNaN(i)) {
                buff.push(i.charCodeAt(0)-96)
            } else {
                buff.push(i)
            }
        }
        alert(`Пин-код заказа: ${buff.join("")}`)
        working = 0
    })
})();