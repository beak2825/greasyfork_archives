// ==UserScript==
// @name         Custom Styles
// @namespace    https://greasyfork.org/ru/scripts/457633/
// @version      0.2
// @author       v666ad
// @match        https://shikimori.me/*
// @match        https://shikimori.one/*
// @description включить/выключить кастомные стили 1 кнопкой
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481548/Custom%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/481548/Custom%20Styles.meta.js
// ==/UserScript==

let customStylesEnabled = false // Custom styles are disabled by default.

let customStyleElement = null
let sourceCustomStyles = ""

function supports_HTML5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

if (supports_HTML5_storage()) {
    let customStylesEnabledLocalStorageExists = localStorage.getItem("customStylesEnabled")
    if (!customStylesEnabledLocalStorageExists) {
        localStorage.setItem("customStylesEnabled", customStylesEnabled)
    } else {
        customStylesEnabled = (customStylesEnabledLocalStorageExists === "true")
    }
}

function enableDisableCustomStyles() {
    if (customStylesEnabled) {
        customStyleElement.innerHTML = ""
    } else {
        customStyleElement.innerHTML = sourceCustomStyles
    }
    customStylesEnabled = !customStylesEnabled
    if (supports_HTML5_storage()) {
        localStorage.setItem("customStylesEnabled", customStylesEnabled)
    }
}

function main() {
    if (!document.querySelector("header.l-top_menu-v2 div.menu-dropdown.profile div.submenu a.icon-other")) {
        customStyleElement = document.getElementById("custom_css")
        sourceCustomStyles = customStyleElement.innerHTML
        document.querySelectorAll("header.l-top_menu-v2 div.menu-dropdown.profile div.submenu div.legend")[1].insertAdjacentHTML("afterend", `<a class="icon-other" tabindex="-1" title="Вернуть/Убрать пользовательские стили"><span class="text">Стили</span></a>`)
    }
    document.querySelector("header.l-top_menu-v2 div.menu-dropdown.profile div.submenu a.icon-other").onclick = enableDisableCustomStyles
    if (!customStylesEnabled) {
        customStyleElement.innerHTML = ""
    }
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

ready(main);