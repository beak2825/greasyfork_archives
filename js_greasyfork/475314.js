// ==UserScript==
// @name         Bypass Paywall
// @namespace    socuul.12ft_shortcut
// @version      1.2.0
// @description  Adds a context menu option to bypass an article's paywall.
// @author       SoCuul
// @license      MIT
// @include      *://*
// @icon         none
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/475314/Bypass%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/475314/Bypass%20Paywall.meta.js
// ==/UserScript==

GM_registerMenuCommand("Replace Current Tab", () => { window.location = 'https://12ft.io/proxy?q=' + window.location }, "u")
GM_registerMenuCommand("New Tab", () => GM_openInTab('https://12ft.io/proxy?q=' + window.location, { active: true }))