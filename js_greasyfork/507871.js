// ==UserScript==
// @name         Verifikasi SSCASN V2
// @namespace    http://tampermonkey.net/
// @version      2 beta
// @description  ganjel tok
// @author       L1L15 5URY4N1
// @match        https://verifikasi-sscasn.bkn.go.id/cpns/verifikasi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507871/Verifikasi%20SSCASN%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/507871/Verifikasi%20SSCASN%20V2.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isProcessing = false;

    function clickElementByXPath(xpath) {
        let elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let clicked = false;
        for (let i = 0; i < elements.snapshotLength; i++) {
            let element = elements.snapshotItem(i);
            if (element) {
                element.click();
                console.log('Clicked element with XPath: ' + xpath);
                clicked = true;
            }
        }
        return clicked;
    }

    function tryClickingElement(xpath, retries = 5, delay = 1000, callback) {
        let attempts = 0;

        function attemptClick() {
            if (clickElementByXPath(xpath)) {
                console.log('Successfully clicked element with XPath: ' + xpath);
                if (callback) callback();
            } else if (attempts < retries) {
                attempts++;
                console.log('Retrying to find element with XPath: ' + xpath);
                setTimeout(attemptClick, delay);
            } else {
                console.log('Failed to find element after ' + retries + ' attempts with XPath: ' + xpath);
                if (callback) callback();
            }
        }

        attemptClick();
    }

    function clickDocumentElements() {
        if (isProcessing) return;
        isProcessing = true;

        var elementsToClick = [
            "//*[contains(text(), 'Surat Tanda Registrasi (STR)')]",
            "//*[contains(text(), 'Surat Pernyataan 5 Poin')]",
            "//*[contains(text(), 'Surat Lamaran')]",
            "//*[contains(text(), 'Kartu Tanda Penduduk')]",
            "//*[contains(text(), 'Surat Akreditasi Perguruan Tinggi dan a...')]",
            "//*[contains(text(), 'Sertifikat Kursus atau Ketrampilan (1)')]",
            "//*[contains(text(), 'Ijazah Asli')]",
            "//*[contains(text(), 'Transkrip atau Daftar Nilai Asli')]",
            "//*[contains(text(), 'Pas Foto terbaru Pakaian Formal dengan ...')]"
        ];

        elementsToClick.forEach(function(xpath, index) {
            setTimeout(function() {
                tryClickingElement(xpath);
            }, index * 2000);
        });

        setTimeout(function() {
            tryClickingElement("//*[contains(text(), 'Tidak Valid')]");
        }, elementsToClick.length * 2000 + 1000);

        setTimeout(function() {
            tryClickingElement("//*[contains(text(), 'setuju')]", 5, 1000, function() {
                // Reset the processing flag after all clicks
                isProcessing = false;
                console.log('Processing complete, ready for new actions.');
            });
        }, elementsToClick.length * 2000 + 3000);
    }

    function addManualTriggerButton() {
        const button = document.createElement('button');
        button.innerText = 'Buka Dokumen';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.right = '0';
        button.style.transform = 'translateY(-50%)';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '0';
        button.style.padding = '10px 20px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.fontSize = '16px';

        button.addEventListener('click', clickDocumentElements);

        document.body.appendChild(button);
    }

    window.addEventListener('load', function() {
        setTimeout(function() {
            addManualTriggerButton();
        }, 2000);
    });
})();
