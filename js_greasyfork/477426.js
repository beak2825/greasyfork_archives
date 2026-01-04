// ==UserScript==
// @name         [LZT] Remove Money Contest
// @namespace    [LZT] Remove Money Contest
// @version      0.1
// @description  Remove Money Contest On Lolz
// @author       el9in
// @license      el9in
// @match        https://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/477426/%5BLZT%5D%20Remove%20Money%20Contest.user.js
// @updateURL https://update.greasyfork.org/scripts/477426/%5BLZT%5D%20Remove%20Money%20Contest.meta.js
// ==/UserScript==

(function() {
    const isMoney = document.querySelector(".prefix.general.moneyContestWithValue");
    if(isMoney) {
        const stop = () => {
            if (document.readyState !== 'complete') {
                window.stop();
            }
        }
        setTimeout(stop, 2000);
    }
})();