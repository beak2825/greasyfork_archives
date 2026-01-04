// ==UserScript==
// @name         Discord Dyslexia font
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert discord chat messages to dyslexia font
// @author       Gibrietas Daughter of the Cosmos
// @match        *://discord.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/447722/Discord%20Dyslexia%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/447722/Discord%20Dyslexia%20font.meta.js
// ==/UserScript==

GM_addStyle(`
@import url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css');

* {
    font-family: 'OpenDyslexicRegular', sans-serif !important;
}
`)
