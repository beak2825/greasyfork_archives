// ==UserScript==
// @name         net_predict_movement false
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  disabled predict movement
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517484/net_predict_movement%20false.user.js
// @updateURL https://update.greasyfork.org/scripts/517484/net_predict_movement%20false.meta.js
// ==/UserScript==

setInterval(() => {
    input.set_convar("net_predict_movement", "false")
}, 100);