// ==UserScript==
// @name         Disable Page Visibility API
// @namespace    https://www.kookxiang.com/
// @version      0.2
// @description  Disable HTML5 Page Visibility API to prevent website tracking you
// @author       kookxiang
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/415290/Disable%20Page%20Visibility%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/415290/Disable%20Page%20Visibility%20API.meta.js
// ==/UserScript==

document.addEventListener('visibilitychange', function (e) { e.stopImmediatePropagation(); }, true);
window.addEventListener('blur', function (e) { e.stopImmediatePropagation(); }, true);

Object.defineProperty(document, 'visibilityState', { get: function () { return "visible"; } });
Object.defineProperty(document, 'hidden', { get: function () { return false; } });