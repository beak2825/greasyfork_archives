// ==UserScript==
// @name         Voxiom.IO Speedhack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enables the player to go at 2x speed. 
// @author       Den#9999
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/447360/VoxiomIO%20Speedhack.user.js
// @updateURL https://update.greasyfork.org/scripts/447360/VoxiomIO%20Speedhack.meta.js
// ==/UserScript==
 
 
//made by Den#9999 on discord
(original => Date.now = () => original() * 4)(Date.now);
//https://discord.gg/87DqmVdcZN