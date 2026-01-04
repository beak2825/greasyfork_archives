// ==UserScript==
// @name         Rakuten MailMagazine Auto Canceller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @author       Theta
// @match        https://*.step.rakuten.co.jp/rms/mall/bs/mconfirmorderquicknormalize/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rakuten.co.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440620/Rakuten%20MailMagazine%20Auto%20Canceller.user.js
// @updateURL https://update.greasyfork.org/scripts/440620/Rakuten%20MailMagazine%20Auto%20Canceller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        document.getElementById("clearMailMagazine").click();
        document.getElementById("clearShopBookMark").click();
    }, 1000);

})();