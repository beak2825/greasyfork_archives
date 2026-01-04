// ==UserScript==
// @name         Whale Dark
// @description  Revert overeager dark theme
// @match        https://tweakers.net/*
// @match        https://qwiiik.web.app/*
// @match        https://*github.com/*
// @match        https://outlook.office.com/*
// @match        https://www.google.com/*
// @match        https://www.google.com/*
// @match        https://contacts.google.com/*
// @match        https://www.dropbox.com/*
// @match        https://m.youtube.com/*
// @match        https://web.telegram.org/*
// @match        https://discord.com/*
// @match        https://www.nu.nl/*
// @grant        GM_addStyle
// @run-at       document-start
// @version 0.0.1.20240703123240
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/497464/Whale%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/497464/Whale%20Dark.meta.js
// ==/UserScript==

GM_addStyle("body { filter: contrast(0.8) saturate(1.2) } :not(:has(*)) { filter: brightness(1.1) }");