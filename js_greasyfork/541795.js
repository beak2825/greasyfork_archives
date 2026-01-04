// ==UserScript==
// @name         exportInvoicesErir
// @namespace    http://tampermonkey.net/
// @version      2025-07-06
// @description  none
// @author       Michael Plekhanov
// @match        https://erir.grfc.ru/reports/invoices
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grfc.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541795/exportInvoicesErir.user.js
// @updateURL https://update.greasyfork.org/scripts/541795/exportInvoicesErir.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getToken() {
        const storeString = window.localStorage.getItem('mf-app-store');
        if (storeString === null) {
            alert('Ошибка');
        }
        const store = JSON.parse(storeString);
        const token = store.state.tokens.accessToken;
        return token;
    }

    function getFilters() {
        const storeString = window.localStorage.getItem('reports-store');
        if (storeString === null) {
            alert('Ошибка');
        }
        const store = JSON.parse(storeString);
        const filters = store.state.reportsData.acts.filters;
        return filters;
    }

    function saveFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'file-name';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async function exportInvoices(e) {
        e.stopPropagation();
        const token = getToken();
        const filters = getFilters();
        const response = await fetch(
            'https://erir.code.kiortir.ru/export/invoices',
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                method: 'POST',
                body: JSON.stringify(filters),
            }
        );

        if (!response.ok) {
            alert('Произошла ошибка при скачивании файла. Попробуйте ещё');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        saveFile(blobUrl, 'export.xlsx');

        URL.revokeObjectURL(blobUrl);
    }

    async function rigDownloadButton() {
        const xpath = "//button[contains(text(),'Скачать')]";
        let button = null;
        while (button === null) {
            button = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
        let node = button;
        const parent = node.parentElement;
        if (parent === null) {
            return;
        }
        parent.onclick = exportInvoices;
    }

    rigDownloadButton();
})();
