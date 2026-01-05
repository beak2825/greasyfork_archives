// ==UserScript==
// @name        MH - Raistlin - Reorg
// @namespace   MH
// @description Réorganisation de la vue de MountyHall
// @include     */MH_Play/Play_vue*
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.16
// @grant       none
// @require     https://greasyfork.org/scripts/24178-mh-h2p-code-mutualis%C3%A9?version=161949&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/24093/MH%20-%20Raistlin%20-%20Reorg.user.js
// @updateURL https://update.greasyfork.org/scripts/24093/MH%20-%20Raistlin%20-%20Reorg.meta.js
// ==/UserScript==

// Reste à faire : Bascule CdM monstres
// Ouvert aux suggestions constructives

var vueArray;

function copyArray(oldArray) {
	var newArray = new Array();
	for (var i = 0 ; i < oldArray.length ; i++) {
		newArray.push(oldArray[i]);
	}
	return newArray;
}

var tr_cadavres = {};
var nbCadavres = 0;

// Renvoie la première colonne (distance) de l'élément (<tr>) passé en argument
function getmyDistance(element) {
	var tds = element.childNodes[0].firstChild.nodeValue;
	return parseInt(tds);
}

// Renvoie les X,Y,Z de l'élément (<tr>) passé en argument
function getPositionElement(element) {
	var tds = element.childNodes;
	var j = tds.length;
	return new Array(parseInt(tds[j - 3].firstChild.nodeValue), parseInt(tds[j - 2].firstChild.nodeValue), parseInt(tds[j - 1].firstChild.nodeValue));
}

// Test d'égalité entre les coordonnées de deux éléments (<tr>) rajouté par Tilk pour alterner les couleurs
function isTREqual(tr1, tr2) {
	if (getmyDistance(tr1) != getmyDistance(tr2)) {
		return false;
	}
	var pos1 = getPositionElement(tr1);
	var pos2 = getPositionElement(tr2);
	for (var i = 0 ; i <= 2 ; i++) {
		if (parseInt(pos1[i]) != parseInt(pos2[i])) {
			return false;
		}
	}
	return true;
}

/* Fonction de tri de la vue réorganisée : on trie dans l'ordre suivant
1) la distance (croissante)
2) X
3) Y
4) Z
5) le type d'élément : Monstres puis Trõlls puis Trésors puis Champis puis Lieux (l'ordre des sections de la vue 'normale')
*/
function triVue(a, b) {
	retour = 0;
	if (getmyDistance(a[1]) < getmyDistance(b[1])) {
		retour = -1;
	} else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] < getPositionElement(b[1])[0]) {
		retour = -1;
	} else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] < getPositionElement(b[1])[1]) {
		retour = -1;
	} else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] == getPositionElement(b[1])[1] && getPositionElement(a[1])[2] < getPositionElement(b[1])[2]) {
		retour = -1;
	} else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] == getPositionElement(b[1])[1] && getPositionElement(a[1])[2] == getPositionElement(b[1])[2]) {
		retour = 0;
	} else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] == getPositionElement(b[1])[1] && getPositionElement(a[1])[2] == getPositionElement(b[1])[2] && a[0] < b[0]) {
		retour = -1;
	} else {
		retour = 1;
	}
	return retour;
}

// Permet de choisir si les lignes réorganisées sont supprimées de la vue "normale" ou non
function moveOrCopy(source){
	return source.cloneNode(true);
}

function newRefreshDiplo(begin, end) {
	refreshDiplo_reorg(begin, end);
	analyse(null);
}

function newComputeMission(begin, end) {
	computeMission_reorg(begin, end);
	analyse(null);
}

function calculeDist(elem1, elem2) {
	var distance = 0;
	if (elem1 == null && elem2 == null) {
		return 0;
	} else if (elem1 == null && elem2 != null) {
		return getmyDistance(elem2);
	} else if (elem2 == null && elem1 != null) {
		return getmyDistance(elem1);
	} else {
		distance = Math.max(distance, Math.abs(getPositionElement(elem1)[0] - getPositionElement(elem2)[0]));
		distance = Math.max(distance, Math.abs(getPositionElement(elem1)[1] - getPositionElement(elem2)[1]));
		distance = Math.max(distance, Math.abs(getPositionElement(elem1)[2] - getPositionElement(elem2)[2]));
	}
	return distance;
}

function assombritCouleur(str) {
	arr = str.replace(/rgb\(|\)/g, "").split(",");
	res = new Array();
	res[0] = parseInt(arr[0], 10) - 40;
	res[1] = parseInt(arr[1], 10) - 40;
	res[2] = parseInt(arr[2], 10) - 40;
	return "rgb(" + res[0] + "," + res[1] + "," + res[2] + ")";
}

function setCheckBoxCookie(chkb, pref) {
	var etat = chkb.checked;
	MY_setValue(pref, etat ? 'true' : 'false');
	return etat;
}

function getCheckBoxCookie(chkb, pref) {
	chkb.checked = (MY_getValue(pref) == 'true');
}

function setTextBoxCookie(tb, pref) {
	var tbvalue = tb.value;
	MY_setValue(pref, tbvalue);
	return tbvalue;
}

function getTextBoxCookie(tb, pref) {
	tb.value = MY_getValue(pref) ? MY_getValue(pref) : 0;
}

// Fonction de copie des différents tableaux correspondant aux différentes sections de la vue, rajouté par Tilk
function backupArray() {
	for (var type in typesAFetcher) {
		fetchData(type);
	}
	fetchData('cadavres');

	tr_monstres = this['tr_monstres'];
	tr_trolls = this['tr_trolls'];
	tr_tresors = this['tr_tresors'];
	tr_champignons = this['tr_champignons'];
	tr_lieux = this['tr_lieux'];
	tr_cadavres = this['tr_cadavres'];

	nbMonstres = this['nbMonstres'];
	nbTrolls = this['nbTrolls'];
	nbTresors = this['nbTresors'];
	nbChampignons = this['nbChampignons'];
	nbLieux = this['nbLieux'];
	nbCadavres = this['nbCadavres'];

	x_monstres = copyArray(tr_monstres);
	x_trolls = copyArray(tr_trolls);
	x_tresors = copyArray(tr_tresors);
	x_champis = copyArray(tr_champignons);
	x_lieux = copyArray(tr_lieux);
	x_cenotaphes = copyArray(tr_cadavres);

	totaltab = copyArray(document.getElementsByTagName('table')[0]);
}

// Possibilité de centrer sur un élément de la vue
function analyse(centre) {
	// Bizarrement quand on fait un clic sur 'Mise à jour', ça lance 'analyse' avec le MouseEvent comme argument
	if (centre != null && centre.className == null) {
		analyse(null);
		return;
	}

	// Mise à jour du about:config
	setCheckBoxCookie(checkBoxVRM, "REORGFILTREMONSTRES");    // Faut-il reorg les monstres ?
	setCheckBoxCookie(checkBoxVRT, "REORGFILTRETROLLS");      // Faut-il reorg les trõlls ?
	setCheckBoxCookie(checkBoxVRO, "REORGFILTRETRESORS");     // Faut-il reorg les tresors ?
	setCheckBoxCookie(checkBoxVRC, "REORGFILTRECHAMPIS");     // Faut-il reorg les champis ?
	setCheckBoxCookie(checkBoxVRL, "REORGFILTRELIEUX");       // Faut-il reorg les lieux ?
	setCheckBoxCookie(checkBoxVRCe, "REORGFILTRECENOS");      // Faut-il reorg les cenotaphes ?
	setCheckBoxCookie(checkBoxRemAnalyse, "REORGREMSCRIPT");  // Faut-il désactiver le script ?

	setTextBoxCookie(distFiltreM, "REORGDISTMONSTRES");       // Distance de reorg de chaque type d'item
	setTextBoxCookie(distFiltreT, "REORGDISTTROLLS");
	setTextBoxCookie(distFiltreO, "REORGDISTTRESORS");
	setTextBoxCookie(distFiltreC, "REORGDISTCHAMPIS");
	setTextBoxCookie(distFiltreL, "REORGDISTLIEUX");
	setTextBoxCookie(distFiltreCe, "REORGDISTCENOS");

	var vCNode = document.getElementById('reorgTable');
	if (vCNode != null) {
		vCNode.parentNode.removeChild(vCNode);
	}

	if (checkBoxRemAnalyse.checked) {
		return null;
	}

	vueArray = new Array();
	var index = 0;
	var myDeltaColspan = 0;

	// On récupère le nombre max de colonnes dans l'ensemble de la vue, pour adapter les colonnes des autres parties
	// Le nombre de colonnes peut varier en fonction de l'intégration de scripts et des différentes IT
	var maxNbCols = 0;
	if (x_monstres[1] != null && maxNbCols < x_monstres[1].childNodes.length) {
		maxNbCols = x_monstres[1].childNodes.length;
	}
	if (x_trolls[1] != null && maxNbCols < x_trolls[1].childNodes.length) {
		maxNbCols = x_trolls[1].childNodes.length;
	}
	if (x_tresors[1] != null && maxNbCols < x_tresors[1].childNodes.length) {
		maxNbCols = x_tresors[1].childNodes.length;
	}
	if (x_champis[1] != null && maxNbCols < x_champis[1].childNodes.length) {
		maxNbCols = x_champis[1].childNodes.length;
	}
	if (x_lieux[1] != null && maxNbCols < x_lieux[1].childNodes.length) {
		maxNbCols = x_lieux[1].childNodes.length;
	}
	myDeltaColspan = maxNbCols - 7;

	// On rajoute les trõlls en vue dans le tableau global, si ceux-ci sont à une distance inférieure à celle paramétrée
	// On commence par rajouter le trõll qui joue, histoire que s'il bouge, il sache se retrouver
	var large = '100%';
	var distanceCT = 0;
	var numTroll = document.getElementsByName("ai_IdPJ")[0].value;
	var currentTrollRow = document.createElement('TR');
	currentTrollRow.setAttribute('class', 'mh_tdpage');
	currentTrollRow.style.fontWeight = 'bold';

	// Distance
	distTD = document.createElement('TD');
	distTD.style.fontSize = large;
	distTD.appendChild(document.createTextNode(distanceCT));
	currentTrollRow.appendChild(distTD);

	// Action, toujours vide
	actionD = document.createElement('TD');
	currentTrollRow.appendChild(actionD);

	// Num
	numTD = document.createElement('TD');
	numTD.style.fontSize = large;
	numTD.appendChild(document.createTextNode(numTroll));
	currentTrollRow.appendChild(numTD);

	// Niveau
	nivTD = document.createElement('TD');
	nivTD.style.fontSize = large;
	nivTD.appendChild(document.createTextNode(document.getElementsByName("ai_Niveau")[0].value));
	nivTD.setAttribute('align', 'center');
	currentTrollRow.appendChild(nivTD);

	// Nom
	nomTD = document.createElement('TD');
	nomTD.style.fontSize = large;
	nomLink = document.createElement('a');
	nomLink.setAttribute('href', 'javascript:EPV(' + numTroll + ')');
	nomText = document.createTextNode(document.getElementsByName("as_Nom")[0].value);
	nomLink.appendChild(nomText);
	nomTD.appendChild(nomLink);
	currentTrollRow.appendChild(nomTD);

	// Race
	raceTD = document.createElement('TD');
	raceTD.style.fontSize = large;
	raceTD.appendChild(document.createTextNode(MY_getValue(numTroll + ".race")));
	currentTrollRow.appendChild(raceTD);

	// Guilde
	guildeTD = document.createElement('TD');
	guildeTD.style.fontSize = large;
	guildeLink = document.createElement('a');
	guildeLink.setAttribute('href', 'javascript:EAV(' + MY_getValue(numTroll + ".idguilde") + ',750,550)');
	guildeText = document.createTextNode(MY_getValue(numTroll + ".nomguilde"));
	guildeLink.appendChild(guildeText);
	guildeTD.appendChild(guildeLink);
	currentTrollRow.appendChild(guildeTD);

	if (maxNbCols == 11) {
		// PA
		paTD = document.createElement('TD');
		paTD.style.fontSize = large;
		paTD.appendChild(document.createTextNode(""));
		paTD.setAttribute('align', 'center');
		currentTrollRow.appendChild(paTD);

		// PV
		pvTD = document.createElement('TD');
		pvTD.style.fontSize = large;
		pvTD.appendChild(document.createTextNode(""));
		pvTD.setAttribute('align', 'center');
		currentTrollRow.appendChild(pvTD);
	}

	//window.alert(document.getElementById('corpsInfoTab').firstChild.firstChild.innerText);
	// Position X
	xTD = document.createElement('TD');
	xTD.style.fontSize = large;
	xTD.appendChild(document.createTextNode(parseInt(MY_getValue(numTroll + ".position.X"))));
	xTD.setAttribute('align', 'center');
	currentTrollRow.appendChild(xTD);

	// Position Y
	yTD = document.createElement('TD');
	yTD.style.fontSize = large;
	yTD.appendChild(document.createTextNode(parseInt(MY_getValue(numTroll + ".position.Y"))));
	yTD.setAttribute('align', 'center');
	currentTrollRow.appendChild(yTD);

	// Position Z
	zTD = document.createElement('TD');
	zTD.style.fontSize = large;
	zTD.appendChild(document.createTextNode(parseInt(MY_getValue(numTroll + ".position.N"))));
	zTD.setAttribute('align', 'center');
	currentTrollRow.appendChild(zTD);

	vueArray[index] = new Array();
	vueArray[index][0] = 1;
	vueArray[index][1] = currentTrollRow;
	index++;

	// On copie les monstres en vue dans un tableau global, si ceux-ci sont à une distance inférieure à celle paramétrée
	var myDistance = distFiltreM.value;
	for (var cpt = 1 ; cpt < x_monstres.length ; cpt++) {
		if (x_monstres[cpt].style.display != 'none' && getmyDistance(x_monstres[cpt]) != null && calculeDist(centre,x_monstres[cpt])<= myDistance && !checkBoxVRM.checked) {
			vueArray[index] = new Array();
			vueArray[index][0] = 0;
			vueArray[index][1] = moveOrCopy(x_monstres[cpt]);
			var checkBoxLevels = document.getElementById('delniveau');
			if (!checkBoxLevels.checked) {
				vueArray[index][1].childNodes[4].setAttribute('colspan', myDeltaColspan);
			} else {
				vueArray[index][1].childNodes[2].setAttribute('colspan', '2');
				vueArray[index][1].childNodes[3].setAttribute('colspan', myDeltaColspan);
			}
			if (!checkBoxLevels.checked) {
				vueArray[index][1].childNodes[3].addEventListener("click", function() {basculeCDM(getMonstreNomByTR(this.parentNode), getMonstreIDByTR(this.parentNode));}, true);
			}
			index++;
		}
	}

	// On copie les trõlls en vue dans un tableau global, si ceux-ci sont à une distance inférieure à celle paramétrée
	var myDistance = distFiltreT.value;
	var myReorgTrollsArray = new Array();
	var posTrollInNewArray = 0;
	for (var cpt = 1 ; cpt < x_trolls.length ; cpt++) {
		if (x_trolls[cpt].style.display != 'none' && getmyDistance(x_trolls[cpt]) != null && calculeDist(centre, x_trolls[cpt]) <= myDistance && !checkBoxVRT.checked) {
			vueArray[index] = new Array();
			vueArray[index][0] = 1;
			vueArray[index][1] = moveOrCopy(x_trolls[cpt]);
			vueArray[index][1].insertBefore(vueArray[index][1].childNodes[4], vueArray[index][1].childNodes[3]);
			vueArray[index][1].childNodes[3].addEventListener("mouseover", showPXTroll, true);
			vueArray[index][1].childNodes[3].addEventListener("mouseout", hidePXTroll, true);
			//vueArray[index][1].childNodes[4].lastChild.addEventListener("mouseover", showPopup, true);
			//vueArray[index][1].childNodes[4].lastChild.addEventListener("mouseout", hidePopup, true);
			index++;
		}
	}

	// On rajoute les trésors en vue dans le tableau global, si ceux-ci sont à une distance inférieure à celle paramétrée
	var myDistance = distFiltreO.value;
	for (var cpt = 1 ; cpt < x_tresors.length ; cpt++) {
		if (x_tresors[cpt].style.display != 'none' && getmyDistance(x_tresors[cpt]) != null && calculeDist(centre, x_tresors[cpt]) <= myDistance && !checkBoxVRO.checked) {
			vueArray[index] = new Array();
			vueArray[index][0] = 2;
			vueArray[index][1] = moveOrCopy(x_tresors[cpt]);
			vueArray[index][1].childNodes[1].setAttribute('colspan', '2');
			vueArray[index][1].childNodes[2].setAttribute('colspan', myDeltaColspan);
			index++;
		}
	}

	// On rajoute les champis en vue dans le tableau global, si ceux-ci sont à une distance inférieure à celle paramétrée
	var myDistance = distFiltreC.value;
	for (var cpt = 1 ; cpt < x_champis.length ; cpt++) {
		if (x_champis[cpt].style.display != 'none' && getmyDistance(x_champis[cpt]) != null && calculeDist(centre, x_champis[cpt]) <= myDistance && !checkBoxVRC.checked) {
			vueArray[index] = new Array();
			vueArray[index][0] = 3;
			vueArray[index][1] = moveOrCopy(x_champis[cpt]);
			vueArray[index][1].childNodes[0].setAttribute('colspan', '3');
			vueArray[index][1].childNodes[1].setAttribute('colspan', myDeltaColspan);
			index++;
		}
	}

	// On rajoute les lieux en vue dans le tableau global, si ceux-ci sont à une distance inférieure à celle paramétrée
	var myDistance = distFiltreL.value;
	for (var cpt = 1 ; cpt < x_lieux.length ; cpt++) {
		if (x_lieux[cpt].style.display != 'none' && getmyDistance(x_lieux[cpt]) != null && calculeDist(centre, x_lieux[cpt]) <= myDistance && !checkBoxVRL.checked) {
			vueArray[index] = new Array();
			vueArray[index][0] = 4;
			vueArray[index][1] = moveOrCopy(x_lieux[cpt]);
			vueArray[index][1].childNodes[1].setAttribute('colspan', '2');
			vueArray[index][1].childNodes[2].setAttribute('colspan', myDeltaColspan);
			index++;
		}
	}

	// On rajoute les cénotaphes en vue dans le tableau global, si ceux-ci sont à une distance inférieure à celle paramétrée ///////// A rajouter
	var myDistance = distFiltreCe.value;
	for (var cpt = 1 ; cpt < x_cenotaphes.length ; cpt++) {
		if (x_cenotaphes[cpt].style.display != 'none' && getmyDistance(x_cenotaphes[cpt]) != null && calculeDist(centre, x_cenotaphes[cpt]) <= myDistance && !checkBoxVRCe.checked) {
			vueArray[index] = new Array();
			vueArray[index][0] = 2;
			vueArray[index][1] = moveOrCopy(x_cenotaphes[cpt]);
			vueArray[index][1].childNodes[1].setAttribute('colspan', '2');
			vueArray[index][1].childNodes[2].setAttribute('colspan', myDeltaColspan);
			index++;
		}
	}

	// On insère avant la vue 'normale' le tableau qui contiendra la vue réorganisée (rabattable)
	var insertPoint = document.getElementById('infoTab').parentNode.nextSibling;

	// Si la vue classée n'existe pas encore, on la crée
	var pVue = document.createElement('P');
	insertBefore(insertPoint, pVue);
	var maTable = document.createElement('table');
	maTable.setAttribute('width', '100%');
	maTable.setAttribute('border', '0');
	maTable.setAttribute('align', 'center');
	maTable.setAttribute('cellpadding', '2');
	maTable.setAttribute('cellspacing', '1');
	maTable.setAttribute('class', 'mh_tdborder');
	maTable.setAttribute('id','reorgTable');

	var mythead = document.createElement("thead");
	maTable.appendChild(mythead);

	pVue.appendChild(maTable);
	totaltab.push(maTable);

	var tr = appendTr(mythead, 'mh_tdtitre');
	tr.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	tr.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	tr.setAttribute('height', "30");
	tr.addEventListener("click", function() {
		try {
			var tbody = totaltab[totaltab.length - 1].childNodes[1];
			if (!tbody.getAttribute('style') || tbody.getAttribute('style') == ''){
				reorgVisible = 'display:none;';
			} else {
				reorgVisible = '';
			}
			tbody.setAttribute('style', reorgVisible);
			MY_setValue('REORGVISIBLE', reorgVisible);
		} catch(e) {
			window.alert(e);
		}
	}, true);
	appendTdText(tr, "\u00a0VUE REORGANISEE", true).setAttribute('colspan', maxNbCols);
	var mytbody = document.createElement('tbody');
	maTable.appendChild(mytbody);

	if (MY_getValue('REORGVISIBLE') != null) {
		mytbody.setAttribute('style', MY_getValue('REORGVISIBLE'));
	} else {
		mytbody.setAttribute('style', '');
	}

	tr = appendTr(mytbody, 'mh_tdtitre');
	appendTdText(tr, "Dist.", true).setAttribute('width', 40);
	appendTdText(tr, "Actions", true).setAttribute('width', 25);
	appendTdText(tr, "Réf.", true).setAttribute('width', 40);
	appendTdText(tr, "Niveau", true).setAttribute('width', 25);
	appendTdText(tr, "Nom", true).setAttribute('align', 'left');;
	appendTdText(tr, "Race", true);
	appendTdText(tr, "Guilde", true);
	if (myDeltaColspan == 5) {
		appendTdText(tr, "PV", true);
		appendTdText(tr, "PA", true);
	}
	appendTdText(tr, "X", true).setAttribute('width', 25);
	appendTdText(tr, "Y", true).setAttribute('width', 25);
	appendTdText(tr, "N", true).setAttribute('width', 25);

	// On remplace la distance au joueur par celle à la case ciblée
	for (i = 0 ; i < vueArray.length ; i++) {
		vueArray[i][1].firstChild.setAttribute('title', "distance réelle : " + vueArray[i][1].firstChild.firstChild.nodeValue);
		vueArray[i][1].firstChild.firstChild.nodeValue = calculeDist(centre, vueArray[i][1]);
	}

	// On trie le tableau global de vue pour pouvoir l'afficher dans l'ordre de distance plutôt que par section
	vueTriee = vueArray.sort(triVue);

	// On met des couleurs alternées pour voir ce qui est sur la même case que quoi
	var arrayClasse = new Array("mh_tdpage", "mh_tdtitre");
	var indiceClasse = 0;
	var centreImage;
	for (i = 0 ; i < vueTriee.length ; i++) {
		if (i != 0) {
			if (!isTREqual(vueTriee[i][1], vueTriee[i-1][1])) {
				indiceClasse = (indiceClasse + 1) % 2;
				vueTriee[i][1].childNodes[0].appendChild(document.createTextNode(" "));
				centreImage = createImage('https://raistlin.fr/mh/mz/vue/centrage.png', 'Centrer sur cette case');
				centreImage.addEventListener("click", function() {
					try {
						analyse(this.parentNode.parentNode);
					} catch(e) {
						window.alert(e);
					}
				}, true);
				vueTriee[i][1].childNodes[0].appendChild(centreImage);
			}
			if (calculeDist(centre, vueTriee[i][1]) != calculeDist(centre, vueTriee[i-1][1])) {
				for (a = 0 ; a < vueTriee[i][1].childNodes.length ; a++){
					vueTriee[i][1].childNodes[a].style.borderTop = "2px solid black";
				}
			}
			if (vueTriee[i][1].style.backgroundColor == "") {
				vueTriee[i][1].setAttribute('class', arrayClasse[indiceClasse]);
			} else {
				if (arrayClasse[indiceClasse] == "mh_tdtitre") {
					vueTriee[i][1].style.backgroundColor = assombritCouleur(vueTriee[i][1].style.backgroundColor);
				}
			}
		}
		mytbody.appendChild(vueTriee[i][1]);
	}
}

// Ajout de la ligne dans l'entête
try {
	backupArray();
	initPXTroll();
	var tbody = document.getElementsByName('LimitViewForm')[0].getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
	var headTr = appendTr(tbody, 'mh_tdpage');
	td3 = appendTdText(headTr, 'VUE REORGANISEE :', true);
	td3.setAttribute('align', 'center');
	td3 = appendTdCenter(headTr, 2);

	// Ajout des différents filtres :
	// Copie ou déplacement des lignes ?
	checkBoxRemAnalyse = appendNobr(td3, 'RemAnalyse', null, 'Désactiver le script').firstChild;

	// Types de lignes réorganisées : en cas de modification, on recharge la vue réorganisée
	var maTable2 = document.createElement('table');
	maTable2.setAttribute('border', '0');
	maTable2.setAttribute('class', 'mh_tdborder');
	maTable2.setAttribute('align', 'center');
	maTable2.setAttribute('cellpadding', '2');
	maTable2.setAttribute('cellspacing', '1');
	var mytbody2 = document.createElement('tbody');
	maTable2.appendChild(mytbody2);
	td3.appendChild(maTable2);

	tr = appendTr(mytbody2, 'mh_tdtitre');
	appendTdText(tr, "", true).setAttribute('align', 'center');
	td2 = appendTdText(tr, "Monstres", true);
	td2.setAttribute('align', 'center');
	td2.setAttribute('width', 100);
	td2 = appendTdText(tr, "Trõlls", true);
	td2.setAttribute('align', 'center');
	td2.setAttribute('width', 100);
	td2 = appendTdText(tr, "Trésors", true);
	td2.setAttribute('align', 'center');
	td2.setAttribute('width', 100);
	td2 = appendTdText(tr, "Champis", true);
	td2.setAttribute('align', 'center');
	td2.setAttribute('width', 100);
	td2 = appendTdText(tr, "Lieux", true);
	td2.setAttribute('align', 'center');
	td2.setAttribute('width', 100);
	td2 = appendTdText(tr, "Cénotaphes", true);
	td2.setAttribute('align', 'center');
	td2.setAttribute('width', 100);

	// Cacher ou non les types de lignes
	tr = appendTr(mytbody2, 'mh_tdpage');
	td2 = appendTdText(tr, "Ne pas Réorg", true);
	td2.setAttribute('align', 'center');
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	checkBoxVRM = appendNobr(td2, 'remM', null, '').firstChild;
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	checkBoxVRT = appendNobr(td2, 'remT', null, '').firstChild;
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	checkBoxVRO = appendNobr(td2, 'remO', null, '').firstChild;
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	checkBoxVRC = appendNobr(td2, 'remC', null, '').firstChild;
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	checkBoxVRL = appendNobr(td2, 'remL', null, '').firstChild;
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	checkBoxVRCe = appendNobr(td2, 'remCe', null, '').firstChild;

	// Distance réorganisée par type de ligne
	tr = appendTr(mytbody2, 'mh_tdpage');
	td2 = appendTdText(tr, "Distance de Réorg", true);
	td2.setAttribute('align', 'center');
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	distFiltreM = appendTextbox(td2, 'text', 'distFiltreM', 3, 3, 5);
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	distFiltreT = appendTextbox(td2, 'text', 'distFiltreT', 3, 3, 5);
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	distFiltreO = appendTextbox(td2, 'text', 'distFiltreO', 3, 3, 5);
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	distFiltreC = appendTextbox(td2, 'text', 'distFiltreC', 3, 3, 5);
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	distFiltreL = appendTextbox(td2, 'text', 'distFiltreL', 3, 3, 5);
	td2 = appendTdText(tr, "", true);
	td2.setAttribute('align', 'center');
	distFiltreCe = appendTextbox(td2, 'text', 'distFiltreCe', 3, 3, 5);

	getCheckBoxCookie(checkBoxVRM, "REORGFILTREMONSTRES");
	getCheckBoxCookie(checkBoxVRT, "REORGFILTRETROLLS");
	getCheckBoxCookie(checkBoxVRO, "REORGFILTRETRESORS");
	getCheckBoxCookie(checkBoxVRC, "REORGFILTRECHAMPIS");
	getCheckBoxCookie(checkBoxVRL, "REORGFILTRELIEUX");
	getCheckBoxCookie(checkBoxVRCe, "REORGFILTRECENOS");
	getCheckBoxCookie(checkBoxRemAnalyse, "REORGREMSCRIPT");

	getTextBoxCookie(distFiltreM, "REORGDISTMONSTRES");
	getTextBoxCookie(distFiltreT, "REORGDISTTROLLS");
	getTextBoxCookie(distFiltreO, "REORGDISTTRESORS");
	getTextBoxCookie(distFiltreC, "REORGDISTCHAMPIS");
	getTextBoxCookie(distFiltreL, "REORGDISTLIEUX");
	getTextBoxCookie(distFiltreCe, "REORGDISTCENOS");

	// En cas de modification, on recharge la vue réorganisée
	filtreButton = appendButton(td3, 'Mise à jour', analyse);
	filtreButton.setAttribute('name', 'filtreButton');
	appendText(td3, '\u000a\u000a');
	analyse(null);
	computeMission_reorg = computeMission;
	computeMission = newComputeMission;
	refreshDiplo_reorg = refreshDiplo;
	refreshDiplo = newRefreshDiplo;
	analyse;
} catch (e) {
	window.alert(e);
}