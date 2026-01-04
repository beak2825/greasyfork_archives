// ==UserScript==
// @name        Nombre de messages par jour
// @author      samsamdu44
// @description Ce script permet de visualiser sur la cdv le nombre moyen de messages postés par un membre du site jeuxvideos.com 
// @namespace   ?
// @include     http://www.jeuxvideo.com/profil/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33717/Nombre%20de%20messages%20par%20jour.user.js
// @updateURL https://update.greasyfork.org/scripts/33717/Nombre%20de%20messages%20par%20jour.meta.js
// ==/UserScript==

//todolist : 
//  -éffecrure les calculs et les afficher

// Boucle principale
for (i = 0; i < 10; i++) {
  if(document.getElementsByClassName("info-value")[i]) {
    
    // Récupération des données (nombres de jours)
    if (document.getElementsByClassName("info-value")[i].innerText.indexOf("jours") != -1 ) {
      var nbreJour = document.getElementsByClassName("info-value")[i].innerText.slice(document.getElementsByClassName("info-value")[i].innerText.lastIndexOf("("), -7);
      if (document.getElementsByClassName("info-value")[i].innerText.indexOf(".") != -1 ) {
        var nbreJour = nbreJour.split(".");
        nbreJour = nbreJour[0] + nbreJour[1];
        nbreJour = nbreJour.split("(");
        nbreJour = nbreJour[1];
        console.log(nbreJour);
      }
      
      else {
        nbreJour = nbreJour.split("(");
        nbreJour = nbreJour[1];
        console.log(nbreJour);
      }
    }
    
    // Récupération des données (nombre de messages)
    if(document.getElementsByClassName("info-value")[i].innerText.indexOf("messages") != -1 ) {
      var nbreMsg = document.getElementsByClassName("info-value")[i].innerText.slice(0, -9);
      if (document.getElementsByClassName("info-value")[i].innerText.indexOf(".") != -1 ) {
          var nbreMsg = nbreMsg.split(".");
          nbreMsg =  nbreMsg[0] + nbreMsg[1];
          console.log(nbreMsg);
      }
      
      else {
        console.log(nbreMsg);
      }
    }
  }
}

if (nbreMsg && nbreJour) {
  // Calculs
  var nbreMsgParJour = nbreMsg/nbreJour; 
  var nbreMsgParJour = Math.round(nbreMsgParJour);
  
  var liMsgParJour = document.createElement("li");
  liMsgParJour.setAttribute("class","newli");
  
  var divInfoLib = document.createElement("div");
  divInfoLib.setAttribute("class","info-lib");
  divInfoLib.innerText = "Messages par jour :";
  
  var divInfoValue = document.createElement("div");
  divInfoValue.setAttribute("class","info-value");
  divInfoValue.innerText = ""+nbreMsgParJour+" messages";
  
  document.getElementsByClassName("display-line-lib")[0].appendChild(liMsgParJour);
  document.getElementsByClassName("newli")[0].appendChild(divInfoLib);
  document.getElementsByClassName("newli")[0].appendChild(divInfoValue);


  console.log(nbreMsgParJour);
}