// ==UserScript==
// @name         Pobieranie listu przewozowego z SA i zapis na Google Drive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pobiera list przewozowy w formie PDF z SellAsist i zapisuje go na Google Drive
// @author       David
// @license      Proprietary
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/530351/Pobieranie%20listu%20przewozowego%20z%20SA%20i%20zapis%20na%20Google%20Drive.user.js
// @updateURL https://update.greasyfork.org/scripts/530351/Pobieranie%20listu%20przewozowego%20z%20SA%20i%20zapis%20na%20Google%20Drive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GOOGLE_DRIVE_FOLDER_ID = "1BGZKyGTicIsKomwCYAgKK0A4wjP6MQW8";  // <-- Wstaw ID folderu z Google Drive
    const ACCESS_TOKEN = "ya29.a0AeXRPp4Hlg8AttMIOhJjq72mnZpE2E0HV4CYP7c3N7IxOKjncPBGYKVMBBCmSJnAcUcC20EAzbNbC7jrG7XmXO0IBlWUBL3Q9ozRNM-ZWEgf-QxmHGSSs7PBoz8Dpy1cx_Mz1Q1Qb3z8F7unidwhCgDNpe6FmyW8NAbMpfvRaCgYKAcISARMSFQHGX2MigwrfHUKRelekxmch3bVipA0175"; // <-- Wklej wygenerowany token

    function getWaybillLinkAndNumber() {
        let waybillLink = null;
        let waybillNumber = null;
        let waybillAnchor = document.querySelector("a[href*='shipments_manager/download'][href*='pdf']");
        if (waybillAnchor) {
            waybillLink = waybillAnchor.href;
            let match = waybillLink.match(/filename%3D([A-Za-z0-9]+)%2521pdf/);
            if (match) {
                waybillNumber = match[1];
            }
        }
        if (!waybillLink) {
            let waybillButton = [...document.querySelectorAll("span.c-btn__text")].find(el => el.textContent.includes("Pobierz list przewozowy"));
            if (waybillButton) {
                let parentAnchor = waybillButton.closest("a");
                if (parentAnchor) {
                    waybillLink = parentAnchor.href;
                }
            }
        }
        if (!waybillNumber) {
            let numberTd = [...document.querySelectorAll("tr[data-id] td:nth-child(2)")]
                .find(td => td.textContent.trim().match(/^[A-Za-z0-9]+$/));
            if (numberTd) {
                waybillNumber = numberTd.textContent.trim();
            }
        }
        return { waybillLink, waybillNumber };
    }
    function downloadAndUploadWaybill() {
        let { waybillLink, waybillNumber } = getWaybillLinkAndNumber();
        if (!waybillLink || !waybillNumber) {
            alert("❌ Nie znaleziono linku do listu przewozowego lub numeru listu.");
            return;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: waybillLink,
            responseType: "blob",
            onload: function(response) {
                if (response.status === 200) {
                    let pdfBlob = new Blob([response.response], { type: "application/pdf" });
                    let filename = `${waybillNumber}.pdf`; // Użycie numeru listu jako nazwy pliku
                    uploadToGoogleDrive(pdfBlob, filename);
                } else {
                    alert("❌ Błąd podczas pobierania listu przewozowego.");
                }
            },
            onerror: function() {
                alert("❌ Błąd podczas komunikacji z SellAsist.");
            }
        });
    }
    function uploadToGoogleDrive(fileBlob, filename) {
        let metadata = {
            name: filename,
            mimeType: "application/pdf",
            parents: [GOOGLE_DRIVE_FOLDER_ID]
        };
        let formData = new FormData();
        formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        formData.append("file", fileBlob);

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            },
            data: formData,
            onload: function(response) {
                let jsonResponse = JSON.parse(response.responseText);
                if (jsonResponse.id) {
                    alert(`✅ Plik "${filename}" został przesłany na Google Drive!`);
                } else {
                    alert("❌ Błąd podczas wysyłania pliku.");
                }
            },
            onerror: function() {
                alert("❌ Błąd komunikacji z Google Drive.");
            }
        });
    }
    function addUploadButton() {
        let btn = document.createElement("button");
        btn.innerText = "📦 Pobierz i prześlij list przewozowy";
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = "1000";
        btn.style.padding = "10px";
        btn.style.background = "#007bff";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.onclick = downloadAndUploadWaybill;
        document.body.appendChild(btn);
    }
    addUploadButton();
})();