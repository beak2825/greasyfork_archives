// ==UserScript==
// @name     Rimuovi elementi venduti da Subito.it
// @description Rimuove dall'elenco degli oggetti cercati quelli già venduti, che è inutile mostrare perché ovviamente non possono essere acquistati. Funziona sia con la versione desktop che mobile del sito.
// @version  2.0.1
// @grant    none
// @author   StephenP
// @namespace    StephenP
// @license  AGPL-3.0
// @match    https://www.subito.it/*
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/445012/Rimuovi%20elementi%20venduti%20da%20Subitoit.user.js
// @updateURL https://update.greasyfork.org/scripts/445012/Rimuovi%20elementi%20venduti%20da%20Subitoit.meta.js
// ==/UserScript==
setInterval(checkItems,1000);
function checkItems(){
  let sold=document.getElementsByClassName("item-sold-badge");
  if(sold){
    for(let s of sold){
      while(!s.className.includes("item-card")){
        s=s.parentNode;
      }
      s.remove();
    }
  }
}


