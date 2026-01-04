// ==UserScript==
// @name:en         Remove VK Connect banner
// @name            Блокировщик баннера VK Connect
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description:en  removes VK Connect banner (doesn't freeze page, doesn't block other popups)
// @description     убирает баннер VK Connect (но не заставляет страницу зависать, не блокирует другие всплывающие окна)
// @author          Gushchin
// @match           *://vk.com/*
// @match           *://*.vk.com/*
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/406092/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0%20VK%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/406092/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0%20VK%20Connect.meta.js
// ==/UserScript==

function hideVkConnectBanner() {
    if (document.querySelectorAll('.vk_connect_policy')[0]) {
        boxQueue._boxes = [];
        curBox()._hide();
        _message_boxes = [];
    }
}

(function () { setInterval(hideVkConnectBanner, 500); })();