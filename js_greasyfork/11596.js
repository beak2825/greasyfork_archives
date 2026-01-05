// ==UserScript==
// @name        Date Fix for Google.ca
// @description Reformat dd/mm/yyyy to yyyy-mm-dd
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD with restriction
// @include     https://www.google.ca/search?*
// @version     0.9.1
// @grant       none
// @resource    mycon http://www.jeffersonscher.com/gm/src/gfrk-DFGca-ver091.png
// @downloadURL https://update.greasyfork.org/scripts/11596/Date%20Fix%20for%20Googleca.user.js
// @updateURL https://update.greasyfork.org/scripts/11596/Date%20Fix%20for%20Googleca.meta.js
// ==/UserScript==

// List of labels on the submit button that indicate a date fix is needed. Please edit as needed.
var flipFor = ["Aller"]; // Separate with commas, e.g., ["apple","banana","carambola"]; case sensitive

// Add MutationObserver to catch dynamic generation of dialog
var DFGca_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
if (DFGca_MutOb){
  var DFGca_chgMon = new DFGca_MutOb(function(mutationSet){
    mutationSet.forEach(function(mutation){
      for (var i=0; i<mutation.addedNodes.length; i++){
        if (mutation.addedNodes[i].nodeType == 1){
          DFGca_checkNode(mutation.addedNodes[i]);
        }
      }
    });
  });
  // attach chgMon to document.body
  var opts = {childList: true, subtree: true};
  DFGca_chgMon.observe(document.body, opts);
}
// Check added element for date picker dialog
function DFGca_checkNode(el){
  var btnsubmit = el.querySelector('input.cdr_go');
  if (btnsubmit){
    if (btnsubmit.type == "submit" && flipFor.indexOf(btnsubmit.value) > -1){
      btnsubmit.addEventListener("mouseover", DFGca_fixDates, false);
    }
  }
}
function DFGca_fixDates(e){
  document.getElementById("cdr_min").value = DFGca_flipDate(document.getElementById("cdr_min").value);
  document.getElementById("cdr_max").value = DFGca_flipDate(document.getElementById("cdr_max").value);
}
function DFGca_flipDate(inpVal){
  var dparts = inpVal.split("/");
  if (dparts.length != 3) return inpVal; // return the original value
  // reverse the order of the parts and separate with - characters
  return dparts[2] + "-" + dparts[1] + "-" + dparts[0];
}
/*
Copyright (c) 2015 Jefferson Scher. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met and subject to the following restriction:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

RESTRICTION: USE WITH ANY @include or @match THAT COVERS FACEBOOK.COM IS PROHIBITED AND UNLICENSED.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/