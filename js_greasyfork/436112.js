// ==UserScript==
// @name     Polimi Career Service: late subscriptions
// @name:it     Polimi Career Service: iscrizioni tardive
// @description This script enables the event subscription form even if the subscriptions are already closed. There's no warranty that the late subscription will be taken in account, but at least with this script you can try.
// @description:it Questo script abilita il modulo per l'iscrizione agli eventi anche se le iscrizioni sono già chiuse. Non è garantito che le iscrizioni tardive verranno prese in considerazione, ma almeno con questo script ci puoi provare.
// @author   StephenP
// @namespace StephenP
// @version  1.0.0
// @grant    none
// @match    https://www.careerservice.polimi.it/*/Meetings/*
// @contributionURL https://nowpayments.io/donation/stephenpgreasyfork
// @license AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/436112/Polimi%20Career%20Service%3A%20late%20subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/436112/Polimi%20Career%20Service%3A%20late%20subscriptions.meta.js
// ==/UserScript==
var url;
(function(){
  setInterval(checkPageChanged,1000);
})();
function checkPageChanged(){
 if(document.location.href!=url){
   console.log("Changed url from "+url+" to "+document.location.toString());
   url=document.location.href;
   let subscribe=document.getElementById("detail-overlay").querySelector("a.iscriviti");
    if(subscribe){
      if(subscribe.style.display==='none'){
        subscribe.style.display='inherit';
      }
    }
   const config = { attributes: false, childList: true, subtree: true };
   const callback = function(mutationsList, observer) {
     for(const mutation of mutationsList) {
       console.log(mutation);
       let done=false;
       for(const addedNode of mutation.addedNodes){
         subscribe=document.getElementById("detail-overlay").querySelector("a.iscriviti");
         if(subscribe){
           if(subscribe.style.display==='none'){
             subscribe.style.display='inherit';
           }
           done=true;
         }
       }
       if(done){
         break;
       }
     }
   };
   const detailObserver = new MutationObserver(callback);
   detailObserver.observe(document.getElementById("detail-overlay"), config);
 }
}
