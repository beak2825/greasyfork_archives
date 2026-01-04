// ==UserScript==
// @name         Attestation pré-remplie Covid-19
// @author       RandomUsername404
// @namespace    https://greasyfork.org/en/users/105361-randomusername404
// @version      1.2
// @description  Pré-remplissage de l'attestation de sortie Covid-19.
// @run-at       document-start
// @include      https://media.interieur.gouv.fr/deplacement-covid-19/
// @grant        none
// @icon         https://media.interieur.gouv.fr/deplacement-covid-19/apple-touch-icon.5a6bc1a9.png
// @downloadURL https://update.greasyfork.org/scripts/400103/Attestation%20pr%C3%A9-remplie%20Covid-19.user.js
// @updateURL https://update.greasyfork.org/scripts/400103/Attestation%20pr%C3%A9-remplie%20Covid-19.meta.js
// ==/UserScript==

var nom, prenom, dateNaissance, villeNaissance, adresse, ville, zipcode;

// Variable locale de vérification si l'utilisateur fait une erreur de saisie
if(localStorage.getItem("erreur") == null) {
	localStorage.setItem("erreur", 0);
}


// Vérifie si les données de l'utilisateur existent en mémoire, sinon les demande
if (localStorage.getItem("nom") == null) {
    nom = prompt("Nom de famille :", "Dupont");
    if (nom == null || nom == "") {
        malRempli();
    } else {
        localStorage.setItem("nom", nom);
    }
} else {
    document.getElementById('field-lastname').value = localStorage.getItem("nom");
}

if (localStorage.getItem("prenom") == null) {
    prenom = prompt("Prénom :", "Jean");
    if (prenom == null || prenom == "") {
        malRempli();
    } else {
        localStorage.setItem("prenom", prenom);
    }
} else {
    document.getElementById('field-firstname').value = localStorage.getItem("prenom");
}

if (localStorage.getItem("dateNaissance") == null) {
    dateNaissance = prompt("Date de naissance (au format jj/mm/aaaa) :", "01/01/1970");
    if ((dateNaissance == null || dateNaissance == "") || dateNaissance.length != 10) {
        malRempli();
    } else {
        localStorage.setItem("dateNaissance", dateNaissance);
    }
} else {
    document.getElementById('field-birthday').value = localStorage.getItem("dateNaissance");
}

if (localStorage.getItem("villeNaissance") == null) {
    villeNaissance = prompt("Lieu de naissance :", "Lyon");
    if (villeNaissance == null || villeNaissance == "") {
        malRempli();
    } else {
        localStorage.setItem("villeNaissance", villeNaissance);
    }
} else {
    document.getElementById('field-lieunaissance').value = localStorage.getItem("villeNaissance");
}

if (localStorage.getItem("adresse") == null) {
    adresse = prompt("Adresse :", "999 avenue de France");
    if (adresse == null || adresse == "") {
        malRempli();
    } else {
        localStorage.setItem("adresse", adresse);
    }
} else {
    document.getElementById('field-address').value = localStorage.getItem("adresse");
}

if (localStorage.getItem("ville") == null) {
    ville = prompt("Ville de résidence :", "Paris");
    if (ville == null || ville == "") {
        malRempli();
    } else {
        localStorage.setItem("ville", ville);
    }
} else {
    document.getElementById('field-town').value = localStorage.getItem("ville");
}

if (localStorage.getItem("zipcode") == null) {
    zipcode = prompt("Code postal :", "75001");
    if (zipcode == null || zipcode == "") {
        malRempli();
    } else {
        localStorage.setItem("zipcode", zipcode);
        window.location.reload();
    }
} else {
    document.getElementById('field-zipcode').value = localStorage.getItem("zipcode");
}

// Lorsque la page est chargée...
window.addEventListener('load', function() {

	// Vérifie si l'utilisateur n'a pas fait une erreur de saisie
	// Si oui, on recharge la page pour la remplir correctement
    if (localStorage.length == 8 && localStorage.getItem("erreur") == 1) {
    	localStorage.setItem("erreur", 0);
    	window.location.reload();
    }
	// Si non, on met en page les choix de la checkbox et demandons à l'utilisateur de sélectionner les motifs qu'il souhaite
    else {
        alert("Choississez votre/vos motifs de sortie et renseignez l'heure de sortie.");

        document.getElementById("checkbox-travail").nextElementSibling.insertAdjacentHTML("afterbegin", "<span style='font-size: 25px;'> 👩‍🏭 </span>");
        document.getElementById("checkbox-courses").nextElementSibling.insertAdjacentHTML("afterbegin", "<span style='font-size: 25px;'> 🍎 </span>");
        document.getElementById("checkbox-sante").nextElementSibling.insertAdjacentHTML("afterbegin", "<span style='font-size: 25px;'> 💊 </span>");
        document.getElementById("checkbox-famille").nextElementSibling.insertAdjacentHTML("afterbegin", "<span style='font-size: 25px;'> 👨‍👨‍👦‍👦 </span>");
        document.getElementById("checkbox-sport").nextElementSibling.insertAdjacentHTML("afterbegin", "<span style='font-size: 30px;'> 🏋🏽‍♂️</span><span style='font-size: 25px;'>🐶 </span>");
        document.getElementById("checkbox-judiciaire").nextElementSibling.insertAdjacentHTML("afterbegin", "<span style='font-size: 28px;'> 👨🏻‍⚖️ </span>");
        document.getElementById("checkbox-missions").nextElementSibling.insertAdjacentHTML("afterbegin", "<span style='font-size: 26px;'> 🤦🏼‍♂️ </span>");

        document.styleSheets[0].insertRule('input[type="checkbox" i] { transform: scale(2); margin-top: 14px;}', 1);

        document.getElementById("checkbox-travail").parentNode.previousElementSibling.scrollIntoView();
    }

    // Ajoute un bouton pour supprimer les informations personnelles de l'utilisateur de la mémoire
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Reset vos infos";
    btn.classList.add("btn", "btn-attestation");
    btn.style.margin = "auto";
    btn.style.display = "block";
    btn.addEventListener("click", viderInfos, false);
    document.getElementById("form-profile").appendChild(btn);
})

// Fonction en cas d'erreur de saisie qui forcera un rechargement pour récupérer l'info ayant été mal saisie
function malRempli() {
	localStorage.setItem("erreur", 1);
    if (confirm("Veuillez remplir vos informations correctement SVP.")) {
        window.location.reload();
    } else {
        window.location.reload();
    }
}

// Fonction pour vider les infos de l'utilisateur de la mémoire
function viderInfos(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
}