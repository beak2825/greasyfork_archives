// ==UserScript==
// @name        Recherche automatique tout les departement - beta.interieur.gouv.fr/candilib
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       https://beta.interieur.gouv.fr/candilib/candidat/home
// @grant       none
// @version     1.0
// @author      Hoax017
// @description Recherche automatique de places d'examen sur beta.interieur.gouv.fr/candilib
// @downloadURL https://update.greasyfork.org/scripts/448809/Recherche%20automatique%20tout%20les%20departement%20-%20betainterieurgouvfrcandilib.user.js
// @updateURL https://update.greasyfork.org/scripts/448809/Recherche%20automatique%20tout%20les%20departement%20-%20betainterieurgouvfrcandilib.meta.js
// ==/UserScript==

const algo = async (elem) => {
    elem.innerHTML += `RECHERCHE...<br>`
    const token = localStorage.token;
    const userInfos = JSON.parse(atob(localStorage.token.split(".")[1])) 

    for (let departement = 1; departement < 96; departement++) {
        const res = await fetch(`https://beta.interieur.gouv.fr/candilib/api/v2/candidat/centres?departement=${departement}&end=2022-11-30T23%3A59%3A59.999%2B01%3A00`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0",
                "Accept": "*/*",
                "Accept-Language": "fr,en;q=0.5",
                "Content-Type": "application/json",
                "X-USER-ID": userInfos.id,
                "X-REQUEST-ID": "0f55cc59-0d30-45cb-a3fd-c7825b65d0f8",
                "X-CLIENT-ID": "841f7d44-a213-4ef1-9b86-9e810f0c04fa.2.12.11-beta1.",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Authorization": `Bearer ${token}`
            },
            "referrer": `https://beta.interieur.gouv.fr/candilib/candidat/${departement}/selection/selection-centre`,
            "method": "GET",
            "mode": "cors"
        });
        const json = await res.json()
        if (res.ok) {
            if (Array.isArray(json) && json.length) {
                for (const row of json) {
                    if (row.count) {
                        elem.innerHTML += `OMG LE CENTRE ${row.centre.nom} A ${row.count} PLACES<br>`
                    } else {
                        elem.innerHTML += `${row.centre.nom} (${departement}) pas de place<br>`
                    }
                }
            } else {
                console.log(`${departement} pas de centre`)
            }
        } else {
            elem.innerHTML += `${departement} ${json.message}<br>`
        }
    }
}


setTimeout(() => {
  const text = document.createElement("div")
  document.querySelector("div.text-center.col-gray.pa-1").appendChild(text) 
  algo(text)
}, 3000)