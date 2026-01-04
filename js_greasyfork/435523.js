// ==UserScript==
// @name         Mozaik notifications
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Display notifications when new results are on Mozaik portail
// @author       You
// @match        https://mozaikportail.ca/
// @icon         https://www.google.com/s2/favicons?domain=mozaikportail.ca
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/435523/Mozaik%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/435523/Mozaik%20notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getFavicon(){
        var favicon;
        var nodeList = document.getElementsByTagName("link");
        for (var i = 0; i < nodeList.length; i++)
        {
            if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
            {
                favicon = nodeList[i].getAttribute("href");
            }
        }
        return favicon;
    }
    let favIcon = getFavicon();
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function checkIfNew(date) {
        let lastChecked = getCookie("lastChecked");
        if (lastChecked != "") {
            let examDate = new Date(date);
            if (examDate.getTime()>lastChecked) {
                return true;
            }
        } else {
            const currentDate = new Date();
            setCookie("lastChecked", currentDate.getTime(), 30);

        }
        return false;
    }
    function getDates(response) {
        response.forEach(function(elem){if(checkIfNew(elem.dateHeureMajResultat) == true) {
            const options = {
                body: elem.descriptionTravail+"\nRésultat: "+elem.resultat.valeur+"/"+elem.resultat.noteMaximale+" ("+Math.round((elem.resultat.valeur/elem.resultat.noteMaximale)*100)+"%)\nMoyenne: "+elem.resultat.moyenne+"/"+elem.resultat.noteMaximale+" ("+Math.round((elem.resultat.moyenne/elem.resultat.noteMaximale)*100)+"%)",
                icon: favIcon,
                badge: favIcon
            };
            new Notification(elem.descriptionMatiere, options);
        }
                                       });
        const currentDate = new Date();
        setCookie("lastChecked", currentDate.getTime(), 30);
        setTimeout(getResults, 60000);
    }
    function getResults() {
        unsafeWindow.obtenirDonneeServeur("https://apiaffaires.mozaikportail.ca/api/evaluation/resultats/"+unsafeWindow.mozaikApplication.bd.utilisateur.identite.eleve.profils[0].codeEtablissementEnseignement+"/anneeCourante/eleves/"+unsafeWindow.mozaikApplication
.bd.utilisateur.identite.eleve.profils[0].fiche+"/travaux/visibleParentEleve", unsafeWindow.authentification.jeton.id_token, elem => getDates(JSON.parse(elem)));
    }
    function waitForLoaded() {
        try {
            unsafeWindow.authentification.jeton.id_token;
            getResults();
        } catch {
            setTimeout(waitForLoaded, 1000);
        }
    }
    if (Notification.permission != "granted") Notification.requestPermission();
    waitForLoaded();

})();