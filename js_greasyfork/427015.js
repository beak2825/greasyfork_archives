// ==UserScript==
// @name         Nitter Gallery
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  replace nitter user media tab with gallery
// @author       You
// @include      /^(https?:\/\/)?nitter\.([A-Za-z]+){2,3}\/([.,0-9A-Za-z]+)\/media/
// @include      /^(https?:\/\/)?nitter\.([A-Za-z]+)\.([A-Za-z]+){2,3}\/([.,0-9A-Za-z]+)\/media/
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427015/Nitter%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/427015/Nitter%20Gallery.meta.js
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

//demo :
GM_addStyle(".tweet-body {display:flex;flex-direction: row;flex-grow:1;flex-wrap: wrap;justify-content:flex-start;margin: auto;overflow:hidden;}");
GM_addStyle(".tweet-header, .tweet-content, .tweet-link, .tweet-stats {max-height:1px;max-width:1px;position:absolute;overflow:hidden;}");
GM_addStyle(".attachments {max-height:700px;height:auto;width:auto;max-width:700px;overflow:visible;padding: 0 0 0 0;margin:auto;}");
GM_addStyle(".still-image img {flex-basis:0px;}");
GM_addStyle(".timeline-item {padding: 0 0 2px 0;margin: auto;}");
GM_addStyle(".timeline {padding: 0 0 0 0;margin: 0 0 0 0;}");

const sheet = document.getElementById("GM_addStyleBy8626").sheet,
  rules = (sheet.rules || sheet.cssRules);

for (let i=0; i<rules.length; i++) {
  document.querySelector("pre").innerHTML += rules[i].cssText + "\n";
}