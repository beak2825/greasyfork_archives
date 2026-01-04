// ==UserScript==
// @name        Moyenne e-lyco
// @namespace   ?
// @description Affiche la moyenne générale de l'utilisateur et celle de la classe
// @include     http://st-joseph-ancenis.loire-atlantique.e-lyco.fr/*
// @include     https://0441928g.e-lyco.fr/*
// @match       http://st-joseph-ancenis.loire-atlantique.e-lyco.fr/*
// @match       https://0441928g.e-lyco.fr/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35767/Moyenne%20e-lyco.user.js
// @updateURL https://update.greasyfork.org/scripts/35767/Moyenne%20e-lyco.meta.js
// ==/UserScript==

// Attendre le chargement total de la page
setTimeout(function() {
  
// Moyenne Eleve
var noteFinale = 0;
var i = 0;
var mat = 0;
  
try {
  while (document.getElementsByClassName("yui-dt-liner bulletin-note bulletin-note-eleve")[i].innerText !== null) { // Erreur "TypeError" pour stopper la boucle
    var note = document.getElementsByClassName("yui-dt-liner bulletin-note bulletin-note-eleve")[i].innerText;
    if (document.getElementsByClassName("yui-dt-liner bulletin-note bulletin-note-eleve")[i].innerText == "") {
      note = 0;
      mat -= 1;
    }
    else {
    	note = note.replace(",","."); // Bidouillage de la note
    	note = parseFloat(note);
    	noteFinale = noteFinale + note;
    }
    i++;
    mat++;
  }
}

catch (err) {
  console.log("Totale note éléve : "+noteFinale);
  console.log("Nombre de matière : "+mat);
}
  
var noteFinale = noteFinale/mat;
noteFinale = noteFinale.toPrecision(4);
noteFinale = noteFinale.toString();
noteFinale = noteFinale.replace(".",","); // Rebidouillage 

// Moyenne classe (même fonctionnement que pour la moyenne élève)
var noteFinaleClasse = 0;
var i = 1; // A cause du NaN du "Moy." au début
var mat = 0;
  
try {
  while (document.getElementsByClassName("yui-dt0-col-moyenneClasse yui-dt-col-moyenneClasse")[i].innerText !== null) {
    var note = document.getElementsByClassName("yui-dt0-col-moyenneClasse yui-dt-col-moyenneClasse")[i].innerText;
    if (document.getElementsByClassName("yui-dt0-col-moyenneClasse yui-dt-col-moyenneClasse")[i].innerText == "") {
      note = 0;
      mat -= 1;
    }
    else {
    	note = note.replace(",",".");
    	note = parseFloat(note);
    	noteFinaleClasse = noteFinaleClasse + note;
    }
    i++;
    mat++;
  }
}

catch (err) {
  console.log("Totale note classe : "+noteFinaleClasse);
  console.log("Nombre de matière pour classe : "+mat);
}
  
noteFinaleClasse = noteFinaleClasse/mat;
noteFinaleClasse = noteFinaleClasse.toPrecision(4);
noteFinaleClasse = noteFinaleClasse.toString();
noteFinaleClasse = noteFinaleClasse.replace(".",",");

console.log("Moyenne eleve : " +noteFinale);
console.log("Moyenne classe : "+noteFinaleClasse);
 
// Récupération de la base de données
var http = new XMLHttpRequest();
var url = "http://samsamdu44.000webhostapp.com/script/moyennes.txt";
http.open("GET", url, false); 
http.send(null);
 
// Bidouillage et Parsing 
var database = http.responseText;
console.log(database);
  

var user = document.getElementsByClassName("user")[0].innerText;
user = user.substring(0, user.indexOf("Se déco") - 1);
user = btoa(user); // Faut bien attribuer un id à chaque moyenne
console.log("Id de l'élève : "+user);
  
// Dernière moyenne ajouté
var dernierMoy = database.lastIndexOf(user);
dernierMoy = database.split("?")[dernierMoy+1];
  
console.log("Dernière moyenne envoyée : "+dernierMoy);

// Envoi de la moyenne à la base de données (ou pas)
if (database.indexOf(user) == -1) { // Si la moyenne n'existe pas ou 
  
	var data = user+"?"+noteFinale+"?";

  // Envoi des données
	var http = new XMLHttpRequest();
	var url = "https://samsamdu44.000webhostapp.com/script/elyco.php";
	var params = "data="+data;
  
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
	http.onreadystatechange = function() {
	  if (http.readyState == 4 && http.status == 200) {
  	    console.log("Moyenne rajouté à la base de données avec succès !"); // Message de confirmation
 	  }
	}
	http.send(params);
}

else if (database.indexOf(user)) { // Si la moyenne est déjà dans la bdd et est actualisé
  console.log("La moyenne à déja été rajouté à la base de données.");
}
// Calcul de la position
  
// Affichage des calculs
var moyenneEleveTr = document.createElement("tr");
moyenneEleveTr.setAttribute("class", "yui-dt-odd");
moyenneEleveTr.setAttribute("id", "yui-rec11");
moyenneEleveTr.setAttribute("style", "background-color: #f4f4f4;");
document.getElementsByClassName("yui-dt-data")[0].appendChild(moyenneEleveTr);

var moyenneEleveTd = document.createElement("td");
moyenneEleveTd.setAttribute("id","moyenneEleveTd");
moyenneEleveTd.setAttribute("class","yui-dt0-col-matiere yui-dt-col-matiere yui-dt-sortable yui-dt-first");
moyenneEleveTd.setAttribute("style","width:171px; height: 48.4px;");
document.getElementById("yui-rec11").appendChild(moyenneEleveTd);
  
var moyenneEleveDiv = document.createElement("div");
moyenneEleveDiv.innerText = "MOYENNES GÉNÉRALES";
moyenneEleveDiv.setAttribute("style","margin: 11px;font-weight: bold;");
document.getElementById("moyenneEleveTd").appendChild(moyenneEleveDiv);
  
var moyenneEleveAffTd = document.createElement("td");
moyenneEleveAffTd.setAttribute("id","moyenneEleveAffTd");
moyenneEleveAffTd.setAttribute("class","yui-dt0-col-moyenneEleve yui-dt-col-moyenneEleve yui-dt-sortable");
document.getElementById("yui-rec11").appendChild(moyenneEleveAffTd);
  
var moyenneEleveAffDiv = document.createElement("div");
moyenneEleveAffDiv.innerText = noteFinale;
moyenneEleveAffDiv.setAttribute("style","font-weight: bold;position: relative;left: 15px;");
document.getElementById("moyenneEleveAffTd").appendChild(moyenneEleveAffDiv);

var moyenneClasseAffTd = document.createElement("td");
moyenneClasseAffTd.setAttribute("id","moyenneClasseAffTd");
moyenneClasseAffTd.setAttribute("class","yui-dt0-col-moyenneClasse yui-dt-col-moyenneClasse");
moyenneClasseAffTd.setAttribute("style","position: relative; left: 50px; background-color: #f4f4f4; font-weight: bold;");
document.getElementById("yui-rec11").appendChild(moyenneClasseAffTd);

var moyenneClasseAffDiv = document.createElement("div");
moyenneClasseAffDiv.innerText = noteFinaleClasse;
moyenneClasseAffDiv.setAttribute("style","left: 15px;position: relative; width: ");
document.getElementById("moyenneClasseAffTd").appendChild(moyenneClasseAffDiv);
}, 1500);