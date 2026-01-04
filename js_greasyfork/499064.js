// ==UserScript==
// @name        Remove Highlight Button (after page load)
// @namespace   Violentmonkey Scripts
// @match       https://help.qsys.com/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      Scott Stubblefield | https://github.com/sstubblefield/vm-qsys-help_removehighlights
// @description 5/23/2024, 1:55:17 PM
// @downloadURL https://update.greasyfork.org/scripts/499064/Remove%20Highlight%20Button%20%28after%20page%20load%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499064/Remove%20Highlight%20Button%20%28after%20page%20load%29.meta.js
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

OnDocumentReady();

GM_addStyle("#header .remove-highlight-button{height: 40px;padding: 0 14px;float: left;margin: 0 10px 0 0;border-radius: 6px;color: #fff;font-size: 20px;border: solid 1px #0e9bfe;font-weight: bold;background: linear-gradient(#48b2e3 0%, #0e76bc 100%)}");
GM_addStyle(".search-bar{box-shadow: none; -webkit-box-shadow: none; border: none!important;}");
GM_addStyle(".search-account-container{top: 10px;");