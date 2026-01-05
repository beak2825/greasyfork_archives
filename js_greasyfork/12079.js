// ==UserScript==
// @name        Outlook People Show Missing Details (Aug 2015)
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description Make embedded information visible
// @include     https://people.live.com/*
// @version     0.9
// @grant       none
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD 3-clause
// @downloadURL https://update.greasyfork.org/scripts/12079/Outlook%20People%20Show%20Missing%20Details%20%28Aug%202015%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12079/Outlook%20People%20Show%20Missing%20Details%20%28Aug%202015%29.meta.js
// ==/UserScript==

function OPeep_fixBlankFields(el){
  var flds=el.querySelectorAll('#basicView div[id^=fld_],#detailsView div[id^=fld_]');
  for(var i=0;i<flds.length;i++){
    var dtl=document.getElementById(flds[i].id.replace('fld_','fldv_'));
    if(dtl){
      if(dtl.innerHTML=='' && dtl.hasAttribute('aria-label')){
        var lbl=document.getElementById(flds[i].id.replace('fld_','fldt_'));
        if(lbl){
          dtl.innerHTML=dtl.getAttribute('aria-label').substr(lbl.textContent.length+1);
        } else{
          dtl.innerHTML=dtl.getAttribute('aria-label');
        }
      }
    }
  }
}

// Add MutationObserver to catch content added dynamically 
function OPeep_addObserver(){
  // attach chgMon to right side of People page
  var dtlpanel = document.getElementsByClassName("ContactsDetailsArea")[0];
  if (dtlpanel){
    console.log("Adding observer");
    var OPeep_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
    if (OPeep_MutOb){
      var OPeep_chgMon = new OPeep_MutOb(function(mutationSet){
        mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
          OPeep_fixBlankFields(mutation.addedNodes[i]);
          }
        }
        });
      });
      var opts = {childList: true, subtree: true};
      OPeep_chgMon.observe(dtlpanel, opts);
    }
  } else {
    window.setTimeout(OPeep_addObserver, 500);
  }
}
window.setTimeout(OPeep_addObserver, 500);
