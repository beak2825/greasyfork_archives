// ==UserScript==
// @name     Foto a risoluzione massima su Subito.it
// @description Osserva le foto a risoluzione massima su Subito.it. Clicca sulla foto per aprirla in una nuova scheda a dimensioni massime.
// @version  1.0.2.1
// @grant    none
// @author   StephenP
// @namespace    StephenP
// @license  AGPL-3.0
// @match    https://www.subito.it/*
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/445750/Foto%20a%20risoluzione%20massima%20su%20Subitoit.user.js
// @updateURL https://update.greasyfork.org/scripts/445750/Foto%20a%20risoluzione%20massima%20su%20Subitoit.meta.js
// ==/UserScript==
const pictures=document.querySelectorAll("[class^=Carousel_image]");
if(pictures){
  for(var picture of pictures){
    picture.addEventListener('click',openPicture);
  }
}
function openPicture(event){
  const src=event.target.getAttribute("src").split("?")[0];
  window.open(src+"?rule=gallery-desktop-4x-auto");
}