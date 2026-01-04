// ==UserScript==
// @name         MAKA去水印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除MAKA水印!
// @license           AGPL-3.0-or-later
// @author       kvstone
// @match        https://www.maka.im/postereditor?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447476/MAKA%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/447476/MAKA%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var delay=1000;
    var timer;
    function removeWaterMark(){
        
        var wm = document.querySelector(".poster-editor-watermark");
        
        if(wm!=null){
            wm.style.display = "none";
        }
    }
    window.addEventListener("load", () => {
        clearTimeout(timer);
        setTimeout(()=>removeWaterMark(), delay);
    });
})();
