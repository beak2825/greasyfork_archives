// ==UserScript==
// @description Prevents Popup on spiegel.de which appears if you are using an Ad Blocker
// @name     spiegel.de Anti-Anti-Ad-Block
// @version  1
// @grant    unsafeWindow
// @include  http://www.spiegel.de/*
// @namespace https://greasyfork.org/users/183491
// @downloadURL https://update.greasyfork.org/scripts/367592/spiegelde%20Anti-Anti-Ad-Block.user.js
// @updateURL https://update.greasyfork.org/scripts/367592/spiegelde%20Anti-Anti-Ad-Block.meta.js
// ==/UserScript==

unsafeWindow.setTimeout = () => {};
