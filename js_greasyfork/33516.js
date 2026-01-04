// ==UserScript==
// @name        alice
// @namespace   https://www.studenti.unipi.it/
// @include     https://www.studenti.unipi.it/auth/studente/Libretto/*
// @version     1.1
// @grant       none
// @description compute the weighted average in the alice portal of the university of Pisa
//Developper Roberto Zanaboni
// @downloadURL https://update.greasyfork.org/scripts/33516/alice.user.js
// @updateURL https://update.greasyfork.org/scripts/33516/alice.meta.js
// ==/UserScript==


var input=document.createElement("input");
input.type="button";
input.value="Media Pesata";
input.onclick = apri;
input.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:250px;");

document.body.appendChild(input); 
var blocco1=document.createElement("div");
blocco1.setAttribute("style", "position:absolute;top:100px;right:500px;");
var text1= document.createTextNode("TEST NUOVO VOTO");
document.body.appendChild(blocco1);
blocco1.appendChild(text1); 
var input1=document.createElement("input");
input1.type="text";
input1.value="0";
input1.setAttribute("id", "voto");
input1.setAttribute("style", "font-size:16px;position:absolute;left:140px; width:20px");
blocco1.appendChild(input1); 

var blocco2=document.createElement("div");
blocco2.setAttribute("style", "position:absolute;top:130px;right:500px;");
var text2= document.createTextNode("CREDITI");
blocco2.appendChild(text2); 
document.body.appendChild(blocco2);
var input2=document.createElement("input");
input2.type="text";
input2.value="0";
input2.setAttribute("id", "crediti");
input2.setAttribute("style", "font-size:16px;position:absolute;left:60px; width:20px");
blocco2.appendChild(input2); 
function apri()
{
  var credtot=0; 
   var vottot=0;
   var as = document.getElementsByTagName("tr");
    for(var i=0;i<as.length;i++)  {
     var as1=as[i].getElementsByClassName("detail_table");
       var j=13;
       while(j<as1.length){
  
   var voto  = as1[j].textContent || as1[j].innerText;
   var crediti=  as1[j-3].textContent || as1[j-3].innerText;
          crediti=crediti.slice(0, 2); 
          voto=voto.slice(0, 2); 
          var numero= parseInt(crediti);
           var numero1= parseInt(voto);
          if(!isNaN(numero1)){
          credtot+=numero;
          vottot+=numero1*numero;
          }
        
          j+=8;
    
  }
   }
 
   var nuovo = document.getElementById("crediti");
    var nuovo1 = document.getElementById("voto");
    if(nuovo.value>1 && nuovo.value<30 && nuovo1.value>17 && nuovo.value<35){
    credtot+=parseInt(nuovo.value);
    vottot+=parseInt(nuovo1.value)*nuovo.value;
    }
          window.alert("Media: " + vottot/credtot);
    
    
}