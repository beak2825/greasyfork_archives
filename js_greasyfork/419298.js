// ==UserScript==
// @name         Delete Yandex.Plus notification + enable background music on page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://music.yandex.ru/users/*
// @downloadURL https://update.greasyfork.org/scripts/419298/Delete%20YandexPlus%20notification%20%2B%20enable%20background%20music%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/419298/Delete%20YandexPlus%20notification%20%2B%20enable%20background%20music%20on%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
var elem = document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back > div.bar > div.bar-below.bar-below_plus > div")
elem.remove();

    // Your code here...
})();