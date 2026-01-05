// ==UserScript==
// @author TilK, Dabihul, Rouletabille
// @description Aide à la recherche de cachettes de Capitan
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @include */mountyhall/View/TresorHistory*
// @include */mountyhall/MH_Play/Play_a_TrouverCachette2*
// @include */mountyhall/MH_Play/Play_equipement.php*
// @include */mountyhall/MH_Taniere/TanierePJ_o_Stock.php*
// @include */mountyhall/MH_Play/Play_a_ActionResult.php*
// @include */mountyhall/MH_Play/Play_a_Action.php*
// @exclude *mh2.mh.raistlin.fr*
// @exclude *mzdev.mh.raistlin.fr*
// @name Capitan
// @version 8.9.1
// @namespace https://greasyfork.org/users/70018
// @downloadURL https://update.greasyfork.org/scripts/23991/Capitan.user.js
// @updateURL https://update.greasyfork.org/scripts/23991/Capitan.meta.js
// ==/UserScript==

"use strict";

/****************************************************************
*         Aide à la recherche de cachettes de Capitan           *
*              Développé par Mini TilK (n°36216)                *
*                      mini@tilk.info                           *
*****************************************************************
*        Adapté pour GreaseMonkey par Dabihul (n°79738)         *
*        Roule : ajout https 07/08/2016                         *
*****************************************************************
*         Pour utiliser la recherche, allez des les infos       *
*             de la carte de la cachette du capitan             *
*                    Une fois ceci fait,                        *
*           toutes les recherches seront sauvergardées          *
*            Et dans le détail de la carte vous verrez          *
*       Le nombre de cachettes possibles et leur position       *
****************************************************************/

class cCAPITAN_MH {
	static bDebug = false;
	static MZ_ok;
	/* pour mémoire
	static numTroll = undefined;
	static curPos = undefined;	// object genre {x:10, y:10, n:-10}, non renseigné en cas smartphone sans MZ
	// */
	static listeSolution = new Array();	// tableau de cEssai
	static infoCartes = {};	// {"1234": {"mort": {x:10, y:10, n:-10}, "essais": [{x:10, y:10, n:-10, c=0}, {x:11, y:11, n:-10, c=1}], "signeX": 1, "signeY": -1}
	static infoCurrentCarte;

	static appendButton(paren,value,onClick) {
		var input = document.createElement('input');
		input.type = 'button';
		input.className = 'mh_form_submit';
		input.value = value;
		input.style.cursor = 'pointer';
		if (onClick) input.onclick = onClick;
		paren.appendChild(input);
		return input;
	};

	/* Ajout des éléments manquants de libs */
	static isPage(url) {
		return window.location.href.indexOf(url)!=-1;
	};

	static insertTitle(next,txt) {
		var div = document.createElement('div');
		div.className = 'titre2';
		cCAPITAN_MH.appendText(div,txt);
		cCAPITAN_MH.insertBefore(next,div);
	};

	static insertBefore(next,el) {
		next.parentNode.cCAPITAN_MH.insertBefore(el,next);
	};

	// Roule 08/08/2016 ajout cssClass
	static appendTr(tbody, cssClass) {
		var tr = document.createElement('tr');
		tbody.appendChild(tr);
		if (cssClass) tr.className = cssClass;
		return tr;
	};

	static appendTd(tr) {
		var td = document.createElement('td');
		if(tr) { tr.appendChild(td); }
		return td;
	};

	static appendText(paren,text,bold) {
		if(bold) {
			var b = document.createElement('b');
			if (text) b.appendChild(document.createTextNode(text));
			paren.appendChild(b);
			}
		else
			if (text) paren.appendChild(document.createTextNode(text));
	};

	static appendTdText(tr,text,bold) {
		var td = cCAPITAN_MH.appendTd(tr);
		cCAPITAN_MH.appendText(td,text,bold);
		return td;
	};
	/* */

	static removeTab(tab, i) {
		var newTab = new Array();
		for(var j=0;j<i;j++)
		{
			newTab.push(tab[j]);
		}
		for(var j=i+1;j<tab.length;j++)
		{
			newTab.push(tab[j]);
		}
		return newTab;
	};
	static cache = new Array();

	static tabToString(tab) {
		var string = tab[0];
		for(var i=1;i<tab.length;i++)
			string+=";"+tab[i];
		return string;
	};

	static extractPosition(nombre, indice) {
		if((nombre+"").length<=indice)
			return "%";
		indice = (nombre+"").length - 1 - indice;
		return (nombre+"").substring(indice,indice+1);
	};

	static signe(x) {
		if(x<0)
			return -1;
		return 1;
	};

	static getPosFromArray(liste,begin,length) {
		let pos="";
		for(let i=begin; i<begin+length; i++)
			pos += "" + liste[i];
		return parseInt(pos, 10);
	};

	static toggleTableau() {
		let tbody = this.parentNode.parentNode.parentNode.childNodes[1];

		tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
	};

	static createCase(titre,table,width) {
		if(width==null)
			width="120";
		var tr = cCAPITAN_MH.appendTr(table, 'mh_tdpage');

		var td = cCAPITAN_MH.appendTdText(tr, titre, true);
		td.setAttribute('class', 'mh_tdpage');
		td.setAttribute('width', width);
		td.setAttribute('align', 'center');

		return td;
	};

	static showXYN(loc, infos) {
		var sx = '±';
		var sy = '±';
		if (infos && infos.signeX) {
			sx = '+';
			if (infos.signeX < 0) sx = '-';
		}
		if (infos && infos.signeY) {
			sy = '+';
			if (infos.signeY < 0) sy = '-';
		}
		return "X = " + sx + loc.xAbs() + ", Y = " + sy + loc.yAbs() + ", N = -" + loc.nAbs();
	};

	static createHTMLTable() {	// les 3 table ont le même modèle
		let table = document.createElement('table');
		table.setAttribute('class', 'mh_tdborder');
		table.setAttribute('border', '0');
		table.setAttribute('cellspacing', '1');
		table.setAttribute('cellpadding', '4');
		table.setAttribute('style', 'width: 400px;');
		table.setAttribute('align', 'center');
		return table;
	};

	static generateTableSolutions() {
		let table = cCAPITAN_MH.createHTMLTable();
		let thead = document.createElement('thead');
		let tr = cCAPITAN_MH.appendTr(thead, 'mh_tdtitre');
		let td = cCAPITAN_MH.appendTdText(tr, null, true);
		td.setAttribute('align', 'center');
		table.appendChild(thead);

		if(cCAPITAN_MH.listeSolution.length==1)
		{
			td.appendChild(document.createTextNode("Position de la cachette : " + cCAPITAN_MH.showXYN(cCAPITAN_MH.listeSolution[0], cCAPITAN_MH.infoCurrentCarte)));
			return table;
		}
		else if(cCAPITAN_MH.listeSolution.length==0)
		{
			td.appendChild(document.createTextNode("Aucune solution trouvée."));
			return table;
		}

		td.appendChild(document.createTextNode("Il y a "+cCAPITAN_MH.listeSolution.length+" positions possibles"));

		let eBody = document.createElement('tbody');
		table.appendChild(eBody);

		let bExist200 = false;
		for (let i = 0; i < cCAPITAN_MH.listeSolution.length; i++) {
			if (cCAPITAN_MH.listeSolution[i].is200())
				bExist200 = true;
			else
				cCAPITAN_MH.createCase(cCAPITAN_MH.showXYN(cCAPITAN_MH.listeSolution[i], cCAPITAN_MH.infoCurrentCarte),eBody,400);
		}
		if (bExist200) {
			cCAPITAN_MH.createCase("Les suivantes sont peu probables car trop en dehors du Hall",eBody,400);
			for (let i = 0; i < cCAPITAN_MH.listeSolution.length; i++) {
				if (cCAPITAN_MH.listeSolution[i].is200())
					cCAPITAN_MH.createCase(cCAPITAN_MH.showXYN(cCAPITAN_MH.listeSolution[i], cCAPITAN_MH.infoCurrentCarte),eBody,400);
			}
		}

		td.addEventListener("click", cCAPITAN_MH.toggleTableau, true);
		td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
		td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
		eBody.setAttribute('style', 'display:none;');

		return table;
	};

	static calculeSolution2() {	// calcule les solutions à partir des propriétés de oMort et gEssai
		var oContexte = {
			// nombre d'occurrence de chaque chiffre (0 à 9) dans les coord de la mort du Capitan
			tabOccurrenceChiffre: cCAPITAN_MH.infoCurrentCarte.mort.tabOccurenceChiffre(),
			nCoord3: undefined,
			// On n'a encore traité aucune coordonnée
			nCoordEnCours: 0,	// 0:x, 1:y, 2:n
			// les chaines des coord en cours de construction
			tabCoord: ['', '', ''],
		};
		// nombre de chiffres (une coord à 1 chiffe en donne 2, le "0" et le chiffre des unités) dans les coord de la mort du Capitan
		oContexte.nCoord3 = cCAPITAN_MH.infoCurrentCarte.mort.nbChiffre() - 6;
		//if (cCAPITAN_MH.bDebug) window.console.log("[CAPITAN debug] calculeSolution2_log contexte initial=" + JSON.stringify(oContexte));

		// On lance le balayage récursif des possibilités
		cCAPITAN_MH.listeSolution = new Array();
		cCAPITAN_MH.calculeSolutionRecursifCoord(oContexte);
		//if (cCAPITAN_MH.bDebug) window.console.log("[CAPITAN debug] calculeSolution2_log résultat=" + JSON.stringify(cCAPITAN_MH.listeSolution));
	};

	static calculeSolutionRecursifCoord(oContexte) {	// balayage récursif des solutions, balayage coordonnée (x, y ou n)
		if (oContexte.nCoord3 > 0) {	// lancer le test sur une coord à 3 chiffres
			var newContexte = Object.assign({}, oContexte);	// clone car on modifie le contexte
			newContexte.nCoord3--;
			cCAPITAN_MH.calculeSolutionRecursifDigit(newContexte, 3);
		}
		if (oContexte.nCoord3 <= (2- oContexte.nCoordEnCours)) {	// pas de test à 2 chiffres si toutes les coord restantes doivent être à 3 chiffres
			cCAPITAN_MH.calculeSolutionRecursifDigit(oContexte, 2);
		}
	};

	static calculeSolutionRecursifDigit(oContexte, nChiffreThisCoord) {	// balayage récursif des solutions, balayages des suites de chiffres possibles
		let thisCoord = '';
		let newContexte = Object.assign({}, oContexte);	// clone car on modifie le contexte
		newContexte.tabCoord = oContexte.tabCoord.slice();	// clone (le clone ci-dessus est un "shallow" clone)
		for (let i = 0; i <= 9; i++) {	// boucle sur les chiffres possibles à cette position
			if (oContexte.tabOccurrenceChiffre[i] == 0) continue;	// chiffre non disponible
			newContexte.tabCoord[oContexte.nCoordEnCours] = oContexte.tabCoord[oContexte.nCoordEnCours] + i;
			newContexte.tabOccurrenceChiffre = oContexte.tabOccurrenceChiffre.slice();	// clone car on modifie ce tableau
			newContexte.tabOccurrenceChiffre[i]--;
			if (nChiffreThisCoord > 1) {	// continuer à tirer des chiffres pour cette coord
				cCAPITAN_MH.calculeSolutionRecursifDigit(newContexte, nChiffreThisCoord-1);
				continue;
			}
			// on a fini avec cette coord
			if (oContexte.nCoordEnCours != 2) {
				// continuer sur la coord suivante
				newContexte.nCoordEnCours = oContexte.nCoordEnCours + 1;
				cCAPITAN_MH.calculeSolutionRecursifCoord(newContexte);
				continue;
			}
			// ici, on a tiré tous les chiffres des 3 coordonnées, on teste si ces coord sont compatibles avec les essais
			let bCompatible = true;
			let oEssai;
			if (cCAPITAN_MH.infoCurrentCarte.essais) for (oEssai of cCAPITAN_MH.infoCurrentCarte.essais) {
				if (!oEssai.isCompatible(newContexte.tabCoord)) {
					bCompatible = false;
					break;
				}
			}
			if (cCAPITAN_MH.bDebug && newContexte.tabCoord[0] == '03' && newContexte.tabCoord[1] == '80') {
				let sCause = '';
				if (!bCompatible) {
					sCause = ' bad ' + oEssai.forPsychoChasseur() + ' nMatches=';
					sCause += oEssai.nbMatchesOne(oEssai.xText(), newContexte.tabCoord[0]);
					sCause += ' ' + oEssai.nbMatchesOne(oEssai.yText(), newContexte.tabCoord[1]);
					sCause += ' ' + oEssai.nbMatchesOne(oEssai.nText(), newContexte.tabCoord[2]);
				}
				//window.console.log('[CAPITAN debug] calculeSolutionRecursifDigit_log, teste ' + newContexte.tabCoord.join("; ") + ', bCompatible=' + bCompatible + sCause);
			}
			if (bCompatible) {
				cCAPITAN_MH.listeSolution.push(new cCAPITAN_essai(newContexte.tabCoord));	// slice pour cloner le tableau
			}
		}
	};

	static afficheInfoCarte(idCarte, bRecherche) {
		cCAPITAN_MH.idCarte = idCarte;
		cCAPITAN_MH.initCarte(idCarte);
		cCAPITAN_MH.infoCurrentCarte = cCAPITAN_MH.infoCartes[cCAPITAN_MH.idCarte];
		if (!cCAPITAN_MH.infoCurrentCarte.mort) {
			let table = cCAPITAN_MH.createHTMLTable();
			let thead = document.createElement('thead');
			let tr = cCAPITAN_MH.appendTr(thead, 'mh_tdtitre');
			let td = cCAPITAN_MH.appendTdText(tr, `[Extension Capitan] Impossible de suggérer des solutions car la position de la mort du Capitan n'a pas été mémorisée. Affichez le détail de la carte dans la page EQUIPEMENT.`, true);
			td.setAttribute('align', 'center');
			table.appendChild(thead);
			if (bRecherche) cCAPITAN_MH.createCase(`Cette recherche a bien été mémorisée`,table)
			return table;
		}
		cCAPITAN_MH.calculeSolution2();
		return cCAPITAN_MH.generateTableSolutions();
	};

	static getRepartitionFromCase(oPos) {
		let repartition = new Array();
		for(let i=0;i<cCAPITAN_MH.listeSolution.length;i++)
		{
			let nbGood = cCAPITAN_MH.listeSolution[i].nbMatches(oPos);
			for (let j = repartition.length; j <= nbGood; j++) repartition.push(0);	// Roule 15/08/2016 compléter le tableau selon le besoin
			repartition[nbGood]++;
		}
		repartition.sort(function(a,b) {return b-a;});
		return repartition;
	};

	static getMeanPositionNumber(repartition,nbSolutions) {
		var result=0;
		for(var i=0;i<repartition.length;i++)
		{
			result+=repartition[i]*repartition[i];
		}
		return result/nbSolutions;
	};

	static newRecherche(bReturnString, bLapidaire) {
		if(cCAPITAN_MH.listeSolution.length<=1)
			return null;

		let table = cCAPITAN_MH.createHTMLTable();

		if (cCAPITAN_MH.curPos == undefined) {
			let thead = document.createElement('thead');
			let tr = cCAPITAN_MH.appendTr(thead, 'mh_tdtitre');
			let td = cCAPITAN_MH.appendTdText(tr, "Impossible de suggérer une loc en mode smartphone sans MZ", true);
			td.setAttribute('align', 'center');
			table.appendChild(thead);
			return table;
		}

		// Roule 15/08/2016 plus que dubitatif sur ce calcul de Size, j'utilise repartition.length
		//let size = (";"+Math.abs(cCAPITAN_MH.listeSolution[0][0])+Math.abs(cCAPITAN_MH.listeSolution[0][0])+Math.abs(cCAPITAN_MH.listeSolution[0][0])).length-1;
		let repartition = cCAPITAN_MH.getRepartitionFromCase(cCAPITAN_MH.curPos);
		let size = repartition.length;
		if (cCAPITAN_MH.bDebug) window.console.log(`[Capitan debug] newRecherche_log: size=${size}, repartition=${JSON.stringify(repartition)}`);

		let nbNotZero = 0;
		for(let i=0;i<size;i++) {
			if(repartition[i]!=0)
				nbNotZero++;
		}
		let string;
		if (bLapidaire)
			string = `C'est utile de chercher ici`;
		else
			string = "Il y a une utilité de faire une recherche en X = "+cCAPITAN_MH.curPos.x+" Y = "+cCAPITAN_MH.curPos.y+" N = "+cCAPITAN_MH.curPos.n;
		let giveProba = true;
		if(nbNotZero<=1) {
			//
			let minsolution = cCAPITAN_MH.listeSolution.length;
			let newpos = "";
			let isNotN = true;
			for(let dx=-1;dx<=1;dx++)
				for(let dy=-1;dy<=1;dy++)
					for(let dn=0;dn!=-3;dn=(dn==0?1:dn-2)) {
						if(dx==0 && dy==0 && dn==0) continue;
						//if (cCAPITAN_MH.bDebug) window.console.log(`[Capitan debug] newRecherche_log: dx=${dx}, dy=${dy}, dn=${dn}, `);
						let thisPos = new cCAPITAN_essai(cCAPITAN_MH.curPos);
						thisPos.move(dx, dy, dn);
						let tmprepartition = cCAPITAN_MH.getRepartitionFromCase(thisPos);
						let tmpmeanscore = cCAPITAN_MH.getMeanPositionNumber(tmprepartition,cCAPITAN_MH.listeSolution.length);
						if (cCAPITAN_MH.bDebug) window.console.log(`[Capitan debug] newRecherche_log: dx=${dx}, dy=${dy}, dn=${dn}, isNotN=${isNotN}, tmpmeanscore=${tmpmeanscore}, minsolution=${minsolution}, `);
						if(((dn==0 || !isNotN) && minsolution>=tmpmeanscore) || (dn!=0 && isNotN && tmpmeanscore<=2*minsolution/3)) {
							minsolution = tmpmeanscore;
							repartition = tmprepartition;
							newpos = thisPos.display();;
							isNotN = (dn==0);
						}
					}
			if (cCAPITAN_MH.bDebug) window.console.log(`[Capitan debug] newRecherche_log: minsolution=${minsolution}, listeSolution.length=${cCAPITAN_MH.listeSolution.length}`);
			if(minsolution == cCAPITAN_MH.listeSolution.length) {
				if (bLapidaire) {
					string = `Pas de case proche utile`;
				} else {
					string = "Il n'y a aucune utilité de faire une recherche en " + cCAPITAN_MH.curPos.display();
				}
				giveProba = false;
			} else {
				if (bLapidaire) {
					string = `Chercher en ${newpos}`;
				} else {
					string = "Conseil : allez faire une recherche en "+newpos;
				}
			}
		}
		if (cCAPITAN_MH.bDebug) window.console.log(`[Capitan debug] newRecherche_log: size=${size}, repartition=${JSON.stringify(repartition)}`);

		if (bReturnString) {
			let oRet = {msg: string, probas: new Array(), ici: (nbNotZero > 1)};
			size = repartition.length;
			if (giveProba) for(let i=0;i<size;i++) {
				if(i==size-1) {
					if(repartition[i]!=0)
						oRet.probas.push({
							proba: Math.round(100*repartition[i]/cCAPITAN_MH.listeSolution.length),
							nb: cCAPITAN_MH.listeSolution.length-repartition[i],
						});
				} else {
					let n=1;
					while((i+n)<size && repartition[i]==repartition[i+n])
						n++;
					if(repartition[i]!=0)
						oRet.probas.push({
							proba: Math.round(100*n*repartition[i]/cCAPITAN_MH.listeSolution.length),
							nb: (cCAPITAN_MH.listeSolution.length-repartition[i]),
						});
					i+=n-1;
				}
			}
			return oRet;
		}

		let thead = document.createElement('thead');
		let tr = cCAPITAN_MH.appendTr(thead, 'mh_tdtitre');
		let td = cCAPITAN_MH.appendTdText(tr,string, true);
		td.setAttribute('align', 'center');
		table.appendChild(thead);
		let tbody = document.createElement('tbody');
		table.appendChild(tbody);
		if (!giveProba) return table;

		size = repartition.length;
		for(let i=0;i<size;i++) {
			if(i==size-1) {
				if(repartition[i]!=0)
					cCAPITAN_MH.createCase(Math.round(100*repartition[i]/cCAPITAN_MH.listeSolution.length)+"% de chance d'éliminer "+(cCAPITAN_MH.listeSolution.length-repartition[i])+" positions possibles",tbody,400);
			} else {
				let n=1;
				while((i+n)<size && repartition[i]==repartition[i+n])
					n++;
				if(repartition[i]!=0)
					cCAPITAN_MH.createCase(Math.round(100*n*repartition[i]/cCAPITAN_MH.listeSolution.length)+"% de chance d'éliminer "+(cCAPITAN_MH.listeSolution.length-repartition[i])+" positions possibles",tbody,400);
				i+=n-1;
			}
		}

		td.addEventListener("click", cCAPITAN_MH.toggleTableau, true);
		td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
		td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
		tbody.setAttribute('style', 'display:none;');
		return table;
	};

	static getIDCarte() {
		//if (cCAPITAN_MH.bDebug) return;
		var infoObjet = document.evaluate("//h2[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		// si échec, essayer avec l'ancienne méthode
		if (!infoObjet) infoObjet = document.evaluate("//td[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		// si échec, essayer avec l'ancienne méthode
		if (!infoObjet) infoObjet = document.evaluate("//div[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(infoObjet) return parseInt(infoObjet.nodeValue.replace('[', ''));
	};

	static traiteCartesDansListe() {
		let eSelect = document.getElementsByName('id_tresor')[0];
		if (!eSelect) {
			console.log(`capitan traiteCartesDansListe pas de id_tresor`);
			return;
		}
		
		for (let option of eSelect.options) {
			//console.log(`capitan traiteCartesDansListe ${option.innerText}`);
			let idCarte = parseInt(option.value);
			if (isNaN(idCarte)) continue;
			//console.log(`capitan traiteCartes ${idCarte}`);
			cCAPITAN_MH.initCarte(idCarte);
			cCAPITAN_MH.idCarte = idCarte;
			cCAPITAN_MH.infoCurrentCarte = cCAPITAN_MH.infoCartes[idCarte];
			if (cCAPITAN_MH.infoCurrentCarte.mort == undefined) continue;
			//console.log(cCAPITAN_MH.infoCurrentCarte);
			cCAPITAN_MH.calculeSolution2();
			let oRet = false;
			if (cCAPITAN_MH.listeSolution.length==1) {
			} else if (cCAPITAN_MH.listeSolution.length==0) {
			} else {
				oRet = cCAPITAN_MH.newRecherche(true, true);
			}
			if (oRet && oRet.probas.length > 0 && oRet.ici) {
				let o = oRet.probas[0];
				option.text += ' \uD83D\uDEC8';
				option.style.color = 'red';
				option.title = `[MZ] Recherche utile de cette carte (${o.proba}% d'éliminer ${o.nb}/${cCAPITAN_MH.listeSolution.length} possibilité${o.nb > 1 ? 's' : ''})`;
			}
		}
	};

	static traiteCartesDansEquipement() {
		//console.log(`capitan traiteCartes start`);
		let divCarte = document.querySelector("div[id$=Carte]");
		if (!divCarte) return;
		//console.log(`capitan traiteCartes ${divCarte.outerHTML}`);
		let tables = divCarte.getElementsByTagName('table');
		//console.log(`capitan traiteCartes nb table ${tables.length}`);
		if (tables.length == 0) return;
		let oRet;
		for (let tr of tables[0].rows) {
			//console.log(`capitan traiteCartes ${tr.innerText}`);
			if (tr.cells.length < 3) continue;
			let idCarte = parseInt(tr.cells[1].innerText);
			if (isNaN(idCarte)) continue;
			//console.log(`capitan traiteCartes ${idCarte}`);
			cCAPITAN_MH.initCarte(idCarte);
			cCAPITAN_MH.idCarte = idCarte;
			cCAPITAN_MH.infoCurrentCarte = cCAPITAN_MH.infoCartes[idCarte];
			if (cCAPITAN_MH.infoCurrentCarte.mort == undefined) continue;
			//console.log(cCAPITAN_MH.infoCurrentCarte);
			cCAPITAN_MH.calculeSolution2();
			let msg;
			let tabInfoProba = new Array();
			if (cCAPITAN_MH.listeSolution.length==1) {
				msg = '<' + cCAPITAN_MH.showXYN(cCAPITAN_MH.listeSolution[0], cCAPITAN_MH.infoCurrentCarte) + '>';
			} else if (cCAPITAN_MH.listeSolution.length==0) {
				msg = 'Aucune solution trouvée';
			} else {
				msg = `${cCAPITAN_MH.listeSolution.length} possibilités. `;
				oRet = cCAPITAN_MH.newRecherche(true, true);
				msg += oRet.msg;
				for (let o of oRet.probas) {
					tabInfoProba.push(`${o.proba}% de chance d'éliminer ${o.nb} possibilité${o.nb > 1 ? 's' : ''}`);
				}
			}
			//console.log(`capitan traiteCartes id=${idCarte} msg=${msg}`);
			tr.cells[3].appendChild(document.createTextNode('[MZ] ' + msg));
			if (tabInfoProba.length > 0) {
				let span = document.createElement('span');
				// '\u2139\ufe0f'	// INFO (i italique) + modifier emoji-style => i dans un carré bleu
				// '\uD83D\uDEC8'	// char INFO 0x1F6C8 (i dans un rond rouge, la chaine est en UTF-16 comme il se doit en javascript)
				// '\u24D8'			// i dans un rond basique
				span.appendChild(document.createTextNode('\uD83D\uDEC8'));
				if (oRet && oRet.ici) {
					span.style.color = 'red';
					span.style.fontWeight = 'bold';
				} else {
					span.style.color = 'blue';
				}
				span.style.marginLeft = '5px';
				tr.cells[3].appendChild(span);
				tr.cells[3].title = tabInfoProba.join("\n");
			}
		}
	}

	static analyseObject() {
		//if (cCAPITAN_MH.bDebug) {console.log('[Capitan debug] analyseObject_log: début'); console.trace();}
		var eSpacer = document.getElementById('spacerMZCapitan');
		if (eSpacer) return;	// déjà affiché
		if( !cCAPITAN_MH.numTroll) {
			window.console.log('[CAPITAN] analyseObject_log: *** erreur *** pas de numéro de Trõll');
			return;
		}
		cCAPITAN_MH.idCarte = cCAPITAN_MH.getIDCarte();
		if (cCAPITAN_MH.bDebug && cCAPITAN_MH.idCarte == 11987020) {	// test Roule
			cCAPITAN_MH.info.mort = new cCAPITAN_essai(-101, -8, -73);
		} else if (cCAPITAN_MH.idCarte > 0) {
			cCAPITAN_MH.initCarte(cCAPITAN_MH.idCarte);
		} else {
			var parentElt = document.body;
			var modalElt = document.evaluate("//div[@class = 'modal']",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (modalElt && !modalElt.errorIDDone) {
				modalElt.appendChild(document.createTextNode("Erreur à la récupération de l'ID de la carte"));
				modalElt.errorIDDone = true;
			}
			if (cCAPITAN_MH.bDebug) console.log('[Capitan debug] analyseObject_log: pas trouvé de idCarte');
			return;
		}
		if (cCAPITAN_MH.mutationObserver) cCAPITAN_MH.mutationObserver.disconnect();
		let infos = cCAPITAN_MH.infoCartes[cCAPITAN_MH.idCarte];
		if (cCAPITAN_MH.bDebug) window.console.log(`[CAPITAN debug] début analyseObject_log(${cCAPITAN_MH.idCarte} ${JSON.stringify(infos)}`);
		if (cCAPITAN_MH.limitInfiniteLoop()) {
			if (cCAPITAN_MH.MutationObserver) cCAPITAN_MH.MutationObserver.disconnect();
		}

		let locMortFromHTML;
		let infoPos = document.evaluate("//td/text()[contains(.,'ai été tué en')]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(!infoPos) {
			if (cCAPITAN_MH.bDebug) window.console.log('[Capitan debug] analyseObject_log: numTroll=' + cCAPITAN_MH.numTroll + ', cCAPITAN_MH.idCarte=' + cCAPITAN_MH.idCarte + ', impossible de trouver le texte de la mort du Capitan');
		} else {
			let listePos = infoPos.nodeValue.split("=");
			if(listePos.length!=4) {
				if (cCAPITAN_MH.bDebug) window.console.log('[Capitan debug] analyseObject_log: numTroll=' + cCAPITAN_MH.numTroll + ', cCAPITAN_MH.idCarte=' + cCAPITAN_MH.idCarte + ', impossible de trouver les coord. de la mort du Capitan ' + infoPos.nodeValue);
			} else {
				locMortFromHTML = new cCAPITAN_essai(listePos[1], listePos[2], listePos[3]);
			}
			//if (cCAPITAN_MH.bDebug) window.console.log('[Capitan debug] analyseObject_log: setValue("capitan.'+cCAPITAN_MH.idCarte+'.position, '+x+";"+y+";"+n);
			//cCAPITAN_MH.CAPITAN_setValue("capitan."+cCAPITAN_MH.idCarte+".position",x+";"+y+";"+n);
		}
		if (locMortFromHTML && locMortFromHTML.isValidLoc()) {
			let bKeep = false;
			if (infos.mort) {
				if (!infos.mort.sameLocAs(locMortFromHTML)) {
					console.log(`[Capitan] analyseObject_log pas la même loc de mort ${infos.mort}<->${locMortFromHTML}`);
					bKeep = true;
				}
			} else {
				bKeep = true;
			}
			if (bKeep) {
				infos.mort = locMortFromHTML;
				cCAPITAN_MH.saveIntoMH(cCAPITAN_MH.idCarte);
			}
		} else {
			console.log(`[Capitan] analyseObject_log erreur à la récupération de la loc de mort, on tente celle stockée ${infos.mort}<->${locMortFromHTML}`);
			//if (!infos.mort) {
			//	console.log(`[Capitan] analyseObject_log pas de loc de mort stockée, pas possible continuer`);
			//}
		}

		// Roule 23/11/2016 travail dans le body (ancienne version, fenêtre indépendante) ou dans la div modale (nouvelle version en "popup")
		var parentElt = document.body;
		var modalElt = document.evaluate("//div[@class = 'modal']",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (modalElt) parentElt = modalElt;
		cCAPITAN_MH.gDiv = document.createElement('div');
		parentElt.appendChild(cCAPITAN_MH.gDiv);
		parentElt = cCAPITAN_MH.gDiv;

		// bloc liste de solutions
		//console.log('xxx avant bloc solutions');
		var table = cCAPITAN_MH.afficheInfoCarte(cCAPITAN_MH.idCarte);
		if (table) {
			var p = document.createElement('p');
			p.id = 'spacerMZCapitan';
			//window.console.log('analyseObject_log: table=' + JSON.stringify(table));
			p.appendChild(table);
			parentElt.appendChild(p);
		}
		//console.log('xxx après bloc solutions');

		// bloc utilité de faire une recherche sur la position courante
		table = cCAPITAN_MH.newRecherche();
		if(table != null)
		{
			var p = document.createElement('p');
			p.appendChild(table);
			parentElt.appendChild(p);
			// bloc ajout de nouvelle recherche
			cCAPITAN_MH.createNewRecherche(parentElt);
		}
		//console.log('xxx après recherche pos courrant');

		// Roule 08/08/2016 bloc des recherches mémorisées
		//console.log('xxx avant mémo', infos);
		if (infos)
		{
			table = cCAPITAN_MH.prevRecherche(cCAPITAN_MH.idCarte);
			var p = document.createElement('p');
			p.id = 'MZ_capitan_p_liste_memo';
			p.appendChild(table);
			parentElt.appendChild(p);
			// Roule 08/08/2016 bloc préparant les infos pour l'outil Mamoune (Psyko-Chasseurs)
			table = cCAPITAN_MH.blocMamoune(cCAPITAN_MH.idCarte);
			if(table!=null)
			{
				p = document.createElement('p');
				p.appendChild(table);
				parentElt.appendChild(p);
			}
		}
		//console.log('xxx après mémo');
		if (cCAPITAN_MH.mutationObserver)
			cCAPITAN_MH.mutationObserver.observe(document.body, cCAPITAN_MH.MutationObserverConfig);
	};

	static afficheMsg(msg, color, big) {
		let p = document.createElement('p');
		if (color) p.style.color = color;
		if (big) {
			p.style.fontSize = 'xx-large';
			p.style.lineHeight = '150%';
		}
		p.appendChild(document.createTextNode('MZ Capitan : ' + msg));
		let contMsg = document.getElementById('msgEffet');
		if (!contMsg) {
			contMsg = document.evaluate("//div[@class = 'modal']",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		}
		if (!contMsg) {
			contMsg = document.getElementById('EquipementForm');
			if (contMsg) {
				contMsg.insertBefore(p, contMsg.firstChild);
				return;
			}
		}
		if (!contMsg) contMsg = document.body;
		contMsg.appendChild(p);
	};

	// Roule 08/08/2016
	static blocMamoune(idCarte) {
		let table = cCAPITAN_MH.createHTMLTable();

		var thead = document.createElement('thead');
		var tr = cCAPITAN_MH.appendTr(thead, 'mh_tdtitre');
		var td = cCAPITAN_MH.appendTdText(tr, "Outil du cercle des Psyko-Chasseurs", true);
		td.setAttribute('align', 'center');
		//td.setAttribute('title', 'sélectionnez (triple-clic), copiez et collez dans l\'outil des Psyko-Chasseurs');
		table.appendChild(thead);

		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		// http://mountyhall.dispas.net/dynamic/outils_capitan.php?x=101&y=8&n=73&t=3+77+30+1%0D%0A37+57+48+0%0D%0A33+32+29+1%0D%0A87+20+74+2%0D%0A17+56+63+0%0D%0A22+89+78+2&voir=1&cent=100&enter=Go#
		var tabtxt = new Array();
		if (cCAPITAN_MH.curPos != undefined) {
			let currentPosAlreadyDone = false;
			if (cCAPITAN_MH.infoCurrentCarte.essais) for (let i = 0; i < cCAPITAN_MH.infoCurrentCarte.essais.length; i++) {
				let oEssai = cCAPITAN_MH.infoCurrentCarte.essais[i];
				tabtxt.push(oEssai.forPsychoChasseur());
				if (cCAPITAN_MH.curPos.sameLocAs(oEssai)) currentPosAlreadyDone = true;
			}
			if (!currentPosAlreadyDone) tabtxt.push(cCAPITAN_MH.curPos.forPsychoChasseur() + '+%3F');	// spécial pour demander à Mamoune ce qu'elle pense d'un essai à la position courante
		}
		var tr2 = cCAPITAN_MH.appendTr(tbody, 'mh_tdpage');
		var td2 = cCAPITAN_MH.appendTd(tr2);
		if(!cCAPITAN_MH.infoCurrentCarte.mort) {
			td2.cCAPITAN_MH.appendText('Erreur\u00A0: impossible de retrouver les coordonnées de la mort');
		} else {
			let a = document.createElement('a');
			cCAPITAN_MH.appendText(a, 'Cliquer ici pour savoir ce qu\'en pensent les Psyko-Chasseurs');
			a.setAttribute('href', 'http://mountyhall.dispas.net/dynamic/outils_capitan.php?' + cCAPITAN_MH.infoCurrentCarte.mort.forGet() + '&t=' + tabtxt.join('%0D%0A') + '&voir=1&cent=100');
			a.setAttribute('target', 'psykochasseurs');
			td2.appendChild(a);
		}

		td.setAttribute('class', 'mh_tdpage');
		//td.setAttribute('width', width);
		td.setAttribute('align', 'center');


		td.addEventListener("click", cCAPITAN_MH.toggleTableau, true);
		td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
		td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
		td.setAttribute('colspan', 2);
		tbody.setAttribute('style', 'display:none;');

		return table;
	};

	static prevRecherche(idCarte) {
		let table = cCAPITAN_MH.createHTMLTable();

		let nbEssai = 0;
		if (cCAPITAN_MH.infoCurrentCarte.essais) nbEssai = cCAPITAN_MH.infoCurrentCarte.essais.length;
		let thead = document.createElement('thead');
		let tr = cCAPITAN_MH.appendTr(thead, 'mh_tdtitre');
		let td = cCAPITAN_MH.appendTdText(tr, "Vous avez mémorisé " + nbEssai + " essai" + (nbEssai > 1 ? "s" : ""), true);
		td.setAttribute('align', 'center');
		table.appendChild(thead);
		if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] prevRecherche_log nbEssai=${nbEssai}`);

		let tbody = document.createElement('tbody');
		tbody.id = 'MZ_capitan_tbody_liste_memo';
		table.appendChild(tbody);
		let delRecherche = cCAPITAN_MH.delRecherche.bind(this);	// créer une version de delrecherche qui aura le "bon" this
		for (let i = 0; i < nbEssai; i++) {
			let td2 = cCAPITAN_MH.createCase(cCAPITAN_MH.infoCurrentCarte.essais[i].display(),tbody,400);
			let td3 = cCAPITAN_MH.appendTd(td2.parentNode);
			let bt = cCAPITAN_MH.appendButton(td3, "Supprimer", delRecherche);
			bt.idEssai = i;
			bt.idCarte = idCarte;
			td3.setAttribute('class', 'mh_tdpage');
			td3.setAttribute('width', 200);
			td3.setAttribute('align', 'center');
		}

		td.addEventListener("click", cCAPITAN_MH.toggleTableau, true);
		td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
		td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
		td.setAttribute('colspan', 2);
		tbody.setAttribute('style', 'display:none;');

		return table;
	};

	static delRecherche(e) {
		let idEssaiDel = e.target.idEssai;	// index dans le tableau cCAPITAN_MH.infoCartes[idCarte]
		let idCarte = e.target.idCarte;
		let infos = cCAPITAN_MH.infoCartes[idCarte];
		if (!infos) {
			window.console.log(`[Capitan] delRecherche_log: idEssaiDel=${idEssaiDel}, idCarte=${idCarte}, ERREUR, pas d'info du tout`);
			return;
		}
		if (!infos.essais) {
			window.console.log(`[Capitan] delRecherche_log: idEssaiDel=${idEssaiDel}, idCarte=${idCarte}, ERREUR, pas d'essais`);
			return;
		}
		let nbEssai = infos.essais.length;
		if (idEssaiDel >= nbEssai) {
			window.console.log(`[Capitan] delRecherche_log: idEssaiDel=${idEssaiDel}, idCarte=${idCarte}, ERREUR, il n'y a que ${nbEssai} essais`);
			return;
		}
		if (cCAPITAN_MH.bDebug) window.console.log(`[Capitan debug] delRecherche_log: idEssaiDel=${idEssaiDel}, idCarte=${idCarte}, nbEssai=${nbEssai}`);
		infos.essais.splice(idEssaiDel, 1);
		if (cCAPITAN_MH.bDebug) window.console.log('[Capitan debug] delRecherche_log après suppression, il reste ' + JSON.stringify(infos));

		cCAPITAN_MH.saveIntoMH(idCarte);
		cCAPITAN_MH.copyInfo2LocalStorage(idCarte);

		cCAPITAN_MH.reinit();
	};

	static createNewRecherche(parentElt) {
		let p = document.createElement('p');

		let table = cCAPITAN_MH.createHTMLTable();

		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		var td = cCAPITAN_MH.createCase("Rajouter manuellement  une recherche :",tbody);

		td.appendChild(document.createElement('br'));
		td.appendChild(document.createTextNode("X = "));
		cCAPITAN_MH.addInput(td, "MZ_rX");
		td.appendChild(document.createTextNode(" Y = "));
		cCAPITAN_MH.addInput(td, "MZ_rY");
		td.appendChild(document.createTextNode(" N = "));
		cCAPITAN_MH.addInput(td, "MZ_rN");
		td.appendChild(document.createElement('br'));
		td.appendChild(document.createTextNode("Nombre de chiffres bien placés : "));
		cCAPITAN_MH.addInput(td, "MZ_rBP",1);
		td.appendChild(document.createElement('br'));
		cCAPITAN_MH.appendButton(td, "Ajouter", cCAPITAN_MH.addRecherche.bind(this));

		p.appendChild(table);
		parentElt.appendChild(p);
	};

	static addRecherche() {
		try {
			var x = document.getElementById('MZ_rX').value;
			var y = document.getElementById('MZ_rY').value;
			var n = document.getElementById('MZ_rN').value;
			var nbChiffres = document.getElementById('MZ_rBP').value;
			if(x==null || isNaN(parseInt(x)))
			{
				window.alert("Erreur : champ X mal formaté.");
				return;
			}
			if(y==null || isNaN(parseInt(y)))
			{
				window.alert("Erreur : champ Y mal formaté.");
				return;
			}
			if(n==null || isNaN(parseInt(n)))
			{
				window.alert("Erreur : champ N mal formaté.");
				return;
			}
			if(nbChiffres==null || isNaN(parseInt(nbChiffres)))
			{
				window.alert("Erreur : nombre de chiffres bien placés mal formaté.");
				return;
			}
			cCAPITAN_MH.addOneRecherche(cCAPITAN_MH.getIDCarte(), x, y, n, nbChiffres);
			cCAPITAN_MH.reinit();
		} catch(e) {
			console.log(e);
			window.alert(e);
		}
	};

	static addInput(parent, nom, size)
	{
		var input = document.createElement('input');
		input.setAttribute('type','text');
		input.setAttribute('name',nom);
		input.setAttribute('type','text');
		input.setAttribute('maxlength',size==null?4:size);
		input.setAttribute('size',size==null?4:size);
		input.id = nom;
		parent.appendChild(input);
		return input;
	};

	static analyseResultatRecherche()
	{
		let idCarte = cCAPITAN_MH.getIntegerByID('carte', 'numéro de carte');
		if (idCarte === undefined) return;
		let x = cCAPITAN_MH.getIntegerByID('x', 'x');
		if (cCAPITAN_MH.bDebug) window.console.log("[Capitan debug] infoRecherche_log: X=" + x);
		if (x === undefined) return;	// ne pas utiliser «!» car x peut être «0» ! Le message a déjà été affiché
		let y = cCAPITAN_MH.getIntegerByID('y', 'y');
		if (cCAPITAN_MH.bDebug) window.console.log("[Capitan debug] infoRecherche_log: Y=" + y);
		if (y === undefined) return;
		let n = cCAPITAN_MH.getIntegerByID('n', 'n');
		if (cCAPITAN_MH.bDebug) window.console.log("[Capitan debug] infoRecherche_log: N=" + n);
		if (n === undefined) return;
		let nb = cCAPITAN_MH.getIntegerByID('nb', 'Vous avez retrouvé');
		if (cCAPITAN_MH.bDebug) window.console.log("infoRecherche_log: nb=" + nb);
		if (nb === undefined) return;

		let eMsg = document.getElementById("msgEffet");
		if (eMsg) {
			let msg = eMsg.textContent;
			if (msg.match(/Xcoin/) && msg.match(/Xcoin/)) {
				// fonctionne à la fois pour "Tu es dans..." et "Vous êtes dans..."
				if(!msg.match(/es dans le bon Xcoin/))
					x = -x;
				if(!msg.match(/es dans le bon Ycoin/))
					y = -y;
			} else {
				window.console.log('[Capitan] infoRecherche_log ERREUR, pas Xcoin et Ycoin, le signe ne sera pas mémorisé');
				eMsg = false;
			}
		} else {
			window.console.log('[Capitan] infoRecherche_log ERREUR, pas de msgEffet, le signe ne sera pas mémorisé');
		}

		cCAPITAN_MH.addOneRecherche(idCarte, x, y, n, nb, x, y);

		cCAPITAN_MH.infoCurrentCarte = cCAPITAN_MH.infoCartes[idCarte];
		let table = cCAPITAN_MH.afficheInfoCarte(idCarte, true);

		if (!table) return;
		let p = document.createElement('p');
		p.appendChild(table);
		let t = document.getElementsByTagName('TABLE');
		if (t.length > 0) {
			t[0].parentNode.insertBefore(p, t[0].nextSibling);
		} else {
			document.body.appendChild(p);
		}
	};

	// return undefined if not found
	static getIntegerByID(id, msg) {
		let e = document.getElementById(id);
		if (!e || !e.childNodes || !e.childNodes[0] || !e.childNodes[0].nodeValue) {
			if (msg) window.alert('Script carte de Capitan : impossible de retrouver le ' + msg);
			window.console.log(`[Capitan] getIntegerByID_log ERREUR : impossible de retrouver le ` + (msg ? msg : id));
			return;
		}
		return parseInt(e.childNodes[0].nodeValue);
	};

	///////////////////////////////////
	// debuging
	// essais : objet
	//	.mode : description
	//	.essais : tableau d'objets essai
	//		.mode : description
	//		.essais : tableau de cartes
	//			.noCarte : id de la carte
	//			.essais : tableau d'essais, [x, y, n, nb]
	static AfficheEssais(essais, sMode) {
		var eBigDiv = document.getElementById('ListeEssaiCapitan');
		if (!eBigDiv) {
			var insertPoint = document.getElementById('footer1');
			eBigDiv = document.createElement('table');
			eBigDiv.id = 'ListeEssaiCapitan';
			cCAPITAN_MH.insertBefore(insertPoint, document.createElement('p'));
			cCAPITAN_MH.insertTitle(insertPoint,'Capitan : Liste des essais');
			cCAPITAN_MH.insertBefore(insertPoint, eBigDiv);
			cCAPITAN_MH.addTrEssais(eBigDiv, 'mode', 'carte', 'nombre d\'essais', true);
		}
		if (!essais) {
			cCAPITAN_MH.addTrEssais(eBigDiv, sMode, '', 'pas d\'essai', false);
			return;
		}
		var carte;
		for (carte in essais) {
			cCAPITAN_MH.addTrEssais(eBigDiv, sMode, carte, essais[carte] + ' essai(s)', false);
		}
		if (carte === undefined) {
			cCAPITAN_MH.addTrEssais(eBigDiv, sMode, '', '0 essai', false);
		}
	};

	static addTrEssais(eTable, sMode, sCarte, sText, bBold) {
		var tr = cCAPITAN_MH.appendTr(eTable);
		var td = cCAPITAN_MH.appendTd(tr);
		cCAPITAN_MH.appendText(td, sMode, bBold);
		td = cCAPITAN_MH.appendTd(tr);
		cCAPITAN_MH.appendText(td, sCarte, bBold);
		td = cCAPITAN_MH.appendTd(tr);
		cCAPITAN_MH.appendText(td, sText, bBold);
	};

	static limitInfiniteLoop() {
		if (cCAPITAN_MH.limitxx === undefined) cCAPITAN_MH.limitxx = 1;
		else                                   cCAPITAN_MH.limitxx++;
		if (cCAPITAN_MH.limitxx > 2000) {
			console.trace();
			console.log(`cCAPITAN_MH.limitxx=${cCAPITAN_MH.limitxx}`);
			return true;
		}
	}

	////// gestion stockage

	// pour la carte cCAPITAN_MH.idCarte, merge localStrage et infos de MH_capitan_json
	// => met à jour cCAPITAN_MH.infoCartes[idCarte] mais PAS dans cCAPITAN_MH.infoCurrentCarte
	static initCarte(idCarte) {
		if (cCAPITAN_MH.infoCartes[idCarte]) return;	// déjà fait
		if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] avant merge carte ${idCarte}, infoCartes=${JSON.stringify(cCAPITAN_MH.infoCartes)}`);
		let MH_data = {};
		if (MH_capitan_json != '') MH_data = JSON.parse(MH_capitan_json);
		let info = {};
		let bChanged = false;
		if (MH_data && MH_data[idCarte]) {
			let MH_info = MH_data[idCarte];
			if (MH_info.mort) info.mort = new cCAPITAN_essai(MH_info.mort);
			if (MH_info.essais) {
				info.essais = [];
				for (let v of MH_info.essais)
					info.essais.push(new cCAPITAN_essai(v));
			}
			if (MH_info.signeX) info.signeX = MH_info.signeX;
			if (MH_info.signeY) info.signeY = MH_info.signeY;
			if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] partir de MH_data, carte ${idCarte}
				MH_data=${JSON.stringify(MH_data)}
				info=${JSON.stringify(info)}`);
		} else {
			if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] pas de recup MH carte ${idCarte}
				MH_data=${JSON.stringify(MH_data)}`);
		}

		// merge position mort en localStorage
		let txtMortLocalStorage = window.localStorage["capitan."+idCarte+".position"];
		if (!txtMortLocalStorage) {
			// ça peut être normal (ouverture de la carte sur un nouvel appareil)
		} else {
			let oMortLocalStorage = new cCAPITAN_essai(txtMortLocalStorage);
			if (oMortLocalStorage.isValidLoc()) {
				if (info.mort) {
					if (!info.mort.sameLocAs(oMortLocalStorage)) {
						console.log(`[Capitan] divergence de loc de mort
centralisé=${JSON.stringfy(info.mort)}
localStorage='${JSON.stringify(oMortLocalStorage)}`);
					}
				} else {
					info.mort = oMortLocalStorage;
					bChanged = true;
				}
			} else {
				console.log('[Capitan] mauvaise loc de mort en localStorage: ' + window.localStorage["capitan."+idCarte+".position"]);
			}
		}

		// merge essais en localStorage
		let essaiText;
		for (let i = 0; (essaiText = window.localStorage["capitan."+idCarte+".essai."+i]) != null; i++) {
			let oEssai = new cCAPITAN_essai(essaiText);
			if (!oEssai.isValidEssai()) {
				console.log(`[Capitan] mauvaise loc en localStorage: ${essaiText}`);
				continue;
			}
			let bFound = false;
			if (info.essais) for (let oEssai2 of info.essais) {
				if (!oEssai2.sameLocAs(oEssai)) continue;
				if (!oEssai2.sameAs(oEssai)) {
					console.log(`[Capitan] essais incohérents en localStorage: ${essaiText} <-> ${JSON.stringify(oEssai2)}`);
				}
				bFound = true;
				break;
			}
			if (bFound) continue;
			if (!info.essais) info.essais = [];
			if (cCAPITAN_MH.bDebug) window.console.log(`[CAPITAN debug] initCarte_log ajout ${JSON.stringify(oEssai)} à ${JSON.stringify(info.essais)}`);
			info.essais.push(oEssai);
			bChanged = true;
		}

		// merge cadran
		let keyLocalStorageCadran = "capitan."+idCarte+".this.signe";
		let txtCadran = window.localStorage[keyLocalStorageCadran];
		if (txtCadran != null) {
			var signes = txtCadran.split(";");
			if (cCAPITAN_MH.bDebug) window.console.log(`[CAPITAN debug] initCarte_log txtCadran=${txtCadran}, signes=${JSON.stringify(signes)}`);
			if (info.signeX) {
				if (signes[0] != info.signeX) console.log(`[Capitan] signe X incohérent en localStorage: ${signes[0]} <-> ${info.signeX}`);
			} else {
				info.signeX = signes[0];
				bChanged = true;
			}
			if (info.signeY) {
				if (signes[1] != info.signeY) console.log(`[Capitan] signe Y incohérent en localStorage: ${signes[1]} <-> ${info.signeY}`);
			} else {
				info.signeY = signes[1];
				bChanged = true;
			}
		} else if (cCAPITAN_MH.bDebug) {
			window.console.log(`[CAPITAN debug] initCarte_log pas de cadran en localStorage pour ${keyLocalStorageCadran}`);
		}

		/*
		if (originalPosText === undefined) {
			let msg = "La recherche a été enregistrée. Mais vous n'avez pas encore affiché le détail de la carte "
				+ idCarte + " et le « script du Capitan » ne connait pas la position de la mort du Capitan. Il ne peut pas vous en dire plus. Allez dans «  EQUIPEMENT » et affichez cette carte.";
			window.console.log('afficheInfoCarte_log: ' + msg);
			cCAPITAN_MH.afficheMsg(msg, 'red');
			return;
		}
		}
		*/
		if (cCAPITAN_MH.limitInfiniteLoop()) cCAPITAN_MH.initCarte = undefined;
		cCAPITAN_MH.infoCartes[idCarte] = info;
		if (bChanged) cCAPITAN_MH.saveIntoMH(idCarte);
		if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] après merge carte ${idCarte}, infoCartes=${JSON.stringify(cCAPITAN_MH.infoCartes)}`);
	};

	static addOneRecherche(idCarte, x, y, n, nbChiffres, signeX, signeY) {
		cCAPITAN_MH.initCarte(idCarte);
		let info = cCAPITAN_MH.infoCartes[idCarte];
		let newEssai = new cCAPITAN_essai(x, y, n, nbChiffres);
		if (info.essais) for (let oEssai of info.essais) {
			if (!oEssai.sameLocAs(newEssai)) continue;
			if (!oEssai.sameAs(newEssai)) {
				console.log(`[Capitan] tentative d'ajout d'un essai même loc, résultat différent carte=${idCarte} nouveau=${newEssai.display()} existant=${oEssai.display()}`);
				newEssai.c = undefined;
				cCAPITAN_MH.afficheMsg(`tentative d'ajout d'un 2e essai en ${newEssai.display()}. Supprimez d'abord le précédent`, 'red');
			} else {
				console.log(`[Capitan] tentative d'ajout d'un essai déjà existant carte=${idCarte} essai=${newEssai.display()}`);
			}
			return;
		}
		if (!info.essais) info.essais = [newEssai];
		else              info.essais.push(newEssai);
		if (signeX && signeY) {	// 0 serait bien une erreur
			info.signeX = signeX > 0 ? 1 : -1;
			info.signeY = signeY > 0 ? 1 : -1;
		}
		cCAPITAN_MH.saveIntoMH(idCarte);
		cCAPITAN_MH.copyInfo2LocalStorage(idCarte);
	};

	static saveIntoMH(idCarte) {
		let url = window.location.origin;	// https://gams.mountyhall.com
		url += '/mountyhall/MH_PageUtils/Services/json_extension.php';
		url += '?mode=set&ext=capitan&clef=' + idCarte;
		let request = new XMLHttpRequest();
		request.open('POST', url);
		request.onreadystatechange = function () {
			if (request.readyState != 4) {
				return;
			}
			if (request.error) {
				window.console.error('[Capitan] erreur set config MH : ' + request.error);
				return;
			}
			if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] retour AJAX set prop MH ${request.responseText}`);
			if (request.responseText.indexOf('"OK"') < 0) {
				console.log(`[Capitan] ERREUR à l'envoi des information sur le serveur MH, le message d'erreur est: ${request.responseText}`);
			}
		};
		if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] envoi à MH data pour ${idCarte}, info=${JSON.stringify(cCAPITAN_MH.infoCartes[idCarte])}`);
		request.send(cCAPITAN_MH.escapeUnicode(JSON.stringify(cCAPITAN_MH.infoCartes[idCarte])));
	};

	static copyInfo2LocalStorage(idCarte) {
		let info = cCAPITAN_MH.infoCartes[idCarte];
		if (!info) {
			console.log(`[Capitan] ERREUR à la sauvegarde de la carte ${idCarte} : pas d'info`);
			return;
		}
		// mort
		if (info.mort) {
			let keyMort = "capitan."+idCarte+".position";
			let txtInfo = info.mort.forLocalStrorage();
			let txtLocalStorage = window.localStorage.getItem(keyMort);
			if (txtInfo != txtLocalStorage) window.localStorage.setItem(keyMort, txtInfo);
		}

		// cadran
		if (info.signeX || info.signeY) {
			let keyCadran = "capitan."+idCarte+".this.signe";
			let txtInfo = info.signeX + ';' + info.signeY;
			let txtLocalStorage = window.localStorage.getItem(keyCadran);
			if (txtInfo != txtLocalStorage) window.localStorage.setItem(keyCadran, txtInfo);
		}

		// essais : on balaie les index en comparant les essais
		// tant que c'est pareil, on avance
		// quand ce n'est plus pareil, on supprimer out le reste coté LocalStorage et on réécrit
		let iEssai;
		if (info.essais) for (iEssai=0; iEssai < info.essais.length; iEssai++) {
			let keyEssai = 'capitan.' + idCarte+'.essai.' + iEssai;
			let txtInfo = info.essais[iEssai].forLocalStrorage();
			let txtLocalStorage = window.localStorage.getItem(keyEssai);
			if (txtInfo != txtLocalStorage) break;
		}
		// supprimer la suite coté localStorage (iEssai jusqu'aux les 10 suivant le dernier existant pour faire bonne mesure)
		let iLastLocalStorage = iEssai;
		for (let i2 = iEssai; i2 < iLastLocalStorage + 10; i2++) {
			let keyEssai = 'capitan.' + idCarte +'.essai.' + i2;
			if (!window.localStorage.getItem(keyEssai)) continue;
			iLastLocalStorage = i2;
			window.localStorage.removeItem(keyEssai);
		}
		// ajouter le reste de Info dans localStorage
		if (info.essais) for (let i2=iEssai; i2 < info.essais.length; i2++) {
			let keyEssai = 'capitan.' + idCarte +'.essai.' + i2;
			let txtInfo = info.essais[i2].forLocalStrorage();
			window.localStorage.setItem(keyEssai, txtInfo);
		}
	}

	static escapeUnicode(str) { // https://stackoverflow.com/questions/62449035/escape-all-unicode-non-ascii-characters-in-a-string-with-javascript
		return [...str].map(c => /^[\x00-\x7F]$/.test(c) ? c : c.split("").map(a => "\\u" + a.charCodeAt().toString(16).padStart(4, "0")).join("")).join("");
	}

	//////

	static reinit() {
		if (cCAPITAN_MH.gDiv) cCAPITAN_MH.gDiv.parentNode.removeChild(cCAPITAN_MH.gDiv);
		cCAPITAN_MH.analyseObject();
	};

	static MutationObserverConfig = { childList: true, subtree: true };

	static init() {
		if (cCAPITAN_MH.isPage("MH_Play/Play_a_Action.php") && !(cCAPITAN_MH.isPage('type=A') && cCAPITAN_MH.isPage('id=523'))) {
			// optimisation : pas besoin de init
			return
		}
		if (typeof MH_capitan_json === 'undefined') {
			let msg = "Le script du Capitan doit maintenant fonctionner en mode intégré. Activez-le via Options/Extensions et désactivez-le sous xxxMonkey ou sur le relai Raistlin";
			console.log(`[Capitan ) ${msg}`);
			cCAPITAN_MH.afficheMsg(msg, 'red', true);
			return;
		}
		//cCAPITAN_MH.afficheMsg('Repassez sur la version normale du script du Capitan (options, extensions)', 'red', true);
		cCAPITAN_MH.MZ_ok = (typeof MH_mountyzilla_json !== 'undefined');
		if (cCAPITAN_MH.bDebug) console.log('[Capitan debug] init MH_capitan_json=', MH_capitan_json);

		// charger le numéro du Troll
		let frameSommaire;
		let eltId = document.getElementById('footer');	// cas smartphone
		let p = window.parent;	// cas classique (pas smartphone)
		let iTry = 0;
		while (p) {	// cas classique (pas smartphone)
			//if (cCAPITAN_MH.bDebug) console.log(p);
			frameSommaire = p.frames['Sommaire'];
			if (frameSommaire) break;
			if (iTry++ > 10) break;	// ceinture et bretelle contre une boucle infinie
			let p2 = p.parent;
			if (p2 === p) break;	// top window est son propre parent
			p = p2;
		}
		if (frameSommaire) eltId = frameSommaire.document.getElementById ('id');
		if (eltId) {
			cCAPITAN_MH.numTroll = parseInt(eltId.getAttribute('data-id'));
			if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] troll id=${cCAPITAN_MH.numTroll}`);
		} else cCAPITAN_MH.numTroll = 0;	// on continue, pas de problème en mode intégré sauf qu'on ne récupère pas les anciennes cartes
		if (cCAPITAN_MH.numTroll == 0) console.log('[Capitan] erreur à la récupération du numéro de Troll');
		// position courante du Troll
		eltId = undefined;
		if (frameSommaire) eltId = frameSommaire.document.getElementById ('DLA_xyn');
		if (eltId) {
			let m = eltId.innerText.match(/X\s*=\s*([-\d]+)[\s|]+Y\s*=\s*([-\d]+)[\s|]+N\s*=\s*([-\d]+)/im);
			if (m && m.length == 4) {
				cCAPITAN_MH.curPos = new cCAPITAN_essai(m[1], m[2], m[3]);
				if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] init: pos from MH ${eltId.innerText}`)
			} else {
				console.log(`[Capitan] init_log erreur analyse position troll pour ${eltId.innerText}`);
			}
		}
		if (cCAPITAN_MH.MZ_ok && !cCAPITAN_MH.curPos) {
			// Roule 08/08/2016 utilisation de localStorage car c'est là que tout_MZ stocke les coord
			cCAPITAN_MH.curPos = new cCAPITAN_essai(window.localStorage[cCAPITAN_MH.numTroll+".position.X"],
				window.localStorage[cCAPITAN_MH.numTroll+".position.Y"],
				window.localStorage[cCAPITAN_MH.numTroll+".position.N"]);
			if (cCAPITAN_MH.bDebug) window.console.log('[Capitan debug] init_log: position du troll récupérée en localStorage');
		}
		if (cCAPITAN_MH.curPos && !cCAPITAN_MH.curPos.isValidLoc()) {
			console.log(`[Capitan] init_log position troll invalide: ${JSON.stringify(cCAPITAN_MH.curPos)}`);
			cCAPITAN_MH.curPos = undefined;
		}
		if (cCAPITAN_MH.bDebug) window.console.log('[Capitan debug] init_log: position du troll=' + JSON.stringify(cCAPITAN_MH.curPos));

		//console.log(`href=${window.location.href}`);
		if (cCAPITAN_MH.isPage("View/TresorHistory.php"))
		{
			cCAPITAN_MH.analyseObject();
		}
		else if (cCAPITAN_MH.isPage("MH_Play/Play_a_ActionResult.php") || cCAPITAN_MH.isPage("MH_Play/Play_a_TrouverCachette2.php"))
		{
			// uniquement si l'id du body est p_trouverunecachette
			if (document.body.id != 'p_trouverunecachette') return;
			cCAPITAN_MH.analyseResultatRecherche();
		}
		else if (cCAPITAN_MH.isPage("MH_Play/Play_a_Action.php") && cCAPITAN_MH.isPage('type=A') && cCAPITAN_MH.isPage('id=523'))
		{
			//console.log(`Capitan Play_a_Action`);
			cCAPITAN_MH.traiteCartesDansListe();
		}
		else if(cCAPITAN_MH.isPage("MH_Play/Play_equipement.php") || cCAPITAN_MH.isPage("MH_Taniere/TanierePJ_o_Stock.php"))
		{
			cCAPITAN_MH.mutationObserver = new MutationObserver(cCAPITAN_MH.analyseObject.bind(this));
			cCAPITAN_MH.mutationObserver.observe(document.body, cCAPITAN_MH.MutationObserverConfig);
			if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] init activation mutationObserver`);
			if(cCAPITAN_MH.isPage("/MH_Play/Play_equipement.php")) {
				cCAPITAN_MH.traiteCartesDansEquipement();
			}
		}
		if (cCAPITAN_MH.bDebug) console.log(`[Capitan debug] fin init`);
	};
}

class cCAPITAN_essai {
	constructor(x, y, n, c) {
		if (y == undefined) {	// initialisation à partir d'une chaine séparée par ";", d'un array ou d'un objet
			if (typeof x === 'string' || x instanceof String) {
				let t = x.split(";");
				this.x = parseInt(t[0], 10);
				this.y = parseInt(t[1], 10);
				this.n = parseInt(t[2], 10);
				if (t.length > 3) this.c = parseInt(t[3], 10);
			} else if (Array.isArray(x)) {
				this.x = parseInt(x[0], 10);
				this.y = parseInt(x[1], 10);
				this.n = parseInt(x[2], 10);
				if (x.length > 3) this.c = parseInt(x[3], 10);
			} else if (x != undefined) {
				this.x = x.x;
				this.y = x.y;
				this.n = x.n;
				if (x.c !== undefined) this.c = x.c;
			}
		} else {
			this.x = parseInt(x, 10);
			this.y = parseInt(y, 10);
			this.n = parseInt(n, 10);
			if (c !== undefined) this.c = parseInt(c, 10);
		}
	};

	coord2text(coord) {
		let t = coord + '';
		if (t.length < 2) t = '0' + t;
		return t;
	};

	xAbs() {return Math.abs(this.x);};
	yAbs() {return Math.abs(this.y);};
	nAbs() {return Math.abs(this.n);};
	xText() {return this.coord2text(Math.abs(this.x));};
	yText() {return this.coord2text(Math.abs(this.y));};
	nText() {return this.coord2text(Math.abs(this.n));};

	display() {	// pour les humains
		let ret = 'X = ' + this.x + ', Y = ' + this.y +', N = ' + this.n;
		if (this.c !== undefined) ret += ' => ' + this.c;
		return ret;
	};

	forGet() {
		return 'x=' + this.x + '&y=' + this.y +'&n=' + this.n;
	};

	forLocalStrorage() {
		let ret = this.x + ';' + this.y +';' + this.n;
		if (this.c !== undefined) ret += ';' + this.c;
		return ret;
	}

	forPsychoChasseur() {	// rend le bout de texte à mettre dans l'URL vers l'outil des Psycho Chasseurs
		let ret = Math.abs(this.x) + '+' + Math.abs(this.y) + '+' + Math.abs(this.n);
		if (this.c !== undefined) ret += '+' + this.c;
		return ret;
	};

	isValidLoc() {
		if (this.x === undefined || isNaN(this.x)) return false;
		if (this.y === undefined || isNaN(this.y)) return false;
		if (this.n === undefined || isNaN(this.n)) return false;
		return true;
	};

	isValidEssai() {
		if (!this.isValidLoc) return false;
		if (this.c === undefined || isNaN(this.c)) return false;
		return true;
	};

	sameLocAs(oOther) {
		if (this.x != oOther.x) return false;
		if (this.y != oOther.y) return false;
		if (this.n != oOther.n) return false;
		return true;
	};

	sameAs(oOther) {
		if (!this.sameLocAs(oOther)) return false;
		if (this.c !== oOther.c) return false;
		return true;
	};

	is200() {	// vrai si au moins une coord >= 200
		if (Math.abs(this.x) >= 200) return true;
		if (Math.abs(this.y) >= 200) return true;
		if (Math.abs(this.n) >= 200) return true;
		return false;
	};

	nbMatchesOne(t1, t2) {
		t1 = '' + parseInt(t1, 10);	// virer le zéro à gauche. MH n'en tient pas compte quand il compte le nombre de match
		t2 = '' + parseInt(t2, 10);
		let nRet = 0;
		let l1 = t1.length;
		let l2 = t2.length;
		for (let i = 0; i < l1 && i < l2; i++)
			if (t1.substring(l1 - (i+1), l1 - i) == t2.substring(l2 - (i+1), l2 - i)) nRet++;
		return nRet;
	};

	nbMatches(oOther) {
		let nMatches = this.nbMatchesOne(this.xText(), oOther.x);
		nMatches += this.nbMatchesOne(this.yText(), oOther.y);
		nMatches += this.nbMatchesOne(this.nText(), oOther.n);
		return nMatches;
	}

	isCompatible(tabCoord) {	// vérifie si c'est compatible avec les coord passées en argument sous forme de tableau de chaines
		let nMatches = this.nbMatchesOne(this.xText(), tabCoord[0]);
		nMatches += this.nbMatchesOne(this.yText(), tabCoord[1]);
		nMatches += this.nbMatchesOne(this.nText(), tabCoord[2]);
		return nMatches == this.c
	};

	nbChiffre() {	// rend le nombre de chiffres (une coord à 1 chiffe en donne 2, le "0" et le chiffre des unités)
		return this.xText().length + this.yText().length + this.nText().length;
	};

	tabOccurenceChiffre() {	// le nombre d'occurrences de chaque chiffre (0 à 9) dans les coord
		let tabRet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.addOccurenceChiffre(tabRet, this.xText());
		this.addOccurenceChiffre(tabRet, this.yText());
		this.addOccurenceChiffre(tabRet, this.nText());
		return tabRet;
	};

	addOccurenceChiffre(t, s) {
		let l = s.length;
		for (let i = 0; i < l; i++) {
			let c = s.substring(i, i+1);
			let n = parseInt(c, 10);
			if (!isNaN(n)) t[n]++;
		}
	};

	move(dx, dy, dn) {
		this.x += dx;
		this.y += dy;
		this.n += dn;
	}
};

try
{
	cCAPITAN_MH.init();
} catch(e) {
	window.console.log('script capitan exception', e, e.stack);
}

