// ==UserScript==
// @name         GeekHub ContentBreak
// @namespace    http://seamonster.me
// @version      0.1
// @description  修复GeekHub帖子内容变形
// @author       SeaMonster
// @match        https://*.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404053/GeekHub%20ContentBreak.user.js
// @updateURL https://update.greasyfork.org/scripts/404053/GeekHub%20ContentBreak.meta.js
// ==/UserScript==

(function() {
    // Create our shared stylesheet
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('.story { word-break: break-all;}');

    // Apply the stylesheet to a document
    document.adoptedStyleSheets = [sheet];
})();