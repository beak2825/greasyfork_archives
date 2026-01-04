// ==UserScript==
// @name         한화
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take oveㅇㄹㄴㅁr the world!
// @author       You
// @match        https://www.lifeplus9dok.co.kr/mobile?*
// @icon         https://www.google.com/s2/favicons?domain=co.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430931/%ED%95%9C%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/430931/%ED%95%9C%ED%99%94.meta.js
// ==/UserScript==

front.index.fnRaffle();
setTimeout(function() {
    console.log($(`div[id=popFail]:visible`).length)

    if($(`div[id=popFail]:visible`).length>=1){
       location.reload();
    }
}, 5000);

