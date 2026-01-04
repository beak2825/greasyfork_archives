// ==UserScript==
// @name        Download PreForm without giving out data to Formlabs
// @namespace   StephenP
// @match       https://formlabs.com/*/software/preform/*
// @match       https://formlabs.com/software/preform/*
// @grant       none
// @version     1.0
// @license     copyleft
// @author      StephenP
// @description Allows the download of Preform without compiling the form with personal data
// @downloadURL https://update.greasyfork.org/scripts/511200/Download%20PreForm%20without%20giving%20out%20data%20to%20Formlabs.user.js
// @updateURL https://update.greasyfork.org/scripts/511200/Download%20PreForm%20without%20giving%20out%20data%20to%20Formlabs.meta.js
// ==/UserScript==
const macButtons=document.querySelectorAll(".Button_button__NKkpa.Button_none__YiwlJ.Button_light__heSKx");//MAC
const windowsButtons=document.querySelectorAll(".Button_button__NKkpa.Button_none__YiwlJ.Button_dark__k2aro");//WINDOWS
for(let mb of macButtons){
  let nmb=mb.cloneNode(true);
  nmb.addEventListener("click",function(){document.location.href="https://formlabs.com/download-preform-mac"});
  mb.parentNode.appendChild(nmb);
  mb.style.display="none";
}
for(let wb of windowsButtons){
  let nwb=wb.cloneNode(true);
  nwb.addEventListener("click",function(){document.location.href="https://formlabs.com/download-preform-windows"});
  wb.parentNode.appendChild(nwb);
  wb.style.display="none";
}/*Other method, working but not used right now
var i=setInterval(checkForm,500);

function checkForm(){
  let form=document.getElementById("form_Preform_Download");
  if(form){
    autoDownload(form);
    clearInterval(i);
  }
}
function autoDownload(form){
  const requiredFields=form.querySelectorAll("[required]");
  for(let f of requiredFields){
    f.removeAttribute("required");
  }
  const submitButton=form.querySelector("[type=submit]");
  if(submitButton){
    submitButton.click();
  }
}*/