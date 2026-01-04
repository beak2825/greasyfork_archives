// ==UserScript==
// @name         תיקון לגרסאת האייפד של FXP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!!
// @author       You
// @match        https://www.fxp.co.il/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fxp.co.il
// @grant        GM_addElement
// @run-at       document-start
// @license      MIT 
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/463563/%D7%AA%D7%99%D7%A7%D7%95%D7%9F%20%D7%9C%D7%92%D7%A8%D7%A1%D7%90%D7%AA%20%D7%94%D7%90%D7%99%D7%99%D7%A4%D7%93%20%D7%A9%D7%9C%20FXP.user.js
// @updateURL https://update.greasyfork.org/scripts/463563/%D7%AA%D7%99%D7%A7%D7%95%D7%9F%20%D7%9C%D7%92%D7%A8%D7%A1%D7%90%D7%AA%20%D7%94%D7%90%D7%99%D7%99%D7%A4%D7%93%20%D7%A9%D7%9C%20FXP.meta.js
// ==/UserScript==

if (navigator.userAgent.match(/iPad|iPod/i)) {
    GM_addElement('script', {
        src: 'https://static.fcdn.co.il/clientscript/vbulletin-core.js',
        type: 'text/javascript'
    });
}