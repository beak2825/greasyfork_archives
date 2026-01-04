// ==UserScript==
// @name         Auto Click Verifikasi SSCASN
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  -
// @author       L1L15 5URY4N1
// @match        https://verifikasi-sscasn.bkn.go.id/cpns/verifikasi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506911/Auto%20Click%20Verifikasi%20SSCASN.user.js
// @updateURL https://update.greasyfork.org/scripts/506911/Auto%20Click%20Verifikasi%20SSCASN.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    function tryClickingElement(xpath, retries = 5, delay = 1000) {
        let attempts = 0;

        function attemptClick() {
            if (clickElementByXPath(xpath)) {
                console.log('Successfully clicked elements with XPath: ' + xpath);
            } else if (attempts < retries) {
                attempts++;
                console.log('Retrying to find elements with XPath: ' + xpath);
                setTimeout(attemptClick, delay);
            } else {
                console.log('Failed to find elements after ' + retries + ' attempts with XPath: ' + xpath);
            }
        }

        attemptClick();
    }

    function clickDocumentElements() {
        var elementsToClick = [
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
            tryClickingElement("//*[contains(text(), 'setuju')]");
        }, elementsToClick.length * 2000 + 3000);
    }

    window.addEventListener('load', function() {
        setTimeout(clickDocumentElements, 2000);
    });

})();
