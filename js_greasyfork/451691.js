// ==UserScript==
// @name         审核快捷
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  111
// @author       似梦非梦
// @match        http://210.36.48.84:8080/zhcp/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451691/%E5%AE%A1%E6%A0%B8%E5%BF%AB%E6%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/451691/%E5%AE%A1%E6%A0%B8%E5%BF%AB%E6%8D%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
        document.addEventListener('keydown', function (event) {
        if (event.keyCode == 65) {
            document.getElementsByClassName("k-button")[0].click();
        };
            if (event.keyCode == 32) {
            document.getElementsByClassName("okBtn")[0].click();
        };

    // Your code here...
    });
})();