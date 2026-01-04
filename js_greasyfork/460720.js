// ==UserScript==
// @name     Abilita la ricerca da cellulare su MeteoAM
// @name:it     Abilita la ricerca da cellulare su MeteoAM
// @description Soluzione al bug per cui è impossibile digitare nella barra di ricerca da un browser mobile con alcune tastiere virtuali.
// @description:it Soluzione al bug per cui è impossibile digitare nella barra di ricerca da un browser mobile con alcune tastiere virtuali.
// @namespace StephenP
// @author   StephenP
// @version  1.1
// @grant    none
// @match    https://www-static.meteoam.it/maps/index.html
// @license  AGPL-3.0-or-later
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/460720/Abilita%20la%20ricerca%20da%20cellulare%20su%20MeteoAM.user.js
// @updateURL https://update.greasyfork.org/scripts/460720/Abilita%20la%20ricerca%20da%20cellulare%20su%20MeteoAM.meta.js
// ==/UserScript==
var isSearchActive=false;
var mapClickListener;
document.getElementsByClassName("barbtnsearch")[0].addEventListener('click',searchIsActive);
window.addEventListener('resize',callback);
function searchIsActive(){
  isSearchActive=true;
  if(!mapClickListener){
  	mapClickListener=document.getElementById("mapid").addEventListener('click',checkSearchStatus);
  }
}
function checkSearchStatus(){
  if(isSearchActive){
    isSearchActive=false;
  }
}
function callback(e){
  if(isSearchActive){    
    document.getElementById("location_search").style.display="inherit";
    document.getElementById("info_rightpanel").style.display="inherit";
  }
}