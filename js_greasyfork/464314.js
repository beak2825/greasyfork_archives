// ==UserScript==
// @name Visualisation des gares TGV
// @namespace MH
// @include */mountyhall/MH_Lieux/Lieu_Portail.php*
// @version 1.6
// @description Visualisation des gares TGV sous MountyHall
// @injectframes 1
// @downloadURL https://update.greasyfork.org/scripts/464314/Visualisation%20des%20gares%20TGV.user.js
// @updateURL https://update.greasyfork.org/scripts/464314/Visualisation%20des%20gares%20TGV.meta.js
// ==/UserScript==

// variables globales (c'est laid)
let VTGV_origine;
let VTGV_canevas;
let VTGV_listeDestination=[];
let VTGV_fixToolTip=false;
let VTGV_destinationCourante = {"x":0,"y":0,"n":0};
let VTGV_maxXY = 110;
let VTGV_multiplicateur = 3;

function VTGV_isPage(url) {
		return 0 <= window.location.href.indexOf(url);
}

function VTGV_recupListe(destination = VTGV_destinationCourante){
// récupération de  liste des gares dans le tableau
	let trList = document.getElementById("portail").getElementsByTagName("tbody")[0].getElementsByTagName('tr');
	for (let tr of trList) {
		var objDestination = {};
		objDestination.nom = tr.childNodes[1].textContent;
		objDestination.x = tr.childNodes[3].textContent;
		objDestination.y = tr.childNodes[5].textContent;
		objDestination.n = tr.childNodes[7].textContent;
		objDestination.prix = tr.childNodes[9].textContent;
		//objDestination.distance = Math.max(Math.abs(objDestination.x - destination.x), Math.abs(objDestination.y - destination.y),Math.abs(objDestination.n - destination.n)) + Math.abs(objDestination.n - destination.n);
		objDestination.urlEmbarquer = tr.childNodes[13].innerHTML;
		VTGV_listeDestination.push(objDestination);
	}
	return VTGV_listeDestination;
}

function VTGV_updateDestinationEvent(e){
	VTGV_updateDestination(true);
}

function VTGV_updateDestination(refreshLimites=false){
	let destinationString = document.getElementById("destination").value;
	if(destinationString.length > 0) {
		let destinationArray = destinationString.match(/-?\d+/g);
		if (!destinationArray || destinationArray.length < 3) {
			alert('Il faut donner X, Y et N comme "Destination"');
		} else {
			VTGV_destinationCourante.x = destinationArray[0];
			VTGV_destinationCourante.y = destinationArray[1];
			VTGV_destinationCourante.n = destinationArray[2];
			VTGV_canevas.getContext('2d').clearRect(VTGV_multiplicateur * (parseInt(VTGV_maxXY)+1+parseInt(VTGV_destinationCourante.x)), VTGV_multiplicateur * (parseInt(VTGV_maxXY) + 1 - parseInt(VTGV_destinationCourante.y)), VTGV_multiplicateur, VTGV_multiplicateur);
			for (let gare of VTGV_listeDestination) {
				gare.distance = Math.max(Math.abs(gare.x - VTGV_destinationCourante.x), Math.abs(gare.y - VTGV_destinationCourante.y),(Math.abs(gare.n - VTGV_destinationCourante.n))) + Math.abs(gare.n - VTGV_destinationCourante.n);
			}
			VTGV_addGare(VTGV_destinationCourante, "green", "Triangle", false);
			VTGV_addGare(VTGV_origine, "red", "Cercle", true);
		}
	}
	if(refreshLimites) {
		VTGV_updateLimites();
	}

}

function VTGV_updateLimitesEvent(e){
	VTGV_updateLimites(true);
}

function VTGV_updateLimites(refreshDestination=false) {
	VTGV_canevas.getContext('2d').clearRect( 0 ,0 ,VTGV_multiplicateur * (VTGV_maxXY * 2 + 1),VTGV_multiplicateur * (VTGV_maxXY * 2 + 1));
	let destinationString = document.getElementById("destination").value;
		for (let gare of VTGV_listeDestination) {
				if((destinationString.length <=0 || parseInt(gare.distance,10) <= parseInt(document.getElementById("limitePA").value)) && parseInt(gare.prix)  <= parseInt(document.getElementById("limiteGG").value)) {
			VTGV_addGare(gare, "blue", "Rectangle", false);
		}
		else {
			VTGV_addGare(gare, "black", "Rectangle", true);
		}
		}
	VTGV_addGare(VTGV_origine, "red", "Cercle", true);
		VTGV_addGare(VTGV_destinationCourante, "green", "Triangle", false);
	if(refreshDestination) {
		VTGV_updateDestination();
	}
	VTGV_majDivListeDestinationOK();
}

function VTGV_majDivListeDestinationOK() {
	let divCible = document.getElementById("destinationCriteresOK");
	let destinationString = document.getElementById("destination").value;
	let cibleTexte = "";

	cibleTexte = '<table border="5px solid" bordercolor="green">';
	for (let gare of VTGV_listeDestination) {
		if((destinationString.length <=0 || parseInt(gare.distance,10) <= parseInt(document.getElementById("limitePA").value)) && parseInt(gare.prix)  <= parseInt(document.getElementById("limiteGG").value)) {
			cibleTexte += '<tr class="mh_tdpage"><td style="column-span:3">' + gare.nom + '</td><td>' + gare.urlEmbarquer + '</td></tr>';
			cibleTexte += '<tr class="mh_tdpage">';
			cibleTexte += '<td>X = ' + gare.x + ' | Y = ' + gare.y + ' | N = ' + gare.n;
			if(gare.hasOwnProperty('distance')) { cibleTexte += ' (dist : ' + gare.distance + ' pa)</td>'};
			cibleTexte += '<td>Prix = ' + gare.prix + '</td>';
			cibleTexte += '</tr>';
		}
	}
	cibleTexte += "</table>";
	divCible.innerHTML = cibleTexte;
}

function VTGV_compareGG (gare1, gare2) {
	if (parseInt(gare1.prix) < parseInt(gare2.prix)) {return -1;}
	if (parseInt(gare1.prix) > parseInt(gare2.prix)) {return 1;}
	return 0;
}

function VTGV_comparePA (gare1, gare2) {
	if (parseInt(gare1.distance) < parseInt(gare2.distance)) {return -1;}
	if (parseInt(gare1.distance) > parseInt(gare2.distance)) {return 1;}
	return 0;
}

function VTGV_trierListe(e){
	let destinationString = document.getElementById("destination").value;
	if(e.target.id == "triPA" && destinationString.length <= 0) { return;}
	if(e.target.id == "triPA") {VTGV_listeDestination.sort(VTGV_comparePA);}
	else if (e.target.id == "triGG") {VTGV_listeDestination.sort(VTGV_compareGG);}
	VTGV_majDivListeDestinationOK();
}

function VTGV_insertionTableau(){
// insertion des différents hamps utilisés
// point d'insertion (juste avant le tableau)
	let insertPoint =  document.getElementById("portail");

// insertion des champs X / Y / N de destination + du bouton MAJ
	let tableDestination = document.createElement("table");
	trDestination = tableDestination.insertRow();
	trDestination.class = "mh_tdpage";
	tdDestinationLabel = trDestination.insertCell();
	tdDestinationLabel.appendChild(document.createTextNode("Destination : "));

	tdDestination = trDestination.insertCell();
	inputDestination = document.createElement("input");
	inputDestination.type="text";
	inputDestination.id="destination";
	inputDestination.size=30;
	inputDestination.value="";
	tdDestination.appendChild(inputDestination);

// insertion des champs max du voyage (GG/PA)

		tdLimitesLabel = trDestination.insertCell();
		tdLimitesLabel.appendChild(document.createTextNode("Valeurs Max : "));
	tdlimitePA = trDestination.insertCell();
	tdlimitePA.appendChild(document.createTextNode("PA restant : "));
	inputPA = document.createElement("input");
		inputPA.type="text";
		inputPA.id="limitePA";
		inputPA.size=5;
		inputPA.value=25;
		tdlimitePA.appendChild(inputPA);

	tdlimitePA.appendChild(document.createTextNode(" GG : "));
	inputGG = document.createElement("input");
		inputGG.type="text";
		inputGG.id="limiteGG";
		inputGG.size=5;
		inputGG.value=500;
		tdlimitePA.appendChild(inputGG);

	tdDestinationValid = trDestination.insertCell();
	submitDestinationInput = document.createElement("button");
	submitDestinationInput.id="submitDestination";
	submitDestinationInput.innerHTML="Valider";
	submitDestinationInput.onclick=VTGV_updateDestination;
	tdDestinationValid.appendChild(submitDestinationInput);

	tableDestination = insertPoint.parentNode.insertBefore(tableDestination,insertPoint);

// critères de tris

	tdBoutonsTris = trDestination.insertCell();

		let triGG = document.createElement("button");
		triGG.id="triGG";
		triGG.innerHTML="Trier par co&ucirc;t";
		triGG.onclick=VTGV_trierListe;
		tdBoutonsTris.appendChild(triGG);

		let triPA = document.createElement("button");
		triPA.id="triPA";
		triPA.innerHTML="Trier par PA";
		triPA.onclick=VTGV_trierListe;
		tdBoutonsTris.appendChild(triPA);

// insertion du div globale
	let scriptDiv = document.createElement("div");
	scriptDiv.id="scriptDiv";
	scriptDiv = insertPoint.parentNode.insertBefore(scriptDiv,insertPoint);

// insertion de la zone d'affichage des infos des gares
	let infoDiv = document.createElement("div");
		infoDiv.id="infoDiv";
	infoDiv.style.display = "inline-block";
		infoDiv.style.float="left";
		infoDiv.style.overflow="visible";
		infoDiv.style.margin="20px";
		infoDiv = scriptDiv.insertBefore(infoDiv,scriptDiv.firstChild);

// insertion du div pour les gares correspondant aux critères

		let destinationCriteres = document.createElement("div");
	destinationCriteres.id="destinationCriteresOK";
	destinationCriteres.style.overflow="visible";
		destinationCriteres = infoDiv.insertBefore(destinationCriteres,infoDiv.firstChild);

// les tooltips

		let toolTip = document.createElement("div");
	toolTip.id="gareToolTip";
	toolTip.style.overflow="visible";
		toolTip = infoDiv.insertBefore(toolTip,destinationCriteres);

// affichage du canevas avec la carte du hall
	let canevasDiv = document.createElement("div");
	canevasDiv.id = "canevasDiv";
	canevasDiv.style.display = "inline-block";
	canevasDiv.style.float = "left";
	canevasDiv = scriptDiv.insertBefore(canevasDiv,scriptDiv.firstChild);

	VTGV_canevas = document.createElement("canvas");
	VTGV_canevas.id = "VTGV_canevas";
	VTGV_canevas.width = VTGV_multiplicateur * (VTGV_maxXY * 2 + 1);
	VTGV_canevas.height = VTGV_multiplicateur * (VTGV_maxXY * 2 + 1);
	VTGV_canevas.style.border = "1px solid #000";
	VTGV_canevas.style.display = "inline-block";
	VTGV_canevas.style.margin = "20px";
	VTGV_canevas = canevasDiv.insertBefore(VTGV_canevas,canevasDiv.firstChild);
	VTGV_canevas.addEventListener("mousemove", VTGV_gererToolTip);
	VTGV_canevas.addEventListener("click", VTGV_gererToolTip);
}

function VTGV_addGare(objetGare, couleurPoint, formePoint, rempli){
	let contextTGV = VTGV_canevas.getContext('2d');
	contextTGV.fillStyle = couleurPoint;
	contextTGV.strokeStyle = couleurPoint;
	contextTGV.lineWidth = 1;

	contextTGV.beginPath();
	if(formePoint == "Rectangle" && rempli ){
		contextTGV.rect(VTGV_multiplicateur * (parseInt(VTGV_maxXY)+1+parseInt(objetGare.x)), VTGV_multiplicateur * (parseInt(VTGV_maxXY) + 1 - parseInt(objetGare.y)), VTGV_multiplicateur, VTGV_multiplicateur);
	}
	else if (formePoint == "Rectangle" && !rempli) {
		contextTGV.strokeRect(VTGV_multiplicateur * (parseInt(VTGV_maxXY)+1+parseInt(objetGare.x)), VTGV_multiplicateur * (parseInt(VTGV_maxXY) + 1 - parseInt(objetGare.y)), VTGV_multiplicateur, VTGV_multiplicateur);
	}
	else if (formePoint == "Cercle") {
		centreX = VTGV_multiplicateur * (parseInt(VTGV_maxXY,10) + 1 + parseInt(objetGare.x,10)) + VTGV_multiplicateur / 2;
		centreY = VTGV_multiplicateur * (parseInt(VTGV_maxXY,10) + 1 - parseInt(objetGare.y,10)) + VTGV_multiplicateur / 2;
		contextTGV.arc(centreX, centreY, VTGV_multiplicateur/2, 0, 2 * Math.PI);
	}
	else if (formePoint == "Triangle") {
		xPoint1 = VTGV_multiplicateur * (  parseInt(VTGV_maxXY,10) + parseInt(objetGare.x,10) + 0 ) + 1 ;
		yPoint1 = VTGV_multiplicateur * (  parseInt(VTGV_maxXY,10) - parseInt(objetGare.y,10) + 2 ) + 1 ;
		xPoint2 = VTGV_multiplicateur * (  parseInt(VTGV_maxXY,10) + parseInt(objetGare.x,10) + 2 ) + 1 ;
		yPoint2 = VTGV_multiplicateur * (  parseInt(VTGV_maxXY,10) - parseInt(objetGare.y,10) + 2 ) + 1 ;
		xPoint3 = VTGV_multiplicateur * (  parseInt(VTGV_maxXY,10) + parseInt(objetGare.x,10) + 1 ) + 1 ;
		yPoint3 = VTGV_multiplicateur * (  parseInt(VTGV_maxXY,10) - parseInt(objetGare.y,10) + 0 ) + 1 ;
		contextTGV.moveTo(xPoint1,yPoint1);
		contextTGV.lineTo(xPoint2,yPoint2);
		contextTGV.lineTo(xPoint3,yPoint3);
		contextTGV.closePath();
	}
	contextTGV.stroke();
	if(rempli) {
		contextTGV.fill();
	}
}

function VTGV_gererToolTip(e) {
	let toolTip = document.getElementById("gareToolTip");
	let eventType = e.type;
	let coordonnesCanevas = VTGV_canevas.getBoundingClientRect();
	let coordonneesObjet = {"x" : Math.floor((e.clientX - coordonnesCanevas.left)/VTGV_multiplicateur - parseInt(VTGV_maxXY) -1), "y" : Math.floor(-((e.clientY - coordonnesCanevas.top)/VTGV_multiplicateur - parseInt(VTGV_maxXY) -2 ))};
	listeGares = VTGV_recupGareParCoordonneesXY(coordonneesObjet.x,coordonneesObjet.y);

	document.getElementById("canevasDiv").title = "X = " + coordonneesObjet.x + " | Y = " + coordonneesObjet.y ;

	if(eventType=="click") {
		if(listeGares.length == 0 ) {
			document.getElementById("destination").value = "X = " + coordonneesObjet.x + " | Y = " + coordonneesObjet.y + " | N = " + VTGV_destinationCourante.n ;
			document.getElementById("submitDestination").click();
		}
		if( toolTip.innerHTML != "" && !VTGV_fixToolTip) {
			VTGV_fixToolTip = true; return;
		}
		else {
			if (toolTip.innerHTML != "" && VTGV_fixToolTip) {
				toolTip.innerHTML = "";VTGV_fixToolTip = false; return;
			}
		}
	}
	else if(eventType=="mousemove" &&  !VTGV_fixToolTip ) {
		if(listeGares.length > 0) {
			let tooTipText = "";
			tooTipText = '<table border="5px solid" bordercolor="red">';
			for (let gare of listeGares) {
				tooTipText += '<tr class="mh_tdpage"><td style="column-span:3">' + gare.nom + '</td><td>' + gare.urlEmbarquer + '</td></tr>';
				tooTipText += '<tr class="mh_tdpage">';
				tooTipText += '<td>X = ' + gare.x + ' | Y = ' + gare.y + ' | N = ' + gare.n;
				if(gare.hasOwnProperty('distance')) { tooTipText += ' (dist : ' + gare.distance + ' pa)</td>'};
				tooTipText += '<td>Prix = ' + gare.prix + '</td>';
				tooTipText += '</tr>';

			}
			tooTipText += "</table>";
			toolTip.innerHTML = tooTipText;
		}
		else {
			toolTip.innerHTML = "";
		}
	}
}

function VTGV_recupGareParCoordonneesXY(x,y){
	let listeGares = [];
	 for (let destination of VTGV_listeDestination) {
		if (destination.x == x && destination.y == y) listeGares.push(destination);
	}
	return listeGares;
}

if(VTGV_isPage("mountyhall/MH_Lieux/Lieu_Portail.php")){
	let trollCourant = localStorage.getItem("NUM_TROLL");
	let clePositionX = trollCourant+".position.X";
	let clePositionY = trollCourant+".position.Y";
	VTGV_origine = {"x":localStorage.getItem(clePositionX), "y":localStorage.getItem(clePositionY), "n" : localStorage.getItem(trollCourant+".position.N")};

	VTGV_recupListe();
	VTGV_insertionTableau();
	VTGV_listeDestination.sort(VTGV_compareGG);
	VTGV_updateDestination(true);

}
