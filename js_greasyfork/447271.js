// ==UserScript==
// @name Texture Pack Manager [Taming.io, Sploop.io, Moomoo.io]
// @author Murka
// @description Allows you to change game textures!
// @icon https://i.imgur.com/o0KykL1.png
// @version 0.3
// @match *://taming.io/*
// @match *://sploop.io/*
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @noframes
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447271/Texture%20Pack%20Manager%20%5BTamingio%2C%20Sploopio%2C%20Moomooio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/447271/Texture%20Pack%20Manager%20%5BTamingio%2C%20Sploopio%2C%20Moomooio%5D.meta.js
// ==/UserScript==
/* jshint esversion:8 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
*/

(function() {
    "use strict";

    const log = console.log.bind(console);
    const storage = {
        get(key) {
            const value = localStorage.getItem(key);
            return value === null ? null : JSON.parse(value);
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    const DATA_TYPES = { TEXTURES: 0, EMOJIS: 1 };
    const SEARCH_TYPES = { CONTAINS: 0, EQUALS: 1 };
    const TYPES = { 0: "textures", 1: "emojis" };
    const TEXT_TYPES = { 0: "URL", 1: "MESSAGE" };
    const HEADER_TYPES = { 0: "Texture Manager", 1: "Emoji Manager" };

    function isURL(string) {
        try {
            const url = new URL(string);
            return /^https?:/.test(url.protocol);
        } catch(err) {}
    }

    function isValidImageSrc(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(isURL(src));
            img.onerror = () => resolve(false);
        })
    }

    function isValidSetting(option) {
        const { id, type, searchType, from, to } = option;

        const equalToDataTypes = [DATA_TYPES.TEXTURES, DATA_TYPES.EMOJIS].includes(type);
        const equalToSearchTypes = [SEARCH_TYPES.CONTAINS, SEARCH_TYPES.EQUALS].includes(searchType);
        const isString = typeof from === "string" && typeof to === "string";
        const isTextureURL = type === DATA_TYPES.TEXTURES && isURL(to) || type === DATA_TYPES.EMOJIS;

        return Number.isInteger(id) && equalToDataTypes && equalToSearchTypes && isString && isTextureURL;
    }

    function createSettings() {
        const settings = {};
        settings.textures = [];
        settings.emojis = [];
        settings.freeIDS = [];
        return settings;
    }

    const settings = (function() {
        const defaultSettings = createSettings();
        const settings = Object.assign({}, defaultSettings, storage.get("TextureSettings"));

        for (const key in settings) {
            if (!defaultSettings.hasOwnProperty(key)) {
                delete settings[key];
            } else if (Array.isArray(settings[key]) && key === TYPES[DATA_TYPES[key.toUpperCase()]]) {
                for (let i=settings[key].length-1;i>=0;i--) {
                    if (!isValidSetting(settings[key][i])) {
                        settings[key].splice(i, 1);
                    }
                }
            }
        }

        storage.set("TextureSettings", settings);
        return settings;
    })();

    function replaceValue(type, value) {
        const testValue = value.match(/img.+$/)[0];
        for (const option of settings[TYPES[type]]) {
            const { searchType, from, to } = option;
            if (type === DATA_TYPES.TEXTURES) {
                if (searchType === SEARCH_TYPES.CONTAINS && testValue.includes(from)) return to;
                if (searchType === SEARCH_TYPES.EQUALS && testValue === from) return to;
            }
        }
        return value;
    }

    const src = Object.getOwnPropertyDescriptor(Image.prototype, "src").set;
    Object.defineProperty(Image.prototype, "src", {
        set(link) {
            return src.call(this, replaceValue(DATA_TYPES.TEXTURES, link));
        }
    })

    const HTML = `
        <div id="page-container" class="opened-menu">
            <header>
                <div class="imageHolder">
                    <img src="https://i.imgur.com/o0KykL1.png" draggable="false"/>
                </div>
                <span>Texture Pack Manager</span>
                <div id="close-menu">
                    <svg class="cross-icon"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32" height="32" viewBox="0 0 32 32"
                    >
                        <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                    </svg>
                </div>
            </header>

            <main>
                <div id="nav-bar">
                    <button class="open-menu enabled">Textures</button>
                    <button class="open-menu">Misc</button>
                    <button class="open-menu bottom-align">Credits</button>
                </div>

                <div id="menu-page-container">
                    <div class="menu-page opened">
                        <h1>Textures</h1>
                        <p class="description">Add new textures</p>
                        <div id="texture-container" class="item-container"></div>
                        <div class="add-item">
                            <label id="add-texture" class="add-item-button">
                                <svg class="icon-tx plus-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                                </svg>
                                <span class="text">Add texture</span>
                            </label>
                        </div>
                    </div>

                    <div class="menu-page">
                        <h1>Misc</h1>
                        <p class="description">Download, upload or reset your settings</p>
                        <div class="menu-page-section">
                            <button id="download-settings" class="manage-storage">DOWNLOAD</button>
                            <button class="manage-storage">
                                <input id="upload-settings" type="file"/>
                                UPLOAD
                            </button>
                            <button id="reset-settings" class="manage-storage">RESET</button>
                        </div>
                    </div>

                    <div class="menu-page">
                        <h1>Credits</h1>
                        <div class="menu-page-section">
                            <span class="highlight">Author:</span>
                            <span class="highlight-secondary">Murka</span>
                        </div>
                        <div class="menu-page-section">
                            <span class="highlight">
                                <svg
                                    class="icon-tx github-icon"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32" height="32" viewBox="0 0 32 32"
                                >
                                    <path d="M16 0.395c-8.836 0-16 7.163-16 16 0 7.069 4.585 13.067 10.942 15.182 0.8 0.148 1.094-0.347 1.094-0.77 0-0.381-0.015-1.642-0.022-2.979-4.452 0.968-5.391-1.888-5.391-1.888-0.728-1.849-1.776-2.341-1.776-2.341-1.452-0.993 0.11-0.973 0.11-0.973 1.606 0.113 2.452 1.649 2.452 1.649 1.427 2.446 3.743 1.739 4.656 1.33 0.143-1.034 0.558-1.74 1.016-2.14-3.554-0.404-7.29-1.777-7.29-7.907 0-1.747 0.625-3.174 1.649-4.295-0.166-0.403-0.714-2.030 0.155-4.234 0 0 1.344-0.43 4.401 1.64 1.276-0.355 2.645-0.532 4.005-0.539 1.359 0.006 2.729 0.184 4.008 0.539 3.054-2.070 4.395-1.64 4.395-1.64 0.871 2.204 0.323 3.831 0.157 4.234 1.026 1.12 1.647 2.548 1.647 4.295 0 6.145-3.743 7.498-7.306 7.895 0.574 0.497 1.085 1.47 1.085 2.963 0 2.141-0.019 3.864-0.019 4.391 0 0.426 0.288 0.925 1.099 0.768 6.354-2.118 10.933-8.113 10.933-15.18 0-8.837-7.164-16-16-16z"></path>
                                </svg>
                            </span>
                            <span class="highlight-secondary"><a href="https://github.com/Murka007" target="_blank">Murka007</a></span>
                        </div>
                        <div class="menu-page-section">
                            <span class="highlight">
                                <svg
                                    class="icon-tx discord-icon"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32" height="32" viewBox="0 0 32 32"
                                >
                                    <path d="M26.963 0c1.875 0 3.387 1.516 3.476 3.3v28.7l-3.569-3.031-1.96-1.784-2.139-1.864 0.893 2.94h-18.717c-1.869 0-3.387-1.42-3.387-3.301v-21.653c0-1.784 1.52-3.303 3.393-3.303h22zM18.805 7.577h-0.040l-0.269 0.267c2.764 0.8 4.101 2.049 4.101 2.049-1.781-0.891-3.387-1.336-4.992-1.516-1.16-0.18-2.32-0.085-3.3 0h-0.267c-0.627 0-1.96 0.267-3.747 0.98-0.623 0.271-0.98 0.448-0.98 0.448s1.336-1.336 4.28-2.049l-0.18-0.18c0 0-2.229-0.085-4.636 1.693 0 0-2.407 4.192-2.407 9.36 0 0 1.333 2.32 4.991 2.408 0 0 0.533-0.711 1.073-1.336-2.053-0.624-2.853-1.872-2.853-1.872s0.179 0.088 0.447 0.267h0.080c0.040 0 0.059 0.020 0.080 0.040v0.008c0.021 0.021 0.040 0.040 0.080 0.040 0.44 0.181 0.88 0.36 1.24 0.533 0.621 0.269 1.42 0.537 2.4 0.715 1.24 0.18 2.661 0.267 4.28 0 0.8-0.18 1.6-0.356 2.4-0.713 0.52-0.267 1.16-0.533 1.863-0.983 0 0-0.8 1.248-2.94 1.872 0.44 0.621 1.060 1.333 1.060 1.333 3.659-0.080 5.080-2.4 5.16-2.301 0-5.16-2.42-9.36-2.42-9.36-2.18-1.619-4.22-1.68-4.58-1.68zM19.029 13.461c0.937 0 1.693 0.8 1.693 1.78 0 0.987-0.76 1.787-1.693 1.787s-1.693-0.8-1.693-1.779c0.003-0.987 0.764-1.784 1.693-1.788zM12.972 13.461c0.933 0 1.688 0.8 1.688 1.78 0 0.987-0.76 1.787-1.693 1.787s-1.693-0.8-1.693-1.779c0-0.987 0.76-1.784 1.699-1.788z"></path>
                                </svg>
                            </span>
                            <span class="highlight-secondary"><a href="https://discord.gg/sG9cyfGPj5" target="_blank">Coding Paradise</a></span>
                        </div>
                    </div>
                </div>
            </main>
        </div>`;

    const CSS = `
:root {
    --bg-color: #0c0d11;
    --bg-sub-color: #13141b;
    --main-color: #7ebab5;
    --third-color: #8c9eaf;
    --sub-color: #454864;
    --sub-alt-color: #171a25;
    --text-color: #f6f5f5;
    --text-color-active: #777a96;
    --highlight-color: #717597;
    --highlight-color-secondary: #8b91c2;

    --add-button-color: #86ebad;
    --cancel-button-color: #eb9a86;
    --add-button-active-color: #5eaa7b;
    --cancel-button-active-color: #a36a5b;
    --bin-color: #b64444;
    --bin-color-border: #973838;

    --border-color-opacity: #7ebab56b;
    --border-color: #7ebab5;
    --popup-bg-color: #232630;
    --bg-item-content: #272a36;

    --roundness: 5px;
    --padding: 10px;
    --transition-delay: 250ms;

    --syntax-if: #d76de8;
    --syntax-method: #e8e06d;
    --syntax-constructor: #6de86d;
}

/* DEFAULT MENU */
#page-container {
    background: var(--bg-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    padding: var(--padding);
    border: 1px solid var(--main-color);
    border-radius: var(--roundness);

    width: 50%;
    min-width: 500px;
    max-width: 600px;
    box-sizing: border-box;
    opacity: 0;
    font-size: 1.5rem;
}

#page-container * {
    font-family: Arial, Helvetica, sans-serif!important;
    font-weight: 600!important;
}

#page-container h1, h2, h3, h4, p {
    margin: 0;
}

#page-container > header {
    background: var(--bg-sub-color);
    color: var(--text-color);
    border-radius: var(--roundness);
    padding: 5px var(--padding);

    font-size: 1.5em;
    font-weight: 600;
    letter-spacing: -1px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
}
header > span {
    margin-left: var(--padding);
}

#page-container > main {
    display: flex;
    width: 100%;
    height: 350px;
    margin-top: var(--padding);
}


/* MENU LOGO SIZING */
.imageHolder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
}
.imageHolder > img {
    width: 100%;
    height: 100%;
}


/* NAV BAR */
#nav-bar {
    background: var(--bg-sub-color);
    padding: var(--padding);
    border-radius: var(--roundness);

    float: left;
    display: flex;
    flex-direction: column;
}


/* MENU PAGES */
#menu-page-container {
    border-radius: var(--roundness);
    margin-left: var(--padding);

    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.menu-page {
    background: var(--bg-sub-color);
    padding: var(--padding);
    border-radius: var(--roundness);

    display: none;
}
.opened {
    display: block;
    animation: opacity var(--transition-delay) forwards;
}
@keyframes opacity {
    from { opacity: 0 }
    to { opacity: 1 }
}
@keyframes opacity2 {
    from { opacity: 1 }
    to { opacity: 0 }
}


/* HEADER AND PARAGRAPH OF MENU */
.menu-page > h1 {
    color: var(--main-color);
    font-size: 1.6em;
    letter-spacing: -2px;
}
.menu-page > h3 {
    color: var(--third-color);
    margin-top: 15px;
}
.description {
    color: var(--sub-color);
    font-weight: 600;
    font-size: 0.7em;
}
.highlight {
    color: var(--highlight-color);
    fill: var(--highlight-color);
}
.highlight-secondary {
    color: var(--highlight-color-secondary);
    font-size: 0.85em;
    margin-left: var(--padding);
}

.highlight-secondary > a {
    color: var(--highlight-color-secondary);
    cursor: pointer!important;
}

.menu-page-section {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-weight: 600;
}

.icon-tx {
    width: 25px;
}

/* ADD NEW ITEM */
.add-item {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.add-item-button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer!important;
}
.add-item-button > span {
    margin-left: 10px;
}


/* ADD ITEM BUTTON EFFECTS */
.plus-icon {
    width: 20px;
    transition: fill var(--transition-delay);
    fill: var(--sub-color);
}
.text {
    color: var(--sub-color);
    transition: color var(--transition-delay);
    font-weight: 600;
}
.add-item-button > * {
    pointer-events: none;
}
.add-item-button:hover .plus-icon {
    fill: var(--text-color);
}
.add-item-button:hover .text {
    color: var(--text-color);
}
.add-item-button:active .plus-icon {
    fill: var(--text-color-active);
}
.add-item-button:active .text {
    color: var(--text-color-active);
}


/* NAV BAR BUTTON */
.open-menu {
    outline: none;
    border: none;

    background: var(--sub-alt-color);
    color: var(--text-color);
    transition: background var(--transition-delay), color var(--transition-delay);
    font-size: 1em;
    font-weight: 600;
    padding: var(--padding);
    cursor: pointer!important;
    margin-right: 1px;
}
.open-menu:hover {
    background: var(--text-color);
    color: var(--sub-alt-color);
}
.open-menu:active {
    background: var(--sub-color);
    color: var(--sub-alt-color);
}
.open-menu.enabled {
    border: solid;
    border-width: 0 1px 0 0;
    border-color: var(--text-color);
    pointer-events: none;
    transition: border-color var(--transition-delay);
    margin-right: 0px;
}
.bottom-align {
    margin-top: auto;
}


/* ITEM SETTINGS */
.item-content {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    background: var(--bg-item-content);
    padding: var(--padding);
    padding-right: 17px;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: var(--roundness);
    text-align: center;
    margin-top: 15px;
}
.syntax-help {
    margin: 0 2px;
}
.type-text {
    color: var(--text-color);
}
.syntax-if {
    color: var(--syntax-if);
}
.syntax-method {
    color: var(--syntax-method);
    margin: 0 1px;
}
.syntax-constructor {
    color: var(--syntax-constructor);
}
.add-item-input {
    outline: none;
    border: none;
    width: 50px;

    background: var(--sub-color);
    color: var(--text-color);
    border: 1px solid;
    border-color: transparent;
    transition: border-color var(--transition-delay);

    border-radius: var(--roundness);

    padding: var(--padding) 5px;
    font-size: 0.6rem;
    font-weight: 600;
    text-align: center;
    cursor: text!important;
}
.add-item-input:hover {
    border-color: var(--border-color-opacity);
}
.add-item-input:focus {
    border-color: var(--text-color);
}
.add-item-input::placeholder {
    color: var(--text-color);
    opacity: 1; /* Firefox */
}
.add-item-input:-ms-input-placeholder {
    color: var(--text-color);
}
.add-item-input::-ms-input-placeholder {
    color: var(--text-color);
}

.item-container > .item-content > .add-item-input {
    /*width: 40px;*/
}
.item-container > .item-content > .custom-select {
    /*width: 40px;*/
    font-size: 0.5rem;
}

.bin-icon {
    width: 15px;
    height: 15px;
}
.delete-item {
    position: absolute;
    top: 5px;
    right: 0;
    opacity: 0;
    fill: var(--bin-color);
    cursor: pointer!important;
}
.delete-item > * {
    pointer-events: none;
}
.item-content:hover .delete-item {
    opacity: 1;
}
.item-content > .imageHolder {
    width: 30px;
    margin-left: 3px;
}


/* POPUP ADD ITEM */
.popup-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    animation: opacity var(--transition-delay) forwards;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    width: 100%;
    height: 100%;
    box-sizing: border-box;

    border-radius: var(--roundness);
    font-weight: 600;
}

.add-item-popup {
    padding: var(--padding);
    border: 1px solid var(--border-color-opacity);
    border-radius: var(--roundness);

    background: var(--popup-bg-color);
    text-align: center;
    width: 27rem;
}

.popup-header {
    color: var(--text-color);
}

.popup-to-remove {
    animation: opacity2 var(--transition-delay) forwards;
}
/* .add-item-popup > .item-content {
    font-size: 0.6rem;
} */


/* CONFIRM PANEL */
.checkbox-icon {
    width: 25px;
    height: 25px;
}
.cross-icon {
    width: 25px;
    height: 25px;
}
.confirm-panel {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.confirm-panel > label {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer!important;
}
.confirm-panel > label > span {
    margin-left: var(--padding);
}
.confirm-panel > label > * {
    pointer-events: none;
}


/* ADD BUTTON */
.add-button {
    color: var(--add-button-color);
    fill: var(--add-button-color);
    transition: color var(--transition-delay), fill var(--transition-delay);
    user-select: none;
}
.add-button:active {
    color: var(--add-button-active-color);
    fill: var(--add-button-active-color);
}


/* CANCEL BUTTON */
.cancel-button {
    color: var(--cancel-button-color);
    fill: var(--cancel-button-color);
    transition: color var(--transition-delay), fill var(--transition-delay);
    user-select: none;
}
.cancel-button:active {
    color: var(--cancel-button-active-color);
    fill: var(--cancel-button-active-color);
}


/* CUSTOM SELECT */
.custom-select {
    position: relative;
    background: var(--sub-alt-color);
    color: var(--text-color);
    width: 60px;
    padding: var(--padding) 5px;

    user-select: none;
    cursor: pointer!important;
    font-size: 0.6rem;
    margin: 0 2px;

    border-radius: var(--roundness);
    border: 1px solid;
    border-color: transparent;
    transition: border-color var(--transition-delay);
}
.custom-select * {
    cursor: pointer!important;
}
.custom-select:not(.custom-select-enabled):hover {
    border-color: var(--border-color-opacity);
}
.custom-select-enabled {
    border-radius: 0px;
    border-top-left-radius: var(--roundness);
    border-top-right-radius: var(--roundness);

    border-color: var(--sub-color);
    border-width: 1px 1px 0 1px;
    margin-top: -1px;
    transition: none;
}

.custom-select-options {
    display: none;
    position: absolute;
    left: -1px;
    right: 0;
    top: 100%;
    width: calc(100% + 2px);
    z-index: 11;
}

.custom-select-option {
    padding: var(--padding) 5px;
    background: var(--sub-alt-color);
    transition: background var(--transition-delay), color var(--transition-delay);

    border: solid;
    border-color: var(--sub-color);
    border-width: 0 1px 1px 1px;
}
.custom-select-option:hover {
    background: var(--sub-color);
}
.custom-select-option:active {
    background: var(--text-color);
    color: var(--sub-alt-color);
}

.custom-select-opened {
    display: block;
}
.custom-select-opened .custom-select-option:last-child {
    border-bottom-left-radius: var(--roundness);
    border-bottom-right-radius: var(--roundness);
}

.hidden {
    display: none;
}

.opened-menu {
    animation: opacity var(--transition-delay) forwards;
}

.closed-menu {
    animation: opacity2 var(--transition-delay) forwards;
}

#close-menu {
    fill: var(--bin-color);
    stroke: var(--bin-color-border);
    stroke-width: 2px;
    margin-left: auto;
    cursor: pointer!important;
}
#close-menu > * {
    pointer-events: none;
}

.manage-storage {
    position: relative;
    outline: none;
    border: none;
    background: var(--sub-alt-color);
    color: var(--text-color);
    border: 1px solid var(--border-color-opacity);
    transition: background var(--transition-delay), color var(--transition-delay);

    padding: var(--padding);
    border-radius: var(--roundness);
    font-weight: 600;
    cursor: pointer!important;
    margin-right: var(--padding);
}

.manage-storage > input {
    position: absolute;
    cursor: pointer!important;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
}
.manage-storage > input::-webkit-file-upload-button {
    cursor: pointer!important;
}

.manage-storage:hover {
    background: var(--sub-color);
}
.manage-storage:active {
    background: var(--text-color);
    color: var(--sub-alt-color);
}
.manage-storage:last-child {
    margin: 0;
}`;


    const IFRAMECSS = `
#iframe-page-container {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
}
.hidden {
    display: none!important;
}
    `;

    window.addEventListener("load", function() {

        const CODE = `<style>${CSS}</style>${HTML}`;
        const iframe = document.createElement("iframe");
        const blob = new Blob([CODE], {type: "text/html; charset=utf-8"});
        iframe.src = URL.createObjectURL(blob);
        iframe.id = "iframe-page-container";
        document.body.appendChild(iframe);

        const style = document.createElement("style");
        style.innerHTML = IFRAMECSS;
        document.head.appendChild(style);


        iframe.contentWindow.addEventListener("load", function() {
            const iframeWindow = iframe.contentWindow;
            const iframeDocument = iframeWindow.document;
            URL.revokeObjectURL(iframe.src);

            function getID(type) {
                if (settings.freeIDS.length) {
                    return settings.freeIDS.pop();
                }
                return settings[TYPES[type]].length;
            }

            function getName() {
                return location.hostname.replace(/\.io/, "");
            }

            function saveSettings() {
                const data = JSON.stringify(settings, null, 4);
                const blob = new Blob([data], { type: "text/plain" });
                const elem = document.createElement("a");
                elem.href = URL.createObjectURL(blob);
                elem.download = `textures${getName()}.txt`;
                document.body.appendChild(elem);
                elem.click();
                URL.revokeObjectURL(elem.href);
                document.body.removeChild(elem);
            }

            async function loadSettings(event) {
                try {
                    const value = await event.target.files[0].text();
                    const data = JSON.parse(value);
                    Object.assign(settings, data);
                    storage.set("TextureSettings", data);
                    render();
                    event.target.value = "";
                } catch(err) {
                    alert("File invalid");
                }
            }

            function resetSettings() {
                const data = createSettings();
                Object.assign(settings, data);
                storage.set("TextureSettings", settings);
                render();
            }

            const pageContainer = iframeDocument.querySelector("#page-container");
            const openMenu = iframeDocument.querySelectorAll(".open-menu");
            const menuPage = iframeDocument.querySelectorAll(".menu-page");
            const addTexture = iframeDocument.querySelector("#add-texture");
            const addEmoji = iframeDocument.querySelector("#add-emoji");
            const textureContainer = iframeDocument.querySelector("#texture-container");
            const emojiContainer = iframeDocument.querySelector("#emoji-container");
            const closeMenu = iframeDocument.querySelector("#close-menu");
            const downloadSettings = iframeDocument.querySelector("#download-settings");
            const uploadSettings = iframeDocument.querySelector("#upload-settings");
            const resetSettingsData = iframeDocument.querySelector("#reset-settings");

            function remove(target, className) {
                if (!Number.isInteger(target.length)) {
                    target.classList.remove(className);
                    return
                }
                for (const element of target) {
                    element.classList.remove(className);
                }
            }

            for (let i=0;i<openMenu.length;i++) {
                openMenu[i].onclick = function() {
                    remove(openMenu, "enabled");
                    openMenu[i].classList.add("enabled");

                    remove(menuPage, "opened");
                    menuPage[i].classList.add("opened");
                }
            }

            function removeChildren(element) {
                while (element.firstChild) {
                    element.removeChild(element.lastChild);
                }
            }

            function createElement(tagName, options) {
                const element = document.createElement(tagName);
                for (const key in options) {
                    element[key] = options[key];
                }
                return element;
            }

            // Custom select element
            function generateSelect(defaultValue, callback) {
                const customSelect = createElement("div", { className: "custom-select", tabIndex: 0 });
                const currentValue = createElement("span", { className: "current-value" });
                const customSelectOptions = createElement("div", { className: "custom-select-options" });

                const options = [
                    { value: SEARCH_TYPES.CONTAINS, label: "CONTAINS" },
                    { value: SEARCH_TYPES.EQUALS, label: "EQUALS" }
                ];
                options[defaultValue].isDefault = true;

                function close() {
                    customSelect.classList.remove("custom-select-enabled");
                    customSelectOptions.classList.remove("custom-select-opened");
                    removeChildren(customSelectOptions);
                }

                function addOptions() {
                    removeChildren(customSelectOptions);
                    for (const option of options) {
                        const { value, label, isDefault } = option;
                        if (isDefault) {
                            currentValue.textContent = label;
                            continue;
                        }

                        const customSelectOption = createElement("div", { className: "custom-select-option" });
                        customSelectOption.textContent = label;
                        customSelectOptions.appendChild(customSelectOption);

                        customSelectOption.onclick = function() {
                            close();
                            currentValue.textContent = label;

                            options.map(option => (option.isDefault = false));
                            option.isDefault = true;
                            callback(option);
                        }
                    }
                }
                addOptions();

                customSelect.appendChild(currentValue);
                customSelect.appendChild(customSelectOptions);

                customSelect.onclick = function(event) {
                    if (event.target.className === "custom-select-option") return;
                    customSelect.classList.toggle("custom-select-enabled");
                    customSelectOptions.classList.toggle("custom-select-opened");
                    addOptions();
                }
                customSelect.onblur = close;

                return customSelect;
            }

            function getItem(options) {
                const item = settings[TYPES[options.type]].find(item => item.id === options.id);
                if (!item) throw new Error("Failed to find item");
                return item;
            }

            function removeItem(options) {
                const item = getItem(options);
                const list = settings[TYPES[options.type]];
                const index = list.indexOf(item);
                settings.freeIDS.push(item.id);
                list.splice(index, 1);
                storage.set("TextureSettings", settings);
            }

            function updateItem(options) {
                const item = getItem(options);
                Object.assign(item, options);
                storage.set("TextureSettings", settings);
            }

            function generateItem(options = {}, isPopup = false) {
                const itemContent = createElement("div", { className: "item-content" });
                itemContent.UploadData = Object.assign({
                    id: getID(options.type),
                    type: 0,
                    searchType: 0,
                    from: "",
                    to: ""
                }, options);

                const syntaxIF = createElement("div", {
                    className: "syntax-help syntax-if",
                    textContent: "IF"
                });
                const typeText = createElement("div", {
                    className: "syntax-help syntax-constructor",
                    textContent: TEXT_TYPES[itemContent.UploadData.type]
                });
                itemContent.appendChild(syntaxIF);
                itemContent.appendChild(typeText);

                const customSelect = generateSelect(itemContent.UploadData.searchType, function(option) {
                    itemContent.UploadData.searchType = option.value;
                    if (!isPopup) updateItem(itemContent.UploadData);
                });
                itemContent.appendChild(customSelect);

                const inputFrom = createElement("input", {
                    className: "add-item-input",
                    type: "text",
                    placeholder: ". . .",
                    value: itemContent.UploadData.from || ""
                });
                inputFrom.onchange = function(event) {
                    itemContent.UploadData.from = event.target.value.match(/img.+$/)[0];
                    if (!isPopup) updateItem(itemContent.UploadData);
                }
                const replaceWith = createElement("div", {
                    className: "syntax-help syntax-method",
                    innerHTML: "REPLACE WITH"
                });
                const inputTo = createElement("input", {
                    className: "add-item-input",
                    type: "text",
                    placeholder: ". . .",
                    value: itemContent.UploadData.to || ""
                });
                const preview = createElement("div", {
                    className: "imageHolder hidden",
                    innerHTML: `<img src="" draggable="false"/>`
                });

                async function setSrc(src) {
                    preview.classList.add("hidden");
                    if (!isURL(src)) return;
                    const isValid = await isValidImageSrc(src);
                    const child = preview && preview.firstChild;
                    if (isValid && child && src !== child.src) {
                        preview.classList.remove("hidden");
                        child.src = src;
                    }
                }
                setSrc(itemContent.UploadData.to);

                inputTo.oninput = function(event) {
                    const value = event.target.value;
                    setSrc(value);
                }
                inputTo.onchange = function(event) {
                    itemContent.UploadData.to = event.target.value;
                    if (!isPopup) updateItem(itemContent.UploadData);
                }
                if (!isPopup) {
                    const deleteItem = createElement("div", {
                        className: "delete-item",
                        innerHTML: `
                <svg
                    class="icon-tx bin-icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32" height="32" viewBox="0 0 32 32"
                >
                    <path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z"></path>
                    <path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z"></path>
                </svg>
            `
                    });
                    deleteItem.onclick = function() {
                        if (itemContent.classList.contains("popup-to-remove")) return;
                        itemContent.classList.add("popup-to-remove");
                        removeItem(itemContent.UploadData);
                        setTimeout(() => itemContent.remove(), 250);
                    }
                    itemContent.appendChild(deleteItem);
                }
                itemContent.appendChild(inputFrom);
                itemContent.appendChild(replaceWith);
                itemContent.appendChild(inputTo);
                if (itemContent.UploadData.type === DATA_TYPES.TEXTURES) itemContent.appendChild(preview);

                return itemContent;
            }

            function addItem(item, options = {}) {
                const container = [textureContainer, emojiContainer][options.type];
                container.appendChild(item);
            }

            function render() {
                removeChildren(textureContainer);
                // removeChildren(emojiContainer);

                for (const key of Object.values(TYPES)) {
                    for (const options of settings[key]) {
                        const newItem = generateItem(options);
                        addItem(newItem, options);
                    }
                }
            }
            render();

            function generatePopup(type) {
                const popupContainer = createElement("div", { className: "popup-container" });
                const addItemPopup = createElement("div", { className: "add-item-popup" });
                const popupHeader = createElement("p", { className: "popup-header", textContent: HEADER_TYPES[type] });
                addItemPopup.appendChild(popupHeader);

                const item = generateItem({ type }, true);
                addItemPopup.appendChild(item);
                const confirmPanel = createElement("div", { className: "confirm-panel" });
                const addButton = createElement("label", {
                    className: "add-button",
                    innerHTML: `
        <svg
            class="checkbox-icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="32" height="32" viewBox="0 0 32 32"
        >
            <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
        </svg>
        <span>CONFIRM</span>
        `
                });
                const cancelButton = createElement("label", {
                    className: "cancel-button",
                    innerHTML: `
        <svg
            class="cross-icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="32" height="32" viewBox="0 0 32 32"
        >
            <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
        </svg>
        <span>CANCEL</span>
        `
                });
                confirmPanel.appendChild(addButton);
                confirmPanel.appendChild(cancelButton);
                addItemPopup.appendChild(confirmPanel);
                popupContainer.appendChild(addItemPopup);

                function close(event) {
                    if (popupContainer.classList.contains("popup-to-remove")) return;
                    if (![popupContainer, cancelButton, addButton].includes(event.target)) return;

                    popupContainer.classList.add("popup-to-remove");
                    setTimeout(() => popupContainer.remove(), 250);
                }

                cancelButton.onclick = close;
                popupContainer.onclick = close;

                addButton.onclick = function(event) {
                    if (event.target !== addButton) return;

                    const newItem = generateItem(item.UploadData);
                    addItem(newItem, newItem.UploadData);
                    settings[TYPES[type]].push(newItem.UploadData);
                    storage.set("TextureSettings", settings);
                    close(event);
                }

                return popupContainer;
            }

            addTexture.onclick = function() {
                pageContainer.appendChild(generatePopup(DATA_TYPES.TEXTURES));
            }

            /* addEmoji.onclick = function() {
                pageContainer.appendChild(generatePopup(DATA_TYPES.EMOJIS));
            } */

            downloadSettings.onclick = saveSettings;
            uploadSettings.onchange = loadSettings;
            resetSettingsData.onclick = resetSettings;
            function toggleMenu() {
                const list = pageContainer.classList;
                list.toggle("closed-menu");
                list.toggle("opened-menu");
                setTimeout(() => {
                    list.toggle("hidden");
                    iframe.classList.toggle("hidden");
                }, 250);
            }

            closeMenu.onclick = toggleMenu;

            function handleKeydown(event) {
                if (event.code === "Escape") {
                    event.preventDefault();
                    if (event.repeat) return;
                    toggleMenu();
                }
            }
            window.addEventListener("keydown", handleKeydown);
            iframeWindow.addEventListener("keydown", handleKeydown);
        })
    })

})();