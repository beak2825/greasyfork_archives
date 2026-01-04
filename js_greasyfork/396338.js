// ==UserScript==
// @name         VerticalFox - MangaFox/FanFox Vertical Screen Reader
// @namespace    http://tampermonkey.net/
// @version      420.69-NICE!-v1
// @description  Read Mangafox without annoyances of width in vertical screens
// @author       SendHelp
// @match        http://fanfox.net/manga/*/*/*
// @license      WTFPL 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396338/VerticalFox%20-%20MangaFoxFanFox%20Vertical%20Screen%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/396338/VerticalFox%20-%20MangaFoxFanFox%20Vertical%20Screen%20Reader.meta.js
// ==/UserScript==

(
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    addGlobalStyle('body { min-width: auto !important; min-height: auto; overflow-x: hidden; margin:0 auto !important;}');
}



)();