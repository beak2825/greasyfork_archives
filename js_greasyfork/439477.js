// ==UserScript==
// @name         Neoboards Preferences + Smilies Links
// @namespace    http://greasyfork.org
// @version      0.2
// @description  Adds a link to the Neoboards Preferences and Smilies to the Beta Neoboards.
// @author       Flordibel
// @match        http://www.neopets.com/neoboards/index.phtml
// @match        https://www.neopets.com/neoboards/index.phtml
// @match        http://www.neopets.com/neoboards/boardlist.phtml
// @match        https://www.neopets.com/neoboards/boardlist.phtml
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439477/Neoboards%20Preferences%20%2B%20Smilies%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/439477/Neoboards%20Preferences%20%2B%20Smilies%20Links.meta.js
// ==/UserScript==

var $ = window.jQuery;

$('#navsub-buffer__2020').append("&nbsp;&nbsp;");

$('#navsub-buffer__2020').prepend('<a href=\"https://www.neopets.com/neoboards/preferences.phtml\"></>Preferences</a> &nbsp;|').append('<a href=\"https://www.neopets.com/neoboards/smilies.phtml\"></>Smilies</a>').css("color", "#3b54b4").css("font-family", "Palanquin").css("display", "inline-block").css("position", "relative").css("left", "30px").css("top", "10px");

$('#navsub-buffer__2020 > a').css("color", "inherit");