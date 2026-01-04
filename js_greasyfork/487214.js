// ==UserScript==
// @name            [Steam friend activity] Hide all screenshots behind a black square
// @name:ru         [Steam активность друзей] Скрыть все скриншоты за черным квадратом
// @namespace       http://tampermonkey.net/
// @version         1.1
// @description     Hides all screenshots from the steam friend activity and shows them back when you hover over them
// @description:ru  Скрывает все скриншоты в активности друзей. Миниатюры заблюрены, выбранный скриншот скрыт за черным квадратом. При наведении мыши показывает скриншот.
// @author          Greended
// @match           https://steamcommunity.com/id/*
// @icon            https://store.steampowered.com/favicon.ico
// @grant           GM_addStyle
// @run-at          document-start
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/487214/%5BSteam%20friend%20activity%5D%20Hide%20all%20screenshots%20behind%20a%20black%20square.user.js
// @updateURL https://update.greasyfork.org/scripts/487214/%5BSteam%20friend%20activity%5D%20Hide%20all%20screenshots%20behind%20a%20black%20square.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`

    .blotter_screenshot_gallery_image img,
    .blotter_screenshot_gallery_image_selected img
    {
    filter: blur(15px);
    }

    .blotter_screenshot_image
    {
    filter: brightness(0%);
    }

    .blotter_screenshot_gallery_image:hover img,
    .blotter_screenshot_gallery_image_selected:hover img,
    .blotter_screenshot_image:hover
    {
    filter: none;
    }
    `)
})();