// ==UserScript==
// @name         GTA5mods redirect to English URL
// @namespace    Me
// @version      3.0
// @description  Redirects GTA5mods to English URL
// @author       HappySmacky3453
// @match        *://*.gta5-mods.com/*
// @exclude      https://www.gta5-mods.com/*
// @exclude      https://forums.gta5-mods.com/*
// @exclude      https://img.gta5-mods.com/*
// @grant        none
// @run-at document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/415925/GTA5mods%20redirect%20to%20English%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/415925/GTA5mods%20redirect%20to%20English%20URL.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.location.host = 'gta5-mods.com';