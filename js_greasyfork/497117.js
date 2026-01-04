// ==UserScript==
// @name Dark Reader
// @description Load CDN version of Dark Reader
// @require https://cdn.jsdelivr.net/npm/darkreader@4/darkreader.min.js
// @match *://*/*
// @exclude https://tweakers.net/*
// @exclude https://qwiiik.web.app/*
// @exclude https://*github.com/*
// @exclude https://outlook.office.com/*
// @exclude https://www.google.com/*
// @exclude https://contacts.google.com/*
// @exclude https://www.builder.io/blog*
// @exclude https://www.dropbox.com/*
// @exclude https://m.youtube.com/*
// @exclude https://web.telegram.org/*
// @exclude https://discord.com/*
// @exclude https://www.nu.nl/*
// @exclude https://www.linkedin.com/*
// @exclude https://my.nextdns.io/*
// @grant GM_registerMenuCommand
// @run-at document-start
// @license MIT
// @version 0.0.1.20240925144811
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/497117/Dark%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/497117/Dark%20Reader.meta.js
// ==/UserScript==

DarkReader.setFetchMethod(window.fetch)
DarkReader.enable()
// navigator.webkitTemporaryStorage.queryUsageAndQuota((_, q) => q > 500000000 && (
//         D
//         GM_registerMenuCommand("Disable Dark Reader", DarkReader.disable)
// ));