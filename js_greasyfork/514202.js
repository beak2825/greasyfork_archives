// ==UserScript==
// @name         E-Okul Raporları - PDF Gösterici Seçici
// @version      1.0
// @description  Sayfa yüklendiğinde otomatik olarak "Pdf Gösterici" seçeneğini seçer.
// @author       BoomBookTR
// @match        https://reporteokul.meb.gov.tr/rapor_arayuz.aspx
// @grant        none
// @license      GPL-2.0-only
// @namespace https://greasyfork.org/users/7610
// @downloadURL https://update.greasyfork.org/scripts/514202/E-Okul%20Raporlar%C4%B1%20-%20PDF%20G%C3%B6sterici%20Se%C3%A7ici.user.js
// @updateURL https://update.greasyfork.org/scripts/514202/E-Okul%20Raporlar%C4%B1%20-%20PDF%20G%C3%B6sterici%20Se%C3%A7ici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfa tamamen yüklendiğinde çalıştır
    window.addEventListener('load', function() {
        // gosterici select elementini bul
        let selectBox = document.getElementById('gosterici');

        if (selectBox) {
            // "Pdf Gösterici" (value="2") olan seçeneği seç
            selectBox.value = '2';

            // Seçimi simüle etmek için bir 'change' olayı tetikleyin (bazı siteler seçimin tanınması için gerektirir)
            let event = new Event('change');
            selectBox.dispatchEvent(event);
        }
    });
})();
