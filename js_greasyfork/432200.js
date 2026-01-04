// ==UserScript==
// @name        Whatsapp Web Auto Sender
// @namespace   https://www.in4sser.com
// @match       *://web.whatsapp.com/*
// @grant       window.close
// @version     1.5
// @author      iN4sser
// @description 3/12/2020, 12:29:32 PM
// @downloadURL https://update.greasyfork.org/scripts/432200/Whatsapp%20Web%20Auto%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/432200/Whatsapp%20Web%20Auto%20Sender.meta.js
// ==/UserScript==
window.onload=function(){

  setInterval(autoClick,100);

}
function autoClick(){   
  document.getElementsByClassName('_4sWnG')[0].click();
  setTimeout(window.close,5000);
}