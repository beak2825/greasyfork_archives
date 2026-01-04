// ==UserScript==
// @name         RaysMorgan Contest
// @version      0.1
// @description  Добавляет Гришу в розыгрыши
// @author       stealyourbrain
// @match        https://lolz.guru/threads/*
// @match        https://zelenka.guru/threads/*
// @icon         https://lolz.guru/favicon.svg
// @namespace https://greasyfork.org/users/1220529
// @downloadURL https://update.greasyfork.org/scripts/491205/RaysMorgan%20Contest.user.js
// @updateURL https://update.greasyfork.org/scripts/491205/RaysMorgan%20Contest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let contestBlock = document.querySelector(".contestThreadBlock");

    if (contestBlock) {
        let contentBlock = document.querySelector(".messageText.SelectQuoteContainer.baseHtml.ugc");
        let pollBlock = document.querySelector(".PollContainer");

        contentBlock.innerHTML = '<img src="https://i.imgur.com/XFya6Za.jpg" alt="Grisha">'
    }
})();