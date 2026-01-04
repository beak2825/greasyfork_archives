// ==UserScript==
// @name         제주두더지
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://webzine.jpdc.co.kr/html/vol11/sub03_05.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412854/%EC%A0%9C%EC%A3%BC%EB%91%90%EB%8D%94%EC%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/412854/%EC%A0%9C%EC%A3%BC%EB%91%90%EB%8D%94%EC%A7%80.meta.js
// ==/UserScript==

setTimeout(function() {
    var pastMoleCount = 0;
    var macro = setInterval(function() {
        if(pastMoleCount != parseInt($("#molecnt").text())){
            pastMoleCount = parseInt($("#molecnt").text());
            mousehammer(pos);
        }
    }, 10);
}, 1000);
