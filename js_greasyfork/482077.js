// ==UserScript==
// @name         cc-fan.tv - Кнопка Picture-in-picture для Полиция Парадайз
// @namespace    https://paradise.nf-fan.tv/
// @version      1.0
// @description  Кнопка для открытия видео в режиме Picture-in-picture
// @author       You
// @match        https://paradise.nf-fan.tv/page.php?id=*
// @icon         https://paradise.nf-fan.tv/images/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482077/cc-fantv%20-%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20Picture-in-picture%20%D0%B4%D0%BB%D1%8F%20%D0%9F%D0%BE%D0%BB%D0%B8%D1%86%D0%B8%D1%8F%20%D0%9F%D0%B0%D1%80%D0%B0%D0%B4%D0%B0%D0%B9%D0%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482077/cc-fantv%20-%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20Picture-in-picture%20%D0%B4%D0%BB%D1%8F%20%D0%9F%D0%BE%D0%BB%D0%B8%D1%86%D0%B8%D1%8F%20%D0%9F%D0%B0%D1%80%D0%B0%D0%B4%D0%B0%D0%B9%D0%B7.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var button = document.createElement("button");
    button.innerHTML = `<svg width="24px" height="24px" style="display: block;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"/>
</svg>`;
    button.style.position = "fixed";
    button.style.right = "1rem";
    button.style.bottom = "1rem";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 0 2px rgba(0,0,0,0.24), 0 4px 8px rgba(0,0,0,0.28)";
    button.style.padding = "0.25rem 0.75rem";
    button.setAttribute("title", "Открыть плеер в плавающем окошке");
    button.onclick = function() {
        var video = document.getElementsByTagName("video")[0];
        if (video) {
            video.requestPictureInPicture();
        }
    }
    document.body.appendChild(button);
})();// ==UserScript==
// @name        New script - greasyfork.org
// @namespace   Violentmonkey Scripts
// @match       https://greasyfork.org/ru/help/installing-user-scripts
// @grant       none
// @version     1.0
// @author      -
// @description 10.12.2023, 18:31:04
// ==/UserScript==