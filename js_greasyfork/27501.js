// ==UserScript==
// @name         DPS counter test
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Y, u to clear
// @author       meatman2tasty
// @match        http://karnage.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27501/DPS%20counter%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/27501/DPS%20counter%20test.meta.js
// ==/UserScript==

function code(){
document.getElementById("ipCode").remove();
 var ip = document.createElement("p");
  ip.id = "ipCode";
  ip.style.padding = "5px";
  ip.style.font = "16px Arial";
  ip.style.display = "block";
  ip.style.position = "fixed";
  ip.style.top = "-17px";
  ip.style.left = "0px";
  ip.textContent = ammoDisplay.innerText;
  document.body.appendChild(ip);
}

$("#cvs").keydown(function(key){
      if(key.which == 89)
      {
 var ip = document.createElement("p");
  ip.id = "ipCode";
  ip.style.padding = "5px";
  ip.style.font = "16px Arial";
  ip.style.display = "block";
  ip.style.position = "fixed";
  ip.style.top = "-17px";
  ip.style.left = "0px";
  ip.textContent = ammoDisplay.innerText;
  document.body.appendChild(ip);
      }
});

$("#cvs").keydown(function(key){
      if(key.which == 85)
      {
document.getElementById("ipCode").remove();
clearInterval(int);
      }
});
var info = document.createElement("p");
info.setAttribute("value", "Spin!");
info.setAttribute("style", "margin-top:3px;font-weight: bold;color: #585858;");
info.innerHTML = "Press Y to refresh IP.";
var append1 = document.getElementById("charSpray");
append1.appendChild(info);

var int = setInterval(code, 100);