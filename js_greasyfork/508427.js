// ==UserScript==
// @name         Link Formatter & Counter
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @namespace    https://shikimori.one
// @version      2.1
// @description  Форматирует ссылки и считает символы
// @author       LifeH
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508427/Link%20Formatter%20%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/508427/Link%20Formatter%20%20Counter.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function URLcheck(str) {
        const pattern = new RegExp(
            "^(http|ftp|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])",
            "i"
        );
        return !!pattern.test(str.trim());
    }

    function formatter(clipboard, selectedText) {
        if (!URLcheck(clipboard)) return null;

        const url = new URL(clipboard);
        const urlType = url.pathname.split("/");
        let id = urlType[2]?.split("-")[0];

        if (id && id.startsWith("z")) {
            id = id.substring(1);
        }

        selectedText = selectedText.trim();
        if (!selectedText) return null;

        if (url.hostname.includes("shikimori") && urlType.length >= 3) {
            switch (urlType[1]) {
                case "characters":
                    return `[character=${id}]${selectedText}[/character]`;
                case "ranobe":
                    return `[ranobe=${id}]${selectedText}[/ranobe]`;
                case "mangas":
                    return `[manga=${id}]${selectedText}[/manga]`;
                case "animes":
                    return `[anime=${id}]${selectedText}[/anime]`;
                case "persons":
                    return `[person=${id}]${selectedText}[/person]`;
                default:
                    return `[url=${clipboard}]${selectedText}[/url]`;
            }
        }

        return `[url=${clipboard}]${selectedText || clipboard}[/url]`;
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

    function addCounter(textarea) {
        if (textarea.length === 0) return;

        if (textarea.next("#Counter").length === 0) {
            const counter = $(
                '<div id="Counter" style="position: absolute; right: 5px; bottom: 15px; font-size: 12px; color: gray;"></div>'
            );
            textarea.after(counter);

            textarea.on("input", function () {
                let text = "";

                if (textarea.is('[contenteditable="true"]')) {
                    text = textarea.text();
                } else if (textarea[0] && typeof textarea[0].value !== "undefined") {
                    text = textarea.val();
                } else {
                    return;
                }

                text = text.replace(/(\r\n|\n|\r)/g, " ");
                const charCount = text.length;
                const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

                counter.text(`Символов: ${charCount} | Слов: ${wordCount}`);
            });

            textarea.trigger("input");
        }
    }

    function observeAreas() {
        const areas = [
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
            '.ProseMirror[contenteditable="true"]',
            'div[contenteditable="true"]',
        ];

        areas.forEach(function (selector) {
            const textarea = $(selector);

            if (textarea.length) {
                textarea.off("paste");
                textarea.on("paste", function (event) {
                    vstavka(event, textarea);
                });

                addCounter(textarea);
            }
        });
    }

    function ready(fn) {
        document.addEventListener("page:load", fn);
        document.addEventListener("turbolinks:load", fn);
        if (
            document.attachEvent
                ? document.readyState === "complete"
                : document.readyState !== "loading"
        ) {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(observeAreas);
})();
