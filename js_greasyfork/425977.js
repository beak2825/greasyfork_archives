// ==UserScript==
// @name         AtCoder Sample Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AtCoderのサンプルをダウンロードするボタンを追加
// @author       y-i
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/425977/AtCoder%20Sample%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/425977/AtCoder%20Sample%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const problemName = location.href.split('/').pop();

    const titleElem = document.querySelector('.row > div > .h2');
    if (!titleElem) return;

    const dlBtn = document.createElement('a');
    dlBtn.classList.add('btn', 'btn-default', 'btn-sm');
    dlBtn.textContent = 'Sample DL';
    titleElem.appendChild(dlBtn);

    dlBtn.addEventListener('click', async e => {
        e.preventDefault();

        const samples = Array.from(document.querySelectorAll('[id^="pre-sample"]')).map(el => el.innerText);
        const n = samples.length;

        const zip = new JSZip();

        for (let i = 0; i < n; ++i) {
            const sampleNum = (i - i % 2) / 2;
            const inOut = i % 2 ? 'out' : 'in';
            const filename = `sample-${sampleNum}.${inOut}`;

            zip.file(filename, samples[i]);
        }

        const content = await zip.generateAsync({type:"blob"});
        saveAs(content,`${problemName}.zip`);
    });
})();