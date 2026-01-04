// ==UserScript==
// @name         Copy, Paste and Contextmenu Disabler Disabler
// @name:ja         コピー、ペースト、コンテキストメニューの無効化を無効化する
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  You can copy, paste, open the context menu freely.
// @description:ja  コピペやコンテキストメニューくらい自由に使わせてよ
// @author       Jakarta Read-only Brothers
// @include      https://*
// @include      http://*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/443500/Copy%2C%20Paste%20and%20Contextmenu%20Disabler%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/443500/Copy%2C%20Paste%20and%20Contextmenu%20Disabler%20Disabler.meta.js
// ==/UserScript==

document.addEventListener("copy", (event) => { event.stopImmediatePropagation(); }, true);
document.addEventListener("paste", (event) => { event.stopImmediatePropagation(); }, true);
document.addEventListener("contextmenu", (event) => { event.stopImmediatePropagation(); }, true);
