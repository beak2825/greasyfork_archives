// ==UserScript==
// @name         maotai autoaccess
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393174/maotai%20autoaccess.user.js
// @updateURL https://update.greasyfork.org/scripts/393174/maotai%20autoaccess.meta.js
// ==/UserScript==

   var loginBtn = document.getElementById("am-modal-ok");
loginBtn.click();
setTimeout(myfunc, 1000);
function myfunc(){
document.body.children[7].style.display='none';
   document.body.children[8].style.display='none';
}
setTimeout(myfunc1,1000);
function myfunc1(){
var sendCode=document.getElementById("btnSendCode");
sendCode.click();
}