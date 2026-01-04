// ==UserScript==
// @name         Nehan mobile
// @namespace    http://tampermonkey.net/
// @description fix nehan reader on mobile
// @description  try to take over the world!
// @version     1.5
// @author      aporiz
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @match        https://ncode.syosetu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syosetu.com
// @grant    GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/466602/Nehan%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/466602/Nehan%20mobile.meta.js
// ==/UserScript==

function fixBr() {
  var allElements = document.body.getElementsByTagName("*");
  for(var i = 0; i < allElements.length; i++) {
      allElements[i].innerHTML = allElements[i].innerHTML.replace(/[？?]/g, ' ？');
  }
}

function addGlobalStyle(css) {
    var head, styleCheck, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    styleCheck = document.getElementsByClassName('fixTateyomi')[0];
    if (styleCheck) { return; }
    style = document.createElement('style');
    style.className = "fixTateyomi"
    style.type = 'text/css';
    //style.innerHTML = css.replace(/;/g, ' !important;');
    style.innerHTML =  `
    .nh-reader-main {
      margin-left: -30px !important;
    }
    *::selection {
   color: red !important;
   background: transparent !important;
   }
 }
 `
 head.appendChild(style);
 console.log("test");
}

//fixBr();
var refreshIntervalId = setInterval(addGlobalStyle, 5000);
