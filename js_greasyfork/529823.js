// ==UserScript==
// @name         GTA5mods Сайт всегда на русском
// @namespace    Sky
// @version      1.0
// @description  GTA5mods всегда перенаправляет сайт на русский URL
// @author       Sky
// @match        *://*.gta5-mods.com/*
// @exclude      https://ru.gta5-mods.com/*
// @exclude      https://forums.gta5-mods.com/*
// @exclude      https://img.gta5-mods.com/*
// @grant        none
// @run-at document-start
// @noframes
// @license Sky
// @downloadURL https://update.greasyfork.org/scripts/529823/GTA5mods%20%D0%A1%D0%B0%D0%B9%D1%82%20%D0%B2%D1%81%D0%B5%D0%B3%D0%B4%D0%B0%20%D0%BD%D0%B0%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/529823/GTA5mods%20%D0%A1%D0%B0%D0%B9%D1%82%20%D0%B2%D1%81%D0%B5%D0%B3%D0%B4%D0%B0%20%D0%BD%D0%B0%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%BC.meta.js
// ==/UserScript==
/* Sky */
'use strict';
 
window.location.host = 'ru.gta5-mods.com';