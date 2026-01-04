// ==UserScript==
// @name        Gmail Dark Theme
// @version     1.0.1
// @date        2020-05-03
// @author      Getsumi3
// @description Dark theme for Gmail. Changing default dark theme, some backround colors and adding some borders
// @match       *://mail.google.com/*
// @grant       none
// @run-at      document-start
// @license     MIT
// @copyright 2020, Getsumi3 (https://https://github.com/Getsumi3)
// @namespace https://greasyfork.org/users/549792
// @downloadURL https://update.greasyfork.org/scripts/402539/Gmail%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/402539/Gmail%20Dark%20Theme.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

//making the loading screen dark! so your eyes will not burn while gmail is loading
addGlobalStyle('#loading { background-color: #111111; }');
addGlobalStyle('#bhlf { color: rgba(255,255,255,0.70); }');

//adding some space between inbox categories and e-mails, and removing the bg color
addGlobalStyle('.aKh { padding-bottom: 10px; background-color: inherit !important; }');

//changing border for each inbox category
addGlobalStyle('.aIf-aLe { border-right: 2px solid #ff9800 !important; }');
addGlobalStyle('.aKe-aLe { border-right: 3px solid #2196F3 !important; }');
addGlobalStyle('.aJi-aLe { border-right: 3px solid #74b973 !important; }');

//pretifying hover for inbox categories
addGlobalStyle('.aRz.J-KU:hover { background: rgb(255,255,255) !important; background: linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 100%) !important; }');

//changing bg-color for unread e-mails,adding left border to mark unread e-mails
addGlobalStyle('.zE { background-color: #191a1f !important; border-left: 3px solid #ff9800; margin-bottom: 5px;}');

//changing bg-color for read e-mails,adding left border to mark read e-mails
addGlobalStyle('.yO { background-color: #111111 !important; border-left: 3px solid #2196F3; margin-bottom: 5px;}');

//TODO: Changing colors for message itself
