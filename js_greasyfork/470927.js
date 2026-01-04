// ==UserScript==
// @name         Internet Guardian
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Block NSFW content.
// @author       Zach Kosove
// @match        *://*/*
// @grant        none
// @compatible   firefox
// @compatible   chrome
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @run-at       document-start
// @icon         https://icons.iconarchive.com/icons/graphicloads/folded/256/unlock-folded-icon.png
// @downloadURL https://update.greasyfork.org/scripts/470927/Internet%20Guardian.user.js
// @updateURL https://update.greasyfork.org/scripts/470927/Internet%20Guardian.meta.js
// ==/UserScript==

const keywords = [
    'sex',
    'cock',
    'dick',
    'fuck',
    'gore',
    'nude',
    'orgy',
    'porn',
    'tits',
    'xnxx',
    'boobs',
    'naked',
    'penis',
    'pussy',
    'hanime',
    'hentai',
    'rule34',
    'vagina',
    'blowjob',
    'breasts',
    'handjob',
    'xvideos'
];
const url = location.href.toLowerCase();

if (keywords.some(keyword => url.includes(keyword))) {
    location.replace("https://duckduckgo.com/");
}