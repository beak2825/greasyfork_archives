// ==UserScript==
// @name         Naturalbd.com - Banner Image Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The perpous of This script make naturalbd.com bannaer image full view.
// @author       You
// @match        http://www.naturalbd.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397527/Naturalbdcom%20-%20Banner%20Image%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/397527/Naturalbdcom%20-%20Banner%20Image%20Fix.meta.js
// ==/UserScript==

$(".support_panel").append("<style>.zn_simple_slider-itemimg {background-size: contain;}</style>");