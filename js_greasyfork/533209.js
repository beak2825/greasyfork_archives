// ==UserScript==
// @name         Button to download PDF from iframe's pdfpath parameter
// @name:zh-CN   从iframe的pdfpath参数下载PDF的按钮
// @name:zh-TW   從iframe的pdfpath參數下載PDF的按鈕
// @name:ja      iframeのpdfpathパラメータからPDFをダウンロードするボタン
// @name:ko      iframe의 pdfpath 매개변수에서 PDF를 다운로드하는 버튼
// @name:ru      Кнопка для загрузки PDF из параметра pdfpath фрейма
// @name:es      Botón para descargar PDF desde el parámetro pdfpath del iframe
// @name:fr      Bouton pour télécharger le PDF à partir du paramètre pdfpath de l'iframe
// @name:de      Schaltfläche zum Herunterladen der PDF aus dem pdfpath-Parameter des iframes
// @name:it      Pulsante per scaricare PDF dal parametro pdfpath dell'iframe
// @name:pt      Botão para baixar PDF do parâmetro pdfpath do iframe
// @name:ar      زر لتنزيل ملف PDF من معلمة pdfpath الخاصة بـ iframe
// @name:hi      iframe के pdfpath पैरामीटर से PDF डाउनलोड करने का बटन
// @name:tr      iframe'in pdfpath parametresinden PDF indirme düğmesi
// @name:vi      Nút tải PDF từ tham số pdfpath của iframe
// @name:th      ปุ่มดาวน์โหลด PDF จากพารามิเตอร์ pdfpath ของ iframe
// @name:pl      Przycisk do pobierania PDF z parametru pdfpath w iframe
// @name:nl      Knop om PDF te downloaden van de pdfpath-parameter van iframe
// @name:sv      Knapp för att ladda ner PDF från iframens pdfpath-parameter
// @name:da      Knap til at downloade PDF fra iframens pdfpath-parameter
// @name:fi      Painike PDF:n lataamiseen iframen pdfpath-parametrista
// @name:no      Knapp for å laste ned PDF fra iframens pdfpath-parameter
// @name:el      Κουμπί για λήψη PDF από την παράμετρο pdfpath του iframe
// @name:he      כפתור להורדת PDF מפרמטר pdfpath של iframe
// @name:cs      Tlačítko pro stažení PDF z parametru pdfpath iframe
// @name:hu      Gomb az iframe pdfpath paraméteréből történő PDF letöltéséhez
// @name:ro      Buton pentru descărcarea PDF-ului din parametrul pdfpath al iframe-ului
// @name:id      Tombol untuk mengunduh PDF dari parameter pdfpath iframe
// @name:ms      Butang untuk memuat turun PDF daripada parameter pdfpath iframe
// @name:uk      Кнопка для завантаження PDF з параметра pdfpath фрейму
// @name:bg      Бутон за изтегляне на PDF от параметъра pdfpath на iframe
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a button to download PDF from iframe's pdfpath parameter
// @description:zh-CN  添加一个按钮，用于从iframe的pdfpath参数下载PDF
// @description:zh-TW  添加一個按鈕，用於從iframe的pdfpath參數下載PDF
// @description:ja     iframeのpdfpathパラメータからPDFをダウンロードするボタンを追加
// @description:ko     iframe의 pdfpath 매개변수에서 PDF를 다운로드하는 버튼을 추가
// @description:ru     Добавляет кнопку для загрузки PDF из параметра pdfpath фрейма
// @description:es     Agrega un botón para descargar PDF desde el parámetro pdfpath del iframe
// @description:fr     Ajoute un bouton pour télécharger le PDF à partir du paramètre pdfpath de l'iframe
// @description:de     Fügt eine Schaltfläche hinzu, um die PDF aus dem pdfpath-Parameter des iframes herunterzuladen
// @description:it     Aggiunge un pulsante per scaricare il PDF dal parametro pdfpath dell'iframe
// @description:pt     Adiciona um botão para baixar o PDF do parâmetro pdfpath do iframe
// @description:ar     يضيف زرًا لتنزيل ملف PDF من معلمة pdfpath الخاصة بـ iframe
// @description:hi     iframe के pdfpath पैरामीटर से PDF डाउनलोड करने के लिए एक बटन जोड़ता है
// @description:tr     iframe'in pdfpath parametresinden PDF indirmek için bir düğme ekler
// @description:vi     Thêm nút để tải PDF từ tham số pdfpath của iframe
// @description:th     เพิ่มปุ่มเพื่อดาวน์โหลด PDF จากพารามิเตอร์ pdfpath ของ iframe
// @description:pl     Dodaje przycisk do pobierania PDF z parametru pdfpath w iframe
// @description:nl     Voegt een knop toe om een PDF te downloaden van de pdfpath-parameter van iframe
// @description:sv     Lägger till en knapp för att ladda ner PDF från iframens pdfpath-parameter
// @description:da     Tilføjer en knap til at downloade PDF fra iframens pdfpath-parameter
// @description:fi     Lisää painikkeen PDF:n lataamiseen iframen pdfpath-parametrista
// @description:no     Legger til en knapp for å laste ned PDF fra iframens pdfpath-parameter
// @description:el     Προσθέτει ένα κουμπί για λήψη PDF από την παράμετρο pdfpath του iframe
// @description:he     מוסיף כפתור להורדת PDF מפרמטר pdfpath של iframe
// @description:cs     Přidává tlačítko pro stažení PDF z parametru pdfpath iframe
// @description:hu     Hozzáad egy gombot az iframe pdfpath paraméteréből történő PDF letöltéséhez
// @description:ro     Adaugă un buton pentru descărcarea PDF-ului din parametrul pdfpath al iframe-ului
// @description:id     Menambahkan tombol untuk mengunduh PDF dari parameter pdfpath iframe
// @description:ms     Menambah butang untuk memuat turun PDF daripada parameter pdfpath iframe
// @description:uk     Додає кнопку для завантаження PDF з параметра pdfpath фрейму
// @description:bg     Добавя бутон за изтегляне на PDF от параметъра pdfpath на iframe
// @namespace    http://tampermonkey.net/
// @author       aspen138
// @match        https://wk.askci.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533209/Button%20to%20download%20PDF%20from%20iframe%27s%20pdfpath%20parameter.user.js
// @updateURL https://update.greasyfork.org/scripts/533209/Button%20to%20download%20PDF%20from%20iframe%27s%20pdfpath%20parameter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button element
    const button = document.createElement('button');
    button.textContent = 'Download PDF';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Append button to the page
    document.body.appendChild(button);

    // Add click event listener to the button
    button.addEventListener('click', () => {
        // Find the iframe
        const iframe = document.querySelector('iframe');
        if (!iframe) {
            alert('No iframe found on the page.');
            return;
        }

        // Get iframe src
        const src = iframe.src;
        if (!src) {
            alert('Iframe src is empty.');
            return;
        }

        // Extract query parameters
        const queryString = src.substring(src.indexOf('?') + 1);
        if (!queryString) {
            alert('No query parameters found in iframe src.');
            return;
        }

        // Parse query parameters
        const urlParams = new URLSearchParams(queryString);
        const downloadUrl = urlParams.get('pdfpath');

        if (!downloadUrl) {
            alert('No pdfpath parameter found in iframe src.');
            return;
        }

        // Open the download URL in a new tab
        window.open(downloadUrl, '_blank');
    });
})();