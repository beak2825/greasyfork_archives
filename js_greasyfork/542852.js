// ==UserScript==
// @name        cmp_chasse
// @namespace   MH
// @description Comparaison de tableaux de chasse
// @match       *MH_Play/Play_ev_chasse.php*
// @exclude     *mh2.mh.raistlin.fr*
// @exclude     *mhp.mh.raistlin.fr*
// @exclude     *mzdev.mh.raistlin.fr*
// @version     1.1
// @licence     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542852/cmp_chasse.user.js
// @updateURL https://update.greasyfork.org/scripts/542852/cmp_chasse.meta.js
// ==/UserScript==

// vérif UTF-8 ş

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

"use strict";

class MZ_cmpChasse {
	static result;	// array pour result0 et result1
	static nomTroll;	// array

	static idIDTroll = ['cmpChasseTroll0', 'cmpChasseTroll1'];
	static idResultDiv = 'compChasseResult';
	//static idTableResult = 'compChasseResult';
	static msgTrollVide = 'non saisi';
	static nomTrollInconnu = '??';
	static colorEmptyCell = 'white';
	static baseURL = '/mountyhall/View/PJView_Chasse.php?ai_IDPJ=';
	static idTableDataMH = 'foo_fait_de_chasse';

	static init() {
		//console.log('MZ_cmpChasse.init ici');
		let footer1 = document.getElementById('footer1');
		let mainDiv = document.createElement('div');
		if (footer1) {
			footer1.parentNode.insertBefore(mainDiv, footer1);
		} else {
			document.body.appendChild(mainDiv);
		}
		//mainDiv.appendChild(document.createTextNode('ici'));
		let title = document.createElement('h3');
		title.appendChild(document.createTextNode('[extension] Comparaison de tableaux de chasse'));
		mainDiv.appendChild(title);
		let form = document.createElement('div');
		let inp1 = MZ_cmpChasse.appendInputID(form, MZ_cmpChasse.idIDTroll[0], 'premier');
		MZ_cmpChasse.appendInputID(form, MZ_cmpChasse.idIDTroll[1], 'second');
		let but = document.createElement('button');
		but.appendChild(document.createTextNode('Go !'));
		but.onclick = MZ_cmpChasse.go;
		let thisTroll = MZ_cmpChasse.getNumTroll();
		if (thisTroll) inp1.value = thisTroll;
		form.appendChild(but);
		mainDiv.appendChild(form);
		let resultDiv = document.createElement('div');
		resultDiv.id = MZ_cmpChasse.idResultDiv;
		mainDiv.appendChild(resultDiv);
	}

	static appendInputID(form, idInput, texte) {
		let lab = document.createElement('label');
		lab.appendChild(document.createTextNode('ID du ' + texte + ' Trõll'));
		let inp = document.createElement('input');
		inp.type = 'text';
		inp.style.width = '80px';
		inp.style.marginLeft = '5px';
		inp.id = idInput;
		lab.appendChild(inp);
		lab.style.marginRight = '10px';
		form.appendChild(lab);
		return inp;
	}

	static go() {
		//console.log('MZ_cmpChasse.go_log start');
		MZ_cmpChasse.clearResult();
		MZ_cmpChasse.result = [null, null];
		MZ_cmpChasse.nomTroll = [];
		MZ_cmpChasse.getInfo(0);
		MZ_cmpChasse.getInfo(1);
	}

	static async getInfo(iTroll) {
		//console.log('MZ_cmpChasse.getInfo_log ' + iTroll);
		let sTroll = document.getElementById(MZ_cmpChasse.idIDTroll[iTroll]).value.trim();
		if (sTroll == '') {
			//console.log('MZ_cmpChasse.getInfo_log(' + iTroll + ') sTroll vide');
			MZ_cmpChasse.result[iTroll] = MZ_cmpChasse.msgTrollVide;
			MZ_cmpChasse.tryAfficheResult();
			return;
		}
		let idTroll = parseInt(sTroll);
		if (isNaN(idTroll) || idTroll <= 0) {
			//console.log('MZ_cmpChasse.getInfo_log(' + iTroll + ') sTroll non numérique');
			MZ_cmpChasse.result[iTroll] = 'N° Troll incorrect : ' + sTroll;
			MZ_cmpChasse.tryAfficheResult();
			return;
		}
		try {
			let response = await fetch(MZ_cmpChasse.baseURL + idTroll);

			if (!response.ok) {
				MZ_cmpChasse.result[iTroll] = "Erreur à l'appel MH pour le Troll n°" + idTroll;
				MZ_cmpChasse.tryAfficheResult();
				return;
			}

			// convert to UTF8
			let charset = (response.headers.get("content-type").match(/;\s*charset=(.*)(?:;|$)/) || [])[1];
			let html;
			if (charset && charset != "UTF-8") { // TODO check more? utf-8, utf8, UTF8, ...
				let decoder = new TextDecoder(charset)
				let buffer = await response.arrayBuffer()
				html = decoder.decode(buffer) // convert to utf8
			} else {
				html = await response.text()
			}

			if (html.includes("n'existe")) {
				MZ_cmpChasse.result[iTroll] = 'Le Troll n°' + idTroll + " n'existe pas";
				MZ_cmpChasse.tryAfficheResult();
				return;
			}

			let parser = new DOMParser();
			let doc = parser.parseFromString(html, "text/html");

			// Nom du Trõll
			let h1s = doc.getElementsByTagName('h1');
			if (h1s.length >= 1) MZ_cmpChasse.nomTroll[iTroll] = h1s[0].innerText;
			else                 MZ_cmpChasse.nomTroll[iTroll] = MZ_cmpChasse.nomTrollInconnu;

			let tabData = [];

			// méthode 11/2025 : data dans un json dans la variable "r" dans le javascript
			let m = html.match(/r\s*=\s+"(.*)";?\s*loadRows/);
			if (!m) m = html.match(/r\s*=\s+'(.*)';?\s*loadRows/);
			//console.log(`m=${JSON.stringify(m)}`);
			if (m) {
				let replacements = {'\\\\': '\\', '\\n': '\n', '\\"': '"', "\\'": "'"};
				let json = m[1].replace(/\\(\\|n|"|')/g, function(replace) {
					return replacements[replace];
				});
				let data;
				try {
					data = JSON.parse(json);
				} catch (error) {
					MZ_cmpChasse.result[iTroll] = 'Erreur à la récupération des infos JSON MH pour le Troll ' + idTroll;
					console.error('MZ_cmpChasse.getInfo_log(' + iTroll + ') : bad JSON: ', json, error)
					return;
				}
				//console.log(data);
				for (let d of data) {
					let oneData = {};
					if (d.m && d.m.options && d.m.options.sortValue) {
						oneData.monstre = d.m.options.sortValue;
					} else if (d.m) {
						oneData.monstre = d.m.value;
					} else {
						oneData.monstre = JSON.stringify(d);
					}
					if (d.c && d.c.options && d.c.options.sortvalue) {
						oneData.max = d.m.options.sortValue;	// en fait pas utilisé
					} else {
						oneData.moax = '?';
					}
					//'famille': ...,	// finalement, on ne l'affiche pas
					oneData['nb' + iTroll] = parseInt(d.nb),
					tabData.push(oneData);
				}

			} else {

				// méthode pré 11/2025, ne fonctionne plus
				let tableData = doc.getElementById(MZ_cmpChasse.idTableDataMH);
				if (!tableData) {
					if (MZ_cmpChasse.nomTroll[iTroll] == MZ_cmpChasse.nomTrollInconnu) {
						MZ_cmpChasse.result[iTroll] = 'Pas de résultat (ou erreur) venant de MH pour le Troll n°' + idTroll;
					} else {
						MZ_cmpChasse.result[iTroll] = 'Le Troll n°' + idTroll + ' (' + MZ_cmpChasse.nomTroll[iTroll] + ') semble ne pas avoir donné un accès public à son tableau de chasse';
					}
					MZ_cmpChasse.tryAfficheResult();
					return;
				}

				//console.log('MZ_cmpChasse.getInfo_log(' + iTroll + ') nbRow=' + tableData.tBodies[0].rows.length);
				for (let row of tableData.tBodies[0].rows) {
					//console.log(row);
					let oneData = {
						'monstre': row.cells[0].getAttribute('data-sort-value').toString(),
						//'famille': row.cells[2].innerText,	// finalement, on ne l'affiche pas
						'max': parseInt(row.cells[4].getAttribute('data-sort-value')),
					};
					oneData['nb' + iTroll] = parseInt(row.cells[3].innerText),

					tabData.push(oneData);
				}
			}

			//console.log(tabData);
			MZ_cmpChasse.result[iTroll] = tabData;
			MZ_cmpChasse.tryAfficheResult();
		} catch (error) {
			MZ_cmpChasse.result[iTroll] = 'Erreur à la récupération des infos MH pour le Troll ' + idTroll;
			MZ_cmpChasse.tryAfficheResult();
			console.error('MZ_cmpChasse.getInfo_log(' + iTroll + ') : Failed to fetch page: ', error)
		}
	}

	static tryAfficheResult() {
		if (MZ_cmpChasse.result[0] === null || MZ_cmpChasse.result[1] === null) return;	// il faut attendre
		MZ_cmpChasse.clearResult();
		if (MZ_cmpChasse.result[0] == MZ_cmpChasse.msgTrollVide && MZ_cmpChasse.result[1] == MZ_cmpChasse.msgTrollVide) {
			MZ_cmpChasse.addErreur("Aucun d'ID de Troll");
			return;
		}
		let mergedData;
		let show0, show1;
		for (let iTroll = 0; iTroll <= 1; iTroll++) {
			if (MZ_cmpChasse.result[iTroll] == MZ_cmpChasse.msgTrollVide) {
				//console.log('MZ_cmpChasse.tryAfficheResult_log, iTroll=' + iTroll + ' : ignore silencieusement');
				continue;	 //ignore silencieusement
			}
			if (typeof MZ_cmpChasse.result[iTroll] === 'string' || MZ_cmpChasse.result[iTroll] instanceof String) {
				MZ_cmpChasse.addErreur(MZ_cmpChasse.result[iTroll]);
				//console.log('MZ_cmpChasse.tryAfficheResult_log, iTroll=' + iTroll + ' : message erreur');
				MZ_cmpChasse.result[iTroll] = null;
			} else {
				//console.log('MZ_cmpChasse.tryAfficheResult_log, iTroll=' + iTroll + ' : à faire, type=' + typeof MZ_cmpChasse.result[iTroll]);
				if (mergedData) {
					mergedData = mergedData.concat(MZ_cmpChasse.result[iTroll]);
				} else {
					mergedData = MZ_cmpChasse.result[iTroll];
				}
				if (iTroll == 0) show0 = true;
				else             show1 = true;
			}
		}
		if (!mergedData) {
			//console.log('MZ_cmpChasse.tryAfficheResult_log rien à faire');
			return;
		}
		mergedData.sort((a, b) => a.monstre.localeCompare(b.monstre));
		if (show0 && show1) {
			// passe d'agrégation
			let agregated = [];
			let lastData, lastMonstre;
			for (let data of mergedData) {
				if (data.monstre == lastMonstre) {
					if (data.nb0) lastData.nb0 = data.nb0;
					if (data.nb1) lastData.nb1 = data.nb1;
				} else {
					agregated.push(data);
					lastMonstre = data.monstre;
					lastData = data;
				}
			}
			mergedData = agregated;
		}
		//console.log(mergedData);
		let table = document.createElement('table');
		table.className = 'mh_tdborder';
		// Header
		let tr = document.createElement('tr');
		tr.className = 'mh_tdtitre';
		let th = tr.insertCell();
		th.appendChild(document.createTextNode('Monstre'));
		if (show0) {
			th = tr.insertCell();
			th.appendChild(document.createTextNode(MZ_cmpChasse.nomTroll[0]));
		}
		if (show1) {
			th = tr.insertCell();
			th.appendChild(document.createTextNode(MZ_cmpChasse.nomTroll[1]));
		}
		table.appendChild(tr);
		// data
		let totalKill0 = 0;
		let totalKill1 = 0;
		let totalMonstre0 = 0;
		let totalMonstre1 = 0;
		for (let data of mergedData) {
			tr = document.createElement('tr');
			tr.className = 'mh_tdpage';
			let td = tr.insertCell();
			td.appendChild(document.createTextNode(data.monstre));
			if (show0) {
				td = tr.insertCell();
				if (data.nb0) {
					td.appendChild(document.createTextNode(data.nb0));
					totalKill0 += parseInt(data.nb0);
					totalMonstre0++;
				} else {
					td.style.backgroundColor = MZ_cmpChasse.colorEmptyCell;
				}
			}
			if (show1) {
				td = tr.insertCell();
				if (data.nb1) 
				{
					td.appendChild(document.createTextNode(data.nb1));
					totalKill1 += parseInt(data.nb1);
					totalMonstre1++;
				} else {
					td.style.backgroundColor = MZ_cmpChasse.colorEmptyCell;
				}
			}
			table.appendChild(tr);
		}
		// totaux
		tr = document.createElement('tr');
		tr.className = 'mh_tdtitre';
		th = tr.insertCell();
		th.appendChild(document.createTextNode('Nombre de types de monstre'));
		if (show0) {
			th = tr.insertCell();
			th.appendChild(document.createTextNode(totalMonstre0));
		}
		if (show1) {
			th = tr.insertCell();
			th.appendChild(document.createTextNode(totalMonstre1));
		}
		table.appendChild(tr);
		tr = document.createElement('tr');
		tr.className = 'mh_tdtitre';
		th = tr.insertCell();
		th.appendChild(document.createTextNode('Nombre de kills'));
		if (show0) {
			th = tr.insertCell();
			th.appendChild(document.createTextNode(totalKill0));
		}
		if (show1) {
			th = tr.insertCell();
			th.appendChild(document.createTextNode(totalKill1));
		}
		table.appendChild(tr);
		document.getElementById(MZ_cmpChasse.idResultDiv).appendChild(table);
	}

	static addErreur(msg) {
		let div = document.createElement('div');
		div.appendChild(document.createTextNode(msg));
		div.style.color = 'red';
		document.getElementById(MZ_cmpChasse.idResultDiv).appendChild(div);
	}

	static getNumTroll() {
		// priorité : tentative de récupération dans la page elle même (en mode spmartphone)
		let eID = document.getElementById('id');
		let idTroll;
		if (eID) idTroll = parseInt(eID.getAttribute('data-id'));
		if (idTroll && !isNaN(idTroll)) return idTroll;
		if (!window.top || !window.top.Sommaire) return;
		let frameMenu = window.top.Sommaire.document;
		eID = frameMenu.getElementById('id');
		if (eID) idTroll = parseInt(eID.getAttribute('data-id'));
		if (idTroll && !isNaN(idTroll)) return idTroll;
		// ancienne méthode, analyse du javascript onclick="EnterPJView(91305,750,550)"
		let tabA = frameMenu.getElementsByTagName('a');
		if (tabA.length == 0 || tabA[0].onclick === undefined) return;
		let s = tabA[0].onclick.toString();
		let m = s.match(/\((\d+) *,/);
		if (!m || m.length < 1) return;
		idTroll = parseInt(m[1]);
		if (idTroll && !isNaN(idTroll)) return idTroll;
		}

	static clearResult() {
		let e = document.getElementById(MZ_cmpChasse.idResultDiv);
		while (e.lastChild) e.removeChild(e.lastChild);
	}
}

MZ_cmpChasse.init();
