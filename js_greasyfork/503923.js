// ==UserScript==
// @name            Un bouton Déconnexion pour le menu de l'espace adhérent La Contre-Voie (42l)
// @name:en         Logout button for La Contre-Voie (42l) member area menu

// @version         1.0.2
// @author          Fagus Sylvatica
// @grant           none
// @namespace       https://greasyfork.org/
// @license         WTFPL

// @description     Ajoute un bouton de déconnexion dans le menu des pages de l'espace adhérent https://member.lacontrevoie.fr/*
// @description:en  Adds a logout button to the member area menu pages https://member.lacontrevoie.fr/*

// @match           https://member.lacontrevoie.fr/*
// @exclude         https://member.lacontrevoie.fr/Login*
// @exclude         https://member.lacontrevoie.fr/Connexion*
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/503923/Un%20bouton%20D%C3%A9connexion%20pour%20le%20menu%20de%20l%27espace%20adh%C3%A9rent%20La%20Contre-Voie%20%2842l%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503923/Un%20bouton%20D%C3%A9connexion%20pour%20le%20menu%20de%20l%27espace%20adh%C3%A9rent%20La%20Contre-Voie%20%2842l%29.meta.js
// ==/UserScript==


if( document.getElementById("logout-menu-button-1") == null ) {
    let data = {
        "en" : {
            "matchStr": "/Member-area",
            "titleHRef" : "Logout",
        },
        "fr" : {
            "matchStr": "/Espace-adhérent",
            "titleHRef" : "Déconnexion",
        }
    }
    let collection = document.getElementsByClassName("is-vcentered");
    for (i = 0; i < collection.length; i++) {
        let item = collection.item(i);
        let innerContent = item.innerHTML;
        let lang = "";
        if( innerContent.includes(data.en.matchStr) ) lang = "en";
        else if( innerContent.includes(data.fr.matchStr) ) lang = "fr";
        else continue;
        item.innerHTML += '<a id="logout-menu-button-1" class="button logout is-dark-blue" title="' +
        data[lang]["titleHRef"] + '" href="/logout" alt="' + data[lang]["titleHRef"] + '">' +
        '<svg width="29" height="29" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><title>' +
        data[lang]["titleHRef"] + '</title><path d="M15 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3.063M11 12h10m0 0-2.5-2.5M21 12l-2.5 2.5" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</a>';
        break;
    }
}
