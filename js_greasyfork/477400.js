// ==UserScript==
// @name         DiscordColorways
// @version      5.6.0
// @description  The Definitive way of styling Discord and select themes
// @author       DaBluLite
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @namespace    https://github.com/DaBluLite/DiscordColorways
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477400/DiscordColorways.user.js
// @updateURL https://update.greasyfork.org/scripts/477400/DiscordColorways.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var _mods_unparsed = webpackChunkdiscord_app.push([[Symbol("DiscordColorways")], {}, e => e]);
    var _mods_cache = _mods_unparsed.c;
    var _mods = Object.values(_mods_cache);
    webpackChunkdiscord_app.pop();

    function find(filter, { isIndirect = false, isWaitFor = false } = {}) {
        if (typeof filter !== "function")
            throw new Error("Invalid filter. Expected a function got " + typeof filter);

        for (const key in _mods_cache) {
            const mod = _mods_cache[key];
            if (!mod?.exports) continue;

            if (filter(mod.exports)) {
                return isWaitFor ? [mod.exports, Number(key)] : mod.exports;
            }

            if (typeof mod.exports !== "object") continue;

            if (mod.exports.default && filter(mod.exports.default)) {
                const found = mod.exports.default;
                return isWaitFor ? [found, Number(key)] : found;
            }

            // the length check makes search about 20% faster
            for (const nestedMod in mod.exports) if (nestedMod.length <= 3) {
                const nested = mod.exports[nestedMod];
                if (nested && filter(nested)) {
                    return isWaitFor ? [nested, Number(key)] : nested;
                }
            }
        }

        if (!isIndirect) {
            console.error('"find" found no module');
            return null;
        }

        return isWaitFor ? [null, null] : null;
    }

    const filters = {
        byProps: (...props) =>
            props.length === 1
                ? m => m[props[0]] !== void 0
                : m => props.every(p => m[p] !== void 0),

        byCode: (...code) => m => {
            if (typeof m !== "function") return false;
            const s = Function.prototype.toString.call(m);
            for (const c of code) {
                if (!s.includes(c)) return false;
            }
            return true;
        },
        byStoreName: (name) => m => m.constructor?.displayName === name,
        bySource: (...fragments) => {
            return (target) => {
                while (target instanceof Object && "$$typeof" in target) {
                    target = target.render ?? target.type;
                }
                if (target instanceof Function) {
                    const source = target.toString();
                    const renderSource = target.prototype?.render?.toString();
                    return fragments.every((fragment) => typeof fragment === "string" ? (source.includes(fragment) || renderSource?.includes(fragment)) : (fragment(source) || renderSource && fragment(renderSource)));
                }
                else {
                    return false;
                }
            };
        },
        byKeys: (...keys) => {
            return (target) => target instanceof Object && keys.every((key) => key in target);
        }
    };

    function findByCode(...code) {
        const res = find(filters.byCode(...code), { isIndirect: true });
        if (!res) {
            console.error('"findByCode" found no module');
            return null;
        }
        return res;
    }

    function findByProps(...props) {
        const res = find(filters.byProps(...props), { isIndirect: true });
        if (!res) {
            console.error('"findByProps" found no module');
            return null;
        }
        return res;
    }

    function waitFor(filter, callback) {
        if (typeof filter === "string")
            filter = filters.byProps(filter);
        else if (Array.isArray(filter))
            filter = filters.byProps(...filter);
        else if (typeof filter !== "function")
            throw new Error("filter must be a string, string[] or function, got " + typeof filter);

        const [existing, id] = find(filter, { isIndirect: true, isWaitFor: true });
        if (existing) return void callback(existing, id);

        subscriptions.set(filter, callback);
    }

    function waitForStore(name, cb) {
        waitFor(filters.byStoreName(name), cb);
    }

    function findAll(filter) {
        if (typeof filter !== "function")
            throw new Error("Invalid filter. Expected a function got " + typeof filter);

        const ret = [];
        for (const key in _mods_cache) {
            const mod = _mods_cache[key];
            if (!mod?.exports) continue;

            if (filter(mod.exports))
                ret.push(mod.exports);
            else if (typeof mod.exports !== "object")
                continue;

            if (mod.exports.default && filter(mod.exports.default))
                ret.push(mod.exports.default);
            else for (const nestedMod in mod.exports) if (nestedMod.length <= 3) {
                const nested = mod.exports[nestedMod];
                if (nested && filter(nested)) ret.push(nested);
            }
        }

        return ret;
    }

    const { ModalRoot, ModalContent, ModalHeader, ModalFooter, openModal, TextInput, Tooltip, FormTitle, Text, Button, Switch, showToast, ScrollerThin, FormSection } = findByProps("ModalRoot");
    const ModalText = findByProps("ModalRoot").Text;
    const React = findByProps("createContext");
    const PillContainer = findByCode("hovered", "selected");
    const subscriptions = new Map();
    const listeners = new Set();
    const { marginBottom20 } = findByProps("marginBottom20");

    const plugin = {
        name: "DiscordColorways",
        description:
            "A plugin that offers easy access to simple color schemes/themes for Discord, also known as Colorways",
        pluginVersion: "5.6.0",
        creatorVersion: "1.15",
        makeSettingsCategories: ({ ID }) => {
            return [
                {
                    section: ID.HEADER,
                    label: "Discord Colorways",
                    className: "vc-settings-header"
                },
                {
                    section: "ColorwaysSelector",
                    label: "Colors",
                    element: SelectorSettingsTab,
                    className: "dc-colorway-selector"
                },
                {
                    section: "ColorwaysSettings",
                    label: "Settings & Tools",
                    element: ColorwaySelectorBtn,
                    className: "dc-colorway-settings"
                },
                {
                    section: ID.DIVIDER
                }
            ].filter(Boolean);
        },
        ColorwaysBtn: [React.createElement(ColorwaySelectorBtn)],
        ColorwaysBtnBottom: [React.createElement(ColorwaySelectorBtn, { position: "bottom" })],
        patches: [
            {
                find: "Messages.ACTIVITY_SETTINGS",
                replacement: [{
                    match: /\{section:([a-zA-Z])\.ID\.HEADER,\s*label:([a-zA-Z])\.[a-zA-Z]\.Messages\.BILLING_SETTINGS\}/,
                    replace: "...DiscordColorways_plugin.makeSettingsCategories($1),$&"
                }],
                plugin: "DiscordColorways"
            },
            {
                find: "Messages.SERVERS,children",
                replacement: [{
                    match: /(Messages\.SERVERS,children:)(.+?default:return null\}\}\)\))/,
                    replace: "$1DiscordColorways_plugin.ColorwaysBtn.concat($2).concat(DiscordColorways_plugin.ColorwaysBtnBottom)"
                }],
                plugin: "DiscordColorways"
            }
        ]
    };

    globalThis.DiscordColorways_plugin = { ...plugin };

    class DataStore {
        defaultGetStoreFunc;
        promisifyRequest = (request) => {
            return new Promise((resolve, reject) => {
                request.oncomplete = request.onsuccess = () => resolve(request.result);
                request.onabort = request.onerror = () => reject(request.error);
            });
        };
        createStore = (dbName, storeName) => {
            const request = indexedDB.open(dbName);
            request.onupgradeneeded = () => request.result.createObjectStore(storeName);
            const dbp = this.promisifyRequest(request);

            return (txMode, callback) =>
                dbp.then(db =>
                    callback(db.transaction(storeName, txMode).objectStore(storeName))
                );
        };
        defaultGetStore = () => {
            if (!this.defaultGetStoreFunc) {
                this.defaultGetStoreFunc = this.createStore("ColorwaysData", "ColorwaysStore");
            }
            return this.defaultGetStoreFunc;
        };
        get = (key, customStore = this.defaultGetStore()) => {
            return customStore("readonly", store => this.promisifyRequest(store.get(key)));
        };
        set = (key, value, customStore = this.defaultGetStore()) => {
            return customStore("readwrite", store => {
                store.put(value, key);
                return this.promisifyRequest(store.transaction);
            });
        };
        setMany = (entries, customStore = this.defaultGetStore()) => {
            return customStore("readwrite", store => {
                entries.forEach(entry => store.put(entry[1], entry[0]));
                return this.promisifyRequest(store.transaction);
            });
        };
        getMany = (keys, customStore = this.defaultGetStore()) => {
            return customStore("readonly", store =>
                Promise.all(keys.map(key => this.promisifyRequest(store.get(key))))
            );
        };
        update = (key, updater, customStore = this.defaultGetStore()) => {
            return customStore(
                "readwrite",
                store =>
                    new Promise((resolve, reject) => {
                        store.get(key).onsuccess = function () {
                            try {
                                store.put(updater(this.result), key);
                                resolve(this.promisifyRequest(store.transaction));
                            } catch (err) {
                                reject(err);
                            }
                        };
                    })
            );
        };
        del = (key, customStore = this.defaultGetStore()) => {
            return customStore("readwrite", store => {
                store.delete(key);
                return this.promisifyRequest(store.transaction);
            });
        };
        delMany = (keys, customStore = this.defaultGetStore()) => {
            return customStore("readwrite", store => {
                keys.forEach(key => store.delete(key));
                return this.promisifyRequest(store.transaction);
            });
        };
        clear = (customStore = this.defaultGetStore()) => {
            return customStore("readwrite", store => {
                store.clear();
                return this.promisifyRequest(store.transaction);
            });
        };
        eachCursor = (store, callback) => {
            store.openCursor().onsuccess = function () {
                if (!this.result) return;
                callback(this.result);
                this.result.continue();
            };
            return this.promisifyRequest(store.transaction);
        };
        keys = (customStore = this.defaultGetStore()) => {
            return customStore("readonly", store => {
                // Fast path for modern browsers
                if (store.getAllKeys) {
                    return this.promisifyRequest(store.getAllKeys());
                }

                const items = [];

                return this.eachCursor(store, cursor => items.push(cursor.key)).then(() => items);
            });
        };
        values = (customStore = this.defaultGetStore()) => {
            return customStore("readonly", store => {
                if (store.getAll) {
                    return this.promisifyRequest(store.getAll());
                }

                const items = [];

                return this.eachCursor(store, cursor => items.push(cursor.value)).then(
                    () => items
                );
            });
        };
        entries = (customStore = this.defaultGetStore()) => {
            return customStore("readonly", store => {
                if (store.getAll && store.getAllKeys) {
                    return Promise.all([
                        this.promisifyRequest(store.getAllKeys()),
                        this.promisifyRequest(store.getAll())
                    ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));
                }

                const items = [];

                return customStore("readonly", store =>
                    this.eachCursor(store, cursor => items.push([cursor.key, cursor.value])).then(
                        () => items
                    )
                );
            });
        };
    }

    class ColorwayCSS {
        get = () => { return { name: document.getElementById("activeColorwayCSS")?.getAttribute("data-colorway-id") || "", css: document.getElementById("activeColorwayCSS")?.textContent || "" }; };
        set = (e, t) => {
            if (!document.getElementById("activeColorwayCSS")) {
                var activeColorwayCSS = document.createElement("style");
                activeColorwayCSS.id = "activeColorwayCSS";
                activeColorwayCSS.textContent = e;
                activeColorwayCSS.setAttribute("data-colorway-id", t);
                document.head.append(activeColorwayCSS);
            } else {
                document.getElementById("activeColorwayCSS").textContent = e;
                document.getElementById("activeColorwayCSS").setAttribute("data-colorway-id", t);
            }
        };
        remove = () => document.getElementById("activeColorwayCSS").remove();
        openSelectorModal = () => openModal(props => React.createElement(SelectorModal, { modalProps: props }));
    };

    const [colorwayCSS, dataStore] = [new ColorwayCSS(), new DataStore()];

    var SelectedChannelStore, SelectedGuildStore, UserStore;
    const WEBPACK_CHUNK = "webpackChunkdiscord_app";
    let webpackChunk;
    if (window[WEBPACK_CHUNK]) {
        patchPush();
    } else {
        Object.defineProperty(window, WEBPACK_CHUNK, {
            get: () => webpackChunk,
            set: v => {
                if (v?.push !== Array.prototype.push) {
                    console.info(`Patching ${WEBPACK_CHUNK}.push`);
                    _mods_unparsed = v.push([[Symbol("DiscordColorways")], {}, e => e]);
                    patchPush();
                    delete window[WEBPACK_CHUNK];
                    window[WEBPACK_CHUNK] = v;
                }
                webpackChunk = v;
            },
            configurable: true
        });
    }

    function patchPush() {
        function handlePush(chunk) {
            try {
                const modules = chunk[1];
                const patches = plugin.patches;

                for (const id in modules) {
                    let mod = modules[id];
                    let code = mod.toString().replaceAll("\n", "");
                    if (code.startsWith("function(")) {
                        code = "0," + code;
                    }
                    const originalMod = mod;
                    const patchedBy = new Set();

                    const factory = modules[id] = function (module, exports, require) {
                        try {
                            mod(module, exports, require);
                        } catch (err) {
                            if (mod === originalMod) throw err;

                            console.error("Error in patched chunk", err);
                            return void originalMod(module, exports, require);
                        }

                        if (module.exports === window) {
                            Object.defineProperty(require.c, id, {
                                value: require.c[id],
                                enumerable: false,
                                configurable: true,
                                writable: true
                            });
                            return;
                        }

                        const numberId = Number(id);

                        for (const callback of listeners) {
                            try {
                                callback(exports, numberId);
                            } catch (err) {
                                console.error("Error in webpack listener", err);
                            }
                        }

                        for (const [filter, callback] of subscriptions) {
                            try {
                                if (filter(exports)) {
                                    subscriptions.delete(filter);
                                    callback(exports, numberId);
                                } else if (typeof exports === "object") {
                                    if (exports.default && filter(exports.default)) {
                                        subscriptions.delete(filter);
                                        callback(exports.default, numberId);
                                    }

                                    for (const nested in exports) if (nested.length <= 3) {
                                        if (exports[nested] && filter(exports[nested])) {
                                            subscriptions.delete(filter);
                                            callback(exports[nested], numberId);
                                        }
                                    }
                                }
                            } catch (err) {
                                console.error("Error while firing callback for webpack chunk", err);
                            }
                        }
                    };
                    try {
                        factory.toString = () => mod.toString();
                        factory.original = originalMod;
                    } catch { }

                    for (let i = 0; i < patches.length; i++) {
                        const patch = patches[i];
                        if (patch.predicate && !patch.predicate()) continue;

                        if (code.includes(patch.find)) {
                            patchedBy.add(patch.plugin);
                            for (const replacement of patch.replacement) {
                                if (replacement.predicate && !replacement.predicate()) continue;
                                const lastMod = mod;
                                const lastCode = code;

                                try {
                                    const newCode = code.replace(replacement.match, replacement.replace);
                                    if (newCode === code && !patch.noWarn) {
                                        console.warn(`Patch by ${patch.plugin} had no effect (Module id is ${id}): ${replacement.match}`);
                                    } else {
                                        code = newCode;
                                        mod = (0, eval)(`// Webpack Module ${id} - Patched by ${[...patchedBy].join(", ")}\n${newCode}\n//# sourceURL=WebpackModule${id}`);
                                    }
                                } catch (err) {
                                    console.error(`Patch by ${patch.plugin} errored (Module id is ${id}): ${replacement.match}\n`, err);

                                    code = lastCode;
                                    mod = lastMod;
                                    patchedBy.delete(patch.plugin);
                                }
                            }

                            if (!patch.all) patches.splice(i--, 1);
                        }
                    }
                }
            } catch (err) {
                console.error("Error in handlePush", err);
            }

            return handlePush.original.call(window[WEBPACK_CHUNK], chunk);
        }

        handlePush.original = window[WEBPACK_CHUNK].push;
        Object.defineProperty(window[WEBPACK_CHUNK], "push", {
            get: () => handlePush,
            set: v => (handlePush.original = v),
            configurable: true
        });
    }

    waitForStore("SelectedChannelStore", m => SelectedChannelStore = m);
    waitForStore("SelectedGuildStore", m => SelectedGuildStore = m);
    waitForStore("UserStore", s => UserStore = s);

    async function openUserProfile(userId) {
        const getUser = findByCode(".USER(");
        const openProfile = findByCode("friendToken", "USER_PROFILE_MODAL_OPEN");
        const guildId = SelectedGuildStore.getGuildId();
        const channelId = SelectedChannelStore.getChannelId();

        await getUser(userId);
        openProfile({
            userId,
            guildId,
            channelId,
            analyticsLocation: {
                page: guildId ? "Guild Channel" : "DM Channel",
                section: "Profile Popout"
            }
        });
    }

    var pluginCSS = `
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.ColorwaySelectorBtn {
    height: 48px;
    width: 48px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .15s ease-out;
    background-color: var(--background-primary);
    cursor: pointer;
    color: var(--text-normal);
}

.ColorwaySelectorBtn:hover {
    background-color: var(--brand-experiment);
    border-radius: 16px;
}

.ColorwaySelectorBtn_green:not(:hover) .vc-pallete-icon {
    color: var(--green-360);
}

.ColorwaySelectorBtn_green:hover {
    background-color: var(--green-360);
}

.discordColorway {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    flex-flow: wrap;
    flex-direction: row;
    position: relative;
    align-items: center;
    justify-content: center;
    transition: .1s;
    box-shadow: inset 0 0 0 1px var(--interactive-normal);
}

.discordColorway:hover {
    box-shadow: inset 0 0 0 1px var(--interactive-active);
}

.discordColorwayPreviewColorContainer {
    display: flex;
    flex-flow: wrap;
    flex-direction: row;
    overflow: hidden;
    border-radius: 50%;
    width: 56px;
    height: 56px;
}

.discordColorway.active {
    box-shadow: inset 0 0 0 2px var(--brand-500), inset 0 0 0 4px var(--background-primary);
}

.discordColorway.active .discordColorwayPreviewColorContainer {
    width: 52px;
    height: 52px;
}

.discordColorwayPreviewColor {
    width: 50%;
    height: 50%;
}

.discordColorway.active>.discordColorwayPreviewColor {
    width: 30px;
    height: 30px;
}

.discordColorwayPreviewColorContainer:not(:has(>.discordColorwayPreviewColor:nth-child(2)))>.discordColorwayPreviewColor {
    height: 100%;
    width: 100%;
}

.discordColorwayPreviewColorContainer:not(:has(>.discordColorwayPreviewColor:nth-child(3)))>.discordColorwayPreviewColor {
    height: 100%;
}

.discordColorwayPreviewColorContainer:not(:has(>.discordColorwayPreviewColor:nth-child(4)))>.discordColorwayPreviewColor:nth-child(3) {
    width: 100%;
}

.ColorwaySelectorWrapper {
    position: relative;
    display: flex;
    gap: 16px 24px;
    width: 100%;
    flex-wrap: wrap;
}

.colorwaySelectorModal {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--background-tertiary);
    box-shadow: var(--dark-elevation-high) !important;
    min-width: 596px;
}

.colorwaySelectorModalContent {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 596px;
    overflow: visible !important;
    padding: 16px !important;
    padding-right: 16px !important;
}

.ColorwaySelectorBtnContainer {
    position: relative;
    margin: 0 0 8px;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 72px;
}

.colorwayCheckIconContainer {
    height: 20px;
    width: 20px;
    background-color: var(--brand-500);
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    opacity: 0;
    z-index: +1;
}

.discordColorway.active .colorwayCheckIconContainer {
    opacity: 1;
}

.colorwayCheckIcon {
    height: 20px;
    width: 20px;
    color: var(--white-500);
}

.colorwayInfoIconContainer {
    height: 20px;
    width: 20px;
    background-color: var(--brand-500);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    opacity: 0;
    z-index: +1;
}

.colorwayInfoIconContainer:hover {
    background-color: var(--brand-700);
}

.discordColorway:hover .colorwayInfoIconContainer {
    opacity: 1;
    transition: .15s;
}

.colorwayInfoIcon {
    height: 20px;
    width: 20px;
    color: var(--white-500);
    padding: 2px;
}

.colorwayCreator-swatch {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 4px;
    box-sizing: border-box;
    border: none;
    width: 100%;
    position: relative;
    color: #fff;
}

.colorwayCreator-swatchName {
    color: currentcolor;
    pointer-events: none;
}

.colorwayCreator-colorPreviews {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
    position: relative;
}

.colorwayCreator-colorInput {
    width: 1px;
    height: 1px;
    opacity: 0;
    position: absolute;
    pointer-events: none;
}

.colorwayCreator-menuWrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 20px 16px !important;
    overflow: visible !important;
}

.colorwayCreator-modal {
    width: 620px;
    max-width: 620px;
    max-height: unset !important;
}

.colorways-creator-module-warning {
    width: 100%;
    text-align: center;
}

.colorways-creator-module-warning~.colorways-creator-module-warning {
    display: none;
}

.colorwayCreator-colorPreviews>.colorSwatch-2UxEuG,
.colorwayCreator-colorPreviews>.colorSwatch-2UxEuG>.swatch-efj8wq {
    width: 100%;
    border: none;
    position: relative;
}

.colorwaysPicker-colorLabel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.colorwayCreator-colorPreviews>.colorSwatch-2UxEuG:has([fill="var(--primary-530)"])>.colorwaysPicker-colorLabel {
    color: var(--primary-530);
}

.colorwaySelector-noDisplay {
    display: none;
}

.colorwayInfo-wrapper {
    display: flex;
    flex-direction: column;
    color: var(--header-primary);
}

.colorwayInfo-colorSwatches {
    width: 100%;
    height: 46px;
    display: flex;
    flex-direction: row;
    margin: 12px 0;
    gap: 8px;
}

.colorwayInfo-colorSwatch {
    display: flex;
    width: 100%;
    height: 46px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
}

.colorwayInfo-row {
    font-weight: 400;
    font-size: 20px;
    color: var(--header-secondary);
    margin-bottom: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border-radius: 4px;
    background-color: var(--background-secondary);
    padding: 8px 12px;
}

.colorwayInfo-css {
    flex-direction: column;
    align-items: start;
}

.colorwayInfo-cssCodeblock {
    border-radius: 4px;
    border: 1px solid var(--background-accent);
    padding: 3px 6px;
    white-space: pre;
    max-height: 400px;
    overflow: auto;
    font-size: 0.875rem;
    line-height: 1.125rem;
    width: 100%;
    box-sizing: border-box;
}

.colorwayInfo-cssCodeblock::-webkit-scrollbar,
.colorwayToolbox-itemList::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.colorwayInfo-cssCodeblock::-webkit-scrollbar-corner,
.colorwayToolbox-itemList::-webkit-scrollbar-corner {
    background-color: transparent;
}

.colorwayInfo-cssCodeblock::-webkit-scrollbar-thumb,
.colorwayToolbox-itemList::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-auto-thumb);
    min-height: 40px;
}

.colorwayInfo-cssCodeblock::-webkit-scrollbar-thumb,
.colorwayInfo-cssCodeblock::-webkit-scrollbar-track,
.colorwayToolbox-itemList::-webkit-scrollbar-thumb,
.colorwayToolbox-itemList::-webkit-scrollbar-track {
    border: 2px solid transparent;
    background-clip: padding-box;
    border-radius: 8px;
}

.colorwayInfo-cssCodeblock::-webkit-scrollbar-track,
.colorwayToolbox-itemList::-webkit-scrollbar-track {
    margin-bottom: 8px;
}

.colorwaysCreator-settingCat {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 5px;
    border-radius: 4px;
    background-color: var(--background-secondary);
    box-sizing: border-box;
    color: var(--header-secondary);
    max-height: 250px;
    overflow: hidden overlay;
}

.colorwaysCreator-settingItm {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 8px;
    justify-content: space-between;
}

.colorwaysCreator-settingItm:hover {
    background-color: var(--background-modifier-hover);
}

.colorwaysCreator-settingsList .colorwaysCreator-preset {
    justify-content: start;
    gap: 8px;
}

.colorwaysCreator-settingsList {
    overflow: auto;
    max-height: 185px;
}

.colorwaysCreator-settingCat-collapsed>.colorwaysCreator-settingsList {
    display: none;
}

.colorwaysCreator-noHeader {
    margin-top: 12px;
    margin-bottom: 12px;
}

.colorwaysCreator-noMinHeight {
    min-height: unset;
    height: fit-content;
}

.colorwaysPreview-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 270px;
    flex: 1 0 auto;
    border-radius: 4px;
    overflow: hidden;
}

.colorwaysPreview-modal {
    max-width: unset !important;
    max-height: unset !important;
    width: fit-content;
    height: fit-content;
}

.colorwaysPreview-titlebar {
    height: 22px;
    width: 100%;
    display: flex;
    flex: 1 0 auto;
}

.colorwaysPreview-body {
    height: 100%;
    width: 100%;
    display: flex;
}

.colorwayPreview-guilds {
    width: 72px;
    height: 100%;
    display: flex;
    flex: 1 0 auto;
    padding-top: 4px;
    flex-direction: column;
}

.colorwayPreview-channels {
    width: 140px;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    border-top-left-radius: 8px;
    flex: 1 0 auto;
}

.colorwaysPreview-wrapper:fullscreen .colorwayPreview-channels {
    width: 240px;
}

.colorwayPreview-chat {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column-reverse;
}

.colorwayPreview-userArea {
    width: 100%;
    height: 40px;
    display: flex;
    flex: 1 0 auto;
}

.colorwaysPreview-wrapper:fullscreen .colorwayPreview-userArea {
    height: 52px;
}

.colorwaysPreview {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 5px;
    border-radius: 4px;
    background-color: var(--background-secondary);
    box-sizing: border-box;
    color: var(--header-secondary);
    overflow: hidden overlay;
    margin-bottom: 4px;
}

.colorwaysPreview-collapsed .colorwaysPreview-container {
    display: none;
}

.colorwayInfo-lastCat,
.colorwaysCreator-lastCat {
    margin-bottom: 12px;
}

.colorwayPreview-guild {
    width: 100%;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
}

.colorwayPreview-guildItem {
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 50px;
    transition: .2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}

.colorwayPreview-guildItem:hover {
    border-radius: 16px;
}

.colorwayPreview-guildSeparator {
    width: 32px;
    height: 2px;
    opacity: .48;
    border-radius: 1px;
}

.colorwayToolbox-listItem {
    align-items: center;
    display: flex;
    border-radius: 4px;
    color: var(--interactive-normal);
    padding: 8px;
    margin: 0 -4px;
}

.colorwayToolbox-listItem:hover {
    background-color: var(--brand-experiment);
    color: var(--white-500);
    cursor: pointer;
}

.colorwayToolbox-title {
    align-items: center;
    display: flex;
    text-transform: uppercase;
    margin-top: 2px;
    padding-bottom: 8px;
    margin-bottom: 0;
}

.colorwayToolbox-list {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.colorwayToolbox-itemList {
    overflow: hidden auto;
    height: 100%;
    padding: 12px;
    padding-top: 0;
}

.colorwayToolbox-search {
    margin: 12px;
    margin-bottom: 0;
}

.colorwayToolbox-itemList::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
}

.colorwayPreview-chatBox {
    height: 32px;
    border-radius: 6px;
    margin: 8px;
    margin-bottom: 12px;
    margin-top: 0;
    flex: 1 0 auto;
}

.colorwayPreview-filler {
    width: 100%;
    height: 100%;
}

.colorwayPreview-topShadow {
    box-shadow: 0 1px 0 hsl(var(--primary-900-hsl)/20%), 0 1.5px 0 hsl(var(--primary-860-hsl)/5%), 0 2px 0 hsl(var(--primary-900-hsl)/5%);
    width: 100%;
    height: 32px;
    flex: 1 0 auto;
    transition: background-color .1s linear;
    font-family: var(--font-display);
    font-weight: 500;
    padding: 12px 16px;
    box-sizing: border-box;
    align-items: center;
    display: flex;
}

.colorwayPreview-channels>.colorwayPreview-topShadow {
    border-top-left-radius: 8px;
}

.colorwayPreview-channels>.colorwayPreview-topShadow:hover {
    background-color: hsl(var(--primary-500-hsl)/30%);
}

.colorwaysPreview-wrapper:fullscreen .colorwayPreview-topShadow {
    height: 48px;
}

.colorwaysPreview-wrapper:fullscreen .colorwayPreview-chatBox {
    height: 44px;
    border-radius: 8px;
    margin: 16px;
    margin-bottom: 24px;
}

.colorwaysBtn-tooltipContent {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
}

.colorwaySelector-headerIcon {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    transition: transform .1s ease-out, opacity .1s ease-out;
    color: var(--interactive-normal);
}

.colorwaySelector-header {
    align-items: center;
    justify-content: center;
    padding-bottom: 0;
    box-shadow: none !important;
}

.colorwaySelector-search {
    width: 100%;
    height: 32px;
}

.colorwaySelector-searchInput {
    height: 32px;
    border-radius: 50px;
    border: 1px solid transparent;
    transition: .15s ease;
    padding: 0 12px;
}

.colorwaySelector-searchInput:hover {
    border-color: transparent;
}

.colorwaySelector-headerBtn {
    position: absolute;
    top: 64px;
    right: 20px;
}

.colorwaySelector-pill {
    border-radius: 20px;
    background-color: var(--background-tertiary);
    border: 1px solid transparent;
    box-sizing: border-box;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    height: 32px;
    overflow: hidden;
    color: var(--text-normal);
    cursor: pointer;
    transition: .15s ease
}

.colorwaySelector-pillWrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.colorwaySelector-doublePillBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.theme-light .colorwaySelector-pill_selected,
.theme-light .colorwaySelector-pill:hover,
.theme-light .colorwaySelector-searchInput:focus {
    border-color: var(--brand-500);
    background-color: var(--brand-experiment-160);
}

.theme-dark .colorwaySelector-pill_selected,
.theme-dark .colorwaySelector-pill:hover,
.theme-dark .colorwaySelector-searchInput:focus {
    border-color: var(--brand-500);
    background-color: var(--brand-experiment-15a);
}

.colorwaysTooltip-tooltipPreviewRow {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.colorwaysTooltip-header {
    background-color: var(--background-primary);
    padding: 2px 8px;
    border-radius: 16px;
    height: min-content;
    color: var(--header-primary);
    margin-bottom: 2px;
    display: inline-flex;
    margin-left: -4px;
}

.colorwaySelector-pillSeparator {
    height: 24px;
    width: 1px;
    background-color: var(--primary-400);
}

.colorwaysSelector-infoRow {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
}

.colorwaysSelector-changelog {
    font-weight: 400;
    font-size: 20px;
    color: var(--header-secondary);
    border-radius: 4px;
    background-color: var(--background-secondary);
    padding: 8px 12px;
}

.colorwaysChangelog-li {
    position: relative;
    font-size: 16px;
    line-height: 20px;
}

.colorwaysChangelog-li::before {
    content: "";
    position: absolute;
    top: 10px;
    left: -15px;
    width: 6px;
    height: 6px;
    margin-top: -4px;
    margin-left: -3px;
    border-radius: 50%;
    opacity: .3;
}

.theme-dark .colorwaysChangelog-li::before {
    background-color: hsl(216deg calc(var(--saturation-factor, 1)*9.8%) 90%);
}

.theme-light .colorwaysChangelog-li::before {
    background-color: hsl(223deg calc(var(--saturation-factor, 1)*5.8%) 52.9%);
}

.ColorwaySelectorWrapper .colorwayToolbox-list {
    width: 100%;
}

.ColorwaySelectorWrapper .colorwayToolbox-list .colorwaysToolbox-label {
    border-radius: 20px;
    box-sizing: border-box;
    color: var(--text-normal);
    transition: .15s ease;
    width: 100%;
    margin-left: 0;
    height: fit-content;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap;
    cursor: default;
    max-height: 2rem;
    padding: 0 8px;
}

.ColorwaySelectorWrapper .colorwayToolbox-itemList {
    padding: 0;
    overflow: visible !important;
    display: flex;
    flex-wrap: wrap;
    gap: 16px 0;
}

.ColorwaySelectorWrapper .colorwayToolbox-listItem {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: transparent !important;
    width: calc(564px / 4);
    cursor: default;
    float: left;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.ColorwaySelectorWrapper .colorwayToolbox-listItem .bi {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background-color: var(--background-tertiary);
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .15s ease;
    cursor: pointer;
    color: var(--interactive-normal);
}

.ColorwaySelectorWrapper .colorwayToolbox-listItem:hover {
    color: var(--interactive-normal) !important;
}

.ColorwaySelectorWrapper .colorwayToolbox-list .colorwayToolbox-listItem .bi:hover {
    border-color: var(--brand-500);
    background-color: var(--brand-experiment-15a);
    color: var(--interactive-hover) !important;
}

.colorwaysSelector-changelogHeader {
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    position: relative;
    display: flex;
    align-items: center;
}

.colorwaysSelector-changelogHeader::after {
    content: "";
    height: 1px;
    flex: 1 1 auto;
    margin-left: 4px;
    opacity: .6;
    background-color: currentcolor;
}

.colorwaysSelector-changelogHeader_added {
    color: var(--text-positive);
}

.colorwaysSelector-changelogHeader_fixed {
    color: hsl(359deg calc(var(--saturation-factor, 1)*87.3%) 59.8%);
}

.colorwaysSelector-changelogHeader_changed {
    color: var(--text-warning);
}

.is-mobile .colorwaySelectorModal,
.is-mobile .colorwayCreator-modal {
    width: 100vw !important;
    box-sizing: border-box;
    min-width: unset;
    border-radius: 0;
    height: 100vh;
    max-height: unset;
    border: none;
}

.is-mobile .colorwaySelectorModalContent {
    box-sizing: border-box;
    width: 100vw;
}

.is-mobile .colorwaySelector-doublePillBar {
    flex-direction: column-reverse;
    align-items: end;
}

.is-mobile .colorwaySelector-doublePillBar>.colorwaySelector-pillWrapper:first-child {
    width: 100%;
    gap: 4px;
    overflow-x: auto;
    justify-content: space-between;
}

.is-mobile .colorwaySelector-doublePillBar>.colorwaySelector-pillWrapper:first-child>.colorwaySelector-pill {
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    background-color: transparent;
    width: 100%;
    justify-content: center;
    flex: 0 0 min-content;
}

.is-mobile .colorwaySelector-doublePillBar>.colorwaySelector-pillWrapper:first-child>.colorwaySelector-pillSeparator {
    display: none;
}

.is-mobile .layer-fP3xEz:has(.colorwaySelectorModal, .colorwayCreator-modal) {
    padding: 0;
}

.is-mobile .ColorwaySelectorWrapper {
    justify-content: space-around;
    gap: 10px;
}

.is-mobile .colorwayToolbox-itemList {
    justify-content: space-around;
}

html:not(.is-mobile) #colorwaySelector-pill_closeSelector {
    display: none;
}

.colorwaysBtn-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.colorwaysBtn-spinnerInner {
    transform: rotate(280deg);
    position: relative;
    display: inline-block;
    width: 32px;
    height: 32px;
    contain: paint;
}

@keyframes spinner-spinning-circle-rotate {
    100% {
        transform: rotate(1turn);
    }
}

@keyframes spinner-spinning-circle-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 130, 200;
    }

    100% {
        stroke-dasharray: 130, 200;
        stroke-dashoffset: -124;
    }
}

.colorwaysBtn-spinnerCircular {
    animation: spinner-spinning-circle-rotate 2s linear infinite;
    height: 100%;
    width: 100%;
}

.colorwaysBtn-spinnerBeam {
    animation: spinner-spinning-circle-dash 2s ease-in-out infinite;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    fill: none;
    stroke-width: 6;
    stroke-miterlimit: 10;
    stroke-linecap: round;
    stroke: currentcolor;
}

.colorwaysBtn-spinnerBeam2 {
    stroke: currentcolor;
    opacity: 0.6;
    animation-delay: .15s;
}

.colorwaysBtn-spinnerBeam3 {
    stroke: currentcolor;
    opacity: 0.3;
    animation-delay: .23s;
}

.colorwaysSettings-colorwaySource {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 16px;
    gap: 5px;
    cursor: pointer;
    border-radius: 4px;
    box-sizing: border-box;
    min-height: 51px;
    align-items: center;
}

.colorwaysSettings-colorwaySource:hover {
    background-color: var(--background-modifier-hover);
}

.colorwaysSettings-colorwaySources {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 5px;
    border-radius: 4px;
    background-color: var(--background-secondary);
    box-sizing: border-box;
    color: var(--header-secondary);
    overflow: hidden overlay;
    margin-bottom: 4px;
}

.colorwaysSettings-modalRoot {
    min-width: 520px;
}

.colorwaysSettings-colorwaySourceLabel {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.colorwaysSettings-iconButton {
    background-color: transparent !important;
    border-radius: 0;
}

.colorwaysSettings-iconButtonInner {
    display: flex;
    gap: 4px;
    align-items: center;
}

.colorwaysSettings-modalContent {
    margin: 8px 0;
}

@keyframes loading-bar {
    0% {
        left: 0;
        right: 100%;
        width: 0;
    }

    10% {
        left: 0;
        right: 75%;
        width: 25%;
    }

    90% {
        right: 0;
        left: 75%;
        width: 25%;
    }

    100% {
        left: 100%;
        right: 0;
        width: 0;
    }
}

.colorwaysLoader-barContainer {
    width: 100%;
    border-radius: var(--radius-round);
    border: 0;
    position: relative;
    padding: 0;
}

.colorwaysLoader-bar {
    position: absolute;
    border-radius: var(--radius-round);
    top: 0;
    right: 100%;
    bottom: 0;
    left: 0;
    background: var(--brand-500);
    width: 0;
    animation: loading-bar 2s linear infinite;
    transition: .2s ease;
}

.colorwaysSettingsSelector-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.colorwaysSettingsPage-wrapper .colorwayToolbox-listItem {
    gap: 8px;
    border-radius: 50px;
    padding: 12px 16px;
    background-color: var(--background-tertiary);
    transition: .15s ease;
    border: 1px solid transparent;
    color: var(--interactive-normal);
}

.colorwaysSettingsPage-wrapper .colorwayToolbox-listItem:hover {
    border-color: var(--brand-500);
    background-color: var(--brand-experiment-15a);
    color: var(--interactive-hover);
}

.colorwaysSettingsSelector-wrapper .ColorwaySelectorWrapper {
    justify-content: space-between;
}

.colorwaysSettingsSelector-infoWrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.colorwaysSettingsPage-wrapper .colorwayToolbox-itemList {
    padding: 0;
    overflow: visible;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.colorwaysSettings-label {
    flex: 1;
    display: block;
    overflow: hidden;
    margin-top: 0;
    margin-bottom: 0;
    color: var(--header-primary);
    line-height: 24px;
    font-size: 16px;
    font-weight: 500;
    word-wrap: break-word;
    cursor: pointer;
}

.colorwaysSettingsPage-settingsRow {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
}

.colorwaysSettingsPage-divider {
    width: 100%;
    height: 1px;
    border-top: thin solid var(--background-modifier-accent);
    margin-top: var(--custom-margin-margin-medium);
    margin-bottom: 20px;
}

.colorwaysButton-pill {
    position: absolute;
    top: 0;
    left: 0;
}
`;

    const fallbackColorways = [
        {
            "name": "Keyboard Purple",
            "original": false,
            "accent": "hsl(235 85.6% 64.7%)",
            "primary": "#222456",
            "secondary": "#1c1f48",
            "tertiary": "#080d1d",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 235 calc(var(--saturation-factor, 1)*86%) 112%;
            --brand-130-hsl: 235 calc(var(--saturation-factor, 1)*86%) 108%;
            --brand-160-hsl: 235 calc(var(--saturation-factor, 1)*86%) 105%;
            --brand-200-hsl: 235 calc(var(--saturation-factor, 1)*86%) 101%;
            --brand-230-hsl: 235 calc(var(--saturation-factor, 1)*86%) 97%;
            --brand-260-hsl: 235 calc(var(--saturation-factor, 1)*86%) 94%;
            --brand-300-hsl: 235 calc(var(--saturation-factor, 1)*86%) 90%;
            --brand-330-hsl: 235 calc(var(--saturation-factor, 1)*86%) 87%;
            --brand-345-hsl: 235 calc(var(--saturation-factor, 1)*86%) 83%;
            --brand-360-hsl: 235 calc(var(--saturation-factor, 1)*86%) 79%;
            --brand-400-hsl: 235 calc(var(--saturation-factor, 1)*86%) 76%;
            --brand-430-hsl: 235 calc(var(--saturation-factor, 1)*86%) 72%;
            --brand-460-hsl: 235 calc(var(--saturation-factor, 1)*86%) 69%;
            --brand-500-hsl: 235 calc(var(--saturation-factor, 1)*86%) 65%;
            --brand-530-hsl: 235 calc(var(--saturation-factor, 1)*86%) 61%;
            --brand-560-hsl: 235 calc(var(--saturation-factor, 1)*86%) 58%;
            --brand-600-hsl: 235 calc(var(--saturation-factor, 1)*86%) 54%;
            --brand-630-hsl: 235 calc(var(--saturation-factor, 1)*86%) 51%;
            --brand-660-hsl: 235 calc(var(--saturation-factor, 1)*86%) 47%;
            --brand-700-hsl: 235 calc(var(--saturation-factor, 1)*86%) 43%;
            --brand-730-hsl: 235 calc(var(--saturation-factor, 1)*86%) 40%;
            --brand-760-hsl: 235 calc(var(--saturation-factor, 1)*86%) 36%;
            --brand-800-hsl: 235 calc(var(--saturation-factor, 1)*86%) 33%;
            --brand-830-hsl: 235 calc(var(--saturation-factor, 1)*86%) 29%;
            --brand-860-hsl: 235 calc(var(--saturation-factor, 1)*86%) 25%;
            --brand-900-hsl: 235 calc(var(--saturation-factor, 1)*86%) 22%;
            --mention-foreground: white !important;
            --primary-800-hsl: 224 calc(var(--saturation-factor, 1)*60%) 5%;
            --primary-730-hsl: 226 calc(var(--saturation-factor, 1)*57%) 7%;
            --primary-700-hsl: 226 calc(var(--saturation-factor, 1)*57%) 7%;
            --primary-660-hsl: 237 calc(var(--saturation-factor, 1)*44%) 16%;
            --primary-645-hsl: 238 calc(var(--saturation-factor, 1)*43%) 19%;
            --primary-630-hsl: 236 calc(var(--saturation-factor, 1)*44%) 20%;
            --primary-600-hsl: 238 calc(var(--saturation-factor, 1)*43%) 24%;
            --primary-560-hsl: 237 calc(var(--saturation-factor, 1)*44%) 28%;
            --primary-530-hsl: 237 calc(var(--saturation-factor, 1)*44%) 28%;
            --primary-500-hsl: 237 calc(var(--saturation-factor, 1)*44%) 28%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 237 calc(var(--saturation-factor, 1)*44%) 20.8%;
            --primary-400-hsl: 237 calc(var(--saturation-factor, 1)*44%) 17.2%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(235.9090909090909, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(235.9090909090909, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(235.9090909090909, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Eclipse",
            "original": false,
            "accent": "hsl(87 85.6% 64.7%)",
            "primary": "#000000",
            "secondary": "#181818",
            "tertiary": "#0a0a0a",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 87 calc(var(--saturation-factor, 1)*86%) 112%;
            --brand-130-hsl: 87 calc(var(--saturation-factor, 1)*86%) 108%;
            --brand-160-hsl: 87 calc(var(--saturation-factor, 1)*86%) 105%;
            --brand-200-hsl: 87 calc(var(--saturation-factor, 1)*86%) 101%;
            --brand-230-hsl: 87 calc(var(--saturation-factor, 1)*86%) 97%;
            --brand-260-hsl: 87 calc(var(--saturation-factor, 1)*86%) 94%;
            --brand-300-hsl: 87 calc(var(--saturation-factor, 1)*86%) 90%;
            --brand-330-hsl: 87 calc(var(--saturation-factor, 1)*86%) 87%;
            --brand-345-hsl: 87 calc(var(--saturation-factor, 1)*86%) 83%;
            --brand-360-hsl: 87 calc(var(--saturation-factor, 1)*86%) 79%;
            --brand-400-hsl: 87 calc(var(--saturation-factor, 1)*86%) 76%;
            --brand-430-hsl: 87 calc(var(--saturation-factor, 1)*86%) 72%;
            --brand-460-hsl: 87 calc(var(--saturation-factor, 1)*86%) 69%;
            --brand-500-hsl: 87 calc(var(--saturation-factor, 1)*86%) 65%;
            --brand-530-hsl: 87 calc(var(--saturation-factor, 1)*86%) 61%;
            --brand-560-hsl: 87 calc(var(--saturation-factor, 1)*86%) 58%;
            --brand-600-hsl: 87 calc(var(--saturation-factor, 1)*86%) 54%;
            --brand-630-hsl: 87 calc(var(--saturation-factor, 1)*86%) 51%;
            --brand-660-hsl: 87 calc(var(--saturation-factor, 1)*86%) 47%;
            --brand-700-hsl: 87 calc(var(--saturation-factor, 1)*86%) 43%;
            --brand-730-hsl: 87 calc(var(--saturation-factor, 1)*86%) 40%;
            --brand-760-hsl: 87 calc(var(--saturation-factor, 1)*86%) 36%;
            --brand-800-hsl: 87 calc(var(--saturation-factor, 1)*86%) 33%;
            --brand-830-hsl: 87 calc(var(--saturation-factor, 1)*86%) 29%;
            --brand-860-hsl: 87 calc(var(--saturation-factor, 1)*86%) 25%;
            --brand-900-hsl: 87 calc(var(--saturation-factor, 1)*86%) 22%;
            --mention-foreground: black !important;
            --primary-800-hsl: 0 calc(var(--saturation-factor, 1)*0%) 3%;
            --primary-730-hsl: 0 calc(var(--saturation-factor, 1)*0%) 4%;
            --primary-700-hsl: 0 calc(var(--saturation-factor, 1)*0%) 4%;
            --primary-660-hsl: 0 calc(var(--saturation-factor, 1)*0%) 8%;
            --primary-645-hsl: 0 calc(var(--saturation-factor, 1)*0%) -5%;
            --primary-630-hsl: 0 calc(var(--saturation-factor, 1)*0%) 9%;
            --primary-600-hsl: 0 calc(var(--saturation-factor, 1)*0%) 0%;
            --primary-560-hsl: 0 calc(var(--saturation-factor, 1)*0%) 0%;
            --primary-530-hsl: 0 calc(var(--saturation-factor, 1)*0%) 0%;
            --primary-500-hsl: 0 calc(var(--saturation-factor, 1)*0%) 0%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 0 calc(var(--saturation-factor, 1)*0%) -7.2%;
            --primary-400-hsl: 0 calc(var(--saturation-factor, 1)*0%) -10.8%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: gray !important;
            --channel-icon: gray !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: gray !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: black !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: black !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Cyan",
            "original": false,
            "accent": "#009f88",
            "primary": "#202226",
            "secondary": "#1c1e21",
            "tertiary": "#141517",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 171 calc(var(--saturation-factor, 1)*86%) 81%;
            --brand-130-hsl: 171 calc(var(--saturation-factor, 1)*86%) 77%;
            --brand-160-hsl: 171 calc(var(--saturation-factor, 1)*86%) 74%;
            --brand-200-hsl: 171 calc(var(--saturation-factor, 1)*86%) 70%;
            --brand-230-hsl: 171 calc(var(--saturation-factor, 1)*86%) 66%;
            --brand-260-hsl: 171 calc(var(--saturation-factor, 1)*86%) 63%;
            --brand-300-hsl: 171 calc(var(--saturation-factor, 1)*86%) 59%;
            --brand-330-hsl: 171 calc(var(--saturation-factor, 1)*86%) 56%;
            --brand-345-hsl: 171 calc(var(--saturation-factor, 1)*86%) 52%;
            --brand-360-hsl: 171 calc(var(--saturation-factor, 1)*86%) 48%;
            --brand-400-hsl: 171 calc(var(--saturation-factor, 1)*86%) 45%;
            --brand-430-hsl: 171 calc(var(--saturation-factor, 1)*86%) 41%;
            --brand-460-hsl: 171 calc(var(--saturation-factor, 1)*86%) 38%;
            --brand-500-hsl: 171 calc(var(--saturation-factor, 1)*86%) 34%;
            --brand-530-hsl: 171 calc(var(--saturation-factor, 1)*86%) 30%;
            --brand-560-hsl: 171 calc(var(--saturation-factor, 1)*86%) 27%;
            --brand-600-hsl: 171 calc(var(--saturation-factor, 1)*86%) 23%;
            --brand-630-hsl: 171 calc(var(--saturation-factor, 1)*86%) 20%;
            --brand-660-hsl: 171 calc(var(--saturation-factor, 1)*86%) 16%;
            --brand-700-hsl: 171 calc(var(--saturation-factor, 1)*86%) 12%;
            --brand-730-hsl: 171 calc(var(--saturation-factor, 1)*86%) 9%;
            --brand-760-hsl: 171 calc(var(--saturation-factor, 1)*86%) 5%;
            --brand-800-hsl: 171 calc(var(--saturation-factor, 1)*86%) 2%;
            --brand-830-hsl: 171 calc(var(--saturation-factor, 1)*86%) -2%;
            --brand-860-hsl: 171 calc(var(--saturation-factor, 1)*86%) -6%;
            --brand-900-hsl: 171 calc(var(--saturation-factor, 1)*86%) -9%;
            --mention-foreground: white !important;
            --primary-800-hsl: 0 calc(var(--saturation-factor, 1)*0%) 6%;
            --primary-730-hsl: 0 calc(var(--saturation-factor, 1)*0%) 8%;
            --primary-700-hsl: 0 calc(var(--saturation-factor, 1)*0%) 8%;
            --primary-660-hsl: 0 calc(var(--saturation-factor, 1)*0%) 9%;
            --primary-645-hsl: 0 calc(var(--saturation-factor, 1)*0%) 8%;
            --primary-630-hsl: 0 calc(var(--saturation-factor, 1)*0%) 11%;
            --primary-600-hsl: 0 calc(var(--saturation-factor, 1)*0%) 13%;
            --primary-560-hsl: 0 calc(var(--saturation-factor, 1)*0%) 15%;
            --primary-530-hsl: 0 calc(var(--saturation-factor, 1)*0%) 15%;
            --primary-500-hsl: 0 calc(var(--saturation-factor, 1)*0%) 15%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 0 calc(var(--saturation-factor, 1)*0%) 7.8%;
            --primary-400-hsl: 0 calc(var(--saturation-factor, 1)*0%) 4.199999999999999%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: gray !important;
            --channel-icon: gray !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: gray !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Spotify",
            "original": false,
            "accent": "hsl(141 76% 48%)",
            "primary": "#121212",
            "secondary": "#090909",
            "tertiary": "#090909",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 141 calc(var(--saturation-factor, 1)*76%) 95%;
            --brand-130-hsl: 141 calc(var(--saturation-factor, 1)*76%) 91%;
            --brand-160-hsl: 141 calc(var(--saturation-factor, 1)*76%) 88%;
            --brand-200-hsl: 141 calc(var(--saturation-factor, 1)*76%) 84%;
            --brand-230-hsl: 141 calc(var(--saturation-factor, 1)*76%) 80%;
            --brand-260-hsl: 141 calc(var(--saturation-factor, 1)*76%) 77%;
            --brand-300-hsl: 141 calc(var(--saturation-factor, 1)*76%) 73%;
            --brand-330-hsl: 141 calc(var(--saturation-factor, 1)*76%) 70%;
            --brand-345-hsl: 141 calc(var(--saturation-factor, 1)*76%) 66%;
            --brand-360-hsl: 141 calc(var(--saturation-factor, 1)*76%) 62%;
            --brand-400-hsl: 141 calc(var(--saturation-factor, 1)*76%) 59%;
            --brand-430-hsl: 141 calc(var(--saturation-factor, 1)*76%) 55%;
            --brand-460-hsl: 141 calc(var(--saturation-factor, 1)*76%) 52%;
            --brand-500-hsl: 141 calc(var(--saturation-factor, 1)*76%) 48%;
            --brand-530-hsl: 141 calc(var(--saturation-factor, 1)*76%) 44%;
            --brand-560-hsl: 141 calc(var(--saturation-factor, 1)*76%) 41%;
            --brand-600-hsl: 141 calc(var(--saturation-factor, 1)*76%) 37%;
            --brand-630-hsl: 141 calc(var(--saturation-factor, 1)*76%) 34%;
            --brand-660-hsl: 141 calc(var(--saturation-factor, 1)*76%) 30%;
            --brand-700-hsl: 141 calc(var(--saturation-factor, 1)*76%) 26%;
            --brand-730-hsl: 141 calc(var(--saturation-factor, 1)*76%) 23%;
            --brand-760-hsl: 141 calc(var(--saturation-factor, 1)*76%) 19%;
            --brand-800-hsl: 141 calc(var(--saturation-factor, 1)*76%) 16%;
            --brand-830-hsl: 141 calc(var(--saturation-factor, 1)*76%) 12%;
            --brand-860-hsl: 141 calc(var(--saturation-factor, 1)*76%) 8%;
            --brand-900-hsl: 141 calc(var(--saturation-factor, 1)*76%) 5%;
            --mention-foreground: black !important;
            --primary-800-hsl: 0 calc(var(--saturation-factor, 1)*0%) 2%;
            --primary-730-hsl: 0 calc(var(--saturation-factor, 1)*0%) 4%;
            --primary-700-hsl: 0 calc(var(--saturation-factor, 1)*0%) 4%;
            --primary-660-hsl: 0 calc(var(--saturation-factor, 1)*0%) 3%;
            --primary-645-hsl: 0 calc(var(--saturation-factor, 1)*0%) 2%;
            --primary-630-hsl: 0 calc(var(--saturation-factor, 1)*0%) 4%;
            --primary-600-hsl: 0 calc(var(--saturation-factor, 1)*0%) 7%;
            --primary-560-hsl: 0 calc(var(--saturation-factor, 1)*0%) 8%;
            --primary-530-hsl: 0 calc(var(--saturation-factor, 1)*0%) 8%;
            --primary-500-hsl: 0 calc(var(--saturation-factor, 1)*0%) 8%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 0 calc(var(--saturation-factor, 1)*0%) 1%;
            --primary-400-hsl: 0 calc(var(--saturation-factor, 1)*0%) 0%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: gray !important;
            --channel-icon: gray !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: gray !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: black !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: black !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Bright n' Blue",
            "original": true,
            "accent": "hsl(234, 68%, 33%)",
            "primary": "#394aae",
            "secondary": "#29379d",
            "tertiary": "#1b278d",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 234 calc(var(--saturation-factor, 1)*68%) 80%;
            --brand-130-hsl: 234 calc(var(--saturation-factor, 1)*68%) 76%;
            --brand-160-hsl: 234 calc(var(--saturation-factor, 1)*68%) 73%;
            --brand-200-hsl: 234 calc(var(--saturation-factor, 1)*68%) 69%;
            --brand-230-hsl: 234 calc(var(--saturation-factor, 1)*68%) 65%;
            --brand-260-hsl: 234 calc(var(--saturation-factor, 1)*68%) 62%;
            --brand-300-hsl: 234 calc(var(--saturation-factor, 1)*68%) 58%;
            --brand-330-hsl: 234 calc(var(--saturation-factor, 1)*68%) 55%;
            --brand-345-hsl: 234 calc(var(--saturation-factor, 1)*68%) 51%;
            --brand-360-hsl: 234 calc(var(--saturation-factor, 1)*68%) 47%;
            --brand-400-hsl: 234 calc(var(--saturation-factor, 1)*68%) 44%;
            --brand-430-hsl: 234 calc(var(--saturation-factor, 1)*68%) 40%;
            --brand-460-hsl: 234 calc(var(--saturation-factor, 1)*68%) 37%;
            --brand-500-hsl: 234 calc(var(--saturation-factor, 1)*68%) 33%;
            --brand-530-hsl: 234 calc(var(--saturation-factor, 1)*68%) 29%;
            --brand-560-hsl: 234 calc(var(--saturation-factor, 1)*68%) 26%;
            --brand-600-hsl: 234 calc(var(--saturation-factor, 1)*68%) 22%;
            --brand-630-hsl: 234 calc(var(--saturation-factor, 1)*68%) 19%;
            --brand-660-hsl: 234 calc(var(--saturation-factor, 1)*68%) 15%;
            --brand-700-hsl: 234 calc(var(--saturation-factor, 1)*68%) 11%;
            --brand-730-hsl: 234 calc(var(--saturation-factor, 1)*68%) 8%;
            --brand-760-hsl: 234 calc(var(--saturation-factor, 1)*68%) 4%;
            --brand-800-hsl: 234 calc(var(--saturation-factor, 1)*68%) 1%;
            --brand-830-hsl: 234 calc(var(--saturation-factor, 1)*68%) -3%;
            --brand-860-hsl: 234 calc(var(--saturation-factor, 1)*68%) -7%;
            --brand-900-hsl: 234 calc(var(--saturation-factor, 1)*68%) -10%;
            --mention-foreground: white !important;
            --primary-800-hsl: 234 calc(var(--saturation-factor, 1)*69%) 23%;
            --primary-730-hsl: 234 calc(var(--saturation-factor, 1)*68%) 33%;
            --primary-700-hsl: 234 calc(var(--saturation-factor, 1)*68%) 33%;
            --primary-660-hsl: 233 calc(var(--saturation-factor, 1)*59%) 31%;
            --primary-645-hsl: 231 calc(var(--saturation-factor, 1)*51%) 40%;
            --primary-630-hsl: 233 calc(var(--saturation-factor, 1)*59%) 39%;
            --primary-600-hsl: 231 calc(var(--saturation-factor, 1)*51%) 45%;
            --primary-560-hsl: 231 calc(var(--saturation-factor, 1)*60%) 54%;
            --primary-530-hsl: 231 calc(var(--saturation-factor, 1)*60%) 54%;
            --primary-500-hsl: 231 calc(var(--saturation-factor, 1)*60%) 54%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 231 calc(var(--saturation-factor, 1)*60%) 46.8%;
            --primary-400-hsl: 231 calc(var(--saturation-factor, 1)*60%) 43.2%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(233.2758620689655, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(233.2758620689655, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(233.2758620689655, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Still Young",
            "original": true,
            "accent": "hsl(58 85.6% 89%)",
            "primary": "#443a31",
            "secondary": "#7c3d3e",
            "tertiary": "#207578",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 58 calc(var(--saturation-factor, 1)*86%) 136%;
            --brand-130-hsl: 58 calc(var(--saturation-factor, 1)*86%) 132%;
            --brand-160-hsl: 58 calc(var(--saturation-factor, 1)*86%) 129%;
            --brand-200-hsl: 58 calc(var(--saturation-factor, 1)*86%) 125%;
            --brand-230-hsl: 58 calc(var(--saturation-factor, 1)*86%) 121%;
            --brand-260-hsl: 58 calc(var(--saturation-factor, 1)*86%) 118%;
            --brand-300-hsl: 58 calc(var(--saturation-factor, 1)*86%) 114%;
            --brand-330-hsl: 58 calc(var(--saturation-factor, 1)*86%) 111%;
            --brand-345-hsl: 58 calc(var(--saturation-factor, 1)*86%) 107%;
            --brand-360-hsl: 58 calc(var(--saturation-factor, 1)*86%) 103%;
            --brand-400-hsl: 58 calc(var(--saturation-factor, 1)*86%) 100%;
            --brand-430-hsl: 58 calc(var(--saturation-factor, 1)*86%) 96%;
            --brand-460-hsl: 58 calc(var(--saturation-factor, 1)*86%) 93%;
            --brand-500-hsl: 58 calc(var(--saturation-factor, 1)*86%) 89%;
            --brand-530-hsl: 58 calc(var(--saturation-factor, 1)*86%) 85%;
            --brand-560-hsl: 58 calc(var(--saturation-factor, 1)*86%) 82%;
            --brand-600-hsl: 58 calc(var(--saturation-factor, 1)*86%) 78%;
            --brand-630-hsl: 58 calc(var(--saturation-factor, 1)*86%) 75%;
            --brand-660-hsl: 58 calc(var(--saturation-factor, 1)*86%) 71%;
            --brand-700-hsl: 58 calc(var(--saturation-factor, 1)*86%) 67%;
            --brand-730-hsl: 58 calc(var(--saturation-factor, 1)*86%) 64%;
            --brand-760-hsl: 58 calc(var(--saturation-factor, 1)*86%) 60%;
            --brand-800-hsl: 58 calc(var(--saturation-factor, 1)*86%) 57%;
            --brand-830-hsl: 58 calc(var(--saturation-factor, 1)*86%) 53%;
            --brand-860-hsl: 58 calc(var(--saturation-factor, 1)*86%) 49%;
            --brand-900-hsl: 58 calc(var(--saturation-factor, 1)*86%) 46%;
            --mention-foreground: black !important;
            --primary-800-hsl: 182 calc(var(--saturation-factor, 1)*59%) 21%;
            --primary-730-hsl: 182 calc(var(--saturation-factor, 1)*58%) 30%;
            --primary-700-hsl: 182 calc(var(--saturation-factor, 1)*58%) 30%;
            --primary-660-hsl: 359 calc(var(--saturation-factor, 1)*34%) 29%;
            --primary-645-hsl: 28 calc(var(--saturation-factor, 1)*16%) 18%;
            --primary-630-hsl: 359 calc(var(--saturation-factor, 1)*34%) 36%;
            --primary-600-hsl: 28 calc(var(--saturation-factor, 1)*16%) 23%;
            --primary-560-hsl: 29 calc(var(--saturation-factor, 1)*17%) 27%;
            --primary-530-hsl: 29 calc(var(--saturation-factor, 1)*17%) 27%;
            --primary-500-hsl: 29 calc(var(--saturation-factor, 1)*17%) 27%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 29 calc(var(--saturation-factor, 1)*17%) 19.8%;
            --primary-400-hsl: 29 calc(var(--saturation-factor, 1)*17%) 16.2%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(359.03225806451616, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(359.03225806451616, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(359.03225806451616, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: black !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: black !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Sea",
            "original": true,
            "accent": "hsl(184, 100%, 50%)",
            "primary": "#07353b",
            "secondary": "#0b5e60",
            "tertiary": "#08201d",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 184 calc(var(--saturation-factor, 1)*100%) 97%;
            --brand-130-hsl: 184 calc(var(--saturation-factor, 1)*100%) 93%;
            --brand-160-hsl: 184 calc(var(--saturation-factor, 1)*100%) 90%;
            --brand-200-hsl: 184 calc(var(--saturation-factor, 1)*100%) 86%;
            --brand-230-hsl: 184 calc(var(--saturation-factor, 1)*100%) 82%;
            --brand-260-hsl: 184 calc(var(--saturation-factor, 1)*100%) 79%;
            --brand-300-hsl: 184 calc(var(--saturation-factor, 1)*100%) 75%;
            --brand-330-hsl: 184 calc(var(--saturation-factor, 1)*100%) 72%;
            --brand-345-hsl: 184 calc(var(--saturation-factor, 1)*100%) 68%;
            --brand-360-hsl: 184 calc(var(--saturation-factor, 1)*100%) 64%;
            --brand-400-hsl: 184 calc(var(--saturation-factor, 1)*100%) 61%;
            --brand-430-hsl: 184 calc(var(--saturation-factor, 1)*100%) 57%;
            --brand-460-hsl: 184 calc(var(--saturation-factor, 1)*100%) 54%;
            --brand-500-hsl: 184 calc(var(--saturation-factor, 1)*100%) 50%;
            --brand-530-hsl: 184 calc(var(--saturation-factor, 1)*100%) 46%;
            --brand-560-hsl: 184 calc(var(--saturation-factor, 1)*100%) 43%;
            --brand-600-hsl: 184 calc(var(--saturation-factor, 1)*100%) 39%;
            --brand-630-hsl: 184 calc(var(--saturation-factor, 1)*100%) 36%;
            --brand-660-hsl: 184 calc(var(--saturation-factor, 1)*100%) 32%;
            --brand-700-hsl: 184 calc(var(--saturation-factor, 1)*100%) 28%;
            --brand-730-hsl: 184 calc(var(--saturation-factor, 1)*100%) 25%;
            --brand-760-hsl: 184 calc(var(--saturation-factor, 1)*100%) 21%;
            --brand-800-hsl: 184 calc(var(--saturation-factor, 1)*100%) 18%;
            --brand-830-hsl: 184 calc(var(--saturation-factor, 1)*100%) 14%;
            --brand-860-hsl: 184 calc(var(--saturation-factor, 1)*100%) 10%;
            --brand-900-hsl: 184 calc(var(--saturation-factor, 1)*100%) 7%;
            --mention-foreground: black !important;
            --primary-800-hsl: 173 calc(var(--saturation-factor, 1)*63%) 5%;
            --primary-730-hsl: 173 calc(var(--saturation-factor, 1)*60%) 8%;
            --primary-700-hsl: 173 calc(var(--saturation-factor, 1)*60%) 8%;
            --primary-660-hsl: 180 calc(var(--saturation-factor, 1)*81%) 17%;
            --primary-645-hsl: 187 calc(var(--saturation-factor, 1)*79%) 8%;
            --primary-630-hsl: 181 calc(var(--saturation-factor, 1)*79%) 21%;
            --primary-600-hsl: 187 calc(var(--saturation-factor, 1)*79%) 13%;
            --primary-560-hsl: 187 calc(var(--saturation-factor, 1)*80%) 15%;
            --primary-530-hsl: 187 calc(var(--saturation-factor, 1)*80%) 15%;
            --primary-500-hsl: 187 calc(var(--saturation-factor, 1)*80%) 15%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 187 calc(var(--saturation-factor, 1)*80%) 7.8%;
            --primary-400-hsl: 187 calc(var(--saturation-factor, 1)*80%) 4.199999999999999%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(180.70588235294116, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(180.70588235294116, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(180.70588235294116, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: black !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: black !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Lava",
            "original": true,
            "accent": "hsl(4, 80.4%, 32%)",
            "primary": "#401b17",
            "secondary": "#351917",
            "tertiary": "#230b0b",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 4 calc(var(--saturation-factor, 1)*80%) 79%;
            --brand-130-hsl: 4 calc(var(--saturation-factor, 1)*80%) 75%;
            --brand-160-hsl: 4 calc(var(--saturation-factor, 1)*80%) 72%;
            --brand-200-hsl: 4 calc(var(--saturation-factor, 1)*80%) 68%;
            --brand-230-hsl: 4 calc(var(--saturation-factor, 1)*80%) 64%;
            --brand-260-hsl: 4 calc(var(--saturation-factor, 1)*80%) 61%;
            --brand-300-hsl: 4 calc(var(--saturation-factor, 1)*80%) 57%;
            --brand-330-hsl: 4 calc(var(--saturation-factor, 1)*80%) 54%;
            --brand-345-hsl: 4 calc(var(--saturation-factor, 1)*80%) 50%;
            --brand-360-hsl: 4 calc(var(--saturation-factor, 1)*80%) 46%;
            --brand-400-hsl: 4 calc(var(--saturation-factor, 1)*80%) 43%;
            --brand-430-hsl: 4 calc(var(--saturation-factor, 1)*80%) 39%;
            --brand-460-hsl: 4 calc(var(--saturation-factor, 1)*80%) 36%;
            --brand-500-hsl: 4 calc(var(--saturation-factor, 1)*80%) 32%;
            --brand-530-hsl: 4 calc(var(--saturation-factor, 1)*80%) 28%;
            --brand-560-hsl: 4 calc(var(--saturation-factor, 1)*80%) 25%;
            --brand-600-hsl: 4 calc(var(--saturation-factor, 1)*80%) 21%;
            --brand-630-hsl: 4 calc(var(--saturation-factor, 1)*80%) 18%;
            --brand-660-hsl: 4 calc(var(--saturation-factor, 1)*80%) 14%;
            --brand-700-hsl: 4 calc(var(--saturation-factor, 1)*80%) 10%;
            --brand-730-hsl: 4 calc(var(--saturation-factor, 1)*80%) 7%;
            --brand-760-hsl: 4 calc(var(--saturation-factor, 1)*80%) 3%;
            --brand-800-hsl: 4 calc(var(--saturation-factor, 1)*80%) 0%;
            --brand-830-hsl: 4 calc(var(--saturation-factor, 1)*80%) -4%;
            --brand-860-hsl: 4 calc(var(--saturation-factor, 1)*80%) -8%;
            --brand-900-hsl: 4 calc(var(--saturation-factor, 1)*80%) -11%;
            --mention-foreground: white !important;
            --primary-800-hsl: 0 calc(var(--saturation-factor, 1)*55%) 6%;
            --primary-730-hsl: 0 calc(var(--saturation-factor, 1)*52%) 9%;
            --primary-700-hsl: 0 calc(var(--saturation-factor, 1)*52%) 9%;
            --primary-660-hsl: 5 calc(var(--saturation-factor, 1)*40%) 12%;
            --primary-645-hsl: 6 calc(var(--saturation-factor, 1)*47%) 12%;
            --primary-630-hsl: 4 calc(var(--saturation-factor, 1)*40%) 15%;
            --primary-600-hsl: 6 calc(var(--saturation-factor, 1)*47%) 17%;
            --primary-560-hsl: 6 calc(var(--saturation-factor, 1)*48%) 20%;
            --primary-530-hsl: 6 calc(var(--saturation-factor, 1)*48%) 20%;
            --primary-500-hsl: 6 calc(var(--saturation-factor, 1)*48%) 20%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 6 calc(var(--saturation-factor, 1)*48%) 12.8%;
            --primary-400-hsl: 6 calc(var(--saturation-factor, 1)*48%) 9.2%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(4, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(4, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(4, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Solid Pink",
            "original": true,
            "accent": "hsl(340, 55.2%, 56.3%)",
            "primary": "#1e151c",
            "secondary": "#21181f",
            "tertiary": "#291e27",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 340 calc(var(--saturation-factor, 1)*55%) 103%;
            --brand-130-hsl: 340 calc(var(--saturation-factor, 1)*55%) 99%;
            --brand-160-hsl: 340 calc(var(--saturation-factor, 1)*55%) 96%;
            --brand-200-hsl: 340 calc(var(--saturation-factor, 1)*55%) 92%;
            --brand-230-hsl: 340 calc(var(--saturation-factor, 1)*55%) 88%;
            --brand-260-hsl: 340 calc(var(--saturation-factor, 1)*55%) 85%;
            --brand-300-hsl: 340 calc(var(--saturation-factor, 1)*55%) 81%;
            --brand-330-hsl: 340 calc(var(--saturation-factor, 1)*55%) 78%;
            --brand-345-hsl: 340 calc(var(--saturation-factor, 1)*55%) 74%;
            --brand-360-hsl: 340 calc(var(--saturation-factor, 1)*55%) 70%;
            --brand-400-hsl: 340 calc(var(--saturation-factor, 1)*55%) 67%;
            --brand-430-hsl: 340 calc(var(--saturation-factor, 1)*55%) 63%;
            --brand-460-hsl: 340 calc(var(--saturation-factor, 1)*55%) 60%;
            --brand-500-hsl: 340 calc(var(--saturation-factor, 1)*55%) 56%;
            --brand-530-hsl: 340 calc(var(--saturation-factor, 1)*55%) 52%;
            --brand-560-hsl: 340 calc(var(--saturation-factor, 1)*55%) 49%;
            --brand-600-hsl: 340 calc(var(--saturation-factor, 1)*55%) 45%;
            --brand-630-hsl: 340 calc(var(--saturation-factor, 1)*55%) 42%;
            --brand-660-hsl: 340 calc(var(--saturation-factor, 1)*55%) 38%;
            --brand-700-hsl: 340 calc(var(--saturation-factor, 1)*55%) 34%;
            --brand-730-hsl: 340 calc(var(--saturation-factor, 1)*55%) 31%;
            --brand-760-hsl: 340 calc(var(--saturation-factor, 1)*55%) 27%;
            --brand-800-hsl: 340 calc(var(--saturation-factor, 1)*55%) 24%;
            --brand-830-hsl: 340 calc(var(--saturation-factor, 1)*55%) 20%;
            --brand-860-hsl: 340 calc(var(--saturation-factor, 1)*55%) 16%;
            --brand-900-hsl: 340 calc(var(--saturation-factor, 1)*55%) 13%;
            --mention-foreground: white !important;
            --primary-800-hsl: 309 calc(var(--saturation-factor, 1)*14%) 10%;
            --primary-730-hsl: 311 calc(var(--saturation-factor, 1)*16%) 14%;
            --primary-700-hsl: 311 calc(var(--saturation-factor, 1)*16%) 14%;
            --primary-660-hsl: 317 calc(var(--saturation-factor, 1)*16%) 9%;
            --primary-645-hsl: 313 calc(var(--saturation-factor, 1)*18%) 5%;
            --primary-630-hsl: 313 calc(var(--saturation-factor, 1)*16%) 11%;
            --primary-600-hsl: 313 calc(var(--saturation-factor, 1)*18%) 10%;
            --primary-560-hsl: 316 calc(var(--saturation-factor, 1)*18%) 12%;
            --primary-530-hsl: 316 calc(var(--saturation-factor, 1)*18%) 12%;
            --primary-500-hsl: 316 calc(var(--saturation-factor, 1)*18%) 12%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 316 calc(var(--saturation-factor, 1)*18%) 4.8%;
            --primary-400-hsl: 316 calc(var(--saturation-factor, 1)*18%) 1.1999999999999993%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(313.33333333333337, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(313.33333333333337, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(313.33333333333337, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Sand",
            "original": true,
            "accent": "hsl(41, 31%, 45%)",
            "primary": "#7f6c43",
            "secondary": "#665b33",
            "tertiary": "#5c5733",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 41 calc(var(--saturation-factor, 1)*31%) 93%;
            --brand-130-hsl: 41 calc(var(--saturation-factor, 1)*31%) 89%;
            --brand-160-hsl: 41 calc(var(--saturation-factor, 1)*31%) 86%;
            --brand-200-hsl: 41 calc(var(--saturation-factor, 1)*31%) 82%;
            --brand-230-hsl: 41 calc(var(--saturation-factor, 1)*31%) 78%;
            --brand-260-hsl: 41 calc(var(--saturation-factor, 1)*31%) 75%;
            --brand-300-hsl: 41 calc(var(--saturation-factor, 1)*31%) 71%;
            --brand-330-hsl: 41 calc(var(--saturation-factor, 1)*31%) 68%;
            --brand-345-hsl: 41 calc(var(--saturation-factor, 1)*31%) 64%;
            --brand-360-hsl: 41 calc(var(--saturation-factor, 1)*31%) 60%;
            --brand-400-hsl: 41 calc(var(--saturation-factor, 1)*31%) 57%;
            --brand-430-hsl: 41 calc(var(--saturation-factor, 1)*31%) 53%;
            --brand-460-hsl: 41 calc(var(--saturation-factor, 1)*31%) 50%;
            --brand-500-hsl: 41 calc(var(--saturation-factor, 1)*31%) 46%;
            --brand-530-hsl: 41 calc(var(--saturation-factor, 1)*31%) 42%;
            --brand-560-hsl: 41 calc(var(--saturation-factor, 1)*31%) 39%;
            --brand-600-hsl: 41 calc(var(--saturation-factor, 1)*31%) 35%;
            --brand-630-hsl: 41 calc(var(--saturation-factor, 1)*31%) 32%;
            --brand-660-hsl: 41 calc(var(--saturation-factor, 1)*31%) 28%;
            --brand-700-hsl: 41 calc(var(--saturation-factor, 1)*31%) 24%;
            --brand-730-hsl: 41 calc(var(--saturation-factor, 1)*31%) 21%;
            --brand-760-hsl: 41 calc(var(--saturation-factor, 1)*31%) 17%;
            --brand-800-hsl: 41 calc(var(--saturation-factor, 1)*31%) 14%;
            --brand-830-hsl: 41 calc(var(--saturation-factor, 1)*31%) 10%;
            --brand-860-hsl: 41 calc(var(--saturation-factor, 1)*31%) 6%;
            --brand-900-hsl: 41 calc(var(--saturation-factor, 1)*31%) 3%;
            --mention-foreground: black !important;
            --primary-800-hsl: 52 calc(var(--saturation-factor, 1)*29%) 19%;
            --primary-730-hsl: 53 calc(var(--saturation-factor, 1)*29%) 28%;
            --primary-700-hsl: 53 calc(var(--saturation-factor, 1)*29%) 28%;
            --primary-660-hsl: 47 calc(var(--saturation-factor, 1)*34%) 24%;
            --primary-645-hsl: 41 calc(var(--saturation-factor, 1)*31%) 33%;
            --primary-630-hsl: 47 calc(var(--saturation-factor, 1)*33%) 30%;
            --primary-600-hsl: 41 calc(var(--saturation-factor, 1)*31%) 38%;
            --primary-560-hsl: 41 calc(var(--saturation-factor, 1)*31%) 46%;
            --primary-530-hsl: 41 calc(var(--saturation-factor, 1)*31%) 46%;
            --primary-500-hsl: 41 calc(var(--saturation-factor, 1)*31%) 46%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 41 calc(var(--saturation-factor, 1)*31%) 38.8%;
            --primary-400-hsl: 41 calc(var(--saturation-factor, 1)*31%) 35.2%;
        }
        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }
        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }
        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }
        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }
        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }
        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: black;
        }
        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: black;
            opacity: .6;
        }
        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }
        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/
        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(47.05882352941176, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(47.05882352941176, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }
        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }
        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }
        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }
        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(47.05882352941176, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }
        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }
        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/
        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }
        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }
        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }
        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/
        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: black !important;
        }
        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: black !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "AMOLED",
            "original": true,
            "accent": "hsl(235 85.6% 64.7%)",
            "primary": "#000000",
            "secondary": "#000000",
            "tertiary": "#000000",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --mention-foreground: white !important;
            --primary-800-hsl: 0 calc(var(--saturation-factor, 1)*0%) 0%;
            --primary-730-hsl: 240 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-700-hsl: 240 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-660-hsl: 0 calc(var(--saturation-factor, 1)*0%) 0%;
            --primary-645-hsl: 240 calc(var(--saturation-factor, 1)*100%) -5%;
            --primary-630-hsl: 240 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-600-hsl: 240 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-560-hsl: 240 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-530-hsl: 240 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-500-hsl: 240 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 240 calc(var(--saturation-factor, 1)*100%) -7.2%;
            --primary-400-hsl: 240 calc(var(--saturation-factor, 1)*100%) -10.8%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(240, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(240, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(240, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Zorin",
            "original": false,
            "accent": "hsl(200, 89%, 86%)",
            "primary": "#171d20",
            "secondary": "#171d20",
            "tertiary": "#1e2529",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 200 calc(var(--saturation-factor, 1)*89%) 133%;
            --brand-130-hsl: 200 calc(var(--saturation-factor, 1)*89%) 129%;
            --brand-160-hsl: 200 calc(var(--saturation-factor, 1)*89%) 126%;
            --brand-200-hsl: 200 calc(var(--saturation-factor, 1)*89%) 122%;
            --brand-230-hsl: 200 calc(var(--saturation-factor, 1)*89%) 118%;
            --brand-260-hsl: 200 calc(var(--saturation-factor, 1)*89%) 115%;
            --brand-300-hsl: 200 calc(var(--saturation-factor, 1)*89%) 111%;
            --brand-330-hsl: 200 calc(var(--saturation-factor, 1)*89%) 108%;
            --brand-345-hsl: 200 calc(var(--saturation-factor, 1)*89%) 104%;
            --brand-360-hsl: 200 calc(var(--saturation-factor, 1)*89%) 100%;
            --brand-400-hsl: 200 calc(var(--saturation-factor, 1)*89%) 97%;
            --brand-430-hsl: 200 calc(var(--saturation-factor, 1)*89%) 93%;
            --brand-460-hsl: 200 calc(var(--saturation-factor, 1)*89%) 90%;
            --brand-500-hsl: 200 calc(var(--saturation-factor, 1)*89%) 86%;
            --brand-530-hsl: 200 calc(var(--saturation-factor, 1)*89%) 82%;
            --brand-560-hsl: 200 calc(var(--saturation-factor, 1)*89%) 79%;
            --brand-600-hsl: 200 calc(var(--saturation-factor, 1)*89%) 75%;
            --brand-630-hsl: 200 calc(var(--saturation-factor, 1)*89%) 72%;
            --brand-660-hsl: 200 calc(var(--saturation-factor, 1)*89%) 68%;
            --brand-700-hsl: 200 calc(var(--saturation-factor, 1)*89%) 64%;
            --brand-730-hsl: 200 calc(var(--saturation-factor, 1)*89%) 61%;
            --brand-760-hsl: 200 calc(var(--saturation-factor, 1)*89%) 57%;
            --brand-800-hsl: 200 calc(var(--saturation-factor, 1)*89%) 54%;
            --brand-830-hsl: 200 calc(var(--saturation-factor, 1)*89%) 50%;
            --brand-860-hsl: 200 calc(var(--saturation-factor, 1)*89%) 46%;
            --brand-900-hsl: 200 calc(var(--saturation-factor, 1)*89%) 43%;
            --mention-foreground: black !important;
            --primary-800-hsl: 206 calc(var(--saturation-factor, 1)*14%) 10%;
            --primary-730-hsl: 202 calc(var(--saturation-factor, 1)*16%) 14%;
            --primary-700-hsl: 202 calc(var(--saturation-factor, 1)*16%) 14%;
            --primary-660-hsl: 197 calc(var(--saturation-factor, 1)*16%) 8%;
            --primary-645-hsl: 200 calc(var(--saturation-factor, 1)*16%) 6%;
            --primary-630-hsl: 200 calc(var(--saturation-factor, 1)*16%) 11%;
            --primary-600-hsl: 200 calc(var(--saturation-factor, 1)*16%) 11%;
            --primary-560-hsl: 202 calc(var(--saturation-factor, 1)*17%) 13%;
            --primary-530-hsl: 202 calc(var(--saturation-factor, 1)*17%) 13%;
            --primary-500-hsl: 202 calc(var(--saturation-factor, 1)*17%) 13%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 202 calc(var(--saturation-factor, 1)*17%) 5.8%;
            --primary-400-hsl: 202 calc(var(--saturation-factor, 1)*17%) 2%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(200, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(200, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(200, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: black !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: black !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Desaturated",
            "original": false,
            "accent": "hsl(227, 58%, 65%)",
            "primary": "#35383d",
            "secondary": "#2c2f34",
            "tertiary": "#1e1f24",
            "import": `/*Automatically Generated - Colorway Creator V1.12 - Preset: Hue Rotation*/
        :root {
          --brand-100-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 112%;
          --brand-130-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 108%;
          --brand-160-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 105%;
          --brand-200-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 101%;
          --brand-230-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 97%;
          --brand-260-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 94%;
          --brand-300-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 90%;
          --brand-330-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 87%;
          --brand-345-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 83%;
          --brand-360-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 79%;
          --brand-400-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 76%;
          --brand-430-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 72%;
          --brand-460-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 69%;
          --brand-500-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 65%;
          --brand-530-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 61%;
          --brand-560-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 58%;
          --brand-600-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 54%;
          --brand-630-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 51%;
          --brand-660-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 47%;
          --brand-700-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 43%;
          --brand-730-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 40%;
          --brand-760-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 36%;
          --brand-800-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 33%;
          --brand-830-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 29%;
          --brand-860-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 25%;
          --brand-900-hsl: 227 calc(var(--saturation-factor, 1) * 58%) 22%;
          --primary-800-hsl: 227 calc(var(--saturation-factor, 1) * 12%) 7%;
          --primary-730-hsl: 227 calc(var(--saturation-factor, 1) * 10%) 13%;
          --primary-700-hsl: 227 calc(var(--saturation-factor, 1) * 10%) 13%;
          --primary-660-hsl: 227 calc(var(--saturation-factor, 1) * 11%) 15%;
          --primary-645-hsl: 227 calc(var(--saturation-factor, 1) * 11%) 16%;
          --primary-630-hsl: 227 calc(var(--saturation-factor, 1) * 11%) 18%;
          --primary-600-hsl: 227 calc(var(--saturation-factor, 1) * 11%) 21%;
          --primary-560-hsl: 227 calc(var(--saturation-factor, 1) * 11%) 24%;
          --primary-530-hsl: 227 calc(var(--saturation-factor, 1) * 11%) 24%;
          --primary-500-hsl: 227 calc(var(--saturation-factor, 1) * 11%) 24%;
        }`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Crimson",
            "original": false,
            "accent": "hsl(0, 100%, 50%)",
            "primary": "#050000",
            "secondary": "#0a0000",
            "tertiary": "#0f0000",
            "import": `/*Automatically Generated - Colorway Creator V1.12 - By Riddim_GLiTCH*/
        :root {
            --brand-100-hsl: 0 calc(var(--saturation-factor, 1)*100%) 97%;
            --brand-130-hsl: 0 calc(var(--saturation-factor, 1)*100%) 93%;
            --brand-160-hsl: 0 calc(var(--saturation-factor, 1)*100%) 90%;
            --brand-200-hsl: 0 calc(var(--saturation-factor, 1)*100%) 86%;
            --brand-230-hsl: 0 calc(var(--saturation-factor, 1)*100%) 82%;
            --brand-260-hsl: 0 calc(var(--saturation-factor, 1)*100%) 79%;
            --brand-300-hsl: 0 calc(var(--saturation-factor, 1)*100%) 75%;
            --brand-330-hsl: 0 calc(var(--saturation-factor, 1)*100%) 72%;
            --brand-345-hsl: 0 calc(var(--saturation-factor, 1)*100%) 68%;
            --brand-360-hsl: 0 calc(var(--saturation-factor, 1)*100%) 64%;
            --brand-400-hsl: 0 calc(var(--saturation-factor, 1)*100%) 61%;
            --brand-430-hsl: 0 calc(var(--saturation-factor, 1)*100%) 57%;
            --brand-460-hsl: 0 calc(var(--saturation-factor, 1)*100%) 54%;
            --brand-500-hsl: 0 calc(var(--saturation-factor, 1)*100%) 50%;
            --brand-530-hsl: 0 calc(var(--saturation-factor, 1)*100%) 46%;
            --brand-560-hsl: 0 calc(var(--saturation-factor, 1)*100%) 43%;
            --brand-600-hsl: 0 calc(var(--saturation-factor, 1)*100%) 39%;
            --brand-630-hsl: 0 calc(var(--saturation-factor, 1)*100%) 36%;
            --brand-660-hsl: 0 calc(var(--saturation-factor, 1)*100%) 32%;
            --brand-700-hsl: 0 calc(var(--saturation-factor, 1)*100%) 28%;
            --brand-730-hsl: 0 calc(var(--saturation-factor, 1)*100%) 25%;
            --brand-760-hsl: 0 calc(var(--saturation-factor, 1)*100%) 21%;
            --brand-800-hsl: 0 calc(var(--saturation-factor, 1)*100%) 18%;
            --brand-830-hsl: 0 calc(var(--saturation-factor, 1)*100%) 14%;
            --brand-860-hsl: 0 calc(var(--saturation-factor, 1)*100%) 10%;
            --brand-900-hsl: 0 calc(var(--saturation-factor, 1)*100%) 7%;
            --mention-foreground: white !important;
            --primary-800-hsl: 0 calc(var(--saturation-factor, 1)*100%) 2%;
            --primary-730-hsl: 0 calc(var(--saturation-factor, 1)*100%) 3%;
            --primary-700-hsl: 0 calc(var(--saturation-factor, 1)*100%) 3%;
            --primary-660-hsl: 0 calc(var(--saturation-factor, 1)*100%) 2%;
            --primary-645-hsl: 0 calc(var(--saturation-factor, 1)*100%) -4%;
            --primary-630-hsl: 0 calc(var(--saturation-factor, 1)*100%) 2%;
            --primary-600-hsl: 0 calc(var(--saturation-factor, 1)*100%) 1%;
            --primary-560-hsl: 0 calc(var(--saturation-factor, 1)*100%) 1%;
            --primary-530-hsl: 0 calc(var(--saturation-factor, 1)*100%) 1%;
            --primary-500-hsl: 0 calc(var(--saturation-factor, 1)*100%) 1%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430-hsl: 0 calc(var(--saturation-factor, 1)*100%) -6.2%;
            --primary-400-hsl: 0 calc(var(--saturation-factor, 1)*100%) -9.8%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: gray !important;
            --channel-icon: gray !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: gray !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "Riddim_GLiTCH",
            "authorID": "801089753038061669"
        },
        {
            "name": "Jupiter",
            "original": true,
            "accent": "#ffd89b",
            "primary": "#ffd89b",
            "secondary": "#19547b",
            "tertiary": "#1e1f22",
            "import": `/*Automatically Generated - Colorway Creator V1.12 - Preset: Gradient Type 2*/
        @import url(//dablulite.github.io/css-snippets/NoLightInDark/import.css);
        @import url(//dablulite.github.io/css-snippets/NitroThemesFix/import.css);
        :root {
            --brand-100-hsl: 37 calc(var(--saturation-factor, 1)*100%) 127%;
            --brand-130-hsl: 37 calc(var(--saturation-factor, 1)*100%) 123%;
            --brand-160-hsl: 37 calc(var(--saturation-factor, 1)*100%) 120%;
            --brand-200-hsl: 37 calc(var(--saturation-factor, 1)*100%) 116%;
            --brand-230-hsl: 37 calc(var(--saturation-factor, 1)*100%) 112%;
            --brand-260-hsl: 37 calc(var(--saturation-factor, 1)*100%) 109%;
            --brand-300-hsl: 37 calc(var(--saturation-factor, 1)*100%) 105%;
            --brand-330-hsl: 37 calc(var(--saturation-factor, 1)*100%) 102%;
            --brand-345-hsl: 37 calc(var(--saturation-factor, 1)*100%) 98%;
            --brand-360-hsl: 37 calc(var(--saturation-factor, 1)*100%) 94%;
            --brand-400-hsl: 37 calc(var(--saturation-factor, 1)*100%) 91%;
            --brand-430-hsl: 37 calc(var(--saturation-factor, 1)*100%) 87%;
            --brand-460-hsl: 37 calc(var(--saturation-factor, 1)*100%) 84%;
            --brand-500-hsl: 37 calc(var(--saturation-factor, 1)*100%) 80%;
            --brand-530-hsl: 37 calc(var(--saturation-factor, 1)*100%) 76%;
            --brand-560-hsl: 37 calc(var(--saturation-factor, 1)*100%) 73%;
            --brand-600-hsl: 37 calc(var(--saturation-factor, 1)*100%) 69%;
            --brand-630-hsl: 37 calc(var(--saturation-factor, 1)*100%) 66%;
            --brand-660-hsl: 37 calc(var(--saturation-factor, 1)*100%) 62%;
            --brand-700-hsl: 37 calc(var(--saturation-factor, 1)*100%) 58%;
            --brand-730-hsl: 37 calc(var(--saturation-factor, 1)*100%) 55%;
            --brand-760-hsl: 37 calc(var(--saturation-factor, 1)*100%) 51%;
            --brand-800-hsl: 37 calc(var(--saturation-factor, 1)*100%) 48%;
            --brand-830-hsl: 37 calc(var(--saturation-factor, 1)*100%) 44%;
            --brand-860-hsl: 37 calc(var(--saturation-factor, 1)*100%) 40%;
            --brand-900-hsl: 37 calc(var(--saturation-factor, 1)*100%) 37%;
        }
        :root {
            --bg-overlay-1: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-1)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-1))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-2: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-2)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-2))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-3: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-3)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-3))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-4: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-4)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-4))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-5: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-5)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-5))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-6: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-hover: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-hover-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-hover-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-hover)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-hover))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-active: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-active-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-active-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-active)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-active))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-selected: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-selected-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-selected-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-selected)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-selected))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-chat: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-chat)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-chat))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-home: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-home-card: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home-card)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home-card))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-app-frame: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-app-frame)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-app-frame))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
        }
        .theme-dark {
            --bg-overlay-color: 0 0 0;
            --bg-overlay-color-inverse: 255 255 255;
            --bg-overlay-opacity-1: 0.85;
            --bg-overlay-opacity-2: 0.8;
            --bg-overlay-opacity-3: 0.7;
            --bg-overlay-opacity-4: 0.5;
            --bg-overlay-opacity-5: 0.4;
            --bg-overlay-opacity-6: 0.1;
            --bg-overlay-opacity-hover: 0.5;
            --bg-overlay-opacity-hover-inverse: 0.08;
            --bg-overlay-opacity-active: 0.45;
            --bg-overlay-opacity-active-inverse: 0.1;
            --bg-overlay-opacity-selected: 0.4;
            --bg-overlay-opacity-selected-inverse: 0.15;
            --bg-overlay-opacity-chat: 0.8;
            --bg-overlay-opacity-home: 0.85;
            --bg-overlay-opacity-home-card: 0.8;
            --bg-overlay-opacity-app-frame: var(--bg-overlay-opacity-4);
        }
        .theme-light {
            --bg-overlay-color: 255 255 255;
            --bg-overlay-color-inverse: 0 0 0;
            --bg-overlay-opacity-1: 0.9;
            --bg-overlay-opacity-2: 0.8;
            --bg-overlay-opacity-3: 0.7;
            --bg-overlay-opacity-4: 0.6;
            --bg-overlay-opacity-5: 0.3;
            --bg-overlay-opacity-6: 0.15;
            --bg-overlay-opacity-hover: 0.7;
            --bg-overlay-opacity-hover-inverse: 0.02;
            --bg-overlay-opacity-active: 0.65;
            --bg-overlay-opacity-active-inverse: 0.03;
            --bg-overlay-opacity-selected: 0.6;
            --bg-overlay-opacity-selected-inverse: 0.04;
            --bg-overlay-opacity-chat: 0.9;
            --bg-overlay-opacity-home: 0.7;
            --bg-overlay-opacity-home-card: 0.9;
            --bg-overlay-opacity-app-frame: var(--bg-overlay-opacity-5);
        }
        .children-3xh0VB:after, .form-3gdLxP:before {
            content: none;
        }
        .scroller-3X7KbA {
            background: var(--bg-overlay-app-frame,var(--background-tertiary));
        }
        .expandedFolderBackground-1kSAf6 {
            background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
        }
        .wrapper-3kah-n:not(:hover):not(.selected-1Drb7Z) .childWrapper-1j_1ub {
            background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
        }
        .folder-241Joy:has(.expandedFolderIconWrapper-3RwQpD) {
            background: var(--bg-overlay-6,var(--background-secondary));
        }
        .circleIconButton-1VxDrg:not(.selected-2r1Hvo) {
            background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
        }
        .auto-2TJ1RH::-webkit-scrollbar-thumb,
        .thin-RnSY0a::-webkit-scrollbar-thumb {
            background-size: 200vh;
            background-image: -webkit-gradient(linear,left top,left bottom,from(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4))),to(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4)))),var(--custom-theme-background);
            background-image: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4))),var(--custom-theme-background);
        }
        .auto-2TJ1RH::-webkit-scrollbar-track {
            background-size: 200vh;
            background-image: -webkit-gradient(linear,left top,left bottom,from(rgb(var(--bg-overlay-color)/.4)),to(rgb(var(--bg-overlay-color)/.4))),var(--custom-theme-background);
            background-image: linear-gradient(rgb(var(--bg-overlay-color)/.4),rgb(var(--bg-overlay-color)/.4)),var(--custom-theme-background);
        }
        :root {
            --custom-theme-background: linear-gradient(48.17deg,
                hsl(37 calc(var(--saturation-factor, 1)*100%) 80%) 11.21%,
                hsl(204 calc(var(--saturation-factor, 1)*66%) 29%) 61.92%);
        }`,
            "author": "DaBluLite",
            "authorID": "582170007505731594",
            "isGradient": true,
            "colors": ["accent", "primary", "secondary"]
        },
        {
            "name": "Neon Candy",
            "original": true,
            "accent": "#FC00FF",
            "primary": "#00DBDE",
            "secondary": "#00DBDE",
            "tertiary": "#00DBDE",
            "import": `@import url(//dablulite.github.io/css-snippets/NoLightInDark/import.css);
        @import url(//dablulite.github.io/css-snippets/NitroThemesFix/import.css);
        :root {
            --brand-100-hsl: 299 calc(var(--saturation-factor, 1)*100%) 97%;
            --brand-130-hsl: 299 calc(var(--saturation-factor, 1)*100%) 93%;
            --brand-160-hsl: 299 calc(var(--saturation-factor, 1)*100%) 90%;
            --brand-200-hsl: 299 calc(var(--saturation-factor, 1)*100%) 86%;
            --brand-230-hsl: 299 calc(var(--saturation-factor, 1)*100%) 82%;
            --brand-260-hsl: 299 calc(var(--saturation-factor, 1)*100%) 79%;
            --brand-300-hsl: 299 calc(var(--saturation-factor, 1)*100%) 75%;
            --brand-330-hsl: 299 calc(var(--saturation-factor, 1)*100%) 72%;
            --brand-345-hsl: 299 calc(var(--saturation-factor, 1)*100%) 68%;
            --brand-360-hsl: 299 calc(var(--saturation-factor, 1)*100%) 64%;
            --brand-400-hsl: 299 calc(var(--saturation-factor, 1)*100%) 61%;
            --brand-430-hsl: 299 calc(var(--saturation-factor, 1)*100%) 57%;
            --brand-460-hsl: 299 calc(var(--saturation-factor, 1)*100%) 54%;
            --brand-500-hsl: 299 calc(var(--saturation-factor, 1)*100%) 50%;
            --brand-530-hsl: 299 calc(var(--saturation-factor, 1)*100%) 46%;
            --brand-560-hsl: 299 calc(var(--saturation-factor, 1)*100%) 43%;
            --brand-600-hsl: 299 calc(var(--saturation-factor, 1)*100%) 39%;
            --brand-630-hsl: 299 calc(var(--saturation-factor, 1)*100%) 36%;
            --brand-660-hsl: 299 calc(var(--saturation-factor, 1)*100%) 32%;
            --brand-700-hsl: 299 calc(var(--saturation-factor, 1)*100%) 28%;
            --brand-730-hsl: 299 calc(var(--saturation-factor, 1)*100%) 25%;
            --brand-760-hsl: 299 calc(var(--saturation-factor, 1)*100%) 21%;
            --brand-800-hsl: 299 calc(var(--saturation-factor, 1)*100%) 18%;
            --brand-830-hsl: 299 calc(var(--saturation-factor, 1)*100%) 14%;
            --brand-860-hsl: 299 calc(var(--saturation-factor, 1)*100%) 10%;
            --brand-900-hsl: 299 calc(var(--saturation-factor, 1)*100%) 7%;
        }
        :root {
            --bg-overlay-1: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-1)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-1))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-2: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-2)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-2))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-3: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-3)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-3))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-4: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-4)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-4))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-5: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-5)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-5))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-6: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-hover: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-hover-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-hover-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-hover)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-hover))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-active: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-active-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-active-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-active)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-active))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-selected: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-selected-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-selected-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-selected)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-selected))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-chat: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-chat)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-chat))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-home: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-home-card: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home-card)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home-card))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --bg-overlay-app-frame: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-app-frame)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-app-frame))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
            --custom-theme-background: linear-gradient(90deg,
            hsl(181, calc(var(--saturation-factor, 1)*100%), 44%) 0%,
            hsl(299, calc(var(--saturation-factor, 1)*100%), 50%) 100%);
        }
        .theme-dark {
            --bg-overlay-color: 20 20 20;
            --bg-overlay-color-inverse: 255 255 255;
            --bg-overlay-opacity-1: 0.85;
            --bg-overlay-opacity-2: 0.8;
            --bg-overlay-opacity-3: 0.7;
            --bg-overlay-opacity-4: 0.5;
            --bg-overlay-opacity-5: 0.4;
            --bg-overlay-opacity-6: 0.1;
            --bg-overlay-opacity-hover: 0.5;
            --bg-overlay-opacity-hover-inverse: 0.08;
            --bg-overlay-opacity-active: 0.45;
            --bg-overlay-opacity-active-inverse: 0.1;
            --bg-overlay-opacity-selected: 0.4;
            --bg-overlay-opacity-selected-inverse: 0.15;
            --bg-overlay-opacity-chat: 0.8;
            --bg-overlay-opacity-home: 0.85;
            --bg-overlay-opacity-home-card: 0.8;
            --bg-overlay-opacity-app-frame: var(--bg-overlay-opacity-4);
        }
        .theme-light {
            --bg-overlay-color: 230 230 230;
            --bg-overlay-color-inverse: 0 0 0;
            --bg-overlay-opacity-1: 0.9;
            --bg-overlay-opacity-2: 0.8;
            --bg-overlay-opacity-3: 0.7;
            --bg-overlay-opacity-4: 0.6;
            --bg-overlay-opacity-5: 0.3;
            --bg-overlay-opacity-6: 0.15;
            --bg-overlay-opacity-hover: 0.7;
            --bg-overlay-opacity-hover-inverse: 0.02;
            --bg-overlay-opacity-active: 0.65;
            --bg-overlay-opacity-active-inverse: 0.03;
            --bg-overlay-opacity-selected: 0.6;
            --bg-overlay-opacity-selected-inverse: 0.04;
            --bg-overlay-opacity-chat: 0.9;
            --bg-overlay-opacity-home: 0.7;
            --bg-overlay-opacity-home-card: 0.9;
            --bg-overlay-opacity-app-frame: var(--bg-overlay-opacity-5);
        }
        .children-3xh0VB:after, .form-3gdLxP:before {
            content: none;
        }
        .scroller-3X7KbA {
            background: var(--bg-overlay-app-frame,var(--background-tertiary));
        }
        .expandedFolderBackground-1kSAf6 {
            background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
        }
        .wrapper-3kah-n:not(:hover):not(.selected-1Drb7Z) .childWrapper-1j_1ub {
            background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
        }
        .folder-241Joy:has(.expandedFolderIconWrapper-3RwQpD) {
            background: var(--bg-overlay-6,var(--background-secondary));
        }
        .circleIconButton-1VxDrg:not(.selected-2r1Hvo) {
            background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
        }
        .auto-2TJ1RH::-webkit-scrollbar-thumb,
        .thin-RnSY0a::-webkit-scrollbar-thumb {
            background-size: 200vh;
            background-image: -webkit-gradient(linear,left top,left bottom,from(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4))),to(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4)))),var(--custom-theme-background);
            background-image: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4))),var(--custom-theme-background);
        }
        .auto-2TJ1RH::-webkit-scrollbar-track {
            background-size: 200vh;
            background-image: -webkit-gradient(linear,left top,left bottom,from(rgb(var(--bg-overlay-color)/.4)),to(rgb(var(--bg-overlay-color)/.4))),var(--custom-theme-background);
            background-image: linear-gradient(rgb(var(--bg-overlay-color)/.4),rgb(var(--bg-overlay-color)/.4)),var(--custom-theme-background);
        }`,
            "author": "DaBluLite",
            "authorID": "582170007505731594",
            "isGradient": true,
            "colors": ["accent", "primary"]
        },
        {
            "name": "Wildberry",
            "original": false,
            "accent": "#f40172",
            "primary": "#180029",
            "secondary": "#340057",
            "tertiary": "#4b007a",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 332 calc(var(--saturation-factor, 1)*99%) 95%;
            --brand-130-hsl: 332 calc(var(--saturation-factor, 1)*99%) 91%;
            --brand-160-hsl: 332 calc(var(--saturation-factor, 1)*99%) 88%;
            --brand-200-hsl: 332 calc(var(--saturation-factor, 1)*99%) 84%;
            --brand-230-hsl: 332 calc(var(--saturation-factor, 1)*99%) 80%;
            --brand-260-hsl: 332 calc(var(--saturation-factor, 1)*99%) 77%;
            --brand-300-hsl: 332 calc(var(--saturation-factor, 1)*99%) 73%;
            --brand-330-hsl: 332 calc(var(--saturation-factor, 1)*99%) 70%;
            --brand-345-hsl: 332 calc(var(--saturation-factor, 1)*99%) 66%;
            --brand-360-hsl: 332 calc(var(--saturation-factor, 1)*99%) 62%;
            --brand-400-hsl: 332 calc(var(--saturation-factor, 1)*99%) 59%;
            --brand-430-hsl: 332 calc(var(--saturation-factor, 1)*99%) 55%;
            --brand-460-hsl: 332 calc(var(--saturation-factor, 1)*99%) 52%;
            --brand-500-hsl: 332 calc(var(--saturation-factor, 1)*99%) 48%;
            --brand-530-hsl: 332 calc(var(--saturation-factor, 1)*99%) 44%;
            --brand-560-hsl: 332 calc(var(--saturation-factor, 1)*99%) 41%;
            --brand-600-hsl: 332 calc(var(--saturation-factor, 1)*99%) 37%;
            --brand-630-hsl: 332 calc(var(--saturation-factor, 1)*99%) 34%;
            --brand-660-hsl: 332 calc(var(--saturation-factor, 1)*99%) 30%;
            --brand-700-hsl: 332 calc(var(--saturation-factor, 1)*99%) 26%;
            --brand-730-hsl: 332 calc(var(--saturation-factor, 1)*99%) 23%;
            --brand-760-hsl: 332 calc(var(--saturation-factor, 1)*99%) 19%;
            --brand-800-hsl: 332 calc(var(--saturation-factor, 1)*99%) 16%;
            --brand-830-hsl: 332 calc(var(--saturation-factor, 1)*99%) 12%;
            --brand-860-hsl: 332 calc(var(--saturation-factor, 1)*99%) 8%;
            --brand-900-hsl: 332 calc(var(--saturation-factor, 1)*99%) 5%;
            --mention-foreground: white !important;
            --primary-800-hsl: 277 calc(var(--saturation-factor, 1)*100%) 17%;
            --primary-730-hsl: 277 calc(var(--saturation-factor, 1)*100%) 24%;
            --primary-700-hsl: 277 calc(var(--saturation-factor, 1)*100%) 24%;
            --primary-660-hsl: 276 calc(var(--saturation-factor, 1)*100%) 14%;
            --primary-645-hsl: 275 calc(var(--saturation-factor, 1)*100%) 3%;
            --primary-630-hsl: 276 calc(var(--saturation-factor, 1)*100%) 17%;
            --primary-600-hsl: 275 calc(var(--saturation-factor, 1)*100%) 8%;
            --primary-560-hsl: 274 calc(var(--saturation-factor, 1)*100%) 10%;
            --primary-530-hsl: 274 calc(var(--saturation-factor, 1)*100%) 10%;
            --primary-500-hsl: 274 calc(var(--saturation-factor, 1)*100%) 10%;
            --primary-460: gray;
            --primary-430-hsl: 274 calc(var(--saturation-factor, 1)*100%) 2.8%;
            --primary-400-hsl: 274 calc(var(--saturation-factor, 1)*100%) -0.8000000000000007%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(275.8620689655172, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --channel-icon: hsl(275.8620689655172, calc(var(--saturation-factor, 1)*100%), 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(275.8620689655172, calc(var(--saturation-factor, 1)*100%), 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Facebook",
            "original": false,
            "accent": "#2375e1",
            "primary": "#18191a",
            "secondary": "#242526",
            "tertiary": "#3a3b3c",
            "import": `/*Automatically Generated - Colorway Creator V1.13*/
        :root {
            --brand-100-hsl: 214 calc(var(--saturation-factor, 1)*76%) 98%;
            --brand-130-hsl: 214 calc(var(--saturation-factor, 1)*76%) 94%;
            --brand-160-hsl: 214 calc(var(--saturation-factor, 1)*76%) 91%;
            --brand-200-hsl: 214 calc(var(--saturation-factor, 1)*76%) 87%;
            --brand-230-hsl: 214 calc(var(--saturation-factor, 1)*76%) 83%;
            --brand-260-hsl: 214 calc(var(--saturation-factor, 1)*76%) 80%;
            --brand-300-hsl: 214 calc(var(--saturation-factor, 1)*76%) 76%;
            --brand-330-hsl: 214 calc(var(--saturation-factor, 1)*76%) 73%;
            --brand-345-hsl: 214 calc(var(--saturation-factor, 1)*76%) 69%;
            --brand-360-hsl: 214 calc(var(--saturation-factor, 1)*76%) 65%;
            --brand-400-hsl: 214 calc(var(--saturation-factor, 1)*76%) 62%;
            --brand-430-hsl: 214 calc(var(--saturation-factor, 1)*76%) 58%;
            --brand-460-hsl: 214 calc(var(--saturation-factor, 1)*76%) 55%;
            --brand-500-hsl: 214 calc(var(--saturation-factor, 1)*76%) 51%;
            --brand-530-hsl: 214 calc(var(--saturation-factor, 1)*76%) 47%;
            --brand-560-hsl: 214 calc(var(--saturation-factor, 1)*76%) 44%;
            --brand-600-hsl: 214 calc(var(--saturation-factor, 1)*76%) 40%;
            --brand-630-hsl: 214 calc(var(--saturation-factor, 1)*76%) 37%;
            --brand-660-hsl: 214 calc(var(--saturation-factor, 1)*76%) 33%;
            --brand-700-hsl: 214 calc(var(--saturation-factor, 1)*76%) 29%;
            --brand-730-hsl: 214 calc(var(--saturation-factor, 1)*76%) 26%;
            --brand-760-hsl: 214 calc(var(--saturation-factor, 1)*76%) 22%;
            --brand-800-hsl: 214 calc(var(--saturation-factor, 1)*76%) 19%;
            --brand-830-hsl: 214 calc(var(--saturation-factor, 1)*76%) 15%;
            --brand-860-hsl: 214 calc(var(--saturation-factor, 1)*76%) 11%;
            --brand-900-hsl: 214 calc(var(--saturation-factor, 1)*76%) 8%;
            --primary-800-hsl: 200 calc(var(--saturation-factor, 1)*4%) 16%;
            --primary-730-hsl: 200 calc(var(--saturation-factor, 1)*3%) 23%;
            --primary-700-hsl: 200 calc(var(--saturation-factor, 1)*3%) 23%;
            --primary-660-hsl: 210 calc(var(--saturation-factor, 1)*3%) 25.6%;
            --primary-645-hsl: 200 calc(var(--saturation-factor, 1)*6%) 5%;
            --primary-630-hsl: 210 calc(var(--saturation-factor, 1)*3%) 15%;
            --primary-600-hsl: 200 calc(var(--saturation-factor, 1)*6%) 10%;
            --primary-560-hsl: 195 calc(var(--saturation-factor, 1)*7%) 12%;
            --primary-530-hsl: 195 calc(var(--saturation-factor, 1)*7%) 12%;
            --primary-500-hsl: 195 calc(var(--saturation-factor, 1)*7%) 12%;
        }`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Material You",
            "original": false,
            "accent": "#004977",
            "primary": "#1f1f1f",
            "secondary": "#28292a",
            "tertiary": "#2d2f31",
            "import": `/*Automatically Generated - Colorway Creator V1.12*/
        :root {
            --brand-100-hsl: 203 calc(var(--saturation-factor, 1)*100%) 70%;
            --brand-130-hsl: 203 calc(var(--saturation-factor, 1)*100%) 66%;
            --brand-160-hsl: 203 calc(var(--saturation-factor, 1)*100%) 63%;
            --brand-200-hsl: 203 calc(var(--saturation-factor, 1)*100%) 59%;
            --brand-230-hsl: 203 calc(var(--saturation-factor, 1)*100%) 55%;
            --brand-260-hsl: 203 calc(var(--saturation-factor, 1)*100%) 52%;
            --brand-300-hsl: 203 calc(var(--saturation-factor, 1)*100%) 48%;
            --brand-330-hsl: 203 calc(var(--saturation-factor, 1)*100%) 45%;
            --brand-345-hsl: 203 calc(var(--saturation-factor, 1)*100%) 41%;
            --brand-360-hsl: 203 calc(var(--saturation-factor, 1)*100%) 37%;
            --brand-400-hsl: 203 calc(var(--saturation-factor, 1)*100%) 34%;
            --brand-430-hsl: 203 calc(var(--saturation-factor, 1)*100%) 30%;
            --brand-460-hsl: 203 calc(var(--saturation-factor, 1)*100%) 27%;
            --brand-500-hsl: 203 calc(var(--saturation-factor, 1)*100%) 23%;
            --brand-530-hsl: 203 calc(var(--saturation-factor, 1)*100%) 19%;
            --brand-560-hsl: 203 calc(var(--saturation-factor, 1)*100%) 16%;
            --brand-600-hsl: 203 calc(var(--saturation-factor, 1)*100%) 12%;
            --brand-630-hsl: 203 calc(var(--saturation-factor, 1)*100%) 9%;
            --brand-660-hsl: 203 calc(var(--saturation-factor, 1)*100%) 5%;
            --brand-700-hsl: 203 calc(var(--saturation-factor, 1)*100%) 1%;
            --brand-730-hsl: 203 calc(var(--saturation-factor, 1)*100%) -2%;
            --brand-760-hsl: 203 calc(var(--saturation-factor, 1)*100%) -6%;
            --brand-800-hsl: 203 calc(var(--saturation-factor, 1)*100%) -9%;
            --brand-830-hsl: 203 calc(var(--saturation-factor, 1)*100%) -13%;
            --brand-860-hsl: 203 calc(var(--saturation-factor, 1)*100%) -17%;
            --brand-900-hsl: 203 calc(var(--saturation-factor, 1)*100%) -20%;
            --mention-foreground: white !important;
            --primary-800-hsl: 220 calc(var(--saturation-factor, 1)*5%) 13%;
            --primary-730-hsl: 210 calc(var(--saturation-factor, 1)*4%) 18%;
            --primary-700-hsl: 210 calc(var(--saturation-factor, 1)*4%) 18%;
            --primary-660-hsl: 240 calc(var(--saturation-factor, 1)*2%) 13%;
            --primary-645-hsl: 0 calc(var(--saturation-factor, 1)*0%) 7%;
            --primary-630-hsl: 210 calc(var(--saturation-factor, 1)*2%) 16%;
            --primary-600-hsl: 0 calc(var(--saturation-factor, 1)*0%) 12%;
            --primary-560-hsl: 0 calc(var(--saturation-factor, 1)*0%) 15%;
            --primary-530-hsl: 0 calc(var(--saturation-factor, 1)*0%) 15%;
            --primary-500-hsl: 0 calc(var(--saturation-factor, 1)*0%) 15%;
            --primary-460: gray;
            --primary-430-hsl: 0 calc(var(--saturation-factor, 1)*0%) 7.8%;
            --primary-400-hsl: 0 calc(var(--saturation-factor, 1)*0%) 4.199999999999999%;
        }

        /*Primary*/
        .theme-dark .container-2cd8Mz *,
        .theme-dark .body-16rSsp *,
        .theme-dark .toolbar-3_r2xA *,
        .theme-dark .container-89zvna *,
        .theme-dark .messageContent-2t3eCI,
        .theme-dark .attachButtonPlus-3IYelE,
        .theme-dark .username-h_Y3Us:not([style]),
        .theme-dark .children-3xh0VB *,
        .theme-dark .buttonContainer-1502pf *,
        .theme-dark .listItem-3SmSlK * {
            --white-500: white !important;
            --text-normal: white !important;
            --header-primary: white !important;
        }

        .theme-dark .contentRegionScroller-2_GT_N *:not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
            --white-500: white !important;
        }

        .theme-dark .container-1um7CU,
        .theme-dark .container-2IKOsH,
        .theme-dark .header-3xB4vB {
            background: transparent;
        }

        .theme-dark .header-3xB4vB *,
        .theme-dark .title-31SJ6t * {
            --channel-icon: white;
        }

        .theme-dark .callContainer-HtHELf * {
            --white-500: white !important;
        }

        .theme-dark .channelTextArea-1FufC0 * {
            --text-normal: white;
        }

        .theme-dark .placeholder-1rCBhr {
            --channel-text-area-placeholder: white;
            opacity: .6;
        }

        .theme-dark .colorwaySelectorIcon {
            background-color: white;
        }

        .theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
            color: white;
        }
        /*End Primary*/

        /*Secondary*/
        .theme-dark .wrapper-2RrXDg *,
        .theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
        .theme-dark .members-3WRCEx *:not([style]),
        .theme-dark .sidebarRegionScroller-FXiQOh *,
        .theme-dark .header-1XpmZs,
        .theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
            --white-500: white !important;
            --channels-default: hsl(209.9999999999999, 100%, 90%) !important;
            --channel-icon: hsl(209.9999999999999, 100%, 90%) !important;
            --interactive-normal: var(--white-500);
            --interactive-hover: var(--white-500);
            --interactive-active: var(--white-500);
        }

        .theme-dark .channelRow-4X_3fi {
            background-color: var(--background-secondary);
        }

        .theme-dark .channelRow-4X_3fi * {
            --channel-icon: white;
        }

        .theme-dark #app-mount .activity-2EQDZv,
        .theme-dark #app-mount .activity-2EQDZv * {
            --channels-default: var(--white-500) !important;
        }

        .theme-dark .nameTag-sc-gpq {
            --header-primary: white !important;
            --header-secondary: hsl(209.9999999999999, 100%, 90%) !important;
        }

        .theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
            color: #fff;
        }

        .theme-dark .embedFull-1HGV2S {
            --text-normal: white;
        }
        /*End Secondary*/

        /*Tertiary*/
        .theme-dark .winButton-3UMjdg,
        .theme-dark .searchBar-2aylmZ *,
        .theme-dark .wordmarkWindows-2dq6rw,
        .theme-dark .searchBar-jGtisZ *,
        .theme-dark .searchBarComponent-3N7dCG {
            --white-500: white !important;
        }

        .theme-dark [style="background-color: var(--background-secondary);"] {
            color: white;
        }

        .theme-dark .popout-TdhJ6Z > *,
        .theme-dark .colorwayHeaderTitle {
            --interactive-normal: white !important;
            --header-secondary: white !important;
        }

        .theme-dark .tooltip-33Jwqe {
            --text-normal: white !important;
        }
        /*End Tertiary*/

        /*Accent*/
        .selected-2r1Hvo *,
        .selected-1Drb7Z *,
        #app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
        .colorDefault-2_rLdz.focused-3LIdPu,
        .row-1qtctT:hover,
        .colorwayInfoIcon,
        .colorwayCheckIcon {
            --white-500: white !important;
        }

        .ColorwaySelectorBtn:hover .colorwaySelectorIcon {
            background-color: white !important;
        }
        /*End Accent*/`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "Discord Teal",
            "original": false,
            "accent": "#175f6d",
            "primary": "#313338",
            "secondary": "#2b2d31",
            "tertiary": "#1e1f22",
            "import": `:root {
            --brand-100-hsl: var(--teal-100-hsl);
            --brand-130-hsl: var(--teal-130-hsl);
            --brand-160-hsl: var(--teal-160-hsl);
            --brand-200-hsl: var(--teal-200-hsl);
            --brand-230-hsl: var(--teal-230-hsl);
            --brand-260-hsl: var(--teal-260-hsl);
            --brand-300-hsl: var(--teal-300-hsl);
            --brand-330-hsl: var(--teal-330-hsl);
            --brand-345-hsl: var(--teal-345-hsl);
            --brand-360-hsl: var(--teal-360-hsl);
            --brand-400-hsl: var(--teal-400-hsl);
            --brand-430-hsl: var(--teal-430-hsl);
            --brand-460-hsl: var(--teal-460-hsl);
            --brand-500-hsl: var(--teal-500-hsl);
            --brand-530-hsl: var(--teal-530-hsl);
            --brand-560-hsl: var(--teal-560-hsl);
            --brand-600-hsl: var(--teal-600-hsl);
            --brand-630-hsl: var(--teal-630-hsl);
            --brand-660-hsl: var(--teal-660-hsl);
            --brand-700-hsl: var(--teal-700-hsl);
            --brand-730-hsl: var(--teal-730-hsl);
            --brand-760-hsl: var(--teal-760-hsl);
            --brand-800-hsl: var(--teal-800-hsl);
            --brand-830-hsl: var(--teal-830-hsl);
            --brand-860-hsl: var(--teal-860-hsl);
            --brand-900-hsl: var(--teal-900-hsl);
        }`,
            "author": "DaBluLite",
            "authorID": "582170007505731594",
            "colors": ["accent"]
        },
        {
            "name": "黄昏の花 (Twilight Blossom)",
            "original": true,
            "accent": "#e100ff",
            "primary": "#04000a",
            "secondary": "#0b0024",
            "tertiary": "#210042",
            "import": `/*Automatically Generated - Colorway Creator V1.14.1*/
        :root {
            --brand-100-hsl: 293 calc(var(--saturation-factor, 1)*100%) 97%;
            --brand-130-hsl: 293 calc(var(--saturation-factor, 1)*100%) 93%;
            --brand-160-hsl: 293 calc(var(--saturation-factor, 1)*100%) 90%;
            --brand-200-hsl: 293 calc(var(--saturation-factor, 1)*100%) 86%;
            --brand-230-hsl: 293 calc(var(--saturation-factor, 1)*100%) 82%;
            --brand-260-hsl: 293 calc(var(--saturation-factor, 1)*100%) 79%;
            --brand-300-hsl: 293 calc(var(--saturation-factor, 1)*100%) 75%;
            --brand-330-hsl: 293 calc(var(--saturation-factor, 1)*100%) 72%;
            --brand-345-hsl: 293 calc(var(--saturation-factor, 1)*100%) 68%;
            --brand-360-hsl: 293 calc(var(--saturation-factor, 1)*100%) 64%;
            --brand-400-hsl: 293 calc(var(--saturation-factor, 1)*100%) 61%;
            --brand-430-hsl: 293 calc(var(--saturation-factor, 1)*100%) 57%;
            --brand-460-hsl: 293 calc(var(--saturation-factor, 1)*100%) 54%;
            --brand-500-hsl: 293 calc(var(--saturation-factor, 1)*100%) 50%;
            --brand-530-hsl: 293 calc(var(--saturation-factor, 1)*100%) 46%;
            --brand-560-hsl: 293 calc(var(--saturation-factor, 1)*100%) 43%;
            --brand-600-hsl: 293 calc(var(--saturation-factor, 1)*100%) 39%;
            --brand-630-hsl: 293 calc(var(--saturation-factor, 1)*100%) 36%;
            --brand-660-hsl: 293 calc(var(--saturation-factor, 1)*100%) 32%;
            --brand-700-hsl: 293 calc(var(--saturation-factor, 1)*100%) 28%;
            --brand-730-hsl: 293 calc(var(--saturation-factor, 1)*100%) 25%;
            --brand-760-hsl: 293 calc(var(--saturation-factor, 1)*100%) 21%;
            --brand-800-hsl: 293 calc(var(--saturation-factor, 1)*100%) 18%;
            --brand-830-hsl: 293 calc(var(--saturation-factor, 1)*100%) 14%;
            --brand-860-hsl: 293 calc(var(--saturation-factor, 1)*100%) 10%;
            --brand-900-hsl: 293 calc(var(--saturation-factor, 1)*100%) 7%;
            --primary-800-hsl: 270 calc(var(--saturation-factor, 1)*100%) 20.2%;
            --primary-730-hsl: 270 calc(var(--saturation-factor, 1)*100%) 16.6%;
            --primary-700-hsl: 270 calc(var(--saturation-factor, 1)*100%) 13%;
            --primary-660-hsl: 258 calc(var(--saturation-factor, 1)*100%) 10.6%;
            --primary-645-hsl: 264 calc(var(--saturation-factor, 1)*100%) 0%;
            --primary-630-hsl: 258 calc(var(--saturation-factor, 1)*100%) 7%;
            --primary-600-hsl: 264 calc(var(--saturation-factor, 1)*100%) 2%;
            --primary-560-hsl: 264 calc(var(--saturation-factor, 1)*100%) 5.6%;
            --primary-530-hsl: 264 calc(var(--saturation-factor, 1)*100%) 9.2%;
            --primary-500-hsl: 264 calc(var(--saturation-factor, 1)*100%) 12.8%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430: hsl(258, calc(var(--saturation-factor, 1)*100%), 90%);
            --primary-400: hsl(258, calc(var(--saturation-factor, 1)*100%), 90%);
            --primary-360: hsl(258, calc(var(--saturation-factor, 1)*100%), 90%);
        }
        .emptyPage-2TGR7j,
        .scrollerContainer-y16Rs9,
        .container-2IKOsH,
        .header-3xB4vB {
            background-color: unset !important;
        }`,
            "author": "Riddim_GLiTCH",
            "authorID": "801089753038061669"
        },
        {
            "name": "Chai",
            "original": true,
            "accent": "#59cd51",
            "primary": "#1c1e15",
            "secondary": "#1e2118",
            "tertiary": "#24291e",
            "import": `/*Automatically Generated - Colorway Creator V1.14.1*/
        :root {
            --brand-100-hsl: 116 calc(var(--saturation-factor, 1)*55%) 100%;
            --brand-130-hsl: 116 calc(var(--saturation-factor, 1)*55%) 99%;
            --brand-160-hsl: 116 calc(var(--saturation-factor, 1)*55%) 96%;
            --brand-200-hsl: 116 calc(var(--saturation-factor, 1)*55%) 92%;
            --brand-230-hsl: 116 calc(var(--saturation-factor, 1)*55%) 88%;
            --brand-260-hsl: 116 calc(var(--saturation-factor, 1)*55%) 85%;
            --brand-300-hsl: 116 calc(var(--saturation-factor, 1)*55%) 81%;
            --brand-330-hsl: 116 calc(var(--saturation-factor, 1)*55%) 78%;
            --brand-345-hsl: 116 calc(var(--saturation-factor, 1)*55%) 74%;
            --brand-360-hsl: 116 calc(var(--saturation-factor, 1)*55%) 70%;
            --brand-400-hsl: 116 calc(var(--saturation-factor, 1)*55%) 67%;
            --brand-430-hsl: 116 calc(var(--saturation-factor, 1)*55%) 63%;
            --brand-460-hsl: 116 calc(var(--saturation-factor, 1)*55%) 60%;
            --brand-500-hsl: 116 calc(var(--saturation-factor, 1)*55%) 56%;
            --brand-530-hsl: 116 calc(var(--saturation-factor, 1)*55%) 52%;
            --brand-560-hsl: 116 calc(var(--saturation-factor, 1)*55%) 49%;
            --brand-600-hsl: 116 calc(var(--saturation-factor, 1)*55%) 45%;
            --brand-630-hsl: 116 calc(var(--saturation-factor, 1)*55%) 42%;
            --brand-660-hsl: 116 calc(var(--saturation-factor, 1)*55%) 38%;
            --brand-700-hsl: 116 calc(var(--saturation-factor, 1)*55%) 34%;
            --brand-730-hsl: 116 calc(var(--saturation-factor, 1)*55%) 31%;
            --brand-760-hsl: 116 calc(var(--saturation-factor, 1)*55%) 27%;
            --brand-800-hsl: 116 calc(var(--saturation-factor, 1)*55%) 24%;
            --brand-830-hsl: 116 calc(var(--saturation-factor, 1)*55%) 20%;
            --brand-860-hsl: 116 calc(var(--saturation-factor, 1)*55%) 16%;
            --brand-900-hsl: 116 calc(var(--saturation-factor, 1)*55%) 13%;
            --primary-800-hsl: 87 calc(var(--saturation-factor, 1)*16%) 21.2%;
            --primary-730-hsl: 87 calc(var(--saturation-factor, 1)*16%) 17.6%;
            --primary-700-hsl: 87 calc(var(--saturation-factor, 1)*16%) 14%;
            --primary-660-hsl: 80 calc(var(--saturation-factor, 1)*16%) 14.6%;
            --primary-645-hsl: 73 calc(var(--saturation-factor, 1)*18%) 5%;
            --primary-630-hsl: 80 calc(var(--saturation-factor, 1)*16%) 11%;
            --primary-600-hsl: 73 calc(var(--saturation-factor, 1)*18%) 10%;
            --primary-560-hsl: 73 calc(var(--saturation-factor, 1)*18%) 13.6%;
            --primary-530-hsl: 73 calc(var(--saturation-factor, 1)*18%) 17.2%;
            --primary-500-hsl: 73 calc(var(--saturation-factor, 1)*18%) 20.8%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430: hsl(80, calc(var(--saturation-factor, 1)*100%), 90%);
            --primary-400: hsl(80, calc(var(--saturation-factor, 1)*100%), 90%);
            --primary-360: hsl(80, calc(var(--saturation-factor, 1)*100%), 90%);
        }
        .emptyPage-2TGR7j,
        .scrollerContainer-y16Rs9,
        .container-2IKOsH,
        .header-3xB4vB {
            background-color: unset !important;
        }`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        },
        {
            "name": "CS1.6",
            "original": false,
            "accent": "#929a8d",
            "primary": "#3f4738",
            "secondary": "#5b6c51",
            "tertiary": "#4d5945",
            "import": `/*Automatically Generated - Colorway Creator V1.14.1*/
        :root {
            --brand-100-hsl: 97 calc(var(--saturation-factor, 1)*6%) 100%;
            --brand-130-hsl: 97 calc(var(--saturation-factor, 1)*6%) 100%;
            --brand-160-hsl: 97 calc(var(--saturation-factor, 1)*6%) 98%;
            --brand-200-hsl: 97 calc(var(--saturation-factor, 1)*6%) 94%;
            --brand-230-hsl: 97 calc(var(--saturation-factor, 1)*6%) 90%;
            --brand-260-hsl: 97 calc(var(--saturation-factor, 1)*6%) 87%;
            --brand-300-hsl: 97 calc(var(--saturation-factor, 1)*6%) 83%;
            --brand-330-hsl: 97 calc(var(--saturation-factor, 1)*6%) 80%;
            --brand-345-hsl: 97 calc(var(--saturation-factor, 1)*6%) 76%;
            --brand-360-hsl: 97 calc(var(--saturation-factor, 1)*6%) 72%;
            --brand-400-hsl: 97 calc(var(--saturation-factor, 1)*6%) 69%;
            --brand-430-hsl: 97 calc(var(--saturation-factor, 1)*6%) 65%;
            --brand-460-hsl: 97 calc(var(--saturation-factor, 1)*6%) 62%;
            --brand-500-hsl: 97 calc(var(--saturation-factor, 1)*6%) 58%;
            --brand-530-hsl: 97 calc(var(--saturation-factor, 1)*6%) 54%;
            --brand-560-hsl: 97 calc(var(--saturation-factor, 1)*6%) 51%;
            --brand-600-hsl: 97 calc(var(--saturation-factor, 1)*6%) 47%;
            --brand-630-hsl: 97 calc(var(--saturation-factor, 1)*6%) 44%;
            --brand-660-hsl: 97 calc(var(--saturation-factor, 1)*6%) 40%;
            --brand-700-hsl: 97 calc(var(--saturation-factor, 1)*6%) 36%;
            --brand-730-hsl: 97 calc(var(--saturation-factor, 1)*6%) 33%;
            --brand-760-hsl: 97 calc(var(--saturation-factor, 1)*6%) 29%;
            --brand-800-hsl: 97 calc(var(--saturation-factor, 1)*6%) 26%;
            --brand-830-hsl: 97 calc(var(--saturation-factor, 1)*6%) 22%;
            --brand-860-hsl: 97 calc(var(--saturation-factor, 1)*6%) 18%;
            --brand-900-hsl: 97 calc(var(--saturation-factor, 1)*6%) 15%;
            --primary-800-hsl: 96 calc(var(--saturation-factor, 1)*13%) 38.2%;
            --primary-730-hsl: 96 calc(var(--saturation-factor, 1)*13%) 34.6%;
            --primary-700-hsl: 96 calc(var(--saturation-factor, 1)*13%) 31%;
            --primary-660-hsl: 98 calc(var(--saturation-factor, 1)*14%) 40.6%;
            --primary-645-hsl: 92 calc(var(--saturation-factor, 1)*12%) 20%;
            --primary-630-hsl: 98 calc(var(--saturation-factor, 1)*14%) 37%;
            --primary-600-hsl: 92 calc(var(--saturation-factor, 1)*12%) 25%;
            --primary-560-hsl: 92 calc(var(--saturation-factor, 1)*12%) 28.6%;
            --primary-530-hsl: 92 calc(var(--saturation-factor, 1)*12%) 32.2%;
            --primary-500-hsl: 92 calc(var(--saturation-factor, 1)*12%) 35.8%;
            --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
            --primary-430: hsl(98, calc(var(--saturation-factor, 1)*100%), 90%);
            --primary-400: hsl(98, calc(var(--saturation-factor, 1)*100%), 90%);
            --primary-360: hsl(98, calc(var(--saturation-factor, 1)*100%), 90%);
        }
        .emptyPage-2TGR7j,
        .scrollerContainer-y16Rs9,
        .container-2IKOsH,
        .header-3xB4vB {
            background-color: unset !important;
        }`,
            "author": "DaBluLite",
            "authorID": "582170007505731594"
        }
    ];

    function generateCss(primaryColor, secondaryColor, tertiaryColor, accentColor, tintedText) {
        const colorwayCss = `/*Automatically Generated - Colorway Creator V${plugin.creatorVersion}*/
:root {
    --brand-100-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 13)), 100)}%;
    --brand-130-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 12)), 100)}%;
    --brand-160-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 11)), 100)}%;
    --brand-200-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 10)), 100)}%;
    --brand-230-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 9)), 100)}%;
    --brand-260-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 8)), 100)}%;
    --brand-300-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 7)), 100)}%;
    --brand-330-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 6)), 100)}%;
    --brand-345-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 5)), 100)}%;
    --brand-360-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 4)), 100)}%;
    --brand-400-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 3)), 100)}%;
    --brand-430-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 2)), 100)}%;
    --brand-460-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + 3.6), 100)}%;
    --brand-500-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${HexToHSL("#" + accentColor)[2]}%;
    --brand-530-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - 3.6), 0)}%;
    --brand-560-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 2)), 0)}%;
    --brand-600-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 3)), 0)}%;
    --brand-630-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 4)), 0)}%;
    --brand-660-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 5)), 0)}%;
    --brand-700-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 6)), 0)}%;
    --brand-730-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 7)), 0)}%;
    --brand-760-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 8)), 0)}%;
    --brand-800-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 9)), 0)}%;
    --brand-830-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 10)), 0)}%;
    --brand-860-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 11)), 0)}%;
    --brand-900-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 12)), 0)}%;
    --primary-800-hsl: ${HexToHSL("#" + tertiaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + tertiaryColor)[1]}%) ${Math.min(HexToHSL("#" + tertiaryColor)[2] + (3.6 * 2), 100)}%;
    --primary-730-hsl: ${HexToHSL("#" + tertiaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + tertiaryColor)[1]}%) ${Math.min(HexToHSL("#" + tertiaryColor)[2] + 3.6, 100)}%;
    --primary-700-hsl: ${HexToHSL("#" + tertiaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + tertiaryColor)[1]}%) ${HexToHSL("#" + tertiaryColor)[2]}%;
    --primary-660-hsl: ${HexToHSL("#" + secondaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + secondaryColor)[1]}%) ${Math.min(HexToHSL("#" + secondaryColor)[2] + 3.6, 100)}%;
    --primary-645-hsl: ${HexToHSL("#" + primaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + primaryColor)[1]}%) ${Math.max(HexToHSL("#" + primaryColor)[2] - 5, 0)}%;
    --primary-630-hsl: ${HexToHSL("#" + secondaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + secondaryColor)[1]}%) ${HexToHSL("#" + secondaryColor)[2]}%;
    --primary-600-hsl: ${HexToHSL("#" + primaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + primaryColor)[1]}%) ${HexToHSL("#" + primaryColor)[2]}%;
    --primary-560-hsl: ${HexToHSL("#" + primaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + primaryColor)[1]}%) ${Math.min(HexToHSL("#" + primaryColor)[2] + 3.6, 100)}%;
    --primary-530-hsl: ${HexToHSL("#" + primaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + primaryColor)[1]}%) ${Math.min(HexToHSL("#" + primaryColor)[2] + (3.6 * 2), 100)}%;
    --primary-500-hsl: ${HexToHSL("#" + primaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + primaryColor)[1]}%) ${Math.min(HexToHSL("#" + primaryColor)[2] + (3.6 * 3), 100)}%;${tintedText ? `\n    --primary-460-hsl: 0 calc(var(--saturation-factor, 1)*0%) 50%;
    --primary-430: ${HexToHSL("#" + secondaryColor)[0] === 0 ? "gray" : ((HexToHSL("#" + secondaryColor)[2] < 80) ? "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 90%)" : "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 20%)")};
    --primary-400: ${HexToHSL("#" + secondaryColor)[0] === 0 ? "gray" : ((HexToHSL("#" + secondaryColor)[2] < 80) ? "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 90%)" : "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 20%)")};
    --primary-360: ${HexToHSL("#" + secondaryColor)[0] === 0 ? "gray" : ((HexToHSL("#" + secondaryColor)[2] < 80) ? "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 90%)" : "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 20%)")};` : ""}
}
.emptyPage-2TGR7j,
.scrollerContainer-y16Rs9,
.container-2IKOsH,
.header-3xB4vB {
    background-color: unset !important;
}${(Math.round(HexToHSL("#" + primaryColor)[2]) > 80) ? `\n\n/*Primary*/
.theme-dark .container-2cd8Mz,
.theme-dark .body-16rSsp,
.theme-dark .toolbar-3_r2xA,
.theme-dark .container-89zvna,
.theme-dark .messageContent-2t3eCI,
.theme-dark .attachButtonPlus-3IYelE,
.theme-dark .username-h_Y3Us:not([style]),
.theme-dark .children-3xh0VB,
.theme-dark .buttonContainer-1502pf,
.theme-dark .listItem-3SmSlK,
.theme-dark .body-16rSsp .caret-1le2LN,
.theme-dark .body-16rSsp .titleWrapper-24Kyzc > h1,
.theme-dark .body-16rSsp .icon-2xnN2Y {
    --white-500: black !important;
    --interactive-normal: black !important;
    --text-normal: black !important;
    --text-muted: black !important;
    --header-primary: black !important;
    --header-secondary: black !important;
}

.theme-dark .contentRegionScroller-2_GT_N :not(.mtk1,.mtk2,.mtk3,.mtk4,.mtk5,.mtk6,.mtk7,.mtk8,.mtk9,.monaco-editor .line-numbers) {
    --white-500: black !important;
}

.theme-dark .container-1um7CU,
.theme-dark .container-2IKOsH,
.theme-dark .header-3xB4vB {
    background: transparent;
}

.theme-dark .container-ZMc96U {
    --channel-icon: black;
}

.theme-dark .callContainer-HtHELf {
    --white-500: ${(HexToHSL("#" + tertiaryColor)[2] > 80) ? "black" : "white"} !important;
}

.theme-dark .channelTextArea-1FufC0 {
    --text-normal: ${(HexToHSL("#" + primaryColor)[2] + 3.6 > 80) ? "black" : "white"};
}

.theme-dark .placeholder-1rCBhr {
    --channel-text-area-placeholder: ${(HexToHSL("#" + primaryColor)[2] + 3.6 > 80) ? "black" : "white"};
    opacity: .6;
}

.theme-dark .colorwaySelectorIcon {
    background-color: black;
}

.theme-dark .root-1CAIjD > .header-1ffhsl > h1 {
    color: black;
}
/*End Primary*/`: ""}${(HexToHSL("#" + secondaryColor)[2] > 80) ? `\n\n/*Secondary*/
.theme-dark .wrapper-2RrXDg *,
.theme-dark .sidebar-1tnWFu *:not(.hasBanner-2IrYih *),
.theme-dark .members-3WRCEx *:not([style]),
.theme-dark .sidebarRegionScroller-FXiQOh *,
.theme-dark .header-1XpmZs,
.theme-dark .lookFilled-1H2Jvj.colorPrimary-2-Lusz {
    --white-500: black !important;
    --channels-default: black !important;
    --channel-icon: black !important;
    --interactive-normal: var(--white-500);
    --interactive-hover: var(--white-500);
    --interactive-active: var(--white-500);
}

.theme-dark .channelRow-4X_3fi {
    background-color: var(--background-secondary);
}

.theme-dark .channelRow-4X_3fi * {
    --channel-icon: black;
}

.theme-dark #app-mount .activity-2EQDZv {
    --channels-default: var(--white-500) !important;
}

.theme-dark .nameTag-sc-gpq {
    --header-primary: black !important;
    --header-secondary: ${HexToHSL("#" + secondaryColor)[0] === 0 ? "gray" : ((HexToHSL("#" + secondaryColor)[2] < 80) ? "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 90%)" : "hsl(" + HexToHSL("#" + secondaryColor)[0] + ", calc(var(--saturation-factor, 1)*100%), 20%)")} !important;
}

.theme-dark .bannerVisible-Vkyg1I .headerContent-2SNbie {
    color: #fff;
}

.theme-dark .embedFull-1HGV2S {
    --text-normal: black;
}
/*End Secondary*/`: ""}${HexToHSL("#" + tertiaryColor)[2] > 80 ? `\n\n/*Tertiary*/
.theme-dark .winButton-3UMjdg,
.theme-dark .searchBar-2aylmZ *,
.theme-dark .wordmarkWindows-2dq6rw,
.theme-dark .searchBar-jGtisZ *,
.theme-dark .searchBarComponent-3N7dCG {
    --white-500: black !important;
}

.theme-dark [style="background-color: var(--background-secondary);"] {
    color: ${HexToHSL("#" + secondaryColor)[2] > 80 ? "black" : "white"};
}

.theme-dark .popout-TdhJ6Z > *,
.theme-dark .colorwayHeaderTitle {
    --interactive-normal: black !important;
    --header-secondary: black !important;
}

.theme-dark .tooltip-33Jwqe {
    --text-normal: black !important;
}
/*End Tertiary*/`: ""}${HexToHSL("#" + accentColor)[2] > 80 ? `\n\n/*Accent*/
.selected-2r1Hvo *,
.selected-1Drb7Z *,
#app-mount .lookFilled-1H2Jvj.colorBrand-2M3O3N:not(.buttonColor-3bP3fX),
.colorDefault-2_rLdz.focused-3LIdPu,
.row-1qtctT:hover,
.colorwayInfoIcon,
.colorwayCheckIcon {
    --white-500: black !important;
}

.ColorwaySelectorBtn:hover .colorwaySelectorIcon {
    background-color: black !important;
}

:root {
    --mention-foreground: black !important;
}
/*End Accent*/`: ""}`;
        return colorwayCss;
    }

    function getPreset(primaryColor, secondaryColor, tertiaryColor, accentColor) {
        function cyan() {
            return `:root {
    --cyan-accent-color: ${"#" + accentColor};
    --cyan-background-primary: hsl(${HexToHSL("#" + primaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + primaryColor)[1]}%) ${HexToHSL("#" + primaryColor)[2]}%/40%);
    --cyan-background-secondary: hsl(${HexToHSL("#" + tertiaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + tertiaryColor)[1]}%) ${Math.min(HexToHSL("#" + tertiaryColor)[2] + (3.6 * 2), 100)}%);
}`;
        }

        function virtualBoy() {
            return `:root {
    --VBaccent: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${HexToHSL("#" + accentColor)[2]}%;
    --VBaccent-muted: ${HexToHSL("#" + tertiaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + tertiaryColor)[1]}%) ${Math.max(((HexToHSL("#" + tertiaryColor)[2]) - 10), 0)}%;
    --VBaccent-dimmest: ${HexToHSL("#" + tertiaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + tertiaryColor)[1]}%) ${Math.min((HexToHSL("#" + tertiaryColor)[2] + (3.6 * 5) - 3), 100)}%;
}`;
        }

        function modular() {
            return `:root {
    --modular-hue: ${HexToHSL("#" + accentColor)[0]};
    --modular-saturation: calc(var(--saturation-factor, 1)${HexToHSL("#" + accentColor)[1]}%);
    --modular-lightness: ${HexToHSL("#" + accentColor)[2]}%;
}`;
        }

        function solana() {
            return `:root {
    --accent-hue: ${HexToHSL("#" + accentColor)[0]};
    --accent-saturation: calc(var(--saturation-factor, 1)${HexToHSL("#" + accentColor)[1]}%);
    --accent-brightness: ${HexToHSL("#" + accentColor)[2]}%;
    --background-accent-hue: ${HexToHSL("#" + primaryColor)[0]};
    --background-accent-saturation: calc(var(--saturation-factor, 1)${HexToHSL("#" + primaryColor)[1]}%);
    --background-accent-brightness: ${HexToHSL("#" + primaryColor)[2]}%;
    --background-overlay-opacity: 0%;
}`;
        }

        function gradientType1() {
            return `${gradientBase(accentColor)}
:root {
    --custom-theme-background: linear-gradient(239.16deg, #${primaryColor} 10.39%, #${secondaryColor} 26.87%, #${tertiaryColor} 48.31%, hsl(${HexToHSL("#" + secondaryColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + secondaryColor)[1]}%) ${Math.min(HexToHSL("#" + secondaryColor)[2] + 3.6, 100)}%) 64.98%, #${primaryColor} 92.5%);
}`;
        }

        function gradientType2() {
            return `${gradientBase(accentColor)}
:root {
    --custom-theme-background: linear-gradient(48.17deg, #${primaryColor} 11.21%, #${secondaryColor} 61.92%);
}`;
        }

        function hueRotation() {
            return `:root {
    --brand-100-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 13)), 100)}%;
    --brand-130-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 12)), 100)}%;
    --brand-160-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 11)), 100)}%;
    --brand-200-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 10)), 100)}%;
    --brand-230-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 9)), 100)}%;
    --brand-260-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 8)), 100)}%;
    --brand-300-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 7)), 100)}%;
    --brand-330-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 6)), 100)}%;
    --brand-345-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 5)), 100)}%;
    --brand-360-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 4)), 100)}%;
    --brand-400-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 3)), 100)}%;
    --brand-430-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 2)), 100)}%;
    --brand-460-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + 3.6), 100)}%;
    --brand-500-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${HexToHSL("#" + accentColor)[2]}%;
    --brand-530-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - 3.6), 0)}%;
    --brand-560-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 2)), 0)}%;
    --brand-600-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 3)), 0)}%;
    --brand-630-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 4)), 0)}%;
    --brand-660-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 5)), 0)}%;
    --brand-700-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 6)), 0)}%;
    --brand-730-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 7)), 0)}%;
    --brand-760-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 8)), 0)}%;
    --brand-800-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 9)), 0)}%;
    --brand-830-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 10)), 0)}%;
    --brand-860-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 11)), 0)}%;
    --brand-900-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 12)), 0)}%;
    --primary-800-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*12%) 7%;
    --primary-730-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*10%) 13%;
    --primary-700-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*10%) 13%;
    --primary-660-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*11%) 15%;
    --primary-645-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*11%) 16%;
    --primary-630-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*11%) 18%;
    --primary-600-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*11%) 21%;
    --primary-560-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*11%) 24%;
    --primary-530-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*11%) 24%;
    --primary-500-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*11%) 24%;
}`;
        }

        function accentSwap() {
            return `:root {
    --brand-100-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 13)), 100)}%;
    --brand-130-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 12)), 100)}%;
    --brand-160-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 11)), 100)}%;
    --brand-200-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 10)), 100)}%;
    --brand-230-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 9)), 100)}%;
    --brand-260-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 8)), 100)}%;
    --brand-300-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 7)), 100)}%;
    --brand-330-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 6)), 100)}%;
    --brand-345-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 5)), 100)}%;
    --brand-360-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 4)), 100)}%;
    --brand-400-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 3)), 100)}%;
    --brand-430-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + (3.6 * 2)), 100)}%;
    --brand-460-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.min(Math.round(HexToHSL("#" + accentColor)[2] + 3.6), 100)}%;
    --brand-500-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${HexToHSL("#" + accentColor)[2]}%;
    --brand-530-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - 3.6), 0)}%;
    --brand-560-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 2)), 0)}%;
    --brand-600-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 3)), 0)}%;
    --brand-630-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 4)), 0)}%;
    --brand-660-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 5)), 0)}%;
    --brand-700-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 6)), 0)}%;
    --brand-730-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 7)), 0)}%;
    --brand-760-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 8)), 0)}%;
    --brand-800-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 9)), 0)}%;
    --brand-830-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 10)), 0)}%;
    --brand-860-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 11)), 0)}%;
    --brand-900-hsl: ${HexToHSL("#" + accentColor)[0]} calc(var(--saturation-factor, 1)*${HexToHSL("#" + accentColor)[1]}%) ${Math.max(Math.round(HexToHSL("#" + accentColor)[2] - (3.6 * 12)), 0)}%;
}`;
        }

        return {
            cyan: {
                name: "Cyan",
                preset: cyan,
                id: "cyan",
                colors: ["primary", "secondary", "accent"]
            },
            virtualBoy: {
                name: "Virtual Boy",
                preset: virtualBoy,
                id: "virtualBoy",
                colors: ["tertiary", "accent"]
            },
            modular: {
                name: "Modular",
                preset: modular,
                id: "modular",
                colors: ["accent"]
            },
            solana: {
                name: "Solana",
                preset: solana,
                id: "solana",
                colors: ["primary", "accent"]
            },
            gradientType1: {
                name: "Gradient Type 1",
                preset: gradientType1,
                id: "gradientType1",
                colors: ["primary", "secondary", "tertiary", "accent"]
            },
            gradientType2: {
                name: "Gradient Type 2",
                preset: gradientType2,
                id: "gradientType2",
                colors: ["primary", "secondary", "accent"]
            },
            hueRotation: {
                name: "Hue Rotation",
                preset: hueRotation,
                id: "hueRotation",
                colors: ["accent"]
            },
            accentSwap: {
                name: "Accent Swap",
                preset: accentSwap,
                id: "accentSwap",
                colors: ["accent"]
            }
        };
    }

    function HexToHSL(H) {
        let r = 0, g = 0, b = 0;
        if (H.length === 4) r = "0x" + H[1] + H[1], g = "0x" + H[2] + H[2], b = "0x" + H[3] + H[3];
        else if (H.length === 7) r = "0x" + H[1] + H[2], g = "0x" + H[3] + H[4], b = "0x" + H[5] + H[6];
        r /= 255, g /= 255, b /= 255;
        var cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        l = (cmax + cmin) / 2, s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)), s = +(s * 100).toFixed(1), l = +(l * 100).toFixed(1);

        return [Math.round(h), Math.round(s), Math.round(l)];
    }

    const colorVariables = [
        "brand-100",
        "brand-130",
        "brand-160",
        "brand-200",
        "brand-230",
        "brand-260",
        "brand-300",
        "brand-330",
        "brand-345",
        "brand-360",
        "brand-400",
        "brand-430",
        "brand-460",
        "brand-500",
        "brand-530",
        "brand-560",
        "brand-600",
        "brand-630",
        "brand-660",
        "brand-700",
        "brand-730",
        "brand-760",
        "brand-800",
        "brand-830",
        "brand-860",
        "brand-900",
        "primary-900",
        "primary-860",
        "primary-830",
        "primary-800",
        "primary-760",
        "primary-730",
        "primary-700",
        "primary-660",
        "primary-645",
        "primary-630",
        "primary-600",
        "primary-560",
        "primary-530",
        "primary-500",
        "primary-460",
        "primary-430",
        "primary-400",
        "primary-360",
        "primary-330",
        "primary-300",
        "primary-260",
        "primary-230",
        "primary-200",
        "primary-160",
        "primary-130",
        "primary-100",
        "white-900",
        "white-860",
        "white-830",
        "white-800",
        "white-760",
        "white-730",
        "white-700",
        "white-660",
        "white-630",
        "white-600",
        "white-560",
        "white-530",
        "white-500",
        "white-460",
        "white-430",
        "white-400",
        "white-360",
        "white-330",
        "white-300",
        "white-260",
        "white-230",
        "white-200",
        "white-160",
        "white-130",
        "white-100",
        "teal-900",
        "teal-860",
        "teal-830",
        "teal-800",
        "teal-760",
        "teal-730",
        "teal-700",
        "teal-660",
        "teal-630",
        "teal-600",
        "teal-560",
        "teal-530",
        "teal-500",
        "teal-460",
        "teal-430",
        "teal-400",
        "teal-360",
        "teal-330",
        "teal-300",
        "teal-260",
        "teal-230",
        "teal-200",
        "teal-160",
        "teal-130",
        "teal-100",
        "black-900",
        "black-860",
        "black-830",
        "black-800",
        "black-760",
        "black-730",
        "black-700",
        "black-660",
        "black-630",
        "black-600",
        "black-560",
        "black-530",
        "black-500",
        "black-460",
        "black-430",
        "black-400",
        "black-360",
        "black-330",
        "black-300",
        "black-260",
        "black-230",
        "black-200",
        "black-160",
        "black-130",
        "black-100",
        "red-900",
        "red-860",
        "red-830",
        "red-800",
        "red-760",
        "red-730",
        "red-700",
        "red-660",
        "red-630",
        "red-600",
        "red-560",
        "red-530",
        "red-500",
        "red-460",
        "red-430",
        "red-400",
        "red-360",
        "red-330",
        "red-300",
        "red-260",
        "red-230",
        "red-200",
        "red-160",
        "red-130",
        "red-100",
        "yellow-900",
        "yellow-860",
        "yellow-830",
        "yellow-800",
        "yellow-760",
        "yellow-730",
        "yellow-700",
        "yellow-660",
        "yellow-630",
        "yellow-600",
        "yellow-560",
        "yellow-530",
        "yellow-500",
        "yellow-460",
        "yellow-430",
        "yellow-400",
        "yellow-360",
        "yellow-330",
        "yellow-300",
        "yellow-260",
        "yellow-230",
        "yellow-200",
        "yellow-160",
        "yellow-130",
        "yellow-100",
        "green-900",
        "green-860",
        "green-830",
        "green-800",
        "green-760",
        "green-730",
        "green-700",
        "green-660",
        "green-630",
        "green-600",
        "green-560",
        "green-530",
        "green-500",
        "green-460",
        "green-430",
        "green-400",
        "green-360",
        "green-330",
        "green-300",
        "green-260",
        "green-230",
        "green-200",
        "green-160",
        "green-130",
        "green-100",
    ];

    var pluginCSSElem = document.createElement("style");
    pluginCSSElem.textContent = pluginCSS;
    document.head.append(pluginCSSElem);

    dataStore.getMany(["actveColorway", "actveColorwayID"]).then(store => {
        colorwayCSS.set(store[0], store[1]);
    });

    dataStore.getMany([
        "colorwaySourceFiles",
        "customColorways",
        "colorwaysBtnPos"
    ]).then(
        ([
            colorwaySourceFiles,
            customColorways,
            colorwaysBtnPos
        ]) => {
            if (!colorwaySourceFiles) dataStore.set("colorwaySourceFiles", ["https://raw.githubusercontent.com/DaBluLite/DiscordColorways/master/index.json"]);
            if (!customColorways) dataStore.set("customColorways", []);
            if (!colorwaysBtnPos) dataStore.set("colorwaysBtnPos", "bottom");
        });

    function PalleteIcon() {
        return React.createElement("svg", {
            role: "img",
            width: 24,
            height: 24,
            className: "vc-pallete-icon vc-icon",
            viewBox: "0 0 24 24"
        }, React.createElement("path", {
            fill: "currentColor",
            d: "M 12 7.5 C 13.242188 7.5 14.25 6.492188 14.25 5.25 C 14.25 4.007812 13.242188 3 12 3 C 10.757812 3 9.75 4.007812 9.75 5.25 C 9.75 6.492188 10.757812 7.5 12 7.5 Z M 18 12 C 19.242188 12 20.25 10.992188 20.25 9.75 C 20.25 8.507812 19.242188 7.5 18 7.5 C 16.757812 7.5 15.75 8.507812 15.75 9.75 C 15.75 10.992188 16.757812 12 18 12 Z M 8.25 10.5 C 8.25 11.742188 7.242188 12.75 6 12.75 C 4.757812 12.75 3.75 11.742188 3.75 10.5 C 3.75 9.257812 4.757812 8.25 6 8.25 C 7.242188 8.25 8.25 9.257812 8.25 10.5 Z M 9 19.5 C 10.242188 19.5 11.25 18.492188 11.25 17.25 C 11.25 16.007812 10.242188 15 9 15 C 7.757812 15 6.75 16.007812 6.75 17.25 C 6.75 18.492188 7.757812 19.5 9 19.5 Z M 9 19.5 M 24 12 C 24 16.726562 21.199219 15.878906 18.648438 15.105469 C 17.128906 14.644531 15.699219 14.210938 15 15 C 14.09375 16.023438 14.289062 17.726562 14.472656 19.378906 C 14.738281 21.742188 14.992188 24 12 24 C 5.371094 24 0 18.628906 0 12 C 0 5.371094 5.371094 0 12 0 C 18.628906 0 24 5.371094 24 12 Z M 12 22.5 C 12.917969 22.5 12.980469 22.242188 12.984375 22.234375 C 13.097656 22.015625 13.167969 21.539062 13.085938 20.558594 C 13.066406 20.304688 13.03125 20.003906 12.996094 19.671875 C 12.917969 18.976562 12.828125 18.164062 12.820312 17.476562 C 12.804688 16.417969 12.945312 15.0625 13.875 14.007812 C 14.429688 13.382812 15.140625 13.140625 15.78125 13.078125 C 16.390625 13.023438 17 13.117188 17.523438 13.234375 C 18.039062 13.351562 18.574219 13.515625 19.058594 13.660156 L 19.101562 13.675781 C 19.621094 13.832031 20.089844 13.972656 20.53125 14.074219 C 21.511719 14.296875 21.886719 14.199219 22.019531 14.109375 C 22.074219 14.070312 22.5 13.742188 22.5 12 C 22.5 6.199219 17.800781 1.5 12 1.5 C 6.199219 1.5 1.5 6.199219 1.5 12 C 1.5 17.800781 6.199219 22.5 12 22.5 Z M 12 22.5"
        })
        );
    }

    function SettingsTab({ title, children }) {
        return React.createElement(
            FormSection,
            null,
            [
                React.createElement(ModalText, {
                    variant: "heading-lg/semibold",
                    tag: "h2",
                    className: marginBottom20
                }, title),
                children
            ]
        );
    }

    function SelectorSettingsTab() {
        const [currentColorway, setCurrentColorway] = React.useState("");
        const [searchString, setSearchString] = React.useState("");
        const [colorways, setColorways] = React.useState([]);
        const [customColorways, setCustomColorways] = React.useState([]);
        const [visibility, setVisibility] = React.useState("all");
        const [searchBarVisibility, setSearchBarVisibility] = React.useState(false);
        async function searchColorways(e) {
            if (!e) {
                cached_loadUI();
                return;
            }
            const colorwaySourceFiles = await dataStore.get("colorwaySourceFiles");
            const data = await Promise.all(
                colorwaySourceFiles.map((url) =>
                    fetch(url).then((res) => res.json().catch(() => { return { colorways: fallbackColorways }; })).catch(() => { return { colorways: fallbackColorways }; })
                )
            );
            const colorways = data.flatMap((json) => json.colorways);
            const baseData = await dataStore.get("customColorways");
            var results = [];
            (colorways || fallbackColorways).find((Colorway) => {
                if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                    results.push(Colorway);
            });
            var customResults = [];
            baseData.find((Colorway) => {
                if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                    customResults.push(Colorway);
            });
            setColorways(results);
            setCustomColorways(customResults);
        }

        async function loadUI() {
            const colorwaySourceFiles = await dataStore.get("colorwaySourceFiles");
            const data = await Promise.all(colorwaySourceFiles.map((url) => fetch(url).then((res) => res.json().catch(() => { return { colorways: fallbackColorways }; })).catch(() => { return { colorways: fallbackColorways }; })));
            const colorways = data.flatMap((json) => json.colorways);
            const baseData = await dataStore.getMany([
                "customColorways",
                "actveColorwayID",
            ]);
            setColorways(colorways);
            setCustomColorways(baseData[0]);
            setCurrentColorway(baseData[1]);
        }

        const cached_loadUI = React.useCallback(loadUI, [setColorways, setCustomColorways, setCurrentColorway]);

        React.useEffect(() => {
            if (!searchString) {
                cached_loadUI();
            }
        }, [searchString]);

        var visibleColorwayArray;

        switch (visibility) {
            case "all":
                visibleColorwayArray = [...colorways, ...customColorways];
                break;
            case "official":
                visibleColorwayArray = [...colorways];
                break;
            case "custom":
                visibleColorwayArray = [...customColorways];
                break;
            default:
                visibleColorwayArray = [...colorways, ...customColorways];
                break;
        }
        return React.createElement(SettingsTab, { title: "Colors" },
            React.createElement("div", { className: "colorwaysSettingsSelector-wrapper" }, [
                React.createElement("div", { className: "colorwaySelector-doublePillBar" }, [
                    searchBarVisibility === true ? React.createElement(TextInput, {
                        inputClassName: "colorwaySelector-searchInput",
                        className: "colorwaySelector-search",
                        placeholder: "Search for Colorways...",
                        value: searchString,
                        onChange: (e) => {
                            searchColorways(e);
                            setSearchString(e);
                        }
                    }) : React.createElement("div", { className: "colorwaySelector-pillWrapper" },
                        React.createElement("div", { className: `colorwaySelector-pill${visibility === "all" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => setVisibility("all") }, "All"),
                        React.createElement("div", { className: `colorwaySelector-pill${visibility === "official" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => setVisibility("official") }, "Official"),
                        React.createElement("div", { className: `colorwaySelector-pill${visibility === "custom" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => setVisibility("custom") }, "Custom"),
                    ),
                    React.createElement("div", { className: "colorwaySelector-pillWrapper" },
                        React.createElement(Tooltip, { text: "Refresh Colorways..." },
                            ({ onMouseEnter, onMouseLeave }) => {
                                return React.createElement("div", {
                                    className: "colorwaySelector-pill",
                                    id: "colorway-refreshcolorway",
                                    onMouseEnter: onMouseEnter,
                                    onMouseLeave: onMouseLeave,
                                    onClick: () => cached_loadUI()
                                },
                                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor" },
                                        React.createElement("g", { id: "Frame_-_24px" }, React.createElement("rect", { y: "0", fill: "none", width: "24", height: "24" })),
                                        React.createElement("g", { id: "Filled_Icons" },
                                            React.createElement("g", null, [
                                                React.createElement("path", { d: "M6.351,6.351C7.824,4.871,9.828,4,12,4c4.411,0,8,3.589,8,8h2c0-5.515-4.486-10-10-10 C9.285,2,6.779,3.089,4.938,4.938L3,3v6h6L6.351,6.351z" }),
                                                React.createElement("path", { d: "M17.649,17.649C16.176,19.129,14.173,20,12,20c-4.411,0-8-3.589-8-8H2c0,5.515,4.486,10,10,10 c2.716,0,5.221-1.089,7.062-2.938L21,21v-6h-6L17.649,17.649z" })
                                            ])
                                        )
                                    )
                                );
                            }
                        ),
                        React.createElement(Tooltip, { text: "Create Colorway..." },
                            ({ onMouseEnter, onMouseLeave }) => {
                                return React.createElement("div", {
                                    className: "colorwaySelector-pill", onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onClick: () => {
                                        if (!findByCode("showEyeDropper")) {
                                            extractAndRequireModuleIds(
                                                findByCode(
                                                    "Promise.all",
                                                    "openModalLazy",
                                                    "location_page"
                                                )
                                            );
                                        };
                                        openModal(props => React.createElement(CreatorModal, { modalProps: props, loadUIProps: cached_loadUI }));
                                    }
                                },
                                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", role: "img", width: "14", height: "14", viewBox: "0 0 24 24" },
                                        React.createElement("path", { fill: "currentColor", d: "M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z" })
                                    )
                                );
                            }
                        ),
                        searchBarVisibility === false ? React.createElement(Tooltip, { text: "Search..." },
                            ({ onMouseEnter, onMouseLeave }) => {
                                return React.createElement("div", { className: "colorwaySelector-pill", onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onClick: () => setSearchBarVisibility(true) },
                                    React.createElement(SearchIcon, { width: 14, height: 14, viewboxX: 24, viewboxY: 24 })
                                );
                            }
                        ) : React.createElement(Tooltip, { text: "Close Search" },
                            ({ onMouseEnter, onMouseLeave }) => {
                                return React.createElement(
                                    "div",
                                    {
                                        className: "colorwaySelector-pill",
                                        onMouseEnter: onMouseEnter,
                                        onMouseLeave: onMouseLeave,
                                        onClick: () => {
                                            searchColorways("");
                                            setSearchString("");
                                            setSearchBarVisibility(false);
                                        }
                                    },
                                    React.createElement(CloseIcon, { width: 14, height: 14, viewboxX: 24, viewboxY: 24 })
                                );
                            }
                        )
                    )
                ]
                ),
                React.createElement("div", { className: "ColorwaySelectorWrapper" }, [
                    visibleColorwayArray.length > 0 ? visibleColorwayArray.map((color) => {
                        var colors = color.colors || ["accent", "primary", "secondary", "tertiary"];
                        return React.createElement(Tooltip, { text: color.name },
                            ({ onMouseEnter, onMouseLeave }) => {
                                return React.createElement("div", {
                                    className: `discordColorway${colorwayCSS.get().name === color.name ? " active" : ""}`,
                                    id: "colorway-" + color.name,
                                    onMouseEnter: onMouseEnter,
                                    onMouseLeave: onMouseLeave
                                }, [
                                    React.createElement("div", { className: "colorwayCheckIconContainer" },
                                        React.createElement("div", { className: "colorwayCheckIcon" },
                                            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", role: "img", width: "18", height: "18", viewBox: "0 0 24 24" },
                                                React.createElement("path", { fill: "currentColor", "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z" })
                                            )
                                        )
                                    ),
                                    React.createElement("div", {
                                        className: "colorwayInfoIconContainer", onClick: () => {
                                            openModal(props => React.createElement(InfoModal, { modalProps: props, colorwayProps: color, discrimProps: customColorways.includes(color) }));
                                        }
                                    },
                                        React.createElement("div", { className: "colorwayInfoIcon" },
                                            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", viewBox: "0 0 16 16" },
                                                React.createElement("path", { d: "m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" })
                                            )
                                        )
                                    ),
                                    React.createElement("div", {
                                        className: "discordColorwayPreviewColorContainer",
                                        onClick: () => {
                                            if (currentColorway === color.name) {
                                                dataStore.set("actveColorwayID", null);
                                                dataStore.set("actveColorway", null);
                                                colorwayCSS.remove();
                                            } else {
                                                dataStore.set("actveColorwayID", color.name);
                                                dataStore.set("actveColorway", color.import);
                                                colorwayCSS.set(color.import, color.name);
                                            }
                                            setCurrentColorway(colorwayCSS.get().name);
                                        }
                                    }, colors.map((colorItm) => {
                                        return (
                                            React.createElement("div", { className: "discordColorwayPreviewColor", style: { backgroundColor: color[colorItm] } })
                                        );
                                    }))
                                ]);
                            }
                        );
                    }) : React.createElement(FormTitle, { style: { marginBottom: 0, width: "100%", textAlign: "center" } }, "No colorways..."),
                ]
                )
            ]));
    }

    function ColorwaySelectorBtn({ position = "top" }) {
        const [activeColorway, setActiveColorway] = React.useState("None");
        const [pillState, setPillState] = React.useState("");
        const [colorwaysBtnPos, setColorwaysBtnPos] = React.useState("bottom");
        async function loadUI() {
            const colorwaysBtnPos = await dataStore.get("colorwaysBtnPos");
            setColorwaysBtnPos(colorwaysBtnPos);
        }

        React.useEffect(() => {
            loadUI();
        });

        return React.createElement(Tooltip, {
            text: [
                React.createElement("span", null, "Colorways"),
                React.createElement(ModalText, { variant: "text-xs/normal", style: { color: "var(--text-muted)", fontWeight: 500 } }, "Active Colorway: " + activeColorway)
            ], position: "right", tooltipContentClassName: "colorwaysBtn-tooltipContent", shouldShowTooltip: true
        },
            ({ onMouseEnter, onMouseLeave }) => {
                if (colorwaysBtnPos === position) {
                    return React.createElement("div", {
                        className: "ColorwaySelectorBtnContainer"
                    }, [
                        React.createElement(PillContainer, { hovered: pillState === "hovered", className: "colorwaysButton-pill" }),
                        React.createElement("div", {
                            className: "ColorwaySelectorBtn" + (position === "bottom" ? " ColorwaySelectorBtn_green" : ""),
                            onClick: () => openModal(props => React.createElement(SelectorModal, { modalProps: props })),
                            onContextMenu: () => openModal(props => React.createElement(SelectorModal, { modalProps: props, visibleTabProps: "toolbox" })),
                            onMouseEnter: async () => {
                                onMouseEnter();
                                setActiveColorway(await dataStore.get("actveColorwayID") || "None");
                                setPillState("hovered");
                            },
                            onMouseLeave: () => {
                                onMouseLeave();
                                setPillState("");
                            }
                        }, React.createElement(PalleteIcon))
                    ]);
                } else {
                    return null;
                }
            }
        );
    };

    function canonicalizeMatch(match) {
        if (typeof match === "string") return match;
        const canonSource = match.source
            .replaceAll("\\i", "[A-Za-z_$][\\w$]*");
        return new RegExp(canonSource, match.flags);
    }

    async function extractAndRequireModuleIds(code) {
        const chunksAndModule = code.toString()
            .match(canonicalizeMatch(/Promise\.all\(\[((?:\i\.\i\(\d+\),?)+)\]\).then\(\i\.bind\(\i,(\d+)\)\)/));

        if (!chunksAndModule) throw new Error("Couldn't extract anything of relevance");
        else if (!chunksAndModule[1]) throw new Error("Couldn't extract any chunk requires");
        else if (!chunksAndModule[2]) throw new Error("Couldn't extract module ID");

        const chunkIds = Array.from(chunksAndModule[1].matchAll(/(\d+)/g)).map(cId => parseInt(cId[0]));
        const moduleId = parseInt(chunksAndModule[2]);

        return Promise.all(chunkIds.map(i => _mods_unparsed.e(i))).then(_mods_unparsed.bind(_mods_unparsed, moduleId));
    }

    function CloseIcon({
        height = 24,
        width = 24,
        viewboxX = width,
        viewboxY = height,
        className,
        style
    }) {
        return React.createElement(
            "svg",
            {
                "aria-label": "Clear",
                "aria-hidden": "false",
                role: "img",
                className: className,
                width: width,
                height: height,
                viewBox: `0 0 ${viewboxX} ${viewboxY}`,
                style: style
            },
            React.createElement("path", {
                fill: "currentColor",
                d: "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
            })
        );
    }

    function SearchIcon({
        height = 24,
        width = 24,
        viewboxX = width,
        viewboxY = height,
        className,
        style
    }) {
        return React.createElement(
            "svg",
            {
                className: className,
                "aria-label": "Search",
                "aria-hidden": "false",
                role: "img",
                width: width,
                height: height,
                viewBox: `0 0 ${viewboxX} ${viewboxY}`,
                style: style
            },
            React.createElement("path", {
                fill: "currentColor",
                d: "M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"
            })
        );
    }

    function CreatorModal({ modalProps, loadUIProps }) {
        const [colorwayName, setColorwayName] = React.useState("");
        const [accentColor, setAccentColor] = React.useState("5865f2");
        const [primaryColor, setPrimaryColor] = React.useState("313338");
        const [secondaryColor, setSecondaryColor] = React.useState("2b2d31");
        const [tertiaryColor, setTertiaryColor] = React.useState("1e1f22");
        const [preset, setPreset] = React.useState("default");
        const [collapsedSettings, setCollapsedSettings] = React.useState(true);
        const [tintedText, setTintedText] = React.useState(true);
        const [collapsedPresets, setCollapsedPresets] = React.useState(true);
        const [presetColorArray, setPresetColorArray] = React.useState(["primary", "secondary", "tertiary", "accent"]);
        const ColorPicker = findByCode("showEyeDropper") || (() => { return React.createElement(Text, { variant: "heading-lg/semibold", tag: "h3", className: "colorways-creator-module-warning" }, "Module is lazyloaded, open Settings first"); });
        return React.createElement(ModalRoot, { ...modalProps, className: "colorwayCreator-modal" }, [
            React.createElement(ModalHeader, null,
                React.createElement(Text, { variant: "heading-lg/semibold", tag: "h1" }, "Create Colorway")
            ),
            React.createElement(ModalContent, { className: "colorwayCreator-menuWrapper" }, [
                React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Name:"),
                React.createElement(TextInput, {
                    placeholder: "Give your Colorway a name",
                    value: colorwayName,
                    onChange: setColorwayName
                }),
                React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Colors:"),
                React.createElement("div", { className: "colorwayCreator-colorPreviews" }, [
                    presetColorArray.includes("primary") ?
                        React.createElement(ColorPicker, {
                            color: parseInt(primaryColor, 16),
                            onChange: (color) => {
                                let hexColor = color.toString(16);
                                while (hexColor.length < 6) {
                                    hexColor = "0" + hexColor;
                                }
                                setPrimaryColor(hexColor);
                            },
                            showEyeDropper: true,
                            suggestedColors: [
                                "#313338",
                                "#2b2d31",
                                "#1e1f22",
                                "#5865f2",
                            ],
                            label: React.createElement(ModalText, { className: "colorwaysPicker-colorLabel" }, "Primary")
                        }) : null,
                    presetColorArray.includes("secondary") ?
                        React.createElement(ColorPicker, {
                            color: parseInt(secondaryColor, 16),
                            onChange: (color) => {
                                let hexColor = color.toString(16);
                                while (hexColor.length < 6) {
                                    hexColor = "0" + hexColor;
                                }
                                setSecondaryColor(hexColor);
                            },
                            showEyeDropper: true,
                            suggestedColors: [
                                "#313338",
                                "#2b2d31",
                                "#1e1f22",
                                "#5865f2",
                            ],
                            label: React.createElement(ModalText, { className: "colorwaysPicker-colorLabel" }, "Secondary")
                        }) : null,
                    presetColorArray.includes("tertiary") ?
                        React.createElement(ColorPicker, {
                            color: parseInt(tertiaryColor, 16),
                            onChange: (color) => {
                                let hexColor = color.toString(16);
                                while (hexColor.length < 6) {
                                    hexColor = "0" + hexColor;
                                }
                                setTertiaryColor(hexColor);
                            },
                            showEyeDropper: true,
                            suggestedColors: [
                                "#313338",
                                "#2b2d31",
                                "#1e1f22",
                                "#5865f2",
                            ],
                            label: React.createElement(ModalText, { className: "colorwaysPicker-colorLabel" }, "Tertiary")
                        }) : null,
                    presetColorArray.includes("accent") ?
                        React.createElement(ColorPicker, {
                            color: parseInt(accentColor, 16),
                            onChange: (color) => {
                                let hexColor = color.toString(16);
                                while (hexColor.length < 6) {
                                    hexColor = "0" + hexColor;
                                }
                                setAccentColor(hexColor);
                            },
                            showEyeDropper: true,
                            suggestedColors: [
                                "#313338",
                                "#2b2d31",
                                "#1e1f22",
                                "#5865f2",
                            ],
                            label: React.createElement(ModalText, { className: "colorwaysPicker-colorLabel" }, "Accent")
                        }) : null
                ]),
                React.createElement("div", { className: `colorwaysCreator-settingCat${collapsedSettings ? " colorwaysCreator-settingCat-collapsed" : ""}` }, [
                    React.createElement("div", { className: "colorwaysCreator-settingItm colorwaysCreator-settingHeader", onClick: () => setCollapsedSettings(!collapsedSettings) }, [
                        React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Settings"),
                        React.createElement("svg", { className: "expand-3Nh1P5 transition-30IQBn directionDown-2w0MZz", width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", role: "img" },
                            React.createElement("path", { fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", d: "M7 10L12 15 17 10", "aria-hidden": "true" })
                        )
                    ]),
                    React.createElement(ScrollerThin, { orientation: "vertical", className: "colorwaysCreator-settingsList", paddingFix: true }, [
                        React.createElement("div", { className: "colorwaysCreator-settingItm", onCLick: () => setTintedText(!tintedText) }, [
                            React.createElement(Text, { variant: "eyebrow", tag: "h5" }, "Use colored text"),
                            React.createElement(Switch, { value: tintedText, onChange: setTintedText, hideBorder: true, style: { marginBottom: 0 } })
                        ])
                    ])
                ]),
                React.createElement("div", { className: `colorwaysCreator-settingCat${collapsedPresets ? " colorwaysCreator-settingCat-collapsed" : ""}` }, [
                    React.createElement("div", { className: "colorwaysCreator-settingItm colorwaysCreator-settingHeader", onClick: () => setCollapsedPresets(!collapsedPresets) }, [
                        React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Presets"),
                        React.createElement("svg", { className: "expand-3Nh1P5 transition-30IQBn directionDown-2w0MZz", width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", role: "img" },
                            React.createElement("path", { fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", d: "M7 10L12 15 17 10", "aria-hidden": "true" })
                        )
                    ]),
                    React.createElement(ScrollerThin, { orientation: "vertical", className: "colorwaysCreator-settingsList", paddingFix: true }, [
                        React.createElement("div", { className: "colorwaysCreator-settingItm colorwaysCreator-preset", onClick: () => setPreset("default") }, [
                            React.createElement("svg", { "aria-hidden": "true", role: "img", width: "24", height: "24", viewBox: "0 0 24 24" },
                                React.createElement("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", fill: "currentColor" }),
                                preset === "default" ? React.createElement("circle", { cx: "12", cy: "12", r: "5", className: "radioIconForeground-3wH3aU", fill: "currentColor" }) : null
                            ),
                            React.createElement(Text, { variant: "eyebrow", tag: "h5" }, "Default")
                        ]),
                        Object.values(getPreset()).map(presetItm => {
                            return React.createElement("div", {
                                className: "colorwaysCreator-settingItm colorwaysCreator-preset", onClick: () => {
                                    setPreset(presetItm.id);
                                    setPresetColorArray(presetItm.colors);
                                }
                            }, [
                                React.createElement("svg", { "aria-hidden": "true", role: "img", width: "24", height: "24", viewBox: "0 0 24 24" },
                                    React.createElement("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", fill: "currentColor" }),
                                    preset === presetItm.id ? React.createElement("circle", { cx: "12", cy: "12", r: "5", className: "radioIconForeground-3wH3aU", fill: "currentColor" }) : null
                                ),
                                React.createElement(Text, { variant: "eyebrow", tag: "h5" }, presetItm.name)
                            ]);
                        })
                    ])
                ])
            ]),
            React.createElement(ModalFooter, null, [
                React.createElement(Button, {
                    style: { marginLeft: 8 },
                    color: Button.Colors.BRAND,
                    size: Button.Sizes.MEDIUM,
                    look: Button.Looks.FILLED,
                    onClick: () => {
                        var customColorwayCSS = "";
                        if (preset === "default") {
                            customColorwayCSS = generateCss(primaryColor, secondaryColor, tertiaryColor, accentColor, tintedText);
                        } else {
                            customColorwayCSS = getPreset(primaryColor, secondaryColor, tertiaryColor, accentColor)[preset].preset();
                        }
                        const customColorway = {
                            name: (colorwayName || "Colorway") + (preset === "default" ? "" : ": Made for " + getPreset()[preset].name),
                            import: customColorwayCSS,
                            accent: "#" + accentColor,
                            primary: "#" + primaryColor,
                            secondary: "#" + secondaryColor,
                            tertiary: "#" + tertiaryColor,
                            author: UserStore.getCurrentUser().username,
                            authorID: UserStore.getCurrentUser().id
                        };
                        const customColorwaysArray = [customColorway];
                        dataStore.get("customColorways").then(customColorways => {
                            customColorways.forEach((color, i) => {
                                if (color.name !== customColorway.name) {
                                    customColorwaysArray.push(color);
                                }
                            });
                            dataStore.set("customColorways", customColorwaysArray);
                        });
                        modalProps.onClose();
                        if (loadUIProps) {
                            loadUIProps();
                        }
                    }
                }, "Finish"),
                React.createElement(Button, {
                    style: { marginLeft: 8 },
                    color: Button.Colors.PRIMARY,
                    size: Button.Sizes.MEDIUM,
                    look: Button.Looks.FILLED,
                    onClick: () => {
                        function getHex(str) {
                            return Object.assign(document.createElement("canvas").getContext("2d"), { fillStyle: str }).fillStyle;
                        }
                        setPrimaryColor(getHex(getComputedStyle(document.body).getPropertyValue("--background-primary")).split("#")[1]);
                        setSecondaryColor(getHex(getComputedStyle(document.body).getPropertyValue("--background-secondary")).split("#")[1]);
                        setTertiaryColor(getHex(getComputedStyle(document.body).getPropertyValue("--background-tertiary")).split("#")[1]);
                        setAccentColor(getHex(getComputedStyle(document.body).getPropertyValue("--brand-experiment")).split("#")[1]);
                    }
                }, "Copy Current Colors"),
                React.createElement(Button, {
                    style: { marginLeft: 8 },
                    color: Button.Colors.PRIMARY,
                    size: Button.Sizes.MEDIUM,
                    look: Button.Looks.FILLED,
                    onClick: () => {
                        let colorwayID = "";
                        function setColorwayID(e) {
                            colorwayID = e;
                        }
                        const hexToString = (hex) => {
                            let str = "";
                            for (let i = 0; i < hex.length; i += 2) {
                                const hexValue = hex.substr(i, 2);
                                const decimalValue = parseInt(hexValue, 16);
                                str += String.fromCharCode(decimalValue);
                            }
                            return str;
                        };
                        openModal(props => React.createElement(ModalRoot, { ...props, className: "colorwaysCreator-noMinHeight" }, [
                            React.createElement(ModalContent, { className: "colorwaysCreator-noHeader colorwaysCreator-noMinHeight" }, [
                                React.createElement(FormTitle, null, "Colorway ID:"),
                                React.createElement(TextInput, { placeholder: "Enter Colorway ID", onInput: e => setColorwayID(e.currentTarget.value) })
                            ]),
                            React.createElement(ModalFooter, null, [
                                React.createElement(Button, {
                                    style: { marginLeft: 8 },
                                    color: Button.Colors.BRAND,
                                    size: Button.Sizes.MEDIUM,
                                    look: Button.Looks.FILLED,
                                    onClick: () => {
                                        const allEqual = (arr) => arr.every(v => v === arr[0]);
                                        if (!colorwayID) {
                                            throw new Error("Please enter a Colorway ID");
                                        } else if (colorwayID.length < 62) {
                                            throw new Error("Invalid Colorway ID");
                                        } else if (!hexToString(colorwayID).includes(",")) {
                                            throw new Error("Invalid Colorway ID");
                                        } else if (!allEqual(hexToString(colorwayID).split(",").map((e) => e.match("#")?.length)) && hexToString(colorwayID).split(",").map((e) => e.match("#")?.length)[0] !== 1) {
                                            throw new Error("Invalid Colorway ID");
                                        } else {
                                            const colorArray = hexToString(colorwayID).split(",");
                                            setAccentColor(colorArray[0].split("#")[1]);
                                            setPrimaryColor(colorArray[1].split("#")[1]);
                                            setSecondaryColor(colorArray[2].split("#")[1]);
                                            setTertiaryColor(colorArray[3].split("#")[1]);
                                            props.onClose();
                                        }
                                    }
                                }, "Finish"),
                                React.createElement(Button, {
                                    style: { marginLeft: 8 },
                                    color: Button.Colors.PRIMARY,
                                    size: Button.Sizes.MEDIUM,
                                    look: Button.Looks.FILLED,
                                    onClick: () => {
                                        props.onClose();
                                    }
                                }, "Cancel")
                            ])
                        ]));
                    }
                }, "Enter Colorway ID"),
                React.createElement(Button, {
                    style: { marginLeft: 8 },
                    color: Button.Colors.PRIMARY,
                    size: Button.Sizes.MEDIUM,
                    look: Button.Looks.FILLED,
                    onClick: () => {
                        modalProps.onClose();
                    }
                }, "Cancel")
            ])
        ]);
    }

    function InfoModal({ modalProps, colorwayProps, discrimProps = false }) {
        const colors = colorwayProps.colors || [
            "accent",
            "primary",
            "secondary",
            "tertiary",
        ];
        return React.createElement(ModalRoot, { ...modalProps, className: "colorwayCreator-modal" }, [
            React.createElement(ModalHeader, null, React.createElement(Text, { variant: "heading-lg/semibold", tag: "h1" }, "Colorway Details: " + colorwayProps.name)),
            React.createElement(ModalContent, null, React.createElement("div", { className: "colorwayInfo-wrapper" }, [
                React.createElement("div", { className: "colorwayInfo-colorSwatches" }, colors.map(color => {
                    return React.createElement("div", {
                        className: "colorwayInfo-colorSwatch", style: { backgroundColor: colorwayProps[color] }, onClick: () => {
                            navigator.clipboard.writeText(String(colorwayProps[color]));
                            showToast({
                                message:
                                    "Copied color successfully",
                                type: 1,
                                id: "copy-colorway-color-notify",
                            });
                        }
                    });
                })),
                React.createElement("div", { className: "colorwayInfo-row colorwayInfo-author" }, [
                    React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Author:"),
                    React.createElement(Button, { color: Button.Colors.PRIMARY, size: Button.Sizes.MEDIUM, look: Button.Looks.FILLED, onClick: () => openUserProfile(colorwayProps.authorID) }, colorwayProps.author)
                ]),
                React.createElement("div", { className: "colorwayInfo-row colorwayInfo-css" }, [
                    React.createElement(FormTitle, { style: { marginBottom: 0 } }, "CSS:"),
                    React.createElement(Text, { variant: "code", selectable: true, className: "colorwayInfo-cssCodeblock" }, colorwayProps.import)
                ])
            ])),
            discrimProps ? React.createElement(ModalFooter, null, [
                React.createElement(Button, {
                    color: Button.Colors.RED, size: Button.Sizes.MEDIUM, look: Button.Looks.FILLED, style: { marginLeft: 8 }, onClick: () => {
                        dataStore.get("customColorways").then((customColorways) => {
                            if (customColorways.length > 0) {
                                const customColorwaysArray = [];
                                dataStore.get("customColorways").then(customColorways => {
                                    customColorways.forEach((color, i) => {
                                        if (color.name !== colorwayProps.name) {
                                            customColorwaysArray.push(color);
                                        }
                                        if (i + 1 === customColorways.length) {
                                            dataStore.set("customColorways", customColorwaysArray);
                                        }
                                    });
                                });
                                dataStore.get("actveColorwayID").then((actveColorwayID) => {
                                    if (actveColorwayID === colorwayProps.name) {
                                        dataStore.set("actveColorway", null);
                                        dataStore.set("actveColorwayID", null);
                                    }
                                });
                                modalProps.onClose();
                                document.getElementById("colorway-refreshcolorway")?.click();
                            }
                        });
                    }
                }, "Delete Colorway"),
                React.createElement(Button, {
                    color: Button.Colors.PRIMARY, size: Button.Sizes.MEDIUM, look: Button.Looks.FILLED, style: { marginLeft: 8 }, onClick: () => {
                        const stringToHex = (str) => {
                            let hex = "";
                            for (let i = 0; i < str.length; i++) {
                                const charCode = str.charCodeAt(i);
                                const hexValue = charCode.toString(16);
                                hex += hexValue.padStart(2, "0");
                            }
                            return hex;
                        };
                        const colorwayIDArray = `${colorwayProps.accent},${colorwayProps.primary},${colorwayProps.secondary},${colorwayProps.tertiary}`;
                        const colorwayID = stringToHex(colorwayIDArray);
                        navigator.clipboard.writeText(colorwayID);
                        showToast({
                            message: "Copied Colorway ID Successfully",
                            type: 1,
                            id: "copy-colorway-id-notify",
                        });
                    }
                }, "Copy Colorway ID"),
                React.createElement(Button, {
                    color: Button.Colors.PRIMARY, size: Button.Sizes.MEDIUM, look: Button.Looks.FILLED, style: { marginLeft: 8 }, onClick: () => {
                        navigator.clipboard.writeText(colorwayProps.import);
                        showToast({
                            message: "Copied CSS to Clipboard",
                            type: 1,
                            id: "copy-colorway-css-notify",
                        });
                    }
                }, "Copy CSS"),
                React.createElement(Button, {
                    color: Button.Colors.PRIMARY, size: Button.Sizes.MEDIUM, look: Button.Looks.FILLED, style: { marginLeft: 8 }, onClick: () => {
                        modalProps.onClose();
                    }
                }, "Cancel")
            ]) : null
        ]);
    }

    function SelectorModal({ modalProps, visibleTabProps = "all" }) {
        const [currentColorway, setCurrentColorway] = React.useState("");
        const [searchString, setSearchString] = React.useState("");
        const [colorways, setColorways] = React.useState([]);
        const [customColorways, setCustomColorways] = React.useState([]);
        const [visibility, setVisibility] = React.useState(visibleTabProps);
        const [searchBarVisibility, setSearchBarVisibility] = React.useState(false);

        async function searchColorways(e) {
            if (!e) {
                cached_loadUI();
                return;
            }
            const colorwaySourceFiles = await dataStore.get("colorwaySourceFiles");
            const data = await Promise.all(
                colorwaySourceFiles.map((url) =>
                    fetch(url).then((res) => res.json().catch(() => { return { colorways: fallbackColorways }; })).catch(() => { return { colorways: fallbackColorways }; })
                )
            );
            const colorways = data.flatMap((json) => json.colorways);
            const baseData = await dataStore.get("customColorways");
            var results = [];
            (colorways || fallbackColorways).find((Colorway) => {
                if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                    results.push(Colorway);
            });
            var customResults = [];
            baseData.find((Colorway) => {
                if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                    customResults.push(Colorway);
            });
            setColorways(results);
            setCustomColorways(customResults);
        }

        async function loadUI() {
            const colorwaySourceFiles = await dataStore.get("colorwaySourceFiles");
            const data = await Promise.all(colorwaySourceFiles.map((url) => fetch(url).then((res) => res.json().catch(() => { return { colorways: fallbackColorways }; })).catch(() => { return { colorways: fallbackColorways }; })));
            const colorways = data.flatMap((json) => json.colorways);
            const baseData = await dataStore.getMany([
                "customColorways",
                "actveColorwayID",
            ]);
            setColorways(colorways);
            setCustomColorways(baseData[0]);
            setCurrentColorway(baseData[1]);
        }

        const cached_loadUI = React.useCallback(loadUI, [setColorways, setCustomColorways, setCurrentColorway]);

        React.useEffect(() => {
            if (!searchString) {
                cached_loadUI();
            }
        }, [searchString]);

        var visibleColorwayArray;

        switch (visibility) {
            case "all":
                visibleColorwayArray = [...colorways, ...customColorways];
                break;
            case "official":
                visibleColorwayArray = [...colorways];
                break;
            case "custom":
                visibleColorwayArray = [...customColorways];
                break;
            default:
                visibleColorwayArray = [...colorways, ...customColorways];
                break;
        }

        return (
            React.createElement(ModalRoot, { ...modalProps, className: "colorwaySelectorModal" },
                React.createElement(ModalContent, { className: "colorwaySelectorModalContent" }, [
                    React.createElement("div", { className: "colorwaySelector-doublePillBar" }, [
                        searchBarVisibility === true ? React.createElement(TextInput, {
                            inputClassName: "colorwaySelector-searchInput",
                            className: "colorwaySelector-search",
                            placeholder: "Search for Colorways...",
                            value: searchString,
                            onChange: (e) => {
                                searchColorways(e);
                                setSearchString(e);
                            }
                        }) : React.createElement("div", { className: "colorwaySelector-pillWrapper" },
                            React.createElement("div", { className: `colorwaySelector-pill${visibility === "all" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => setVisibility("all") }, "All"),
                            React.createElement("div", { className: `colorwaySelector-pill${visibility === "official" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => setVisibility("official") }, "Official"),
                            React.createElement("div", { className: `colorwaySelector-pill${visibility === "custom" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => setVisibility("custom") }, "Custom"),
                            React.createElement("div", { className: "colorwaySelector-pillSeparator" }),
                            React.createElement("div", { className: `colorwaySelector-pill${visibility === "toolbox" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => setVisibility("toolbox") }, "Toolbox"),
                            React.createElement("div", {
                                className: `colorwaySelector-pill${visibility === "info" ? " colorwaySelector-pill_selected" : " "}`, onClick: () => {
                                    setVisibility("info");
                                }
                            }, "Info")
                        ),
                        React.createElement("div", { className: "colorwaySelector-pillWrapper" },
                            React.createElement(Tooltip, { text: "Refresh Colorways..." },
                                ({ onMouseEnter, onMouseLeave }) => {
                                    return React.createElement("div", {
                                        className: "colorwaySelector-pill",
                                        id: "colorway-refreshcolorway",
                                        onMouseEnter: onMouseEnter,
                                        onMouseLeave: onMouseLeave,
                                        onClick: () => cached_loadUI()
                                    },
                                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor" },
                                            React.createElement("g", { id: "Frame_-_24px" }, React.createElement("rect", { y: "0", fill: "none", width: "24", height: "24" })),
                                            React.createElement("g", { id: "Filled_Icons" },
                                                React.createElement("g", null, [
                                                    React.createElement("path", { d: "M6.351,6.351C7.824,4.871,9.828,4,12,4c4.411,0,8,3.589,8,8h2c0-5.515-4.486-10-10-10 C9.285,2,6.779,3.089,4.938,4.938L3,3v6h6L6.351,6.351z" }),
                                                    React.createElement("path", { d: "M17.649,17.649C16.176,19.129,14.173,20,12,20c-4.411,0-8-3.589-8-8H2c0,5.515,4.486,10,10,10 c2.716,0,5.221-1.089,7.062-2.938L21,21v-6h-6L17.649,17.649z" })
                                                ])
                                            )
                                        )
                                    );
                                }
                            ),
                            React.createElement(Tooltip, { text: "Create Colorway..." },
                                ({ onMouseEnter, onMouseLeave }) => {
                                    return React.createElement("div", {
                                        className: "colorwaySelector-pill", onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onClick: () => {
                                            if (!findByCode("showEyeDropper")) {
                                                extractAndRequireModuleIds(
                                                    findByCode(
                                                        "Promise.all",
                                                        "openModalLazy",
                                                        "location_page"
                                                    )
                                                );
                                            };
                                            openModal(props => React.createElement(CreatorModal, { modalProps: props, loadUIProps: cached_loadUI }));
                                        }
                                    },
                                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", role: "img", width: "14", height: "14", viewBox: "0 0 24 24" },
                                            React.createElement("path", { fill: "currentColor", d: "M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z" })
                                        )
                                    );
                                }
                            ),
                            searchBarVisibility === false ? React.createElement(Tooltip, { text: "Search..." },
                                ({ onMouseEnter, onMouseLeave }) => {
                                    return React.createElement("div", { className: "colorwaySelector-pill", onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onClick: () => setSearchBarVisibility(true) },
                                        React.createElement(SearchIcon, { width: 14, height: 14, viewboxX: 24, viewboxY: 24 })
                                    );
                                }
                            ) : React.createElement(Tooltip, { text: "Close Search" },
                                ({ onMouseEnter, onMouseLeave }) => {
                                    return React.createElement(
                                        "div",
                                        {
                                            className: "colorwaySelector-pill",
                                            onMouseEnter: onMouseEnter,
                                            onMouseLeave: onMouseLeave,
                                            onClick: () => {
                                                searchColorways("");
                                                setSearchString("");
                                                setSearchBarVisibility(false);
                                            }
                                        },
                                        React.createElement(CloseIcon, { width: 14, height: 14, viewboxX: 24, viewboxY: 24 })
                                    );
                                }
                            )
                        )
                    ]
                    ),
                    React.createElement("div", { className: "ColorwaySelectorWrapper" }, [
                        ["all", "official", "custom"].includes(visibility) ? (visibleColorwayArray.length > 0 ? visibleColorwayArray.map((color) => {
                            var colors = color.colors || ["accent", "primary", "secondary", "tertiary"];
                            return React.createElement(Tooltip, { text: color.name },
                                ({ onMouseEnter, onMouseLeave }) => {
                                    return React.createElement("div", {
                                        className: `discordColorway${colorwayCSS.get().name === color.name ? " active" : ""}`,
                                        id: "colorway-" + color.name,
                                        onMouseEnter: onMouseEnter,
                                        onMouseLeave: onMouseLeave
                                    }, [
                                        React.createElement("div", { className: "colorwayCheckIconContainer" },
                                            React.createElement("div", { className: "colorwayCheckIcon" },
                                                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", role: "img", width: "18", height: "18", viewBox: "0 0 24 24" },
                                                    React.createElement("path", { fill: "currentColor", "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z" })
                                                )
                                            )
                                        ),
                                        React.createElement("div", {
                                            className: "colorwayInfoIconContainer", onClick: () => {
                                                openModal(props => React.createElement(InfoModal, { modalProps: props, colorwayProps: color, discrimProps: customColorways.includes(color) }));
                                            }
                                        },
                                            React.createElement("div", { className: "colorwayInfoIcon" },
                                                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", viewBox: "0 0 16 16" },
                                                    React.createElement("path", { d: "m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" })
                                                )
                                            )
                                        ),
                                        React.createElement("div", {
                                            className: "discordColorwayPreviewColorContainer",
                                            onClick: () => {
                                                if (currentColorway === color.name) {
                                                    dataStore.set("actveColorwayID", null);
                                                    dataStore.set("actveColorway", null);
                                                    colorwayCSS.remove();
                                                } else {
                                                    dataStore.set("actveColorwayID", color.name);
                                                    dataStore.set("actveColorway", color.import);
                                                    colorwayCSS.set(color.import, color.name);
                                                }
                                                setCurrentColorway(colorwayCSS.get().name);
                                            }
                                        }, colors.map((colorItm) => {
                                            return (
                                                React.createElement("div", { className: "discordColorwayPreviewColor", style: { backgroundColor: color[colorItm] } })
                                            );
                                        }))
                                    ]);
                                }
                            );
                        }) : React.createElement(FormTitle, { style: { marginBottom: 0, width: "100%", textAlign: "center" } }, "No colorways...")) : null,
                        visibility === "info" ? [
                            React.createElement("div", { className: "colorwaysSelector-infoRow" },
                                [React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Plugin Name:"),
                                React.createElement(Text, { variant: "text-xs/normal", style: { color: "var(--text-muted)", fontWeight: 500, fontSize: "14px" } }, "Discord Colorways")]
                            ),
                            React.createElement("div", { className: "colorwaysSelector-infoRow" },
                                [React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Plugin Version:"),
                                React.createElement(Text, { variant: "text-xs/normal", style: { color: "var(--text-muted)", fontWeight: 500, fontSize: "14px" } }, (plugin.pluginVersion + " (Official) (Universal)"))]
                            ),
                            React.createElement("div", { className: "colorwaysSelector-infoRow" },
                                [React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Creator Version:"),
                                React.createElement(Text, { variant: "text-xs/normal", style: { color: "var(--text-muted)", fontWeight: 500, fontSize: "14px" } }, (plugin.creatorVersion + " (Stable)"))]
                            ),
                            React.createElement("div", { className: "colorwaysSelector-infoRow" }, [
                                React.createElement(FormTitle, { style: { marginBottom: 0 } }, "Loaded Colorways:"),
                                React.createElement(Text, { variant: "text-xs/normal", style: { color: "var(--text-muted)", fontWeight: 500, fontSize: "14px" } }, ([...colorways, ...customColorways].length))
                            ]
                            )] : null
                    ]
                    )
                ])
            )
        );
    }
})();