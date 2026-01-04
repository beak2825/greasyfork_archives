// ==UserScript==
// @name         AutoRespawn (simplified)
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  autorespawn using a new method after the update
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505410/AutoRespawn%20%28simplified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505410/AutoRespawn%20%28simplified%29.meta.js
// ==/UserScript==

setInterval(() => {if(!extern.doesHaveTank() && window.lobby_ip){extern.try_spawn(document.querySelector("#spawn-nickname").value);}}, 100);