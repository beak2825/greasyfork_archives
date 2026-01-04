// ==UserScript==
// @name         MH - Feldspath - teleportation
// @namespace    MH
// @description  Aide à la création de portail, version 1.7.1.3 du 14-01-2017 par Vapulabehemot (82169)
// @include      */MH_Play/Actions/Sorts/Play_a_Sort13.php*
// @include      */MH_Play/Play_option.php*
// @include      */MH_Play/Play_vue.php*
// @icon         http://i.imgur.com/wnWRfSt.png/tout_MZ.png
// @version      1.7.1.3
// @grant        GM_getValue
// @grant        GM_setValue
// @injectframes 1
// @downloadURL https://update.greasyfork.org/scripts/405003/MH%20-%20Feldspath%20-%20teleportation.user.js
// @updateURL https://update.greasyfork.org/scripts/405003/MH%20-%20Feldspath%20-%20teleportation.meta.js
// ==/UserScript==

try { // ajout par Vapulabehemot (82169) le 11/07/2015
	var ie = (window.attachEvent)? true:false;
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
	
/* Utilisation de la gestion de l'enregistrement des données de GreaseMonkey, avec partage entre scripts via le localStorage, par Vapulabehemot (82169) */
// Nécessite la présence de @grant GM_getValue, @grant GM_deleteValue et @grant GM_setValue
function MY_getValue(key) {
	if ((GM_getValue(key) == null)
		|| (window.localStorage.getItem(key) != null && window.localStorage.getItem(key) != GM_getValue(key))){
		try {
			GM_setValue(key, JSON.parse(window.localStorage.getItem(key)));
		}
		catch(e) {
			GM_setValue(key, window.localStorage.getItem(key));
		}
	}
	return GM_getValue(key);
}
function MY_removeValue(key) {
	GM_deleteValue(key);
	window.localStorage.removeItem(key);
}
function MY_setValue(key, val) {
	GM_setValue(key, val);
	window.localStorage[key] = val;
}

	
	if("function" != typeof MY_getValue) {
		if(typeof localStorage == "object") {
			function MY_getValue(nom) {
				return localStorage.getItem(nom);
			}
			function MY_setValue(nom,valeur) {
				localStorage.setItem(nom,valeur);
			}
			if(localStorage.getItem("favori_tp") === null && "function" == typeof GM_getValue && GM_getValue("favori_tp")) localStorage.setItem("favori_tp", GM_getValue("favori_tp"));
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
				var dc = document.cookie;
				var prefix = nom + "=";
				var begin = dc.indexOf("; " + prefix);
				if (begin == -1) {
					begin = dc.indexOf(prefix);
					if (begin != 0) return "";
				}
				else
					begin += 2;
				var end = document.cookie.indexOf(";", begin);
				if (end == -1)
					end = dc.length;
				return unescape(dc.substring(begin + prefix.length, end));
			}
			function MY_setValue(nom,valeur) {
				var expdate = new Date ();
				expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000 * 31));
				var curCookie = nom + "=" + escape(valeur) + "; expires="+expdate.toGMTString();
				document.cookie = curCookie;
			}
		}
	}

	var page_tp = null;
	if (window.self.location.toString().indexOf("/mountyhall/MH_Play/Actions/Sorts/Play_a_Sort13.php") !=-1) {
	// if (window.self.location.toString().indexOf("Play_a_Sort13.php") !=-1) {
		page_tp = "action";
	}
	else if(window.self.location.toString().indexOf("/mountyhall/MH_Play/Play_option.php") !=-1) {
	// else if(window.self.location.toString().indexOf("Play_option.php") !=-1) {
		page_tp = "lieu";
	}
	else if(window.self.location.toString().indexOf("/mountyhall/MH_Play/Play_vue.php") !=-1) {
	// else if(true) {
		function aj_fav_tp() {
			var pt, x2, y2, n2;
			pt = this.parentNode.parentNode.childNodes[3].innerHTML.split("_");
			x2 = parseInt(pt[2]);
			y2 = parseInt(pt[3]);
			n2 = parseInt(pt[4]);

			var maintenant = new Date();
			if(!MY_getValue("favori_tp")) {
				MY_setValue("favori_tp", "vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+x2+"/"+y2+"/"+n2+"/");
			}
			else {
				var texte = MY_getValue("favori_tp");
				var param = texte.split("/");
				var nb_fav = Math.floor(param.length/4);
				if (param.length > 3) {
					for (var i=0; i<nb_fav; i++) {
						if(parseInt(param[4*i+1]) == x2 && parseInt(param[4*i+2]) == y2 && parseInt(param[4*i+3]) == n2) return;
					}
				}
				MY_setValue("favori_tp", texte+"vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+x2+"/"+y2+"/"+n2+"/");
			}
			document.getElementById("action_lieu").style.display = "none";
		}
		if(!document.getElementById("action_lieu")) {
			var tableau_tete = new Array();
			//var tableau = document.getElementsByTagName("p")[0].childNodes;
var tableau = document.getElementById("mhPlay").childNodes; // correction par Vapulabehemot (82169) le 11/07/2015

			var nb1 = tableau.length, nb2=0, nb3=1;

			for(var i=0; i<nb1; i++) {
				if(tableau[i].nodeName == "TABLE") {
					if(tableau[i].className == "mh_tdborder") {
						nb2++;
						if(nb2 > nb3) {
							tableau_tete[nb3] = false;
							nb3++;
						}
					}
					else {
						tableau_tete[nb3] = tableau[i];
						nb3++;
					}
				}
			}
			function prepare_click(num) {
				if(!tableau_tete[num]) return;
if ( !tableau_tete[num].getElementsByTagName("tbody")[1] ) return; // ajout par Vapulabehemot (82169) le 11/07/2015
				var tableau = tableau_tete[num].getElementsByTagName("tbody")[1].getElementsByTagName("tr");
				var nb = tableau.length;
				//if(nb > 1) {
if(nb > 0) { // correction par Vapulabehemot (82169) le 11/07/2015
					//for (var i = 1; i < nb; i++) {
for (var i = 0; i < nb; i++) { // correction par Vapulabehemot (82169) le 11/07/2015
						addEvent(tableau[i].childNodes[0], "click", function(event) { affiche_action(this, event); }, true);
						tableau[i].childNodes[0].style.cursor = "pointer";
						tableau[i].childNodes[0].id = num+"_"+i+"_";
					}
				}
			}
			function affiche_action(cible, evt) {
				var ligne = cible.parentNode;
				var nb = ligne.childNodes.length;
				var ref = cible.id+ligne.childNodes[nb-3].innerHTML+"_"+ligne.childNodes[nb-2].innerHTML+"_"+ligne.childNodes[nb-1].innerHTML;
				var cadre = document.getElementById("action_lieu");
				if (cadre.style.display == "none" || document.getElementById("action_coord").innerHTML != ref) {
					document.getElementById("action_coord").innerHTML = ref;
					cadre.style.display = "block";
					cadre.style.left = evt.clientX;
					cadre.style.top = (evt.clientY + document.body.scrollTop-20);
				}
				else {
					cadre.style.display = "none";
				}
			}

			var nvdiv = document.createElement("div");
			nvdiv.id = "action_lieu";
			nvdiv.className = "mh_tdtitre";
			nvdiv.style.display = "none";
			nvdiv.style.position = "absolute";
			nvdiv.style.padding = "1px";
			nvdiv.style.border = "1px solid";
			nvdiv.appendChild(document.createElement("span"));
			nvdiv.appendChild(document.createElement("span"));
			nvdiv.appendChild(document.createElement("span"));
			var nvsp = document.createElement("span");
			nvsp.id = "action_coord"
			nvsp.style.display = "none";
			nvdiv.appendChild(nvsp);
			document.body.appendChild(nvdiv);

			for(var i=1; i<7; i++) {
				prepare_click(i);
			}
		}
		var imag = document.createElement("img");
		imag.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAgMAAAAPhQzvAAAAAXNSR0IArs4c6QAAAAlQTFRFQAkQAAAA9vW9SDK4iQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH2wcTCQkfF7rvHgAAACxJREFUCNdjYAh1YGBgzQphYBBbtZSBQWrVSgaGqFUrHRiyVq0iRISGhjoAAG6fFUmWMrW0AAAAAElFTkSuQmCC";
		imag.id = "avec_tp";
		imag.style.cursor = "pointer";
		imag.style.marginRight = "1px";
		imag.title = "Ajouter une destination TP";
		addEvent(imag, "click", aj_fav_tp, true);
		document.getElementById("action_lieu").childNodes[1].appendChild(imag);
	}
	if(page_tp) {
		function bloc(ref) {
			nvdiv = document.createElement("div");
			nvdiv.id = ref;
			return nvdiv;
		}
		function enligne(ref) {
			nvspan = document.createElement("span");
			nvspan.id = ref;
			return nvspan;
		}
		function creer_canvas(ref) {
			var dessin = document.createElement("canvas");
			dessin.id = ref;
			return dessin;
		}
		function creer_icone(lx, ly, desc, clique) {
			var dessin = document.createElement("canvas");
			dessin.width = lx;
			dessin.height = ly;
			dessin.className = "a_cliquer";
			dessin.title = desc;
			addEvent(dessin, "click", clique, true);
			return dessin;
		}
		function dessine_svg(trace, chemin) {
			for(var i in chemin) {
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
			var div_gliss = bloc("choix_zoom_"+ref);
			div_gliss.appendChild(document.createTextNode("Zoom : "));
			div_gliss.className = "choix_zoom";
			dessin = creer_canvas("glissiere_"+ref);
			dessin.width = 104;
			dessin.height = 12;
			addEvent(dessin, "mousedown", ini_glisse, true);
			addEvent(dessin, "mousemove", sur_curseur, true);
			addEvent(dessin, "mouseout", function() { haut.getElementById("bulle_zoom").style.visibility="hidden" }, true);
			addEvent(dessin, "mouseover", function() { haut.getElementById("bulle_zoom").style.visibility="visible" }, true);
			div_gliss.appendChild(dessin);
			div_gliss.appendChild(enligne("val_zoom_"+ref));
			div_gliss.lastChild.innerHTML = val+"%";
			return div_gliss;
		}
		function dessine_glissiere(ref, val) {
			dessin = haut.getElementById("glissiere_"+ref);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
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
			return decalh+coeff*(val+100);
		}
		function coord_y(val) {
			return decalv+coeff*(100-val);
		}
		function declare_css() {
			if(haut.getElementById("css_tp")) return;
			css = "#gestion_fav_tp { position:absolute; padding: 1px; border-width:1px; border-style:solid; min-width:300px; z-index:3000; }\n#titre_fav, .fav, .fav_dessus { min-height:15px; }\n.fav  { margin:0; margin:0 0 -1px 0; padding: 1px 1px 1px 1px; border : 1px solid #a1927f; }\n.fav_dessus { margin:-1px; margin:-1px -1px -2px -1px; padding: 0px 1px 0px 1px; border : 2px solid #a1927f; }\n\n.a_cliquer { position: relative; float: right; cursor:pointer; margin-left: 2px; }\n\n#glissiere_niv, #desc_niv { position: absolute; }\n#cadre_tp { position: absolute; z-index:2500; boder-width:1px; border-style:solid; }\n#trou_tp, #sortie_tp { position: absolute; top: 0px; left: 0px; }\n#trou_fav, #trace_fav { position: absolute; top: 20px; left: 0px; }\n.choix_zoom { position: relative; margin-left:30px; margin-top:2px; }\n#glissiere_tp, #glissiere_fav { position: relative; }\n\n#bulle_tp {\n	visibility:hidden;\n	position:absolute; z-index:3500;\n	width:400px;\n	border-width:1px; border-style:solid; border-color:#a1927f;\n}\n.bulle_haut  { font-weight:bold; text-align:left; padding:2px; }\n#bulle_desc_tp { font-size:11px; padding:2px; }\n#cadre_fav { position: relative; }\n#bulle_zoom { display:block !important; visibility: hidden; position: absolute; z-index: 3500;  border : 1px solid  #a1927f; }";

			var node = document.createElement("style");
			node.type = "text/css";
			node.id = "css_tp";
			node.appendChild(document.createTextNode(css));
			haut.getElementsByTagName("head")[0].appendChild(node);
		}
		function trace_trou(ref) {
			dessin = haut.getElementById(ref);
			dessin.width = 200*coeff+2*decalh;
			dessin.height = 200*coeff+2*decalv;

			if (dessin.getContext){
				var ctx = dessin.getContext('2d');

				//repere
				ctx.beginPath();
				ctx.moveTo(100*coeff+decalh, decalv);
				ctx.lineTo(100*coeff+decalh, 200*coeff+decalv);
				ctx.moveTo(decalh, 100*coeff+decalv);
				ctx.lineTo(200*coeff+decalh, 100*coeff+decalv);
				ctx.stroke();

				ctx.strokeRect(decalh, decalv, coeff*200, coeff*200);

				//trous
				ctx.fillStyle = "rgb(200,0,0)";
				for(var i in position_trous) {
					ctx.beginPath();
					ctx.arc(coord_x(position_trous[i][0]), coord_y(position_trous[i][1]), coeff*position_trous[i][3], 0, Math.PI*2,  true);
					ctx.fill();
				}

				//depart
				if(ref == "trou_tp") {
					ctx.strokeStyle = "rgba(50,50,200,0.5)";
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.arc(coord_x(posx), coord_y(posy), 8, 0, Math.PI*2,  true);
					ctx.moveTo(coord_x(posx)-8, coord_y(posy));
					ctx.lineTo(coord_x(posx)+8, coord_y(posy));
					ctx.moveTo(coord_x(posx), coord_y(posy)-8);
					ctx.lineTo(coord_x(posx), coord_y(posy)+8);
					ctx.stroke();

					//limites
					ctx.strokeStyle = "rgba(50,50,200,0.5)";
					ctx.strokeRect(coord_x(posx-portee), coord_y(posy+portee), 2*portee*coeff, 2*portee*coeff)
					var nbz = Math.floor(portee/10.0)+1;
					ctx.strokeStyle = "rgba(50,50,200,0.1)";
					for(var i=1; i<nbz; i++) {
						larg = 10*i
						ctx.strokeRect(coord_x(posx-larg), coord_y(posy+larg), 2*larg*coeff, 2*larg*coeff)
					}
				}
			}
		}
		function trace_pos() {
			dessin = haut.getElementById("sortie_tp");
			dessin.width = 200*coeff+2*decalh;
			dessin.height = 200*coeff+2*decalv;

			dh = Math.max(Math.abs(posx-sortie[0]), Math.abs(posy-sortie[1]));
			dv = Math.abs(posn-sortie[2]);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				//favori
				if(choix_fav != -1) {
					ctx.strokeStyle = "rgba(50,150,50,0.5)";
					ctx.fillStyle = "rgba(50,150,50,0.5)";
					ctx.lineWidth = coeff;
					ctx.beginPath();
					ctx.arc(coord_x(favori[choix_fav][1]), coord_y(favori[choix_fav][2]), coeff, 0, Math.PI*2,  true);
					ctx.fill();
					ctx.beginPath();
					ctx.arc(coord_x(favori[choix_fav][1]), coord_y(favori[choix_fav][2]), 3*coeff, 0, Math.PI*2,  true);
					ctx.stroke();
				}

				ctx.lineWidth = 2;
				ctx.strokeStyle = "rgba(0,0,0,0.5)";
				larg = 3*Math.max(1, Math.floor(dh/10.0))+0.5
				ctx.strokeRect(coord_x(sortie[0]-larg), coord_y(sortie[1]+larg), 2*larg*coeff, 2*larg*coeff)
				larg += 2;
				ctx.strokeRect(coord_x(sortie[0]-larg), coord_y(sortie[1]+larg), 2*larg*coeff, 2*larg*coeff)
				ctx.beginPath();
				ctx.moveTo(coord_x(sortie[0]-larg), coord_y(sortie[1]));
				ctx.lineTo(coord_x(sortie[0]-larg)+2*larg*coeff, coord_y(sortie[1]));
				ctx.moveTo(coord_x(sortie[0]), coord_y(sortie[1]+larg));
				ctx.lineTo(coord_x(sortie[0]), coord_y(sortie[1]+larg)+2*larg*coeff);
				ctx.stroke();
			}
			calc_disp();
		}
		function trace_fav() {
			coeff = zoom_fav/50.0;
			place_fav();
			coeff = zoom/50.0;
			retrace_fav = false;
		}
		function place_fav() {
			dessin = haut.getElementById("trace_fav");
			dessin.width = 4*zoom_fav+2*decalh;
			dessin.height = 4*zoom_fav+2*decalv;

			if (nb_fav == 0) return;
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				var mini = favori[0][3], maxi = favori[0][3], couleur;
				for (var i=1; i<nb_fav; i++) {
					if(mini > favori[i][3]) mini = favori[i][3];
					if(maxi < favori[i][3]) maxi = favori[i][3];
				}
				var delta = maxi-mini;
				if(!delta) delta = 1;

				for (var i=0; i<nb_fav; i++) {
					trace_point(ctx, coord_x(favori[i][1]), coord_y(favori[i][2]), "rgb(50,"+(150-Math.round(100.0*(maxi-favori[i][3])/delta))+","+(50+Math.round(100.0*(maxi-favori[i][3])/delta))+")")
				}
				if(nv_pt !== null) {
					trace_point(ctx, coord_x(nv_pt[0]), coord_y(nv_pt[1]), "rgba(0,0,0,0.5)")
				}
			}
		}
		function trace_point(trace, xx, yy, couleur) {
			trace.strokeStyle = couleur;
			trace.fillStyle = couleur;
			trace.lineWidth = coeff;
			trace.beginPath();
			trace.arc(xx, yy, coeff, 0, Math.PI*2,  true);
			trace.fill();
			trace.beginPath();
			trace.arc(xx, yy, 3*coeff, 0, Math.PI*2,  true);
			trace.stroke();
		}
		function trace_glissiere() {
			dessine_glissiere("tp", Math.min(99,Math.max(0,Math.round(zoom/2.0)-25)));
		}
		function trace_glissiere_fav() {
			dessine_glissiere("fav", Math.min(99,Math.max(0,Math.round(zoom_fav/2.0)-25)));
		}
		function trace_glissiere_niv() {
			dessin = haut.getElementById("glissiere_niv");
			if (dessin.getContext){
				var ecart = Math.floor(Math.abs(posn-sortie[2])/5.0);
				var curseur = Math.min(99,Math.max(0,Math.round(100*(nmax-sortie[2])/(nmax-nmin))));

				var ctx = dessin.getContext('2d');
				ctx.clearRect(0, 0,12, 104);

				ctx.fillStyle = "rgb(0,0,0)";
				ctx.fillRect(0,0,12,2);
				ctx.fillRect(0,102,12,2);
				ctx.fillRect(5,0,2,104);

				ctx.fillStyle = "rgb(80,80,80)";
				ctx.fillRect(0,curseur,12,5);
				ctx.fillStyle = "rgb(200,200,200)";
				ctx.fillRect(1,curseur+1,10,3);
			}
		}
		function ini_glisse(evt) {
			if(this.id == "glissiere_tp") {
				xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
				zoom = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
				MY_setValue("zoom_tp", zoom)
				trace_glissiere();
				haut.getElementById("val_zoom_tp").innerHTML = zoom+"%";
				coeff = zoom/50.0;
				echelle_tp();
				glissable = true;
				this.style.cursor = "e-resize";
			}
			if(this.id == "glissiere_fav") {
				xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
				zoom_fav = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
				MY_setValue("zoom_fav", zoom_fav)
				trace_glissiere_fav();
				haut.getElementById("val_zoom_fav").innerHTML = zoom_fav+"%";
				echelle_fav();
			}
			else if(this.id == "glissiere_niv") {
				ypage = (evt.offsetY)? evt.offsetY:evt.layerY;
				sortie[2] = Math.min(nmax,Math.max(nmin,nmax-Math.round(ypage*(nmax-nmin)/100.0)));
				trace_glissiere_niv(); calc_disp(); deplace_noeud(sortie[0], sortie[1], sortie[2]);
				curseur = Math.min(99,Math.max(0,Math.round((nmax-sortie[2])/(nmax-nmin))));
				glisse_vert = true;
				this.style.cursor = (ypage <= (curseur+2) && ypage >= (curseur-2)) ? "n-resize":"pointer";
			}
		}
		function sur_curseur(evt) {
			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + document.body.scrollTop;
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}

			if(this.id == "glissiere_tp") {
				curseur = Math.min(100,Math.max(0,Math.round(zoom/2.0)-25))+2;
				this.style.cursor = (xpage <= (curseur+2) && xpage >= (curseur-2)) ? "e-resize":"pointer";
				val = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
			}
			else if(this.id == "glissiere_fav") {
				val = Math.min(250,Math.max(50,(xpage+23.0)*2.0))+"%";
			}
			else if(this.id == "glissiere_niv") {
				curseur = Math.min(99,Math.max(0,Math.round(100*(nmax-sortie[2])/(nmax-nmin))));
				this.style.cursor = (ypage <= (curseur+2) && ypage >= (curseur-2)) ? "n-resize":"pointer";
				val = Math.min(nmax,Math.max(nmin,nmax-Math.round(ypage*(nmax-nmin)/100.0)));
			}

			var bulle_zoom = haut.getElementById("bulle_zoom")
			bulle_zoom.style.top = (ypos+3)+'px';
			bulle_zoom.style.left = (xpos+16)+'px';
			bulle_zoom.style.visibility = "visible";
			bulle_zoom.innerHTML = val;
		}
		function glisse(evt) {
			if(glissable) {
				xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
				zoom = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
				MY_setValue("zoom_tp", zoom)
				trace_glissiere();
				haut.getElementById("val_zoom_tp").innerHTML = zoom+"%";
				coeff = zoom/50.0;
				echelle_tp();
			}
			else if(glisse_vert) {
				ypage = (evt.offsetY)? evt.offsetY:evt.layerY;
				sortie[2] = Math.min(nmax,Math.max(nmin,nmax-Math.round(ypage*(nmax-nmin)/100.0)));
				trace_glissiere_niv();
			}
		}
		function afficher_tp(evt) {
			var xpage = 0, ypage = 0, xpos = 0, ypos = 0, xs, ys;

			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + document.body.scrollTop;
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}

			xcase = Math.round((xpage-decalh)/coeff-100.0);
			ycase = Math.round(100.0-(ypage-decalv)/coeff);
			bulle.style.top = (ypos+8)+'px';
			bulle.style.left = (xpos+16)+'px';
			bulle.style.visibility = "visible";


			haut.getElementById("bulle_haut_tp").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
			desc = haut.getElementById("bulle_desc_tp");
			desc.innerHTML = "";
			for(var i in position_trous) {
				dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
				if(dist <= 0) {
					desc.appendChild(document.createTextNode(" Trous de M\u00e9t\u00e9orite : n=-1 -> n="+position_trous[i][4]));
					desc.appendChild(document.createElement("br"));
					break;
				}
			}

			haut.getElementById("sortie_tp").style.cursor = "move";
			if(bougeable) {
				xs = xcase;
				if(xs < posx-portee) xs = posx-portee;
				else if(xs > posx+portee) xs = posx+portee;
				ys = ycase;
				if(ys < posy-portee) ys = posy-portee;
				else if(ys > posy+portee) ys = posy+portee;

				deplace_noeud(xs, ys, sortie[2]);
				trace_pos();
			}
			else {
				sur_etape = false;
				if(xcase == posx && ycase == posy) {
					sur_etape = true;
					desc.appendChild(document.createTextNode(pile_depart()));
					desc.appendChild(document.createElement("br"));
				}
				if(xcase == sortie[0] && ycase == sortie[1]) {
					sur_etape = true;
					desc.appendChild(document.createTextNode(pile_sortie()));
				}

				if(!sur_etape) {
					haut.getElementById("sortie_tp").style.cursor = "";
				}
			}
		}
		function afficher_fav(evt) {
			var xpage = 0, ypage = 0, xpos = 0, ypos = 0, xs, ys;

			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + document.body.scrollTop;
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


			haut.getElementById("bulle_haut_tp").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
			desc = haut.getElementById("bulle_desc_tp");
			desc.innerHTML = "";
			for(var i in position_trous) {
				dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
				if(dist <= 0) {
					desc.appendChild(document.createTextNode(" Trous de M\u00e9t\u00e9orite : n=-1 -> n="+position_trous[i][4]));
					desc.appendChild(document.createElement("br"));
					break;
				}
			}

			for(var i=0; i<nb_fav; i++) {
				if(xcase == favori[i][1] && ycase == favori[i][2]) {
					haut.getElementById("fav_tp_"+i).className = "fav_dessus";
					desc.appendChild(document.createTextNode(protege_texte(favori[i][0]+" (n = "+favori[i][3]+")")));
					desc.appendChild(document.createElement("br"));
				}
				else {
					haut.getElementById("fav_tp_"+i).className = "fav";
				}
			}
		}
		function calc_disp() {
			dh = Math.max(Math.abs(posx-sortie[0]), Math.abs(posy-sortie[1]));
			dv = Math.abs(posn-sortie[2]);
			bm = Math.max(Math.floor(Math.max(dh, dv)/10.0),1);
			bmf = Math.max(Math.floor(Math.max(dh, dv)/5.0),1);
			haut.getElementById("detail").innerHTML = "Distance horizontale : "+dh+", dispertion : "+3*Math.max(1, Math.floor(dh/10.0))+"+2<br />Distance verticale : "+dv+", dispertion : "+Math.max(1, Math.floor(dv/5.0))+"+1<br />Desorientation : attaque -"+bm+"D6, esquive -"+bm+"D6, fatigue : +"+bmf ;
		}
		function deplace_noeud(xx, yy, nn) {
			sortie = [xx, yy, nn];
			document.forms[0].elements[1].value = xx;
			document.forms[0].elements[2].value = yy;
			document.forms[0].elements[3].value = nn;
		}
		function pile_depart() {
			haut.getElementById("bulle_haut_tp").innerHTML += ", n = "+posn;
			texte = "Entree";
			return texte;
		}
		function pile_sortie() {
			haut.getElementById("bulle_haut_tp").innerHTML += ", n = "+sortie[2];
			texte = "sortie_tp";
			return texte;
		}
		function start_t(evt){
			bougeable = true;
			afficher_tp(evt);
		}
		function drop_t() {
			glissable = false;
			glisse_vert = false;
			bougeable = false;
		}
		function cacher_bulle(etat) {
			bulle.style.visibility = etat? "hidden":"visible";
		}
		function ini_tp() {
			if(!cadrable) return;

			haut = window.parent.frames[0].document;

			if(haut.getElementById("cadre_tp")) {
				cadre = haut.getElementById("cadre_tp");
				if(cadre.style.display != "none"  && initialise) {
					cadre.style.display = "none";
					return;
				}
				cadre.style.display = "block";
				cadre.style.top = (haut.body.scrollTop+2)+"px";
				cadre.style.left = (haut.body.scrollLeft+2)+"px";
				echelle_tp(); trace_glissiere_niv();
				return;
			}
			declare_css();

			cadre = bloc("cadre_tp");
			cadre.className = "mh_tdpage";
			cadre.style.top = (haut.body.scrollTop+2)+"px";
			cadre.style.left = (haut.body.scrollLeft+2)+"px";
			cadre.style.display = "block";

			var fermer = creer_icone(15, 15, "Fermer", function() { this.parentNode.style.display = "none" });
			dessine_fermer(fermer);
			cadre.appendChild(fermer);
			cadre.appendChild(bloc("detail"));

			trajet = bloc("carte_tp");
			trajet.style.position = "absolute";

			trajet.appendChild(creer_canvas("trou_tp"));
			var dessin = creer_canvas("sortie_tp");
			addEvent(dessin, "mousedown", start_t, true);
			addEvent(haut, "mouseup", drop_t, true);
			addEvent(haut, "mousemove", glisse, true);
			addEvent(dessin, "mousemove", afficher_tp, true);
			addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
			addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
			trajet.appendChild(dessin);

			trajet.appendChild(creer_glissiere("tp", zoom));

			dessin = creer_canvas("glissiere_niv");
			dessin.width = 12;
			dessin.height = 104;
			dessin.style.top = decalv+"px";
			addEvent(dessin, "mousedown", ini_glisse, true);
			addEvent(dessin, "mousemove", sur_curseur, true);
			addEvent(dessin, "mouseout", function() { haut.getElementById("bulle_zoom").style.visibility="hidden" }, true);
			addEvent(dessin, "mouseover", function() { haut.getElementById("bulle_zoom").style.visibility="visible" }, true);
			trajet.appendChild(dessin);
			nvspan = enligne("desc_niv");
			nvspan.appendChild(document.createTextNode("n"));
			nvspan.style.top = (decalv-17)+"px";
			trajet.appendChild(nvspan);

			cadre.appendChild(trajet);
			haut.body.appendChild(cadre);

			trace_glissiere();
			trace_glissiere_niv();
			creer_bulle_tp(); creer_bulle_zoom();
			echelle_tp();
		}
		function dessine_fermer(dessin) {
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				ctx.lineCap = "round"
				ctx.strokeStyle = "rgb(80,80,80)";
				ctx.lineWidth = "1.5";
				dessine_svg(ctx, data_svg["fermer"]);
				ctx.stroke();
			}
		}
		function creer_bulle_tp() {
			if(haut.getElementById("bulle_tp")) return;
			haut.body.appendChild(bloc("bulle_tp"));
			bulle = haut.getElementById("bulle_tp");
			bulle.className = "mh_tdtitre";
			nvdiv = bloc("mobile_bulleVue_tp");
			nvdiv.className = "bulle_haut_tp";
			nvdiv.appendChild(enligne("bulle_haut_tp"));
			bulle.appendChild(nvdiv);
			bulle.appendChild(bloc("bulle_desc_tp"));
			bulle.lastChild.className = "mh_tdpage";
		}
		function creer_bulle_zoom() {
			if(haut.getElementById("bulle_zoom")) return;
			var bulle_fav = bloc("bulle_zoom");
			bulle_fav.className = "mh_tdpage";
			haut.body.appendChild(bulle_fav);
		}
		function echelle_tp() {
			haut.getElementById("cadre_tp").style.height = (200*coeff+2*decalv+70)+"px";
			haut.getElementById("cadre_tp").style.minWidth = (200*coeff+2*decalh+35)+"px";
			haut.getElementById("glissiere_niv").style.left = (200*coeff+2*decalh+10)+"px";
			haut.getElementById("desc_niv").style.left = (200*coeff+2*decalh+10)+"px";
			trace_trou("trou_tp");
			trace_pos();
		}
		function echelle_fav() {
			coeff = zoom_fav/50.0;
			haut.getElementById("liste_fav_tp").style.marginLeft = (4*zoom_fav+2*decalh+5)+"px";
			haut.getElementById("cadre_fav").style.minHeight = (4*zoom_fav+2*decalv+40)+"px";
			var gestion = haut.getElementById("gestion_fav_tp");
			gestion.style.left = Math.max(1, haut.body.clientWidth+haut.body.scrollLeft-2-gestion.offsetWidth)+"px";
			trace_trou("trou_fav");
			place_fav();
			coeff = zoom/50.0;
		}
		function modif_coord() {
			if(isNaN(this.value)) return;

			if(this.name == "ai_OrigineX") sortie[0] = parseInt(this.value);
			else if(this.name == "ai_OrigineY") sortie[1] = parseInt(this.value);
			else sortie[2] = parseInt(this.value);

			haut = window.parent.frames[0].document;
			if(haut.getElementById("cadre_tp") && haut.getElementById("cadre_tp").style.dsiplay != "none") {
				if(this.name == "ai_OrigineN") {
					trace_glissiere_niv(); calc_disp();
				}
				else {
					trace_pos();
				}
			}
		}
		//Gestion des favoris
		function ini_gestion() {
			haut = (page_tp == "action")? window.parent.frames[0].document:document;
			if(MY_getValue("zoom_fav")) {
				zoom_fav = parseFloat(MY_getValue("zoom_fav"))
			}
			if (!haut.getElementById("gestion_fav_tp")) {
				declare_css();
				gestion = bloc("gestion_fav_tp");
				gestion.className = "mh_tdpage";

				var nvdiv = bloc("titre_fav");
				nvdiv.className = "mh_tdtitre";
				nvdiv.appendChild(document.createTextNode("Gestion des destinations favorites"));
				var fermer = creer_icone(15, 15, "Fermer", function() { this.parentNode.parentNode.style.visibility = "hidden" });
				dessine_fermer(fermer);
				nvdiv.appendChild(fermer);
				gestion.appendChild(nvdiv);
				var carte_fav = bloc("cadre_fav");

				carte_fav.appendChild(creer_canvas("trou_fav"));
				var dessin = creer_canvas("trace_fav");
				addEvent(haut, "mouseup", drop_t, true);
				addEvent(haut, "mousemove", glisse, true);
				addEvent(dessin, "mousemove", afficher_fav, true);
				addEvent(dessin, "click", aj_pos, true);
				addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
				addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
				carte_fav.appendChild(dessin);

				carte_fav.appendChild(creer_glissiere("fav", zoom_fav));
				carte_fav.appendChild(bloc("liste_fav_tp"));
				gestion.appendChild(carte_fav);
				haut.body.appendChild(gestion);

				trace_glissiere_fav();
				creer_bulle_tp();
				creer_bulle_zoom();
			}
			else if(haut.getElementById("gestion_fav_tp").style.visibility == "visible") {
				haut.getElementById("gestion_fav_tp").style.visibility = "hidden";
				return;
			}
			charger_fav();
			gerer_fav(); echelle_fav(); poser_fav();
		}
		function ini_edition() {
			haut = document;
			declare_css();
			var image = document.createElement("img");
			image.src = data_img["fav_tp"];
			image.className = "a_cliquer";
			image.id = "favoris_tp";
			image.title = "Gerer les destinations favorites pour TP";
			addEvent(image, "click", ini_gestion, true);

			document.getElementsByTagName("b")[0].parentNode.appendChild(image);
		}
		function gerer_fav() {
			var gestion = haut.getElementById("gestion_fav_tp");
			gestion.style.visibility = "visible";

			var liste_fav = haut.getElementById("liste_fav_tp");
			liste_fav.innerHTML = "";
			for(var i=0; i<nb_fav; i++) {
				liste_fav.appendChild(bloc("fav_tp_"+i));
				aff_fav(i);
			}
			aj_edit();
		}
		function poser_fav() {
			var gestion = haut.getElementById("gestion_fav_tp");
			if(page_tp == "action") {
				gestion.style.top = Math.max(1, haut.body.clientHeight+haut.body.scrollTop-2-gestion.offsetHeight)+"px";
			}
			else {
				var noeud = document.getElementById("favoris_tp");
				var ecart = noeud.offsetHeight+1;
				while(noeud.offsetParent) {
					ecart += noeud.offsetTop;
					noeud = noeud.offsetParent;
				}
				gestion.style.top = ecart+"px";
			}
			gestion.style.left = Math.max(1, haut.body.clientWidth+haut.body.scrollLeft-2-gestion.offsetWidth)+"px";
		}
		function aff_fav(rg) {
			var fav = haut.getElementById("fav_tp_"+rg);
			fav.innerHTML = "";
			fav.className = "fav";
			var texte = protege_texte(favori[rg][0])+" ("+favori[rg][1]+", "+favori[rg][2]+", "+favori[rg][3]+")";
			fav.appendChild(document.createTextNode(texte));

			dessin = creer_icone(11, 12, "Supprimer "+texte,effacer_fav);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(200,100,100)";
				ctx.lineCap = "round";
				ctx.lineWidth = "2";
				dessine_svg(ctx, data_svg["suppr"]);
				ctx.stroke();
			}
			fav.appendChild(dessin);

			dessin = creer_icone(12, 12, "Editer "+texte, editer_fav);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(30,30,30)";
				ctx.fillStyle = "rgb(180,180,180)";
				var echelle = 12.0/21.0;
				ctx.scale(echelle, echelle);
				ctx.lineWidth = "1";
				dessine_svg(ctx, data_svg["param"]);
				ctx.stroke();
				ctx.fill();
			}
			fav.appendChild(dessin);

			dessin = creer_icone(11, 12, "Descendre "+texte, descendre_fav);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				ctx.fillStyle = "rgb(100,170,100)";
				dessine_svg(ctx, data_svg["descendre"]);
				ctx.fill();
			}
			if(rg == nb_fav-1) dessin.style.visibility = "hidden";
			fav.appendChild(dessin);

			dessin = creer_icone(11, 12, "Monter "+texte, monter_fav);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				ctx.fillStyle = "rgb(100,170,100)";
				dessine_svg(ctx, data_svg["monter"]);
				ctx.fill();
			}
			fav.appendChild(dessin);
			if(rg == 0) dessin.style.visibility = "hidden";
		}
		function monter_fav() {
			var ref = parseInt(this.parentNode.id.split("_")[2])

			var temp = favori[ref-1];
			favori[ref-1] = favori[ref];
			favori[ref] = temp;
			sauver_fav(); lister_fav(); gerer_fav();
		}
		function descendre_fav() {
			var ref = parseInt(this.parentNode.id.split("_")[2]);

			var temp = favori[ref+1];
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
			var rg = parseInt(this.parentNode.id.split("_")[2]);
			var fav = haut.getElementById("fav_tp_"+rg);
			fav.innerHTML = "";
			fav.appendChild(document.createTextNode("Description : "));
			entree = document.createElement("input");
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

			for (var i=0; i<4; i++) {
				fav.getElementsByTagName("input")[i].value = favori[rg][i];
			}

			dessin = creer_icone(20, 20, "Annuler", annuler_edit);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
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
				var ctx = dessin.getContext('2d');
				ctx.strokeStyle = "rgb(50,120,50)";
				ctx.lineWidth = "4";
				ctx.arc(10, 10, 7.5, 0, Math.PI*2,  true);
				ctx.stroke();
			}
			dessin.style.verticalAlign = "text-bottom";
			fav.appendChild(dessin);
		}
		function aj_edit() {
			var fav = bloc("fav_tp_"+nb_fav);
			fav.appendChild(document.createElement("br"));
			fav.appendChild(document.createElement("br"));
			fav.appendChild(document.createTextNode("Description : "));
			entree = document.createElement("input");
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

			dessin = creer_icone(21, 21, "Ajouter", aj_fav);
			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				ctx.lineCap = "round"
				ctx.strokeStyle = "rgb(50,120,50)";
				ctx.lineWidth = "2.5";
				dessine_svg(ctx, data_svg["plus"]);
				ctx.stroke();
			}
			dessin.style.verticalAlign = "text-bottom";
			fav.appendChild(dessin);

			haut.getElementById("liste_fav_tp").appendChild(fav);
		}
		function aj_fav() {
			if(nb_fav > 0 && haut.getElementById("fav_tp_"+(nb_fav-1)).getElementsByTagName("canvas").length > 3) haut.getElementById("fav_tp_"+(nb_fav-1)).getElementsByTagName("canvas")[2].style.visibility = "visible";
			var xx = entier(this.parentNode.getElementsByTagName("input")[1].value);
			var yy = entier(this.parentNode.getElementsByTagName("input")[2].value);
			var nn = entier(this.parentNode.getElementsByTagName("input")[3].value);
			favori[nb_fav] = [protege(this.parentNode.getElementsByTagName("input")[0].value), xx, yy, nn];
			nb_fav++;
			nv_pt = null;
			sauver_fav(); lister_fav();
			aff_fav(nb_fav-1);
			aj_edit();
			trace_fav();
		}
		function aj_pos(evt) {
			var xpage = 0, ypage = 0, xpos = 0, ypos = 0, xs, ys;

			if (evt.offsetX) {
				xpage = evt.offsetX;
				ypage = evt.offsetY;
				xpos = evt.clientX;
				ypos = evt.clientY + document.body.scrollTop;
			}
			else {
				xpage = evt.layerX;
				ypage = evt.layerY;
				xpos = evt.pageX;
				ypos = evt.pageY;
			}

			xcase = Math.round(50*(xpage-decalh)/zoom_fav-100.0);
			ycase = Math.round(100.0-50*(ypage-decalv)/zoom_fav);

			var ligne = haut.getElementById("fav_tp_"+nb_fav);
			ligne.getElementsByTagName("input")[1].value = xcase;
			ligne.getElementsByTagName("input")[2].value = ycase;
			nv_pt = [xcase, ycase];
			trace_fav();
			retrace_fav = true;
		}
		function nvl_entree() {
			var entree = document.createElement("input");
			entree.maxLength = "4";
			entree.size = "8";
			entree.className = "TextareaboxV2";
			addEvent(entree, "keyup", modif_edit, true);
			addEvent(entree, "change", modif_edit, true);
			return entree;
		}
		function valider_edit() {
			var ref = parseInt(this.parentNode.id.split("_")[2]);
			var xx = entier(this.parentNode.getElementsByTagName("input")[1].value);
			var yy = entier(this.parentNode.getElementsByTagName("input")[2].value);
			var nn = entier(this.parentNode.getElementsByTagName("input")[3].value);
			retrace_fav = (retrace_fav || favori[ref][1] != xx || favori[ref][2] != yy);
			favori[ref] = [protege(this.parentNode.getElementsByTagName("input")[0].value), xx, yy, nn];
			nv_pt = null;
			sauver_fav(); lister_fav();
			aff_fav(ref);
			if(retrace_fav) trace_fav();
		}
		function modif_edit() {
			var xx = entier(this.parentNode.getElementsByTagName("input")[1].value);
			var yy = entier(this.parentNode.getElementsByTagName("input")[2].value);
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
			if(page_tp == "action") {
				choix = document.getElementById("sel_fav");
			}
			else if(cadrable && window.parent.frames[1].document.getElementById("sel_fav")) {
				choix = window.parent.frames[1].document.getElementById("sel_fav");
			}
			else { return; }

			choix.innerHTML = "";
			choix_fav = -1;
			var opt = document.createElement("option");
			opt.innerHTML = "Destinations favorites";
			opt.value = -1;
			choix.appendChild(opt);
			for (var i=0; i<nb_fav; i++) {
				opt = document.createElement("option");
				opt.innerHTML = protege_sel(favori[i][0])+" ("+favori[i][1]+", "+favori[i][2]+", "+favori[i][3]+")";
				opt.value = i
				choix.appendChild(opt);
			}
		}
		function ini_fav() {
			var nvdiv = bloc("div_fav");
			nvdiv.className = "mh_tdpage";
			var choix = document.createElement("select");
			choix.id = "sel_fav";
			choix.style.verticalAlign = "top";
			addEvent(choix, "keyup", changer_fav, true);
			addEvent(choix, "change", changer_fav, true);
			nvdiv.appendChild(choix);
			if(cadrable) {
				var dessin = creer_icone(21, 21, "Gerer les destinations favorites", ini_gestion);
				if (dessin.getContext){
					var ctx = dessin.getContext('2d');
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

				var carte = document.createElement("img");
				carte.src = data_img["carte"];
				carte.id = "lance_carte";
				addEvent(carte, "click", ini_tp, true);
				carte.title = "Ouvrir la carte";
				carte.style.cursor = "pointer";
				nvdiv.appendChild(carte);

			}
			nvdiv.style.position = "absolute";
			nvdiv.style.top = "2px";
			nvdiv.style.right = "2px";
			nvdiv.style.padding = "1px";

			document.body.appendChild(nvdiv);
			lister_fav();
		}
		function changer_fav() {
			choix_fav = parseInt(this.value);
			if(choix_fav == -1) {
				if(cadrable) trace_pos();
				return;
			}
			charger_fav();
			
			var xx = favori[choix_fav][1];
			if(xx < posx-portee) xx = posx-portee;
			else if(xx > posx+portee) xx = posx+portee;

			var yy = favori[choix_fav][2];
			if(yy < posy-portee) yy = posy-portee;
			else if(yy > posy+portee) yy = posy+portee;

			var nn = favori[choix_fav][3];
			if(nn < nmin) nn = nmin;
			else if(nn > nmax) nn = nmax;

			document.forms[0].elements[1].value = xx;
			document.forms[0].elements[2].value = yy;
			document.forms[0].elements[3].value = nn;

			if(cadrable) {
				sortie = [xx, yy, nn];
				haut = window.parent.frames[0].document;
				if(haut.getElementById("cadre_tp") && haut.getElementById("cadre_tp").style.display != "none") {
					trace_glissiere_niv(); trace_pos();
				}
			}
		}

		function compare_fav() {
			for(var i=0; i<nb_fav; i++) {
				if (sortie[0] == favori[i][1] && sortie[1] == favori[i][2] && sortie[2] == favori[i][3]) {
					document.getElementById("sel_fav").value = i;
					break;
				}
			}
		}
		function sauver_fav() {
			var texte = "";
			for (var i=0; i<nb_fav; i++) {
				texte += favori[i][0]+"/"+favori[i][1]+"/"+favori[i][2]+"/"+favori[i][3]+"/";
			}
			MY_setValue("favori_tp", texte);
		}
		function charger_fav() {
			if(!MY_getValue("favori_tp")) return;
			var param = MY_getValue("favori_tp").split("/");
			nb_fav = Math.floor(param.length/4);
			if (param.length > 3) {
				for (var i=0; i<nb_fav; i++) {
					favori[i] = [param[4*i], parseInt(param[4*i+1]), parseInt(param[4*i+2]), parseInt(param[4*i+3])];
				}
			}
		}
		////////////////////////////////////////////////////////////

		var data_img = new Array();
		var data_svg = new Array();
		data_svg["fermer"] = [[3,7, 7, 6.5],[0,4.5, 4.5],[1,9.5, 9.5],[0,9.5, 4.5],[1,4.5, 9.5]];
		data_svg["param"] = [[0, 2.69,15.81], [2, 4.037,14.58, 6.07,17.356, 5.21,18.24], [1, 3.35,20.11 ], [2, 5.53,22.31, 9.31,17.555 ,7.51,15.78 ], [1, 15.78,7.49 ], [2, 18,9.5, 22.05,5.02, 20.21,3.14], [1, 18.21,5.07 ], [2, 16.84,6.41, 14.72,4.1, 15.95,2.9 ], [1, 18.01,0.93 ], [2, 15.63,-1.34, 11.42,3.33, 13.46,5.26 ], [1, 5.17,13.48 ], [2, 2.88,11.66, -1.11,15.77, 0.82,17.65]];
		data_svg["descendre"] = [[0,5,11],[1,10,6],[1,7,6],[1,7,0],[1,3,0],[1,3,6],[1,0,6]];
		data_svg["monter"] = [[0,5,0],[1,10,5],[1,7,5],[1,7,11],[1,3,11],[1,3,5],[1,0,5],[1,5,0]];
		data_svg["plus"] = [[3,10,10,9],[0,5,10],[1,15,10],[0,10,5],[1,10,15]];
		data_svg["suppr"] = [[0,0,0],[1,10,11],[0,10,0],[1,0,11]];
		data_svg["annuler"] = [[0, 1,1], [1, 18,18], [0, 19,1], [1, 1,18]];

		var coeff=2, decalv=30, decalh=30;
		var position_trous = [[-70.5, -7.5, 2, 1.5, -69],
							 [-66.5, -37.5, 2, 1.5, -69],
							 [-63.5, 8.5, 2, 1.5, -69],
							 [-59.5, -32.5, 2, 1.5, -69],
							 [-52, 57, 0.25, 0.8, -59],
							 [-50.5, -22.5, 2, 1.5, -69],
							 [-35.5, -51.5, 2, 1.5, -69],
							 [-34.5, 14.5, 2, 1.5, -69],
							 [-34.5, 64.5, 2, 1.5, -69],
							 [-11.5, 72.5, 2, 1.5, -69],
							 [5.5, -49.5, 2, 1.5, -69],
							 [5.5, 31.5, 2, 1.5, -69],
							 [10.5, 63.5, 2, 1.5, -69],
							 [12, -15, 0.25, 0.8, -59],
							 [21.5, 35.5, 2, 1.5, -69],
							 [30, -52, 0.25, 0.8, -59],
							 [46.5, 51.5, 2, 1.5, -69],
							 [48, -39, 0.25, 0.8, -59],
							 //[55, 70, 0.25, 0.8, -69],
							 [55, 70, 0.25, 0.8, -59], // modif Vapulabehemot (reprise de la modification du script trajet_canvas)
							 [56.5, 23.5, 75, 8.7, -99],
							 [64, 70, 0.25, 0.8, -59],
							 [74.5, 31.5, 2, 1.5, -69]];
		var bulle = null;
		var favori = new Array(), nb_fav=0, nv_pt = null, retrace_fav = false;
		var haut = null;
		var cadrable = window.parent && window.parent.frames.length > 1 && window.parent.frames[0].document;
		var zoom_fav = 100;

		if(page_tp == "action") {
			if(cadrable) {
				data_img["carte"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAAXNSR0IArs4c6QAAACRQTFRFZBcScyYjTEU/dm1hk4J4pZSJyban3Me25dC/8dvL/uHS/OfWEvrSsAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADeUAAA3lAebqaa8AAAAHdElNRQfaCxMTKRANnM4vAAAAiUlEQVQY02NgFIQDAQbp3btWz1w5EwQ2MkhXdHSUA8HMmTMmMkh3794NRDt2796JxpHCwVmIrGwhgyTQNCBqB6KJDJLVMJntQD0gzs4yCAcss9kNygEboIrMMY0AchZCOdErIDLIRkvNhhm9YyODJDGchWgyUG8DTQOGwa7du3ev3g0CGxmQgwoAO1+fU9dLcv4AAAAASUVORK5CYII=";

				var sortie = new Array();
				var bougeable = false, glissable = false, glisse_vert = false, initialise = false;
				var zoom=100;
				var choix_fav=-1;
				if(MY_getValue("zoom_tp")) {
					zoom = parseFloat(MY_getValue("zoom_tp"));
					coeff = zoom/50.0;
				}

				var ecart = document.forms[0].elements[1].parentNode.innerHTML.match(/Entre (-?\d+) et (-?\d+)/)
				var portee = (parseInt(ecart[2])-parseInt(ecart[1]))/2;
				var posx = (parseInt(ecart[2])+parseInt(ecart[1]))/2;
				ecart = document.forms[0].elements[2].parentNode.innerHTML.match(/Entre (-?\d+) et (-?\d+)/)
				var posy = (parseInt(ecart[2])+parseInt(ecart[1]))/2;
				ecart = document.forms[0].elements[3].parentNode.innerHTML.match(/Entre (-?\d+) et (-?\d+)/)
				var nmin = parseInt(ecart[1]), nmax = parseInt(ecart[2]);
				var posn = (nmax == 0 && window.parent.parent)? parseInt(window.parent.parent.frames[0].document.getElementsByTagName('div')[1].innerHTML.match(/X=-?\d+\|Y=-?\d+\|N=(-?\d+)/)[1]) : Math.ceil((nmin+nmax)/2);

				for(var i=0; i<3; i++) {
					addEvent(document.forms[0].elements[i+1], "change", modif_coord, true);
					addEvent(document.forms[0].elements[i+1], "keyup", modif_coord, true);
				}
				sortie = [posx, posy, posn];
				ini_tp();
			}
			charger_fav();
			ini_fav();
			initialise = true;
		}
		else if(page_tp == "lieu") {
			data_img["fav_tp"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWBAMAAAAoU0G7AAAAAXNSR0IArs4c6QAAADBQTFRF7wkBdCYjj1BLllhSgnFoqI0IxLGjxcYC181S3s6J49Gf6NLB4eI98Nyk+uTT8PRkk1tcDwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAn8AAAJ/AGqdR8rAAAAB3RJTUUH2gseDxk7mTCDVQAAAIlJREFUGFdjYGBgZ0AC5QVInJrjDAxwfs2fcoRk/f//3wMFgUAAqP88kLMbBDYxsNf8////BJRTfh7E2ffu9bt3mxjAvO/roBwGoLo/dXAO0OgqiB4GBp7j697Og8mwF+97ty8tG8phBnKeQDkMIM6zNBgne/fubVADwDIwA4jmgN0MNYDJGAIMAfWFfzRLXt4tAAAAAElFTkSuQmCC";
			ini_edition();
		}
	}
}
catch (e) { // ajout par Vapulabehemot (82169) le 11/07/2015
	window.alert('teleportation.user.js : ' + e.message);
}	