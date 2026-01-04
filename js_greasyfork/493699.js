// ==UserScript==
// @name         VK Sans
// @run-at       document-body
// @namespace    vksans
// @version      1
// @author       CATLYS
// @description  Скрипт для ВКонтакте, который устанавливает шрифт VK Sans. Станет более красиво. This script for VK.com installs the VK Sans font. It will become more beautiful.

// @icon         https://vk.ru/favicon.ico
// @match       *://vk.com/*
// @match       *://*.vk.com/*
// @match       *://userapi.com/*
// @match       *://*.userapi.com/*
// @match       *://vk.me/*
// @match       *://*.vk.me/*
// @match       *://*.vk.ru/*

// @grant    none

// @connect      self

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/493699/VK%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/493699/VK%20Sans.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.body.style.setProperty("font-family", "VK Sans Text", "important")
})();