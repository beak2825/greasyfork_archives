/* globals vk, cur, getDateText, GM, GM_xmlhttpRequest */
/* eslint padded-blocks: ["error", { "blocks": "always" }]
object-curly-spacing: ["error", "always", { "objectsInObjects": false }]
curly: ["error", "multi"] */

// ==UserScript==
// @name            test
// @name:ru         test
// @description     Checks the last online on page user and in dialog
// @description:ru  Проверяет последний онлайн пользователя на странице и в диалогe
// @namespace       test
// @license         MIT
// @author          askornot
// @version         1.0.5
// @match           https://vk.com/*
// @connect         vk.com
// @compatible      chrome     Violentmonkey 2.12.7
// @compatible      firefox    Violentmonkey 2.12.7
// @compatible      yandex     Violentmonkey 2.12.7
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/425356/test.user.js
// @updateURL https://update.greasyfork.org/scripts/425356/test.meta.js
// ==/UserScript==

console.log(1);