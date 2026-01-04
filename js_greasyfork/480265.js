// ==UserScript==
// @name         Numerade Blur Unlocker
// @version      1.0
// @description  Unlock some of the blurred content on numerade
// @original author       nightshade
// @match        *://*numerade.com/*
// @include      *://*numerade.com/*
// @grant        none
// @original namespace https://greasyfork.org/users/824640
// @Modified by @Abyss_Seeker!
// @author Abyss_Seeker!
// @license MIT
// @namespace https://greasyfork.org/users/1220066
// @downloadURL https://update.greasyfork.org/scripts/480265/Numerade%20Blur%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/480265/Numerade%20Blur%20Unlocker.meta.js
// ==/UserScript==

// Remove elements with class "ai-blur-box"
$(".ai-blur-box").remove();

// Remove class "ai-blur-text" from all elements
$("[class*='ai-blur-text']").removeClass("ai-blur-text");
