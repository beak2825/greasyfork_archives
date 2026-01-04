// ==UserScript==
// @name         skyscrapercity stiky user name
// @namespace    stiky_user_name
// @version      1.11
// @description  stiky post user name
// @author       Arti
// @match        https://www.skyscrapercity.com/showthread.php*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/386620/skyscrapercity%20stiky%20user%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/386620/skyscrapercity%20stiky%20user%20name.meta.js
// ==/UserScript==

// greasemonkey4 jest wredny :/ i wywlalił @grant GM_addStyle
// based on https://github.com/greasemonkey/gm4-polyfill/blob/master/gm4-polyfill.js
function GM_addStyle(aCss) {
    var head = document.getElementsByTagName('head')[0];
    if (head) {
      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
}



GM_addStyle ( `
  td.alt2 > div[id^=postmenu_]  { /* :nth-child(1) */
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    right:0;
    background-color: #E1E4F2;
    }
` );