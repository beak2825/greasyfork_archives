// ==UserScript==
// @name         Sekme Başlığında Kelime Kontrolü ve Yönlendirme
// @version      0.1
// @description  Sekme başlığını kontrol eder ve belirli kelimeleri içeriyorsa www.google.com.tr'ye yönlendirir.
// @author       BoomBookTR
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/7610
// @downloadURL https://update.greasyfork.org/scripts/490289/Sekme%20Ba%C5%9Fl%C4%B1%C4%9F%C4%B1nda%20Kelime%20Kontrol%C3%BC%20ve%20Y%C3%B6nlendirme.user.js
// @updateURL https://update.greasyfork.org/scripts/490289/Sekme%20Ba%C5%9Fl%C4%B1%C4%9F%C4%B1nda%20Kelime%20Kontrol%C3%BC%20ve%20Y%C3%B6nlendirme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sekme başlığını al
    var pageTitle = document.title.toLowerCase();

    // Belirli kelimelerin regex paterni
    var regexPattern = /seyran|ferit|afra|yalı|çapkını|yalı çapkını|afra saraçoğlu|saraçoğlu|afrasaracoglu|seyranferit|ferit&seyran/;

    // Regex ile kontrol et
    if (regexPattern.test(pageTitle)) {
        // Yönlendirme yap
        window.location.href = "https://www.google.com.tr";
    }
})();