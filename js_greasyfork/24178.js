// ==UserScript==
// @name        MH - H2P - Code Mutualisé
// @namespace   MH
// @description Code Mutualisé à utiliser dans les différents scripts MZ
// @include     http://games.mountyhall.com/*
// @icon        http://i.imgur.com/wnWRfSt.png/tout_MZ.png
// @version     0.12
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24178/MH%20-%20H2P%20-%20Code%20Mutualis%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/24178/MH%20-%20H2P%20-%20Code%20Mutualis%C3%A9.meta.js
// ==/UserScript==

/********************************************************************************
*	This file is part of Mountyzilla.											*
*																				*
*	Mountyzilla is free software; you can redistribute it and/or modify			*
*	it under the terms of the GNU General Public License as published by		*
*	the Free Software Foundation; either version 2 of the License, or			*
*	(at your option) any later version.											*
*																				*
*	Mountyzilla is distributed in the hope that it will be useful,				*
*	but WITHOUT ANY WARRANTY; without even the implied warranty of				*
*	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the				*
*	GNU General Public License for more details.								*
*																				*
*	You should have received a copy of the GNU General Public License			*
*	along with Mountyzilla; if not, write to the Free Software					*
*	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA	*
*********************************************************************************/

// x~x	marque pour s'y retrouver sous l'éditeur

/*
 * This file is part of MountyZilla (http://mountyzilla.tilk.info/),
 * published under GNU License v2.
 *
 * Patch :
 * gestion des missions terminées
 */

// URLs externes images (pas de souci CORS)
const URL_MZimg09 = 'http://mountyzilla.tilk.info/scripts_0.9/images/';
const URL_MZimg11 = 'http://mountyzilla.tilk.info/scripts_1.1/images/'
const URL_MZscriptCarte = "http://mountyzilla.tilk.info/scripts_0.8/carte_trajet2.php";

// URLs externes redirection (pas de souci CORS)
const URL_pageNiv = 'http://mountypedia.ratibus.net/mz/niveau_monstre_combat.php';
const URL_MZmountyhall = 'http://trolls.ratibus.net/mountyhall/';
const URL_AnatrolDispas = 'http://mountyhall.dispas.net/dynamic/';
const URL_vue_CCM = 'http://clancentremonde.free.fr/Vue2/RecupVue.php';
const URL_vue_Gloumfs2D = 'http://gloumf.free.fr/vue2d.php';
const URL_vue_Gloumfs3D = 'http://gloumf.free.fr/vue3d.php';
const URL_vue_Grouky= 'http://mh.ythogtha.org/grouky.py/grouky';
const URL_ratibus_lien = 'http://trolls.ratibus.net/';
//const URL_tilk_js = 'http://mountyzilla.tilk.info/scripts/';	// un de moins \o/
const URL_troc_mh = 'http://troc.mountyhall.com/search.php';
const URL_cyclotrolls = 'http://www.cyclotrolls.be/';
const URL_CertifRaistlin = 'https://cdm.mh.raistlin.fr/mz/niveau_monstre_combat.php';

// URLs externes ajax (nécessite l'entête CORS, solution actuelle : passage chez raistlin)
var URL_MZinfoMonstre = 'http://cdm.mh.raistlin.fr/mz/monstres_0.9_FF.php';	// redirigé vers mountypedia.free.fr
var URL_MZinfoMonstrePost = 'http://cdm.mh.raistlin.fr/mz/monstres_0.9_post_FF.php';	// redirigé vers mountypedia.free.fr
var URL_pageDispatcher = "http://cdm.mh.raistlin.fr/mz/cdmdispatcher.php";		// envoi des CdM, redirigé vers mountypedia.free.fr
// pour passer en mode IP, commenter les 3 lignes précédentes et décommenter les 3 suivantes
//var URL_MZinfoMonstre = 'http://192.99.225.92/mz/monstres_0.9_FF.php';
//var URL_MZinfoMonstrePost = 'http://192.99.225.92/mz/monstres_0.9_post_FF.php';
//var URL_pageDispatcher = 'http://192.99.225.92/mz/cdmdispatcher.php';
// ceux-ci rendent bien les 2 entêtes CORS
const URL_anniv = 'http://mountyzilla.tilk.info/scripts/anniv.php'; // Url de récup des jubilaires:
const URL_rss = 'http://mountyzilla.tilk.info/news/rss.php';	// Flux RSS des news MZ
const URL_trooglebeta = 'http://troogle-beta.aacg.be/view_submission';

 // x~x mission_liste

function checkLesMimis() {
	try {
		var titresMimis = document.evaluate("//div[@class='mh_titre3']/b/a[contains(@href,'Mission_')]", document, null, 7, null);
		var obMissions = JSON.parse(MY_getValue(numTroll + '.MISSIONS'));
	} catch(e) {
		window.console.error('[MZ mission_liste] Erreur initialisation:\n' + e);
		return;
	}

	var enCours = {};
	for (var i = 0 ; i < titresMimis.snapshotLength ; i++) {
		var num = titresMimis.snapshotItem(i).textContent.match(/\d+/)[0];
		enCours[num] = true;
	}

	for (var numMimi in obMissions) {
		if (!enCours[numMimi]) {
			delete obMissions[numMimi];
		}
	}
	MY_setValue(numTroll + '.MISSIONS', JSON.stringify(obMissions));
}

function do_mission_liste() {
	checkLesMimis();
}

// x~x actions

/* TODO
 * getLvl pour Explo, Rotobaffe et cie
 */

/*								Page de combat								*/
function getLevel() {
	var divList = document.getElementsByTagName('div');
	if (divList.length <= 2) {
		return;
	}

	// On essaie de voir si cette action était une attaque
	var pList = document.getElementsByTagName('p');
	var nomM = '';
	// Modification pour Frénésie by TetDure
	var numAtt = 0;
	for (var i = 0 ; i < pList.length ; i++) {
		if (pList[i].firstChild) {
			nomM = pList[i].firstChild.nodeValue;
			if (nomM && nomM.indexOf('Vous avez attaqué un') == 0) {
				numAtt++;
			}
		}
	}

	if (nomM == '') {
		return;
	}

	// Si c'est une attaque normale, un seul PX
	var comPX = 1;
	if (divList[2].firstChild.nodeValue.indexOf('Attaque Normale') == -1 && numAtt != 2) {
		comPX++;
	}

	// Extraction des infos du monstre attaqué
	var idM;
	var male;
	if (nomM.slice(20, 21) == 'e') {
		male = false;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(22, nomM.indexOf('(') - 1);
	} else {
		male = true;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(21, nomM.indexOf('(') - 1);
	}

	if (idM == '') {
		return;
	}

	var bList = document.getElementsByTagName('b');
	var niveau = '';
	for (var i = 0 ; i < bList.length ; i++) {
		var b = bList[i];
		if (b.childNodes[0].nodeValue != "TUÉ") {
			continue;
		}
		var nbPX = "";
		for (i++ ; i < bList.length ; i++) {
			// Si plusieurs monstres ont été tués (par ex. explo), on ne peut pas déduire leurs niveaux
			if (bList[i].childNodes[0].nodeValue == "TUÉ") {
				return;
			}
			if (bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if (nbPX == '') {
			return;
		}
		// Si on arrive ici c'est qu'on a trouvé un (et un seul) monstre tué et les PX gagnés
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if (!nbPX) {
			nbPX = 0;
		}
		chaine = (male ? "Il" : "Elle") + " était de niveau ";
		niveau = (nbPX * 1 + 2 * nivTroll - 10 - comPX) / 3;
		if (comPX > nbPX) {
			chaine += "inférieur ou égal à " + Math.floor(niveau) + ".";
			niveau = "";
		} else if (Math.floor(niveau) == niveau) {
			chaine += niveau + ".";
		} else {
			chaine = "Mountyzilla n'est pas arrivé à calculer le niveau du monstre.";
			niveau = "";
		}
		insertBr(b.nextSibling.nextSibling.nextSibling);
		insertText(b.nextSibling.nextSibling.nextSibling, chaine);
	}

	if (niveau != '') {
		var button = insertButtonCdm('as_Action');
		button.setAttribute("onClick", "window.open('" + URL_pageNiv + "?id=" + (idM * 1) + "&monstre="
				+ escape(nomM) + "&niveau=" + escape(niveau)
				+ "', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value = 'Merci de votre participation'; this.disabled = true;");
	}
}


/*-[functions]------------- Messages du bot : MM/RM --------------------------*/

function insertInfoMagie(node, intitule, magie) {
	if (node.nextSibling) {
		node = node.nextSibling;
		insertBr(node);
		insertText(node, intitule);
		insertText(node, magie, true);
	} else {
		node = node.parentNode;
		appendBr(node);
		appendText(node, intitule);
		appendText(node, magie, true);
	}
}

function getMM(sr) {
	if (rmTroll <= 0) {
		return 'Inconnue (quelle idée d\'avoir une RM valant' + rmTroll + ' !)';
	}
	sr = Number(sr.match(/\d+/)[0]);
	if (sr == 10) {
		return '\u2265 ' + 5 * rmTroll;
	}
	if (sr <= 50) {
		return Math.round(50 * rmTroll / sr);
	}
	if (sr < 90) {
		return Math.round((100 - sr) * rmTroll / 50);
	}
	return '\u2264 ' + Math.round(rmTroll / 5);
}

function traiteMM() {
	var node = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de Résistance')]/text()[1]", document, null, 9, null).singleNodeValue;

	if (node) {
		var mm = getMM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
	} else {
		var node = document.evaluate("//p/text()[contains(., 'Seuil de Résistance')]", document, null, 9, null).singleNodeValue;
		if (!node) {
			return;
		}
		var mm = getMM(node.nodeValue);
		node = node.nextSibling.nextSibling;
	}
	insertInfoMagie(node, 'MM approximative de l\'Attaquant...: ', mm);
}

function getRM(sr) {
	if (mmTroll <= 0) {
		return 'Inconnue (quelle idée d\'avoir une MM valant' + mmTroll + ' !)';
	}
	sr = Number(sr.match(/\d+/)[0]);
	if (sr == 10) {
		return '\u2264 ' + Math.round(mmTroll / 5);
	}
	if (sr <= 50) {
		return Math.round(sr * mmTroll / 50);
	}
	if (sr < 90) {
		return Math.round(50 * mmTroll / (100 - sr));
	}
	return '\u2265 ' + 5 * mmTroll;
}

function traiteRM() {
	var nodes = document.evaluate("//b[contains(preceding::text()[1],'Seuil de Résistance')]/text()[1]", document, null, 7, null);
	if (nodes.snapshotLength == 0) {
		return;
	}

	for (var i = 0 ; i < nodes.snapshotLength ; i++) {
		var node = nodes.snapshotItem(i);
		var rm = getRM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		insertInfoMagie(node, 'RM approximative de la Cible.......: ', rm);
	}
}

/*					Fonction stats IdT par Raistlin					*/
/*function getIdt() {
	if (MY_getValue("SEND_IDT") == "non") {
		return false;
	}

	var regExpBeginning = /^\s+/;
	var regExpEnd = /\s+$/;

	var nomIdt = document.evaluate("//tr/td[contains(p/text(),'identification a donné le résultat suivant : ')]/b/text()", document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (!nomIdt) {
		return false;
	}

	var caracIdt;
	if (nomIdt.indexOf("Malédiction !") != -1) {
		caracIdt = "";
		nomIdt = "Mission maudite";
	} else {
		caracIdt = nomIdt.slice(nomIdt.indexOf("(") + 1, nomIdt.indexOf(")"));
		nomIdt = nomIdt.slice(nomIdt.indexOf(" - ") + 3);
		nomIdt = nomIdt.slice(0, nomIdt.indexOf("(") - 1);
		nomIdt = nomIdt.replace(regExpBeginning, "").replace(regExpEnd, "");
	}
	FF_XMLHttpRequest({
		method: 'GET',
		url: idtURL + "?item=" + escape(nomIdt) + "&descr=" + escape(caracIdt),
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		}
	});
	return true;
}*/


/*-[functions]------------------- Décalage DLA -------------------------------*/

function confirmeDecalage() {
	// On vérifie que MH n'excluera pas déjà la demande (validNumeric)
	var nbMinutes = document.getElementById('ai_NbMinutes').value;
	if (!nbMinutes || isNaN(nbMinutes) || nbMinutes<1) {
		return false;
	}

	var newDLA = new Date(oldDLA);
	newDLA.setMinutes(newDLA.getMinutes() + Number(nbMinutes));
	return window.confirm('Votre DLA sera décalée au : ' + newDLA.toLocaleString() + '\nConfirmez-vous ce décalage ?');
}

function newsubmitDLA(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if (confirmeDecalage()) {
		this.submit();
	}
}

function changeActionDecalage() {
	if (MY_getValue('CONFIRMEDECALAGE') != 'true') {
		return;
	}
	try {
		// On récupère le contenu du script JS MH de calcul du décalage
		var scriptTxt = document.evaluate(".//script[ not(@src) ]", document, null, 9, null).singleNodeValue.textContent;
		// On en extrait la DLA courante
		scriptTxt = scriptTxt.slice(scriptTxt.indexOf('new Date(') + 9);
		scriptTxt = scriptTxt.split('\n')[0];
		var nbs = scriptTxt.match(/\d+/g);
		oldDLA = new Date(nbs[0], nbs[1], nbs[2], nbs[3], nbs[4], nbs[5]);
	} catch(e) {
		avertissement('Erreur de parsage : confirmation de décalage impossible');
		window.console.error('[changeActionDecalage] DLA non trouvée', e);
		return;
	}
	var form = document.getElementsByName('ActionForm')[0];
	if (form) {
		form.addEventListener('submit', newsubmitDLA, true);
	} else {
		avertissement('Erreur de parsage : confirmation de décalage impossible');
		window.console.error('[changeActionDecalage] ActionForm non trouvé');
	}
}

/*-[functions]------------------- Alerte Mundi -------------------------------*/

function prochainMundi() {
	try {
		var node = document.evaluate("//div[@class='dateAction']/b", document, null, 9, null).singleNodeValue;
	} catch(e) {
		window.console.error('[prochainMundi] Date introuvable', e);
		return;
	}
	if (!node) {
		return;
	}

	var longueurMois = node.textContent.indexOf('Saison du Hum') == -1 ? 28 : 14;
	var jour = longueurMois + 1 - getNumber(node.textContent);
	if (node.textContent.indexOf('Mundidey') != -1) {
		jour = longueurMois;
	}
	var txt = '[Prochain Mundidey ';
	if (jour > 1) {
		txt += 'dans ' + jour + ' jours]';
	} else {
		txt += 'demain]';
	}
	insertText(node.parentNode.nextSibling, txt, true);
}


//TODO XBT
// x~x vue

/* TODO
 * /!\ bug latent sur diminution bonusPV (perte Telaite / template Ours),
 * prévoir fix ("delete infos")
 */

/*--------------------------- Variables Globales -----------------------------*/

// Infos remplies par des scripts extérieurs
var listeCDM = [], listeLevels = [];

// Position actuelle
var currentPosition=[0, 0, 0];

// Portées de la vue : [vueHpure, vueVpure, vueHlimitée, vueVlimitée]
var porteeVue=[0, 0, 0, 0];

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;
document.onmousemove = drag;

// Diplomatie
var Diplo = {
	Guilde: {},
	Troll: {},
	Monstre: {}
	// .mythiques: uniquement si option activée
};
var isDiploRaw = true; // = si la Diplo n'a pas encore été analysée

// Infos tactiques
var popup;

// Gère l'affichage en cascade des popups de CdM
var nbCDM = 0;

var isCDMsRetrieved = false; // = si les CdM ont déjà été DL

// Utilisé pour supprimer les monstres "engagés"
var listeEngages = {};
var isEngagesComputed = false;
var cursorOnLink = false; // DEBUG: wtf ?

var needComputeEnchantement = MY_getValue(numTroll + '.enchantement.liste') && MY_getValue(numTroll + '.enchantement.liste') != '';

// Checkboxes de filtrage
var checkBoxGG, checkBoxCompos, checkBoxBidouilles, checkBoxIntangibles,
	checkBoxDiplo, checkBoxTrou, checkBoxEM, checkBoxTresorsNonLibres,
	checkBoxTactique, checkBoxLevels, checkBoxGowaps, checkBoxEngages,
	comboBoxNiveauMin, comboBoxNiveauMax;

/* [functions] Tableau d'Infos */
function initialiseInfos() {
	// DEBUG: prévoir désactivation complète du script si infoTab non trouvé
	var
		infoTab = document.getElementsByName('LimitViewForm')[0].
			getElementsByTagName('table')[0],
		tbody = infoTab.tBodies[0],
		thead = infoTab.createTHead(),
		tr = appendTr(thead,'mh_tdtitre'),
		td = appendTdText(tr,'INFORMATIONS',true),
		span = document.createElement('span');

	// Récupération de la position du joueur
	try {
		var strPos = document.evaluate(
				".//li/b/text()[contains(.,'X = ')]",
				infoTab, null, 9, null
			).singleNodeValue.nodeValue;
		// ***INIT GLOBALE*** currentPosition
		currentPosition = getNumbers(strPos);
		debugMZ("retrievePosition(): "+currentPosition);
	} catch(e) {
		// Si on ne trouve pas le "X ="
		window.console.error("[MZ Vue] Position joueur non trouvée",e);
	}

	// Récupération des portées (max et limitée) de la vue
	try {
		var
			nodes = document.evaluate(
				".//li/b/text()[contains(.,'horizontalement') "+
				"or contains(.,'verticalement')]",
				infoTab, null, 7, null
			),
			array = [];
		for (var i=0 ; i<4 ; i++) {
			array.push(parseInt(nodes.snapshotItem(i).nodeValue));
		}
		// ***INIT GLOBALE*** porteeVue
		porteeVue = array;
	} catch(e) {
		window.console.error("[MZ Vue] Portées Vue non trouvées",e);
	}

	infoTab.id = 'infoTab'; // Pour scripts externes
	tbody.id = 'corpsInfoTab';
	tbody.rows[0].cells[0].colSpan = 2;
	td.colSpan = 3;
	td.onmouseover = function() {
		this.style.cursor = 'pointer';
		this.className = 'mh_tdpage';
	};
	td.onmouseout = function() {
		this.className = 'mh_tdtitre';
	};
	td.onclick = function() {
		toggleTableauInfos(false);
	};

	span.id = 'msgInfoTab';
	span.style.display = 'none';
	appendText(
		span,
		' => Position : X = '+currentPosition[0]+
		', Y = '+currentPosition[1]+
		', N = '+currentPosition[2]+
		' --- Vue : '+porteeVue[0]+'/'+porteeVue[1]+
		' ('+porteeVue[2]+'/'+porteeVue[3]+')',
		true
	);
	td.appendChild(span);

	tr = appendTr(tbody,'mh_tdpage');
	td = appendTdText(tr,'EFFACER : ',true);
	td.align = 'center';
	td.className = 'mh_tdtitre';
	td.width = 100;
	td = appendTdCenter(tr,2);
	// DEBUG : à quoi servent les ids si on utilise des var globales ?
	checkBoxGG = appendCheckBoxSpan(
		td,'delgg',filtreTresors," Les GG'"
	).firstChild;
	checkBoxCompos = appendCheckBoxSpan(
		td,'delcomp',filtreTresors,' Les Compos'
	).firstChild;
	checkBoxBidouilles = appendCheckBoxSpan(
		td,'delbid',filtreTresors,' Les Bidouilles'
	).firstChild;
	checkBoxIntangibles = appendCheckBoxSpan(
		td,'delint',filtreTrolls,' Les Intangibles'
	).firstChild;
	checkBoxGowaps = appendCheckBoxSpan(
		td,'delgowap',filtreMonstres,' Les Gowaps'
	).firstChild;
	checkBoxEngages = appendCheckBoxSpan(
		td,'delengage',filtreMonstres,' Les Engagés'
	).firstChild;
	checkBoxLevels = appendCheckBoxSpan(
		td,'delniveau',toggleLevelColumn,' Les Niveaux'
	).firstChild;
	checkBoxDiplo = appendCheckBoxSpan(
		td,'delDiplo',refreshDiplo,' La Diplomatie'
	).firstChild;
	checkBoxTrou = appendCheckBoxSpan(
		td,'deltrou',filtreLieux,' Les Trous'
	).firstChild;
	checkBoxMythiques = appendCheckBoxSpan(
		td,'delmyth',filtreMonstres,' Les Mythiques'
	).firstChild;
	if (MY_getValue('NOINFOEM')!='true') {
		checkBoxEM = appendCheckBoxSpan(
			td,'delem',filtreMonstres,' Les Composants EM'
		).firstChild;
	}
	checkBoxTresorsNonLibres = appendCheckBoxSpan(
		td,'deltres',filtreTresors,' Les Trésors non libres'
	).firstChild;
	checkBoxTactique = appendCheckBoxSpan(
		td,'deltactique',updateTactique,' Les Infos tactiques'
	).firstChild;

	if (MY_getValue('INFOPLIE')) {
		toggleTableauInfos(true);
	}
}

function toggleTableauInfos(firstRun) {
	var
		msg = document.getElementById('msgInfoTab'),
		corps = document.getElementById('corpsInfoTab'),
		infoplie = parseInt(MY_getValue('INFOPLIE'));	// 27/032016 Roule, pb sur récupération booléen, force numérique
		//window.console.log('toggleTableauInfos(' + firstRun + '), début, INFOPLIE=' + MY_getValue('INFOPLIE') + ', !INFOPLIE=' + !MY_getValue('INFOPLIE') + ', infoplie=' + infoplie);	// debug Roule
	if (!firstRun) {
		infoplie = !infoplie;
		MY_setValue('INFOPLIE', infoplie ? 1 : 0);	// 27/032016 Roule, pb sur récupération booléen, force numérique
		//window.console.log('toggleTableauInfos(' + firstRun + '), après toggle et set, INFOPLIE=' + MY_getValue('INFOPLIE') + ', infoplie=' + infoplie);	// Debug Roule
	}
	if (infoplie) {
		msg.style.display = '';
		corps.style.display = 'none';
	} else {
		msg.style.display = 'none';
		corps.style.display = '';
	}
}


// x~x libs

/* TODO
 * - revoir la gestion des CdM --> nott armure magique
 * - revoir tout ce qui est lié à la vue (estimateurs dég nott)
 * - vérfier la gestion des enchants
 */

// Roule 04/09/2016 switch extern URLs to https if available
var isHTTPS = false;
if (window.location.protocol.indexOf('https') == 0) {
	URL_MZinfoMonstre = URL_MZinfoMonstre.replace(/http:\/\//, 'https://');
	URL_MZinfoMonstrePost = URL_MZinfoMonstrePost.replace(/http:\/\//, 'https://');
	URL_pageDispatcher = URL_pageDispatcher.replace(/http:\/\//, 'https://');
	isHTTPS = true;
}

var MHicons = '/mountyhall/Images/Icones/';

// Active l'affichage des log de DEBUG (fonction debugMZ(str))
var MY_DEBUG = false;

/* Remplacement fonction MZ */
function MY_getValue(key) {
	return window.localStorage[key] != null ? window.localStorage[key] : '';
}

function MY_removeValue(key) {
	window.localStorage.removeItem(key);
}

function MY_setValue(key, val) {
	window.localStorage[key] = val;
}

function isPage(url) {
	return window.location.pathname.indexOf("/mountyhall/" + url) == 0;
}

/*---------------- Mise à jour de variables globales utiles ------------------*/
// Utilisé pour accès BDD (un peu partout) :
var numTroll = MY_getValue('NUM_TROLL');
// Utilisé dans vue pour PX :
var nivTroll = MY_getValue('NIV_TROLL');
// Utilisés dans actions et vue (calculs SR) :
var mmTroll = MY_getValue(numTroll + '.caracs.mm');
var rmTroll = MY_getValue(numTroll + '.caracs.rm');

/* DEBUG: NETTOYAGE TAGS */
if (MY_getValue(numTroll + '.TAGSURL')) {
	MY_removeValue(numTroll + '.TAGSURL');
}

/*-[functions]------------ Fonctions durée de script -------------------------*/
var date_debut = null;

function start_script(nbJours_exp) {
	if (date_debut) {
		return;
	}
	date_debut = new Date();
	// Crée la variable expdate si demandé
	if (nbJours_exp) {
		expdate = new Date();
		expdate.setTime(expdate.getTime() + nbJours_exp * 864e5);
	}
}

function displayScriptTime() {
	var footerNode = document.getElementById('footer2');
	if (!footerNode) {
		return;
	}
	try {
		var node = document.evaluate(".//text()[contains(., 'Page générée en')]/../br", footerNode, null, 9, null).singleNodeValue;
	} catch(e){
		return;
	}
	insertText(node, ' - [Script exécuté en ' + (new Date().getTime() - date_debut.getTime()) / 1000 + ' sec.]');
}

/*---------- Regroupement des getPortee() ------------------------------------*/
// Issu des script profil et profil2
function getPortee__Profil(param) {
	param = Math.max(0, Number(param));
	return Math.ceil(Math.sqrt(2 * param + 10.75) - 3.5);
	// ça devrait être floor, +10.25, -2.5
}

// Issu du script vue
function getPortee__Vue(param) {
	return Math.ceil((Math.sqrt(19 + 8 * (param + 3)) - 7) / 2);
}

/*-[functions]---------- DEBUG: Communication serveurs -----------------------*/
function debugMZ(str) {
	if (MY_DEBUG) {
		window.console.debug('[MY_DEBUG] ' + str);
		if (typeof str == "object") {
			window.console.debug(str);
		}
	}
}

function FF_XMLHttpRequest(MY_XHR_Ob) {
	var request = new XMLHttpRequest();
	request.open(MY_XHR_Ob.method,MY_XHR_Ob.url);
	for (var head in MY_XHR_Ob.headers) {
		request.setRequestHeader(head, MY_XHR_Ob.headers[head]);
	}
	request.onreadystatechange = function() {
		//window.console.log('XMLHttp readystatechange readyState = ' + request.readyState + ', error = ' + request.error + ', status = ' + request.status);
		if (request.readyState!=4) {
			return;
		}
		if (request.error) {
			if (MY_XHR_Ob.onerror) {
				MY_XHR_Ob.onerror(request);
			}
		} else if (MY_XHR_Ob.onload) {
			/* DEBUG: Ajouter à request les pptés de MY_XHR_Ob à transmettre */
			MY_XHR_Ob.onload(request);
		}
	};
	request.send(MY_XHR_Ob.data);
}


/*-[functions]-------------- Interface utilisateur ---------------------------*/
function avertissement(txt, duree) {
	if (!duree) {
		duree = 5000;
	}
	var div = document.createElement('div');
	// On numérote les avertissements pour destruction sélective
	var num = document.getElementsByName('avertissement').length;
	div.num = num;
	// Numéro enregistré dans le DOM pour récupération sur getElementsByName()
	div.setAttribute('name', 'avertissement');
	div.className = 'mh_textbox';
	div.style =
		'position:fixed;' +
		'top:' + (10 + 15 * num) + 'px;' +
		'left:' + (10 + 5 * num) + 'px;' +
		'border:1px solid #000000;' +
		'z-index:' + (2 + num) + ';' +
		'cursor:crosshair;';
	div.innerHTML = txt;
	div.onclick = function() {
		tueAvertissement(this.num);
	};
	document.body.appendChild(div);
	// Destruction automatique de l'avertissement après 3 sec :
	window.setTimeout(function() {tueAvertissement(num)}, duree);
}

function tueAvertissement(num) {
	var divs = document.getElementsByName('avertissement');
	if (divs.length == 0) {
		return;
	}
	for (var i = 0 ; i < divs.length ; i++) {
		if (divs[i].num == num) {
			divs[i].parentNode.removeChild(divs[i]);
			return;
		}
	}
}

/*-[functions]-------------- Modifications du DOM ----------------------------*/
function insertBefore(next, el) {
	next.parentNode.insertBefore(el, next);
}

function appendTr(tbody, clas) {
	var tr = document.createElement('tr');
	if (clas) {
		tr.className = clas;
	}
	tbody.appendChild(tr);
	return tr;
}

function insertTr(next, clas) {
	var tr = document.createElement('tr');
	if (clas) {
		tr.className = clas;
	}
	insertBefore(next, tr);
	return tr;
}

function appendTd(tr) {
	var td = document.createElement('td');
	if (tr) {
		tr.appendChild(td);
	}
	return td;
}

function insertTd(next) {
	var td = document.createElement('td');
	insertBefore(next, td);
	return td;
}

function appendTdCenter(tr, colspan) {
	var td = appendTd(tr);
	td.align = 'center'; // WARNING - Obsolete
	if (colspan) {
		td.colSpan = colspan;
	}
	return td;
}

function insertTdElement(next, el) {
	var td = insertTd(next);
	if (el) {
		td.appendChild(el);
	}
	return td;
}

function appendText(paren, text, bold) {
	if (bold) {
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
	} else {
		paren.appendChild(document.createTextNode(text));
	}
}

function insertText(next, text, bold) {
	if (bold) {
		var b = document.createElement('b');
		appendText(b, text);
		insertBefore(next, b);
	} else {
		insertBefore(next, document.createTextNode(text));
	}
}

function appendTdText(tr, text, bold) {
	var td = appendTd(tr);
	appendText(td, text, bold);
	return td;
}

function insertTdText(next, text, bold) {
	var td = insertTd(next);
	appendText(td, text, bold);
	return td;
}

function appendBr(paren) {
	paren.appendChild(document.createElement('br'));
}

function insertBr(next) {
	insertBefore(next,document.createElement('br'));
}

function appendLI(ul, text) {
	// Uniquement utilisé dans les options (crédits)
	var li = document.createElement('li');
	appendText(li, text);
	ul.appendChild(li);
	return li;
}

function appendTextbox(paren, type, nam, size, maxlength, value) {
	var input = document.createElement('input');
	input.className = 'TextboxV2';
	input.type = type;
	input.name = nam;
	input.id = nam;
	input.size = size;
	input.maxLength = maxlength;
	if (value) {
		input.value = value;
	}
	paren.appendChild(input);
	return input;
}

function appendCheckBox(paren, nam, checked, onClick) {
	var input = document.createElement('input');
	input.type = 'checkbox';
	input.name = nam;
	input.id = nam;
	if (checked) {
		input.checked = true;
	}
	if (onClick) {
		input.onclick = onClick;
	}
	paren.appendChild(input);
	return input;
}

function appendNobr(paren, id, delgg, text) {
	var nobr = document.createElement('nobr');
	appendCheckBox(nobr, id, null, delgg);
	appendText(nobr, text);
	paren.appendChild(nobr);
	appendText(paren, '   ');
	return nobr;
}

function appendCheckBoxSpan(paren, id, onClick, text) {
	var span = document.createElement('span');
	span.style.whiteSpace = 'nowrap';
	appendCheckBox(span, id, false, onClick);
	appendText(span, text);
	paren.appendChild(span);
	appendText(paren, '   ');
	return span;
}

function appendOption(select, value, text) {
	var option = document.createElement('option');
	option.value = value;
	appendText(option, text);
	select.appendChild(option);
	return option;
}

function appendHidden(form, nam, value) {
	var input = document.createElement('input');
	input.type = 'hidden';
	input.name = nam;
	input.id = nam;
	input.value = value;
	form.appendChild(input);
}

function appendButton(paren, value, onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function() {
		this.style.cursor = 'pointer';
	};
	if (onClick) {
		input.onclick = onClick;
	}
	paren.appendChild(input);
	return input;
}

function insertButton(next, value, onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function() {
		this.style.cursor = 'pointer';
	};
	input.onclick = onClick;
	insertBefore(next, input);
	return input;
}

function appendSubmit(paren, value, onClick) {
	var input = document.createElement('input');
	input.type = 'submit';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function() {
		this.style.cursor = 'pointer';
	};
	if (onClick) {
		input.onclick = onClick;
	}
	paren.appendChild(input);
	return input;
}

function createImage(url, title) {
	var img = document.createElement('img');
	img.src = url;
	img.title = title;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	return img;
}

function createAltImage(url, alt, title) {
	var img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	img.title = title;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	return img;
}

function createImageSpan(url, alt, title, text, bold) {
	var span = document.createElement('span');
	span.title = title;
	var img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	span.appendChild(img);
	appendText(span, text, bold);
	return span;
}

function createCase(titre, table, width) {
	if (!width) {
		width = 120;
	}
	var tr = appendTr(table, 'mh_tdpage');
	var td = appendTdText(tr, titre, true);
	td.className = 'mh_tdtitre';
	td.width = width;
	td = appendTdText(tr,'');
	td.className = 'mh_tdpage';
	return td;
}

function getMyID(e) {
	var parent = e.parentNode;
	for (var i = 0 ; i < parent.childNodes.length ; i++) {
		if (e == parent.childNodes[i]) {
			return i;
		}
	}
	return -1;
}

function insertAfter(elt, newElt) {
	var id = getMyID(elt);
	if (id == -1) {
		return;
	}
	if (id < elt.parentNode.childNodes.length - 1) {
		insertBefore(elt.nextSibling, newElt);
	} else {
		elt.parentNode.appendChild(newElt);
	}
}

/*-[functions]-------------- Fonctions d'insertion ---------------------------*/

function insertTitle(next, txt) {
	var div = document.createElement('div');
	div.className = 'titre2';
	appendText(div, txt);
	insertBefore(next, div);
}

function insertMainTable(next) {
	var table = document.createElement('table');
	table.width = '98%';
	table.border = 0;
	table.align = 'center';
	table.cellPadding = 2;
	table.cellSpacing = 1;
	table.className = 'mh_tdborder';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	insertBefore(next, table);
	return tbody;
}

function appendSubTable(node) {
	var table = document.createElement('table');
	table.width = '100%';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	node.appendChild(table);
	return tbody;
}

function insertOptionTable(insertPt) {
	var mainBody = insertMainTable(insertPt);

	/* Liens dans le Menu */
	var tr = appendTr(mainBody, 'mh_tdtitre');
	var td = appendTdText(tr, 'Hyperliens ajoutés dans le Menu :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendText(td, 'Icône du Menu: ');
	var url = MY_getValue(numTroll + '.ICOMENU');
	if (!url) {
		url = URL_MZimg09 + 'MY_logo_small.png';
	}
	appendTextbox(td,'text', 'icoMenuIco', 50, 200, url);
	appendButton(td, 'Réinitialiser', resetMainIco);

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	var tbody = appendSubTable(td);
	tbody.id = 'linksBody';
	refreshLinks();

	td = appendTdCenter(appendTr(mainBody, 'mh_tdpage'));
	appendButton(td, 'Ajouter', addLinkField);
	appendButton(td, 'Supprimer', removeLinkField);

	/* Options de la Vue : vue externe, nb de CdM, etc */
	tr = appendTr(mainBody, 'mh_tdtitre');
	appendTdText(tr, 'Options de la Vue :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);

	tr = appendTr(tbody);
	td = appendTdText(tr, 'Vue externe : ');
	var select = document.createElement('select');
	select.id = 'vueext';
	td.appendChild(select);
	var listeVues2D = [
		'Bricol\' Vue',
		'Vue du CCM',
		'Vue Gloumfs 2D',
		'Vue Gloumfs 3D',
		'Grouky Vue!'
	];
	for (var i = 0 ; i < listeVues2D.length ; i++) {
		appendOption(select,listeVues2D[i],listeVues2D[i]);
	}
	if (MY_getValue('VUEEXT')) {
		select.value = MY_getValue('VUEEXT');
	}

	td = appendTd(tr);
	appendCheckBox(td, 'noInfoEM', MY_getValue('NOINFOEM') == 'true');
	appendText(td, ' Masquer les informations à propos de l\'écriture magique');

	tr = appendTr(tbody);
	td = appendTdText(tr, 'Nombre de CdM automatiquement récupérées : ');
	appendTextbox(td, 'text', 'maxcdm', 5, 10, MY_getValue(numTroll + '.MAXCDM'));

	td = appendTd(tr);
	appendCheckBox(td, 'usecss', MY_getValue(numTroll + '.USECSS') == 'true');
	appendText(td, ' Utiliser la CSS pour les couleurs de la diplomatie');

	/* Interface Tactique */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Interface Tactique : ', true);
	select = document.createElement('select');
	select.id = 'itSelect';
	appendOption(select, 'none', 'Aucune');
	appendOption(select, 'bricol', 'Système Tactique des Bricol\'Trolls');
	// seule interface supportée !
	td.appendChild(select);

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);
	tbody.id = 'itBody';
	select.onchange = onChangeIT;
	var str = MY_getValue(numTroll + '.INFOSIT');
	if (str) {
		select.value = str.slice(0, str.indexOf('$'));
		onChangeIT();
	}

	/* Options diverses */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Options diverses :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBox(td, 'infocarac', MY_getValue('INFOCARAC') != 'false');
	appendText(td, ' Afficher les caractéristiques des équipements des autres Trõlls');

	/*
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBox(td, 'send_idt', MY_getValue(numTroll + '.SEND_IDT') != 'non')
	appendText(td, ' Envoyer les objets identifiés au système de stats');
	*/

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBox(td, 'autoCdM', MY_getValue(numTroll + '.AUTOCDM') == 'true');
	appendText(td, ' Envoyer automatiquement les CdM vers la base MountyZilla');

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBox(td, 'vueCarac', MY_getValue('VUECARAC') == 'true');
	appendText(td, ' Afficher la Vue avec les caractéristique dans le Profil');

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBox(td, 'confirmeDecalage', MY_getValue('CONFIRMEDECALAGE') == 'true');
	appendText(td, ' Demander confirmation lors d\'un décalage de DLA');

	td = appendTd(appendTr(mainBody, "mh_tdpage"));
	appendCheckBox(td, "oldShoolStyle", MY_getValue(numTroll + ".OLDSCHOOL") == "true");
	appendText(td, " Ouvrir l'ancien profil par défaut");

	/* Bouton SaveAll */
	td = appendTdCenter(appendTr(mainBody, 'mh_tdtitre'));
	input = appendButton(td, 'Sauvegarder', saveAll);
	input.id = 'saveAll';
}

function insertCreditsTable(insertPt) {
	var tbody = insertMainTable(insertPt);

	var td = appendTdText(appendTr(tbody, 'mh_tdtitre'), 'Depuis son origine, nombreux sont ceux qui ont contribué à faire de MountyZilla ce qu\'il est aujourd\'hui. Merci à eux !' );

	var ul = document.createElement('ul');
	td.appendChild(ul);
	appendLI(ul, 'Fine fille (6465) pour les popup javascript');
	appendLI(ul, 'Reivax (4234) pour les infos bulles');
	appendLI(ul, 'Noc (2770) pour les moyennes des caracs');
	appendLI(ul, 'Endymion (12820) pour les infos sur les comp/sorts');
	appendLI(ul, 'Ratibus (15916) pour l\'envoi de CdM');
	appendLI(ul, 'TetDure (41931) pour les PVs restants dans les CdM');
	appendLI(ul, 'Les Teubreux pour leur bestiaire !');
	appendLI(ul, 'Les développeurs de vue qui font des efforts pour s\'intégrer à Mountyzilla');
	appendLI(ul, 'Gros Kéké (233) qui permet de tester le script aux limites du raisonnable avec sa vue de barbare');
	appendLI(ul, 'TuttiRikikiMaoussKosTroll (61214) pour le script sur les caracs de l\'équipement');
	appendLI(ul, 'Ashitaka (9485) pour le gros nettoyage de l\'extension, des scripts, et beaucoup de choses à venir');
	appendLI(ul, 'Tous ceux de l\'ancienne génération oubliés par Tilk');
	appendLI(ul, 'Zorya (28468), Vapulabehemot (82169), Breizhou13 (50233)... et tous les participants au projet ZoryaZilla');
	appendLI(ul, 'Yoyor (87818) pour diverses améliorations de code');
	appendLI(ul, 'Rokü Menton-brûlant (108387) pour m\'avoir incité à passer sur GitHub');
	appendLI(ul, 'Rouletabille (91305) & Marmotte (93138) pour leur support technique récurrent');
	appendLI(ul, 'Hennet (74092) pour le script du nouveau profil');
	appendLI(ul, 'Tous les testeurs de la nouvelle génération oubliés par Dabihul');
}

/*-[functions]------- Fonctions de mise en forme du texte --------------------*/
function aff(nb) {
	return (nb >= 0) ? '+' + nb : nb;
}

function getNumber(str) {
	var nbr = str.match(/\d+/);
	return nbr ? Number(nbr[0]) : Number.NaN;
}

function getNumbers(str) {
	var nbrs = str.match(/-?\d+/g);
	for (var i = 0 ; i < nbrs.length ; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

String.prototype.trim = function() {
	return this.replace(/^\s+/, '').replace(/\s+$/, '');
}

function epure(texte) {
	return texte.replace(/[àâä]/g, 'a')
				.replace(/Â/g, 'A')
				.replace(/[ç]/g, 'c')
				.replace(/[éêèë]/g, 'e')
				.replace(/[ïî]/g, 'i')
				.replace(/[ôöõ]/g, 'o')
				.replace(/[ùûü]/g, 'u');
}

String.prototype.epure = function() {
	return this.replace(/[àâä]/g, 'a')
				.replace(/Â/g, 'A')
				.replace(/[ç]/g, 'c')
				.replace(/[éêèë]/g, 'e')
				.replace(/[ïî]/g, 'i')
				.replace(/[ôöõ]/g, 'o')
				.replace(/[ùûü]/g, 'u');
}

function bbcode(texte) {
	return texte.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/'/g, '&#146;')
				.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>')
				.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>')
				.replace(/\[img\]([^"]*?)\[\/img\]/g, '<img src="$1" />');
}

/*-[functions]------- Gestion / Transformation des Dates ---------------------*/
function addZero(i) {
	return (i < 10) ? '0' + i : i;
}

function DateToString(date) {
	return addZero(date.getDate()) + '/' + addZero(date.getMonth() + 1) + '/' + date.getFullYear()
			+ ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
}

function StringToDate(str) {
	return str.replace(/([0-9]+)\/([0-9]+)/, "$2/$1");
}

/*-[functions]----------- Calculs expérience / niveau ------------------------*/
function getPXKill(niv) {
	return Math.max(0, 10 + 3 * niv - 2 * nivTroll);
}

function getPXDeath(niv) {
	return Math.max(0, 10 + 3 * nivTroll - 2 * niv);
}

function analysePX(niv) {
	niv = niv + '';
	// Si niv = 'XX+' ??
	var i = niv.indexOf('+');
	if (i != -1) {
		return ' --> \u2265 <b>' + getPXKill(niv.slice(0, i)) + '</b> PX';
	}
	// si niv = 'XX-YY' ??
	i = niv.slice(1).indexOf('-');
	if (i != -1) {
		var max = getPXKill(niv.slice(i + 2));
		if (max == 0) {
			return ' --> <b>0</b> PX';
		}
		return ' --> <b>' + getPXKill(niv.slice(0, i + 1)) + '</b> \u2264 PX \u2264 <b>' + max + '</b>';
	}
	// ???
	i = niv.indexOf('=');
	if (i != -1) {
		var max = getPXKill(niv.slice(i + 1));
		return max == 0 ? ' --> <b>0</b> PX' : ' --> \u2264 <b>' + max + '</b> PX';
	}
	return ' --> <b>' + getPXKill(niv) + '</b> PX';
}

function analysePXTroll(niv) {
	var str = analysePX(niv);
	str += '<br/>Vous lui rapportez <b>' + getPXDeath(niv) + '</b> PX.';
	return str;
}

/*-[functions]------------- Gestion Compos / Champis -------------------------*/
// Refonte totale du code de Zorya
// Elements à implémenter en dur dans MZ2.0
var numQualite = {
	'Très Mauvaise':1,
	'Mauvaise':2,
	'Moyenne':3,
	'Bonne':4,
	'Très Bonne':5
};

var qualiteNum = [
	'_dummy_',
	'Très Mauvaise',
	'Mauvaise',
	'Moyenne',
	'Bonne',
	'Très Bonne'
];

var nival = {
	'Abishaii Bleu':19,
	'Abishaii Noir':10,
	'Abishaii Rouge':23,
	'Abishaii Vert':15,
	'Ame-en-peine':8,
	'Amibe Geante':9,
	'Anaconda des Catacombes':8,
	'Ankheg':10,
	'Anoploure Purpurin':36,
	'Araignee Geante':2,
	'Ashashin':35,
	'Balrog':50,
	'Banshee':16,
	'Barghest':36,
	'Basilisk':11,
	'Behemoth':34,
	'Behir':14,
	'Beholder':50,
	'Boggart':3,
	'Bondin':9,
	"Bouj'Dla Placide":37,
	"Bouj'Dla":19,
	'Bulette':19,
	'Caillouteux':1,
	'Capitan':35,
	'Carnosaure':25,
	'Champi-Glouton':3,
	'Chauve-Souris Geante':4,
	'Cheval a Dents de Sabre':23,
	'Chevalier du Chaos':20,
	'Chimere':13,
	'Chonchon':24,
	'Coccicruelle':22,
	'Cockatrice':5,
	'Crasc Medius':17,
	'Crasc Maexus':25,
	'Crasc':10,
	'Croquemitaine':6,
	'Cube Gelatineux':32,
	'Daemonite':27,
	'Diablotin':5,
	'Dindon du Chaos':1,
	'Djinn':29,
	'Ectoplasme':18,
	'Effrit':27,
	"Elementaire d'Air":23,
	"Elementaire d'Eau":17,
	'Elementaire de Feu':21,
	'Elementaire de Terre':21,
	'Elementaire du Chaos':26,
	'Erinyes':7,
	'Esprit-Follet':16,
	'Essaim Craterien':30,
	'Essaim Sanguinaire':25,
	'Ettin':8,
	'Familier':1,
	'Fantome':24,
	'Feu Follet':20,
	'Flagelleur Mental':33,
	'Foudroyeur':38,
	'Fumeux':22,
	'Fungus Geant':9,
	'Fungus Violet':4,
	'Furgolin':10,
	'Gargouille':3,
	'Geant de Pierre':13,
	'Geant des Gouffres':22,
	"Geck'oo Majestueux":40,
	"Geck'oo":15,
	'Glouton':20,
	'Gnoll':5,
	'Gnu Domestique':1,
	'Gnu Sauvage':1,
	'Goblin':4,
	'Goblours':4,
	"Golem d'Argile":15,
	'Golem de cuir':1,
	'Golem de Chair':8,
	'Golem de Fer':31,
	'Golem de mithril':1,
	'Golem de metal':1,
	'Golem de papier':1,
	'Golem de Pierre':23,
	'Gorgone':11,
	'Goule':4,
	'Gowap Apprivoise':1,
	'Gowap Sauvage':1,
	'Gremlins':3,
	'Gritche':39,
	'Grouilleux':4,
	'Grylle':31,
	'Harpie':4,
	'Hellrot':18,
	'Homme-Lezard':4,
	'Hurleur':8,
	'Hydre':50,
	'Incube':13,
	'Kobold':2,
	'Labeilleux':26,
	'Lezard Geant':5,
	'Liche':50,
	'Limace Geante':10,
	'Loup-Garou':8,
	'Lutin':4,
	'Mante Fulcreuse':30,
	'Manticore':9,
	'Marilith':33,
	'Meduse':6,
	'Megacephale':38,
	'Mille-Pattes Geant':14,
	'Mimique':6,
	'Minotaure':7,
	'Molosse Satanique':8,
	'Momie':4,
	'Monstre Rouilleur':3,
	"Mouch'oo Domestique":14,
	"Mouch'oo Majestueux Sauvage":33,
	"Mouch'oo Sauvage":14,
	'Na-Haniym-Heee':0,
	'Necrochore':37,
	'Necromant':39,
	'Necrophage':8,
	'Naga':10,
	'Nuee de Vermine':13,
	"Nuage d'Insectes":7,
	'Ogre':7,
	'Ombre de Roches':13,
	'Ombre':2,
	'Orque':3,
	'Ours-Garou':18,
	'Palefroi Infernal':29,
	'Phoenix':32,
	'Pititabeille':0,
	'Plante Carnivore':4,
	'Pseudo-Dragon':5,
	'Rat Geant':2,
	'Rat-Garou':3,
	'Rocketeux':5,
	'Sagouin':3,
	'Scarabee Geant':4,
	'Scorpion Geant':10,
	'Shai':28,
	'Sirene':8,
	'Slaad':5,
	'Sorciere':17,
	'Spectre':14,
	'Sphinx':30,
	'Squelette':1,
	'Strige':2,
	'Succube':13,
	'Tertre Errant':20,
	'Thri-kreen':10,
	'Tigre-Garou':12,
	'Titan':26,
	'Trancheur':35,
	'Tubercule Tueur':14,
	'Tutoki':4,
	'Vampire':29,
	'Ver Carnivore Geant':12,
	'Ver Carnivore':11,
	'Veskan Du Chaos':14,
	'Vouivre':33,
	'Worg':5,
	'Xorn':14,
	'Yeti':8,
	'Yuan-ti':15,
	'Zombie':2
}

var tabEM = {
	//Monstre: [Compo exact, Sort, Position, Localisation]
	// AA
	'Basilisk':["Œil d'un ", "Analyse Anatomique", 3, "Tête"],
	// AE
	'Ankheg':["Carapace d'un", "Armure Ethérée", 3, "Spécial"],
	'Rocketeux':["Tripes d'un", "Armure Ethérée", 4, "Corps"],
	// AdA
	'Loup-Garou':["Bras d'un", "Augmentation de l'Attaque", 3, "Membre"],
	'Titan':["Griffe d'un", "Augmentation de l'Attaque", 4, "Membre"],
	// AdE
	'Erinyes':["Plume d'une", "Augmentation de l'Esquive", 3, "Membre"],
	'Palefroi Infernal':["Sabot d'un", "Augmentation de l'Esquive", 4, "Membre"],
	// AdD
	'Manticore':["Patte d'une", "Augmentation des Dégâts", 3, "Membre"],
	'Trancheur':["Griffe d'un", "Augmentation des Dégâts", 4, "Membre"],
	// BAM
	'Banshee':["Peau d'une", "Bulle Anti-Magie", 3, "Corps"],
	// BuM
	'Essaim Sanguinaire':["Pattes d'un", "Bulle Magique", 3, "Membre"],
	'Sagouin':["Patte d'un", "Bulle Magique", 4, "Membre"],
	'Effrit':["Cervelle d'un", "Bulle Magique", 5, "Tête"],
	// Explo
	'Diablotin':["Cœur d'un", "Explosion", 3, "Corps"],
	'Chimère':["Sang d'une", "Explosion", 4, "Corps"],
	'Barghest':["Bave d'un", "Explosion", 5, "Spécial"],
	// FP
	'Nécrophage':["Tête d'un", "Faiblesse Passagère", 3, "Tête"],
	'Vampire':["Canine d'un", "Faiblesse Passagère", 4, "Spécial"],
	// FA
	'Gorgone':["Chevelure d'une", "Flash Aveuglant", 3, "Tête"],
	'Géant des Gouffres':["Cervelle d'un", "Flash Aveuglant", 4, "Tête"],
	// Glue
	'Limace Géante':["Mucus d'une", "Glue", 3, "Spécial"],
	'Grylle':["Gueule d'un", "Glue", 4, "Tête"],
	// GdS
	'Abishaii Noir':["Serre d'un", "Griffe du Sorcier", 3, "Membre"],
	'Vouivre':["Venin d'une", "Griffe du Sorcier", 4, "Spécial"],
	'Araignée Géante':["Mandibule d'une", "Griffe du Sorcier", 5, "Spécial"],
	// Invi
	"Nuage d'Insectes":["Chitine d'un", "Invisibilité", 3, "Spécial"],
	'Yuan-ti':["Cervelle d'un", "Invisibilité", 4, "Tête"],
	'Gritche':["Epine d'un", "Invisibilité", 5, "Spécial"],
	// Lévitation
	// ???
	// PréM :
	'Ashashin':["Œil d'un ", "Précision Magique", 3, "Tête"],
	'Crasc':["Œil Rougeoyant d'un ", "Précision Magique", 4, "Tête"],
	// Proj
	'Yéti':["Jambe d'un", "Projection", 3, "Membre"],
	'Djinn':["Tête d'un", "Projection", 4, "Tête"],
	// PuM :
	'Incube':["Épaule musclée d'un", "Puissance Magique", 3, "Membre"],
	'Capitan':["Tripes Puantes d'un", "Puissance Magique", 4, "Corps"],
	// Sacro
	'Sorcière':["Verrue d'une", "Sacrifice", 3, "Spécial"],
	// Télék
	'Plante Carnivore':["Racine d'une", "Télékinésie", 3, "Spécial"],
	'Tertre Errant':["Cervelle d'un", "Télékinésie", 4, "Tête"],
	// TP
	'Boggart':["Main d'un", "Téléportation", 3, "Membre"],
	'Succube':["Téton Aguicheur d'une", "Téléportation", 4, "Corps"],
	'Nécrochore':["Os d'un", "Téléportation", 5, "Corps"],
	// VA
	'Abishaii Vert':["Œil d'un", "Vision Accrue", 3, "Tête"],
	// VL
	'Fungus Géant':["Spore d'un", "Vision Lointaine", 3, "Spécial"],
	'Abishaii Rouge':["Aile d'un", "Vision Lointaine", 4, "Membre"],
	// VlC
	'Zombie':["Cervelle Putréfiée d'un", "Voir le Caché", 3, "Tête"],
	'Shai':["Tripes d'un", "Voir le Caché", 4, "Corps"],
	'Phoenix':["Œil d'un", "Voir le Caché", 5, "Tête"],
	// VT
	'Naga':["Ecaille d'un", "Vue Troublée", 3, "Corps"],
	'Marilith':["Ecaille d'une", "Vue Troublée", 4, "Membre"],
	// Variables
	'Rat':["d'un"],
	'Rat Géant':["d'un"],
	'Dindon':["d'un"],
	'Goblin':["d'un"],
	'Limace':["d'une"],
	'Limace Géante':["d'une"],
	'Ver':["d'un"],
	'Ver Carnivore':["d'un"],
	'Ver Carnivore Géant':["d'un"],
	'Fungus':["d'un"],
	'Vouivre':["d'une"],
	'Gnu':["d'un"],
	'Scarabée':["d'un"]
};

var mundiChampi = {
	'Préscientus Reguis':'du Phoenix',
	'Amanite Trolloïde':'de la Mouche',
	'Girolle Sanglante':'du Dindon',
	'Horreur Des Prés':'du Gobelin',
	'Bolet Péteur':'du Démon',
	'Pied Jaune':'de la Limace',
	'Agaric Sous-Terrain':'du Rat',
	'Suinte Cadavre':"de l'Hydre",
	'Cèpe Lumineux':'du Ver',
	'Fungus Rampant':'du Fungus',
	'Nez Noir':'de la Vouivre',
	'Pleurote Pleureuse':'du Gnu',
	'Phytomassus Xilénique':'du Scarabée'
};

function addInfoMM(node, mob, niv, qualite, effetQ) {
	appendText(node, ' ');
	var urlImg = URL_MZimg11 + 'Competences/melangeMagique.png';
	var text = ' [-' + (niv + effetQ) + ' %]';
	var str = '';
	switch (mob[0]) {
		case 'A':
		case 'E':
		case 'I':
		case 'O':
		case 'U':
			str = "Compo d'";
			break;
		default:
			str = 'Compo de ';
	}
	var title = str + mob + ' : -' + niv + '\nQualité ' + qualite + ' : -' + effetQ;
	var span = createImageSpan(urlImg, 'MM:', title, text);
	node.appendChild(span);
}

function addInfoEM(node, mob, compo, qualite, localisation) {
	if (!tabEM[mob]) {
		return;
	}
	var title = 'Composant variable', texte = 'Variable';
	var bold = false;
	if (tabEM[mob].length > 1) {
		var pc = 5 * (numQualite[qualite] - tabEM[mob][2]);
		if (tabEM[mob][0].indexOf(compo) == -1) {
			pc -= 20;
		}
		if (localisation.indexOf(tabEM[mob][3]) == -1) {
			pc -= 5;
		}
		if (pc < -20) {
			return;
		}
		if (pc >= 0) {
			bold = true;
		}
		texte = aff(pc) + '%';
		title = texte + " pour l'écriture de " + tabEM[mob][1];
	}
	var urlImg = URL_MZimg09 + 'Competences/ecritureMagique.png';
	var span = createImageSpan(urlImg, 'EM:', title, ' [' + texte + ']', bold);
	node.appendChild(span);
}

function insererInfosEM(tbody) {
	// Lancé par equip, equipgowap
	var trCompos = document.evaluate("./tr[not(starts-with(td[2]/img/@alt, 'Pas'))]", tbody, null, 7, null);
	var strCompos = '';
	for (var i = 0 ; i < trCompos.snapshotLength ; i++) {
		var node = trCompos.snapshotItem(i).childNodes[7];
		var str = node.firstChild.textContent;
		var compo = trim(str.slice(0, str.indexOf(" d'un")));
		var mob = trim(str.slice(str.indexOf("d'un") + 5));
		// Si non-EM on stoppe le traitement
		if (!tabEM[mob]) {
			continue;
		}
		str = trCompos.snapshotItem(i).childNodes[9].textContent;
		var qualite = trim(str.slice(str.indexOf('Qualit') + 9));
		var localisation = trim(str.slice(0, str.indexOf(' |')));
		addInfoEM(node, mob, compo, qualite, localisation);
	}
}

function getQualite(qualite) {
	var nb = numQualite[qualite];
	return nb ? nb - 1 : -1;
}

function getEM(nom) {
	if (nom.indexOf('[') != -1) {
		nom = trim(nom.substring(0, nom.indexOf('[')));
	}
	if (tabEM[nom]) {
		return nom;
	}
	return '';
}

// DEBUG ex-fonction composantEM
function compoMobEM(mob) {
	if (!tabEM[mob]) {
		return '';
	}
	if (tabEM[mob].length == 1) {
		return 'Divers composants ' + tabEM[mob][0] + ' ' + mob + ' (Composant Variable)';
	}
	return tabEM[mob][0] + ' ' + mob + " (Qualité " + qualiteNum[tabEM[mob][2]] + ") pour l'écriture de " + tabEM[mob][1];
}

// DEBUG ex-fonction compoEM
function titreCompoEM(mob, compo, localisation, qualite) {
	if (!tabEM[mob]) {
		return '';
	}
	if (tabEM[mob].length == 1) {
		return 'Composant variable';
	}
	var pc = 5 * (tabEM[mob][2] - numQualite[qualite]);
	if (compo.indexOf(tabEM[mob][0]) == -1) {
		pc -= 20;
	}
	if (localisation.indexOf(tabEM[mob][3]) == -1) {
		pc -= 5;
	}
	if (pc >= -20) {
		return pc + "% pour l'écriture de " + tabEM[mob][2];
	}
	return '';
}

// DEBUG - rétrocompatibilité
function compoEM(mob) {
	// Appelé dans libs, vue
	return compoMobEM(mob);
}
function composantEM(mob, compo, localisation, qualite) {
	// Appelé dans libs, tancompo
	return titreCompoEM(mob, compo, localisation, qualite);
}
//

/*-[functions]-------------- Stockage des Talents ----------------------------*/
arrayTalents = {
	/* Compétences */
	'Acceleration du Metabolisme':'AM',
	'Attaque Precise':'AP',
	'Balayage':'Balayage',
	//'Balluchonnage':'Ballu',
	'Baroufle':'Baroufle',
	'Bidouille':'Bidouille',
	'Botte Secrete':'BS',
	'Camouflage':'Camou',
	'Charger':'Charger',
	'Connaissance des Monstres':'CdM',
	'Construire un Piege':'Piege',
	'Piege a Feu':'PiegeFeu',
	'Piege a Glue':'PiegeGlue',
	'Contre-Attaquer':'CA',
	'Coup de Butoir':'CdB',
	'Course':'Course',
	'Deplacement Eclair':'DE',
	'Dressage':'Dressage',
	'Ecriture Magique':'EM',
	'Frenesie':'Frenesie',
	'Golemologie':'Golemo',
	'Golem de cuir':'GolemCuir',
	'Golem de metal':'GolemMetal',
	'Golem de mithril':'GolemMithril',
	'Golem de papier':'GolemPapier',
	'Grattage':'Grattage',
	'Hurlement Effrayant':'HE',
	'Identification des Champignons':'IdC',
	'Insultes':'Insultes',
	'Lancer de Potions':'LdP',
	'Marquage':'Marquage',
	'Melange Magique':'Melange',
	'Miner':'Miner',
	'Necromancie':'Necro',
	'Painthure de Guerre':'PG',
	'Parer':'Parer',
	'Pistage':'Pistage',
	'Planter un Champignon':'PuC',
	'Regeneration Accrue':'RA',
	'Reparation':'Reparation',
	'Retraite':'Retraite',
	'Rotobaffe':'RB',
	'Shamaner':'Shamaner',
	"S'interposer":'SInterposer',
	'Tailler':'Tailler',
	//'Vol':'Vol',
	/* Sortilèges */
	'Analyse Anatomique':'AA',
	'Armure Etheree':'AE',
	'Augmentation de l´Attaque':'AdA',
	'Augmentation de l´Esquive':'AdE',
	'Augmentation des Degats':'AdD',
	'Bulle Anti-Magie':'BAM',
	'Bulle Magique':'BuM',
	'Explosion':'Explo',
	'Faiblesse Passagere':'FP',
	'Flash Aveuglant':'FA',
	'Glue':'Glue',
	'Griffe du Sorcier':'GdS',
	'Hypnotisme':'Hypno',
	'Identification des tresors':'IdT',
	'Invisibilite':'Invi',
	'Levitation':'Levitation',
	'Precision Magique':'PreM',
	'Projectile Magique':'Projo',
	'Projection':'Proj',
	'Puissance Magique':'PuM',
	'Rafale Psychique':'Rafale',
	'Sacrifice':'Sacro',
	'Siphon des Ames':'Siphon',
	'Telekinesie':'Telek',
	'Teleportation':'TP',
	'Vampirisme':'Vampi',
	'Vision Accrue':'VA',
	'Vision lointaine':'VL',
	'Voir le Cache':'VlC',
	'Vue Troublee':'VT'
	//'':''
}

// DEBUG - Pour rétrocompatibilité
function getSortComp(nom, niveau) {
	return getTalent(nom, niveau);
}
//

function getTalent(nom, niveau) {
	var nomEnBase = arrayTalents[epure(nom)];
	if (!nomEnBase) {
		return 0;
	}
	if (!niveau) {
		var niveau = '';
	}
	if (MY_getValue(numTroll + '.talent.' + nomEnBase + niveau)) {
		return MY_getValue(numTroll + '.talent.' + nomEnBase + niveau);
	}
	return 0;
}

function removeAllTalents() {
	for (var talent in arrayTalents) {
		var nomEnBase = arrayTalents[talent];
		if (MY_getValue(numTroll + '.talent.' + nomEnBase)) {
			MY_removeValue(numTroll + '.talent.' + nomEnBase);
			continue;
		}
		var niveau = 1;
		while (MY_getValue(numTroll + '.talent.' + nomEnBase + niveau)) {
			MY_removeValue(numTroll + '.talent.' + nomEnBase + niveau);
			niveau++;
		}
	}
}

function isProfilActif() { // DEBUG: Réfléchir à l'utilité de cette fonction
	var att = MY_getValue(numTroll + '.caracs.attaque');
	var attbmp = MY_getValue(numTroll + '.caracs.attaque.bmp');
	var attbmm = MY_getValue(numTroll + '.caracs.attaque.bmm');
	var mm = MY_getValue(numTroll + '.caracs.mm');
	var deg = MY_getValue(numTroll + '.caracs.degats');
	var degbmp = MY_getValue(numTroll + '.caracs.degats.bmp');
	var degbmm = MY_getValue(numTroll + '.caracs.degats.bmm');
	var vue = parseInt(MY_getValue(numTroll + '.caracs.vue'));
	var bmvue = parseInt(MY_getValue(numTroll + '.caracs.vue.bm'));
	if (att == null || attbmp == null || attbmm == null || mm == null || deg == null || degbmp == null || degbmm == null || vue == null || bmvue == null) {
		return false;
	}
	return true;
}

/*-[functions]---------------- Gestion des CDMs ------------------------------*/
function getPVsRestants(pv, bless, vue) {
	bless = Number(bless.match(/\d+/)[0]);
	if (bless == 0) {
		return null;
	}
	var pvminmax = pv.match(/\d+/g);
	if (bless == 95) {
		var pvb = 1;
		var pvh = Math.floor(pvminmax[1] / 20);
	} else if (bless == 5) {
		var pvb = Math.floor(pvminmax[0] * 19 / 20);
		var pvh = pvminmax[1];
	} else {
		var pvb = Math.ceil(pvminmax[0] * (95 - bless) / 100);
		var pvh = Math.floor(pvminmax[1] * (105 - bless) / 100);
	}
	return vue ? ' (' + pvb + '-' + pvh + ')' : ['Points de Vie restants : ', 'Entre ' + pvb + ' et ' + pvh];
}

function insertButtonCdm(nextName, onClick, texte) {
	if (texte == null) {
		texte = 'Participer au bestiaire';
	}
	var nextNode = document.getElementsByName(nextName)[0];
	var espace = document.createTextNode('\t');
	insertBefore(nextNode, espace);
	var button = document.createElement('input');
	button.type = 'button';
	button.className = 'mh_form_submit';
	button.value = texte;
	button.onmouseover = function() {
		this.style.cursor = 'pointer';
	};
	if (onClick) {
		button.onclick = onClick;
	}
	insertBefore(espace, button);
	return button;
}

var listeTitres = [
		'Niveau',
		'Famille',
		'Points de Vie',
		'Blessure',
		'Attaque',
		'Esquive',
		'Dégâts',
		'Régénération',
		'Armure',
		'Vue',
		'Capacité spéciale',
		'Résistance Magique',
		'Autres'
];

function createImageTactique(url, id, nom) {
	var img = document.createElement('img');
	img.src = url;
	img.align = 'ABSMIDDLE'; // DEBUG: OBSOLÈTE
	img.id = id;
	img.nom = nom;
	img.onmouseover = showPopupTactique;
	img.onmouseout = hidePopup;
	return img;
}

function createCDMTable(id, nom, donneesMonstre) {
	try {
		var urlImg = URL_MZimg09;
		var table = document.createElement('table');
		var profilActif = isProfilActif();
		table.className = 'mh_tdborder';
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 4;

		var thead = document.createElement('thead');
		var tr = appendTr(thead, 'mh_tdtitre');
		var td = appendTdText(tr, 'CDM de ' + nom + (donneesMonstre[11] != '???' ? ' (N° ' + id + ')' : ''), true);
		td.colSpan = 2;
		table.appendChild(thead);
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		for (var i = 0 ; i < listeTitres.length - 3 ; i++) {
			createCase(listeTitres[i], tbody, 80);
		}
		var TypeMonstre = getEM(nom);
		var infosCompo = '';
		if (TypeMonstre != '') {
			infosCompo = compoEM(TypeMonstre);
		}
		var nodes = tbody.childNodes;
		nodes[0].childNodes[1].innerHTML = bbcode(donneesMonstre[0]) + analysePX(bbcode(donneesMonstre[0]));
		nodes[1].childNodes[1].firstChild.nodeValue = bbcode(donneesMonstre[1]);
		nodes[2].childNodes[1].innerHTML = bbcode(donneesMonstre[2]);
		nodes[3].childNodes[1].innerHTML = bbcode(donneesMonstre[11]);
		nodes[4].childNodes[1].innerHTML = bbcode(donneesMonstre[3]);
		nodes[5].childNodes[1].innerHTML = bbcode(donneesMonstre[4]);
		nodes[6].childNodes[1].innerHTML = bbcode(donneesMonstre[5]);
		nodes[7].childNodes[1].innerHTML = bbcode(donneesMonstre[6]);
		nodes[8].childNodes[1].innerHTML = bbcode(donneesMonstre[7]);
		nodes[9].childNodes[1].innerHTML = bbcode(donneesMonstre[8]);
		if (donneesMonstre[10] && donneesMonstre[10].length > 0) {
			td = createCase(listeTitres[10], tbody);
			td.innerHTML = bbcode(donneesMonstre[10]);
			if (donneesMonstre[16] && donneesMonstre[16].length > 0) {
				td.appendChild(document.createTextNode(" "));
				if (donneesMonstre[16] == "De zone") {
					td.appendChild(createImage(urlImg + "zone.gif", "Portée : Zone"));
				} else if (donneesMonstre[16] == "Automatique") {
					td.appendChild(createImage(urlImg + "automatique.gif", "Toucher automatique"));
				} else if (donneesMonstre[16] == "Au toucher") {
					td.appendChild(createImage(urlImg + "toucher.gif", "Pouvoir au toucher"));
				}
			}
		}
		if (donneesMonstre[9] && donneesMonstre[9].length > 0) {
			td = createCase(listeTitres[11], tbody);
			td.innerHTML = bbcode(donneesMonstre[9]);
			// Seuil de résistance du monstre
			var lb = td.getElementsByTagName('b');
			if (lb.length == 1) {
				var mrm = lb[0].firstChild.nodeValue * 1;
				var v = (mrm / mmTroll);
				lb[0].firstChild.nodeValue += " (" + (mrm < mmTroll ? Math.max(10, Math.floor(v * 50)) : Math.min(90, Math.floor(100 - 50 / v))) + " %)";
			}
		}

		if (donneesMonstre[12] > 0 || donneesMonstre[13] >= 0 || donneesMonstre[14] > 0 || donneesMonstre[15].length > 0
			|| (donneesMonstre[17] && donneesMonstre[17].length > 0)
			|| infosCompo.length > 0 || nom.indexOf("Gowap Apprivoisé") == -1) {
			td = createCase(listeTitres[12], tbody);
			if (donneesMonstre[12] == 1) {
				td.appendChild(createImage(urlImg + "oeil.gif", "Voit le caché"));
			}

			if (donneesMonstre[13] == 1) {
				td.appendChild(createImage(urlImg + "distance.gif", "Attaque à distance"));
			} else if (donneesMonstre[13] == 0) {
				td.appendChild(createImage(urlImg + "cac.gif", "Corps à corps"));
			}

			if (donneesMonstre[14] == 1) {
				td.appendChild(createImage(urlImg + "1.gif", "1 attaque par tour"));
			}

			if (donneesMonstre[14] > 1 && donneesMonstre[14] <= 6) {
				td.appendChild(createImage(urlImg + donneesMonstre[14] + ".gif", donneesMonstre[14] + " attaque(s) par tour"));
			} else if (donneesMonstre[14] > 6) {
				td.appendChild(createImage(urlImg + "plus.gif", "Beaucoup d'attaques par tour"));
			}

			if (donneesMonstre[15] == "Lente") {
				td.appendChild(createImage(urlImg + "lent.gif", "Lent à se déplacer"));
			} else if (donneesMonstre[15] == "Normale") {
				td.appendChild(createImage(urlImg + "normal.gif", "Vitesse normale de déplacement"));
			} else if (donneesMonstre[15] == "Rapide") {
				td.appendChild(createImage(urlImg + "rapide.gif", "Déplacement rapide"));
			}

			if (donneesMonstre[17] && donneesMonstre[17].length > 0 && donneesMonstre[17] != "Vide") {
				td.appendChild(createImage(urlImg + "charge2.gif", "Possède de l'équipement (" + donneesMonstre[17] + ")"));
			}
			if (infosCompo.length > 0) {
				td.appendChild(createImage(urlImg + "Competences/ecritureMagique.png", infosCompo));
			}

			if (profilActif && nom.indexOf("Gowap Apprivoisé") == -1 && nom.indexOf("Gowap Sauvage") == -1) {
				td.appendChild(createImageTactique(urlImg + "calc.png", id,nom));
			}
		}

		// Pourcentage de blessure
		lb = nodes[3].childNodes[1].getElementsByTagName('b');
		if (lb.length == 1 && donneesMonstre[2].indexOf("-") != -1) {
			var pvs = getPVsRestants(donneesMonstre[2], lb[0].firstChild.nodeValue, true);
			if (pvs) {
				lb[0].firstChild.nodeValue += pvs;
			}
		}
		return table;
	} catch(e) {
		window.alert('Erreur createCDMTable() :\n' + e);
	}
}

/*-[functions]------------ Gestion des enchantements -------------------------*/
var listeMonstreEnchantement = null,
	listeEquipementEnchantement = null,
	listeInfoEnchantement = null;

function computeCompoEnchantement() {
	listeMonstreEnchantement = new Array();
	listeInfoEnchantement = new Array();
	listeEquipementEnchantement = new Array();
	var liste = MY_getValue(numTroll + '.enchantement.liste').split(';');
	for (var i = 0 ; i < liste.length ; i++) {
		var idEquipement = liste[i] * 1;
		if (MY_getValue(numTroll + '.enchantement.' + idEquipement + '.objet') == null || MY_getValue(numTroll + '.enchantement.' + idEquipement + '.enchanteur') == null) {
			continue;
		}
		var nomEquipement = MY_getValue(numTroll + '.enchantement.' + idEquipement + '.objet');
		var infoEnchanteur = MY_getValue(numTroll + '.enchantement.' + idEquipement + '.enchanteur').split(';');
		var texteGlobal = '';
		for (var j = 0 ; j < 3 ; j++) {
			var infoComposant = MY_getValue(numTroll + '.enchantement.' + idEquipement + '.composant.' + j).split(';');
			listeMonstreEnchantement[infoComposant[2]] = 1;
			var array = new Array();
			array[0] = infoComposant[0].replace("Ril", "Œil");
			array[1] = infoComposant[1];
			array[2] = infoComposant[2];
			array[3] = getQualite(infoComposant[3]);
			var texte = infoComposant[4].replace("Ril", "Œil");
			for (var k = 5 ; k < infoComposant.length ; k++) {
				texte += ";" + infoComposant[k].replace("Ril", "Œil");
			}
			texteGlobal += texte + '\n';
			texte += " pour l'enchantement d'un(e) " + nomEquipement + " chez l'enchanteur n°" + infoEnchanteur[0] + ' (' + infoEnchanteur[1] + '|' + infoEnchanteur[2] + '|' + infoEnchanteur[3] + ')';
			array[4] = texte;
			listeInfoEnchantement.push(array);
		}
		texteGlobal += "chez l'enchanteur n°" + infoEnchanteur[0] + ' (' + infoEnchanteur[1] + '|' + infoEnchanteur[2] + '|' + infoEnchanteur[3] + ')';
		listeEquipementEnchantement[idEquipement] = texteGlobal;
	}
}

function isEnchant(nom) {
	var monstreEnchant = '';
	for (j in listeInfoEnchantement) {
		monstre = listeInfoEnchantement[j][2].toLowerCase();
		if ((nom + ' ').toLowerCase().indexOf(monstre + ' ') >= 0) {
			monstreEnchant = monstre;
			break; // Ça permet d'arrêter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEnchant);
}

function getInfoEnchantementFromMonstre(nom) {
	try {
		if (!listeMonstreEnchantement) {
			computeCompoEnchantement();
		}
		var infosEnchant = '';
		for (j in listeInfoEnchantement) {
			monstre = listeInfoEnchantement[j][2].toLowerCase();
			if ((nom + ' ').toLowerCase().indexOf(monstre + ' ') >= 0) {
				if (infosEnchant == '') {
					infosEnchant = listeInfoEnchantement[j][4];
				} else {
					infosEnchant += '\n' + listeInfoEnchantement[j][4];
				}
			}
		}
		return trim(infosEnchant);
	} catch(e) {
		window.alert(e);
	}
}

function composantEnchant(Monstre, composant, localisation, qualite) {
	var compo = '';
	for (var i = 0 ; i < listeInfoEnchantement.length ; i++) {
	 	if (listeInfoEnchantement[i][2].toLowerCase() == Monstre.toLowerCase() &&
			listeInfoEnchantement[i][0].toLowerCase() == composant.toLowerCase() &&
			listeInfoEnchantement[i][1].toLowerCase() == localisation.toLowerCase() &&
			listeInfoEnchantement[i][3] <= qualite) {
			return listeInfoEnchantement[i][4];
		}
	}
	return compo;
}

function insertEnchantInfos(tbody) {
	try {
		if (!listeMonstreEnchantement) {
			computeCompoEnchantement();
		}
		var nodes = document.evaluate("descendant::img[@alt = 'Composant - Spécial']", tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0) {
			return false;
		}
		var urlImg = URL_MZimg09 + 'enchant.png';
		for (var i = 0 ; i < nodes.snapshotLength ; i++) {
			var link = nodes.snapshotItem(i).nextSibling.nextSibling;
			var nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g, ' ');
			var nomCompo = nomCompoTotal.substring(0, nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"), nomCompoTotal.length);
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ') + 1, nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(0, nomCompoTotal.indexOf(" de Qualité"));
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité") + 11, nomCompoTotal.indexOf(' ['));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[') + 1, nomCompoTotal.indexOf(']'));
			if (isEnchant(nomMonstre).length > 0) {
				var infos = composantEnchant(nomMonstre, nomCompo, localisation, getQualite(qualite));
				if (infos.length > 0) {
					if (link.parentNode == link.nextSibling.parentNode) {
						var tmp = link.nextSibling;
						link.parentNode.insertBefore(createImage(urlImg, infos), link.nextSibling);
					} else {
						link.parentNode.appendChild(createImage(urlImg, infos));
					}
				}
			}
		}
	} catch(e) {
		window.alert(e);
	}
}

function computeEnchantementEquipement(fontionTexte, formateTexte) {
	try {
		if (!listeMonstreEnchantement) {
			computeCompoEnchantement();
		}
		var nodes = document.evaluate("//a[@class='AllLinks' and contains(@href,'TresorHistory.php')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0) {
			return false;
		}
		var urlImg = URL_MZimg09 + 'enchant.png';
		for (var i = 0 ; i < nodes.snapshotLength ; i++) {
			var link = nodes.snapshotItem(i);
			var idEquipement = link.getAttribute('href');
			idEquipement = idEquipement.substring(idEquipement.indexOf('ai_IDTresor=') + 12);
			idEquipement = parseInt(idEquipement.substring(0, idEquipement.indexOf("'")));
			var nomEquipement = trim(link.firstChild.nodeValue);
			var enchanteur = MY_getValue(numTroll + '.enchantement.' + idEquipement + '.enchanteur');
			if (!enchanteur || enchanteur == '') {
				continue;
			}
			var infos = listeEquipementEnchantement[idEquipement];
			infos = formateTexte(infos);
			if (infos.length > 0) {
				if (link.parentNode == link.nextSibling.parentNode) {
					var tmp = link.nextSibling;
					link.parentNode.insertBefore(fontionTexte(urlImg, infos), link.nextSibling);
				} else {
					link.parentNode.appendChild(fontionTexte(urlImg, infos));
				}
			}
			MY_setValue(numTroll + '.enchantement.' + idEquipement + '.objet', nomEquipement + ' (' + idEquipement + ')');
		}
	} catch(e) {
		window.alert(e);
	}
}

/*-[functions]---------------- Analyse Tactique ------------------------------*/
// Les % de toucher
var c = new Array();

// Coefficients binomiaux
function cnp(n, k) {
	if (c[n] != null && c[n][k] != null) {
		return c[n][k];
	}
	if (c[n] == null) {
		c[n] = new Array();
	}
	if (k == 0) {
		c[n][k] = 1;
		return 1;
	}
	var result = cnp(n - 1, k - 1) * n / k; // mouais... k mul+k div
	c[n][k] = result;
	// Roule debug
	//window.console.log('cnp(' + n + ',' + k + ') = ' + result);
	return result;
}

// by Dab, à comparer
function binom(n, p) {
	if (p < 0 || p > n) {
		return 0;
	}

	if (c[n]) {
		if (c[n][p]) {
			return c[n][p];
		}
	} else {
		c[n] = [1];
		c[n][n] = 1;
		if (p == 0 || p == n) {
			return 1;
		}
	}

	if (2 * p > n) {
		c[n][p] = binom(n, n - p);
	} else {
		c[n][p] = binom(n - 1, p - 1) + binom(n - 1, p); // k(k-1)/2 additions
	}

	return c[n][p];
}

var coeff = new Array();

function coef(n, p) {
	if (n == 0 && p == 0) {
		return 1;
	}
	if (p > n * 3.5) {
		p = 7 * n - p;
	}
	// roule désactive cache
	 if (coeff[n] != null && coeff[n][p] !=null) {
		return coeff[n][p];
	 }
	if (coeff[n] == null) {
		coeff[n] = new Array();
	}
	var kmax = Math.floor((p - n) / 6);
	var x = 0;
	for (var k = 0 ; k <= kmax ; k++) {
		x += (1 - 2 * (k % 2)) * cnp(n, k) * cnp(p - 6 * k - 1, n - 1);
	}
	coeff[n][p] = x;
	// Roule debug
	//window.console.log('cnk(' + n + ',' + p + ') = ' + x);
	return x;
}

function chanceEsquiveParfaite(a, d, ba, bd) {
	var win = 0;
	var los = 0;
	if (ba == null) {
		ba = 0;
	}
	if (bd == null) {
		bd = 0;
	}
	/*
	if (6 * a + ba < 2 * (d + bd)) {
		return 100;
	}
	if (a + ba > 2 * (6 * d + bd)) {
		return 0;
	}
	*/
	for (var ds = d ; ds <= 6 * d ; ds++) {
		var cd = coef(d, ds);
		for (var as = a ; as <= 6 * a ; as++) {
			if (2 * Math.max(as + ba, 0) < Math.max(ds + bd, 0)) {
				win += cd * coef(a, as);
			} else {
				los += cd * coef(a, as);
			}
		}
	}
	// roule debug
	//window.console.log('chanceEsquiveParfaite, att = ' + a + ', esq = ' + d + ', ba = ' + ba + ', bd = ' + bd + ', win = ' + win + ', los = ' + los);
	return Math.round(100 * win / (win + los));
}

function chanceTouche(a, d, ba, bd) {
	var win = 0;
	var los = 0;
	if (ba == null) {
		ba = 0;
	}
	if (bd == null) {
		bd = 0;
	}
	if (a + ba > 6 * d + bd) {
		return 100;
	}
	if (6 * a + ba < d + bd) {
		return 0;
	}
	for (var ds = d ; ds <= 6 * d ; ds++) {
		var cd = coef(d, ds);
		for (var as = a ; as <= 6 * a ; as++) {
			if (Math.max(as + ba, 0) > Math.max(ds + bd, 0)) {
				win += cd * coef(a, as);
			} else {
				los += cd * coef(a, as);
			}
		}
	}
	return Math.round(100 * win / (win + los));
}

function chanceCritique(a, d, ba, bd) {
	var win = 0;
	var los = 0;
	if (ba == null) {
		ba = 0;
	}
	if (bd == null) {
		bd = 0;
	}
	if (a + ba > 2 * (6 * d + bd)) {
		return 100;
	}
	if (6 * a + ba < 2 * (d + bd)) {
		return 0;
	}
	for (var ds = d ; ds <= 6 * d ; ds++) {
		var cd = coef(d, ds);
		for (var as = a ; as <= 6 * a ; as++) {
			if (Math.max(as + ba, 0) > 2 * Math.max(ds + bd, 0)) {
				win += cd * coef(a, as);
			} else {
				los += cd * coef(a, as);
			}
		}
	}
	return Math.round(100 * win / (win + los));
}

/***********************************************
Analyse tactique
***********************************************/
function getTexteAnalyse(modificateur, chiffre) {
	if (chiffre == 0) {
		return chiffre;
	}
	return modificateur + chiffre;
}

function getAnalyseTactique(id, nom) {
	var donneesMonstre = listeCDM[id];
	var needAutres = false;
	var i;
	if (donneesMonstre == null) {
		return;
	}
	var array = analyseTactique(donneesMonstre, nom);
	if (array == null) {
		return "";
	}
	var str = "<table class='mh_tdborder' border='0' cellspacing='1' cellpadding='4'><tr class='mh_tdtitre'><td>Attaque</td><td>Esq. Parfaite</td><td>Touché</td><td>Critique</td><td>Dégâts</td></tr>";
	for (i = 0 ; i < array.length ; i++) {
		if (array[i][1] == 100 && i > 0) {
			needAutres = true;
			break;
		}
		if (i == 1 && array[i][4] > 0) {
			str += "<tr class=mh_tdpage><td><b>" + array[i][0] + "</b></td><td><b>" + getTexteAnalyse(array[i][5], array[i][1]) + "%</b></td><td><b>" + getTexteAnalyse(array[i][5], array[i][2]) + "%</b></td><td><b>" + getTexteAnalyse(array[i][5], array[i][3]) + "%</b></td><td><b>" + getTexteAnalyse(array[i][6], array[i][4]) + "</b></td></tr>";
		} else if (i == 0) {
			str += "<tr class=mh_tdpage><td><i>" + array[i][0] + "</i></td><td><i>" + getTexteAnalyse(array[i][5], array[i][1]) + "%</i></td><td><i>" + getTexteAnalyse(array[i][5], array[i][2]) + "%</i></td><td><i>" + getTexteAnalyse(array[i][5], array[i][3]) + "%</i></td><td><b><i>" + getTexteAnalyse(array[i][6], array[i][4]) + "</i></b></td></tr>";
		} else {
			str += "<tr class=mh_tdpage><td>" + array[i][0] + "</td><td>" + getTexteAnalyse(array[i][5], array[i][1]) + "%</td><td>" + getTexteAnalyse(array[i][5], array[i][2]) + "%</td><td>" + getTexteAnalyse(array[i][5], array[i][3]) + "%</td><td><b>" + getTexteAnalyse(array[i][6], array[i][4]) + "</b></td></tr>";
		}
	}
	if (needAutres) {
		if (i == array.length - 1) {
			str += "<tr class=mh_tdpage><td>" + array[i][0] + "</td><td>" + getTexteAnalyse(array[i][5], array[i][1]) + "%</td><td>" + getTexteAnalyse(array[i][5], array[i][2]) + "%</td><td>" + getTexteAnalyse(array[i][5], array[i][3]) + "%</td><td><b>"+getTexteAnalyse(array[i][6], array[i][4]) + "</b></td></tr>";
		} else if (i == 1) {
			str += "<tr class=mh_tdpage><td><b>Toutes attaques</b></td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
		} else {
			str+= "<tr class=mh_tdpage><td>Autres attaques</td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
		}
	}
	return str+"</table>";
}

function analyseTactique(donneesMonstre, nom) {
	try {
		var listeAttaques = [];
		// Roule 16/03/2016 ajout des ParseInt car je récupérais parfois une chaine non numérique :(
		var att = parseInt(MY_getValue(numTroll + ".caracs.attaque"), 10);
		var attbmp = parseInt(MY_getValue(numTroll + ".caracs.attaque.bmp"), 10);
		var attbmm = parseInt(MY_getValue(numTroll + ".caracs.attaque.bmm"), 10);
		var mm = parseInt(MY_getValue(numTroll + ".caracs.mm"), 10);
		var deg = parseInt(MY_getValue(numTroll + ".caracs.degats"), 10);
		var degbmp = parseInt(MY_getValue(numTroll + ".caracs.degats.bmp"), 10);
		var degbmm = parseInt(MY_getValue(numTroll + ".caracs.degats.bmm"), 10);
		var vue = parseInt(MY_getValue(numTroll + ".caracs.vue"), 10);
		var pv = parseInt(MY_getValue(numTroll + ".caracs.pv"), 10);
		var esq = parseInt(Math.max(MY_getValue(numTroll + ".caracs.esquive"), 10) - parseInt(MY_getValue(numTroll + ".caracs.esquive.nbattaques"), 0), 10);
		var esqbonus = parseInt(MY_getValue(numTroll + ".caracs.esquive.bm"), 10);
		var arm = parseInt(MY_getValue(numTroll + ".caracs.armure"), 10);
		var armbmp = parseInt(MY_getValue(numTroll + ".caracs.armure.bmp"), 10);
		var armbmm = parseInt(MY_getValue(numTroll + ".caracs.armure.bmm"), 10);
		var modificateurEsquive = '';
		var modificateurArmure = '';
		var modificateurMagie = '';
		var modificateurEsquiveM = '';
		var modificateurArmureM = '';
		var pasDeSR = false;
		var esqM, attM, armM, degM;
		if (donneesMonstre == null || att == null || attbmp == null || attbmm == null || mm == null || deg == null || degbmp == null || degbmm == null || vue == null ||pv == null || esq == null || arm == null) {
			return null;
		}

		var td = document.createElement('td');
		td.innerHTML = bbcode(donneesMonstre[4]); // sans déconner ? C'est quoi cette histoire ?
		var esqM = 0;
		try {
			esqM = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		} catch(e) {
			esqM = Math.ceil(parseInt(td.firstChild.nodeValue));
			modificateurEsquive = '<';
			modificateurArmure = '<';
			modificateurMagie = '<';
		}

		td.innerHTML = bbcode(donneesMonstre[3]);
		var attM = 0;
		try {
			attM = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		} catch(e) {
			attM = Math.ceil(parseInt(td.firstChild.nodeValue));
			modificateurEsquiveM = '>';
			modificateurArmureM = '>';
		}

		td.innerHTML = bbcode(donneesMonstre[5]);
		var degM = 0;
		try {
			degM = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		} catch(e) {
			degM = Math.ceil(parseInt(td.firstChild.nodeValue));
			modificateurArmureM = '>';
		}

		td.innerHTML = bbcode(donneesMonstre[7]);
		var armM = 0;
		try {
			armM = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		} catch(e) {
			armM = Math.ceil(parseInt(td.firstChild.nodeValue));
			modificateurArmure = '<';
		}

		var coeffSeuil = 0.95;
		try {
			td.innerHTML = bbcode(donneesMonstre[9]);
			var rm = parseInt(td.getElementsByTagName('b')[0].firstChild.nodeValue);
			var v = (rm / mm);
			var seuil = (rm < mm ? Math.max(10, Math.floor(v * 50)) : Math.min(90, Math.floor(100 - 50 / v)));
			coeffSeuil = (200 - seuil) / 200;
		} catch(e) {
			modificateurMagie = '<';
			pasDeSR = true;
		}

		var chanceDEsquiveParfaite = chanceEsquiveParfaite(att, esqM, attbmp + attbmm, 0);
		var chanceDeTouche = chanceTouche(att, esqM, attbmp + attbmm, 0);
		var chanceDeCritique = chanceCritique(att, esqM, attbmp + attbmm, 0);
		// roule debug
		//window.console.log('Attaque normale troll sur monstre, att = ' + att + ', esqM = ' + esqM + ', attbmp = ' + attbmp + ', attbmm = ' + attbmm + ', chanceDEsquiveParfaite = ' + chanceDEsquiveParfaite + ', chanceDeTouche = ' + chanceDeTouche + ', chanceDeCritique = ' + chanceDeCritique);
		var degats = (((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmp + degbmm - armM, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmp + degbmm - armM, 1)) / 100);
		//str += "Attaque normale : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmp + degbmm - arm, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmp + degbmm - arm, 1)) / 100);
		listeAttaques.push(new Array("Attaque normale", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		if (getSortComp("Vampirisme") > 0) {
			var pour = getSortComp("Vampirisme");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(deg * 2 / 3), esqM, attbmm, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(Math.floor(deg * 2 / 3), esqM, attbmm, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(Math.floor(deg * 2 / 3), esqM, attbmm, 0) * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmm, 1))) / 100;
			//str += "\nVampirisme : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Vampirisme", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurMagie));
		}
		if (getSortComp("Botte Secrète") > 0) {
			var pour = getSortComp("Botte Secrète");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(2 * att / 3), esqM, Math.floor((attbmp + attbmm) / 2), 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(Math.floor(2 * att / 3), esqM, Math.floor((attbmp + attbmm) / 2), 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(Math.floor(2 * att / 3), esqM, Math.floor((attbmp + attbmm) / 2), 0) * pour / 100);
			degats = Math.round(((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(deg / 2) * 2 + Math.floor((degbmp + degbmm) / 2) - Math.floor(armM / 2), 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5 / 2) * 2 + Math.floor((degbmp + degbmm) / 2) - Math.floor(armM / 2), 1))) / 100;
			//str += "\nBotte Secrète : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Botte Secrète", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Rafale Psychique") > 0) {
			var pour = getSortComp("Rafale Psychique");
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = Math.round(100 * pour / 100);
			chanceDeCritique = Math.round(0 * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmm, 1))) / 100;
			//str += "\nRafale Psychique : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Rafale Psychique", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, '', pasDeSR ? modificateurMagie : ''));
		}
		if (getSortComp("Explosion") > 0) {
			var pour = getSortComp("Explosion");
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = Math.round(100 * pour / 100);
			chanceDeCritique = Math.round(0 * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(1 + deg / 2 + pv / 20) * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(1 + deg / 2 + pv / 20) * 1.5) * 2 + degbmm, 1))) / 100;
			//str += "\nRafale Psychique : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Explosion", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, '', pasDeSR ? modificateurMagie : ''));
		}
		if (getSortComp("Projectile Magique") > 0) {
			var pour = getSortComp("Projectile Magique");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(vue, esqM, attbmm, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(vue, esqM, attbmm, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(vue, esqM, attbmm, 0) * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(vue / 2) * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(vue / 2) * 1.5) * 2 + degbmm, 1))) / 100;
			//str += "\nProjectile Magique : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Projectile Magique", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurMagie));
		}
		if (getSortComp("Frénésie") > 0) {
			var pour = getSortComp("Frénésie");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(att, esqM, attbmm + attbmp, 0) * pour / 100);
			degats = Math.round(((chanceDeTouche - chanceDeCritique) * 2 * Math.max((deg * 2 + degbmp + degbmm - armM), 1) + chanceDeCritique * 2 * Math.max(Math.floor(deg * 1.5) * 2 + degbmm + degbmp - armM, 1))) / 100;
			//str += "\nFrénésie : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Frénésie", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Charger") > 0) {
			var pour = getSortComp("Charger");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(att, esqM, attbmm + attbmp, 0) * pour / 100);
			var degats = Math.round(((chanceDeTouche - chanceDeCritique) * Math.max((deg * 2 + degbmp + degbmm - armM), 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmm + degbmp - armM, 1))) / 100;
			//str += "\nCharge : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Charger", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Griffe du Sorcier") > 0) {
			var pour = getSortComp("Griffe du Sorcier");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att, esqM, attbmm, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(att, esqM, attbmm, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(att, esqM, attbmm, 0) * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(deg / 2) * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(deg / 2) * 1.5 ) * 2 + degbmm, 1))) / 100;
			//str += "\nGriffe du Sorcier : Touché " + chanceDeTouche + "% Critique " + chanceDeCritique + "% Dégâts " + (degats);
			listeAttaques.push(new Array("Griffe du Sorcier", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurMagie));
		}
		if (getSortComp("Attaque Précise", 1) > 0) {
			var niveau = 5;
			var oldPour = 0;
			var chanceDEsquiveParfaite = 0;
			var chanceDeTouche = 0;
			var chanceDeCritique = 0;
			degats = 0;
			while(niveau > 0) {
				var pour = getSortComp("Attaque Précise", niveau);
				if (pour > oldPour) {
					var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(Math.min(att + 3 * niveau, Math.floor(att * 1.5)), esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					var chanceDeToucheNiveau = chanceTouche(Math.min(att + 3 * niveau, Math.floor(att * 1.5)), esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					var chanceDeCritiqueNiveau = chanceCritique(Math.min(att + 3 * niveau, Math.floor(att * 1.5)), esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
					chanceDeTouche += chanceDeToucheNiveau;
					chanceDeCritique += chanceDeCritiqueNiveau;
					degats += (((chanceDeToucheNiveau - chanceDeCritiqueNiveau) * Math.max((deg * 2 + degbmp + degbmm - armM), 1) + chanceDeCritiqueNiveau * Math.max(Math.floor(deg * 1.5) * 2 + degbmm + degbmp - armM, 1)) / 100);
					oldPour = pour;
				}
				niveau--;
			}
			//str += "\nAttaque Précise : Touché " + (Math.round(chanceDeTouche * 100) / 100) + "% Critique " + (Math.round(chanceDeCritique * 100) / 100) + "% Dégâts " + Math.round(degats * 100) / 100;
			listeAttaques.push(new Array("Attaque Précise", chanceDEsquiveParfaite, Math.round(chanceDeTouche * 100) / 100, Math.round(chanceDeCritique * 100) / 100, Math.round(degats * 100) / 100, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Coup de Butoir", 1) > 0) {
			var niveau = 5;
			var oldPour = 0;
			var chanceDEsquiveParfaite = 0;
			var chanceDeTouche = 0;
			var chanceDeCritique = 0;
			degats = 0;
			while (niveau > 0) {
				var pour = getSortComp("Coup de Butoir", niveau);
				if (pour > oldPour) {
					var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(att, esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					var chanceDeToucheNiveau = chanceTouche(att, esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					var chanceDeCritiqueNiveau = chanceCritique(att, esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
					chanceDeTouche += chanceDeToucheNiveau;
					chanceDeCritique += chanceDeCritiqueNiveau;
					degats += (((chanceDeToucheNiveau - chanceDeCritiqueNiveau) * Math.max((Math.min(Math.floor(deg * 1.5), deg + 3 * niveau) * 2 + degbmp + degbmm - armM), 1) + chanceDeCritiqueNiveau * Math.max(Math.floor(Math.min(Math.floor(deg * 1.5), deg + 3 * niveau) * 1.5) * 2 + degbmm + degbmp - armM, 1)) / 100);
					oldPour = pour;
				}
				niveau--;
			}
			//str += "\nCoup de Butoir : Touché " + (Math.round(chanceDeTouche * 100) / 100) + "% Critique " + (Math.round(chanceDeCritique * 100) / 100) + "% Dégâts " + Math.round(degats * 100) / 100;
			listeAttaques.push(new Array("Coup de Butoir", chanceDEsquiveParfaite, Math.round(chanceDeTouche * 100) / 100, Math.round(chanceDeCritique * 100) / 100, Math.round(degats * 100) / 100, modificateurEsquive, modificateurArmure));
		}
		listeAttaques.sort(function(a, b) {var diff = parseInt(100 * b[4]) - parseInt(100 * a[4]); if (diff == 0) {return parseInt(b[1]) - parseInt(a[1]);} return diff;});
		if (nom.toLowerCase().indexOf("mégacéphale") == -1) {
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(attM, esq, 0, esqbonus));
			chanceDeTouche = Math.round(chanceTouche(attM, esq, 0, esqbonus));
			chanceDeCritique = Math.round(chanceCritique(attM, esq, 0, esqbonus));
		} else {
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = 100;
			chanceDeCritique = 0;
		}
		degats = Math.round(((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(degM) * 2 - arm, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(degM) * 1.5) * 2 - arm * 2 - armbmm - armbmp, 1))) / 100;

		listeAttaques.unshift(new Array("Monstre", Math.round(chanceDEsquiveParfaite * 100) / 100, Math.round(chanceDeTouche * 100) / 100, Math.round(chanceDeCritique * 100) / 100, Math.round(degats * 100) / 100, modificateurEsquive, modificateurArmure));
		return listeAttaques;
	} catch(e) {
		window.alert(e);
	}
}

/* Acquisition & Stockage des données de DB */
const typesAFetcher = {
	'monstres':1,
	'trolls':1,
	'tresors':1,
	'champignons':1,
	'lieux':1
}
var tr_monstres = {}, tr_trolls = {}, tr_tresors = {}, tr_champignons = {}, tr_lieux = {};
var nbMonstres = 0, nbTrolls = 0, nbTresors = 0, nbChampignons = 0, nbLieux = 0;

function fetchData(type) {
	try {
		var node = document.getElementById('mh_vue_hidden_' + type);
		this['tr_' + type] = node.getElementsByTagName('tr');
		this['nb' + type[0].toUpperCase() + type.slice(1)] = this['tr_'+type].length - 1;
	} catch(e) {
		window.console.warn('[MZ Vue] Erreur acquisition type ' + type + '\n' + e);
	}
}

/*---------------------------------- DEBUG -----------------------------------*/
var mainTabs = document.getElementsByClassName('mh_tdborder');
var x_monstres = tr_monstres;
var x_trolls = tr_trolls;
var x_tresors = tr_tresors;
var x_champis = tr_champignons;
var x_lieux = tr_lieux;
/*-------------------------------- FIN DEBUG ---------------------------------*/

/* [functions] Bulle PX Trolls */
var bulle;

function initPXTroll() {
	bulle = document.createElement('div');
	bulle.id = 'bulle';
	bulle.className = 'mh_textbox';
	bulle.style = 'position: absolute; border: 1px solid #000000; visibility: hidden; display: inline; z-index: 2;';
	document.body.appendChild(bulle);

	for (var i = nbTrolls ; i > 0 ; i--) {
		var td_niv = getTrollNivNode(i);
		td_niv.onmouseover = showPXTroll;
		td_niv.onmouseout = hidePXTroll;
	}
}

function showPXTroll(evt) {
	var lvl = this.firstChild.nodeValue;
	bulle.innerHTML = 'Niveau ' + lvl + analysePXTroll(lvl);
	bulle.style.left = evt.pageX + 15 + 'px';
	bulle.style.top = evt.pageY + 'px';
	bulle.style.visibility = 'visible';
}

function hidePXTroll() {
	bulle.style.visibility = 'hidden';
}

/*-[functions]-------------- Fonctions utilitaires ---------------------------*/
function positionToString(arr) {
	return arr.join(';');
}

function savePosition() {
	// Stocke la position (à jour) de la vue pour les autres scripts
	// DEBUG: Lesquels et pourquoi?
	var pos = getPosition();
	MY_setValue(numTroll + '.position.X', pos[0]);
	MY_setValue(numTroll + '.position.Y', pos[1]);
	MY_setValue(numTroll + '.position.N', pos[2]);
}


/*-[functions]--- Fonctions de récupération de données (DOM) -----------------*/
/* INFOS :
 * les champs-titres (table>tbody>tr>td>table>tbody>tr>td>a)
 * sont identifiables via leur Name
 * les tables-listings sont identifiables via l'ID du tr conteneur
 * (mh_vue_hidden_XXX, XXX=trolls, champignons, etc)
 */

/* [functions] Récup données Utilisateur */
function getPosition() {
	// Pour rétrocompatibilité
	return currentPosition;
}

function getPorteVue() {
	// Pour rétrocompatibilité
	return porteeVue;
}

function getVue() {
	// Retourne [vueHpure, vueVpure]
	var vues = getPorteVue();
	return [ vues[0], vues[1] ];
}

// Roule 11/03/2016
/* [functions] Récup données monstres, trolls, etc. */
function getXxxDistance(xxx, i) {
	return parseInt(this['tr_' + xxx.toLowerCase()][i].cells[0].textContent);
}

function getXxxPosition(xxx, i) {
	var tds = this['tr_' + xxx.toLowerCase()][i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

/* [functions] Récup données monstres */
function getMonstreDistance(i) {
	return parseInt(tr_monstres[i].cells[0].textContent);
}

function getMonstreID(i) {
	return tr_monstres[i].cells[2].firstChild.nodeValue;
}

function getMonstreIDByTR(tr) {
	return tr.cells[2].firstChild.nodeValue;
}

function getMonstreLevelNode(i) {
	return tr_monstres[i].cells[3];
}

function getMonstreLevel(i) {
	if (!isCDMsRetrieved) {
		return -1;
	}
	var donneesMonstre = listeCDM[getMonstreID(i)];
	return donneesMonstre ? parseInt(donneesMonstre[0]) : -1;
}

function getMonstreNomNode(i) {
	try {
		var td = document.evaluate("./td/a[starts-with(@href, 'javascript:EMV')]/..", tr_monstres[i], null, 9, null).singleNodeValue;
		return td;
	} catch(e) {
		avertissement('[getMonstreNomNode] Impossible de trouver le monstre ' + i);
		window.console.error(e);
	}
}

function getMonstreNom(i) {
	return getMonstreNomByTR(tr_monstres[i]);
}

function getMonstreNomByTR(tr) {
	try {
		var nom = document.evaluate("./td/a[starts-with(@href, 'javascript:EMV')]/text()", tr, null, 2, null).stringValue;
		return nom;
	} catch(e) {
		avertissement('[getMonstreNom] Impossible de trouver le monstre ' + i);
		window.console.error(e);
	}
}

function getMonstrePosition(i) {
	var tds = tr_monstres[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

function appendMonstres(txt) {
	for (var i = 1 ; i <= nbMonstres ; i++) {
		txt += getMonstreID(i) + ';' + getMonstreNom(i) + ';' + positionToString(getMonstrePosition(i)) + '\n';
	}
	return txt;
}

function getMonstres() {
	var vue = getVue();
	return appendMonstres(positionToString(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function bddMonstres(start, stop) {
	if (!start) {
		var start = 1;
	}
	if (!stop) {
		var stop = nbMonstres;
	}
	stop = Math.min(nbMonstres, stop);
	var txt = '';
	for (var i = start ; i <= stop ; i++) {
		txt += getMonstreID(i) + ';' + getMonstreNom(i) + ';' + positionToString(getMonstrePosition(i)) + '\n';
	}
	return txt ? '#DEBUT MONSTRES\n' + txt + '#FIN MONSTRES\n' : '';
}

/* [functions] Récup données Trolls */
function getTrollDistance(i) {
	return parseInt(tr_trolls[i].cells[0].textContent);
}

function getTrollID(i) {
	return parseInt(tr_trolls[i].cells[2].textContent);
}

function getTrollNomNode(i) {
	var isEnvoiOn = document.getElementById('btnEnvoi').parentNode.childNodes.length > 1;
	return tr_trolls[i].cells[ isEnvoiOn ? 4 : 3 ];
}

function getTrollNivNode(i) {
	// Pas de test sur isEnvoiOn, n'est appelé qu'au pageload
	return tr_trolls[i].cells[4];
}

function getTrollGuilde(i) {
	return trim(tr_trolls[i].cells[6].textContent);
}

function getTrollGuildeID(i) {
	if (tr_trolls[i].childNodes[6].childNodes.length > 0) {
		var href = tr_trolls[i].childNodes[6].firstChild.getAttribute('href');
		return href.substring(href.indexOf('(') + 1, href.indexOf(','));
	}
	return -1;
}

function getTrollPosition(i) {
	var tds = tr_trolls[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

function bddTrolls() {
	var txt = '#DEBUT TROLLS\n' + numTroll + ';' + positionToString(getPosition()) + '\n';
	for (var i = 1 ; i <= nbTrolls ; i++) {
		txt += getTrollID(i) + ';' + positionToString(getTrollPosition(i)) + '\n';
	}
	return txt + '#FIN TROLLS';
}

/* [functions] Récup données Trésors */
function getTresorDistance(i) {
	return tr_tresors[i].cells[0].firstChild.nodeValue;
}

function getTresorID(i) {
	return trim(tr_tresors[i].cells[2].textContent);
}

function getTresorNom(i) {
	// Utilisation de textContent pour régler le "bug de Pollux"
	return trim(tr_tresors[i].cells[3].textContent);
}

function getTresorPosition(i) {
	var tds = tr_tresors[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent),
	];
}

function bddTresors(dmin, start, stop) {
// On retire les trésors proches (dmin) pour Troogle à cause de leur description
	if (!dmin) {
		var dmin = 0;
	}
	if (!start) {
		var start = 1;
	}
	if (!stop) {
		var stop = nbTresors;
	}
	stop = Math.min(nbTresors, stop);
	var txt = '';
	for (var i = start ; i <= stop ; i++) {
		if (getTresorDistance(i) >= dmin) {
			txt += getTresorID(i) + ';' + getTresorNom(i) + ';' + positionToString(getTresorPosition(i)) + '\n';
		}
	}
	return txt ? '#DEBUT TRESORS\n' + txt + '#FIN TRESORS\n' : '';
}

/* [functions] Récup données Champignons */
// DEBUG: Pas de colonne "Référence" sur serveur de test
function getChampignonNom(i) {
	return trim(tr_champignons[i].cells[2].textContent);
}

function getChampignonPosition(i) {
	var tds = tr_champignons[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

function bddChampignons() {
	var txt = '';
	for (var i = 1 ; i <= nbChampignons ; i++) {
		// Les champis n'ont pas de Référence
		txt += ';' + getChampignonNom(i) + ';' + positionToString(getChampignonPosition(i)) + '\n';
	}
	return txt ? '#DEBUT CHAMPIGNONS\n' + txt + '#FIN CHAMPIGNONS\n' : '';
}

/* [functions] Récup données Lieux */
function getLieuDistance(i) {
	return parseInt(tr_lieux[i].cells[0].textContent);
}

function getLieuID(i) {
	return parseInt(tr_lieux[i].cells[2].textContent);
}

function getLieuNom(i) {
	// Conversion ASCII pour éviter les bugs des Vues externes
	return trim(tr_lieux[i].cells[3].textContent);
}

function getLieuPosition(i) {
	var tds = tr_lieux[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

function appendLieux(txt) {
	for (var i = 1 ; i < nbLieux + 1 ; i++) {
		var tds = x_lieux[i].childNodes;
		txt += tds[1].firstChild.nodeValue + ";" + getLieuNom(i) + ";" + tds[3].firstChild.nodeValue + ";" + tds[4].firstChild.nodeValue + ";" + tds[5].firstChild.nodeValue + "\n";
	}
	return txt;
}

function getLieux() {
	var vue = getVue();
	return appendLieux(positionToString(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function bddLieux(start, stop) {
	if (!start) {
		var start = 1;
	}
	if (!stop) {
		var stop = nbLieux;
	}
	stop = Math.min(nbLieux, stop);
	var txt = '';
	for (var i = start ; i <= stop ; i++) {
		txt += getLieuID(i) + ';' + epure(getLieuNom(i)) + ';' + positionToString(getLieuPosition(i)) + '\n';
	}
	return txt ? '#DEBUT LIEUX\n' + txt + '#FIN LIEUX\n' : '';
}

/* [functions] Récupération / Computation des Infos Tactiques */
// TODO à revoir
function retireMarquage(nom) {
	var i = nom.indexOf(']');
	switch(i) {
		case -1:
		case nom.length - 1:
			return nom;
		default:
			return nom.slice(0, i + 1);
	}
}

function showPopupError(sHTML) {
	var divpopup = document.createElement('div');
	divpopup.id = 'divpopup';
	divpopup.style =
		'position: fixed;' +
		'border: 3px solid #000000;' +
		'top: 300px;left: 10px;' +
		'background-color: red;' +
		'color: white;' +
		'font-size: xx-large;' +
		'z-index: 200;';
	divpopup.innerHTML = sHTML;
	var divcroix = document.createElement('div');
	divcroix.style =
		'position: absolute;' +
		'top: 0;right: 0;' +
		'color: inherit;' +
		'font-size: inherit;' +
		'cursor: pointer;' +
		'z-index: 201;';
	divcroix.innerHTML = "X";
	divcroix.onclick = function () {document.getElementById('divpopup').style.display = 'none';};
	document.body.appendChild(divpopup);
	divpopup.appendChild(divcroix);
}

function retrieveCDMs() {
// Récupère les CdM disponibles dans la BDD
// Lancé uniquement sur toggleLevelColumn
	if (checkBoxLevels.checked) {
		return;
	}

	var str = '';
	var begin = 1; // num de début de lot si plusieurs lots de CdM (501+ CdM)
	var cdmMax = MY_getValue(numTroll + '.MAXCDM');
	cdmMax = Math.min(nbMonstres, cdmMax ? cdmMax : 500);
	if (MY_getValue('CDMID') == null) {
		MY_setValue('CDMID', 1); // à quoi sert CDMID ??
	}

	for (var i = 1 ; i <= cdmMax ; i++) {
		var nomMonstre = retireMarquage(getMonstreNom(i));
		if (nomMonstre.indexOf(']') != -1) {
			nomMonstre = nomMonstre.slice(0, nomMonstre.indexOf(']') + 1);
		}
		// *** WARNING : PROXY RATIBUS ***
		// *** NE PAS CHANGER la fonction obsolète 'escape' ***
		str += 'nom[]=' + escape(nomMonstre) + '$' + (getMonstreDistance(i) <= 5 ? getMonstreID(i) : -getMonstreID(i)) + '&';

		if (i % 500 == 0 || i == cdmMax) {
			// demandes de CdM par lots de 500 max
			FF_XMLHttpRequest({
				method: 'POST',
				url: URL_MZinfoMonstrePost,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					'Content-type':'application/x-www-form-urlencoded'
				},
				data: 'begin=' + begin + '&idcdm=' + MY_getValue('CDMID') + '&' + str,
				onload: function(responseDetails) {
					try {
						//window.console.log('retrieveCDMs readyState=' + responseDetails.readyState + ', error=' + responseDetails.error + ', status=' + responseDetails.status);
						if (responseDetails.status == 0 && isHTTPS) {
							// ça donne ça sur une erreur de certificat HTTPS
							showPopupError('<a style="color:inherit;font-size: inherits;" href="' + URL_CertifRaistlin +
								'" target="raistlin">Mountyzilla - https<br />'+
								'Tu dois accepter le certificat de Raistlin<br />'+
								'clique ici<br />puis « Avancé » ... « Ajouter une exception » ...'+
								' « Confirmer l\'exception de sécurité »<br />'+
								'(<i>Ignore ensuite le message au sujet du firewall</i>)');
							return;
						}
						var texte = responseDetails.responseText;
						var lines = texte.split('\n');
						if (lines.length == 0) {
							return;
						}
						var begin2, end2, index;
						for (var j = 0 ; j < lines.length ; j++) {
							var infos = lines[j].split(';');
							if (infos.length < 4) {
								continue;
							}
							var idMonstre = infos[0];
							var isCDM = infos[1];
							index = parseInt(infos[2]);
							var level = infos[3];
							infos = infos.slice(3);
							if (begin2 == null) {
								begin2 = index;
							}
							end2 = index;
							listeCDM[idMonstre] = infos;
							if (isCDM == 1) {
								getMonstreLevelNode(index).innerHTML = '<i>' + level + '</i>';
							} else {
								getMonstreLevelNode(index).innerHTML = level;
							}
						}
						computeMission(begin2, end2);
					} catch(e) {
						window.console.error('[retrieveCDMs]\n' + e + '\n' + URL_MZinfoMonstrePost + '\n' + texte);
					}
				}
			});
			str = '';
			begin = i + 1;
		}
	}
	isCDMsRetrieved = true;
}

function computeMission(begin, end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance
	computeVLC(begin, end);
	if (!begin) {
		begin = 1;
	}
	if (!end) {
		end = nbMonstres;
	}
	var str = MY_getValue(numTroll + '.MISSIONS');
	if (!str) {
		return;
	}

	var urlImg = URL_MZimg09 + 'mission.png';
	var obMissions = JSON.parse(str);

	for (var i = end ; i >= begin ; i--) {
		var mess = '';
		for (var num in obMissions) {
			var mobMission = false;
			switch(obMissions[num].type) {
				case 'Race':
					var race = epure(obMissions[num].race.toLowerCase());
					var nom = epure(getMonstreNom(i).toLowerCase());
					if (nom.indexOf(race) != -1) {
						mobMission = true;
					}
					break;
				case 'Niveau':
					var donneesMonstre = listeCDM[getMonstreID(i)];
					if (donneesMonstre) {
						var nivMob = Number(donneesMonstre[0]);
						var	nivMimi = Number(obMissions[num].niveau);
						var mod = obMissions[num].mod;
						if ((!isNaN(mod) && Math.abs(nivMimi-nivMob) <= Number(mod)) || (isNaN(mod) && nivMob >= nivMimi)) {
							mobMission = true;
						}
					}
					break;
				case 'Famille':
					var donneesMonstre = listeCDM[getMonstreID(i)];
					if (donneesMonstre) {
						var familleMimi = epure(obMissions[num].famille.toLowerCase());
						var familleMob = epure(donneesMonstre[1].toLowerCase());
						if (familleMob.indexOf(familleMimi) != -1) {
							mobMission = true;
						}
					}
					break;
				case 'Pouvoir':
					var donneesMonstre = listeCDM[getMonstreID(i)];
					if (donneesMonstre) {
						var pvrMimi = epure(obMissions[num].pouvoir.toLowerCase());
						var pvrMob = epure(donneesMonstre[10].toLowerCase());
						if (pvrMob.indexOf(pvrMimi) != -1) {
							mobMission = true;
						}
					}
			}
			if (mobMission) {
				mess += mess ? '\n\n' : '';
				mess += 'Mission ' + num + ' :\n' + obMissions[num].libelle;
			}
		}
		if (mess) {
			var td = getMonstreNomNode(i);
			appendText(td, ' ');
			td.appendChild(createImage(urlImg, mess));
		}
	}
}

function computeVLC(begin, end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeMission
	computeTactique(begin, end);
	if (!begin) {
		begin = 1;
	}
	if (!end) {
		end = nbMonstres;
	}
	var cache = getSortComp("Invisibilité") > 0 || getSortComp("Camouflage") > 0;
	if (!cache) {
		return false;
	}
	var urlImg = URL_MZimg09 + "oeil.png";
	for (var i = end ; i >= begin ; i--) {
		var id = getMonstreID(i);
		var donneesMonstre = listeCDM[id];
		if (donneesMonstre && donneesMonstre.length > 12) {
			if (donneesMonstre[12] == 1) {
				var td = getMonstreNomNode(i);
				td.appendChild(document.createTextNode(" "));
				td.appendChild(createImage(urlImg, "Voit le caché"));
			}
		}
	}
}

function computeTactique(begin, end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeVLC
	try {
		if (!begin) {
			begin = 1;
		}
		if (!end) {
			end = nbMonstres;
		}
		var noTactique = saveCheckBox(checkBoxTactique, 'NOTACTIQUE');
		if (noTactique || !isProfilActif()) {
			return;
		}

		for (var j = end ; j >= begin ; j--) {
			var id = getMonstreID(j);
			var nom = getMonstreNom(j);
			var donneesMonstre = listeCDM[id];
			if (donneesMonstre && nom.indexOf('Gowap') == -1) {
				var td = getMonstreNomNode(j);
				appendText(td, ' ');
				td.appendChild(createImageTactique(URL_MZimg09 + 'calc2.png', id, nom));
			}
		}
	}
	catch(e) {
		window.alert('Erreur computeTactique mob num : ' + j + ' :\n' + e)
	}
	filtreMonstres();
}

function updateTactique() {
// = Handler checkBox noTactique
	var noTactique = saveCheckBox(checkBoxTactique, 'NOTACTIQUE');
	if (!isCDMsRetrieved) {
		return;
	}

	if (noTactique) {
		for (var i = nbMonstres ; i > 0 ; i--) {
			var tr = getMonstreNomNode(i);
			var img = document.evaluate("img[@src='"+URL_MZimg09+"calc2.png']", tr, null, 9, null).singleNodeValue;
			if (img) {
				img.parentNode.removeChild(img.previousSibling);
				img.parentNode.removeChild(img);
			}
		}
	} else {
		computeTactique();
	}
}

function filtreMonstres() {
// = Handler universel pour les fonctions liées aux monstres
	var urlImg = URL_MZimg09 + 'Competences/ecritureMagique.png', urlEnchantImg = URL_MZimg09 + 'images/enchant.png';

	/* Vérification/Sauvegarde de tout ce qu'il faudra traiter */
	var useCss = MY_getValue(numTroll + '.USECSS') == 'true';
	var noGowaps = saveCheckBox(checkBoxGowaps, 'NOGOWAP'),
		noEngages = saveCheckBox(checkBoxEngages, 'NOENGAGE'),
		nivMin = saveComboBox(comboBoxNiveauMin, 'NIVEAUMINMONSTRE'),
		nivMax = saveComboBox(comboBoxNiveauMax, 'NIVEAUMAXMONSTRE');
	// old/new : détermine s'il faut ou non nettoyer les tr
	var oldNOEM = true, noEM = true;
	if (MY_getValue('NOINFOEM') != 'true') {
		noEM = saveCheckBox(checkBoxEM, 'NOEM');
	}
	// Filtrage par nom
	var strMonstre = document.getElementById('strMonstres').value.toLowerCase();
	// Génère la liste des mobs engagés (si filtrés)
	if (noEngages && !isEngagesComputed) {
		for (var i = nbTrolls ; i > 0 ; i--) {
			var pos = getTrollPosition(i);
			if (!listeEngages[pos[0]]) {
				listeEngages[pos[0]] = {};
			}
			if (!listeEngages[pos[0]][pos[1]]) {
				listeEngages[pos[0]][pos[1]] = {};
			}
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
		}
		isEngagesComputed = true;
	}

	/*** FILTRAGE ***/
	/* À computer :
	 * - EM (nom suffit)
	 * - Enchant (nom suffit)
	 * - Mission (nécessite CdM)
 	 * - mob VlC (nécessite CdM)
	 * Sans computation :
	 * - Gowap ? engagé ?
	 */
	for (var i = nbMonstres ; i > 0 ; i--) {
		var pos = getMonstrePosition(i);
		var nom = getMonstreNom(i).toLowerCase();
		if (noEM != oldNOEM) {
			if (noEM) {
				// Si noEM passe de false à true, on nettoie les td "Nom"
				// DEBUG: Sauf que ce serait carrément mieux avec des id...
				var tr = getMonstreNomNode(i);
				while(tr.childNodes.length > 1) {
					tr.removeChild(tr.childNodes[1]);
				}
			} else {
				var tr = getMonstreNomNode(i);
				var TypeMonstre = getEM(nom);
				if (TypeMonstre != '') {
					var infosCompo = compoMobEM(TypeMonstre);
					if (infosCompo.length > 0) {
						tr.appendChild(document.createTextNode(' '));
						tr.appendChild(createImage(urlImg, infosCompo));
					}
				}
			}
		}
		if (needComputeEnchantement || (noEM != oldNOEM && noEM)) {
			var texte = getInfoEnchantementFromMonstre(nom);
			if (texte != '') {
				var td = getMonstreNomNode(i);
				td.appendChild(document.createTextNode(' '));
				td.appendChild(createImage(urlEnchantImg, texte));
			}
		}

		tr_monstres[i].style.display =
			(noGowaps && nom.indexOf('gowap apprivoisé') != -1 && getMonstreDistance(i) > 1) ||
			(noEngages && getMonstreDistance(i) != 0 && listeEngages[pos[0]] && listeEngages[pos[0]][pos[1]] && listeEngages[pos[0]][pos[1]][pos[2]]) ||
			(strMonstre != '' && nom.indexOf(strMonstre) == -1) ||
			(nivMin > 0 && getMonstreLevel(i) != -1 && getMonstreLevel(i) < nivMin && getMonstreDistance(i) > 1 && nom.toLowerCase().indexOf("kilamo") == -1) ||	// wtf ?!...
			(nivMax > 0 && getMonstreLevel(i) > nivMax && getMonstreDistance(i) > 1 && nom.toLowerCase().indexOf("kilamo") == -1)
		? 'none' : '';
	}

	if (MY_getValue('NOINFOEM') != 'true') {
		if (noEM != oldNOEM) {
			if (noEM && isCDMsRetrieved) {
				computeMission();
			}
		}
		oldNOEM = noEM;
	}

	needComputeEnchantement = false;
}


/*-[functions]-------------------- Diplomatie --------------------------------*/

function refreshDiplo() {
	MY_setValue(numTroll + '.diplo.off', checkBoxDiplo.checked ? 'true' : 'false');
	if (isDiploRaw) {
		computeDiplo();
	}
	appliqueDiplo();
}

function computeDiplo() {
// On extrait les données de couleur et on les stocke par id
// Ordre de préséance :
//  source Guilde < source Perso
//  guilde cible < troll cible

	/* Diplo de Guilde */
	var diploGuilde = MY_getValue(numTroll + '.diplo.guilde') ? JSON.parse(MY_getValue(numTroll + '.diplo.guilde')) : {};
	if (diploGuilde && diploGuilde.isOn == 'true') {
		// Guilde perso
		if (diploGuilde.guilde) {
			Diplo.Guilde[diploGuilde.guilde.id] = {
				couleur: diploGuilde.guilde.couleur,
				titre: 'Ma Guilde'
			};
		}
		// Guildes/Trolls A/E
		for (var AE in {Amis:0, Ennemis:0}) {
			for (var i = 0 ; i < 5 ; i++) {
				if (diploGuilde[AE + i]) {
					for (var type in {Guilde:0, Troll:0}) {
						var liste = diploGuilde[AE + i][type].split(';');
						for (var j = liste.length - 2 ; j >= 0 ; j--) {
							Diplo[type][liste[j]] = {
								couleur: diploGuilde[AE + i].couleur,
								titre: diploGuilde[AE + i].titre
							};
						}
					}
				}
			}
		}
	}

	/* Diplo Perso */
	var diploPerso = MY_getValue(numTroll + '.diplo.perso') ? JSON.parse(MY_getValue(numTroll + '.diplo.perso')) : {};
	if (diploPerso && diploPerso.isOn == 'true') {
		for (var type in {Guilde:0, Troll:0, Monstre:0}) {
			for (var id in diploPerso[type]) {
				Diplo[type][id] = diploPerso[type][id];
			}
		}
	}
	if (diploPerso.mythiques) {
		Diplo.mythiques = diploPerso.mythiques;
	}

	isDiploRaw = false;
}

function appliqueDiplo() {
	var aAppliquer = Diplo;
	if (checkBoxDiplo.checked) {
		// Pour retour à l'affichage basique sur désactivation de la diplo
		aAppliquer = {
			Guilde: {},
			Troll: {},
			Monstre: {}
		};
	}

	/* On applique "aAppliquer" */
	// Diplo Trõlls
	for (var i = nbTrolls ; i > 0 ; i--) {
		var idG = getTrollGuildeID(i);
		var idT = getTrollID(i);
		var tr = tr_trolls[i];
		if (aAppliquer.Troll[idT]) {
			tr.className = '';
			var descr = aAppliquer.Troll[idT].titre;
			if (descr) {
				getTrollNomNode(i).title = descr;
			}
			tr.style.backgroundColor = aAppliquer.Troll[idT].couleur;
		} else if (aAppliquer.Guilde[idG]) {
			tr.className = '';
			var descr = aAppliquer.Guilde[idG].titre;
			if (descr) {
				getTrollNomNode(i).title = descr;
			}
			tr.style.backgroundColor = aAppliquer.Guilde[idG].couleur;
		} else {
			tr.className = 'mh_tdpage';
			getTrollNomNode(i).title = '';
		}
	}

	// Diplo Monstres
	for (var i = nbMonstres ; i > 0 ; i--) {
		var id = getMonstreID(i);
		var nom = getMonstreNom(i).toLowerCase();
		if (aAppliquer.Monstre[id]) {
			tr_monstres[i].className = '';
			tr_monstres[i].style.backgroundColor = aAppliquer.Monstre[id].couleur;
			tr_monstres[i].diploActive = 'oui';
			var descr = aAppliquer.Monstre[id].titre;
			if (descr) {
				getMonstreNomNode(i).title = descr;
			}
		} else if (aAppliquer.mythiques &&
			(nom.indexOf('liche') == 0 ||
			nom.indexOf('hydre') == 0 ||
			nom.indexOf('balrog') == 0 ||
			nom.indexOf('beholder') == 0)) {
			tr_monstres[i].className = '';
			tr_monstres[i].style.backgroundColor = aAppliquer.mythiques;
			tr_monstres[i].diploActive = 'oui';
			getMonstreNomNode(i).title = 'Monstre Mythique';
		} else {
			tr_monstres[i].className = 'mh_tdpage';
			tr_monstres[i].diploActive = '';
		}
	}
}


/* DEBUG: Section à mettre à jour */
var selectionFunction;

function startDrag(evt) {
	winCurr = this.parentNode;
	evt = evt || window.event; // Est-ce utile sous FF ? sous FF24+ ?
	offsetX = evt.pageX - parseInt(winCurr.style.left);
	offsetY = evt.pageY - parseInt(winCurr.style.top);
	selectionFunction = document.body.style.MozUserSelect;
	document.body.style.MozUserSelect = 'none';
	winCurr.style.MozUserSelect = 'none';
	return false;
}

function stopDrag(evt) {
	winCurr.style.MozUserSelect = selectionFunction;
	document.body.style.MozUserSelect = selectionFunction;
	winCurr = null;
}

function drag(evt) {
	if (winCurr == null) {
		return;
	}
	evt = evt || window.event;
	winCurr.style.left = (evt.pageX - offsetX) + 'px';
	winCurr.style.top = (evt.pageY - offsetY) + 'px';
	return false;
}
/* FIN DEBUG */
