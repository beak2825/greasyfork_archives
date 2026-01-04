// ==UserScript==
// @name         Slope 3 Ad Panel Remover
// @namespace    http://tampermonkey.net/
// @version      1.2.00
// @description  Remove that annoying ad panel from the slope 3 website
// @author       @BOXeS
// @match        https://slope3.com
// @run-at       document-start
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slope3.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523310/Slope%203%20Ad%20Panel%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/523310/Slope%203%20Ad%20Panel%20Remover.meta.js
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

GM_addStyle ( `
    .main-panel {
    position: absolute;
    top: 0!important;
    right: 0;
    height: 100vh;
    width: 0px;
    max-width: 0px;
    margin: 0;
    z-index: 999;
    bottom: 0;
    background: #fff;
    -webkit-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out
}
` );

GM_addStyle ( `
    button.hide-main-panel {
    position: absolute;
    background: #eee;
    width: 0px;
    height: 0px;
    left: 0;
    top: 0px;
    padding: 2px 0 2px 1px;
    border-top: 1px solid #adb5bd;
    border-left: 1px solid #adb5bd;
    border-bottom: 1px solid #adb5bd;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    color: #6c757d
}
` );