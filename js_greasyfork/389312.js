// ==UserScript==
// @name         For 100quan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jf365.boc.cn/BOCCMALL_M/cartGoPay.do?theCheckbox1=1000111073*
//https://jf365.boc.cn/BOCCMALL_M/cartGoPay.do?theCheckbox1=1000111073*   theCheckbox1=1000111069
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389312/For%20100quan.user.js
// @updateURL https://update.greasyfork.org/scripts/389312/For%20100quan.meta.js
// ==/UserScript==
~function (global) {
   //style
function sub(){
document.getElementById("checkpoint").click();
}

setTimeout(sub,300);


  //加入function
/**  var scriptE = document.createElement("script");
scriptE.setAttribute("type","text/javascript");
scriptE.innerHTML = scriptContent;
document.getElementById("toolbar").appendChild(scriptE);



var aa="function (){ alert('test');}";
  var scriptA = document.createElement("script");
scriptA.setAttribute("type","text/javascript");
scriptA.innerHTML = aa;
document.body.appendChild(scriptA);
**/




}(window);