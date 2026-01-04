// ==UserScript==
// @name         Hash Finder
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  Find associated Hashes
// @author       SRI/SRAM
// @include      *
// @connect      virustotal.com
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon          data:image/jpeg;base64,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
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/374940/Hash%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/374940/Hash%20Finder.meta.js
// ==/UserScript==
// 1.3 : utilise le delai d'une API standart
// 2.01 : envoie toutes les requêtes successivement apres avoir eut sa réponse
// 2.1 : fonctionnelle avec les requetes en v2
// 2.5 : utilisation de l'API v3
// TODO ; il y a des commentaires en TODO  + penser à basculer en v3
// axe d'amélioration, mieux comprendre l'influence des request rate sur les requetes

(function() {
    'use strict';
	// DECLARATION DES VARIABLES GLOBALES
		function getVTbaseURL(){return "https://www.virustotal.com/api/v3/";}
		function getVTURLforFiles(){return (getVTbaseURL()+"files/");}
		function getStorage_ApiKey_key(){return "api_key";}

		function getValueFromPath(oJSONprofile, path){
			var pathSplitted = path.split("/");
			var value=oJSONprofile;
			for(var i=0;i<pathSplitted.length;i++){
				value = value[pathSplitted[i]];
			}
			return value;
		}

	// FONCTION CLE API
		function jsomPath_userID(){return "data/id";}
		function jsomPath_userEmail(){return "data/attributes/email";}
		function jsomPath_userHourlyRequestRate(){return "data/attributes/quotas/api_requests_hourly/allowed";}
		function jsomPath_userHourlyRequestUsed(){return "data/attributes/quotas/api_requests_hourly/used";}
		function jsomPath_userDailyRequestRate(){return "data/attributes/quotas/api_requests_daily/allowed";}
		function jsomPath_userDailyRequestUsed(){return "data/attributes/quotas/api_requests_daily/used";}

		// Fonction qui requête la clé d'API si elle n'est pas déjà connue du stockage
		function defaultApiKey(val=""){
			var apiKeyStorageKey = getStorage_ApiKey_key();

			var defaultValue = '<API KEY ICI>';
			if(val){
				return val === defaultValue;
			}else{
				var actualValue = GM_getValue(apiKeyStorageKey);
				if(actualValue){
					return actualValue;
				}else{
					let api_key = prompt("Veuillez saisir votre clé API (https://www.virustotal.com/)", defaultValue);
					if(api_key){
						GM_setValue(apiKeyStorageKey,api_key);
						return api_key;
					}else{
						return defaultValue;
					}
				}
			}
		}
		// fonction qui efface la clé du stockage
		function resetDefaultAPIKey(mouseEvent, alreadyCalled=false){
			var apiKeyStorageKey = getStorage_ApiKey_key();
			// remise à zéro si demandé
            var api_key = GM_getValue(apiKeyStorageKey);
            if(api_key && ! alreadyCalled){
                let reponse = confirm("Voulez vous vraiment supprimer la clé API enregiqtrée ?");
                if(reponse){
                    GM_deleteValue(apiKeyStorageKey);
                    resetDefaultAPIKey(mouseEvent, true);
                }
            }else if(api_key){
                alert("La suppression n'a pas fonctionné");
            }else{
                alert("Aucune clé d'enregistrée");
            }
		}

		// fonction qui retourne l'etat du compte de l'API_KEY
		function getProfileData(api_key){
			// Standard : 4 requests per minute
			// Premium : 100K lookups / min
			var url, params, headers;
			url = getVTbaseURL()+"users/"+api_key;
					// console.log(url);
			headers = {'x-apikey':api_key};


			return new Promise((resolve) => {
				GM.xmlHttpRequest({
					method: "GET",
					url: url,
					headers: headers,
					onload: function(response) {
						var oJSON;
						//console.log("getCyberwatchScore onload");
						try{
							if(response.status == 200){
								resolve(JSON.parse(response.responseText));
							}else{throw(response.statusText);}
						}catch (error){
							alert("getProfileData : try get profile data : "+error);
							resolve({"data":""});
						}
						//# API v3 - Python GET and POST requests example
						//headers = {'accept': 'application/json', 'x-apikey': VT_API_KEY}
						//response = requests.get(url, headers=headers)
						//response = requests.post(url, headers=headers)
					}
				});
			});
		}

		// fonction qui retourne la frequence à l'heure des requetes autorisées
		function getHourlyRequestRate(oJSONprofile){
				var requestRatePath = jsomPath_userHourlyRequestRate();
				return parseInt(getValueFromPath(oJSONprofile, requestRatePath));
			}

		// fonction qui retourne les informations de la clé utilisée
		async function whatIsMyAPIKeyUser(){
			var api_key = defaultApiKey();
			var oJSONprofile = await getProfileData(api_key);
			var userIDpath = getValueFromPath(oJSONprofile, jsomPath_userID());
			var userEmail = getValueFromPath(oJSONprofile, jsomPath_userEmail());
			var userHourlyRequestRate = getHourlyRequestRate(oJSONprofile);
			var userHourlyRequestUsed = getValueFromPath(oJSONprofile, jsomPath_userHourlyRequestUsed());
			var userDailyRequestRate = getValueFromPath(oJSONprofile, jsomPath_userDailyRequestRate());
			var userDailyRequestUsed = getValueFromPath(oJSONprofile, jsomPath_userDailyRequestUsed());

			var message;
			message = "Vous utilisez l'API de "+userIDpath+"\n";
			message = message + "email : "+userEmail+"\n";
			message = message + "utilisation à l'heure des requêtes API : "+userHourlyRequestUsed+"/"+userHourlyRequestRate+"\n";
			message = message + "utilisation journalière des requêtes API : "+userDailyRequestUsed+"/"+userDailyRequestRate+"\n";

			alert(message);
		}

	// FONCTION CALCUL TEMPORISATION
		// fonction qui calclul l'equivalence en MS d'un ratio en heure
		function frequenceByHourTofrequenceByMs(hourFreq=1){
			var msFreq = ((hourFreq/3600)/1000);
			return msFreq
		}

		// fonctions qui déterminent le meilleure interval à utiliser en fonction du ratio disponnible
			function exactIntervalTime(hourlyRequestRate){
				return Math.ceil( (3600*1000) / (hourlyRequestRate) )
			}

		// fonction qui détermine le nombre d'intervals necessaires avant de passer à la prochaine requête
		function IntervalsFor1Request(hourlyRequestRate,intervalLoopTime){ // intervalLoopTime en ms
			var msRequestRate = frequenceByHourTofrequenceByMs(hourlyRequestRate);
			var oneIntervalProgression = intervalLoopTime*msRequestRate;
			var IntervalsFor1Request = 1/oneIntervalProgression;

			//console.log("timeFor1Request = "+IntervalsFor1Request);
			if(IntervalsFor1Request<1){IntervalsFor1Request = 1}
			return IntervalsFor1Request;
		}

	// FONCTIONS DOM
		// fonction qui retourne un ID libre
		function fistAvailableID(baseID, suffixe=""){
			var newID = baseID +""+ suffixe;
			//console.log("look for "+newID);
			try{
				// console.log(document.getElementById(newID));
				if(document.getElementById(newID)){
					//console.log(newID+" existe deja");
					return fistAvailableID(baseID, (Number.isInteger(suffixe) ? suffixe+1 : 0));
				}else{return newID;}

			}catch (error){
				//console.log(newID+" n'existe pas");
				return newID;
			}
		}

		// fonction qui retoune le contenu de la page en chaine de caractere
		function pageToString(){
			$.fn.selectText = function(){
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
			$("body").selectText();


			var paste = "";
			if (window.getSelection) {
				paste = window.getSelection().toString();
			} else if (document.selection && document.selection.type != "Control") {
				paste = document.selection.createRange().text;
			}
			document.getSelection().removeAllRanges();
			return paste;
		}

		// FONCTIONS GRAPHIQUES
			// cree une zone de texte en overlay/par dessus la page
			function overlay(overlayID="overlay"){
				overlayID = fistAvailableID(overlayID);
				var newDiv = document.createElement("div");
					newDiv.id = overlayID;
				$('body').append(newDiv);//'<div id="'+overlayID+'"><span id="remaining"></span><br><span id="countdown"></span></div>');
				$('#'+overlayID).css({
					'position' : 'fixed',
					'display' : 'block',
					'width' : '100px',
					'height' : '100px',
					'top' : '0',
					'right' : '0',
					'background-color' : 'rgba(0,0,0)',
					'z-index' : '999999999',
					'text-align' : 'center',
					'vertical-align' : 'middle',
					'line-height' : '25px',
					'color' : 'rgb(255,255,255)',
					'font-weight' : 'bold',
					'padding-top' : '25px'
				});
				return overlayID;
			}
			function addChild(parentID, childType, childID=""){
				var newItem = document.createElement(childType);
					if(childID){
						childID = fistAvailableID(childID);
						newItem.id = childID;
					}
				document.getElementById(parentID).appendChild(newItem);
				return childID;
			}
			function overlayAddSpan(overlayID, targetID = "overlaySpan", newLine=false){
				if(newLine){addChild(overlayID, "br");}
				return addChild(overlayID, "span", targetID);
			}

			// fonction qui affiche le timer decroissant
			function displayTimer(a,b,...Args){ // si depuis desc => compteur actuelle, depuis quelle valeur ; Args[0] = l'ID du SPAN a editer
				var domID = null
				var toWrite = "tps restant (s) : "
				
				if(Args.length>=1){domID = Args[0];}
				
				toWrite += (a<b ? "+"+(b-a) : a-b)
				if(domID){
					document.getElementById(domID).textContent = toWrite;
				}else{
					console.log(toWrite);
				}
			}
	
		// fonction qui télécharge sur le PC un texte (string)
		function txtfile(titre, texte){
			var a = window.document.createElement('a');
			a.href = window.URL.createObjectURL(new Blob([texte], {type: 'text/plain'}));
			a.download = 'IOC - '+titre+'.txt';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			return false;
		}

	// FONCTION TRAITEMENT DE TEXTE
		// fonction qui nettoie de posisble indicateurs
		function cleanText_observables(texte=""){
			texte = texte.split("(.)").join(".");
			texte = texte.split("[.]").join(".");
			texte = texte.split("[.").join(".");
			texte = texte.split("[DOT]").join(".");
			texte = texte.split("[dot]").join(".");
			texte = texte.split("[at]").join("@");
			texte = texte.split("(at)").join("@");
			texte = texte.split("[@]").join("@");
			texte = texte.split("hxxp").join("http");

			return texte;
		}

	// FONCTION RECUPERATION ET TRAITEMENT DES HASHS
		// fonction qui ajoute les HASH de la pages dans la liste
		function hashesToListe(hashes, liste = new Array()){
			if(hashes != null && hashes != '') {
				hashes = [ ...new Set(hashes) ];
				for (var z in hashes) {
					liste.push(hashes[z]);
				}
			}
			return liste;
		}
		// fonction qui extrait les hashes d'un texte
			function getHashesFromText_md5(Texte){return Texte.match(/\b([a-f0-9]{32})\b/gmi);}
			function getHashesFromText_sha1(Texte){return Texte.match(/\b([a-f0-9]{40})\b/gmi);}
			function getHashesFromText_sha256(Texte){return Texte.match(/\b([a-f0-9]{64})\b/gmi);}
			function getHashesListFromText(texte, liste = new Array()){
				liste = hashesToListe(getHashesFromText_md5(texte),liste);
				liste = hashesToListe(getHashesFromText_sha1(texte),liste);
				liste = hashesToListe(getHashesFromText_sha256(texte),liste);
				return liste;
			}
			
	// FONCTION RECUPERATION ET TRAITEMENT DES URLS
		// fonction qui ajoute les URLS de la pages dans la liste
		function urlToListe(url, liste = new Array()){
			if(url != null && url != '') {
				for (var z in url) {
					if ( [",", ";", "."].includes(url[z].slice(-1)) ) {
						url[z] = url[z].substring(0, url[z].length - 1);
					}
				}
				url = [ ...new Set(url) ];
				for (z in url) {
					liste.push(url[z]);
				}
			}
			return liste;
		}
		// fonctions qui extrait les urls d'un texte
			function getURLsFromText(texte){ return texte.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z0-9]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi); }
			function getURLlisteFromText(texte, liste = new Array()){
				var urls = getURLsFromText(texte);
				liste = urlToListe(urls, liste);

				return liste;
			}

		// fonction qui recupère les hashes md5, sha1, sha256 depuis un hash en paramètre, TODO cette version ne gère pas les doublons dans la liste
		function getRecursivlyAttribValue(jsonObject, attribKey, levelMax=3, level = 0){
			var toReturn = "";
			var key, keys;
			// console.log("getRecursivlyAttribValue"+jsonObject+", "+attribKey+" => "+typeof(jsonObject));
			try{
				if(level>levelMax){throw new Error('Limite atteinte pour '+attribKey);}
				for (key in jsonObject){
					if(key == attribKey){
						toReturn = jsonObject[attribKey];
					}else{
						toReturn = getRecursivlyAttribValue(jsonObject[key], attribKey, levelMax, level+1);
					}
					if(toReturn){break;}
			}
			}catch(error){
				
			}finally{
				return toReturn;
			}
		}
		
		function promesse_get_associated_hash(api_key, target_hash, listAllHashes) { // async func
			var url = getVTURLforFiles()+target_hash
			
			return new Promise((resolve) => {
				GM.xmlHttpRequest({
					method: "GET",
					headers: {
						'x-apikey': api_key
					},
					url: url,
					onload: function(response) {
						var localOutput = ""
						if(response.status==200){
							var md5="???", sha1="???", sha256="???", malicious="???", undetected="???", last_analysis_date_TS="???";
							var total="!!!", last_analysis_date_HR="!!!"
							
							var res = JSON.parse(response.responseText);
							try {md5=getRecursivlyAttribValue(res, "md5");}catch (e) {}
							try {sha1=getRecursivlyAttribValue(res, "sha1");}catch (e) {}
							try {sha256=getRecursivlyAttribValue(res, "sha256");}catch (e) {}
							try {malicious=getRecursivlyAttribValue(res, "malicious");}catch (e) {}
							try {undetected=getRecursivlyAttribValue(res, "undetected");}catch (e) {}
							try {
								last_analysis_date_TS=getRecursivlyAttribValue(res, "last_analysis_date");
								last_analysis_date_HR = new Date(parseInt(last_analysis_date_TS)*1000).toString();
							}catch (e) {}
							
							try {total = parseInt(malicious)+parseInt(undetected);}catch (e) {}
							
							// formatage du resultat
								localOutput += 'Ratio: ' + malicious + ' / ' + total + ' le ' + last_analysis_date_HR + "\r\n";
								localOutput += "md5="+md5 + "\r\n";
								localOutput += "sha1="+sha1 + "\r\n";
								localOutput += "sha256="+sha256 + "\r\n\r\n";
							
						}else{
							localOutput += 'Inconnu VT:' + "\r\n" + target_hash + "\r\n\r\n";
						}
						
						resolve(localOutput);
					}
					, onerror: function(error) {console.log(response);;resolve(target_hash+":ERREUR="+error+"\r\n\r\n")}
				});
			});
		}

	
	// FONCTION TIMER pour des appelles asynchrones
		function orchestrator(todoList, intervalLoopTime, api_key, urls, overlayID, compteurID, remainingID){ // l'objectif serait de généraliser l'appel en envoyant todoList, intervalLoopTime,...Arguments 
			// DECLARATION DES VARIABLES 
				var doneList = new Array
				var timeEstimated = Math.ceil(todoList.length * intervalLoopTime/1000);
				
			// FONCTIONS TIMER
				// function de compte à rebours par secondes
					// si stopIf0 = true
					// 		fctToCallBack sera appelée à la fin du décompte : fctToCallBack_end(limit,Args)
					// pendant le traitement
					// 		fctToCallBack sera appelée à chaque itération : fctToCallBack_main(cpt,limit,Args)
					// les variables appelées par leur noms doivent avoir un scope superieur à celui de cette fonction
					function timer(signe, nameCompteurVar, limit, fctToCallBack_main=null, stopIf0 = true, nameInterval="", fctToCallBack_end=null, ...Args){
						var cpt;
						// essaie de trouver la variable au scope superieur, sinon initialisation à 0 (ne fonctionne pas !!! probablement à cause du mode strict
							try{
								eval(nameCompteurVar);
							}catch(error){
								console.log("ERR : "+error);
								eval("var "+nameCompteurVar+"=0");
							}finally{
								eval(nameCompteurVar+signe+'=1'); // incrémentation de la variable globale
							}
						// essaie de recuperer le compteur actuel, sinon il sera à 0
							try{ cpt = eval(nameCompteurVar);}catch(error){cpt=0} // récupération de la variable globale
						
						// si on a atteint la limite, on arrete si demandé
						// console.log("timer :"+nameInterval+" : "+cpt+"/"+limit);
							if( eval(signe+"1*("+cpt+" - "+limit+")")>=0 && stopIf0){
								// console.log("timer :"+nameInterval+" : "+cpt+"/"+limit+":if");
								clearInterval(eval(nameInterval)); // on s'auto clear
								try{fctToCallBack_end(limit,...Args);}catch(error){} // on essaye d'appeler la fonction de fin
							}else{ // on continue
								// console.log("timer :"+nameInterval+" : "+cpt+"/"+limit+":else");
								try{fctToCallBack_main(cpt,limit,...Args);}catch(error){console.log(error);} // on essaye d'appeler la fonction principale
							}
					}
					function timerDesc(nameCompteurVar, limit, fctToCallBack_main=null, stopIf0 = true, nameInterval="", fctToCallBack_end=null, ...Args){
						timer("-", nameCompteurVar, limit, fctToCallBack_main, stopIf0, nameInterval, fctToCallBack_end, ...Args)
					}
					function timerAsc(nameCompteurVar, limit, fctToCallBack_main=null, stopIf0 = true, nameInterval="", fctToCallBack_end=null, ...Args){
						timer("+", nameCompteurVar, limit, fctToCallBack_main, stopIf0, nameInterval, fctToCallBack_end, ...Args)
					}
				
				// fonctions appelées par des intervalles pour le traitement
					// for each item in for_vt, appeler la fonction do, mettre le resultat dans la doneList ; 
					function promesse_get_associated_hashes(cpt,limit, todoList, doneListVarName, domID, api_key, urls, overlayID, titre, countDownTimer){ // fonction d'action
						// console.log("promesse_get_associated_hashes  :"+cpt+"<"+todoList.length);
						// console.log("doToDo "+cpt+"/"+limit);
						// console.log(todoList);
						if(cpt<todoList.length){ // action
							var promesse = promesse_get_associated_hash(api_key, todoList[cpt], todoList); // choisir d'utiliser cette variable ou l'appel complet dans le push
							eval(doneListVarName+".push(promesse)");//promesse);
							//console.log(doneListVarName+".push(promesse)");
							document.getElementById(domID).textContent = (cpt+1)+"/"+limit;
						}else{
							console.log("doToDo ERROR : cpt>todoList.length : "+cpt+">"+todoList.length);
						}
					}
				
			// FONCTIONS TRAITEMENT AVEC SUIVI D'AVANCEMENT (dépendant de doneList)
				// fonction qui concatenne les resultats des promesses et qui attend la fin avant de telecharger le fichier sur le PC
				function postTraitement(limit, todoList, doneListVarName, domID, api_key, urls, overlayID, titre, countDownTimer){ // fonction d'action
					// console.log("postTraitement "+limit+" : "+doneListVarName);
					var donelist = eval(doneListVarName);
					// console.log(donelist);
					var output = window.location.href + '\r\n\r\n';
					var cptDone = 0;
					for(var i=0;i<donelist.length;i++){
						// console.log("postTraitement "+i+" : "+donelist[i]);
						eval(doneListVarName+"[i].then((value) => {console.log('postTraitement : '+value);output+=value;cptDone+=1;})");
					}
					
					var output_URLs = "\r\n";
					for(var z in urls) {
						output_URLs += urls[z] + '\r\n';
					}
					
					var waitFinishForWriteTo = setInterval(function(){
						console.log("## wait fin "+cptDone+"/"+donelist.length);
						if(cptDone>=donelist.length){
							// console.log("######### fin, on ecrit dans le fichier");
							
							document.getElementById(overlayID).style.display = "none";
							txtfile(titre, (output+output_URLs));
							clearInterval(countDownTimer);
							clearInterval(waitFinishForWriteTo);
						}
					},1000);
				}

			// afficher le countdown général
				var cptCountdown = timeEstimated
					var countDownTimer = setInterval(
						timerDesc // fonction utilisé par l'interval
						, 1000 // delai de l'interval
						, "cptCountdown" // variable globale (au scope superieur à timerDesc) qui compte les occurence de l'interface
						, 0 // compteur max
						, displayTimer // fonction a executer pendant le decompte
						, false // ne pas arreter le decompte à la fin
						, "countDownTimer" // nom de la variable de compteur
						, null // fonction a executer a la fin du decompte // aucune car on arrete pas
						, compteurID // id du span a editer pour la fonction displayTimer
					);
			
			// traiter les objets avec délai d'action
				// ELEMENTS Sans promesse
				var titre = document.title
				document.getElementById(remainingID).textContent = "Hash :\n0/"+todoList.length;
				var cptToDo = -1
					var toDoInterval = setInterval(
						timerAsc // fonction utilisé par l'interval
						, intervalLoopTime // delai de l'interval
						, "cptToDo" // variable globale (au scope superieur à timerDesc) qui compte les occurence de l'interface
						, todoList.length // compteur max
						, promesse_get_associated_hashes // fonction a executer pendant le decompte // !!! il y a un leger retard avant l'exécution, en mode hourlyRequestRate = 240 // la boucle passe par la fonction, mais se lance que bien après
						, true // ne pas arreter le decompte à la fin
						, "toDoInterval" // nom de la variable de compteur
						, postTraitement // fonction a executer a la fin du decompte // aucune car on arrete pas
						, todoList // liste source pour le traitement
						, "doneList" // liste pour le post traitement
						, remainingID // id du span pour afficher l'avancement
						, api_key
						, urls
						, overlayID
						, titre
						, countDownTimer
					);
		}
	

	// FONCTION RECUPERATION ET TRAITEMENT DES URLS
	async function start_collector(paste){
		// DECLARATION DES VARIABLES
			// API
				var api_key = defaultApiKey();
				// TEMPS
					var oJSONprofile = await getProfileData(api_key);
					var hourlyRequestRate=getHourlyRequestRate(oJSONprofile);
					// hourlyRequestRate = 240; // api public, utilisé pour les tests de fonctionnements
					var intervalLoopTime = exactIntervalTime(hourlyRequestRate);
			// GUI
				var overlayID, compteurID, remainingID;
			// TRAITEMENT TEXTE
				//var paste;
			// TRAITEMENT OBSERVABLE
				var urls = new Array();
				var for_vt = new Array();

		// TEST DES PREREQUIS
			if (defaultApiKey(api_key)) {
				alert("Vous n'avez pas renseigné de clé API Virus Total");
				return false;
			}
		// creation de l'overlay
			overlayID = overlay();
			remainingID = overlayAddSpan(overlayID, "remaining");
			compteurID = overlayAddSpan(overlayID, "countdown", true);

		// recupération du contenu de la page + nettoyage
			//paste = pageToString();
			
			if(! paste){console.log("page vide");}
			
			paste = cleanText_observables(paste);

		// recupérations des observables (hash md5, sha1 et sha256 + url )
			for_vt = getHashesListFromText(paste, for_vt);
			urls   = getURLlisteFromText(paste, urls);

			if(for_vt.length>0 || urls.length>0 ) {
				// creation d'un fichier avec la liste ordonée trouvée
					var titreListe = document.title +"_listeIOC";
					txtfile(titreListe, ("hashes :\r\n\r\n"+for_vt.join("\r\n") + "\r\n\r\nURLS :\r\n\r\n"+urls.join("\r\n")))
				
				orchestrator(for_vt, intervalLoopTime, api_key, urls,overlayID, compteurID, remainingID);
			}else{
				document.getElementById(remainingID).textContent = "Aucun résultat";
			}
	}
	
	async function load_page_clicked(paste){
		// recupération du contenu de la page
			var paste = pageToString();
		start_collector(paste);
		
	}
	async function paste_page_clicked(){
		// recupération du contenu par l'utilisateur
			var paste = window.prompt("Veuillez saisir le texte à analyser","");
		start_collector(paste);
	}
	async function menuItemClicked_async(){
		// DECLARATION DES VARIABLES
			// API
				var api_key = defaultApiKey();
				// TEMPS
					var oJSONprofile = await getProfileData(api_key);
					var hourlyRequestRate=getHourlyRequestRate(oJSONprofile);
					// hourlyRequestRate = 240; // api public, utilisé pour les tests de fonctionnements
					var intervalLoopTime = exactIntervalTime(hourlyRequestRate);
			// GUI
				var overlayID, compteurID, remainingID;
			// TRAITEMENT TEXTE
				var paste, continuerPasteNonVide=true;
			// TRAITEMENT OBSERVABLE
				var urls = new Array();
				var for_vt = new Array();

		// TEST DES PREREQUIS
			if (defaultApiKey(api_key)) {
				alert("Vous n'avez pas renseigné de clé API Virus Total");
				return false;
			}
		// creation de l'overlay
			overlayID = overlay();
			remainingID = overlayAddSpan(overlayID, "remaining");
			compteurID = overlayAddSpan(overlayID, "countdown", true);

		// recupération du contenu de la page + nettoyage
			paste = pageToString();
			
			if(! paste){console.log("page vide");}
			
			paste = cleanText_observables(paste);

		// recupérations des observables (hash md5, sha1 et sha256 + url )
			for_vt = getHashesListFromText(paste, for_vt);
			urls   = getURLlisteFromText(paste, urls);

			if(for_vt.length>0 || urls.length>0 ) {
				orchestrator(for_vt, intervalLoopTime, api_key, urls,overlayID, compteurID, remainingID);
			}else{
				document.getElementById(remainingID).textContent = "Aucun résultat";
			}
	}
	
	function pause(){
		alert("Pause, cliquer sur OK pour reprendre");
	}
	
////// DEV /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function DEVdisplayTimer(a,b,...Args){ // si depuis desc => compteur actuelle, depuis quelle valeur ; Args[0] = l'ID du SPAN a editer
		var domID = null
		var toWrite = "tps restant (s) : "
		
		if(Args.length>=1){domID = Args[0];}
		
		toWrite += (a<b ? "+"+(b-a) : a-b)
		if(domID){
			document.getElementById(domID).textContent = toWrite;
		}else{
			console.log(toWrite);
		}
	}
	
	async function DEVtimer(){
		// objectif afficher le timer qui décompte en seconde, sur un temps estimé ; et passe à l'action suivante apres chaque interval
		var overlayID = overlay();
		var remainingID = overlayAddSpan(overlayID, "remaining");
		var compteurID = overlayAddSpan(overlayID, "countdown", true);

		var todoList = ["aa","bb","cc","dd"];
		var doneList = new Array();
		var timeEstimated, intervalLoopTime, secondIntervalDelay;
		// test 1 :
			secondIntervalDelay = 1000;
			intervalLoopTime = 3000;
			timeEstimated = Math.ceil(todoList.length * intervalLoopTime/1000);


			// function de compte à rebours par secondes
				// si stopIf0 = true
				// 		fctToCallBack sera appelée à la fin du décompte : fctToCallBack_end(limit,Args)
				// pendant le traitement
				// 		fctToCallBack sera appelée à chaque itération : fctToCallBack_main(cpt,limit,Args)
				// les variables appelées par leur noms doivent avoir un scope superieur à celui de cette fonction
				function timer(signe, nameCompteurVar, limit, fctToCallBack_main=null, stopIf0 = true, nameInterval="", fctToCallBack_end=null, ...Args){
					var cpt;
					// essaie de trouver la variable au scope superieur, sinon initialisation à 0 (ne fonctionne pas !!! probablement à cause du mode strict
						try{
							eval(nameCompteurVar);
						}catch(error){
							console.log("ERR : "+error);
							eval("var "+nameCompteurVar+"=0");
						}finally{
							eval(nameCompteurVar+signe+'=1'); // incrémentation de la variable globale
						}
					// essaie de recuperer le compteur actuel, sinon il sera à 0
						try{ cpt = eval(nameCompteurVar);}catch(error){cpt=0} // récupération de la variable globale
					
					// si on a atteint la limite, on arrete si demandé
						if( eval(signe+"1*("+cpt+" - "+limit+")")>=0 && stopIf0){
							clearInterval(eval(nameInterval)); // on s'auto clear
							try{fctToCallBack_end(limit,...Args);}catch(error){} // on essaye d'appeler la fonction de fin
						}else{ // on continue
							try{fctToCallBack_main(cpt,limit,...Args);}catch(error){} // on essaye d'appeler la fonction principale
						}
				}
				function timerDesc(nameCompteurVar, limit, fctToCallBack_main=null, stopIf0 = true, nameInterval="", fctToCallBack_end=null, ...Args){
					timer("-", nameCompteurVar, limit, fctToCallBack_main, stopIf0, nameInterval, fctToCallBack_end, ...Args)
				}
				function timerAsc(nameCompteurVar, limit, fctToCallBack_main=null, stopIf0 = true, nameInterval="", fctToCallBack_end=null, ...Args){
					timer("+", nameCompteurVar, limit, fctToCallBack_main, stopIf0, nameInterval, fctToCallBack_end, ...Args)
				}
			
			// afficher le countdown général
				var cptCountdown = timeEstimated
					var countDownTimer = setInterval(
						timerDesc // fonction utilisé par l'interval
						, secondIntervalDelay // delai de l'interval
						, "cptCountdown" // variable globale (au scope superieur à timerDesc) qui compte les occurence de l'interface
						, 0 // compteur max
						, DEVdisplayTimer // fonction a executer pendant le decompte
						, false // ne pas arreter le decompte à la fin
						, "countDownTimer" // nom de la variable de compteur
						, null // fonction a executer a la fin du decompte // aucune car on arrete pas
						, compteurID // id du span a editer pour la fonction DEVdisplayTimer
					);
			
			// traiter les objets avec délai d'action
				// ELEMENTS Sans promesse
					// for each item in todoList, appeler la fonction do, mettre le resultat dans la doneList ; 
						function doToDo(cpt,limit, todoListVarName, doneListVarName, domIdVarName){ // fonction d'action
							var domID = eval(domIdVarName);
							var todolist = eval(todoListVarName);
							console.log("doToDo "+cpt+"/"+limit);
							console.log(todolist);
							if(cpt<todolist.length){ // action
								console.log("doToDo "+doneListVarName+".push(todolist[cpt]+cpt)");
								document.getElementById(domID).textContent = (cpt+1)+"/"+limit;
								eval(doneListVarName+".push(todolist[cpt]+cpt)");
							}else{
								console.log("doToDo ERROR : cpt>todolist.length : "+cpt+">"+todolist.length);
							}
						}
						
						function postTraitement(limit, todoListVarName, doneListVarName, domIdVarName){ // fonction d'action
							console.log("postTraitement "+limit+" : "+doneListVarName);
							var donelist = eval(doneListVarName);
							console.log(donelist);
							for(var i=0;i<donelist.length;i++){
								console.log("postTraitement "+i+" : "+donelist[i]);
							}
						}

				var cptToDo = -1
					var toDoInterval = setInterval(
						timerAsc // fonction utilisé par l'interval
						, intervalLoopTime // delai de l'interval
						, "cptToDo" // variable globale (au scope superieur à timerDesc) qui compte les occurence de l'interface
						, todoList.length // compteur max
						, doToDo // fonction a executer pendant le decompte
						, true // ne pas arreter le decompte à la fin
						, "toDoInterval" // nom de la variable de compteur
						, postTraitement // fonction a executer a la fin du decompte // aucune car on arrete pas
						, "todoList" // liste source pour le traitement
						, "doneList" // liste pour le post traitement
						, "remainingID" // id du span pour afficher l'avancement
					);


				var cptI = 0;
					function inInterval(){
						cptI++;
						console.log("interval : "+cptI);
					}


		var consoleLogTimer = setInterval(inInterval,1000);

		// document.getElementById(overlayID).style.display = "none";
	}
	
	
	function DEVargs(){
		function c(x,y,z){
			console.log("c: "+x+","+y+","+z+".")
		}
		function a(x, ...Args){
			console.log("a: ");
			console.log(Args);
		}
		function b(...Args){
			console.log("b: ");
			console.log(Args);
			a(0,...Args);
			c(...Args);
		}
		
		b(1,2,3);
	}

////// MAIN /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    GM_registerMenuCommand("Start collector", load_page_clicked);
    GM_registerMenuCommand("Collector from prompt", paste_page_clicked);
    GM_registerMenuCommand("Pause", pause);
    GM_registerMenuCommand("Reset API Key", resetDefaultAPIKey);
    GM_registerMenuCommand("Whom API Key", whatIsMyAPIKeyUser);
	
    // GM_registerMenuCommand("DEV_try_Timer", DEVtimer);
    // GM_registerMenuCommand("DEV_try_args", DEVargs);

})();