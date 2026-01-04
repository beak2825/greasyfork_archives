// ==UserScript==
// @name         【Δdmiral(¬_¬)Δrschhaar】
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487262/%E3%80%90%CE%94dmiral%28%C2%AC_%C2%AC%29%CE%94rschhaar%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/487262/%E3%80%90%CE%94dmiral%28%C2%AC_%C2%AC%29%CE%94rschhaar%E3%80%91.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://piskel-imgstore-b.appspot.com/img/729d3978-cace-11ee-9e64-e97fb9061991.gif)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "40px";
        crosshair.style.height = "30px";
    }
}, 1000);
