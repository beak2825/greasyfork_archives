// ==UserScript==
// @name         autolaocai
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       zhouqiang
// @match        https://www.laocaibao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30157/autolaocai.user.js
// @updateURL https://update.greasyfork.org/scripts/30157/autolaocai.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Your code here...
    console.log("Now, Let's GO! url = " + document.URL);
    if(document.URL.startsWith("https://www.laocaibao.com/products/")) {
        setTimeout(function() {
            console.log("reload pages...");
            window.location.reload();
        }, 20000);
        console.log("click buy button~");
        $('.nowBuy-btn').click();
        setTimeout(function() {
            console.log("click order buy button~");
            $('.buy-btn').click();
        }, 800);
    } else if(document.URL === "https://www.laocaibao.com/user/queryOrder") {
        console.log("click confirm button~");
        $('.confirm-btn').click();
        setTimeout(function() {
            $(".inputTradePwd-form-input").each(function(index){
                this.value = 3;
                this.onkeyup = function(e) {
                    console.log(e);
                };
                let mockKeyEvent = {
                    key: "3",
                    code: "Digit3",
                    keyCode: 51
                };
                let keyEvent = document.createEvent("KeyboardEvent");
                keyEvent.initKeyboardEvent("keyup", false, false, window, "Digit3", 2, false, false, false, false, false);
                Object.defineProperty(keyEvent, 'key', {
                    value: "3",
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(keyEvent, 'code', {
                    value: "Digit3",
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(keyEvent, 'keyCode', {
                    value: 51,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                // keyEvent.key = "3";
                // keyEvent.code = "Digit3";
                // keyEvent.keyCode = 51;
                this.dispatchEvent(keyEvent);
            });
            setTimeout(function() {
                $(".charge-goon").click();
            }, 300);
        }, 300);
    }
})();
