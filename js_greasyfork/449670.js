// ==UserScript==
// @name         [Mountyhall] Le Baroufleur
// @namespace    Mountyhall
// @description  Assistant Baroufle
// @author       Dabihul, Rouletabille
// @version      1.0.3
// @include      */mountyhall/MH_Play/Play_a_Action.php*id=43*
// @downloadURL https://update.greasyfork.org/scripts/449670/%5BMountyhall%5D%20Le%20Baroufleur.user.js
// @updateURL https://update.greasyfork.org/scripts/449670/%5BMountyhall%5D%20Le%20Baroufleur.meta.js
// ==/UserScript==

//---------------------- À l'intention des programmeurs ----------------------//
//
// Stockage du type de clavier:
// localStorage["baroufleur.mode"] (number)
// (cf var. glob. typesClavier)
//
// Stockage des mélodies :
// localStorage["baroufleur.melodies"] (object) {
//   nomMélodie (string): [
//     son1 (string),
//     ...
//   ]
// }
// Les sons sont stockés sous forme de codification MH:
//  "1": Booong
//  "2": Bababoum
//​  "3": Zbouing
//​  "4": Kliketiiik
//  "5": Whaaag
//  "6": Whoooom
//  "7": Krouiiik
//  "8": Tagadagada
//  "9": Tuutuuuut
// "10": Praaaouuut
// "11": Kssksss
// "​12": Gaaaw
// "​13": Huitsch
// "​14": Ytseukayndof
// "​15": Sssrileur
// "​16": Ghimighimighimi
//
//---------------------------- Variables Globales ----------------------------//

var BaroufleON = window.location.href.match(/Play_a_Action.php.*id=43/);
if (BaroufleON)
	window.console.log("[Baroufleur] Script ON sur : %s", window.location.href);

var
	// Listes des Sons disponibles
	// {son: code}
	objCodeDuSon = {},
	// {code: son}
	objSonParCode = {},
	// [son]
	ordreAlphabétiqueSons = [],
	// [son]
	ordreAlphabétiqueEffets = [],
	
	// Table principale de la comp'
	divSons,
	
	// Nombre de PA du Baroufle
	nombreDePAs,
	
	// Mode du clavier
	typesClavier = {
		0: "Désactivé",
		1: "Sons",
		2: "Effets",
		3: "Sons & effets"
	},
	modeClavier = 0,
	
	// Nombre de sons par ligne en mode clavier
	sonsParLigne = 3,
	
	// Liste des mélodies enregistrées
	objMelodies = {};

//----------------------- Base de données sur les sons -----------------------//

var
	BDD_Sons = {
//	"Son": {
//		seuil: s'il y a un seuil (number),
//		multiple: si le seuil s'applique plusieurs fois (boolean),
//		effet: {
//			"carac": multiplicateur (number),
//		},
//		description: "description"
//	},
	"Bababoum" : {
		effet: {
			"Att": 1
		},
		description: "Attaque +1 par seuil dépensé"
	},
	"Booong" : {
		effet: {
			"Deg": 1,
			"Esq": -1
		},
		description: "Dégâts +1 | Esquive -1 par seuil dépensé"
	},
	"Gaaaw" : {
		effet: {
			"Fatigue": 1
		},
		description: "Fatigue +1 par seuil dépensé"
	},
	"Ghimighimighimi" : {
		seuil: 1,
		multiple: false,
		effet: {
			"Sur soi": 1
		},
		description: "Effet sur soi (seuil 1)"
	},
	"Huitsch" : {
		effet: {
			"Deg": -1
		},
		description: "Dégâts -1 par seuil dépensé"
	},
	"Kliketiiik" : {
		effet: {
			"Esq": -1,
			"Concentration": -1
		},
		description: "Esquive -1 | Concentration -1 par seuil dépensé"
	},
	"Krouiiik" : {
		effet: {
			"Concentration": -2
		},
		description: "Concentration -2 par seuil dépensé"
	},
	"Kssksss" : {
		effet: {
			"Esq": 1
		},
		description: "Esquive +1 par seuil dépensé"
	},
	"Praaaouuut" : {
		effet: {
			"Reg": -1
		},
		description: "Régénération -1 par seuil dépensé"
	},
	"Sssrileur" : {
		seuil: 6,
		multiple: false,
		effet: {
			"Rend visible": 1
		},
		description: "Rend visible (seuil 6)"
	},
	"Tagadagada" : {
		seuil: 2,
		multiple: true,
		effet: {
			"Durée": 1
		},
		description: "Durée +1 par 2 seuils dépensés"
	},
	"Tuutuuuut" : {
		effet: {
			"Att": -1
		},
		description: "Attaque -1 par seuil dépensé"
	},
	"Whaaag" : {
		seuil: 4,
		multiple: true,
		effet: {
			"Portée": 1
		},
		description: "Portée horizontale +1 par 4 seuils dépensés"
	},
	"Whoooom" : {
		effet: {
			"Concentration": 2
		},
		description: "Concentration +2 par seuil dépensé"
	},
	"Ytseukayndof" : {
		seuil: 2,
		multiple: false,
		effet: {
			"BM Magiques": 1
		},
		description: "Rend les bonus magiques (seuil 2)"
	},
	"Zbouing" : {
		effet: {
			"Reg": 1
		},
		description: "Régénération +1 par seuil dépensé"
	}
}

//-------------------------- Utilitaires génériques --------------------------//

function relatif(num) {
// Force l'affichage du signe d'un relatif
	num = Number(num);
	return (isNaN(num) || num<0) ? String(num) : "+"+num;
}

function ordinal(num) {
// Retourne l'ordinal associé au nombre
	return num==1 ? "1er" : num+"ème"
}

//------------------------------ Gestion du DOM ------------------------------//

function ajouteTexte(parent, text, bold, italic) {
// Ajoute un textNode contenant 'text' à 'parent',
// si nécessaire entre des balises gras et/ou italique.
	if(bold) {
		var b = document.createElement('b');
		parent.appendChild(b);
		parent = b;
	}
	if(italic) {
		var i = document.createElement('i');
		parent.appendChild(i);
		parent = i;
	}
	parent.appendChild(document.createTextNode(text));
}

function ajouteBouton(parent, value) {
// Ajoute un bouton de libellé 'value' et de classe 'mh_form_submit' à 'parent'
	var btn = document.createElement("input");
	btn.type = "button";
	btn.className = "mh_form_submit";
	if(value) {
		btn.value = value;
	}
	parent.appendChild(btn);
	return btn;
}

function ajouteInput(parent) {
// Ajoute un input[text] de classe 'TextboxV2' à 'parent'
	var input = document.createElement("input");
	input.type = "text";
	input.className = "TextboxV2";
	parent.appendChild(input);
	return input;
}

function ajouteSelect(parent) {
// Ajoute un select de classe 'SelectboxV2' à 'parent'
	var select = document.createElement("select");
	select.className = "SelectboxV2";
	parent.appendChild(select);
	return select;
}

function ajouteOption(parent, text, value) {
// Ajoute une option de libellé 'text' et de valeur 'value' à 'parent'
	var option = document.createElement("option");
	option.appendChild(document.createTextNode(text));
	option.value = value;
	parent.appendChild(option);
	return option;
}

//-------------------------- Extraction de données ---------------------------//

function getSonsDisponibles() {
// Extrait la liste des sons disponibles pour Baroufler.
// 
// Nécessite: -
// Effectue:
// - initialise objCodeDuSon
// - initialise objSonParCode
// - initialise ordreAlphabétiqueSons
// - initialise ordreAlphabétiqueEffets
	try {
		var selectPremierSon = document.getElementById("ai_Note0");
	} catch(e) {}
	if(!selectPremierSon || !selectPremierSon.options) {
		window.console.error(
			"[Baroufleur] Liste de sons non trouvée - Abandon"
		);
		return false;
	}
	var i, option, son, effet, listeEffets = {};
	
	for(i=0 ; i<selectPremierSon.options.length ; i++) {
		option = selectPremierSon.options[i];
		if(option.value) {
			son = option.textContent.trim();
			if(son.indexOf("-")!=-1) {
				son = son.replace(/-/,"").trim();
			}
			objCodeDuSon[son] = option.value;
			objSonParCode[option.value] = son;
			ordreAlphabétiqueSons.push(son);
			ordreAlphabétiqueEffets.push(son);
			listeEffets[son] = "";
			if(!BDD_Sons[son]) {
				// Si le son est inconnu, on prend effet = nom
				window.console.warn(
					"[mmassistant] Le son \'%s\' est inconnu", son
				);
				BDD_Sons[son] = {
					effet: {},
					description: "???"
				};
				BDD_Sons[son].effet[son] = 1;
				listeEffets[son] = son;
			}
			for(effet in BDD_Sons[son].effet) {
				listeEffets[son] += effet;
			}
		}
	}
	ordreAlphabétiqueSons.sort();
	ordreAlphabétiqueEffets.sort(function(a, b) {
		return listeEffets[a]>listeEffets[b];
	});
	
	return true;
}

function getTableComp() {
// Recherche la table principale de la comp'
// Nécessite: -
// Effectue: définit divSons
	try {
		divSons = document.getElementById('f_baroufle');
	} catch(e) {}
	if(!divSons) {
		window.console.error(
			"[Baroufleur] Liste des choix non trouvée - Abandon"
		);
		return false;
	}
	return true;
}

//------------------------ Enrichissement des listes -------------------------//

function effetDuSon(son, rang) {
// Retourne une chaîne de caractères correspondant à l'effet exact du son,
// déterminé par le type du son et son rang dans la mélodie.
// Nécessite: BDD_Sons
	var
		texte = "",
		effet;
	if(nombreDePAs && rang>nombreDePAs) {
		rang = -1;
	}
	
	for(effet in BDD_Sons[son].effet) {
		if(texte.length>2) {
			texte += " | ";
		}
		if(BDD_Sons[son].seuil) {
			if(BDD_Sons[son].multiple) {
				texte += effet+" +"+(rang+1)+"/"+BDD_Sons[son].seuil;
			} else {
				texte += effet+": "+(rang+1)+"/"+BDD_Sons[son].seuil;
			}
		} else {
			texte += effet+" "+relatif(BDD_Sons[son].effet[effet]*(rang+1));
		}
	}
	
	return texte.
		replace(/Concentration/, "Conc.").
		replace(/BM Magiques/, "BMM");
}

function initialiseListesSons() {
// Initialisation générale du script.
// 
// Nécessite: BDD_Sons
// Effectue:
// - ajoute les données de BM dans les selects
// - ajoute les handlers sur les selects
// - initialise nombreDePAs
	var
		i=0, j, option, son, texte, effet,
		sel = document.getElementById("ai_Note0");
	
	while(sel) {
		for(j=0 ; j<sel.options.length ; j++) {
			option = sel.options[j];
			if(!option.value) {
				// Ignorer les "Choisissez une note"
				continue;
			}
			
			// Identification du son
			son = option.textContent;
			if(son.indexOf("-")!=-1) {
				son = son.replace(/-/,"");
			}
			son = son.trim();

			// Ajouter la description
			let oSon = BDD_Sons[son];
			if (!oSon) continue;
			option.title = oSon.description;
			
			// Ajouter l'effet
			ajouteTexte(option, " ("+effetDuSon(son, i)+")");
		}
		
		// Ajout du Handler
		sel.onchange = changeDeSonorite;
		
		// Passage au select suivant
		i++;
		sel = document.getElementById("ai_Note"+i);
	}
	
	// Décompte du nombre de PAs du Baroufle (=nb de sel)
	nombreDePAs = i;
}

//------------------------- Gestion de l'effet total -------------------------//

function ajouteZoneTotal() {
// Crée la zone où le total des effets est affiché.
// Nécessite: nombreDePAs
// Effectue: ajout du td avec l'ul 'baroufleur_effettotal'
	var div, ul;
	
	// Insère l'effet total 
	div = document.createElement('div');
	div.className = "mh_tdtitre";
	ajouteTexte(div, "Effet total:", true);
	
	// Ajoute la liste des effets totaux (vide)
	ul = document.createElement("ul");
	ul.id = "baroufleur_effettotal";
	ul.style.textAlign = "left";
	ul.style.margin = "0px";
	div.appendChild(ul);
	divSons.insertBefore(div, divSons.firstChild);
}

function majEffetTotal() {
// Mise à jour de la liste des effets 'baroufleur_effettotal'
// en fonction des sons sélectionnés.
// 
// Nécessite:
// - la mise en place de la liste (ul) 'baroufleur_effettotal'
// - BDD_Sons
// - objSonParCode
// - nombreDePAs
// Effectue: mise à jour de l'ul
	var
		// Scope = fonction
		objEffetsTotaux = {}, objSeuils = {},
		
		// Scope = for inital
		i, code, son, effet,
		
		// Scope = affichage final
		ordreAlphaEffetsActifs = [],
		//son, effet,
		li, texte, italic, total, seuil, q, r,
		ulTotal = document.getElementById("baroufleur_effettotal");
	
	// Récupération des effets des sons sélectionnés
	for(i=0 ; i<nombreDePAs ; i++) {
		code = document.getElementsByName("ai_Note"+i)[0].value;
		if(!code) continue;
		son = objSonParCode[code];
		if (!son) continue;
		for(effet in BDD_Sons[son].effet) {
			if(objEffetsTotaux[effet]) {
				objEffetsTotaux[effet] += BDD_Sons[son].effet[effet]*(i+1);
			} else {
				objEffetsTotaux[effet] = BDD_Sons[son].effet[effet]*(i+1);
			}
			if(BDD_Sons[son].seuil && !objSeuils[effet]) {
				objSeuils[effet] = {
					seuil: BDD_Sons[son].seuil,
					multiple: BDD_Sons[son].multiple
				};
			}
		}
	}
	
	// Màj de la liste baroufleur_effettotal:
	// Effacement ancienne liste
	while(ulTotal.firstChild) {
		ulTotal.removeChild(ulTotal.firstChild);
	}
	
	// Création de l'ordre alphabétique des effets actifs
	for(effet in objEffetsTotaux) {
		if(objEffetsTotaux[effet]!=0) {
			ordreAlphaEffetsActifs.push(effet);
		}
	}
	ordreAlphaEffetsActifs.sort();
	
	// Génération de la liste des effets
	for(i=0 ; i<ordreAlphaEffetsActifs.length ; i++) {
		effet = ordreAlphaEffetsActifs[i];
		total = objEffetsTotaux[effet];
		italic = false;
		texte = effet;
		li = document.createElement("li");
		if(objSeuils[effet]) {
			seuil = objSeuils[effet].seuil;
			q = Math.floor(total/seuil);
			r = Math.floor(total%seuil);
			if(total<seuil) {
				italic = true;
			}
			if(objSeuils[effet].multiple) {
				texte += " "+relatif(q);
				if(r) {
					texte += " (+"+r+"/"+seuil+")";
				}
			} else if(total!=seuil) {
				texte += " ("+total+"/"+seuil+")";
			}
		} else {
			texte += " "+relatif(objEffetsTotaux[effet]);
		}
		ajouteTexte(li, texte, false, italic);
		ulTotal.appendChild(li);
	}
}

//---------------------------- Interface clavier -----------------------------//

function initialiseClavier() {
// Crée un clavier, *vide* et *invisible*, en dessous des sélecteurs,
// et lui adjoint une copie de la zone 'baroufleur_effettotal'.
// 
// Nécessite : 
// - divSons
// - nombreDePAs
// - la mise en place préalable de la zone 'baroufleur_effettotal'
// - la mise en place préalable du sélecteur de mélodies (insertRow)
// Effectue : la création d'un clavier prêt à remplir
	var
		ulRef = document.getElementById("baroufleur_effettotal"),
		tr, td, span, ul,
		table, str, std, btn, i, j, son;
	
	// Création de la ligne contenant le clavier
	let tableClavier = document.createElement('table');
	tr = tableClavier.insertRow();
	tr.id = "baroufleur_clavier";
	tr.style.display = "none";
	td = tr.insertCell(0);
	td.className = "mh_tdpage";
	td.style.textAlign = "center";
	td.style.fontWeight = "bold";
	td.style.width = '550px',
	td.colSpan = 2;
	
	// Affichage mélodie en cours
	ajouteTexte(td, "Mélodie: ", true);
	span = document.createElement("span");
	span.id = "baroufleur_rang";
	td.appendChild(span);
	div = document.createElement("div");
	div.style.fontWeight = "normal";
	div.style.fontStyle = "italic";
	for(i=0 ; i<nombreDePAs ; i++) {
		if(i>0) {
			ajouteTexte(div," - ");
		}
		span = document.createElement("span");
		span.id = "baroufleur_son"+i;
		span.style.cursor = "pointer";
		span.rang = i;
		span.onclick = razSon;
		div.appendChild(span);
	}
	td.appendChild(div);
	
	// Clavier proprement dit
	table = document.createElement("table");
	table.style.margin = "auto";
	table.style.textAlign = "center";
	table.style.border = "1px solid black;"
	td.appendChild(table);
	str = table.insertRow(0);
	j=0;
	for(i=0 ; i<ordreAlphabétiqueSons.length ; i++) {
		std = str.insertCell(j);
		btn = ajouteBouton(std);
		btn.id = "baroufleur_btn"+i;
		btn.style.margin = "2px";
		btn.onclick = valideNote;
		j++;
		if(j==sonsParLigne) {
			j=0;
			str = table.insertRow(-1);
		}
	}
	
	// Ajout du bouton de Remise à Zéro
	str = table.insertRow(-1);
	std = str.insertCell(0);
	std.colSpan = sonsParLigne;
	btn = ajouteBouton(std, "RÉINITIALISER!");
	btn.onclick = razMelodie;
	str = table.insertRow(1);
	
	// Clone la liste des effets
	td = tr.insertCell(1);
	td.className = "mh_tdtitre";
	td.style.width = "25%";
	ajouteTexte(td, "Effet total:", true);
	ul = ulRef.cloneNode(true);
	ul.id = "baroufleur_inactif";
	td.appendChild(ul);
	
	divSons.parentNode.insertBefore(tableClavier, divSons.nextSibling);
	
	return tr;
}

function majClavier(rangActif) {
// Met à jour les boutons du clavier et la mélodie en fonction du modeClavier
// et du rangActif si spécifié
// 
// Nécessite :
// - la création préalable du clavier
// - ordreAlphabétiqueSons || ordreAlphabétiqueEffets
// - BDD_Sons
	var
		rang = document.getElementById("baroufleur_rang"),
		chercheActif = false,
		ordreDesBoutons = ordreAlphabétiqueSons,
		i, span, select, son, btn;
	if(!rangActif) {
		chercheActif = true;
		rangActif = 0;
	}
	if(modeClavier==2) {
		ordreDesBoutons = ordreAlphabétiqueEffets;
	}
	
	// Màj de la mélodie
	// (et éventuelle recherche du premier son non défini)
	for(i=0 ; i<nombreDePAs ; i++) {
		span = document.getElementById("baroufleur_son"+i);
		select = document.getElementsByName("ai_Note"+i)[0];
		if(select.value && select.value != '0') {
			if(chercheActif) {
				rangActif++;
			}
			son = objSonParCode[select.value];
			if (!son) continue;
			span.innerHTML = son;
			span.title = effetDuSon(son, i);
		} else {
			chercheActif = false;
			span.innerHTML = "?";
			span.removeAttribute("title");
		}
	}
	
	// Màj des touches du clavier
	for(i=0 ; i<ordreDesBoutons.length ; i++) {
		btn = document.getElementById("baroufleur_btn"+i);
		btn.rang = rangActif;
		son = ordreDesBoutons[i];
		btn.son = son;
		switch(modeClavier) {
			case 1:
				btn.value = son;
				btn.title = BDD_Sons[son].description;
				break;
			case 2:
				btn.value = effetDuSon(son, rangActif);
				btn.title = son;
				break;
			case 3:
				btn.value = son+" ("+effetDuSon(son, rangActif)+")";
				btn.title = BDD_Sons[son].description;
		}
	}
	
	// Màj des infos sur la mélodie
	if(rangActif<nombreDePAs) {
		rang.innerHTML = "choix du "+ordinal(rangActif)+" son";
	} else {
		rang.innerHTML = "";
	}
}

function basculeInterface() {
// Bascule entre les interfaces classique (selects) et clavier
	var clavier = document.getElementById("baroufleur_clavier");
	if(!clavier && modeClavier>0) {
		clavier = initialiseClavier();
	}
	var
		ulActive = document.getElementById("baroufleur_effettotal"),
		ulInactive = document.getElementById("baroufleur_inactif"),
		i;

	if(clavier.style.display=="none") {
		clavier.style.display = "";
		// Masque les lignes d'origine
		divSons.style.display = 'none';
		majClavier();
	} else {
		clavier.style.display = "none";
		// Affiche les lignes d'origine
		divSons.style.display = '';
	}
	
	ulActive.id = "baroufleur_inactif";
	ulInactive.id = "baroufleur_effettotal";
	majEffetTotal();
}

//--------------------------- Gestion des Mélodies ---------------------------//

function ajouteLigneMelodies() {
// Crée la ligne avec le sélecteur / enregistreur de mélodies
// et le sélecteur de clavier
// Nécessite : divSons
	var tr, td, i, select, option, btn, input;
	
	// Crée la ligne des sélecteurs
	let tableMelodies = document.createElement('table');
	divSons.parentNode.insertBefore(tableMelodies, divSons);
	tr = tableMelodies.insertRow();
	tr.id = "baroufleur_ligne_selecteurs";
	td = tr.insertCell(0);
	td.className = "mh_tdpage";
	
	// Ajout du sélecteur de mélodies
	ajouteTexte(td, "Mélodies : ", true);
	select = ajouteSelect(td);
	select.id = "baroufleur_select_melodie";
	select.onchange = chargeMelodie;
	baroufle_majMelodiesIntoForm();
	
	// Ajout du bouton de suppression
	btn = ajouteBouton(td, "Suppr.");
	btn.onclick = supprimeMelodie;
	
	// Ajout de l'enregistreur de Mélodies
	td = tr.insertCell(1);
	td.className = "mh_tdpage";
	btn = ajouteBouton(td, "Sauvegarder:");
	btn.onclick = ajouteMelodie;
	ajouteTexte(td, " ");
	input = ajouteInput(td);
	input.id = "baroufleur_nouveau_nom";
	// Le seul moyen de prevent le submit sur entrée est de hacker
	// le onsubmit de MH...
	// input.onkeyup = function(event) {
	// 	if(event.keyCode==13) {
	// 		event.preventDefault;
	// 		ajouteMelodie();
	// 	}
	// }
	
	// Ajout du sélecteur de clavier
	td = tr.insertCell(2);
	td.className = "mh_tdtitre";
	ajouteTexte(td, "Clavier: ", true);
	select = ajouteSelect(td);
	for(i in typesClavier)  {
		ajouteOption(select, typesClavier[i], i);
	}
	select.value = modeClavier;
	select.onchange = changeModeClavier;
}

function baroufle_majMelodiesIntoForm() {
	var
		select = document.getElementById("baroufleur_select_melodie"),
		ordreAlpha = [],
		nom, i;
	
	// Vidange du select
	while(select.firstChild) {
		select.removeChild(select.firstChild);
	}
	
	// Création de l'ordre alphabétique
	for(nom in objMelodies)  {
		ordreAlpha.push(nom);
	}
	ordreAlpha.sort();
	
	// Ajout des mélodies dans l'ordre alphabétique
	ajouteOption(select, "---", "");
	for(i=0 ; i<ordreAlpha.length ; i++)  {
		nom = ordreAlpha[i];
		option = ajouteOption(select, nom, nom);
		option.melodie = objMelodies[nom];
	}
}

//--------------------------------- Handlers ---------------------------------//

function changeDeSonorite() {
// Gère les changements sur les selects (interface classique)
	majEffetTotal();
}

function changeModeClavier() {
// Gère les changements du sélecteur de mode
	var mode = Number(this.value);
	if((mode?1:0)^(modeClavier?1:0)) {
		modeClavier = mode;
		basculeInterface();
	} else {
		modeClavier = mode;
		majClavier();
	}

	// Sauvegarde du nouveau mode
	baroufle_saveMode();
}

function valideNote() {
// Gère les clics sur les touches du clavier
	var
		son = this.son,
		rang = this.rang,
		select = document.getElementsByName("ai_Note"+rang)[0];
	if(rang<nombreDePAs) {
		select.value = objCodeDuSon[son];
		majEffetTotal();
		majClavier();
	}
}

function razSon() {
// Gère les clics sur les notes de la mélodie
	var rang = this.rang;
	document.getElementsByName("ai_Note"+rang)[0].value = "";
	majEffetTotal();
	majClavier(rang);
}

function razMelodie() {
// Remet à zéro toute la mélodie
	var
		i=0,
		selects = document.getElementsByName("ai_Note0");
	while(selects[0]) {
		selects[0].value = "";
		i++;
		selects = document.getElementsByName("ai_Note"+i);
	}
	majEffetTotal();
	majClavier();
}

function chargeMelodie() {
// Gère les changements du sélecteur de mélodies
	if(!this.value) { return; }
	var
		melodie = this.options[this.selectedIndex].melodie,
		selects = document.getElementsByName("ai_Note0"),
		i=0;
	while(selects[0] && i<=melodie.length) {
		selects[0].value = melodie[i];
		i++;
		selects = document.getElementsByName("ai_Note"+i);
	}
	majEffetTotal();
	majClavier();
}

function supprimeMelodie() {
// Gère les clics sur le bouton de suppression de mélodie
	var nom = document.getElementById('baroufleur_select_melodie').value;
	if(!nom) { return; }
	if(window.confirm("Supprimer définitivement \""+nom+"\" ?")) {
		delete objMelodies[nom];
		baroufle_saveMelodies();
		baroufle_majMelodiesIntoForm();
	}
}

function ajouteMelodie() {
// Gère les clics sur le bouton dde sauvegarde de mélodie
	var
		nom = document.getElementById("baroufleur_nouveau_nom").value,
		selects = document.getElementsByName("ai_Note0"),
		melodie = [],
		i=0;
	
	// On vérifie si le nom est fourni / existe déjà
	if(!nom) {
		window.alert("Le nom est obligatoire!");
		return;
	}
	if(
		nom in objMelodies &&
		!window.confirm("Ce nom existe déjà. Écraser?")
	) { return; }
	
	// On récupère les données
	while(selects[0]) {
		melodie.push(selects[0].value);
		i++;
		selects = document.getElementsByName("ai_Note"+i);
	}
	objMelodies[nom] = melodie;
	
	// Stockage & maj
	baroufle_saveMelodies();
	baroufle_majMelodiesIntoForm();
}

function baroufle_saveMelodies() {
	if (typeof MH_le_baroufleur_json !== 'undefined')
		baroufle_saveIntoMH();
	window.localStorage.setItem('baroufleur.melodies', JSON.stringify(objMelodies));
}

function baroufle_saveMode() {
	if (typeof MH_le_baroufleur_json !== 'undefined')
		baroufle_saveIntoMH();
	window.localStorage.setItem("baroufleur.mode", modeClavier);
}

function baroufle_escapeUnicode(str) { // https://stackoverflow.com/questions/62449035/escape-all-unicode-non-ascii-characters-in-a-string-with-javascript
   return [...str].map(c => /^[\x00-\x7F]$/.test(c) ? c : c.split("").map(a => "\\u" + a.charCodeAt().toString(16).padStart(4, "0")).join("")).join("");
}

function baroufle_saveIntoMH() {
	let objConfigMH = {
		melodies: objMelodies,
		modeClavier: modeClavier,
	}
	let url = window.location.origin;	// https://gams.mountyhall.com
	url += '/mountyhall/MH_PageUtils/Services/json_extension.php';
	url += '?mode=set&ext=le_baroufleur'
	let request = new XMLHttpRequest();
	request.open('POST', url);
	request.onreadystatechange = function () {
		if (request.readyState != 4) {
			return;
		}
		if (request.error) {
			window.console.error('[Baroufleur] erreur set config MH : ' + request.error);
			return;
		}
	};
	request.send(baroufle_escapeUnicode(JSON.stringify(objConfigMH)));
}

//-------------------------------- Code actif --------------------------------//

if (BaroufleON) {
	let	value = window.localStorage.getItem('baroufleur.melodies');
	if(value) {
		try {
			objMelodies = JSON.parse(value);
		} catch(e) {
			window.console.error(
				"[Baroufleur] Parsing error. Non-JSON value at key: baroufleur.melodies\n%o", e);
			objMelodies = {};
		}
	} else {
		objMelodies = {};
	}
	value = window.localStorage.getItem("baroufleur.mode");
	if (value) {	// si 0, ben.... ça reste 0
		modeClavier = Number(window.localStorage.getItem("baroufleur.mode"));
		if(isNaN(modeClavier) || modeClavier<0 || modeClavier>3) {
			modeClavier = 0;
		}
	}

	if (typeof MH_le_baroufleur_json !== 'undefined') {
		// mode extension gérée par MH, configuration sauvée dans MH
		if (MH_le_baroufleur_json === null) {
			if (modeClavier != 0 || Object.keys(objMelodies).length > 0)
				baroufle_saveIntoMH();
		} else 	{
			// fusionner vers MH
			let objMelodiesLocalStorage = objMelodies;
			let modeClavierLocalStorage = modeClavier;
			try {
				let objConfigMH = JSON.parse(MH_le_baroufleur_json);
				objMelodies = objConfigMH.melodies;
				if (objMelodies === undefined) objMelodies = {};
				modeClavier = objConfigMH.modeClavier;
				if (modeClavier === undefined) modeClavier = 0;
			} catch(e) {
				window.console.error(
					"[Baroufleur] la config MH n'est pas JSON\n" + MH_le_baroufleur_json, e);
				objMelodies = {};
				modeClavier = 0;
			}
			let bUpdate = false;
			//console.log('[Baroufleur] avant merge modeClavier=' + modeClavier + ', modeClavierLocalStorage=' + modeClavierLocalStorage);
			if (modeClavier == 0 && modeClavierLocalStorage != 0) {
				modeClavier = modeClavierLocalStorage;
				bUpdate = true;
			}
			//console.log('[Baroufleur] avant merge objMelodies=' + JSON.stringify(objMelodies));
			//console.log('[Baroufleur] avant merge objMelodiesLocalStorage=' + JSON.stringify(objMelodiesLocalStorage));
			//console.log('[Baroufleur] avant merge keys objMelodiesLocalStorage=' + JSON.stringify(Object.keys(objMelodiesLocalStorage)));
			for (let melod of Object.keys(objMelodiesLocalStorage)) {
				if (JSON.stringify(objMelodies[melod]) != JSON.stringify(objMelodiesLocalStorage[melod])) {
					objMelodies[melod] = objMelodiesLocalStorage[melod];
					bUpdate = true;
				}
			}
			//console.log('[Baroufleur] après merge objMelodies=' + JSON.stringify(objMelodies) + ', bUpdate=' + bUpdate);
			if (bUpdate) baroufle_saveIntoMH();
		}
	}
	
	if(getSonsDisponibles() && getTableComp()) {
		initialiseListesSons();
		ajouteZoneTotal();
		
		// Vérification de baroufleur.melodies
		for(var nom in objMelodies) {
			melodie = objMelodies[nom];
			if(!melodie.constructor==="Array") {
				window.console.error(
					"[Baroufleur] Mélodie \'%s\' de type invalide: %o",
					nom, melodie
				);
				delete objMelodies[nom];
				continue;
			}
			for(var i=0 ; i<Math.min(melodie.length, 6) ; i++) {
				if(
					isNaN(melodie[i]) && melodie[i]!=="" ||
					!melodie[i] in objSonParCode
				) {
					window.console.error(
						"[Baroufleur] Sonorité invalide pour \'%s\': %o",
						nom, melodie[i]
					);
					delete objMelodies[nom];
					break;
				}
			}
		}
		
		ajouteLigneMelodies();
		if(modeClavier>0) {
			initialiseClavier();
			basculeInterface();
		}
	}
	
	// window.console.debug(
	// 	objSonParCode,
	// 	objCodeDuSon,
	// 	ordreAlphabétiqueSons,
	// 	ordreAlphabétiqueEffets
	// );
	
	window.console.log("[Baroufleur] Script OFF");
}
