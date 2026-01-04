// ==UserScript==
// @name          CERT-FR
// @namespace     CERT-FR
// @version       3.12.6
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
// @downloadURL https://update.greasyfork.org/scripts/372105/CERT-FR.user.js
// @updateURL https://update.greasyfork.org/scripts/372105/CERT-FR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scriptVersion = "3.07.13"; // doit être modifiée manuellement en cas de changement majeur du contenu ; si ce n'est que fonctionnel alors inutile de le changer
    /* 3.07.01* : ajout des métadonnées du site NVD (date de publication, date de modification NVD et source de la publication)
	   3.07.13* : ajout d'une mention "(rejected)" si la CVE avait été rejetée par NVD
	   3.07.14 : modification de l'info de publication NVD : "NA (<date du jour>)" par "inconnu de nvd en date du <date du jour>"
	   3.07.15 : choix de NVD meme si le stockage est plus elevé (en cas de rabaissement)
	   3.08.01 : ajout du stochage depuis PasteBin
	   3.10.01 : ajout du stockage depuis https://gitlab-ce.internet.np/vuln/cert-fr/-/tree/main/
	   3.10.05 : début de factorisation de code en MVC
                 ; ajout de controle supplémentaires sur les erreurs dans la page
                 ; ajout d'option de debug comme remplacer la liste des cve
       3.10.06 : ajout de boutons pour modifier les CVE, titre, une option pour ne pas sauvegarder
       3.11.00 : ajout de la fonction d'aide
       3.11.05 : ajout d'une fonction pour ajouter un UL pour les references CVE en cas de manque de ce dernier
       3.11.06 : patch liens vuldb de chaque CVE en bas de page
       3.11.07 : ajout d'un highlight sur la note cliqué depuis le tableau CSV
       3.11.09 : suppression du footer et amélioration de l'affichage (évolution possible, un bouton pour afficher le footer ?
	*/ // Notes de versions />

    // https://greasyfork.org/scripts/372105-cert-fr/code/CERT-FR.user.js

    /* TO DO :
          activer l'animation pendant le tri / améliorer le tri
          revoir le nomage du titre PAste surtout en le mettant à jour, actuellement il a un prefixe constant
	*/ // TO DO />
    /* < PROBLEMES
		Probleme quand on switch de score v2 a v3 depuis le tableau des CVE, l'image V2 passe à grise à un moment donnée
		https://www.cert.ssi.gouv.fr/avis/CERTFR-2022-AVI-881/ => probleme en basculant de stockage a sans stockage
		https://www.cert.ssi.gouv.fr/avis/CERTFR-2022-AVI-937/ => ne prends pas le stockage
		https://www.cert.ssi.gouv.fr/avis/CERTFR-2022-AVI-1019/ le stockage est superieur à la nouvelle mesure CVE-2022-3602
		https://www.cert.ssi.gouv.fr/avis/CERTFR-2023-AVI-0258/ Problème recupération vecteur  ? désactiver le stockage pour les tests
		QUAND ALE, le nom du fichier de stockage ne change pas, revoir le nom peut être
		    nom precedent : du 2022-556 au 2023-0093 ; agrandissement de la partie ID (5 caracteres) 2023-ALE-00015_2023-AVI-00093 ; et comparer les titres avec le max AVI et le MAX ALE
		https://www.cert.ssi.gouv.fr/avis/CERTFR-2023-AVI-0120/ :
		    Le score NVD a évolué, mais un ancien NVD etait superieur à celui présent dans le stockage, ajouter une priorité sur les nouveaux NVD
    */ // PROBLEMES />

    // NOUVELLE FACTORISATION #####################################
    /* LEGENDE
        prefixe :
           - get_XXX = retourne l'objet XXX
           - is_XXX = retourne un bouleen satisfaisant la condition XXX
           - DOM_action_XXX = action sur la page (DOM) concernant XXX
           - ---_XXX = action multiple --- permet d'exprimer simplement l'action sur XXX (clean_listCVE -> nettoye la liste mais également supprime les objets DOM relatif)
    */
    // GENERIQUE
        // DOM
            function get_list_DOM_items_of_a_class(className, itemTag){
                var obj_DOM_parent, list_DOM_parent;
                try{
                    obj_DOM_parent = $("."+className+" "+itemTag); // retourne object{0:DOM,..., n:DOM}
                    list_DOM_parent = Object.values(obj_DOM_parent); // recupère la liste des valeur en tant que tableau (pour appliquer filter)
                }catch (error) {
                    debug("[get_list_DOM_items_of_a_class] ERROR : "+error, "error");
                }
                return list_DOM_parent;
            } // OK
    // FIN GENERIQUE

    /*
    Modèle : cette partie gère ce qu'on appelle la logique métier de votre site. Elle comprend notamment la gestion des données qui sont stockées,
    mais aussi tout le code qui prend des décisions autour de ces données. Son objectif est de fournir une interface d'action la plus simple possible au contrôleur.
    On y trouve donc entre autres des algorithmes complexes et des requêtes SQL.
    */ // MODELE
        // CVE
            function get_regEx_CVE(){return /((CVE)\-([0-9]{4})\-[0-9]*)/g;}//OK
            function get_regEx_lienCVE(){return /(http[s]{0,1}:\/\/(.*))/g;}//OK

        // Page
            function get_regEx_title_referenceCVE(){return /documentation/ig;}//OK
            function is_title_referenceCVE(DOM_item){ // retourne vrai si l'objet en entrée est le titre des references CVE
                var isOK = false;
                if(typeof DOM_item == "object"){
                    if("innerText" in DOM_item){
                        var regEx = get_regEx_title_referenceCVE();
                        isOK = DOM_item.innerText.match(regEx) != null
                    }
                }
                return isOK;
            }//OK

            function get_regEx_txtCVE_CERTFR(){return /(.*?)( CVE )((CVE)\-([0-9]{4})\-[0-9]*)/g;}//OK
            function is_referenceCVE_CERTFR(DOM_item){ // retourne vrai si l'objet en entrée  est l'objet referencant une CVE
                var isOK = false;
                if(typeof DOM_item == "object"){
                    if("innerText" in DOM_item){
                        var regEx = get_regEx_txtCVE_CERTFR();
                        isOK = DOM_item.innerText.match(regEx) != null
                    }
                }
                return isOK;
            }//OK
            function get_text_referenceCVE(DOM_item){ // retourne le text correspondant au noeud text
                let result = document.evaluate(
                    'text()[1]', // xpathExpression ; "text()[matches(., '.*')]" ne fonctionne pas
                    DOM_item, // contextNode
                    null, // namespaceResolver
                    XPathResult.STRING_TYPE, // resultType
                    null //result
                ).stringValue;
                return result;
            } // OK mais pourrait être amélioré au niveau de la regex à la recherche du bon textnode
            function get_CVE_fromItem(DOM_item, attribute="innerText", defaultValue=""){ // extrait la référence CVE depuis l'objet référencant une CVE
                var CVE = defaultValue;
                var matchCVE
                if(typeof DOM_item == "object" && DOM_item!= null){
                    if(DOM_item.hasAttribute(attribute) || attribute in DOM_item){
                        matchCVE = DOM_item[attribute].match(get_regEx_CVE());
                        if(matchCVE){
                            CVE = matchCVE[0];
                        }
                    }
                }
                return CVE;
            }//OK
            function getNextItem_as_(DOM_item, searchFor="a"){
                searchFor=searchFor.toLowerCase();
                let nextSibling = DOM_item.nextElementSibling;
                if(nextSibling!=null){// a un voisin
                    let siblingType = nextSibling.nodeName.toLowerCase();
                    if(siblingType!=searchFor){ // on passe au suivant
                        nextSibling = getNextItem_as_(nextSibling, searchFor)
                    }
                }
                return nextSibling;
            }
            function get_a_CVE_fromItem(DOM_item){ // extrait la référence CVE depuis l'objet référencant une CVE
                var DOM_a_CVE = null;
                var matchCVE
                if(typeof DOM_item == "object" && DOM_item!= null){
                    DOM_a_CVE = DOM_item.querySelector('a');
                    if(DOM_a_CVE==null){ // on cherche le suivant dans ses siblings
                        DOM_a_CVE=getNextItem_as_(DOM_item, "a");
                    }
                }
                return DOM_a_CVE;
            }//OK
            function get_list_DOM_li(){return get_list_DOM_items_of_a_class("article-content", "li");} // OK
            function fix_DOMul_nextSibling(DOMul_expected){
                var DOMul, sibling;


                switch(DOMul_expected.nodeName.toLowerCase()){
                    case 'ul': // all good
                        DOMul = DOMul_expected;
                        break;
                    case 'li': // pas un UL
                        // création de l'ul
                        DOMul = document.createElement('ul');
                        // clone de l'actuel li
                        sibling = DOMul_expected;
                        // remplacement de l'objet attendu ul par un ul
                        DOMul_expected.replaceWith(DOMul);
                        // ajout de l'élément dans le ul
                        DOMul.appendChild(sibling);
                        while(DOMul.nextElementSibling){
                            if(DOMul_expected.nodeName.toLowerCase() === "li"){
                                sibling = DOMul.nextElementSibling;
                                DOMul.appendChild(DOMul_expected);
                                DOMul_expected = sibling;
                            }else{
                                break;
                            }
                        }
                        break;
                }

                return DOMul;
            }
            function get_ul_CVE(){
                var list_DOM_parent, list_DOM_itemsTitleCVE = [];
                var last_DOM_titleCVE, DOM_UL_CVES=null;
                try{
                    list_DOM_parent = get_list_DOM_items_of_a_class("article-content", "h2");
                    list_DOM_itemsTitleCVE = list_DOM_parent.filter(is_title_referenceCVE) // récupère la liste des objets li qui sont une référence à une CVE par le CERTFR
                    if(list_DOM_itemsTitleCVE.length>0){
                        last_DOM_titleCVE = list_DOM_itemsTitleCVE[list_DOM_itemsTitleCVE.length -1];
                        if("nextElementSibling" in last_DOM_titleCVE){
                            DOM_UL_CVES = last_DOM_titleCVE.nextElementSibling
                            DOM_UL_CVES = fix_DOMul_nextSibling(DOM_UL_CVES);
                            //console.log("### UL obtenu : ",DOM_UL_CVES)
                        }
                    }
                }catch (error) {
                    debug("[get_ul_CVE] ERROR : "+error, "error");
                }
                return DOM_UL_CVES;
            } // OK
            function get_list_DOM_CVEs_fromPage(){ // retourne la liste des objets DOM qui sont des references à une CVE
                var list_DOM_parent, list_DOM_itemsCVE = []; // sortie
                try{
                    list_DOM_parent = get_list_DOM_li();
                    list_DOM_itemsCVE = list_DOM_parent.filter(is_referenceCVE_CERTFR) // récupère la liste des objets li qui sont une référence à une CVE par le CERTFR
                }catch (error) {
                    debug("[get_list_DOM_CVEs_fromPage] ERROR : "+error, "error");
                }
                return list_DOM_itemsCVE;
            }//OK
            function get_list_string_CVEs_from_list_DOM_CVEs(list_DOM_itemsCVE){ // retourne la liste des CVE depuis la liste des DOM
                var listCVEs = [];
                for(var i=0;i<list_DOM_itemsCVE.length;i++){
                    listCVEs.push(get_CVE_fromItem(list_DOM_itemsCVE[i]));
                }
                return listCVEs;
            } // OK

            function make_OG_CVEitem(CVE, DOM_ul= get_ul_CVE()){ // OG pour originale
                if(DOM_ul){
                    if(typeof DOM_ul == "object"){
                        var li = document.createElement( 'li' );
                        li.appendChild(document.createTextNode("Référence CVE "+CVE));
                        li.appendChild(document.createElement("br"));
                        var a = document.createElement("a");
                        a.href = "https://www.cve.org/CVERecord?id="+CVE;
                        a.innerText = a.href;
                        li.appendChild(a);
                        DOM_ul.appendChild(li);
                    }
                }
            } // OK (entre la vue et la donnée
            function replace_CVEitem(DOM_itemCVE_old, DOM_ul= get_ul_CVE()){
                if(DOM_ul){
                    var CVE = get_CVE_fromItem(DOM_itemCVE_old);
                    var children = DOM_itemCVE_old.childNodes
                    var child, newItem, url_cyberwatch;

                    // recupération du texte de reference
                    var textReference = get_text_referenceCVE(DOM_itemCVE_old);

                    // creation du nouveau LI
                    var DOM_itemCVE_new = document.createElement('li');
                    // creation du texte de reference
                    child = document.createElement('p');
                    child.id = "li_CVE_"+CVE;
                    child.innerText = textReference;

                    DOM_itemCVE_new.appendChild(child);

                    // ajout du lien originel
                    child = get_a_CVE_fromItem(DOM_itemCVE_old);//.querySelector('a');
                    DOM_itemCVE_new.appendChild(child);

                    // ajout d'un br custom
                    child = document.createElement('br');//DOM_itemCVE_old.querySelector('br');
                    child.classList.add("avoid_from_selection_but_for_html_export")
                        DOM_itemCVE_new.appendChild(child);

                    // ajout du lien cyberwatch
                    url_cyberwatch = "https://cyberwatch.internet.np/cve_announcements/"+CVE;
                    child = document.createElement('a');
                    child.href = url_cyberwatch;
                    child.target = "_blank";
                    child.classList.add("only_for_html_export");
                    child.innerText = url_cyberwatch;
                    DOM_itemCVE_new.appendChild(child);
                    DOM_ul.replaceChild(DOM_itemCVE_new, DOM_itemCVE_old);
                }
            }


        // storage

        // online Storage

        // APIs
            function searchVulDB(event){
                // fonction qui lance la recherhce sur vuldb
                //console.log(event)
                try{
                    var cveToSearch = event.target.getAttribute('_toSearch');
                    console.log("[searchVulDB] : ",cveToSearch)
                    // recupération de l'objet cible
                    switch (event.which) {
                        case 1: // Left
                        case 2: // Middle
                            $('#'+cveToSearch+'_vuldb').children(":first").removeAttr('style');
                            $('#'+cveToSearch+'_vuldb').children(":first").css("margin","0 0 3px 20px");
                            //$(document).delegate("#"+CVE+"_vuldb","click",function(){
                            updateClipboard(cveToSearch);
                            $('#search_vuldb_'+cveToSearch).submit();
                            //});
                            break;
                            break;
                        case 3: // Right
                            $('#'+cveToSearch+'_vuldb').children(":first").css("filter","invert(1)");
                            break;
                    }
                }catch(error){
                    console.error("[searchVulDB] ERROR :", error.message);
                }
            }

    /*
    Vue : cette partie se concentre sur l'affichage. Elle ne fait presque aucun calcul et se contente de récupérer des variables pour savoir ce qu'elle doit afficher.
    On y trouve essentiellement du code HTML mais aussi quelques boucles et conditions PHP très simples, pour afficher par exemple une liste de messages.
    */ // VUE
            function DOM_remove_object(DOM_item){DOM_item.remove();}//OK
            function get_DOMid_debugPage(){return "cmb_log_page";}//OK en devenir select_debugPage
            function add_option_in_select(selectID, optionValue, optionText){
                try{
                    add_log_to_CMB_PAGE(optionText);
                }catch (error){
                    debug("[add_option_in_select] ERROR : "+error, "error");
                }
            }//WIP

            // DEMO / AIDE / TUTO / INTRO
					// ************ <BLOC INTRO/DEMO/AIDE copié
						// FONCTION GENERIQUES OK
							// GUI SIMPLE
								function show(DOMobject){DOMobject.style.display="block";} // v1.0
								function hide(DOMobject){DOMobject.style.display="none";} // v1.0
								function getTheHigerZindex_of_the_document(){ // fonction qui retourne le zIndex max de la page (et modifie les auto dans la valeur max pour figer la cascade // v1.0
									// declaration des variables
										var zIndex = 0;
										var lst_DOMobject_with_zIndex_auto = []
										var zIndex_temp, css_obj, i;

										var all = document.querySelectorAll("*");

									// pour chaque element de la feuille, on recherche le zindex max ; et on garde dans une liste ceux en auto
										for(i=0 ; i<all.length ; i++){
											try{
												css_obj = getComputedStyle(all[i]);
												zIndex_temp =css_obj.getPropertyValue("z-index");

												if(zIndex_temp){
													if( zIndex_temp == "auto"){ // cas particulier, lister ceux à auto, puis leur donner la valeur max à la fin
														lst_DOMobject_with_zIndex_auto.push(all[i]);
													}else{
														zIndex = zIndex<zIndex_temp ? zIndex_temp : zIndex;
													}
												}
											}catch{
											}
										}
                                    // remise des auto à la valeur max actuelle, sera équivalent à un auto en terme de rendu mais permettra l'aide d'etre au dessus temporairement
										for(i=0;i<lst_DOMobject_with_zIndex_auto.length;i++){
											lst_DOMobject_with_zIndex_auto[i].style.zIndex = zIndex;
										}
									// SORTIE
										return zIndex;
								}


						// FONCTIONS PRIVEES
							// GUI style
								function set_style_popup(DOMobject){
									DOMobject.style.border= "5px solid green";
									DOMobject.style.position= "fixed";
									DOMobject.style.zIndex= "1";
									DOMobject.style.left= "0";
									DOMobject.style.top= "0";
									DOMobject.style.width= "100%";
									DOMobject.style.height= "100%";
									DOMobject.style.overflow= "auto";
									DOMobject.style.backgroundColor= "rgba(0, 0, 0, 0.6)";
									DOMobject.style.display= "none";
								}
								function set_style_popupContent(DOMobject){
									DOMobject.style.border= "5px solid yellow";
									DOMobject.style.backgroundColor= "white";
									DOMobject.style.padding= "20px";
									DOMobject.style.width= "auto";
									DOMobject.style.height= "auto";
									DOMobject.style.fontWeight= "bolder";
								}
							// GUI POPUP MESSAGE
								function set_popupBoxMessage(zIndexTop){ // cree la div autour du message // v1.0
									var DOMBoxMessage = document.createElement("div");
									set_style_popup(DOMBoxMessage)
										DOMBoxMessage.id="myPopup";
										DOMBoxMessage.style.zIndex = zIndexTop
										DOMBoxMessage.style.position = "absolute"

									// positionnement
										var body = document.querySelector("body");
										body.insertBefore(DOMBoxMessage, body.firstChild)

									return DOMBoxMessage
								} // v1.0
								function placePopupMessageAroundTarget(DOMBoxMessage, DOMhighlight){ // place le corps du message au meilleur endroit // v1.0
									// recupération du message
										var DOMmessage = DOMBoxMessage.firstChild;
									// récupération de la taille de la fenetre
										var w = window.innerWidth;
										var h = window.innerHeight;
										//console.log("#1 windows :", w," x ", h);

									// récupération de la taille de la cible
										var rectTarget = DOMhighlight.getBoundingClientRect();
										//console.log("#2 rectTarget", rectTarget)

									// récupération de la taille du message
										show(DOMBoxMessage);
										var rectMessage = DOMmessage.getBoundingClientRect();
										//console.log("#3 rectMessage", rectMessage)
										//console.log(DOMBoxMessage.style.display)
										hide(DOMBoxMessage); // on cache l'objet après avoir récupéré ses dimensions
										//console.log(DOMBoxMessage.style.display)

									// définition de la position idéale
										var rightSpace = w - rectTarget.right;
										var topSpace = rectTarget.top;
										var leftSpace = rectTarget.left;
										var bottomSpace = h - rectTarget.bottom;

										var leftMessage = rectMessage.left;
										var topMessage = rectMessage.top;

										if(rightSpace>=rectMessage.width){ // recherche si de la place à droite de l'element
											//console.log("droite");
											leftMessage = rectTarget.right;
											topMessage = rectTarget.top;
										}else if(topSpace>=rectMessage.height){ // recherche de la place dessus l'element
											//console.log("dessus");
											leftMessage = 0;
											topMessage = rectTarget.top-rectMessage.height;
										}else if(leftSpace>=rectMessage.width){ // recherche de la place à gauche de l'element
											//console.log("gauche");
											leftMessage = (rectTarget.left-rectMessage.width);
											topMessage = rectTarget.top;
										}else if(bottomSpace>=rectMessage.height){ // recherche de la place en dessous l'element
											//console.log("dessous");
											leftMessage = 0;
											topMessage = rectTarget.top + rectTarget.height;
										}else{// affichage en plein centre mais déplacable et redimensionnable // WIP
										}
										DOMmessage.style.left = Math.round(leftMessage) +"px";
										DOMmessage.style.top = Math.round(topMessage) +"px";
									} // v1.0


								function closePopUp(event, DOMhighlight, DOMBoxMessage){ // fonction qui supprime l'objet popup message et arrete le surlignement d'un objet// v1.0
									if (event.target == DOMBoxMessage && event.target != DOMBoxMessage.firstChild) { // en dehors du popup message
										cleanHighLight(DOMhighlight);
										DOMBoxMessage.remove();
									}
								} // v1.0
								function clickAtParent(child){ // fonction qui click sur le parent du message (autour du popup message) ce qui pousse à la fermeture // v1.0
									child.parentNode.click();
								} // v1.0

							// GUI HIGHLIGHT
								function makeHighLight(DOMtarget){ // fonction qui met en lumière la cible // v1.0
									var DOMhighlight = document.createElement("div");
									DOMhighlight.style = DOMtarget.style
									DOMhighlight.style.boxSizing="border-box";
										DOMhighlight.style.padding = "10px";
										DOMhighlight.style.height = "max-content";
										DOMhighlight.style.width = "max-content";
										DOMhighlight.style.backgroundColor = "white";
										DOMhighlight.style.border = "3px dotted red"; // = "border:1px solid black;border-spacing:10px;margin: 20px auto";

									DOMtarget.replaceWith(DOMhighlight);
									DOMhighlight.appendChild(DOMtarget)
									return DOMhighlight;
								} // v1.0

								function cleanHighLight(DOMtarget){ // fonction qui récupère le highlight et reverse la mise en lumière // v1.0
									var DOMoriginalTarget = DOMtarget.firstChild;
									DOMtarget.replaceWith(DOMoriginalTarget);
								} // v1.0


						// FONCTIONS PUBLIQUES
							function closePopUpFromInnerMessage(DOMmessage){if(DOMmessage){clickAtParent(DOMmessage);}} // v1.0

							function messageFor(DOMmessage, DOMtarget=document.querySelector("body")){ // fonction qui génère le popup contenant le message et highlight une cible // v1.0
								var zIndexTop = getTheHigerZindex_of_the_document()+1;
								// Highlight la cible
									var DOMhighlight = makeHighLight(DOMtarget);
								// cadre du message
									var DOMBoxMessage = set_popupBoxMessage(zIndexTop);
										DOMBoxMessage.appendChild(DOMmessage);

								// modificaiton de la cible
									DOMhighlight.style.zIndex = zIndexTop+1;
									DOMhighlight.style.position = "absolute"

								// pre modification du message
									DOMmessage.style.position = 'absolute';

								// Positionnement du message si pas précisé
									placePopupMessageAroundTarget(DOMBoxMessage, DOMhighlight);

								// affichage du message
									//console.log(DOMBoxMessage.style.display)
									DOMBoxMessage.classList.add("popup", "show");
									show(DOMBoxMessage);
									//console.log(DOMBoxMessage.style.display)

								// ajout des fonction de fermeture # https://weekendprojects.dev/posts/how-to-pass-parameter-to-a-addeventlistener-function/
									window.addEventListener("click", (event) => closePopUp(event, DOMhighlight, DOMBoxMessage));

							}

							// fonction de creation du corps du message
								function makePopUpMessage(title, message, precedentFctToCall = false, nextFctToCall = false){ // fonction qui permet la creation d'un message générique // v1.0
									// declaration des variables
										var child, DOMmessage, btnTd_gauche, btnTd_droite;

									// creation du cadre du message
										DOMmessage = document.createElement("div");
											DOMmessage.id = "messageDiv";
											set_style_popupContent(DOMmessage)

									// bouton fermer (x)
										child = document.createElement('span');
											child.innerText = "X"
											child.style.textAlign = "right";
											child.style.float = "right";
											child.style.borderRadius = "10px";
											child.style.padding = "5px";
											child.style.border = "2px solid black";
											child.style.color = "darkred";
											child.style.backgroundColor = "lightgrey";
											child.addEventListener("click",(event) => closePopUpFromInnerMessage(DOMmessage));
										DOMmessage.appendChild(child)

									// titre
										child = document.createElement("h1");
											child.innerText = title;
											child.style.color = "green";
										DOMmessage.appendChild(child)

									// corps du message
										child = document.createElement("p");
											child.innerText = message;
										DOMmessage.appendChild(child)

									// creation des div avec les boutons
										btnTd_gauche = document.createElement("div");
											btnTd_gauche.style.textAlign = "left";
											btnTd_gauche.style.float = "left";
											btnTd_gauche.style.border = "2px solid red";
										btnTd_droite = document.createElement("div");
											btnTd_droite.style.textAlign = "right";
											btnTd_droite.style.float = "right";
											btnTd_droite.style.border = "2px solid blue";
										DOMmessage.appendChild(btnTd_gauche);
										DOMmessage.appendChild(btnTd_droite);

									// ajout des boutons
										if(precedentFctToCall){
											child = document.createElement('a');
												child.href="#";
												child.target=""
												child.innerText = "Précedent"
												child.addEventListener("click",(event) => precedentFctToCall(DOMmessage)); // permet de fermet ce message pour afficher le precedent
											btnTd_gauche.appendChild(child)
										}

										if(nextFctToCall){
											child = document.createElement('a');
												child.href="#";
												child.target=""
												child.innerText = "Suivant"
												child.addEventListener("click",(event) => nextFctToCall(DOMmessage)); // permet de fermet ce message pour afficher le suivant
											btnTd_droite.appendChild(child)
										}
									// sortie
										return DOMmessage;
								} // v1.0

								function makePopUpMessage_lst_dict(title, message, list_dictBoutons = [{txt:"txt bouton", fct:false}]){ // fonction qui permet la creation d'un message générique XX fct du dict peut être faux, sinon cela doit être le nom d'une fonction qui prend en paramètre facultatif l'objet DOM à l'origine de ce popup message // v1.1
									// declaration des variables
										var child, DOMmessage, i, box_btn_div, btn_txt, btn_fct, btn_div;

									// creation du cadre du message
										DOMmessage = document.createElement("div");
											DOMmessage.id = "messageDiv";
											set_style_popupContent(DOMmessage);

									// bouton fermer (x)
										child = document.createElement('span');
											child.innerText = "X"
											child.style.textAlign = "right";
											child.style.float = "right";
											child.style.borderRadius = "10px";
											child.style.padding = "5px";
											child.style.border = "2px solid black";
											child.style.color = "darkred";
											child.style.backgroundColor = "lightgrey";
											child.addEventListener("click",(event) => closePopUpFromInnerMessage(DOMmessage));
										DOMmessage.appendChild(child)

									// titre
										child = document.createElement("h1");
											child.innerText = title;
											child.style.color = "green";
										DOMmessage.appendChild(child)

									// corps du message
										child = document.createElement("div");
											child.innerHTML = message;
										DOMmessage.appendChild(child)

									// creation de la div contenant les div des liens
										box_btn_div = document.createElement("div");
											box_btn_div.style.textAlign = "justify";
											box_btn_div.style.textJustify = "distribute-all-lines";
											//box_btn_div.style.flexWrap = "wrap";
											//box_btn_div.style.display = "inline-flex";

									// ajout des boutons
										for(i=0;i<list_dictBoutons.length;i++){
											btn_txt = list_dictBoutons[i].txt
											btn_fct = list_dictBoutons[i].fct


											// creation de la div contenant le lien (pour mieux le placer)
												btn_div = document.createElement("div");
													btn_div.style.border = "2px solid red"; // pour debug
													//btn_div.with = "auto"; // pour debug
													btn_div.with = "calc(100% / "+i+")";
													btn_div.style.verticalAlign = "top";
													btn_div.style.display = "inline-block";
													btn_div.style.display = "inline";
													btn_div.style.zoom = 1;

												// on regarde à quelle position de la liste on se trouve
													if(i==0){ // c'est le premier element
														//btn_div.style.textAlign = "left";
														//btn_div.style.float = "left";
													}else if(i == list_dictBoutons.length -1){ // c'est le dernier element
														//btn_div.style.textAlign = "right";
														//btn_div.style.float = "right";
													}else{ // case au centre
														//btn_div.style.textAlign = "justify";
														//btn_div.style.display="inline-block";
														//btn_div.style.display="flex";
														//btn_div.style.textAlign = "left";
														//btn_div.style.float = "left";
														//btn_div.style.justifyContent="space-around";
														//btn_div.style.justifyContent="space-between";
													}

											if(btn_fct){ // une fonction est à apellé

												// on s'assure qu'il y a du texte
													btn_txt = btn_txt ? btn_txt : 'fonction_'+i;

												// création du bouton
													child = document.createElement('a'); // lien sans cible
														child.href="#";
														child.target=""
														child.innerText = btn_txt
													// ajout d'un event de click
														child.addEventListener("click",(event) => precedentFctToCall(DOMmessage)); // permet de fermet ce message pour afficher le precedent

												// on ajoute le bouton à la div
													btn_div.appendChild(child);
											}else{ // pas de fonction appelée, donc sert à bloquer un espace
											}

											box_btn_div.appendChild(btn_div);
											DOMmessage.appendChild(box_btn_div);
										}
										// creation de la SPAN qui les relier
											child = document.createElement("span");
												child.style.width = "100%"
												child.style.display = "inline-block";
												child.style.display = "inline";
												child.style.fontSize = 0;
												child.style.lineHeight = 0;

											btn_div.appendChild(child);

									// sortie
										return DOMmessage;
								} // v1.1

					// ************ BLOC INTRO/DEMO/AIDE copié>

                function makePopUpMessage_squelette_v1_0(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("myButton");
                    var title = "";
                    var message = "";
                    var precedentFctToCall = false;
                    var nextFctToCall = false;//makePopUpMessage_2;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("tableCVEs");
                    var title = "Liste des CVE";
                    var message = "Dans ce tableau se trouve les CVE trouvés dans l'article,\nIl existe plusieurs interactions depuis ce tableau";
                    var precedentFctToCall = false;
                    var nextFctToCall = makePopUpMessage_listCVE_ths;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_ths(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("tableCVEs_THs");
                    var title = "Tri";
                    var message = "Les entêtes fournissent un tri en cliquant dessus";
                    var precedentFctToCall = makePopUpMessage_listCVE;
                    var nextFctToCall = makePopUpMessage_listCVE_CVE;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }

                function get_DOM_td(DOMtable, row=0,col=0, rowType="tr", colType="td"){
                    var i, cpt, trs, tr, tds, td, DOMoutput = DOMtable;
                    trs = DOMtable.querySelectorAll(rowType);
                    //console.log(trs)
                    if(row<trs.length){
                        tr = trs[row];
                        cpt = 0;
                        //console.log(tr)
                        for(i=0;i<tr.childNodes.length;i++){
                            td = tr.childNodes[i];
                            //console.log("? ",td);
                            if(td.nodeName == colType.toUpperCase()){
                                if(cpt==col){
                                    DOMoutput = td;
                                    break;
                                }
                                cpt++;
                            }
                        }
                    }
                    return DOMoutput ;
                }

                function makePopUpMessage_listCVE_CVE(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOM_table = document.getElementById("tableCVEs");
                    var DOMtarget = get_DOM_td(DOM_table,1,0, "tr", "td");
                    if(DOMtarget == DOM_table){// pas de CVE, on prend l'entete th
                        //console.log("### indentique ###");
                        DOMtarget = get_DOM_td(DOM_table,0,0, "tr", "th");
                        //console.log(DOMtarget);
                    }
                    var title = "CVE";
                    var message = "La cellule CVE (pour chaque CVE) contient des informations cachées obtenues depuis NVD\nEn cliquant dessus cela copie dans le presse-papier le nom de la CVE\n\n1/100";
                    var precedentFctToCall = makePopUpMessage_listCVE_ths;
                    var nextFctToCall = makePopUpMessage_listCVE_v2;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_v2(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOM_table = document.getElementById("tableCVEs");
                    var DOMtarget = get_DOM_td(DOM_table,1,2);
                    if(DOMtarget == DOM_table){// pas de CVE, on prend l'entete th
                        DOMtarget = get_DOM_td(DOM_table,0,2, "tr", "th");
                    }
                    var title = "Le score v2";
                    var message = "La cellule v2 (pour chaque CVE) contient le score trouvé depuis NVD\nEn cliquant dessus cela selectionne la CVE dans le cartouche et applique le score et meta données relatives";
                    var precedentFctToCall = makePopUpMessage_listCVE_CVE;
                    var nextFctToCall = makePopUpMessage_listCVE_v3;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_v3(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOM_table = document.getElementById("tableCVEs");
                    var DOMtarget = get_DOM_td(DOM_table,1,3);
                    if(DOMtarget == DOM_table){// pas de CVE, on prend l'entete th
                        DOMtarget = get_DOM_td(DOM_table,0,3, "tr", "th");
                    }
                    var title = "Le score v3";
                    var message = "La cellule v3 (pour chaque CVE) contient le score trouvé depuis NVD\nEn cliquant dessus cela selectionne la CVE dans le cartouche et applique le score et meta données relatives";
                    var precedentFctToCall = makePopUpMessage_listCVE_v2;
                    var nextFctToCall = makePopUpMessage_listCVE_v3_CNA;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_v3_CNA(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOM_table = document.getElementById("tableCVEs");
                    var DOMtarget = get_DOM_td(DOM_table,1,4);
                    if(DOMtarget == DOM_table){// pas de CVE, on prend l'entete th
                        DOMtarget = get_DOM_td(DOM_table,0,4, "tr", "th");
                    }
                    var title = "Le score v3 CNA";
                    var message = "La cellule v3 CNA (pour chaque CVE) contient le score trouvé depuis NVD mais fournis par l'éditeur\nEn cliquant dessus cela selectionne la CVE dans le cartouche et applique le score et meta données relatives";
                    var precedentFctToCall = makePopUpMessage_listCVE_v3;
                    var nextFctToCall = makePopUpMessage_listCVE_lien_NVD;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_lien_NVD(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOM_table = document.getElementById("tableCVEs");
                    var DOMtarget = get_DOM_td(DOM_table,1,5);
                    if(DOMtarget == DOM_table){// pas de CVE, on prend l'entete th
                        DOMtarget = get_DOM_td(DOM_table,0,5, "tr", "th");
                    }
                    var title = "Le lien NVD";
                    var message = "Le lien NVD ouvre un nouvel onglet vers la page NVD de la CVE";
                    var precedentFctToCall = makePopUpMessage_listCVE_v3_CNA;
                    var nextFctToCall = makePopUpMessage_listCVE_lien_google;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_lien_google(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOM_table = document.getElementById("tableCVEs");
                    var DOMtarget = get_DOM_td(DOM_table,1,6);
                    if(DOMtarget == DOM_table){// pas de CVE, on prend l'entete th
                        DOMtarget = get_DOM_td(DOM_table,0,5, "tr", "th");
                    }
                    var title = "Le lien Google";
                    var message = "Le lien Google ouvre un nouvel onglet vers la page Google qui recherche 'cvss' 'CVE'";
                    var precedentFctToCall = makePopUpMessage_listCVE_lien_NVD;
                    var nextFctToCall = makePopUpMessage_listCVE_lien_CW;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_lien_CW(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOM_table = document.getElementById("tableCVEs");
                    var DOMtarget = get_DOM_td(DOM_table,1,7);
                    if(DOMtarget == DOM_table){// pas de CVE, on prend l'entete th
                        DOMtarget = get_DOM_td(DOM_table,0,5, "tr", "th");
                    }
                    var title = "Le lien Cyberwatch";
                    var message = "Le lien Cyberwatch ouvre un nouvel onglet vers la page Cyberwatch de la CVE";
                    var precedentFctToCall = makePopUpMessage_listCVE_lien_google;
                    var nextFctToCall = makePopUpMessage_listCVE_div_input;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }

                function makePopUpMessage_listCVE_div_input(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("div_input");
                    var title = "La zone input";
                    var message = "Cette zone sert à modifier le cartouche de criticité";
                    var precedentFctToCall = makePopUpMessage_listCVE_lien_CW;
                    var nextFctToCall = makePopUpMessage_listCVE_input_text_cvss;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_input_text_cvss(DOMprevious=false){ // ajouter la surbrillance sur les case à cocher : DIV + call fonction + call clean @ close
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("input_text_cvss");
                    var title = "Saisie du vecteur";
                    var message = "Cette barre de saisie permet de convertir le vecteur CVSS saisi en un score calculé pour le cartouche \n\nATTENTION aux verrouillages (les cases à cocher plus bas)";
                    var precedentFctToCall = makePopUpMessage_listCVE_div_input;
                    var nextFctToCall = makePopUpMessage_listCVE_boxToGMstorage_label;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_listCVE_boxToGMstorage_label(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("divBoxToGMstorage");
                    var title = "Case à cocher 'Stocker (local + Git)'";
                    var message = "Cette case permet de tester le script sans affecter le stockage.\nLaisser cochée pour le traitement courant.\n\nPI : En décochant la case, au téléchargement du fichier, vous ne modifierez pas le stockage";
                    var precedentFctToCall = makePopUpMessage_listCVE_input_text_cvss;
                    var nextFctToCall = makePopUpMessage_cartouche_table;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_cartouche_table(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("cartouche_table");
                    var title = "Cartouche de criticité";
                    var message = "Dans ce tableau se trouvent les CVE avec le score v2 et v3 les plus élevés,\nIl y a qu'un seul champ éditable\n, les autres sont obtenus en cliquant sur la cellule du score de la CVE choisie et en modifiant le vecteur";
                    var precedentFctToCall = makePopUpMessage_listCVE_boxToGMstorage_label;
                    var nextFctToCall = makePopUpMessage_refCVE_vecteur_v2_source;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_refCVE_vecteur_v2_source(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("refCVE_vecteur_v2_source");
                    var title = "Saisie de l'origine du score";
                    var message = "Dans cette barre de saisie, vous pouvez ajouter un commentaire quant à l'origine comme l'URL du bulletin de l'éditeur ou d'autres infos";
                    var precedentFctToCall = makePopUpMessage_cartouche_table;
                    var nextFctToCall = makePopUpMessage_link_vecteur_v2;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_link_vecteur_v2(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("link_vecteur_v2");
                    var title = "Lien vecteur";
                    var message = "En cliquant sur ce lien, vous appliquerez le vecteur dans la zone de modification";
                    var precedentFctToCall = makePopUpMessage_refCVE_vecteur_v2_source;
                    var nextFctToCall = makePopUpMessage_btn_add_RLof_RCc;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_btn_add_RLof_RCc(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("btn_add_RLof_RCc");
                    var title = "Bouton appliquer score temporel par défaut";
                    var message = "Ce bouton applique aux deux scores les attributs temporels les plus courants : confirmé par l'éditeur, et correction officielle";
                    var precedentFctToCall = makePopUpMessage_link_vecteur_v2;
                    var nextFctToCall = makePopUpMessage_html_gen;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }
                function makePopUpMessage_html_gen(DOMprevious=false){
                    closePopUpFromInnerMessage(DOMprevious)
                    var DOMtarget = document.getElementById("html_gen");
                    var title = "Bouton de téléchargement HTML";
                    var message = "Ce bouton télécharge le bulletin dûment rempli au format HTML pour la publication sur notre portail";
                    var precedentFctToCall = makePopUpMessage_btn_add_RLof_RCc;
                    var nextFctToCall = false;
                    var DOMmessage = makePopUpMessage(title, message, precedentFctToCall, nextFctToCall)
                    messageFor(DOMmessage, DOMtarget);
                }

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

                function resetBorderStyle(DOMitem, cleanOnly=""){
                    try{
                        var id= DOMitem.id;
                        var matchingResult = DOMitem.id.match(cleanOnly);
                        if(Array.isArray(matchingResult)){
                            if(matchingResult[0] == cleanOnly){
                                resetTableBorderStyle(DOMitem);
                            }
                        }
                        if(DOMitem.children.length>0){
                            for(var i=0 ; i<DOMitem.children.length;i++){
                                resetBorderStyle(DOMitem.children[i], cleanOnly);
                            }
                        }
                    }catch(error){
                        console.error("[resetBorderStyle] ERROR : cleanOnly=",cleanOnly," ; id=",id, error.message);
                    }
                }

                function afficherAide(){ // fonction qui permet l'affichage d'une aide sur les différents elements
                    makePopUpMessage_listCVE();
                }
GM_registerMenuCommand("AIDE", afficherAide); // WIP

    /*
    Contrôleur : cette partie gère les échanges avec l'utilisateur. C'est en quelque sorte l'intermédiaire entre l'utilisateur, le modèle et la vue.
    Le contrôleur va recevoir des requêtes de l'utilisateur. Pour chacune, il va demander au modèle d'effectuer certaines actions (lire des articles de blog depuis une base de données,
    supprimer un commentaire) et de lui renvoyer les résultats (la liste des articles, si la suppression est réussie). Puis il va adapter ce résultat et le donner à la vue.
    Enfin, il va renvoyer la nouvelle page HTML, générée par la vue, à l'utilisateur.
    */ // CONTROLLEUR
        // DEBOGAGE
            /* debugLevelList
                "silent":"aucun message de debug",
                "info":"n'affiche au mieux que les messages dans la console",
                "custom":"respecte les choix propres à chaque appel"
            */
            var debugLevel = "custom";
            function update_debug_listOfWhere_from_actual_status(listOfWhere){ // adapte le listOfWhere en fonction du niveau de debugage choisi
                switch(debugLevel){
                    case "silent":
                        listOfWhere=[];
                        break;
                    case "info" :
                        listOfWhere = ["console"];
                        break;
                    default:
                        break;
                }
                return listOfWhere;
            } // OK
            function debug(message, listOfWhere=["console"]){ // WIP
                if(typeof listOfWhere == "string"){listOfWhere = [listOfWhere];} // transformation en liste de string
                listOfWhere = update_debug_listOfWhere_from_actual_status(listOfWhere);
                for(var i=0;i<listOfWhere.length;i++){
                    switch(listOfWhere[i]){
                        case "console":
                            console.log(message);
                            break;
                        case "error":
                            console.error(message);
                            break;
                        case get_DOMid_debugPage():
                            add_option_in_select(get_DOMid_debugPage(), "", message);
                            break;
                        default:
                            break;
                    }
                }
            } // WIP

            /*
                prompt : demande à l'utilisateur que faire (keep_CVE, keep_link ou keep_both)
                keep_CVE : applique la référence au lien
                keep_link : recupere la reference du texte du lien et modifie le label
                keep_href : recupere la reference du lien et modifie le label
                keep_all : uniformise en suppriment l'element et en creant les nouvelles entrees conservant les CVE
                delete : supprime l'élément
            */
            var fixBadLinks_CVE_default_behavior = "prompt" ;
            var fixBadLinks_CVE_default_proposition = "keep_all" ;
            function promptUserFixCVEs(CVE, linkCVE, hrefCVE, defaultValue=""){
                var message = "Une référence est en erreur, la CVE et son lien ne correspondent pas :"+"\n"+
                    "  - la référence : "+CVE+"\n"+
                    "  - le lien : "+linkCVE+"\n"+
                    "  - le texte du lien : "+hrefCVE+"\n"+
                    "\n"+
                    "LES CHOIX :"+"\n"+
                    "  - keep_CVE : applique la référence au lien"+"\n"+
                    "  - keep_link : recupere la reference du texte du lien et modifie le label"+"\n"+
                    "  - keep_href : recupere la reference du lien et modifie le label"+"\n"+
                    "  - keep_all : uniformise en suppriment l'element et en creant les nouvelles entrees conservant les CVE"+"\n"+
                    "  - delete : supprime l'élément"+"\n"+
                    "\n"+
                    "ANNULER pour arreter le script";
                let answer = prompt(message, defaultValue);
                if(typeof answer== "string"){answer = answer.trim();}
                return answer;
            } // OK

        // Production custom des CVEs : permet de lister les CVE qui apparaitront dans l'article en lieu et place de ceux existant
            var is_replaceCVEs = false;
            var newCVEs = ['CVE-2023-5346'] ; //['CVE-2022-47966','CVE-2023-4516','CVE-2023-123456','CVE-2023-123457']; // pour test : ['CVE-2023-4516','CVE-2023-4516','CVE-2023-123456','CVE-2023-123457']

            function replaceCVEs(list_CVEs){
                var i;
                var list_DOM_CVES = get_list_DOM_CVEs_fromPage();
                for(i =0;i<list_DOM_CVES.length;i++){DOM_remove_object(list_DOM_CVES[i]);}
                var DOM_ul = get_ul_CVE();
                for(i =0;i<list_CVEs.length;i++){make_OG_CVEitem(list_CVEs[i], DOM_ul);}

            }//OK
            function promptNewCves(){
                var message = "Veuillez listez vos CVE (separés par des espaces)";
                let answer = prompt(message, "");
                if(typeof answer== "string"){
                    replaceCVEs(answer.split(" "));
                    prepare_CVElistFromCurrentPage();
                }

            }
            if(is_replaceCVEs){replaceCVEs(newCVEs);}
     GM_registerMenuCommand("set New CVEs ( WIP )", promptNewCves); // WIP

        // RECUPERATION DES CVE
            function fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE, action=""){ // fonction qui agit sur les erreurs de CVE (pas le bon lien avec la reference de la CVE ; devrait être inutilisée
                var DOM_ul, retourFix=true;
                debug("[fix_CVE_issue] CVE='"+CVE+"', linkCVE='"+linkCVE+"' hrefCVE='"+hrefCVE+"' action="+action, ["console", get_DOMid_debugPage()]);
                switch(action){
                    case "prompt":
                        action = promptUserFixCVEs(CVE, linkCVE, hrefCVE, fixBadLinks_CVE_default_proposition);
                        if(action){
                            retourFix = fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE, action);
                        }else{ // l'utilisateur n'a rien saisi ou a fait annuler, on arrete la chaine
                            debug("[fix_CVE_issue] CVE='"+CVE+"', linkCVE='"+linkCVE+"' hrefCVE='"+hrefCVE+"' action=ANNULER", ["console", get_DOMid_debugPage()]);
                            retourFix = false;
                        }
                        break;
                    case "keep_CVE" :
                        DOM_ul = get_ul_CVE();
                        make_OG_CVEitem(CVE, DOM_ul);
                        retourFix = fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE,"delete");
                        break;
                    case "keep_link" :
                        DOM_ul = get_ul_CVE();
                        make_OG_CVEitem(linkCVE, DOM_ul);
                        retourFix = fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE,"delete");
                        break;
                    case "keep_href" :
                        DOM_ul = get_ul_CVE();
                        make_OG_CVEitem(hrefCVE, DOM_ul);
                        retourFix = fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE,"delete");
                        break;
                    case "keep_all" :
                        DOM_ul = get_ul_CVE();
                        make_OG_CVEitem(CVE, DOM_ul);
                        make_OG_CVEitem(linkCVE, DOM_ul);
                        make_OG_CVEitem(hrefCVE, DOM_ul);
                        retourFix = fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE,"delete");
                        break;
                    case "delete" :
                        DOM_remove_object(DOM_itemCVE)
                        break;
                    default :
                        retourFix = fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE, fixBadLinks_CVE_default_behavior);
                        break;
                }
                return retourFix;
            } // OK

            function check_and_correct_list_DOM_itemsCVE(list_DOM_itemsCVE){
                var i ,DOM_itemCVE, CVE, DOM_a_CVE, linkCVE, hrefCVE, retourFix;
                for(i=0;i<list_DOM_itemsCVE.length;i++){
                    DOM_itemCVE = list_DOM_itemsCVE[i];
                    CVE = get_CVE_fromItem(DOM_itemCVE);
                    DOM_a_CVE = get_a_CVE_fromItem(DOM_itemCVE);
                    linkCVE = get_CVE_fromItem(DOM_a_CVE, "innerText", "Pas de texte de lien ?");
                    hrefCVE = get_CVE_fromItem(DOM_a_CVE, "href", "Pas de lien ?");
                    if(CVE != linkCVE || CVE != hrefCVE || hrefCVE != linkCVE){
                        retourFix = fix_CVE_issue(DOM_itemCVE, CVE, linkCVE, hrefCVE);
                        if(! retourFix){break;} // on s'arrete
                    }
                }
            } // OK
            function suppression_doublon_listCVE(list_DOM_itemsCVE, removeDOM_if_double = true){
                var list_DOM_itemsCVE_unique = [];
                var list_CVE = [];
                var DOM_itemCVE, CVE;

                for(var i=0;i<list_DOM_itemsCVE.length;i++){
                    DOM_itemCVE = list_DOM_itemsCVE[i];
                    CVE = get_CVE_fromItem(DOM_itemCVE);
                    if(list_CVE.includes(CVE)){ // doublon
                        debug("la CVE '"+CVE+"' est en doublon", ['error', get_DOMid_debugPage()]);
                        if(removeDOM_if_double){DOM_remove_object(DOM_itemCVE);}
                    }else{
                        list_CVE.push(CVE);
                        list_DOM_itemsCVE_unique.push(DOM_itemCVE);
                    }
                }
                return list_DOM_itemsCVE_unique;
            } // OK

            function clean_page_listCVE(removeDOM_if_double = true){ // nettoie la liste des CVE et supprimes les doublons de la page
                var list_DOM_itemsCVE = get_list_DOM_CVEs_fromPage();
                // VERIFICATION DES ERREURS ENTRE LE LIEN ET L'ID
                    check_and_correct_list_DOM_itemsCVE(list_DOM_itemsCVE);

                list_DOM_itemsCVE = get_list_DOM_CVEs_fromPage();
                // suppression des doublons
                    list_DOM_itemsCVE = suppression_doublon_listCVE(list_DOM_itemsCVE, removeDOM_if_double);

                return list_DOM_itemsCVE;
            } // OK

            function change_page_listCVE(list_DOM_itemsCVE){ // change tous les anciens element CVE par la nouvelle forme
                var DOM_itemCVE;
                for(var i=0;i<list_DOM_itemsCVE.length;i++){
                    DOM_itemCVE = list_DOM_itemsCVE[i];
                    replace_CVEitem(DOM_itemCVE);
                }
            }

            function add_links_cvss_foreach_itemCVE(list_DOM_itemsCVE){
                var DOM_itemCVE, childDiv, child, subChild, subSubChild;
                var CVE;
                for(var i=0;i<list_DOM_itemsCVE.length;i++){
                    DOM_itemCVE = list_DOM_itemsCVE[i];
                    CVE = get_CVE_fromItem(DOM_itemCVE);


                    // création de la div avec les différents ajouts de score
                    childDiv = document.createElement('div');
                    childDiv.id = CVE;
                    childDiv.classList.add("avoid_from_selection");// avoid from selection est utilisé dans get_article_to_string pour cacher les div et ainsi pas les enregistrer dans le fichier texte généré
                    DOM_itemCVE.appendChild(childDiv);

                    childDiv.style.display='inline-flex';
                    childDiv.style.position='relative';
                    childDiv.style.left='36%';

                    // GOOGLE
                    child = document.createElement('a');
                    child.href = "https://www.google.com/search?q=%22"+CVE+"%22";
                    child.target = "_blank";
                    child.innerText = "Google:"+CVE;
                    childDiv.appendChild(child);
                    childDiv.appendChild(document.createTextNode("\u00A0"));

                    // CVEDETAILS
                    child = document.createElement('a');
                    child.href = "https://www.cvedetails.com/cve-details.php?cve_id="+CVE;
                    child.target = "_blank";
                    child.innerText = "??";
                    child.id = CVE+"_cveDetails"
                    child.style.backgroundcolor = "black"
                    childDiv.appendChild(child);
                    childDiv.appendChild(document.createTextNode("\u00A0")); // .createTextNode("&nbsp;"));

                    // NVD
                    child = document.createElement('span');
                    child.id = CVE+"_NVD"
                    child.style.marginleft = "20px"
                    childDiv.appendChild(child);

                    // VULDB
                    child = document.createElement('span');
                    child.id = CVE+"_vuldb"
                    child.style.cursor="pointer";

                    subChild = document.createElement('img');
                    subChild.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALYSURBVEhL3VRJaFNRFD0qDqjgRhEUEVciKLoRwYULBRFRQRExY5sEimCaEkql4iKtocMmnUQoBAlOCwcCipIIgtJCS+mmi+66y77ddIbSenz3vd+X4f+FpF14OHz+O/e8d/4b/oNvi7HtAcFgsLm5ORaLSTMcDrMZiUTi8XhTU5OIDQ0NFPlsbGzkCz2i10RlQCgUWlhYmJyclGYul9vY2EilUktLS2NjYyL29/dT7OnpGRgY4Et3d7foNVFjiUZGRlZWVvh1fJ+enp6dnfX7/fUMyGQy7MYn12Rtba1QKFCsZwAXd3l5mfMYHh5m/46ODor1DCDGx8fn5+enpqbm5uYCgQAVbszExIRUBwcHOW5XV9e/BwwNDbEnUSwWRZmZmeFmtLS0cG9GR0fX19cTiYQEZLPZJwrJZFLMNmoHRKPR1dVVdu7s7BQlnU4vLi5S4dBEPp+nKAEOSqWSmG3UDiBaW1vb29t5fnTb5+PP0dvb29fXx3k4Cj0O2EV0G64B9QJObzGwTQgBj6oYBq4A+7VlE8eqnMIYcBs4oV3l+Az8dmFBJe3Sxr84X+Wx+QtIAju018AjQJiy+tgBHE7oKMJr2mvgBCSAC4qX1Lp9svrc0d6ygCPAXsUDwEXgi9Gfaq+BE3BPCxqHgDem9AHYqUQ7gAYb/D7ROeMyuAUQl02JlEPnEZA2+gMtGHgE7AF+mupNpdgBQeC+IkfkV4v4AtinnJvwCCA+mqpPNe2Aan5Tk66Ed8B7U32omnbAW+C14VdL58zK4BHAjf1uqteV4rYHdPqNzlXlAduER8A5UyJPKcVjk/k/Fk3pqtYU3AJ4wF+a0jvzr3kE7AZ+mJKcCA0n4DFwVpGj3AJeGZ28ob1lAYfVMRMeBdqs0hltV3AC3PjM5apwY6biOvII4GXHO0P+YYF3AO+l58BB7TWIAPFycq2i6s6qtALHq8xC3th3gZPa9Z8A+AMBzN5j3/tukQAAAABJRU5ErkJggg=="
                    subChild.width="22";
                    subChild.height="22";
                    subChild.style.margin="0 0 3px 20px";
                    subChild.setAttribute('_toSearch',CVE);
                    subChild.addEventListener("mousedown", searchVulDB);
                    child.appendChild(subChild);

                    subChild = document.createElement('form');
                    subChild.id = "search_vuldb_"+CVE;
                    subChild.action="https://vuldb.com/?search";
                    subChild.method="post";
                    subChild.target="_blank";

                    subSubChild =document.createElement('input');
                    subSubChild.name="search";
                    subSubChild.type="hidden";
                    subSubChild.value = CVE;

                    subChild.appendChild(subSubChild);
                    child.appendChild(subChild);
                    childDiv.appendChild(child);

                    // FEEDLY
                    child = document.createElement('span');
                    child.id = CVE+"_feedly"
                    child.style.marginleft = "20px"

                    subChild = document.createElement('a');
                    subChild.href = "https://feedly.com/cve/"+CVE;
                    subChild.target = "_blank";

                    subSubChild = document.createElement('img');
                    subSubChild.src = "https://feedly.com/favicon.ico"
                    subSubChild.width="22";
                    subSubChild.height="22";


                    subChild.appendChild(subSubChild);
                    child.appendChild(subChild);
                    childDiv.appendChild(child);

                }
            }

            function get_CVElistFromCurrentPage(nettoyage = true, addHelperLinks = true){ // nettoie eventuellement ; ajoute eventuellement les liens ; ajoute les ID et extensions
                var list_DOM_itemsCVE;
                // NETTOYAGE
                    if(nettoyage){// nettoyage de la liste
                        list_DOM_itemsCVE = clean_page_listCVE()
                    }else{// RECUPERATION BRUTE
                        list_DOM_itemsCVE = get_list_DOM_CVEs_fromPage();
                    }

                // Ajout des modifications UTILES
                    change_page_listCVE(list_DOM_itemsCVE);
                list_DOM_itemsCVE = get_list_DOM_CVEs_fromPage();

                // Ajout des aide au score
                    add_links_cvss_foreach_itemCVE(list_DOM_itemsCVE)

                return list_DOM_itemsCVE
            } // WIP

            function prepare_CVElistFromCurrentPage(){
                var list_DOM_itemsCVE = get_CVElistFromCurrentPage() // récupération des CVE + nettoyage
                var list_CVEs = get_list_string_CVEs_from_list_DOM_CVEs(list_DOM_itemsCVE); // recupération de la liste
                return list_CVEs;
            } // WIP

// envoi rocket chat
    var rocketChatToken={
        "token":"QgjTG8yxBRQJ5GIY4atls7nJtyg8fPv8qODBrtF8HVE",
        "userID" : "iTPeKb8vYEZviMKaq"
    }
    var payload = {
        "msg": "method",
        "method": "sendMessage",
        "id": "423",
        "params": [
            {
                "_id": "8gMsLe9A7pZjo2D2iB",
                "rid": "64a1f373376181965ab77f54",
                "msg": "Hello World!"
            }
        ]
    };
    function sendRocketChat(){

        // console.log(payload)

        // Instantiating easyHTTP
        const http = new easyHTTP;
        var url = "https://rocketchat.internet.np/hooks/65169ce7ea4299ea9bb82153/sAeJzQuvB92bX6TFpuXanQLQCzMPQ3bnDwcdLNBTSavdv5Ji" ; // "https://rocketchat.internet.np/api/v1/chat.postMessage"
        var HEADER = {
            //"X-Auth-Token":rocketChatToken.token,
            //"X-User-Id":rocketChatToken.userID,
            "Content-type":"application/json"
        }
        var DATA = {
            "channel":"#Vulns",
            "text": "This is a test!"
        }
        var functionErrPost=function(err, post){if(err) {console.log("err:"+err);} else {console.log("post:"+post);}}


        //return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: url,
                headers: HEADER,
                data:DATA,
                onload: function(response) {
                    console.log(response);
                    //resolve(response);
                },
                onerror: function(error) {
                    console.log(error.message);
                    //reject("sendRocketChat : ERROR : "+error.message);
                }
            });
        //});
        // requete depuis la page du certfr
        /*http.post(
            url,
            HEADER,
            DATA,
            functionErrPost
        );*/

    }
    GM_registerMenuCommand("to rocketchat", sendRocketChat); // WIP


    // FIN FACTORISATION ##########################################


    //if("DEBUG PARAMETERS"){
        // Contient des fonctions ou parametres utile aux développeurs
    if("Looking for CVE"){
        var WatchForDEBUG_CVE = "" //"CVE-2023-1671";
        var WatchForDEBUG_AVI = "" //"CERTFR-2023-AVI-0283";
        }
    //}
    //if("FONCTIONS"){// < FONCTIONS
        //if("FONCTIONS : GENERIQUES"){

            function intTostringFixedSize(i,size=5){
                return ("00000" + i).slice(-1*size)
            }//intTostringFixedSize

            function get_indent(nb_indent){
                var output="";
                var indent_text="\t";
                nb_indent = (nb_indent<0?0:nb_indent);
                for(var i =0 ; i<nb_indent;i++){
                    output+=indent_text;
                }
                return output;
            }

            // EASY HTTP : https://www.geeksforgeeks.org/how-to-make-put-request-using-xmlhttprequest-by-making-custom-http-library/
            function easyHTTP() {
                // Initializing new XMLHttpRequest method.
                this.http = new XMLHttpRequest();
            }

            // Make an HTTP PUT Request
            easyHTTP.prototype.put = function(url, dict_header, data, callback) {

                // Open an object (POST, PATH, ASYNC-TRUE/FALSE)
                this.http.open('PUT', url, true);

                // Set header
                var header_keys = Object.keys(dict_header)
                for(var i=0;i<header_keys.length;i++){
                    this.http.setRequestHeader(header_keys[i], dict_header[header_keys[i]]);
                }


                // Assigning this to self to have
                // scope of this into the function onload
                let self = this;

                // When response is ready
                this.http.onload = function() {

                    // Callback function (Error, response text)
                    callback(null, self.http.responseText);
                }

                // Since the data is an object so
                // we need to stringify it
                this.http.send(JSON.stringify(data));
            }
            // Make an HTTP POST Request
            easyHTTP.prototype.post = function(url, dict_header, data, callback) {

                // Open an object (POST, PATH, ASYNC-TRUE/FALSE)
                this.http.open('POST', url, true);

                // Set header
                var header_keys = Object.keys(dict_header)
                for(var i=0;i<header_keys.length;i++){
                    this.http.setRequestHeader(header_keys[i], dict_header[header_keys[i]]);
                }


                // Assigning this to self to have
                // scope of this into the function onload
                let self = this;

                // When response is ready
                this.http.onload = function() {

                    // Callback function (Error, response text)
                    callback(null, self.http.responseText);
                }

                // Since the data is an object so
                // we need to stringify it
                this.http.send(JSON.stringify(data));
            }
            // FIN EASY HTTP

            function updateClipboard(newClip) {
                navigator.clipboard.writeText(newClip).then(function() {
                    /* le presse-papier est correctement paramétré */
                    console.log ("clipboard ok");
                    add_log_to_CMB("[updateClipboard] ok", 0);
                }, function() {
                    /* l'écriture dans le presse-papier a échoué */
                    console.log ("clipboard ok");
                    add_log_to_CMB("[updateClipboard] ok", 0);
                });
            }

            function dateUStoFR(USdateSTR){
                return ((new Date(USdateSTR)).toLocaleDateString("fr"));
            }

        //} // FONCTIONS : GENERIQUES
        //if("FONCTIONS : STOCKAGE"){
            function resetGMstorage(){//ok
                var listKey = GM_listValues();
                for(var i=0;i<listKey.length;i++){
                    GM_deleteValue(listKey[i]);
                }
            } // resetGMstorage
            function replaceGMstorage(content){//ok
                //console.log("replaceGMstorage : taille content ="+content.length);
                //console.log(content);

                var regexKeyVal = new RegExp('(?<=")(.*?)(": ")(.*?)(?=")',"g");
                var regexKey = new RegExp('(?<=")(.*?)(?=(": "))',"g");
                var regexVal = new RegExp('(?<=(": "))(.*?)(?=")',"g");
                var listKey = content.match(regexKey);
                var listval = content.match(regexVal);
                //console.log("replaceGMstorage : listKey");
                //console.log(listKey);
                //console.log("replaceGMstorage : listval");
                //console.log(listval);
                if(listKey.length == listval.length && listval.length>0 ){
                    resetGMstorage();
                    for(var i=0;i<listKey.length;i++){
                        GM_setValue(listKey[i],listval[i]);
                    }
                }
            }//replaceGMstorage
            function extractGMstorage(){//ok
                var listKey = GM_listValues();
                var content = "";
                for(var i=0;i<listKey.length;i++){
                    //console.log("extractGMstorage ; i="+i+" ; key="+listKey[i]);
                    content = content +'\n"'+listKey[i]+'": "'+GM_getValue(listKey[i])+'",';
                }
                content ="{" + content.substring(0,content.length -1) + "\n}";
                return content
            }//extractGMstorage

            function getHigherBulletin_from_GMstorage(typeBulletin="AVI"){//ok
                var listKey = GM_listValues();
                var regexYear = new RegExp("(?<=(CERTFR-))([0-9]+)(?=-"+typeBulletin+")","i");
                var regexID = new RegExp("(?<=(-["+typeBulletin+"]+-))([0-9]+)","i");// avant, comprends les ALE : new RegExp("(?<=(-[a-zA-Z]+-))([0-9]+)","i");
                var listIdMacth,listYearMacth;
                var compareValYear=0;
                var compareValID=0;
                var content, key;
                for(var i=0;i<listKey.length;i++){
                    key=listKey[i];
                    listYearMacth = key.match(regexYear);
                    listIdMacth = key.match(regexID);
                    if(listYearMacth && listIdMacth){
                        if(listYearMacth.length>0 && listIdMacth.length>0){
                            //console.log("compare : "+compareValYear+"<"+parseInt(listYearMacth[0]) +"&&"+ compareValID+"<"+parseInt(listIdMacth[0]))
                            if( (compareValYear<=parseInt(listYearMacth[0])) && (compareValID<=parseInt(listIdMacth[0]))){
                                compareValYear = parseInt(listYearMacth[0]);
                                compareValID = parseInt(listIdMacth[0]);
                                content=compareValYear+"-"+typeBulletin+"-"+intTostringFixedSize(compareValID,5);
                                //console.log(content);
                            }
                        }
                    }
                }
                return content;
            }//getHigherBulletin_from_GMstorage

            function getVecteurV2fromStorageAVI(avi){
                var vecteur="";
                if(GM_getValue(avi+".vecteurV2")) {vecteur=GM_getValue(avi+".vecteurV2");}
                return vecteur ;
            }
            function getVecteurV3fromStorageAVI(avi){
                var vecteur="";
                if(GM_getValue(avi+".vecteurV3")) {vecteur=GM_getValue(avi+".vecteurV3");}
                return vecteur ;
            }
            function getSourceV2fromStorageAVI(avi){
                var vecteur="";
                if(GM_getValue(avi+".vecteurV2Source")) {vecteur=GM_getValue(avi+".vecteurV2Source");}
                return vecteur ;
            }
            function getSourceV3fromStorageAVI(avi){
                var vecteur="";
                if(GM_getValue(avi+".vecteurV3Source")) {vecteur=GM_getValue(avi+".vecteurV3Source");}
                return vecteur ;
            }
            function getCVSS_fromStorage(cveID, field=""){
                var avi = "";
                var currentKey="";
                var currentValue="";
                if(cveID==WatchForDEBUG_CVE) { console.log("AVI : ###########################");}
                var allValues=GM_listValues();
                if(cveID==WatchForDEBUG_CVE) { console.log(allValues);}
                for(var i=(allValues.length)-1;i>=0;i--){
                    currentKey=allValues[i];
                    if(currentKey.includes(field) && GM_getValue(currentKey)) {
                        currentValue = GM_getValue(currentKey);
                        if(cveID==WatchForDEBUG_CVE && (currentKey.includes(WatchForDEBUG_AVI) || WatchForDEBUG_AVI =="")) { console.log(currentKey+" : "+GM_getValue(currentKey)+" vs "+cveID);}
                        if(currentValue == cveID){
                            avi=currentKey.split(".")[0];
                            if(cveID==WatchForDEBUG_CVE) { console.log("currentValue="+currentValue+" => currentKey="+currentKey);}
                            break;
                        }
                    }
                }
                //console.log("trouvé : "+avi);
                return (avi);

            }


            // FONCTION GIT AS STORAGE
            async function updateStorage(){
                var gitTitle = await getGitStorageTitle();
                var localTitle = "";
                var updateFromRemote = false;
                if(!gitTitle){
                    console.log("updateStorage ; ERREUR : Fichier introuvable");
                    add_log_to_CMB("[updateStorage] ERREUR : Fichier introuvable", 0);
                    return false;
                }
                if(GM_getValue("PASTEBIN_PasteName_regex") && GM_getValue("PASTEBIN_PasteName_partALE") && GM_getValue("PASTEBIN_PasteName_partAVI")) { // récupération du titre local
                    // comparaison avec le stockage
                    if(GM_getValue("PASTEBIN_PasteName")) {
                        if(gitTitle == GM_getValue("PASTEBIN_PasteName")){
                            // dejà à jour, on ne fait rien
                            console.log("updateStorage : Le fichier de stockage est déja à jour");
                            add_log_to_CMB("[updateStorage] Le fichier de stockage est déja à jour", 0);
                        }else{// comparaison du plus recent
                            //var pasteName_TO_regex = new RegExp(GM_getValue("PASTEBIN_PasteName_TO_regex"), 'i');
                            var pasteName_partALE = new RegExp(GM_getValue("PASTEBIN_PasteName_partALE"), 'i');
                            var pasteName_partAVI = new RegExp(GM_getValue("PASTEBIN_PasteName_partAVI"), 'i');
                            //var matches_Paste = gitTitle.match(pasteName_TO_regex);
                            var matches_PasteALE = gitTitle.match(pasteName_partALE);
                            var matches_PasteAVI = gitTitle.match(pasteName_partAVI);
                            //var matches_Local = (GM_getValue("PASTEBIN_PasteName")).match(pasteName_TO_regex);
                            var matches_Local_PasteALE = (GM_getValue("PASTEBIN_PasteName")).match(pasteName_partALE);
                            var matches_Local_PasteAVI = (GM_getValue("PASTEBIN_PasteName")).match(pasteName_partAVI);
                            if(matches_PasteALE&&matches_PasteAVI&&matches_Local_PasteALE&&matches_Local_PasteAVI){ //2023-0069
                                var compareALE_gt_stockage = compareTitles(matches_PasteALE,matches_Local_PasteALE);
                                //var compareALE_eq_stockage = compareTitles(matches_PasteALE,matches_Local_PasteALE,true) && !compareALE_gt_stockage;
                                var compareAVI_gt_stockage = compareTitles(matches_PasteAVI,matches_Local_PasteAVI);
                                //var compareAVI_eq_stockage = compareTitles(matches_PasteAVI,matches_Local_PasteAVI,true) && !compareAVI_gt_stockage;
                                var paste_gt_stockage = (compareALE_gt_stockage || compareAVI_gt_stockage)
                                if(paste_gt_stockage){ // le fichier distant est plus à jour
                                    //if(gitTitle>matches_Local[0]){ // le fichier distant est plus à jour
                                    //console.log("updateStorage #DEBUG : "+matches_Paste[0]+">"+matches_Local[0]);
                                    updateFromRemote = true;
                                }else{
                                    console.log("updateStorage : Le fichier de stockage est plus avancé que le fichier pastebin");
                                    add_log_to_CMB("[updateStorage] Le fichier de stockage est plus avancé que le fichier pastebin", 0);
                                }
                            }else{
                                console.log("updateStorage ; ERREUR : match gitTitle ou pastname local");
                                add_log_to_CMB("[updateStorage] ERREUR : match gitTitle ou pastname local", 0);
                            }
                        }
                    }else{
                        console.log("updateStorage ; ERREUR : clé PASTEBIN_PasteName");
                        add_log_to_CMB("[updateStorage] ERREUR : clé PASTEBIN_PasteName", 0);
                        return false;
                    }
                }else{ // les valeurs n'existent pas dans le stockage actuel, on propose la mise à jour à l'utilisateur
                    updateFromRemote = true;
                }
                if(updateFromRemote){
                    console.log("updateStorage : Mise à jour du fichier de stockage ("+gitTitle+")");
                    add_log_to_CMB("[updateStorage] Mise à jour du fichier de stockage("+gitTitle+")", 0);
                    var content = await getGitStorageContent();
                    replaceGMstorage(content);

                }
            }

        //} // FONCTIONS : STOCKAGE
        //if("FONCTIONS : STOCKAGE ONLINE"){

            // FONCTION FICHIERS ONLINE
            function responseTextToXML(responseText){
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(responseText,"text/xml");
                try{
                    if((xmlDoc.children[0]).localName == "parsererror"){
                        //console.log("responseTextToXML : ajout body");
                        xmlDoc = parser.parseFromString("<body>"+responseText+"</body>","text/xml");
                    }
                }catch(e){
                    console.log("responseTextToXML : erreur ajout body");
                    add_log_to_CMB("[responseTextToXML] erreur ajout body", 0);
                    console.log(e);
                    add_log_to_CMB("[responseTextToXML]"+e, 0);
                    return null;
                }
                return xmlDoc;
                //console.log("responseTextToXML : responseText");
                //console.log(responseText);
                //console.log("responseTextToXML : xmlDoc");
                //console.log(xmlDoc);
            }

            function pasteBin_API(dict_data={},methode="POST"){
                var outputVal;
                // Parametres secondaire
                var api_paste_private = '1'; // 0=public 1=unlisted 2=private
                // parametres elementaires
                if(GM_getValue("PASTEBIN_api_dev_key")) { // your api_developer_key
                    dict_data["api_dev_key"] = GM_getValue("PASTEBIN_api_dev_key");
                }else{
                    console.log("pasteBin_API ; ERREUR : clé PASTEBIN_api_dev_key");
                    add_log_to_CMB("[pasteBin_API] ERREUR : clé PASTEBIN_api_dev_key", 0);
                    return false;
                }
                if(GM_getValue("PASTEBIN_api_user_key")) { // if an invalid or expired api_user_key is used, an error will spawn. If no api_user_key is used, a guest paste will be created
                    dict_data["api_user_key"] = GM_getValue("PASTEBIN_api_user_key");
                }else{
                    console.log("pasteBin_API ; ERREUR : clé PASTEBIN_api_user_key");
                    add_log_to_CMB("[pasteBin_API] ERREUR : clé PASTEBIN_api_user_key", 0);
                    return false;
                }
                if(GM_getValue("PASTEBIN_url")) {
                    var url = GM_getValue("PASTEBIN_url");
                }else{
                    console.log("pasteBin_API ; ERREUR : clé PASTEBIN_url");
                    add_log_to_CMB("[pasteBin_API] ERREUR : clé PASTEBIN_url", 0);
                    return false;
                }

                var data = "";

                for (const [key, value] of Object.entries(dict_data)) {
                    data = data+String(key)+'='+String(value)+'&';
                }

                //console.log("pasteBin_API : data");
                //console.log(data);

                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: methode,
                        url: url,
                        data: data,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: function(response) {
                            resolve(response);
                        },
                        onerror: function(error) {
                            reject(error.message);
                        }
                    });
                });
            }

            async function pasteBin_list(){
                var dict_data={api_option:"list"};
                var response = await pasteBin_API(dict_data);
                var status = response.status
                var responseText = response.responseText;

                //console.log("pasteBin_API : response");
                //console.log(response);
                //console.log("pasteBin_API : status");
                //console.log(status);
                //console.log("pasteBin_list : responseText");
                //console.log(responseText);

                var responseXML = responseTextToXML(responseText);
                return responseXML;
            }

            function get_XML_item_fromMatch_recursive(XML, regex, output="node",testOnKey="", parentNode=null){
                // output:
                //   node : retourne le noeud courant
                //   parentNode : retourne le noeud parent
                //   key : le contenu du match
                //   match : retourne true false si il y a match
                //
                // testOnKey : la clé pour tester la regex
                var reponse = null;
                if(XML.children.length>0){
                    parentNode = XML;
                    for(var i=0;i<XML.children.length;i++){
                        reponse = get_XML_item_fromMatch_recursive(XML.children[i], regex, output, testOnKey, parentNode);
                        if(reponse){break;}
                    }
                }else{
                    //console.log("get_XML_item_fromMatch_recursive : test "+XML.localName+" avec la clé "+testOnKey);
                    //console.log(XML);
                    try{
                        var toTest=XML[testOnKey]; //(regexTestContent? XML.textContent : XML.localName )
                        var matches = toTest.match(regex);
                        //console.log(matches);
                        if(matches){
                            switch(output){
                                case "node":
                                    reponse= XML;
                                    break;
                                case "parentNode":
                                    reponse= parentNode;
                                    break;
                                case "key":
                                    reponse=matches[0];
                                    break;
                                default: // match
                                    reponse = true;
                                    break;
                            }
                        }
                    }catch(e){
                    }
                }
                return reponse;
            }
            function compareTitles(paste,local,ouEgal=false){
                if(paste && local){
                    paste = (paste.length>0?paste[0]:"");
                    local = (local.length>0?local[0]:"");
                }else{paste="";local="";}
                var year = new RegExp("[0-9]+(?=(\-[A-Z]))", 'i');
                var id = new RegExp("(?<=([A-Z]\-))[0-9]+", 'i');

                var year_Paste = parseInt((paste.match(year))[0]);
                var year_local = parseInt((local.match(year))[0]);
                var id_Paste = parseInt((paste.match(id))[0]);
                var id_local = parseInt((local.match(id))[0]);
                var yearPaste_ge_yearLocal = year_Paste>=year_local;
                var retour_ge = yearPaste_ge_yearLocal && id_Paste>=id_local;
                var retour_gt = yearPaste_ge_yearLocal && id_Paste>id_local;

                return (ouEgal && retour_ge) || (!ouEgal && retour_gt);

            }

            async function pasteBin_getStoragePasteTitle(output="title"){ // output : pasteTitle, api_paste_key, succes?
                var paste=null;
                var pasteTitle,api_paste_key;
                var result = await pasteBin_list();
                //console.log("pasteBin_getStoragePasteTitle : result");
                //console.log(result);

                if(GM_getValue("PASTEBIN_PasteName_regex") && GM_getValue("PASTEBIN_PasteName_partALE") && GM_getValue("PASTEBIN_PasteName_partAVI")) {
                    // recherche du titre du paste courant et de sa clé de paste
                    var pasteName_regex = new RegExp(GM_getValue("PASTEBIN_PasteName_regex"), 'i');
                    paste = get_XML_item_fromMatch_recursive(result, pasteName_regex, "parentNode", "textContent");
                    //console.log("pasteBin_getStoragePasteTitle : paste ##################");
                    //console.log(paste);
                    if(!paste){
                        console.log("pasteBin_getStoragePasteTitle ; ERREUR : paste : pas de paste de stockage");
                        add_log_to_CMB("[pasteBin_getStoragePasteTitle] ERREUR : paste : pas de paste de stockage", 0);
                        return false;
                    }

                    pasteTitle = get_XML_item_fromMatch_recursive(paste, pasteName_regex, "key", "textContent");
                    //console.log("pasteBin_getStoragePasteTitle : pasteTitle ##################");
                    //console.log(pasteTitle);
                    update_paste_table("pasteBin_getStoragePasteTitle",pasteTitle,"",pasteTitle);
                    if(!pasteTitle){
                        update_paste_table("pasteBin_getStoragePasteTitle",pasteTitle,"",pasteTitle);
                        console.log("pasteBin_getStoragePasteTitle ; ERREUR : pasteTitle");
                        add_log_to_CMB("[pasteBin_getStoragePasteTitle] ERREUR : pasteTitle", 0);
                        return false;
                    }
                    var paste_key = get_XML_item_fromMatch_recursive(paste, new RegExp("paste_key","i"), "node", "localName");
                    if(paste_key){
                        api_paste_key = paste_key.textContent;
                        update_paste_table("pasteBin_getStoragePasteTitle",pasteTitle,api_paste_key,pasteTitle);
                    }else{
                        update_paste_table("pasteBin_getStoragePasteTitle",pasteTitle,"",pasteTitle);
                        console.log("pasteBin_getStoragePasteTitle ; ERREUR : paste_key ##################");
                        add_log_to_CMB("[pasteBin_getStoragePasteTitle] ERREUR : paste_key ##################", 0);
                        return false;
                    }
                    // comparaison avec le stockage
                    if(GM_getValue("PASTEBIN_PasteName")) {
                        if(pasteTitle == GM_getValue("PASTEBIN_PasteName")){
                            // dejà à jour, on ne fait rien
                            console.log("pasteBin_getStoragePasteTitle : Le fichier de stockage est déja à jour");
                            add_log_to_CMB("[pasteBin_getStoragePasteTitle] Le fichier de stockage est déja à jour", 0);
                        }else{// comparaison du plus recent
                            //var pasteName_TO_regex = new RegExp(GM_getValue("PASTEBIN_PasteName_TO_regex"), 'i');
                            var pasteName_partALE = new RegExp(GM_getValue("PASTEBIN_PasteName_partALE"), 'i');
                            var pasteName_partAVI = new RegExp(GM_getValue("PASTEBIN_PasteName_partAVI"), 'i');
                            //var matches_Paste = pasteTitle.match(pasteName_TO_regex);
                            var matches_PasteALE = pasteTitle.match(pasteName_partALE);
                            var matches_PasteAVI = pasteTitle.match(pasteName_partAVI);
                            //var matches_Local = (GM_getValue("PASTEBIN_PasteName")).match(pasteName_TO_regex);
                            var matches_Local_PasteALE = (GM_getValue("PASTEBIN_PasteName")).match(pasteName_partALE);
                            var matches_Local_PasteAVI = (GM_getValue("PASTEBIN_PasteName")).match(pasteName_partAVI);
                            if(matches_PasteALE&&matches_PasteAVI&&matches_Local_PasteALE&&matches_Local_PasteAVI){ //2023-0069
                                var compareALE_gt_stockage = compareTitles(matches_PasteALE,matches_Local_PasteALE);
                                //var compareALE_eq_stockage = compareTitles(matches_PasteALE,matches_Local_PasteALE,true) && !compareALE_gt_stockage;
                                var compareAVI_gt_stockage = compareTitles(matches_PasteAVI,matches_Local_PasteAVI);
                                //var compareAVI_eq_stockage = compareTitles(matches_PasteAVI,matches_Local_PasteAVI,true) && !compareAVI_gt_stockage;
                                var paste_gt_stockage = (compareALE_gt_stockage || compareAVI_gt_stockage)
                                if(paste_gt_stockage){ // le fichier distant est plus à jour
                                    //if(pasteTitle>matches_Local[0]){ // le fichier distant est plus à jour
                                    //console.log("pasteBin_getStoragePasteTitle #DEBUG : "+matches_Paste[0]+">"+matches_Local[0]);
                                    console.log("pasteBin_getStoragePasteTitle : Mise à jour du fichier de stockage ("+pasteTitle+")");
                                    add_log_to_CMB("[pasteBin_getStoragePasteTitle] Mise à jour du fichier de stockage("+pasteTitle+")", 0);
                                    var content = await pasteBin_getContent(api_paste_key,pasteTitle);
                                    replaceGMstorage(content);
                                }else{
                                    console.log("pasteBin_getStoragePasteTitle : Le fichier de stockage est plus avancé que le fichier pastebin");
                                    add_log_to_CMB("[pasteBin_getStoragePasteTitle] Le fichier de stockage est plus avancé que le fichier pastebin", 0);
                                }
                            }else{
                                console.log("pasteBin_getStoragePasteTitle ; ERREUR : match pasteTitle ou pastname local");
                                add_log_to_CMB("[pasteBin_getStoragePasteTitle] ERREUR : match pasteTitle ou pastname local", 0);
                            }
                        }
                    }else{
                        console.log("pasteBin_getStoragePasteTitle ; ERREUR : clé PASTEBIN_PasteName");
                        add_log_to_CMB("[pasteBin_getStoragePasteTitle] ERREUR : clé PASTEBIN_PasteName", 0);
                        return false;
                    }
                }else{
                    console.log("pasteBin_getStoragePasteTitle ; ERREUR : clé PASTEBIN_PasteName_regex ou PASTEBIN_PasteName_partALE ou PASTEBIN_PasteName_partAVI");
                    add_log_to_CMB("[pasteBin_getStoragePasteTitle] ERREUR : clé PASTEBIN_PasteName_regex ou PASTEBIN_PasteName_partALE ou PASTEBIN_PasteName_partAVI", 0);
                    return false;
                }
                switch (output){
                    case "title":
                        return pasteTitle;
                        break;
                    case "api_paste_key":
                        return api_paste_key;
                        break;
                    default:
                        return true;
                }
            }

            async function pasteBin_getContent(api_paste_key,pasteTitle=""){
                var dict_data={api_option:"show_paste", api_paste_key:api_paste_key};
                var response = await pasteBin_API(dict_data);
                var status = response.status
                var responseText = response.responseText;

                update_paste_table("pasteBin_getContent",status,api_paste_key,(pasteTitle?pasteTitle:""));
                //console.log("pasteBin_API : response");
                //console.log(response);
                //console.log("pasteBin_API : status");
                //console.log(status);
                //console.log("pasteBin_getContent : responseText");
                //console.log(responseText);
                return responseText;
            }

            async function pasteBin_delete(api_paste_key){
                if(!api_paste_key){
                    console.log("pasteBin_delete ; pas d'api_paste_key a utiliser, pas de suppression ; cle : "+api_paste_key);
                    add_log_to_CMB("[pasteBin_delete] pas d'api_paste_key a utiliser, pas de suppression ; cle : "+api_paste_key, 0);
                    return null;
                }
                var dict_data={api_option:"delete", api_paste_key:api_paste_key};
                var response = await pasteBin_API(dict_data);
                var status = response.status
                var responseText = response.responseText;

                update_paste_table("pasteBin_delete",status,api_paste_key);
                //console.log("pasteBin_delete : response");
                //console.log(response);
                //console.log("pasteBin_delete : status");
                //console.log(status);
                //console.log("pasteBin_delete : responseText");
                //console.log(responseText);
                return responseText;
            }

            async function pasteBin_add(title, content,output="responseText"){
                var dict_data={
                    api_option:"paste",
                    api_paste_name:title,
                    api_paste_code:encodeURIComponent(content),
                    api_paste_private:2 // public = 0, unlisted = 1, private = 2
                };
                var response = await pasteBin_API(dict_data);
                var status = response.status
                var responseText = response.responseText;

                //console.log("pasteBin_add : response");
                //console.log(response);
                //console.log("pasteBin_add : status");
                //console.log(status);
                //console.log("pasteBin_add : responseText");
                //console.log(responseText);

                update_paste_table("pasteBin_add",status,responseText,title);
                if(output=="status"){
                    return status;
                }else{
                    return responseText;
                }
            }

            function makeNewTitle(){ // ne prends pas en compte l'ancien titre pour le remplacer par le nouveau
                // var newTitle = "du 2022-556 au "+getHigherBulletin_from_GMstorage("AVI");
                var newTitle = getHigherBulletin_from_GMstorage("ALE")+"_"+getHigherBulletin_from_GMstorage("AVI");
                console.log("makeNewTitle : newtitle : "+newTitle);
                add_log_to_CMB("[makeNewTitle] newtitle : "+newTitle, 0);
                GM_setValue("PASTEBIN_PasteName",newTitle);
                return newTitle;
            }

            // FIN FONCTION FICHIERS ONLINE
            function allowToStore(){ // fonction qui autorise ou non à mettre à jour le stockage distant
                return getGUIinputValue("checkbox_stocker", true);
            }
            function getGitStorageAPIToken(){
                var apiKey = GM_getValue("GITLAB_token");
                if(apiKey){
                    console.log("all good : "+apiKey);
                }else{
                    apiKey = prompt("Veuillez saisir le token qui peut lire et ecrire dans le repo", "allez sur : https://gitlab-ce.internet.np/vuln/cert-fr/-/blob/main/README.md");
                    GM_setValue("GITLAB_token", apiKey);
                }
                return apiKey;
            }
            async function setGitStorageContent(newTitle, content, functionErrPost=function(err, post){if(err) {console.log("err:"+err);} else {console.log("post:"+post);}} , serverURL="https://gitlab-ce.internet.np", project="vuln/cert-fr", file="stockage.txt"){
                var acces_token = getGitStorageAPIToken();
                var project_id = await getGitStorageProjectId(serverURL, project);
                var url = serverURL+"/api/v4/projects/"+project_id+"/repository/files/"+file;

                // Instantiating easyHTTP
                const http = new easyHTTP;

                // Data that we need to update
                var DATA={
                    branch: "main",
                    commit_message: newTitle,
                    content : content
                };
                var HEADER={
                    "Content-Type": "application/json",
                    'PRIVATE-TOKEN': acces_token
                };

                // Put prototype method(url, data,
                // response text)
                var actualTitle = await getGitStorageTitle(serverURL, project, file);
                console.log("actualTitle : "+actualTitle);
                if(actualTitle){ // mise à jour
                    http.put(
                        url,
                        HEADER,
                        DATA,
                        functionErrPost
                    );
                }else{ // création
                    http.post(
                        url,
                        HEADER,
                        DATA,
                        functionErrPost
                    );
                }
            }

            function getGitStorageTitle(serverURL="https://gitlab-ce.internet.np", project="vuln/cert-fr", file="stockage.txt"){// last commit
                var url = serverURL+"/"+project+"/-/blob/main/"+file;
                var title = "";
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: url,
                        responseType: "document",
                        onload: function(response) {
                            // recherche du titre
                            var dom = response.response.body
                            try{
                                title = dom.getElementsByClassName("item-title")[0].innerText; // last commit
                            }catch(error){}
                            resolve(title);
                        },
                        onerror: function(error) {
                            reject("getGitStorageTitle : ERROR : "+error.message);
                        }
                    });
                });
            }

            function getGitStorageContent(serverURL="https://gitlab-ce.internet.np", project="vuln/cert-fr", file="stockage.txt"){// last commit
                var url = serverURL+"/"+project+"/-/raw/main/"+file;
                // a completer ou utiliser l'API
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: url,
                        onload: function(response) {
                            // récupération du contenu
                            var content = response.responseText
                            resolve(content);
                        },
                        onerror: function(error) {
                            reject("getGitStorageContent : ERROR : "+error.message);
                        }
                    });
                });
            }

            function get_projetcID_git_fromID(domObj, id="project_id"){ // le DOM doit correspondre a la page principale du projet
                var project_id = ""
                try{
                    project_id = domObj.querySelector("#"+id).value
                }catch(error){
                    console.error("[get_projetcID_git_fromID] ERROR : ", error.message,"pour",domObj, "#"+id)
                }
                return project_id
            }
            function get_projetcID_git_bodyParameters(domObj, parameter="data-project-id"){ // le DOM doit correspondre a la page principale du projet
                var project_id = ""
                try{
                    project_id = domObj[parameter]
                }catch(error){
                    console.error("[get_projetcID_git_bodyParameters] ERROR : ", error.message)
                }
                return project_id
            }
            function get_projetcID_git_bodyAttributes(domObj, attribute="data-project-id"){ // le DOM doit correspondre a la page principale du projet
                var project_id = ""
                try{
                    project_id = domObj.getAttribute(attribute);
                }catch(error){
                    console.error("[get_projetcID_git_bodyAttributes] ERROR : ", error.message)
                }
                return project_id
            }

            function get_projetcID_git(domObj){ // le DOM doit correspondre a la page principale du projet
                console.log("[get_projetcID_git] récupération du project ID");
                var lsr_function_to_try=[get_projetcID_git_fromID, get_projetcID_git_bodyParameters, get_projetcID_git_bodyAttributes];
                var project_id = "";
                var fctToCall;
                for(var i=0;i<lsr_function_to_try.length;i++){
                    fctToCall = lsr_function_to_try[i];
                    console.log("[get_projetcID_git] essai sur :", fctToCall);
                    project_id = fctToCall(domObj);
                    if(project_id!="" && project_id!=undefined){
                        break;
                    }
                }
                console.log("[get_projetcID_git] project ID=",project_id,".");
                return project_id;
            }

            function getGitStorageProjectId(serverURL="https://gitlab-ce.internet.np", project="vuln/cert-fr"){// last commit
                var url = serverURL+"/"+project+"/-/tree/main/";
                console.log("getGitStorageProjectId",url)
                // a completer ou utiliser l'API
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: url,
                        responseType: "document",
                        onload: function(response) {
                            // recherche du project id
                            var dom = response.response.body
                            var project_id = get_projetcID_git(dom);
                            resolve(project_id);
                        },
                        onerror: function(error) {
                            reject("getGitStorageProjectId : ERROR : "+error.message);
                        }
                    });
                });
            }


            // FIN FONCTION GIT AS STORAGE

        //}
        //if("FONCTIONS : CVSS"){
            // < FONCTIONS\CVSS\officielles
            var vectorKeysOrdered_v2 = ['AV','AC','Au','C','I','A','E','RL','RC'];
            var vectorKeysOrdered_v3 = ['AV','AC','PR','UI','S','C','I','A','E','RL','RC'];

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

            } //garnir_CVSS31

            // FONCTIONS\CVSS\officielles />

            // < FONCTIONS\CVSS\internes
            let big_data_select_v2_v3=[ // correspondances : what : to
                {select_id: "AccessVectorVar", short: "AV", mandatory: true, correspondances: {"L":"L", "A":"A", "N":"N", "P":"P" /*V4 : inchangé*/ }},
                {select_id: "AccessComplexityVar", short: "AC", mandatory: true, correspondances: {"H":"H", "M":"M", "L":"L" /*V4 : inchangé*/}},
                {select_id: "AuthenticationVar", short: "Au", mandatory: true, correspondances: {"M":"M", "S":"S", "N":"N" /*V4 : inexistant*/}},
                {select_id: "ConfImpactVar", short: "C", mandatory: true, correspondances: {"N":"N", "P":"P", "L":"P", "C":"C", "H":"C" /*V4 : inchangé*/}},
                {select_id: "IntegImpactVar", short: "I", mandatory: true, correspondances: {"N":"N", "P":"P", "L":"P", "C":"C", "H":"C" /*V4 : inchangé*/}},
                {select_id: "AvailImpactVar", short: "A", mandatory: true, correspondances: {"N":"N", "P":"P", "L":"P", "C":"C", "H":"C" /*V4 : inchangé*/}},
                /*V4*/{select_id: "ConfImpactVar", short: "VC", mandatory: true, correspondances: {"N":"N", "L":"P", "H":"C"}},
                /*V4*/{select_id: "IntegImpactVar", short: "VI", mandatory: true, correspondances: {"N":"N", "L":"P", "H":"C"}},
                /*V4*/{select_id: "AvailImpactVar", short: "VA", mandatory: true, correspondances: {"N":"N", "L":"P", "H":"C"}},
                {select_id: "ExploitabilityVar", short: "E", mandatory: false, correspondances: {"ND":"ND", "X":"ND", "U":"U", "POC":"POC", "P":"POC", "F":"F", "H":"H" /*V4 : inchangé*/}},
                {select_id: "RemediationLevelVar", short: "RL", mandatory: false, correspondances: {"ND":"ND", "X":"ND","OF":"OF", "O":"OF", "TF":"TF", "T":"TF", "W":"W", "U":"U" /*V4 : inexistant*/}},
                {select_id: "ReportConfidenceVar", short: "RC", mandatory: false, correspondances: {"ND":"ND", "X":"ND","UC":"UC", "U":"UC", "UR":"UR", "R":"UR", "C":"C" /*V4 : inexistant*/}},
                {select_id: "PrivilegeRequiredVar", short: "PR", mandatory: true, correspondances: {"N":"N", "L":"L", "H":"H" /*V4 : inchangé*/}},
                {select_id: "UserInteractionVar", short: "UI", mandatory: true, correspondances: {"N":"N", "R":"R" /*V4*/, "P":"R", "A":"R"}},
                {select_id: "ScopeVar", short: "S", mandatory: true, correspondances: {"U":"U", "C":"C" /*V4 : inchangé*/}},
                /*V4*/{select_id: "ScopeVar", short: "SC", mandatory: true, correspondances: {"N":"U", "L":"C", "H":"C"}}, /* seul le dernier champs du vecteur à un impact, il faudra patcher update_options */
                /*V4*/{select_id: "ScopeVar", short: "SI", mandatory: true, correspondances: {"N":"U", "L":"C", "H":"C"}}, /* seul le dernier champs du vecteur à un impact, il faudra patcher update_options */
                /*V4*/{select_id: "ScopeVar", short: "SA", mandatory: true, correspondances: {"N":"U", "L":"C", "H":"C"}} /* seul le dernier champs du vecteur à un impact, il faudra patcher update_options */
            ]; //big_data_select_v2_v3
            // en va il manquera :
            // Attack Requirements (AT)
            // Confidentiality (SC)
            // Integrity (SI)
            // Availability (SA)

            function getScroreV2(dict_vecteur){
                var key,i;
                //console.log("update_v2 : lock_v2 = "+document.getElementById('lock_v2').checked);

                var val_temp, accessvector, accesscomplexity, accessauthentication, confimpact, integimpact, availimpact, exploitability, remediationlevel, reportconfidence;
                var impact, exploit, fimpact=0, basescore=undefined, temporalscore;
                var vecteur = "";
                var svg_id = "sous-titre-chart_v2";
                var svg_img_id = "img_svg_v2";
                var png_img_id = "img_png_v2";
                var sous_tritre_val = 0;

                switch(dict_vecteur["AV"]){
                    case "L":
                        val_temp = 0.395;
                        break;
                    case "A":
                        val_temp = 0.646;
                        break;
                    case "N":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                accessvector = val_temp;
                switch(dict_vecteur["AC"]){
                    case "H":
                        val_temp = 0.35;
                        break;
                    case "M":
                        val_temp = 0.61;
                        break;
                    case "L":
                        val_temp = 0.71;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                accesscomplexity = val_temp;
                switch(dict_vecteur["Au"]){
                    case "M":
                        val_temp = 0.45;
                        break;
                    case "S":
                        val_temp = 0.56;
                        break;
                    case "N":
                        val_temp = 0.704;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                accessauthentication = val_temp;
                switch(dict_vecteur["C"]){
                    case "N":
                        val_temp = 0;
                        break;
                    case "P":
                        val_temp = 0.275;
                        break;
                    case "C":
                        val_temp = 0.66;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                confimpact = val_temp;
                switch(dict_vecteur["I"]){
                    case "N":
                        val_temp = 0;
                        break;
                    case "P":
                        val_temp = 0.275;
                        break;
                    case "C":
                        val_temp = 0.66;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                integimpact = val_temp;
                switch(dict_vecteur["A"]){
                    case "N":
                        val_temp = 0;
                        break;
                    case "P":
                        val_temp = 0.275;
                        break;
                    case "C":
                        val_temp = 0.66;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                availimpact = val_temp;

                switch(dict_vecteur["E"]){
                    case "U":
                        val_temp = 0.85;
                        break;
                    case "POC":
                        val_temp = 0.9;
                        break;
                    case "F":
                        val_temp = 0.95;
                        break;
                    case "H":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = 1;
                        break;
                }
                exploitability = val_temp;
                switch(dict_vecteur["RL"]){
                    case "OF":
                        val_temp = 0.87;
                        break;
                    case "TF":
                        val_temp = 0.9;
                        break;
                    case "W":
                        val_temp = 0.95;
                        break;
                    case "U":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = 1;
                        break;
                }
                remediationlevel = val_temp;
                switch(dict_vecteur["RC"]){
                    case "UC":
                        val_temp = 0.9;
                        break;
                    case "UR":
                        val_temp = 0.95;
                        break;
                    case "C":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = 1;
                        break;
                }
                reportconfidence = val_temp;

                // Calcul du score de base
                if((confimpact != -1)&&(integimpact != -1)&&(availimpact != -1)&&
                   (accessvector != -1)&&(accesscomplexity != -1)&&(accessauthentication != -1)) {

                    impact = 10.41 * ( 1 - ( 1 - confimpact ) * ( 1 - integimpact ) * ( 1 - availimpact ));
                    exploit = 20 * accessvector * accesscomplexity * accessauthentication;
                    if (impact != 0) {
                        fimpact = 1.176;
                    }
                    basescore = ( ( ( 0.6 * impact ) + ( 0.4 * exploit ) - 1.5 ) * fimpact );
                    basescore = Math.round( basescore * 10 ) / 10;
                    // Calcul du score temporel
                    temporalscore = basescore * exploitability * remediationlevel * reportconfidence;
                    temporalscore = Math.round( temporalscore * 10 ) / 10;
                }

                if(!(typeof basescore === "undefined")){
                    //for (var key in dict_vecteur) { //ordre alphabetique
                    for (i=0;i<vectorKeysOrdered_v2.length;i++) {
                        key = vectorKeysOrdered_v2[i];
                        vecteur =vecteur + key+":"+dict_vecteur[key]+"/";
                    }
                    vecteur = vecteur.substring(-1);



                    if(basescore>=9) {
                        sous_tritre_val = 4;
                    }else if(basescore>=7) {
                        sous_tritre_val = 3;
                    }else if(basescore>=3) {
                        sous_tritre_val = 2;
                    }else if(basescore>=0) {
                        sous_tritre_val = 1;
                    }

                }else{
                    basescore = undefined;
                    temporalscore = undefined;
                    vecteur = undefined;
                    sous_tritre_val=0;
                }

                //console.log("getScroreV2 : lock_v2 = "+document.getElementById('lock_v2').checked);
                if(!document.getElementById('lock_v2').checked){
                    //change_color(sous_tritre_val,svg_id);
                    set_img_png_src(sous_tritre_val,png_img_id);
                    //svg_to_img(svg_id, svg_img_id); //creer l'image svg
                }
                return basescore;
            } // getScroreV2

            function getScroreV3(dict_vecteur){
                var key,i;

                var vecteur = "";
                var svg_id = "sous-titre-chart_v3";
                var svg_img_id = "img_svg_v3";
                var png_img_id = "img_png_v3";
                var sous_tritre_val = 0;

                var temporalScore = undefined, baseScore = undefined;

                // variables contenant les valeurs
                var AV = dict_vecteur["AV"]     || "";
                var AC = dict_vecteur["AC"]     || "";
                var PR = dict_vecteur["PR"]     || "";
                var UI = dict_vecteur["UI"]     || "";
                var S  = dict_vecteur["S"]      || "";
                var C  = dict_vecteur["C"]      || "";
                var I  = dict_vecteur["I"]      || "";
                var A  = dict_vecteur["A"]      || "";

                var E =   dict_vecteur["E"]     || "X";
                var RL =  dict_vecteur["RL"]    || "X";
                var RC =  dict_vecteur["RC"]    || "X";
                //console.log("update_v3 1 ");
                //console.log([AV,AC, PR, UI, S, C, I, A, E, RL, RC]);
                // console.log(dict_vecteur);
                // console.log(A+"/"+AC+"/"+AV+"/"+C+"/"+E+"/"+I+"/"+PR+"/"+RC+"/"+RL+"/"+S+"/"+UI);

                if (!([AV,AC, PR, UI, S, C, I, A, E, RL, RC].includes('')) ) {
                    // GATHER WEIGHTS FOR ALL METRICS
                    var metricWeightAV  = CVSS31.Weight.AV    [AV];
                    var metricWeightAC  = CVSS31.Weight.AC    [AC];
                    var metricWeightPR  = CVSS31.Weight.PR    [S][PR];  // PR depends on the value of Scope (S).
                    var metricWeightUI  = CVSS31.Weight.UI    [UI];
                    var metricWeightS   = CVSS31.Weight.S     [S];
                    var metricWeightC   = CVSS31.Weight.CIA   [C];
                    var metricWeightI   = CVSS31.Weight.CIA   [I];
                    var metricWeightA   = CVSS31.Weight.CIA   [A];

                    var metricWeightE   = CVSS31.Weight.E     [E];
                    var metricWeightRL  = CVSS31.Weight.RL    [RL];
                    var metricWeightRC  = CVSS31.Weight.RC    [RC];


                    // CALCULATE THE CVSS BASE SCORE
                    var iss; /* Impact Sub-Score */
                    var impact;
                    var exploitability;

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
                }


                if(!(typeof baseScore === "undefined")){
                    //for (var key in dict_vecteur) { //ordre alphabetique
                    for (i=0;i<vectorKeysOrdered_v3.length;i++) {
                        key = vectorKeysOrdered_v3[i];
                        vecteur =vecteur + key+":"+dict_vecteur[key]+"/";
                    }
                    vecteur = vecteur.substring(-1);


                    if(baseScore>=9) {
                        sous_tritre_val = 4;
                    }else if(baseScore>=7) {
                        sous_tritre_val = 3;
                    }else if(baseScore>=3) {
                        sous_tritre_val = 2;
                    }else if(baseScore>=0) {
                        sous_tritre_val = 1;
                    }

                }else{
                    baseScore = undefined;
                    temporalScore = undefined;
                    vecteur = undefined;
                    sous_tritre_val = 0;
                }



                //console.log("getScroreV3 : lock_v3 = "+document.getElementById('lock_v3').checked);
                if(!document.getElementById('lock_v3').checked){
                    //change_color(sous_tritre_val,svg_id);
                    set_img_png_src(sous_tritre_val,png_img_id);
                    //svg_to_img(svg_id, svg_img_id); //creer l'image svg
                }

                return baseScore;
            } // getScroreV3

            function update_v3(dict_vecteur){
                var key,i;
                if(document.getElementById('lock_v3').checked) {return 0;}

                var vecteur = "";
                var svg_id = "sous-titre-chart_v3";
                var svg_img_id = "img_svg_v3";
                var png_img_id = "img_png_v3";
                var sous_tritre_val = 0;

                var temporalScore = undefined, baseScore = undefined;

                // variables contenant les valeurs
                var AV = dict_vecteur["AV"]     || "";
                var AC = dict_vecteur["AC"]     || "";
                var PR = dict_vecteur["PR"]     || "";
                var UI = dict_vecteur["UI"]     || "";
                var S  = dict_vecteur["S"]      || "";
                var C  = dict_vecteur["C"]      || "";
                var I  = dict_vecteur["I"]      || "";
                var A  = dict_vecteur["A"]      || "";

                var E =   dict_vecteur["E"]     || "X";
                var RL =  dict_vecteur["RL"]    || "X";
                var RC =  dict_vecteur["RC"]    || "X";
                //console.log("update_v3 1 ");
                //console.log([AV,AC, PR, UI, S, C, I, A, E, RL, RC]);

                if (!([AV,AC, PR, UI, S, C, I, A, E, RL, RC].includes(''))) {
                    // GATHER WEIGHTS FOR ALL METRICS
                    var metricWeightAV  = CVSS31.Weight.AV    [AV];
                    var metricWeightAC  = CVSS31.Weight.AC    [AC];
                    var metricWeightPR  = CVSS31.Weight.PR    [S][PR];  // PR depends on the value of Scope (S).
                    var metricWeightUI  = CVSS31.Weight.UI    [UI];
                    var metricWeightS   = CVSS31.Weight.S     [S];
                    var metricWeightC   = CVSS31.Weight.CIA   [C];
                    var metricWeightI   = CVSS31.Weight.CIA   [I];
                    var metricWeightA   = CVSS31.Weight.CIA   [A];

                    var metricWeightE   = CVSS31.Weight.E     [E];
                    var metricWeightRL  = CVSS31.Weight.RL    [RL];
                    var metricWeightRC  = CVSS31.Weight.RC    [RC];


                    // CALCULATE THE CVSS BASE SCORE
                    var iss; /* Impact Sub-Score */
                    var impact;
                    var exploitability;

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
                }

                if(!(typeof baseScore === "undefined")){
                    //for (var key in dict_vecteur) { //ordre alphabetique
                    for (i=0;i<vectorKeysOrdered_v3.length;i++) {
                        key = vectorKeysOrdered_v3[i];
                        vecteur =vecteur + key+":"+dict_vecteur[key]+"/";
                    }
                    vecteur = vecteur.substring(-1);


                    if(baseScore>=9) {
                        sous_tritre_val = 4;
                    }else if(baseScore>=7) {
                        sous_tritre_val = 3;
                    }else if(baseScore>=3) {
                        sous_tritre_val = 2;
                    }else if(baseScore>=0) {
                        sous_tritre_val = 1;
                    }

                }else{
                    baseScore = undefined;
                    temporalScore = undefined;
                    vecteur = undefined;
                    sous_tritre_val = 0;
                }
                document.getElementById("display_score_base_v3").innerText = baseScore;
                document.getElementById("display_score_temp_v3").innerText = temporalScore;
                document.getElementById("link_vecteur_v3").innerText = vecteur;

                set_img_png_src(sous_tritre_val,png_img_id);

                // modifier l'image png

            } // update_v3

            function update_v2(dict_vecteur){
                var key,i;
                //console.log("update_v2 : lock_v2 = "+document.getElementById('lock_v2').checked);
                if(document.getElementById('lock_v2').checked) {return 0;}

                var val_temp, accessvector, accesscomplexity, accessauthentication, confimpact, integimpact, availimpact, exploitability, remediationlevel, reportconfidence;
                var impact, exploit, fimpact=0, basescore=undefined, temporalscore;
                var vecteur = "";
                var svg_id = "sous-titre-chart_v2";
                var svg_img_id = "img_svg_v2";
                var png_img_id = "img_png_v2";
                var sous_tritre_val = 0;

                switch(dict_vecteur["AV"]){
                    case "L":
                        val_temp = 0.395;
                        break;
                    case "A":
                        val_temp = 0.646;
                        break;
                    case "N":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                accessvector = val_temp;
                switch(dict_vecteur["AC"]){
                    case "H":
                        val_temp = 0.35;
                        break;
                    case "M":
                        val_temp = 0.61;
                        break;
                    case "L":
                        val_temp = 0.71;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                accesscomplexity = val_temp;
                switch(dict_vecteur["Au"]){
                    case "M":
                        val_temp = 0.45;
                        break;
                    case "S":
                        val_temp = 0.56;
                        break;
                    case "N":
                        val_temp = 0.704;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                accessauthentication = val_temp;
                switch(dict_vecteur["C"]){
                    case "N":
                        val_temp = 0;
                        break;
                    case "P":
                        val_temp = 0.275;
                        break;
                    case "C":
                        val_temp = 0.66;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                confimpact = val_temp;
                switch(dict_vecteur["I"]){
                    case "N":
                        val_temp = 0;
                        break;
                    case "P":
                        val_temp = 0.275;
                        break;
                    case "C":
                        val_temp = 0.66;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                integimpact = val_temp;
                switch(dict_vecteur["A"]){
                    case "N":
                        val_temp = 0;
                        break;
                    case "P":
                        val_temp = 0.275;
                        break;
                    case "C":
                        val_temp = 0.66;
                        break;
                    default:
                        val_temp = -1;
                        break;
                }
                availimpact = val_temp;

                switch(dict_vecteur["E"]){
                    case "U":
                        val_temp = 0.85;
                        break;
                    case "POC":
                        val_temp = 0.9;
                        break;
                    case "F":
                        val_temp = 0.95;
                        break;
                    case "H":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = 1;
                        break;
                }
                exploitability = val_temp;
                switch(dict_vecteur["RL"]){
                    case "OF":
                        val_temp = 0.87;
                        break;
                    case "TF":
                        val_temp = 0.9;
                        break;
                    case "W":
                        val_temp = 0.95;
                        break;
                    case "U":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = 1;
                        break;
                }
                remediationlevel = val_temp;
                switch(dict_vecteur["RC"]){
                    case "UC":
                        val_temp = 0.9;
                        break;
                    case "UR":
                        val_temp = 0.95;
                        break;
                    case "C":
                        val_temp = 1;
                        break;
                    default:
                        val_temp = 1;
                        break;
                }
                reportconfidence = val_temp;

                // Calcul du score de base
                if((confimpact != -1)&&(integimpact != -1)&&(availimpact != -1)&&
                   (accessvector != -1)&&(accesscomplexity != -1)&&(accessauthentication != -1)) {

                    impact = 10.41 * ( 1 - ( 1 - confimpact ) * ( 1 - integimpact ) * ( 1 - availimpact ));
                    exploit = 20 * accessvector * accesscomplexity * accessauthentication;
                    if (impact != 0) {
                        fimpact = 1.176;
                    }
                    basescore = ( ( ( 0.6 * impact ) + ( 0.4 * exploit ) - 1.5 ) * fimpact );
                    basescore = Math.round( basescore * 10 ) / 10;
                    // Calcul du score temporel
                    temporalscore = basescore * exploitability * remediationlevel * reportconfidence;
                    temporalscore = Math.round( temporalscore * 10 ) / 10;
                }

                if(!(typeof basescore === "undefined")){
                    //for (var key in dict_vecteur) { //ordre alphabetique
                    for (i=0;i<vectorKeysOrdered_v2.length;i++) {
                        key = vectorKeysOrdered_v2[i];
                        vecteur =vecteur + key+":"+dict_vecteur[key]+"/";
                    }
                    vecteur = vecteur.substring(-1);



                    if(basescore>=9) {
                        sous_tritre_val = 4;
                    }else if(basescore>=7) {
                        sous_tritre_val = 3;
                    }else if(basescore>=3) {
                        sous_tritre_val = 2;
                    }else if(basescore>=0) {
                        sous_tritre_val = 1;
                    }

                }else{
                    basescore = undefined;
                    temporalscore = undefined;
                    vecteur = undefined;
                    sous_tritre_val = 0;
                }
                document.getElementById("display_score_base_v2").innerText = basescore;
                document.getElementById("display_score_temp_v2").innerText = temporalscore;
                document.getElementById("link_vecteur_v2").innerText = vecteur;

                set_img_png_src(sous_tritre_val,png_img_id);

                //console.log("update_v2 : "+vecteur);
                // modifier l'image png
            } // update_v2

            function vectorString_To_VectorList(str){
                var vecteur = update_options(str, true);
                // console.log("vectorV2String_To_VectorV2List => input : "+str);
                // console.log(vecteur);
                return vecteur;
            } // vectorString_To_VectorList

            function computeCVSS(){
                //console.log("computeCVSS");
                var vector_v2={}, vector_v3={}, value_v2_v3, value_splitted_v2_v3, value_split_short_val, value_short_val;
                for(var i=0;i<big_data_select_v2_v3.length;i++){
                    value_v2_v3 = document.getElementById(big_data_select_v2_v3[i]["select_id"]).value; // ex v2=A:/v3=A:N
                    value_splitted_v2_v3 = value_v2_v3.split('/'); // ex v2=A: et v3=A:N
                    if(Array.isArray(value_splitted_v2_v3)) {
                        if(value_splitted_v2_v3.length>0) {
                            value_split_short_val = value_splitted_v2_v3[0].split("="); // v2 et A:
                            if(Array.isArray(value_split_short_val)) {
                                if(value_split_short_val.length>1) {
                                    value_short_val = value_split_short_val[1].split(":"); // A et ""
                                    if(Array.isArray(value_short_val)) {
                                        if(value_short_val.length>1) {
                                            vector_v2[value_short_val[0]] = value_short_val[1];
                                        }
                                    }
                                }
                            }
                            value_split_short_val = value_splitted_v2_v3[1].split("="); // v3 et A:N
                            if(Array.isArray(value_split_short_val)) {
                                if(value_split_short_val.length>1) {
                                    value_short_val = value_split_short_val[1].split(":"); // A et N
                                    if(Array.isArray(value_short_val)) {
                                        if(value_short_val.length>1) {
                                            vector_v3[value_short_val[0]] = value_short_val[1];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // console.log(vector_v2);
                //console.log("v3");
                //console.log(vector_v3);
                update_v2(vector_v2);
                update_v3(vector_v3);
            } // computeCVSS

            function reset_cvss_options() {
                var i, select_id;
                //console.log("size array ("+(big_data_select_v2_v3.length)+")");
                for(i=0 ; i<(big_data_select_v2_v3.length);i++) {
                    select_id = (big_data_select_v2_v3[i])['select_id'];
                    document.getElementById(select_id).getElementsByTagName('option')[0].selected='selected';
                    //console.log("reset ID ("+select_id+")");
                }

                computeCVSS();
            } // reset_cvss_options

            let array_exclude_char=['(',')','[',']','{','}',/s/g,'>','-','_','<',' ']; // sera remplacé par le delimiteur";

            function update_options(input="", getVecteur=false){
                //console.log("update_options(input="+input+", getVecteur="+getVecteur+")");
                if (! (typeof input === 'string') || input === ''){
                    input = document.getElementById('input_text_cvss').value;
                }
                //console.log("update_options : "+input);
                //console.log("update_options : "+document.getElementById('lock_v2').checked);

                var delim = document.getElementById('input_text_cvss_delimiter').value;
                var op = document.getElementById('input_text_cvss_operateur').value;
                var i,j, key,val,entry, select_id, option, select_obj, options;
                var vecteur = {};

                if(! getVecteur) {reset_cvss_options();}

                // nettoyage de l'input
                //console.log ("input avant : "+input);
                for(i=0;i<array_exclude_char.length;i++){
                    //if(delim !==array_exclude_char[i] && op !==array_exclude_char[i]) {input=input.replaceAll(array_exclude_char[i],delim);}
                    if(delim !==array_exclude_char[i] && op !==array_exclude_char[i]) {
                        // replaceAll !!! AV : A => AV/:/A
                        while(input != input.replace(array_exclude_char[i],delim)) {
                            input=input.replace(array_exclude_char[i],delim);
                        }
                    }
                }
                //console.log ("input apres : "+input);

                const A1_cvss_entries = input.split(delim);
                for (i=0;i<A1_cvss_entries.length;i++) {

                    //console.log ("test : "+A1_cvss_entries[i]);
                    entry = A1_cvss_entries[i];
                    if (entry.split(op).length == 2) {
                        key = entry.split(op)[0];
                        val = entry.split(op)[1];


                        // is the key OK then get option value
                        for(j=0 ; j<(big_data_select_v2_v3.length);j++) {
                            //console.log(key+" => "+val);
                            if((big_data_select_v2_v3[j])['short'] === key) {
                                //console.log("apres "+key+" trouvé val => "+val+" j="+j);
                                vecteur[key] = val;

                                if(! getVecteur) {
                                    select_id = (big_data_select_v2_v3[j])['select_id'];
                                    val = ((big_data_select_v2_v3[j])['correspondances'])[val];
                                    select_obj = document.getElementById(select_id);
                                    options = Array.from(select_obj.options);
                                    option = options.find(item => item.text === val);
                                    option.selected = true;
                                }

                            }
                        }
                    }
                }
                if(! getVecteur){
                    computeCVSS();
                }else{
                    return vecteur;
                }


            } // update_options

            function scoreString_to_float(str, defaultValue=-1){
                var output=defaultValue;
                try {
                    str=(str==""?defaultValue:str);
                    output = +(str);
                    if(!output && output!=0){
                        output=defaultValue;
                    }
                }catch{

                }

                return output;
            } // scoreString_to_float

            function getStorageScore_if_ActualScoreIsUnkown(cveID, actualScore, storageType="CVEv2") {
                var fctName = "getStorageScore_if_ActualScoreIsUnkown"
                var maxScore = actualScore;
                var avi, vecteurFromStorage, scoreFromStorage
                if(cveID==WatchForDEBUG_CVE){console.log("["+fctName+"]"+" cveID="+cveID+", actualScore="+actualScore+", storageType="+storageType);}
                if(actualScore<=0){ // pas de score V2 pour cette CVE (NA ou vide) ; on vérifie si il existe une version dans le stockage
                    avi = getCVSS_fromStorage(cveID, storageType);
                    if(cveID==WatchForDEBUG_CVE){console.log("["+fctName+"]"+" cveID="+cveID+", actualScore="+actualScore+", storageType="+storageType+"==>"+avi);}
                    if(avi) {
                        if(storageType=="CVEv2") {
                            vecteurFromStorage = getVecteurV2fromStorageAVI(avi);
                            scoreFromStorage = getScroreV2(vectorString_To_VectorList(vecteurFromStorage));
                        } else {
                            vecteurFromStorage = getVecteurV3fromStorageAVI(avi);
                            scoreFromStorage = getScroreV3(vectorString_To_VectorList(vecteurFromStorage));
                        }

                        maxScore = scoreFromStorage;
                    }
                }

                return maxScore;
            } // getStorageScore_if_ActualScoreIsUnkown
        //}
        //if("FONCTIONS : API CVE"){
            // FONCTIONS\CVSS\internes />

            // < FONCTIONS\CVSS\externes
            // < TO DO
            function getCyberwatchScore(cve_id) {
                var url = "https://cyberwatch.internet.np/cve_announcements/"+cve_id;
                return 0;
                // a completer ou utiliser l'API
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        //console.log("getCyberwatchScore onload");
                        //console.log(response.responseText);
                    }
                });
            } // getCyberwatchScore
            // TO DO />

            function get_MS_score(cve_id) {
                var url = "https://msrc.microsoft.com/update-guide/vulnerability/"+cve_id+"";
                // verifier les flux xhr
                GM.XMLHttpRequest.responseXML({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        var el = document.createElement( 'html' );
                        el.innerHTML = response.responseText;
                        var score = el.getElementsByClassName('root-204');
                        //console.log(response.responseText);
                    }
                });
            } // get_MS_score

            function get_vuldb(id) {
                GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://vuldb.com/?search",
                    data: "search="+id,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response) {
                        var vul_html = response.responseText;
                        var res = vul_html.match(/VulDB \[.{1,3}\]/m);
                        if (res != null) {
                            $('#'+id+'_vuldb').before('<span style="padding-left: 30px;">'+res+'(V3)</span>');
                        }
                    }
                });
            } // get_vuldb

            function get_sourceclear(id) {
                var url_sourceclear = "https://api.sourceclear.com/catalog/search?q="+id+"%20type%3Avulnerability";
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url_sourceclear,
                    onload: function(response) {
                        var veracode = JSON.parse(response.responseText);
                        if (veracode['metadata']['hits'] == 0) {
                            document.getElementById(id+'_sourceclear').style.display = "none";
                        }
                    }
                });
            } // get_sourceclear

            function get_circl(id) {
                var url_circl = "https://cve.circl.lu/cve/"+id;
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url_circl,
                    onload: function(response) {
                        var circl = response.responseText;
                        // if (circl.includes("This CVE does not exist")) {
                        if (circl.indexOf('This CVE does not exist') !== -1) {
                            document.getElementById(id+'_circl').style.display = "none";
                        }
                    }
                });
            } // get_circl

            function feedlyGetUpdateDate(publishDate, updateSpan){
                var publishDateObject = new Date(publishDate);
                var updateDateObject = new Date(publishDate);
                var number = parseInt(/\d+/g.exec(updateSpan)) ;
                var typeOfSpan = /\D+/g.exec(updateSpan) ;

                if(typeOfSpan == "d"){updateDateObject = publishDateObject.setDate(publishDateObject.getDate()-number);}
                if(typeOfSpan == "mo"){updateDateObject = publishDateObject.setMonth(publishDateObject.getMonth()-number);}

                var returnDateStr = (new Date(updateDateObject)).toLocaleDateString("en-US");
                return returnDateStr;
            } // feedlyGetUpdateDate

            function get_feedly(id) {
                var url_feedly = "https://feedly.com/cve/"+id;
                return new Promise(resolve => {
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: url_feedly,
                        onload: function(response) {
                            var feedly = response.responseText;
                            // if (feedly.includes("This CVE does not exist")) {
                            if (feedly.indexOf('The CVE description is not yet public') !== -1) {
                                document.getElementById(id+'_feedly').style.display = "none";
                            }else{// il y a un résultats on le parse
                                var elem = document.createElement( 'html' );
                                var ht_CVE={
                                    from:url_feedly,
                                    CVEid:id
                                }
                                elem.innerHTML = response.responseText;
                                var i;
                                // DATES
                                var divDates, divDatesTxt, divDatesTxtMatchAll, publishDate, updateDate, updateSpan;
                                var datesExtractRegEx = /(?<=(: ))(.*?)(?= )/g;

                                try { // parse dates
                                    divDates = elem.getElementsByClassName("CVEHeader_date__ztRD1");
                                    if(divDates.length > 0){
                                        divDatesTxt = divDates[0].innerText
                                        divDatesTxtMatchAll = [...divDatesTxt.matchAll(datesExtractRegEx)];
                                        if(divDatesTxtMatchAll.length>0){
                                            if(divDatesTxtMatchAll[0].length>0){publishDate=divDatesTxtMatchAll[0][0];}
                                            if(divDatesTxtMatchAll.length>1){
                                                if(divDatesTxtMatchAll[1].length>0){
                                                    updateSpan=(divDatesTxtMatchAll[1])[0];
                                                    updateDate = feedlyGetUpdateDate(publishDate, updateSpan);
                                                }
                                            }
                                            // console.log("publish='"+publishDate+"' ; updated='"+updateDate+"'");
                                            ht_CVE.publishDate=publishDate;
                                            ht_CVE.updateDate=updateDate;
                                        }
                                    }
                                } catch{}
                                // SCORE
                                var divScore, divScoreTxt, score;
                                var scroreExtractRegEx = /[0-9]+\.?[0-9]?/g;

                                try { // parse Score
                                    divScore = elem.getElementsByClassName("CVECategories_field__W6K_4");
                                    for(i=0;i<divScore.length;i++){
                                        divScoreTxt = divScore[i].innerText;
                                        if(divScoreTxt.includes("CVSS")){
                                            score = parseFloat(scroreExtractRegEx.exec(divScoreTxt)) ;
                                            break;
                                        }
                                    }
                                    // console.log("Score="+score);
                                    ht_CVE.score=score;
                                } catch{}
                                // VECTEUR
                                var divVecteur, divVecteurTxt, vecteur;
                                var vecteurExtractRegEx = /[0-9]+\.?[0-9]?/g;

                                try { // parse vecteur
                                    divVecteur = elem.getElementsByClassName("Text_size--smallish__t7GHl");
                                    for(i=0;i<divScore.length;i++){
                                        divVecteurTxt = divVecteur[i].innerText;
                                        if(divVecteurTxt.includes("CVSS")){
                                            vecteur = divVecteurTxt ;
                                            break;
                                        }
                                    }
                                    // console.log("vecteur="+vecteur);
                                    ht_CVE.vecteur=vecteur;
                                } catch{}


                                //console.log(ht_CVE);
                                if(ht_CVE.score){add_log_to_CMB_FEEDLY(ht_CVE.CVEid+"="+ht_CVE.score);}
                                resolve(ht_CVE);
                            }
                        }
                    });
                }); // promise
            } // retourne {"cvss"= ; "vecteur"= ; "publishDate"= ; "updateDate"= } // get_feedly


            function get_cveDetails(id) {
                var url_cveD = "https://www.cvedetails.com/cve-details.php?cve_id="+id;
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url_cveD,
                    onload: function(response) {
                        var el = document.createElement( 'html' );
                        el.innerHTML = response.responseText;
                        var score = el.getElementsByClassName('cvssbox');
                        if (score.length == 0) {
                            var score_item = 'ØØ';
                            var color = 'rgb(242, 242, 242)';
                        } else {
                            color = score.item(0).style.backgroundColor;
                            score_item = score.item(0).innerText;
                        }
                        //get_MS_score(id);
                        document.getElementById(id+'_cveDetails').innerText = score_item;
                        document.getElementById(id+'_cveDetails').style="background-color:"+color;

                        var list_cwe = el.getElementsByClassName('details');
                        $(list_cwe).find('a').each(function() {
                            if (this.href.indexOf("/cwe.html") > -1) {
                                var cwe = this.href.split("/");
                                if (CWEs.includes(cwe[4])) {
                                    // négation !
                                } else {
                                    CWEs.push(cwe[4]);
                                }
                            }
                        });
                    }
                });
            } // get_cveDetails

            function get_nbCVEsFromTableHeader(){
                var id="tableCVEs_THs_CVE";
                var header, nb_str, nb_int=-1;
                try{
                    header = document.getElementById(id).innerText
                    nb_str=/(?<=(\())(.*?)(?=(\)))/.exec(header);
                    nb_int = parseInt(nb_str);
                }catch(error){}
                return nb_int;
            }


            function extract_nvd_dict_values(returnFonction = null, doc=document, debug=false){ // nvd_return = returnFonction(nvd_return, version, type_, tail, score, vector) et let nvd_return = new Map();
                // v1.0 du 01/10/2024
                if (returnFonction === null) {returnFonction=function default_returnFonction(nvd_return, version, type_, tail, score, vector) {return nvd_return;}}
                let id_shell_score="Cvss<version><type>CalculatorAnchor<tail>";
                let id_shell_vector="vuln-cvss<version>-<type>-vector";
                let class_shell_vector="tooltipCvss<version><type>Metrics";

                let list_version=[2,3,4];
                let list_type=["","Nist", "Cna", "Adp"];
                let list_tail=["", "NA"];

                let list_na=["n/a", "na", "ØØ"]
                let nvd_return = new Map();

                let what, score, vector, prefixe_map;
                for (const version of list_version) {
                    for (const type_ of list_type) {
                        for (const tail of list_tail) {
                            let lowerType=type_.toLowerCase();
                            if(type_ == "" || lowerType == "nist" || lowerType == "nvd"){
                                what="";
                            }else{
                                what="_CNA";
                            }
                            prefixe_map = `v${version}${what}`;
                            score=""
                            vector=""
                            let id_score = id_shell_score.replace("<version>",version).replace("<type>",type_).replace("<tail>",tail);
                            try{
                                let elem_score = doc.getElementById(id_score);
                                score = elem_score.innerText;
                                score = score.trim();
                                score = score.split(' ')[0];
                                if(debug){console.log(prefixe_map, score.toLowerCase());}
                                if(!list_na.includes(score.toLowerCase())) {
                                    score=parseInt(score.replace(/\./g, ''),10)/10; // remplace le texte x.y en xy puis divise par 10 pour recuperer la version numérique
                                }
                            }catch{}
                            let id_vector = id_shell_vector.replace("<version>",version).replace("<type>",type_).replace("<tail>",tail).toLowerCase();
                            try{
                                let elem_vector = doc.getElementById(id_vector);
                                vector=elem_vector.innerText;
                            }catch{ // on va essayer avec la class
                                let class_vector = class_shell_vector.replace("<version>",version).replace("<type>",type_).replace("<tail>",tail);
                                try{
                                    let elems_vector = doc.getElementsByClassName(class_vector);
                                    if(elems_vector.length>0){ // on prend le premier
                                        vector=elems_vector[0].innerText;
                                    }
                                }catch{}
                            }
                            if(debug){console.log(prefixe_map, score, vector);}
                            nvd_return = returnFonction(nvd_return, version, type_, tail, score, vector)
                        }
                    }
                }
                return nvd_return
            }

            var compteurCVEloaded = 0;
            var compteurCVEtoLoad = 0;
            var compteur403 = 0;
            var nombre403max = 50;
            var gbl_trim_in_cell=14;
            async function loadScore(id, intervalAnimation="") { // ancien get_nvd
                var url_NVD = "https://nvd.nist.gov/vuln/detail/"+id;

                var nvd_return = new Map();
                nvd_return.set("score",0);
                nvd_return.set("cartouche","");

                nvd_return.set("v2_BaseScore","");
                nvd_return.set("v2_Vector","");
                nvd_return.set("v3_BaseScore","");
                nvd_return.set("v3_Vector","");
                nvd_return.set("v3_CNA_BaseScore","");
                nvd_return.set("v3_CNA_Vector","");

                get_feedly(id); // a faire evoluer, await n'est pas la solution
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url_NVD,
                    onload: function(response) {
                        console.log(id+" : "+response.status);
                        if(response.status==403) {
                            // erreur de chargement, on relance
                            console.log("erreur 403 pour : "+id);
                            add_log_to_CMB("[loadScore] erreur 403 pour : "+id, 0);
                            compteur403 = compteur403+1;
                            if(compteur403>=nombre403max){
                                if(confirm(
                                    "[loadScore]("+id+")"+"\n\n"+
                                    "Le nombre d'erreur de chargement NVD (403) a atteint le seuil de "+nombre403max+"\n"+
                                    "La dernière erreur est apparue sur la CVE "+id+"\n"+
                                    "Retournez sur NVD pour verifier l'état :"+"\n"+
                                    "\thttps://nvd.nist.gov/vuln/detail/"+id+"\n"+
                                    "Si vous cliquez sur OK, la page rechargera,"+"\n"+
                                    "Si vous cliquez sur annuler, vous reinitialiserez le compteur d'erreur et continuerez les requêtes"+"\n"+
                                    "\tActuellement "+compteurCVEloaded+"/"+get_nbCVEsFromTableHeader()+"\n"+
                                    "\nIdéalement attendez 1 minute pour que NVD vous redonne l'accès"
                                )
                                  ){location.reload();
                                }else{
                                    compteur403=0;
                                }
                            }else{
                                loadScore(id);
                            }
                            return false;
                        }

                        var spanItem, NVDpublishDateDOM, NVDmodifiedDateDOM, NVDsourceDOM, NVDwarningDOM

                        // création du document lié à la réponse
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(response.responseText, "text/html"); //document.createElement( 'html' ); elem.innerHTML = response.responseText;

                        // récupération des infos de la publication NVD
                        var NVDpublishDate = "inconnu de NVD en date du "+(new Date()).toLocaleDateString("fr");
                        var NVDmodifiedDate = "inconnu de NVD en date du "+(new Date()).toLocaleDateString("fr");
                        var NVDsource = "inconnu de NVD en date du "+(new Date()).toLocaleDateString("fr");
                        var NVDwarning = "";
                        // console.log(doc);
                        try {
                            spanItem = doc.querySelectorAll('[data-testid]');
                            NVDpublishDateDOM = getDOMitemFromitems_withASpecificAttribValue(spanItem, "data-testid", "vuln-published-on");
                            NVDmodifiedDateDOM = getDOMitemFromitems_withASpecificAttribValue(spanItem, "data-testid", "vuln-last-modified-on");
                            NVDsourceDOM = getDOMitemFromitems_withASpecificAttribValue(spanItem, "data-testid", "vuln-current-description-source");
                            NVDwarningDOM = getDOMitemFromitems_withASpecificAttribValue(spanItem, "data-testid", "vuln-warning-status-name");
                            if(NVDpublishDateDOM){NVDpublishDate = dateUStoFR(NVDpublishDateDOM.innerText);}
                            if(NVDmodifiedDateDOM){NVDmodifiedDate = dateUStoFR(NVDmodifiedDateDOM.innerText);}
                            if(NVDsourceDOM){NVDsource = NVDsourceDOM.innerText;}
                            if(NVDwarningDOM){NVDwarning = NVDwarningDOM.innerText;}
                        } catch{
                        }
                        // récupération des cartouches et scores
                        let list_maych_key_score=["v2_BaseScore", "v3_BaseScore", "v3_CNA_BaseScore", "v4_BaseScore", "v4_CNA_BaseScore"]
                        let list_maych_key_vector=["v2_Vector", "v3_Vector", "v3_CNA_Vector", "v4_Vector", "v4_CNA_Vector"]
                        let list_match_key = list_maych_key_vector.concat(list_maych_key_score)
                        let returnFunction = function(nvd_return, version, type_, tail, score, vector){
                            let what, lowerType
                            lowerType=type_.toLowerCase();
                            if(type_ == "" || lowerType == "nist" || lowerType == "nvd"){
                                what="";
                            }else{
                                what="_CNA";
                            }
                            if(Number.isInteger(score) || score!=""){
                                nvd_return.set(`v${version}${what}_BaseScore`,score);
                                nvd_return.set(`v${version}${what}_Vector`,vector);
                            }
                            return nvd_return
                        }
                        let nvd_colleced = extract_nvd_dict_values(returnFunction, doc)

                        // allimentation des valeurs par défaut si vide
                        for (const key of list_match_key) {
                            nvd_return.set(key,nvd_colleced.get(key) ?? "");
                        }

                        console.log("### DEBUG loadscore : ",nvd_return);
                        // récupération du score à afficher sur le lien NVD au niveau des références CVE en bas de page
                        let maxScore=-1
                        for (const key of list_maych_key_score) {
                            if(!isNaN(nvd_colleced.get(key))){maxScore=Math.max(maxScore, nvd_colleced.get(key));}
                        }
                        nvd_return.set("score",(maxScore<0?"N/A":maxScore));
                        var score_NVD = '<a href=https://nvd.nist.gov/vuln/detail/'+id+' target="_blank">'+nvd_return.get("score")+'</a>';
                        try{
                            document.getElementById(id+"_NVD").innerHTML = score_NVD;
                        }catch(error){
                            console.log("Erreur : chargement de "+id+"_NVD");
                        }

                        // remplissage du tableau
                        var prefixe="tableCVEs_Td_"+id

                        for (const key of list_match_key) {
                            let suffixe ="_"+key
                            suffixe = suffixe.replace("BaseScore", "score")
                            suffixe = suffixe.replace("Vector", "vector")
                            try{
                                document.getElementById(prefixe+suffixe).innerText = nvd_return.get(key);
                            }catch{}
                        }
                        document.getElementById(prefixe+"_NVDpublishDate").value = NVDpublishDate;
                        document.getElementById(prefixe+"_NVDmodifiedDate").value = NVDmodifiedDate;
                        document.getElementById(prefixe+"_NVDsource").value = NVDsource;
                        document.getElementById(prefixe+"_Editeur").title = NVDsource;
                        document.getElementById(prefixe+"_Editeur").innerText = NVDsource.substring(0,gbl_trim_in_cell);


                        // barre les rejected
                        if(NVDwarning=="Rejected") {
                            // la CVE est rejetée, on a barre
                            document.getElementById("tableCVEs_Tr_"+id).style.textDecoration = "line-through"
                            document.getElementById("tableCVEs_Tr_"+id).title=NVDwarning;
                            try{
                                if(document.getElementById("li_CVE_"+id)) {
                                    console.log("Rejected : li_CVE_"+id)
                                    add_log_to_CMB("[loadScore]Rejected : li_CVE_"+id, 0);
                                    console.log(document.getElementById("li_CVE_"+id))
                                    document.getElementById("li_CVE_"+id).innerText += " (REJECTED)"
                                }
                            } catch (error){
                                console.log("Erreur ; pas de li");
                            }
                        }else if(NVDwarning) {
                            console.log("WARNING [get_NVD] "+id+" => NVD WARNING = "+NVDwarning);
                            add_log_to_CMB("WARNING [get_NVD] "+id+" => NVD WARNING = "+NVDwarning, 0);
                        }

                        // DEBUG
                        //console.log("[loadScore] "+id);
                        //console.log("[loadScore] "+id+" _v2_score = "+nvd_return.get("v2_BaseScore")+" ["+nvd_return.get("v2_Vector")+"] => "+document.getElementById("tableCVEs_Td_"+id+"_v2_score").innerText+" ["+document.getElementById("tableCVEs_Td_"+id+"_v2_vector").value+"]");
                        //console.log("[loadScore] "+id+" _v3_score = "+nvd_return.get("v3_BaseScore")+" ["+nvd_return.get("v3_Vector")+"] => "+document.getElementById("tableCVEs_Td_"+id+"_v3_score").innerText+" ["+document.getElementById("tableCVEs_Td_"+id+"_v3_vector").value+"]");
                        //console.log("[loadScore] "+id+" _v3_CNA_score = "+nvd_return.get("v3_CNA_BaseScore")+" ["+nvd_return.get("v3_CNA_Vector")+"] => "+document.getElementById("tableCVEs_Td_"+id+"_v3_CNA_score").innerText+" ["+document.getElementById("tableCVEs_Td_"+id+"_v3_CNA_vector").value+"]");

                        // colorisation
                        document.getElementById("tableCVEs_Td_"+id+"_CVE").style.color = "black";
                        if(nvd_return.get("v2_BaseScore")=== "N/A" || nvd_return.get("v2_BaseScore") === ""){
                            // Highlight les CVE sans résultats
                            document.getElementById("tableCVEs_Td_"+id+"_CVE").style.color = "red";
                            document.getElementById("tableCVEs_Td_"+id+"_CVE").style.fontWeight = "bold";
                        }

                        // colorisation en orange de l'entete du tableau des que fini
                        compteurCVEloaded = compteurCVEloaded+1;
                        if(compteurCVEloaded>= compteurCVEtoLoad){
                            document.getElementById("tableCVEs_THs").style.color = "orange";
                            if(intervalAnimation){
                                getMaxScroreFromListCVE(intervalAnimation);
                                document.getElementById("pProcessMessage").innerText = "Chargement des scores terminé, Selection du plus elevé"
                            }
                        }
                    },
                    onerror: function(error) {
                        console.log("loadScore(error id="+id+")");
                        add_log_to_CMB("[loadScore](error id="+id+")", 0);
                    }
                });
            } // loadScore
            // FONCTIONS\CVSS\externes />
            // FONCTIONS\CVSS />
        //}
        //if("FONCTION : GUI"){
            function removeIfNotAvalable(url, DOM_object){
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        //console.log(url+" : "+response.status);
                        try{

                            switch(response.status){
                                case 200:
                                    // ne rien faire
                                    break;
                                default:
                                    DOM_object.remove()
                            }
                        }catch(error){
                            console.log("[removeIfNotAvalable] ERREUR",error);
                        }
                    },
                    onerror: function(error) {
                        console.log("getURLresponseCode(error pour "+url);
                        add_log_to_CMB("[colorURLavailability]getURLresponseCode(error pour "+url, 0);
                    }
                });
            } // colorURLavailability
            function colorURLavailability(url, objectID, c200style="backgroundcolor:green;", c404style="backgroundcolor:darkgreen;text-decoration : line-through;", c400style="color:red;text-decoration : line-through;", c500style="color:orange;"){
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        //console.log(url+" : "+response.status);
                        try{
                            document.getElementById(objectID).setAttribute("title","response Code : "+response.status);
                            switch(response.status){
                                case 200:
                                    document.getElementById(objectID).style = c200style;
                                    break;
                                case 404:
                                    document.getElementById(objectID).style = c404style;
                                    break;
                                case 400:
                                    document.getElementById(objectID).style = c400style;
                                    break;
                                case 500:
                                    document.getElementById(objectID).style = c500style;
                                    break;
                            }
                        }catch(error){
                            console.log("[colorURLavailability] : Erreur colorisation lien");
                        }
                    },
                    onerror: function(error) {
                        console.log("getURLresponseCode(error pour "+url);
                        add_log_to_CMB("[colorURLavailability]getURLresponseCode(error pour "+url, 0);
                    }
                });
            } // colorURLavailability

            function getDOMitemFromitems_withASpecificAttribValue(items, attribute, value) {
                var itemOut
                for(var i=0;i<items.length;i++){
                    if((items[i]).getAttribute(attribute) == value) {
                        itemOut = items[i];
                        break;
                    }
                }
                return itemOut;
            }

            // FONCTIONS\graphique + alteration de page
            var chart_color_list_of_map;
            initialisation_svg_variables();
            function initialisation_svg_variables(){
                var chart_contour_grey = "#9c9c9c";
                var chart_inside_left_grey = "#efefef";
                var chart_inside_center_grey = "#f6f6f6";
                var chart_inside_right_grey = "#c9c9c9";

                var chart_contour_green = "#007f00";
                var chart_inside_left_green = "#b9eca3";
                var chart_inside_center_green = "#55d337";
                var chart_inside_right_green = "#00c000";

                var chart_contour_yellow = "#b69f0f";
                var chart_inside_left_yellow = "#fce700";
                var chart_inside_center_yellow = "#dac800";
                var chart_inside_right_yellow = "#c4b400";

                var chart_contour_orange = "#b47700";
                var chart_inside_left_orange = "#ffe6b4";
                var chart_inside_center_orange = "#ffc656";
                var chart_inside_right_orange = "#ffb012";

                var chart_contour_red = "#9a0808";
                var chart_inside_left_red = "#f7c5c5";
                var chart_inside_center_red = "#ee7c7c";
                var chart_inside_right_red = "#e94545";

                chart_color_list_of_map = [new Map(),new Map(),new Map(),new Map(),new Map()];
                // 0 : grey/undifened
                chart_color_list_of_map[0].set("chart_contour",chart_contour_grey);
                chart_color_list_of_map[0].set("chart_inside_left",chart_inside_left_grey);
                chart_color_list_of_map[0].set("chart_inside_center",chart_inside_center_grey);
                chart_color_list_of_map[0].set("chart_inside_right",chart_inside_right_grey);
                // 1 : green
                chart_color_list_of_map[1].set("chart_contour",chart_contour_green);
                chart_color_list_of_map[1].set("chart_inside_left",chart_inside_left_green);
                chart_color_list_of_map[1].set("chart_inside_center",chart_inside_center_green);
                chart_color_list_of_map[1].set("chart_inside_right",chart_inside_right_green);
                // 2 : yellow
                chart_color_list_of_map[2].set("chart_contour",chart_contour_yellow);
                chart_color_list_of_map[2].set("chart_inside_left",chart_inside_left_yellow);
                chart_color_list_of_map[2].set("chart_inside_center",chart_inside_center_yellow);
                chart_color_list_of_map[2].set("chart_inside_right",chart_inside_right_yellow);
                // 3 : orange
                chart_color_list_of_map[3].set("chart_contour",chart_contour_orange);
                chart_color_list_of_map[3].set("chart_inside_left",chart_inside_left_orange);
                chart_color_list_of_map[3].set("chart_inside_center",chart_inside_center_orange);
                chart_color_list_of_map[3].set("chart_inside_right",chart_inside_right_orange);
                // 4 : red
                chart_color_list_of_map[4].set("chart_contour",chart_contour_red);
                chart_color_list_of_map[4].set("chart_inside_left",chart_inside_left_red);
                chart_color_list_of_map[4].set("chart_inside_center",chart_inside_center_red);
                chart_color_list_of_map[4].set("chart_inside_right",chart_inside_right_red);
            }

            function set_img_png_src(index_color_set=0,img_id){ // dans à la source la valeur base64 de l'image cible
                var liste_img = [
                    "iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFVSURBVDhPnVPLisJAECzH5KBoIh78gJzFS07ehJCzCOsX+TNqELwJ+R4RokEhIj5i4m61iiS4rm5B09MznZqerk7h8gO8idPphNFohMPhAF3XwU+DIMDHJJPJBK1WC5ZlyR5jJatfcD6fEYYhlsulGNckms/n4lmNUup1JVEUYTweXxMLCmmaYL1eo9lsot1uo1KpXM9v+S/R6XTQ73+h1+uhVqvddh/IkLB83n633W6HOI6xWCxQLBZRKpXE55Eh2Ww28DwP0+lUbDabCVGSJLeM58iQsD2apsF1XXS7XTiOI837C4qa340dp6cS5XIZ1Wr1afl5qOFwKFrTfN8XkuPxKFW9C3kOu8/SbdsWOT+F2u/3cnuj0UC9Xv8fCWXdbrciJVXgM+gZ8ywfE2maSkwjCoPB4MIB4vRxk03l2jAMSeYPxvlgzCpXq5V40zRFuTAM8Q28m9+YaHoqhgAAAABJRU5ErkJggg=="
                    , "iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAAG+6sciAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAC4cAAAuHAZNAh1MAAACxSURBVChTnVHRFYMwCGSrOkg7T/9cxC5Rv7qDazhDYiAcJqSp2nuPl3A5DkQyPCnuF0tGvlQMA4SQZWJkCfFQhBAiR5UIcV8GS4ToIjUQQdWIm3AUj7voC9mKeoBzD/P6yi4eTHK0ArWc10kF+dRXorcS/mws/SmV9KGm0hwuQ3eE+L0rADtDpCJMcN5EivJ3ocjnqiyQSAggwnJ6+alxj3Idd4qP5SZ/4D8TP8nloLgBBWq+PZle8HYAAAAASUVORK5CYII="
                    , "iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAAG+6sciAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAC4cAAAuHAZNAh1MAAACySURBVChTlZIxDoMwDEV9g3JkbtKZHbFX6lD1CFVHJA7AWsnkW/lp0iQleZIBO/a3sSJkuV40fATnNg2aRgADFoydEIwxDaIec97P4Ku8HqIwYhkl0AAkjdAEFh/ynVSgZzGpBpW9m7Ovo6l494tFHVkCJXmQJXw20fsseYI9HdUEHlQTeuGOyN9dEf4gDUWcADSJlIpORRCMaRIpjYsF4q5giU0iLMIdZtGv3z1Jvw16ANc99saVhXigAAAAAElFTkSuQmCC"
                    , "iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAAG+6sciAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAC4cAAAuHAZNAh1MAAACxSURBVChTlVLBDcIwDMwMDIfEJPyYiUffPMsmLIGQm3Nzlu2moT3plNi+nJ0ohZjuRWxjwetRNyEDMKFJH1jSQz0I+X0FXIP3TZRIyHwVIxU9oAEEoRGagFqsDkHkA/QLa3bKoHMLt5DP1B8YSWUW0FILz8tWEApeECy7gl7BC86Cb0QO34rgBUk1aRMcNrFD+CH1CodMVNQEFOkh/Ko9k91xc+fRJJbMnf7Fo0nOs8gCgczit7YoWnoAAAAASUVORK5CYII="
                    , "iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAAG+6sciAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAC4cAAAuHAZNAh1MAAAC1SURBVChTlVHBDYQwDOPZxRgKCTEIz9uFYfhwz/sgAu7VoSRQwFJo47hxaCuiD0F0o8kHmwMDkIhkniiZI/YglnmWb9P8ianrhFFNbSt5RMUZYADBwQgmiLyoInxgHMnN62xNfTzYOaUev2GQsa69AJYIJ2BLFpzAFlRgWzrBVUEFb8G7YxTviuAPMnAIE+BFMMWjJnpoeyEesnmS7gBpx7XObpLLcQvObhIlC053uZvkfQRZAbjJlL0mcKqVAAAAAElFTkSuQmCC"
                ];
                var liste_img_portail = [
                    "images/VULNERABILITES/gris.png"
                    ,"images/VULNERABILITES/vert.png"
                    ,"images/VULNERABILITES/jaune.png"
                    ,"images/VULNERABILITES/orange.png"
                    ,"images/VULNERABILITES/rouge.png"
                ];
                var prefixe = "data:image/png;base64,";
                var index = (index_color_set>=liste_img.length || index_color_set<0 ? 0 : index_color_set);
                document.getElementById(img_id).src = prefixe+liste_img[index];
                document.getElementById(img_id).setAttribute("src_portail",liste_img_portail[index]);
            }

            function change_color(index_color_set=0,svg_id) {
                // declaration de variables
                var items, index, item, max_strips_count = 0 ;
                var color_set = chart_color_list_of_map[(index_color_set>=0 && index_color_set<chart_color_list_of_map.length ? index_color_set : 0 )];

                //console.log(color_set);
                color_set.forEach((color_value, class_name)=>{
                    items = document.getElementById(svg_id).getElementsByClassName(class_name);
                    //console.log(class_name+" : "+color_value + " ; "+index_color_set);
                    //console.log(contours);
                    max_strips_count = (index_color_set>=items.length || index_color_set<=0 ? items.length : index_color_set);
                    for (index = 0; index < max_strips_count; index++) {
                        item = items[index];
                        if((class_name.toLowerCase()).includes("contour")){
                            //console.log(item.getAttribute('stroke') + " couleur devient : "+color_value);
                            item.setAttribute('stroke', color_value);
                        }else{
                            //console.log(item.getAttribute('fill') + " couleur devient : "+color_value);
                            item.setAttribute('fill', color_value);
                        }
                        //console.log(item);
                    }
                    // blanchir le reste et continuer avec le contour
                    for (index = max_strips_count; index < items.length; index++) {
                        item = items[index];
                        if((class_name.toLowerCase()).includes("contour")){
                            item.setAttribute('stroke', color_value);
                        }else{
                            item.setAttribute('fill', "white");
                        }
                        //console.log(item);
                    }
                },index_color_set)
            }

            function svg_to_img(svg_id, img_id){
                //console.log("cration de l'image");
                var svgElement = document.getElementById(svg_id);

                // Create your own image
                //var img = document.createElement('img');
                var img = document.getElementById(img_id);
                // Serialize the svg to string
                var svgString = new XMLSerializer().serializeToString(svgElement);
                //console.log("======================== av svgString");
                //console.log(svgString);

                // Remove any characters outside the Latin1 range
                var decoded = unescape(encodeURIComponent(svgString));
                //console.log("======================== av decoded");
                //console.log(decoded);

                // Now we can use btoa to convert the svg to base64
                var base64 = btoa(decoded);
                //console.log("taille base64 : "+base64.length);
                //console.log(base64);

                var imgSource = `data:image/svg+xml;base64,${btoa(decoded)}`;

                img.setAttribute('src', imgSource);
                //document.getElementById(svg_id).after(img);

            }

    function getParentElementFrom(DOM_object){
        let DOM_parent = null;
        try{ // parentElement
            DOM_parent = DOM_object.parentElement;
        }catch{}
        return DOM_parent;
    }
    function getParentNodeFrom(DOM_object){
        let DOM_parent = null;
        try{ // parentElement
            DOM_parent = DOM_object.parentNode;
        }catch{}
        return DOM_parent;
    }
    function getParent(DOM_object){
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

            function getLastItemOfClass(className, debug=false){
                let lastItem = null;
                if(className!=""){ // il y a une classe à tester
                    let classes = document.getElementsByClassName(className);
                    if(classes.length>0){
                        let toolbox = classes[classes.length-1] // on recupère le dernier element de la classe
                        let ul = toolbox.lastElementChild;
                        if(ul){
                            lastItem = ul.lastElementChild;
                            if(debug){
                                console.log("lastItem = ");
                                console.log(lastItem);
                            }
                        }
                    }
                }
                return lastItem;
            }

            function getClassesForToolBox(index=0){
                let classeName="";
                let classesName=["toolbox", "row-toolbox"];
                if(index<classesName.length && index>=0){
                    classeName=classesName[index];
                }
                return classeName;
            }
            function getLastItemInTheToolBox(indexListClassName=0, debug=false){
                let className=getClassesForToolBox(indexListClassName);
                let lastItem = document.querySelector('body');
                if(className!=""){ // il y a une classe à tester
                    lastItem = getLastItemOfClass(className, debug);
                    if(lastItem==null){// pas d'elements trouvés
                        return getLastItemInTheToolBox(indexListClassName+1, debug);
                    }
                }
                return lastItem;
            }
            function make_download_txt(){
                var doc_title = window.location.href;
                doc_title = doc_title.split("/");
                doc_title = doc_title[4];
                document.title = doc_title;
                var newLi = document.createElement('li');
                newLi.class = "link-txt";
                newLi.id = "link-txt-btn";
                var newA = document.createElement('a');
                newA.id = "txt_gen";
                newA.title = "Télécharger au format TXT";
                var newI = document.createElement('i');
                newI.setAttribute("class","fa fa-fw fa-clipboard");
                //newI.class = "fa fa-fw fa-clipboard";
                newI.setAttribute('aria-hidden',"true");
                newA.appendChild(newI);
                newLi.appendChild(newA);


                (getLastItemInTheToolBox()).before(newLi);
            }

    function evalOnAVI(actualAVI, toevaluate="+0"){
        let splitted=actualAVI.split("-");
        let suffix=splitted.slice(0, splitted.length-1).join("-");
        let AVI_ID=splitted[splitted.length-1]
        let zeros=""
        while(AVI_ID[0]=="0"){
            zeros=zeros+"0";
            AVI_ID=AVI_ID.substring(1);
            if(AVI_ID.length<=0){break;} // on quitte la boucle avant de creer une erreur
        }
        let tailleOldNumber=AVI_ID.length;
        let newNumber = eval(`${AVI_ID}${toevaluate}`)
        let toReturn="";
        if(newNumber==0){ // TODO il faudra chercher le précedent de l'année passée
        }else{
            let tailleNewNumber = newNumber.toString().length
            console.log(tailleNewNumber,'?>',tailleOldNumber)
            if(tailleNewNumber>tailleOldNumber){ // il faut retirer un zero
                zeros=zeros.substring(1)
            }else if(tailleNewNumber<tailleOldNumber){// il faut ajouter un zero
                zeros=zeros+"0"
            }
            toReturn = suffix+"-"+zeros+newNumber
        }
        return toReturn
    }
    function getNextAVI(actualAVI){
        return evalOnAVI(actualAVI,"+1");
    } // a ameliorer en testant aux passages des années
    function getPreviousAVI(actualAVI){
        return evalOnAVI(actualAVI,"-1");
    }

            function make_download_html(){
                var itemID = "link-html-btn"
                var doc_title = window.location.href;
                doc_title = doc_title.split("/");
                let suffixLink = doc_title.slice(0, doc_title.length-2).join("/");
                doc_title = doc_title[4];
                document.title = doc_title;


                // recupération du dernier element
                let lastToolBoxButton = getLastItemInTheToolBox();
                let firtParentNodeName="";
                let firstParent=lastToolBoxButton;
                while(firtParentNodeName!="div" && firtParentNodeName!="ul" && firtParentNodeName!="ol" && firtParentNodeName!="body" && firtParentNodeName!=null){
                    firstParent = getParent(firstParent);
                    firtParentNodeName = firstParent.nodeName.toLowerCase()
                }
                // ajout des classes des siblings
                    let lst_classes = firstParent.classList
                // normalement notre parent est un div ou un UL, worst scenario c'est body ou html (pour arreter la boucle)
                let itemToAppend_a = null;
                let itemToAppend_a_next = null;
                let itemToAppend_a_previous = null;
                if(firtParentNodeName == "ul" || firtParentNodeName == "ol"){// il s'agit d'une liste de li
                    itemToAppend_a = document.createElement('li');
                    itemToAppend_a_next = document.createElement('li');
                    itemToAppend_a_previous = document.createElement('li');
                }else if(firtParentNodeName=="div"){

                    itemToAppend_a = document.createElement('div');
                    itemToAppend_a_next = document.createElement('div');
                    itemToAppend_a_previous = document.createElement('div');
                    lastToolBoxButton=getParent(lastToolBoxButton);
                }
                itemToAppend_a.classList.add("link-html");
                for(let i=0;i<lst_classes.length;i++){
                    itemToAppend_a.classList.add(lst_classes[i]);
                    itemToAppend_a_next.classList.add(lst_classes[i]);
                    itemToAppend_a_previous.classList.add(lst_classes[i]);
                }
                itemToAppend_a.id = itemID;

                // ajout precedent
                let prec = document.createElement('a');
                prec.innerText = "<="
                prec.style.cursor="pointer"
                prec.href=suffixLink+"/"+getPreviousAVI(doc_title)
                itemToAppend_a_previous.appendChild(prec);

                var newA = document.createElement('a');
                newA.id = "html_gen";
                newA.title = "Télécharger au format html";
                newA.style.cursor="pointer"
                var newImg = document.createElement('img');
                newImg.src = " data:image/png;base64,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";
                newImg.width = 18
                newImg.heigh=21
                newA.appendChild(newImg);
                itemToAppend_a.appendChild(newA);

                // ajout suivant
                let next = document.createElement('a');
                next.innerText = "=>"
                next.style.cursor="pointer"
                next.href=suffixLink+"/"+getNextAVI(doc_title)
                itemToAppend_a_next.appendChild(next);


                lastToolBoxButton.before(itemToAppend_a);
                itemToAppend_a.before(itemToAppend_a_previous)
                itemToAppend_a.after(itemToAppend_a_next)
                // suppression des boutons si la page desirée n'existe pas
                removeIfNotAvalable(prec.href, itemToAppend_a_previous)
                removeIfNotAvalable(next.href, itemToAppend_a_next)
                return itemID;
            }

            function make_html_from_list_of_dict(item_before=document.querySelector('body'), list_input, debug=false) {
                var item,dict_item, value, key, parent_id, has_parent, i, j, classes, attributes, DOMparent;
                try{
                // fonctions principales : parcourir le tableau d'objet à creer
                    for(i=0 ; i<list_input.length ; i++) {
                        dict_item = list_input[i];
                        item = document.createElement(dict_item["object"]);
                        has_parent = false;
                        for(key in dict_item){
                            value = dict_item[key];
                            //console.log (key + " : "+value);
                            switch(key){
                                case "strokewidth" :
                                    key = "stroke-width";
                                case "x" :
                                case "y" :
                                case "stroke" :
                                case "fill" :
                                case "viewBox":
                                case "width":
                                case "height":
                                    item.setAttribute(key,value);
                                    break;
                                case "class" :
                                    classes = value.split(" ");
                                    for(j=0;j<classes.length;j++){
                                        item.classList.add(classes[j]);
                                    }
                                    break;
                                case "standaloneAttributes":
                                    attributes = value.split(" ");
                                    for(j=0;j<attributes.length;j++){
                                        item[attributes[j]] = true;
                                    }
                                    break;
                                case "value":
                                    item.value = value;
                                    break;
                                case "parent_id":
                                    parent_id = value;
                                    has_parent = true;
                                    //console.log("le parent : "+value);console.log(parent_id);
                                    break;
                                case "object":
                                    break;
                                case "appendChildText" :
                                    item.appendChild(document.createTextNode(value));
                                    break;
                                default :
                                    item.setAttribute(key,value);
                                    //item[key] = value;
                                    break;
                            }
                        }
                        //console.log(item);
                        if(debug) {
                            //console.log("object : "+dict_item["object"]+" ; parent : "+parent_id+" ; id : "+dict_item["id"]);
                            console.log("before : ")
                            console.log(item_before)
                            console.log("look : "+parent_id+" for ");
                            console.log(item);
                        }
                        if(has_parent){
                            if(debug) {
                                console.log("has parent : ")
                                console.log(document.getElementById(parent_id))
                                console.log("...")
                            }
                            DOMparent = document.getElementById(parent_id);
                            DOMparent.appendChild(item);
                        } else {
                            $(item_before).after(item);
                        }
                        item_before = item;
                    }
                }catch(error){
                    console.error("[make_html_from_list_of_dict] ERROR : ",error.message);
                }

            }
            function onlyUnique(value, index, self) { // fonction à utiliser depuis un filtre de tableau pour recuperer que les elements uniques
                // var unique = tableauAunifier.filter(onlyUnique);
                return self.indexOf(value) === index;
            }

            function getGUIinputValue(searchFor="", defaultValue=""){
                var returnValue = defaultValue;
                try{
                    switch(searchFor){
                        case "checkbox_stocker":
                            returnValue = document.getElementById("boxToGMstorage").checked;
                            break;
                        default:
                            break;
                    }
                }catch (error){
                    console.log("[getGUIinputValue] ERROR :"+error.message);
                    add_log_to_CMB("[getGUIinputValue] ERROR :"+error.message);
                }
                return returnValue;
            }

            var cveMaxScoreV2 = "";
            var cveMaxScoreV3 = "";
            var cveMaxScoreV3_type = "";
            var cveMaxScoreV3_NVD = "";
            var cveMaxScoreV3_CNA = "";
            var cveMaxScoreV4_NVD = "";
            var cveMaxScoreV4_CNA = "";

            var colorV2 = "rgb(250, 171, 239)";
            var colorV3_NVD = "rgb(124, 124, 226)" ;
            var colorV3_CNA = "rgb(103, 218, 232)" ;
            var colorMixedV2V3_NVD = "rgb(187, 148, 233)" ;
            var colorMixedV2V3_CNA = "rgb(177, 195, 236)" ;
            async function getMaxScroreFromListCVE(intervalAnimation, debug=false){
                // fonction qui récupère les scores v2 et v3 les plus elevés parmis le tableau des CVE
                // les id des tds sont composés comme suit :
                // CVE : tableCVEs_Td_<CVE id>_CVE
                // v2 : tableCVEs_Td_<CVE id>_v2\tableCVEs_Td_<CVE id>_v2_score
                // 		tableCVEs_Td_<CVE id>_v2\tableCVEs_Td_<CVE id>_v2_vecteur
                // v3 : tableCVEs_Td_<CVE id>_v2\tableCVEs_Td_<CVE id>_v3_score
                // 		tableCVEs_Td_<CVE id>_v2\tableCVEs_Td_<CVE id>_v3_vecteur
                // v3 CNA : tableCVEs_Td_<CVE id>_v3\tableCVEs_Td_<CVE id>_v3_CNA_score
                // 			tableCVEs_Td_<CVE id>_v3\tableCVEs_Td_<CVE id>_v3_CNA_vecteur

                // initialisation de variables
                var fctName = "getMaxScroreFromListCVE";
                var td_prefixe = "tableCVEs_Td_";
                var row, cveID, td_cve, td_v2, score_v2, td_v3, score_v3, td_v3_CNA, score_v3_CNA;
                var cveMaxScoreV2_score, cveMaxScoreV3_score, cveMaxScoreV3_CNA_score;
				// ajout v4
				var td_v4, score_v4, td_v4_CNA, score_v4_CNA;
				var cveMaxScoreV4_NVD, cveMaxScoreV4_score, cveMaxScoreV4_CNA, cveMaxScoreV4_CNA_score;

                var v2Source = "";
                var v3Source = "";
                var aviV2, aviV3, vecteurFromStorage, scoreFromStorage;
                var dictToDisplay=0;


                // Parcours du tableau
                //console.log("["+fctName+"]"+"\n########################\n");
                //console.log("["+fctName+"]"+" Parcours du tableau");
                var table = document.getElementById("tableCVEs");
                var trs = table.querySelectorAll("tr");
                for(var i=1;i<trs.length;i++){
                    // console.log(trs[i]);
                    row=trs[i].id;
                    // console.log(row);
                    // TR example : tableCVEs_Tr_CVE-2022-31143
                    cveID = row.substring(13); //
                    // TD example  : tableCVEs_Td_CVE-2022-31143_CVE
                    td_cve = document.getElementById(td_prefixe+cveID+"_CVE");
                    td_v2 = document.getElementById(td_prefixe+cveID+"_v2");
                    score_v2 = scoreString_to_float(td_v2.innerText) ;
                    td_v3 = document.getElementById(td_prefixe+cveID+"_v3");
                    score_v3 = scoreString_to_float(td_v3.innerText);
                    td_v3_CNA = document.getElementById(td_prefixe+cveID+"_v3_CNA");
                    score_v3_CNA = scoreString_to_float(td_v3_CNA.innerText);
                    td_v4_CNA = document.getElementById(td_prefixe+cveID+"_v4");
                    score_v4_CNA = scoreString_to_float(td_v4_CNA.innerText);
                    td_v4_CNA = document.getElementById(td_prefixe+cveID+"_v4_CNA");
                    score_v4_CNA = scoreString_to_float(td_v4_CNA.innerText);


                    if(cveID==WatchForDEBUG_CVE){
                        console.log("["+fctName+"]"+" "+cveID);
                        console.log("["+fctName+"]"+" score_v2="+score_v2+" VS CVE v2 max : "+cveMaxScoreV2+" ("+cveMaxScoreV2_score+")");
                        console.log("["+fctName+"]"+" score_v3="+score_v3+" VS CVE v3 max : "+cveMaxScoreV3_NVD+" ("+cveMaxScoreV3_score+")");
                        console.log("["+fctName+"]"+" score_v3_CNA="+score_v3_CNA+" VS CVE v3 CNA max : "+cveMaxScoreV3_CNA+" ("+cveMaxScoreV3_CNA_score+")");

                    }
                    // comparaison v2
                    if(!cveMaxScoreV2){
                        // c'est la premiere valeur
                        cveMaxScoreV2 = cveID;
                        cveMaxScoreV2_score = score_v2;
                    }else{
                        // cveMaxScoreV2_score = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV2+"_v2").innerText);
                        // cas particulier : La premiere CVE etait choisie automatiquement mais sans valeurs, mais les suivantes aussi hors leur scrore proviendrai du stockage
                        score_v2 = getStorageScore_if_ActualScoreIsUnkown(cveID, score_v2, "CVEv2");
                        //console.log("["+fctName+"]"+" ap stockage : score_v2="+score_v2+" param("+cveID+","+score_v2+",CVEv2)");

                        cveMaxScoreV2_score = getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV2, cveMaxScoreV2_score, "CVEv2");
                        //console.log("["+fctName+"]"+" ap stockage : cveMaxScoreV2_score="+cveMaxScoreV2_score+" param("+cveMaxScoreV2+","+cveMaxScoreV2_score+",CVEv2)");

                        if(score_v2>cveMaxScoreV2_score){
                            //console.log("["+fctName+"]"+" ap stockage : cveMaxScoreV2_score="+cveMaxScoreV2_score+"   score_v2>cveMaxScoreV2_score");
                            cveMaxScoreV2 = cveID;
                            cveMaxScoreV2_score = score_v2;
                        }
                    }
                    // comparaison v3
                    if(!cveMaxScoreV3_NVD){
                        // c'est la premiere valeur
                        cveMaxScoreV3_NVD = cveID;
                        cveMaxScoreV3_score = score_v3;
                    }else{
                        // cveMaxScoreV3_score = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_NVD+"_v3").innerText);
                        // cas particulier : La premiere CVE etait choisie automatiquement mais sans valeurs, mais les suivantes aussi hors leur scrore proviendrai du stockage
                        score_v3 = getStorageScore_if_ActualScoreIsUnkown(cveID, score_v3, "CVEv3");
                        //console.log("["+fctName+"]"+" ap stockage : score_v3="+score_v3+" param("+cveID+","+score_v3+",CVEv3)");

                        cveMaxScoreV3_score = getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV3_NVD, cveMaxScoreV3_score, "CVEv3");
                        //console.log("["+fctName+"]"+" ap stockage : cveMaxScoreV3_score="+cveMaxScoreV3_score+" param("+cveMaxScoreV3_NVD+","+cveMaxScoreV3_score+",CVEv3)");

                        if(score_v3>cveMaxScoreV3_score){
                            //console.log("["+fctName+"]"+" ap stockage : cveMaxScoreV3_score="+cveMaxScoreV3_score+"   score_v3>cveMaxScoreV3_score");
                            cveMaxScoreV3_NVD = cveID;
                            cveMaxScoreV3_score = score_v3;
                        }
                    }
                    // comparaison v3_CNA
                    if(!cveMaxScoreV3_CNA){
                        // c'est la premiere valeur
                        cveMaxScoreV3_CNA = cveID;
                        cveMaxScoreV3_CNA_score = score_v3_CNA;
                    }else{
                        // cveMaxScoreV3_CNA_score = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_CNA+"_v3_CNA").innerText);
                        // cas particulier : La premiere CVE etait choisie automatiquement mais sans valeurs, mais les suivantes aussi hors leur scrore proviendrai du stockage
                        //score_v3_CNA = getStorageScore_if_ActualScoreIsUnkown(cveID, score_v3_CNA, "CVEv3");
                        //console.log("["+fctName+"]"+" ap stockage : score_v3_CNA="+score_v3_CNA+" param("+cveID+","+score_v3_CNA+",CVEv3)");

                        //cveMaxScoreV3_CNA_score = getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV3_CNA, cveMaxScoreV3_CNA_score, "CVEv3");
                        //console.log("["+fctName+"]"+" ap stockage : cveMaxScoreV3_CNA_score="+cveMaxScoreV3_CNA_score+" param("+cveMaxScoreV3_CNA+","+cveMaxScoreV3_CNA_score+",CVEv3)");

                        if(score_v3_CNA>cveMaxScoreV3_CNA_score){
                            //console.log("["+fctName+"]"+" ap stockage : cveMaxScoreV2_score="+cveMaxScoreV2_score+"   score_v3_CNA>cveMaxScoreV3_CNA_score");
                            cveMaxScoreV3_CNA = cveID;
                            cveMaxScoreV3_CNA_score = score_v3_CNA;
                        }
                    }
					// comparaison v4
					if (!cveMaxScoreV4_NVD) {
						cveMaxScoreV4_NVD = cveID;
						cveMaxScoreV4_score = score_v4;
					} else {
						if (score_v4 > cveMaxScoreV4_score) {
							cveMaxScoreV4_NVD = cveID;
							cveMaxScoreV4_score = score_v4;
						}
					}

					// comparaison v4_CNA
					if (!cveMaxScoreV4_CNA) {
						cveMaxScoreV4_CNA = cveID;
						cveMaxScoreV4_CNA_score = score_v4_CNA;
					} else {
						if (score_v4_CNA > cveMaxScoreV4_CNA_score) {
							cveMaxScoreV4_CNA = cveID;
							cveMaxScoreV4_CNA_score = score_v4_CNA;
						}
					}

                }

                // unification v2, v3 et v3_CNA si possible
                if(debug){
                    //console.log("["+fctName+"]"+"\n########################\n");
                    //console.log("["+fctName+"]"+" Résultat AVANT unification");
                    // console.log("avant unification : "+cveMaxScoreV2+" ; "+cveMaxScoreV3_NVD+" ; "+cveMaxScoreV3_CNA);
                }
                cveMaxScoreV2_score = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV2+"_v2").innerText);
                cveMaxScoreV3_score = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_NVD+"_v3").innerText);
                cveMaxScoreV3_CNA_score = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_CNA+"_v3_CNA").innerText);

                if(debug){
                    //console.log("["+fctName+"]"+" cveMaxScoreV2="+cveMaxScoreV2+" ("+cveMaxScoreV2_score+")");
                    //console.log("["+fctName+"]"+" cveMaxScoreV3_NVD="+cveMaxScoreV3_NVD+" ("+cveMaxScoreV3_score+")");
                    //console.log("["+fctName+"]"+" cveMaxScoreV3_CNA="+cveMaxScoreV3_CNA+" ("+cveMaxScoreV3_CNA_score+")");
                    // console.log("v2 = "+cveMaxScoreV2+"("+cveMaxScoreV2_score+") ; v3 = "+cveMaxScoreV3_NVD+"("+cveMaxScoreV3_score+") ; v3_CNA = "+cveMaxScoreV3_CNA+"("+cveMaxScoreV3_CNA_score+")");
                    console.log("av garnissage dictToDisplay");
                    console.log(dictToDisplay);
                }
                // pour des raisons de simplification de debuggage, le stockage ne sera ajouté que si le score n'est pas connu autrement
                // from cveMaxScoreV2
                var score_v2_from_cveMaxScoreV2 = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV2+"_v2").innerText);
                var score_v3n_from_cveMaxScoreV2 = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV2+"_v3").innerText);
                var score_v3c_from_cveMaxScoreV2 = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV2+"_v3_CNA").innerText);
                var score_max_between_v3n_and_v3c_from_cveMaxScoreV2 = Math.max(score_v3n_from_cveMaxScoreV2, score_v3c_from_cveMaxScoreV2);
                // from cveMaxScoreV3 NVD
                var score_v2_from_cveMaxScoreV3n = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_NVD+"_v2").innerText);
                var score_v3n_from_cveMaxScoreV3n = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_NVD+"_v3").innerText);
                var score_v3c_from_cveMaxScoreV3n = scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_NVD+"_v3_CNA").innerText);
                var score_max_between_v3n_and_v3c_from_cveMaxScoreV3n = Math.max(score_v3n_from_cveMaxScoreV3n, score_v3c_from_cveMaxScoreV3n);
                dictToDisplay = {
					"from cveMaxScoreV2":{
						"CVE":cveMaxScoreV2,
						"v2":score_v2_from_cveMaxScoreV2,
						"v2 S":getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV2, score_v2_from_cveMaxScoreV2, "CVEv2"),
						"v3 N":score_v3n_from_cveMaxScoreV2,
						"v3 C":score_v3c_from_cveMaxScoreV2,
						"v3 S":getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV2, score_max_between_v3n_and_v3c_from_cveMaxScoreV2, "CVEv3")
					},"from cveMaxScoreV3 NVD":{
						"CVE":cveMaxScoreV3_NVD,
						"v2":score_v2_from_cveMaxScoreV3n,
						"v2 S":getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV3_NVD, score_v2_from_cveMaxScoreV3n, "CVEv2"),
						"v3 N":score_v3n_from_cveMaxScoreV3n,
						"v3 C":score_v3c_from_cveMaxScoreV3n,
						"v3 S":getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV3_NVD, score_max_between_v3n_and_v3c_from_cveMaxScoreV3n, "CVEv3")
					},"from cveMaxScoreV3 CNA":{
						"CVE":cveMaxScoreV3_CNA,
						"v2":scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_CNA+"_v2").innerText),
						"v2 S":-1,
						"v3 N":scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_CNA+"_v3").innerText),
						"v3 C":scoreString_to_float(document.getElementById(td_prefixe+cveMaxScoreV3_CNA+"_v3_CNA").innerText),
						"v3 S":-1
					},"from cveMaxScoreV4 NVD": {
						"CVE": cveMaxScoreV4_NVD,
						"v4": scoreString_to_float(document.getElementById(td_prefixe + cveMaxScoreV4_NVD + "_v4").innerText),
						"v4 S": getStorageScore_if_ActualScoreIsUnkown(cveMaxScoreV4_NVD, scoreString_to_float(document.getElementById(td_prefixe + cveMaxScoreV4_NVD + "_v4").innerText), "CVEv4")
					}, "from cveMaxScoreV4 CNA": {
						"CVE": cveMaxScoreV4_CNA,
						"v4": scoreString_to_float(document.getElementById(td_prefixe + cveMaxScoreV4_CNA + "_v4_CNA").innerText),
						"v4 S": -1 // Pas de stockage pour v4
					},"cveMaxScoreV2":{
						"CVE":"",
						"Vecteur":"",
						"Score":-1,
						"source":""
					},"cveMaxScoreV3":{
						"CVE":"",
						"Vecteur":"",
						"Score":"",
						"type":"",
						"source":""
					}, "cveMaxScoreV4": {
						"CVE": "",
						"Vecteur": "",
						"Score": -1,
						"type": "",
						"source": ""
					}
				};
                if(debug){
                    console.log("av dictToDisplay");
                    console.log(dictToDisplay);
                    console.log("ap dictToDisplay");
                    //console.log("["+fctName+"]"+" Unification via le dict");
                    //console.log("["+fctName+"]"+" -- Get max V2");
                }
                var listToCompare = ["from cveMaxScoreV2","from cveMaxScoreV3 NVD","from cveMaxScoreV3 CNA"];
                var egalités_v2=[]
                var oldScore_v2 = -2, currentScore;
                var old_Titre_v2="",currentTitre;

                var versionCom = "v2";
                var Origines=[""," S"];
                var oldOrigine_v2 = "", currentOrigine;// "S" ou ""
                for(i=0;i<listToCompare.length;i++){
                    currentTitre = listToCompare[i];
                    for(var j=0;j<listToCompare.length;j++){
                        currentOrigine = versionCom+Origines[j];
                        currentScore = dictToDisplay[currentTitre][currentOrigine];
                        if(currentScore>oldScore_v2){
                            oldScore_v2 = currentScore;
                            old_Titre_v2 = currentTitre;
                            oldOrigine_v2 = currentOrigine;
                            egalités_v2=[currentTitre]
                        }else if(currentScore==oldScore_v2){
                            egalités_v2.push(currentTitre)
                        }
                    }
                }

                //console.log("["+fctName+"]"+" -- Get max V3");
                var egalités_v3=[];
                var oldScore_v3 = -2;
                var old_Titre_v3="";

                versionCom = "v3";
                Origines=[" N", " C", " S"];
                var oldOrigine_v3 = ""
                for(i=0;i<listToCompare.length;i++){
                    currentTitre = listToCompare[i];
                    //console.log("# currentTitre="+currentTitre);
                    for(j=0;j<listToCompare.length;j++){
                        currentOrigine = versionCom+Origines[j];
                        //console.log("## currentOrigine="+currentOrigine);
                        currentScore = dictToDisplay[currentTitre][currentOrigine];
                        //console.log("### compare : currentScore>oldScore_v3 => "+currentScore+">"+oldScore_v3);
                        if(currentScore>oldScore_v3){
                            //console.log("#### currentScore>oldScore_v3");
                            oldScore_v3 = currentScore;
                            old_Titre_v3 = currentTitre;
                            oldOrigine_v3 = currentOrigine;
                            egalités_v3=[currentTitre]
                        }else if(currentScore==oldScore_v3){
                            egalités_v3.push(currentTitre)
                        }
                    }
                }

                egalités_v2 = egalités_v2.filter(onlyUnique)
                egalités_v3 = egalités_v3.filter(onlyUnique)

				// v4
				var egalités_v4 = [];
				var oldScore_v4 = -2;
				var old_Titre_v4 = "";
				versionCom = "v4";
				Origines = [" N", " C", " S"];
				var oldOrigine_v4 = "";

				for (i = 0; i < listToCompare.length; i++) {
					for (j = 0; j < Origines.length; j++) {
						currentTitre = listToCompare[i];
						currentOrigine = Origines[j];
						currentScore = dictToDisplay[currentTitre]["v4" + currentOrigine];

						if (currentScore > oldScore_v4) {
							oldScore_v4 = currentScore;
							old_Titre_v4 = currentTitre;
							oldOrigine_v4 = currentOrigine;
							egalités_v4 = [currentTitre];
						} else if (currentScore == oldScore_v4) {
							egalités_v4.push(currentTitre);
						}
					}
				}
				egalités_v4 = egalités_v4.filter(onlyUnique);

                //console.log("["+fctName+"]"+" -- Found v2");
                //console.log("["+fctName+"]"+" -- old_Titre_v2="+old_Titre_v2+", oldOrigine_v2="+oldOrigine_v2+", oldScore_v2="+oldScore_v2);
                //console.log(egalités_v2);
                //console.log("["+fctName+"]"+" -- Found v3");
                //console.log("["+fctName+"]"+" -- old_Titre_v3="+old_Titre_v3+", oldOrigine_v3="+oldOrigine_v3+", oldScore_v3="+oldScore_v3);
                //console.log(egalités_v3);

                //console.log("["+fctName+"]"+" -- application des résultats");
                var intersected_Arrays_egalite = egalités_v2.filter(value => egalités_v3.includes(value));
                var score, scoreS, scoreC, scoreN, CVEid, avi;
                //console.log("intersected_Arrays_egalite");
                //console.log(intersected_Arrays_egalite);
                //console.log("egalités_v2");
                //console.log(egalités_v2);
                //console.log("egalités_v3");
                //console.log(egalités_v3);
                if(intersected_Arrays_egalite.length==0){ // pas d'intersection, on prends le premier item de chaque tableau comme valeur de référence
                    if(egalités_v2.length>0){ // il y a au moins un element v2
                        currentTitre = egalités_v2[0]
                        CVEid = dictToDisplay[currentTitre]["CVE"];
                        dictToDisplay["cveMaxScoreV2"]["CVE"] = CVEid;
                        score = dictToDisplay[currentTitre]["v2"];
                        scoreS = dictToDisplay[currentTitre]["v2 S"];


                        if(scoreS>score){
                            avi = getCVSS_fromStorage(CVEid, "CVEv2");
                            dictToDisplay["cveMaxScoreV2"]["source"]=getSourceV2fromStorageAVI(avi);
                            dictToDisplay["cveMaxScoreV2"]["Vecteur"]=getVecteurV2fromStorageAVI(avi);
                            dictToDisplay["cveMaxScoreV2"]["Score"]=scoreS;
                            (document.getElementById('tableCVEs_Td_'+CVEid+'_v2_vector')).value = dictToDisplay["cveMaxScoreV2"]["Vecteur"];
                        }else{
                            dictToDisplay["cveMaxScoreV2"]["source"]="";
                            dictToDisplay["cveMaxScoreV2"]["Vecteur"]=(document.getElementById(td_prefixe+CVEid+"_v2_vector")).value;
                            dictToDisplay["cveMaxScoreV2"]["Score"]=score;
                        }
                    }
                    if(egalités_v3.length>0){ // il y a au moins un element v2
                        currentTitre = egalités_v3[0]
                        CVEid = dictToDisplay[currentTitre]["CVE"];
                        dictToDisplay["cveMaxScoreV3"]["CVE"] = CVEid;
                        if(currentTitre.includes("CNA")){
                            score = dictToDisplay[currentTitre]["v3 C"];
                            dictToDisplay["cveMaxScoreV3"]["type"]="_CNA";
                        }else{
                            score = dictToDisplay[currentTitre]["v3 N"];
                        }
                        scoreS = dictToDisplay[currentTitre]["v3 S"];
                        if(scoreS>score){
                            avi = getCVSS_fromStorage(CVEid, "CVEv3");
                            dictToDisplay["cveMaxScoreV3"]["source"]=getSourceV3fromStorageAVI(avi);
                            dictToDisplay["cveMaxScoreV3"]["Vecteur"]=getVecteurV3fromStorageAVI(avi);
                            dictToDisplay["cveMaxScoreV3"]["Score"]=scoreS;
                            (document.getElementById('tableCVEs_Td_'+CVEid+'_v3'+dictToDisplay["cveMaxScoreV3"]["type"]+'_vector')).value = dictToDisplay["cveMaxScoreV3"]["Vecteur"];
                        }else{
                            dictToDisplay["cveMaxScoreV3"]["source"]="";
                            dictToDisplay["cveMaxScoreV3"]["Vecteur"]=(document.getElementById(td_prefixe+CVEid+"_v3_vector")).value;
                            dictToDisplay["cveMaxScoreV3"]["Score"]=score;
                        }
                    }
                }else { // il y a au moins une référence commune, on prends la premiere de ce tableau comme référence
                    currentTitre = intersected_Arrays_egalite[0];
                    CVEid = dictToDisplay[currentTitre]["CVE"];
                    // v2
                    dictToDisplay["cveMaxScoreV2"]["CVE"] = CVEid;
                    score = dictToDisplay[currentTitre]["v2"];
                    scoreS = dictToDisplay[currentTitre]["v2 S"];
                    if(scoreS>score){
                        avi = getCVSS_fromStorage(CVEid, "CVEv2");
                        dictToDisplay["cveMaxScoreV2"]["source"]=getSourceV2fromStorageAVI(avi);
                        dictToDisplay["cveMaxScoreV2"]["Vecteur"]=getVecteurV2fromStorageAVI(avi);
                        dictToDisplay["cveMaxScoreV2"]["Score"]=scoreS;
                        (document.getElementById('tableCVEs_Td_'+CVEid+'_v2_vector')).value = dictToDisplay["cveMaxScoreV2"]["Vecteur"];
                    }else{
                        dictToDisplay["cveMaxScoreV2"]["source"]="";
                        dictToDisplay["cveMaxScoreV2"]["Vecteur"]=(document.getElementById(td_prefixe+CVEid+"_v2_vector")).value;
                        dictToDisplay["cveMaxScoreV2"]["Score"]=score;
                    }
                    // v3
                    dictToDisplay["cveMaxScoreV3"]["CVE"] = CVEid;
                    scoreN = dictToDisplay[currentTitre]["v3 N"];
                    scoreC = dictToDisplay[currentTitre]["v3 C"];

                    if(scoreC > scoreN){
                        score = dictToDisplay[currentTitre]["v3 C"];
                        dictToDisplay["cveMaxScoreV3"]["type"]="_CNA";
                    }else{
                        score = dictToDisplay[currentTitre]["v3 N"];
                    }
                    scoreS = dictToDisplay[currentTitre]["v3 S"];
                    if(scoreS>score){
                        avi = getCVSS_fromStorage(CVEid, "CVEv3");
                        dictToDisplay["cveMaxScoreV3"]["source"]=getSourceV3fromStorageAVI(avi);
                        dictToDisplay["cveMaxScoreV3"]["Vecteur"]=getVecteurV3fromStorageAVI(avi);
                        dictToDisplay["cveMaxScoreV3"]["Score"]=scoreS;
                        (document.getElementById('tableCVEs_Td_'+CVEid+'_v3'+dictToDisplay["cveMaxScoreV3"]["type"]+'_vector')).value = dictToDisplay["cveMaxScoreV3"]["Vecteur"];
                    }else{
                        dictToDisplay["cveMaxScoreV3"]["source"]="";
                        dictToDisplay["cveMaxScoreV3"]["Vecteur"]=(document.getElementById(td_prefixe+CVEid+"_v3_vector")).value;
                        dictToDisplay["cveMaxScoreV3"]["Score"]=score;
                    }
                }

                //console.log("["+fctName+"]"+" apres Unification via le dict");
                cveMaxScoreV2 = dictToDisplay["cveMaxScoreV2"]["CVE"];
                cveMaxScoreV3 = dictToDisplay["cveMaxScoreV3"]["CVE"];
                cveMaxScoreV3_type = dictToDisplay["cveMaxScoreV3"]["type"];
                v2Source = dictToDisplay["cveMaxScoreV2"]["source"];
                v3Source = dictToDisplay["cveMaxScoreV3"]["source"];
                //console.log(dictToDisplay);


                // colorisation de la CVE la plus critique
                //console.log("["+fctName+"]"+" colorisation");
                document.getElementById("tableCVEs_Td_"+cveMaxScoreV2+"_v2").style.backgroundColor = colorV2;
                document.getElementById("tableCVEs_Td_"+cveMaxScoreV2+"_CVE").style.backgroundColor = colorV2;
                if(cveMaxScoreV3_type){
                    document.getElementById("tableCVEs_Td_"+cveMaxScoreV3+"_v3"+cveMaxScoreV3_type).style.backgroundColor = colorV3_CNA;
                    if(cveMaxScoreV2==cveMaxScoreV3){
                        document.getElementById("tableCVEs_Td_"+cveMaxScoreV2+"_CVE").style.backgroundColor = colorMixedV2V3_CNA;
                    }else{
                        document.getElementById("tableCVEs_Td_"+cveMaxScoreV3+"_CVE").style.backgroundColor = colorV3_CNA;
                    }
                }else{
                    document.getElementById("tableCVEs_Td_"+cveMaxScoreV3+"_v3"+cveMaxScoreV3_type).style.backgroundColor = colorV3_NVD;
                    if(cveMaxScoreV2==cveMaxScoreV3){
                        document.getElementById("tableCVEs_Td_"+cveMaxScoreV2+"_CVE").style.backgroundColor = colorMixedV2V3_NVD;
                    }else{
                        document.getElementById("tableCVEs_Td_"+cveMaxScoreV3+"_CVE").style.backgroundColor = colorV3_NVD;
                    }
                }
				// Coloration pour v4
					var colorV4 = "#0000FF"; // Bleu pour v4
					var colorV4_CNA = "#00FFFF"; // Cyan pour v4 CNA

					if (cveMaxScoreV4_score >= cveMaxScoreV4_CNA_score) {
						document.getElementById("tableCVEs_Td_" + cveMaxScoreV4_NVD + "_v4").style.backgroundColor = colorV4;
					} else {
						document.getElementById("tableCVEs_Td_" + cveMaxScoreV4_CNA + "_v4_CNA").style.backgroundColor = colorV4_CNA;
					}


                // application de la selection
                //console.log("["+fctName+"]"+" application de la selection, sourceV2="+v2Source+", sourceV3="+v3Source);
                // on applique la modification du cartouche que si la case from stockage est désactivée
                var IDcheckBoxVersion = 'v2boxFromGMstorage';
                if(document.getElementById(IDcheckBoxVersion)){
                    if(v2Source) {
                        document.getElementById(IDcheckBoxVersion).checked = true;
                    } else {
                        document.getElementById(IDcheckBoxVersion).checked = false;
                    }
                }
                set_v2_cartouche(cveMaxScoreV2,v2Source);

                IDcheckBoxVersion = 'v3boxFromGMstorage';
                if(document.getElementById(IDcheckBoxVersion)){
                    if(v3Source) {
                        document.getElementById(IDcheckBoxVersion).checked = true;
                    } else {
                        document.getElementById(IDcheckBoxVersion).checked = false;
                    }
                }
                set_v3_cartouche(cveMaxScoreV3,cveMaxScoreV3_type,v3Source);

                // colorisation en vert de l'entete du tableau des que fini
                //console.log("["+fctName+"]"+" fin");
                document.getElementById("tableCVEs_THs").style.color = "green";
                if(intervalAnimation){
                    //console.log("arret de l'interval de chargement");
                    // var voidVar = pasteBin_getStoragePasteTitle(); // DEBUT PASTEBIN COLLECT
                    clearInterval(intervalAnimation);
                }
                document.getElementById("pProcessMessage").innerText = "Selection du plus elevé terminé"
            }

            function make_input_cartouche_out(item_before=document.querySelector('body')){
                // variables graphiques
                var font_size = "14px" ;
                var border_size = "0" ;
                var indentation_td = '25px';

                // autres variables
                var list_input = [
                    {object : "div", id :'div_input', style : "font-size :"+font_size},
                    {object : "label", parent_id : "div_input", appendChildText: "ENTREE Vecteur v2 ou v3 :"},
                    {object : "input", parent_id : "div_input", type : "text", id : 'input_text_cvss', size : 70 , value : ''},

                    {object : "label", parent_id : "div_input", appendChildText: "Delimiteur entre entrées"},
                    {object : "input", parent_id : "div_input", type : "text", id : 'input_text_cvss_delimiter', size : 3, value : '/'},

                    {object : "label", parent_id : "div_input", appendChildText: "Delimiteur entrée-valeur"},
                    {object : "input", parent_id : "div_input", type : "text", id : 'input_text_cvss_operateur', size : 3, value : ':'},

                    {object : "table", parent_id : "div_input", id : "cvss_table", border : border_size},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr1"},
                    {object : "td", parent_id : "cvss_table_tr1", colSpan:"7", appendChildText: "Métrique de base"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr2"},
                    {object : "td", parent_id : "cvss_table_tr2"},
                    {object : "td", parent_id : "cvss_table_tr2", colSpan :'7', appendChildText: "Exploitabilité"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr3"},
                    {object : "td", parent_id : "cvss_table_tr3", width: indentation_td},
                    {object : "td", parent_id : "cvss_table_tr3", width: indentation_td},
                    {object : "td", parent_id : "cvss_table_tr3", appendChildText: "Vecteur d'attaque (AV)"},
                    {object : "td", parent_id : "cvss_table_tr3", appendChildText: "Complexité d'attaque (AC)", style :"padding-right:10px"},
                    {object : "td", parent_id : "cvss_table_tr3", appendChildText: "Authentification (Au)"},
                    {object : "td", parent_id : "cvss_table_tr3", appendChildText: "Privilèges requis (PR)", style :"padding-right:10px"},
                    {object : "td", parent_id : "cvss_table_tr3", appendChildText: "Interaction utilisateur (UI)"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr4"},
                    {object : "td", parent_id : "cvss_table_tr4", width :'25px'},
                    {object : "td", parent_id : "cvss_table_tr4", width :'25px'},
                    {object : "td", parent_id : "cvss_table_tr4", id : "cvss_table_tr4_td1"},
                    {object : "select", parent_id : "cvss_table_tr4_td1", id : 'AccessVectorVar', width :'100%'},
                    {object : "option", parent_id : "AccessVectorVar", value :'v2=AV:/v3=AV:', selected:'selected', label:'?',appendChildText:"?"},
                    {object : "option", parent_id : "AccessVectorVar", value :'v2=AV:L/v3=AV:L', label:'Local',appendChildText:"L"},
                    {object : "option", parent_id : "AccessVectorVar", value :'v2=AV:A/v3=AV:A', label:'Réseau contigue',appendChildText:"A"},
                    {object : "option", parent_id : "AccessVectorVar", value :'v2=AV:N/v3=AV:N', label:'Réseau',appendChildText:"N"},
                    {object : "option", parent_id : "AccessVectorVar", value :'v2=AV:L/v3=AV:P', label:'Physique',appendChildText:"P"},

                    {object : "td", parent_id : "cvss_table_tr4", id : "cvss_table_tr4_td2"},
                    {object : "select", parent_id : "cvss_table_tr4_td2", id : 'AccessComplexityVar'},
                    {object : "option", parent_id : "AccessComplexityVar", value :'v2=AC:/v3=AC:', selected: 'selected', label: '?',appendChildText:"?"},
                    {object : "option", parent_id : "AccessComplexityVar", value :'v2=AC:H/v3=AC:H', label: 'Haute',appendChildText:"H"},
                    {object : "option", parent_id : "AccessComplexityVar", value :'v2=AC:M/v3=AC:H', label: 'Moyenne/haute',appendChildText:"M"},
                    {object : "option", parent_id : "AccessComplexityVar", value :'v2=AC:M/v3=AC:L', label: 'Moyenne/faible',appendChildText:"M"},
                    {object : "option", parent_id : "AccessComplexityVar", value :'v2=AC:L/v3=AC:L', label: 'Faible',appendChildText:"L"},

                    {object : "td", parent_id : "cvss_table_tr4", id : "cvss_table_tr4_td3"},
                    {object : "select", parent_id : "cvss_table_tr4_td3", id : 'AuthenticationVar'},
                    {object : "option", parent_id : "AuthenticationVar", value :'v2=Au:/v3: ', selected: 'selected', label: '?',appendChildText:"?"},
                    {object : "option", parent_id : "AuthenticationVar", value :'v2=Au:M/v3: ', label: 'Nécessite plusieurs instances',appendChildText:"M"},
                    {object : "option", parent_id : "AuthenticationVar", value :'v2=Au:S/v3: ', label: 'Nécessite une seule instance',appendChildText:"S"},
                    {object : "option", parent_id : "AuthenticationVar", value :'v2=Au:N/v3: ', label: 'Aucune',appendChildText:"N"},

                    {object : "td", parent_id : "cvss_table_tr4", id : "cvss_table_tr4_td4"},
                    {object : "select", parent_id : "cvss_table_tr4_td4", id : 'PrivilegeRequiredVar'},
                    {object : "option", parent_id : "PrivilegeRequiredVar", value :'v2=/v3=PR:', selected: 'selected', label: '?',appendChildText:"?"},
                    {object : "option", parent_id : "PrivilegeRequiredVar", value :'v2=/v3=PR:N', label: 'Aucun',appendChildText:"N"},
                    {object : "option", parent_id : "PrivilegeRequiredVar", value :'v2=/v3=PR:L', label: 'Bas',appendChildText:"L"},
                    {object : "option", parent_id : "PrivilegeRequiredVar", value :'v2=/v3=PR:H', label: 'Hauts',appendChildText:"H"},

                    {object : "td", parent_id : "cvss_table_tr4", id : "cvss_table_tr4_td5"},
                    {object : "select", parent_id : "cvss_table_tr4_td5", id : 'UserInteractionVar'},
                    {object : "option", parent_id : "UserInteractionVar", value :'v2=/v3=UI:', selected: 'selected', label: '?',appendChildText:"?"},
                    {object : "option", parent_id : "UserInteractionVar", value :'v2=/v3=UI:N', label: 'Aucune',appendChildText:"N"},
                    {object : "option", parent_id : "UserInteractionVar", value :'v2=/v3=UI:R', label: 'Requise',appendChildText:"R"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr5"},
                    {object : "td", parent_id : "cvss_table_tr5"},
                    {object : "td", parent_id : "cvss_table_tr5", colSpan :'7', appendChildText: "Impact"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr6"},
                    {object : "td", parent_id : "cvss_table_tr6"},
                    {object : "td", parent_id : "cvss_table_tr6"},
                    {object : "td", parent_id : "cvss_table_tr6", appendChildText: "Portée (S)"},
                    {object : "td", parent_id : "cvss_table_tr6", appendChildText: "Confidentialité (C)"},
                    {object : "td", parent_id : "cvss_table_tr6", appendChildText: "Intégrité (I)"},
                    {object : "td", parent_id : "cvss_table_tr6", appendChildText: "Disponibilité (A)"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr7"},
                    {object : "td", parent_id : "cvss_table_tr7"},
                    {object : "td", parent_id : "cvss_table_tr7"},
                    {object : "td", parent_id : "cvss_table_tr7", id : "cvss_table_tr7_td1"},
                    {object : "select", parent_id : "cvss_table_tr7_td1", id : 'ScopeVar'},
                    {object : "option", parent_id : "ScopeVar", value :'v2=/v3=S:', selected: 'selected', label: '?', appendChildText:"?"},
                    {object : "option", parent_id : "ScopeVar", value :'v2=/v3=S:U', label: 'Pas de débordement', appendChildText:"U"},
                    {object : "option", parent_id : "ScopeVar", value :'v2=/v3=S:C', label: 'Débordement', appendChildText:"C"},

                    {object : "td", parent_id : "cvss_table_tr7", id : "cvss_table_tr7_td2"},
                    {object : "select", parent_id : "cvss_table_tr7_td2", id : 'ConfImpactVar'},
                    {object : "option", parent_id : "ConfImpactVar", value :'v2=C:/v3=C:', selected: 'selected', label: '?', appendChildText:"ND"},
                    {object : "option", parent_id : "ConfImpactVar", value :'v2=C:N/v3=C:N', label: 'Aucun', appendChildText:"N"},
                    {object : "option", parent_id : "ConfImpactVar", value :'v2=C:P/v3=C:L', label: 'Partiel/bas', appendChildText:"P"},
                    {object : "option", parent_id : "ConfImpactVar", value :'v2=C:C/v3=C:H', label: 'Complet/haut', appendChildText:"C"},

                    {object : "td", parent_id : "cvss_table_tr7", id : "cvss_table_tr7_td3"},
                    {object : "select", parent_id : "cvss_table_tr7_td3", id : 'IntegImpactVar'},
                    {object : "option", parent_id : "IntegImpactVar", value :'v2=I:/v3=I:', selected: 'selected', label: '?', appendChildText:"ND"},
                    {object : "option", parent_id : "IntegImpactVar", value :'v2=I:N/v3=I:N', label: 'Aucun', appendChildText:"N"},
                    {object : "option", parent_id : "IntegImpactVar", value :'v2=I:P/v3=I:L', label: 'Partiel/bas', appendChildText:"P"},
                    {object : "option", parent_id : "IntegImpactVar", value :'v2=I:C/v3=I:H', label: 'Complet/haut', appendChildText:"C"},

                    {object : "td", parent_id : "cvss_table_tr7", id : "cvss_table_tr7_td4"},
                    {object : "select", parent_id : "cvss_table_tr7_td4", id : 'AvailImpactVar'},
                    {object : "option", parent_id : "AvailImpactVar", value :'v2=A:/v3=A:', selected: 'selected', label: '?', appendChildText:"?"},
                    {object : "option", parent_id : "AvailImpactVar", value :'v2=A:N/v3=A:N', label: 'Aucun', appendChildText:"N"},
                    {object : "option", parent_id : "AvailImpactVar", value :'v2=A:P/v3=A:L', label: 'Partiel/bas', appendChildText:"P"},
                    {object : "option", parent_id : "AvailImpactVar", value :'v2=A:C/v3=A:H', label: 'Complet/haut', appendChildText:"C"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr8"},
                    {object : "td", parent_id : "cvss_table_tr8", colSpan:"7", appendChildText: "Score Temporel"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr9"},
                    {object : "td", parent_id : "cvss_table_tr9"},
                    {object : "td", parent_id : "cvss_table_tr9"},
                    {object : "td", parent_id : "cvss_table_tr9", appendChildText: "Exploitabilité (E)"},
                    {object : "td", parent_id : "cvss_table_tr9", appendChildText: "Remediation (RL)"},
                    {object : "td", parent_id : "cvss_table_tr9", appendChildText: "Confiance (RC)"},

                    {object : "tr", parent_id : "cvss_table", id : "cvss_table_tr10"},
                    {object : "td", parent_id : "cvss_table_tr10"},
                    {object : "td", parent_id : "cvss_table_tr10"},
                    {object : "td", parent_id : "cvss_table_tr10", id : "cvss_table_tr10_td1"},
                    {object : "select", parent_id : "cvss_table_tr10_td1", id : 'ExploitabilityVar'},
                    {object : "option", parent_id : "ExploitabilityVar", value :'v2=E:ND/v3=E:X', selected: 'selected', label: 'Non défini', appendChildText:"ND"},
                    {object : "option", parent_id : "ExploitabilityVar", value :'v2=E:U/v3=E:U', label: 'Non prouvé', appendChildText:"U"},
                    {object : "option", parent_id : "ExploitabilityVar", value :'v2=E:POC/v3=E:P', label: 'Programme de démonstration (PoC)', appendChildText:"POC"},
                    {object : "option", parent_id : "ExploitabilityVar", value :'v2=E:F/v3=E:F', label: 'Fonctionnel', appendChildText:"F"},
                    {object : "option", parent_id : "ExploitabilityVar", value :'v2=E:H/v3=E:H', label: 'Haut', appendChildText:"H"},

                    {object : "td", parent_id : "cvss_table_tr10", id : "cvss_table_tr10_td2"},
                    {object : "select", parent_id : "cvss_table_tr10_td2", id : 'RemediationLevelVar'},
                    {object : "option", parent_id : "RemediationLevelVar", value :'v2=RL:ND/v3=RL:X', selected: 'selected', label: 'Non défini', appendChildText:"ND"},
                    {object : "option", parent_id : "RemediationLevelVar", value :'v2=RL:OF/v3=RL:O', label: 'Correctif officiel', appendChildText:"OF"},
                    {object : "option", parent_id : "RemediationLevelVar", value :'v2=RL:TF/v3=RL:T', label: 'Correctif provisoire', appendChildText:"TF"},
                    {object : "option", parent_id : "RemediationLevelVar", value :'v2=RL:W/v3=RL:W', label: 'Palliatif', appendChildText:"W"},
                    {object : "option", parent_id : "RemediationLevelVar", value :'v2=RL:U/v3=RL:U', label: 'Non disponible', appendChildText:"U"},


                    {object : "td", parent_id : "cvss_table_tr10", id : "cvss_table_tr10_td3"},
                    {object : "select", parent_id : "cvss_table_tr10_td3", id : 'ReportConfidenceVar'},
                    {object : "option", parent_id : "ReportConfidenceVar", value :'v2=RC:ND/v3=RC:X', label: 'Non défini', appendChildText:"ND"},
                    {object : "option", parent_id : "ReportConfidenceVar", value :'v2=RC:UC/v3=RC:U', label: 'Non confirmé', appendChildText:"UC"},
                    {object : "option", parent_id : "ReportConfidenceVar", value :'v2=RC:UR/v3=RC:R', label: 'Présumé', appendChildText:"UR"},
                    {object : "option", parent_id : "ReportConfidenceVar", value :'v2=RC:C/v3=RC:C', selected: 'selected', label: 'Confirmé', appendChildText:"C"},

                    //{object : "td", parent_id : "cvss_table_tr10", id : "cvss_table_tr10_td4"},
                    //{object : "input", parent_id : "cvss_table_tr10_td4", type : "button", id : 'btn_add_RLof_RCc', size : 3, value : 'Ajouter RL:OF + RC:C'},


                    {object : "br", parent_id : "div_input"},
                    {object : "div", parent_id : "div_input", id: "divBoxOptions", style:"float:left;"},
                    {object : "input", type : "checkbox", parent_id : "divBoxOptions", id: "lock_v2"},
                    {object : "label", parent_id : "divBoxOptions", for : "lock_v2", appendChildText: "Verrouiller v2", id: "lock_v2_from_label", style :"padding-right:10px"},
                    {object : "input", type : "checkbox", parent_id : "divBoxOptions", id: "lock_v3"},
                    {object : "label", parent_id : "divBoxOptions", for : "lock_v3", appendChildText: "Verrouiller v3", id: "lock_v3_from_label", style :"padding-right:10px"},

                    {object : "input", type : "checkbox", parent_id : "divBoxOptions", id: "v2boxFromGMstorage"},
                    {object : "label", parent_id : "divBoxOptions", for : "v2boxFromGMstorage", appendChildText: "V2 from storage", id: "v2boxFromGMstorage_label", style :"padding-right:10px"},
                    {object : "input", type : "checkbox", parent_id : "divBoxOptions", id: "v3boxFromGMstorage"},
                    {object : "label", parent_id : "divBoxOptions", for : "v3boxFromGMstorage", appendChildText: "V3 from storage", id: "v3boxFromGMstorage_label", style :"padding-right:10px"},
                    {object : "div", parent_id : "div_input", id: "divBoxToGMstorage", style:"float:left;"},
                    {object : "input", type : "checkbox", parent_id : "divBoxToGMstorage", id: "boxToGMstorage", standaloneAttributes: 'checked'},
                    {object : "label", parent_id : "divBoxToGMstorage", for : "boxToGMstorage", appendChildText: "Stocker (local + Git)", id: "boxToGMstorage_label", style :"padding-right:10px" }

                ];

                make_html_from_list_of_dict(item_before, list_input);
            }
            function make_top_section(item_before=document.querySelector('body')){ // ajoute une table avec l'etat pastebin et un combobox de log
                // variables graphiques
                var font_size = "14px" ;
                var border_size = "1" ;
                var indentation_td = '25px';
                var td_style = "padding-right:10px";


                // autres variables
                var list_input = [
                    // pasteBin table
                    {object : "div", id :'div_top_section', style : "font-size :"+font_size},
                    {object : "div", id :'div_macroInfo', parent_id : "div_top_section", style : "font-size :"+font_size},
                    {object : "table", parent_id : "div_macroInfo", id : "pastebin_table", border : border_size},
                    {object : "tr", parent_id : "pastebin_table", id : "pastebin_table_tr1"}, // header
                    {object : "td", parent_id : "pastebin_table_tr1", appendChildText: "Pastes", style : td_style},//, colSpan:"7"
                    {object : "td", parent_id : "pastebin_table_tr1", appendChildText: "Status", style : td_style},
                    {object : "td", parent_id : "pastebin_table_tr1", appendChildText: "état", style : td_style},
                    {object : "tr", parent_id : "pastebin_table", id : "pastebin_table_tr2"}, // lien avant
                    {object : "td", parent_id : "pastebin_table_tr2", appendChildText: "", id : "pastebin_table_tr2_td_lien", style : td_style},
                    {object : "a", parent_id : "pastebin_table_tr2_td_lien", appendChildText: "", id : "pastebin_lien_avant", href: "", target: "_blank"},
                    {object : "td", parent_id : "pastebin_table_tr2", appendChildText: "", id : "pastebin_table_tr2_td_status", style : td_style},
                    {object : "td", parent_id : "pastebin_table_tr2", appendChildText: "", id : "pastebin_table_tr2_td_etat", style : td_style},
                    {object : "tr", parent_id : "pastebin_table", id : "pastebin_table_tr3"}, // lien ares
                    {object : "td", parent_id : "pastebin_table_tr3", appendChildText: "", id : "pastebin_table_tr3_td_lien", style : td_style},
                    {object : "a", parent_id : "pastebin_table_tr3_td_lien", appendChildText: "", id : "pastebin_lien_apres", href: "", target: "_blank"},
                    {object : "td", parent_id : "pastebin_table_tr3", appendChildText: "", id : "pastebin_table_tr3_td_status", style : td_style},
                    {object : "td", parent_id : "pastebin_table_tr3", appendChildText: "", id : "pastebin_table_tr3_td_etat", style : td_style},


                    // combobox log
                    {object : "div", id :'div_LOGS', parent_id : "div_top_section", style : "font-size :"+font_size},
                    {object : "label", parent_id : "div_LOGS", appendChildText: "logs :"},
                    {object : "select", parent_id : "div_LOGS", id : 'cmb_log', size : 1, style : "width:50em;"},
                    {object : "div", id :'div_LOGS_page', parent_id : "div_top_section", style : "font-size :"+font_size},
                    {object : "label", parent_id : "div_LOGS_page", appendChildText: "Erreurs Page :"},
                    {object : "select", parent_id : "div_LOGS_page", id : 'cmb_log_page', size : 1, style : "width:50em;"},
                    {object : "div", id :'div_LOGS_feedly', parent_id : "div_top_section", style : "font-size :"+font_size},
                    {object : "label", parent_id : "div_LOGS_feedly", appendChildText: "Logs feedly :"},
                    {object : "select", parent_id : "div_LOGS_feedly", id : 'cmb_log_feedly', size : 1, style : "width:50em;"}
                ];

                make_html_from_list_of_dict(item_before, list_input);
            }
            function add_log_to_CMB_x(cmbID, txt, indent, data_value=null){// ajoute une option dans le CMB comme un log et selection l'option // ressemble un peu a un spoiler mais avec le dernier spoil
                var txtIndent=get_indent(indent);
                // list all options values
                let DOM_cmb_log = document.getElementById(cmbID);
                var newOptionValue = DOM_cmb_log.children.length;

                let newOption = new Option(txtIndent+newOptionValue+" : "+txt,newOptionValue);
                DOM_cmb_log.add(newOption,undefined);
                DOM_cmb_log.value=newOptionValue;
                if(data_value){}//ajout de data-value et du onchange
            }
            function add_log_to_CMB(txt, indent=0){// ajoute une option dans le CMB comme un log et selection l'option // ressemble un peu a un spoiler mais avec le dernier spoil
                var id_cmb_log = "cmb_log";
                add_log_to_CMB_x(id_cmb_log, txt, indent);
            }
            function add_log_to_CMB_PAGE(txt, indent=0){// ajoute une option dans le CMB comme un log et selection l'option // ressemble un peu a un spoiler mais avec le dernier spoil
                var id_cmb_log = "cmb_log_page";
                add_log_to_CMB_x(id_cmb_log, txt, indent);
            }
            function add_log_to_CMB_FEEDLY(txt, indent=0){// ajoute une option dans le CMB comme un log et selection l'option // ressemble un peu a un spoiler mais avec le dernier spoil
                var id_cmb_log = "cmb_log_feedly";
                add_log_to_CMB_x(id_cmb_log, txt, indent);
            }
            function update_paste_table(from, status, api_paste_key,texteLien=""){ // met à jour la table celon une logique unique
                add_log_to_CMB("[update_paste_table] "+from+" / "+status+" / "+api_paste_key);
                var target="", etat="", lien="";
                var pasteBinURL_prefixe = "https://pastebin.com/"

                // determinaison du scénario:
                switch(from){
                    case "pasteBin_add": //("pasteBin_add",status,responseText)
                        // uniquement au moment du telechargement (apres avoir supprimé); envoi
                        target = "apres";
                        // récupération du lien
                        if(status==200){ // ajout OK
                            etat = "ajouté";
                            lien = api_paste_key;
                        }else{
                            etat = "erreur ajout, faites F12";
                            lien = pasteBinURL_prefixe+api_paste_key;
                        }
                        break;
                    case "pasteBin_delete": //("pasteBin_delete",status,api_paste_key)
                        // uniquement au au moment de remplacer le paste bin apres le telechargement avant d'ajouter
                        target = "avant";
                        if(status==200){ // suppression OK
                            status = 404;
                            etat = "supprimé";
                            texteLien = document.getElementById("pastebin_lien_avant").innerText
                        }else{
                            etat = "erreur suppression, faites F12";
                        }
                        lien = pasteBinURL_prefixe+api_paste_key;
                        break;
                    case "pasteBin_getContent": // ("pasteBin_getContent",status,api_paste_key)
                        // au moment de la mise à jour du stockage
                        target = "avant";
                        if(status==200){ // ajout OK
                            etat = "mise à jour dans le stockage";
                        }else{
                            etat = "erreur récupération du contenu, faites F12";
                        }
                        lien = pasteBinURL_prefixe+api_paste_key;
                        break;
                    case "pasteBin_getStoragePasteTitle": // ("pasteBin_getStoragePasteTitle",title,api_paste_key)
                        // deux scenario : avant la suppression pour recuperer la cle et apres le chargement des CVE
                        target = "avant";
                        if(status){
                            if(api_paste_key){
                                etat = status;
                                status=200;
                            }else{
                                etat = "paste ("+status+") mais pas de clé";
                                status="home";
                                api_paste_key="";
                            }
                        }else{
                            status="home";
                            etat = "pas de paste";
                            api_paste_key="";
                        }
                        lien = pasteBinURL_prefixe+api_paste_key;
                        break;
                }
                // id utilisés
                var id_link, id_status, id_etat;
                switch(target){
                    case "avant":
                        id_link = "pastebin_lien_avant";
                        id_status = "pastebin_table_tr2_td_status";
                        id_etat = "pastebin_table_tr2_td_etat";
                        break;
                    default:
                        id_link = "pastebin_lien_apres";
                        id_status = "pastebin_table_tr3_td_status";
                        id_etat = "pastebin_table_tr3_td_etat";
                        break;
                }
                document.getElementById(id_link).innerText = (texteLien?texteLien:api_paste_key);
                document.getElementById(id_link).href = lien;
                document.getElementById(id_status).innerText = status;
                document.getElementById(id_etat).innerText = etat;

            }

            function add_functions_onchange(){
                var items = document.querySelectorAll('select');

                for(var i=0;i<items.length;i++) {
                    //items[i].setAttribute("onchange", update_output); // inside the code
                    items[i].addEventListener('change', computeCVSS,false);
                }
                items = document.querySelectorAll('input');
                for(i=0;i<items.length;i++) {
                    if(items[i].type==="text"){
                        items[i].addEventListener('change', update_options);
                        items[i].addEventListener('keyup', update_options);
                        //items[i].setAttribute("onchange", update_options());//update_options lancera update_output // inside the code
                    }
                }
            }

            function add_functions_onclick(){
                document.getElementById('link_vecteur_v2').setAttribute('onclick',"document.getElementById('input_text_cvss').value = this.innerText;document.getElementById('lock_v3').checked = true;document.getElementById('lock_v2').checked = false;");
                document.getElementById('link_vecteur_v3').setAttribute('onclick',"document.getElementById('input_text_cvss').value = this.innerText;document.getElementById('lock_v2').checked = true;document.getElementById('lock_v3').checked = false;");

                document.getElementById('link_vecteur_v2').addEventListener('click',update_options);
                document.getElementById('link_vecteur_v3').addEventListener('click',update_options);

                document.getElementById('btn_add_RLof_RCc').addEventListener('click',addDefaultTempo);

            }

            function selectOption(select_id, optionText){
                var select_obj = document.getElementById(select_id);
                var options = Array.from(select_obj.options);
                var option = options.find(item => item.text === optionText);
                option.selected = true;
            }

            function addDefaultTempo(){
                addDefaultTempo_version('link_vecteur_v2');
                addDefaultTempo_version('link_vecteur_v3');
            }

            function addDefaultTempo_version(idLink){
                document.getElementById(idLink).click();

                var idSelect = 'RemediationLevelVar';
                var optionText = 'OF';
                selectOption(idSelect, optionText);

                idSelect = 'ReportConfidenceVar';
                optionText = 'C';
                selectOption(idSelect, optionText);

                computeCVSS();
            }
            function set_only_form_vector(cveID, version, CNA="", source=""){
                var TargetVersion=`_v${version}`;
                let vector_id = 'tableCVEs_Td_'+cveID+TargetVersion+CNA+'_vector'
                let vector=document.getElementById(vector_id).value;
                if(vector==""){vector=document.getElementById(vector_id).textContent}
                console.log("[set_only_form_vector] : ",vector_id,vector)
                document.getElementById('input_text_cvss').value = vector;

                update_options();
            }

            function set_v2_cartouche(cveID, source=""){
                var TargetVersion="_v2";
                //console.log("cliqued ("+cveID+") : " +document.getElementById('tableCVEs_Td_'+cveID+TargetVersion+'_vector').value );
                let vector_id = 'tableCVEs_Td_'+cveID+TargetVersion+'_vector'
                let vector=document.getElementById(vector_id).value;
                if(vector==""){vector=document.getElementById(vector_id).textContent}
                document.getElementById('input_text_cvss').value = vector;
                document.getElementById('refCVE_vecteur'+TargetVersion).value = cveID;
                document.getElementById('refCVE_vecteur'+TargetVersion+'_source').value = (source ? source : "NVD auto");
                document.getElementById('lock_v2').checked = false;
                document.getElementById('lock_v3').checked = true;

                var lstMetaNVD=["NVDpublishDate","NVDmodifiedDate","NVDsource"];
                var metaValue, metaID;
                for(var i=0 ; i<lstMetaNVD.length;i++) {
                    metaValue = "";
                    metaID = 'tableCVEs_Td_'+cveID+'_'+lstMetaNVD[i];
                    if(document.getElementById(metaID)) {
                        metaValue = document.getElementById(metaID).value;
                    }
                    document.getElementById('refCVE'+TargetVersion+'_'+lstMetaNVD[i]).value = metaValue;
                    //console.log("application de '"+metaValue+"' a "+'refCVE'+TargetVersion+'_'+lstMetaNVD[i]);
                }

                update_options();
            }
            function set_v3_cartouche(cveID,CNA="", source=""){
                var TargetVersion="_v3";
                //console.log("cliqued ("+cveID+") : " +document.getElementById('tableCVEs_Td_'+cveID+TargetVersion+CNA+'_vector').value );
                let vector_id = 'tableCVEs_Td_'+cveID+TargetVersion+CNA+'_vector'
                let vector=document.getElementById(vector_id).value;
                if(vector==""){vector=document.getElementById(vector_id).textContent}
                document.getElementById('input_text_cvss').value = vector;
                document.getElementById('refCVE_vecteur'+TargetVersion).value = cveID;
                document.getElementById('refCVE_vecteur'+TargetVersion+'_source').value = (source ? source : "NVD "+(CNA ? "(CNA) " : '')+"auto");
                document.getElementById('lock_v2').checked = true;
                document.getElementById('lock_v3').checked = false;

                var lstMetaNVD=["NVDpublishDate","NVDmodifiedDate","NVDsource"];
                var metaValue, metaID;
                for(var i=0 ; i<lstMetaNVD.length;i++) {
                    metaValue = "";
                    metaID = 'tableCVEs_Td_'+cveID+'_'+lstMetaNVD[i];
                    if(document.getElementById(metaID)) {
                        metaValue = document.getElementById(metaID).value;
                    }
                    document.getElementById('refCVE'+TargetVersion+'_'+lstMetaNVD[i]).value = metaValue;
                    //console.log("application de '"+metaValue+"' a "+'refCVE'+TargetVersion+'_'+lstMetaNVD[i]);
                }

                update_options();
            }
            function set_cartouche_FromCVEtd(tdDOM) {
                // Déclaration des variables
                const cveID = (/CVE-[0-9]+-[0-9]+/).exec(tdDOM.id)[0];
                const versionValue = (/v[0-9]/).exec(tdDOM.id)[0]; // v2, v3 ou v4
                const isTD_v2 = (/v2$/).test(tdDOM.id);
                const isTD_v3_NVD = (/v3$/).test(tdDOM.id);
                const isTD_v3_CNA = (/v3_CNA/).test(tdDOM.id);
                const isTD_v4_NVD = (/v4$/).test(tdDOM.id);
                const isTD_v4_CNA = (/v4_CNA/).test(tdDOM.id);

                // Générique
                var source = "";
                var scoreIsFromStorage = false;
                var IDcheckBoxVersion = versionValue + 'boxFromGMstorage';

                // Remise à zéro du style du tableau pour "sélectionner" la bonne cellule
                var cleanOnly = [];
                var DOMtable = null;
                if (isTD_v2) {
                    cleanOnly = ["v2"];
                } else if (isTD_v3_NVD || isTD_v3_CNA) {
                    cleanOnly = ["v3"];
                } else { // c'est un v4
                    cleanOnly = ["v2", "v3", "v4"];
                }

                try {
                    var cpt = 0;
                    DOMtable = tdDOM;
                    while (DOMtable.nodeName != "TABLE" && cpt < 5) {
                        DOMtable = DOMtable.parentNode;
                        cpt++;
                    }
                } catch (error) {
                    console.error("[set_cartouche_FromCVEtd] ERROR:", error.message);
                }
                for (const toClean of cleanOnly) {
                    resetBorderStyle(DOMtable, toClean);
                }
                // Mise en lumière de la cellule
                higlightCellBorder(tdDOM);

                // Cellule
                var prefixe_IDCell = 'tableCVEs_Td_' + cveID + '_' + versionValue;
                var IDvectorCell = prefixe_IDCell + '_vector';
                var vectorFromCell = "";
                var scoreFromVector = -1;
                var scoreFromCell = scoreString_to_float(tdDOM.innerText);

                var vectorFromCell_NVD = "";
                var vectorFromCell_CNA = "";
                var scoreFromCell_NVD = -1;
                var scoreFromCell_CNA = -1;
                var scoreFromVector_NVD = -1;
                var scoreFromVector_CNA = -1;

                // Initialisation
                try {
                    vectorFromCell = document.getElementById(IDvectorCell).value;
                    scoreFromVector = getScroreV2(vectorString_To_VectorList(vectorFromCell));
                } catch {}

                // Déterminer si la valeur de la cellule provient du stockage
                if (isTD_v3_NVD || isTD_v3_CNA) {
                    try {
                        vectorFromCell_NVD = isTD_v3_NVD ? vectorFromCell : document.getElementById(prefixe_IDCell + "_vector").value;
                        scoreFromVector_NVD = getScroreV3(vectorString_To_VectorList(vectorFromCell_NVD));
                    } catch {}
                    try {
                        vectorFromCell_CNA = isTD_v3_CNA ? vectorFromCell : document.getElementById(prefixe_IDCell + "_CNA_vector").value;
                        scoreFromVector_CNA = getScroreV3(vectorString_To_VectorList(vectorFromCell_CNA));
                    } catch {}
                    try {
                        scoreFromCell_NVD = isTD_v3_NVD ? scoreFromCell : scoreString_to_float(document.getElementById(prefixe_IDCell + "_score").innerText);
                    } catch {}
                    try {
                        scoreFromCell_CNA = isTD_v3_CNA ? scoreFromCell : scoreString_to_float(document.getElementById(prefixe_IDCell + "_CNA_score").innerText);
                    } catch {}

                    scoreIsFromStorage = scoreFromVector_NVD > scoreFromCell_NVD && scoreFromVector_CNA > scoreFromCell_CNA;
                } else if (isTD_v2) {
                    scoreIsFromStorage = scoreFromVector > scoreFromCell;
                } else { // v4 pas stocké pour le moment
                    scoreIsFromStorage = false;
                }

                // Application du score et vecteur
                if (isTD_v4_NVD || isTD_v4_CNA) {
                    // Pour v4, on coche uniquement les cases v2 et v3
                    try {
                        document.getElementById('lock_v2').checked = true;
                        document.getElementById('lock_v3').checked = true;
                        set_only_form_vector(cveID, 4,(isTD_v4_CNA ? "_CNA" : ""), source);
                    } catch {}
                } else {
                    try {
                        document.getElementById(IDcheckBoxVersion).checked = scoreIsFromStorage;
                    } catch {}

                    if (isTD_v3_NVD || isTD_v3_CNA) {
                        if (scoreIsFromStorage) {
                            source = getSourceV3fromStorageAVI(getCVSS_fromStorage(cveID, "CVEv3"));
                        }
                        set_v3_cartouche(cveID, (isTD_v3_CNA ? "_CNA" : ""), source);
                    } else if (isTD_v2) {
                        if (scoreIsFromStorage) {
                            source = getSourceV2fromStorageAVI(getCVSS_fromStorage(cveID, "CVEv2"));
                        }
                        set_v2_cartouche(cveID, source);
                    }
                }
            }

            function printEphemeralMessage(event, message, delay = 1000){
                var DOMmessage=document.createElement("div")
                DOMmessage.style.border = "1px dashed blue";
                DOMmessage.style.position = "absolute";
                DOMmessage.style.left = event.pageX+5+"px";
                DOMmessage.style.top = event.pageY+5+"px";
                DOMmessage.style.background= "white";

                var txt = document.createElement("p");
                txt.innerHTML = message;
                DOMmessage.appendChild(txt);

                document.querySelector('body').appendChild(DOMmessage);

                setTimeout(function(){DOMmessage.remove();}, delay);

            }
            function copyCVEname(event){
                var DOMitem = event.target
                var cveID = (/CVE-[0-9]+-[0-9]+/).exec(DOMitem.id);

                updateClipboard(cveID);
                var messageHTML = "<strong>"+cveID+" copié. </strong>";
                printEphemeralMessage(event, messageHTML, 2000);

            }

            function add_functions_onclick_arrayOfCVE(arrayOfCVE=[]){
                var id = "";
                for(var i=0;i<arrayOfCVE.length;i++){
                    id = arrayOfCVE[i];

                    // CVE updateClipboard
                    document.getElementById('tableCVEs_Td_'+id+'_CVE').addEventListener('click', copyCVEname,false);

                    //v2
                    document.getElementById('tableCVEs_Td_'+id+'_v2').addEventListener('click', function(){
                        set_cartouche_FromCVEtd(this);
                    },false);

                    // v3
                    document.getElementById('tableCVEs_Td_'+id+'_v3').addEventListener('click', function(){
                        set_cartouche_FromCVEtd(this);
                    },false);

                    // v3 CNA
                    document.getElementById('tableCVEs_Td_'+id+'_v3_CNA').addEventListener('click', function(){
                        set_cartouche_FromCVEtd(this);
                    },false);

                    // v4
                    document.getElementById('tableCVEs_Td_'+id+'_v4').addEventListener('click', function(){
                        set_cartouche_FromCVEtd(this);
                    },false);

                    // v4 CNA
                    document.getElementById('tableCVEs_Td_'+id+'_v4_CNA').addEventListener('click', function(){
                        set_cartouche_FromCVEtd(this);
                    },false);
                }
            }

            function updateCartoucheFromStorageOrAutoNVD() {
                if(document.getElementById("v2boxFromGMstorage").checked){
                    document.getElementById('lock_v2').checked = false;
                    document.getElementById('lock_v3').checked = true;
                    stockageToFieldsV2();
                }else{
                    // set_v2_cartouche(cveMaxScoreV2);
                    var elemID = "tableCVEs_Td_"+cveMaxScoreV2+"_v2";
                    var elem = document.getElementById(elemID);
                    // console.log("updateCartoucheFromStorageOrAutoNVD 2 : "+elemID);
                    // console.log(elem);
                    set_cartouche_FromCVEtd(elem);
                }

                if(document.getElementById("v3boxFromGMstorage").checked){
                    document.getElementById('lock_v2').checked = true;
                    document.getElementById('lock_v3').checked = false;
                    stockageToFieldsV3();
                }else{
                    // set_v3_cartouche(cveMaxScoreV3);
                    elemID = "tableCVEs_Td_"+cveMaxScoreV3+"_v3"+cveMaxScoreV3_type+"";
                    elem = document.getElementById(elemID);
                    // console.log("updateCartoucheFromStorageOrAutoNVD 3 : "+elemID);
                    // console.log(elem);
                    set_cartouche_FromCVEtd(elem);
                }
            }

            function make_display_cartouche_out(item_before){
                // variables graphiques
                var font_size = "20px" ;
                var border_size = "0" ;
                var indentation_td = '40px';
                var greyedStyle = "background-color: #f0f0f0;"

                document.querySelector("html").setAttribute("xmlns","http://www.w3.org/1999/xhtml");
                // autres variables
                var list_input = [
                    {object : "div", id :'div_output', style : "font-size :"+font_size},
                    {object: "input", parent_id : "div_output", type:"hidden", id: "scriptVersionUsed", value: scriptVersion, class: "only_for_html_export"},
                    {object : "table", parent_id : "div_output" , id :'cartouche_table', class: "only_for_html_export", style:"display:block;", border: border_size},

                    {object: "tr", parent_id : "cartouche_table", id: "cartouche_table_tr1"},
                    {object: "td", parent_id : "cartouche_table_tr1", width: indentation_td, style :"padding-right:10px"},
                    //{object: "td", parent_id : "cartouche_table_tr1", appendChildText: "Gravité svg", style :"padding-right:10px"},
                    //{object: "td", parent_id : "cartouche_table_tr1", appendChildText: "Gravité img svg", style :"padding-right:10px"},
                    {object: "td", parent_id : "cartouche_table_tr1", appendChildText: "Gravité", style :"padding-right:10px"}, //Gravité img png
                    {object: "td", parent_id : "cartouche_table_tr1", appendChildText: "Score de base", style :"padding-right:10px"},
                    {object: "td", parent_id : "cartouche_table_tr1", appendChildText: "Score temporel", style :"padding-right:10px"},
                    {object: "td", parent_id : "cartouche_table_tr1", appendChildText: "Vecteur", style :"padding-right:10px", id : "cartouche_table_tr1_td5"},
                    {object : "input", parent_id : "cartouche_table_tr1_td5", type : "button", id : 'btn_add_RLof_RCc', size : 3, value : 'Ajouter RL:OF + RC:C', style :"margin-left:10px", class: "avoid_from_selection",tabindex:3},

                    {object: "tr", parent_id : "cartouche_table", id: "cartouche_table_tr2"},
                    {object: "td", parent_id : "cartouche_table_tr2", appendChildText: "v2"},
                    //{object: "td", parent_id : "cartouche_table_tr2", id: "cartouche_table_v2_pictogramme"},
                    //{object: "svg", parent_id: "cartouche_table_v2_pictogramme", width: "40", height: "40", id: "sous-titre-chart_v2", viewBox: "0 0 80 80"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "0", y: "60", width: "20", height: "20", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "20", y: "40", width: "20", height: "40", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "40", y: "20", width: "20", height: "60", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "60", y: "0", width: "20", height: "80", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},

                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "1", y: "67", width: "6", height: "12", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "21", y: "47", width: "6", height: "32", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "41", y: "27", width: "6", height: "52", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "61", y: "7", width: "6", height: "72", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},

                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "7", y: "67", width: "6", height: "12", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "27", y: "47", width: "6", height: "32", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "47", y: "27", width: "6", height: "52", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "67", y: "7", width: "6", height: "72", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},

                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "13", y: "67", width: "6", height: "12", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "33", y: "47", width: "6", height: "32", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "53", y: "27", width: "6", height: "52", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},
                    //{object: "rect", parent_id: "sous-titre-chart_v2", x: "73", y: "7", width: "6", height: "72", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},

                    //{object: "td", parent_id : "cartouche_table_tr2", id: "cartouche_table_v2_pictogramme_image_svg"},
                    //{object: "img", parent_id : "cartouche_table_v2_pictogramme_image_svg", id: "img_svg_v2", width: "40", height: "40"},
                    {object: "td", parent_id : "cartouche_table_tr2", id: "cartouche_table_v2_pictogramme_image_png"},
                    {object: "img", parent_id : "cartouche_table_v2_pictogramme_image_png", id: "img_png_v2", width: "40", height: "40"},
                    {object: "td", parent_id : "cartouche_table_tr2", id: "display_score_base_v2", appendChildText: "undefined"},
                    {object: "td", parent_id : "cartouche_table_tr2", id: "display_score_temp_v2", appendChildText: "undefined"},
                    {object: "td", parent_id : "cartouche_table_tr2", id: "display_vecteur_v2"},
                    {object: "a", parent_id : "display_vecteur_v2", id: "link_vecteur_v2", target: '_blank', appendChildText: "undefined"},
                    {object: "input", parent_id : "display_vecteur_v2", type:"text", id: "refCVE_vecteur_v2", class: "only_for_html_export inputTypeTextToHidden", placeholder:"CVE de référence pour ce vecteur", STYLE:greyedStyle, readonly:"readonly", size:"13", title:"La CVE qui correspond au score/vecteur", onclick:"window.open('https://cyberwatch.internet.np/cve_announcements/'+this.value)",tabindex:-1},
                    {object: "input", parent_id : "display_vecteur_v2", type:"text", id: "refCVE_vecteur_v2_source", class: "only_for_html_export inputTypeTextToHidden", placeholder:"origine du vecteur", title:"La source qui a fournit le vecteur",tabindex:1},
                    {object: "input", parent_id : "display_vecteur_v2", type:"text", id: "refCVE_v2_NVDpublishDate", class: "only_for_html_export inputTypeTextToHidden", STYLE:greyedStyle, readonly:"readonly", size:"8", title:"Date de publication sur le site NVD",tabindex:-1},
                    {object: "input", parent_id : "display_vecteur_v2", type:"text", id: "refCVE_v2_NVDmodifiedDate", class: "only_for_html_export inputTypeTextToHidden", STYLE:greyedStyle, readonly:"readonly", size:"8", title:"Date de mise à jour sur le site NVD",tabindex:-1},
                    {object: "input", parent_id : "display_vecteur_v2", type:"text", id: "refCVE_v2_NVDsource", class: "only_for_html_export inputTypeTextToHidden", STYLE:greyedStyle, readonly:"readonly", title:"L'éditeur responsable de la publication sur le site NVD",tabindex:-1},

                    {object: "tr", parent_id : "cartouche_table", id: "cartouche_table_tr3"},
                    {object: "td", parent_id : "cartouche_table_tr3", appendChildText: "v3.1"},
                    //{object: "td", parent_id : "cartouche_table_tr3", id: "cartouche_table_v3_pictogramme"},
                    //{object: "svg", parent_id: "cartouche_table_v3_pictogramme", width: "40", height: "40", id: "sous-titre-chart_v3", viewBox: "0 0 80 80"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "0", y: "60", width: "20", height: "20", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "20", y: "40", width: "20", height: "40", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "40", y: "20", width: "20", height: "60", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "60", y: "0", width: "20", height: "80", stroke: "black", fill: "white", strokewidth: "2", class: "chart_contour"},

                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "1", y: "67", width: "6", height: "12", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "21", y: "47", width: "6", height: "32", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "41", y: "27", width: "6", height: "52", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "61", y: "7", width: "6", height: "72", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_left"},

                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "7", y: "67", width: "6", height: "12", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "27", y: "47", width: "6", height: "32", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "47", y: "27", width: "6", height: "52", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "67", y: "7", width: "6", height: "72", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_center"},

                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "13", y: "67", width: "6", height: "12", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "33", y: "47", width: "6", height: "32", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "53", y: "27", width: "6", height: "52", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},
                    //{object: "rect", parent_id: "sous-titre-chart_v3", x: "73", y: "7", width: "6", height: "72", stroke: "black", fill: "black", strokewidth: "0", class: "chart_inside_right"},

                    //{object: "td", parent_id : "cartouche_table_tr3", id: "cartouche_table_v3_pictogramme_image_svg"},
                    //{object: "img", parent_id : "cartouche_table_v3_pictogramme_image_svg", id: "img_svg_v3", width: "40", height: "40"},
                    {object: "td", parent_id : "cartouche_table_tr3", id: "cartouche_table_v3_pictogramme_image_png"},
                    {object: "img", parent_id : "cartouche_table_v3_pictogramme_image_png", id: "img_png_v3", width: "40", height: "40"},
                    {object: "td", parent_id : "cartouche_table_tr3", id: "display_score_base_v3", appendChildText: "undefined"},
                    {object: "td", parent_id : "cartouche_table_tr3", id: "display_score_temp_v3", appendChildText: "undefined"},
                    {object: "td", parent_id : "cartouche_table_tr3", id: "display_vecteur_v3"},
                    {object: "a", parent_id : "display_vecteur_v3", id: "link_vecteur_v3", target: '_blank', appendChildText: "undefined"},
                    {object: "input", parent_id : "display_vecteur_v3", type:"text", id: "refCVE_vecteur_v3", class: "only_for_html_export inputTypeTextToHidden", placeholder:"CVE de référence pour ce vecteur", style:greyedStyle, readonly:"readonly", size:"13", title:"La CVE qui correspond au score/vecteur", onclick:"window.open('https://cyberwatch.internet.np/cve_announcements/'+this.value)",tabindex:-1},
                    {object: "input", parent_id : "display_vecteur_v3", type:"text", id: "refCVE_vecteur_v3_source", class: "only_for_html_export inputTypeTextToHidden", placeholder:"origine du vecteur", title:"La source qui a fournit le vecteur",tabindex:2},
                    {object: "input", parent_id : "display_vecteur_v3", type:"text", id: "refCVE_v3_NVDpublishDate", class: "only_for_html_export inputTypeTextToHidden", STYLE:greyedStyle, readonly:"readonly", size:"8", title:"Date de publication sur le site NVD",tabindex:-1},
                    {object: "input", parent_id : "display_vecteur_v3", type:"text", id: "refCVE_v3_NVDmodifiedDate", class: "only_for_html_export inputTypeTextToHidden", STYLE:greyedStyle, readonly:"readonly", size:"8", title:"Date de mise à jour sur le site NVD",tabindex:-1},
                    {object: "input", parent_id : "display_vecteur_v3", type:"text", id: "refCVE_v3_NVDsource", class: "only_for_html_export inputTypeTextToHidden", STYLE:greyedStyle, readonly:"readonly", title:"L'éditeur responsable de la publication sur le site NVD",tabindex:-1}
                ];



                if (item_before) {
                    make_html_from_list_of_dict(item_before, list_input);
                }

            }

            function make_div_Left_content(item_before, arrayOfCVEs = []){
                // variables graphiques
                var font_size = "20px" ;
                var bordeStyle = defaultTableBorder ;
                var indentation_td = '40px';
                var id, mapGetNVD, v3_Vector, v2_Vector, v3_BaseScore, v2_BaseScore, CW_url, CW_id;
                var commonStyle = "float: left; overflow: auto ;height:85vh; width:auto;";

                // suppression du footer
                //document.querySelector("footer").remove();
                document.querySelector("footer").style.display="none";

                var articleContent = document.getElementsByClassName('content')[0];
                articleContent.style = articleContent.style+";"+commonStyle

                // autres variables
                var list_input = [
                    {object : "div", id :'div_CVEs', class: "content", style : "font-size :"+font_size+";"+commonStyle},
                    {object: "table", parent_id : "div_CVEs", appendChildText: "Cliquer sur le score pour l'utiliser"},
                    {object: "table", parent_id : "div_CVEs", appendChildText: "En-tete rouge = travail en cours, vert = fini", id : "pProcessMessage"},
                    {object: "table", parent_id : "div_CVEs", id: "tableCVEs", border : bordeStyle},
                    {object: "input", type:"hidden", parent_id : "tableCVEs", id : "tableCVEs_sorting", value : "original"},
                    /*{object: "tr", parent_id : "tableCVEs", id: "tableCVEs_Tr_test"},
							{object: "td", parent_id : "tableCVEs_Tr_test", id: "tableCVEs_Td_test_CVE"},
								{object: "input", type:"text", parent_id : "tableCVEs_Td_test_CVE", id : "tableCVEs_Td_test_CVE_ipt"},
							{object: "td", parent_id : "tableCVEs_Tr_test", id: "tableCVEs_Td_test_v2"},
								{object: "p", parent_id : ("tableCVEs_Td_test_v2"), id : ("tableCVEs_Td_test_v2_score")},
								{object: "input", type:"hidden", parent_id : ("tableCVEs_Td_test_v2"), id : ("tableCVEs_Td_test_v2_vector")},
							{object: "td", parent_id : "tableCVEs_Tr_test", id: "tableCVEs_Td_test_v3"},
								{object: "p", parent_id : ("tableCVEs_Td_test_v3"), id : ("tableCVEs_Td_test_v3_score")},
								{object: "input", type:"hidden", parent_id : ("tableCVEs_Td_test_v3"), id : ("tableCVEs_Td_test_v3_vector")},*/
                    {object: "tr", parent_id : "tableCVEs", id: "tableCVEs_THs", style : "color:red;"},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "CVE", id : 'tableCVEs_THs_CVE'},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "from", id : 'tableCVEs_THs_Editeur'},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "v2", id : 'tableCVEs_THs_v2'},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "v3", id : 'tableCVEs_THs_v3'},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "v3 CNA", id : 'tableCVEs_THs_v3_CNA'},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "v4", id : 'tableCVEs_THs_v4'},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "v4 CNA", id : 'tableCVEs_THs_v4_CNA'},
                    {object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "Liens", colspan:3}
                    //{object: "th", parent_id : "tableCVEs_THs", style :"padding-right:10px", appendChildText: "vuldb"}
                ];

                for(var i=0;i<arrayOfCVEs.length;i++){
                    id = arrayOfCVEs[i];

                    // récupération des valeurs NVD
                    list_input.push({object: "tr", parent_id : "tableCVEs", id: "tableCVEs_Tr_"+id});
                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_CVE", appendChildText: id, style : "color:red;", originalOrder : i});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_CVE"), id : ("tableCVEs_Td_"+id+"_NVDpublishDate")});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_CVE"), id : ("tableCVEs_Td_"+id+"_NVDmodifiedDate")});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_CVE"), id : ("tableCVEs_Td_"+id+"_NVDsource")});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_Editeur", originalOrder : i});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_v2", originalOrder : i});
                    list_input.push({object: "p", parent_id : ("tableCVEs_Td_"+id+"_v2"), id : ("tableCVEs_Td_"+id+"_v2_score")});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_v2"), id : ("tableCVEs_Td_"+id+"_v2_vector")});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_v3", originalOrder : i});
                    list_input.push({object: "p", parent_id : ("tableCVEs_Td_"+id+"_v3"), id : ("tableCVEs_Td_"+id+"_v3_score")});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_v3"), id : ("tableCVEs_Td_"+id+"_v3_vector")});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_v3_CNA", originalOrder : i});
                    list_input.push({object: "p", parent_id : ("tableCVEs_Td_"+id+"_v3_CNA"), id : ("tableCVEs_Td_"+id+"_v3_CNA_score")});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_v3_CNA"), id : ("tableCVEs_Td_"+id+"_v3_CNA_vector")});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_v4", originalOrder : i});
                    list_input.push({object: "p", parent_id : ("tableCVEs_Td_"+id+"_v4"), id : ("tableCVEs_Td_"+id+"_v4_score")});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_v4"), id : ("tableCVEs_Td_"+id+"_v4_vector")});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_v4_CNA", originalOrder : i});
                    list_input.push({object: "p", parent_id : ("tableCVEs_Td_"+id+"_v4_CNA"), id : ("tableCVEs_Td_"+id+"_v4_CNA_score")});
                    list_input.push({object: "input", type:"hidden", parent_id : ("tableCVEs_Td_"+id+"_v4_CNA"), id : ("tableCVEs_Td_"+id+"_v4_CNA_vector")});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_nvd"});
                    list_input.push({object: "a", parent_id : ("tableCVEs_Td_"+id+"_nvd"), href : 'https://nvd.nist.gov/vuln/detail/'+id, target: "_blank", appendChildText : "NVD"});

                    //list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_vuldb"});
                    //list_input.push({object: "a", parent_id :  "tableCVEs_Td_"+id+"_vuldb", click : "$('#search_vuldb_'+id).submit();", appendChildText : "vuldb"});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_google"});
                    list_input.push({object: "a", parent_id :  "tableCVEs_Td_"+id+"_google", href : 'https://www.google.com/search?q=%22'+id+'%22+cvss', target: "_blank", appendChildText : "google"});

                    list_input.push({object: "td", parent_id : "tableCVEs_Tr_"+id, id: "tableCVEs_Td_"+id+"_CW"});
                    CW_url = 'https://cyberwatch.internet.np/cve_announcements/'+id;
                    CW_id = "tableCVEs_Td_"+id+"_CW";
                    list_input.push({object: "a", parent_id : CW_id , href : CW_url, target: "_blank", appendChildText : "CW"});
                    colorURLavailability(CW_url, CW_id);
                }

                if (item_before) {
                    make_html_from_list_of_dict(item_before, list_input);
                }

            }

            function set_visibility_class(classe,visibility){
                const items = document.querySelectorAll(classe);

                items.forEach(item => {
                    item.style.display = visibility;
                });
            }

            function get_article_to_string(){
                set_visibility_class(".avoid_from_selection","none");
                set_visibility_class(".only_for_html_export","none");
                set_visibility_class(".avoid_from_selection_but_for_html_export","none");
                $('.article').selectText();
                var text_article = "";
                if (window.getSelection) {
                    text_article = window.getSelection().toString();
                } else if (document.selection && document.selection.type != "Control") {
                    text_article = document.selection.createRange().text;
                }

                set_visibility_class(".avoid_from_selection_but_for_html_export","block");
                set_visibility_class(".avoid_from_selection","block");
                set_visibility_class(".only_for_html_export","block");
                document.getSelection().removeAllRanges(); // supprime les selections
                return text_article;
            }

            function get_text_and_child_from_innerHTML(innerHTML,children,indent=0) {
                // découpe du texte entre le texte dans des balise et le reste
                var regex_balise_html_complete = "<.*?>";
                var regex_balise_html_type="(?<=<)(.*?)(?=[ >])",balise_html_type="";
                var resultat_regex;
                var texte_avant_balise="";
                var output="";

                var balise_begin=0,balise_end=0;
                // parcours pour chaque enfant, rechercher le texte avant
                for(var i=0;i<children.length;i++){
                    balise_html_type = children[i].nodeName.toLowerCase();
                    regex_balise_html_complete="<"+balise_html_type+".*?>";

                    //console.log("découpe de "+innerHTML);
                    resultat_regex = innerHTML.match(regex_balise_html_complete);
                    //console.log(i+"/"+children.length+" : "+balise_html_type+"\n=>");
                    //console.log(children);
                    //console.log(resultat_regex);
                    // get position start de la balise
                    balise_begin=resultat_regex.index;
                    // texte avant balise = substrin(balise_end,balise_begin)
                    //texte_avant_balise = get_indent(indent)+innerHTML.substring(0,balise_begin);  // test de correction de placement de texte interne une balise
                    texte_avant_balise = innerHTML.substring(0,balise_begin);
                    // néttoyage si le avant balise est rempli de vide
                    if(/^\s*$/.test(texte_avant_balise)) { texte_avant_balise = "";}
                    // get position fin de la balise
                    balise_end= resultat_regex.index+resultat_regex[0].length+children[i].innerHTML.length; // avant une fermeture de balise eventuelle
                    //console.log("fin de balise avant fermante : "+balise_end);
                    innerHTML=innerHTML.substring(balise_end);// avant une fermeture de balise eventuelle
                    // rechercher une balise fermante
                    regex_balise_html_complete="</"+balise_html_type+">";
                    resultat_regex = innerHTML.match(regex_balise_html_complete);
                    //console.log("recherche "+regex_balise_html_complete+" dans \n"+innerHTML);
                    //console.log(resultat_regex);
                    if(resultat_regex){
                        balise_end=resultat_regex.index+resultat_regex[0].length;
                        //console.log("a trouver balise fermante: "+resultat_regex.index+" fin de la balise avant fermante : "+balise_end+" ; taille de la balise fermante : "+resultat_regex[0].length+" ==== > "+balise_end);
                        // reste du texte apres la balise fermante
                        innerHTML=innerHTML.substring(balise_end);
                    }
                    //console.log("texte avant balise : "+texte_avant_balise);
                    //console.log("texte apres balise fermante eventuelle : \n"+innerHTML);
                    output += texte_avant_balise;

                    output += recursive_get_html(children[i],(indent+1));
                }
                // pour le dernier enfant rechercher le texte après

                output+=innerHTML;
                return output;
            }

            function dom_object_attributes_to_string(obj,array_attrib_to_exclude=[]){
                var str_obj="", attribut,attribut_name;
                // Get object of all {name: value}
                const attrs_names = obj.getAttributeNames();
                for(var i=0;i<attrs_names.length;i++){
                    attribut_name = attrs_names[i];
                    //console.log("attrib: "+attribut_name+" ; val : "+obj.getAttribute(attribut_name));
                    if(array_attrib_to_exclude.includes(attribut_name)){
                        // attribut a eviter, on passe à la suite
                        continue ;
                    }
                    attribut = obj.getAttribute(attribut_name);
                    if(Array.isArray(attribut)) {
                        str_obj =str_obj + " "+attrs_names[i]+'="';
                        for(var j=0;j<attribut.length;j++){
                            str_obj =str_obj +attribut[j]+" "
                        }
                        str_obj +='" ';
                    }else{
                        str_obj =str_obj + " "+attribut_name+'="'+attribut+'" ';
                    }
                }

                // vérification des propriétés qui ne sont pas des attributs
                if(obj.value && !(str_obj.includes("value="))){
                    // remplace des guillements eventuels par des double single quote
                    obj.value = (obj.value).replaceAll('"',"''")
                    // remplace chevrons par "155	233	9B	10011011	›	&#155;	&rsaquo;	Single right-pointing angle quotation mark"
                    obj.value = (obj.value).replaceAll('>',"›")
                    // remplace chevrons par "139	213	8B	10001011	‹	&#139;	&lsaquo;	Single left-pointing angle quotation"
                    obj.value = (obj.value).replaceAll('<',"‹")
                    str_obj =str_obj + ' value="'+(obj.value)+'"';
                }

                return str_obj;
            }

            function recursive_get_html(dom_object,indent=0) {
                var a_exclure=false;
                var output="";
                var object_type = dom_object.nodeName.toLowerCase();
                var tag_begin="";
                var tag_end = "";
                var indent_text = get_indent(indent);

                var temp_value, has_changed;//utilisé pour une alteration le temps de la recuperation du code

                var array_attrib_to_exclude=['class','style', 'onclick', 'placeholder'];//
                switch(object_type) {
                    case 'area':
                    case 'base':
                    case 'br':
                    case 'col':
                    case 'command':
                    case 'embed':
                    case 'hr':
                    case 'keygen':
                    case 'link':
                    case 'meta':
                    case 'param':
                    case 'source':
                    case 'track':
                    case 'wbr':
                        tag_begin = indent_text+"<"+object_type+" />\n";
                        tag_end="";
                        break;
                    case "input":
                        if(dom_object.classList.contains("inputTypeTextToHidden")){
                            //console.log(dom_object.id+" : "+dom_object.value);
                            tag_begin = indent_text+"<"+object_type+" "+ ((dom_object_attributes_to_string(dom_object, array_attrib_to_exclude)).replace('type="text"','type="hidden"'))+" />\n";
                        }else{
                            tag_begin = indent_text+"<"+object_type+" "+ dom_object_attributes_to_string(dom_object, array_attrib_to_exclude)+" />\n";
                        }
                        tag_end="";
                        break;
                    case "img":
                        // modification des sources d'images
                        has_changed = false;
                        if(dom_object.getAttribute("id") === "img_png_v2" || dom_object.getAttribute("id") === "img_png_v3") {
                            temp_value = dom_object.getAttribute("src");
                            dom_object.setAttribute("src", dom_object.getAttribute("src_portail"));
                            has_changed = true;
                        }
                        tag_begin = indent_text+"<"+object_type+" "+dom_object_attributes_to_string(dom_object)+" />\n";
                        tag_end="";
                        if(has_changed) {dom_object.setAttribute("src" ,temp_value);}
                        break;
                    case "a" :
                        // modification des liens pour le portail
                        has_changed = false;
                        if(dom_object.getAttribute("id") === "link_vecteur_v2"){
                            temp_value = dom_object.getAttribute("href");
                            //dom_object.setAttribute("href", "https://portail-calid.intradef.gouv.fr/index.php/publications/vulnerabilites/calculateur_cvss_v2");
                            has_changed = true;

                        }else if(dom_object.getAttribute("id") === "link_vecteur_v3") {
                            temp_value = dom_object.getAttribute("href");
                            //dom_object.setAttribute("href", "https://portail-calid.intradef.gouv.fr/index.php/publications/vulnerabilites/calculateur_cvss_v3");
                            has_changed = true;
                        }
                        tag_begin = indent_text+"<"+object_type+" "+dom_object_attributes_to_string(dom_object,array_attrib_to_exclude)+">";
                        tag_end="</"+object_type+">\n";
                        //if(has_changed) {dom_object.setAttribute("href" ,temp_value);}
                        break;
                    case "svg":
                        tag_begin = indent_text+"<"+object_type+" "+dom_object_attributes_to_string(dom_object,array_attrib_to_exclude)+">";
                        tag_end="</"+object_type+">\n";
                        break;
                    case "rect":
                        tag_begin = indent_text+"<"+object_type+" "+dom_object_attributes_to_string(dom_object,array_attrib_to_exclude)+"/>\n";
                        break;
                    case 'h1' : //passer les h1 en h3
                    case 'h2' : //passer les h2 en h3
                        object_type = 'h3';
                        // repris de default
                        tag_begin = indent_text+"<"+object_type+">";
                        tag_end="</"+object_type+">\n";
                        // avertissement si pas de break avant default
                        break;
                    case "td": // ajouter un espace apres les td
                    case 'table' : // conserver le style
                        // repris de default
                        tag_begin = indent_text+"<"+object_type+" "+dom_object_attributes_to_string(dom_object,['class'])+">";
                        tag_end="</"+object_type+">\n";//<td>&nbsp;</td>
                        // avertissement si pas de break avant default
                        break;
                    case "p": // correction du P des références CVE en le remplacant par un BR a la fin
                        // par defaut si pas trouvé l'id des LI
                        tag_begin = indent_text+"<"+object_type+">";
                        tag_end="</"+object_type+">\n";
                        if(dom_object.id) {
                            if((dom_object.id).includes("li_CVE_")) {
                                // il s'agit de li modifiées pour ajouté un ID
                                tag_begin = indent_text;
                                tag_end = "<br>";
                            }
                        }
                        break;
                    default:
                        tag_begin = indent_text+"<"+object_type+">";
                        tag_end="</"+object_type+">\n";
                }
                if(object_type=="li") {
                    //console.log(dom_object);
                }
                // objet a exclure via leur classe
                for (var ne_doit_pas_avoir of ['avoid_from_selection','meta-logo','meta-certfr','meta-affaire','meta-pub-date', 'row-toolbox']){ // ,''
                    a_exclure = a_exclure || dom_object.classList.contains(ne_doit_pas_avoir)
                }
                if(a_exclure){
                    //console.log("on exclut",dom_object)
                    // on ne prend pas la section de bas de page
                    // output devrait etre à  "";
                } else if (dom_object.classList.contains("post-type-title")){ // remlplacer le titre H2 par un titre H1
                    output += indent_text+"<h1>"+dom_object.innerText+"</h1>";
                }else if(dom_object.children.length>0) {
                    // enfant, on descend dans l'arborescence html
                    output += tag_begin;
                    output += "\n";
                    //output +=
                    output += get_text_and_child_from_innerHTML(dom_object.innerHTML,dom_object.children,(indent+1));
                    output += indent_text;
                    output += tag_end;
                }else{
                    //console.log(dom_object);
                    //console.log(dom_object.innerText);
                    // pas d'enfants, on recupere le innerText
                    output += tag_begin;
                    output += dom_object.innerText;
                    output += tag_end;
                    //console.log(output);
                }
                return output;
            }

            function get_article_to_html(){
                try{ // paliatif exclure div_input
                    document.getElementById("div_input").classList.add("avoid_from_selection")
                }catch{
                } // # DEBUG
                try{ // paliatif exclure div_top_section
                    document.getElementById("div_top_section").classList.add("avoid_from_selection")
                }catch{
                } // # DEBUG
                set_visibility_class(".avoid_from_selection","none");
                set_visibility_class(".only_for_html_export","block");
                set_visibility_class(".avoid_from_selection_but_for_html_export","block");
                var regexCVE = /^CVE-[0-9]{4}-([0-9]*)$/gi ;

                document.getElementById("link_vecteur_v2").href = "#" //"/index.php/publications/vulnerabilites/14645-description-et-application-cvss";
                document.getElementById("link_vecteur_v3").href = "#" //"/index.php/publications/vulnerabilites/14645-description-et-application-cvss";

                if(regexCVE.test(document.getElementById("refCVE_vecteur_v2").value)){
                    document.getElementById("link_vecteur_v2").href = "https://calid-cyberwatch-veille.intradef.gouv.fr/cve_announcements/"+(document.getElementById("refCVE_vecteur_v2").value).toUpperCase();
                }
                regexCVE = /^CVE-[0-9]{4}-([0-9]*)$/gi ; // repete car bug sinon ????
                if(regexCVE.test(document.getElementById("refCVE_vecteur_v3").value)){
                    document.getElementById("link_vecteur_v3").href = "https://calid-cyberwatch-veille.intradef.gouv.fr/cve_announcements/"+(document.getElementById("refCVE_vecteur_v3").value).toUpperCase();
                }


                var article = document.querySelector('article');
                var code_article = "<!DOCTYPE html>\n" + recursive_get_html(article);

                //console.log(article);
                //console.log(code_article);


                //set_visibility_class(".only_for_html_export","block");
                set_visibility_class(".avoid_from_selection","block");
                return code_article;
            }

            function stockageToFieldsV2(referenceANSSI = document.title){
                if(GM_getValue(referenceANSSI+".vecteurV2")) {
                    document.getElementById('lock_v2').checked = false;
                    update_options(GM_getValue(referenceANSSI+".vecteurV2"));
                    // lock v2
                    document.getElementById('lock_v2').checked = true;
                }
                if(GM_getValue(referenceANSSI+".CVEv2")) {document.getElementById("refCVE_vecteur_v2").value = GM_getValue(referenceANSSI+".CVEv2");}
                if(GM_getValue(referenceANSSI+".vecteurV2Source")) {document.getElementById("refCVE_vecteur_v2_source").value = GM_getValue(referenceANSSI+".vecteurV2Source");}
                if(GM_getValue(referenceANSSI+".refCVE_v2_NVDpublishDate")) {document.getElementById("refCVE_v2_NVDpublishDate").value = GM_getValue(referenceANSSI+".refCVE_v2_NVDpublishDate");}
                if(GM_getValue(referenceANSSI+".refCVE_v2_NVDmodifiedDate")) {document.getElementById("refCVE_v2_NVDmodifiedDate").value = GM_getValue(referenceANSSI+".refCVE_v2_NVDmodifiedDate");}
                if(GM_getValue(referenceANSSI+".refCVE_v2_NVDsource")) {document.getElementById("refCVE_v2_NVDsource").value = GM_getValue(referenceANSSI+".refCVE_v2_NVDsource");}
            }
            function stockageToFieldsV3(referenceANSSI = document.title){
                if(GM_getValue(referenceANSSI+".vecteurV3")) {
                    document.getElementById('lock_v3').checked = false;
                    update_options(GM_getValue(referenceANSSI+".vecteurV3"));
                }
                if(GM_getValue(referenceANSSI+".vecteurV2") || GM_getValue(referenceANSSI+".vecteurV3")) {
                    // unlock
                    //document.getElementById('lock_v2').checked = false;
                    //document.getElementById('lock_v3').checked = false;

                }
                if(GM_getValue(referenceANSSI+".CVEv3")) {document.getElementById("refCVE_vecteur_v3").value = GM_getValue(referenceANSSI+".CVEv3");}
                if(GM_getValue(referenceANSSI+".vecteurV3Source")) {document.getElementById("refCVE_vecteur_v3_source").value = GM_getValue(referenceANSSI+".vecteurV3Source");}
                if(GM_getValue(referenceANSSI+".refCVE_v3_NVDpublishDate")) {document.getElementById("refCVE_v3_NVDpublishDate").value = GM_getValue(referenceANSSI+".refCVE_v3_NVDpublishDate");}
                if(GM_getValue(referenceANSSI+".refCVE_v3_NVDmodifiedDate")) {document.getElementById("refCVE_v3_NVDmodifiedDate").value = GM_getValue(referenceANSSI+".refCVE_v3_NVDmodifiedDate");}
                if(GM_getValue(referenceANSSI+".refCVE_v3_NVDsource")) {document.getElementById("refCVE_v3_NVDsource").value = GM_getValue(referenceANSSI+".refCVE_v3_NVDsource");}
            }

            function stockageToFields(){
                stockageToFieldsV2();
                stockageToFieldsV3();
            }

            function fieldsToStockage(){
                var referenceANSSI = document.title;
                var titreText = $("h1").text();
                titreText = titreText.substr(titreText.indexOf(" ") + 1);

                //console.log("fieldsToStockage : CVE "+document.getElementById("refCVE_vecteur_v2").value);
                //console.log(document.getElementById("refCVE_vecteur_v2"));

                GM_setValue(referenceANSSI+".titre",titreText);
                GM_setValue(referenceANSSI+".vecteurV2",document.getElementById("link_vecteur_v2").innerText);
                GM_setValue(referenceANSSI+".scoreV2",document.getElementById("display_score_base_v2").innerText);
                GM_setValue(referenceANSSI+".vecteurV3",document.getElementById("link_vecteur_v3").innerText);
                GM_setValue(referenceANSSI+".scoreV3",document.getElementById("display_score_base_v3").innerText);
                GM_setValue(referenceANSSI+".CVEv2",document.getElementById("refCVE_vecteur_v2").value);
                GM_setValue(referenceANSSI+".CVEv3",document.getElementById("refCVE_vecteur_v3").value);
                GM_setValue(referenceANSSI+".vecteurV2Source",document.getElementById("refCVE_vecteur_v2_source").value);
                GM_setValue(referenceANSSI+".vecteurV3Source",document.getElementById("refCVE_vecteur_v3_source").value);

                GM_setValue(referenceANSSI+".refCVE_v2_NVDpublishDate",document.getElementById("refCVE_v2_NVDpublishDate").value);
                GM_setValue(referenceANSSI+".refCVE_v2_NVDmodifiedDate",document.getElementById("refCVE_v2_NVDmodifiedDate").value);
                GM_setValue(referenceANSSI+".refCVE_v2_NVDsource",document.getElementById("refCVE_v2_NVDsource").value);
                GM_setValue(referenceANSSI+".refCVE_v3_NVDpublishDate",document.getElementById("refCVE_v3_NVDpublishDate").value);
                GM_setValue(referenceANSSI+".refCVE_v3_NVDmodifiedDate",document.getElementById("refCVE_v3_NVDmodifiedDate").value);
                GM_setValue(referenceANSSI+".refCVE_v3_NVDsource",document.getElementById("refCVE_v3_NVDsource").value);
            }

            // fonction qui anime un message, retourne un interval ID
            function waitingAnimation(messageId, message="Work in Progress ", debug=false){
                if(debug){
                    console.log("waitingAnimation : creation de l'interval");
                }
                add_log_to_CMB("[waitingAnimation] creation de l'interval");
                var compteur=0; // utilisation en dehors de la fonction ashynchrone
                var compteurMax=3;
                var returnedInterval = setInterval(function intervalAnimation(messageId, message, compteurMax){
                    for(var i=0;i<compteur;i++){
                        message = message + ". ";
                    }
                    document.getElementById(messageId).innerText = message;
                    //console.log("ecriture DAYDAY");
                    compteur+=1;
                    if(compteur>compteurMax){compteur=0;}
                }, 250, messageId, message, compteurMax);
                if(debug){
                    console.log("retour de l'interval "+returnedInterval);
                }
                add_log_to_CMB("[waitingAnimation] retour de l'interval "+returnedInterval);
                return returnedInterval

            }

            // FONCTIONS\graphique + alteration de page />
            // < FONCTIONS\Click
            // < FONCTION\Click\get TXT
            $(document).delegate("#txt_gen","click",function(){
                var text_article = get_article_to_string();
                // remplacer cyberwatch np par cyberwatch dr
                //text_article = text_article.replaceAll("cyberwatch.internet.np","calid-cyberwatch-veille.intradef.gouv.fr");
                text_article = text_article.replace(/cyberwatch\.internet\.np/g,"calid-cyberwatch-veille.intradef.gouv.fr");

                text_article=text_article+"\n\nversion du script d'export utilisée : "+scriptVersion;
                text_article=text_article+"\nVecteur cvss V2 ("+document.getElementById("display_score_base_v2").innerText+") CVE : "+document.getElementById("refCVE_vecteur_v2").value+" from source : "+document.getElementById("refCVE_vecteur_v2_source").value+"\n";
                text_article+=document.getElementById("link_vecteur_v2").innerText; // ajout du cartouche input

                var lines = text_article.split('\n');
                lines.splice(1,1);
                var output = lines.join('\n');

                var title = $("h1").text();
                title = title.substr(title.indexOf(" ") + 1);
                var filename = '['+document.title+'] - '+title+'.txt';

                var a = window.document.createElement('a');
                a.href = window.URL.createObjectURL(new Blob([output], {type: 'text/plain'}));
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                fieldsToStockage();
            });
            // FONCTION\Click\get TXT />


            // < FONCTION\Click\get HTML
            $(document).delegate("#html_gen","click",async function(){
                //location.href = "javascript:void(update_cartouche_input());";// mise à jour de l'input box (pour eviter le cas d'un collage de code v3 avec l'attribut authentification déja changé
                var text_article = get_article_to_html();
                // remplacer cyberwatch np par cyberwatch dr
                //text_article = text_article.replaceAll("cyberwatch.internet.np","calid-cyberwatch-veille.intradef.gouv.fr");
                text_article = text_article.replace(/cyberwatch\.internet\.np/g,"calid-cyberwatch-veille.intradef.gouv.fr");

                var lines = text_article.split('\n');
                lines.splice(1,1);
                var output = lines.join('\n');

                var title = $("h1").text();
                title = title.substr(title.indexOf(" ") + 1);
                var filename = '['+document.title+'] - '+title+'.html';

                var a = window.document.createElement('a');
                a.href = window.URL.createObjectURL(new Blob([output], {type: 'text/plain'}));
                a.download = filename;
                document.body.appendChild(a);
                // mise à jour du stockage
                if(allowToStore()){
                    // mise à jour du local
                        fieldsToStockage();

                    // récupération du titre du fichier distant (combinaison des AVI et ALE les plus elevés
                        var newTitle = makeNewTitle();//title pasteBin
                        if(!newTitle){alert("erreur au niveau de makeNewTitle(); téléchargement impossible");return false;}


                    // Mise à jour du distant
                        var content = "";
                        content = extractGMstorage();
                        var fonctionErrPost = function(err, post){
                            if(err) {
                                console.log("err:"+err);
                                add_log_to_CMB("[MAIN] download HTML : erreur d'ajout sur le Git")
                            } else {
                                console.log("post:"+post);
                                add_log_to_CMB("[MAIN] download HTML : Reussite d'ajout sur le Git")
                            }
                        }
                        try{
                            await setGitStorageContent(newTitle, content,fonctionErrPost);
                        }catch (error){
                            console.log("[download] ERROR update storage :"+error.message);
                            add_log_to_CMB("[download] ERROR update storage :"+error.message);
                        }
                }
                // téléchargement.
                a.click();
                document.body.removeChild(a);

            });
            // FONCTION\Click\get HTML />
            // < FONCTIONS\Selection de text
            jQuery.fn.selectText = function(){
                var doc = document
                , element = this[0]
                , range, selection
                ;
                if (doc.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(element);
                    range.select();
                } else if (window.getSelection) {
                    selection = window.getSelection();
                    range = document.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            };
            // FONCTIONS\Selection de text />
        //}
        //if("FONCTIONS TABLEAU CVE"){
            // FONCTION\Click\set Sorting table>
            ///// https://www.guru99.com/quicksort-in-javascript.html
            // first call to quick sort
            // var sortedArray = quickSort(items, 0, items.length - 1);
            function swap(items, leftIndex, rightIndex){
                var temp = items[leftIndex];
                items[leftIndex] = items[rightIndex];
                items[rightIndex] = temp;
            }
            function partition(items, left, right) {
                var pivot   = items[Math.floor((right + left) / 2)], //middle element
                    i       = left, //left pointer
                    j       = right; //right pointer
                while (i <= j) {
                    while (items[i] < pivot) {
                        i++;
                    }
                    while (items[j] > pivot) {
                        j--;
                    }
                    if (i <= j) {
                        swap(items, i, j); //sawpping two elements
                        i++;
                        j--;
                    }
                }
                return i;
            }

            function quickSort(items, left, right) {
                var index;
                if (items.length > 1) {
                    index = partition(items, left, right); //index returned from partition
                    if (left < index - 1) { //more elements on the left side of the pivot
                        quickSort(items, left, index - 1);
                    }
                    if (index < right) { //more elements on the right side of the pivot
                        quickSort(items, index, right);
                    }
                }
                return items;
            }
            /////// FIN  https://www.guru99.com/quicksort-in-javascript.html

            function sortTable(tableID, columnToSort=0 ,ascending=true, compareType="string", originalOrderAttributeName="",verbose=true) {// compareType="string" / "float" / "int"
                var table, rows, switching, i, x, y, shouldSwitch;
                var xToCompare, yToCompare;
                table = document.getElementById(tableID);
                switching = true;
                /*Make a loop that will continue until no switching has been done:*/
                while (switching) {
                    //start by saying: no switching is done:
                    switching = false;
                    rows = table.rows;
                    /*Loop through all table rows (except the first, which contains table headers):*/
                    for (i = 1; i < (rows.length - 1); i++) {
                        //start by saying there should be no switching:
                        shouldSwitch = false;
                        /*Get the two elements you want to compare, one from current row and one from the next:*/
                        x = rows[i].getElementsByTagName("TD")[columnToSort];
                        y = rows[i + 1].getElementsByTagName("TD")[columnToSort];
                        //check if the two rows should switch place:
                        if(originalOrderAttributeName == "") {
                            xToCompare = x.innerText.toLowerCase();
                            yToCompare = y.innerText.toLowerCase();
                        }else{
                            xToCompare = x.getAttribute(originalOrderAttributeName).toLowerCase();
                            yToCompare = y.getAttribute(originalOrderAttributeName).toLowerCase();
                        }
                        if(verbose){console.log("sortTable (str): "+xToCompare+(ascending ?">":"<")+" "+yToCompare);}

                        switch(compareType){
                            case "string":
                                break;
                            case "float":
                                xToCompare = parseFloat(xToCompare);
                                if(isNaN(xToCompare)){xToCompare=-1;}
                                yToCompare = parseFloat(yToCompare);
                                if(isNaN(yToCompare)){yToCompare=-1;}
                                break;
                            case "int":
                                xToCompare = parseInt(xToCompare);
                                if(isNaN(xToCompare)){xToCompare=-1;}
                                yToCompare = parseInt(yToCompare);
                                if(isNaN(yToCompare)){yToCompare=-1;}
                                break;
                        }
                        if(verbose){console.log("sortTable ("+compareType+"): "+xToCompare+(ascending ?">":"<")+" "+yToCompare);}

                        if ( ( ascending ? (xToCompare > yToCompare) : (xToCompare < yToCompare) ) ) {
                            if(verbose){console.log(true);}
                            //if so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        /*If a switch has been marked, make the switch and mark that a switch has been done:*/
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                return true;
            }

            function getHeaderIDfromIndexTableCVE(index){ // lié a getCompareTypeFromIndexTableCVE
                var listOfSortableHeaderID = ['tableCVEs_THs_CVE', "tableCVEs_THs_Editeur", "tableCVEs_THs_v2", "tableCVEs_THs_v3", "tableCVEs_THs_v3_CNA"];
                if(index<0 || index >= listOfSortableHeaderID.length){index=0}
                return listOfSortableHeaderID[index];
            }
            function getCompareTypeFromIndexTableCVE(index){ // lié a getHeaderIDfromIndexTableCVE
                var listOfCompareType = ['string', 'string', "float", "float", "float"];
                if(index<0 || index >= listOfCompareType.length){index=0}
                return listOfCompareType[index];
            }
            function makeSortingClick(clickableID, sortingStateID, tableID, origianlValueAttributeName, otherSortableHeaderToClean, columnToSort){
                // Ajout de l'action de tri en cliquant sur l'entete CVE
                $(document).delegate("#"+clickableID,"click",function(){
                    var debug=false;
                    // animation d'attente pendant le tri
                    var oldStyle = document.getElementById("tableCVEs_THs").style.color;
                    var oldMessage = document.getElementById("pProcessMessage").innerText;
                    document.getElementById("tableCVEs_THs").style.color = "orange";
                    document.getElementById("pProcessMessage").innerText = "";
                    //console.log("l'ancien message etait "+oldMessage);
                    var intervalAnimation = waitingAnimation("pProcessMessage", "tri en cours ");
                    var lstSortingValue=["original","ascending","descending"];
                    var actualSorting = document.getElementById(sortingStateID).value;

                    var ascending = true;
                    var originalOrderAttributeName="";
                    var compareType=getCompareTypeFromIndexTableCVE(columnToSort)

                    var nextSortingIndex = (lstSortingValue.indexOf(actualSorting)+1)%lstSortingValue.length; // donne le reste de la division par 3 (la longueur de la liste) de 1 + l'actuelle tri
                    if(debug){console.log("trie du tableau de "+(document.getElementById(sortingStateID).value)+" a "+lstSortingValue[nextSortingIndex]);}
                    document.getElementById(sortingStateID).value = lstSortingValue[nextSortingIndex];


                    var reg = /\[.*\]/
                    var oldText = document.getElementById(clickableID).innerText;
                    if(debug){console.log("index de lstSortingValue="+nextSortingIndex);}
                    switch(lstSortingValue[nextSortingIndex]){
                        case "original":
                            originalOrderAttributeName = origianlValueAttributeName;
                            document.getElementById(clickableID).innerText = oldText.replace(reg, "") + "";
                            compareType = "int";
                            break;
                        case "ascending":
                            document.getElementById(clickableID).innerText = oldText.replace(reg, "") + "[\u25B2]";
                            break;
                        case "descending":
                            document.getElementById(clickableID).innerText = oldText.replace(reg, "") + "[\u25BC]";
                            ascending=false;
                            break;
                    }
                    for(var i=0;i<otherSortableHeaderToClean.length;i++){
                        if(otherSortableHeaderToClean[i] == clickableID){continue;}
                        oldText = document.getElementById(otherSortableHeaderToClean[i]).innerText;
                        document.getElementById(otherSortableHeaderToClean[i]).innerText = oldText.replace(reg, "");
                    }
                    if(debug){console.log("to sort : "+tableID+"["+columnToSort+"] asc?"+ascending+" type :"+compareType+", ori:"+originalOrderAttributeName);}
                    var hasSorted = sortTable(tableID, columnToSort,ascending,compareType, originalOrderAttributeName,debug);

                    // fin de l'animation
                    if(debug){console.log("fin animation");}
                    add_log_to_CMB("[makeSortingClick] fin animation", 0);
                    clearInterval(intervalAnimation);
                    document.getElementById("pProcessMessage").innerText = oldMessage;
                    document.getElementById("tableCVEs_THs").style.color = oldStyle;

                });
            }

            // FONCTION\Click\set Sorting table />
        //}

        // FONCTIONS\Divers
        // FONCTIONS\Divers />
        // FONCTIONS />
    //}
    // < MAIN
    async function main(){
        // Initialisation
        //make_download_txt(); // crée le bouton de téléchargement au format txt
        var btn_id = make_download_html(); // crée le bouton de téléchargement au format html
        let className_itemBefore_top_section = "meta-post-type"
        let itemBefore_top_section = getLastItemOfClass(className_itemBefore_top_section, debug);
        if(itemBefore_top_section==null){
            itemBefore_top_section=document.body.firstChild; // au lieu de document.getElementById(btn_id)
        }
        make_top_section(itemBefore_top_section);


        // Mise à jour du stockage
        try{
            var voidvarStorage = await updateStorage();
        }catch (error){
            console.log("[MAIN] ERROR update storage :"+error.message);
            add_log_to_CMB("[MAIN] ERROR update storage :"+error.message);
        }

        let lastItemToolBox = getLastItemInTheToolBox();
        let DOM_toolbox=getParent(getParent(lastItemToolBox)); // <div toolbox><conteneur lastItemToolBox><lastItemToolBox>
        make_input_cartouche_out(DOM_toolbox);
        document.getElementById('lock_v2').addEventListener('change', computeCVSS,false);
        document.getElementById('lock_v3').addEventListener('change', computeCVSS,false);
        document.getElementById('v2boxFromGMstorage').addEventListener('change', updateCartoucheFromStorageOrAutoNVD,false);
        document.getElementById('v3boxFromGMstorage').addEventListener('change', updateCartoucheFromStorageOrAutoNVD,false);
        add_functions_onchange();
        make_display_cartouche_out(document.getElementsByClassName("meta-title")[0]);
        add_functions_onclick();

        stockageToFields();
        computeCVSS();


        // récupération des CVE
        var CWEs = [];
        var CVEs=[] ; //"CVE-2022-40684"];

        // Correction éventuelle des erreurs, très ponctuelle
        // var regex_CVE = /((CVE)\-([0-9]{4})\-[0-9]{1,5})/g;
        var regex_CVE = /((CVE)\-([0-9]{4})\-[0-9]*)/g;
        var regex_lienCVE = /(http[s]{0,1}:\/\/(.*))/g;

        if(true){
            CVEs=prepare_CVElistFromCurrentPage();
        }else{
            $('.article-content li').each(function(){
                var find_cve = $(this).text();
                if (find_cve.indexOf("Référence CVE") >= 0) {
                    // on est dans un li CVE
                    $(this).css("position","relative");
                    $(this).find('a:first').css({
                        'position' : 'absolute',
                        'right' : '66%'
                    });

                    // récupération de l'ID CVE
                    find_cve = find_cve.replace("http"," http") ; // le lien est colé à l'ID de la CVE sinon
                    var cve="", lien="";
                    // renvoie null dans certains cas alors que cela ne devrait pas
                    // cve = regex_CVE.exec(find_cve);
                    // cve =(Array.isArray(cve)?cve[0]:0);
                    // remplacement par :
                    var a1_txt_cve_space_splitted = find_cve.split(" ");
                    if (Array.isArray(a1_txt_cve_space_splitted)) {
                        for (var i = 0; i < a1_txt_cve_space_splitted.length; i++) { // recherche de l'id de la cve (du li)
                            //console.log("test : "+a1_txt_cve_space_splitted[i]);
                            cve = regex_CVE.exec(a1_txt_cve_space_splitted[i]);
                            cve =(Array.isArray(cve)?cve[0]:0);
                            //console.log("temp cve : "+cve);
                            if(cve) {break;}
                        }
                        for (i = 0; i < a1_txt_cve_space_splitted.length; i++) { // recherche de l'id de la cve (du li)
                            //console.log("test : "+a1_txt_cve_space_splitted[i]);
                            lien = regex_lienCVE.exec(a1_txt_cve_space_splitted[i]);
                            lien =(Array.isArray(lien)?lien[0]:"");
                            //console.log("temp cve : "+cve);
                            if(lien) {break;}
                        }
                    }
                    //console.log("lien et CVE trouvé ; CVE="+cve+", lien="+lien);

                    // comparaison du lien et de la CVE
                    var CVE_du_lien = regex_CVE.exec(lien);
                    CVE_du_lien =(Array.isArray(CVE_du_lien)?CVE_du_lien[0]:0);
                    if(CVE_du_lien && CVE_du_lien == cve){
                        //console.log("Lien de la CVE "+cve+" OK");
                    }else{
                        console.log("Lien de la CVE "+cve+" NOK");
                        add_log_to_CMB_PAGE("[MAIN] - foreach li : Lien de la CVE "+cve+" NOK", 0);
                    }


                    if(CVEs.includes(cve)){
                        // la CVE est déjà listée, on supprime la ligne
                        console.log("[MAIN] - foreach li : "+cve+" en doublon ; on supprime la ligne");
                        add_log_to_CMB_PAGE("[MAIN] - foreach li : "+cve+" en doublon ; on supprime la ligne", 0);
                        this.remove();
                        return 0;
                    }
                    var DomHTML = this.innerHTML
                    //console.log("avant : ");
                    //console.log(DomHTML);
                    var rx = new RegExp(/(.*?)<br(.*?)>/);
                    var lstMatch = rx.exec(DomHTML);
                    var replaceWithP = '<p id="li_CVE_'+cve+'">'+lstMatch[1]+"</p>";
                    //console.log("new txt : "+replaceWithP);
                    this.innerHTML = (DomHTML).replace(rx,replaceWithP);
                    //console.log("apres : ");
                    //console.log(this.innerHTML);
                    // vérification des liens
                    var regTestLiens = new RegExp(/<a(.*?)\/a>/);
                    lstMatch = regTestLiens.exec(DomHTML);
                    //console.log(lstMatch);
                    var resultatRegex = lstMatch[1];
                    if(resultatRegex.includes(cve)){
                        //console.log("Vérification des liens OK");
                    }else{
                        console.log("Vérification des liens NOK");
                        add_log_to_CMB_PAGE("[MAIN] - foreach li : Vérification des liens NOK", 0);
                        alert("Problème avec le lien de la cve "+cve);
                    }
                    // ajout du lien cyberwatch
                    //var url_cyberwatch = "https://calid-cyberwatch-veille.intradef.gouv.fr/cve_announcements/"+cve;
                    var url_cyberwatch = "https://cyberwatch.internet.np/cve_announcements/"+cve;
                    $(this).append("<br class = 'avoid_from_selection_but_for_html_export' /><a href='"+url_cyberwatch+"' target='_blank' style=' right: 66%;' class='only_for_html_export'>"+url_cyberwatch+"</a>");

                    // création de la div avec les différents ajouts de score
                    $(this).append('<div id="' + cve + '" class = "avoid_from_selection"></div>'); // avoid from selection est utilisé dans get_article_to_string pour cacher les div et ainsi pas les enregistrer dans le fichier texte généré
                    $('#'+cve).css({
                        'display' : 'inline-flex',
                        'position' : 'relative',
                        'left' : '36%'
                    });


                    var score_cveD = '<a href="https://www.google.com/search?q=%22'+cve+'%22" target="_blank">Google:'+cve+'</a>&nbsp;'
                    score_cveD = score_cveD +'<a style="background-color:black" href=https://www.cvedetails.com/cve-details.php?cve_id='+cve+' target="_blank" id="'+cve+'_cveDetails">??</a>';

                    $('#'+cve).append(score_cveD);
                    $('#'+cve).append('<span id="'+cve+'_NVD" style="margin-left:20px;"> </span>');
                    $('#'+cve).append('<span id="'+cve+'_vuldb"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALYSURBVEhL3VRJaFNRFD0qDqjgRhEUEVciKLoRwYULBRFRQRExY5sEimCaEkql4iKtocMmnUQoBAlOCwcCipIIgtJCS+mmi+66y77ddIbSenz3vd+X4f+FpF14OHz+O/e8d/4b/oNvi7HtAcFgsLm5ORaLSTMcDrMZiUTi8XhTU5OIDQ0NFPlsbGzkCz2i10RlQCgUWlhYmJyclGYul9vY2EilUktLS2NjYyL29/dT7OnpGRgY4Et3d7foNVFjiUZGRlZWVvh1fJ+enp6dnfX7/fUMyGQy7MYn12Rtba1QKFCsZwAXd3l5mfMYHh5m/46ODor1DCDGx8fn5+enpqbm5uYCgQAVbszExIRUBwcHOW5XV9e/BwwNDbEnUSwWRZmZmeFmtLS0cG9GR0fX19cTiYQEZLPZJwrJZFLMNmoHRKPR1dVVdu7s7BQlnU4vLi5S4dBEPp+nKAEOSqWSmG3UDiBaW1vb29t5fnTb5+PP0dvb29fXx3k4Cj0O2EV0G64B9QJObzGwTQgBj6oYBq4A+7VlE8eqnMIYcBs4oV3l+Az8dmFBJe3Sxr84X+Wx+QtIAju018AjQJiy+tgBHE7oKMJr2mvgBCSAC4qX1Lp9svrc0d6ygCPAXsUDwEXgi9Gfaq+BE3BPCxqHgDem9AHYqUQ7gAYb/D7ROeMyuAUQl02JlEPnEZA2+gMtGHgE7AF+mupNpdgBQeC+IkfkV4v4AtinnJvwCCA+mqpPNe2Aan5Tk66Ed8B7U32omnbAW+C14VdL58zK4BHAjf1uqteV4rYHdPqNzlXlAduER8A5UyJPKcVjk/k/Fk3pqtYU3AJ4wF+a0jvzr3kE7AZ+mJKcCA0n4DFwVpGj3AJeGZ28ob1lAYfVMRMeBdqs0hltV3AC3PjM5apwY6biOvII4GXHO0P+YYF3AO+l58BB7TWIAPFycq2i6s6qtALHq8xC3th3gZPa9Z8A+AMBzN5j3/tukQAAAABJRU5ErkJggg==" width="22" height="22" style="margin: 0 0 3px 20px"><form id="search_vuldb_'+cve+'" action="https://vuldb.com/?search" method="post" target="_blank"><input name="search" type="hidden" value="'+cve+'"></form></span>');
                    //$('#'+cve).append('<span id="'+cve+'_sourceclear" style="margin-left:20px;"> <a href="https://www.sourceclear.com/vulnerability-database/search#query='+cve+' type:vulnerability" target="_blank"><img src="https://www.sourceclear.com/vulnerability-database/images/vcfavicon.ico" width="22" height="22"></a> </span>');
                    //$('#'+cve).append('<span id="'+cve+'_circl" style="margin-left:20px;"> <a href="https://cve.circl.lu/cve/'+cve+'" target="_blank"><img src="https://cve.circl.lu/static/img/favicon.ico" width="22" height="22"></a> </span>');
                    $('#'+cve).append('<span id="'+cve+'_feedly" style="margin-left:20px;"> <a href="https://feedly.com/cve/'+cve+'" target="_blank"><img src="https://feedly.com/favicon.ico" width="22" height="22"></a> </span>');
                    $("#"+cve+"_vuldb").mousedown(function(event) {
                        switch (event.which) {
                            case 1: // Left
                                $('#'+cve+'_vuldb').children(":first").css({
                                    'outline-style' : 'solid',
                                    'outline-width' : '3px',
                                    'outline-color' : '#2860ff'
                                });
                                $(document).delegate("#"+cve+"_vuldb","click",function(){
                                    updateClipboard(cve);
                                    $('#search_vuldb_'+cve).submit();
                                });
                                break;
                            case 2: // Middle
                                $('#'+cve+'_vuldb').children(":first").removeAttr('style');
                                $('#'+cve+'_vuldb').children(":first").css("margin","0 0 3px 20px");
                                break;
                            case 3: // Right
                                $('#'+cve+'_vuldb').children(":first").css("filter","invert(1)");
                                break;
                        }
                    });


                    //getCyberwatchScore(cve);
                    get_cveDetails(cve);
                    CVEs.push(cve);
                    //get_vuldb(cve[2]);
                }

            });
        }
 //debug(CVEs)

        if(CVEs.length == 0) {
            var tablesAct, tableAct_trs, k,l, cveTD;
            tablesAct = document.getElementsByClassName("specificStd");
            console.log(tablesAct);
            for(k=0;k<tablesAct.length;k++){
                cveTD = regex_CVE.exec(tablesAct[k].innerText);
                cveTD =(Array.isArray(cveTD)?cveTD[0]:0);
                if(cveTD) {CVEs.push(cveTD);}
            }
        }
        // ajout du tableau des CVE à gauche du content
        var unique = [...new Set(CVEs)];
        CVEs = unique;
        // CVEs = [ "CVE-2022-21476", "CVE-2022-21449"] // custom list if needed
        try{ // alimentation du tableau des CVEs
            make_div_Left_content(document.getElementById('header'),CVEs);
            compteurCVEtoLoad = CVEs.length;
            compteurCVEloaded = 0;
            var intervalAnimation = waitingAnimation("pProcessMessage","Chargement des Score NVD "); // pour exemple d'animation, utiliser l'avis https://www.cert.ssi.gouv.fr/avis/CERTFR-2022-AVI-615/ et commenter le test d'abscence de CVE
            for(var j=0;j<CVEs.length;j++){ loadScore(CVEs[j], intervalAnimation);}
            add_functions_onclick_arrayOfCVE(CVEs);
        } catch (error) {
            console.log("Erreur pendant la phase de création du tableau : "+error);
        }
        try{ // création du tri
            if(CVEs.length<=0) {
                clearInterval(intervalAnimation);
                document.getElementById("pProcessMessage").innerText = "Pas de CVE"
                document.getElementById("tableCVEs_THs_CVE").innerText = "Pas de CVE"
                document.getElementById("tableCVEs_THs").style.color = "green";
                document.getElementById("refCVE_vecteur_v2_source").value = "Pas de CVE"
                document.getElementById("refCVE_vecteur_v3_source").value = "Pas de CVE"
            }else{
                var s = (CVEs.length == 1?"":"s");
                document.getElementById("tableCVEs_THs_CVE").innerText = "CVE"+s+" ("+CVEs.length+")";

                // Ajout de l'action de tri en cliquant sur l'entete CVE
                var listOfSortableHeaderID = ['tableCVEs_THs_CVE', "tableCVEs_THs_Editeur", "tableCVEs_THs_v2", "tableCVEs_THs_v3", "tableCVEs_THs_v3_CNA"]; // lié a getCompareTypeFromIndexTableCVE getHeaderIDfromIndexTableCVE
                for(var HeaderID=0;HeaderID<listOfSortableHeaderID.length;HeaderID++){
                    makeSortingClick(listOfSortableHeaderID[HeaderID], "tableCVEs_sorting", "tableCVEs", "originalorder", listOfSortableHeaderID, HeaderID);
                }
            }
        } catch (error) {
            console.log("Erreur pendant la phase de création du tri : "+error);
        }


        if(CVEs.length==1){
            document.getElementById('refCVE_vecteur_v2').value = CVEs[0];
            document.getElementById('refCVE_vecteur_v3').value = CVEs[0];
        }
        //getCVSS_fromStorage("CVE-2022-1012", "CVEv2");
    }
    window.addEventListener('load', function() {
        setTimeout(function() {
            //console.clear();
            main(); }, 100);
    }, false);


    // MAIN />
})();