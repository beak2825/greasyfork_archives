// ==UserScript==
// @name           MH - H2P - Bricol' Trolls
// @namespace      bricoltrolls
// @description    Eléments supplémentaires pour le Système Tactique des Bricol' Trolls
// @include        http*://trolls.ratibus.net/*
// @include        https://it.mh.raistlin.fr/*
// @icon           https://xballiet.github.io/ImagesMH/BricolTrolls.png
// @version        2.5
// @author         43406 - H2P
// @downloadURL https://update.greasyfork.org/scripts/12757/MH%20-%20H2P%20-%20Bricol%27%20Trolls.user.js
// @updateURL https://update.greasyfork.org/scripts/12757/MH%20-%20H2P%20-%20Bricol%27%20Trolls.meta.js
// ==/UserScript==

// Variables globales
var checkDate;
var indexHref;
var indexProfil;
var nodesHref;
var nodesProfil;
var timeout;
var now = new Date();
var one_day = 1000 * 60 * 60 * 24;
var one_month = 31 * one_day;

// Récupération de la date de la veille
yesterday = new Date(now.getTime() - one_day);
yyyy = yesterday.getFullYear();
mm = yesterday.getMonth() + 1;
if (mm < 10) {
	mm = '0' + mm;
}
dd = yesterday.getDate();
if (dd < 10) {
	dd = '0' + dd;
}
hh = yesterday.getHours();
if (hh < 10) {
	hh = '0' + hh;
}
mi = yesterday.getMinutes();
if (mi < 10) {
	mi = '0' + mi;
}
ss = yesterday.getSeconds();
if (ss < 10) {
	ss = '0' + ss;
}
var yesterdayString = '' + yyyy + mm + dd + hh + mi + ss;

// Récupération de la date d'il y a un mois
yestermonth = new Date(now.getTime() - one_month);
yyyy = yestermonth.getFullYear();
mm = yestermonth.getMonth() + 1;
if (mm < 10) {
	mm = '0' + mm;
}
dd = yestermonth.getDate();
if (dd < 10) {
	dd = '0' + dd;
}
hh = yestermonth.getHours();
if (hh < 10) {
	hh = '0' + hh;
}
mi = yestermonth.getMinutes();
if (mi < 10) {
	mi = '0' + mi;
}
ss = yestermonth.getSeconds();
if (ss < 10) {
	ss = '0' + ss;
}
var yestermonthString = '' + yyyy + mm + dd + hh + mi + ss;

// Fonction d'appel récursif aux liens de mises à jour
function nextNodeHref() {
	if (checkDate) {
		// Récupération de la date de dernière mise à jour
		node = document.evaluate("../../td[@class='date']", nodesHref.snapshotItem(indexHref), null, XPathResult.STRING_TYPE, null).stringValue;
		dateMAJ = node.substring(node.indexOf('MAJ : ') + 6);
		yyyy = dateMAJ.substring(6, 10);
		mm = dateMAJ.substring(3, 5);
		dd = dateMAJ.substring(0, 2);
		hh = dateMAJ.substring(11, 13);
		mi = dateMAJ.substring(14, 16);
		ss = dateMAJ.substring(17);
		dateMAJString = yyyy + mm + dd + hh + mi + ss;

		// On ne met à jour que si on a une date de dernière mise à jour et qu'elle est entre hier et il y a un mois
		majOK = (dateMAJString == '' || (yestermonthString < dateMAJString && dateMAJString < yesterdayString));
		//alert("hiddenFrame.src = _" + nodesHref.snapshotItem(indexHref).href + "_\r\nyestermonth = " + yestermonthString + ", dateMAJ = " + dateMAJString + " et yesterday = " + yesterdayString + " => majOK = " + majOK);
	} else {
		majOK = true;
	}
	if (majOK) {
		hiddenFrame.src = nodesHref.snapshotItem(indexHref).href;
	}

	// On passe au lien de mise à jour suivant s'il y en a un, sinon on rafraîchit la page
	indexHref++;
	if (indexHref < nodesHref.snapshotLength) {
		if (majOK) {
			setTimeout(nextNodeHref, timeout);
		} else {
			nextNodeHref();
		}
	} else {
		setTimeout("location.href = '" + location.href + "'", 1000);
		alert("Mise à jour terminée.");
	}
}

// Fonction d'appel récursif aux liens de profils (pas implémenté pour le moment)
function nextNodeProfil() {
	hiddenFrameProfils.src = nodesProfil.snapshotItem(indexProfil).href;
	//alert(document.getElementById('iFrameProfils').src);
	alert(document.getElementById('iFrameProfils').getElementsByTagName('btnUpdateProfil'));

	//alert("hiddenFrameProfils.src = _" + nodesProfil.snapshotItem(indexProfil).href + "_");

	// On passe au lien de mise à jour suivant s'il y en a un, sinon on rafraîchit la page
	indexProfil++;
	if (indexProfil < nodesProfil.snapshotLength) {
		setTimeout(nextNodeProfil, timeout);
	} else {
		setTimeout("location.href = '" + location.href + "'", 1000);
	}
}

// Fonction générique de mise à jour
function updateAll(href, notHref, tempo, doubleHidden) {
	// Récupération de tous les liens dont le href contient <href> et ne contient pas <notHref>
	nodes = document.evaluate("//a[contains(@href, '" + href + "')][not(contains(@href, '" + notHref + "'))]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	// Appels récursifs dans la frame cachée des liens récupérés
	timeout = tempo;
	if (doubleHidden) {
		indexProfil = 0;
		nodesProfil = nodes;
		nextNodeProfil();
	} else {
		indexHref = 0;
		nodesHref = nodes;
		nextNodeHref();
	}
}

// Fonction de mise à jour de tous les trolls depuis la page d'accueil
function updateAllTrolls() {
	checkDate = true;
	updateAll('update_info.php?id=', 'XBT', 3000);
}

// Fonction de mise à jour de tous les trolls depuis la page d'accueil sans vérification de la date de dernière mise à jour
function updateAllTrollsWithoutDateTest() {
	if (confirm("Voulez-vous vraiment tout mettre à jour ?\r\n(attention à la limite d'appel des scripts publics)")) {
		checkDate = false;
		updateAll('update_info.php?id=', 'XBT', 3000);
	}
}

// Fonction de mise à jour de tous les profils depuis la page d'accueil (pas implémenté pour le moment)
function updateAllProfils() {
	checkDate = true;
	updateAll('profil.php?id=', 'XBT', 10000, true);
}

// Fonction de mise à jour de tous les trolls et leurs profils depuis la page d'accueil (pas implémenté pour le moment)
function updateAllTrollsAndProfils() {
	checkDate = true;
	alert("MàJ de tout");
}

// Fonction de mise à jour générique
function updateAllBroll() {
	checkDate = true;
	updateAll('update_', 'id_mouche', 3000);
}

// Fonction d'ajout d'un élément (bouton, frame cachée...)
function makeElement(type, appendto, attributes, checked, chkdefault) {
	var element = document.createElement(type);
	if (attributes != null) {
		for (var i in attributes) {
			element.setAttribute(i, attributes[i]);
		}
	}
	if (checked != null) {
		if (GM_getValue(checked, chkdefault) == 'checked') {
			element.setAttribute('checked', 'checked');
		}
	}
	if (appendto) {
		appendto.appendChild(element);
	}
	return element;
}

// Pour le lien vers la page des compétences et sortilèges, on enlève les compétences/sortilèges que personne n'a
document.evaluate("//a[@href='competences-sortileges.php']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href = "competences-sortileges.php?cleanEmpty=1";

// Suppression des publicités de bas de page
document.getElementById("footer").outerHTML = "";

// Suppression des cadres News (et Diplomatie) et réduction du cadre Mémo
if (document.getElementById("news") != null) {
	document.getElementById("news").outerHTML = "";
}
/*if (document.getElementById("diplomatie") != null) {
	document.getElementById("diplomatie").outerHTML = "";
}*/
if (document.getElementById("memoContent") != null) {
	document.getElementById("memoContent").style = "display: none;";
}

// Frame cachée pour les mises à jour des profils depuis la page générale
var hiddenFrameProfils = makeElement('iframe', document.body, {'style':'position: absolute; top: 50%; left: 1px; width: 100%; height: 25%; border: 2px solid red; display: none;', 'name':'iFrameProfils', 'id':'iFrameProfils'});

// Frame cachée pour les mises à jour
var hiddenFrame = makeElement('iframe', document.body, {'style':'position: absolute; top: 75%; left: 1px; width: 100%; height: 25%; border: 2px solid red; display: none;', 'name':'iFrameHref', 'id':'iFrameHref'});

// Traitements pour la page d'accueil
if (location.href.indexOf('index.php') != -1) {
	// Récupération de tous les liens des vues
	var hrefVues = document.evaluate("//a[contains(@href, 'vue.php?vue=15&id=')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	// Parcours des liens des vues et remplacements avec des vues plus adéquates (vue max, pas de gowaps, pas de composants, pas de GG)
	for (var index = 0 ; index < hrefVues.snapshotLength ; index++) {
		hrefVues.snapshotItem(index).href = hrefVues.snapshotItem(index).href.replace('vue.php?vue=15&id=', 'vue.php?vue=100&gowapOff=1&composantOff=1&gigotsOff=1&id=');
	}

	// Bouton de mise à jour de tout
	//var updateAllTrollsButton = makeElement('input', document.body, {'type':'submit', 'value':'MàJ tout', 'style':'font-family: comic; font-size: 16pt; position: absolute; left: 70px; top: 30px; width: 200px; height: 35px; cursor: pointer;'});
	//updateAllTrollsButton.addEventListener('click', updateAllTrollsAndProfils, false);

	// Bouton de mise à jour des trolls
	var updateAllTrollsButton = makeElement('input', document.body, {'type':'submit', 'value':'MàJ tous les trolls', 'style':'font-family: comic; font-size: 16pt; position: absolute; left: 70px; top: 70px; width: 200px; height: 35px; cursor: pointer;'});
	updateAllTrollsButton.addEventListener('click', updateAllTrolls, false);

	// Bouton de mise à jour des trolls sans tester la date de dernière mise à jour
	var updateAllTrollsWithoutDateTestButton = makeElement('input', document.body, {'type':'submit', 'value':'MàJ trolls sans check', 'style':'font-family: comic; font-style: italic; color: red; font-size: 16pt; position: absolute; left: 305px; top: 70px; width: 200px; height: 35px; cursor: pointer;'});
	updateAllTrollsWithoutDateTestButton.addEventListener('click', updateAllTrollsWithoutDateTest, false);

	// Bouton de mise à jour de tous les profils
	//var updateAllProfilsButton = makeElement('input', document.body, {'type':'submit', 'value':'MàJ tous les profils', 'style':'font-family: comic; font-size: 16pt; position: absolute; left: 70px; top: 110px; width: 200px; height: 35px; cursor: pointer;'});
	//updateAllProfilsButton.addEventListener('click', updateAllProfils, false);
}

// Traitements pour les pages de profils
if (location.href.indexOf('profil.php') != -1) {
	// Bouton de mise à jour
	var updateAllProfilButton = makeElement('input', document.body, {'type':'submit', 'name':'btnUpdateProfil', 'id':'btnUpdateProfil', 'value':'MàJ tout le profil', 'style':'font-family: comic; font-size: 16pt; position: absolute; left: 70px; top: 70px; width: 200px; height: 35px; cursor: pointer;'});
	updateAllProfilButton.addEventListener('click', updateAllBroll, false);
}

// Traitements pour les pages de gowaps et tanières
if (location.href.indexOf('gowaps_tanieres.php') != -1) {
	// Bouton de mise à jour
	var updateAllGowapsTanieresButton = makeElement('input', document.body, {'type':'submit', 'name':'btnUpdateGowapsTanieres', 'id':'btnUpdateGowapsTanieres', 'value':'MàJ tous les Gowaps et Tanières', 'style':'font-family: comic; font-size: 16pt; position: absolute; left: 70px; top: 70px; width: 300px; height: 35px; cursor: pointer;'});
	updateAllGowapsTanieresButton.addEventListener('click', updateAllBroll, false);
}

// Traitements pour les pages de possessions
if (location.href.indexOf('possessions.php') != -1) {
	// Bouton de mise à jour
	var updateAllPossessionsButton = makeElement('input', document.body, {'type':'submit', 'name':'btnUpdatePossessions', 'id':'btnUpdatePossessions', 'value':'MàJ les possessions', 'style':'font-family: comic; font-size: 16pt; position: absolute; left: 70px; top: 70px; width: 200px; height: 35px; cursor: pointer;'});
	updateAllPossessionsButton.addEventListener('click', updateAllBroll, false);
}

// Traitements pour les pages de listes de vente
if (location.href.indexOf('listes_vente.php') != -1) {
	// Bouton de mise à jour
	var updateAllListesVenteButton = makeElement('input', document.body, {'type':'submit', 'name':'btnUpdateListesVente', 'id':'btnUpdateListesVente', 'value':'MàJ les listes de vente', 'style':'font-family: comic; font-size: 16pt; position: absolute; left: 70px; top: 70px; width: 300px; height: 35px; cursor: pointer;'});
	updateAllListesVenteButton.addEventListener('click', updateAllBroll, false);
}