// ==UserScript==
// @name        First derivative script
// @namespace   StephenP
// @match       https://greasyfork.org/*/scripts/*/derivatives*
// @grant       none
// @version     1.0
// @author      StephenP
// @description Highlight the first derivative script
// @downloadURL https://update.greasyfork.org/scripts/496790/First%20derivative%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/496790/First%20derivative%20script.meta.js
// ==/UserScript==
var links=document.body.querySelectorAll("a[href$=\"#script-comparison\"");
var firstScript;
var scriptId=0;
for(let l of links){
  let thisScriptId=parseInt(l.href.split("scripts%2F")[1].split("-")[0]);
  if((scriptId==0)||(thisScriptId<scriptId)){
    firstScript=l.parentNode;
    scriptId=thisScriptId;
  }
}
firstScript.style.backgroundColor="#99FF99";