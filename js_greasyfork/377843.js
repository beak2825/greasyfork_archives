// ==UserScript==
// @author       kaynos-barsel
// @name         Hide Facebook profile pictures and stories
// @namespace    https://github.com/kaynos-barsel
// @version      1.0.4
// @description  Simple script for hiding profile pictures from posts, comments and stories on Facebook wall
// @domain       www.facebook.com
// @include      http://www.facebook.com/*
// @include      https://www.facebook.com/*
// @grant        GM_addStyle
// @license      CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/377843/Hide%20Facebook%20profile%20pictures%20and%20stories.user.js
// @updateURL https://update.greasyfork.org/scripts/377843/Hide%20Facebook%20profile%20pictures%20and%20stories.meta.js
// ==/UserScript==

var style1 = ".pzggbiyp, .q676j6op { display: none !important; }" //profile pictures
var style2 = ".b3onmgus { display: none !important; }" //stories section
var style3 = ".s45kfl79 { display: none !important; }" //personal profile picture

GM_addStyle(style1);
GM_addStyle(style2);
GM_addStyle(style3);
