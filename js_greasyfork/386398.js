// ==UserScript==
// @name         AIS3志願更改按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  找回那消失ㄉ按鈕
// @author       seadog007
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @include      https://ais3.org/profile/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386398/AIS3%E5%BF%97%E9%A1%98%E6%9B%B4%E6%94%B9%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/386398/AIS3%E5%BF%97%E9%A1%98%E6%9B%B4%E6%94%B9%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

a = document.querySelector("#profile > div.shadow.container > div > div:nth-child(32) > p");
if(a.childElementCount == 1){
    a.innerHTML += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#confirmModal">修改志願序</button>';
}
