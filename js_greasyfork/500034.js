// ==UserScript==
// @name         LZT_Giveaway_Support
// @version      0.2
// @description  Вы подняли свою решимость
// @author       molihan - extra
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://lolz.guru/favicon.svg
// @namespace    https://greasyfork.org/ru/users/1187197
// @downloadURL https://update.greasyfork.org/scripts/500034/LZT_Giveaway_Support.user.js
// @updateURL https://update.greasyfork.org/scripts/500034/LZT_Giveaway_Support.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let contestBlock = document.querySelector(".contestThreadBlock");
 
    if (contestBlock) {
        let contentBlock = document.querySelector(".messageText.SelectQuoteContainer.baseHtml.ugc");
        let pollBlock = document.querySelector(".PollContainer");
 
        contentBlock.innerHTML = '<img src="https://i.imgur.com/QhAmyIq.png" alt="Поднятие решимости">'
    }
})();