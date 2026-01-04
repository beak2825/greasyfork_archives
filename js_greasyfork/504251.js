// ==UserScript==
// @name         WarningTheme Pink_Topic
// @namespace    http://tampermonkey.net/
// @version      v1 2024-08-19
// @description  Предупреждение. Закрытая тема. Розовый стиль
// @author       Melanty & molihan
// @license      MIT
// @match        https://lolz.live/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @namespace    https://greasyfork.org/ru/users/1187197
// @downloadURL https://update.greasyfork.org/scripts/504251/WarningTheme%20Pink_Topic.user.js
// @updateURL https://update.greasyfork.org/scripts/504251/WarningTheme%20Pink_Topic.meta.js
// ==/UserScript==
(function() {
    'use strict';


    function createWarningBanner() {
        var warningBanner = document.createElement("div");
        warningBanner.className = "sectionMain PollContainer mn-15-0-0";
        warningBanner.style.padding = "16px 20px";
        warningBanner.style.fontSize = "16px";
        warningBanner.style.fontWeight = "800";
        warningBanner.style.background = "#341C31";
        warningBanner.style.color = "#E64AC9";
        warningBanner.style.display = "flex";
        warningBanner.style.alignItems = "center";

        var lockIcon = document.createElement("i");
        lockIcon.className = "fa fa-lock";
        lockIcon.style.marginRight = "10px";
        lockIcon.style.fontSize = "16px";


        var warningText = document.createElement("h1");
        warningText.style.fontWeight = "600";
        warningText.innerText = "В этой теме нельзя размещать новые ответы.";

        warningBanner.appendChild(lockIcon);
        warningBanner.appendChild(warningText);

        return warningBanner;
    }


    if (document.body.innerText.includes("Вы не можете выполнить это действие, потому что тема была закрыта.")) {
        var pageContent = document.querySelector(".pageContent");
        if (pageContent) {
            var titleBar = pageContent.querySelector(".titleBar") || document.querySelector(".titleBar");

            if (titleBar) {
                var warningBanner = createWarningBanner();
                titleBar.insertAdjacentElement('afterend', warningBanner);
            }
        }
    }
})();