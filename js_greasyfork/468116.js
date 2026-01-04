// ==UserScript==
// @name         ParcourSup Obfuscate
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Cache les informations sensibles de l'onglet "Admissions" à l'écran (nom, prénom, établissements, formation ..), permet de screen sans divulguer d'infos perso
// @author       ypetit
// @license      GNU GPLv3
// @match        https://dossierappel.parcoursup.fr/Candidat/authentification
// @match        https://dossierappel.parcoursup.fr/Candidat/admissions?ACTION=0
// @match        https://dossier.parcoursup.fr/Candidat/authentification
// @match        https://dossier.parcoursup.fr/Candidat/admissions?ACTION=0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parcoursup.fr
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468116/ParcourSup%20Obfuscate.user.js
// @updateURL https://update.greasyfork.org/scripts/468116/ParcourSup%20Obfuscate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".psup-user-menu-btn--logged").innerHTML = "&lt;Prénom NOM&gt;";
    document.querySelectorAll(".psup-wish-card__school").forEach(e => {e.innerHTML = "&lt;Ecole/Université&gt;";});
    document.querySelectorAll(".psup-wish-card__course").forEach(e => {e.innerHTML = "&lt;Formation&gt;";});
    document.querySelectorAll("#parcoursimple tbody td:first-child").forEach(e => {e.innerHTML = "&lt;Ecole/Université&gt;";});
    document.querySelectorAll("#parcoursimple tbody td:nth-child(2)").forEach(e => {e.innerHTML = "&lt;Formation&gt;";});

    GM_addStyle ( `
        input.fr-input, .psup-user-menu-btn--logged, .psup-wish-card__school, .psup-wish-card__course, #parcoursimple tbody td:first-child, #parcoursimple tbody td:nth-child(2) {
            color: transparent;
            text-shadow: 0 0 10px #000;
        }
    ` );

    function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce) {
        let btargetsFound;
        const targetNodes = document.querySelectorAll(selectorTxt);
        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            // Found target node(s).  Go through each and act if they are new.
            targetNodes.forEach((e) => {
                const jThis = e;
                if (!jThis.alreadyFound) {
                    //--- Call the payload function.
                    if (actionFunction(jThis)) btargetsFound = false;
                    else jThis.alreadyFound = true;
                }
            } );
        } else btargetsFound = false;
        //--- Get the timer-control variable for this selector.
        const controlObj = waitForKeyElements.controlOb || {};
        const controlKey = selectorTxt.replace(/\W/g, "_");
        const timeControl = controlObj[controlKey];
        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        }
        else if (!timeControl) {
            controlObj[controlKey] = setInterval(() => waitForKeyElements(selectorTxt, actionFunction, bWaitOnce), 100);
        }
        waitForKeyElements.controlObj = controlObj;
    }

    function blur(jNode) {
        jNode.style.color = "transparent";
        jNode.style["text-shadow"] = "0 0 10px #000";
    }

    waitForKeyElements(".psup-user-menu-btn--logged", blur, true);
    waitForKeyElements("ul.fr-menu__list li p", blur, true);

})();