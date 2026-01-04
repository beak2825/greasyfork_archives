// ==UserScript==
// @name         QQ Redirector
// @version      1.0
// @description  Automatically redirect from QQ intermediate pages
// @author       HuanLin
// @match        *://c.pc.qq.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1089161
// @downloadURL https://update.greasyfork.org/scripts/476755/QQ%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/476755/QQ%20Redirector.meta.js
// ==/UserScript==


(() => { const u = new URLSearchParams(window.location.search).get('url'); if (u) { let r = decodeURIComponent(u); if (r.endsWith('html/')) r = r.slice(0, -1); window.location.href = r; } })();
