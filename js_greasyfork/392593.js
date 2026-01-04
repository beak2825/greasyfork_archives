// ==UserScript==
// @author       kaynos-barsel
// @name         Hide spoiler picture from Wstream player
// @namespace    https://github.com/kaynos-barsel
// @version      1.0.0
// @description  Simple script for hiding spoiler picture from Wstream player
// @domain       wstream.video
// @include      http://wstream.video/*
// @include      https://wstream.video/*
// @grant        GM_addStyle
// @license      CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/392593/Hide%20spoiler%20picture%20from%20Wstream%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/392593/Hide%20spoiler%20picture%20from%20Wstream%20player.meta.js
// ==/UserScript==

var style1 = "#xo23l4yx, .vjs-poster, video { display: none !important; }";

GM_addStyle(style1);