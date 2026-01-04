// ==UserScript==
// @name         Better Yandex Image Search
// @namespace    https://github.com/derac/Better-Yandex-Image-Search
// @version      0.1
// @description  Add fullscreen image scaling and hit down button to start quick slideshow.
// @author       derac
// @match        *yandex.com/images/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412102/Better%20Yandex%20Image%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/412102/Better%20Yandex%20Image%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let playing = false; let TIMEOUT_MS = 1500; let timeout;
    let style_sheet = document.createElement('style');
    document.getElementsByTagName("html").item(0).appendChild(style_sheet)
    style_sheet.innerHTML = `.MMImageContainer {width:100% !important;height:100% !important}
.MMImage-Preview {width:100% !important;height:100% !important;background:black !important;}`
    let click_next = () => { document.getElementsByClassName("CircleButton_type_next").item(0).click(); }
    document.onkeydown = (e)=>{
        if (e.keyCode==38) { playing=!playing;
                            if (playing) { timeout = setInterval(click_next, TIMEOUT_MS); }
                            else { window.clearInterval(timeout); } } }
})();