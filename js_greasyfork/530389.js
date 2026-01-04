// ==UserScript==
// @name         DC - DeckExportData
// @namespace    http://tampermonkey.net/
// @version      1.1.0.Alpha
// @description  Permet de copier les données du deck
// @author       Mochizuki Kaneda Dii Amane [Amane-Mochizuki]
// @match        https://www.dreadcast.net/Main
// @match        https://dev.dreadcast.eu/Main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreadcast.net
// @grant        none
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/530389/DC%20-%20DeckExportData.user.js
// @updateURL https://update.greasyfork.org/scripts/530389/DC%20-%20DeckExportData.meta.js
// ==/UserScript==

// CC-BY-NC-SA-4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/


// Changelog 1.1.0.Alpha
// - réécriture du code pour éclater en sous fonction (permet de créer par la suite des commandes customs.
// - ajout de la structure pour permettre la création de fonctions de traitement personalisés.
// - Ajout commande "help exportdata" qui fournis une aide d'utilisation
// - Ajout commande "exportdata -c" qui copie les données de manière automatique sans pop up
// - modification comportement exportdata : remplacement du alert par un confirm avec un choix de copier ou non le contenu dans la popup. // Correction pour chrome, merci @Pelagia pour le signalement
// - ajout de module possible pour écrire la dernière commande passé et le resultat dans le deck. // parfois bug et fait une duplication du contexte quand l'exécution est trop rapide :/



var version = "1.1.0.Alpha"

var Global_DeckActif = false
var process = false

$(document).ajaxSuccess(function (e, xhr, opt) {
    if (document.getElementsByClassName("deck_main") != null && Global_DeckActif == false )
    {
        // alert("deck actif")
        console.log("deck : actif")
        Global_DeckActif = true

    }
  });

$(document).ajaxSuccess(function (e, xhr, opt) {
    if (document.getElementsByClassName("deck_main") == null && Global_DeckActif == true )
    {
        console.log("deck : fermé")
        Global_DeckActif = false
    }
  });

$(document).on("keydown", ".ligne_ecriture .texte:enabled", function (event) {
  if (event.key === "Enter") {

      process = false
      event.preventDefault();

      var context = document.querySelector(".ligne_ecriture .contexte")
      var command = document.querySelector(".ligne_ecriture .texte:enabled")


      console.log("commande détectée : " + context.textContent + command.value );
      // Select command

      var result = ""

      switch (command.value) {
        case "exportdata":
           result = exportdata(false);
           process = true;
           break;
        case "exportdata -c":
           result = exportdata(true);
           process = true;
           break;
        case "help exportdata":
           result = displayhelp();
           process = true;
           break;
        default:
           process = false; //  si aucune correspondance, on ne fait rien
      }
      // Select Result
      if (process == true){
         SystemPrintResult(context.textContent, command.value, result)
         command.value = ""
      }
  }
});

function exportdata(Silent)
{
   var log = SystemGetBuffer()
   var result = ""
   var copy = false

   if (Silent == true)
   {
       copy = true
   }
   else
   {
      copy = confirm(log + "\n-------------------\nCliquez sur OK pour copier dans le presse-papier, sinon annuler pour fermer")
   }

   if (copy == true)
   {
       try
       {
          navigator.clipboard.writeText(log)
          result = "Données copiés avec succès."
       }
       catch (err)
       {
          result = "Échec de la copie : "+ err
       }
   }
   else
   {
       result = "Copie annulée par l'utilisateur."
   }
   return result
}

function displayhelp()
{
   var result = `<span class="couleur_jaune"><strong>exportdata [-c] [Arguments]</strong> : </span><br />
   Affiche et permet l'export (copie) des données du deck pour traitement externe<br />
   Options : <br />
   &nbsp -c : <span style="color:#888;">Copie directement les données sans les afficher pour traitement externe</span><br />
   Arguments : <br />
   &nbsp à venir : <span style="color:#888;">développement en cours...</span><br />
   `
   return result
}

function SystemGetBuffer()
{

   var buffer = ""
   var zoneEcrite = document.querySelector(".zone_ecrit"); // Sélectionne la div principale
     if (!zoneEcrite) {
        console.log("Aucune zone_ecrite trouvée.");
        buffer = ""
     }
     else
     {
         var nbResultat = 0, nbContexte = 0, nbInput = 0

         // Convertir en tableau et parcourir les enfants
         Array.from(zoneEcrite.children).forEach(element => {
         if (element.classList.contains("ligne_resultat_fixed")) {
              buffer += element.innerHTML + "\n";
              nbResultat++;
         }
         if (element.classList.contains("ligne_ecrite_fixed")) {
             

             var contexte = element.querySelector("span.contexte")
             if (contexte) {
                buffer += contexte.textContent + " " // Ajoute le texte du span
                 nbContexte++;
             }

             // Récupérer la valeur de l'input.texte s'il existe
             var input = element.querySelector("input.texte")
             if (input) {
                 buffer += input.value + "\n" // Ajoute la valeur de l'input
                 nbInput++;
             }
          }
      });

         // Affichage des résultats
         console.log("Nombre de .ligne_ecrite_fixed:", nbContexte);
         console.log("Nombre de <input type='text'>:", nbInput);
         console.log("Nombre de .ligne_resultat_fixed:", nbResultat);


            buffer = buffer.replaceAll("<br>", "\n")
            buffer = buffer.replace(/<[^>]*>/g, "");
         console.log("Contenu du buffer :", buffer);


    }
    return buffer
}

function SystemPrintResult(context, cmd, result) {
    let zoneEcrit = document.querySelector(".zone_ecrit");

    if (zoneEcrit) {
        // Créer la première div
        let ligneEcrite = document.createElement("div");
        ligneEcrite.className = "ligne_ecrite_fixed";
        ligneEcrite.innerHTML = `
            <span class="contexte">${context}</span>
            <input type="text" disabled="disabled" class="texte" value="${cmd}" style="color: rgb(255, 255, 255); border: 0px; background: 0px center; cursor: auto;">
        `;

        // Créer la seconde div
        let ligneResultat = document.createElement("div");
        ligneResultat.className = "ligne_resultat_fixed";
        ligneResultat.innerHTML = result ;

        // Ajouter les nouvelles divs à la zone_ecrit
        zoneEcrit.appendChild(ligneEcrite);
        zoneEcrit.appendChild(ligneResultat);
    }
}