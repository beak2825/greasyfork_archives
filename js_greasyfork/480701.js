// ==UserScript==
// @name               YouTube Theater Plus
// @name:en            YouTube Theater Plus
// @name:id            YouTube Theater Plus
// @name:zh-CN         YouTube Theater Plus
// @name:zh-TW         YouTube Theater Plus
// @name:ja            YouTube Theater Plus
// @name:ko            YouTube Theater Plus
// @name:fr            YouTube Theater Plus
// @name:es            YouTube Theater Plus
// @name:de            YouTube Theater Plus
// @name:ru            YouTube Theater Plus
// @description        Enhances YouTube Theater with features like Fullpage Theater, Auto Open Theater, and more, including support for the new UI
// @description:en     Enhances YouTube Theater with features like Fullpage Theater, Auto Open Theater, and more, including support for the new UI
// @description:id     Tingkatkan YouTube Theater dengan fitur seperti Fullpage Theater, Auto Open Theater, dan lainnya, termasuk dukungan untuk tampilan baru
// @description:zh-CN  为 YouTube 剧场模式增强功能，如全屏剧场、自动开启剧场等，并支持新界面
// @description:zh-TW  為 YouTube 劇場模式增強功能，如全螢幕劇場、自動開啟劇場等，並支援新介面
// @description:ja     YouTube シアターモードを拡張し、フルページシアター、自動シアター起動などの機能を追加し、新しい UI に対応します
// @description:ko     YouTube 시어터 모드를 강화하여 전체 페이지 시어터, 자동 시어터 열기 등 다양한 기능을 제공하며 새로운 UI도 지원합니다
// @description:fr     Améliore YouTube Theater avec des fonctionnalités comme le mode plein écran, l’ouverture automatique et d’autres, y compris la prise en charge de la nouvelle interface
// @description:es     Mejora YouTube Theater con funciones como el modo de pantalla completa, apertura automática y más, incluyendo soporte para la nueva interfaz
// @description:de     Erweitert YouTube Theater mit Funktionen wie Vollseiten-Theater, automatischem Öffnen und weiteren, einschließlich Unterstützung für die neue Benutzeroberfläche
// @description:ru     Расширяет YouTube Theater функциями, такими как полноэкранный режим, автоматическое открытие и другими, включая поддержку нового интерфейса
// @version            2.5.1
// @run-at             document-body
// @inject-into        content
// @match              https://www.youtube.com/*
// @exclude            https://*.youtube.com/live_chat*
// @exclude            https://*.youtube.com/embed*
// @exclude            https://*.youtube.com/tv*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant              GM.getValue
// @grant              GM.setValue
// @author             Fznhq
// @namespace          https://github.com/fznhq
// @homepageURL        https://github.com/fznhq/userscript-collection
// @homepage           https://github.com/fznhq/userscript-collection
// @compatible         firefox
// @compatible         chrome
// @compatible         safari
// @compatible         opera
// @compatible         edge
// @license            GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480701/YouTube%20Theater%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/480701/YouTube%20Theater%20Plus.meta.js
// ==/UserScript==

// Icons provided by https://iconmonstr.com/

(async function () {
    "use strict";

    const html = document.documentElement;
    const body = document.body;

    let popup = false;
    let theater = false;
    let fullpage = false;
    let headerShow = false;

    /**
     * @typedef {object} Option
     * @property {string} [key]
     * @property {string} [icon]
     * @property {string} label
     * @property {any} value
     * @property {() => void} [onUpdate]
     * @property {Option} [sub]
     */

    /**
     * Options must be changed via popup menu,
     * just press (v) to open the menu
     */
    const subIcon = `{"svg":{"clip-rule":"evenodd","fill-rule":"evenodd","stroke-linejoin":"round","stroke-miterlimit":"2"},"path":{"d":"M10.211 7.155A.75.75 0 0 0 9 7.747v8.501a.75.75 0 0 0 1.212.591l5.498-4.258a.746.746 0 0 0-.001-1.183zm.289 7.563V9.272l3.522 2.719z","fill-rule":"nonzero"}}`;
    const options = {
        fullpage_theater: {
            icon: `{"path":{"d":"M22 4v12H2V4zm1-1H1v14h22zm-6 17H7v1h10z"}}`,
            label: "Fullpage Theater;", // Remove ";" to set your own label.
            value: true,
            onUpdate() {
                if (theater) applyTheaterMode(true);
            },
            sub: {
                show_title: {
                    label: "In Player Title;", // Remove ";" to set your own label.
                    value: false,
                    onUpdate() {
                        if (fullpage) setAttrValue(attr.show_title, this.value);
                    },
                },
            },
        },
        auto_theater_mode: {
            icon: `{"svg":{"fill-rule":"evenodd","clip-rule":"evenodd"},"path":{"d":"M24 22H0V2h24zm-7-1V6H1v15zm1 0h5V3H1v2h17zm-6-6h-1v-3l-7 7-1-1 7-7H7v-1h5z"}}`,
            label: "Auto Open Theater;", // Remove ";" to set your own label.
            value: false,
            onUpdate() {
                if (this.value && !theater) toggleTheater();
            },
        },
        hide_scrollbar: {
            icon: `{"path":{"d":"M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-3-4h2V6h4l-5-6-5 6h4zm2 8h-2v2H7l5 6 5-6h-4z"}}`,
            label: "Theater Hide Scrollbar;", // Remove ";" to set your own label.
            value: true,
            onUpdate() {
                if (theater) {
                    setAttrValue(attr.no_scroll, this.value);
                    resizeWindow();
                }
            },
        },
        close_theater_with_esc: {
            icon: `{"svg":{"clip-rule":"evenodd","fill-rule":"evenodd","stroke-linejoin":"round","stroke-miterlimit":2},"path":{"d":"M21 3.998c0-.478-.379-1-1-1H5c-.62 0-1 .519-1 1v15c0 .621.52 1 1 1h15c.478 0 1-.379 1-1zm-16 0h15v15H5zm7.491 6.432 2.717-2.718a.75.75 0 0 1 1.061 1.062l-2.717 2.717 2.728 2.728a.75.75 0 1 1-1.061 1.062l-2.728-2.728-2.728 2.728a.751.751 0 0 1-1.061-1.062l2.728-2.728-2.722-2.722a.75.75 0 0 1 1.061-1.061z","fill-rule":"nonzero"}}`,
            label: "Close Theater With Esc;", // Remove ";" to set your own label.
            value: true,
        },
        hide_cards: {
            icon: `{"path":{"d":"M22 6v16H6V6zm1-1H5v18h18zM2 2v20h1V3h18V2zm12 9c-3 0-5 3-5 3s2 3 5 3 5-3 5-3-2-3-5-3m0 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4m1-2a1 1 0 1 1-2 0 1 1 0 0 0 1-1l1 1"}}`,
            label: "Hide Cards;", // Remove ";" to set your own label.
            value: true,
            onUpdate() {
                setAttrValue(attr.hide_card, this.value);
            },
        },
        show_header_near: {
            icon: `{"path":{"d":"M5 4.27 15.476 13H8.934L5 18.117zm-1 0v17l5.5-7h9L4 1.77z"}}`,
            label: "Show Header When Mouse is Near;", // Remove ";" to set your own label.
            value: false,
            sub: {
                trigger_area: {
                    label: "Trigger Area;", // Remove ";" to set your own label.
                    value: 200,
                },
                delay: {
                    label: "Delay (in milliseconds);", // Remove ";" to set your own label.
                    value: 0,
                },
            },
        },
    };

    function resizeWindow() {
        document.dispatchEvent(new Event("resize", { bubbles: true }));
    }

    /**
     * @param {string} name
     * @param {Record<string, string | number | boolean>} [attributes]
     * @param {Node[]} [append]
     * @returns {SVGElement}
     */
    function createNS(name, attributes = {}, append = []) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", name);
        for (const k in attributes) el.setAttributeNS(null, k, attributes[k]);
        return el.append(...append), el;
    }

    /**
     * @param {Option} option
     * @param {any} value
     * @returns {any}
     */
    function saveOption(option, value) {
        GM.setValue(option.key, value);
        return (option.value = value);
    }

    /**
     * @param {string} name
     * @param {string} [subName]
     */
    async function loadOption(name, subName) {
        const key = subName ? `${name}_sub_${subName}` : name;
        const keyLabel = `label_${key}`;

        /** @type {Option} */
        const option = subName ? options[name].sub[subName] : options[name];
        option.key = key;
        option.value = await GM.getValue(key, option.value);

        let label = option.label;
        if (label.endsWith(";")) label = await GM.getValue(keyLabel, label);
        else GM.setValue(keyLabel, label);
        option.label = label.replace(/;$/, "");

        const icon = JSON.parse(option.icon || subIcon);
        option.icon = createNS("svg", icon.svg, [createNS("path", icon.path)]);
    }

    for (const name in options) {
        await loadOption(name);
        for (const subName in options[name].sub) {
            await loadOption(name, subName);
        }
    }

    /**
     * @param {string} className
     * @param {Node[]} [append]
     * @returns {HTMLDivElement}
     */
    function createDiv(className, append = []) {
        const el = document.createElement("div");
        el.className = "ytp-menuitem" + (className ? "-" + className : "");
        return el.append(...append), el;
    }

    /**
     * @returns {boolean}
     */
    function isActiveEditable() {
        /** @type {HTMLElement} */
        const active = document.activeElement;
        return (
            active.tagName === "TEXTAREA" ||
            active.tagName === "INPUT" ||
            active.isContentEditable
        );
    }

    (function initPopup() {
        /** @type {Record<string, HTMLElement[]>} */
        const menuItems = {};
        const panel = createDiv(" ytc-menu ytp-panel-menu");
        const menu = createDiv(" ytc-popup-container", [panel]);

        /**
         * @param {Option} option
         * @returns {HTMLInputElement}
         */
        function itemInput(option) {
            const input = document.createElement("input");
            const value = () => Number(input.value.replace(/\D/g, ""));
            const setValue = (value) => (input.value = value);

            setValue(option.value);

            input.addEventListener("input", () => setValue(value()));
            input.addEventListener("change", () => saveOption(option, value()));

            return input;
        }

        /**
         * @param {string} name
         * @param {boolean} checked
         */
        function toggleSub(name, checked) {
            for (const item of menuItems[name]) {
                item.style.display = checked ? "" : "none";
            }
        }

        /**
         * @param {Option} option
         * @returns  {HTMLElement}
         */
        function createItem(option) {
            const checkbox = typeof option.value === "boolean";
            const isSub = option.key.includes("sub_");
            const icon = isSub ? [] : [option.icon];
            const label = isSub
                ? [createDiv("icon", [option.icon]), option.label]
                : [option.label];
            const content = checkbox
                ? [createDiv("toggle-checkbox")]
                : [itemInput(option)];
            const item = createDiv("", [
                createDiv("icon", icon),
                createDiv("label", label),
                createDiv("content", content),
            ]);

            if (checkbox) {
                item.setAttribute("aria-checked", option.value);
                item.addEventListener("click", () => {
                    const checked = saveOption(option, !option.value);
                    item.setAttribute("aria-checked", checked);
                    if (!isSub) toggleSub(option.key, checked);
                    option.onUpdate?.();
                });
            }

            return panel.appendChild(item);
        }

        for (const name in options) {
            const option = options[name];
            createItem(option);
            menuItems[name] = [];

            for (const subName in option.sub) {
                menuItems[name].push(createItem(option.sub[subName]));
            }

            toggleSub(name, option.value);
        }

        window.addEventListener("click", (ev) => {
            if (popup && !panel.contains(ev.target)) popup = !!menu.remove();
        });

        window.addEventListener("keydown", (ev) => {
            const isPressV = ev.key.toLowerCase() === "v" || ev.code === "KeyV";

            if (
                (isPressV && !ev.ctrlKey && !isActiveEditable()) ||
                (popup && ev.code === "Escape")
            ) {
                document.activeElement.blur();
                popup = popup ? !!menu.remove() : !body.append(menu);
            }
        });
    })();

    /**
     * @param {string} query
     * @returns {() => (HTMLElement | null)}
     */
    function $(query) {
        let element = null;
        return () => element || (element = document.querySelector(query));
    }

    const style = document.head.appendChild(document.createElement("style"));
    style.textContent = /*css*/ `
        html[no-scroll],
        html[no-scroll] body {
            scrollbar-width: none !important;
        }

        html[no-scroll]::-webkit-scrollbar,
        html[no-scroll] body::-webkit-scrollbar,
        html[hide-card] #movie_player .ytp-paid-content-overlay,
        html[hide-card] #movie_player .iv-branding,
        html[hide-card] #movie_player .ytp-ce-element,
        html[hide-card] #movie_player .ytp-suggested-action {
            display: none !important;
        }

        html[chat-hidden] #panels-full-bleed-container {
            display: none;
        }

        html[hide-header] #masthead-container {
            transform: translateY(-100%) !important;
        }

        html[hide-header] [fixed-panels] #chat {
            top: 0 !important;
        }

        html[theater] #page-manager {
            margin: 0 !important;
        }

        html[theater] #content #page-manager ytd-watch-flexy #full-bleed-container,
        html[theater] #content #page-manager ytd-watch-grid #player-full-bleed-container {
            height: 100vh;
            min-height: auto;
            max-height: none;
        }

        html[show-title] #movie_player:not(.ytp-fullscreen-metadata-top) .ytp-chrome-top {
            height: auto !important;
        }

        html[show-title] #movie_player:not(.ytp-fullscreen-metadata-top) .ytp-title,
        html[show-title] #movie_player:not(.ytp-fullscreen-metadata-top) .ytp-title-text,
        html[show-title] #movie_player:not(.ytp-fullscreen-metadata-top) .ytp-gradient-top,
        html[show-title] #movie_player .ytp-fullscreen-metadata {
            display: flex !important;
        }

        .ytc-popup-container {
            position: fixed;
            inset: 0;
            z-index: 9000;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ytc-menu.ytp-panel-menu {
            background: var(--yt-spec-base-background, #0f0f0f);
            width: 400px;
            font-size: 120%;
            padding: 10px;
            color: var(--yt-spec-text-primary, #f1f1f1) !important;
            fill: currentColor !important;
        }

        .ytc-menu input {
            width: 36px;
            text-align: center;
        }

        .ytc-menu .ytp-menuitem-label .ytp-menuitem-icon {
            display: inline-block;
            padding: 0 10px 0 0;
            margin-left: -10px;
        }

        .ytc-menu .ytp-menuitem-toggle-checkbox::after {
            background: #fff !important;
        }

        .ytc-menu [aria-checked=false] .ytp-menuitem-toggle-checkbox {
            background: #5b5b5b !important;
        }
    `;

    const attrName = "yttp-" + Date.now().toString(36);
    const attr = {
        video_id: "video-id",
        role: "role",
        theater: "theater",
        fullscreen: "fullscreen",
        hide_header: "hide-header",
        no_scroll: "no-scroll",
        hide_card: "hide-card",
        chat_hidden: "chat-hidden",
        show_title: "show-title",
    };

    for (const key in attr) {
        style.textContent = style.textContent.replaceAll(
            `[${attr[key]}]`,
            `[${attrName}~="${attr[key]}"]`
        );
    }

    const element = {
        watch: $("ytd-watch-flexy, ytd-watch-grid"), // ytd-watch-grid === trash
        search: $("form[action*=result] input"),
    };

    const keyToggleTheater = new KeyboardEvent("keydown", {
        key: "t",
        code: "KeyT",
        which: 84,
        keyCode: 84,
        bubbles: true,
        cancelable: true,
    });

    const tempAttrs = document.createElement("a");

    /**
     * @param {string} attr
     * @param {boolean} state
     */
    function setAttrValue(attr, state) {
        tempAttrs.classList.toggle(attr, state);
        html.setAttribute(attrName, tempAttrs.className);
    }

    /**
     * @param {MutationCallback} callback
     * @param {Node} [target]
     * @param {MutationObserverInit} [option]
     */
    function observer(callback, target = document, option) {
        const mutation = new MutationObserver(callback);
        option = option || { subtree: true, childList: true, attributes: true };
        mutation.observe(target, option);
    }

    /**
     * @returns {boolean}
     */
    function isTheater() {
        const watch = element.watch();
        return (
            watch.getAttribute(attr.role) === "main" &&
            watch.hasAttribute(attr.theater) &&
            !watch.hasAttribute(attr.fullscreen)
        );
    }

    /**
     * @returns {boolean}
     */
    function isSearchFocus() {
        return document.activeElement === element.search();
    }

    /**
     * @param {boolean} state
     * @param {number} [timeout]
     * @param {() => void} [callback]
     * @returns {number | boolean}
     */
    function toggleHeader(state, timeout, callback) {
        function toggle() {
            if (fullpage && (state || !isSearchFocus())) {
                const showNear = options.show_header_near.value;
                headerShow = state || (!showNear && !!window.scrollY);
                setAttrValue(attr.hide_header, !headerShow);
                if (callback) callback();
            }
        }
        return fullpage && setTimeout(toggle, timeout || 1);
    }

    let mouseNearDelayId = 0;
    let mouseNearDurationId = 0;

    /**
     * @param {number} [delay=0]
     * @returns {number}
     */
    function mouseNearHide(delay = 0) {
        return toggleHeader(false, delay, () => {
            clearTimeout(mouseNearDelayId);
            mouseNearDelayId = 0;
        });
    }

    function mouseNearToggle(/** @type {MouseEvent} */ ev) {
        if (options.show_header_near.value && fullpage) {
            const subOptions = options.show_header_near.sub;
            const area = subOptions.trigger_area.value;
            const state = !popup && ev.clientY < area;
            const delay = headerShow ? 0 : subOptions.delay.value;

            if (state && (!mouseNearDelayId || headerShow)) {
                clearTimeout(mouseNearDurationId);
                mouseNearDurationId = mouseNearHide(delay + 1500);
                mouseNearDelayId = toggleHeader(true, delay);
            } else if (!state) mouseNearHide();
        }
    }

    function toggleTheater() {
        document.dispatchEvent(keyToggleTheater);
    }

    function onEscapePress(/** @type {KeyboardEvent} */ ev) {
        if (ev.code !== "Escape" || !theater || popup) return;

        const input = element.search();

        if (options.close_theater_with_esc.value) toggleTheater();
        else if (isSearchFocus()) input.blur();
        else input.focus();
    }

    function registerEventListener() {
        window.addEventListener("mousemove", mouseNearToggle);
        window.addEventListener("keydown", onEscapePress, true);
        window.addEventListener("mouseout", (ev) => {
            if (ev.clientY <= 0) mouseNearHide();
        });
        window.addEventListener("scroll", () => {
            if (!options.show_header_near.value) toggleHeader();
        });
        element.search().addEventListener("focus", () => toggleHeader(true));
        element.search().addEventListener("blur", () => toggleHeader(false));
    }

    /**
     * @param {boolean} [force]
     */
    function applyTheaterMode(force) {
        const state = isTheater();

        if (theater === state && !force) return;

        const opt_ft = options.fullpage_theater;
        theater = state;
        fullpage = theater && opt_ft.value;

        setAttrValue(attr.theater, fullpage);
        setAttrValue(attr.hide_header, fullpage);
        setAttrValue(attr.show_title, fullpage && opt_ft.sub.show_title.value);
        setAttrValue(attr.no_scroll, theater && options.hide_scrollbar.value);
        setAttrValue(attr.hide_card, options.hide_cards.value);
        resizeWindow();
    }

    /**
     * @param {MutationRecord[]} mutations
     */
    function autoOpenTheater(mutations) {
        const attrs = [attr.role, attr.video_id, attrName];
        const watch = element.watch();

        if (
            !theater &&
            options.auto_theater_mode.value &&
            watch.getAttribute(attr.video_id) &&
            !watch.hasAttribute(attr.fullscreen) &&
            mutations.some((m) => attrs.includes(m.attributeName))
        ) {
            setTimeout(toggleTheater, 1);
        }
    }

    /**
     * @returns {boolean}
     */
    function isChatHidden() {
        const chat = document.getElementById("chat");
        const frame = chat?.querySelector("iframe");

        if (
            frame &&
            chat.offsetHeight &&
            frame.offsetHeight &&
            element.watch().hasAttribute("fixed-panels")
        ) {
            const styleChat = getComputedStyle(chat);

            if (
                styleChat.position === "fixed" &&
                styleChat.visibility !== "hidden" &&
                Number(styleChat.opacity)
            ) {
                return false;
            }
        }

        return !!chat;
    }

    let chatState = false;

    function observeChatChange() {
        const state = isChatHidden();

        if (state !== chatState) {
            setAttrValue(attr.chat_hidden, (chatState = state));
            resizeWindow();
        }
    }

    observer(observeChatChange);
    observer((_, observe) => {
        const watch = element.watch();

        if (watch) {
            observe.disconnect();
            observer(
                (mutations) => {
                    applyTheaterMode();
                    autoOpenTheater(mutations);
                },
                watch,
                { attributes: true }
            );
            watch.setAttribute(attrName, "");
            registerEventListener();
        }
    });
})();
