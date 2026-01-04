// ==UserScript==
// @name         Anti1984Youtube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        http://www.youtube.com/*
// @match        http://m.youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @author       JaiEnvieDeBezos
// @description  Anti 1984 Youtube
// @downloadURL https://update.greasyfork.org/scripts/418861/Anti1984Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/418861/Anti1984Youtube.meta.js
// ==/UserScript==

var element = document.getElementById("clarify-box");
    element.parentNode.removeChild(element);