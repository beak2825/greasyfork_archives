// ==UserScript==
// @name         MEGA Print Working Directory
// @namespace    net.myitian.js.mega.pwd
// @description  Show current location in title when using MEGA cloud storage.
// @source       https://github.com/Myitian/MEGA-PWD
// @author       Myitian
// @license      MIT
// @version      0.3
// @match        https://mega.nz/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/540112/MEGA%20Print%20Working%20Directory.user.js
// @updateURL https://update.greasyfork.org/scripts/540112/MEGA%20Print%20Working%20Directory.meta.js
// ==/UserScript==

/** @param {string[]} selectors */
function simpleCallback(...selectors) {
    const title = document.title.trim();
    if (title.length === 0) {
        return;
    }
    const dlkey = document.querySelector(".dlkey-dialog:not(.hidden)");
    if (dlkey) {
        /** @type {HTMLElement} */
        const element = dlkey.querySelector("#dlkey-dialog-title");
        mName = element?.innerText.replace("\n", "") ?? "";
    } else {
        mName = "";
        for (const selector of selectors) {
            /** @type {HTMLElement} */
            const element = document.querySelector(selector);
            if (element) {
                if (mName) {
                    mName += "/";
                }
                mName += element.innerText.trim().replace("\n", "");
            }
        }
    }
    if (!mName) {
        return;
    }
    if (baseTitle === null || /^[^\|]+MEGA[^\|]+$/.test(title)) {
        baseTitle = title;
    }
    const newTitle = `${mName} | ${baseTitle}`.trim();
    if (title !== newTitle) {
        document.title = newTitle;
    }
}
function folderCallback() {
    const title = document.title.trim();
    if (title.length === 0) {
        return;
    }
    const dlkey = document.querySelector(".dlkey-dialog:not(.hidden)");
    if (dlkey) {
        /** @type {HTMLElement} */
        const dlkeyTitle = dlkey.querySelector("#dlkey-dialog-title");
        mName = dlkeyTitle?.innerText.replace("\n", "") ?? "";
    } else {
        mName = "";
        /** @type {NodeListOf<HTMLElement>} */
        const es = document.querySelectorAll(".fm-right-files-block .breadcrumb-dropdown span");
        if (es.length > 0) {
            for (const e of es) {
                mName = `${e.innerText.trim()}/${mName}`;
            }
            /** @type {HTMLElement} */
            const element = document.querySelector(".fm-right-files-block .fm-breadcrumbs-block a:last-child .simpletip-tc");
            mName += element?.innerText;
        } else {
            /** @type {NodeListOf<HTMLElement>} */
            const es2 = document.querySelectorAll(".fm-right-files-block .fm-breadcrumbs-block .simpletip-tc");
            for (let i = 0; i < es2.length; i++) {
                mName += es2[i].innerText.trim();
                if (i < es2.length - 1) {
                    mName += "/";
                }
            }
        }
    }
    if (!mName) {
        return;
    }
    if (baseTitle === null || /^[^\|]+MEGA[^\|]+$/.test(title)) {
        baseTitle = title;
    }
    const newTitle = `${mName} | ${baseTitle}`.trim();
    if (title !== newTitle) {
        document.title = newTitle;
    }
}
/** @param {number} t */
function delay(t) {
    return new Promise((rs, _) => setTimeout(rs, t));
}

/** @typedef {"password"|"file"|"folder"|"fm"|"fm-chat"|"fm-contacts"|"fm-pwm"|"fm-account"|"fm-shares"|"fm-media"|"fm-dashboard"|null} Mode */

/** @type {MutationObserverInit} */
const OBSERVER_CONFIG = { attributes: true, childList: true, subtree: true };
GM_registerMenuCommand("PWD", () => prompt("Value", mName));
let forceRefresh = false;
let mName = null;
let baseTitle = null;
/** @type {MutationObserver|null} */
let observer = null;
/** @type {Mode} */
let prevMode = null;

window.addEventListener("hashchange", e => main(new URL(e.newURL)));
const originalPushState = history.pushState;
history.pushState = (data, unused, url) => {
    main(new URL(url, window.location.href));
    return originalPushState.call(history, data, unused, url);
}
main(window.location);

/** @param {URL|Location} url */
async function main(url) {
    /** @type {Mode} */
    let mode = null;
    if (url.hash.startsWith("#P!")) {
        mode = "password";
    } else if (url.pathname.startsWith("/file/")) {
        mode = "file";
    } else if (url.pathname.startsWith("/folder/")
        || url.pathname.match(/^\/fm(?:\/(?:[0-9A-Za-z]{8})?)?$/)) {
        mode = "folder";
    } else if (url.pathname.startsWith("/fm/chat/contacts")) {
        mode = "fm-contacts";
    } else if (url.pathname.startsWith("/fm/chat")) {
        mode = "fm-chat";
    } else if (url.pathname.startsWith("/fm/pwm")) {
        mode = "fm-pwm";
    } else if (url.pathname.startsWith("/fm/account")) {
        mode = "fm-account";
    } else if (url.pathname.startsWith("/fm/shares")
        || url.pathname.startsWith("/fm/out-shares")
        || url.pathname.startsWith("/fm/public-links")
        || url.pathname.startsWith("/fm/file-requests")) {
        mode = "fm-shares";
    } else if (url.pathname.startsWith("/fm/photos")
        || url.pathname.startsWith("/fm/albums")) {
        mode = "fm-media";
    } else if (url.pathname.startsWith("/fm/dashboard")) {
        mode = "fm-dashboard";
    } else if (url.pathname.startsWith("/fm/")) {
        mode = "fm";
    }
    if (mode !== prevMode || forceRefresh) {
        forceRefresh = false;
        observer?.disconnect();
        console.debug("[MEGA-PWD]", "SwitchMode:", prevMode, "->", mode);
        prevMode = mode;
        if (mode !== null) {
            /** @type {{callback:()=>void,selector:string}|null} */
            let config = null;
            switch (mode) {
                case "password":
                    config = {
                        selector: "#password-dialog-title",
                        callback: () => simpleCallback("#password-dialog-title")
                    };
                    break;
                case "file":
                    config = {
                        selector: ".title-block",
                        callback: () => simpleCallback(".title-block")
                    };
                    break;
                case "folder":
                    config = {
                        selector: ".fm-right-files-block .fm-breadcrumbs-wrapper",
                        callback: folderCallback
                    };
                    break;
                case "fm-contacts":
                    config = {
                        selector: ".contacts-navigation",
                        callback: () => simpleCallback(".contacts-navigation .active")
                    };
                    break;
                case "fm-chat":
                    config = {
                        selector: ".lhp-nav",
                        callback: () => simpleCallback(".lhp-nav-container.active")
                    };
                    break;
                case "fm-pwm":
                    config = {
                        selector: ".top-nav .primary-text",
                        callback: () => simpleCallback(".top-nav .primary-text")
                    };
                    break;
                case "fm-account":
                    config = {
                        selector: ".account .lp-content-wrap",
                        callback: () => simpleCallback(".account .lp-header", ".account .settings-button.active .head-title")
                    };
                    break;
                case "fm-shares":
                    config = {
                        selector: ".shares-tabs-bl",
                        callback: () => simpleCallback(".mega-component.active .primary-text", ".shares-tab-lnk.active")
                    };
                    break;
                case "fm-media":
                    config = {
                        selector: "#media-tabs",
                        callback: () => simpleCallback(".mega-component.active .primary-text", "#media-tabs .active")
                    };
                    break;
                case "fm-dashboard":
                    config = {
                        selector: ".to-my-profile .primary-text",
                        callback: () => simpleCallback(".to-my-profile .primary-text")
                    };
                    break;
                case "fm":
                    config = {
                        selector: ".menu.ps",
                        callback: () => simpleCallback(".mega-component.active .primary-text")
                    };
                    break;
            }
            let element = null;
            observer = new MutationObserver(config.callback);
            if (mode === "file" || mode === "folder") {
                while (!(element = document.querySelector(".dlkey-dialog"))) {
                    await delay(50);
                }
                config.callback();
                observer.observe(element, OBSERVER_CONFIG);
                if (mode === "file") {
                    const largeChangeObserver = new MutationObserver(records => {
                        if (records.find(
                            it => Array.from(it.removedNodes).find(
                                iit => iit instanceof Element && iit.classList.contains("bottom-page")))) {
                            largeChangeObserver.disconnect();
                            forceRefresh = true;
                        }
                    });
                    largeChangeObserver.observe(document.querySelector("#startholder"), OBSERVER_CONFIG);
                }
            }
            while (!(element = document.querySelector(config.selector))) {
                await delay(50);
            }
            config.callback();
            observer.observe(document.querySelector("title"), OBSERVER_CONFIG);
            observer.observe(element, OBSERVER_CONFIG);
        }
    }
}