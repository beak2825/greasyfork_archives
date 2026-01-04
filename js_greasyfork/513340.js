// ==UserScript==
// @name         Titulky.com - Script odstraní hlášení o AdBlock s bubákem
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description
// @author       You
// @grant        none
// @license      MIT
// @include      http://titulky.com/*
// @include      http://www.titulky.com/*
// @include      https://titulky.com/*
// @include      https://www.titulky.com/*
// @run-at       document-body
// @grant        unsafeWindow
// @description Im so sorry
// @downloadURL https://update.greasyfork.org/scripts/513340/Titulkycom%20-%20Script%20odstran%C3%AD%20hl%C3%A1%C5%A1en%C3%AD%20o%20AdBlock%20s%20bub%C3%A1kem.user.js
// @updateURL https://update.greasyfork.org/scripts/513340/Titulkycom%20-%20Script%20odstran%C3%AD%20hl%C3%A1%C5%A1en%C3%AD%20o%20AdBlock%20s%20bub%C3%A1kem.meta.js
// ==/UserScript==

window.showFairUser = true;
window.adbUser = false;
document.cookie = 'adbvshown=; Max-Age=31536000;path=/; secure; SameSite=Lax';
window.foolish_script_is_here = () => {};
window.sssp = { getAds: function() {} };
window._satellite = { pageBottom: function() {} };
window.showBanner735 = true;