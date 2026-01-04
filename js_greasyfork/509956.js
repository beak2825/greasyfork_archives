// ==UserScript==
// @name         Pinterest board downloader
// @namespace    http://tampermonkey.net/
// @version      2024-09-24-2
// @description  Download pinterest board as zip
// @license      GPL-3.0-only
// @copyright    GPL-3.0-only
// @author       b1ek <me@blek.codes>
// @match        https://pinterest.com/**
// @match        https://*.pinterest.com/**
// @icon         https://pinterest.com/favicon.ico
// @grant        none
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/509956/Pinterest%20board%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/509956/Pinterest%20board%20downloader.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    const $$ = v => Array.from(document.querySelectorAll(v));
    const sleep = t => new Promise(r => setTimeout(r,t));

    const saveIcon = '<svg aria-hidden="true" aria-label="Button icon" class="Uvi gUZ U9O kVc" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="m18.01 9.82-6.02 6-6-6a2 2 0 0 1 2.83-2.83l1.17 1.17V2a2 2 0 0 1 4 0v6.18l1.2-1.2A2 2 0 1 1 18 9.82M19 16a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 4 0v4h14z"></path></svg>'

    let saveBtn;

    function getBoardTitle() {
        if (!isBoard()) return false
        return $$('h1.lH1 > div:nth-child(1)')[0].innerText;
    }

    function isBoard() {
        let title = $$('h1.lH1 > div:nth-child(1)')[0];
        if (!title) return false;

        return title.attributes['data-test-id'] !== undefined;
    }

    function createOwnSaveButton(saveBtn, text, svgIcon) {
        saveBtn.className = 'C9q Shl zI7 iyn Hsu';
        saveBtn.setAttribute('data-test-id', text);
        saveBtn.innerHTML = `<a aria-label="${text}" class="nrl _74 NtY S9z fev iyn kVc Tbt L4E e8F BG7" href="#" rel="" tabindex="0"><div class="Jea jzS mQ8 zI7 iyn Hsu" style="padding-bottom: 1px;"><div class="Jea KS5 Z2K fev haa mQ8 zI7 iyn Hsu" style="height: 88px; width: 88px;">${svgIcon}</div><div class="C9q zI7 iyn Hsu" style="width: 88px;"><div class="X8m tg7 tBJ dyH iFc dR0 H2s">${text}</div></div></div></a>`;
    }

    function createOthersSaveButton(saveBtn, text) {
        saveBtn.className = 'zI7 iyn Hsu';
        saveBtn.setAttribute('data-test-id', 'board-download-btn');
        saveBtn.innerHTML = `<button class="RCK Hsu USg adn gn8 L4E kVc iyn oRi lnZ wsz" tabindex="0" type="button"><div class="RCK Hsu USg adn gn8 L4E kVc iyn S9z F10 xD4 fZz hUC a_A hNT BG7 hDj _O1 KS5 mQ8 Tbt L4E" style=""><div class="X8m tg7 tBJ dyH iFc sAJ H2s">${text}</div></div></button>`;
    }

    async function getButtons() {
        const start = Date.now();
        while (true) {
            const ownBoardButtons = $$('.Tte > div:nth-child(1) > div:nth-child(1)')[0];
            if (ownBoardButtons) return [ ownBoardButtons, 'own' ];

            const othersBoardButtons = $$('div.Jea.MMr.hs0.mQ8.zI7.iyn.Hsu')[0];
            if (othersBoardButtons) return [ othersBoardButtons, 'others' ];

            if (Date.now() - start > 5000) {
                throw new Error('Couldn\'t get buttons in 5 seconds!');
            }
            await sleep(50);
        }
    }

    function getBoardItems() {
        return $$('div.vbI:nth-child(1) img').map(x => {
            const ret = x.srcset.split(' ').find(x => x.match('i.pinimg.com/originals'));
            if (ret) return ret;
            return x.src;
        });
    }

    async function getImage(src) {
        const res = await fetch(src);
        return await res.bytes()
    }

    async function saveBoard() {
        const items = getBoardItems();

        const zip = new JSZip();
        await Promise.all(items.map(async x => {
            zip.file(x.split('/').reverse()[0], await getImage(x), { binary: true, compression: 'STORE' });
        }));

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const title = getBoardTitle();
        await saveAs(zipBlob, `${title}.zip`);
    }

    if (isBoard()) {
        const [buttons, buttonsType] = await getButtons();

        if (buttonsType == 'own') {
            saveBtn = document.createElement('div');
            createOwnSaveButton(saveBtn, 'Save', saveIcon);
            buttons.appendChild(saveBtn);
            saveBtn.onclick = saveBoard;
        }
        if (buttonsType == 'others') {
                await sleep(2000);
                const startLen = buttons.children.length;
                saveBtn = document.createElement('div');
                createOthersSaveButton(saveBtn, 'Download');
                buttons.appendChild(saveBtn);
                saveBtn.onclick = saveBoard;
        }
    }
})();