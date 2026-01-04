// ==UserScript==
// @name         TvingAuto Skeep
// @description  티빙 오프닝 건너뛰기
// @match        *://www.tving.com/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @version 0.0.1.20230313101518
// @namespace https://greasyfork.org/users/1041205
// @downloadURL https://update.greasyfork.org/scripts/461728/TvingAuto%20Skeep.user.js
// @updateURL https://update.greasyfork.org/scripts/461728/TvingAuto%20Skeep.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        //오프닝 스킵
        const xpath = '//*[@id="__next"]/main/div/div/div/div/div/div[2]/div[9]/div/button';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            document.querySelector('#__next > main > div > div > div > div > div > div:nth-child(2) > div:nth-child(9) > div > button').click();
        }
        //다음화 재생
        const xpath2 = '//*[@id="__next"]/main/div/div/div/div/div/div[2]/div[9]/div/div/button[1]';
         const element2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element2) {
            document.querySelector('#__next > main > div > div > div > div > div > div:nth-child(2) > div:nth-child(9) > div > div > button:nth-child(1)').click();

        }
    }, 5010);
})();