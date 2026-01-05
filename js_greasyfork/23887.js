// ==UserScript==
// @name Trajet des gowap MkII
// @namespace http://feldspath.free.fr/
// @include */mountyhall/MH_Play/Play_e_follo.php*
// @include */mountyhall/MH_Play/Play_a_Action.php*
// @include */mountyhall/MH_Play/Play_a_ActionResult.php*
// @include */mountyhall/MH_Play/Play_vue.php*
// @include */mountyhall/MH_Lieux/Lieu_Description.php*
// @version 2.49
// @description Trajet des gowaps
// @grant GM_getValue
// @grant GM_setValue
// @injectframes 1
// @downloadURL https://update.greasyfork.org/scripts/23887/Trajet%20des%20gowap%20MkII.user.js
// @updateURL https://update.greasyfork.org/scripts/23887/Trajet%20des%20gowap%20MkII.meta.js
// ==/UserScript==

// À faire
//	tenir compte de la profondeur pour la détection des collisions gowap-trou (voir calc_inter())
//	réécrire en mode objet

//let MY_DEBUG = true;

'use strict';

try { // ajout par Vapulabehemot (82169) le 30/08/2013
	let aj_noeud = false, t_enreg, t_prev, point_surligne, nbs, xcase, ycase, liste_etapes, suppr_surligne, suivants;
	let ligne_h = new Array(), ligne_v = new Array(), ligne_d = new Array(), distances = new Array();
	let noeud_courant = 0;
	let choix_ini = false;
	let ie = (window.attachEvent)? true:false;
	if("function" != typeof isPage)
		var isPage = function(url) {
			return window.location.pathname.indexOf("/mountyhall/"+url) == 0;
		}
	if("function" != typeof isPageWithParam) {
		var isPageWithParam = function(filters) {
			if (filters.url && window.location.pathname.indexOf(`/mountyhall/${filters.url}`) != 0) return false;
			if (filters.body_id && document.body.id != filters.body_id) return false;
			if (filters.params) {
				let paramsGET = new URLSearchParams(window.location.search);
				for (let param in filters.params) 
					if (paramsGET.get(param) != filters.params[param]) return false;
			}
			if (filters.ids)
				for (let id of filters.ids)
					if (!document.getElementById(id)) return false
			if (filters.names)
				for (let name of filters.names)
					if (document.getElementsByName(name).length == 0) return false
			return true;
		}
	}
	if("function" != typeof MY_getValue) {
		//if(typeof localStorage == "object") { 
		if(typeof window.localStorage == "object") { // correction par Vapulabehemot (82169) le 14/01/2015
			function MY_getValue(nom) {
				//return localStorage.getItem(nom);
				return window.localStorage.getItem(nom); // correction par Vapulabehemot (82169) le 14/01/2015
			}
			function MY_setValue(nom,valeur) {
				//localStorage.setItem(nom,valeur);
				window.localStorage.setItem(nom,valeur); // correction par Vapulabehemot (82169) le 14/01/2015
			}
			//if(window.localStorage.getItem("favori_gow") === null && "function" == typeof GM_getValue && GM_getValue("favori_gow")) window.localStorage.setItem("favori_gow", GM_getValue("favori_gow"));
			if(window.localStorage.getItem("favori_gow") === null && "function" == typeof GM_getValue && GM_getValue("favori_gow")) window.localStorage.setItem("favori_gow", GM_getValue("favori_gow")); // correction par Vapulabehemot (82169) le 14/01/2015
		}
		else if("function" == typeof GM_getValue) {
			function MY_getValue(nom) {
				return GM_getValue(nom);
			}
			function MY_setValue(nom,valeur) {
				GM_setValue(nom,valeur);
			}
		}
		else if("function" == typeof PRO_getValue) {
			function MY_getValue(nom) {
				return PRO_getValue(nom);
			}
			function MY_setValue(nom,valeur) {
				PRO_setValue(nom,valeur);
			}
		}
		else {
			function MY_getValue(nom) {
				let dc = document.cookie;
				let prefix = nom + "=";
				let begin = dc.indexOf("; " + prefix);
				if (begin == -1) {
					begin = dc.indexOf(prefix);
					if (begin != 0) return "";
				}
				else
					begin += 2;
				let end = document.cookie.indexOf(";", begin);
				if (end == -1)
					end = dc.length;
				return unescape(dc.substring(begin + prefix.length, end));
			}
			function MY_setValue(nom,valeur) {
				let expdate = new Date ();
				expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000 * 31));
				let curCookie = nom + "=" + escape(valeur) + "; expires="+expdate.toGMTString();
				document.cookie = curCookie;
			}
		}
	}
	if ("function" != typeof addEvent) {
		if (ie) {
			function addEvent(obj, typ, fn, sens) {
				obj["e"+typ+fn] = fn; obj[typ+fn] = function() {
					obj["e"+typ+fn]( window.event );
				}
				obj.attachEvent("on"+typ, obj[typ+fn] );
			}
		}
		else  {
			function addEvent(obj, typ, fn, sens) {
				obj.addEventListener(typ, fn, sens);
			}
		}
	}

	let lien = window.self.location.toString();
	let MZ_fo_ordres = isPageWithParam({url: 'MH_Play/Play_a_Action', ids:['t_fo_ordre']});
	let MZ_fo_profil = isPageWithParam({url: 'MH_Play/Play_a_Action', ids:['t_fo_profil']});
	let MZ_fo_newordre = isPageWithParam({url: 'MH_Play/Play_a_Action', names:['gus_ordre', 'type', 'id_target']});
	//console.log('trajet MZ_fo_newordre=' + MZ_fo_newordre);
	let page = "";
	if(MZ_fo_ordres) {
		page = "trajet";
	}
	else if(lien.indexOf("/mountyhall/MH_Play/Play_e_follo.php") != -1) {
		page = "suivants";
	}
	else if(MZ_fo_profil) {
		page = "profil_gow";
	}
	else if((lien.indexOf("/mountyhall/MH_Play/Play_a_Action.php") != -1) 
		&& (lien.indexOf("id=-3") != -1) 
		&& (window.document.getElementsByTagName("body")[0].innerHTML.indexOf("Portail de T") != -1)) {
		window.console.log('trajet lieu_tp');
		let sortie = null;
		let page = "lieu_tp";
	}
	else if(MZ_fo_newordre) {
		page = "action_ordre";
	}
	else if(lien.indexOf("/mountyhall/MH_Play/Play_vue.php") != -1) {
	// else if(true) {
		function aj_fav_gow() {
			let pt, x2, y2, n2;
			pt = this.parentNode.parentNode.childNodes[3].innerHTML.split("_");
			x2 = parseInt(pt[2]);
			y2 = parseInt(pt[3]);
			n2 = parseInt(pt[4]);
			let maintenant = new Date();
			if(!MY_getValue("favori_gow")) {
				MY_setValue("favori_gow", "vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+x2+"/"+y2+"/"+n2+"/");
			}
			else {
				let texte = MY_getValue("favori_gow");
				let param = texte.split("/");
				let nb_fav = Math.floor(param.length/4);
				if (param.length > 3) {
					for (let i=0; i<nb_fav; i++) {
						if(parseInt(param[4*i+1]) == x2 && parseInt(param[4*i+2]) == y2 && parseInt(param[4*i+3]) == n2) return;
					}
				}
				MY_setValue("favori_gow", texte+"vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+x2+"/"+y2+"/"+n2+"/");
			}
			document.getElementById("action_lieu").style.display = "none";
		}
		if(!document.getElementById("action_lieu")) {
			let tableau_tete = new Array();
			tableau_tete[1] = document.getElementById('VueMONSTRE');
			tableau_tete[2] = document.getElementById('VueTROLL');
			tableau_tete[3] = document.getElementById('VueTRESOR');
			tableau_tete[4] = document.getElementById('VueCHAMPIGNON');
			tableau_tete[5] = document.getElementById('VueLIEU');
			tableau_tete[6] = document.getElementById('VueCADAVRE');
			function prepare_click(num) {
				if(!tableau_tete[num]) return;
				if ( !tableau_tete[num].getElementsByTagName("tbody")[0] ) return; // ajout par Vapulabehemot (82169) le 10/07/2015
				let tableau = tableau_tete[num].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
				let nb = tableau.length;
				//console.log('trajet canvas ajout tête ' + tableau_tete[num].id + ', nb=' + nb);
				if(nb > 0) { // correction par Vapulabehemot (82169) le 10/07/2015
					for (let i = 0; i < nb; i++) { // correction par Vapulabehemot (82169) le 10/07/2015
						addEvent(tableau[i].childNodes[0], "click", function(event) { affiche_action(this, event); }, true); // correction par Vapulabehemot (82169) le 30/08/2013
						tableau[i].childNodes[0].style.cursor = "pointer"; // correction par Vapulabehemot (82169) le 30/08/2013
						tableau[i].childNodes[0].id = num+"_"+i+"_"; // correction par Vapulabehemot (82169) le 30/08/2013
					}
				}
			}
			function affiche_action(cible, evt) {
				let ligne = cible.parentNode;
				let nb = ligne.childNodes.length;
				let ref = cible.id+ligne.childNodes[nb-3].innerHTML+"_"+ligne.childNodes[nb-2].innerHTML+"_"+ligne.childNodes[nb-1].innerHTML;
				let cadre = document.getElementById("action_lieu");
				//console.log('trajet canvas affiche_action cadre display=' + cadre.style.display + ', contenu action_coord=' + document.getElementById("action_coord").innerHTML);
				if (cadre.style.display == "none" || document.getElementById("action_coord").innerHTML != ref) {
					document.getElementById("action_coord").innerHTML = ref;
					cadre.style.display = "block";
					cadre.style.left = evt.clientX + 'px';
					cadre.style.top = (evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) - 20) + 'px';
					//console.log('trajet canvas affiche_action cadre evt:' + evt.clientX + ', ' + evt.clientY + ', cadre:' + cadre.style.left + ', ' + cadre.style.top);
				}
				else {
					cadre.style.display = "none";
				}
			}
			let nvdiv = document.createElement("div");
			nvdiv.id = "action_lieu";
			nvdiv.className = "mh_tdtitre";
			nvdiv.style.display = "none";
			nvdiv.style.position = "absolute";
			nvdiv.style.padding = "1px";
			nvdiv.style.border = "1px solid";
			nvdiv.appendChild(document.createElement("span"));
			nvdiv.appendChild(document.createElement("span"));
			nvdiv.appendChild(document.createElement("span"));
			let nvsp = document.createElement("span");
			nvsp.id = "action_coord"
			nvsp.style.display = "none";
			nvdiv.appendChild(nvsp);
			document.body.appendChild(nvdiv);

			for(let i=1; i<7; i++) {
				prepare_click(i);
			}
		}
		let imag = document.createElement("img");
		imag.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFXAByVA0Lyqp4QnItCgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wcTCTMHIX+pMQAAAC9JREFUCNdjYACBUAaGwFWuDGGrpjJIZqYwSGUuYZBaBcShSxjYVk0AY8ZVDiB1AP9ZC3P9zCaoAAAAAElFTkSuQmCC";
		imag.style.cursor = "pointer";
		imag.id = "avec_gowap";
		imag.title = "Ajouter une destination gowap";
		addEvent(imag, "click", aj_fav_gow, true);
		document.getElementById("action_lieu").childNodes[2].appendChild(imag);
	}
	else if(lien.indexOf("/mountyhall/MH_Play/Play_vue") != -1) {
		// trajet_canvas ne fonctionne qu'avec MZ pour ce qui est de l'outil de copie de coord
		class TRAJCANVAS_bloc {
			static instances = [];
			static eltImag;

			static doViewCallback() {
				TRAJCANVAS_bloc.eltImag = document.createElement("img");
				TRAJCANVAS_bloc.eltImag.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFXAByVA0Lyqp4QnItCgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wcTCTMHIX+pMQAAAC9JREFUCNdjYACBUAaGwFWuDGGrpjJIZqYwSGUuYZBaBcShSxjYVk0AY8ZVDiB1AP9ZC3P9zCaoAAAAAElFTkSuQmCC";
				TRAJCANVAS_bloc.eltImag.style.cursor = 'pointer';
				TRAJCANVAS_bloc.eltImag.style.position = 'absolute';
				TRAJCANVAS_bloc.eltImag.style.top = '2px';
				TRAJCANVAS_bloc.eltImag.style.left = '2px';
				TRAJCANVAS_bloc.eltImag.style.display = 'none';
				TRAJCANVAS_bloc.eltImag.title = 'Ajouter une destination gowap (trajet canvas)';
				addEvent(TRAJCANVAS_bloc.eltImag, 'click', TRAJCANVAS_bloc.ajoutFavori, true);

				for (let oBloc of [
				MZ_cVueJSON.oMonstres,
				MZ_cVueJSON.oTrolls,
				MZ_cVueJSON.oTresors,
				MZ_cVueJSON.oChampignons,
				MZ_cVueJSON.oLieux,
				MZ_cVueJSON.oCenotaphes,
				]) {
					TRAJCANVAS_bloc.instances.push(new TRAJCANVAS_bloc(oBloc));
				}
				//console.log(`TRAJCANVAS_bloc.doViewCallback`);
			}

			static showTete() {
				//console.log(`TRAJCANVAS_bloc.showTete début`);
				TRAJCANVAS_bloc.eltImag.style.display = 'block';
				this.appendChild(TRAJCANVAS_bloc.eltImag);
				//console.log(`TRAJCANVAS_bloc.showTete fin`);
			}

			static hideTete() {
				TRAJCANVAS_bloc.eltImag.style.display = 'none';
			}

			static ajoutFavori() {
				let pos = this.parentNode.getAttribute('data-trajcanv-xyn');
				console.log(`TRAJCANVAS_bloc.ajoutFavori`, pos);
				pos = pos.split(';');
				let maintenant = new Date();
				let prevDest = MY_getValue("favori_gow");
				let done = false;
				if(!prevDest) {
					MY_setValue("favori_gow", "vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+pos[0]+"/"+pos[1]+"/"+pos[2]+"/");
					done = true;
				} else {
					let param = prevDest.split("/");
					let nb_fav = Math.floor(param.length/4);
					if (param.length > 3) {
						done = true;
						for (let i=0; i<nb_fav; i++) {
							if(parseInt(param[4*i+1]) == pos[0] && parseInt(param[4*i+2]) == pos[1] && parseInt(param[4*i+3]) == pos[2]) {
								done = false;
								break;
							}
						}
					}
					if (done) MY_setValue("favori_gow", prevDest+"vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+pos[0]+"/"+pos[1]+"/"+pos[2]+"/");
				}
				let eltMsg = document.createElement('div');
				let msg;
				if (done) msg = 'La loc ' + pos.join('|') + ' a été ajoutée aux destinations favorites';
				else msg = 'La loc ' + pos.join('|') + " n'a pas été ajoutée car elle existe déjà";
				eltMsg.appendChild(document.createTextNode(msg));
				eltMsg.style.position = 'absolute';
				eltMsg.style.top = '30px';
				eltMsg.style.left = '-1px';
				eltMsg.style.padding = '3px';
				eltMsg.style.backgroundColor  = done ? 'blue' : 'red';
				eltMsg.style.color = 'white';
				eltMsg.style.zIndex = '1000';
				eltMsg.style.opacity = 1;
				this.parentNode.appendChild(eltMsg);
				setTimeout(function() {
					eltMsg.parentNode.removeChild(eltMsg);
				}, 5000);
			}

			//-- fin zone static
			oBlocMZ;
			constructor(oBlocMZ) {
				if (!oBlocMZ) return;
				if (!oBlocMZ.objets) return;	// cas OUKISONT, par exemple
				this.oBlocMZ = oBlocMZ;
				for (let oLigne of oBlocMZ.objets) {
					oLigne.loadXYN();
					if (!oLigne.x) continue;
					oLigne.eltTdDist.setAttribute('data-trajcanv-xyn', oLigne.x + ';' + oLigne.y + ';' + oLigne.n);
					oLigne.eltTdDist.style.position = 'relative';
					addEvent(oLigne.eltTdDist, "mouseenter", TRAJCANVAS_bloc.showTete);
					addEvent(oLigne.eltTdDist, "mouseleave", TRAJCANVAS_bloc.hideTete);
				}
				//console.log(`TRAJCANVAS_bloc.constructor ${oBlocMZ.nomBase}`);
			}
		}
		MZ_cVueJSON.registerCallback(TRAJCANVAS_bloc.doViewCallback);
	}
	//console.log(`trajet_canvas page=${page}`);
	if(page) {
		function aj_opt(ref,desc,val) {
			let nvspan = aligne();
			let choix = document.createElement("input");
			choix.id = ref;
			choix.type = "checkbox";
			choix.checked = val;
			choix.title = desc;
			choix.setAttribute('data-role', 'none');
			let etik = document.createElement("label");
			etik.appendChild(document.createTextNode(desc));
			etik.htmlFor = ref;
			nvspan.appendChild(choix);
			nvspan.appendChild(etik);
			return nvspan;
		}
		function bloc(ref) {
			let nvdiv = document.createElement("div");
			nvdiv.id = ref;
			return nvdiv;
		}
		function enligne(ref) {
			let nvspan = document.createElement("span");
			nvspan.id = ref;
			return nvspan;
		}
		function aligne() {
			let nspan = document.createElement("span");
			nspan.className = "aligne";
			return nspan;
		}
		function aj_entree(ref,val) {
			let entree = document.createElement("input");
			entree.id = ref;
			entree.name = ref;
			entree.className = "TextboxV2";
			entree.size = "5";
			entree.value = val;
			addEvent(entree, "keyup", modifier_coord, true);
			addEvent(entree, "change", modifier_coord, true);
			addEvent(entree, "click", action_trajet, true);
			return entree;
		}
		function get_opt(ref) {
			let val = document.getElementById(ref).value;
			if(!val) {
				val = 0;
			}
			else {
				val = (isNaN(val))? 0:parseInt(val);
			}
			return val;
		}
		function set_opt(ref,val) {
			document.getElementById(ref).value = val;
		}
		function inserer_tableau(tablo,rg,elt) {
			tablo.splice(rg, 0, elt);
		}
		function effacer_tableau(tablo,rg) {
			tablo.splice(rg,1);
		}
		function creer_canvas(ref) {
			let dessin = document.createElement("canvas");
			dessin.id = ref;
			return dessin;
		}
		function creer_icone(lx, ly, desc, clique) {
			let dessin = document.createElement("canvas");
			dessin.width = lx;
			dessin.height = ly;
			dessin.className = "a_cliquer";
			dessin.title = desc;
			addEvent(dessin, "click", clique, true);
			return dessin;
		}
		function dessine_svg(trace, chemin) {
			for(let i in chemin) {
				if(chemin[i][0] == 0) {
					trace.moveTo(chemin[i][1], chemin[i][2]);
				}
				else if(chemin[i][0] == 1) {
					trace.lineTo(chemin[i][1], chemin[i][2]);
				}
				else if(chemin[i][0] == 2) {
					trace.bezierCurveTo(chemin[i][1],chemin[i][2], chemin[i][3],chemin[i][4], chemin[i][5],chemin[i][6]);
				}
				else if(chemin[i][0] == 3) {
					trace.arc(chemin[i][1], chemin[i][2], chemin[i][3], 0, Math.PI*2,  true);
				}
			}
		}
		function creer_glissiere(ref, val) {
			let div_gliss = bloc("choix_zoom_"+ref);
			div_gliss.appendChild(document.createTextNode("Zoom : "));
			div_gliss.className = "choix_zoom";
			let dessin = creer_canvas("glissiere_"+ref);
			dessin.width = 104;
			dessin.height = 12;
			addEvent(dessin, "mousedown", ini_glisse, true);
			addEvent(dessin, "mousemove", sur_curseur, true);
			if (ref != 'fav') { // ajout par Vapulabehemot (82169) le 10/07/2015
				addEvent(dessin, "mouseup", drop, true); // ajout par Vapulabehemot (82169) le 10/07/2015
				addEvent(dessin, "mousemove", glisse, true); // ajout par Vapulabehemot (82169) le 10/07/2015
			} // ajout par Vapulabehemot (82169) le 10/07/2015
			addEvent(dessin, "mouseout", function() { haut.getElementById("bulle_zoom").style.visibility="hidden" }, true);
			addEvent(dessin, "mouseover", function() { haut.getElementById("bulle_zoom").style.visibility="visible" }, true);
			div_gliss.appendChild(dessin);
			div_gliss.appendChild(enligne("val_zoom_"+ref));
			div_gliss.lastChild.innerHTML = val+"%";

			creer_bulle_zoom();

			return div_gliss;
		}
		function dessine_glissiere(ref, val) {
			let dessin = haut.getElementById("glissiere_"+ref);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.clearRect(0, 0,104, 12);
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.fillRect(0,0,2,12);
				ctx.fillRect(102,0,2,12);
				ctx.fillRect(0,5,104,2);

				ctx.fillStyle = "rgb(80,80,80)";
				ctx.fillRect(val,0,5,12);
				ctx.fillStyle = "rgb(200,200,200)";
				ctx.fillRect(val+1,1,3,10);
			}
		}
		function coord_x(val) {
			return decalh+TC_coeff*(val+100);
		}
		function coord_y(val) {
			return decalv+TC_coeff*(100-val);
		}
		function creer_bulle_trajet() {
			if(haut.getElementById("bulle_trajet")) {
				bulle = haut.getElementById("bulle_trajet");
				return;
			}
			haut.body.appendChild(bloc("bulle_trajet"));
			bulle = haut.getElementById("bulle_trajet");
			bulle.className = "mh_tdtitre";
			let nvdiv = bloc("mobile_bulleVue");
			nvdiv.className = "bulle_haut_gow";
			nvdiv.appendChild(enligne("bulle_haut_gow"));
			bulle.appendChild(nvdiv);
			bulle.appendChild(bloc("bulle_desc_gow"));
			bulle.lastChild.className = "mh_tdpage";
		}

		function declare_css() {
			if(haut.getElementById("css_gow")) return;
			let css = "#carte_trajet { position: relative; text-align: left; }\ndiv#carte_gowap, #MZ_carte_cartegogo { display: none; }\ndiv.mh_tdpage#cadre_liste, div.mh_tdpage#bulle_desc_gow  { display: block !important; }\n#trou, #trajet, #surligne, #danger, #cadre_liste {\n	position: absolute;\n	top: 0px;\n	left: 0px;\n}\n#cadre_liste {\n	padding: 10px 20px 5px 10px;\n}\n.etape {\n	width: 100%;\n	border: 1px solid #000;\n	padding: 1px 5px 1px 5px;\n	margin: -1px 0px 0px 0px;\n}\nlabel {\n	cursor: pointer;\n}\n.etape_surlignee {\n	width: 100%;\n	border : 2px solid #ff2222;\n	padding: 1px 5px 0px 5px;\n	margin: -2px -1px -1px -1px;\n}\n.etape canvas, .etape_surlignee canvas {\n	position: relative; float: right;\n	margin-left:10px; margin-right: -3px; margin-top : 2px;\n}\n.a_cliquer  {\n	cursor: pointer;\n}\n#aj_noeud { cursor : pointer; }\n#trou_fav, #trace_fav { position: absolute; top: 20px; left: 0px; }\n.choix_zoom { position: relative; margin-left:30px; margin-top:3px; }\n#glissiere_gow, #glissiere_fav { position: relative; }\n\n#bulle_trajet { \n	visibility:hidden;\n	position:absolute; z-index:3100;\n	width:400px;\n	border-width:1px; border-style:solid; border-color:#a1927f;\n}\n#mobile_bulleVue { cursor:move; }\n.bulle_haut  { font-weight:bold; text-align:left; padding:2px; }\n#bulle_desc_gow { font-size:11px; padding:2px; white-space: nowrap;}\n\n#gestion_fav_gow { position:absolute; padding: 1px; border-with:1px; border-style:solid; min-width:300px; z-index:3000; }\n#titre_gow, .fav, .fav_dessus { min-height:15px; }\n.fav  { margin:0; margin:0 0 -1px 0; padding: 1px 1px 1px 1px; border : 1px solid #a1927f; }\n.fav_dessus { margin:-1px; margin:-1px -1px -2px -1px; padding: 0px 1px 0px 1px; border : 2px solid #a1927f; }\n#gestion_fav_gow .a_cliquer { position: relative; float: right; margin-left: 2px; }\n#gestion_fav_gow { display: block !important; }\n#cadre_fav { position: relative; }\n#bulle_zoom { display:block !important; visibility: hidden; position: absolute; z-index: 3500;  border : 1px solid  #a1927f; }";

			let node = document.createElement("style");
			node.type = "text/css";
			node.id = "css_gow";
			node.appendChild(document.createTextNode(css));
			haut.getElementsByTagName("head")[0].appendChild(node);
		}
		function bouton(ref,desc) {
			let entree = document.createElement("input");
			entree.type = "button"
			entree.id = ref;
			entree.value = desc;
			entree.className = "mh_form_submit";
			return entree;
		}
		function trim(str) {
			return str.replace(/(^\s*)|(\s*$)/g,"");
		}

		////////////////////////////////////////////////////////////
		function charge_trajet() {
			//window.console.trace();
			let data_gowap = MY_getValue("TRAJET_"+num_gow);
			if(!data_gowap) {
				//console.log('trajet_canvas pas de trajet pour suivant ' + num_gow);
				return;
			}
			let param = data_gowap.split("/");
			//window.console.log('charge_trajet TRAJET_' + num_gow + '=' + data_gowap + ', on va splitter sur /');
			if(param[0] != "zoom") {
				window.console.log('trajet_canvas pas zoom en début de trajet pour suivant ' + num_gow);
				return;
			}
			zoom = parseInt(param[1]);
			if (isNaN(zoom)) zoom = 100;
			TC_coeff = zoom/50.0; // ajout par Vapulabehemot (82169) le 10/07/2015
			//window.console.log('charge_trajet ' + num_gow + ' ' + param.join('/') + ', zoom=' + zoom + ', TC_coeff=' + TC_coeff);
			typ_gow = parseInt(param[3]);
			if (typ_gow == 2) typ_gow = 3;
			dla = parseInt(param[5]);
			let coord = param[7].split(",");
			etapes_ini = new Array();
			if(coord.length > 1) {
				nb_ini = Math.floor(coord.length/3);
				for(let i = 0; i<nb_ini; i++) {
					etapes_ini.push([parseInt(coord[3*i]), parseInt(coord[3*i+1]), parseInt(coord[3*i+2]), coord[3*i].match(/^\d+e$/g) !== null]);
				}
			}
			etapes = new Array();
			coord = param[9].split(",");
			if(coord.length > 1) {
				let nb_coord = Math.floor(coord.length/3);
				for(let i = 0; i<nb_coord; i++) {
					etapes.push([parseInt(coord[3*i]), parseInt(coord[3*i+1]), parseInt(coord[3*i+2])]);
				}
			}
			else {
				choix_ini = true;
			}
			if(param.length > 10) {
				param = param[11].split(",");
				if(param.length > 1) {
					let nb_a = Math.floor(param.length/2);
					for(let i=0; i<nb_a; i++) {
						arret.push([parseInt(param[2*i]), parseInt(param[2*i+1])]);
					}
				}
				else {
					arret = [[-1, parseInt(param[0])]];
				}
			}
			else {
				arret = [[-1, etapes.length]];
			}
			//if (num_gow == 5813233) window.console.log('trajet_canvas charge_trajet pour suivant ' + num_gow + '\netapes_ini=' + JSON.stringify(etapes_ini) + '\netapes=' + JSON.stringify(etapes) + '\narret=' + JSON.stringify(arret));
			//window.console.log('trajet_canvas charge_trajet fin dla=' + dla);
		}
		function sauve_trajet() {
			//window.console.trace();
			let param = "zoom/"+zoom+"/typ_gow/"+typ_gow+"/dla/"+dla+"/t_enreg/";
			for(let i = 0; i<etapes_ini.length; i++) {
				param += etapes_ini[i][0]+(etapes_ini[i][3]? "e":"")+","+etapes_ini[i][1]+","+etapes_ini[i][2]+",";
			}
			param += "/t_prev/";
			for(let i = 0; i<nb_ajout; i++) {
				if (!Array.isArray(etapes[i])) continue;
				param += etapes[i][0]+","+etapes[i][1]+","+etapes[i][2]+",";
			}
			param += "/arret/"
			for(let i in arret) {
				if (!Array.isArray(arret[i])) continue;
				param += arret[i][0]+","+arret[i][1]+",";
			}
			//window.console.log('sauve_trajet TRAJET_' + num_gow + ' ' + param);
			MY_setValue("TRAJET_"+num_gow,param);
		}
		function charge_opt_position() {
			if(MY_getValue("OPT_POSITION_GOWAP")) {
				let param = MY_getValue("OPT_POSITION_GOWAP").split("/");
				zoom = parseInt(param[1]);
				TC_coeff = zoom/50.0; // ajout par Vapulabehemot (82169) le 10/07/2015
				//window.console.log('charge_opt_position ' + param.join('/') + ', zoom=' + zoom + ', TC_coeff=' + TC_coeff);
				t_enreg = (param[3] == "1");
				t_prev = (param[5] == "1");
			}
		}
		function sauve_opt_position() {
			MY_setValue("OPT_POSITION_GOWAP","zoom/"+zoom+"/t_enreg/"+(t_enreg? 1:0)+"/t_prev/"+(t_prev? 1:0));
		}
		////////////////////////////////////////////////////////////
		function ini_canvas() {
			let trajet = bloc("carte_trajet");

			let dessin = creer_canvas("trou");
			dessin.className = "mh_tdpage";
			trajet.appendChild(dessin);
			trajet.appendChild(creer_canvas("trajet"));
			trajet.appendChild(creer_canvas("danger"));

			dessin = creer_canvas("surligne");
			addEvent(dessin, "click", action_trajet, true);
			addEvent(dessin, "mousedown", start_v, true);
			addEvent(dessin, "mousemove", afficher_position, true);
			addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
			addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
			trajet.appendChild(dessin);

			trajet.appendChild(creer_glissiere("gow", zoom));

			let cadre_liste = bloc("cadre_liste");
			cadre_liste.className = "mh_tdpage";
			//cadre_liste.style.display = 'none';
			cadre_liste.appendChild(bloc("liste_etapes"));

			cadre_liste.appendChild(document.createElement("br"));
			cadre_liste.appendChild(document.createTextNode("Type de gowap : "));
			let etik = ["Rapide", "Normal", "Lent"];
			let val = [6, 4, 3];
			let sel = document.createElement('select');
			sel.name = "selgow";
			sel.id = "selgow";
			for(let i=0; i<etik.length; i++) {
				let optio = document.createElement('option');
				optio.value = val[i];
				optio.appendChild(document.createTextNode(etik[i]));
				sel.appendChild(optio);
			}
			sel.value = typ_gow;
			addEvent(sel, "keyup", change_gow, true);
			addEvent(sel, "change", change_gow, true);
			cadre_liste.appendChild(sel);

			let nvdiv = bloc("ligne_fav");
			let choix = document.createElement("select");
			choix.id = "sel_fav";
			addEvent(choix, "mouseover", surligne_fav, true);
			addEvent(choix, "mouseout", efface_surligne, true);
			nvdiv.appendChild(choix);
			dessin = dessine_plus();
			addEvent(dessin, "click", inserer_fav, true);
			nvdiv.appendChild(dessin);
			dessin = dessin = creer_icone(21, 21, "Gérer les destinations favorites", ini_gestion);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(50,50,50)";
				ctx.fillStyle = "rgb(220,220,220)";
				ctx.lineWidth = "1";
				dessine_svg(ctx, data_svg["param"]);
				ctx.stroke();
				ctx.fill();
			}
			dessin.style.verticalAlign = "text-bottom";
			nvdiv.appendChild(dessin);
			cadre_liste.appendChild(nvdiv);

			cadre_liste.appendChild(bloc("inserer_etape"));

			let aj = bouton("aj_etape", "Ajouter une étape ");
			addEvent(aj, "click", alterne_ajout, true);
			cadre_liste.appendChild(aj);
			if(nb_ini > 0) {
				aj = bouton("raz_liste", "Initialiser");
				addEvent(aj, "click", raz, true);
				cadre_liste.appendChild(aj);
			}
			aj = bouton("eff_trajet", "Effacer tout");
			addEvent(aj, "click", efface_trajet, true);
			cadre_liste.appendChild(aj);

			trajet.appendChild(cadre_liste);

			let footer1 = document.getElementById('footer1');
			if (!footer1) footer1 = document.getElementById('footer');
			footer1.parentNode.insertBefore(trajet,footer1);
		}
		function inserer_fav() {
			let ref = parseInt(document.getElementById("sel_fav").value);
			if(ref == -2) return;
			etapes[nb_ajout] = (ref == -1)? soi:[favori[ref][1], favori[ref][2], favori[ref][3]];

			if(choix_ini) {
				liste_etapes.innerHTML =  "";
				choix_ini = false;
				liste_etapes.innerHTML =  "";
				liste_etapes.appendChild(aj_depart());
				choix_ini = false;
			}
			if(!document.getElementById("etape_"+nb_ajout)) {
				document.getElementById("liste_etapes").appendChild(aj_liste(nb_ajout,  etapes[nb_ajout]));
				if(nb_ajout > 0) {
					document.getElementById("etape_"+(nb_ajout-1)).insertBefore(aj_descendre(nb_ajout-1), document.getElementById("etape_"+(nb_ajout-1)).getElementsByTagName("br")[0]);
				}
			}
			nb_ajout++;
			sauve_trajet();
			prepare_inserer();
			trace_trajet_prev();
		}
		function surligne_fav() {
			if(page != "trajet") return;
			let val = parseInt(this.value);
			if(val == -2) return;
			let dessin = document.getElementById("surligne");
			dessin.width = 200*TC_coeff+2*decalh;
			dessin.height = 200*TC_coeff+2*decalv;

			if(choix_ini) {
				let debut = depart
			}
			else {
				let debut = (nb_ajout > 0)? etapes[nb_ajout-1]:depart
			}
			trace_trajet(couleur_surligne, "surligne", debut, [(val == -1)? soi:[favori[val][1], favori[val][2], favori[val][3]]], true);
		}
		function change_gow() {
			typ_gow = this.value;
			calc_dist();
			sauve_trajet();
		}
		function alterne_ajout() {
			aj_noeud = !aj_noeud;
			if(aj_noeud) {
				document.getElementById("aj_etape").style.borderStyle = "inset";
				if(nb_ajout == 0) {
					etapes[nb_ajout] = depart;
				}
				else {
					etapes[nb_ajout] = etapes[nb_ajout-1];
				}
				if(choix_ini) {
					liste_etapes.innerHTML =  "";
					liste_etapes.appendChild(aj_depart());
					choix_ini = false;
				}
				if(!document.getElementById("etape_"+nb_ajout)) {
					document.getElementById("liste_etapes").appendChild(aj_liste( nb_ajout,  etapes[nb_ajout]));
					if(nb_ajout > 0) {
						document.getElementById("etape_"+(nb_ajout-1)).insertBefore(aj_descendre(nb_ajout-1), document.getElementById("etape_"+(nb_ajout-1)).getElementsByTagName("br")[0]);
					}
					prepare_inserer();
				}
			}
			else {
				document.getElementById("aj_etape").style.borderStyle = "outset";
				nb_ajout++;
				sauve_trajet();
				prepare_inserer();
				trace_trajet_prev();
			}
		}
		function trace_trou() {
			document.getElementById("carte_trajet").style.height = (200*TC_coeff+2*decalv+10)+"px";
			let dessin = document.getElementById("trou");
			dessin.width = 200*TC_coeff+2*decalh;
			dessin.height = 200*TC_coeff+2*decalv;
			if (dessin.getContext){
				let  ctx = dessin.getContext('2d');

				//repere
				ctx.beginPath();
				dessine_svg(ctx, [[0,100*TC_coeff+decalh, decalv], [1,100*TC_coeff+decalh, 200*TC_coeff+decalv], [0,decalh, 100*TC_coeff+decalv], [1,200*TC_coeff+decalh, 100*TC_coeff+decalv]]);
				ctx.stroke();
				ctx.strokeRect(decalh, decalv, TC_coeff*200, TC_coeff*200);

				//trous
				ctx.fillStyle = couleur_trou;
				for(let i in position_trous) {
					ctx.beginPath();
					ctx.arc(coord_x(position_trous[i][0]), coord_y(position_trous[i][1]), TC_coeff*position_trous[i][3], 0, Math.PI*2,  true);
					ctx.fill();
				}
			}
		}
		function trace_trou_fav() {
			let dessin = haut.getElementById("trou_fav");
			dessin.width = 200*TC_coeff+2*decalh;
			dessin.height = 200*TC_coeff+2*decalv;

			if (dessin.getContext){
				let ctx = dessin.getContext('2d');

				//repere
				ctx.beginPath();
				ctx.moveTo(100*TC_coeff+decalh, decalv);
				ctx.lineTo(100*TC_coeff+decalh, 200*TC_coeff+decalv);
				ctx.moveTo(decalh, 100*TC_coeff+decalv);
				ctx.lineTo(200*TC_coeff+decalh, 100*TC_coeff+decalv);
				ctx.stroke();
				ctx.strokeRect(decalh, decalv, TC_coeff*200, TC_coeff*200);

				//trous
				ctx.fillStyle = "rgb(200,0,0)";
				for(let i in position_trous) {
					ctx.beginPath();
					ctx.arc(coord_x(position_trous[i][0]), coord_y(position_trous[i][1]), TC_coeff*position_trous[i][3], 0, Math.PI*2,  true);
					ctx.fill();
				}
			}
		}
		function trace_position(pos) {
			let dessin = document.getElementById("trou");
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgba(0,0,0,0.6)";
				ctx.lineWidth = 2;
				ctx.beginPath();
				dessine_svg(ctx, [[3,coord_x(pos[0]), coord_y(pos[1]), 8],[0,coord_x(pos[0])-8, coord_y(pos[1])],[1,coord_x(pos[0])+8, coord_y(pos[1])],[0,coord_x(pos[0]), coord_y(pos[1])-8],[1,coord_x(pos[0]), coord_y(pos[1])+8]]);
				ctx.stroke();
			}
		}
		function trace_sortie(pos) {
			let dessin = document.getElementById("trou");
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgba(0,0,0,0.6)";
				ctx.lineWidth = 2;
				ctx.strokeRect(coord_x(pos[0]-2.5), coord_y(pos[1]+2.5), 5*TC_coeff, 5*TC_coeff)
				ctx.beginPath();
				dessine_svg(ctx, [[0,coord_x(pos[0]-2.5), coord_y(pos[1])], [1,coord_x(pos[0]-2.5)+5*TC_coeff, coord_y(pos[1])], [0,coord_x(pos[0]), coord_y(pos[1]+2.5)], [1,coord_x(pos[0]), coord_y(pos[1]+2.5)+5*TC_coeff]]);
				ctx.stroke();
			}
		}
		function trace_trajet_prev() {
			sauve_trajet();
			if(choix_ini) {
				let dessin = document.getElementById("trajet");
				dessin.width = 200*TC_coeff+2*decalh;
				dessin.height = 200*TC_coeff+2*decalv;
			}
			else {
				trace_trajet(couleur_prev, "trajet", depart, etapes, true);
			}
			calc_dist();
		}
		function trace_trajet(couleur, ou, ref, noeuds, refaire) {
			//console.trace(`trajet_canvas, trace_trajet_log couleur=${couleur}`);
			let dessin = document.getElementById(ou);
			let dx, dy, x_inter, y_inter;
			if(refaire) {
				dessin.width = 200*TC_coeff+2*decalh;
				dessin.height = 200*TC_coeff+2*decalv;
			}

			let pts = [[ref[0], ref[1]]];
			let nb_etape = noeuds.length;
			if(nb_etape == 0) return;
			for(let i=0; i< nb_etape; i++) {
				if (!noeuds[i]) {
					window.console.log('trace_trajet_log, noeuds vide pour i=' + i + ', noeuds=' + JSON.stringify(noeuds));
					return;	// Roule' 14/11/2018 protection
				}
				dx = noeuds[i][0] - ref[0];
				dy = noeuds[i][1] - ref[1];
				if(dx != 0 && dy != 0 && dx != dy) {
					if (Math.abs(dx) < Math.abs(dy)) {
						x_inter = noeuds[i][0];
						y_inter = (dy<0)? ref[1]-Math.abs(dx):ref[1]+Math.abs(dx);
					}
					else {
						x_inter = (dx>0)? ref[0]+Math.abs(dy):ref[0]-Math.abs(dy);
						y_inter = noeuds[i][1];
					}
					pts.push([x_inter, y_inter]);
				}
				pts.push([noeuds[i][0], noeuds[i][1]]);
				ref = noeuds[i];
			}
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.lineWidth = TC_coeff;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.strokeStyle = couleur;
				ctx.beginPath();
				let nb_pts = pts.length;
				ctx.moveTo(coord_x(pts[0][0]), coord_y(pts[0][1]));
				for (let i=1; i<nb_pts; i++) {
					ctx.lineTo(coord_x(pts[i][0]), coord_y(pts[i][1]));
				}
				ctx.stroke();
				ctx.fillStyle = couleur;
				for (let i=0; i<nb_etape; i++) {
					if(noeuds[i][3]) {
						ctx.fillRect(coord_x(noeuds[i][0])-TC_coeff, coord_y(noeuds[i][1])-TC_coeff, 2*TC_coeff, 2*TC_coeff);
					}
					else {
						ctx.beginPath();
						ctx.arc(coord_x(noeuds[i][0]), coord_y(noeuds[i][1]), TC_coeff, 0, Math.PI*2,  true);
						ctx.fill();
					}
				}
			}
		}
		function trace_fav() {
			TC_coeff = zoom_fav/50.0;
			place_fav();
			TC_coeff = zoom/50.0;
			retrace_fav = false;
		}
		function place_fav() {
			let dessin = haut.getElementById("trace_fav");
			dessin.width = 4*zoom_fav+2*decalh;
			dessin.height = 4*zoom_fav+2*decalv;

			if (nb_fav == 0) return;
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				let mini = favori[0][3], maxi = favori[0][3], couleur;
				for (let i=1; i<nb_fav; i++) {
					if(mini > favori[i][3]) mini = favori[i][3];
					if(maxi < favori[i][3]) maxi = favori[i][3];
				}
				let delta = maxi-mini;
				if(!delta) delta = 1;

				for (let i=0; i<nb_fav; i++) {
					let couleur = "rgb(50,"+(150-Math.round(100.0*(maxi-favori[i][3])/delta))+","+(50+Math.round(100.0*(maxi-favori[i][3])/delta))+")";
					console.log(`trajet_canvas place_fav point couleur=${couleur} maxi=${maxi} delta=${delta} favori[${i}]=${JSON.stringify(favori[i])}`);
					trace_point(ctx, coord_x(favori[i][1]), coord_y(favori[i][2]), couleur)
				}
				if(nv_pt !== null) {
					trace_point(ctx, coord_x(nv_pt[0]), coord_y(nv_pt[1]), "rgba(0,0,0,0.5)")
				}
			}
		}
		function trace_point(trace, xx, yy, couleur) {
			//console.log(`trajet_canvas trace_point_log couleur=${couleur}`);
			trace.strokeStyle = couleur;
			trace.fillStyle = couleur;
			trace.lineWidth = TC_coeff;
			trace.beginPath();
			trace.arc(xx, yy, TC_coeff, 0, Math.PI*2,  true);
			trace.fill();
			trace.beginPath();
			trace.arc(xx, yy, 3*TC_coeff, 0, Math.PI*2,  true);
			trace.stroke();
		}
		function trace_glissiere() {
			dessine_glissiere("gow", Math.min(99,Math.max(0,Math.round(zoom/2.0)-25)));
			if ( page == 'trajet' || page == 'lieu_tp' ) { // ajout par Vapulabehemot (82169) le 10/07/2015
				document.getElementById('choix_zoom_gow').style.top = '4px'; // ajout par Vapulabehemot (82169) le 10/07/2015
			} // ajout par Vapulabehemot (82169) le 10/07/2015
		}
		function trace_glissiere_fav() {
			dessine_glissiere("fav", Math.min(99,Math.max(0,Math.round(zoom_fav/2.0)-25)));
		}
		function ini_glisse(evt) {
			if(this.id == "glissiere_gow") {
				let xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
				zoom = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
				trace_glissiere();
				document.getElementById("val_zoom_gow").innerHTML = zoom+"%";
				TC_coeff = zoom/50.0;
				//window.console.log('ini_glisse, xpage=' + xpage + ', zoom=' + zoom + ', TC_coeff=' + TC_coeff);
				if(page == "trajet") {
					echelle_trajet();
					trace_trajet_prev();
					sauve_trajet();
				}
				else if(page == "suivants") {
					echelle_position();
					sauve_opt_position();
				}
				else {
					echelle_teleport();
				}
				glissable = true;
				this.style.cursor = "e-resize";
			}
			if(this.id == "glissiere_fav") {
				let xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
				zoom_fav = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
				MY_setValue("zoom_fav", zoom_fav)
				trace_glissiere_fav();
				haut.getElementById("val_zoom_fav").innerHTML = zoom_fav+"%";
				echelle_fav();
			}
		}
		function sur_curseur(evt) {
			let xpage, ypage, xpos, ypos, val;
			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}
			if(this.id == "glissiere_gow") {
				let curseur = Math.min(100,Math.max(0,Math.round(zoom/2.0)-25))+2;
				this.style.cursor = (xpage <= (curseur+2) && xpage >= (curseur-2)) ? "e-resize":"pointer";
				val = Math.min(250,Math.max(50,(xpage+23.0)*2.0))+"%";
			}
			else if(this.id == "glissiere_fav") {
				this.style.cursor = "pointer"; // ajout par Vapulabehemot (82169) le 10/07/2015
				val = Math.min(250,Math.max(50,(xpage+23.0)*2.0))+"%";
			}
			let bulle_zoom = haut.getElementById("bulle_zoom")
			bulle_zoom.style.top = (ypos+3)+'px';
			bulle_zoom.style.left = (xpos+16)+'px';
			bulle_zoom.style.visibility = "visible";
			bulle_zoom.innerHTML = val;
		}
		function glisse(evt) {
			if(glissable) {
				let xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
				zoom = Math.min(250,Math.max(50,(xpage+23.0)*2.0));

				trace_glissiere();
				document.getElementById("val_zoom_gow").innerHTML = zoom+"%";
				TC_coeff = zoom/50.0;
				//window.console.log('glisse, xpage=' + xpage + ',zoom=' + zoom + ', TC_coeff=' + TC_coeff);
				if(page == "trajet") {
					echelle_trajet();
					trace_trajet_prev();
					sauve_trajet();
				}
				else if(page == "suivants") {
					echelle_position();
					sauve_opt_position();
				}
				else {
					echelle_teleport();
				}
			}
		}
		function drop() {
			glissable = false;
			bougeable = false;
		}
		function action_trajet(evt) {
			if(aj_noeud) {
				aj_noeud = false;
				nb_ajout++;
				document.getElementById("aj_etape").style.borderStyle = "outset";
				sauve_trajet();
				prepare_inserer();
			}
		}
		function afficher_position(evt) {
			let xpage = 0, ypage = 0, xpos = 0, ypos = 0;
			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				// https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
				ypos = evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}

			xcase = Math.round((xpage-decalh)/TC_coeff-100.0);
			ycase = Math.round(100.0-(ypage-decalv)/TC_coeff);
			bulle.style.top = (ypos+8)+'px';
			bulle.style.left = (xpos+16)+'px';
			bulle.style.visibility = "visible";

			document.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
			let desc = document.getElementById("bulle_desc_gow");
			desc.innerHTML = "";
			for(let i in position_trous) {
				dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
				if(dist <= 0) {
					desc.appendChild(document.createTextNode(" Trous de Météorite : n=-1 -> n="+position_trous[i][4]));
					desc.appendChild(document.createElement("br"));
					break;
				}
			}

			document.getElementById("surligne").style.cursor = "";
			if(aj_noeud) {
				if(nb_ajout == 0) {
					etapes[nb_ajout] = [xcase, ycase, depart[2]];
				}
				else {
					etapes[nb_ajout] = [xcase, ycase, etapes[nb_ajout-1][2]];
				}
				deplace_noeud(nb_ajout, xcase, ycase);
				trace_trajet_prev();
			}
			else if(bougeable) {
				etapes[noeud_courant] = [xcase, ycase, etapes[noeud_courant][2]];
				deplace_noeud(noeud_courant, xcase, ycase);
				trace_trajet_prev();
			}
			else {
				document.getElementById("etape_depart").className = "etape";
				let nb_liste = choix_ini? nb_tt:nb_ajout;
				for (let i=0; i<nb_liste; i++) {
					document.getElementById("etape_"+i).className = "etape";
				}
				let sur_etape = false;
				if(choix_ini) {
					for (let i = nb_ini-1; i>=0; i--) {
						if(Math.round(xcase) == etapes_tt[i][0] && Math.round(ycase) == etapes_tt[i][1]) {
							desc.appendChild(document.createTextNode(pile_etape_ini(i)));
							desc.appendChild(document.createElement("br"));
							document.getElementById("surligne").style.cursor = "move";
							sur_etape = true;
							break;
						}
					}
				}
				else {
					for (let i = nb_ajout-1; i>=0; i--) {
						if(Math.round(xcase) == etapes[i][0] && Math.round(ycase) == etapes[i][1]) {

							desc.appendChild(document.createTextNode(pile_etape(i)));
							desc.appendChild(document.createElement("br"));
							document.getElementById("surligne").style.cursor = "move";
							sur_etape = true;
							break;
						}
					}
				}

				if(!sur_etape) {
					let etape_listee =  new Array();
					for(let i in ligne_v) {
						if(xcase == ligne_v[i][1] && ycase >= ligne_v[i][2] && ycase <= ligne_v[i][3] && !etape_listee[ligne_v[i][0]]) {
							desc.appendChild(document.createTextNode(transition_etape(ligne_v[i][0], xcase, ycase)));
							desc.appendChild(document.createElement("br"));
							etape_listee[ligne_v[i][0]] = true;
						}
					}
					for(let i in ligne_h) {
						if(ycase == ligne_h[i][3] && xcase >= ligne_h[i][1] && xcase <= ligne_h[i][2] && !etape_listee[ligne_h[i][0]]) {
							desc.appendChild(document.createTextNode(transition_etape(ligne_h[i][0], xcase, ycase)));
							desc.appendChild(document.createElement("br"));
							etape_listee[ligne_h[i][0]] = true;
						}
					}
					for(let i in ligne_d) {
						if(xcase >= ligne_d[i][2] && xcase <= ligne_d[i][3] && !etape_listee[ligne_d[i][0]]) {
							equation = ycase-ligne_d[i][1]*xcase-ligne_d[i][4];
							if(equation == 0) {
								desc.appendChild(document.createTextNode(transition_etape(ligne_d[i][0], xcase, ycase)));
								desc.appendChild(document.createElement("br"));
								etape_listee[ligne_d[i][0]] = true;
							}
						}
					}

				}
			}
		}
		function afficher_fav(evt) {
			let xpage = 0, ypage = 0, xpos = 0, ypos = 0, xs, ys;

			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}
			xcase = Math.round(50*(xpage-decalh)/zoom_fav-100.0);
			ycase = Math.round(100.0-50*(ypage-decalv)/zoom_fav);
			bulle.style.top = (ypos+3)+'px';
			bulle.style.left = (xpos+16)+'px';
			bulle.style.visibility = "visible";

			haut.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
			let desc = haut.getElementById("bulle_desc_gow");
			desc.innerHTML = "";
			for(let i in position_trous) {
				dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
				if(dist <= 0) {
					desc.appendChild(document.createTextNode(" Trous de Météorite : n=-1 -> n="+position_trous[i][4]));
					desc.appendChild(document.createElement("br"));
					break;
				}
			}

			for(let i=0; i<nb_fav; i++) {
				if(xcase == favori[i][1] && ycase == favori[i][2]) {
					haut.getElementById("fav_gow_"+i).className = "fav_dessus";
					desc.appendChild(document.createTextNode(protege_texte(favori[i][0]+" (n = "+favori[i][3]+")")));
					desc.appendChild(document.createElement("br"));
				}
				else {
					haut.getElementById("fav_gow_"+i).className = "fav";
				}
			}
		}
		function afficher_position_suivant(evt) {
			let xpage = 0, ypage = 0, xpos = 0, ypos = 0;

			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}

			//window.console.log('afficher_position_suivant, xpage=' + xpage + ', decalh=' + decalh + ', TC_coeff=' + TC_coeff);
			xcase = (xpage-decalh)/TC_coeff-100.0;
			ycase = 100.0-(ypage-decalv)/TC_coeff;
			bulle.style.top = (ypos+3)+'px';
			bulle.style.left = (xpos+16)+'px';
			bulle.style.visibility = 'visible';
			document.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
			let desc = document.getElementById("bulle_desc_gow");
			desc.innerHTML = "";
			for(let i in position_trous) {
				let dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
				if(dist <= 0) {
					desc.appendChild(document.createTextNode(" Trous de Météorite : n=-1 -> n="+position_trous[i][4]));
					desc.appendChild(document.createElement("br"));
					break;
				}
			}
			xcase = Math.round(xcase);
			ycase = Math.round(ycase);
			//console.log(`trajet_canvas afficher_position_suivant typeof suivants = ${typeof suivants}`);
			for (let [i, suivant] of suivants.entries()) {
				if (!Array.isArray(suivant)) {
					//console.log(`trajet_canvas afficher_position_suivant suivants[${i}] pas array`);
					continue;
				}
				if(Math.abs(suivant[2] - xcase) <= 4 && Math.abs(suivant[3] - ycase) <= 4 ) {
					desc.appendChild(document.createTextNode(suivant[1]+", x=" + suivant[2] + ", y=" + suivant[3] + ", n="+suivant[4]))
					desc.appendChild(document.createElement("br"));;
				}
			}
		}
		function afficher_teleport(evt) {
			let xpage = 0, ypage = 0, xpos = 0, ypos = 0;

			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}
			xcase = (xpage-decalh)/TC_coeff-100.0;
			ycase = 100.0-(ypage-decalv)/TC_coeff;
			bulle.style.top = (ypos+3)+'px';
			bulle.style.left = (xpos+16)+'px';
			bulle.style.visibility = 'visible';

			document.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
			let desc = document.getElementById("bulle_desc_gow");
			desc.innerHTML = "";
			for(let i in position_trous) {
				dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
				if(dist <= 0) {
					desc.appendChild(document.createTextNode(" Trous de Météorite : n=-1 -> n="+position_trous[i][4]));
					desc.appendChild(document.createElement("br"));
					break;
				}
			}
			xcase = Math.round(xcase);
			ycase = Math.round(ycase);
		}
		function modifier_coord() {
			a_modifier = this.id.split("_")[1];
			etapes[a_modifier] = [get_opt("etape_"+a_modifier+"_x"), get_opt("etape_"+a_modifier+"_y"), get_opt("etape_"+a_modifier+"_n")];
			if(aj_noeud) {
				aj_noeud = false;
				nb_ajout++;
				document.getElementById("aj_noeud").style.fontWeight = "normal";
			}
			trace_trajet_prev();
			if(point_surligne) {
				point_surligne = etapes[a_modifier];
				// Roule' 23/12/2018, la fonction surligne() n'existe pas, je ne sais pas ce que c'est supposé faire
				//surligne();
			}
		}
		function deplace_noeud(rg, xx, yy) {
			set_opt("etape_"+rg+"_x", xx);
			set_opt("etape_"+rg+"_y", yy);
		}
		function transition_etape(num, posx, posy) {
			texte = "";
			noeuds = choix_ini? etapes_tt:etapes;
			if(num == 0) {
				ref = depart;
				document.getElementById("etape_depart").className = "etape_surlignee";
			}
			else {
				ref = noeuds[num-1];
				document.getElementById("etape_"+(num-1)).className = "etape_surlignee";
			}
			dist = Math.max(Math.abs(posx-ref[0]), Math.abs(posy-ref[1]))
			n_inter = (noeuds[num][2] > ref[2])? Math.min(noeuds[num][2],ref[2]+dist):Math.max(noeuds[num][2],ref[2]-dist);
			texte += " -> Etape n°"+(num+1)+", distance : "+dist+" (total : "+(distances[num][0] + dist)+")";
			document.getElementById("bulle_haut_gow").innerHTML += ", n = "+ n_inter;
			document.getElementById("etape_"+num).className = "etape_surlignee";

			return texte;
		}
		function pile_etape(num) {
			document.getElementById("bulle_haut_gow").innerHTML += ", n = "+etapes[num][2];
			texte = "Etape n°"+(num+1)+", distance : "+(distances[num+1][0]-distances[num][0])+" (total : "+distances[num+1][0]+")";
			document.getElementById("etape_"+num).className = "etape_surlignee";

			return texte;
		}
		function pile_etape_ini(num) {
			document.getElementById("bulle_haut_gow").innerHTML += ", n = "+etapes_tt[num][2];
			texte = "Etape n°"+(num+1)+" ("+["Déplacement","Ebrouissage","Filature"][etapes_tt[num][3]]+"), distance : "+(distances[num+1][0]-distances[num][0])+" (total : "+distances[num+1][0]+")";
			document.getElementById("etape_"+num).className = "etape_surlignee";
			return texte;
		}
		function start_v(evt){
			let xpage, ypage, xpos, ypos;
			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}

			let xcase = Math.round((xpage-decalh)/TC_coeff-100.0);
			let ycase = Math.round(100.0-(ypage-decalv)/TC_coeff);

			for (let i = nb_ajout-1; i>=0; i--) {
				if(xcase == etapes[i][0] && ycase == etapes[i][1]) {
					bougeable = true;
					noeud_courant = i;
					break;
				}
			}
		}
		function cacher_bulle(etat) {
			bulle.style.visibility = etat? "hidden":"visible";
		}

		function lister_etapes() {
			liste_etapes = document.getElementById("liste_etapes");
			liste_etapes.innerHTML =  "";

			liste_etapes.appendChild(aj_depart());

			let noeuds, nb_liste;
			if(choix_ini) {
				noeuds = etapes_tt;
				nb_liste = nb_tt;
			}
			else {
				noeuds = etapes;
				nb_liste = nb_ajout;
			}

			for (let i=0 ; i<nb_liste; i++) {
				liste_etapes.appendChild(aj_liste(i, noeuds[i]));
			}
			prepare_inserer();
		}
		function aj_depart() {
			let nvdiv = bloc("depart");
			nvdiv.appendChild(document.createTextNode("Départ"));
			nvdiv.className = "etape";
			nvdiv.id = "etape_depart";
			nvdiv.appendChild(document.createElement("br"))
			nvdiv.appendChild(document.createTextNode("X = "+depart[0]+", Y =  "+depart[1]+", N = "+depart[2]));
			addEvent(nvdiv, "mouseover", surligne_point, true);
			addEvent(nvdiv, "mouseout", efface_surligne, true);
			return nvdiv;
		}
		function aj_liste(rg, pt) {
			let nvdiv = bloc("etape_"+rg);
			nvdiv.className = "etape";
			nvdiv.appendChild(document.createTextNode("Etape n°"+(rg+1)+(choix_ini? " ("+["Déplacement","Ebrouissage","Filature"][pt[3]]+")":"")));
			if(!choix_ini) {
				let dessin = creer_icone(12, 12, "Supprimer l'étape", effacer_noeud);
				dessin.id = "efface_"+rg
				if (dessin.getContext){
					let ctx = dessin.getContext('2d');
					ctx.lineCap = "round";
					ctx.lineWidth = 2;
					ctx.strokeStyle = "rgb(220,50,50)";
					dessine_svg(ctx, data_svg["suppr"]);
					ctx.stroke();
				}
				addEvent(dessin, "mouseover", surligne_suppr, true);
				addEvent(dessin, "mouseout", efface_surligne, true);
				nvdiv.appendChild(dessin);
			}
			if(cadrable) {
				let dessin = dessine_copie();
				addEvent(dessin, "click", copier_action, true);
				nvdiv.appendChild(dessin);
			}
			if(!choix_ini) {
				if(rg > 0) {
					nvdiv.appendChild(aj_monter(rg));
				}
				else {
					let dessin = document.createElement("canvas");
					dessin.width = 11;
					dessin.height = 12;
					nvdiv.appendChild(dessin);
				}

				if(rg < (nb_ajout-1)) {
					nvdiv.appendChild(aj_descendre(rg));
				}
			}

			nvdiv.appendChild(document.createElement("br"))
			nvdiv.appendChild(document.createTextNode("X = "));
			nvdiv.appendChild(aj_entree("etape_"+rg+"_x", pt[0]));
			nvdiv.appendChild(document.createTextNode(" Y = "));
			nvdiv.appendChild(aj_entree("etape_"+rg+"_y", pt[1]));
			nvdiv.appendChild(document.createTextNode(" N = "));
			nvdiv.appendChild(aj_entree("etape_"+rg+"_n", pt[2]));
			nvdiv.appendChild(aj_danger(rg));
			nvdiv.appendChild(document.createElement("br"));
			nvdiv.appendChild(enligne("dist_"+rg));
			addEvent(nvdiv, "mouseover", surligne_point, true);
			addEvent(nvdiv, "mouseout", efface_surligne, true);
			return nvdiv;
		}
		function copier_action() {
			let ref = parseInt(this.parentNode.id.split("_")[1]);
			copier_xxx(choix_ini? etapes_tt[ref]:etapes[ref]);
		}
		function copier_depart() {
			copier_xxx(depart);
		}
		function copier_xxx(xyn, doc) {
			if(!cadrable) return;
			let bas = doc ? doc : window.parent.frames[1].document;
			//console.log('copier_depart_log, id body frame1=' + bas.body.id);
			//if(bas.body.id != 'p_ajoutdunordre') return;
			let typ_ordre = quel_ordre(bas.forms[0]);
			if(typ_ordre != 1 && typ_ordre != 7) return;
			bas.getElementsByName('gus_x')[0].value = xyn[0];
			bas.getElementsByName('gus_y')[0].value = xyn[1];
			bas.getElementsByName('gus_n')[0].value = xyn[2];
		}
		function aj_monter(num) {
			let dessin = creer_icone(11, 12, "Monter", monter_etape);
			dessin.id = "monter_"+num;
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.fillStyle = "rgb(100,170,100)";
				dessine_svg(ctx, data_svg["monter"]);
				ctx.fill();
			}
			addEvent(dessin, "mouseover", surligne_monte, true);
			addEvent(dessin, "mouseout", efface_surligne, true);
			return dessin;
		}
		function aj_descendre(num) {
			let dessin = creer_icone(11, 12, "Descendre", descendre_etape);
			dessin.id = "descendre_"+num
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.fillStyle = "rgb(100,170,100)";
				dessine_svg(ctx, data_svg["descendre"]);
				ctx.fill();
			}
			addEvent(dessin, "mouseover",surligne_descend, true);
			addEvent(dessin, "mouseout", efface_surligne, true);
			return dessin;
		}
		function aj_danger(num) {
			let dessin = creer_canvas("danger_"+num);
			dessin.width = 19;
			dessin.height = 20;
			dessin.title = "Attention trous!";
			dessin.style.visibility = "hidden";
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.beginPath();
				ctx.strokeStyle = "rgb(170,60,60)";
				ctx.fillStyle = "rgb(255,255,255)";
				ctx.lineWidth = 2;
				ctx.lineJoin = "round";
				dessine_svg(ctx, [[0, 9,0], [1, 18,19], [1, 1,19], [1, 9,0]]);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.strokeStyle = "rgb(0,0,0)";
				ctx.lineCap = "round";
				ctx.moveTo(9,6);
				ctx.lineTo(9,12);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(9,16,1.5,0,Math.PI*2,true);
				ctx.fill();
			}
			return dessin;
		}
		function surligne_suppr() {
			ini_suppr();
			effacer_tableau(suppr_surligne, parseInt(this.id.split("_")[1]))
			trace_trajet(couleur_surligne, "surligne", depart, suppr_surligne, true);
		}
		function surligne_monte() {
			ini_suppr();
			let rg = parseInt(this.id.split("_")[1])
			let temp = suppr_surligne[rg];
			suppr_surligne[rg] = suppr_surligne[rg-1];
			suppr_surligne[rg-1] = temp;
			trace_trajet(couleur_surligne, "surligne", depart, suppr_surligne, true);
		}
		function surligne_descend() {
			ini_suppr();
			let rg = parseInt(this.id.split("_")[1])
			let temp = suppr_surligne[rg];
			suppr_surligne[rg] = suppr_surligne[rg+1];
			suppr_surligne[rg+1] = temp;
			trace_trajet(couleur_surligne, "surligne", depart, suppr_surligne, true);
		}
		function surligne_point() {
			let ref = this.id;
			let couleur = "rgba(0,0,0,0.8)";
			if(ref == "etape_depart") {
				point_surligne = depart;
			} else if (page == "suivants") {	// Roule 25/10/2019 pour surlignage position suivant
				point_surligne = [this.suivant[2], this.suivant[3], 0, 0];
				couleur = "rgba(0, 255, 0, 1)";
			} else {
				point_surligne = choix_ini? etapes_tt[parseInt(ref.split("_")[1])]:etapes[parseInt(ref.split("_")[1])];
			}
			let dessin = document.getElementById("surligne");
			dessin.width = 200*TC_coeff+2*decalh;
			dessin.height = 200*TC_coeff+2*decalv;
			dessin.style.display = '';	// default
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				if(point_surligne[3] == 1) {
					ctx.fillStyle = couleur;
					ctx.strokeStyle = couleur;
					ctx.lineWidth = TC_coeff;
					ctx.fillRect(coord_x(point_surligne[0])-TC_coeff, coord_y(point_surligne[1])-TC_coeff, 2*TC_coeff, 2*TC_coeff);
					ctx.strokeRect(coord_x(point_surligne[0])-3*TC_coeff, coord_y(point_surligne[1])-3*TC_coeff, 6*TC_coeff, 6*TC_coeff);
				}
				else {
					//window.console.log("surligne_point " + JSON.stringify(point_surligne));
					trace_point(ctx, coord_x(point_surligne[0]), coord_y(point_surligne[1]), couleur);
				}
			}
		}
		function surligne_trajet() {
			let val = parseInt(this.value);
			let trajet_surligne;
			if(parseInt(val) == 0) {
				trajet_surligne = [depart, etapes[0]];
			}
			else {
				trajet_surligne = [etapes[parseInt(val-1)], etapes[parseInt(val)]];
			}
			let dessin = document.getElementById("surligne");
			dessin.width = 200*TC_coeff+2*decalh;
			dessin.height = 200*TC_coeff+2*decalv;
			let milieu = [Math.floor((trajet_surligne[0][0]+trajet_surligne[1][0])/2), Math.floor((trajet_surligne[0][1]+trajet_surligne[1][1])/2), Math.floor((trajet_surligne[0][2]+trajet_surligne[1][2])/2), ]
			trace_trajet(couleur_surligne, "surligne", trajet_surligne[0], [milieu, trajet_surligne[1]], true);
		}
		function efface_surligne() {
			let dessin = document.getElementById("surligne");
			dessin.width = 200*TC_coeff+2*decalh;
			dessin.height = 200*TC_coeff+2*decalv;
			dessin.style.display = 'none';
		}
		function prepare_inserer() {
			let inserer = document.getElementById("inserer_etape");
			inserer.innerHTML = "";
			if(nb_ajout > 0) {
				let etik = ["Départ -> Etape n°1"];
				let val = [0];
				for (let i = 1; i<nb_ajout; i++) {
					etik.push("Etape n°"+i+" -> "+(i+1));
					val.push(i);
				}

				let entree=document.createElement('select');
				entree.name="sel_ins";
				entree.id="sel_ins";
				for(let i=0; i<etik.length; i++) {
					let optio=document.createElement('option');
					optio.value=val[i];
					optio.appendChild(document.createTextNode(etik[i]));
					addEvent(optio, "mouseover", surligne_trajet, true);
					addEvent(optio, "mouseout", efface_surligne, true);
					entree.appendChild(optio);
				}
				entree.value = 0;
				addEvent(entree, "mouseover", surligne_trajet, true);
				addEvent(entree, "mouseout", efface_surligne, true);
				inserer.appendChild(entree);

				let aj = bouton("ins", "Insérer une étape ");
				addEvent(aj, "click", inserer_milieu, true);
				inserer.appendChild(aj);
			}
		}
		function raz() {
			ini_tableau();
			nb_ajout = nb_ini;
			choix_ini = false;
			lister_etapes();
			trace_trajet_prev();
		}
		function efface_trajet() {
			etapes = new Array();
			nb_ajout = 0;
			choix_ini = true;
			lister_etapes();
			trace_trajet_prev();
		}
		function inserer_milieu() {
			let rang = get_opt("sel_ins");
			let ref = (rang == 0)? depart:etapes[rang-1];
			inserer_noeud(rang,[Math.floor((ref[0]+etapes[rang][0])/2.0), Math.floor((ref[1]+etapes[rang][1])/2.0), Math.floor((ref[2]+etapes[rang][2])/2.0)]);
		}
		function inserer_noeud(rg, val) {
			inserer_tableau(etapes, rg, val);
			nb_ajout++;
			lister_etapes();
			trace_trajet_prev();
		}
		function monter_etape() {
			let rg = parseInt(this.id.split("_")[1]);
			let temp = etapes[rg];
			etapes[rg] = etapes[rg-1]
			etapes[rg-1] = temp
			lister_etapes();
			trace_trajet_prev();
		}
		function descendre_etape() {
			let rg = parseInt(this.id.split("_")[1]);
			let temp = etapes[rg];
			etapes[rg] = etapes[rg+1]
			etapes[rg+1] = temp
			lister_etapes();
			trace_trajet_prev();
		}
		function effacer_noeud() {
			let rang = parseInt(this.id.split("_")[1]);
			effacer_tableau(etapes, rang);
			nb_ajout--;
			if(nb_ajout == 0) {
				choix_ini = true;
			}
			lister_etapes();
			trace_trajet_prev();
		}
		function calc_dist() {
			let ligne_h = new Array();
			let ligne_v = new Array();
			let ligne_d = new Array();
			let ref = depart;
			let dx, dy, dh, signe, x_inter, y_inter, d, nb_dla, danger, text_dist, noeuds;
			let distances = [[0, 0]];
			if(choix_ini) {
				noeuds = etapes_tt;
			}
			else {
				noeuds = etapes;
			}
			let dessin = document.getElementById("danger");
			dessin.width = 200*TC_coeff+2*decalh;
			dessin.height = 200*TC_coeff+2*decalv;

			let nb_etape = noeuds.length;
			for(let i=0; i<nb_etape; i++) {
				dx = noeuds[i][0] - ref[0];
				dy = noeuds[i][1] - ref[1];
				dh = Math.max(Math.abs(dx), Math.abs(dy));
				danger = false; chute = new Array();
				if(dx == 0) {
					ligne_v.push([i, ref[0], Math.min(noeuds[i][1], ref[1]), Math.max(noeuds[i][1], ref[1])]);
					danger = calc_inter(noeuds[i][0],Math.min(noeuds[i][1], ref[1]),0,1,dh);
				}
				else if(dy == 0) {
					ligne_h.push([i, Math.min(noeuds[i][0], ref[0]), Math.max(noeuds[i][0], ref[0]), ref[1]]);
					danger = calc_inter(Math.min(noeuds[i][0], ref[0]),noeuds[i][1],1,0,dh);
				}
				else if(dx == dy) {
					signe = (dx*dy > 0)? 1:-1;
					ligne_d.push([i, signe, Math.min(noeuds[i][0], ref[0]), Math.max(noeuds[i][0], ref[0]), ref[1]-signe*ref[0]]);
					if(dx < 0) {
						danger = calc_inter(noeuds[i][0],noeuds[i][1],1,signe,dh);
					}
					else {
						danger = calc_inter(ref[0],ref[1],1,signe,dh);
					}
				}
				else {
					if (Math.abs(dx) < Math.abs(dy)) {
						x_inter = noeuds[i][0];
						y_inter = (dy<0)? ref[1]-Math.abs(dx):ref[1]+Math.abs(dx);
						ligne_v.push([i, x_inter, Math.min(noeuds[i][1], y_inter), Math.max(noeuds[i][1], y_inter)]);
						danger = calc_inter(x_inter,Math.min(noeuds[i][1],y_inter),0,1,Math.abs(noeuds[i][1]-y_inter));
					}
					else {
						x_inter = (dx>0)? ref[0]+Math.abs(dy):ref[0]-Math.abs(dy);
						y_inter = noeuds[i][1];
						ligne_h.push([i, Math.min(noeuds[i][0], x_inter), Math.max(noeuds[i][0], x_inter), y_inter]);
						danger = calc_inter(Math.min(noeuds[i][0],x_inter),y_inter,1,0,Math.abs(noeuds[i][0]-x_inter));
					}
					signe = (dx*dy > 0)? 1:-1;
					ligne_d.push([i, signe, Math.min(x_inter, ref[0]), Math.max(x_inter, ref[0]), ref[1]-signe*ref[0]]);
					if(dx < 0) {
						danger = danger || calc_inter(x_inter,y_inter,1,signe,Math.abs(x_inter-ref[0]));
					}
					else {
						danger = danger || calc_inter(ref[0],ref[1],1,signe,Math.abs(x_inter-ref[0]));
					}

				}
				if(danger) {
					document.getElementById("danger_"+i).style.visibility = "visible";
					trace_trajet(couleur_danger, "danger", ref, [noeuds[i]], false);

					if (dessin.getContext){
						let ctx = dessin.getContext('2d');
						ctx.fillStyle = couleur_chute;
						for (let j in chute) {
							ctx.beginPath();
							ctx.arc(coord_x(chute[j][0]), coord_y(chute[j][1]), TC_coeff*0.50, 0, Math.PI*2,  true);
							ctx.fill();
						}
					}
				}
				else {
					let elt = document.getElementById("danger_"+i);
					if (elt) elt.style.visibility = "hidden";
					else window.console.log("calc_dist, pas d'élément danger_" + i);
				}

				if (document.getElementById("dist_"+i)) {
					d = Math.max(dh, Math.abs(ref[2] - noeuds[i][2]));
					nb_dla = Math.ceil(parseFloat(d)/parseFloat(typ_gow));
					if(i==0) {
						text_dist = "Distance : "+d+", DLA : "+nb_dla;
						if(dla) { text_dist += ", durée : "+format_tps(parseFloat(nb_dla)*dla); }
						document.getElementById("dist_"+i).innerHTML = text_dist;
						distances[i+1] = ([d+distances[i][0], nb_dla+distances[i][1]]);
					}
					else {
						text_dist = "Distance : "+d+" / total : "+(d+distances[i][0])+", DLA : "+nb_dla+" / "+(nb_dla+distances[i][1]);
						if(dla) { text_dist += ", durée : "+format_tps(parseFloat(nb_dla)*dla)+" / "+format_tps(parseFloat(nb_dla+distances[i][1])*dla); }
						document.getElementById("dist_"+i).innerHTML = text_dist;
						distances[i+1] = ([d+distances[i][0], nb_dla+distances[i][1]]);
					}

				}
				ref = noeuds[i];
			}
		}
		function calc_inter(x0,y0,px,py,tmax) {
			let res = false, a = 0, b = 0, c = 0, delta = 0, t0 = 0, t1 = 0;
			//window.console.log('verif collision gowap-trou [x0=' + x0 + ',y0=' + y0 + ', px=' + px + ', py=' + py + ', tmax=' + tmax + ']');

			for(let k in position_trous) {
				a = parseFloat(px*px+py*py);
				b = parseFloat((x0-position_trous[k][0])*px+(y0-position_trous[k][1])*py);
				c = parseFloat((x0-position_trous[k][0])*(x0-position_trous[k][0])+(y0-position_trous[k][1])*(y0-position_trous[k][1])-position_trous[k][2]);
				delta = b*b-a*c
				if(delta >= 0) {
					t0 = Math.ceil(-b/a-Math.sqrt(delta)/a);
					t1 = Math.floor(-b/a+Math.sqrt(delta)/a);
					if(t0 <= tmax && t1 >= 0) {
						// Roule' 10/10/2016 J'ai déplacé le flag res=true à l'intérieur de la boucle for ci-dessous car il y avait de fausses détections
						//res = true;
						//window.console.log('***** collision gowap-trou [x0=' + x0 + ',y0=' + y0 + ', px=' + px + ', py=' + py + ', tmax=' + tmax + ']');
						for(let l=Math.max(0,t0); l<=Math.min(tmax,t1); l++) {
							//window.console.log('***** collision gowap-trou en ' + (x0+l*px) + ', ' + (y0+l*py));
							res = true;
							chute.push([x0+l*px, y0+l*py]);
						}
					}
				}
			}
			return res;
		}
		function format_tps(tps) {
			let jours = Math.floor(tps/1440);
			let heures = tps%1440;
			let minutes = heures%60
			heures = Math.floor(heures/60);
			return (jours? jours+"jr ":"")+heures+"h "+minutes+"mn";
		}
		function ini_trajet() {
			depart = [MZ_analyse_page_ordre_suivant.result.x, MZ_analyse_page_ordre_suivant.result.y, MZ_analyse_page_ordre_suivant.result.n];	// variable globale "depart"
			if(cadrable) {	// placer le petit double rectangle cliquable permettant de copier la loc vers la frame du bas
				let dessin = dessine_copie();
				dessin.style.marginLeft = "4px";
				addEvent(dessin, "click", copier_depart, true);
				if (MZ_analyse_page_ordre_suivant.result.eltPos) MZ_analyse_page_ordre_suivant.result.eltPos.appendChild(dessin);
				else window.console.log('MZ_analyse_page_ordre_suivant.ini_trajet, pas de result.eltPos'); 
					
			}

			charge_trajet();	// chargement de certaines (!) variables globales à partir du LocalStorage
			introspection();	// chargement de la variable globale "soi" : tableau [x, y, n, idTroll]

			let ind_a = -1;
			etapes_ini = new Array(); arret = new Array(); nb_ini = 0;
			for(let i=0; i<MZ_analyse_page_ordre_suivant.result.ordres.length; i++) {
				let thisOrdre = MZ_analyse_page_ordre_suivant.result.ordres[i];
				if (thisOrdre.x !== undefined) {	// c'est un déplacement (ou ébrouage)
					etapes_ini.push([thisOrdre.x, thisOrdre.y, thisOrdre.n, (thisOrdre.ordre.substring(0, 11) != "Déplacement")]);
					nb_ini++;
				} else if(thisOrdre.ordre.match(/Arrêt/)) {
					//arret.push([-1, nb_ini]); ind_a = nb_ini;
					if ( nb_ini!=0 ) {arret.push([-1, nb_ini]); ind_a = nb_ini;} // correction par Vapulabehemot (82169) le 31/08/2013 
				} else {
					let point = thisOrdre.ordre.match(/Suivre[\u00a0 ](.+) \(\d+\) à une distance de (\d+) case/);
					if(point) {	// si le suivant suit le Troll, on peut dessiner sa trajectoire
						//MZ_analyse_page_ordre_suivant.result.eltPos('trajet_canvas, reco suivre, soi=' + JSON.stringify(soi) + ', point=' + JSON.stringify(point));
						//window.console.log('trajet_canvas, reco suivre, soi=' + JSON.stringify(soi) + ', point=' + JSON.stringify(point));
						if(soi && soi[3] == point[1]) {
							arret.push([parseInt(point[2]), nb_ini]);
						} else {
							arret.push([-1, nb_ini]);
						}
						ind_a = nb_ini;
					}
				}
			}
			if(ind_a != nb_ini) arret.push([-1, nb_ini]);

			nb_ajout = etapes.length;
			calc_etapes();

			declare_css();
			ini_canvas();
			trace_glissiere();
			echelle_trajet() ;
			creer_bulle_trajet();
			lister_etapes();
			charger_fav();
			lister_fav();
			trace_trajet_prev();
		}
		function introspection() {	// chargement de la variable globale "soi" : tableau [x, y, n, idTroll]
			if(window.parent && window.parent.parent && window.parent.parent.frames.length > 1) {
				let pos = (window.parent.parent.frames[0].document.getElementById('DLA_xyn').textContent).match(/X *= *(-?\d+) *\| *Y *= *(-?\d+) *\| *N *= *(-?\d+)/);
				if(pos) {
					soi = [parseInt(pos[1]), parseInt(pos[2]), parseInt(pos[3]), window.parent.parent.frames[0].document.getElementsByTagName('a')[0].textContent];
				} else {
					window.console.log('trajet_canvas introspection: Impossible de trouver la position courante, xyn=' + window.parent.parent.frames[0].document.getElementById('DLA_xyn').textContent);
				}
			}
		}
		function calc_etapes() {
			let continu = true, deb = 0, fin = 0, dx, dy, dn, dxa, dya, dna, inter, suivre = false;
			let ref = depart;
			for(let i in arret) {
				fin = arret[i][1];
				if(deb != fin) {
					for(let j=deb; j<fin; j++) {
						etapes_tt.push([etapes_ini[j][0], etapes_ini[j][1], etapes_ini[j][2], etapes_ini[j][3]? 1:0]);
					}
					ref = etapes_ini[fin-1];
				}
				if(arret[i][0] != -1) {
					dx = soi[0] - ref[0];
					dy = soi[1] - ref[1];
					dn = soi[2] - ref[2];
					dxa = Math.max(Math.abs(dx)-arret[i][0], 0);
					dya = Math.max(Math.abs(dy)-arret[i][0], 0);
					dna = Math.max(Math.abs(dn)-arret[i][0], 0);
					inter = [ref[0]+((dx>0)? dxa:-dxa), ref[1]+((dy>0)? dya:-dya), ref[2]+((dn>0)? dna:-dna)];
					etapes_tt.push([inter[0], inter[1], inter[2], 2]);
				}
				deb = fin;
			}
			nb_tt = etapes_tt.length;
		}
		function echelle_trajet() {
			trace_trou();
			trace_position(depart);
			document.getElementById("cadre_liste").style.left = 200*TC_coeff+2*decalh+5+"px";
			trace_reel(couleur_reel, "trou", depart, etapes_ini, arret, false);
			efface_surligne();
		}
		function echelle_position() {
			trace_trou();
			//window.console.log('echelle_position suivants=' + JSON.stringify(suivants));
			for(let [i, suivant] of suivants.entries()) {
				// suivant : [(0)num_gow, (1)nom, (2)x, (3)y, (4)n, (5)etapes_ini, (6)etapes, (7)arret];
				//gowap_debug = suivant[0];
				//if (gowap_debug == 5813233) window.console.log('echelle_position suivants debug,t_prev=' + t_prev + ', t_enreg=' + t_enreg + ' gowap=' + JSON.stringify(suivant));
				if (!Array.isArray(suivant)) continue;
				trace_position([suivant[2], suivant[3]]);
				let aleatoire = 50+Math.round(155.0*i/nbs);
				//console.log(`trajet_canvas echelle_position aleatoire=${aleatoire}, i=${i}, nbs=${nbs}`);
				//if(t_prev && suivant[6]) {
				if(t_prev && suivant[6] && suivant[6] != '') { // correction par Vapulabehemot (82169) le 31/08/2013
					trace_trajet("rgba(0,"+aleatoire+",0,0.6)", "trou", [suivant[2], suivant[3]], suivant[6], false);
				}
				//if(t_enreg && suivant[5]) {
				if(t_enreg && suivant[5] && suivant[5] != '') { // correction par Vapulabehemot (82169) le 31/08/2013
					if (!Array.isArray(suivant)) {
						let msg = 'null ?';
						try {
							msg = suivant.substring(0, 60);
						} catch(e) {}
						console.log(`trajet_canvas echelle_position suivant=${msg}`);
						return;
					}
					trace_reel(aleatoire, "trou", [suivant[2], suivant[3]], suivant[5], suivant[7], false);
				}
			}
		}
		//let gowap_debug = 0;
		function trace_reel(couleur, ou, ref, noeuds, transition, refaire) {
			let coulNum = parseInt(couleur);
			if (isNaN(coulNum)) coulNum = 0;
			//window.console.log(`trajet_canvas trace_reel_log\ncouleur=${JSON.stringify(couleur)}\ncoulNul=${JSON.stringify(coulNum)}\nou=${JSON.stringify(ou)}\nref=${JSON.stringify(ref)}\nnoeuds=${JSON.stringify(noeuds)}\ntransition=${JSON.stringify(transition)}\nrefaire=${JSON.stringify(refaire)}`);
			let continu = true, deb = 0, fin = 0, dx, dy, dxa, dya, inter, suivre = false;
			for(let i in transition) {
				fin = transition[i][1];
				//if (gowap_debug == 5811849) {
				//	window.console.log('trace_reel_log, transition(' + i + ')=' + JSON.stringify(transition[i]));
				//	window.console.log('trace_reel_log, coulNum=' + coulNum + ', deb=' + deb + ', fin=' + fin + ', suivre=' + suivre + ', ref=' + JSON.stringify(ref) + ', soi=' + JSON.stringify(soi));
				//}
				if(deb != fin && suivre) {
					trace_trajet("rgba("+coulNum+",0,"+coulNum+(continu? ",0.6)":",0.2)"), ou, ref, [noeuds[deb]], refaire);
					//if (gowap_debug == 5813233) window.console.log('trace_reel_log, trace1 ref=' + JSON.stringify(ref) + ', points=' + JSON.stringify([noeuds[deb]]));
					ref = noeuds[deb];
					deb++;
					suivre = false;
				}
				if((deb != fin) && ref) {	// Roule' 14/11/2018 ajout de la protection sur "ref"
					let points = new Array();
					for(let j=deb; j<fin; j++) {
						points.push(noeuds[j]);
					}
					//window.console.log(`trajet_canvas trace_reel_log avant appel trace_trajet coulNum=${JSON.stringify(coulNum)}, coulNum envoyée=${"rgba(0,0,"+coulNum+(continu? ",0.6)":",0.2)")}`);
					trace_trajet("rgba(0,0,"+coulNum+(continu? ",0.6)":",0.2)"), ou, ref, points, refaire);
					//if (gowap_debug == 5813233) window.console.log('trace_reel_log, trace2 ref=' + JSON.stringify(ref) + ', points=' + JSON.stringify(points));
					ref = noeuds[fin-1];
				}
				if(transition[i][0] != -1 && soi) {
					dx = soi[0] - ref[0];
					dy = soi[1] - ref[1];
					dxa = Math.max(Math.abs(dx)-transition[i][0], 0);
					dya = Math.max(Math.abs(dy)-transition[i][0], 0);
					if(dxa >0 || dya >0) {
						inter = [ref[0]+((dx>0)? dxa:-dxa), ref[1]+((dy>0)? dya:-dya)];
						trace_trajet("rgba("+coulNum+",0,"+coulNum+(continu? ",0.6)":",0.2)"), ou, ref, [inter], refaire);
						//if (gowap_debug == 5813233) window.console.log('trace_reel_log, trace3 ref=' + JSON.stringify(ref) + ', points=' + JSON.stringify([inter]));
						ref = inter;
						suivre = true;
					}
				}
				continu = false;
				deb = fin;
			}
		}
		function echelle_teleport() {
			trace_trou();
			trace_sortie(sortie);
		}
		function ini_position() {
			suivants = new Array();
			nbs = 0;
			for (let oSuivant of MZ_analyse_page_suivants.suivants) {
				arret = new Array();	// Roule' 23/12/2018
				num_gow = oSuivant.oJSON.id;
				charge_trajet();
				//if (oSuivant.oJSON.id == 5813233) window.console.log('trajet_canvas init_potition pour suivant ' + oSuivant.oJSON.id + '\netapes_ini=' + JSON.stringify(etapes_ini) + '\netapes=' + JSON.stringify(etapes) + '\narret=' + JSON.stringify(arret));
				
				suivants[nbs] = [
					oSuivant.oJSON.id,
					oSuivant.nom,
					parseInt(oSuivant.loc.x),
					parseInt(oSuivant.loc.y),
					parseInt(oSuivant.loc.n),
					etapes_ini,
					etapes,
					arret];
				oSuivant.eTr.suivant = suivants[nbs];	// Roule 25/10/2019 pour surlignage position suivant
				oSuivant.eTi.suivant = suivants[nbs];
				addEvent(oSuivant.eTr, "mouseover", surligne_point, true);
				addEvent(oSuivant.eTr, "mouseout", efface_surligne, true);
				addEvent(oSuivant.eTi, "mouseover", surligne_point, true);
				addEvent(oSuivant.eTi, "mouseout", efface_surligne, true);
				nbs++;
			}
			if(nbs > 0) {
				charge_opt_position();
				declare_css();
				let trajet = bloc("carte_trajet");

				let dessin = creer_canvas("trou");
				dessin.className = "mh_tdpage";
				addEvent(dessin, "mousemove", afficher_position_suivant, true);
				addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
				addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
				trajet.appendChild(dessin);

				let div_gliss = creer_glissiere("gow", zoom);
				div_gliss.appendChild(aj_opt("opt_enreg", "Trajets enregistrés", t_enreg));
				addEvent(div_gliss.lastChild.firstChild, "click", alterne_trajet, true);
				div_gliss.appendChild(aj_opt("opt_prev", "Trajets prévisionnels", t_prev));
				addEvent(div_gliss.lastChild.firstChild, "click", alterne_trajet, true);
				trajet.appendChild(div_gliss);

				let footer1 = document.getElementById('footer1'); // correction par Vapulabehemot (82169) le 30/08/2013
				if (!footer1) footer1 = document.getElementById('footer');
				footer1.parentNode.insertBefore(trajet, footer1); // correction par Vapulabehemot (82169) le 30/08/2013

				introspection();
				trace_trou();
				trace_glissiere();
				echelle_position();
				creer_bulle_trajet();
				dessin = creer_canvas("surligne");	// Roule 25/10/2019 pour surlignage position suivant
				dessin.style.display = 'none';
				trajet.appendChild(dessin);
			}
		}
		function ini_teleport() {
			// Roule 03/05/2019 Un dev MH a cru bon d'enlever les espaces autour des "=" :(
			// ...qui mène en X=-124 | Y=-135 | N=-39
			pos = window.document.getElementsByTagName("body")[0].innerHTML.match(/ en X *= *(-?\d+) \| Y *= *(-?\d+) \| N *= *(-?\d+)\./);
			sortie = [parseInt(pos[1]), parseInt(pos[2])];
			declare_css();

			trajet = bloc("carte_trajet");

			dessin = creer_canvas("trou");
			dessin.className = "mh_tdpage";
			addEvent(dessin, "mousemove", afficher_teleport, true);
			addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
			addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
			trajet.appendChild(dessin);

			trajet.appendChild(creer_glissiere("gow", zoom));

			//parp = document.getElementsByTagName('p');
			//parp[parp.length-1].insertBefore(trajet,parp[parp.length-1].firstChild)
			let footer1 = document.getElementById('footer1'); // correction par Vapulabehemot (82169) le 30/08/2013
			if (!footer1) footer1 = document.getElementById('footer');
			footer1.parentNode.insertBefore(trajet, footer1); // correction par Vapulabehemot (82169) le 30/08/2013

			trace_glissiere();
			echelle_teleport();
			creer_bulle_trajet();
		}
		function alterne_trajet() {
			if(this.id == "opt_enreg") {
				t_enreg = !t_enreg;
			}
			else {
				t_prev = !t_prev;
			}
			sauve_opt_position();
			echelle_position();
		}
		function ini_tableau() {
			etapes = new Array();
			for(let i in etapes_ini) {
				etapes[i] = etapes_ini[i];
			}
		}
		function ini_suppr() {
			suppr_surligne = new Array();
			for(let i in etapes) {
				suppr_surligne[i] = etapes[i];
			}
		}
		//////////////////////////
		//destinations favorites
		function dessine_fermer(dessin) {
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.lineCap = "round"
				ctx.strokeStyle = "rgb(80,80,80)";
				ctx.lineWidth = "1.5";
				dessine_svg(ctx, data_svg["fermer"]);
				ctx.stroke();
			}
		}
		function creer_bulle_zoom() {
			if(haut.getElementById("bulle_zoom")) return;
			let bulle_fav = bloc("bulle_zoom");
			bulle_fav.className = "mh_tdpage";
			haut.body.appendChild(bulle_fav);
		}
		function echelle_fav() {
			TC_coeff = zoom_fav/50.0;
			haut.getElementById("liste_fav_gow").style.marginLeft = (4*zoom_fav+2*decalh+5)+"px";
			haut.getElementById("cadre_fav").style.minHeight = (4*zoom_fav+2*decalv+40)+"px";
			let gestion = haut.getElementById("gestion_fav_gow");
			gestion.style.left = Math.max(1, haut.body.clientWidth+haut.body.scrollLeft-2-gestion.offsetWidth)+"px";

			trace_trou_fav();
			place_fav();
			TC_coeff = zoom/50.0;
		}
		function ini_gestion() {
			haut = (page == "action_ordre")? window.parent.frames[0].document:document;
			if(MY_getValue("zoom_fav")) {
				zoom_fav = parseFloat(MY_getValue("zoom_fav"))
			}
			if (!haut.getElementById("gestion_fav_gow")) {
				declare_css();
				let gestion = bloc("gestion_fav_gow");
				gestion.className = "mh_tdpage";

				let nvdiv = bloc("titre_fav");
				nvdiv.className = "mh_tdtitre";
				nvdiv.appendChild(document.createTextNode("Gestion des destinations favorites"));
				let fermer = creer_icone(15, 15, "Fermer", function() { this.parentNode.parentNode.style.visibility = "hidden" });
				dessine_fermer(fermer);
				nvdiv.appendChild(fermer);
				gestion.appendChild(nvdiv);
				let carte_fav = bloc("cadre_fav");

				carte_fav.appendChild(creer_canvas("trou_fav"));
				let dessin = creer_canvas("trace_fav");
				//addEvent(haut, "mouseup", drop, true); // suppression par Vapulabehemot (82169) le 10/07/2015
				//addEvent(haut, "mousemove", glisse, true); // suppression par Vapulabehemot (82169) le 10/07/2015
				addEvent(dessin, "mousemove", afficher_fav, true);
				addEvent(dessin, "click", aj_pos, true);
				addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
				addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
				carte_fav.appendChild(dessin);

				carte_fav.appendChild(creer_glissiere("fav", zoom_fav));
				carte_fav.appendChild(bloc("liste_fav_gow"));
				gestion.appendChild(carte_fav);
				haut.body.appendChild(gestion);

				trace_glissiere_fav();
			}
			else if(haut.getElementById("gestion_fav_gow").style.visibility == "visible") {
				haut.getElementById("gestion_fav_gow").style.visibility = "hidden";
				return;
			}
			charger_fav();
			gerer_fav(); echelle_fav(); poser_fav(); creer_bulle_trajet();
		}
		function gerer_fav() {
			let gestion = haut.getElementById("gestion_fav_gow");
			gestion.style.visibility = "visible";

			let liste_fav = haut.getElementById("liste_fav_gow");
			liste_fav.innerHTML = "";
			for(let i=0; i<nb_fav; i++) {
				liste_fav.appendChild(bloc("fav_gow_"+i));
				aff_fav(i);
			}
			aj_edit();
		}
		function poser_fav() {
			let gestion = haut.getElementById("gestion_fav_gow");
			if(page == "action_ordre") {
				//let scroll = haut.body.scrollTop;
				let scroll = (haut.defaultView.pageYOffset || haut.documentElement.scrollTop || haut.body.scrollTop || 0);
				gestion.style.top = (haut.body.clientHeight+scroll-2-gestion.offsetHeight)+"px";
			}
			else {
				let noeud = document.getElementById("ligne_fav");
				let ecart = noeud.offsetHeight+1;
				while(noeud.offsetParent) {
					ecart += noeud.offsetTop;
					noeud = noeud.offsetParent;
				}
				gestion.style.top = ecart+"px";
			}
			gestion.style.left = Math.max(1, haut.body.clientWidth+haut.body.scrollLeft-2-gestion.offsetWidth)+"px";
		}
		function aff_fav(rg) {
			let fav = haut.getElementById("fav_gow_"+rg);
			fav.innerHTML = "";
			fav.className = "fav";
			let texte = protege_texte(favori[rg][0])+" ("+favori[rg][1]+", "+favori[rg][2]+", "+favori[rg][3]+")";
			fav.appendChild(document.createTextNode(texte));

			let dessin = creer_icone(11, 12, "Supprimer "+texte, effacer_fav);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(200,100,100)";
				ctx.lineCap = "round";
				ctx.lineWidth = "2";
				dessine_svg(ctx, data_svg["suppr"]);
				ctx.stroke();
			}
			fav.appendChild(dessin);

			dessin = creer_icone(12, 12, "Editer "+texte, editer_fav);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(30,30,30)";
				ctx.fillStyle = "rgb(180,180,180)";
				let echelle = 12.0/21.0;
				ctx.scale(echelle, echelle);
				ctx.lineWidth = "1";
				dessine_svg(ctx, data_svg["param"]);
				ctx.stroke();
				ctx.fill();
			}
			fav.appendChild(dessin);

			dessin = creer_icone(11, 12, "Descendre "+texte, descendre_fav);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.fillStyle = "rgb(100,170,100)";
				dessine_svg(ctx, data_svg["descendre"]);
				ctx.fill();
			}
			if(rg == nb_fav-1) dessin.style.visibility = "hidden";
			fav.appendChild(dessin);

			dessin = creer_icone(11, 12, "Monter "+texte, monter_fav);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.fillStyle = "rgb(100,170,100)";
				dessine_svg(ctx, data_svg["monter"]);
				ctx.fill();
			}
			fav.appendChild(dessin);
			if(rg == 0) dessin.style.visibility = "hidden";
		}
		function monter_fav() {
			let ref = parseInt(this.parentNode.id.split("_")[2])

			let temp = favori[ref-1];
			favori[ref-1] = favori[ref];
			favori[ref] = temp;
			sauver_fav(); lister_fav(); gerer_fav();
		}
		function descendre_fav() {
			let ref = parseInt(this.parentNode.id.split("_")[2]);

			let temp = favori[ref+1];
			favori[ref+1] = favori[ref];
			favori[ref] = temp;
			sauver_fav(); lister_fav(); gerer_fav();
		}
		function effacer_fav() {
			favori.splice(parseInt(this.parentNode.id.split("_")[2]),1);
			nb_fav--;
			sauver_fav(); lister_fav();
			gerer_fav();
			trace_fav();
		}
		function editer_fav() {
			let rg = parseInt(this.parentNode.id.split("_")[2]);
			let fav = haut.getElementById("fav_gow_"+rg);
			fav.innerHTML = "";
			fav.appendChild(document.createTextNode("Description : "));
			let entree = document.createElement("input");
			entree.maxLength = "40";
			entree.size = "40";
			entree.className = "TextareaboxV2";
			fav.appendChild(entree);
			fav.appendChild(document.createElement("br"));
			fav.appendChild(document.createTextNode("X = "));
			fav.appendChild(nvl_entree());
			fav.appendChild(document.createTextNode(" Y = "));
			fav.appendChild(nvl_entree());
			fav.appendChild(document.createTextNode(" N = "));
			fav.appendChild(nvl_entree());

			for (let i=0; i<4; i++) {
				fav.getElementsByTagName("input")[i].value = favori[rg][i];
			}

			let dessin = creer_icone(20, 20, "Annuler", annuler_edit);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(120,50,50)";
				ctx.lineCap = "round";
				ctx.lineWidth = "3";
				dessine_svg(ctx, data_svg["annuler"]);
				ctx.stroke();
			}
			dessin.style.verticalAlign = "text-bottom";
			fav.appendChild(dessin);

			dessin = creer_icone(21, 21, "Valider", valider_edit);
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(50,120,50)";
				ctx.lineWidth = "4";
				ctx.arc(10, 10, 7.5, 0, Math.PI*2,  true);
				ctx.stroke();
			}
			dessin.style.verticalAlign = "text-bottom";
			fav.appendChild(dessin);
		}
		function aj_edit() {
			let fav = bloc("fav_gow_"+nb_fav);
			fav.appendChild(document.createElement("br"));
			fav.appendChild(document.createElement("br"));
			fav.appendChild(document.createTextNode("Description : "));
			let entree = document.createElement("input");
			entree.maxLength = "40";
			entree.size = "40";
			entree.className = "TextareaboxV2";
			fav.appendChild(entree);
			fav.appendChild(document.createElement("br"));
			fav.appendChild(document.createTextNode("X = "));
			fav.appendChild(nvl_entree());
			fav.appendChild(document.createTextNode(" Y = "));
			fav.appendChild(nvl_entree());
			fav.appendChild(document.createTextNode(" N = "));
			fav.appendChild(nvl_entree());

			let dessin = dessine_plus();
			addEvent(dessin, "click", aj_fav, true);
			fav.appendChild(dessin);

			haut.getElementById("liste_fav_gow").appendChild(fav);
		}
		function dessine_plus() {
			let dessin = document.createElement("canvas");
			dessin.width = 21;
			dessin.height = 21;

			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.lineCap = "round"
				ctx.strokeStyle = "rgb(50,120,50)";
				ctx.lineWidth = "2.5";
				dessine_svg(ctx, data_svg["plus"]);
				ctx.stroke();
			}
			dessin.title = "Ajouter";
			dessin.style.verticalAlign = "text-bottom";
			dessin.className = "a_cliquer";
			return dessin;
		}
		function dessine_copie() {
			let dessin = document.createElement("canvas");
			dessin.width = 12;
			dessin.height = 12;
			if (dessin.getContext){
				let ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(0,0,0)";
				ctx.fillStyle = "rgb(250,250,250)";
				ctx.lineWidth = "1";
				ctx.fillRect(1,1,6,8)
				ctx.strokeRect(1,1,6,8)
				ctx.fillRect(4,3,6,8)
				ctx.strokeRect(4,3,6,8)
			}
			dessin.title = "Copier dans le cadre Action";
			dessin.style.verticalAlign = "text-bottom";
			dessin.className = "a_cliquer";
			return dessin;
		}
		function aj_fav() {
			if(nb_fav > 0 && haut.getElementById("fav_gow_"+(nb_fav-1)).getElementsByTagName("canvas").length > 3) haut.getElementById("fav_gow_"+(nb_fav-1)).getElementsByTagName("canvas")[2].style.visibility = "visible";
			let xx = entier(this.parentNode.getElementsByTagName("input")[1].value);
			let yy = entier(this.parentNode.getElementsByTagName("input")[2].value);
			let nn = entier(this.parentNode.getElementsByTagName("input")[3].value);
			favori[nb_fav] = [protege(this.parentNode.getElementsByTagName("input")[0].value), xx, yy, nn];
			nb_fav++;
			nv_pt = null;
			sauver_fav(); lister_fav();
			aff_fav(nb_fav-1);
			aj_edit();
			trace_fav();
		}
		function aj_pos(evt) {
			let xpage = 0, ypage = 0, xpos = 0, ypos = 0, xs, ys;

			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}

			xcase = Math.round(50*(xpage-decalh)/zoom_fav-100.0);
			ycase = Math.round(100.0-50*(ypage-decalv)/zoom_fav);

			let ligne = haut.getElementById("fav_gow_"+nb_fav);
			ligne.getElementsByTagName("input")[1].value = xcase;
			ligne.getElementsByTagName("input")[2].value = ycase;
			nv_pt = [xcase, ycase];
			trace_fav();
			retrace_fav = true;
		}
		function nvl_entree() {
			let entree = document.createElement("input");
			entree.maxLength = "4";
			entree.size = "8";
			entree.className = "TextareaboxV2";
			addEvent(entree, "keyup", modif_edit, true);
			addEvent(entree, "change", modif_edit, true);
			return entree;
		}
		function valider_edit() {
			let ref = parseInt(this.parentNode.id.split("_")[2]);
			let xx = entier(this.parentNode.getElementsByTagName("input")[1].value);
			let yy = entier(this.parentNode.getElementsByTagName("input")[2].value);
			let nn = entier(this.parentNode.getElementsByTagName("input")[3].value);
			retrace_fav = (retrace_fav || favori[ref][1] != xx || favori[ref][2] != yy);
			favori[ref] = [protege(this.parentNode.getElementsByTagName("input")[0].value), xx, yy, nn];
			nv_pt = null;
			sauver_fav(); lister_fav();
			aff_fav(ref);
			if(retrace_fav) trace_fav();
		}
		function modif_edit() {
			let xx = entier(this.parentNode.getElementsByTagName("input")[1].value);
			let yy = entier(this.parentNode.getElementsByTagName("input")[2].value);
			if(nv_pt === null || nv_pt[1] != xx || nv_pt[2] != yy) {
				nv_pt = [xx, yy];
				trace_fav();
				retrace_fav = true;
			}
		}
		function entier(num) {
			if(!num) return 0;
			else if(isNaN(num)) return 0;
			return parseInt(num);
		}
		function protege(texte) {
			if(texte == '')  return "";
			texte = texte.replace( /\//g, "&#47;" );
			return texte;
		}
		function protege_sel(texte) {
			if(texte == '')  return "";
			texte = texte.replace( /\</g, "&lt;");
			texte = texte.replace( /\>/g, "&gt;" );
			return texte;
		}
		function protege_texte(texte) {
			if(texte == '')  return "";
			texte = texte.replace( /\</g, "\u003c");
			texte = texte.replace( /\>/g, "\u003e" );
			texte = texte.replace( /&#47;/g, "/" );
			return texte;
		}
		function annuler_edit() {
			nv_pt = null;
			aff_fav(parseInt(this.parentNode.id.split("_")[2]));
			if(retrace_fav) trace_fav();
		}
		function lister_fav() {
			if(page == "action_ordre") {;
				remplir_liste(document.getElementById("sel_fav"));
			}
			else if(page == "trajet") {
				remplir_liste(document.getElementById("sel_fav"));
				if(cadrable && window.parent.frames[1].document.getElementById("sel_fav")) {
					remplir_liste(window.parent.frames[1].document.getElementById("sel_fav"));
				}
			}
			else { return; }

			//choix_fav = -2;	// semble ne servir à rien
		}
		function remplir_liste(noeud) {
			noeud.innerHTML = "";

			let opt = document.createElement("option");
			opt.innerHTML = "Destinations favorites";
			opt.value = -2;
			noeud.appendChild(opt);
			if(soi) {
				opt = document.createElement("option");
				opt.innerHTML = "Ma position ("+soi[0]+", "+soi[1]+", "+soi[2]+")";
				opt.value = -1;
				addEvent(opt, "mouseover", surligne_fav, true);
				addEvent(opt, "mouseout", efface_surligne, true);
				noeud.appendChild(opt);
			}
			for (let i=0; i<nb_fav; i++) {
				opt = document.createElement("option");
				opt.innerHTML = protege_sel(favori[i][0])+" ("+favori[i][1]+", "+favori[i][2]+", "+favori[i][3]+")";
				opt.value = i
				addEvent(opt, "mouseover", surligne_fav, true);
				addEvent(opt, "mouseout", efface_surligne, true);
				noeud.appendChild(opt);
			}
		}
		function ini_fav() {
			let nvdiv = bloc("div_fav");
			nvdiv.className = "mh_tdpage";
			let choix = document.createElement("select");
			choix.id = "sel_fav";
			choix.style.verticalAlign = "top";
			addEvent(choix, "keyup", changer_fav, true);
			addEvent(choix, "change", changer_fav, true);
			nvdiv.appendChild(choix);
			if(cadrable) {
				let dessin = creer_icone(21, 21, "Gerer les destinations favorites", ini_gestion);
				if (dessin.getContext){
					let ctx = dessin.getContext('2d');
					ctx.strokeStyle = "rgb(50,50,50)";
					ctx.fillStyle = "rgb(220,220,220)";
					ctx.lineWidth = "1";
					dessine_svg(ctx, data_svg["param"]);
					ctx.stroke();
					ctx.fill();
				}
				dessin.style.cursor = "pointer";
				dessin.style.cursor = "0 2px";
				nvdiv.appendChild(dessin);
			}
			nvdiv.style.position = "absolute";
			nvdiv.style.top = "2px";
			nvdiv.style.right = "2px";
			nvdiv.style.padding = "1px";

			document.body.appendChild(nvdiv);
			introspection();
			charger_fav();
			lister_fav();
		}
		function changer_fav() {
			let choix_fav = parseInt(this.value);
			if(choix_fav == -2) {
				return;
			}

			if(choix_fav == -1) {
				copier_xxx(soi, document);
			} else {
				charger_fav()
				if (favori[choix_fav]) {
					copier_xxx(favori[choix_fav].slice(1, 4), document);
				}
			}
		}
		function sauver_fav() {
			let texte = "";
			for (let i=0; i<nb_fav; i++) {
				texte += favori[i][0]+"/"+favori[i][1]+"/"+favori[i][2]+"/"+favori[i][3]+"/";
			}
			MY_setValue("favori_gow", texte);
		}
		function charger_fav() {
			if(!MY_getValue("favori_gow")) return;
			let param = MY_getValue("favori_gow").split("/");
			nb_fav = Math.floor(param.length/4);
			if (param.length > 3) {
				for (let i=0; i<nb_fav; i++) {
					favori[i] = [param[4*i], parseInt(param[4*i+1]), parseInt(param[4*i+2]), parseInt(param[4*i+3])];
				}
			}
		}
		function quel_ordre(formulaire) {
			let elts = formulaire.ownerDocument.getElementsByName('gus_ordre');
			if (elts.length > 0) return parseInt(elts[0].value, 10);
			return -1;
		}
		////////////////////////////////////////////////////////////
		let TC_coeff=2, decalv=30, decalh=30
		let position_trous = [[-70.5, -7.5, 2, 1.5, -69]
			, [-66.5, -37.5, 2, 1.5, -69]
			, [-63.5, 8.5, 2, 1.5, -69]
			, [-59.5, -32.5, 2, 1.5, -69]
			, [-52, 57, 0.25, 0.8, -59]
			, [-50.5, -22.5, 2, 1.5, -69]
			, [-35.5, -51.5, 2, 1.5, -69]
			, [-34.5, 14.5, 2, 1.5, -69]
			, [-34.5, 64.5, 2, 1.5, -69]
			, [-11.5, 72.5, 2, 1.5, -69]
			, [5.5, -49.5, 2, 1.5, -69]
			, [5.5, 31.5, 2, 1.5, -69]
			, [10.5, 63.5, 2, 1.5, -69]
			, [12, -15, 0.25, 0.8, -59]
			, [21.5, 35.5, 2, 1.5, -69]
			, [30, -52, 0.25, 0.8, -59]
			, [46.5, 51.5, 2, 1.5, -69]
			, [48, -39, 0.25, 0.8, -59]
			, [55, 70, 0.25, 0.8, -59]	// correction Roule 10/10/2016 -59 au lieu de -69
			, [56.5, 23.5, 75, 8.7, -99]
			, [64, 70, 0.25, 0.8, -59]
			, [74.5, 31.5, 2, 1.5, -69]];
		let etapes = new Array(), etapes_ini = new Array(), etapes_tt = new Array(), depart = new Array(), chute = new Array(); let arret = new Array(), favori = new Array();
		let nb_ini = 0, nb_ajout = 0, nb_fav = 0, nb_tt = 0;
		let bulle = null, haut = null, soi = null, nv_pt = null, suivre = null;
		let bougeable = false, glissable = false, retrace_fav = false;
		let zoom = 100.0, zoom_fav = 100.0, dla = 0, typ_gow = 4;
		let num_gow = 0;
		let couleur_surligne = "rgb(180,80,180)", couleur_prev = "rgba(0,200,0,0.5)", couleur_reel = "150", couleur_danger = "rgba(255,150,150,1)", couleur_chute = "rgb(100,0,0)", couleur_trou = "rgb(200,0,0)";
		let data_svg = new Array();

		data_svg["fermer"] = [[3,7, 7, 6.5],[0,4.5, 4.5],[1,9.5, 9.5],[0,9.5, 4.5],[1,4.5, 9.5]];
		data_svg["param"] = [[0, 2.69,15.81], [2, 4.037,14.58, 6.07,17.356, 5.21,18.24], [1, 3.35,20.11], [2, 5.53,22.31, 9.31,17.555 ,7.51,15.78], [1, 15.78,7.49], [2, 18,9.5, 22.05,5.02, 20.21,3.14], [1, 18.21,5.07 ], [2, 16.84,6.41, 14.72,4.1, 15.95,2.9], [1, 18.01,0.93], [2, 15.63,-1.34, 11.42,3.33, 13.46,5.26], [1, 5.17,13.48], [2, 2.88,11.66, -1.11,15.77, 0.82,17.65]];
		data_svg["descendre"] = [[0,5,11],[1,10,6],[1,7,6],[1,7,0],[1,3,0],[1,3,6],[1,0,6]];
		data_svg["monter"] = [[0,5,0],[1,10,5],[1,7,5],[1,7,11],[1,3,11],[1,3,5],[1,0,5],[1,5,0]];
		data_svg["plus"] = [[3,10,10,9],[0,5,10],[1,15,10],[0,10,5],[1,10,15]];
		data_svg["suppr"] = [[0,0,0],[1,10,11],[0,10,0],[1,0,11]];
		data_svg["annuler"] = [[0, 1,1], [1, 18,18], [0, 19,1], [1, 1,18]];

		let cadrable = window.parent && window.parent.frames.length > 1 && window.parent.frames[0].document;

	let MZ_analyse_page_ordre_suivant;
	if (MZ_analyse_page_ordre_suivant === undefined && MZ_fo_ordres) {
		if("function" != typeof debugMZ) {
			function debugMZ(x) {
				//window.console.log(x);	// activer pour passer en mode debug
			}
		}
		// objet réutilisé dans MZ, dans Trajet_canvas et dans une extension perso ☺
		MZ_analyse_page_ordre_suivant = {
			result: { ordres: [] },
			init: function () {
				// façon blindée de tester la variable MY_DEBUG
				debugMZ('start MZ_analyse_page_ordre_suivant.init');
				try {
					let e_t_ordres = document.getElementById('t_fo_ordre');
					for (let ligne of e_t_ordres.getElementsByTagName('caption')) {
						//debugMZ('MZ_analyse_page_ordre_suivant_log ' + ligne.innerText);
						for (let div of ligne.getElementsByTagName('div')) {
							//debugMZ('MZ_analyse_page_ordre_suivant_log div ' + j + ' ' + div.innerText);
							let tabmatch = div.innerText.match(/(\d+) *\.* *(.*\[.*\].*)$/);
							if (tabmatch) {
								// ID, Nom
								this.result.id = tabmatch[1].trim();
								this.result.nom = tabmatch[2].trim();
							}
							tabmatch = div.innerText.match(/(\d+) *PA.*X = (-?\d+).*Y = (-?\d+).*N = (-?\d+)/i);
							if (tabmatch) {
								// PA, x, y, n
								this.result.PA = parseInt(tabmatch[1]);
								this.result.x = parseInt(tabmatch[2]);
								this.result.y = parseInt(tabmatch[3]);
								this.result.n = parseInt(tabmatch[4]);
								// Trajet_canvas a besoin d'un pointeur vers cette div
								this.result.eltPos = div;
							}
						}
					}
					for (let ligne of e_t_ordres.rows) {
						//debugMZ(`MZ_analyse_page_ordre_suivant td[0]=${ligne.textContent}`);
						for (let td of ligne.getElementsByTagName('td')) {
							let tabmatch = td.textContent.match(/^(.*)X=(-?\d+) \| Y=(-?\d+) \| N=(-?\d+)/i);
							if (tabmatch) {
								this.result.ordres.push({ ordre: tabmatch[1].trim(), x: parseInt(tabmatch[2]), y: parseInt(tabmatch[3]), n: parseInt(tabmatch[4]) });
							} else {
								tabmatch = td.textContent.match(/^\s*Aller\s*chercher\s*le\s*trésor\s*\[\s*(\d+)\s*\](.*)$/i);
								if (tabmatch) {
									this.result.ordres.push({ ordre: tabmatch[0].trim(), idtresor: parseInt(tabmatch[1]), nomtresor: trim(tabmatch[2]) });
								} else {
									this.result.ordres.push({ ordre: td.textContent.trim() });
								}
							}
						}
					}
					debugMZ(`fin MZ_analyse_page_ordre_suivant ${JSON.stringify(this.result)}`);
				} catch (exc) {
					logMZ('Exception dans MZ_analyse_page_ordre_suivant.init', exc);
				}
			}
		};
		MZ_analyse_page_ordre_suivant.init();
	}
	
	var MZ_analyse_page_suivants;
	if (isPage("MH_Play/Play_e_follo")) {
		if (MZ_analyse_page_suivants === undefined) {
			let div = document.createElement('div');
			div.style.position = 'fixed';
			div.style.top = '10px';
			div.style.left = '10px';
			div.style.backgroundColor = '#FFFFFF';
			div.style.border = 'solid black 2px';
			div.id = 'TrajetCanvasErreur';
			let d2 = document.createElement('div');
			d2.style.fontSize = '200%';
			d2.style.color = 'red';
			let msg = 'trajet_canvas ne fonctionne plus sans MZ    ';
			window.console.log(msg);
			alert(msg);
			d2.appendChild(document.createTextNode(msg));
			div.appendChild(d2);
			d2 = document.createElement('div');
			d2.appendChild(document.createTextNode('Si vous souhaitez utiliser trajet_canvas sans MZ, demandez ici :'));
			div.appendChild(d2);
			d2 = document.createElement('div');
			d2.appendChild(document.createTextNode('×'));
			d2.style.position = 'absolute';
			d2.style.top = 0;
			d2.style.right = '3px';
			div.appendChild(d2);
			d2 = document.createElement('a');
			d2.href = 'https://www.mountyhall.com/Forum/display_topic_threads.php?TopicID=170785';
			d2.target = 'ForumMH'
			d2.appendChild(document.createTextNode('https://www.mountyhall.com/Forum/display_topic_threads.php?TopicID=170785'));
			div.appendChild(d2);
			div.onclick = function() {
				let msg = document.getElementById('TrajetCanvasErreur');
				if (msg) document.body.removeChild(msg);
			};
			div.style.cursor = 'pointer';
			document.body.appendChild(div);
		}
	}
	//MZ_analyse_page_suivants.autoTest();
	//console.log('trajet canvas : page=' + page);
		if (MZ_analyse_page_suivants) {
			introspection();	// charger soi
			for (let oSuivant of MZ_analyse_page_suivants.suivants) {
				if (!oSuivant.oJSON.ordres) continue;
				zoom = undefined;
				TC_coeff = undefined;
				typ_gow = undefined;
				dla = undefined;
				num_gow = oSuivant.oJSON.id;
				charge_trajet();
				etapes_ini = new Array();
				arret = new Array();
				let nb_ini = 0;
				let ind_a = null;
				for (let oOrdre of oSuivant.oJSON.ordres) {
					let m = oOrdre.ordre.match(/X=\s*(-*\d+)[\s\|]*Y=\s*(-*\d+)[\s\|]*N=\s*(-*\d+)/);
					//window.console.log('analyse ordres suivant ' + oSuivant.oJSON.id + ', ' + oOrdre.ordre + ' ' + JSON.stringify(m));
					if (m && m.length == 4) {
						oOrdre.x = +m[1];
						oOrdre.y = +m[2];
						oOrdre.n = +m[3];
					}
					if (oOrdre.x !== undefined) {	// c'est un déplacement (ou ébrouage)
						etapes_ini.push([oOrdre.x, oOrdre.y, oOrdre.n, !oOrdre.ordre.match(/Déplacement/i)]);
						nb_ini++;
					} else if(oOrdre.ordre.match(/Arrêt/)) {
						//arret.push([-1, nb_ini]); ind_a = nb_ini;
						if ( nb_ini!=0 ) {arret.push([-1, nb_ini]); ind_a = nb_ini;} // correction par Vapulabehemot (82169) le 31/08/2013 
					} else {
						let point = oOrdre.ordre.match(/Suivre[\u00a0 ](.+) \(\d+\) à une distance de (\d+) case/);
						if(point) {	// si le suivant suit le Troll, on peut dessiner sa trajectoire
							//MZ_analyse_page_ordre_suivant.result.eltPos('trajet_canvas, reco suivre, soi=' + JSON.stringify(soi) + ', point=' + JSON.stringify(point));
							//window.console.log('trajet_canvas, reco suivre, soi=' + JSON.stringify(soi) + ', point=' + JSON.stringify(point));
							if(soi && soi[3] == point[1]) {
								arret.push([parseInt(point[2]), nb_ini]);
							} else {
								arret.push([-1, nb_ini]);
							}
							ind_a = nb_ini;
						}
					}
				}
				if(ind_a != nb_ini) arret.push([-1, nb_ini]);
				//window.console.log('analyse ordres suivant ' + oSuivant.oJSON.id + ', etapes_ini' + JSON.stringify(etapes_ini));
				//window.console.log('analyse ordres suivant ' + oSuivant.oJSON.id + ', arret' + JSON.stringify(arret));
				sauve_trajet();
			}
		}

		if(page == "trajet") {
			for (let ef of document.getElementsByTagName('form')) {
				if (ef.action) {
					//console.log('action=' + ef.action);
					let m = ef.action.match(/id_target=(\d+)/);
					if (m) {
						//console.log('m=' + JSON.stringify(m));
						num_gow = parseInt(m[1], 10);
						break;
					}
				}
			}
			if (num_gow != undefined && !isNaN(num_gow)) {
				haut = document;
				ini_trajet();
			}
		}
		else if(page == "suivants"){
			nbs = 0;
			let nb_liste = 0;
			let t_enreg = false, t_prev = false;
			haut = document;
			ini_position();
		}
		else if(page == "profil_gow") {
			let partd = document.getElementsByTagName('td');
			//curr = 0;
			let cadre_dla = null;
			for (let i=0;i<partd.length;i++) {
				if (partd[i].className == "mh_tdpage_fo") {
					// Roule 07/09/2019 adaptation nouvelle présentation
					let tx = partd[i].innerText;
					//window.console.log('curr=' + curr + ', partd[' + i + ']=' + tx);
					//curr++;
					// if(curr == 2) {
						// cadre_dla = partd[i];
						// break;
					// }
					if (tx.indexOf('Durée normale') >= 0) {
						cadre_dla = partd[i+1];
						break;
					}
				}
			}
			if (cadre_dla) {
				let t = document.getElementById('t_fo_profil');
				for (let ea of t.getElementsByTagName('a')) {
					if (ea.href && ea.href.indexOf('PVM') != -1) {
						num_gow = parseInt(ea.innerText, 10);
						break;
					}
				}
				if (num_gow != undefined && !isNaN(num_gow) && num_gow != 0) {
					//window.console.log('get id gowap, m=' + JSON.stringify(m) + ', num_gow=' + num_gow);
					charge_trajet();
					// Roule 07/09/2019 adaptation nouvelle présentation
					//duree = cadre_dla.getElementsByTagName('p')[0].innerHTML.match(/\d+/g);
					let duree = cadre_dla.innerText.match(/\d+/g);
					if (duree.length == 1)	// cas d'un suivant avec une durée de tour multiple exact d'heures
						dla = parseInt(duree[0])*60;
					else
						dla = parseInt(duree[0])*60+parseInt(duree[1]);
					//window.console.log('texte durée=' + cadre_dla.innerText + ', dla=' + dla);
					nb_ajout = etapes.length;
					sauve_trajet();
				} else {
					window.console.log('trajet_canvas profil_gow ERREUR num_gow=' + num_gow);
				}
			} else {
				window.console.log('trajet_canvas profil_gow ERREUR pas de cadre DLA');
			}
		}
		else if(page == "lieu_tp") {
			let sortie = null;
			haut = document;
			ini_teleport();
		}
		else if (page == "action_ordre") {
			let typ_ordre = quel_ordre(document.forms[0]);
			if(typ_ordre == 1 || typ_ordre == 7) {
				ini_fav();
			}
		}
	}
}
catch (e) { // ajout par Vapulabehemot (82169) le 30/08/2013
	window.console.error(e);
	window.alert('trajet_canvas.user.js : ' + e.message);
}