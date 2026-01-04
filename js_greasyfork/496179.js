// ==UserScript==
// @name          CERT-FR
// @namespace     CERT-FR
// @version       4.0.0
// @description   Score inclusion / TO DO Il faut pouvoir comparer le input des select avant de generer le ichier texte
// @author        SRI/DELANOY
// @icon          data:image/png;base64,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
// @match         https://cert.ssi.gouv.fr/avis/*
// @match         https://cert.ssi.gouv.fr/alerte/*
// @match         https://www.cert.ssi.gouv.fr/avis/*
// @match         https://www.cert.ssi.gouv.fr/alerte/*
// @match         https://www.cert.ssi.gouv.fr/actualite/*
// @connect       cyberwatch.internet.np
// @connect       cvedetails.com
// @connect       vuldb.com
// @connect       api.sourceclear.com
// @connect       cve.circl.lu
// @connect       nvd.nist.gov
// @connect       msrc.microsoft.com
// @connect       pastebin.com
// @connect       feedly.com
// @connect       gitlab-ce.internet.np
// @connect       rocketchat.internet.np
// @require       https://code.jquery.com/jquery-3.1.0.min.js
// @grant         GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/496179/CERT-FR.user.js
// @updateURL https://update.greasyfork.org/scripts/496179/CERT-FR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let scriptVersion = "3.07.13"; // doit être modifiée manuellement en cas de changement majeur du contenu ; si ce n'est que fonctionnel alors inutile de le changer
    /* 3.07.01*	: ajout des métadonnées du site NVD (date de publication, date de modification NVD et source de la publication)
	   3.07.13*	: ajout d'une mention "(rejected)" si la CVE avait été rejetée par NVD
	   3.07.14	: modification de l'info de publication NVD : "NA (<date du jour>)" par "inconnu de nvd en date du <date du jour>"
	   3.07.15	: choix de NVD meme si le stockage est plus elevé (en cas de rabaissement)
	   3.08.01	: ajout du stochage depuis PasteBin
	   3.10.01	: ajout du stockage depuis https://gitlab-ce.internet.np/vuln/cert-fr/-/tree/main/
	   3.10.05	: début de factorisation de code en MVC
                 ; ajout de controle supplémentaires sur les erreurs dans la page
                 ; ajout d'option de debug comme remplacer la liste des cve
       3.10.06	: ajout de boutons pour modifier les CVE, titre, une option pour ne pas sauvegarder
       3.11.00	: ajout de la fonction d'aide
       3.11.05	: ajout d'une fonction pour ajouter un UL pour les references CVE en cas de manque de ce dernier
       3.11.06	: patch liens vuldb de chaque CVE en bas de page
       3.11.07	: ajout d'un highlight sur la note cliqué depuis le tableau CSV
       3.11.09	: suppression du footer et amélioration de l'affichage (évolution possible, un bouton pour afficher le footer ?
	   4.0.0	: Révision et refactorisation du code
	*/ // Notes de versions />
    // https://greasyfork.org/scripts/372105-cert-fr/code/CERT-FR.user.js

	//████████████████████████████████████████████████████████████████████████████████████████████████████████████
	// FONCTIONS GENERIQUES ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
		// Message console en couleur
			function printColor(color, titre, caller, ...args){ // fonction de debug qui formate légerement la sortie
				// affichage du message
					console.log('%c'+titre+':'+'%c'+caller,'background:'+color+';color:white', 'color:red',
								...args,
					);
			} // chrome:OK ; firefox ?, ie ?, edge ?
		
			function printBlue  (titre,caller, ...args){printColor("blue", titre, caller, ...args)}
			function printCyan   (titre,caller, ...args){printColor("#007FFF", titre, caller, ...args)}
			function printRed    (titre,caller, ...args){printColor("red", titre, caller, ...args)}
			function printGreen  (titre,caller, ...args){printColor("green", titre, caller, ...args)}
			function printYellow (titre,caller, ...args){printColor("#DEB100", titre, caller, ...args)}
			function printDebug  (caller, ...args){printBlue("DEBUG", caller, ...args)}
			function printError  (caller, ...args){printRed("ERROR", caller, ...args)}
			function printFail   (caller, ...args){printRed("FAIL", caller, ...args)}
			function printNok    (caller, ...args){printRed("NOK", caller, ...args)}
			function printOk     (caller, ...args){printGreen("OK", caller, ...args)}
			function printInfo   (caller, ...args){printCyan("INFO", caller, ...args)}
			
			function printCustom(type, ...args){
				// récupération du caller
					let currentFct=printCustom // a changer si le nom de cette fonction change
					let caller="";
					let isStrict = (eval("var __temp = null"), (typeof __temp === "undefined")) // credits : https://stackoverflow.com/questions/10480108/is-there-any-way-to-check-if-strict-mode-is-enforced
					if(isStrict){ // strict mode // 
						// credits https://stackoverflow.com/questions/29572466/how-do-you-find-out-the-caller-function-in-javascript-when-use-strict-is-enabled
							let callerName;
							try { throw new Error(); }
							catch (e) { 
								var re = /(\w+)@|at (\w+) \(/g, st = e.stack, m;
								re.exec(st), m = re.exec(st);
								callerName = m[1] || m[2];
							}
						if(callerName){caller="["+callerName+"] ";}
					}else{//non strict mode
						try{
							if (Object.hasOwn(currentFct, "caller")) { // chrome
								let callerName=Object.getOwnPropertyDescriptor(currentFct, "caller").value.name;
								caller="["+callerName+"] ";
							} else {
								let callerValue=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(currentFct),"caller",).get.call(currentFct);
								printError("ERROR","printCustom","recuperer que le nom de callerValue=",callerValue)
								caller="["+callerValue.toString()+"] ";
							}
						}catch(e){
							console.error(e);
						}
					}
					// f : currentFct
					// In Chrome:
					// caller is an own property with descriptor {value: null, writable: false, enumerable: false, configurable: false}

					// In Firefox:
					// f doesn't have an own property named caller. Trying to get f.[[Prototype]].caller
					// null
				// affichage du message
					if(typeof(type) == 'function'){// c'est une fonction, on envoie le message 
						type(caller, ...args);
					}else{
						let strType=type.toString();
						let typeToSwitch=strType.toLowerCase();
						switch(typeToSwitch){
							case "debug":
								printDebug(caller, ...args);
								break;
							case "error":
							case "erreur":
								printError(caller, ...args);
								break;
							case "fail":
								printFail(caller, ...args);
								break;
							case "nok":
								printNok(caller, ...args);
								break;
							case "ok":
							case "good":
							case "bon":
								printOk(caller, ...args);
								break;
							case "info":
								printInfo(caller, ...args);
								break;
							default:
								printYellow(strType, caller, ...args);
								break;
						}
					}
				
			} // chrome:OK ; firefox ?, ie ?, edge ?

    // /FIN FONCTIONS GENERIQUES ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
	//████████████████████████████████████████████████████████████████████████████████████████████████████████████
	// FONCTIONS GRAPHIQUES GENERIQUES ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
		// HTML
			function getDocumentBody(){ // fonction qui retourne le BODY ou au pire la balise HTML
				let DOM_toReturn = null;
				try{
					DOM_toReturn=document.body;
					if(DOM_toReturn==null){ // le body n'existe pas, on retourne la balise HTML
						DOM_toReturn=document.firstElementChild;
					}
				}catch{}
				return DOM_toReturn;
			} // OK
			function createListElement_From_JSON(input, debug=false) { // fonction qui crée récurssivement les objets ; retourne une liste d'element, utiliser ...xxx ou une boucle for pour parcourir les elements
				if(debug){printCustom("debug","input=",input);}
				let DOMtoReturn=[], lstChild;
				if(input.length){ // c'est une liste
					if(debug){printCustom("debug","est une liste de",input.length,"items");}
					for(let i=0;i<input.length;i++){
						DOMtoReturn.push(...createListElement_From_JSON(input[i], debug));
					}
				}else{ // c'est un dict (probablement)
					for (let [itemType, DICTobj] of Object.entries(input)) { // on parcous les clés de l'objet
						if(debug){printCustom("debug","creation de l'objet DOM de type",itemType);}
						let DOMobject = document.createElement(itemType);
						for (let [attribut, attribValue] of Object.entries(DICTobj)) { // on parcours les attributs
							let attributToSwitch=attribut.toLowerCase();
							if(debug){printCustom("debug","Ajout de l'attribut",attribut,"=",attribValue);}
							// transformation des attributs connus
								attribut=(attributToSwitch=="strokewidth"?"stroke-width":attribut)
								attribut=(attributToSwitch=="for"?"htmlFor":attribut)
							//switch
							switch(attributToSwitch){
								case "children":
									lstChild = createListElement_From_JSON(attribValue, debug);
									for(let i=0;i<lstChild.length;i++){DOMobject.appendChild(lstChild[i]);}
									break;
								case "class":
									classAdd(DOMobject, attribValue);
									break;
								// default : test en attribut pointé (avec l'équivalent []) puis sinon en set attribut
								default:
									try{
										DOMobject[attribut]=attribValue;
									}catch(e){
										printCustom("error","erreur avec l'attribut",attributToSwitch,':',e);
										DOMobject.setAttribute(attribut, attribValue);
									}
									break;
							}
						}
						DOMtoReturn.push(DOMobject);
					}
					
				}
				if(debug){printCustom("debug","Retourne",DOMtoReturn);}
				return DOMtoReturn;
			} // OK ; retourne une liste, let lstItems=createListElement_From_JSON(dictObj); document.body.before(...lstItems)
			
			function getParentElementFrom(DOM_object){// fonction qui retourne le parent
				let DOM_parent = null;
				try{ // parentElement
					DOM_parent = DOM_object.parentElement;
				}catch{}
				return DOM_parent;
			}
			function getParentNodeFrom(DOM_object){// fonction qui retourne le parent
				let DOM_parent = null;
				try{ // parentElement
					DOM_parent = DOM_object.parentNode;
				}catch{}
				return DOM_parent;
			}
			function getParent(DOM_object){// fonction qui retourne le parent
				// déclaration des variables
				let DOM_parent=null;
				// test ELEMENT
				DOM_parent = getParentElementFrom(DOM_object)
				// test node
				if(DOM_parent==null){DOM_parent = getParentNodeFrom(DOM_object)}
				return DOM_parent;
			}
			function getFirstParent_as(DOM_object, search="div"){ // retourne le premier contenant de type search
				let DOM_parent=getParent(DOM_object);
				if(DOM_parent==null){return DOM_parent;}

				let DOM_parent_type = DOM_parent.nodeName.toLowerCase();
				search = search.toLowerCase();
				if(search == DOM_parent_type){
					return DOM_parent;
				}else{
					return getFirstParent_as(DOM_parent, search);
				}
			}

			
		// CLASS
			function classAdd(DOMobject, ...args){ // fonction qui ajoute une ou plusieurs classes à la liste des classes de DOMobject (utilisation de spread syntax ...)
				if(arguments.length<=1){// il n'y a rien à ajouter
					console.error("Aucune class à ajouter");
				}else if(arguments.length>2){// il s'agit de tuples
					for (let i = 1; i < arguments.length; i++) {
						classAdd(DOMobject, arguments[i]);
					}
				}else{ // 2 artguments: DOMobject + class(es)
					let input = arguments[1];
					let classToAdd_type=typeof(input);
					if(classToAdd_type=='object'){ // il s'agit d'une liste de classes
						for(let i=0;i<input.length;i++){classAdd(DOMobject, input[i]);}
					}else if(classToAdd_type=='string'){ // c'est une seule classe
						try{
							let splittedClasses=input.split(" ");
							if(splittedClasses.length>1){
								classAdd(DOMobject, splittedClasses); // ajoutera le tableau
							}else{// c'est une chaine normale
								DOMobject.classList.add(input);
							}
						}catch(error){console.error(error);}
					}else{
						let msg=input.toString() + " de type " + classToAdd_type + " n'est pas pris en charge et ne peut donc pas être ajouté à la liste des classes";
						console.error(msg);
					}
				}
			}//OK
			function classRemoveAll(DOMobject){ // fonction qui wipe la liste des classes de DOMobject
				try{
					let listClass = DOMobject.classList;
					for(let i=0;i<listClass.length;i++){
						try{
							DOMobject.classList.remove(listClass[i]);
						}catch(error){
							console.error(error);
							continue; // on passe aux suivants
						}
					}
				}catch(error){
					console.error(error);
				}
			}//ok
			function classSet(DOMobject, ...args){ // fonction qui remplace par une ou plusieurs class la liste des class de DOMobject (utilisation de spread syntax ...)
				classRemoveAll(DOMobject); // suppression des classes
				classAdd(DOMobject, ...args);
			} // ok
		// CSS
			function getPageHeight(){ // retourne la hauteur de la page en PX
				let body = document.body,
					html = document.documentElement;
				return Math.max( body.scrollHeight, body.offsetHeight, 
				html.clientHeight, html.scrollHeight, html.offsetHeight );
				// credit https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
			}
			function getDOMobjectHeight(DOMobject){
				return getComputedStyle(DOMobject).height.replace('px','');
				// credit : https://stackoverflow.com/questions/67097600/how-to-get-css-height-and-width-if-they-are-in-percentage-value-using-javascript
			}
			function getPercentageHeight(DOMobject, overPageHeight=false){ // retourne la hauteur en pourcentage soit par rapport à son parent (par defaut) soit par rapport à la hauteur de la page
				let DOMobject_height = getDOMobjectHeight(DOMobject);
				let DOMobject_parent_height = getDOMobjectHeight(DOMobject.parentElement);
				let DOMpage_height = getPageHeight();
				
				return DOMobject_height / (overPageHeight?DOMpage_height:DOMobject_parent_height) * 100
				// credit : https://stackoverflow.com/questions/67097600/how-to-get-css-height-and-width-if-they-are-in-percentage-value-using-javascript
			}
		
		// DIVERS
    // /FIN FONCTIONS GRAPHIQUES GENERIQUES ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
	//████████████████████████████████████████████████████████████████████████████████████████████████████████████
	// FONCTIONS GRAPHIQUES SPECIFIQUES ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
		// nettoyage
			function CERTFR_removeUnecessaryDOM(){ // fonction qui arbitrairement supprime des elements de la page
				// suppression du footer
					try{
						//document.querySelector("footer").remove();
						document.querySelector("footer").style.display="none";
					}catch{
						printCustom("error","Suppression du footer");
					}
				
			}//OK
		
		// selection
			function CERTFR_getDOM_DIV_higher(){// retourne la div connue etant la plus haute utile
				return document.querySelector(".content");
			}
			function CERTFR_getDOM_DIV_mid(){// retourne la div suivante connue
				return document.querySelector(".content .container");
			}
			function CERTFR_getDOM_DIV_least(){// retourne la div la plus basse autorisée
				return document.querySelector(".article");
			}
			function CERTFR_getNAVbar(){
				return document.querySelector("nav");
			}
			function CERTFR_getMainTitle(){return document.querySelector("h1");}
		
			function CERTFR_getDOM_rootContainer(position="left", debug=false){ // fonction qui retourne le container qui encadre les ajouts (a gauche ou a droite de l'article
				console.log("#0");
				let DOM_toReturn = document.createElement("div");
				let divHeight = "85vh"; // par defaut
				console.log("#1");
				if(debug){printCustom("debug","divHeight=",divHeight);}
				try{
					let DOMnavBar = CERTFR_getNAVbar()
					let navBarHeight=getPercentageHeight(DOMnavBar) // on récupère la taille de la barre de navigation en %
					divHeight=parseInt(100-navBarHeight)+"%" // on veut pas dépasser de la page visible
				}catch(e){console.error(e)}
				divHeight="50%"
				if(debug){printCustom("debug","divHeight=",divHeight);}
				
				try{ // l'idée est de renvoyer la meilleure div pour placer une div à sa gauche ou a sa droite
				
					// récupération de l'article
						let articleContent = CERTFR_getDOM_DIV_higher();
						if(articleContent==null){ // on a pas récupéré l'article, on cherche son parent connu
							printCustom("FAIL","#1 La div souhaitée n'a pas été trouvé avec la méthode conventionnelle");
							articleContent = CERTFR_getDOM_DIV_mid(); // les couleurs déconnent en mid ...
							if(articleContent==null){ // on a pas récupéré le premiern parent on brasse plus large
								printCustom("FAIL","#2 La div souhaitée n'a pas été trouvé avec la méthode conventionnelle");
								articleContent = CERTFR_getDOM_DIV_least();
								if(articleContent==null){ // il y a un problème, on prend le body
									printCustom("FAIL","#3 La div souhaitée n'a pas été trouvé avec la méthode conventionnelle, on ajoute au body");
									articleContent=getDocumentBody();
								}
							}
						}
						if(debug){
							printCustom("debug","avant style : articleContent=",articleContent, "articleContent.style=",articleContent.style);
							console.dir(articleContent)
						}
					// on place le elements
						let commonStyle = "overflow: auto ;height:"+divHeight+"; width:auto;"+"float: left;";
						if(articleContent!=null){
							articleContent.style = articleContent.style+";"+commonStyle
							DOM_toReturn.style=commonStyle
						}
						if(debug){
							printCustom("debug","apres style : articleContent=",articleContent, "articleContent.style=",articleContent.style);
							console.dir(articleContent)
						}
						if(position=="left"){ // on place avant (gauche)
							articleContent.before(DOM_toReturn);
						}else{ // on place apres (droite)
							articleContent.after(DOM_toReturn);
						}
				}catch(e){console.error(e)}
				if(debug){printCustom("debug","DOM_toReturn=",DOM_toReturn);}
				return DOM_toReturn
			}
			
			
		// Ajout
			// liste des CVE
			function JSON_rowsCVES(lstCVEs=[]){ // fonction qui retourne la liste de csv sous la forme d'une  liste de dict
				let lst_rows = []
                for(let i=0;i<lstCVEs.length;i++){
                    let id = lstCVEs[i];
					// CYBERWATCH + controle d'etat ; pourra etre remplacé
						let CW_url = 'https://cyberwatch.internet.np/cve_announcements/'+id;
						let CW_id = "tableCVEs_Td_"+id+"_CW";
					
                    // récupération des valeurs NVD
                    lst_rows.push(
						{"tr":{
							"id": "tableCVEs_Tr_"+id,
							"children":[
								{"td":{
									"id": "tableCVEs_Td_"+id+"_CVE", "innerText": id, "style" : "color:red;", "originalOrder" : i,
									"children":[
										{"input":{"type":"hidden", "id" : ("tableCVEs_Td_"+id+"_NVDpublishDate")}},
										{"input":{"type":"hidden", "id" : ("tableCVEs_Td_"+id+"_NVDmodifiedDate")}},
										{"input":{"type":"hidden", "id" : ("tableCVEs_Td_"+id+"_NVDsource")}}
									]
								}},
								{"td":{"id": "tableCVEs_Td_"+id+"_Editeur", originalOrder : i}},
								{"td":{
									"id": "tableCVEs_Td_"+id+"_v2", originalOrder : i,
									"children":[
										{"p":{"id":("tableCVEs_Td_"+id+"_v2_score")}},
										{"input":{"type":"hidden", "id":("tableCVEs_Td_"+id+"_v2_vector")}}
									]
								}},
								{"td":{
									"id": "tableCVEs_Td_"+id+"_v3", originalOrder : i,
									"children":[
										{"p":{"id":("tableCVEs_Td_"+id+"_v3_score")}},
										{"input":{"type":"hidden", "id":("tableCVEs_Td_"+id+"_v3_vector")}}
									]
								}},
								{"td":{
									"id": "tableCVEs_Td_"+id+"_v3_CNA", originalOrder : i,
									"children":[
										{"p":{"id":("tableCVEs_Td_"+id+"_v3_CNA_score")}},
										{"input":{"type":"hidden", "id":("tableCVEs_Td_"+id+"_v3_CNA_vector")}}
									]
								}},
								{"td":{
									"id": "tableCVEs_Td_"+id+"_nvd", originalOrder : i,
									"children":[{"a":{"href":'https://nvd.nist.gov/vuln/detail/'+id, "target": "_blank", "innerText" : "NVD"}}]
								}},
								{"td":{
									"id": "tableCVEs_Td_"+id+"_google", originalOrder : i,
									"children":[{"a":{"href":'https://www.google.com/search?q=%22'+id+'%22+cvss', "target": "_blank", "innerText" : "google"}}]
								}},
								{"td":{
									"id": CW_id, originalOrder : i,
									"children":[{"a":{"href":CW_url, "target": "_blank", "innerText" : "CW"}}]
								}}
							]
						}}
					);
//colorURLavailability(CW_url, CW_id); // mise à jour de l'etat de Cyberwatch // TODO
                } // fin for(let i=0;i<lstCVEs.length;i++){
				return lst_rows;
			} // fin JSON_rowsCVES(lstCVEs){ // OK
			function JSON_divCVEs(lstCVEs){
                // variables graphiques
					var font_size = "20px" ;
					var bordeStyle = defaultTableBorder ;
					var indentation_td = '40px';
					var id, mapGetNVD, v3_Vector, v2_Vector, v3_BaseScore, v2_BaseScore, CW_url, CW_id;
				// recuperation des row de CVE
					let lst_rows = JSON_rowsCVES(lstCVEs)
				// retour
				return {
					"div":{
						"id":"div_CVEs",
						"class":["content"],
						"style":"font-size :"+font_size+";",
						"children":[
							{"table":{"innerText":"Cliquer sur le score pour l'utiliser"}},
							{"table":{
								"innerText":"En-tete rouge = travail en cours, vert = fini",
								"id":"pProcessMessage"
								}
							},
							{"table":{
								"border":bordeStyle,
								"id":"tableCVEs",
								"children":[
									{"input":{
										"type":"hidden",
										"id":"tableCVEs_sorting",
										"value":"original"
									}},
									{"tr":{
										"id":"tableCVEs_THs",
										"style" : "color:red;",
										"children":[
											{"th":{"style" :"padding-right:10px", "innerText": "CVE", "id" : 'tableCVEs_THs_CVE'}},
											{"th":{"style" :"padding-right:10px", "innerText": "from", "id" : 'tableCVEs_THs_Editeur'}},
											{"th":{"style" :"padding-right:10px", "innerText": "v2", "id" : 'tableCVEs_THs_v2'}},
											{"th":{"style" :"padding-right:10px", "innerText": "v3", "id" : 'tableCVEs_THs_v3'}},
											{"th":{"style" :"padding-right:10px", "innerText": "v3 CNA", "id" : 'tableCVEs_THs_v3_CNA'}},
											{"th":{"style" :"padding-right:10px", "innerText": "Liens", "colSpan":3}}
										]
									}},
									...lst_rows
								]
								}
							}
						]
					}
				}// fin return
			} // fin  JSON_divCVEs(lstCVEs){ // OK

			// CVSSeditor
			function JSON_divCVSSeditor(){
                // variables graphiques
					var font_size = "14px" ;
					var border_size = "0" ;
					var indentation_td = '25px';
				// retour
					return {
							"div":{
								"id" :'div_input', "style" : "font-size :"+font_size,
								"children":[
									{"label":{"innerText": "ENTREE Vecteur v2 ou v3 :"}},
									{"input":{"type" :"text", "id": 'input_text_cvss', "size" : 70 , "value" : ''}},
									
									{"label":{"innerText": "Delimiteur entre entrées"}},
									{"input":{"type" :"text", "id": 'input_text_cvss_delimiter', "size" : 3, "value" : '/'}},

									{"label":{"innerText": "Delimiteur entrée-valeur"}},
									{"input":{"type" :"text", "id": 'input_text_cvss_operateur', "size" : 3, "value" : ':'}},

									{"table":{
										"id": "cvss_table", "border" : border_size,
										"children":[
											{"tr":{
												"id": "cvss_table_tr1",
												"children":[{"td":{"colSpan":"7", "innerText": "Métrique de base"}}]
											}},
											{"tr":{
												"id": "cvss_table_tr2",
												"children":[
													{"td":{}},
													{"td":{"colSpan" :'7', "innerText": "Exploitabilité"}}
												]
											}},
											{"tr":{
												"id": "cvss_table_tr3",
												"children":[
													{"td":{"width": indentation_td}},
													{"td":{"width": indentation_td}},
													{"td":{"innerText": "Vecteur d'attaque (AV)"}},
													{"td":{"innerText": "Complexité d'attaque (AC)", "style" :"padding-right:10px"}},
													{"td":{"innerText": "Authentification (Au)"}},
													{"td":{"innerText": "Privilèges requis (PR)", "style" :"padding-right:10px"}},
													{"td":{"innerText": "Interaction utilisateur (UI)"}}
												]
											}},
											{"tr":{
												"id": "cvss_table_tr4",
												"children":[
													{"td":{"width" :'25px'}},
													{"td":{"width" :'25px'}},
													{"td":{
														"id": "cvss_table_tr4_td1",
														"children":[
															{"select":{
																"id": 'AccessVectorVar', "width" :'100%',
																"children":[
																	{"option":{"value" :'v2=AV:/v3=AV:', "selected":'selected', "label":'?',"innerText":"?"}},
																	{"option":{"value" :'v2=AV:L/v3=AV:L', "label":'Local',"innerText":"L"}},
																	{"option":{"value" :'v2=AV:A/v3=AV:A', "label":'Réseau contigue',"innerText":"A"}},
																	{"option":{"value" :'v2=AV:N/v3=AV:N', "label":'Réseau',"innerText":"N"}},
																	{"option":{"value" :'v2=AV:L/v3=AV:P', "label":'Physique',"innerText":"P"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr4_td2",
														"children":[
															{"select":{
																"id": 'AccessComplexityVar',
																"children":[
																	{"option":{"value" :'v2=AC:/v3=AC:', "selected": 'selected', "label": '?',"innerText":"?"}},
																	{"option":{"value" :'v2=AC:H/v3=AC:H', "label": 'Haute',"innerText":"H"}},
																	{"option":{"value" :'v2=AC:M/v3=AC:H', "label": 'Moyenne/haute',"innerText":"M"}},
																	{"option":{"value" :'v2=AC:M/v3=AC:L', "label": 'Moyenne/faible',"innerText":"M"}},
																	{"option":{"value" :'v2=AC:L/v3=AC:L', "label": 'Faible',"innerText":"L"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr4_td3",
														"children":[
															{"select":{
																"id": 'AuthenticationVar',
																"children":[
																	{"option":{"value" :'v2=Au:/v3: ', "selected": 'selected', "label": '?',"innerText":"?"}},
																	{"option":{"value" :'v2=Au:M/v3: ', "label": 'Nécessite plusieurs instances',"innerText":"M"}},
																	{"option":{"value" :'v2=Au:S/v3: ', "label": 'Nécessite une seule instance',"innerText":"S"}},
																	{"option":{"value" :'v2=Au:N/v3: ', "label": 'Aucune',"innerText":"N"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr4_td4",
														"children":[
															{"select":{
																"id": 'PrivilegeRequiredVar',
																"children":[
																	{"option":{"value" :'v2=/v3=PR:', "selected": 'selected', "label": '?',"innerText":"?"}},
																	{"option":{"value" :'v2=/v3=PR:N', "label": 'Aucun',"innerText":"N"}},
																	{"option":{"value" :'v2=/v3=PR:L', "label": 'Bas',"innerText":"L"}},
																	{"option":{"value" :'v2=/v3=PR:H', "label": 'Hauts',"innerText":"H"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr4_td5",
														"children":[
															{"select":{
																"id": 'UserInteractionVar',
																"children":[
																	{"option":{"value" :'v2=/v3=UI:', "selected": 'selected', "label": '?',"innerText":"?"}},
																	{"option":{"value" :'v2=/v3=UI:N', "label": 'Aucune',"innerText":"N"}},
																	{"option":{"value" :'v2=/v3=UI:R', "label": 'Requise',"innerText":"R"}}
																]
															}}
														]
													}}
													
												]
											}},
											{"tr":{
												"id": "cvss_table_tr5",
												"children":[
													{"td":{}},
													{"td":{"colSpan" :'7', "innerText": "Impact"}}
												]
											}},
											{"tr":{
												"id": "cvss_table_tr6",
												"children":[
													{"td":{}},
													{"td":{}},
													{"td":{"innerText": "Portée (S)"}},
													{"td":{"innerText": "Confidentialité (C)"}},
													{"td":{"innerText": "Intégrité (I)"}},
													{"td":{"innerText": "Disponibilité (A)"}}
												]
											}},
											{"tr":{
												"id": "cvss_table_tr7",
												"children":[
													{"td":{}},
													{"td":{}},
													{"td":{
														"id": "cvss_table_tr7_td1",
														"children":[
															{"select":{
																"id": 'ScopeVar',
																"children":[
																	{"option":{"value" :'v2=/v3=S:', "selected": 'selected', "label": '?', "innerText":"?"}},
																	{"option":{"value" :'v2=/v3=S:U', "label": 'Pas de débordement', "innerText":"U"}},
																	{"option":{"value" :'v2=/v3=S:C', "label": 'Débordement', "innerText":"C"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr7_td2",
														"children":[
															{"select":{
																"id": 'ConfImpactVar',
																"children":[
																	{"option":{"value" :'v2=C:/v3=C:', "selected": 'selected', "label": '?', "innerText":"ND"}},
																	{"option":{"value" :'v2=C:N/v3=C:N', "label": 'Aucun', "innerText":"N"}},
																	{"option":{"value" :'v2=C:P/v3=C:L', "label": 'Partiel/bas', "innerText":"P"}},
																	{"option":{"value" :'v2=C:C/v3=C:H', "label": 'Complet/haut', "innerText":"C"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr7_td3",
														"children":[
															{"select":{
																"id": 'IntegImpactVar',
																"children":[
																	{"option":{"value" :'v2=I:/v3=I:', "selected": 'selected', "label": '?', "innerText":"ND"}},
																	{"option":{"value" :'v2=I:N/v3=I:N', "label": 'Aucun', "innerText":"N"}},
																	{"option":{"value" :'v2=I:P/v3=I:L', "label": 'Partiel/bas', "innerText":"P"}},
																	{"option":{"value" :'v2=I:C/v3=I:H', "label": 'Complet/haut', "innerText":"C"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr7_td4",
														"children":[
															{"select":{
																"id": 'AvailImpactVar',
																"children":[
																	{"option":{"value" :'v2=A:/v3=A:', "selected": 'selected', "label": '?', "innerText":"?"}},
																	{"option":{"value" :'v2=A:N/v3=A:N', "label": 'Aucun', "innerText":"N"}},
																	{"option":{"value" :'v2=A:P/v3=A:L', "label": 'Partiel/bas', "innerText":"P"}},
																	{"option":{"value" :'v2=A:C/v3=A:H', "label": 'Complet/haut', "innerText":"C"}}
																]
															}}
														]
													}}
												]
											}},
											{"tr":{
												"id": "cvss_table_tr8",
												"children":[{"td":{"colSpan":"7", "innerText": "Score Temporel"}}]
											}},
											{"tr":{
												"id": "cvss_table_tr9",
												"children":[
													{"td":{}},
													{"td":{}},
													{"td":{"innerText": "Exploitabilité (E)"}},
													{"td":{"innerText": "Remediation (RL)"}},
													{"td":{"innerText": "Confiance (RC)"}}
												]
											}},
											{"tr":{
												"id": "cvss_table_tr10",
												"children":[
													{"td":{}},
													{"td":{}},
													{"td":{
														"id": "cvss_table_tr10_td1",
														"children":[
															{"select":{
																"id": 'ExploitabilityVar',
																"children":[
																	{"option":{"value" :'v2=E:ND/v3=E:X', "selected": 'selected', "label": 'Non défini', "innerText":"ND"}},
																	{"option":{"value" :'v2=E:U/v3=E:U', "label": 'Non prouvé', "innerText":"U"}},
																	{"option":{"value" :'v2=E:POC/v3=E:P', "label": 'Programme de démonstration (PoC)', "innerText":"POC"}},
																	{"option":{"value" :'v2=E:F/v3=E:F', "label": 'Fonctionnel', "innerText":"F"}},
																	{"option":{"value" :'v2=E:H/v3=E:H', "label": 'Haut', "innerText":"H"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr10_td2",
														"children":[
															{"select":{
																"id": 'RemediationLevelVar',
																"children":[
																	{"option":{"value" :'v2=RL:ND/v3=RL:X', "selected": 'selected', "label": 'Non défini', "innerText":"ND"}},
																	{"option":{"value" :'v2=RL:OF/v3=RL:O', "label": 'Correctif officiel', "innerText":"OF"}},
																	{"option":{"value" :'v2=RL:TF/v3=RL:T', "label": 'Correctif provisoire', "innerText":"TF"}},
																	{"option":{"value" :'v2=RL:W/v3=RL:W', "label": 'Palliatif', "innerText":"W"}},
																	{"option":{"value" :'v2=RL:U/v3=RL:U', "label": 'Non disponible', "innerText":"U"}}
																]
															}}
														]
													}},
													{"td":{
														"id": "cvss_table_tr10_td3",
														"children":[
															{"select":{
																"id": 'ReportConfidenceVar',
																"children":[
																	{"option":{"value" :'v2=RC:ND/v3=RC:X', "label": 'Non défini', "innerText":"ND"}},
																	{"option":{"value" :'v2=RC:UC/v3=RC:U', "label": 'Non confirmé', "innerText":"UC"}},
																	{"option":{"value" :'v2=RC:UR/v3=RC:R', "label": 'Présumé', "innerText":"UR"}},
																	{"option":{"value" :'v2=RC:C/v3=RC:C', "selected": 'selected', "label": 'Confirmé', "innerText":"C"}}
																]
															}}
														]
													}}
												]
											}}
										]
									}},
									{"br":{}},
									{"div":{
										"id": "divBoxOptions", "style":"float:left;",
										"children":[
											{"input":{"type" :"checkbox", "id": "lock_v2"}},
											{"label":{"htmlFor" : "lock_v2", "innerText": "Verrouiller v2", id: "lock_v2_from_label", style :"padding-right:10px"}},
											{"input":{"type" :"checkbox", "id": "lock_v3"}},
											{"label":{"htmlFor" : "lock_v3", "innerText": "Verrouiller v3", id: "lock_v3_from_label", style :"padding-right:10px"}},

											{"input":{"type" :"checkbox", "id": "v2boxFromGMstorage"}},
											{"label":{"htmlFor" : "v2boxFromGMstorage", "innerText": "V2 from storage", id: "v2boxFromGMstorage_label", style :"padding-right:10px"}},
											{"input":{"type" :"checkbox", "id": "v3boxFromGMstorage"}},
											{"label":{"htmlFor" : "v3boxFromGMstorage", "innerText": "V3 from storage", id: "v3boxFromGMstorage_label", style :"padding-right:10px"}}
										]
									}},
									{"div":{
										"id": "divBoxToGMstorage", "style":"float:left;",
										"children":[
											{"input":{"type" :"checkbox", "id": "boxToGMstorage", "checked": 'checked'}},
											{"label":{"htmlFor" : "boxToGMstorage", "innerText": "Stocker (local + Git)", "id": "boxToGMstorage_label", "style" :"padding-right:10px" }}
										]
									}}
								]
							}
					};// fin retour
				
			} // fin JSON_divCVSSeditor(){
			function CERTFR_putCVSSeditor(debug=false){
				if(debug){printCustom("debug","Récupération du JSON CVSSeditor");}
				let JSON_div_CVSSeditor = JSON_divCVSSeditor();
				if(debug){printCustom("debug","JSON_div_CVSSeditor=",JSON_div_CVSSeditor);}
				let lstDOMCVSSeditor = createListElement_From_JSON(JSON_div_CVSSeditor,debug);
				if(debug){printCustom("debug","lstDOMCVSSeditor=",lstDOMCVSSeditor);}
				try{
					// récupération du titre
						let DOM_title = CERTFR_getMainTitle();
						if(debug){printCustom("debug","DOM_title=",DOM_title);}
						if(DOM_title==null){
							printCustom("FAIL","#1 titre introuvable, on ajoute au body");
							DOM_title=getDocumentBody();
							DOM_title.appendChild(...lstDOMCVSSeditor);
						}else{
							DOM_title.after(...lstDOMCVSSeditor);
						}
				}catch{}
			}

			// Cartouche
			function JSON_divCartouche(){
                // variables graphiques
                var font_size = "20px" ;
                var border_size = "0" ;
                var indentation_td = '40px';
                var greyedStyle = "background-color: #f0f0f0;"
				// retour
					return {
						"div":{
							"id" :'div_output', "style" : "font-size :"+font_size,
							"children":[
								{"input" : {"type":"hidden", "id": "scriptVersionUsed", "value": scriptVersion, "class": "only_for_html_export"}},
								{"table" : {
									"id" :'cartouche_table', "class": "only_for_html_export", "style":"display:block;", "border": border_size,
									"children":[
										{ "tr" : {
											"id": "cartouche_table_tr1",
											"children":[
												{ "td" : {"width": indentation_td, "style" :"padding-right:10px"}},
												{ "td" : {"innerText": "Gravité", "style" :"padding-right:10px"}}, //Gravité img png
												{ "td" : {"innerText": "Score de base", "style" :"padding-right:10px"}},
												{ "td" : {"innerText": "Score temporel", "style" :"padding-right:10px"}},
												{ "td" : {
													"innerText": "Vecteur", "style" :"padding-right:10px",
													"id" : "cartouche_table_tr1_td5",
													"children":[
														{"input" : {
															"type" : "button",
															"id" : 'btn_add_RLof_RCc',
															"size" : 3,
															"value" : 'Ajouter RL:OF + RC:C',
															"style" :"margin-left:10px",
															"class": "avoid_from_selection"
															,"tabIndex":3
														}}
													]
												}}
											]
										}},
										{ "tr" : {
											"id": "cartouche_table_tr2",
											"children":[
												{ "td" : {"innerText": "v2"}},
												{ "td" : {
													"id": "cartouche_table_v2_pictogramme_image_png",
													"children":[
														{ "img" : {"id": "img_png_v2", "width": "40", "height": "40"}}
													]
												}},
												{ "td" : {"id": "display_score_base_v2", "innerText": "undefined"}},
												{ "td" : {"id": "display_score_temp_v2", "innerText": "undefined"}},
												{ "td" : {
													"id": "display_vecteur_v2",
													"children":[
														{ "a" : {"id": "link_vecteur_v2", "target": '_blank', "innerText": "undefined"}},
														{ "input" : {
															"type":"text", "id": "refCVE_vecteur_v2",
															"class": "only_for_html_export inputTypeTextToHidden",
															"placeHolder":"CVE de référence pour ce vecteur",
															"style":greyedStyle, "readOnly":"readonly", "size":"13",
															"title":"La CVE qui correspond au score/vecteur",
															"onClick":"window.open('https://cyberwatch.internet.np/cve_announcements/'+this.value)",
															"tabIndex":-1
														}},
														{ "input" : {
															"type":"text", "id": "refCVE_vecteur_v2_source",
															"class": "only_for_html_export inputTypeTextToHidden",
															"placeHolder":"origine du vecteur",
															"title":"La source qui a fournit le vecteur","tabIndex":1
														}},
														{ "input" : {
															"type":"text", "id": "refCVE_v2_NVDpublishDate",
															"class": "only_for_html_export inputTypeTextToHidden",
															"style":greyedStyle, "readOnly":"readonly", "size":"8",
															"title":"Date de publication sur le site NVD","tabIndex":-1
														}},
														{ "input" : {
															"type":"text", "id": "refCVE_v2_NVDmodifiedDate",
															"class": "only_for_html_export inputTypeTextToHidden",
															"style":greyedStyle, "readOnly":"readonly", "size":"8",
															"title":"Date de mise à jour sur le site NVD","tabIndex":-1
														}},
														{ "input" : {
															"type":"text", "id": "refCVE_v2_NVDsource",
															"class": "only_for_html_export inputTypeTextToHidden",
															"style":greyedStyle, "readOnly":"readonly",
															"title":"L'éditeur responsable de la publication sur le site NVD","tabIndex":-1
														}}
													]
												}}
											]
										}},
										{ "tr" : {
											"id": "cartouche_table_tr3",
											"children":[
												{ "td" : {"innerText": "v3.1"}},
												{ "td" : {
													"id": "cartouche_table_v3_pictogramme_image_png",
													"children":[
														{ "img" : {"id": "img_png_v3", "width": "40", "height": "40"}}
													]
												}},
												{ "td" : {"id": "display_score_base_v3", "innerText": "undefined"}},
												{ "td" : {"id": "display_score_temp_v3", "innerText": "undefined"}},
												{ "td" : {
													"id": "display_vecteur_v3",
													"children":[
														{ "a" : {"id": "link_vecteur_v3", "target": '_blank', "innerText": "undefined"}},
														{ "input" : {
															"type":"text", "id": "refCVE_vecteur_v3",
															"class": "only_for_html_export inputTypeTextToHidden",
															"placeHolder":"CVE de référence pour ce vecteur",
															"style":greyedStyle, "readOnly":"readonly", "size":"13",
															"title":"La CVE qui correspond au score/vecteur",
															"onClick":"window.open('https://cyberwatch.internet.np/cve_announcements/'+this.value)",
															"tabIndex":-1
														}},
														{ "input" : {
															"type":"text", "id": "refCVE_vecteur_v3_source",
															"class": "only_for_html_export inputTypeTextToHidden",
															"placeHolder":"origine du vecteur",
															"title":"La source qui a fournit le vecteur","tabIndex":2
														}},
														{ "input" : {
															"type":"text", "id": "refCVE_v3_NVDpublishDate",
															"class": "only_for_html_export inputTypeTextToHidden",
															"style":greyedStyle, "readOnly":"readonly", "size":"8",
															"title":"Date de publication sur le site NVD","tabIndex":-1
														}},
														{ "input" : {
															"type":"text", "id": "refCVE_v3_NVDmodifiedDate",
															"class": "only_for_html_export inputTypeTextToHidden",
															"style":greyedStyle, "readOnly":"readonly", "size":"8",
															"title":"Date de mise à jour sur le site NVD","tabIndex":-1}},
														{ "input" : {
															"type":"text", "id": "refCVE_v3_NVDsource",
															"class": "only_for_html_export inputTypeTextToHidden",
															"style":greyedStyle, "readOnly":"readonly",
															"title":"L'éditeur responsable de la publication sur le site NVD","tabIndex":-1
														}}
													]
												}}
											]
										}}
									]
								}}
							]
						}
						
					} // fin return
			} // fin JSON_divCartouche(){
			function CERTFR_putCartouche(debug=false){
				if(debug){printCustom("debug","Récupération du JSON CVSSeditor");}
				let JSON_div_Cartouche = JSON_divCartouche();
				if(debug){printCustom("debug","JSON_div_Cartouche=",JSON_div_Cartouche);}
				let lstDOMCartouche = createListElement_From_JSON(JSON_div_Cartouche,debug);
				if(debug){printCustom("debug","lstDOMCartouche=",lstDOMCartouche);}
				try{
					// récupération du titre
						let DOM_title = CERTFR_getMainTitle();
						if(debug){printCustom("debug","DOM_title=",DOM_title);}
						if(DOM_title==null){
							printCustom("FAIL","#1 titre introuvable, on ajoute au body");
							DOM_title=getDocumentBody();
							DOM_title.appendChild(...lstDOMCartouche);
						}else{
							DOM_title.after(...lstDOMCartouche);
						}
				}catch{}
			}
// a remplacer ou tester
                function defaultTableBorder(){ return "1px solid black";}
                function higlightCellBorder(DOMitem){ DOMitem.style.border="2px solid red";}

                function resetTableBorderStyle(DOMitem){
                    switch(DOMitem.nodeName){
                        case "TABLE":
                        case "TBODY":
                        case "TR":
                        case "TH":
                        case "TD":
                            DOMitem.style.border=defaultTableBorder();
                            break;
                    }
                }
	
	
	
	
	
    // /FIN FONCTIONS GRAPHIQUES SPECIFIQUES ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
	//████████████████████████████████████████████████████████████████████████████████████████████████████████████
    // MAIN ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
		
		async function main(){
			// nettoyage
				CERTFR_removeUnecessaryDOM();
				//document.querySelector("html").setAttribute("xmlns","http://www.w3.org/1999/xhtml") // je ne sais plus pourquois
			// etape 0: création du framework
				// création des divs
					// div CVSSeditor
						CERTFR_putCVSSeditor();
					// Cartouche
						CERTFR_putCartouche();
					// liste des CVEs
						let JSON_div_cves = JSON_divCVEs(["CVE-2024-5274"]);
						let lstItems=createListElement_From_JSON(JSON_div_cves,false)
				
				// placement des divs
					console.log("lstItems=",...lstItems);
					let DOM_main=CERTFR_getDOM_rootContainer("right");
					console.log("DOM_main",DOM_main)
					if(DOM_main==null){DOM_main=getDocumentBody();}
					DOM_main.appendChild(...lstItems)
		}
	
		// attente que la page soit chargée
			window.addEventListener('load', function() {
				setTimeout(function() {
					console.clear();console.log("[CERT-FR] la console a été effacée"); // nettoyage de la console
					try{
						main();
					}catch(error){
						console.error(error);
					}
				}, 100);
			}, false);


    // /FIN MAIN ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
	//████████████████████████████████████████████████████████████████████████████████████████████████████████████
})();