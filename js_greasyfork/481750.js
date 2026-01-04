// ==UserScript==
// @name         EksiSozluk Sayfa Yenile
// @namespace    https://eksisozluk.com
// @version      v0.7
// @description  EkşiSözlük sayfasını otomatik yeniler.
// @author       BoomBookTR
// @homepage     https://greasyfork.org/tr/scripts/481748
// @supportURL   https://greasyfork.org/tr/scripts/481748/feedback
// @match        https://eksisozluk.com/*
// @match        https://eksisozluk.com/biri/isaacyer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/481750/EksiSozluk%20Sayfa%20Yenile.user.js
// @updateURL https://update.greasyfork.org/scripts/481750/EksiSozluk%20Sayfa%20Yenile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        // 10 dakikada bir sayfayı yenile
        setInterval(function() {
            window.location.reload(true);
        }, 10000); // 600000 milisaniye = 10 dakika 1000 ms = 1 sn
    })
})();