// ==UserScript==
// @name        EcoleDirecte - Carnet de notes
// @namespace   Violentmonkey Scripts
// @match       https://www.ecoledirecte.com/CarnetDeNotes*
// @version     1.19
// @author      OB - Education Nationale / Académie de Bordeaux - FRANCE
// @icon        https://www.ecoledirecte.com/assets/images/logoEcoleDirecte.png
// @grant       GM_addStyle
// @run-at      document-end
// @description Numérotation de la liste des élèves sur la page 'Carnet de notes'
// @project     https://greasyfork.org/fr/scripts/461620-ecoledirecte-carnet-de-notes
// @license     MIT
// @date        26/04/2023 - 26/11/2025
// @downloadURL https://update.greasyfork.org/scripts/461620/EcoleDirecte%20-%20Carnet%20de%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/461620/EcoleDirecte%20-%20Carnet%20de%20notes.meta.js
// ==/UserScript==

GM_addStyle(".numbers{background-color: rgb(255, 255, 128);}");

function ConsolePrint(message)
{
  var startTime = new Date();
  console.log('[ED-Tools] '+ startTime.toLocaleTimeString() + ' ' + message) ;
}

ConsolePrint('RUN');

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function SetStudentsNumbers(classname, URL = "ALL") {
  var index = 1;
  var success = 0;
  var lastname = "";

  ConsolePrint("SetStudentsNumbers search class [" + classname + "] in [" + URL + "]");

  names = document.getElementsByClassName(classname)
  for (var i = 0; i < names.length; i++)
  {
    name = names[i].innerText;
    if( !isNumeric(name[0]) && name.length != 0 && name != lastname)
    {
      ConsolePrint("SetStudentsNumbers IN [" + classname + "] FOUNDED [" + name + "] INDEX " + index + " from classname ["+classname+"]");
      code = names[i].innerHTML.replace("&nbsp; ","");
      names[i].innerHTML = "<span class='numbers'>" + ('0000'+index).slice(-2) + "</span>&nbsp;" + code;
      lastname = name;
      index++;
      success++;
    }
  }

return(success);
}

var global_lastname = "";

function SetConseilDeClasse()
{
     /* Ne fonctionne pas (Ajax) SetStudentsNumbers("nom-eleve");  // Conseil de classe  : class="nom-eleve selected" */
    /* La liste est dans un ul de class "ng-star-inserted" */

    var lis = document.getElementsByClassName("nav-stacked") // .getElementsByTagName("li");
    for (var i = 0; i < lis.length; ++i) {
    // do something with items[i], which is a <li> element
      // A suivre
      ConsolePrint("nav-stacked ->"+lis[i]);
    }

    names = document.getElementsByClassName("nom-eleve");
    for (var i = 0; i < names.length; i++)
    {
      name = names[i].innerText;
      if( name.length > 1 && name != global_lastname )
      {
        ConsolePrint("CONSEIL DE CLASSE DE [" + name+"]");
        global_lastname = name;
      }
    }
}

function SearchStudentsList() {

  /* Liste des notes
  if ( window.location.href.indexOf("CarnetDeNotes/notes") > -1) {
    SetStudentsNumbers("open-eleve");
  }
 */

  if ( window.location.href.match("CarnetDeNotes/notes")) {
    SetStudentsNumbers("open-eleve", "CarnetDeNotes/notes");
  }

  /* Liste des appréciations */
  else if ( window.location.href.match("CarnetDeNotes/appreciations")) {
    SetStudentsNumbers("nom-eleve margin-whitespace", "CarnetDeNotes/appreciations");
  }

  /* Liste des compétences */
  else if ( window.location.href.match("CarnetDeNotes/competencesLSU")) {
    /* SetStudentsNumbers("nom-eleve cliquable"); changé */
    SetStudentsNumbers("nom-eleve margin-whitespace", "CarnetDeNotes/competencesLSU")
  }

  /*  Liste des composantes */
  else if (window.location.href.match("CarnetDeNotes/composantes")) {
    SetStudentsNumbers("nom-eleve margin-whitespace", "CarnetDeNotes/composantes");
  }

  /* Conseil de classe (not used, URL do not match yet, see @match)
  else if ( window.location.href.match("ConseilDeClasse") != null ) {
    SetConseilDeClasse();
  }  */
}

/* Application */
if (self == top) { /* run only in the top frame. we do our own frame parsing */
  ConsolePrint('STARTED');
  setInterval(SearchStudentsList, 3000);
}
