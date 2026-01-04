// ==UserScript==
// @name        Barbariam
// @namespace   Ikariam
// @description Fügt Ressourcensumme zur Barbarenansicht hinzu
// @include     /https?:\/\/s[0-9]*-[a-z]{2}\.ikariam\.gameforge\.com\/.*/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/32492/Barbariam.user.js
// @updateURL https://update.greasyfork.org/scripts/32492/Barbariam.meta.js
// ==/UserScript==

//Global variables
var Summe_string = "";
var Summe = 0;

//add event listener to barbarian city image on island-view
document.getElementById("barbarianVillage").addEventListener("click", function(){
  
  setTimeout(function(){
    
// Get resource strings
var Baumaterial = document.getElementById("js_islandBarbarianResourceresource").innerHTML;
var Wein = document.getElementById("js_islandBarbarianResourcetradegood1").innerHTML;
var Marmor = document.getElementById("js_islandBarbarianResourcetradegood2").innerHTML;
var Kristall = document.getElementById("js_islandBarbarianResourcetradegood3").innerHTML;
var Schwefel = document.getElementById("js_islandBarbarianResourcetradegood4").innerHTML;

// Remove dots from string
var Baumaterial_rem = Baumaterial.split('.').join("");
var Wein_rem = Wein.split('.').join("");
var Marmor_rem = Marmor.split('.').join("");
var Kristall_rem = Kristall.split('.').join("");
var Schwefel_rem = Schwefel.split('.').join("");

// Convert string to int
var Baumaterial_conv = parseInt(Baumaterial_rem);
var Wein_conv = parseInt(Wein_rem);
var Marmor_conv = parseInt(Marmor_rem);
var Kristall_conv = parseInt(Kristall_rem);
var Schwefel_conv = parseInt(Schwefel_rem);

//  Calculate sum
    Summe = Baumaterial_conv + Wein_conv + Marmor_conv + Kristall_conv + Schwefel_conv;
    
    Summe_string = '' + Summe;

// Show sum next to barbarian resources
($("div:contains('Lagerbestand:'):last")).append(" " + " (\u03A3 = " + Summe_string + ")");

    
//Barbarian plunder script
        
    //add event listener to barbarian plunder button
    document.getElementById("barbarianActionPlundering").addEventListener("click", function(){
      
     setTimeout(function(){
    
     // Calculate necessary amount of trading ships
     var Schiffe_anzahl = 0;
       
     do {
         Schiffe_anzahl ++;
        }
     while ((Schiffe_anzahl * 500) < Summe);
       
       
     //convert ship int to string
     var Schiffe_anzahl_string = '' + Schiffe_anzahl;
       
     //set free trading ship variable
     var Schiffe_frei = document.getElementById("js_GlobalMenu_freeTransporters").innerHTML;
       
     //Show resource sum and necessary trading ship amount in plunder window header
     $('.content > p').append("<br><br>In diesem Barbarendorf lagern <b>" + Summe_string + "</b> Rohstoffe!<br><br>Benötigte Handelsschiffe: <b>" + Schiffe_anzahl_string + " </b> (Verfügbar: " + Schiffe_frei + ")<br><hr>");
       
       //If player has enough trading ships, set counter to necessary amount

       
       if (Schiffe_anzahl <= parseInt(Schiffe_frei))
         {
           document.getElementById("extraTansporter").value = Schiffe_anzahl_string;
           //$('#extraTransporter').trigger( "keyup" );
         }

    
     }, 500);
});
// End barbarian plunder script
    
    
    }, 500);
});



