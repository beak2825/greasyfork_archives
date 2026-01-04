// ==UserScript==
// @author       kaynos-barsel
// @name         Hide spoiler picture from GO Unlimited player
// @namespace    https://github.com/kaynos-barsel
// @version      1.0.0
// @description  Simple script for hiding spoiler picture from GO Unlimited player
// @domain       gounlimited.to
// @include      http://gounlimited.to/*
// @include      https://gounlimited.to/*
// @grant        GM_addStyle
// @license      CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/393759/Hide%20spoiler%20picture%20from%20GO%20Unlimited%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/393759/Hide%20spoiler%20picture%20from%20GO%20Unlimited%20player.meta.js
// ==/UserScript==

var style1 = "div.player-poster, video { display: none !important; }";

GM_addStyle(style1);