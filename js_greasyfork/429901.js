// ==UserScript==
// @name         Полезность
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  че то там с полезностью
// @author       S30N1K
// @match        https://dota2.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429901/%D0%9F%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D0%BE%D1%81%D1%82%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/429901/%D0%9F%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D0%BE%D1%81%D1%82%D1%8C.meta.js
// ==/UserScript==

(() => {
    if (/\/forum\/threads\//.test(window.location.pathname)){
        for (const e of $("#message-list > li > .theme-user-block")){
            const messages = parseInt($(e).find(".forum-theme__item-info-desk > p:nth-child(2)").html().split(":")[1])
            const rating = parseInt($(e).find(".forum-theme__item-info-desk > p:nth-child(3)").html().split(":")[1])
            const respect = parseInt(rating / messages * 100)

            $(e).find(".forum-theme__item-info-desk").append(`<p class='forum-theme__item-info'>Полезность: ${respect}%</p>`)
        }
    }
})()