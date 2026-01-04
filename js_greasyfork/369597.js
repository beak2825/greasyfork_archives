// ==UserScript==
// @name         [Mountyhall] Bulles et Couleurs
// @namespace    Mountyhall
// @description  infobulles et couleurs sur les trolls, monstres, lieux, trésors
// @author       Zul
// @version      0.1.0.8
// @include      *MH_Play*
// @downloadURL https://update.greasyfork.org/scripts/369597/%5BMountyhall%5D%20Bulles%20et%20Couleurs.user.js
// @updateURL https://update.greasyfork.org/scripts/369597/%5BMountyhall%5D%20Bulles%20et%20Couleurs.meta.js
// ==/UserScript==

/*
 * Script MZ : [Mountyhall] Bulles et Couleurs
 */

// renseigner ci-dessous l'url du gdoc
// exemple : var urlgdoc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRCPNmwF7EKLtF-oGPVOWmfwqbFESdaFay77dP16t7whYyRDH3TVU4ayIpoRIaPDL3v7MPZJ-UXNB_/pub?gid=0&single=true&output=tsv";
// le gdoc doit comporter 3 colonnes : id, texte de la bulle, couleur
// il doit être publié en .tsv
var urlgdoc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRF1ZGy-O4m3ttVTqi_DZ7I-5oRRU4nLN6c2H2Mel3TZb5YlmuOIK4LrpXfgy7bX02Qi1ndKIIMNtjB/pub?gid=183998581&single=true&output=tsv";
var bullesEtCouleurs = {};


// rajoute un bouton sur la page pour updater les donnees depuis google
function addButton() {
	// get the div "MA VUE"
	var targetDiv = document.getElementsByClassName('Titre2');

	// create new div
	var newDiv = document.createElement('div');
	newDiv.setAttribute('id', 'maj_atk');
	newDiv.setAttribute("align", "center");

	// create button
	var inputButton = document.createElement('input');
	inputButton.name = 'maj_atk';
	inputButton.id = 'maj_atk';
	inputButton.type = 'button';
	inputButton.value = 'MAJ INFOS';
	// register from mouse click on button
	inputButton.addEventListener("click", getData, true);

	//add button to div
	newDiv.appendChild(inputButton);

	//append div
	targetDiv[0].appendChild(newDiv);
}

// recupere les donnees depuis google et les stocke dans le browser
function getData() {

    const req = new XMLHttpRequest();

    req.onreadystatechange = function(event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
           if (req.status === 200) {
               console.log("Réponse reçue: %s", req.responseText);
           } else {
               console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
           }

           saveTrolls(req.responseText);
        }
    };

    req.open('GET', urlgdoc, true);
    req.setRequestHeader('Cache-Control', 'no-cache');
    req.send();

	decorateVue();
	location.reload(true);
}

// parse les donnees et les stocke
function saveTrolls(text) {

	//split by lines
	var lines = text.match(/[^\r\n]+/g);
    window.localStorage.removeItem("bullesEtCouleurs");

	for (var i = 0; i < lines.length; i++) {

		// split line by tab (ie : 49044	description)
		var info = lines[i].split('\t');

		// save troll description
		bullesEtCouleurs[info[0]] = {
            description : info[1],
            couleur :     info[2]};


	}
    window.localStorage.setItem("bullesEtCouleurs", JSON.stringify(bullesEtCouleurs));
}

// ajoute sur la page vue les donnees stockees
function decorateVue() {
    let bullesEtCouleursJSON = window.localStorage.getItem("bullesEtCouleurs");
    let bullesEtCouleurs = bullesEtCouleursJSON ? JSON.parse(bullesEtCouleursJSON) : null;

    var trolls = document.getElementById("VueTROLL").getElementsByClassName("mh_tdpage");
	for (var i = 0; i < (trolls.length); i++) {
		// numeros cliquables
		var num = trolls[i].childNodes[2];

		// aa partielle en infobulle
		if ( num.textContent in bullesEtCouleurs) {
            num.title = bullesEtCouleurs[num.textContent].description;

            var couleur = bullesEtCouleurs[num.textContent].couleur;

            if (couleur != "") {
                trolls[i].style.background = couleur;
            }
        }
	}

    var monstres = document.getElementById("VueMONSTRE").getElementsByClassName("mh_tdpage");
	for (i = 0; i < (monstres.length); i++) {
		num = monstres[i].childNodes[2];

        if ( num.textContent in bullesEtCouleurs) {

            num.title = bullesEtCouleurs[num.textContent].description;

            couleur = bullesEtCouleurs[num.textContent].couleur;

            if (couleur != "") {
                monstres[i].style.background = couleur;
            }
        }
	}
}

function decorateEvents() {

	var bullesEtCouleurs = window.localStorage.getItem("bullesEtCouleurs");
    var trolls = document.getElementsByClassName('mh_trolls_1');
	for (var i = 0; i < trolls.length; i++) {

		// ATTENTION sur ce lien y a des quotes !!
		// transform javascript:EPV('29930') in 29930
		var id = trolls[i].href.replace("javascript:EPV('", "").replace("')", "");

		trolls[i].title = bullesEtCouleurs[id].description;
	}
}

function decorateFollowers() {

	var bullesEtCouleurs = window.localStorage.getItem("bullesEtCouleurs");
    var followers = document.getElementsByClassName("mh_titre3");
	for (var i = 0; i < followers.length; i++) {

        var id = followers[i].getElementsByTagName('a')[0].getAttribute('href').replace("../MH_Follower/FO_Profil.php?ai_IdFollower=", "");
        followers[i].title = bullesEtCouleurs[id].description;

        var couleur = bullesEtCouleurs[id].couleur;

		if (couleur != "") {
			followers[i].style.background = couleur;
        }
	}
}

function decorateProfil() {

    var bullesEtCouleurs = window.localStorage.getItem("bullesEtCouleurs");
	// CSS avancee
	if (document.getElementById("ai_IDPJ")) {
		var id = document.getElementById("ai_IDPJ").value;
		var ul = document.getElementById("pjLinks");
		var li = document.createElement("li");
		var url = bullesEtCouleurs[id].couleur;
		li.innerHTML="<a href='"+ url +"' target='_blank'>Infobulle</a>";
		ul.appendChild(li);
	}
	// CSS base
	else {
		id = document.getElementsByName("ai_IDPJ")[0].value;
		var td = document.getElementsByClassName('mh_links')[0].parentNode;
		var link = document.createElement('a');
		var text = document.createTextNode("Infobulle");
		link.appendChild(text);
		link.href = bullesEtCouleurs[id].couleur;
		link.target = "_blank";
		link.className = "mh_links";
		td.appendChild(link);
	}
}



function isPage(url) {
	return window.location.pathname.indexOf("/mountyhall/"+url) == 0;
}

try
{
    if (isPage("MH_Play/Play_vue.php")) {
		addButton();
		decorateVue();
	}

	if (isPage("MH_Play/Play_evenement.php") || isPage("View/PJView_Events.php")) {
		decorateEvents();
	}

	if (isPage("View/PJView_Events.php") || isPage("View/PJView.php")) {
		decorateProfil();
	}

    if (isPage("MH_Play/Play_e_follo.php")) {
		addButton();
        decorateFollowers();
	}


}
catch(e)
{
	alert(e);
}