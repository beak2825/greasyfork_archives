// ==UserScript==
// @name        matsuriwiki auto preview
// @run-at      document-idle
// @namespace   wiki.xrlian.com
// @description For my personal wiki
// @include     https://wiki.xrlian.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23215/matsuriwiki%20auto%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/23215/matsuriwiki%20auto%20preview.meta.js
// ==/UserScript==
spinner_hook_added = false;
document.getElementById('wpTextbox1').onchange = function () {
  document.getElementById('wpPreview').click();
};
