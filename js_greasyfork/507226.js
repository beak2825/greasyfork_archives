// ==UserScript==
// @name         Link Formatter
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @namespace    https://shikimori.one
// @version      1.1
// @description  Форматирует ссылки
// @author       LifeH
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507226/Link%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/507226/Link%20Formatter.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function URLcheck(str) {
        let pattern = new RegExp('^(http|ftp|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\/~+#-]*[\\w@?^=%&\/~+#-])', 'i');
        return !!pattern.test(str.trim());
    }

    function formatter(clipboard, selectedText) {
        let formattedText = null;

        if (!URLcheck(clipboard)) {
            return;
        }

        const url = new URL(clipboard);
        const urlType = url.pathname.split('/');
        let id = urlType[2]?.split('-')[0];

        if (id && id.startsWith('z')) {
            id = id.substring(1);
        }

        selectedText = selectedText.trim();
        if (!selectedText) {
            return;
        }

        if (url.hostname.includes("shikimori") && urlType.length >= 3) {
            switch (urlType[1]) {
                case 'characters':
                    formattedText = `[character=${id}]${selectedText}[/character]`;
                    break;
                case 'ranobe':
                    formattedText = `[ranobe=${id}]${selectedText}[/ranobe]`;
                    break;
                case 'mangas':
                    formattedText = `[manga=${id}]${selectedText}[/manga]`;
                    break;
                case 'animes':
                    formattedText = `[anime=${id}]${selectedText}[/anime]`;
                    break;
                case 'persons':
                    formattedText = `[person=${id}]${selectedText}[/person]`;
                    break;
                default:
                    formattedText = `[url=${clipboard}]${selectedText}[/url]`;
                    break;
            }
        } else {
            formattedText = `[url=${clipboard}]${selectedText || clipboard}[/url]`;
        }

        return formattedText;
    }

    function vstavka(event, textarea) {
        let clipboardData = (event.originalEvent || event).clipboardData;
        if (!clipboardData) {
            return;
        }

        let clipboard = clipboardData.getData('text');

        if (!URLcheck(clipboard)) {
            return;
        }

        let selectedText = textarea[0].value.substring(textarea[0].selectionStart, textarea[0].selectionEnd);

        if (!selectedText.trim()) {
            return;
        }

        let formattedText = formatter(clipboard, selectedText);

        if (formattedText) {
            let text = textarea.val();
            let start = textarea[0].selectionStart;
            let end = textarea[0].selectionEnd;

            let newText = text.slice(0, start) + formattedText + text.slice(end);
            textarea.val(newText);

            textarea[0].setSelectionRange(start + formattedText.length, start + formattedText.length);

            event.preventDefault();
        }
    }

    function observeAreas() {
        let areas = [
            'textarea[name="review[body]"]',
            'textarea[name="comment[body]"]',
            'textarea[name="critique[text]"]',
            'textarea[name="club[description]"]',
            'textarea[name="club_page[text]"]',
            'textarea[name="message[body]"]',
            'textarea[name="article[body]"]',
            'textarea[name="anime[description_ru_text]"]',
            'textarea[name="anime[description_en_text]"]',
            'textarea[name="reason"]',
            'textarea[name="character[description_en_text]"]',
            'textarea[name="character[description_ru_text]"]',
            'textarea[name="manga[description_ru_text]"]',
            'textarea[name="manga[description_en_text]"]',
            'textarea[name="collection[text]"]',
            'textarea[name="anime[russia_released_on_hint]"]',
            'textarea[name="anime[more_info]"]',
        ];

        areas.forEach(function (selector) {
            let textarea = $(selector);
            if (textarea.length) {
                textarea.on('paste', function(event) {
                    vstavka(event, textarea);
                });
            }
        });
    }

    function ready(fn) {
        document.addEventListener('page:load', fn);
        document.addEventListener('turbolinks:load', fn);
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        observeAreas();
    });
})();
