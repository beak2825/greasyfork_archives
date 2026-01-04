// ==UserScript==
// @name         Minecraft Helper
// @namespace    http://tampermonkey.net/
// @version      0.5.7
// @description  为 Minecraft 玩家定制的实用脚本
// @author       PRO
// @license      gpl-3.0
// @match        https://www.minecraft.net/*
// @match        https://www.curseforge.com/*
// @match        https://modrinth.com/*
// @icon         https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.jpg
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @require      https://update.greasyfork.org/scripts/470224/1448594/Tampermonkey%20Config.js
// @downloadURL https://update.greasyfork.org/scripts/463473/Minecraft%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463473/Minecraft%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const name = 'Minecraft Helper';
    const log = (s, error=false) => {
        if (error) {
            console.error(`[${name}] ${s}`);
        } else {
            console.log(`[${name}] ${s}`);
        }
    };
    function _boolDesc(name, title = undefined, default_value = true) {
        return {
            name: name,
            value: default_value,
            input: "current",
            processor: "not",
            formatter: "boolean",
            autoClose: false,
            title: title
        };
    }
    function processorStrList(s) {
        return s.split(",").map((s) => s.trim());
    }
    const configDescs = {
        general: {
            "general/timeout": {
                name: "通用等待时间",
                value: 500,
                processor: "int_range-1-",
                autoClose: false,
                title: "单位：毫秒"
            }
        },
        minecraft: {
            "minecraft/auto-stay": _boolDesc("自动留下", "自动点击“留在 Minecraft.net”")
        },
        curseforge: {
            "curseforge/auto-mod": _boolDesc("自动跳转到 MC Mods", "自动跳转到 MC Mods"),
            "curseforge/highlight-files": _boolDesc("高亮文件下载", "高亮 Files 标签"),
            "curseforge/highlight-border": {
                name: "高亮边框样式",
                value: "rgb(241, 100, 54) 0.2em solid",
                processor: undefined,
                autoClose: false,
                title: "单位：毫秒"
            },
            "curseforge/shortcut": _boolDesc("快捷键", "添加快捷键支持")
        },
        modrinth: {
            "modrinth/auto-mod": _boolDesc("自动跳转到 MC Mods", "自动跳转到 MC Mods"),
            "modrinth/shortcut": _boolDesc("快捷键", "添加快捷键支持"),
            "modrinth/default-filter/loader": {
                name: "默认 Loader",
                value: ["fabric"],
                processor: processorStrList,
                autoClose: false,
                title: "搜索时默认使用的 Loader"
            },
            "modrinth/default-filter/version": {
                name: "默认 MC 版本",
                value: ["1.18.2", "1.19.2"],
                processor: processorStrList,
                autoClose: false,
                title: "搜索时默认使用的 MC 版本"
            },
            "modrinth/default-filter/channel": {
                name: "默认 Channel",
                value: [],
                processor: processorStrList,
                autoClose: false,
                title: "搜索时默认使用的 Channel"
            }
        }
    };
    /**
     * Try to click an element.
     * @param {string} selector The query selector.
     */
    function tryClick(selector) {
        const ele = document.querySelector(selector);
        if (ele) {
            ele.click();
            return true;
        }
        return false;
    }
    /**
     * Setup shortcuts.
     * @param {string[]} selectors The selectors. [left, right, pre-search, search]
     * @param {Function} filter The filter function.
     * @param {number} timeout Timeout in milliseconds.
     */
    function setupShortcuts(selectors, filter, timeout) {
        const nodeNames = ["INPUT", "TEXTAREA"];
        document.addEventListener("keydown", (e) => {
            if (!nodeNames.includes(document.activeElement.nodeName)) {
                switch (e.key) {
                    case "ArrowLeft":
                        tryClick(selectors[0]);
                        break;
                    case "ArrowRight":
                        tryClick(selectors[1]);
                        break;
                    case "f":
                        filter();
                        break;
                    case "s":
                        if (selectors[2].length) {
                            tryClick(selectors[2]);
                            window.setTimeout(() => {
                                const search = document.querySelector(selectors[3]);
                                if (search) search.focus();
                            }, timeout);
                        } else {
                            const search = document.querySelector(selectors[3]);
                            if (search) search.focus();
                        }
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            } else if (document.activeElement.value == "") {
                switch (e.key) {
                    case "Escape":
                        document.activeElement.blur();
                        break;
                    case "ArrowLeft":
                        tryClick(selectors[0]);
                        break;
                    case "ArrowRight":
                        tryClick(selectors[1]);
                        break;
                    default:
                        break;
                }
            }
        })
        log("⚙️ Shortcuts installed!");
    }
    const configDesc = configDescs.general;
    switch (window.location.host) {
        case 'www.minecraft.net': {
            Object.assign(configDesc, configDescs.minecraft);
            const config = new GM_config(configDesc);
            const configProxy = config.proxy;
            if (configProxy["minecraft/auto-stay"]) {
                let attempts = 16;
                const timer = window.setInterval(() => {
                    const success = tryClick("button[data-aem-contentname='close-icon']")
                        || tryClick("button.btn.btn-link#popup-btn");
                    if (success) {
                        log("✋ Auto stayed!");
                        window.clearInterval(timer);
                    } else if (--attempts <= 0) {
                        log("❌ Auto stay failed!", true);
                        window.clearInterval(timer);
                    }
                }, configProxy["general/timeout"]);
            }
            break;
        }
        case 'www.curseforge.com': {
            Object.assign(configDesc, configDescs.curseforge);
            const config = new GM_config(configDesc);
            const configProxy = config.proxy;
            if (configProxy["curseforge/auto-mod"] && window.location.pathname == '/') {
                log("🛣️ Navigating to mc mods...");
                window.location.pathname = "/minecraft/mc-mods";
            }
            const tabs = document.getElementsByClassName("tabs");
            let fileTab = undefined;
            if (tabs.length) {
                for (const tab of tabs[0].children) {
                    if (tab.textContent == "Files") {
                        fileTab = tab;
                        break;
                    }
                }
            }
            if (configProxy["curseforge/highlight-files"] && window.location.pathname != "/") {
                fileTab.style.border = configProxy["curseforge/highlight-border"];
            }
            if (configProxy["curseforge/shortcut"]) {
                setupShortcuts([".btn-prev", ".btn-next", "", "input.search-input-field"], () => { fileTab?.firstElementChild?.click(); });
            }
            break;
        }
        case "modrinth.com": {
            Object.assign(configDesc, configDescs.modrinth);
            const config = new GM_config(configDesc);
            const configProxy = config.proxy;
            if (window.location.pathname == "/" && configProxy["modrinth/auto-mod"]) {
                log("🛣️ Navigating to mod search page...");
                tryClick("a[href='/mods']");
            }
            function filter() {
                const router = document.getElementById("__nuxt").__vue_app__.$nuxt.$router;
                if (router.currentRoute.value.name === "type-id") {
                    const path = router.currentRoute.value.path;
                    router.replace({
                        path: path + "/versions", query: {
                            "l": configProxy["modrinth/default-filter/loader"],
                            "g": configProxy["modrinth/default-filter/version"],
                            "c": configProxy["modrinth/default-filter/channel"]
                        }
                    });
                }
            }
            if (configProxy["modrinth/shortcut"]) {
                setupShortcuts([".btn-wrapper > a[aria-label='Previous Page']", ".btn-wrapper > a[aria-label='Next Page']", "a[href='/mods']", "#search[placeholder='Search mods...']"], filter);
            }
            break;
        }
    }
})();