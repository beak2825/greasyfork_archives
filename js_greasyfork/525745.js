// ==UserScript==
// @name        invert colors for referansesider
// @namespace   Violentmonkey Scripts
// @match       https://aksel-referansesider.ansatt.dev.nav.no/*
// @grant       GM_addStyle
// @version     1.1
// @author      popular-software
// @license     MIT
// @description 03/02/2025, 13:27:42
// @downloadURL https://update.greasyfork.org/scripts/525745/invert%20colors%20for%20referansesider.user.js
// @updateURL https://update.greasyfork.org/scripts/525745/invert%20colors%20for%20referansesider.meta.js
// ==/UserScript==

GM_addStyle(`
    html {
        filter: invert(100%) hue-rotate(180deg);
    }
`);