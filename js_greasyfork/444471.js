// ==UserScript==
// @name         Vuldb cvss v2 blur translation
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  permet de retirer le flou Vuldb et les lien "pay" ; ajoute également le score et la cartouche CVSS v2
// @author       Delanoy Cyril
// @match        https://vuldb.com/ar/?id.*
// @match        https://vuldb-com.translate.goog/ar/?id.*
// @match        https://vuldb.com/?id.*
// @match        https://vuldb-com.translate.goog/?id.*
// @match        https://vuldb.com/de/?id.*
// @match        https://vuldb-com.translate.goog/de/?id.*
// @match        https://vuldb.com/en/?id.*
// @match        https://vuldb-com.translate.goog/en/?id.*
// @match        https://vuldb.com/es/?id.*
// @match        https://vuldb-com.translate.goog/es/?id.*
// @match        https://vuldb.com/fr/?id.*
// @match        https://vuldb-com.translate.goog/fr/?id.*
// @match        https://vuldb.com/it/?id.*
// @match        https://vuldb-com.translate.goog/it/?id.*
// @match        https://vuldb.com/ja/?id.*
// @match        https://vuldb-com.translate.goog/ja/?id.*
// @match        https://vuldb.com/ko/?id.*
// @match        https://vuldb-com.translate.goog/ko/?id.*
// @match        https://vuldb.com/pl/?id.*
// @match        https://vuldb-com.translate.goog/pl/?id.*
// @match        https://vuldb.com/pt/?id.*
// @match        https://vuldb-com.translate.goog/pt/?id.*
// @match        https://vuldb.com/ru/?id.*
// @match        https://vuldb-com.translate.goog/ru/?id.*
// @match        https://vuldb.com/sv/?id.*
// @match        https://vuldb-com.translate.goog/sv/?id.*
// @match        https://vuldb.com/zh/?id.*
// @match        https://vuldb-com.translate.goog/zh/?id.*
// @include       ^https?:\/\/vuldb\.com(\/[a-z]{2}){0,1}\/\?id\.(.*)
// @include      https://vuldb.com/de/?id*
// @include      ^https?:\/\/vuldb\-com\.translate\.goog(\/[a-z]{2}){0,1}\/\?id\.(.*)
// @match        https://vuldb.com/?search*
// @icon         https://vuldb.com/_thm/vuldb.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444471/Vuldb%20cvss%20v2%20blur%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/444471/Vuldb%20cvss%20v2%20blur%20translation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // v0.11 ajout de la langue SV et PT
    // v0.18 : ajout en test d'un résumé dans la banière
    //         objectif pouvoir savoir rapidement la criticité, à terme les scores seront copiable


	// #region DECLARATION de dictionnaire
		var th_to_english = new Map();
			fill_th_to_english();
			function fill_th_to_english(){
                // liste des extensions ['', 'ar', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'sv', 'zh']
                //ar
				th_to_english.set("متجه","Vector");
				th_to_english.set("التعقيد","Complexity");
				th_to_english.set("توثيق","Authentication");
				th_to_english.set("السرية","Confidentiality");
				th_to_english.set("الأمانة","Integrity");
				th_to_english.set("التوفر","Availability");

                //de
				th_to_english.set("Vektor","Vector"); // de
				th_to_english.set("Komplexität","Complexity"); // de
				th_to_english.set("Authentisierung","Authentication"); // de
				th_to_english.set("Vertraulichkeit","Confidentiality"); // de
				th_to_english.set("Integrität","Integrity"); // de
				th_to_english.set("Verfügbarkeit","Availability"); // de

                //en
				th_to_english.set("Vector","Vector"); //en
				th_to_english.set("Complexity","Complexity"); //en
				th_to_english.set("Authentication","Authentication"); //en
				th_to_english.set("Confidentiality","Confidentiality"); //en
				th_to_english.set("Integrity","Integrity"); //en
				th_to_english.set("Availability","Availability"); //en

                //es
				th_to_english.set("Vector","Vector");
				th_to_english.set("Complejidad","Complexity");
				th_to_english.set("Autenticación","Authentication");
				th_to_english.set("Confidencialidad","Confidentiality");
				th_to_english.set("Integridad","Integrity");
				th_to_english.set("Disponibilidad","Availability");

                //fr
				th_to_english.set("Vecteur","Vector"); //fr
				th_to_english.set("Complexité","Complexity"); //fr
				th_to_english.set("Authentification","Authentication"); //fr
				th_to_english.set("Confidentialité","Confidentiality"); //fr
				th_to_english.set("Intégrité","Integrity"); //fr
				th_to_english.set("Disponibilité","Availability"); //fr

                //it
				th_to_english.set("Vettore","Vector");
				th_to_english.set("Complessità","Complexity");
				th_to_english.set("Autenticazione","Authentication");
				th_to_english.set("Riservatezza","Confidentiality");
				th_to_english.set("Integrità","Integrity");
				th_to_english.set("Disponibilità","Availability");

                //ja
				th_to_english.set("方向性","Vector");
				th_to_english.set("複雑度","Complexity");
				th_to_english.set("認証","Authentication");
				th_to_english.set("守秘義務性","Confidentiality");
				th_to_english.set("誠実性","Integrity");
				th_to_english.set("可用性","Availability");

                //ko
				th_to_english.set("벡터","Vector");
				th_to_english.set("복잡성","Complexity");
				th_to_english.set("입증","Authentication");
				th_to_english.set("기밀성","Confidentiality");
				th_to_english.set("진실성","Integrity");
				th_to_english.set("유효성","Availability");

                //pl
				th_to_english.set("Wektor","Vector");
				th_to_english.set("Możliwość wykorzystania","Complexity");
				th_to_english.set("Uwierzytelnianie","Authentication");
				th_to_english.set("Poufność","Confidentiality");
				th_to_english.set("Integralność","Integrity");
				th_to_english.set("Dostępność","Availability");

                //pt
				th_to_english.set("Vector","Vector");
				th_to_english.set("Complexidade","Complexity");
				th_to_english.set("Autenticação","Authentication");
				th_to_english.set("Confidencialidade","Confidentiality");
				th_to_english.set("Integridade","Integrity");
				th_to_english.set("Disponibilidade","Availability");

                //ru
				th_to_english.set("Вектор","Vector");
				th_to_english.set("Сложность","Complexity");
				th_to_english.set("Аутентификация","Authentication");
				th_to_english.set("Конфиденциальность","Confidentiality");
				th_to_english.set("Целостность","Integrity");
				th_to_english.set("Доступность","Availability");

                //sv
				th_to_english.set("Vektor","Vector"); // sv
				th_to_english.set("Komplexitet","Complexity"); // sv
				th_to_english.set("Autentisering","Authentication"); // sv
				th_to_english.set("Sekretess","Confidentiality"); // sv
				th_to_english.set("Integritet","Integrity"); // sv
				th_to_english.set("Tillgänglighet","Availability"); // sv

                //zh
				th_to_english.set("向量","Vector");
				th_to_english.set("复杂度","Complexity");
				th_to_english.set("身份验证","Authentication");
				th_to_english.set("保密","Confidentiality");
				th_to_english.set("正直","Integrity");
				th_to_english.set("可用性","Availability");
			}

		var vuldb_to_cvss = new Map();
			fill_vuldb_to_cvss();
			function fill_vuldb_to_cvss(){
				// en
					vuldb_to_cvss.set("Vector",new Map());
						(vuldb_to_cvss.get("Vector")).set("name","AV");
						(vuldb_to_cvss.get("Vector")).set("low","L");
						(vuldb_to_cvss.get("Vector")).set("medium","A");
						(vuldb_to_cvss.get("Vector")).set("high","N");
						(vuldb_to_cvss.get("Vector")).set(1,"Local");
						(vuldb_to_cvss.get("Vector")).set(2,"Adjacant Net");
						(vuldb_to_cvss.get("Vector")).set(3,"Network");

					vuldb_to_cvss.set("Complexity",new Map());
						(vuldb_to_cvss.get("Complexity")).set("name","AC");
						(vuldb_to_cvss.get("Complexity")).set("low","H");
						(vuldb_to_cvss.get("Complexity")).set("medium","M");
						(vuldb_to_cvss.get("Complexity")).set("high","L");
						(vuldb_to_cvss.get("Complexity")).set(1,"High");
						(vuldb_to_cvss.get("Complexity")).set(2,"Medium");
						(vuldb_to_cvss.get("Complexity")).set(3,"Low");

					vuldb_to_cvss.set("Authentication",new Map());
						(vuldb_to_cvss.get("Authentication")).set("name","Au");
						(vuldb_to_cvss.get("Authentication")).set("low","M");
						(vuldb_to_cvss.get("Authentication")).set("medium","S");
						(vuldb_to_cvss.get("Authentication")).set("high","N");
						(vuldb_to_cvss.get("Authentication")).set(1,"Multiple");
						(vuldb_to_cvss.get("Authentication")).set(2,"Single");
						(vuldb_to_cvss.get("Authentication")).set(3,"None");

					vuldb_to_cvss.set("Confidentiality",new Map());
						(vuldb_to_cvss.get("Confidentiality")).set("name","C");
						(vuldb_to_cvss.get("Confidentiality")).set("low","N");
						(vuldb_to_cvss.get("Confidentiality")).set("medium","P");
						(vuldb_to_cvss.get("Confidentiality")).set("high","C");
						(vuldb_to_cvss.get("Confidentiality")).set(1,"None");
						(vuldb_to_cvss.get("Confidentiality")).set(2,"Partial");
						(vuldb_to_cvss.get("Confidentiality")).set(3,"Complete");

					vuldb_to_cvss.set("Integrity",new Map());
						(vuldb_to_cvss.get("Integrity")).set("name","I");
						(vuldb_to_cvss.get("Integrity")).set("low","N");
						(vuldb_to_cvss.get("Integrity")).set("medium","P");
						(vuldb_to_cvss.get("Integrity")).set("high","C");
						(vuldb_to_cvss.get("Integrity")).set(1,"None");
						(vuldb_to_cvss.get("Integrity")).set(2,"Partial");
						(vuldb_to_cvss.get("Integrity")).set(3,"Complete");

					vuldb_to_cvss.set("Availability",new Map());
						(vuldb_to_cvss.get("Availability")).set("name","A");
						(vuldb_to_cvss.get("Availability")).set("low","N");
						(vuldb_to_cvss.get("Availability")).set("medium","P");
						(vuldb_to_cvss.get("Availability")).set("high","C");
						(vuldb_to_cvss.get("Availability")).set(1,"None");
						(vuldb_to_cvss.get("Availability")).set(2,"Partial");
						(vuldb_to_cvss.get("Availability")).set(3,"Complete");
			}

		var v2_hashtable = new Map();
			fill_v2_hashtable();
			function fill_v2_hashtable(){
				v2_hashtable.set("AV",new Map());
					(v2_hashtable.get("AV")).set("value","");
					(v2_hashtable.get("AV")).set("L",0.395);
					(v2_hashtable.get("AV")).set("A",0.646);
					(v2_hashtable.get("AV")).set("N",1);

				v2_hashtable.set("AC",new Map());
					(v2_hashtable.get("AC")).set("value","");
					(v2_hashtable.get("AC")).set("H",0.35);
					(v2_hashtable.get("AC")).set("M",0.61);
					(v2_hashtable.get("AC")).set("L",0.71);


				v2_hashtable.set("Au",new Map());
					(v2_hashtable.get("Au")).set("value","");
					(v2_hashtable.get("Au")).set("M",0.45);
					(v2_hashtable.get("Au")).set("S",0.56);
					(v2_hashtable.get("Au")).set("N",0.704);

				v2_hashtable.set("C",new Map());
					(v2_hashtable.get("C")).set("value","");
					(v2_hashtable.get("C")).set("N",0);
					(v2_hashtable.get("C")).set("P",0.275);
					(v2_hashtable.get("C")).set("C",0.660);

				v2_hashtable.set("I",new Map());
					(v2_hashtable.get("I")).set("value","");
					(v2_hashtable.get("I")).set("N",0);
					(v2_hashtable.get("I")).set("P",0.275);
					(v2_hashtable.get("I")).set("C",0.660);

				v2_hashtable.set("A",new Map());
					(v2_hashtable.get("A")).set("value","");
					(v2_hashtable.get("A")).set("N",0);
					(v2_hashtable.get("A")).set("P",0.275);
					(v2_hashtable.get("A")).set("C",0.660);
			}

	// #endregion DECLARATION de dictionnaire

	<!--  #region FONCTIONS -->
		function compute_cvss_score(v2_hashtable_bis) {
			// delanoy : compute the cvss v2 base score
			var AV = v2_hashtable_bis.get("AV").get(v2_hashtable_bis.get("AV").get("value")); // AccessVector
			var AC = v2_hashtable_bis.get("AC").get(v2_hashtable_bis.get("AC").get("value")); // AccessComplexity
			var Au = v2_hashtable_bis.get("Au").get(v2_hashtable_bis.get("Au").get("value")); // Authentication
			var C = v2_hashtable_bis.get("C").get(v2_hashtable_bis.get("C").get("value")); // ConfImpact
			var I = v2_hashtable_bis.get("I").get(v2_hashtable_bis.get("I").get("value")); // IntegImpact
			var A = v2_hashtable_bis.get("A").get(v2_hashtable_bis.get("A").get("value")); // AvailImpact

			var Impact = 10.41 * (1 - (1 - C) * (1 - I) * (1 - A));
			var Exploitability = 20 * AC * Au * AV;
			var f_Impact=(Impact==0 ? 0 : 1.176);

			var BaseScore=(0.6*Impact +.4*Exploitability-1.5)*f_Impact;

			return BaseScore;

		}

		function hash_to_txt(hashtable) {
			var output_txt="";
			var val="";
			for (let [key, value] of hashtable) {
				val=value.get("value");
				console.log(`${key} = ${val}`);
				output_txt = output_txt+key + ":"+val+"/"
			}
			//console.log(output_txt);
			return output_txt;
		}

		function updateClipboard(newClip) {
			navigator.clipboard.writeText(newClip).then(function() {
			/* le presse-papier est correctement paramétré */
				console.log ("clipboard ok");
			}, function() {
			/* l'écriture dans le presse-papier a échoué */
				console.log ("clipboard NOK");
			});
		}

		function redirect_if_limited() {
            var a1_elements_limited = document.getElementsByClassName("viewlimit");
            var current_page = window.location.href ;
            var google_translate_page = current_page;
            if(! current_page.match("vuldb-com.translate.goog")) {
                google_translate_page = current_page.replace("vuldb.com","vuldb-com.translate.goog")+"&_x_tr_sl=auto&_x_tr_tl=fr&_x_tr_hl=fr&_x_tr_pto=wapp";
            }

            if(a1_elements_limited.length){
                // console.log("liste limited : " + a1_elements_limited.length);
                console.log("liste limited : redirection de " + current_page+ " a "+google_translate_page);
                window.location.assign(google_translate_page);
            } else { console.log("not limited");}
        }

		function remove_blur() {
            var a1_elements_blured = document.getElementsByClassName("blur");
            //console.log(a1_elements_blured);
            for(var i=0;i<a1_elements_blured.length;i++){
               //console.log("suppression "+i);
               (a1_elements_blured[i]).classList.remove('blur');
            }
        }

		function change_pay_link() {
            document.querySelectorAll("a").forEach(function(item){
              if( item.href === "https://vuldb.com/?pay") {
                item.href = "#";
              }
            });
        }

		function get_CVSS_from_table(){ // manipule v2_hashtable
			var cvss_table = document.getElementById("cvsstableweb");
			if (cvss_table!=null){

				var arr_cvss_table = new Map();
				var ligne_cpt=0;
				var colonne=0;
				var colonne_name="";
				var atrtib_name="";
				var attrib_value="";
				var entete_en="";
				cvss_table.querySelector('tbody').querySelectorAll("tr").forEach(function(ligne){
					if(ligne_cpt==0) {
						colonne=0;
						ligne.querySelectorAll("th").forEach(function(th){
								entete_en = th_to_english.get(th.textContent);
								th.textContent = entete_en;
								arr_cvss_table.set(colonne, new Map());
								(arr_cvss_table.get(colonne)).set("nom", entete_en);
								colonne++;
							})
					}else{
						colonne=0;
						ligne.querySelectorAll("td").forEach(function(td){
							td.textContent = vuldb_to_cvss.get(arr_cvss_table.get(colonne).get("nom")).get(ligne_cpt);
								if(td.className) {
									(arr_cvss_table.get(colonne)).set("valeur", td.className);

									console.log(colonne+" : "+td.className);
									colonne_name = (arr_cvss_table.get(colonne)).get("nom");
									atrtib_name=(vuldb_to_cvss.get(colonne_name)).get("name");
									attrib_value=(vuldb_to_cvss.get(colonne_name)).get(td.className);
									(v2_hashtable.get(atrtib_name)).set("value",attrib_value);

								}
								colonne++;
							})
					}
					ligne_cpt++;
				})
				//console.log(arr_cvss_table);
				//console.log(v2_hashtable);


			}
			return (cvss_table!=null);
		}

		function makeHTMLcustomP(afterID, thisID, aide=true) {
			var cvss_title = document.getElementById(afterID);
			if (cvss_title!=null) {
				var p = document.createElement('p');
					p.onclick = function() {
                        this.style.cssText += "font-weight: bold;";
                        updateClipboard(this.textContent);
                    };
					p.id=thisID;
				if(aide){
                    var prefixe = document.createElement('p');
                    prefixe.appendChild(document.createTextNode("(cliquer pour copier) "));
                    //p.appendChild(document.createTextNode(txt));
                    cvss_title.after(prefixe);
                }
				cvss_title.after(p);
			}
        }

		function makeHTMLcustomP_from_list_vecteur_score(afterID, list_Vecteur_Score) {
            var txt="", newID="", old_id=afterID;
            var cpt=0;
            for(const Vecteur_Score of list_Vecteur_Score){
                newID = afterID+"_"+cpt;
                makeHTMLcustomP(old_id, newID,false);

                txt = Vecteur_Score[0]+" = "+Vecteur_Score[1]+" / "+Vecteur_Score[2];
                writeCustomTXTtoP(newID, txt);
                cpt++;
            }
        }

		function writeCustomTXTtoP(pID, txt) {
            var customPobject = document.getElementById(pID);
            if(customPobject) {
                customPobject.innerText = txt;
                //customPobject.appendChild(document.createTextNode(txt));
            }
        }

		function originalURL(){
            var current_page = window.location.href;

            if(current_page.match("vuldb-com.translate.goog")) {
                current_page = current_page.replace("vuldb-com.translate.goog", "vuldb.com")
                current_page = current_page.replace("&_x_tr_sl=auto&_x_tr_tl=fr&_x_tr_hl=fr&_x_tr_pto=wapp","");
            }
            return current_page;
        }

		function addPcopiable_at_mainMenu(txt, id, mainMenuID="menubox"){
            try{
                var menuItem = document.getElementById(mainMenuID);
                makeHTMLcustomP(mainMenuID, id, true);

                var customURL_item = document.getElementById(id);
                customURL_item.setAttribute("class","m_txt");
                customURL_item.style.cssText = "color: #fff;";
                customURL_item.style.cssText += "display: flex;";
                customURL_item.style.cssText += "mix-blend-mode: difference;";
                customURL_item.innerText = txt;
            }catch{
                console.log("erreur pendant la creation de l'utl copiable");
            }
        }



		// CALCUL V3
			var CVSS31 = {};
			garnir_CVSS31();
			function garnir_CVSS31() {

                CVSS31.CVSSVersionIdentifier = "CVSS:3.1";
                CVSS31.exploitabilityCoefficient = 8.22;
                CVSS31.scopeCoefficient = 1.08;

                // A regular expression to validate that a CVSS 3.1 vector string is well formed. It checks metrics and metric
                // values. It does not check that a metric is specified more than once and it does not check that all base
                // metrics are present. These checks need to be performed separately.

                CVSS31.vectorStringRegex_31 = /^CVSS:3\.1\/((AV:[NALP]|AC:[LH]|PR:[UNLH]|UI:[NR]|S:[UC]|[CIA]:[NLH]|E:[XUPFH]|RL:[XOTWU]|RC:[XURC]|[CIA]R:[XLMH]|MAV:[XNALP]|MAC:[XLH]|MPR:[XUNLH]|MUI:[XNR]|MS:[XUC]|M[CIA]:[XNLH])\/)*(AV:[NALP]|AC:[LH]|PR:[UNLH]|UI:[NR]|S:[UC]|[CIA]:[NLH]|E:[XUPFH]|RL:[XOTWU]|RC:[XURC]|[CIA]R:[XLMH]|MAV:[XNALP]|MAC:[XLH]|MPR:[XUNLH]|MUI:[XNR]|MS:[XUC]|M[CIA]:[XNLH])$/;


                // Associative arrays mapping each metric value to the constant defined in the CVSS scoring formula in the CVSS v3.1
                // specification.

                CVSS31.Weight = {
                    AV:   { N: 0.85,  A: 0.62,  L: 0.55,  P: 0.2},
                    AC:   { H: 0.44,  L: 0.77},
                    PR:   { U:       {N: 0.85,  L: 0.62,  H: 0.27},         // These values are used if Scope is Unchanged
                           C:       {N: 0.85,  L: 0.68,  H: 0.5}},         // These values are used if Scope is Changed
                    UI:   { N: 0.85,  R: 0.62},
                    S:    { U: 6.42,  C: 7.52},                             // Note: not defined as constants in specification
                    CIA:  { N: 0,     L: 0.22,  H: 0.56},                   // C, I and A have the same weights

                    E:    { X: 1,     U: 0.91,  P: 0.94,  F: 0.97,  H: 1},
                    RL:   { X: 1,     O: 0.95,  T: 0.96,  W: 0.97,  U: 1},
                    RC:   { X: 1,     U: 0.92,  R: 0.96,  C: 1},

                    CIAR: { X: 1,     L: 0.5,   M: 1,     H: 1.5}           // CR, IR and AR have the same weights
                };


                // Severity rating bands, as defined in the CVSS v3.1 specification.

                CVSS31.severityRatings  = [ { name: "None",     bottom: 0.0, top:  0.0},
                                           { name: "Low",      bottom: 0.1, top:  3.9},
                                           { name: "Medium",   bottom: 4.0, top:  6.9},
                                           { name: "High",     bottom: 7.0, top:  8.9},
                                           { name: "Critical", bottom: 9.0, top: 10.0} ];

                /* ** CVSS31.roundUp1 **
						 *
						 * Rounds up its parameter to 1 decimal place and returns the result.
						 *
						 * Standard JavaScript errors thrown when arithmetic operations are performed on non-numbers will be returned if the
						 * given input is not a number.
						 *
						 * Implementation note: Tiny representation errors in floating point numbers makes rounding complex. For example,
						 * consider calculating Math.ceil((1-0.58)*100) by hand. It can be simplified to Math.ceil(0.42*100), then
						 * Math.ceil(42), and finally 42. Most JavaScript implementations give 43. The problem is that, on many systems,
						 * 1-0.58 = 0.42000000000000004, and the tiny error is enough to push ceil up to the next integer. The implementation
						 * below avoids such problems by performing the rounding using integers. The input is first multiplied by 100,000
						 * and rounded to the nearest integer to consider 6 decimal places of accuracy, so 0.000001 results in 0.0, but
						 * 0.000009 results in 0.1.
						 *
						 * A more elegant solution may be possible, but the following gives answers consistent with results from an arbitrary
						 * precision library.
						 */
                CVSS31.roundUp1 = function Roundup (input) {
                    var int_input = Math.round(input * 100000);

                    if (int_input % 10000 === 0) {
                        return int_input / 100000;
                    } else {
                        return (Math.floor(int_input / 10000) + 1) / 10;
                    }
                };


                /* ** CVSS31.severityRating **
						 *
						 * Given a CVSS score, returns the name of the severity rating as defined in the CVSS standard.
						 * The input needs to be a number between 0.0 to 10.0, to one decimal place of precision.
						 *
						 * The following error values may be returned instead of a severity rating name:
						 *   NaN (JavaScript "Not a Number") - if the input is not a number.
						 *   undefined - if the input is a number that is not within the range of any defined severity rating.
						 */
                CVSS31.severityRating = function (score) {
                    var severityRatingLength = CVSS31.severityRatings.length;

                    var validatedScore = Number(score);

                    if (isNaN(validatedScore)) {
                        return validatedScore;
                    }

                    for (var i = 0; i < severityRatingLength; i++) {
                        if (score >= CVSS31.severityRatings[i].bottom && score <= CVSS31.severityRatings[i].top) {
                            return CVSS31.severityRatings[i].name;
                        }
                    }

                    return undefined;
                };

            }


			var vectorKeysOrdered_v3 = ['PR','UI','S','C','I','A','E','RL','RC'];
                var listAV=["N","A","L","P"];
                var listAC=["H","L"];
                var listPR=["N","L","H"];
                var listUI=["N","R"];
                var listS=["U","C"];
                var listC=["N","L","H"];
                var listI=["N","L","H"];
                var listA=["N","L","H"];
                var listE=["X","U","P","F","H"];
                var listRL=["X","O","T","W","U"];
                var listRC=["X","U","R","C"];

			function getVectorV3vulDB(id_to_write_after,targetBaseScore, targetTemporalScore, AV_in="", AC_in="", C_in="", I_in="", A_in="") {
                var metricWeightAV, metricWeightAC, metricWeightPR, metricWeightUI, metricWeightS, metricWeightC, metricWeightI, metricWeightA, metricWeightE, metricWeightRL, metricWeightRC;
                var iss, impact, exploitability, baseScore, temporalScore, vecteur;
                var list_Equal = [];
                var list_Proche_01 = [];
                var list_Proche_02 = [];
                var list_Proche_03 = [];
                var list_Proche_04 = [];
                var list_Proche_05 = [];
                var list_Proche_1 = [];

                var listAV_bis=listAV, listAC_bis=listAC, listC_bis=listC, listI_bis=listI, listA_bis=listA;
                if(AV_in){listAV_bis=[AV_in];}
                if(AC_in){listAC_bis=[AC_in];}
                if(C_in){listC_bis=[C_in];}
                if(I_in){listI_bis=[I_in];}
                if(A_in){listA_bis=[A_in];}

                for(const AV of listAV_bis){
                    for(const AC of listAC_bis){
                        for(const PR of listPR){
                            for(const UI of listUI){
                                for(const S of listS){
                                    for(const C of listC_bis){
                                        for(const I of listI_bis){
                                            for(const A of listA_bis){
                                                for(const E of listE){
                                                    for(const RL of listRL){
                                                        for(const RC of listRC){
                                                            // GATHER WEIGHTS FOR ALL METRICS
                                                                metricWeightAV  = CVSS31.Weight.AV    [AV];
                                                                metricWeightAC  = CVSS31.Weight.AC    [AC];
                                                                metricWeightPR  = CVSS31.Weight.PR    [S][PR];  // PR depends on the value of Scope (S).
                                                                metricWeightUI  = CVSS31.Weight.UI    [UI];
                                                                metricWeightS   = CVSS31.Weight.S     [S];
                                                                metricWeightC   = CVSS31.Weight.CIA   [C];
                                                                metricWeightI   = CVSS31.Weight.CIA   [I];
                                                                metricWeightA   = CVSS31.Weight.CIA   [A];

                                                                metricWeightE   = CVSS31.Weight.E     [E];
                                                                metricWeightRL  = CVSS31.Weight.RL    [RL];
                                                                metricWeightRC  = CVSS31.Weight.RC    [RC];

                                                            // CALCULATE THE CVSS BASE SCORE
                                                                iss; /* Impact Sub-Score */
                                                                impact;
                                                                exploitability;

                                                                iss = (1 - ((1 - metricWeightC) * (1 - metricWeightI) * (1 - metricWeightA)));

                                                                if (S === 'U') {
                                                                    impact = metricWeightS * iss;
                                                                } else {
                                                                    impact = metricWeightS * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
                                                                }

                                                                exploitability = CVSS31.exploitabilityCoefficient * metricWeightAV * metricWeightAC * metricWeightPR * metricWeightUI;

                                                                if (impact <= 0) {
                                                                    baseScore = 0;
                                                                } else {
                                                                    if (S === 'U') {
                                                                        baseScore = CVSS31.roundUp1(Math.min((exploitability + impact), 10));
                                                                    } else {
                                                                        baseScore = CVSS31.roundUp1(Math.min(CVSS31.scopeCoefficient * (exploitability + impact), 10));
                                                                    }
                                                                }

                                                            // CALCULATE THE CVSS TEMPORAL SCORE
                                                                temporalScore = CVSS31.roundUp1(baseScore * metricWeightE * metricWeightRL * metricWeightRC);

                                                            // Affichage
                                                                // Scores
                                                                    vecteur = "AV:"+AV+"/AC:"+AC+"   /   PR:"+PR+"/UI:"+UI+"/S:"+S+"   /   C:"+C+"/I:"+I+"/A:"+A+"   /   E:"+E+"/RL:"+RL+"/RC:"+RC+"/" ;
                                                                    if(baseScore == targetBaseScore && temporalScore == targetTemporalScore){
                                                                        console.log(vecteur+"="+baseScore+" / "+temporalScore);
                                                                        list_Equal.push([vecteur,baseScore,temporalScore]);
                                                                    }else if(baseScore <= (targetBaseScore+ 0.1) && baseScore >= (targetBaseScore- 0.1) && temporalScore <= (targetTemporalScore+ 0.1) && temporalScore >= (targetTemporalScore- 0.1)){
                                                                        list_Proche_01.push([vecteur,baseScore,temporalScore]);
                                                                    }else if(baseScore <= (targetBaseScore+ 0.2) && baseScore >= (targetBaseScore- 0.2) && temporalScore <= (targetTemporalScore+ 0.2) && temporalScore >= (targetTemporalScore- 0.2)){
                                                                        list_Proche_02.push([vecteur,baseScore,temporalScore]);
                                                                    }else if(baseScore <= (targetBaseScore+ 0.3) && baseScore >= (targetBaseScore- 0.3) && temporalScore <= (targetTemporalScore+ 0.3) && temporalScore >= (targetTemporalScore- 0.3)){
                                                                        list_Proche_03.push([vecteur,baseScore,temporalScore]);
                                                                    }else if(baseScore <= (targetBaseScore+ 0.4) && baseScore >= (targetBaseScore- 0.4) && temporalScore <= (targetTemporalScore+ 0.4) && temporalScore >= (targetTemporalScore- 0.4)){
                                                                        list_Proche_04.push([vecteur,baseScore,temporalScore]);
                                                                    }else if(baseScore <= (targetBaseScore+ 0.5) && baseScore >= (targetBaseScore- 0.5) && temporalScore <= (targetTemporalScore+ 0.5) && temporalScore >= (targetTemporalScore- 0.5)){
                                                                        list_Proche_05.push([vecteur,baseScore,temporalScore]);
                                                                    }else if(baseScore <= (targetBaseScore+ 1) && baseScore >= (targetBaseScore- 1) && temporalScore <= (targetTemporalScore+ 1) && temporalScore >= (targetTemporalScore- 1)){
                                                                        list_Proche_1.push([vecteur,baseScore,temporalScore]);
                                                                    }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if(list_Equal.length>0){
                    console.log(list_Equal);
                    makeHTMLcustomP_from_list_vecteur_score(id_to_write_after, list_Equal);
                }else if(list_Proche_01.length>0){
                    console.log(list_Proche_01);
                    makeHTMLcustomP_from_list_vecteur_score(id_to_write_after, list_Proche_01);
                }else if(list_Proche_02.length>0){
                    console.log(list_Proche_02);
                    makeHTMLcustomP_from_list_vecteur_score(id_to_write_after, list_Proche_02);
                }else if(list_Proche_03.length>0){
                    console.log(list_Proche_03);
                    makeHTMLcustomP_from_list_vecteur_score(id_to_write_after, list_Proche_03);
                }else if(list_Proche_04.length>0){
                    console.log(list_Proche_04);
                    makeHTMLcustomP_from_list_vecteur_score(id_to_write_after, list_Proche_04);
                }else if(list_Proche_05.length>0){
                    console.log(list_Proche_05);
                    makeHTMLcustomP_from_list_vecteur_score(id_to_write_after, list_Proche_05);
                }else if(list_Proche_1.length>0){
                    console.log(list_Proche_1);
                    makeHTMLcustomP_from_list_vecteur_score(id_to_write_after, list_Proche_1);
                }else{
                    // pas de match satisfaissant, on réduit la précision d'entrée
                    // etape initiale : AV + AC + CIA
                    // etape intermediaire : AC + AV
                    if(C_in && I_in && A_in) {
                        getVectorV3vulDB(id_to_write_after,targetBaseScore, targetTemporalScore, AV_in, AC_in);
                    }else{
                        // etape finale all inconnue
                        getVectorV3vulDB(id_to_write_after,targetBaseScore, targetTemporalScore);
                    }
                }
            }



	<!-- #endregion FONCTIONS -->

	// #region MAIN
		var txt ="";

		// Verification si page de payement (limite de consultation) => ouvrir avec google translate
			redirect_if_limited();
		// suppression du flou
			remove_blur();
		// suppression des liens de payement
			change_pay_link();

		// ecriture des blocs HTML de résultat
			var afterIDv2 = "cvssv2";
			var afterIDv3 = "cvssv3";

			var customPv2 = "txtCustom_v2";

			makeHTMLcustomP(afterIDv2, customPv2);
			addPcopiable_at_mainMenu(originalURL(), "URLtoCopy");

		// recupération des valeurs
			if(get_CVSS_from_table()) { // manipule v2_hashtable ; retourne vrai si actions réalisées
                // V2
			  	    var cvss_txt = hash_to_txt(v2_hashtable);
			  	    var cvss_score = compute_cvss_score(v2_hashtable);
			  	    var cvss_score_rounded= Math.round( cvss_score * 10 ) / 10

			  	    txt = cvss_score_rounded + " -> "+cvss_txt;
			  	    console.log(txt);
			  	    writeCustomTXTtoP(customPv2, txt);

			  	    addPcopiable_at_mainMenu("V2 "+txt, customPv2+"_header");

                //V3
			  	    var allHTMLa = document.querySelectorAll('a');
			  	    var scorev3=0, temporalScore3=0;

                let firstURL_base = "";
			  	    firstURL_base = "https://www.first.org/cvss/specification-document#2-Base-Metrics"; // 2023
			  	    firstURL_base = "https://www.first.org/cvss/v3.1/specification-document#Base-Metrics"; // 04/2024
                let firstURL_base_normed = firstURL_base.replace("#","%23");
                let firstURL_temporal = "";
			  	    firstURL_temporal = "https://www.first.org/cvss/specification-document#3-Temporal-Metrics"; // 2023
			  	    firstURL_temporal = "https://www.first.org/cvss/v3.1/specification-document#Temporal-Metrics"; // 04/2024
                let firstURL_temporal_normed = firstURL_temporal.replace("#","%23");
			  	    for(var i=0 ; i< allHTMLa.length ; i++) {


                        if((allHTMLa[i].href).includes(firstURL_base) || (allHTMLa[i].href).includes(firstURL_base_normed)) {
                            scorev3 = allHTMLa[i].innerText;
                            console.log("v3 trouvé a ! "+scorev3);
                        }
                        if((allHTMLa[i].href).includes(firstURL_temporal) || (allHTMLa[i].href).includes(firstURL_temporal_normed)) {
                            temporalScore3 = allHTMLa[i].innerText;
                            console.log("v3 temporalscore trouvé a ! "+scorev3);
                        }
                    }

			  	    if(scorev3 && temporalScore3 && cvss_txt){
                        addPcopiable_at_mainMenu("V3 x temp :"+scorev3+" x "+temporalScore3, "v3_header");
                        // on recherche les combinaisons compatibles avec Vecteur et Complexité identique

                        var correspondance_CIA_v3_from_CIA_v2 = new Map();
                        correspondance_CIA_v3_from_CIA_v2.set("N","N");
                        correspondance_CIA_v3_from_CIA_v2.set("P","L");
                        correspondance_CIA_v3_from_CIA_v2.set("C","H");
                        var correspondance_AC_v3_from_AC_v2 = new Map();
                        correspondance_AC_v3_from_AC_v2.set("M","");
                        correspondance_AC_v3_from_AC_v2.set("L","L");
                        correspondance_AC_v3_from_AC_v2.set("H","H");
                        var avV2 = v2_hashtable.get("AV").get("value");
                        var acV2 = correspondance_AC_v3_from_AC_v2.get(v2_hashtable.get("AC").get("value"));
                        var cV2 = correspondance_CIA_v3_from_CIA_v2.get(v2_hashtable.get("C").get("value"));
                        var iV2 = correspondance_CIA_v3_from_CIA_v2.get(v2_hashtable.get("I").get("value"));
                        var aV2 = correspondance_CIA_v3_from_CIA_v2.get(v2_hashtable.get("A").get("value"));

                        getVectorV3vulDB(afterIDv3, parseFloat(scorev3), parseFloat(temporalScore3),avV2,acV2,cV2, iV2, aV2);
                    }
			}

	// #endregion MAIN
})();