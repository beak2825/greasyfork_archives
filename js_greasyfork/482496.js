// ==UserScript==
// @name        Autoban & delete comments from that Chinese spammer
// @namespace   StephenP
// @match       https://greasyfork.org/*/reports
// @match       https://greasyfork.org/reports
// @grant       none
// @version     1.4
// @author      StephenP
// @run-at      document-end
// @description 17/12/2023, 13:55:42
// @downloadURL https://update.greasyfork.org/scripts/482496/Autoban%20%20delete%20comments%20from%20that%20Chinese%20spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/482496/Autoban%20%20delete%20comments%20from%20that%20Chinese%20spammer.meta.js
// ==/UserScript==
const spamSite=/\.zrnq\.one|gmackm\.top|ackmkm\.top|gmkm\.acchenyy\.fun/g;
var reports=document.getElementsByClassName("report-list-item");
for(let r of reports){
  if((r.textContent.includes("rainman"))||(r.textContent.includes("akismet"))){
    let usersQuotes=r.getElementsByClassName("user-content");
    if(usersQuotes.length>0){
      console.log(usersQuotes[0].innerHTML);
      if(usersQuotes[0].innerHTML.match(spamSite)){
        if(usersQuotes[0].innerHTML.match(spamSite).length>1){//only checks if the site is written multiple times, to prevent false positives
          r.querySelector("input[id^=delete-comments]").checked=true;
          r.querySelector("input[id^=ban]").checked=true;
          r.querySelector("input[name=nuke]").click();
          break;
        }
      }
    }
  }
}
