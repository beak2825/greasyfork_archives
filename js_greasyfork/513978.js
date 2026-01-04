// ==UserScript==
// @name         Sigorta Çıkış Hesapla
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Sigorta hesaplamaları için butona tıklama işlemi
// @author       Fatih Duran
// @match   *://*/*
// @include *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @license GPLv3
// @connect  *
// @connect  *://*/*
// @grant   GM_openInTab
// @grant   GM_registerMenuCommand
// @grant   GM_setValue
// @grant   GM_getValue
// @grant   GM_deleteValue
// @grant   GM_xmlhttpRequest
// @grant   GM_download
// @downloadURL https://update.greasyfork.org/scripts/513978/Sigorta%20%C3%87%C4%B1k%C4%B1%C5%9F%20Hesapla.user.js
// @updateURL https://update.greasyfork.org/scripts/513978/Sigorta%20%C3%87%C4%B1k%C4%B1%C5%9F%20Hesapla.meta.js
// ==/UserScript==

console.log("Betik başlatıldı - Sayfa yüklenmesi bekleniyor.");

// MutationObserver tanımlıyoruz
const observer = new MutationObserver((mutations) => {
    let button = document.getElementById("ileri");
    if (button) {
        console.log("İleri butonu bulundu ve mouseover eklendi.");
        button.addEventListener("mouseover", degerleri_hesapla, false);
        observer.disconnect(); // Buton bulunduğunda gözlemlemeyi durduruyoruz
    }
});

// Sayfa yüklendikten sonra gözlemlemeyi başlatıyoruz
observer.observe(document.body, { childList: true, subtree: true });

function degerleri_hesapla() {
    console.log("degerleri_hesapla fonksiyonu çalışıyor.");

    // Burada gerekli tüm elemanları alıyoruz
    var isegirisgun1 = document.getElementById("isegirisgun1").value;
    var gun1 = document.getElementById("gun1");
    var heu1 = document.getElementById("heu1");
    var istencikgun2 = document.getElementById("istencikgun2").value;
    var gun2 = document.getElementById("gun2");
    var heu2 = document.getElementById("heu2");
    var isegirisay1 = document.getElementById("isegirisay1");
    var aylik_prim_tutari1 = 10001.4;
    var aylik_prim_tutari2 = 10001.4;
    var isegirisgun2 = document.getElementById("isegirisgun2").value;

    // İşlemler
    if(Number(isegirisgun1) > 0) {
        gun1.value = 31 - isegirisgun1;
        heu1.value = (aylik_prim_tutari1 / 30 * gun1.value).toFixed(2);
        isegirisay1.value = document.getElementById("tx_TekIsGirTarAA").value - 1;
    } else if (isegirisgun2 > 0) {
        gun1.value = 0;
        heu1.value = 0;
    } else {
        gun1.value = 30;
        heu1.value = aylik_prim_tutari1;
        isegirisgun2 = 0;
    }
    gun2.value = istencikgun2 - isegirisgun2;

    // Konsola sonuçları yazıyoruz
    console.log("isegirisgun2:", isegirisgun2);
    console.log("istencikgun2:", istencikgun2);

    if (Number(isegirisgun2) > 0) {
        gun2.value = Number(gun2.value) + 1;
    }

    heu2.value = (aylik_prim_tutari2 / 30 * gun2.value).toFixed(2);
    document.getElementById("cbMeslek").value = "9901.03";
    document.getElementById("cbMeslek").text = "İşletmede Beceri Eğitimi Öğrencisi -- 9901.03";
    document.getElementById("belgetur1").value = 7;
    document.getElementById("belgetur2").value = 7;
    document.getElementById("txtnedenKodu").value = 22;
    document.getElementById("eksikgunsayisi").value = 0;
    document.getElementById("eksikgunsayisi2").value = 0;

    console.log("degerleri_hesapla fonksiyonu işlemleri tamamladı.");
}
