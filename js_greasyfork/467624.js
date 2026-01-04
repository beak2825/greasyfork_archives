// ==UserScript==
// @name         syosetu color visited links
// @namespace    https://greasyfork.org/
// @version      1
// @description  Makes finding unread stories easier by coloring visited links a different color.
// @author       Themy
// @match        https://yomou.syosetu.com/search.php?*
// @match        https://noc.syosetu.com/search/search/*
// @match        https://mnlt.syosetu.com/search/search/*
// @match        https://mid.syosetu.com/search/search/*
// @match        https://ncode.syosetu.com/*
// @match        https://novel18.syosetu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syosetu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467624/syosetu%20color%20visited%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/467624/syosetu%20color%20visited%20links.meta.js
// ==/UserScript==

function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

GM_addStyle("a:visited { color:orange !important; }");
GM_addStyle("#novel_contents.customlayout4 a:visited { color:purple !important; }");