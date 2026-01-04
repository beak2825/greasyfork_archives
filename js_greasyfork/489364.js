// ==UserScript==
// @name         kichhoat24h Earn Sayfa Yenile
// @namespace    https://kichhoat24h.com/earn
// @version      v0.2
// @description  EkşiSözlük sayfasını otomatik yeniler.
// @author       BoomBookTR
// @homepage     https://greasyfork.org/tr/scripts/489364
// @supportURL   https://greasyfork.org/tr/scripts/489364/feedback
// @match        https://kichhoat24h.com/earn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      GPL-2.0-only

// @downloadURL https://update.greasyfork.org/scripts/489364/kichhoat24h%20Earn%20Sayfa%20Yenile.user.js
// @updateURL https://update.greasyfork.org/scripts/489364/kichhoat24h%20Earn%20Sayfa%20Yenile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        // 10 dakikada bir sayfayı yenile
        setInterval(function() {
            window.location.reload(true);
        }, 300000); // 600000 milisaniye = 10 dakika 1000 ms = 1 sn
    })
})();