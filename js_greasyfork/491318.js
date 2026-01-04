// ==UserScript==
// @name         Custom Cursor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       You
// @match        https://bloxd.io/
// @match        https://staging.bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491318/Custom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/491318/Custom%20Cursor.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://cdn.discordapp.com/attachments/1203712027705479228/1221816326553731173/Crosshair.png?ex=6613f420&is=66017f20&hm=e8f4d97851e2fb876cf0f0676d137b533f9ffc9041626d7e254b9dee042c5ba7&)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);
