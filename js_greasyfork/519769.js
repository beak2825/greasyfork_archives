// ==UserScript==
// @name         Calcule moyenne générale sur pronote
// @namespace    http://tampermonkey.net/
// @version      2024-12-04-4
// @description  Permet de calculer la moyenne générale sur la vue pronote => notes => par matière
// @author       Simon TREMBLAY / Filipe PINTO
// @match        https://*.index-education.net/pronote/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=index-education.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519769/Calcule%20moyenne%20g%C3%A9n%C3%A9rale%20sur%20pronote.user.js
// @updateURL https://update.greasyfork.org/scripts/519769/Calcule%20moyenne%20g%C3%A9n%C3%A9rale%20sur%20pronote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        const avgButton = document.createElement("a")
        avgButton.textContent = "📈"
        avgButton.href="javascript:patate()"
        avgButton.target="_self"
        avgButton.title="Calculer la moyenne générale"
        avgButton.style.fontSize = "20px"

        const parentElement = Array.from(document.getElementsByClassName("objetBandeauEntete_boutons"))[0]
        parentElement.append(avgButton)

    }, 5000)
})();

window.patate = ()=>{
    const elements = Array.from(document.getElementsByClassName("ie-titre-gros"))
                        .filter(note => note.textContent.match(/\d+,\d+/));

    if(elements.length===0){
        alert("Vous n'êtes pas sur la page '[Notes] -> [Par matière]', impossible de calculer la moyenne générale 🤔")
    }else{
        alert("🪄 Moyenne générale : " + Math.round(elements.map(note => (Number(note.textContent.replace(",", ".")))).reduce((prev, current) => prev + current) / (Array.from(document.getElementsByClassName("ie-titre-gros")).length/2)*100)/100)
    }

}