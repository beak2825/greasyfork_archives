// ==UserScript==
// @name         E-Mesem Toplu Seçim Özelliği Ekleme
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Sayfadaki belirli butonları kontrol eder ve yönetim butonlarını belirtilen hücreye ekler
// @author       Sancaktepe Mesleki Eğitim Merkezi
// @match        https://e-mesem.meb.gov.tr/*
// @match        https://e-mesem.meb.gov.tr/KRM/KRM07033.aspx
// @match        https://e-mesem.meb.gov.tr/KRM/KRM07026.aspx
// @match        https://e-mesem.meb.gov.tr/KRM/KRM07036.aspx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497565/E-Mesem%20Toplu%20Se%C3%A7im%20%C3%96zelli%C4%9Fi%20Ekleme.user.js
// @updateURL https://update.greasyfork.org/scripts/497565/E-Mesem%20Toplu%20Se%C3%A7im%20%C3%96zelli%C4%9Fi%20Ekleme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tanımlamalar
    const buttonTypes = [
        { buttonPrefix: 'rgBasvurular', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24e.png', headerText: 'Onay', onayTarihiHeaderText: 'Onay Tarihi', aciklamaHeaderText: 'Açıklama' },
        { buttonPrefix: 'rgSinifList', styleUnchecked: 'imgUyari.png', styleChecked: 'imgUyariSec.png', headerText: 'N. Fişi', onayTarihiHeaderText: 'Öğr.', aciklamaHeaderText: null },
        { buttonPrefix: 'rgSinifKilitList', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24r.png', headerText: 'Not Girişine Kilitle', onayTarihiHeaderText: 'Öğr.', aciklamaHeaderText: 'Not İşlemleri' },
        { buttonPrefix: 'rgOgrenciListesi', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24e.png', headerText: 'Seç' , onayTarihiHeaderText: 'No Yenile', aciklamaHeaderText: 'Açıklama' },
         // Diğer button tipleri buraya eklenebilir
    ];

    function addManagementCheckbox(targetCell, buttonPrefix, styleUnchecked, styleChecked) {
        // Yönetim checkbox'ı zaten eklenmişse, tekrar eklemeyi önle
        if (targetCell.querySelector(".management-checkbox")) {
            return;
        }

        // Yönetim checkbox'ı oluştur
        const managementCheckbox = document.createElement("input");
        managementCheckbox.type = "checkbox";
        managementCheckbox.className = "management-checkbox";
        managementCheckbox.style.marginRight = "5px";

        // Checkbox durumu değiştiğinde işlemleri gerçekleştir
        managementCheckbox.addEventListener("change", function() {
            const styleToCheck = managementCheckbox.checked ? styleChecked : styleUnchecked;
            const buttons = document.querySelectorAll("button[name^='" + buttonPrefix + "']");
            buttons.forEach(button => {
                const style = button.getAttribute('style');
                if ((managementCheckbox.checked && style && style.includes(styleUnchecked)) ||
                    (!managementCheckbox.checked && style && style.includes(styleChecked))) {
                    // Buton stilini dinamik olarak değiştir
                    button.style.backgroundImage = managementCheckbox.checked ? 'url(' + styleChecked + ')' : 'url(' + styleUnchecked + ')';
                    // Butona tıkla
                    button.click();
                }
            });
        });

        // Belirtilen hedef hücresine yönetim checkbox'ını ekle
        targetCell.appendChild(managementCheckbox);
    }

    function findHeaderContainingText(text) {
        // Belirtilen metni içeren başlık hücresini bul
        const headers = Array.from(document.querySelectorAll('th')).filter(th => th.innerText.trim() === text.trim());
        return headers.length > 0 ? headers[0] : null;
    }

    function watchForChanges() {
        // Sürekli olarak başlık hücrelerini kontrol et ve checkbox'ları ekleyin
        const intervalId = setInterval(function() {
            buttonTypes.forEach(buttonType => {
                const header = findHeaderContainingText(buttonType.headerText);
                if (header) {
                    const prevHeader = header.previousElementSibling;
                    const nextHeader = header.nextElementSibling;
                    const prevHeaderText = prevHeader.innerText.trim();
                    const nextHeaderText = nextHeader ? nextHeader.innerText.trim() : null;
                    if (prevHeaderText === buttonType.onayTarihiHeaderText && (!buttonType.aciklamaHeaderText || nextHeaderText === buttonType.aciklamaHeaderText)) {
                        addManagementCheckbox(header, buttonType.buttonPrefix, buttonType.styleUnchecked, buttonType.styleChecked);
                    }
                }
            });
        }, 1000);

        // Sayfa kapatıldığında aralığı temizle
        window.addEventListener('beforeunload', function() {
            clearInterval(intervalId);
        });
    }

    // Sayfa yüklendiğinde ve değiştiğinde checkbox'ları ekleyin
    watchForChanges();

})();
