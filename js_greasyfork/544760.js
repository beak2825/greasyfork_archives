// ==UserScript==
// @name        Hide Adalo banner
// @namespace   StephenP
// @exclude     https://www.adalo.com/*
// @exclude     https://app.adalo.com/*
// @exclude     https://previewer.adalo.com/*
// @exclude     https://help.adalo.com/*
// @exclude     https://appacademy.adalo.com/*
// @exclude     https://info.adalo.com
// @match       https://*.adalo.com/*
// @grant       none
// @version     1.0
// @author      StephenP
// @license     copyleft
// @description Hide the lower Adalo banner when accessing the app.
// @downloadURL https://update.greasyfork.org/scripts/544760/Hide%20Adalo%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/544760/Hide%20Adalo%20banner.meta.js
// ==/UserScript==
var st=document.createElement("STYLE");
st.innerHTML=".web-runtime-footer{display: none};";
document.getElementsByTagName("HEAD")[0].appendChild(st);
let itv=setInterval(removeMargin,500);
function removeMargin(){
  let app=document.querySelector(".app");
  if(app){
    if(app.firstChild.style.marginBottom!==""){
      app.firstChild.style.marginBottom="0";
      clearInterval(itv);
    }
  }
}