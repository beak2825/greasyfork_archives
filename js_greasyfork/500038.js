// ==UserScript==
// @name         LZT_Giveaway_Support_For_Admin_Version
// @version      0.1.1
// @description  Вы подняли свою решимость
// @author       molihan - extra
// @license      MIT
// @match        *://zelenka.guru/threads/*
// @match        *://lolz.guru/threads/*
// @match        *://lolz.live/threads/*
// @icon         https://lolz.guru/favicon.svg
// @namespace https://greasyfork.org/ru/users/1187197
// @downloadURL https://update.greasyfork.org/scripts/500038/LZT_Giveaway_Support_For_Admin_Version.user.js
// @updateURL https://update.greasyfork.org/scripts/500038/LZT_Giveaway_Support_For_Admin_Version.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let contestBlock = document.querySelector(".contestThreadBlock");
 
    if (contestBlock) {
        let contentBlock = document.querySelector(".messageText.SelectQuoteContainer.baseHtml.ugc");
        let pollBlock = document.querySelector(".PollContainer");
 
        contentBlock.innerHTML = '<img src="https://i.imgur.com/jceDhjj.png" alt="Поднятие решимости">'
    }
})();