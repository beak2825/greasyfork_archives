// ==UserScript==
// @name        projetADSV2
// @namespace   projetADSV2
// @description Version 2 du projet ADS 
// @include     http://www.worldofstargate.fr/index.php*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3434/projetADSV2.user.js
// @updateURL https://update.greasyfork.org/scripts/3434/projetADSV2.meta.js
// ==/UserScript==     

// DEBUT FONCTION COOKIES
function setCookie(cname, cvalue, exdays) {
	//console.log("Entrée setCookie : "+cname+" | "+cvalue+" | "+exdays);
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
	//console.log("Sortie setCookie : "+cname+" | "+cvalue+" | "+exdays);
}

function getCookie(cname) {
	//console.log("Entrée getCookie : "+cname);
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1){
			//console.log("Sortie getCookie : "+cname);
			return c.substring(name.length, c.length);
		}
    }
	//console.log("Sortie getCookie : "+cname);
    return "";
}
// FIN FONCTION COOKIES

function batimentATester(index){
	//console.log("Entrée batimentATester : "+index);
	var emplacement = false;
	var url = "http://www.worldofstargate.fr/ajax.php?page=not_builded_list&place="+index;
	$.ajax({
		 async: false,
		 type: 'GET',
		 url: url,
		 success: function(data) {
			var page = data;
			var decoupage = page.toString().split("<div")[1].split("</div>")[0];
			var nomEmplacement = decoupage.substring(decoupage.indexOf(">")+1);
			if(nomEmplacement.indexOf("Centre de commandement") > -1){
				emplacement=true;
			}
		 }
	});
		//console.log("Sortie batimentATester : "+index+" | "+emplacement);
	return emplacement;

}

// Fonction de détection du CC
function detectCC(nomColo){
	//console.log("Entrée detectCC : "+nomColo);	
	// On regarde si on a pas déjà le CC dans le cookie	
	var ccTrouve = false;
	if(getCookie(nomColo) != "" && batimentATester(getCookie(nomColo))){
		ccTrouve = true;
	}

	if(!ccTrouve){
		var positionCC = -1 ;
		for(var i = 1; i < 20; i++){
			if(batimentATester(i)){
				positionCC = i;
				break;
			}
		}
		setCookie(nomColo, positionCC, 365);
	}
	//console.log("Sortie detectCC : "+nomColo);	
}

// Function de détection du spy
function detectionSpy(emplacement, colonie){
	//console.log("Entrée detectionSpy : "+emplacement+" | "+colonie);	
	var url = "http://www.worldofstargate.fr/ajax.php?page=not_builded_list&place="+emplacement;
	$.ajax({
		async: false,
		type: 'GET',
		url: url,
		success: function(data) {
			var page = data;
			var tables = data.toString().split("<table");	
			var num = -1;
			for(var i = 0 ; i < tables.length ; i++){
				if(tables[i].indexOf("Planète propriétaire") != -1){
					num = i;
					break;
				}
			}
			var tabTR = tables[num].split("<tr");
			var text = "";
			if(tabTR[2].split("<td").length > 2){
				var td = tabTR[2].split("<td")[4];
				var tdUnite = tabTR[2].split("<td")[2];
				var nbUnite = tdUnite.substring(tdUnite.indexOf("quipe\">")+7, tdUnite.indexOf("unité(s)")-1);
				if(parseInt(nbUnite) < 20){
					var idcoloJoueur = td.substring(td.indexOf("id=")+3,td.indexOf("';"));
					var planete = td.substring(td.indexOf("d'origine\">")+11, td.indexOf("</a>"));
					var urlJoueur = "http://www.worldofstargate.fr/index.php?page=world&id="+idcoloJoueur;
					$.ajax({
						async: false,
						type: 'GET',
						url: urlJoueur,
						success: function(data) {
							var page = data;
							var span = data.toString().split("<span")[14];
							if(span != undefined){
								var nomJoueur = span.substring(span.indexOf("</span>")+7, span.indexOf("</div>"));
								var dateCatch = new Date();
								if(getCookie("spy") == ""){
									setCookie("spy",nomJoueur+"_"+planete+"_"+dateCatch.toLocaleTimeString()+"_"+colonie,365);
								}
								else{
									setCookie("spy",getCookie("spy")+"-"+nomJoueur+"_"+planete+"_"+dateCatch.toLocaleTimeString()+"_"+colonie,365);
								}
							}
						}
					});
				}
			}
		}
	});
	//console.log("Sortie detectionSpy : "+emplacement+" | "+colonie);	
}


//MAIN
function main(){
	var coloEnCour = "";
	$.ajax({
		async: false,
			 type: 'GET',
			 url: "http://www.worldofstargate.fr/ajax.php",
			 success: function(data) {
				var options = data.split("<select")[1].split("</select>")[0].split("<option");
				for(var i = 0 ; i < options.length ; i++){
					if(options[i].indexOf('"selected"') != -1){
						var nomColoEnCour = options[i].substring(options[i].indexOf('"selected">')+11,options[i].indexOf("</option>"));
						var idColoEnCour = options[i].substring(options[i].indexOf('value="')+7,options[i].indexOf('" selected="'));
						coloEnCour = idColoEnCour + "-" +nomColoEnCour;
						break;
					}
				}	
			 }
			 
		});
	// On récupère d'abord la planète sélectionnée


	setCookie("coloEnCour",coloEnCour,365);

	//On récupère la liste complète des colos
	var optionColo = new Array();
	// On regarde si les colos sont disponibles dans les cookies
	if(getCookie("colo1") == ""){
		optionColo = $("#world_list option");
		var colo = new Array();
		var i = 0;
		$("#world_list option").each(function(){
			var colonie = $(this);
			colo[i] = colonie.val() + "-" + colonie.text();
			i++;
			setCookie("colo"+i,colo[i-1],365);
		});
	}

	var i = 1;
	while ( getCookie("colo"+i) != ""){
		optionColo[i-1] = getCookie("colo"+i);
		i++;
	}

	// On démarre le parcours des colos
	for(var i = 1; i < optionColo.length+1; i++){
		var idColo = getCookie("colo"+i).split("-")[0];
		var nomColo = getCookie("colo"+i).split("-")[1];
		var url = "http://www.worldofstargate.fr/index.php?page=switch_world&id="+idColo;
		$.ajax({
		async: false,
			 type: 'GET',
			 url: url,
			 success: function(data) {
				// On recherche le CC
				detectCC(nomColo);
				
				// On vérifie que personne ne nous spy	
				detectionSpy(getCookie(nomColo),nomColo);
			 }
		});
	}

	// Retour à la colo en cours d'utilisation
	//console.log("Retour à la planète d'origine");
	var idColo = getCookie("coloEnCour").split("-")[0];
	var url = "http://www.worldofstargate.fr/index.php?page=switch_world&id="+idColo;
	$.ajax({
		 async: false,
		 type: 'GET',
		 url: url,
		 success: function(data) {
		 }
	});

		var text = "";
		var spy = getCookie("spy");
	if(spy != ""){
		var tabEspio = spy.split("-");
		for(var j = 0; j <tabEspio.length; j++){
			text += "Le joueur "+tabEspio[j].split("_")[0]+" vous a espionné depuis la planète "+tabEspio[j].split("_")[1]+" à "+ tabEspio[j].split("_")[2]+" sur votre planète "+tabEspio[j].split("_")[3]+".\n";
		}
		alert(text);
		//console.log(text);
	}
	else{
		var datte = new Date();
		//console.log(datte.toLocaleTimeString() + " RAS");
	}


	setCookie("spy","",-1);
}

$( document ).ready(function() {
  main();
window.setInterval(function () { main(); }, 30000);
});