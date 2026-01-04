// ==UserScript==
// @name         G2G Chat Sayfasını Yenile
// @namespace    https://www.g2g.com/
// @version      v0.2
// @description  G2G Chat sayfasını otomatik yeniler.
// @author       BoomBookTR
// @homepage     https://greasyfork.org/tr/scripts/481752
// @supportURL   https://greasyfork.org/tr/scripts/481752/feedback
// @match        https://www.g2g.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/481752/G2G%20Chat%20Sayfas%C4%B1n%C4%B1%20Yenile.user.js
// @updateURL https://update.greasyfork.org/scripts/481752/G2G%20Chat%20Sayfas%C4%B1n%C4%B1%20Yenile.meta.js
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