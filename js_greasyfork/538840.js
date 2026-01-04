// ==UserScript==
// @name         YouTube - Развернуть комментарии
// @namespace    http://tampermonkey.net/
// @version      1.2025.519.0
// @description  Автоматически раскрывает ветки комментариев на YouTube, включая "Показать ещё ответы" и "Читать дальше".
// @author       dlw@mcprv (адаптировано для Tampermonkey)
// @match        *://*.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538840/YouTube%20-%20%D0%A0%D0%B0%D0%B7%D0%B2%D0%B5%D1%80%D0%BD%D1%83%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/538840/YouTube%20-%20%D0%A0%D0%B0%D0%B7%D0%B2%D0%B5%D1%80%D0%BD%D1%83%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ПО УМОЛЧАНИЮ ---
    const DEFAULTS = {
        auto_expand: true,
        expand_show_more_replies: true,
        expand_read_more: true,
        hide_read_less_button: false,
        wait_time: 200,
        view_replies_selector: "#more-replies",
        show_more_replies_selector: ".style-scope.ytd-continuation-item-renderer button.yt-spec-button-shape-next--text",
        read_more_selector: "ytd-comments tp-yt-paper-button#more",
        read_less_selector: "ytd-comments tp-yt-paper-button#less",
        toggle_expand_shortcutkey: "",
        expand_replies_shortcutkey: "",
        expand_show_more_replies_shortcutkey: "",
        expand_read_more_shortcutkey: "",
        hide_replies_shortcutkey: "",
        remove_focus_shortcutkey: "",
        scroll_by_space: false
    };

    let options = {};

    // --- ФУНКЦИИ ДЛЯ РАБОТЫ С НАСТРОЙКАМИ (GM_setValue / GM_getValue) ---
    function loadOptions() {
        for (const key in DEFAULTS) {
            options[key] = GM_getValue(key, DEFAULTS[key]);
        }
        // Убедимся, что wait_time - это число
        options.wait_time = parseInt(options.wait_time, 10);
    }

    function saveOption(key, value) {
        options[key] = value;
        GM_setValue(key, value);
    }

    // --- РЕГИСТРАЦИЯ МЕНЮ ДЛЯ НАСТРОЕК В TAMPERMONKEY ---
    function registerMenuCommands() {
        GM_registerMenuCommand(`${options.auto_expand ? '✅' : '❌'} Автоматически раскрывать комментарии`, () => {
            saveOption('auto_expand', !options.auto_expand);
            location.reload(); // Перезагружаем страницу для применения
        });
        GM_registerMenuCommand(`${options.expand_show_more_replies ? '✅' : '❌'} Также раскрывать "Показать ещё ответы"`, () => {
            saveOption('expand_show_more_replies', !options.expand_show_more_replies);
            initSelectors();
        });
        GM_registerMenuCommand(`${options.expand_read_more ? '✅' : '❌'} Также раскрывать "Читать дальше"`, () => {
            saveOption('expand_read_more', !options.expand_read_more);
            initSelectors();
        });
        GM_registerMenuCommand("--- Команды ---");
        GM_registerMenuCommand("Раскрыть все ветки комментариев", () => expand_replies("expand_replies"));
        GM_registerMenuCommand("Раскрыть все \"Показать ещё ответы\"", () => expand_replies("expand_show_more_replies"));
        GM_registerMenuCommand("Раскрыть все \"Читать дальше\"", () => expand_replies("expand_read_more"));
        GM_registerMenuCommand("Скрыть все ветки комментариев", hide_replies);
    }


    // --- ОСНОВНАЯ ЛОГИКА СКРИПТА ---
    let observer = new MutationObserver(observe_func);
    let disconnected = false;
    let target_selector = "";
    const node_spool = new Set();
    let lock = false;

    function initSelectors() {
        target_selector = options.view_replies_selector;
        if (options.expand_show_more_replies) {
            target_selector += "," + options.show_more_replies_selector;
        }
        if (options.expand_read_more) {
            target_selector += "," + options.read_more_selector;
        }

        if (options.hide_read_less_button) {
            GM_addStyle(`${options.read_less_selector} { display: none !important; }`);
        } else {
            GM_addStyle(`${options.read_less_selector} { display: revert !important; }`);
        }
    }

    function init() {
        if (options.auto_expand) {
            observer.observe(document, { childList: true, subtree: true });
            document.addEventListener("scroll", scroll_listener);
            window.addEventListener("resize", resize_listener);
        } else {
            disconnected = true;
            observer.disconnect();
            document.removeEventListener("scroll", scroll_listener);
            window.removeEventListener("resize", resize_listener);
        }
        initSelectors();
        document.removeEventListener("keydown", shortcut_keys);
         if (Object.values(options).some(val => typeof val === 'string' && val.includes('+')) || options.scroll_by_space) {
            document.addEventListener("keydown", shortcut_keys);
        }
    }

    function observe_func(mutations) {
        if (disconnected) return;

        for (const mutation of mutations) {
            if (!mutation.addedNodes.length) continue;
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                // Проверяем, существует ли узел в DOM перед запросом
                if (document.body.contains(node)) {
                   const elems = node.querySelectorAll(target_selector);
                   for (const elem of elems) {
                       node_spool.add(elem);
                   }
                }
            }
        }
        // Дополнительная проверка для "Show more replies", так как они могут появляться динамически
        if (options.expand_show_more_replies) {
            const elems = document.querySelectorAll(options.show_more_replies_selector);
            for (const elem of elems) {
                node_spool.add(elem);
            }
        }
    }

    let timer;
    function scroll_listener() {
        clearTimeout(timer);
        timer = setTimeout(click, 300);
    }

    function resize_listener() {
        click();
    }

    async function click() {
        if (lock) return;
        lock = true;
        for (const node of [...node_spool]) {
             if (!document.body.contains(node)) {
                node_spool.delete(node);
                continue;
            }
            const rect = node.getBoundingClientRect();
            // Раскрываем комментарии, которые находятся в пределах 2-х высот окна просмотра
            if (rect.top <= window.innerHeight * 2) {
                node_spool.delete(node);
                if (rect.top !== 0 && rect.height !== 0) { // Проверяем, что элемент видим
                    node.click();
                    await new Promise(resolve => setTimeout(resolve, options.wait_time));
                }
            }
        }
        lock = false;
    }

    async function expand_replies(level) {
        let selectors = [];
        if (level === "expand_replies" || level === "expand_show_more_replies" || level === "expand_read_more") {
            selectors.push(options.view_replies_selector);
        }
        if (level === "expand_show_more_replies" || level === "expand_read_more") {
            selectors.push(options.show_more_replies_selector);
        }
        if (level === "expand_read_more") {
            selectors.push(options.read_more_selector);
        }

        for (const selector of selectors) {
            const elems = document.querySelectorAll(selector);
            for (const elem of elems) {
                elem.click();
                await new Promise(resolve => setTimeout(resolve, options.wait_time));
            }
        }
    }

    async function hide_replies() {
        const elems = document.querySelectorAll("#less-replies, " + options.read_less_selector);
        for (const elem of elems) {
            elem.click();
             await new Promise(resolve => setTimeout(resolve, 50)); // Небольшая задержка
        }
    }

     function shortcut_keys(e) {
        const player = document.getElementById("movie_player");
        if (e.repeat || (e.target != document.body && e.target != player && e.target.tagName !== 'INPUT')) {
            return;
        }

        let mod = [];
        if (e.ctrlKey) mod.push("Ctrl");
        if (e.altKey) mod.push("Alt");
        if (e.shiftKey) mod.push("Shift");
        if (e.metaKey) mod.push("Meta");

        let key = e.key;
        if (key.length === 1 && key !== " ") {
            key = key.toUpperCase();
        }
        mod.push(key);
        const text = mod.join(" + ");

        if (text === options.remove_focus_shortcutkey) {
            if (document.activeElement === player) {
                document.activeElement.blur();
            } else if (document.activeElement === document.body) {
                player.focus({ preventScroll: true });
            }
            return;
        }

        if (e.target !== document.body) return;

        if (e.key === " " && options.scroll_by_space) {
            e.preventDefault();
            window.scrollByPages(e.shiftKey ? -1 : 1);
            return;
        }

        switch (text) {
            case options.toggle_expand_shortcutkey:
                saveOption('auto_expand', !options.auto_expand);
                location.reload();
                break;
            case options.expand_replies_shortcutkey:
                expand_replies("expand_replies");
                break;
            case options.expand_show_more_replies_shortcutkey:
                expand_replies("expand_show_more_replies");
                break;
             case options.expand_read_more_shortcutkey:
                expand_replies("expand_read_more");
                break;
            case options.hide_replies_shortcutkey:
                hide_replies();
                break;
        }
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            node_spool.clear(); // Очищаем пул при смене URL
        }
    }).observe(document, { subtree: true, childList: true });


    // --- ЗАПУСК СКРИПТА ---
    // Ожидаем загрузки контента перед инициализацией
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadOptions();
            registerMenuCommands();
            init();
        });
    } else {
        loadOptions();
        registerMenuCommands();
        init();
    }

})();