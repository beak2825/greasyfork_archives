// ==UserScript==
// @name         [Mountyhall] SacrOptimal
// @namespace    Mountyhall
// @description  Assistant Sacrifice
// @author       Dabihul
// @version      6.0.0.1
// @include      */mountyhall/MH_Play/Actions/Sorts/Play_a_SortYY.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387787/%5BMountyhall%5D%20SacrOptimal.user.js
// @updateURL https://update.greasyfork.org/scripts/387787/%5BMountyhall%5D%20SacrOptimal.meta.js
// ==/UserScript==

/******************************************************************************
 *           Calcul automatique de la perte moyenne de PV sur Sacro           *
 ******************************************************************************/

/*---------------------------- Variables Globales ----------------------------*/

// Affichage des PVs perdus en titre dans le menu déroulant
// plutôt que directement dans le texte :
var PVsPerdusEnTitre = false;

/*------------------------------- LocalStorage -------------------------------*/

function setValue(key, value) {
	window.localStorage.setItem(key, value);
}

function getValue(key) {
	return window.localStorage.getItem(key);
}

/*----------------------------------- DOM ------------------------------------*/

function appendBouton(parent, value, onClick) {
	var input = document.createElement("input");
	input.type = "button";
	input.className = "mh_form_submit";
	input.value = value;
	input.onmouseover = function() {
		this.style.cursor = "pointer";
	};
	input.onclick = onClick;
	parent.appendChild(input);
	return input;
}

function appendOption(select, value, text) {
	var option = document.createElement("option");
	option.value = value;
	option.appendChild(document.createTextNode(text));
	select.appendChild(option);
	return option;
}

/*------------------------ Fonctions d'initialisation ------------------------*/

function gestionTitre4() {
	titre4.original = titre4.textContent.trim();
	titre4.innerHTML = titre4.original.slice(0,7) + "...";
	titre4.onmouseover = function() {
		titre4.innerHTML = titre4.original;
		pertePV.style.display = "none";
	};
	titre4.onmouseout = function() {
		titre4.innerHTML = titre4.original.slice(0,7) + "...";
		pertePV.style.display = "";
	};
}

function initCalculSacro() {
	nbValeurs = Math.max( Math.min(nbValeurs, 31), 1);
	// indexMin est vérifié à chaque refresh de listeSac
	var sacroMax, opt, txt;
	try {
		sacroMax = parseInt(document.evaluate(
			".//text()[contains(.,'maximum')]",
			divAction, null, 9, null
		).singleNodeValue.textContent.match(/\d+/)[0]);
	} catch(e) {
		window.console.warn("[SacrOptimal] Soin maximum non trouvé", e);
		sacroMax = 250;
	}
	
	// Ajout du bouton changement de mode
	optiBouton = appendBouton(divAction, "Optimiser!", switchOptimiser);
	
	// Ajout des boutons [+] et [-] (taille de listeSac)
	augmenteListeSac = appendBouton(divAction, "[+]", plusDeChoix);
	diminueListeSac = appendBouton(divAction, "[-]", moinsDeChoix);
	
	// Initialisation affichage PV perdus
	pertePV = document.createElement("span");
	pertePV.innerHTML = "---";
	divAction.appendChild(document.createElement("br"));
	divAction.appendChild(pertePV);
	inputPV.onkeyup = refreshPertePV;
	
	// Création de la liste des sacros optimisés (4 -> 249)
	listeSac = document.createElement("select");
	listeSac.className = "SelectboxV2";
	opt = appendOption(listeSac, NaN, "---");
	opt.onclick = choixPlusPetits;
	for (var sac=4 ; sac<sacroMax ; sac+=5) {
		if (PVsPerdusEnTitre) {
			txt = sac;
		} else {
			txt = sac + " (-" + (sac+2*Math.floor(sac/5)+2) + ")";
		}
		opt = appendOption(listeSac, sac, txt);
		if (PVsPerdusEnTitre) {
			opt.title = "-" + (sac+2*Math.floor(sac/5)+2);
		}
	}
	opt = appendOption(listeSac, NaN, "+++");
	opt.onclick = choixPlusGrands;
	listeSac.onchange = refreshPertePV;
	
	// Initialisation du mode Optimiser
	if (Optimiser) {
		Optimiser = 0;
		switchOptimiser();
	} else {
		refreshDisplayListeSac();
	}
}

/*--------------------------------- Handlers ---------------------------------*/

function switchOptimiser() {
	Optimiser = 1-Optimiser;
	setValue("SacrOptimal.Optimiser", Optimiser);
	
	if (Optimiser) {
		optiBouton.value = "Mode Normal";
		indexMin = Number(inputPV.value) ?
			Math.floor( (Number(inputPV.value)+1)/5 ) - Math.floor(nbValeurs/2) :
			indexMin;
		refreshDisplayListeSac();
		// Attention à bien laisser des setAttribute pour que
		// le formulaire php puisse accéder aux modifs
		inputPV.setAttribute("name", "dummy");
		listeSac.setAttribute("name", "ai_NbPV");
		inputPV.parentNode.replaceChild(listeSac, inputPV);
		augmenteListeSac.style.display = "";
		diminueListeSac.style.display = "";
	} else {
		optiBouton.value = "Optimiser!";
		inputPV.value = listeSac.value;
		// Idem
		listeSac.setAttribute("name", "dummy");
		inputPV.setAttribute("name", "ai_NbPV");
		listeSac.parentNode.replaceChild(inputPV, listeSac);
		augmenteListeSac.style.display = "none";
		diminueListeSac.style.display = "none";
		refreshPertePV();
	}
}

function refreshDisplayListeSac() {
	indexMin = Math.max( 1,
		Math.min(indexMin, listeSac.children.length-1-nbValeurs),
	);
	setValue("SacrOptimal.indexMin", indexMin);
	var indexMax = Math.min(indexMin+nbValeurs, listeSac.children.length)-1;
	
	for (var i=1 ; i<listeSac.children.length-1 ; ++i) {
		if (i>indexMax || i<indexMin) {
			listeSac.childNodes[i].style.display = "none";
		} else {
			listeSac.childNodes[i].style.display = "";
		}
	}
	listeSac.selectedIndex = indexMin + Math.floor(nbValeurs/2);
	
	refreshPertePV();
}

function refreshPertePV() {
	var soin = Number(Optimiser ? listeSac.value : inputPV.value);
	if (isNaN(soin)) {
		pertePV.innerHTML = "---";
	} else {
		var nbD = Math.floor(soin/5) + 1;
		pertePV.innerHTML =
			"Points de Vie perdus : entre " + (soin+nbD) +
			" et " + (soin+3*nbD) +
			" (moyenne : " + (soin+2*nbD) + ")";
	}
}

function choixPlusGrands() {
	indexMin += Math.ceil(nbValeurs/2);
	refreshDisplayListeSac();
}

function choixPlusPetits() {
	indexMin -= Math.ceil(nbValeurs/2);
	refreshDisplayListeSac();
}

function plusDeChoix() {
	nbValeurs += 2;
	if (nbValeurs > 31) {
		nbValeurs = 31;
	}
	setValue("SacrOptimal.nbValeurs", nbValeurs);
	refreshDisplayListeSac();
	refreshPertePV();
}

function moinsDeChoix() {
	nbValeurs -= 2;
	if (nbValeurs < 1) {
		nbValeurs = 1;
	}
	setValue("SacrOptimal.nbValeurs", nbValeurs);
	refreshDisplayListeSac();
	refreshPertePV();
}

/*---------------------------------- Cervo -----------------------------------*/

// On vérifie que le sort lancé est bien Sacro :
var idSort = document.getElementsByName("ai_IdSort");
if (!idSort[0] || !idSort[0].value || idSort[0].value!=17) {
	window.console.log("[SacrOptimal] Pas un Sacrifice");
	return;
}

// On récupère les éléments du cadre fondamentaux pour le script :
var
	inputPV = document.getElementsByName("ai_NbPV")[0],
	titre4 = document.getElementsByClassName("titre4")[0],
	divAction = document.getElementsByClassName("Action")[0];
if (!inputPV || !titre4 || !divAction) {
	window.console.error("[SacrOptimal] Structure du cadre inconnue");
	return;
}

var
	// Bouton de mode (Normal <-> Optimisé) :
	optiBouton,
	// Liste des sacros optimaux :
	listeSac,
	augmenteListeSac, diminueListeSac,
	// Span contenant le texte de perte de PV :
	pertePV,
	
	// On récupère les données mémorisées
	// - État Normal / Optimisé :
	Optimiser = getValue("SacrOptimal.Optimiser")==1 ? 1 : 0,
	// - Nombre de valeurs affichées dans la liste :
	nbValeurs = Number(getValue("SacrOptimal.nbValeurs")) || 9,
	// - Valeur minimale par défaut du sacrifice en mode optimisé :
	indexMin = Number(getValue("SacrOptimal.indexMin")) || 1;

gestionTitre4();
initCalculSacro();
