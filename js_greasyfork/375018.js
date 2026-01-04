// ==UserScript==
// @name     Heure Emploi du temps
// @match        https://proseconsult.umontpellier.fr/direct/*
// @description  Script pour ajouter l'heure au planning
// @version  1
// @grant    none
// @namespace https://greasyfork.org/users/229557
// @downloadURL https://update.greasyfork.org/scripts/375018/Heure%20Emploi%20du%20temps.user.js
// @updateURL https://update.greasyfork.org/scripts/375018/Heure%20Emploi%20du%20temps.meta.js
// ==/UserScript==



var intervalID = window.setInterval(isPageLoaded,4000);


function isPageLoaded() {
  if(document.getElementsByClassName("eventText").length > 3) {
    clearInterval(intervalID);
    cbPageLoaded();    
  }
}
function cbPageLoaded() {
  
  var stride = document.getElementsByClassName("slot").length > 15 ? 2 : 1;
  var nbPix = parseInt(document.getElementsByClassName("slot")[2].style.top,10) -
      				parseInt(document.getElementsByClassName("slot")[1].style.top,10);
	var slots = document.getElementsByClassName("eventText");

	for(var i=0;i<slots.length;i++) {
    if(slots[i].tagName == "DIV") {
      
      var heure = document.createTextNode(truncTime(parseInt(slots[i].parentNode.parentNode.style.top,10)/(stride*nbPix)+7.5));
      slots[i].insertBefore(heure,slots[i].firstChild);
    }
	}
}
function truncTime(time) {
  var min = parseInt(((time-Math.trunc(time))/100*60)*100);
  var heure = Math.trunc(time);
  if(min>49) {
    min=0;
    heure++;
  }
  else if(min>34)
    min=45;
  else if(min>19)
    min=30;
   else if(min>4)
     min=15;
  return ""+heure+"h"+min+" ";
}




















