// ==UserScript==
// @name     Rimuovi elementi in vendita tramite un'agenzia o un rivenditore da Subito.it
// @description Rimuove dall'elenco degli oggetti cercati quelli venduti da agenzie/rivenditori, per mostrare gli oggetti caricati solo da utenti. Funziona sia con la versione desktop che mobile del sito.
// @version  1.0
// @grant    none
// @author   wakimac972
// @namespace    wakimac972
// @license  AGPL-3.0
// @match    https://www.subito.it/*
// @downloadURL https://update.greasyfork.org/scripts/483459/Rimuovi%20elementi%20in%20vendita%20tramite%20un%27agenzia%20o%20un%20rivenditore%20da%20Subitoit.user.js
// @updateURL https://update.greasyfork.org/scripts/483459/Rimuovi%20elementi%20in%20vendita%20tramite%20un%27agenzia%20o%20un%20rivenditore%20da%20Subitoit.meta.js
// ==/UserScript==
setInterval(checkItems,1000);
function checkItems(){
  let sold=document.getElementsByClassName("index-module_shop-type__iKbhv");
  if(sold){
    for(let s of sold){
      while(!s.className.includes("item-card")){
        s=s.parentNode;
      }
      s.remove();
    }
  }
}


