// ==UserScript==
// @name               YouTube HD Plus
// @name:en            YouTube HD Plus
// @name:id            YouTube HD Plus
// @name:zh-CN         YouTube HD Plus
// @name:zh-TW         YouTube HD Plus
// @name:ja            YouTube HD Plus
// @name:ko            YouTube HD Plus
// @name:fr            YouTube HD Plus
// @name:es            YouTube HD Plus
// @name:de            YouTube HD Plus
// @name:ru            YouTube HD Plus
// @description        Automatically select your preferred video quality and enable Premium playback when available. (Supports YouTube Desktop, Music & Mobile)
// @description:en     Automatically select your preferred video quality and enable Premium playback when available. (Supports YouTube Desktop, Music & Mobile)
// @description:id     Otomatis memilih kualitas video yang Anda sukai dan mengaktifkan pemutaran Premium jika tersedia. (Mendukung YouTube Desktop, Music & Mobile)
// @description:zh-CN  自动选择您偏好的视频画质，并在可用时启用 Premium 播放。 (支持 YouTube 桌面版、音乐和移动端)
// @description:zh-TW  自動選擇您偏好的影片畫質，並在可用時啟用 Premium 播放。 (支援 YouTube 桌面版、音樂和行動裝置)
// @description:ja     希望する画質を自動で選択し、利用可能な場合は Premium 再生を有効にします。（対応: YouTube デスクトップ、Music、モバイル）
// @description:ko     선호하는 동영상 화질을 자동으로 선택하고, 가능할 경우 Premium 재생을 활성화합니다. (지원: YouTube 데스크톱, Music, 모바일)
// @description:fr     Sélectionne automatiquement la qualité vidéo préférée et active la lecture Premium lorsque disponible. (Compatible avec YouTube Desktop, Music et Mobile)
// @description:es     Selecciona automáticamente la calidad de vídeo preferida y activa la reproducción Premium cuando esté disponible. (Compatible con YouTube Desktop, Music y Móvil)
// @description:de     Wählt automatisch die bevorzugte Videoqualität und aktiviert Premium-Wiedergabe, wenn verfügbar. (Unterstützt YouTube Desktop, Music & Mobile)
// @description:ru     Автоматически выбирает предпочтительное качество видео и включает воспроизведение Premium, если доступно. (Поддерживает YouTube Desktop, Music и Mobile)
// @version            2.7.3
// @run-at             document-end
// @inject-into        content
// @match              https://www.youtube.com/*
// @match              https://www.youtube-nocookie.com/*
// @match              https://m.youtube.com/*
// @match              https://music.youtube.com/*
// @exclude            https://*.youtube.com/live_chat*
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
// @downloadURL https://update.greasyfork.org/scripts/508784/YouTube%20HD%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/508784/YouTube%20HD%20Plus.meta.js
// ==/UserScript==

// Icons provided by https://uxwing.com/

(async function () {
    "use strict";

    const body = document.body;
    const head = document.head;

    const $host = location.hostname;
    const isMobile = $host.includes("m.youtube");
    const isMusic = $host.includes("music.youtube");
    const isEmbed = isVideoPage("embed");

    let manualOverride = false;
    let settingsClicked = false;

    const listQuality = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320];

    /**
     * You can change the config here in the script.
     * @namespace
     */
    const options = {
        preferred_quality: undefined, // Value from listQuality.
        preferred_premium: undefined, // true or false.
        show_ui: undefined, // true or false.
        updated_id: "",
    };

    const labels = {
        premium: "Preferred Premium;", // Remove ";" to set your own label.
        quality: "Preferred Quality;", // Remove ";" to set your own label.
    };

    const icons = {
        premium: `{"svg":{"viewBox":"-12 -12 147 119"},"path":{"d":"M1 28 20 1a3 3 0 0 1 3-1h77a3 3 0 0 1 3 1l19 27a3 3 0 0 1 1 2 3 3 0 0 1-1 2L64 94a3 3 0 0 1-4 0L1 32a3 3 0 0 1-1-1 3 3 0 0 1 1-3m44 5 17 51 17-51Zm39 0L68 82l46-49ZM56 82 39 33H9zM28 5l13 20L56 5Zm39 0 15 20L95 5Zm33 2L87 27h28zM77 27 61 7 47 27Zm-41 0L22 7 8 27Z"}}`,
        quality: `{"svg":{"viewBox":"-12 -12 147 131"},"path":{"fill-rule":"evenodd","d":"M89.8 56.3c-.925.267-1.862.484-2.8.7l-2.1-2.5c-1.447-1.791-4.18-1.847-6-.4l-4 3.6c-1.785 1.575-2.014 4.318-.5 6.1l1.8 2.1c-.595.898-1.098 1.848-1.6 2.8l-3.2-.2c-2.373-.142-4.362 1.565-4.5 4L67 80c.529 1.974 2.318 2.752 3.6 2.8l2.7.2c.263 1.056.643 2.074 1 3.1l-2.5 2c-1.624 1.298-1.722 3.357-1.3 4.6.854 2.08 2.104 4.051 3.5 5.9 1.533 1.77 4.28 1.831 6 .4l2-2a13 13 0 0 0 1.2.8l1.4.7.2.1-.2 3.2a4.2 4.2 0 0 0 4 4.5l5.4.4c2.4.178 4.427-1.605 4.5-3.9l.2-2.7c1.144-.244 2.23-.639 3.3-1.1l2 2.4c1.213 1.415 3.22 1.686 4.6 1.2.887-.3 5.542-3.716 6.6-5.7.865-1.642.35-3.582-.6-4.7l-1.8-2.1c.595-.898 1.098-1.848 1.6-2.8l3.2.2a4.115 4.115 0 0 0 4.5-4l.4-5.5c.124-2.228-1.387-4.394-3.9-4.5l-2.7-.2c-.222-1.07-.628-2.077-1-3.1l2.5-2.1c1.427-1.21 2.03-3.55.4-6-1.354-2.214-2.274-4.385-4.8-5.1m-20 7c-8 .683-13.871 7.818-13 15.8 1.374 12.585 17.215 17.308 25.258 7.534S105.614 62.924 93 64m1 7.8a6.4 6.4 0 0 0-5.8 7c.556 5.661 7.668 7.838 11.297 3.458S99.667 71.294 94 71.8M5.2 15.9v-5.1a5.6 5.6 0 0 1 5.6-5.6H24V16Zm23.8 0V5.2h21v10.7ZM93.2 5.2a5.6 5.6 0 0 1 5.7 5.6v5.1h-18V5.2ZM55.3 15.9V5.2h20.4v10.7ZM24 86.9H10.8a5.6 5.6 0 0 1-5.6-5.6v-5.7H24Zm5 0V75.6h21V87Zm17.5-56c-.348-.261-3.94-2.2-4.1 2.1v25.6c0 2.216 2.592 3.376 4.2 2l18.775-13.152c1.017-.88 1.13-1.996.025-3.048M10.8 0C4.835 0 0 4.835 0 10.8v70.5C.055 87.226 4.874 92 10.8 92h49c-.035-1.268.318-2.502.7-3.7L59 86.8h-3.7V75.5h.7c.073-1.752-.311-4.056.946-5.231L5.2 70.3V21h93.6v19.2c2.12.018 3.675.325 4.8.7l.4.1V10.8C104 4.835 99.165 0 93.2 0ZM113 57c-1.605-.52-3.349-.203-4.4.7l-2.1 1.8c-.868-.655-1.814-1.152-2.8-1.6l.2-3.3c.137-2.274-1.431-4.333-4-4.5l-5.4-.4c-2.465-.183-4.416 1.662-4.5 3.9l-.2 2.7"}}`,
        check_mark: `{"svg":{"viewBox":"-32 -32 186.9 153.8"},"path":{"d":"M1.2 55.5a3.7 3.7 0 0 1 5-5.5l34.1 30.9 76.1-79.7a3.8 3.8 0 0 1 5.4 5.1L43.2 88.7a3.7 3.7 0 0 1-5.2.2L1.2 55.5z"}}`,
        arrow: `{"svg":{"class":"transform-icon-svg","viewBox":"0 0 24 24"},"path":{"d":"M8.793 5.293a1 1 0 000 1.414L14.086 12l-5.293 5.293a1 1 0 101.414 1.414L16.914 12l-6.707-6.707a1 1 0 00-1.414 0Z"}}`,
    };

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

    for (const name in icons) {
        const icon = JSON.parse(icons[name]);
        icon.svg = { ...icon.svg, width: "100%", height: "100%" };
        icons[name] = createNS("svg", icon.svg, [createNS("path", icon.path)]);
    }

    /**
     * @param {string} key
     * @param {any} value
     */
    function saveOption(key, value) {
        GM.setValue(key, value);
        if (key in options) options[key] = value;
    }

    for (const key in labels) {
        const storageKeyLabel = `label_${key}`;
        let label = labels[key];
        if (label.endsWith(";")) {
            label = await GM.getValue(storageKeyLabel, label);
        } else saveOption(storageKeyLabel, label);
        labels[key] = label.replace(/;$/, "");
    }

    /** DO NOT CHANGE */
    const fallbackOptions = {
        preferred_quality: 1080,
        preferred_premium: true,
        show_ui: true,
    };

    /**
     * @param {boolean} [init]
     */
    async function loadOptions(init) {
        for (const key in options) {
            const value = options[key];
            const defaultValue = value ?? fallbackOptions[key];
            const saved = await GM.getValue(key, defaultValue);
            const lastDefaultKey = `last_default_${key}`;
            const lastDefault = await GM.getValue(lastDefaultKey);
            const isDefaultChange = init && lastDefault !== value;

            if (isDefaultChange) saveOption(lastDefaultKey, value);
            if (isDefaultChange && value !== undefined) saveOption(key, value);
            else options[key] = saved;
        }
    }

    await loadOptions(true);

    /**
     * @param {string} [prefix=id]
     * @returns {string}
     */
    function generateId(prefix = "id") {
        return prefix + (Date.now() + Math.random() * 10e20).toString(36);
    }

    const proxyName = generateId("ythdp-proxy-");
    const proxyFunction = function () {
        function handleAPI(ev) {
            const [id, elementId, fn, ...args] = ev.detail.split("|");
            const player = document.getElementById(elementId);
            const detail = { id, response: player?.[fn]?.(...args) };
            document.dispatchEvent(
                new CustomEvent("receiver-proxyName", { detail })
            );
        }

        function spoofData(ev) {
            const item = ev.target.closest?.("[proxyName]");
            if (item) item.data = {};
        }

        const create = (name) => document.createElement(name);
        const container = document.body.appendChild(create("ythdp-elements"));
        container.style.display = "none";
        container.append(create("ytd-toggle-menu-service-item-renderer"));

        document.addEventListener("proxyName", handleAPI);
        window.addEventListener("touchstart", spoofData, true);
        window.addEventListener("mousedown", spoofData, true);
    }.toString();

    const policyOptions = { createScript: (script) => script };
    const proxyPolicy = window.trustedTypes
        ? window.trustedTypes.createPolicy(proxyName, policyOptions)
        : policyOptions;
    const script = head.appendChild(document.createElement("script"));
    script.textContent = proxyPolicy.createScript(
        `(${proxyFunction.replaceAll("proxyName", proxyName)})();`
    );

    /** @type {Map<string, (response: any) => void>}  */
    const APIQueue = new Map();

    document.addEventListener("receiver-" + proxyName, (ev) => {
        const { id, response } = ev.detail;
        APIQueue.get(id)(response);
        APIQueue.delete(id);
    });

    /**
     * @param {string} elementId
     * @param {'getAvailableQualityData' | 'setPlaybackQualityRange' | 'playVideo' | 'loadVideoById'} name
     * @param {string[]} [args]
     * @returns {Promise<any>}
     */
    function API(elementId, name, ...args) {
        const id = generateId(name);
        const detail = [id, elementId, name, ...args].join("|");
        return new Promise((resolve) => {
            APIQueue.set(id, resolve);
            document.dispatchEvent(new CustomEvent(proxyName, { detail }));
        });
    }

    /**
     * @param {Document | HTMLElement} context
     * @param {string} query
     * @param {boolean} [all=false]
     * @returns {HTMLElement | NodeListOf<HTMLElement> | null}
     */
    function find(context, query, all = false) {
        return context[all ? "querySelectorAll" : "querySelector"](query);
    }

    /**
     * @param {string} query
     * @param {boolean} [cache=true]
     * @returns {() => (HTMLElement | null)}
     */
    function $(query, cache = true) {
        let element = null;
        return () => (cache && element) || (element = find(document, query));
    }

    const caches = {
        /** @type {Record<string, HTMLElement[]>} */
        player: {},
        /** @type {Set<Text>} */
        text_quality: new Set(),
        /** @type {Set<HTMLElement>} */
        toggle_premium: new Set(),
    };

    const element = {
        movie_player: $("#movie_player", !isMobile),
        short_player: $("#shorts-player"),
        link: $("link[rel=canonical]"),
        offline: $("[class*=offline][style*='v=']", false),
        m_bottom_container: $("bottom-sheet-container:not(:empty)", false),
        popup: $("[class*=popup-container]:not([aria-hidden=true]) #items"),
    };

    const style = head.appendChild(document.createElement("style"));
    style.textContent = /*css*/ `
        [dir=rtl] svg.transform-icon-svg { transform: scale(-1, 1); }
        #items.ytmusic-menu-popup-renderer { width: 250px !important; }
        .ythdp-icon { fill: currentColor; }
        .ythdp-toggle [role=button][hidden] { display: inherit !important; }
    `;

    /**
     * @param {MutationCallback} callback
     * @param {Node} [target]
     * @param {MutationObserverInit} [options]
     */
    function observer(callback, target = body, options) {
        const mutation = new MutationObserver(callback);
        mutation.observe(target, options || { subtree: true, childList: true });
        callback([], mutation);
    }

    /**
     * @param {string} label
     * @returns {number}
     */
    function parseQualityLabel(label) {
        return parseInt(label.replace(/^\D+/, "").slice(0, 4));
    }

    /**
     * @typedef {object} QualityData
     * @property {any} formatId
     * @property {string} qualityLabel
     * @property {string} quality
     * @property {boolean} isPlayable
     * @property {object} paygatedQualityDetails
     */

    /**
     * @param {QualityData[]} data
     * @returns {number}
     */
    function getPreferredQuality(data) {
        let preferred = 0;
        let min = Infinity;

        for (const d of data) {
            const q = parseQualityLabel(d.qualityLabel);
            if (q < min) min = q;
            if (q <= options.preferred_quality && q > preferred) preferred = q;
        }

        return preferred || min;
    }

    /**
     * @param {QualityData[]} qualityData
     * @returns {QualityData | undefined}
     */
    function getQuality(qualityData) {
        const quality = { premium: undefined, normal: undefined };
        const preferred = getPreferredQuality(qualityData);

        if (!isFinite(preferred)) return;

        qualityData.forEach((data) => {
            if (
                data.isPlayable &&
                parseQualityLabel(data.qualityLabel) === preferred
            ) {
                if (data.paygatedQualityDetails) quality.premium = data;
                else quality.normal = data;
            }
        });

        return (options.preferred_premium && quality.premium) || quality.normal;
    }

    /** @type {(() => Promise<void>)[]} */
    let stackSequence = [];
    let isSequenceRun = false;

    async function runSequence() {
        if (isSequenceRun) return;
        isSequenceRun = true;
        for (let fn; (fn = stackSequence.pop()); ) await fn();
        isSequenceRun = false;
    }

    function setVideoQuality() {
        if (manualOverride) return;

        stackSequence.push(async () => {
            const id = this.id;
            const qualityData = await API(id, "getAvailableQualityData");
            const selected = getQuality(qualityData || []);

            if (selected) {
                await API(
                    id,
                    "setPlaybackQualityRange",
                    selected.quality,
                    selected.quality,
                    selected.formatId
                );
            }
        });

        runSequence();
    }

    /**
     * @param {HTMLElement} [element]
     * @returns {HTMLElement | undefined}
     */
    function togglePremium(element) {
        if (element) caches.toggle_premium.add(element);
        caches.toggle_premium.forEach((toggle) => {
            toggle.removeAttribute("hidden");
            toggle.toggleAttribute("checked", options.preferred_premium);
            toggle.setAttribute("aria-checked", options.preferred_premium);
        });
        return element;
    }

    /**
     * @param {Text} [nodeText]
     * @returns {Text | undefined}
     */
    function setTextQuality(nodeText) {
        if (nodeText) caches.text_quality.add(nodeText);
        caches.text_quality.forEach((text) => {
            text.textContent = options.preferred_quality + "p";
        });
        return nodeText;
    }

    /**
     * @param {keyof options} optionKey
     * @param {any} newValue
     * @param {HTMLElement} player
     * @param {Boolean} [clearOverride]
     */
    function savePreferred(optionKey, newValue, player, clearOverride) {
        if (clearOverride) manualOverride = false;
        saveOption(optionKey, newValue);
        saveOption("updated_id", generateId());
        togglePremium(), setTextQuality();
        setVideoQuality.call(player);
    }

    /**
     * @param {string} className
     * @param {Node[]} [append]
     * @returns {HTMLDivElement}
     */
    function itemElement(className = "", append = []) {
        const el = document.createElement("div");
        el.className = "ytp-menuitem" + (className ? "-" + className : "");
        return el.append(...append), el;
    }

    /**
     * @param {HTMLElement[]} elements
     */
    function removeAttributes(elements) {
        for (const element of elements) {
            element.textContent = "";
            for (const attr of element.attributes) {
                if (attr.name !== "class") element.removeAttribute(attr.name);
            }
        }
    }

    /**
     * @param {NodeListOf<HTMLElement>} element
     * @returns {HTMLElement}
     */
    function firstOnly(element) {
        for (let i = element.length; --i; ) element[i].remove();
        return element[0];
    }

    /**
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    function removeDisabled(element) {
        const query = "[disabled], [aria-disabled=true], [class*=disabled]";
        const items = [element, ...find(element, query, true)];

        for (const item of items) {
            item.removeAttribute("disabled");
            item.setAttribute("aria-disabled", false);
            item.className = item.className.replaceAll("disabled", "");
        }

        return element;
    }

    let selectedLabel = document.createTextNode("");

    /**
     * @param {Object} param
     * @param {HTMLElement} param.menuItem
     * @param {SVGSVGElement | undefined} [param.icon]
     * @param {string} [param.label]
     * @param {Boolean} [param.selected=true]
     */
    function parseItem({
        menuItem,
        icon = icons.quality,
        label = labels.quality,
        selected = true,
    }) {
        const item = body.appendChild(removeDisabled(menuItem.cloneNode(true)));
        const iIcon = firstOnly(find(item, "c3-icon, yt-icon", true));
        const iTexts = find(item, "[role=text], yt-formatted-string", true);
        const iText = firstOnly(iTexts);
        const optionLabel = iText.cloneNode();
        const optionIcon = iIcon.cloneNode();
        const wrapperIcon = (icon) => {
            return itemElement(
                " ythdp-icon yt-icon-shape yt-spec-icon-shape ytSpecIconShapeHost",
                [icon]
            );
        };

        item.setAttribute(proxyName, "");
        item.setAttribute("use-icons", "");
        iText.after(optionLabel, optionIcon);
        removeAttributes([iIcon, iText, optionIcon, optionLabel]);
        iText.textContent = label;

        if (icon) iIcon.append(wrapperIcon(icon.cloneNode(true)));
        if (selected) {
            optionIcon.append(wrapperIcon(icons.arrow));
            optionIcon.style.width = "18px";
            optionLabel.className = iTexts[iTexts.length - 1].className;
            optionLabel.style.marginInline = "auto 0";
            optionLabel.append(setTextQuality(selectedLabel));
            if (iTexts.length === 1) {
                optionLabel.style.fontSize = "1.4rem";
                optionLabel.style.opacity = "0.7";
            }
        } else optionIcon.remove();

        return item;
    }

    /**
     * @param {HTMLElement} menuItem
     * @returns {{items: HTMLElement[], preferredIndex: number}}
     */
    function listQualityToItem(menuItem) {
        const name = "preferred_quality";
        const tempIndex = listQuality.indexOf(options[name]);
        const preferredIndex = listQuality.length - 1 - tempIndex;
        const items = listQuality.map((quality, i) => {
            const icon = tempIndex === i && icons.check_mark;
            const label = quality + "p";
            const item = parseItem({ menuItem, icon, label, selected: false });
            item.addEventListener("click", () => {
                body.click();
                body.dispatchEvent(new Event("tap"));
                savePreferred(name, quality, element.movie_player(), true);
            });
            return item;
        });
        return { items: items.reverse(), preferredIndex };
    }

    /**
     * @param {HTMLElement} player
     */
    function addVideoListener(player) {
        const cache = caches.player[player.id];
        const video = find(player, "video");
        if (!cache || cache[1] !== video) {
            caches.player[player.id] = [player, video];
            const fn = setVideoQuality.bind(player);
            const types = ["playing", "resize"];
            types.forEach((type) => video.addEventListener(type, fn));
        }
    }

    /**
     * @param {'watch' | 'shorts' | 'embed'} [type]
     * @returns {boolean}
     */
    function isVideoPage(type) {
        const types = type || "watch shorts clip embed";
        return types.includes(location.pathname.split("/")[1] || "!");
    }

    function resetState() {
        manualOverride = false;
    }

    /**
     * @param {MouseEvent} ev
     * @param {string} query
     */
    function setManualOverride(ev, query) {
        const item = ev.target.closest?.(query);
        if (item) {
            const selected = parseQualityLabel(item.textContent);
            manualOverride = listQuality.includes(selected);
        }
    }

    function resizeWindow() {
        document.dispatchEvent(new Event("resize", { bubbles: true }));
    }

    async function syncOptions() {
        if ((await GM.getValue("updated_id")) !== options.updated_id) {
            await loadOptions(), togglePremium(), setTextQuality();
            for (const id in caches.player) {
                const [player, video] = caches.player[id];
                if (!video.paused) setVideoQuality.call(player);
            }
        }
    }

    if (options.show_ui) {
        (function checkOptions() {
            setTimeout(() => syncOptions().then(checkOptions), 1000);
        })();
    }

    (function music() {
        if (!isMusic) return;

        /**
         * @param {HTMLElement} menu
         * @returns {boolean}
         */
        function initPopup(menu) {
            const menuItem = find(menu, "ytmusic-menu-service-item-renderer");
            if (!menuItem) return false;

            const item = parseItem({ menuItem });
            const addItem = () => {
                if (settingsClicked && !menu.contains(item)) menu.append(item);
            };

            item.addEventListener("click", () => {
                menu.textContent = "";
                menu.append(...listQualityToItem(item).items);
                resizeWindow();
            });

            find(item, "yt-icon:last-child").style.marginLeft = 0;
            return !observer(addItem, menu, { childList: true });
        }

        function musicSetSettingsClicked(/** @type {MouseEvent} */ ev) {
            settingsClicked = !!ev.target.closest?.(
                "#main-panel [class*=menu], .middle-controls-buttons [class*=menu]"
            );
        }

        if (options.show_ui) {
            window.addEventListener("tap", musicSetSettingsClicked, true);
            window.addEventListener("click", musicSetSettingsClicked, true);
        }

        observer((_, observe) => {
            const player = element.movie_player();
            const menu = settingsClicked && element.popup();

            if (player && !caches.player[player.id]) addVideoListener(player);
            if ((menu && initPopup(menu)) || (!options.show_ui && player)) {
                observe.disconnect();
            }
        });
    })();

    (function mobile() {
        if (!isMobile && !isEmbed) return;

        let menuStep = 0;

        /**
         * @param {HTMLElement} container
         * @param {HTMLElement} item
         */
        function customMenu(container, item) {
            const menu = item.parentElement;
            const content = find(container, "[style*='max-height']");
            const { items, preferredIndex } = listQualityToItem(item);

            menu.textContent = "";
            menu.append(...items);

            const preferred = items[preferredIndex];
            const preferredHeight = preferred.offsetHeight;
            const scrollTarget =
                preferredHeight * preferredIndex -
                parseInt(content.style.maxHeight) / 2 +
                preferredHeight / 2;

            content.scrollTo(0, scrollTarget);
            resizeWindow();
        }

        function mobileQualityMenu() {
            const container = element.m_bottom_container();

            if (container) {
                settingsClicked = false;

                const menuItem =
                    find(container, "[role=menuitem]") ||
                    find(container, "[role=listitem]") ||
                    find(container, "ytm-menu-service-item-renderer");
                const item = parseItem({ menuItem });
                item.addEventListener("click", (ev) => {
                    menuStep = -1;
                    ev.stopPropagation();
                    customMenu(container, menuItem);
                });
                menuItem.parentElement.append(item);
            }
        }

        function mobileSetSettingsClicked(/** @type {MouseEvent} */ ev) {
            if (isVideoPage() && !element.m_bottom_container()) {
                settingsClicked = !!ev.target.closest?.(
                    "player-top-controls .player-settings-icon, shorts-video ytm-bottom-sheet-renderer"
                );
            }
        }

        function mobileSetOverride(ev) {
            if (manualOverride) return;
            if (!element.m_bottom_container()) menuStep = 0;
            if (menuStep++ >= 2) setManualOverride(ev, "[role=menuitem]");
        }

        function mobilePlayerUpdated(/** @type {CustomEvent} */ ev) {
            if (isVideoPage() && ev.detail.type === "newdata") resetState();
        }

        const videoIdRegex = /(?:shorts\/|watch\?v=|clip\/)([^#&?]*)/;

        /**
         * @returns {boolean | string}
         */
        function getVideoId() {
            const id = element.link().href.match(videoIdRegex);
            return !!id && location.href.includes(id[0]) && id[1];
        }

        function registerPlayer() {
            const player = element.movie_player();

            if (player) {
                addVideoListener(player);

                if (
                    player.closest("[playable=true]") &&
                    player.className.includes("unstarted-mode")
                ) {
                    const id = getVideoId();
                    const elemId = player.id;

                    if (id) {
                        if (element.offline()) API(elemId, "loadVideoById", id);
                        API(elemId, "playVideo");
                    }
                }
            }
        }

        if (options.show_ui) {
            window.addEventListener("click", mobileSetSettingsClicked, true);
        }

        window.addEventListener("click", mobileSetOverride, true);
        document.addEventListener("video-data-change", mobilePlayerUpdated);

        observer(() => {
            if (!isEmbed && isVideoPage()) registerPlayer();
            if (settingsClicked) mobileQualityMenu();
        });
    })();

    (function desktop() {
        if (isMusic || isMobile) return;

        /**
         * @param {SVGElement} svg
         * @param {string} textLabel
         * @param {Boolean} [checkbox]
         * @returns {{item: HTMLDivElement, content: HTMLDivElement}}
         */
        function createMenuItem(svg, textLabel, checkbox) {
            const inner = checkbox ? [itemElement("toggle-checkbox")] : [];
            const content = itemElement("content", inner);
            const label = itemElement("label", [textLabel]);
            const icon = itemElement("icon ythdp-icon", [svg.cloneNode(true)]);
            return { item: itemElement("", [icon, label, content]), content };
        }

        /**
         * @param {HTMLElement} item
         * @param {HTMLElement} player
         * @returns {HTMLElement}
         */
        function premiumOption(item, player) {
            const name = "preferred_premium";
            const toggle = find(item, "[role=button]") || item;
            item.addEventListener("click", () => {
                savePreferred(name, !options[name], player);
            });
            return togglePremium(toggle);
        }

        /**
         * @param {HTMLElement} player
         * @returns {HTMLElement}
         */
        function premiumMenu(player) {
            return premiumOption(
                createMenuItem(icons.premium, labels.premium, true).item,
                player
            );
        }

        /**
         * @returns {HTMLElement}
         */
        function shortPremiumItem() {
            const item = parseItem({
                menuItem: find(body, "ytd-toggle-menu-service-item-renderer"),
                label: labels.premium,
                icon: icons.premium,
                selected: false,
            });
            item.classList.add("ythdp-toggle");
            find(item, ".toggle-label").textContent = "";
            premiumOption(item, element.short_player());
            return item;
        }

        /**
         * @param {HTMLElement} content
         * @param {HTMLElement} player
         */
        function qualityOption(content, player) {
            const name = "preferred_quality";
            const text = document.createTextNode("");

            content.style.cursor = "pointer";
            content.style.wordSpacing = "2rem";
            content.append("< ", text, " >");
            content.addEventListener("click", (ev) => {
                const threshold = content.clientWidth / 2;
                const contentLeft = content.getBoundingClientRect().left;
                const clickPos = ev.clientX - contentLeft;
                const length = listQuality.length - 1;
                let pos = listQuality.indexOf(options[name]);

                if (
                    (clickPos < threshold && pos > 0 && pos--) ||
                    (clickPos > threshold && pos < length && ++pos)
                ) {
                    savePreferred(name, listQuality[pos], player, true);
                }
            });

            setTextQuality(text);
        }

        /**
         * @param {HTMLElement} player
         * @returns {HTMLElement}
         */
        function qualityMenu(player) {
            const menu = createMenuItem(icons.quality, labels.quality);

            menu.item.style.cursor = "default";
            menu.content.style.fontSize = "130%";

            qualityOption(menu.content, player);
            return menu.item;
        }

        /**
         * @returns {HTMLElement}
         */
        function shortQualityItem() {
            const menuItem = find(body, "ytd-menu-service-item-renderer");
            const item = parseItem({ menuItem, selected: false });
            const container = find(item, "yt-formatted-string:last-of-type");
            const option = document.createElement("div");

            item.style.userSelect = "none";
            item.style.cursor = "default";
            container.append(option);
            container.style.minWidth = "130px";
            option.style.margin = container.style.margin = "0 auto";
            option.style.width = "fit-content";

            qualityOption(option, element.short_player());
            return item;
        }

        function setOverride(ev) {
            if (!manualOverride) setManualOverride(ev, "[role=menuitemradio]");
        }

        function playerUpdated(/** @type {CustomEvent} */ ev) {
            if (isVideoPage()) {
                const player = [
                    element.movie_player(),
                    element.short_player(),
                ].find((player) => ev.target.contains(player));

                if (player) {
                    resetState();
                    addVideoListener(player);
                }
            }
        }

        function attachShortMenuItem(/** @type {MouseEvent} */ ev) {
            if (isVideoPage("shorts") && ev.target.closest("#menu-button")) {
                const menu = element.popup();
                const items = [shortPremiumItem(), shortQualityItem()];
                const addItems = () => {
                    if (!menu.contains(items[0])) menu.append(...items);
                };
                observer(addItems, menu, { childList: true });
                window.removeEventListener("click", attachShortMenuItem);
            }
        }

        if (options.show_ui && !isEmbed) {
            window.addEventListener("click", attachShortMenuItem);
        }

        /**
         * @param {HTMLElement} player
         */
        function attachDesktopSettings(player) {
            addVideoListener(player);
            if (options.show_ui) {
                const settings = find(player, ".ytp-settings-menu");
                if (settings) {
                    const panel = find(settings, ".ytp-panel-menu");
                    panel.append(premiumMenu(player), qualityMenu(player));
                    settings.addEventListener("click", setOverride, true);
                }
            }
        }

        let c4Player = null;

        /** Special case for c4-player  */
        observer(() => {
            const player = document.getElementById("c4-player");
            if (player && c4Player !== player) attachDesktopSettings(player);
            c4Player = player;
        });

        observer((_, observe) => {
            const moviePlayer = element.movie_player();
            const shortPlayer = element.short_player();

            if (shortPlayer) addVideoListener(shortPlayer);
            if (moviePlayer) {
                observe.disconnect();
                document.addEventListener("yt-player-updated", playerUpdated);
                attachDesktopSettings(moviePlayer);
            }
        });
    })();
})();
