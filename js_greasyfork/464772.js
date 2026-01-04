// ==UserScript==
// @name        TEST kobold TEST
// @namespace   InGame
// @include     https://www.dreadcast.net/Main
// @author      Klav
// @version     1.0
// @grant       none
// @description écrire en language kobold.
// @downloadURL https://update.greasyfork.org/scripts/464772/TEST%20kobold%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/464772/TEST%20kobold%20TEST.meta.js
// ==/UserScript==




var TransText = function(e){
    if (e.keyCode==13) {
        var text = $("#chatForm .text_chat").val();
        var re=new RegExp("(/k )","g");
        text =text.toLowerCase()
        if(text.match(re))
           {
               var Result = ''
               var Mot = text.split(" ")
               var NbMot
               var NbTMot = Mot.length
               for (NbMot=1;NbMot<NbTMot;NbMot++)
               {
                   var pasMax = Mot[NbMot].length
                   var pas
                   for (pas=0;pas<pasMax;pas++)
                   {
                       var Ch = Mot[NbMot].charAt(pas)
                       switch (Ch)
                       {

                           case "a":
                               Result += "a";
                               break;
                           case "b":
                               Result += "b";
                               break;
                           case "c":
                               Result += "c";
                               break;
                           case "d":
                               Result += "d";
                               break;
                           case "e":
                               Result += "'";
                               break;
                           case "f":
                               Result += "f";
                               break;
                           case "g":
                               Result += "g";
                               break;
                           case "h":
                               Result += " ";
                               break;
                           case "i":
                               Result += "i";
                               break;
                           case "j":
                               Result += "j";
                               break;
                           case "k":
                               Result += "k";
                               break;
                           case "l":
                               Result += "l";
                               break;
                           case "m":
                               Result += "m";
                               break;
                           case "n":
                               Result += "n";
                               break;
                           case "o":
                               Result += "0";
                               break;
                           case "p":
                               Result += "p";
                               break;
                           case "q":
                               Result += "q";
                               break;
                           case "r":
                               Result += "rr'";
                               break;
                           case "s":
                               Result += "ss'";
                               break;
                           case "t":
                               Result += "t";
                               break;
                           case "u":
                               Result += "u";
                               break;
                           case "v":
                               Result += "v";
                               break;
                           case "w":
                               Result += " ";
                               break;
                           case "x":
                               Result += "x";
                               break;
                           case "y":
                               Result += "ii";
                               break;
                           case "z":
                               Result += "z";
                               break;
                           case "1":
                               Result += "1";
                               break;
                           case "2":
                               Result += "2";
                               break;
                           case "3":
                               Result += "3";
                               break;
                           case "4":
                               Result += "4";
                               break;
                           case "5":
                               Result += "5";
                               break;
                           case "6":
                               Result += "6";
                               break;
                           case "7":
                               Result += "7";
                               break;
                           case "8":
                               Result += "8";
                               break;
                           case "9":
                               Result += "9";
                               break;
                           case "0":
                               Result += "o";
                               break;
                           case "!":
                               Result += "!";
                               break;
                           case "?":
                               Result += "?";
                               break;
                           case "kobold":
                               Result += "kob";
                               break;
                       }
                   }
                   Result += ' ';
               }

               $("#chatForm .text_chat").val(""+Result+"")
           }
    }
}
document.addEventListener('keypress', TransText, false);