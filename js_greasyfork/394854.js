// ==UserScript==
// @name         Melvor Auto Loot
// @version      1.2
// @description  Automatically loots enemy drops
// @author       Arcanus
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/394854/Melvor%20Auto%20Loot.user.js
// @updateURL https://update.greasyfork.org/scripts/394854/Melvor%20Auto%20Loot.meta.js
// ==/UserScript==

this.autoLoot = setInterval(lootAll, 1000)