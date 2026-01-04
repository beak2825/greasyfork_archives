// ==UserScript==
// @name         Custom Cursor Form KingOpPlayz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483407/Custom%20Cursor%20Form%20KingOpPlayz.user.js
// @updateURL https://update.greasyfork.org/scripts/483407/Custom%20Cursor%20Form%20KingOpPlayz.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://lh3.googleusercontent.com/mfdjL6r1en6mWI3QVMnBbcSX-7QpgBE5EyXo0YbK6299QSJsi58GkfecyL0W7yYljK37vV6Mk7wD69QNdp8LiNw=s400)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);
