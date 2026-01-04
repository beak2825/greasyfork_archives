// ==UserScript==
// @name        Autoban spam scripts by description
// @namespace   StephenP
// @match       https://greasyfork.org/*/scripts/*
// @match       https://greasyfork.org/*/users/*/ban
// @exclude     https://greasyfork.org/*/scripts/505090-*
// @grant       none
// @version     1.4.7
// @author      StephenP
// @description Autoban spam scripts (and their author) by checking their description for spam content
// @downloadURL https://update.greasyfork.org/scripts/498898/Autoban%20spam%20scripts%20by%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/498898/Autoban%20spam%20scripts%20by%20description.meta.js
// ==/UserScript==
if(document.location.href.includes("#autobanSpammer")){
  document.getElementById("reason").value="spam";
  document.getElementById("delete_type_redirect").click();
  document.getElementById("banned").click();
document.getElementById("replaced_by_script_id").value="https://greasyfork.org/scripts/499424";
  document.body.querySelector("[value=Delete]").click();
}
else if(document.location.href.includes("/scripts/")){
  const spamSite=/hj\.hbyvipxnzj\.buzz|hj.rainyun.click|\.oeza.top|hbyvipxnzj\.buzz|hjs8\.top|hj588\.top|hjv58\.top|79565271@qq\.com/g;
  const title=document.body.getElementsByTagName("h2");
  const aI=document.getElementById("additional-info");
  const sD=document.getElementById("script-description");
  if(aI){
    if(aI.textContent.match(spamSite)){
      document.location.href=document.location.href+"/delete#autobanSpammer";
    }
  }
  if(sD){
    if(sD.textContent.match(spamSite)){
      document.location.href=document.location.href+"/delete#autobanSpammer";
    }
  }
  if(title){
    if(title[0].textContent.match(spamSite)){
      document.location.href=document.location.href+"/delete#autobanSpammer";
    }
  }
}