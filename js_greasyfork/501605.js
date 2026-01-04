// ==UserScript==
// @name         Minimal StartPage.com
// @namespace    ScriptKing
// @version      2024-07-19
// @description  Keep it simple. Remove useless elements
// @author       ScriptKing
// @match        https://www.startpage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @grant        none
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/501605/Minimal%20StartPagecom.user.js
// @updateURL https://update.greasyfork.org/scripts/501605/Minimal%20StartPagecom.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    var classes_to_hide = ['stocks-q','feedback-serp-','dictionary','yt-overlay','w-gl-attr','block-display','anonymous-view-link ','blog-menu','search-expander-top','anonymous-view-link','w-gl-attribution ']
    var minimal_style = ''
    classes_to_hide.forEach(cl => {minimal_style += '[class^="' + cl + '"] {display: none} '})
    style.innerHTML = minimal_style
    setTimeout(() => document.head.appendChild(style))
    var main = document.getElementById('main')
    try { main.querySelector(':scope > [class^="css-"]').style.display = 'none' } catch{}
    document.getElementById('sidebar').style.display = 'none'
    document.querySelector('[class^="ss-gl-result"]').style.background = 'none'
})();