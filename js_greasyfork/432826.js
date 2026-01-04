// ==UserScript==
// @name         scriptloader
// @namespace    https://greasyfork.org/zh-TW/users/818008-seraphest
// @version      0.3
// @description  a simple JS loader
// @author       SeraphEST
// @include      /huaray
// @include      /localhost
// @include      127.0.0.1
// @icon         https://img.icons8.com/ios/452/javascript--v1.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432826/scriptloader.user.js
// @updateURL https://update.greasyfork.org/scripts/432826/scriptloader.meta.js
// ==/UserScript==

/* jshint esversion:8 */

function loadScript(src) {//動態載入
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.body.append(s);
    });
}

async function loadTime(){
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/moment-duration-format/2.3.2/moment-duration-format.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/moment-taiwan@0.0.4/src/moment-taiwan.js");
    window.timediff = function(x, y){
        return moment.duration(moment(x).diff(moment(y))).format("Y [Year],M [Month],D [Day] H [Hour],m [Min],s [Second]");
    };
    console.log("OK");
}
(function() {
    'use strict';
    try{
        window.loadScript = loadScript;
        window.loadTime = loadTime;
        console.log("JS loader inited\nUsage: loadScript(url)");
    }catch(e){
        console.log(e);
    }
})();