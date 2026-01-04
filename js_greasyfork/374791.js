// ==UserScript==
// @name     Quora: remove sponsored posts
// @namespace    StephenP
// @version      1.4
// @description  Remove sponsored posts that are shown as relevant answers even if they're not.
// @author       StephenP
// @grant    none
// @match        https://*.quora.com/*
// @match        http://*.quora.com/*
// @downloadURL https://update.greasyfork.org/scripts/374791/Quora%3A%20remove%20sponsored%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/374791/Quora%3A%20remove%20sponsored%20posts.meta.js
// ==/UserScript==
(function(){
    sponsorRemover = setInterval(removeSponsor, 1000);
})();
function removeSponsor(){
  try{
    var questionAds=document.getElementsByClassName("question_page_ad");
    if(questionAds.length>0){
      for(var ad of questionAds){
          ad.parentNode.removeChild(ad);
      }
    }
  }
  catch(err){
    console.log(err);
  }
}