// ==UserScript==
// @name        Change unraid.net logo target to go home
// @namespace   Violentmonkey Scripts
// @include     /^https?://(.*).unraid.net/.*$/
// @grant       none
// @version     1.0
// @author      alexleekt
// @description 9/27/2021, 10:21:15 PM
// @downloadURL https://update.greasyfork.org/scripts/433080/Change%20unraidnet%20logo%20target%20to%20go%20home.user.js
// @updateURL https://update.greasyfork.org/scripts/433080/Change%20unraidnet%20logo%20target%20to%20go%20home.meta.js
// ==/UserScript==

$(".logo > a[target='_blank']").attr("href", "/").attr("target", "_self");