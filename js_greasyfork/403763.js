// ==UserScript==
// @name         dark_mode_whatsappweb
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Activate dark mode in https://web.whatsapp.com/
// @author       https://github.com/bergpb
// @match        https://web.whatsapp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403763/dark_mode_whatsappweb.user.js
// @updateURL https://update.greasyfork.org/scripts/403763/dark_mode_whatsappweb.meta.js
// ==/UserScript==
window.addEventListener("load", function(event) {
    'use strict';
    var time = (new Date()).getHours();
    const dayTime = time > 6 && time < 18;

    if(!dayTime){
        console.log("It's a darkness night");
        document.body.classList.add("dark");
    } else {
        console.log("It's a shining day");
    }
});
