// ==UserScript==
// @name        Infos WarRiders
// @include     http://www.war-riders.de/*/*/details/player/*
// @include     http://www.war-riders.de/*/*/details/ally/*
// @include     http://www.war-riders.de/?lang=*&uni=*&type=player&name=*
// @include    	http://www.war-riders.de/?lang=*&uni=*&page=compare*&*
// @description	Affiche des informations complémentaires dans WarRiders
// @namespace   ogame
// @version     2.2
// @grant       none
// @author     	Nitneuc -- Libre d'être modifié ou reproduit, tant que cette ligne @author reste complète

// @downloadURL https://update.greasyfork.org/scripts/20026/Infos%20WarRiders.user.js
// @updateURL https://update.greasyfork.org/scripts/20026/Infos%20WarRiders.meta.js
// ==/UserScript==

/*
// ****** Informations ******
Installation:
-------------
https://greasyfork.org/fr/scripts/19944-nombre-planetes-warriders
compatible firefox

ChangeLog:
----------
v1 : 25 mai 2016
*Première version stable

v1.1 : 25 mai 2016
*Ajout d'une page dans @include

v2 : 28 mai 2016
*Réorganisation du script en fonctions et prototypes
*Nouvelles informations : Pourcentage des points spécifiques (Économie, Recherche et Militaire) par rapport au total des points pour les joueurs et les alliances

v2.1 : 28 mai 2016
*Quelques corrections dans le code
*Amélioration de l'affichage des noms de planète
*Correction orthographique titre tableau planète, avec accord singulier si 1 seule planète
*Caractères du nombre de planètes total plus visible
*Nombre de planètes au singulier si 1 suele planète

v2.2 : 28 mai 2016
*Padding cellule planètes totales
*Améliorations du code (variables, fonctions, prototypes)
*Alternance des couleurs des lignes dans la liste des planètes
*Affichage du nombre de lunes
*/

var strFunc = (function(){
	String.prototype.supprNonNum = function() { // Supprime tous les caractères non numériques d'une chaîne
		return this.replace(/[^0-9-]/g,'');
	};
	
	String.prototype.supprBlancs = function() { // Supprime tous les caractères blancs d'une chaîne
		return this.replace(/\s/g,'');
	};
	
	Element.prototype.alterneCouleurs = function(coul) { // Colorie le fond de toutes les cellules 'td' d'une ligne 'tr' sur  2 de l'élément <table> 
		var liste_tr = this.getElementsByTagName('tr');
		for (var i=0; i<liste_tr.length; i+=2) {		
			var liste_td = liste_tr[i].getElementsByTagName('td');
			for (var j=0; j<liste_td.length; j++) liste_td[j].setAttribute('style', 'background-color: '+coul+';');
		}
	};
	
	function $(id) {
			// Abrégé de document.getElementById(id);
			return document.getElementById(id);
	}
	
	function accord_pluriel(nb, str_sin, str_plu) { // Selon le nombre, renvoie la chaîne singulier ou pluriel (typiquement avec un 's' final)
		return ( nb > 1 ) ? str_plu : str_sin;
	}
	
	function get_points(rubr){ // Renvoie le nombre de points affichées dans la rubrique rubr ("Points", "Économie", "Recherche", "Militaire")
		var tabl_stat = get_WRtable("Statistiques");
		if ( tabl_stat != undefined ) {
			var liste_tr = tabl_stat.getElementsByTagName('tr');
			for (var j=0; j<liste_tr.length; j++) { // Parcours de toutes les lignes de la table
				var case1 = liste_tr[j].getElementsByTagName('td')[0];
				if ( case1 != undefined && case1.innerHTML.match(new RegExp(rubr)) ) return parseInt(liste_tr[j+2].getElementsByTagName('td')[6].innerHTML.supprNonNum());
			}
		}
	}
	
	function get_WRtable(titr) { // Renvoie l'élément HTML table de WarRiders qui porte pour titre titr. Renvoie false si introuvable
		var liste_tabl = document.getElementsByTagName('table');
		for (var i=0; i<liste_tabl.length; i++) { // Parcours de tous les éléments 'table' de la page
			if ( liste_tabl[i].getElementsByTagName('tr')[0].innerHTML.match(new RegExp(titr))) return liste_tabl[i];
		}
		return false;
	}
	
	function write_points(rubr, info) { // Dans la table dénombrant les points, écrit info dans la rubrique rubr ("Points", "Économie", "Recherche", "Militaire")
		var tabl_stat = get_WRtable("Statistiques");
		if ( tabl_stat != undefined ) {
			var liste_tr = tabl_stat.getElementsByTagName('tr');
			for (var j=0; j<liste_tr.length; j++) { // Parcours de toutes les lignes de la table
				var case1 = liste_tr[j].getElementsByTagName('td')[0];
				if ( case1 != undefined && case1.innerHTML.match(new RegExp(rubr)) ) case1.innerHTML += info;
			}
		}
	}
	



	// **************************************
	// *** *** Tableau "Statistiques" *** ***
	// **************************************
		
	if ( get_WRtable("Statistiques") ) { // S'éxécute que si la table titrée "Statistiques" existe
		
		var p_tot = get_points('Points');
		var p_eco = get_points('Économie');
		var p_rec = get_points('Recherche');
		var p_mil = get_points('Militaire');
			
		write_points('Économie', ' <font color="black">('+(100*p_eco/p_tot).toFixed(2)+'%)</font>');
		write_points('Recherche', ' <font color="black">('+(100*p_rec/p_tot).toFixed(2)+'%)</font');
		write_points('Militaire', ' <font color="black">('+(100*p_mil/p_tot).toFixed(2)+'%)</font');
	}	
		
		
		
		
	// **********************************
	// *** *** Tableau "Planètes" *** ***
	// **********************************
		
	var tabl_coord = get_WRtable("Planète trouvé|coordonnées");
	if ( tabl_coord ) { // S'éxécute que si la table titrée "Planète trouvé" ou "coordonnées" existe
	
		get_WRtable("Planète trouvé|coordonnées").alterneCouleurs('#666666'); // Coloration d'une ligne sur 2

		var liste_tr = tabl_coord.getElementsByTagName('tr');
		var n_pl=0, n_lu=0;
		for (var j=0; j<liste_tr.length; j++) { // Parcours de toutes les lignes de la table
			var case1 = liste_tr[j].getElementsByTagName('td')[0];
			if ( case1 != undefined ) {
				var case1_a = case1.getElementsByTagName('a')[0];
				if ( case1_a != undefined && case1_a.innerHTML.match(/[0-9]+:[0-9]+:[0-9]+/) ) {
					if ( case1.childNodes[1].textContent.indexOf('L') != -1 ) n_lu++;
					n_pl++; // Décompte des planètes
					// Suppression des parenthèses (surcharge) dans le nom de la planète
					liste_tr[j].getElementsByTagName('td')[1].childNodes[1].textContent = liste_tr[j].getElementsByTagName('td')[1].childNodes[1].textContent.replace('(','');
					liste_tr[j].getElementsByTagName('td')[1].childNodes[3].textContent = '';
				}
			}	
		}
		
		// Affichage de la cellule 'total'
		tabl_coord.innerHTML += '<tr><td colspan="2"><div align="center" style="padding: 8px;"> <b><font size=3>'+n_pl+' '+accord_pluriel(n_pl, 'planète', 'planètes')+' & '+n_lu+' '+accord_pluriel(n_lu, 'lune', 'lunes')+'</font></b></div></td></tr>';
		
		// Correction orthographique titre tableau
		var str = ( n_pl > 1 ) ? 'Planètes trouvées ' : 'Planète trouvée ';
		liste_tr[0].getElementsByTagName('th')[0].childNodes[0].textContent = str;
	}
}).toString();


var script = document.createElement("script");
script.setAttribute("type","text/javascript");
script.text = "(" + strFunc + ")();";
document.body.appendChild(script);