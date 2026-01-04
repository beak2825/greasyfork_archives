// ==UserScript==
// @name         Bunkr Media Opener
// @namespace    https://github.com/darhanger
// @version      1.2
// @description  Открывает все картинки и видео в новой вкладке с задержкой
// @author       DarhangeR
// @include      *://bunkr*/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunkr.is
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525242/Bunkr%20Media%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/525242/Bunkr%20Media%20Opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang ? lang.split('-')[0] : 'en';
    }

    function logMessage(messageRu, messageEn) {
        const lang = getBrowserLanguage();
        if (lang === 'ru' || lang === 'uk') {
            console.log(messageRu);
        } else {
            console.log(messageEn);
        }
    }

    logMessage("Bunkr Media Opener запущен!", "Bunkr Media Opener started!");

    function openAndCloseMedia(url, delay) {
        const newTab = window.open(url, '_blank');
        if (newTab) {
            logMessage(`🔓 Открыта вкладка с медиа: ${url}`, `🔓 Opened tab with media: ${url}`);
            setTimeout(() => {
                try {
                    newTab.close();
                    logMessage(`🔒 Закрыта вкладка с медиа: ${url}`, `🔒 Closed tab with media: ${url}`);
                } catch (e) {
                    console.error("❌ Не удалось закрыть вкладку:", e);
                }
            }, 5000);
        } else {
            logMessage("❌ Не удалось открыть вкладку для:", "❌ Failed to open tab for:");
        }
    }

    function openMedia() {
        logMessage("🔍 Ищем картинки и видео...", "🔍 Searching for images and videos...");

        let mediaItems = document.querySelectorAll('a[href*="/f/"]');
        let mediaArray = Array.from(mediaItems).map(link => link.href);

        if (mediaArray.length === 0) {
            logMessage("❌ Не найдено ни одного медиа! Проверь HTML-код.", "❌ No media found! Check the HTML code.");
        } else {
            logMessage(`✅ Найдено ${mediaArray.length} медиа`, `✅ Found ${mediaArray.length} media`);
        }

        mediaArray.forEach((url, index) => {
            setTimeout(() => {
                openAndCloseMedia(url, index * 6000);
            }, index * 6000);
        });
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

	function createOpenButton() {
		const wrapper = getOrCreateButtonsRow();
		if (!wrapper) return;

		const btn = document.createElement("button");
		btn.innerText = "Open Media";
		btn.className = "btn btn-sm rounded-md font-semibold";
		btn.style.width = "120px";
		btn.style.padding = "4px 8px";
		btn.style.background = "#1B2533";
		btn.style.color = "#fff";
		btn.style.border = "none";
		btn.style.cursor = "pointer";
		btn.style.fontSize = "12px";
		btn.style.borderRadius = "6px";
		btn.style.marginRight = "4px";

		btn.addEventListener("click", () => {
			logMessage("🔍 Button clicked! Opening media...", "🔍 Кнопка нажата! Открываем медиа...");
			openMedia();
		});

		wrapper.appendChild(btn);
	}

    createOpenButton();
})();