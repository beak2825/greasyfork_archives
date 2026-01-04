// ==UserScript==
// @name         pixivの漫画を自動で展開
// @namespace    https://armedpatriot.blog.fc2.com/
// @version      1.0.5
// @description  pixivのマンガ作品の閲覧画面で、[すべて見る]を自動でクリックします。
// @author       Patriot
// @match        https://www.pixiv.net/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387457/pixiv%E3%81%AE%E6%BC%AB%E7%94%BB%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E5%B1%95%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387457/pixiv%E3%81%AE%E6%BC%AB%E7%94%BB%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E5%B1%95%E9%96%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const selector=`[style="transform: translateY(0%);"] section + button`;

    let intervalID=setInterval(
        ()=>{
            let expandButtonElement=document.querySelector(selector);
            if(expandButtonElement){
                expandButtonElement.click();
            }
        },
        500
    );
})();