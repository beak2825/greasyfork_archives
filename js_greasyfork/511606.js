// ==UserScript==
// @name         Proton Calendar Customization
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Some customizations for Proton Calendar
// @author       ShaunaTheDead86
// @match        https://calendar.proton.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=proton.me
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/511606/Proton%20Calendar%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/511606/Proton%20Calendar%20Customization.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document) return

    const header = document.querySelector("header")
    if (header) {
        header.style.height = 0
        header.style.padding = 0
    }

    const sidebar = document.querySelector("div.sidebar")
    if (sidebar) {
        sidebar.style.width = 0
    }

    const events = document.querySelector("div.calendar-eventcell")
    if (events) {
        events.style.height = "fit-content"
        Array.from(events.children).forEach((child) => {
            child.style["text-wrap"] = "wrap"
        })
    }
})();