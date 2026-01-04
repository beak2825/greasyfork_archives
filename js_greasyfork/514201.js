// ==UserScript==
// @name         Mebbis - Karekod ile Giriş
// @version      1.0
// @description  MEBBİS giriş sayfasında Karekod ile Giriş linkine otomatik tıkla
// @author       BoomBookTR
// @match        https://mebbis.meb.gov.tr/
// @grant        none
// @license      GPL-2.0-only
// @namespace https://greasyfork.org/users/7610
// @downloadURL https://update.greasyfork.org/scripts/514201/Mebbis%20-%20Karekod%20ile%20Giri%C5%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/514201/Mebbis%20-%20Karekod%20ile%20Giri%C5%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfa yüklendikten sonra Karekod ile Giriş butonuna sadece bir kez tıklanacak
    window.addEventListener('load', function() {
        var karekodLink = document.getElementById('lnkQrcode');
        if (karekodLink && !sessionStorage.getItem('qrcodeClicked')) {
            karekodLink.click();
            sessionStorage.setItem('qrcodeClicked', 'true'); // Tıklama gerçekleştiğinde kaydet
        }
    });
})();