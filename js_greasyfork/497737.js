// ==UserScript==
// @name     Hide Magma Ad
// @description Hides the advertisement on Magma so you can use Blaze seamlessly
// @version  1.0.1
// @license  MIT
// @include  https://magma.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @namespace https://greasyfork.org/users/1316849
// @downloadURL https://update.greasyfork.org/scripts/497737/Hide%20Magma%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/497737/Hide%20Magma%20Ad.meta.js
// ==/UserScript==

GM_addStyle ( `
    .editor-right {
        width: 250px !important;
    }
    .editor {
        right: 250px !important;
    }
` );