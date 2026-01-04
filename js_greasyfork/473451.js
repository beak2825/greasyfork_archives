// ==UserScript==
// @name         Shell Energy - Collect all bills
// @namespace    uk.jixun
// @version      0.1
// @description  Download all ShellEnergy bills as a single ZIP file, with all pdf files sorted by date.
// @author       Jixun
// @match        https://www.shellenergy.co.uk/myaccount/bills/viewbills
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shellenergy.co.uk
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js#sha256-rMfkFFWoB2W1/Zx+4bgHim0WC7vKRVrq6FTeZclH1Z4=
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473451/Shell%20Energy%20-%20Collect%20all%20bills.user.js
// @updateURL https://update.greasyfork.org/scripts/473451/Shell%20Energy%20-%20Collect%20all%20bills.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.customer-header-row .customer-header') || document.querySelector('.customer-header-row') || document.body;

    function loadAllBills() {
        const tables = document.querySelectorAll('.hidden.my-account-table');
        for(const table of tables) {
            table.classList.remove('hidden');
            table.classList.add('visible');
        }
    }

    function padDate(x) {
        return String(x).padStart(2, '0')
    }

    let prepareDownloadButton = document.createElement('button');
    let dlZipBtn = document.createElement('a');
    function addPrepareDownloadButton() {
        prepareDownloadButton.type = 'button';
        prepareDownloadButton.className = 'button';
        prepareDownloadButton.textContent = "Pack bills";
        prepareDownloadButton.style.cssText = `padding: 0.678rem 1rem;`;
        prepareDownloadButton.onclick = () => {
            prepareDownloadButton.disabled = true;
            prepareDownloadButton.textContent = 'Downloading...';
            setDownloadPropWithDate().then(() => {
                prepareDownloadButton.textContent = 'Pack again';
            }).catch((e) => {
                console.error(e);
                prepareDownloadButton.textContent = 'FAILED, retry download?';
            }).finally(() => {
                prepareDownloadButton.disabled = false;
            });
        };
        container.appendChild(prepareDownloadButton);
    }

    async function setDownloadPropWithDate() {
        dlZipBtn.style.cssText = `display: none`;
        if (dlZipBtn.href) {
            URL.revokeObjectURL(dlZipBtn.href);
        }

        var zip = new window.JSZip();

        const rows = document.querySelectorAll('.my-account-table > tr');
        const total = rows.length;
        let i = 0;
        for(const row of rows) {
            const [dateCell, billNumberCell, amountCell, dlLinkCell] = row.querySelectorAll('td');
            const date = new Date(dateCell.textContent.trim());
            const dateStr = `${date.getFullYear()}${padDate(date.getMonth() + 1)}${padDate(date.getDate())}`;
            prepareDownloadButton.textContent = `Downloading ${i}/${total}... (${dateStr})`;

            const dlLink = dlLinkCell.querySelector('a');
            const fileName = `${dateStr}-${billNumberCell.textContent.trim()}-${amountCell.textContent.trim()}.pdf`;
            const fileBlob = await fetch(dlLink).then(x => x.blob());
            zip.file(fileName, fileBlob);

            i++;
        }

        const zipBlob = await zip.generateAsync({type:"blob"});
        const zipURL = URL.createObjectURL(zipBlob);
        window.open(zipURL);

        dlZipBtn.className = 'button';
        dlZipBtn.textContent = dlZipBtn.download = 'ShellEnergy Bills.zip';
        dlZipBtn.href = zipURL;
        dlZipBtn.style.cssText = `margin-left: 1em`;

        container.appendChild(dlZipBtn);
    }

    // loadAllBills();
    // setDownloadPropWithDate();
    addPrepareDownloadButton();
});