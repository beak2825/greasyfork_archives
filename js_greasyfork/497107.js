// ==UserScript==
// @name         E-Mesem Toplu Seçim ve Karne Oluşturma
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  E-Mesem Toplu Seçim özellikleri, tüm karneleri oluşturma ve "G" ile doldurma butonu ekler
// @author       Fatih D.
// @match        https://e-mesem.meb.gov.tr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497107/E-Mesem%20Toplu%20Se%C3%A7im%20ve%20Karne%20Olu%C5%9Fturma.user.js
// @updateURL https://update.greasyfork.org/scripts/497107/E-Mesem%20Toplu%20Se%C3%A7im%20ve%20Karne%20Olu%C5%9Fturma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tanımlamalar
    const buttonTypes = [
        { buttonPrefix: 'rgBasvurular', buttonSuffix: '', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24e.png', headerText: 'Onay', onayTarihiHeaderText: 'Onay Tarihi', aciklamaHeaderText: 'Açıklama' },
        { buttonPrefix: 'rgSinifList', buttonSuffix: '', styleUnchecked: 'imgUyari.png', styleChecked: 'imgUyariSec.png', headerText: 'N. Fişi', onayTarihiHeaderText: 'Öğr.', aciklamaHeaderText: null },
        { buttonPrefix: 'rgSinifKilitList', buttonSuffix: '', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24r.png', headerText: 'Not Girişine Kilitle', onayTarihiHeaderText: 'Öğr.', aciklamaHeaderText: 'Not İşlemleri' },
        { buttonPrefix: 'rgOgrenciNotKilit', buttonSuffix: '', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24r.png', headerText: 'Not Girişine Kilitle', onayTarihiHeaderText: 'Dal Adı', aciklamaHeaderText: 'Durum' },
        { buttonPrefix: 'rgOgrenciListesi', buttonSuffix: '', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24e.png', headerText: 'Seç' , onayTarihiHeaderText: 'No Yenile', aciklamaHeaderText: 'Açıklama' },
        { buttonPrefix: 'rgSinifOgrenciler', buttonSuffix: '', styleUnchecked: 'imgCheck16n.png', styleChecked: 'imgCheck16e.png', headerText: 'Seç' , onayTarihiHeaderText: 'Dal Adı', aciklamaHeaderText: null },
        { buttonPrefix: 'rgOgrenci', buttonSuffix: '', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24e.png', headerText: 'Sınava Girecek' , onayTarihiHeaderText: 'Sıra No', aciklamaHeaderText: 'Id' },
        { buttonPrefix: 'rgOgrenciListesi', buttonSuffix: 'btnOnayGetirmedi', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24r.png', headerText: 'Getirmedi' , onayTarihiHeaderText: 'Getirdi', aciklamaHeaderText: 'Durum' },
        { buttonPrefix: 'rgOgrenciListesi', buttonSuffix: 'btnOnayGetirdi', styleUnchecked: 'imgCheck24n.png', styleChecked: 'imgCheck24e.png', headerText: 'Getirdi' , onayTarihiHeaderText: 'Ayrılış', aciklamaHeaderText: 'Getirmedi' },
    ];

    function addManagementCheckbox(targetCell, buttonPrefix, styleUnchecked, styleChecked, buttonSuffix = '') {
        if (targetCell.querySelector(".management-checkbox")) {
            return;
        }

        const managementCheckbox = document.createElement("input");
        managementCheckbox.type = "checkbox";
        managementCheckbox.className = "management-checkbox";
        managementCheckbox.style.marginRight = "5px";

        managementCheckbox.addEventListener("change", function() {
            const styleToCheck = managementCheckbox.checked ? styleChecked : styleUnchecked;
            const buttons = document.querySelectorAll("button[name^='" + buttonPrefix + "']");
            buttons.forEach(button => {
                const btnName = button.getAttribute("name") || "";
                const style = button.getAttribute("style");

                // Suffix kontrolü (tanımlandıysa)
                const suffixOk = buttonSuffix === '' || btnName.endsWith(buttonSuffix);

                if (suffixOk && (
                    (managementCheckbox.checked && style && style.includes(styleUnchecked)) ||
                    (!managementCheckbox.checked && style && style.includes(styleChecked))
                )) {
                    button.style.backgroundImage = managementCheckbox.checked
                        ? 'url(' + styleChecked + ')'
                        : 'url(' + styleUnchecked + ')';
                    button.click();
                }
            });
        });

        targetCell.appendChild(managementCheckbox);
    }

    function findHeaderContainingText(text) {
        const headers = Array.from(document.querySelectorAll('th')).filter(th => th.innerText.trim() === text.trim());
        return headers.length > 0 ? headers[0] : null;
    }

    function showTemporaryPopup(message) {
        const popup = document.createElement('div');
        popup.innerText = message;
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.right = '20px';
        popup.style.backgroundColor = '#4CAF50';
        popup.style.color = 'white';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.fontSize = '14px';
        popup.style.zIndex = '1000';

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 1000); // 1 saniye sonra kaybolur
    }

    function fillEmptyTxtnotInputs() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            const id = input.id || '';
            const name = input.name || '';
            if (
                (id.includes('txtNot1') || id.includes('txtNot2') || id.includes('txtNotSozlu1') ||
                 name.includes('txtNot1') || name.includes('txtNot2') || name.includes('txtNotSozlu1')) &&
                input.value.trim() === ''
            ) {
                input.value = 'G';
            }
        });
        showTemporaryPopup('Boş alanlar "G" ile dolduruldu.');
    }

    function addFillGButton() {
        var targetText = 'Öğrenci Not Kilitleme İşlemleri';
        var targetElement = Array.from(document.querySelectorAll('span'))
            .find(span => span.textContent.trim() === targetText);

        if (!targetElement || document.getElementById('fillGButton')) return;

        const fillGButton = document.createElement('button');
        fillGButton.id = 'fillGButton';
        fillGButton.innerText = 'G ile Doldur';
        fillGButton.style.marginLeft = '10px';
        fillGButton.style.padding = '5px 10px';
        fillGButton.style.backgroundColor = '#4CAF50';
        fillGButton.style.color = 'white';
        fillGButton.style.border = 'none';
        fillGButton.style.borderRadius = '4px';
        fillGButton.style.cursor = 'pointer';
        fillGButton.style.zIndex = '1000';

        fillGButton.addEventListener('click', fillEmptyTxtnotInputs);

        const inputElement = document.getElementById('rgOgrenci_ctl00_ctl02_ctl01_FilterTextBox_coldbDalAdi');

        if (inputElement) {
            const parentTd = inputElement.closest('td');
            const nextTd = parentTd ? parentTd.nextElementSibling : null;
            const nextNextTd = nextTd ? nextTd.nextElementSibling : null;
            const nextNextNextTd = nextNextTd ? nextNextTd.nextElementSibling : null;
            const nextNextNextNextTd = nextNextNextTd ? nextNextNextTd.nextElementSibling : null;

            if (nextTd && nextNextTd && nextNextNextTd && nextNextNextNextTd) {
                nextTd.colSpan = 4;
                nextNextTd.style.display = 'none';
                nextNextNextTd.style.display = 'none';
                nextNextNextNextTd.style.display = 'none';
                nextTd.appendChild(fillGButton);
                console.log('G butonu ve td’ler birleştirildi.');
            } else {
                console.log('Gerekli td’ler bulunamadı.');
            }
        } else {
            console.log('Input elementi bulunamadı.');
        }
    }

    function watchForChanges() {
        const intervalId = setInterval(function() {
            buttonTypes.forEach(buttonType => {
                const header = findHeaderContainingText(buttonType.headerText);
                if (header) {
                    const prevHeader = header.previousElementSibling;
                    const nextHeader = header.nextElementSibling;
                    const prevHeaderText = prevHeader.innerText.trim();
                    const nextHeaderText = nextHeader ? nextHeader.innerText.trim() : null;
                    if (prevHeaderText === buttonType.onayTarihiHeaderText && (!buttonType.aciklamaHeaderText || nextHeaderText === buttonType.aciklamaHeaderText)) {
                        addManagementCheckbox(header, buttonType.buttonPrefix, buttonType.styleUnchecked, buttonType.styleChecked, buttonType.buttonSuffix || '');
                    }
                }
            });
        }, 1000);

        window.addEventListener('beforeunload', function() {
            clearInterval(intervalId);
        });
    }

    watchForChanges();

    // Karneleri Oluşturma Fonksiyonu Tanımlamaları
    var startRowIndex = 0;
    var endRowIndex = 200;
    var failedRows = [];
    var isProcessing = false;
    var isObserverActive = true;

    function addKarneButton() {
        var existingButton = document.getElementById('btnKarneOlustur');

        if (existingButton && !document.getElementById('btnTumKarneleriOlustur') && !isProcessing) {
            var newButton = document.createElement('button');
            newButton.innerHTML = 'Tüm Karneleri Oluştur';
            newButton.style.marginLeft = '10px';
            newButton.id = 'btnTumKarneleriOlustur';

            newButton.onclick = function() {
                alert('Tüm Karneler oluşturuluyor...');
                isProcessing = true;
                processRows(startRowIndex);
            };

            existingButton.parentNode.insertBefore(newButton, existingButton.nextSibling);
            console.log('Tüm Karneleri Oluştur butonu eklendi.');
        }
    }

    function processRows(index) {
        console.log('processRows fonksiyonu çalıştı. Şu anki index: ' + index + ', isProcessing: ' + isProcessing);

        if (!isProcessing) {
            console.log('İşlem tamamlandı. Döngü durduruluyor.');
            isObserverActive = false;
            return;
        }

        var currentRowId = 'rgSinifList_ctl00__' + index;
        var currentRow = document.getElementById(currentRowId);

        if (currentRow) {
            currentRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            currentRow.click();
            console.log('Satır ' + currentRowId + ' tıklandı ve görünürlüğü ayarlandı.');
            waitForKarneOlusturButton(index);
        } else {
            console.log('Satır ' + currentRowId + ' bulunamadı. İşlem tamamlandı.');
            isProcessing = false;
            isObserverActive = false;
        }
    }

    function waitForKarneOlusturButton(rowIndex) {
        var checkInterval = setInterval(function() {
            var karneOlusturButton = document.getElementById('btnKarneOlustur');
            if (karneOlusturButton && !karneOlusturButton.disabled) {
                clearInterval(checkInterval);
                karneOlusturButton.click();
                console.log('Karne Oluştur butonuna tıklandı.');
                waitForPopupClose(rowIndex);
            }
        }, 1000);

        setTimeout(function() {
            console.log('Satır ' + 'rgSinifList_ctl00__' + rowIndex + ' işlemi tamamlanamadı. İşlem tamamlandı popupı gösterilecek.');
            clearInterval(checkInterval);
            failedRows.push('rgSinifList_ctl00__' + rowIndex);
            showFinishMessage();
        }, 30000);
    }

    function waitForPopupClose(rowIndex) {
        var popupCheckInterval = setInterval(function() {
            var popup = document.getElementById('wucPageAlert1_NotificationOk_popup');
            if (popup && popup.style.display !== 'none') {
                clearInterval(popupCheckInterval);
                var closeIcon = document.getElementById('wucPageAlert1_NotificationOk_rnCloseIcon');
                if (closeIcon) {
                    closeIcon.click();
                    console.log('Pop-up kapatıldı.');
                    startRowIndex++;
                    if (startRowIndex <= endRowIndex) {
                        setTimeout(function() {
                            processRows(startRowIndex);
                        }, 2000);
                    } else {
                        isProcessing = false;
                        showFinishMessage();
                    }
                }
            }
        }, 100);
    }

    function showFinishMessage() {
        var finishMessage = document.createElement('div');
        finishMessage.innerHTML = 'Tüm satırlar işlendi. İşlem tamamlandı.';
        finishMessage.style.position = 'fixed';
        finishMessage.style.top = '10px';
        finishMessage.style.right = '10px';
        finishMessage.style.backgroundColor = 'lightgreen';
        finishMessage.style.padding = '10px';
        finishMessage.style.border = '2px solid green';
        finishMessage.style.zIndex = '9999';
        document.body.appendChild(finishMessage);
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (isObserverActive) {
                addKarneButton();
                addFillGButton();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', function() {
        addKarneButton();
        addFillGButton();
    });

/* =========================
   GÜVENLİ TOPLU SİLME (Dinamik tarama ile)
   ========================= */

/* =========================
   GÜVENLİ TOPLU SİLME (Dinamik tarama ile, tekrar silmeyi önler)
   ========================= */

async function deleteAllRowsSequentially() {
    let retryCount = 0;
    const maxRetriesAfterEmpty = 20;

    const deletedRows = new Set(); // silinen satırların benzersiz bilgilerini saklamak için

    while(true){
        // Her seferinde güncel butonları al
        const buttons = Array.from(document.querySelectorAll("input[type='image'][src*='imgKursCancel']"))
                              .filter(b => b.offsetParent); // sadece görünür butonlar

        // Silinmiş satırları filtrele
        const filteredButtons = buttons.filter(btn => {
            const row = btn.closest('tr');
            if(!row) return false;
            // satırın benzersiz bilgisi: örnek olarak tüm hücrelerin text'i
            const rowId = Array.from(row.cells).map(c => c.textContent.trim()).join('|');
            if(deletedRows.has(rowId)) return false; // zaten silinmiş, atla
            return true;
        });

        if(filteredButtons.length === 0){
            retryCount++;
            if(retryCount > maxRetriesAfterEmpty){
                console.log("Tüm satırlar silindi ve 20 kere tarandı, işlem tamam.");
                alert("Tüm satırlar silindi ✅");
                break;
            } else {
                console.log(`Satır bulunamadı, tarama devam ediyor... (${retryCount}/${maxRetriesAfterEmpty})`);
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
        }

        retryCount = 0;

        const btn = filteredButtons[0];
        const row = btn.closest('tr');
        if(row){
            // satır bilgilerini kaydet
            const rowId = Array.from(row.cells).map(c => c.textContent.trim()).join('|');
            deletedRows.add(rowId);
        }

        btn.click();
        console.log(`Satır tıklandı, 1000ms bekleniyor...`);
        await new Promise(r => setTimeout(r, 1000));

        const okBtn = await waitFor(() => {
            const cands = Array.from(document.querySelectorAll(".rwOkBtn"));
            return cands.find(b => b.offsetParent !== null) || null;
        }, 10000);

        if(okBtn){
            okBtn.click();
            console.log("OK butonuna basıldı, 1500ms bekleniyor...");
            await new Promise(r => setTimeout(r, 1500));
        } else {
            console.log("OK butonu bulunamadı, devam ediliyor.");
        }
    }
}


// Dinamik olarak OK butonunu bekleyen fonksiyon
function waitFor(fn, timeout = 10000) {
    return new Promise((resolve) => {
        const start = Date.now();
        const interval = setInterval(() => {
            const result = fn();
            if(result){
                clearInterval(interval);
                resolve(result);
            } else if(Date.now() - start > timeout){
                clearInterval(interval);
                resolve(null);
            }
        }, 100);
    });
}

// Header hücresine “Tümünü Sil” butonu ekleme
function attachSafeBulkDeleteButton(headerCell) {
    if(!headerCell || headerCell.querySelector('.bulk-delete-btn')) return;

    const btn = document.createElement('button');
    btn.textContent = 'Tümünü Sil';
    btn.className = 'bulk-delete-btn';
    btn.style.marginLeft = '10px';
    btn.style.backgroundColor = '#e74c3c';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '3px 6px';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '4px';
    btn.style.position = 'absolute';
btn.style.top = '5px';
btn.style.right = '5px';
btn.style.zIndex = '9999';
btn.style.margin = '0';


    btn.addEventListener('click', deleteAllRowsSequentially);

    headerCell.appendChild(btn);
}

// Sayfadaki tüm tabloları tarayıp “Sil” başlıklarını bul ve butonu ekle
function scanAllDocumentsForSafeBulkDelete() {
    const docs = [document];
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(ifr => {
        try { if(ifr.contentDocument) docs.push(ifr.contentDocument); } catch(e) {}
    });

    docs.forEach(doc => {
        const headers = Array.from(doc.querySelectorAll('th, td'));
        headers.forEach(cell => {
            const text = (cell.textContent || '').replace(/\u00A0/g, ' ').trim();
            if((/(\b|^)Sil(\b|$)/i).test(text)){
                attachSafeBulkDeleteButton(cell);
            }
        });
    });
}

// Başlangıç taraması
scanAllDocumentsForSafeBulkDelete();

// Dinamik yüklemeler için gözlemci
let bulkScanTimer = null;
const observerSafeBulkDelete = new MutationObserver(() => {
    if(bulkScanTimer) clearTimeout(bulkScanTimer);
    bulkScanTimer = setTimeout(scanAllDocumentsForSafeBulkDelete, 150);
});
observerSafeBulkDelete.observe(document.body, { childList: true, subtree: true });





})();
