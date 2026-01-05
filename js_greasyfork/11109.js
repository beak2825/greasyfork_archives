// ==UserScript==
// @name        Ctrl Right Click MyWOT
// @namespace   Ctrl Right Click MyWOT
// @description When you hold Ctrl and right click a link, it will open the mywot.com scorecard for the link in a new tab.
// @include     *
// @version     1.4
// @grant       GM_openInTab
// @author      kriscross07
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/11109/Ctrl%20Right%20Click%20MyWOT.user.js
// @updateURL https://update.greasyfork.org/scripts/11109/Ctrl%20Right%20Click%20MyWOT.meta.js
// ==/UserScript==

addEventListener('contextmenu',function(e){
  if(!e.ctrlKey)return;
  var target=e.target;
  while(target){
    if(target.tagName=='A')break;
    target=target.parentElement;
  }
  target&&GM_openInTab('https://www.mywot.com/scorecard/'+target.hostname),e.preventDefault();
});