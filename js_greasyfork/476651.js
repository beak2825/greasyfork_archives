// ==UserScript==
// @name         Back To Top / Elevator Button -- Fandom Wiki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a Back To Top / Elevator button for those pesky long pages. 
// @author       cass_per
// @match        https://*.fandom.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476651/Back%20To%20Top%20%20Elevator%20Button%20--%20Fandom%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/476651/Back%20To%20Top%20%20Elevator%20Button%20--%20Fandom%20Wiki.meta.js
// ==/UserScript==

var kiddo = document.body.getElementsByClassName("main-container")[0];

var newElement = document.createElement('div');
newElement.id = "backTop";

newElement.innerHTML = '<a href="#">Back To Top</a>';


//GM_addStyle() not by me!!
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

GM_addStyle("#backTop { position:fixed; bottom:4em; right:0; z-index:2000; background: var(--fandom-global-nav-background-color); width: fit-content; padding: 5px; border: 3px solid var(--fandom-accent-color); }");


document.body.insertBefore(newElement, kiddo);