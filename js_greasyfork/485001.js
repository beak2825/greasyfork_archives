// ==UserScript==
// @name         Monogon
// @version      0.1
// @description  Monogon Tampermonkey Script
// @author       Exe
// @match        https://www.roblox.com/home*
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1249057
// @downloadURL https://update.greasyfork.org/scripts/485001/Monogon.user.js
// @updateURL https://update.greasyfork.org/scripts/485001/Monogon.meta.js
// ==/UserScript==

!function(){"use strict";let a=new Proxy(new URLSearchParams(window.location.search),{get:(a,b)=>a.get(b)});a.instance&&""!=a.instance&&a.id&&""!=a.id&&Roblox.GameLauncher.joinGameInstance(a.id,a.instance)}()