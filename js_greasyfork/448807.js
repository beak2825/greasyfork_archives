// ==UserScript==
// @name        Recherche automatique tout les departement - permisdeconduire.gouv.fr
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       https://candidat.permisdeconduire.gouv.fr/reservation
// @grant       none
// @version     1.2
// @author      Hoax017
// @description Recherche automatique de places d'examen sur candidat.permisdeconduire.gouv.fr
// @downloadURL https://update.greasyfork.org/scripts/448807/Recherche%20automatique%20tout%20les%20departement%20-%20permisdeconduiregouvfr.user.js
// @updateURL https://update.greasyfork.org/scripts/448807/Recherche%20automatique%20tout%20les%20departement%20-%20permisdeconduiregouvfr.meta.js
// ==/UserScript==

const algo = async (elem) => {
    for (let departement = 1; departement < 96; departement++) {
        await new Promise((resolve, reject) => setTimeout(resolve, 1000))
        const res = await fetch(`https://candidat.permisdeconduire.gouv.fr/api/v1/candidat/creneaux?code-departement=0${departement < 10 ? "0" : ""}${departement}`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "fr,en;q=0.5",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            "method": "GET",
            "mode": "cors"
        });
        const json = await res.json()
        if (res.ok) {
            if (Array.isArray(json) && json.length) {
                elem.innerHTML += `<br>OMG LE DEPARTEMENT ${departement} A DES PLACES :<br>`
                for (const row of json) {
                    for (const creneau of row.creneaux) {
                        const date = new Date(creneau.dateDebut)
                        elem.innerHTML += ` --> A ${row.centre.nom} le ${date.toLocaleDateString("fr")} a ${date.getHours()}h${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}<br><br>`
                    }
                }
            } else {
                elem.innerHTML += `${departement} pas de place<br>`
            }
        } else {
            elem.innerHTML += `${departement} ${json.message}<br>`
        }
    }
}

setTimeout(() => {
  const text = document.createElement("div")
  document.querySelector("form").appendChild(text)
  algo(text)
}, 3000)