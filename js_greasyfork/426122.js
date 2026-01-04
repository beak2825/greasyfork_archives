// ==UserScript==
// @name         SNCF TrainIdentifier
// @namespace    https://greasyfork.org/en/scripts/426122-sncf-trainidentifier
// @version      0.5
// @description  Permet de trouver les modèles de trains sur la carte SNCF
// @author       luclu7
// @match        https://sncf-maps.hafas.de/maps-ng/?language=fr_FR
// @icon         https://sncf-maps.hafas.de/maps-ng/img/build/customer/apple-touch-icon-144x144-precomposed.png?v=1.0.4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426122/SNCF%20TrainIdentifier.user.js
// @updateURL https://update.greasyfork.org/scripts/426122/SNCF%20TrainIdentifier.meta.js
// ==/UserScript==

const listOfRegex = [
    {
        regex: /(?:B8[1-2][5-8][0-9][0-9]|X76[5-8][0-9][0-9]|Z27[5-9][0-9][0-9])$/,
        model: "AGC"
    },
    {
        regex: /(?:Z315[0-9][0-9]|Z51[5-6][0-9][0-9]|Z549[0-9][0-9]|B835[0-9][0-9]|B84[5-7][0-9][0-9]|B859[0-1][0-9])$/,
        model: "Régiolis"
    },
    {
        regex: /B850[0-9][0-9]$/,
        model: "Coradia Liner"
    },
    {
        regex: /(?:Z55[5-8][0-9][0-9]|Z563[0-9][0-9]|Z565[0-9][0-9]|Z57[0-2][0-9][0-9])/,
        model: "Regio2N"
    },
    {
        regex: /(?:Z566[0-9][0-9]|Z567[0-9][0-9])/,
        model: "Omneo Premium"
    },
    {
        regex: /Z21[5-7][0-9][0-9]$/,
        model: "ZTER"
    },
    {
        regex: /Z235[0-9][0-9]$/,
        model: "TER 2N PG"
    },
    {
        regex: /(?:Z24[5-7][0-9][0-9]|Z26[5-9][0-9][0-9])$/,
        model: "TER 2N NG"
    },
    {
        regex: /X72[5-7][0-9][0-9]$/,
        model: "XTER"
    },
    {
        regex: /X73[5-9][0-9][0-9]$/,
        model: "ATER"
    },
    {
        regex: /(?:Z115[0-2][0-9]|Z96[0-3][0-9]|Z95[0-1][0-9]|Z9958[1-2]|Z75[0-1][0-9]|Z73[0-7][0-9]|Z9738[1-4])$/,
        model: "Z2"
    },
    {
        regex: /(?:U525[0-9][0-9]|U535[0-9][0-9]|U536[0-9][0-9]|U537[0-9][0-9]|U538[0-9][0-9])$/,
        model: "Citadis Dualis"
    }
]

function getTrainModel(trainSerial) {
    let matchedModel = "";
    listOfRegex.forEach(regexItem => {
        if(regexItem.regex.test(trainSerial)){
            matchedModel = regexItem.model;
        }
    })
    return matchedModel;
}

window.identifyTrain = async () => {
    if(document.getElementsByClassName("hfs_tqTopLabel").length>0){
        let trainNumber = document.getElementsByClassName("hfs_tqTopLabel")[0].childNodes[1].textContent.match(/[0-9]{1,6}/)[0]
        let parsedDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000))
            .toISOString()
            .split("T")[0];
        const response = await fetch(`https://compo.luc.ovh/train?number=${trainNumber}&date=${parsedDate}`, {
            "credentials": "omit",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "fr,en-US;q=0.7,en;q=0.3",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            "referrer": "https://compo.luc.ovh/",
            "method": "GET",
            "mode": "cors"
        })
        const element = await response.json();
        console.log(element)
        if (typeof element.reponseRechercherListeCirculations.reponse.listeResultats.resultat[0].donnees.listeCirculations !== 'undefined') {
            // always the first circulation, if it's french
            let circulation = element.reponseRechercherListeCirculations.reponse.listeResultats.resultat[0].donnees.listeCirculations.circulation[0]
            if (circulation.operateur.codeOperateur !== "1187") {
                console.log("pas SNCF!")
            } else {
                console.log(circulation.mode.typeLibelle + " n°" + circulation.numero + " de " + circulation.origine.libelle + " à " + circulation.destination.libelle)

                let commercialName;
                let composition;
                try {
                    circulation.listeArretsDesserte.arret.forEach((element) => {
                        if(typeof(element.depart) !== "undefined") {
                            if (typeof (element.depart.composition) !== "undefined") {
                                throw element.depart.composition
                            }
                        }
                        if(typeof(element.arrivee) !== "undefined"){
                            if(typeof(element.arrivee.composition) !== "undefined") {
                                throw element.arrivee.composition
                            }
                        }
                    })
                } catch (e) {
                    composition = e;
                }

                if (typeof composition !== 'undefined') {
                    commercialName = [];
                    composition.element.forEach((compoElement, index) => {
                        console.log(compoElement.numeroAffectation)
                        if (typeof compoElement.numeroAffectation !== 'undefined') {
                            if(compoElement.libelleFamilleMateriel === "Automoteurs TGV") {
                                commercialName[index]=`${compoElement.libelleTypeMateriel} ${compoElement.numeroAffectation}`
                            } else {
                                // le reste
                                commercialName[index]=getTrainModel(compoElement.numeroAffectation)+` (${compoElement.numeroAffectation})`
                            }
                        }
                    })
                    let commercialNames = commercialName.join(", ");
                    console.log(commercialNames)
                    document.getElementsByClassName("hfs_tqTopLabel")[0].insertAdjacentHTML("afterend", `<p>${commercialNames}<p>`)
                }
            }}
    } else {
        console.log("Pas de train!")
    }
}


(async function() {
    'use strict';

    // https://sncf-maps.hafas.de/maps-ng/?language=fr_FR#!P|TQ!histId|6!histKey|H639595
    await new Promise(r => setTimeout(r, 3000));


    let text = `<a href="javascript:void(0)" id="findTrainModel" class="hfs_sideDrawerTrigger" style="top: 100px;"> <span class="hfs_btnText">Détecter le modèle <i class="haf_ic_options"></i></span> </a>`
    document.getElementById("HFS_PageSideDrawerTrigger").insertAdjacentHTML("afterend", text)

    document.getElementById("findTrainModel").addEventListener("click", function(){
        identifyTrain()
    });

})();
