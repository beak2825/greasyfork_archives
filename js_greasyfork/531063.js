// ==UserScript==
// @name         Bunkr Name Saver
// @namespace    https://github.com/darhanger
// @version      1.3
// @description  Сохраняет названия всех медиа в файл media.txt (фикс для новой структуры имен)
// @author       DarhangeR
// @include      *://bunkr*/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunkr.is
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531063/Bunkr%20Name%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/531063/Bunkr%20Name%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NAME_SELECTOR = '.theName';

    function getBrowserLanguage() {
        return (navigator.language || navigator.userLanguage).split('-')[0];
    }

    function logMessage(messageRu, messageEn) {
        console.log(getBrowserLanguage() === 'ru' ? messageRu : messageEn);
    }

    function collectMediaNames() {
        return Array.from(document.querySelectorAll(NAME_SELECTOR)).map(nameElement => {
            let fileName = nameElement.textContent
                .trim()
                .replace(/[\\/:*?"<>|]/g, '')
                .replace(/\s+/g, ' ');

            if (!fileName.includes('.')) {
                const parentLink = nameElement.closest('[href]');
                if (parentLink) {
                    const url = new URL(parentLink.href);
                    const extension = url.pathname.split('.').pop();
                    fileName += `.${extension}`;
                }
            }

            return fileName;
        });
    }

    function downloadMediaTxt() {
        const mediaNames = collectMediaNames();

        if (!mediaNames.length) {
            logMessage("❌ Медиа-файлы не найдены!", "❌ No media files found!");
            return;
        }

        const text = mediaNames.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'media.txt';
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

	function getOrCreateButtonsRow() {
		const headerBlock = document.querySelector(
			'main.cont.py-6.grid.auto-rows-max.gap-6 > div.flex.items-center.flex-wrap.gap-4'
		);
		if (!headerBlock) return null;

		const next = headerBlock.nextElementSibling;
		if (next && next.dataset.bunkrButtonsRow === '1') {
			return next;
		}

		const wrapper = document.createElement('div');
		wrapper.dataset.bunkrButtonsRow = '1';
		wrapper.style.display = 'flex';
		wrapper.style.justifyContent = 'flex-end';
		wrapper.style.marginTop = '0px';
		wrapper.style.gap = '8px';

		headerBlock.insertAdjacentElement('afterend', wrapper);
		return wrapper;
	}

	function createDownloadButton() {
		const wrapper = getOrCreateButtonsRow();
		if (!wrapper) return;

		const btn = document.createElement('button');
		btn.innerText = '💾 Save Media List';
		btn.className = 'btn btn-sm rounded-md font-semibold';
		btn.style.width = "140px";
		btn.style.padding = "4px 8px";
		btn.style.background = "#1B2533";
		btn.style.color = "#fff";
		btn.style.border = "none";
		btn.style.cursor = "pointer";
		btn.style.fontSize = "12px";
		btn.style.borderRadius = "6px";

		btn.addEventListener('click', () => {
			logMessage("⏳ Собираем названия...", "⏳ Collecting names...");
			setTimeout(downloadMediaTxt, 500);
		});

		wrapper.appendChild(btn);
	}

    logMessage("Bunkr Media Saver 1.3 запущен!", "Bunkr Media Saver 1.3 started!");
    createDownloadButton();
})();