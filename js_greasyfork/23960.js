// ==UserScript==
// @name        MH - Dabihul - Assistant Mélanges Magiques
// @namespace   MH
// @description ~ Affichage Stabilisation des compos + Assistant Mélange Magique ~
// @include		*/MH_Taniere/TanierePJ_o_Stock*
// @include		*/MH_Comptoirs/Comptoir_o_Stock*
// @include		*/MH_Follower/FO_Equipement*
// @include		*/MH_Play/Play_e_follo*
// @include		*/View/TaniereDescription*
// @include		*/MH_Play/Play_equipement*
// @include		*/MH_Play/Actions/Competences/Play_a_Competence25*
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.6
// @grant       none
// @require     https://greasyfork.org/scripts/23602-tout-mz?version=892175&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/23960/MH%20-%20Dabihul%20-%20Assistant%20M%C3%A9langes%20Magiques.user.js
// @updateURL https://update.greasyfork.org/scripts/23960/MH%20-%20Dabihul%20-%20Assistant%20M%C3%A9langes%20Magiques.meta.js
// ==/UserScript==

/**
 * This file is part of MountyZilla (http://mountyzilla.tilk.info/),
 * published under GNU License v2.
 *
 * Script MountyZilla :
 * ~ Affichage Stabilisation des compos + Assistant Mélange Magique ~
 */

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g,'');
}

function epure(texte) {
	return texte.replace(/[àâä]/g, 'a').replace(/Â/g, 'A').replace(/[ç]/g, 'c').replace(/[éêèë]/g, 'e').replace(/[ïî]/g, 'i').replace(/[ôöõ]/g, 'o').replace(/[ùûü]/g, 'u');
}

function insertBefore(next, el) {
	next.parentNode.insertBefore(el, next);
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

// URL icone Mélange Magique
var urlImg = 'http://mountyzilla.tilk.info/scripts_1.1/images/Competences/melangeMagique.png';

// BDD
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

var effetQual = {
	'Tres Bonne':20,
	'Bonne':16,
	'Moyenne':12,
	'Mauvaise':8,
	'Tres Mauvaise':4
}


/*                Fonctions d'affichage des % de Stabilisation                */

function createMMImage(url) {
// Prépare l'icône à afficher pour les infos MM
	var img = document.createElement('img');
	img.src = url;
	img.align = 'absmiddle';
	img.alt = 'MM';
	return img;
}

function addInfo(node,mob,niv,qualite,effet) {
// Ajoute un span + titre d'infos de compo à la fin de node
	appendText(node, ' ');
	var span = document.createElement('span');
	span.appendChild(createMMImage(urlImg));
	appendText(span, ' [-' + (niv + effet) + ' %]');
	var str = '';
	switch(mob[0]) {
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
	span.title = str + mob + ' : -' + niv + '\nQualité ' + qualite + ' : -' + effet;
	node.appendChild(span);
}

function getSetInfo(snap) {
// Extrait et affiche les infos MM d'un compo *dans un tr standard*
	if (isNaN(snap.childNodes[1].getElementsByTagName('img')[0].alt[0])) {
		// Si non identifié, on laisse
		return;
	}
	var node = snap.childNodes[5];
	var mob = node.firstChild.textContent;
	mob = trim(mob.slice(mob.indexOf("d'un") + 5));
	var niv = nival[epure(mob)];
	var qualite = snap.childNodes[7].textContent;
	qualite = trim(qualite.slice(qualite.indexOf('Qualit') + 9));
	var effet = effetQual[epure(qualite)];
	if (niv && effet) {
		// Si compo référencé (mob en base), on affiche & stocke les infos
		addInfo(node, mob, niv, qualite, effet);
	}
}

function mmListeGowap() {
// Traitement de la page qui liste les gowaps
	try {
		// On extrait les nums de gowaps
		var gogoList = document.evaluate(".//form/table/descendant::table/tbody/tr/td[@class='mh_titre3']/a", document, null, 7, null);
		window.console.debug("[mmassistant] Liste suivants : " + gogoList);
		var gogoNumbers = [];
		for (var i = 0 ; i < gogoList.snapshotLength ; i++) {
			gogoNumbers.push(parseInt(gogoList.snapshotItem(i).textContent));
		}
	} catch(e) {
		return;
	}

	// Puis pour chaque gowap, on recherche les compos portés et on traite
	for (var j = 0 ; j < gogoNumbers.length ; j++) {
		var div = document.getElementById('mh_' + gogoNumbers[j] + '_hidden_Composant');
		if (!div) {
			continue;
		}
		var trList = document.evaluate('./table/tbody/tr', div, null, 7, null);
		window.console.debug("[mmassistant] Compos suivant : " + trList);
		if (!(trList.snapshotLength > 0)) {
			continue;
		}
		for (var i = 0 ; i < trList.snapshotLength ; i++) {
			getSetInfo(trList.snapshotItem(i));
		}
	}
}

function mmEquipGowap() {
// Traitement de la page d'équipement d'un gowap
	try {
		// On récupère la liste des compos portés
		var trList = document.evaluate(".//p/table/tbody/tr/td[contains(table/tbody/tr/td/b/text(), 'Composant')]/div/table/tbody/tr", document, null, 7, null);
		window.console.debug("[mmassistant] Compos suivant : " + trList);
	} catch(e) {
		window.console.debug("[mmassistant] Pas de compos suivant...");
		return;
	}

	for (var i = 0 ; i < trList.snapshotLength ; i++) {
		getSetInfo(trList.snapshotItem(i));
	}
}

function mmStockGT() {
// Traitement du stock de tanière perso (onglet tanière)
	try {
		// On récupère la liste des compos en stock
		var mainTab = document.getElementById('stock');
		var trList = document.evaluate('./tbody[2]/tr', mainTab, null, 7, null);
		window.console.debug("[mmassistant] Compos stock : " + trList);
	} catch(e) {
		return;
	}

	for (var i = numCompo ; i < trList.snapshotLength ; i++) {
		getSetInfo(trList.snapshotItem(i));
		numCompo++;
	}
}

function mmViewTaniere() {
// Traitement de l'étal d'une tanière dans la vue (popup)
	try {
		var mainTab = document.getElementsByClassName('listeEquipement')[0].getElementsByTagName('table')[0];
		var trstart = document.evaluate("./tbody/tr[@class='mh_tdtitre' and contains(td/b/text(), 'Composant')]", mainTab, null, 9, null).singleNodeValue;
	} catch(e) {
		return;
	}
	
	var tr = trstart.nextSibling.nextSibling;
	while (tr && tr.className == 'mh_tdpage') {
		// Les tr sont non-standard dans la vue, il faut refaire l'extraction à la main
		var node = tr.getElementsByTagName('td')[2];
		var txt = node.textContent;
		var indQ = txt.indexOf('de Qualit');
		var mob = trim(txt.slice(txt.indexOf("d'un") + 5, indQ - 1));
		var niv = nival[epure(mob)];
		var qualite = trim(txt.slice(indQ + 11, txt.indexOf('[') - 1));
		var effet = effetQual[epure(qualite)];
		if (niv && effet && node.lastChild.textContent.indexOf('MM') == -1) {
			addInfo(node, mob, niv, qualite, effet);
		}
		tr = tr.nextSibling.nextSibling;
	}
}

function mmExtracteurMatos() {
	try {
		// Si pas de compos / popos, on mime un snapshot vide
		var trPopos = trCompos = {snapshotLength:0};
		// Sinon on récupère le snapshot
		var tr = document.getElementById('mh_objet_hidden_' + numTroll + 'Composant');
		if (tr) {
			var trCompos = document.evaluate("./td/table/tbody/tr[not(starts-with(td[2]/img/@alt, 'Pas'))]", tr, null, 7, null);
		} else {
			window.console.warn("[mmassistant] Aucun composant trouvé");
		}
		tr = document.getElementById('mh_objet_hidden_' + numTroll + 'Potion');
		if (tr) {
			var trPopos = document.evaluate("./td/table/tbody/tr[not(starts-with(td[2]/img/@alt, 'Pas'))]", tr, null, 7, null);
		} else {
			window.console.warn("[mmassistant] Aucune potion trouvée");
		}
	} catch(e) {
		window.console.error("[mmassistant] Impossible d'analyser l'équipement");
		return;
	}
	window.console.debug("[mmassistant] Extracteur ON!");
	
	// Récupération & Stockage des données des Composants
	var strCompos = '';
	for (var i = 0 ; i < trCompos.snapshotLength ; i++) {
		var node = trCompos.snapshotItem(i).cells[3];
		var mob = node.textContent;
		mob = trim(mob.slice(mob.indexOf("d'un") + 5));
		var niv = nival[epure(mob)];
		var qualite = trCompos.snapshotItem(i).childNodes[9].textContent;
		qualite = trim(qualite.slice(qualite.indexOf('Qualit') + 9));
		var effet = effetQual[epure(qualite)];
		if (niv && effet) {
			addInfo(node, mob, niv, qualite, effet);
			var num = trCompos.snapshotItem(i).childNodes[5].textContent.match(/\d+/);
			strCompos += num + ',' + (niv + effet) + ';';
		}
		window.console.debug("compo" + i + ": " + num + ',' + (niv + effet));
	}
	window.localStorage[numTroll + '.MM_compos'] = strCompos;
	
	// Récupération & Stockage des données des Potions
	var strPopos = '';
	for (var i = 0 ; i < trPopos.snapshotLength ; i++) {
		var num = trPopos.snapshotItem(i).childNodes[5].textContent.match(/\d+/);
		var nom = epure(trim(trPopos.snapshotItem(i).childNodes[7].textContent));
		if (nom.indexOf(' Melangees') != -1) {
			// Si popo issue d'un mélange de 2 popos de base de même famille, on récupère ladite famille pour computer durée+type (GPT/autre)
			// Si mélange niv sup, on récupère "Potions", sans effet.
			var racine = nom.slice(0, nom.indexOf(' Melangees'));
		} else {
			var racine = nom;
		}
		var effet = trim(trPopos.snapshotItem(i).childNodes[9].textContent);
		var effets = effet.split(' | ');
		var duree;
		// Si popo à effet simple, on l'identifie via lvl = 1er effet
		var lvl = effet.match(/\d+/);
		switch (racine) {
			// Si popo de famille connue, on compute la durée / corrige le lvl...
			case 'Potion de Guerison':
			case 'Potion de Painture':
			case 'Toxine Violente':
				duree = 0;
				break;
			case 'Dover Powa':
			case 'Sinne Khole':
				lvl = effet.match(/\d+/g).join('/');
			case "Voi'Pu'Rin":
				duree = 2;
				break;
			case 'Metomol':
				lvl = effets[1].match(/\d+/);
				duree = 2;
				break;
			case 'Zet Crakdedand':
				lvl = effets[effets.length - 1].match(/\d+/);
			case 'Elixir de Longue-Vue':
			case 'Grippe en Conserve':
			case 'Jus de Chronometre':
			case 'Pneumonie en Conserve':
			case 'Rhume en Conserve':
				duree = 3;
				break;
			case 'PufPuff':
				lvl = effets.length > 4 ? '3 (+Tox.)' : effets[effets.length - 2].match(/\d+/);
				duree = 3;
				break;
			case 'Essence de KouleMann':
			case 'Extrait de DjhinTonik':
			case 'Sang de Toh Reroh':
				duree = 4;
				break;
			case 'Elixir de Corruption':
				if (effets.length > 6) {
					lvl += ' (' + effets[6].match(/\d+/) + '/' + effets[7].match(/\d+/) + ')';
				}
			case 'Elixir de Bonne Bouffe':
			case 'Elixir de Fertilite':
			case 'Elixir de Feu':
			case 'Extrait du Glacier':
				duree = 5;
				break;
			default:
			// ... sinon tant pis
				lvl = 'NA';
				duree = 'NA';
		}
		strPopos += num + ',' + nom + ',' + lvl + ',' + duree + ',' + effet + ';';
		window.console.debug("popo" + i + ": " + num + ',' + nom + ',' + lvl + ',' + duree + ',' + effet + ';');
	}
	window.localStorage[numTroll + '.MM_popos'] = epure(strPopos);
}


/*                     Initialisation Compétence Mélange                      */

function addInfosCompos() {
// Ajoute les infos de compos au menu déroulant lors d'un mélange
// Génère la liste listeCompo
	if (!window.localStorage[numTroll + '.MM_compos']) {
		return;
	}
	
	// Récupération des % de stabilisation (précalculés sur le profil)
	var dataList = window.localStorage[numTroll + '.MM_compos'].split(';');
	for (var i = 0 ; i < dataList.length ; i++) {
		var data = dataList[i].split(',');
		listeCompos[data[0]] = data[1];
	}
	
	// ... puis insertion des infos dans le menu déroulant
	var optCompo = selectCompo.getElementsByTagName('option');
	selectCompo.style.maxWidth = '450px';
	for (var i = 1 ; i < optCompo.length ; i++) {
		var opt = optCompo[i];
		if (listeCompos[opt.value] == undefined) {
			continue;
		}
		appendText(opt, ' ');
		opt.appendChild(createMMImage(urlImg));
		opt.title = '-' + listeCompos[opt.value] + ' %';
		appendText(opt, ' [-' + listeCompos[opt.value] + ' %]');
	}
}

function addInfosPopos(selec) {
// Ajoute les infos de popo aux 2 menus déroulants lors d'un mélange
	if (!window.localStorage[numTroll + '.MM_popos']) {
		return;
	}
	
	var optPopo = selec.getElementsByTagName('option');
	for (var i = 1 ; i < optPopo.length ; i++) {
		var opt = optPopo[i];
		if (!listePopos[opt.value]) {
			opt.title = "??? (Ouvrez l'onglet Équipement)";
		} else if (!listePopos[opt.value]['str']) {
			opt.title = 'Aucune carac.'
		} else {
			if (listePopos[opt.value]['Niv'] != 'NA' && listePopos[opt.value]['Nom'].indexOf('Potion de Painture')!==0) {
				appendText(opt, " " + listePopos[opt.value]['Niv']);
			}
			if (listePopos[opt.value]['Zone']) {
				appendText(opt, ' Zone', true);
			}
			opt.title = listePopos[opt.value]['str'];
		}
	}
}

function initRisqueExplo() {
// Pré-calcule les bonus/malus liés à chaque popo/compo
	
	// Récupération des effets des popos
	var dataList = window.localStorage[numTroll + '.MM_popos'].split(';');
	for (var i = 0 ; i < dataList.length ; i++) {
		var data = dataList[i].split(',');
		// Rappel : stocké comme "num,nom,lvl,durée,effet"
		var num = data[0];
		listePopos[num] = {
			'Nom': data[1], // String
			'Niv': data[2], // String
			'Duree': data[3] == 'NA' ? 'NA' : Number(data[3]), // Number ou 'NA'
			'Risque': 0 // Number
		};
		
		// Calcul du risque associé aux effets d'une popo
		if (data[4]) {
			listePopos[num]['str'] = data[4];
			var effets = data[4].split(' | ');
			var risque = 0, magie = 0;
			for (var j = 0 ; j < effets.length ; j++) {
				var nb = effets[j].match(/\d+/);
				if (nb) {
					var carac = trim(effets[j].split(':')[0]);
					if (carac == 'RM' || carac == 'MM') {
						// Si MM/RM, on attrape le signe pour faire la somme algébrique et on divise la carac par 10
						nb = effets[j].match(/-?\d+/);
						magie = magie ? magie + nb / 10 : nb / 10;
					} else if (carac == 'TOUR') {
						// Si effet de durée, malus = nb de 1/2 h
						risque += nb / 30;
					} else if (carac.indexOf('Painture') == 0) {
						// Si Painture, malus = niv x 10
						risque += nb * 10;
					} else {
						risque += Number(nb);
					}
				} else if (effets[j].indexOf('Zone') != -1) {
					// Si popo de Zone, on enregistre pour malus Zone
					listePopos[num]['Zone'] = true;
				}
			}
			if (magie) {
				// Si MM/RM, on vire le signe final de la somme algébrique
				risque += Math.abs(magie);
			}
		listePopos[num]['Risque'] = Math.round(10 * risque) / 10;
		}
	}
	
	// Insertion des infos dans les menus déroulants
	addInfosCompos();
	window.console.debug("[mmassistant] addInfosCompos réussi");
	addInfosPopos(selectPopo1);
	window.console.debug("[mmassistant] addInfosPopos 1 réussi");
	addInfosPopos(selectPopo2);
	window.console.debug("[mmassistant] addInfosPopos 2 réussi");
	
	// Initialisation affichage Risques
	var divAction = document.getElementsByClassName('titre4')[0];
	afficheRisque.innerHTML = "[Risque d'explosion : (nécessite 2 potions)]";
	divAction.appendChild(afficheRisque);
	selectPopo1.onchange = refreshRisqueExplo;
	selectPopo2.onchange = refreshRisqueExplo;
	selectCompo.onchange = refreshRisqueExplo;

	window.console.debug("[mmassistant] initRisqueExplo réussi");
}


/*                           EventListener Mélange                            */

function refreshRisqueExplo() {
// Met à jour le risque d'explosion en fonction des popos/compos sélectionnés
	
	// On vérifie si on a bien 2 popos connues sélectionnées
	afficheRisque.title = '';
	if (selectPopo1.value == '' || selectPopo2.value == '') {
		afficheRisque.innerHTML = "[Risque d'explosion : (nécessite 2 potions)]";
		return;
	}
	var popo1 = listePopos[selectPopo1.value];
	var popo2 = listePopos[selectPopo2.value];
	if (popo1 == undefined || popo2 == undefined) {
		afficheRisque.innerHTML = "[Potion inconnue : ouvrez l'onglet Équipement]";
		return;
	}
	
	// Risque de base
	var risque = 33;
	var details = 'Risque de base: +33';
	
	// Malus de caracs
	risque += popo1['Risque'];
	details += '\nEffet popo 1: +' + popo1['Risque'] + ' (' + risque + ')';
	risque += popo2['Risque']
	details += '\nEffet popo 2: +' + popo2['Risque'] + ' ('+risque+')';
	risque = Math.round(risque);
	
	// Malus de popo mélangée & Bonus popos de base identiques
	if (popo1['Nom'].indexOf('Melangees') != -1 || popo2['Nom'].indexOf('Melangees') != -1) {
		risque += 15;
		details += '\nMalus mélange: +15 (' + risque + ')';
	} else if (popo1['Nom'] == popo2['Nom']) {
		risque -= 15;
		details += '\nBonus popo id.: -15 (' + risque + ')';
	}
	
	// Malus de Zone
	if (popo1['Zone'] || popo2['Zone']) {
		risque += 40;
		details += '\nMalus zone: +40 (' + risque + ')';
	}
	
	// Malus mélange hétérogène GPT (Guérison/Painture/Toxine)
	var popoInco = popo1['Duree'] == 'NA' || popo2['Duree'] == 'NA';
	var rismax = risque + 5;
	if (popo1['Nom'].indexOf('Toxine Violente')
	  + popo2['Nom'].indexOf('Toxine Violente')
	  + popo1['Nom'].indexOf('Potion de Guerison')
	  + popo2['Nom'].indexOf('Potion de Guerison')
	  + popo1['Nom'].indexOf('Potion de Painture')
	  + popo2['Nom'].indexOf('Potion de Painture') == -5) {
		risque += 40;
		details += '\nMalus hétérogène GPT: +40 (' + risque + ')';
	} else if (popoInco) {
		// En cas de popo inconnue, on envisage le pire
		rismax += 40;
		details += '\nMalus hétérogène GPT: +40 ??';
	}
	
	// Malus durée
	if (!popoInco) {
		// Si les deux popos sont connues RAS
		var sup = Math.max(popo1['Duree'], popo2['Duree']);
		risque += sup;
		rismax = risque;
		details += '\nMalus de durée: +' + sup + ' (' + risque + ')';
	} else if (popo1['Duree'] != 'NA') {
		// Sinon on fait au mieux
		risque += popo1['Duree'];
		if (popo1['Duree'] == 5) {
			details += '\nMalus de durée: +5 (' + risque + ')';
		} else {
			details += '\nMalus de durée: de +' + popo1['Duree'] + ' à +5';
		}
	} else {
		risque += popo2['Duree'];
		if (popo2['Duree'] == 5) {
			details += '\nMalus de durée: +5 (' + risque + ')';
		} else {
			details += '\nMalus de durée: de +' + popo2['Duree'] + ' à +5';
		}
	}
	
	// Bonus de compo
	if (selectCompo.value != 0) {
		if (listeCompos[selectCompo.value]) {
			risque -= listeCompos[selectCompo.value];
			rismax -= listeCompos[selectCompo.value];
			details += '\nBonus compo: -' + listeCompos[selectCompo.value] + ' (' + risque + ')';
		} else {
			afficheRisque.innerHTML = "Composant inconnu : ouvrez l'onglet Équipement";
			return;
		}
	}
	
	// Affichage
	if (risque == rismax) {
		afficheRisque.innerHTML = "[Risque d'explosion : " + Math.max(15, risque) + ' %]';
	} else if (rismax < 16) {
		afficheRisque.innerHTML = "[Risque d'explosion : 15 %]";
	} else {
		afficheRisque.innerHTML = "[Risque d'explosion : de " + Math.max(15, risque) + ' à ' + rismax + ' %]';
	}
	afficheRisque.title = details;
	
	window.console.debug("[mmassistant] refreshRisqueExplo réussi");
}


/*                               Main Dispatch                                */
var WHEREARTTHOU = window.location.pathname;
window.console.debug("[mmassistant] script ON! sur : " + WHEREARTTHOU);

if ((isPage('MH_Taniere/TanierePJ_o_Stock') || isPage('MH_Comptoirs/Comptoir_o_Stock')) && window.location.href.indexOf('as_type=Compo') != -1) {
	// Ajout du bouton Relaunch (utile si +500 compos)
	var numCompo = 0;
	var footer = document.getElementById('footer1');
	var relaunchButton = document.createElement('input');
	relaunchButton.type = 'button';
	relaunchButton.className = 'mh_form_submit';
	relaunchButton.value = 'Relancer MMAssistant';
	relaunchButton.onmouseover = function() {
		this.style.cursor='pointer';
	};
	relaunchButton.onclick = mmStockGT;
	insertBefore(footer, relaunchButton);
	document.getElementById('stock-ajax-append').addEventListener('click', function() {
		window.setTimeout(mmStockGT, 5000);
	});
	mmStockGT();
} else if (isPage('MH_Follower/FO_Equipement')) {
	mmEquipGowap();
} else if (isPage('MH_Play/Play_e_follo')) {
	mmListeGowap();
} else if (isPage('View/TaniereDescription')) {
	mmViewTaniere();
} else if (isPage('MH_Play/Play_equipement')) {
	mmExtracteurMatos();
} else if (isPage('MH_Play/Actions/Competences/Play_a_Competence25')) {
// DEBUG: on déclenche même si rien en mémoire
//	&& window.localStorage[numTroll + '.MM_popos']) {
	try {
		var selectPopo1 = document.getElementsByName('ai_IDPotion1')[0];
		var selectPopo2 = document.getElementsByName('ai_IDPotion2')[0];
		var selectCompo = document.getElementsByName('ai_IDCompo')[0];
	} catch(e) {
		window.console.error("[mmassistant] Structure de page inconnue");
		return;
	}
	
	window.console.debug("[mmassistant] calcul du risque ON!");
	var listeCompos = {};
	var listePopos = {};
	var afficheRisque = document.createElement('span');
	initRisqueExplo();
}

window.console.debug("[mmassistant] Script OFF sur : " + WHEREARTTHOU);